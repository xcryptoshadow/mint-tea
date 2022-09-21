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
    string private _baseURIString = "https://testnet.tableland.network/query?";

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

    //map of tokenid to the numbers of trait_id 
    mapping(uint256 => uint256) private nb_of_attributes;

    /* Events */
    event NewNftMinted(
      address indexed from,
      uint256 timestamp,
      uint256 tokenId
    );

    event trait_type_updated(
        address indexed from, 
        uint256 timestamp, 
        uint256 _attributesTableId,
        string _trait_type, 
        uint256 tokenId,
        uint256 _trait_id
    );

    event value_updated(
        address indexed from, 
        uint256 timestamp, 
        uint256 _attributesTableId,
        string _value, 
        uint256 tokenId,
        uint256 _trait_id
    );

    event new_attribute_added(
      address indexed from,
      uint256 timestamp,
      uint256 tokenId,
      uint256 _trait_id
    );

    constructor( address registry) ERC721("Mint Tea", "mNFT") {
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
                " (tokenid int, name text, description text, image text, external_url text);"
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
                " (maintable_tokenid int, icon text, display_type text, trait_type text, value text, trait_id int);"
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
        string memory _external_url,
        string memory _icon,
        string memory _display_type,
        string memory _trait_type,
        string memory _value  
        ) public returns (uint256) {


        uint256 tokenId = _tokenIdCounter.current();
        //insert into maintable
        _tableland.runSQL(
            address(this),
            _metadataTableId,
            string.concat(
                "INSERT INTO ",
                mainTable,
                " (tokenid, name, description, image, external_url) VALUES ('",
                Strings.toString(tokenId),
                "', '",
                _name,
                "', '",
                _description,
                "', '",
                _image_url,
                "', '",
                _external_url,
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
                " (maintable_tokenid, icon, display_type, trait_type, value, trait_id) VALUES ('",
                Strings.toString(tokenId),
                "', '",
                _icon,
                "', '",
                _display_type,
                "', '",
                _trait_type,
                "', '",
                _value,
                "', '",
                "1",
                "')"
            )
        );
        _safeMint(to, tokenId);
        nb_of_attributes[tokenId] = 1;
        _tokenIdCounter.increment();
        emit NewNftMinted(msg.sender, block.timestamp, tokenId);
        return tokenId;
    }

     /*
     * add new attribute to an NFT
     */
    function add_new_attribute(
        uint256 _tokenId, 
        string memory _trait_type, 
        string memory _value
        ) public returns(uint256)
        {
        
        /* Check Ownership */
        require(this.ownerOf(_tokenId) == msg.sender, "Invalid owner");
        
        //this counter begins from 1 not 0 
        uint256 counter_trait = nb_of_attributes[_tokenId] ;
         //insert into attributesTable
        _tableland.runSQL(
            address(this),
            _attributesTableId,
            string.concat(
                "INSERT INTO ",
                attributesTable,
                " (maintable_tokenid, trait_type, value, trait_id) VALUES ('",
                Strings.toString(_tokenId),
                "', '",
                _trait_type,
                "', '",
                _value,
                "', '",
                Strings.toString(counter_trait + 1),
                "')"
            )
        );
        //NOTE: SafeMath is no longer needed starting with Solidity 0.8. 
        //The compiler now has built in overflow checking.
        nb_of_attributes[_tokenId] = counter_trait + 1;
        emit new_attribute_added(msg.sender, block.timestamp,  _tokenId, counter_trait + 1);
        return counter_trait + 1 ;
    }

     /*
     * update an attribute trait_type
     */
    function update_trait_type(
        uint256 tokenId,
        uint256 _trait_id,
        string memory _trait_type
    ) public {
        /* Check Ownership */
        require(this.ownerOf(tokenId) == msg.sender, "Invalid owner");
        require(nb_of_attributes[tokenId] >= _trait_id && _trait_id > 0, "trait_id not found ");
        /* Update the row in tableland */
        _tableland.runSQL(
            address(this),
            _attributesTableId,
            string.concat(
                "UPDATE ",
                attributesTable,
                " SET trait_type = '",
                _trait_type,
                "' WHERE maintable_tokenid = ",
                Strings.toString(tokenId),
                " AND trait_id = ",
                Strings.toString(_trait_id),
                ";"
            )
        );
        /* Emit Event */
       emit trait_type_updated(msg.sender, block.timestamp, _attributesTableId, _trait_type, tokenId, _trait_id);
    }

     /*
     * update an attribute value
     */
    function update_value(
        uint256 tokenId,
        uint256 _trait_id,
        string memory _value
    ) public {
        /* Check Ownership */
        require(this.ownerOf(tokenId) == msg.sender, "Invalid owner");
        require(nb_of_attributes[tokenId] >= _trait_id && _trait_id > 0, "trait_id not found ");
        /* Update the row in tableland */
        _tableland.runSQL(
            address(this),
            _attributesTableId,
            string.concat(
                "UPDATE ",
                attributesTable,
                " SET value = '",
                _value,
                "' WHERE maintable_tokenid = ",
                Strings.toString(tokenId),
                " AND trait_id = ",
                Strings.toString(_trait_id),
                ";"
            )
        );
        /* Emit Event */
       emit value_updated(msg.sender, block.timestamp, _attributesTableId, _value, tokenId, _trait_id);
    }

    /**
     * @dev View the contract’s main metadata table
     */
    function main_metadataURI() public view returns (string memory) {
        string memory base = _baseURI();
        return string.concat(
            base,
            "mode=list&s=", 
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
            "mode=list&s=", 
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
    function tokenURI(uint256 _tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        require(
            _exists(_tokenId),
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
                "SELECT%20json_object%28%27id%27%2Ctokenid%2C%27name%27%2Cname%2C%27description%27%2Cdescription%2C%27image%27%2Cimage%2C%27external_url%27%2Cexternal_url%2C%27attributes%27%2Cjson_group_array%28json_object%28%27icon%27%2Cicon%2C%27display_type%27%2Cdisplay_type%2C%27trait_type%27%2Ctrait_type%2C%27value%27%2Cvalue%29%29%29%20FROM%20",
                mainTable,
                "%20JOIN%20",
                attributesTable,
                "%20ON%20",
                mainTable,
                "%2Etokenid%20%3D%20",
                attributesTable,
                "%2Emaintable_tokenid%20WHERE%20tokenid%3D"
            )
        );
        // Return the baseURI with a query string, which looks up the token id in a row.
        // `&mode=list` formats into the proper JSON object expected by metadata standards.
        return
            string(
                abi.encodePacked(
                    baseURI,
                    "mode=list&s=",
                    query,
                    Strings.toString(_tokenId),
                    "%20group%20by%20tokenid"
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