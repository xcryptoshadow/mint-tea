import { BigNumber } from "ethers";
import { config, ethers } from "hardhat";

const NFT_BRIDGE_ADDRESS = "0x320Af97E6E8C580D6850890C81fd7161a3332C71";
const TARGET_NFT_ADDRESS = "0x03e055692e77e56aBf7f5570D9c64C194BA15616";
const TOKEN_ID = 5001;
const GATE_PROTOCOL_FEE = BigNumber.from("500000000000000000"); // 0.5 matic
const REFERRAL_CODE = 0;

// Polygon to Avalanche
// const CHAIN_ID_TO = config.networks.avalanche.chainId!;
// Polygon to Arbitrum
const CHAIN_ID_TO = config.networks.arbitrum.chainId!;

async function main() {
  const [owner] = await ethers.getSigners();
  const nftBridge = await ethers.getContractAt("NFTBridge", NFT_BRIDGE_ADDRESS);

  const targetNFT = new ethers.Contract(
    TARGET_NFT_ADDRESS,
    [
      "function tokenOfOwnerByIndex(address owner, uint256 index) external view returns (uint256)",
      "function approve(address to, uint256 tokenId) public",
      "function tokenURI(uint256 tokenId) public view returns (string memory)",
    ],
    owner
  );

  // const token_id = await targetNFT.tokenOfOwnerByIndex(owner.address, 0);

  const token_id = TOKEN_ID;
  const approveTx = await targetNFT.approve(NFT_BRIDGE_ADDRESS, token_id);
  await approveTx.wait();

  const tx = await nftBridge.send(
    TARGET_NFT_ADDRESS,
    token_id,
    CHAIN_ID_TO,
    owner.address,
    0,
    REFERRAL_CODE,
    {
      value: GATE_PROTOCOL_FEE,
    }
  );

  const result = await tx.wait();
  // console.log(result);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
