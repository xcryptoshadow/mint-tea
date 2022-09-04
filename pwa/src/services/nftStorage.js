// Import the NFTStorage class and File constructor from the 'nft.storage' package
import { NFTStorage } from "nft.storage";

const NFT_STORAGE_KEY = import.meta.env.VITE_NFT_STORAGE_KEY;
/**
 * Store NFT Metadata in custom Attribute structure
 * @returns {MetadataURL}
 */
export const nftStorage = async (
  name,
  description,
  imageUrl,
  size,
  createdAt,
  audioVideoType,
  title,
  category,
  license,
  website,
  longDescription,
  preview,
  audioVideoURL,
  animationURL,
  youtubeURL,
  resolution,
  duration
) => {
  /*
   * Create a blob to validate TypeError: property `image` must be a Blob or File
   * object at validateERC1155
   */
  console.log("imageUrl", imageUrl);
  console.log("audioVideoType", audioVideoType);

  let blob = new Blob([imageUrl], { type: audioVideoType });

  const nft = {
    name,
    decimals: 0,
    description,
    image: blob,
    properties: {
      type: "mNFT",
      authors: [{ name: "Mojo NFT" }],
      content: {
        "text/markdown": longDescription,
      },
    },
    attributes: [
      {
        trait_type: "Title",
        value: title,
      },
      {
        trait_type: "Category",
        value: category,
      },
      {
        trait_type: "License",
        value: license,
      },
      {
        trait_type: "Website Link",
        value: website,
      },
      {
        trait_type: "Preview Link",
        value: preview,
      },
      {
        trait_type: "Audio/Video Link",
        value: audioVideoURL,
      },
      {
        trait_type: "Audio/Video Type",
        value: audioVideoType,
      },
      {
        trait_type: "Animation Link",
        value: animationURL,
      },
      {
        trait_type: "Youtube Link",
        value: youtubeURL,
      },
      {
        trait_type: "Resolution",
        value: resolution,
      },
      {
        trait_type: "Duration",
        value: duration,
      },
      {
        trait_type: "Size",
        value: size,
      },
      {
        display_type: "date",
        trait_type: "duration",
        value: createdAt,
      },
    ],
  };

  const client = new NFTStorage({ token: NFT_STORAGE_KEY });
  const metadata = await client.store(nft);

  return metadata.url;
};

export const storeBlob = async (file) => {
  console.log("storeBlob File: ", file);
  if (file.size === 0) {
    throw new Error("Content size is 0, make sure to provide some content");
  }
  // const content = new Blob(file);
  const client = new NFTStorage({ token: NFT_STORAGE_KEY });
  const cid = await client.storeBlob(file);
  return cid;
};
