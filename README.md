# 🍵 Mint Tea

Brew up some fresh cross-chain NFTs with the 🍵 Mint Tea web3 application. Port your best NFTs to all the top chains to maximise your exposure using our NFT bridge. Mint Tableland NFTs with mutable metadata all stored in relational data tables on chain.

Mint Tea NFT holders can bridge their dynamic NFTs cross-chain to trade, stake or use on different blockchains and their local dapps. We've included a standard bridge using the IOU approach so users can bridge normal tokens or our custom NFTs to the different blockchains.

Search and verify your NFTs for rarity by name, description and image across all chains using NFT Ports api. Search by image url to verify your NFT artworks and images are true before purchasing your favourite works.

Browse through our marketplace to list and trade NFT collections for art, music, game items and so much more.

Mint Tea aims to become a truly cross-chain platform that opens up new markets in the blockchain space. We aim to bridge as many chains as possible starting with Ethereum, Polygon and Optimism. As our core technologies expand then we will grow with them incorporating more chains in the future.

Please visit <https://mint-tea-kqg2oj.spheron.app/> to view the 🍵 Mint Tea web3 application, feel free to connect your metamask wallet and enjoy!

ETHOnline Showcase: <https://ethglobal.com/showcase/mint-tea-2nn7k>
Github Repo: <https://github.com/Mint-Tea-ETHOnline/mint-tea>

Freshly brewed by team 🍵 Mint Tea

Craig Moss - Front-End / Co-ordinator
Twitter: [@webmoss](https://twitter.com/webmoss)
LinkedIn: <https://www.linkedin.com/in/craig-moss-21822628/>
GitHub: <https://github.com/webmoss>

Anne Krauwer - Visual Designer
LinkedIn:
Projects: <https://shokumotsu.superhi.com/>

Nobuhito Kurose - Solidity & Smart Contracts
GitHub: <https://github.com/enu-kuro>

Mourad Bouabdallah - Solidity & Smart Contracts
LinkedIn: <https://www.linkedin.com/in/mourad-bouabdallah/>
GitHub: <https://github.com/mourad96>

Kerem Demirayak - Product Manager / NFT Music & Art
Twitter: [@karakter_music](https://twitter.com/karakter_music)
Opensea: <https://opensea.io/collection/algobeats-by-han-x-nicolas-daniel>
GitHub: <https://github.com/kdemirayak>

## Tableland Example

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

### Ethereum, Polygon and Optimism

Ethereum is the community-run technology powering the cryptocurrency ether (ETH) and thousands of decentralized applications.

Polygon believes in Web3 for all. Polygon is a decentralised Ethereum scaling platform that enables developers to build scalable user-friendly dApps with low transaction fees without ever sacrificing on security.

Optimism is a low-cost and lightning-fast Ethereum L2 blockchain.

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

The 🍵 Mint Tea web3 application uses the following technologies in it's software life cycle:

Etheruem (Solidity) - Smart contracts written in Solidity

IPFS & Filecoin - IPFS, Filecoin and NFT.Storage are used to store our uploaded NFT assets. The 🍵 Mint Tea site is served via IPFS and stored on Filecoin using Spheron. We have various services and helpers that handle the processing of files and creating direct ipfs:// links as well as gateway versions for content sharing links in case users don't have IPFS Desktop setup on their computers or their browsers don't support it yet.

Tableland - Tableland was used to create a SQL table on contract creation which stores the NFT data. The NFT is created in normal fashion whereby the images and metadata are created and stored on ipfs://, then in addition the same information is stored in separate Tableland sql table which will is joined together to provide the NFT with a new tokenUri serving the metadata from Tableland.

Sponsor Note: Kindly refer to pwa > src > services for examples of IPFS, NFT.Storage and NFT Port usage. These are used in the Upload and Mint functionality.

Polygon - 🍵 Mint Tea is deployed to the Polygon Mumbai network and uses Matic for payments and minting, Mumbai Testnet for demo purposes only please!
Spheron - The 🍵 Mint Tea web app is deployed seemlessly using Spheron, and served to the world via IPFS, also stored on Filecoin.
Hardhat - Hardhat takes care of all our deployments and smart contract compilation and testing
Vue.js - It's green for go ;)
Pinia - State management using Pinia store
SASS,SCSS - Styled beatifully to match our fabulous designs by Anne Krauwer

## Hardhat Project Setup

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a script that deploys that contract.
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
npx hardhat verify --network polygon-mumbai "0xbE3601f014e0A861bc837bD1f24822cE23592422"
```

## Basic Vue 3 Front-end using Vite and Pinia

The 🍵 Mint Tea project uses Vue 3 for the front-end and Pinia for state management. Various web3 libraries and sdk's have been integrated, cutting edge blockchain technologies including deBridge, Tableland, NFT.Storage, IPFS, Filecoin, NFT Port and Lit Protocol.

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
