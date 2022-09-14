// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts-upgradeable/token/ERC721/IERC721Upgradeable.sol";
import "./IERC4494.sol";

interface IDeNFT is IERC721Upgradeable, IERC4494 {
    function mint(
        address _to,
        uint256 _tokenId,
        string memory _tokenUri
    ) external;

    function burn(uint256 _tokenId) external;
}
