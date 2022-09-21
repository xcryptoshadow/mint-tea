# deNFT, a bridge for NFT collections over the deBridge protocol

deNFT is a set of smart contracts that aims to provide the ability to send arbitrary `ERC-721`-compliant NFTs across EVM blockchains leveraging the [deBridge low-level cross chain messaging protocol](https://debridge.finance). This set is responsible for operating NFT objects and constructing messages tailored to operate these NFTs across secondary chains using specially constructed messages, while the actual transfer of such messages is handled by the deBridge gate.

Designing deNFT we had an intention to implement two different approaches under one roof:
1. the IOU (I-owe-you, lock/wrap) approach: an object is being locked by the bridge on the origin chain, and the wrapper object is being minted on the destination chain;
2. the burn/mint approach: the object is being burned on the origin chain and the same object (with the same set of parameters) gets minted on the destination chain.

The following contracts are used in the implementation:
- `NFTBridge`, a contract which is responsible for:
  - when sending an object to the bridge: taking it from the sender, holding in on it’s own address or burning it, constructing operational message for the target chain;
  - when receiving an object from the bridge: releasing an object (if on native chain) or minting a new one or creating a wrapped version of the original one, then sending it to the destination address;
- `DeNFT`, a factory contract which implements generic `ERC-721`-compliant NFT collection, used to create wrapper collections for wrapped objects as well as original collections for cross-chain compatible objects;
- `DeBridgeNFTDeployer`, a helper contract for deploying `DeNFT` instances;
- `ERC721WithPermitUpgradable`, an abstract extension for OpenZeppelin’s `ERC721Upgradeable` contract with `EIP-4494`-compliant permits implementation (based on the reference implementation of the `EIP-4494`).

## Definitions

**Native chain** - a chain where arbitrary NFT collection has been originally deployed. The residence chain for the original NFT collection.

**Secondary chain** - a non-native chain for arbitrary NFT collection.

**Origin chain** - a chain the object is being transferred from. It may be transferred from native or from secondary chain to any other supported chain.

**Destination chain** - a chain the object is being transferred to.

**Original collection** - an arbitrary `ERC-721`-compliant NFT collection which resides on the native chain. The original collection is identified on the secondary chain by the `debridgeId`.

**`DebridgeId`** - a cross-chain identifier of the original collection. It is constructed by combining the native chain’s ID + the original collection’s address on the native chain

**Wrapper collection** - an instance of DeNFT contract deployed by NFTBridge on the secondary chain to reflect a specific original collection using `DebridgeId`.

## IOU approach
The first approach is a classic “lock/wrap” technique: an object (an NFT in our case) is held on its native chain by the periphery contract, and a synthetic wrapper object (“wrapped NFT”) is being minted on the target chain upon transfer. This approach is applicable for any `ERC-721`-compliant NFT collection except those that were explicitly deployed by calling `NFTBridge.createNFT()` method with the intention to make them cross chain compatible (burn/mint approach compliant).

Worth mentioning that possible mutations of a collection on the native chain are not reflected on wrapped versions of the objects on secondary chains. However, anyone can fork the `NFTBridge` and the `DeNFT` smart contracts and implement the update mechanism by themselves.

### Sending an object
To send an object, `NFTBridge.send()` is being called. The `NFTBridge` executes an `EIP-4494`-compliant signature (if given), then checks the residence of the NFT collection:
- if the transfer is initiated from the native chain, then:
  - the object is being transferred to `NFTBridge`’s own address for holding;
  - a call to `NFTBridge.mint()` is encoded into a cross-chain message to be passed through deBridge infrastructure with the intention to be executed on the target chain upon receiving.
- Otherwise:
  - the object is obviously a wrapped version of the object inside a wrapper collection controlled the `NFTBridge` contract, so it should be burned;
  - If the target chain is the native chain:
    - a call to `NFTBridge.claim()` is encoded
    - Otherwise, a call to `NFTBridge.mint()` is encoded into a cross-chain message to be passed through deBridge infrastructure with the intention to be executed on the target chain upon receiving.

It is implied that the same instance of `NFTBridge` is already deployed on the target chain, and the address of the `NFTBridge` instance on the target chain is stored in the `NFTBridge`’s internal structure on the origin chain.

### Receiving an object

To receive an object on the target chain, the same `NFTBridge` must be deployed, and its address must be explicitly set in the instance of `NFTBridge` on every origin chain. `NFTBridge` provides two different methods for receiving an object: `claim()` and `mint()`, and which one must be called on the target chain is determined by the `send()` method during its execution on the origin chain.

The `claim()` method is intended to be called on the native chain: since the object that was sent from the native chain is being held on the `NFTBridge`’s address, then receiving an object means simply releasing this object and transferring it further to the receiver.

The `mint()` method is intended to be called on the secondary chains, where the wrapped version of the original object is being minted.

Worth mentioning that `mint()` expects the following data as a payload on every single transfer:
- The ID of the native chain;
- The address of the NFT collection on the native chain;
- The name and the symbol of the NFT collection on the native chain;
- `TokenId` and `TokenUri` (which are obligatory as per `ERC-721`) of the object being transferred.

To complete the transfer, the following operations occur:
- `NFTBridge` must check if a wrapper NFT collection (which reflects the original NFT collection from the native chain) exists in the target chain. A wrapper collection is identified by native_chain_id + native_chain_collection_address, so its existence is easily resolvable by keeping the address of the corresponding wrapper collection in the internal mapping of `NFTBridge` on the target chain;
- If this wrapper collection has not been deployed yet, `DeBridgeNFTDeployer` is asked to deploy a new instance of `DeNFT` contract. This new wrapper collection is initialized with the name and symbol that are being passed as a payload with every object being transferred through the bridge (so they are always available, regardless of whether the wrapper collection has been deployed or not). Since the wrapper collection is being deployed by `NFTBridge`, it obtains the “minter” role, which allows it to mint and burn arbitrary objects.
- The `NFTBridge` calls the wrapper collection’s `mint()` method to mint a wrapped version of the object. Since the `ERC-721` object is identified by `tokenId` and contains arbitrary `tokenUri`, they both are being passed from the origin chain to the target chain as a payload, so the minter is able to reproduce the object with the same tokenId and tokenUri as in the native chain.
- Finally, the newly minted object is being transferred to the destination address.


## Burn-mint approach

This approach is technically very similar to the IOU, but the underlying intention was to completely burn the object on the native chain making the wrapped version a one-of-a-kind representation of the object.

To achieve this, we needed to allow the `NFTBridge` to burn the objects on the native chain, but the `burn()` method is not a part of ERC-721 standard, so we cannot rely on it. To get around this, we decided to provide a custom `ERC-721`-compliant implementation which content creators may use for their NFT collections if they want their NFTs to be cross-chain compatible and transferable through deNFT infrastructure. This implementation is the same `DeNFT` contract that is used for making wrapper collections on secondary chains.

### Creation

The idea is that the content creator deploys a fresh instance of `DeNFT` by calling the `NFTBridge.createNFT()` method. This method is necessary to achieve the following goals:
1. It deploys a fresh instance of `DeNFT` based on its `creationCode` to ensure the collection is compatible with `NFTBridge` and has no backdoors that may fool `NFTBridge` while the transferred objects are being held by it on the native chain;
2. It registers the address of this instance in the internals of the `NFTBridge` contract as an instance whose objects must be transferred using the burn/mint approach. In other words, this registration tells the `NFTBridge.send()` method to burn the objects rather than hold them while transferring them from the native chain.

When the contract is being deployed, the minter role is granted to the minter address (which may be passed to `NFTBridge.createNFT()` method), NOT to the `NFTBridge` itself. The minter’s address is intended to be owned by the content creator, a person who may then create new NFTs by calling `mint()` or any version of the `mintMany()` methods. After the collection is finished and may be closed, the content creator who is willing these NFTs to be bridged to other chains, must call the `DeNFT.giveawayToDeNFTBridge()` method which effectively transfers the minter role from the minter’s address to the `NFTBridge` contract’s address. This operation is irreversible.

After the minter role has been transferred, the objects of this collection become cross-chain transferable via deNFT gate using the burn/mint approach.

### Sending an object

To bridge an object, `NFTBridge.send()` is being called. `NFTBridge` executes an EIP-4494-compliant signature (if given), and then:
- the object is being burned by calling `DeNFT.burn()`
- a call to `NFTBridge.mint()` is encoded into a cross-chain message to be passed through deBridge infrastructure with the intention to be executed on the target chain upon receiving.

It is implied that the same instance of `NFTBridge` is already deployed on the target chain, and the address of the `NFTBridge` instance on the target chain is stored in the `NFTBridge`’s internal structure on the origin chain.

### Receiving an object

To receive an object on the target chain, the same `NFTBridge` must be deployed. Since objects are being burned on the native chain during transfer, only the `mint()` method is used on the target chain (on both native and secondary chains).

Worth mentioning that `mint()` expects the following data as a payload on every single transfer:
- The ID of the native chain;
- The address of the NFT collection on the native chain;
- The name and the symbol of the NFT collection on the native chain;
- `TokenId` and `TokenUri` (which are obligatory as per ERC-721) of the object being transferred.

To complete the transfer, the following operations occur:
- `NFTBridge` must check if a wrapper NFT collection (which reflects the original NFT collection from the native chain) exists in the target chain. A wrapper collection is identified by native_chain_id + native_chain_collection_address, so its existence is easily resolvable by keeping the address of the corresponding wrapper collection in the internal mapping of `NFTBridge` on the target chain;
- If this wrapper collection has not been deployed yet, `DeBridgeNFTDeployer` is asked to deploy a new instance of `DeNFT` contract. This new wrapper collection is initialized with the name and symbol that are being passed as a payload with every object being transferred through the bridge (so they are always available, regardless of whether the wrapper collection has been deployed or not). Since the wrapper collection is being deployed by `NFTBridge`, it obtains the “minter” role, which allows it to mint and burn arbitrary objects.
- The `NFTBridge` calls the wrapper collection’s `mint()` method to mint a wrapped version of the object. Since the ERC-721 object is identified by tokenId and contains arbitrary tokenUri, they both are being passed from the origin chain to the target chain as a payload, so the minter is able to reproduce the object with the same tokenId and tokenUri as in the native chain.
- Finally, the newly minted object is being transferred to the destination address.
