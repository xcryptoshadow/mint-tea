// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "./ERC721WithPermitUpgradable.sol";
import "./interfaces/IDeNFT.sol";

contract DeNFT is ERC721WithPermitUpgradable, IDeNFT {
    using StringsUpgradeable for uint256;

    /* ========== STATE VARIABLES ========== */

    /// @notice See [ERC721URIStorageUpgradeable](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/extensions/ERC721URIStorage.sol)
    mapping(uint256 => string) private _tokenURIs;

    string private _baseURIValue;

    address minter;
    address deNFTBridge;

    /* ========== ERRORS ========== */

    error MinterBadRole();
    error ZeroAddress();
    error WrongLengthOfArguments();

    /* ========== MODIFIER ========== */

    modifier onlyMinter() {
        if (minter != msg.sender) revert MinterBadRole();
        _;
    }

    /* ========== EVENTS ========== */

    event MinterTransferred(
        address indexed previousMinter,
        address indexed newMinter
    );

    /* ========== CONSTRUCTOR  ========== */

    function initialize(
        string memory name_,
        string memory symbol_,
        string memory baseURI_,
        address minter_,
        address deNFTBridge_
    ) public initializer {
        if (deNFTBridge_ == address(0) || minter_ == address(0))
            revert ZeroAddress();
        __DeNFT_init(name_, symbol_, baseURI_, minter_, deNFTBridge_);
    }

    function __DeNFT_init(
        string memory name_,
        string memory symbol_,
        string memory baseURI_,
        address minter_,
        address deNFTBridge_
    ) internal initializer {
        __ERC721WithPermitUpgradable_init(name_, symbol_);
        __ERC721WithPermitUpgradable_init_unchained(
            baseURI_,
            minter_,
            deNFTBridge_
        );
    }

    function __ERC721WithPermitUpgradable_init_unchained(
        string memory baseURI_,
        address minter_,
        address deNFTBridge_
    ) internal initializer {
        minter = minter_;
        _baseURIValue = baseURI_;
        deNFTBridge = deNFTBridge_;
    }

    /* ========== PUBLIC METHODS  ========== */

    /// @dev Mints a new token and transfers it to `to` address
    /// @param _to new token's owner
    /// @param _tokenId new token's id
    /// @param _tokenUri new token's URI
    function mint(
        address _to,
        uint256 _tokenId,
        string memory _tokenUri
    ) external override onlyMinter {
        _tokenURIs[_tokenId] = _tokenUri;
        _safeMint(_to, _tokenId);
    }

    /// @dev Mints multiple tokens sequentially in a single call, taking each token's ID and URI
    ///      from the given arrays correspondingly, and transfers each token to the `msg.sender`
    function mintMany(uint256[] memory _tokenIds, string[] memory _tokenUris)
        external
        onlyMinter
    {
        mintMany(msg.sender, _tokenIds, _tokenUris);
    }

    /// @dev Mints multiple tokens sequentially in a single call, taking each object's ID and URI
    ///      from the given arrays correspondingly, and transfers each token to the given `_to` recipient
    function mintMany(
        address _to,
        uint256[] memory _tokenIds,
        string[] memory _tokenUris
    ) public onlyMinter {
        if (_tokenIds.length != _tokenUris.length)
            revert WrongLengthOfArguments();

        for (uint256 i = 0; i < _tokenIds.length; i++) {
            uint256 tokenId = _tokenIds[i];
            _tokenURIs[tokenId] = _tokenUris[i];
            _safeMint(_to, tokenId);
        }
    }

    /// @dev Mints multiple tokens sequentially in a single call, taking each object's owner, ID and URI
    ///      from the given arrays correspondingly, and transfers each token to the corresponding owner's address
    function mintMany(
        address[] memory _to,
        uint256[] memory _tokenIds,
        string[] memory _tokenUris
    ) external onlyMinter {
        if (
            _tokenIds.length != _to.length ||
            _tokenIds.length != _tokenUris.length
        ) revert WrongLengthOfArguments();

        for (uint256 i = 0; i < _tokenIds.length; i++) {
            uint256 tokenId = _tokenIds[i];
            _tokenURIs[tokenId] = _tokenUris[i];
            _safeMint(_to[i], tokenId);
        }
    }

    function transferMinter(address nextMinter) external onlyMinter {
        emit MinterTransferred(minter, nextMinter);
        minter = nextMinter;
    }

    /// @dev Gives away minter role from the current minter address to the NFTBridge contract address
    ///      to make this NFT collection's objects natively transferrable to
    ///      and from chains supported by deBridge.
    function giveawayToDeNFTBridge() external onlyMinter {
        emit MinterTransferred(minter, deNFTBridge);
        minter = deNFTBridge;
    }

    /// @dev Destroys a token identified by the `_tokenId`. See `ERC721Upgradeable._burn()`
    /// @notice Portions of code have been ported from
    ///         [ERC721BurnableUpgradeable](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/extensions/ERC721Burnable.sol)
    ///         and [ERC721URIStorageUpgradeable](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/extensions/ERC721URIStorage.sol)
    function burn(uint256 _tokenId) public virtual override onlyMinter {
        // code ported from @openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721BurnableUpgradeable.sol
        require(
            _isApprovedOrOwner(_msgSender(), _tokenId),
            "ERC721Burnable: caller is not owner nor approved"
        );

        _burn(_tokenId);

        // code ported from @openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol
        if (bytes(_tokenURIs[_tokenId]).length != 0) {
            delete _tokenURIs[_tokenId];
        }
    }

    /* ========== VIEWS  ========== */

    function _baseURI() internal view override returns (string memory) {
        return _baseURIValue;
    }

    /// @inheritdoc IERC721MetadataUpgradeable
    /// @notice Implementation has been ported from OpenZeppelin's ERC721URIStorageUpgradeable
    ///         (see https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/extensions/ERC721URIStorage.sol)
    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        require(
            _exists(tokenId),
            "ERC721URIStorage: URI query for nonexistent token"
        );

        string memory _tokenURI = _tokenURIs[tokenId];
        string memory base = _baseURI();

        // If there is no base URI, return the token URI.
        if (bytes(base).length == 0) {
            return _tokenURI;
        }
        // If both are set, concatenate the baseURI and tokenURI (via abi.encodePacked).
        if (bytes(_tokenURI).length > 0) {
            return string(abi.encodePacked(base, _tokenURI));
        }

        return super.tokenURI(tokenId);
    }
}
