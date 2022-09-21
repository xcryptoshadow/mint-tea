// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts-upgradeable/token/ERC721/IERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/IERC721MetadataUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/IERC721ReceiverUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol";

import "@debridge-finance/debridge-protocol-evm-interfaces/contracts/interfaces/ICallProxy.sol";
import "@debridge-finance/debridge-protocol-evm-interfaces/contracts/interfaces/IDeBridgeGate.sol";
import "@debridge-finance/debridge-protocol-evm-interfaces/contracts/interfaces/IDeBridgeGateExtended.sol";
import "@debridge-finance/debridge-protocol-evm-interfaces/contracts/libraries/Flags.sol";

import "./interfaces/IDeNFT.sol";
import "./interfaces/INFTBridge.sol";
import "./DeBridgeNFTDeployer.sol";

contract NFTBridge is
    Initializable,
    AccessControlUpgradeable,
    PausableUpgradeable,
    ReentrancyGuardUpgradeable,
    IERC721ReceiverUpgradeable,
    INFTBridge
{
    using AddressUpgradeable for address payable;
    using AddressUpgradeable for address;

    uint256 public constant TOKEN_BURNABLE_TYPE = 1;

    /* ========== STATE VARIABLES ========== */

    /// @dev Stores the wrapper collections' details on the current chain.
    ///      These collections are identifiable by debridgeId
    /// @notice See getDebridgeId() for details
    mapping(bytes32 => BridgeNFTInfo) public getBridgeNFTInfo;

    /// @dev Stores the original collections' metadata
    mapping(address => NativeNFTInfo) public getNativeInfo;

    /// @dev Stores the addresses NFTBridge has been deployed at on the supported target chains (relative to the current chain).
    mapping(uint256 => ChainInfo) public getChainInfo;

    /// @dev DeBridgeGate's address on the current chain
    IDeBridgeGateExtended public deBridgeGate;

    /// @dev DeBridgeNFTDeployer's address on the current chain
    DeBridgeNFTDeployer public deBridgeNFTDeployer;

    /// @dev Outgoing submissions count
    uint256 public nonce;

    /// @dev Cross chain-compatible original collections created by calling createNFT() on the current chain for the burn/mint approach
    mapping(address => uint256) public createdTokens;

    /* ========== MODIFIERS ========== */

    modifier onlyAdmin() {
        if (!hasRole(DEFAULT_ADMIN_ROLE, msg.sender)) revert AdminBadRole();
        _;
    }

    /// @dev This modifier restricts calls so they can be made only by deBridge CallProxy
    ///         and ensures the origin transaction submitter is known NFTBridge contract on the origin chain
    modifier onlyCrossBridgeAddress() {
        ICallProxy callProxy = ICallProxy(deBridgeGate.callProxy());
        if (address(callProxy) != msg.sender) {
            revert CallProxyBadRole();
        }

        bytes memory nativeSender = callProxy.submissionNativeSender();
        uint256 chainIdFrom = callProxy.submissionChainIdFrom();

        if (
            keccak256(getChainInfo[chainIdFrom].nftBridgeAddress) !=
            keccak256(nativeSender)
        ) {
            revert NativeSenderBadRole(nativeSender, chainIdFrom);
        }

        _;
    }

    /* ========== CONSTRUCTOR  ========== */

    function initialize(IDeBridgeGateExtended _deBridgeGate)
        public
        initializer
    {
        deBridgeGate = _deBridgeGate;
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    /* ========== EXTERNAL METHODS ========== */

    /// @dev Constructs and initiates a cross chain transfer of an object.
    ///         It obtains an object from the sender and constructs a message to operate the object on the target chain
    /// @param _nftCollectionAddress NFT collection's address in the current chain
    /// @param _tokenId ID of an object from the given NFT collection to transfer
    // @param _permitDeadline ERC-4494-compliant permit deadline
    // @param _permitSignature ERC-4494-compliant permit signature to obtain the given object
    /// @param _chainIdTo Target chain id to transfer the given object to
    /// @param _receiverAddress Address on the target chain to transfer the bridged object to
    /// @param _executionFee  Fee to be paid to the claim transaction executor on target chain.
    /// @param _referralCode Referral code to be assigned to this cross chain transaction on the deBridge protocol
    function send(
        address _nftCollectionAddress,
        uint256 _tokenId,
        // uint256 _permitDeadline,
        // bytes memory _permitSignature,
        uint256 _chainIdTo,
        address _receiverAddress,
        uint256 _executionFee,
        uint32 _referralCode
    ) external payable nonReentrant whenNotPaused {
        // NFTBridge is not yet deployed on the target chain or its address is not yet registered here
        // -- no receiver on the target chain
        if (!getChainInfo[_chainIdTo].isSupported) {
            revert ChainToIsNotSupported();
        }

        // run permit first
        // if (_permitSignature.length > 0) {
        //     IERC4494(_nftCollectionAddress).permit(
        //         address(this),
        //         _tokenId,
        //         _permitDeadline,
        //         _permitSignature
        //     );
        // }

        bool isNativeToken;
        bytes memory targetData;
        {
            //
            // find the residence chain for the given nft collection
            //

            NativeNFTInfo storage nativeTokenInfo = getNativeInfo[
                _nftCollectionAddress
            ];

            // is the current chain a native chain for the given collection?
            isNativeToken = nativeTokenInfo.chainId == 0
                ? true // token not in mapping
                : nativeTokenInfo.chainId == getChainId(); // or token native chain id the same

            // take tokenURI before the object being burned!
            string memory tokenURI = IERC721MetadataUpgradeable(
                _nftCollectionAddress
            ).tokenURI(_tokenId);

            //
            // how to deal with the object?
            //

            // are we on the native chain?
            if (isNativeToken) {
                // burn/mint-complaint collection - burn the original object
                if (
                    createdTokens[_nftCollectionAddress] == TOKEN_BURNABLE_TYPE
                ) {
                    revert("Don't use TOKEN_BURNABLE_TYPE!");
                    // _checkAddAsset(_nftCollectionAddress);
                    // IDeNFT(_nftCollectionAddress).burn(_tokenId);
                }
                // hold the object on this contract address
                else {
                    _receiveNativeNFT(_nftCollectionAddress, _tokenId);
                }
            }
            // we are on the secondary chain
            else {
                IDeNFT(_nftCollectionAddress).burn(_tokenId);
            }

            //
            // how to operate with the object on the target chain? Encode the function call
            // to be executed on the target chain
            //

            // claim() is possible on the native chain only AND only for non-burnable collections
            if (
                (nativeTokenInfo.chainId == _chainIdTo) && // we are sending to the native chain?..
                (nativeTokenInfo.tokenType != TOKEN_BURNABLE_TYPE) // ... and the collection is not burn/mint-complaint?
            ) {
                targetData = _encodeClaim(
                    _decodeAddressFromBytes(nativeTokenInfo.tokenAddress), // _decodeAddressFromBytes support only emv tokens now
                    _tokenId,
                    _receiverAddress
                );
            }
            // mint() is for secondary chains and for native chain if the collection is burn/mint-compliant DeNFT contracts
            else {
                targetData = _encodeMint(
                    _nftCollectionAddress,
                    _tokenId,
                    _receiverAddress,
                    tokenURI,
                    nativeTokenInfo.tokenType
                );
            }
        }

        //
        // send message to deBridge gate
        //
        {
            deBridgeGate.send{value: msg.value}(
                address(0), // we transfer native coin as a means of payment
                msg.value, // _amount of native coin (includes transport fees + optional execution fee amount)
                _chainIdTo, // _chainIdTo
                abi.encodePacked(getChainInfo[_chainIdTo].nftBridgeAddress), // _receiverAddress
                "", // _permit
                false, // _useAssetFee
                _referralCode, // _referralCode
                _encodeAutoParamsTo(targetData, _executionFee) // _autoParams
            );
        }

        emit NFTSent(
            _nftCollectionAddress,
            _tokenId,
            abi.encodePacked(_receiverAddress),
            _chainIdTo,
            nonce
        );
        nonce++;
    }

    /// @dev Releases the given object (being held by the current contract as a collateral) on the current native chain
    ///         and transfers it to the receiver.
    ///         This method is restricted by onlyCrossBridgeAddress modifier: it can be called only by deBridge CallProxy
    ///         and the origin transaction submitter must be an NFTBridge contract on the origin chain
    /// @param _nftCollectionAddress NFT collection's address on the current chain
    /// @param _tokenId ID of an object from the given NFT collection to receive and release
    /// @param _receiverAddress Address on target chain who will receive the object.
    function claim(
        address _nftCollectionAddress,
        uint256 _tokenId,
        address _receiverAddress
    ) external onlyCrossBridgeAddress whenNotPaused {
        _safeTransferFrom(
            _nftCollectionAddress,
            address(this),
            _receiverAddress,
            _tokenId
        );

        emit NFTClaimed(_nftCollectionAddress, _tokenId, _receiverAddress);
    }

    /// @dev Mints the original object (if called on the native chain for burn/mint-compatible DeNFT collection)
    ///         or a wrapped version of an object (if called on the secondary chain).
    ///         This method is restricted by onlyCrossBridgeAddress modifier: it can be called only by deBridge CallProxy
    ///         and the origin transaction submitter must be an NFTBridge contract on the origin chain
    /// @param _nftCollectionAddress NFT collection's address on the current chain
    /// @param _nativeChainId Id of a native chain for the given NFT collection
    /// @param _tokenId ID of an object from the given NFT collection to receive and mint
    /// @param _receiverAddress Address on target chain who will receive the object.
    /// @param _nativeName Payload: the original NFT collection's name
    /// @param _nativeSymbol Payload: the original NFT collections' symbol
    /// @param _tokenUri Payload: the canonical URI of an object from the given NFT collection to mint
    /// @param _nftCollectionType Payload: the type of the collection indicating its approach compatibility
    function mint(
        bytes memory _nftCollectionAddress,
        uint256 _nativeChainId,
        uint256 _tokenId,
        address _receiverAddress,
        string memory _nativeName,
        string memory _nativeSymbol,
        string memory _tokenUri,
        uint256 _nftCollectionType
    ) external onlyCrossBridgeAddress whenNotPaused {
        bytes32 debridgeId = getDebridgeId(
            _nativeChainId,
            _nftCollectionAddress
        );

        if (!getBridgeNFTInfo[debridgeId].exist) {
            address currentNFTAddress = deBridgeNFTDeployer.deployAsset(
                debridgeId,
                _nativeName,
                _nativeSymbol
            );
            _addAsset(
                debridgeId,
                currentNFTAddress,
                _nftCollectionAddress,
                _nativeChainId,
                _nativeName,
                _nativeSymbol,
                _nftCollectionType
            );
        }

        address tokenAddress = getBridgeNFTInfo[debridgeId].tokenAddress;
        IDeNFT(tokenAddress).mint(_receiverAddress, _tokenId, _tokenUri);

        emit NFTMinted(tokenAddress, _tokenId, _receiverAddress, _tokenUri);
    }

    /// @dev Deploys a new DeNFT collection with the minter role granted to the given address
    ///         and marks it internally as burn/mint-compatible collection
    /// @param _minterAddress the address newly created DeNFT collection's minter role must be granted to
    /// @param _name The name for the new DeNFT collection
    /// @param _symbol The symbol for the new DeNFT collection
    /// @param _baseUri The base URI for the new DeNFT collection
    function createNFT(
        address _minterAddress,
        string memory _name,
        string memory _symbol,
        string memory _baseUri
    ) external whenNotPaused {
        address currentNFTAddress = deBridgeNFTDeployer.createNFT(
            _minterAddress,
            _name,
            _symbol,
            _baseUri
        );
        // IOU type
        createdTokens[currentNFTAddress] = 0; //TOKEN_BURNABLE_TYPE;
    }

    /// @inheritdoc IERC721ReceiverUpgradeable
    function onERC721Received(
        address, /*operator*/
        address, /*from*/
        uint256, /*tokenId*/
        bytes calldata /*data*/
    ) external pure override returns (bytes4) {
        return IERC721ReceiverUpgradeable.onERC721Received.selector;
    }

    // ============ ADMIN METHODS ============

    function setNFTDeployer(DeBridgeNFTDeployer _deBridgeNFTDeployer)
        external
        onlyAdmin
    {
        deBridgeNFTDeployer = _deBridgeNFTDeployer;
    }

    function setDeBridgeGate(IDeBridgeGateExtended _deBridgeGate)
        external
        onlyAdmin
    {
        deBridgeGate = _deBridgeGate;
    }

    /// @dev Sets the address of the NFTBridge contract on the secondary chain, effectively enabling object transfers to it
    /// @param _NFTBridgeAddress The address of the NFTBridge contract deployed on the secondary chain
    /// @param _chainId The id of the secondary chain
    function addChainSupport(bytes calldata _NFTBridgeAddress, uint256 _chainId)
        external
        onlyAdmin
    {
        // TODO: for emulated environment...
        // if (_chainId == 0 || _chainId == getChainId()) {
        //     revert WrongArgument();
        // }
        getChainInfo[_chainId].nftBridgeAddress = _NFTBridgeAddress;
        getChainInfo[_chainId].isSupported = true;

        emit AddedChainSupport(_NFTBridgeAddress, _chainId);
    }

    function removeChainSupport(uint256 _chainId) external onlyAdmin {
        delete getChainInfo[_chainId];
        emit RemovedChainSupport(_chainId);
    }

    function pause() external onlyAdmin {
        _pause();
    }

    function unpause() external onlyAdmin {
        _unpause();
    }

    // ============ Private methods ============

    /// @dev Deploys a new DeNFT instance as a wrapper collection to reflect the given original collection from another chain
    function _addAsset(
        bytes32 _debridgeId,
        address _nftCollectionAddress,
        bytes memory _nativeAddress,
        uint256 _nativeChainId,
        string memory _nativeName,
        string memory _nativeSymbol,
        uint256 _nftCollectionType
    ) internal {
        BridgeNFTInfo storage bridgeInfo = getBridgeNFTInfo[_debridgeId];

        if (bridgeInfo.exist) revert AssetAlreadyExist();
        if (_nftCollectionAddress == address(0)) revert ZeroAddress();

        bridgeInfo.exist = true;
        bridgeInfo.tokenAddress = _nftCollectionAddress;
        bridgeInfo.nativeChainId = _nativeChainId;

        NativeNFTInfo storage nativeTokenInfo = getNativeInfo[
            _nftCollectionAddress
        ];
        nativeTokenInfo.chainId = _nativeChainId;
        nativeTokenInfo.tokenAddress = _nativeAddress;
        nativeTokenInfo.name = _nativeName;
        nativeTokenInfo.symbol = _nativeSymbol;
        nativeTokenInfo.tokenType = _nftCollectionType;

        emit NFTContractAdded(
            _debridgeId,
            _nftCollectionAddress,
            abi.encodePacked(_nativeAddress),
            _nativeChainId,
            _nativeName,
            _nativeSymbol,
            _nftCollectionType
        );
    }

    function _decodeAddressFromBytes(bytes memory _bytes)
        internal
        pure
        returns (address addr)
    {
        // See https://ethereum.stackexchange.com/a/50528
        assembly {
            addr := mload(add(_bytes, 20))
        }
    }

    function _receiveNativeNFT(address _tokenAddress, uint256 _tokenId)
        internal
    {
        _checkAddAsset(_tokenAddress);
        _safeTransferFrom(_tokenAddress, msg.sender, address(this), _tokenId);
    }

    function _checkAddAsset(address _tokenAddress)
        internal
        returns (bytes32 debridgeId)
    {
        debridgeId = getDebridgeId(getChainId(), _tokenAddress);
        if (!getBridgeNFTInfo[debridgeId].exist) {
            _addAsset(
                debridgeId,
                _tokenAddress,
                abi.encodePacked(_tokenAddress),
                getChainId(),
                IERC721MetadataUpgradeable(_tokenAddress).name(),
                IERC721MetadataUpgradeable(_tokenAddress).symbol(),
                createdTokens[_tokenAddress]
            );
        }
    }

    /// @dev Safely transfers the given object and performs additional ownership check
    function _safeTransferFrom(
        address _tokenAddress,
        address _from,
        address _to,
        uint256 _tokenId
    ) internal {
        IERC721Upgradeable(_tokenAddress).safeTransferFrom(
            _from,
            _to,
            _tokenId
        );

        // check that this contract address actually received the object
        if (IERC721Upgradeable(_tokenAddress).ownerOf(_tokenId) != _to)
            revert NotReceivedERC721();
    }

    /// @dev encodes a call to `NFTBridge.claim()`
    function _encodeClaim(
        address _nftCollectionAddress,
        uint256 _tokenId,
        address _receiverAddress
    ) internal pure returns (bytes memory) {
        return
            abi.encodeWithSelector(
                this.claim.selector,
                _nftCollectionAddress,
                _tokenId,
                _receiverAddress
            );
    }

    /// @dev encodes a call to `NFTBridge.mint()`
    function _encodeMint(
        address _nftCollectionAddress,
        uint256 _tokenId,
        address _receiverAddress,
        string memory _tokenURI,
        uint256 _nftCollectionType
    ) internal view returns (bytes memory) {
        NativeNFTInfo memory nativeTokenInfo = getNativeInfo[
            _nftCollectionAddress
        ];

        return
            abi.encodeWithSelector(
                this.mint.selector,
                nativeTokenInfo.tokenAddress, //_nftCollectionAddress
                nativeTokenInfo.chainId, //_nativeChainId
                _tokenId,
                _receiverAddress,
                nativeTokenInfo.name, //_nativeName
                nativeTokenInfo.symbol, //_nativeSymbol
                _tokenURI,
                _nftCollectionType
            );
    }

    /// @dev encodes a `IDeBridgeGate.SubmissionAutoParamsTo` struct required for deBridge gate
    function _encodeAutoParamsTo(bytes memory _data, uint256 _executionFee)
        internal
        view
        returns (bytes memory)
    {
        IDeBridgeGate.SubmissionAutoParamsTo memory autoParams;
        autoParams.flags = Flags.setFlag(
            autoParams.flags,
            Flags.REVERT_IF_EXTERNAL_FAIL,
            true
        );
        autoParams.flags = Flags.setFlag(
            autoParams.flags,
            Flags.PROXY_WITH_SENDER,
            true
        );

        // fallbackAddress can be used to transfer NFT with deAssets
        autoParams.fallbackAddress = abi.encodePacked(msg.sender);
        autoParams.data = _data;
        autoParams.executionFee = _executionFee;
        return abi.encode(autoParams);
    }

    // ============ VIEWS ============

    /// @dev Cross-chain identifier of a native NFT collection
    /// @param _nativeChainId Native chain ID for the NFT collection
    /// @param _nftCollectionAddress Original NFT collection's address on the native chain
    function getDebridgeId(
        uint256 _nativeChainId,
        address _nftCollectionAddress
    ) public pure returns (bytes32) {
        return
            keccak256(abi.encodePacked(_nativeChainId, _nftCollectionAddress));
    }

    /// @dev Cross-chain identifier of a native NFT collection
    /// @param _nativeChainId Native chain ID for the NFT collection
    /// @param _nftCollectionAddress Original NFT collection's address on the native chain
    function getDebridgeId(
        uint256 _nativeChainId,
        bytes memory _nftCollectionAddress
    ) public pure returns (bytes32) {
        return
            keccak256(abi.encodePacked(_nativeChainId, _nftCollectionAddress));
    }

    /// @dev Gets the current chain id
    function getChainId() public view virtual returns (uint256 cid) {
        assembly {
            cid := chainid()
        }
    }

    // ============ Version Control ============
    function version() external pure returns (uint256) {
        return 100; // 1.0.0
    }
}
