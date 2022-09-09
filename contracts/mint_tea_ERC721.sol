// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@tableland/evm/contracts/ITablelandTables.sol";

contract MTEA is ERC721, AccessControl {
    using Counters for Counters.Counter;
    // The testnet gateway URI plus query parameter
    string private _baseURIString = "https://testnet.tableland.network/query?s=";

    Counters.Counter private _tokenIdCounter;

    //Tableland 
    ITablelandTables private _tableland;
    //string private _metadataTable;
    uint256 private _metadataTableId;
    uint256 private _attributesTableId;
    string private _tablePrefix = "Mint_TEA";

    /// The name of the main metadata table in Tableland
    // Schema: id int primary key, name text, description text, image text
    string public mainTable;
    /// The name of the attributes table in Tableland
    // Schema: main_id int not null, trait_type text not null, value text
    string public attributesTable;

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
                " (tokenid int, name text, description text, image text);"
            )
        );

        /*
        * Stores the full tablename for the new table. 
        * {prefix}_{chainid}_{tableid}
        */
        mainTable = string.concat(
            _tablePrefix,
			"_",
            Strings.toString(block.chainid),
            "_",
            Strings.toString(_metadataTableId)
        );

         /*
        * create a new attribute table. 
        */
        _attributesTableId = _tableland.createTable(
            address(this),
            string.concat(
                "CREATE TABLE ",
                _tablePrefix,
                "_",
                Strings.toString(block.chainid),
                " (maintable_tokenid int, trait_type text, value int);"
            )
        );
        attributesTable = string.concat(
            _tablePrefix,
			"_",
            Strings.toString(block.chainid),
            "_",
            Strings.toString(_attributesTableId)
        );
    }
    
     /* ========== PUBLIC METHODS ========== */
    function safeMint(
        address to, 
        string memory _name, 
        string memory _description,
        string memory _image_url,
        string memory _trait_type,
        uint256 _value  
        ) public returns (uint256) {


        uint256 tokenId = _tokenIdCounter.current();
        //insert into maintable
        _tableland.runSQL(
            address(this),
            _metadataTableId,
            string.concat(
                "INSERT INTO ",
                mainTable,
                " (tokenid, name, description, image) VALUES ('",
                Strings.toString(tokenId),
                "', '",
                _name,
                "', '",
                _description,
                "', '",
                _image_url,
                "')"
            )
        );
        //insert into attributesTable
        _tableland.runSQL(
            address(this),
            _attributesTableId,
            string.concat(
                "INSERT INTO ",
                attributesTable,
                " (maintable_tokenid, trait_type, value) VALUES ('",
                Strings.toString(tokenId),
                "', '",
                _trait_type,
                "', '",
                Strings.toString(_value),
                "')"
            )
        );
        _safeMint(to, tokenId);
        _tokenIdCounter.increment();
        return tokenId;
    }

    /**
     * @dev View the contract’s main metadata table
     */
    function main_metadataURI() public view returns (string memory) {
        string memory base = _baseURI();
        return string.concat(
            base, 
            "SELECT%20*%20FROM%20",
            mainTable
        );
    }

     /**
     * @dev View the contract’s attributes metadata table
     */
    function attributes_metadataURI() public view returns (string memory) {
        string memory base = _baseURI();
        return string.concat(
            base, 
            "SELECT%20*%20FROM%20",
            attributesTable
        );
    }

    // Ensures the contract owner can easily update the project's baseURI
    function setBaseURI(string memory baseURI)external onlyRole(DEFAULT_ADMIN_ROLE) {
        _baseURIString = baseURI;
    }

    /**
     * @dev tokenURI that points to the NFT’s metadata. This response must conform to the ERC721 format
     */
    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override(ERC721)
        returns (string memory)
    {
        require(
            _exists(tokenId),
            "ERC721Metadata: URI query for nonexistent token"
        );
        string memory baseURI = _baseURI();

        if (bytes(baseURI).length == 0) {
            return "";
        }

        /*
            A SQL query to JOIN two tables to compose the metadata accross a `main` and `attributes` table
        */
        string memory query = string(
            abi.encodePacked(
                "SELECT%20json_object%28%27id%27%2Cid%2C%27name%27%2Cname%2C%27description%27%2Cdescription%2C%27image%27%2Cimage%2C%27attributes%27%2Cjson_group_array%28json_object%28%27trait_type%27%2Ctrait_type%2C%27value%27%2Cvalue%29%29%29%20FROM%20",
                mainTable,
                "%20JOIN%20",
                attributesTable,
                "%20ON%20",
                mainTable,
                "%2Eid%20%3D%20",
                attributesTable,
                "%2Emain_id%20WHERE%20id%3D"
            )
        );
        // Return the baseURI with a query string, which looks up the token id in a row.
        // `&mode=list` formats into the proper JSON object expected by metadata standards.
        return
            string(
                abi.encodePacked(
                    baseURI,
                    "&mode=list",
                    query,
                    Strings.toString(tokenId),
                    "%20group%20by%20id"
                )
            );
    }


    /* ========== INTERNAL METHODS ========== */
    
    function _baseURI() internal view override returns (string memory) {
        return _baseURIString;
    }

   

    // The following functions are overrides required by Solidity.

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}