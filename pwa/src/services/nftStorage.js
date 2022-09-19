/* Import the NFTStorage class and File constructor from the 'nft.storage' package */
import { NFTStorage, Blob } from "nft.storage";

const NFT_STORAGE_KEY = import.meta.env.VITE_NFT_STORAGE_KEY;

/**
 * Store NFT Metadata in custom Attribute structure
 * @returns {MetadataURL}
 */
export const nftStorage = async (
  name,
  description,
  imageUrl,
  externalUrl,
  attributes,
  audioVideoType
) => {
  /*
   * Create a blob to validate TypeError: property `image` must be a Blob or File
   * object at validateERC1155
   */
  let blob = new Blob([imageUrl], { type: audioVideoType });

  const nft = {
    name,
    decimals: 0,
    description,
    image: blob,
    external_url: externalUrl,
    attributes: attributes,
  };

  /* Init NFT.Storage Client */
  const client = new NFTStorage({ token: NFT_STORAGE_KEY });
  const metadata = await client.store(nft);

  /* Return our NFT.Storage CID */
  return metadata.url;
};

/**
 * Store Blob method to upload a file to NFT.Storage
 * @returns {MetadataURL}
 */
export const storeBlob = async (file) => {
  if (file.size === 0) {
    throw new Error("Content size is 0, make sure to provide some content");
  }
  /* Init NFT.Storage Client */
  const client = new NFTStorage({ token: NFT_STORAGE_KEY });
  const cid = await client.storeBlob(file);

  /* Return our File NFT.Storage CID */
  return cid;
};
