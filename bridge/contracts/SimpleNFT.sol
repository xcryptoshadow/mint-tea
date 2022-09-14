// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract SimpleNFT is ERC721URIStorage {
    constructor() ERC721("SimpleNFT", "SNFT") {}

    function mintNFT(
        address _to,
        uint256 _tokenId,
        string memory _tokenUri
    ) public {
        _safeMint(_to, _tokenId);
        _setTokenURI(_tokenId, _tokenUri);
    }
}
