import { ethers } from "ethers";
import { DEFAULT_DEBRIDGE_GATE_ADDRESS } from "@debridge-finance/desdk/lib/evm/context";
import { evm } from "@debridge-finance/desdk";

const NFT_BRIDGE_ADDRESS = "0x320Af97E6E8C580D6850890C81fd7161a3332C71";
const REFERRAL_CODE = 0;

const rpcNodes = {
  137: "https://polygon-rpc.com/",
  42161: "https://arb1.arbitrum.io/rpc",
};

const isSupported = (chainId) => {
  return (
    Object.keys(rpcNodes).filter(
      (availableChainId) => availableChainId.toString() === chainId.toString()
    ).length > 0
  );
};

// TODO: how should manage txHash?
// not the best solution...
const TX_HASH_LOCAL_STORAGE_KEY = "debridge_tx_hash";
const storeTxHash = (txHash) => {
  localStorage.setItem(TX_HASH_LOCAL_STORAGE_KEY, txHash);
};
const getTxHash = () => {
  return localStorage.getItem(TX_HASH_LOCAL_STORAGE_KEY);
};

/**
 * @param {string} nftContractAddress
 * @param {string} tokenId
 * @param {number} chainIdFrom
 * @param {number} chainIdTo
 * @returns {Promise<String|Error>}
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

  if ((await signer.getChainId()) !== chainIdFrom) {
    throw Error("Please switch network");
  }

  if (!isSupported(chainIdFrom)) {
    throw Error(`chain Id: ${chainIdFrom} is not supported`);
  }

  console.log(chainIdTo);
  if (!isSupported(chainIdTo)) {
    throw Error(`chain Id: ${chainIdTo} is not supported`);
  }

  const targetNFT = await new ethers.Contract(
    nftContractAddress,
    [
      "function approve(address to, uint256 tokenId) public",
      "function getApproved(uint256 tokenId) public view returns (uint256)",
    ],
    signer
  );

  const approvedAddresss = await targetNFT.getApproved(tokenId);
  if (
    approvedAddresss.toHexString().toLowerCase() !==
    NFT_BRIDGE_ADDRESS.toLowerCase()
  ) {
    const approveTx = await targetNFT.approve(NFT_BRIDGE_ADDRESS, tokenId);
    await approveTx.wait();
  }

  const deBridgeGate = new ethers.Contract(
    DEFAULT_DEBRIDGE_GATE_ADDRESS,
    [
      "function claim(bytes32 _debridgeId,uint256 _amount,uint256 _chainIdFrom,address _receiver,uint256 _nonce,bytes calldata _signatures,bytes calldata _autoParams) external",
      "function globalFixedNativeFee() view returns (uint256)",
    ],
    signer
  );

  const gateProtocolFee = await deBridgeGate.globalFixedNativeFee();
  const nftBridge = await new ethers.Contract(
    NFT_BRIDGE_ADDRESS,
    [
      "function send(address _nftCollectionAddress, uint256 _tokenId, uint256 _chainIdTo, address _receiverAddress, uint256 _executionFee, uint32 _referralCode) external payable",
    ],
    signer
  );

  const tx = await nftBridge.send(
    nftContractAddress,
    tokenId,
    chainIdTo,
    await signer.getAddress(),
    0,
    REFERRAL_CODE,
    {
      value: gateProtocolFee,
    }
  );

  const result = await tx.wait();
  storeTxHash(result.transactionHash);
  return result;
};

/**
 * @param {string} nftContractAddress
 * @param {string} tokenId
 * @param {number} chainIdFrom
 * @param {number} chainIdTo
 */
export const claim = async (chainIdFrom, chainIdTo) => {
  const { ethereum } = window;
  if (!ethereum) {
    throw Error();
  }

  if (isSupported(chainIdFrom)) {
    throw Error(`chain Id: ${chainIdFrom} is not supported`);
  }

  if (isSupported(chainIdTo)) {
    throw Error(`chain Id: ${chainIdTo} is not supported`);
  }

  const evmOriginContext = {
    provider: rpcNodes[chainIdFrom],
  };

  const txHash = getTxHash();
  if (!txHash) {
    throw Error();
  }

  const submissions = await evm.Submission.findAll(txHash, evmOriginContext);

  if (submissions.length === 0 || submissions.length > 1) {
    throw Error();
  }

  const [submission] = submissions;
  const isConfirmed = await submission.hasRequiredBlockConfirmations();

  if (!isConfirmed) {
    throw Error();
  }

  const evmDestinationContext = {
    provider: rpcNodes[chainIdTo],
  };

  const claim = await submission.toEVMClaim(evmDestinationContext);

  const isSigned = await claim.isSigned();
  const isExecuted = await claim.isExecuted();

  if (!isSigned) {
    throw Error();
  }
  if (isExecuted) {
    throw Error();
  }

  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();

  const claimArgs = await claim.getEncodedArgs();

  const deBridgeGate = await new ethers.Contract(
    DEFAULT_DEBRIDGE_GATE_ADDRESS,
    [
      "function claim(bytes32 _debridgeId,uint256 _amount,uint256 _chainIdFrom,address _receiver,uint256 _nonce,bytes calldata _signatures,bytes calldata _autoParams) external",
    ],
    signer
  );

  const tx = await deBridgeGate.claim(...claimArgs);
  await tx.wait();

  return;
};
