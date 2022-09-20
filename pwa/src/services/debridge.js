import { ethers } from "ethers";
import { DEFAULT_DEBRIDGE_GATE_ADDRESS } from "@debridge-finance/desdk/lib/evm/context";

const NFT_BRIDGE_ADDRESS = "0x320Af97E6E8C580D6850890C81fd7161a3332C71";
const REFERRAL_CODE = 0;

/**
 * @param {string} nftContractAddress
 * @param {string} tokenId
 * @param {number} chainIdFrom
 * @param {number} chainIdTo
 */
export const bridge = async (
  nftContractAddress,
  tokenId,
  chainIdFrom,
  chainIdTo
) => {
  const { ethereum } = window;
  if (!ethereum) {
    throw Error();
  }

  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();

  if (signer.getChainId() !== chainIdFrom) {
    throw Error();
  }

  const nftBridge = await ethers.getContractAt("NFTBridge", NFT_BRIDGE_ADDRESS);
  const targetNFT = await new ethers.Contract(
    nftContractAddress,
    ["function approve(address to, uint256 tokenId) public"],
    signer
  );

  const approveTx = await targetNFT.approve(NFT_BRIDGE_ADDRESS, tokenId);
  await approveTx.wait();

  const deBridgeGate = new ethers.Contract(
    DEFAULT_DEBRIDGE_GATE_ADDRESS,
    [
      "function claim(bytes32 _debridgeId,uint256 _amount,uint256 _chainIdFrom,address _receiver,uint256 _nonce,bytes calldata _signatures,bytes calldata _autoParams) external",
      "function globalFixedNativeFee() view returns (uint256)",
    ],
    signer
  );

  const gateProtocolFee = await deBridgeGate.globalFixedNativeFee();

  const tx = await nftBridge.send(
    nftContractAddress,
    tokenId,
    chainIdTo,
    signer.address,
    0,
    REFERRAL_CODE,
    {
      value: gateProtocolFee,
    }
  );

  await tx.wait();
};
