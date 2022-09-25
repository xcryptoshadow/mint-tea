import { ethers } from "ethers";
import { DEFAULT_DEBRIDGE_GATE_ADDRESS } from "@debridge-finance/desdk/lib/evm/context";
import { evm } from "@debridge-finance/desdk";
import { useStore } from "../store";

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

const TX_HASH_LOCAL_STORAGE_KEY = "debridge_tx_info";
const storeTxInfo = (txHash, chainIdFrom, chainIdTo) => {
  const store = useStore();
  /* Store this for the Front-end to read txn */
  store.setTxHashKey(TX_HASH_LOCAL_STORAGE_KEY);
  store.setTxHash({ txHash, chainIdFrom, chainIdTo });
  /* Use local storage to persist state or reload of browser */
  if (txHash) {
    localStorage.setItem(
      TX_HASH_LOCAL_STORAGE_KEY,
      JSON.stringify({ txHash, chainIdFrom, chainIdTo })
    );
  } else {
    localStorage.removeItem(TX_HASH_LOCAL_STORAGE_KEY);
  }
};

export const getTxInfo = () => {
  /* Use local storage to persist state or reload of browser */
  const content = localStorage.getItem(TX_HASH_LOCAL_STORAGE_KEY);
  if (content) {
    return JSON.parse(localStorage.getItem(TX_HASH_LOCAL_STORAGE_KEY));
  } else {
    return { txHash: null, chainIdFrom: null, chainIdTo: null };
  }
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

  const receipt = await tx.wait();
  storeTxInfo(receipt.transactionHash, chainIdFrom, chainIdTo);
  return receipt;
};

/**
 * @param {string} txHash
 * @param {number} chainIdFrom
 * @param {number} chainIdTo
 */
export const getTxStatus = async (txHash, chainIdFrom, chainIdTo) => {
  console.log(txHash, chainIdFrom, chainIdTo);
  // TODO:
  try {
    const evmOriginContext = {
      provider: rpcNodes[chainIdFrom],
    };

    const submissions = await evm.Submission.findAll(txHash, evmOriginContext);

    const evmDestinationContext = {
      provider: rpcNodes[chainIdTo],
    };

    const [submission] = submissions;
    const isConfirmed = await submission.hasRequiredBlockConfirmations();
    if (!isConfirmed) {
      // TODO
      return [0, 0];
    }
    // TODO: CORS error on arbitrum rpc node.
    const claim = await submission.toEVMClaim(evmDestinationContext);
    const minRequiredSignatures = await claim.getRequiredSignaturesCount();

    if (!isConfirmed) {
      return [0, minRequiredSignatures];
    }

    const signatures = await claim.getSignatures();
    return [signatures.length, minRequiredSignatures];
  } catch {
    return [0, 0];
  }
};

/**
 * @param {string} txHash
 * @param {number} chainIdFrom
 * @param {number} chainIdTo
 */
export const claim = async (txHash, chainIdFrom, chainIdTo) => {
  const { ethereum } = window;
  if (!ethereum || !txHash || !chainIdFrom || !chainIdTo) {
    throw Error();
  }

  if (!isSupported(chainIdFrom)) {
    throw Error(`chain Id: ${chainIdFrom} is not supported`);
  }

  if (!isSupported(chainIdTo)) {
    throw Error(`chain Id: ${chainIdTo} is not supported`);
  }

  const evmOriginContext = {
    provider: rpcNodes[chainIdFrom],
  };

  const submissions = await evm.Submission.findAll(txHash, evmOriginContext);
  console.log(submissions);
  if (submissions.length === 0 || submissions.length > 1) {
    throw Error();
  }

  const [submission] = submissions;
  const isConfirmed = await submission.hasRequiredBlockConfirmations();

  if (!isConfirmed) {
    throw Error("Not yet confirmed!");
  }

  const evmDestinationContext = {
    provider: rpcNodes[chainIdTo],
  };

  const claim = await submission.toEVMClaim(evmDestinationContext);

  const isSigned = await claim.isSigned();
  const isExecuted = await claim.isExecuted();

  if (!isSigned) {
    throw Error("Not yet signed!");
  }
  if (isExecuted) {
    storeTxInfo(null, null, null);
    throw Error("Already excuted!");
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
  const receipt = await tx.wait();

  if (receipt.status === 1) {
    storeTxInfo(null, null, null);
  }
  return receipt;
};
