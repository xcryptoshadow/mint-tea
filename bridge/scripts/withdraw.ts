import { DEFAULT_DEBRIDGE_GATE_ADDRESS } from "@debridge-finance/desdk/lib/evm/context";
import { BigNumber } from "ethers";
import { config, ethers } from "hardhat";

const NFT_BRIDGE_ADDRESS = "0x320Af97E6E8C580D6850890C81fd7161a3332C71";
const TARGET_NFT_ADDRESS = "0x3efDF0B78c2CacC94D8EeF01981668521562175b";
const TOKEN_ID = 5001;
const REFERRAL_CODE = 0;

const CHAIN_ID_TO = config.networks.polygon.chainId!;

async function main() {
  const [owner] = await ethers.getSigners();

  const deBridgeGate = new ethers.Contract(
    DEFAULT_DEBRIDGE_GATE_ADDRESS,
    [
      "function claim(bytes32 _debridgeId,uint256 _amount,uint256 _chainIdFrom,address _receiver,uint256 _nonce,bytes calldata _signatures,bytes calldata _autoParams) external",
      "function globalFixedNativeFee() view returns (uint256)",
    ],
    owner
  );

  const gateProtocolFee: BigNumber = await deBridgeGate.globalFixedNativeFee();
  console.log("ProtocolFee: ", gateProtocolFee);

  const nftBridge = await ethers.getContractAt("NFTBridge", NFT_BRIDGE_ADDRESS);

  const targetNFT = await new ethers.Contract(
    TARGET_NFT_ADDRESS,
    [
      "function approve(address to, uint256 tokenId) public",
      "function tokenURI(uint256 tokenId) public view returns (string memory)",
    ],
    owner
  );

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
      value: gateProtocolFee,
    }
  );

  const result = await tx.wait();
  // console.log(result);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
