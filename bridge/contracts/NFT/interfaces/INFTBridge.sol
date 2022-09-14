// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

interface INFTBridge {
    /* ========== STRUCT ========== */

    struct ChainInfo {
        bool isSupported;
        bytes nftBridgeAddress;
    }

    /// @param tokenAddress NFT collection's address on the current (secondary) chain
    struct BridgeNFTInfo {
        uint256 nativeChainId;
        address tokenAddress;
        bool exist;
    }

    /// @param chainId NFT collection's native chain ID
    /// @param tokenAddress NFT collection's address on the native chain
    struct NativeNFTInfo {
        uint256 chainId;
        bytes tokenAddress;
        uint256 tokenType;
        string name;
        string symbol;
    }

    /* ========== ERRORS ========== */

    error AdminBadRole();
    error CallProxyBadRole();
    error NativeSenderBadRole(bytes nativeSender, uint256 chainIdFrom);

    error WrongArgument();
    error ZeroAddress();
    error ChainToIsNotSupported();
    error AssetAlreadyExist();

    error DeBridgeTokenInfoNotFound();
    error MessageValueDoesNotMatchRequiredFee();
    error TokenMustImplementIERC721Metadata();

    error NotReceivedERC721();

    /* ========== EVENTS ========== */

    event AddedChainSupport(bytes bridgeAddress, uint256 chainId);
    event RemovedChainSupport(uint256 chainId);

    event NFTContractAdded(
        bytes32 debridgeId,
        address tokenAddress,
        bytes nativeAddress,
        uint256 nativeChainId,
        string name,
        string symbol,
        uint256 tokenType
    );

    /// @param tokenAddress NFT collection's address on the current chain
    event NFTSent(
        address tokenAddress,
        uint256 tokenId,
        bytes receiver,
        uint256 chainIdTo,
        uint256 nonce
    );

    /// @param tokenAddress NFT collection's address on the native chain
    event NFTClaimed(address tokenAddress, uint256 tokenId, address receiver);

    /// @param tokenAddress NFT collection's address on the current chain
    event NFTMinted(
        address tokenAddress,
        uint256 tokenId,
        address receiver,
        string tokenUri
    );
}
