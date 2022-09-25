# 🍵 Mint Tea

Brew up some fresh cross-chain NFTs with the Mint Tea dApp. Port your best NFTs to all the top chains to maximise your exposure using our NFT bridge. Mint Tableland NFTs with mutable metadata all stored in relational data tables on chain.

NFT holders can bridge their NFTs cross-chain to trade, stake or use on different blockchains and their local dapps. We've included a standard bridge using the IOU approach so users can bridge standard ERC-721 token or our dynamic Tableland NFTs to the different blockchains.

Search and verify your NFTs for rarity by name, description and image across all chains using NFT Ports api. Search by image url to verify your NFT artworks and images are true before purchasing your favourite works.

Browse through our marketplace to list and trade NFT collections for art, music, game items and so much more.

Mint Tea aims to become a truly cross-chain platform that opens up new markets in the blockchain space. We aim to bridge as many chains as possible starting with Ethereum, Polygon, Optimism, Arbitrum and Avalanche. As our core technologies expand then we will grow with them incorporating more chains in the future.

Please visit <https://mint-tea.netlify.app/> to view the 🍵 Mint Tea web3 application, feel free to connect your metamask wallet and enjoy!

ETHOnline Showcase: <https://ethglobal.com/showcase/mint-tea-2nn7k>
Github Repo: <https://github.com/Mint-Tea-ETHOnline/mint-tea>

Freshly brewed by team 🍵

Craig Moss - Web3 Software Engineer / Project Manager
Twitter: [@webmoss](https://twitter.com/webmoss)
LinkedIn: <https://www.linkedin.com/in/craig-moss-21822628/>
GitHub: <https://github.com/webmoss>

Anne Krauwer - Visual Designer / NFT Artist
Projects: <https://shokumotsu.superhi.com/>

Nobuhito Kurose - Solidity & Smart Contracts / Fullstack developer
GitHub: <https://github.com/enu-kuro>

Mourad Bouabdallah - Solidity & Smart Contracts / Embedded Systems Engineer
LinkedIn: <https://www.linkedin.com/in/mourad-bouabdallah/>
GitHub: <https://github.com/mourad96>

## What is 🍵 Mint Tea?

### Let's begin with the Problem

Currently, typical ERC-20 token bridges don't care about the original metadata of a fungible token, but when bridging an ERC-721 NFT token, we should always follow the original metadata to uphold the rarity and value of the non-fungible token.

Usually when you bridge an NFT through a typical bridge, the NFT on the new chain is practically a new one and the bridge follows the mint/burn approach. The big issue is that you can't actually trace that NFT back to the original chain, because when it is bridged, all the other non-vital information like collection name and similar information can be lost in the process. The cross-chain NFT has become a new form of non-fungible token or NFT and deserves a standard of it's own. With recent developments in General Message Passing, if you bridge an NFT, then the dApp on the new chain would be able to trace the cross-chain NFT back to it's chain of origin or minting chain, to make sure that it is actually the correct and true NFT and not a duplicate or fake.

### The Mint Tea Solution

For example, let's say you own an NFT on Ethereum and you take it cross-chain to Avalanche for example. The data of the NFT – the collection, the metadata – will be carried forwards, meaning that the dApp on Avalanche would be able to confirm that the NFT on Avalanche is indeed coming from Ethereum. This novel solution using General Message Passing opens up unlimited possibilities in the blockchain space. For example, let's say you can use your very valuable Ape NFT on Ethereum as collateral on another blockchain and still hold it's value, or you can create a dApp that utilises NFTs from multiple chains, without worrying about the license or royalty fee problems and similar issues. This new form of cross-chain NFT deserves further exploration as it opens up many use cases, especially in the gaming industry, music and arts. We believe that by using the Tableland NFT as a building block, soon we will be able to create entire game characters as NFTs and then attached game items, which are also dynamic NFTs that can change over time or skill levels.

## Tableland Example

Tableland is a composable data network that brings SQL to smart contracts on Ethereum and other EVM-compatible chains. Read and write structured data to the blockchain to supercharge NFTs, games, metaverse experiences, and all of web3.

### 1st Mumbai Deployment

The 🍵 Mint Tea ERC 721 NFT contract is deployed on polygon-mumbai for test purposes at: 0xbE3601f014e0A861bc837bD1f24822cE23592422

Tableland address 0x4b48841d4b32C4650E4ABc117A03FE8B51f38F68

mainTable name is: Mint_TEA_80001_1913
attributestable name is: Mint_TEA_80001_1914

View our Tableland table as NFTS on opensea.io testnet

Main NFT Table
<https://testnets.opensea.io/assets/mumbai/0x4b48841d4b32c4650e4abc117a03fe8b51f38f68/1913>

Attributes NFT Table
<https://testnets.opensea.io/assets/mumbai/0x4b48841d4b32c4650e4abc117a03fe8b51f38f68/1914>

<https://testnet.tableland.network/query?mode=list&s=SELECT%20json_object%28%27id%27%2Ctokenid%2C%27name%27%2Cname%2C%27description%27%2Cdescription%2C%27image%27%2Cimage%2C%27external_url%27%2Cexternal_url%2C%27attributes%27%2Cjson_group_array%28json_object%28%27icon%27%2Cicon%2C%27display_type%27%2Cdisplay_type%2C%27trait_type%27%2Ctrait_type%2C%27value%27%2Cvalue%29%29%29%20FROM%20Mint_TEA_80001_1913%20JOIN%20Mint_TEA_80001_1914%20ON%20Mint_TEA_80001_1913%2Etokenid%20%3D%20Mint_TEA_80001_1914%2Emaintable_tokenid%20WHERE%20tokenid%3D1%20group%20by%20tokenid>

We minted these NFTs during testing using the 🍵 Mint Tea app for the #ETHOnline 2022 hackathon

<https://testnets.opensea.io/assets/mumbai/0x8d57ffb931426aaa612591f846bd00d6c580a59c/2>
<https://testnets.opensea.io/assets/mumbai/0xbe3601f014e0a861bc837bd1f24822ce23592422/1>

### 2nd Mumbai Deployment

Deploying to network 'polygon-mumbai' with account 0x09c0377BAdCa7349b20569f45f2D94398179Db0c
tableland address 0x4b48841d4b32C4650E4ABc117A03FE8B51f38F68

Mint Tea NFT contract deployed on polygon-mumbai at: 0x92Df98CbcA8d2cEe0cfb8713220a385Ac88D7C68

mainTable name is: Mint_TEA_80001_2644
attributestable name is: Mint_TEA_80001_2645

<https://testnet.tableland.network/query?mode=list&s=SELECT%20json_object%28%27id%27%2Ctokenid%2C%27name%27%2Cname%2C%27description%27%2Cdescription%2C%27image%27%2Cimage%2C%27external_url%27%2Cexternal_url%2C%27attributes%27%2Cjson_group_array%28json_object%28%27icon%27%2Cicon%2C%27display_type%27%2Cdisplay_type%2C%27trait_type%27%2Ctrait_type%2C%27value%27%2Cvalue%29%29%29%20FROM%20Mint_TEA_80001_2644%20JOIN%20Mint_TEA_80001_2645%20ON%20Mint_TEA_80001_2644%2Etokenid%20%3D%20Mint_TEA_80001_2645%2Emaintable_tokenid%20WHERE%20tokenid%3D6%20group%20by%20tokenid>

### Final Mumbai Deployment

Deploying to network 'polygon-mumbai' with account 0x09c0377BAdCa7349b20569f45f2D94398179Db0c
tableland address 0x4b48841d4b32C4650E4ABc117A03FE8B51f38F68

Mint Tea NFT contract deployed on polygon-mumbai at: 0x39FA9C170B61f8fFb00cBaFc0B6e5A794529cd48

mainTable name is: Mint_TEA_80001_2832
attributestable name is: Mint_TEA_80001_2833

<https://testnet.tableland.network/query?mode=list&s=SELECT%20json_object%28%27id%27%2Ctokenid%2C%27name%27%2Cname%2C%27description%27%2Cdescription%2C%27image%27%2Cimage%2C%27external_url%27%2Cexternal_url%2C%27attributes%27%2Cjson_group_array%28json_object%28%27icon%27%2Cicon%2C%27display_type%27%2Cdisplay_type%2C%27trait_type%27%2Ctrait_type%2C%27value%27%2Cvalue%29%29%29%20FROM%20Mint_TEA_80001_2832%20JOIN%20Mint_TEA_80001_2833%20ON%20Mint_TEA_80001_2832%2Etokenid%20%3D%20Mint_TEA_80001_2833%2Emaintable_tokenid%20WHERE%20tokenid%3D16%20group%20by%20tokenid>

## deBridge Example

Deployed Bridge contracts on Polygon, Arbitrum and Avalanche. Optimism not supported yet but coming soon. We aim to include Optimism in our target chains.

NFTBridge deployed to address: 0x320Af97E6E8C580D6850890C81fd7161a3332C71
DeNFT deployed to address: 0x195a17f9e714a79A9D4E1757Fe59a01a7B59Ea23
deBridgeNFTDeployer deployed to address: 0xb2C3a5d2296b4d6BCb272E60f4Ce10d17Afcf32a

Confirmed NFT bridge functionality transaction
<https://app.debridge.finance/transaction?tx=0x208b423d48c3c4d52a3eeab6a33ce2eed52a0a028614e68eafd41096edab56e6&chainId=137>

Original NFT locked in the bridge contract on Polygon.
<https://opensea.io/assets/matic/0x0057a7c625352190d27d9614ee09fac999f8c93d/572>

Wrapped NFT on Arbitrum
<https://stratosnft.io/collection/0x9bE599bB2627BDc3221a0A8Cd0Fce620Da981f30>

## ETHOnline Sponsor Tech Used

### Ethereum, Polygon, Optimism, Arbitrum and Avalanche

Ethereum is the community-run technology powering the cryptocurrency ether (ETH) and thousands of decentralized applications.

Polygon believes in Web3 for all. Polygon is a decentralised Ethereum scaling platform that enables developers to build scalable user-friendly dApps with low transaction fees without ever sacrificing on security.

Optimism is a low-cost and lightning-fast Ethereum L2 blockchain.

Arbitrum is next generation layer 2 for Ethereum dApps

Avalanche is an open, programmable smart contracts platform for decentralized applications.

### Tableland

Tableland is a web3-native database that can be used to store data in relational tables. One of the most exciting use cases is using Tableland for NFT metadata — which is a challenging problem in web3, especially for novel dynamic NFT use cases. Developers must make tradeoffs between:

1. Expensive on-chain storage with very limited query-ability
2. Centralized storage, which doesn’t enable web3 paradigms
3. Decentralized storage (e.g., IPFS), which is great for file/image storage, but immutable files (CIDs) pose a challenge for novel NFT metadata use cases

Tableland solves the web3 metadata problem with ERC721-based tables that are powered by smart contracts. Create, insert, and update tables, all using smart contracts and/or libraries built on top of Tableland smart contracts. The metadata can also be dynamic and change based on user interactions or on-chain events. The Tableland contracts are currently deployed on Polygon mainnet & Mumbai testnet, as well as a number of other chains with more coming soon.

### deBridge

deBridge is a secure interoperability layer for Web3 that enables decentralized transfers of arbitrary messages and value between various blockchains. The validation of cross-chain transactions is performed by a network of independent validators who are elected by and work for deBridge governance. Validators maintain the blockchain infrastructure and each run a deBridge node to sign all transactions that pass through deBridge smart contracts in different blockchains.

Delegated staking and slashing mechanics act as a backbone for protocol security and provide economic disincentives for validators to collude.
The deBridge protocol is an infrastructure platform and a framework for:

1. Decentralized transfer of arbitrary data and assets
2. Cross-chain interoperability and composability of smart contracts
3. Cross-chain swaps
4. Interoperability and bridging of NFTs

Projects can integrate with deBridge infrastructure to tap into the various cross-chain opportunities that the deBridge smart contracts enable. These can for instance be:

- Build own custom bridges for assets and NFTs preserving custom NFT logic (e.g. breeding)
- Enable users from other blockchain ecosystems interact with their protocol (enable global accessibility)
- Scale up their protocol to other chains and exchange commands/messages between components of their protocol
- Make their protocol composable with protocols from other ecosystems
- Build new types of cross-chain applications and primitives
- Enable global accessibility by letting users and protocols from other chains seamlessly interact with the protocol

### NFTPort Enhanced APIs 🦸🏻

NFTPort provide core products which make the developer experience as easy as possible and accelerate NFT application development. All of them enable to focus on building the best product for your users, instead of reinventing the NFT infrastructure wheel.

NFTPort provide enhanced APIs for Text Search so you don't have to build your own NFT database, Content NFTID which enables to find similar and duplicate NFTs to increase customer loyalty and an NFT Recommendation Engine to increase revenue.

### IPFS, Filecoin and NFT.Storage

The Interplanetary File System (IPFS) is a decentralized file system for building the next generation of the internet. Filecoin (opens new window) and many popular Web3 projects are built on IPFS. Some call it the hard drive for blockchain and Web3, though its power extends much further.

NFT.Storage is a long-term storage service designed for off-chain NFT data (like metadata, images, and other assets). Data is content addressed using IPFS, meaning the URI pointing to a piece of data (“ipfs://…”) is completely unique to that data (using a content identifier, or CID). IPFS URLs and CIDs can be used in NFTs and metadata to ensure the NFT forever actually refers to the intended data (eliminating things like rug pulls, and making it trustlessly verifiable what content an NFT is associated with).

## Technology Stack

The Mint Tea web3 application uses the following technologies in it's software life cycle:
Solidity - Smart contracts written using Solidity
Hardhat - Hardhat takes care of all our deployments and smart contract compilation and testing
Vue.js - It's green for go
Pinia - State management using Pinia
SASS,SCSS - Styled beautifully to match our fabulous designs by Anne Krauwer

## Hardhat Project Setup

This project uses a basic Hardhat setup.
Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat accounts
npx hardhat compile
npx hardhat clean
npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.js
GAS_REPORT=true npx hardhat test
```

## Deploy Contracts Notes

```shell
npx hardhat run scripts/deploy.js --network polygon-mumbai
```

## Verify Contracts Note

You will need to verify your contracts as below, replace the first address with your new contract address

```shell
npx hardhat run scripts/verify.js --network polygon-mumbai
```

## Basic Vue 3 Front-end using Vite and Pinia

The 🍵 Mint Tea project uses Vue 3 for the front-end and Pinia for state management.
Run the following commands from the pwa folder in root to power up the main website

```shell
cd pwa
npm install
npm run lint
npm run dev
```

### If the sky falls on your head

```bash
sudo rm -rf node_modules
sudo rm -rf package-lock.json
npm install
npm run dev
```
