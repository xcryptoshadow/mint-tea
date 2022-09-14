// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/proxy/beacon/BeaconProxy.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";

import "./DeNFT.sol";

contract DeBridgeNFTDeployer is Initializable, AccessControlUpgradeable {
    /* ========== STATE VARIABLES ========== */

    /// @dev Beacon contract address for the DeNFT instances on the current chain
    address public beacon;

    /// @dev DeBridgeGate contract's address on the current chain
    address public nftBridgeAddress;

    /// @dev Stores DeNFT contracts' addresses deployed by this contract
    ///         and identified by the corresponding debridgeId's
    mapping(bytes32 => address) public deployedAssetAddresses;

    /// @dev Tracks the number of deNFT contracts deployed
    uint256 nonce;

    /* ========== ERRORS ========== */

    error WrongArgument();
    error DeployedAlready();

    error AdminBadRole();
    error NFTBridgeBadRole();
    error DuplicateDebridgeId();

    error ZeroAddress();

    /* ========== MODIFIERS ========== */

    modifier onlyAdmin() {
        if (!hasRole(DEFAULT_ADMIN_ROLE, msg.sender)) revert AdminBadRole();
        _;
    }

    /// @dev Only NFTBridge contract can call the method
    modifier onlyNFTBridge() {
        if (msg.sender != nftBridgeAddress) revert NFTBridgeBadRole();
        _;
    }

    /* ========== EVENTS ========== */

    event NFTDeployed(
        address asset,
        string name,
        string symbol,
        string baseUri,
        uint256 nonce
    );

    /* ========== CONSTRUCTOR  ========== */

    function initialize(address _beacon, address _nftBridgeAddress)
        public
        initializer
    {
        if (_beacon == address(0) || _nftBridgeAddress == address(0))
            revert ZeroAddress();

        beacon = _beacon;
        nftBridgeAddress = _nftBridgeAddress;
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    /* ========== METHODS  ========== */

    /// @dev Deploys a wrapper collection identified by deBridgeId
    function deployAsset(
        bytes32 _debridgeId,
        string memory _name,
        string memory _symbol
    ) external onlyNFTBridge returns (address deNFTContractAddress) {
        if (deployedAssetAddresses[_debridgeId] != address(0))
            revert DeployedAlready();

        deNFTContractAddress = _deployDeNFTContract(
            nftBridgeAddress,
            _name,
            _symbol,
            "",
            _debridgeId
        );

        deployedAssetAddresses[_debridgeId] = deNFTContractAddress;
    }

    /// @dev Deploys an original collection based on DeNFT contract code
    function createNFT(
        address _minter,
        string memory _name,
        string memory _symbol,
        string memory _baseUri
    ) external onlyNFTBridge returns (address deNFTContractAddress) {
        deNFTContractAddress = _deployDeNFTContract(
            _minter,
            _name,
            _symbol,
            _baseUri,
            keccak256(abi.encodePacked(nonce))
        );
        bytes32 debridgeId = getDebridgeId(getChainId(), deNFTContractAddress);
        if (deployedAssetAddresses[debridgeId] != address(0))
            revert DuplicateDebridgeId();
        deployedAssetAddresses[debridgeId] = deNFTContractAddress;
    }

    /* ========== ADMIN ========== */

    function setNftBridgeAddress(address _nftBridgeAddress) external onlyAdmin {
        if (_nftBridgeAddress == address(0)) revert WrongArgument();
        nftBridgeAddress = _nftBridgeAddress;
    }

    // ============ Private methods ============

    function _deployDeNFTContract(
        address minter,
        string memory _name,
        string memory _symbol,
        string memory _baseUri,
        bytes32 salt
    ) internal returns (address deNFTContractAddress) {
        // Initialize args
        bytes memory initializationArgs = abi.encodeWithSelector(
            DeNFT.initialize.selector,
            _name,
            _symbol,
            _baseUri,
            minter,
            nftBridgeAddress
        );

        // initialize Proxy
        bytes memory constructorArgs = abi.encode(beacon, initializationArgs);

        // deployment code
        bytes memory bytecode = abi.encodePacked(
            type(BeaconProxy).creationCode,
            constructorArgs
        );

        assembly {
            // debridgeId is a salt
            deNFTContractAddress := create2(
                0,
                add(bytecode, 0x20),
                mload(bytecode),
                salt
            )

            if iszero(extcodesize(deNFTContractAddress)) {
                revert(0, 0)
            }
        }

        emit NFTDeployed(deNFTContractAddress, _name, _symbol, _baseUri, nonce);
        nonce++;
    }

    // ============ VIEWS ============

    /// @dev Cross-chain identifier of a native NFT collection
    function getDebridgeId(uint256 _chainId, address _nftCollectionAddress)
        public
        pure
        returns (bytes32)
    {
        return keccak256(abi.encodePacked(_chainId, _nftCollectionAddress));
    }

    /// @dev Gets the current chain id
    function getChainId() public view virtual returns (uint256 cid) {
        assembly {
            cid := chainid()
        }
    }

    // ============ Version Control ============

    /// @dev Get this contract's version
    function version() external pure returns (uint256) {
        return 100; // 1.0.0
    }
}
