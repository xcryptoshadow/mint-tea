// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@tableland/evm/contracts/ITablelandTables.sol";

contract MTEA is ERC721, ERC721URIStorage, AccessControl {
    using Counters for Counters.Counter;
    // The testnet gateway URI plus query parameter
    string private _baseURIString = "https://testnet.tableland.network/query?s=";

    Counters.Counter private _tokenIdCounter;

    //Tableland 
    ITablelandTables private _tableland;
    string private _metadataTable;
    uint256 private _metadataTableId;
    string private _tablePrefix = "Mint_TEA";

    constructor( address registry) ERC721("MTEA", "MT") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);

        /* 
        * The Tableland address on your current chain
        */
        _tableland = ITablelandTables(registry);

        /*
        * Stores the unique ID for the newly created table.
        */
        _metadataTableId = _tableland.createTable(
            address(this),
            string.concat(
                "CREATE TABLE ",
                _tablePrefix,
                "_",
                Strings.toString(block.chainid),
                //TO DO : I need to change the columns
                " (id int, external_link text, x int, y int);"
            )
        );

        /*
        * Stores the full tablename for the new table. 
        * {prefix}_{chainid}_{tableid}
        */
        _metadataTable = string.concat(
            _tablePrefix,
			"_",
            Strings.toString(block.chainid),
            "_",
            Strings.toString(_metadataTableId)
        );
    }
    
     /* ========== PUBLIC METHODS ========== */
    function safeMint(address to, string memory uri) public returns (uint256) {
        uint256 tokenId = _tokenIdCounter.current();
       
        _tableland.runSQL(
            address(this),
            _metadataTableId,
            string.concat(
                "INSERT INTO ",
                _metadataTable,
                " (id, external_link, x, y) VALUES (",
                Strings.toString(tokenId),
                ", 'not.implemented.xyz', 0, 0)"
            )
        );
        _safeMint(to, tokenId);
        //To do : add a proper setTokenUri
        _setTokenURI(tokenId, uri);
        _tokenIdCounter.increment();
        return tokenId;
    }

    /**
     * @dev View the contract’s metadata table
     */
    function metadataURI() public view returns (string memory) {
        string memory base = _baseURI();
        return string.concat(
            base, 
            "SELECT%20*%20FROM%20",
            _metadataTable
        );
    }

    // Ensures the contract owner can easily update the project's baseURI
    function setBaseURI(string memory baseURI)external onlyRole(DEFAULT_ADMIN_ROLE) {
        _baseURIString = baseURI;
    }


    /* ========== INTERNAL METHODS ========== */
    
    function _baseURI() internal view override returns (string memory) {
        return _baseURIString;
    }

   

    // The following functions are overrides required by Solidity.

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        require(_exists(tokenId), "ERC721URIStorage: URI query for nonexistent token");
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}