<template>
  <div class="search-nft">
    <div
      v-if="getUrlProtocol(token.cached_file_url) === 'mp4'"
      class="search-nft-video"
    >
      <video width="320" height="240" controls>
        <source :src="getUrlProtocol(token.cached_file_url)" type="video/mp4" />
        <!-- <source :src="`${token.cached_file_url}`" type="video/ogg" /> -->
        Your browser does not support the video tag.
      </video>
    </div>
    <div
      v-if="getUrlProtocol(token.cached_file_url) === 'mp3'"
      class="search-nft-video"
    >
      <video width="320" height="240" controls>
        <source :src="getUrlProtocol(token.cached_file_url)" type="video/mp4" />
        <!-- <source :src="`${token.cached_file_url}`" type="video/ogg" /> -->
        Your browser does not support the video tag.
      </video>
    </div>
    <div
      v-else-if="token.name && token.cached_file_url"
      class="search-nft-image"
    >
      <img
        v-if="token.cached_file_url"
        :src="`${getUrlProtocol(token.cached_file_url)}`"
        :alt="`${token.name}`"
      />
    </div>
    <div v-if="token.name" class="search-nft-title">
      {{ token.name }}
    </div>
    <div v-if="token.description" class="search-nft-description">
      {{ token.description }}
    </div>
    <div v-if="token.mint_date" class="search-nft-description">
      {{ token.mint_date }}
    </div>
    <div v-if="token.chain" class="search-nft-description">
      {{ token.chain }}
    </div>
    <div v-if="token.contract" class="search-nft-description">
      {{ token.contract }}
    </div>
  </div>
</template>
<script>
/* Import our IPFS and NftStorage Services */
import { generateLink } from "../services/helpers";

// Body
// application/json
// response
// string
// required
// Response status, either OK or NOK.

// Allowed values:
// OK
// NOK
// search_results
// array[TextSearchNft]
// chain
// string
// required
// Blockchain where the NFT has been minted.

// Allowed values:
// polygon
// ethereum
// contract_address
// string
// required
// The contract address of the NFT.

// token_id
// string
// required
// A unique uint256 ID inside the contract. The contract address and token ID pair is a globally unique and fully-qualified identifier for a specific NFT on chain.

// cached_file_url
// string
// required
// Cached file (image, video, etc) in NFTPort's cloud with no access restrictions and without IPFS issues.

// name
// string
// required
// Name of the NFT in the metadata.

// description
// string
// required
// Description of the NFT in the metadata.

// mint_date
// string
// Date when the NFT was minted (ISO).
/* LFG */
export default {
  name: "SearchCard",
  props: ["token"],
  methods: {
    getUrlProtocol(url) {
      let protocol = url.endsWith("mp4") ? 5 : 0;
      if (protocol == 0) protocol = url.endsWith("mp3") ? 6 : 0;
      if (protocol == 0) protocol = url.endsWith("gif") ? 7 : 0;
      if (protocol == 0) protocol = url.startsWith("http://") ? 1 : 0;
      if (protocol == 0) protocol = url.startsWith("https://") ? 2 : 0;
      if (protocol == 0) protocol = url.startsWith("ipfs://") ? 3 : 0;
      if (protocol == 0) protocol = url !== "" ? 4 : 0;
      switch (protocol) {
        case 1:
          return url;
        case 2:
          return url;
        case 3:
          return "https://ipfs.io/ipfs/" + url.substring(7);
        case 4:
          return generateLink(url);
        case 5:
          return "mp4";
        case 6:
          return "mp3";
        case 7:
          return url;
        case 0:
          return "Not http or https";
      }
    },
  },
};
</script>
<style lang="scss">
@import "../assets/styles/variables.scss";
@import "../assets/styles/mixins.scss";

.search-nft {
  display: inline;
  float: left;
  box-sizing: border-box;
  width: 230px;
  background: #f4f4f4;
  border: 2px solid #f4f4f4;
  border-radius: 15px;
  margin: 0 13px 25px 13px;
  padding: 10px;
  transition: 0.4s;
  cursor: pointer;

  @include breakpoint($break-md) {
    width: 380px;
    padding: 20px 20px 10px;
  }
  @include breakpoint($break-sm) {
    width: 380px;
  }
  @include breakpoint($break-xs) {
    width: 380px;
    margin: 0 auto 20px;
  }

  &:hover {
    border: 2px solid #8d50f5;
  }

  .search-nft-video {
    width: 100%;
    margin: 0 auto;
    padding: 0;
    overflow: hidden;
    background: #f4f4f4;
  }
  .search-nft-image {
    width: 100%;
    margin: 0 auto;
    padding: 0;
    overflow: hidden;

    img,
    svg {
      width: 100%;
      height: 100%;
      object-fit: contain;
      overflow: hidden;
    }
  }

  .search-nft-title {
    color: #1a1a1a;
    width: 100%;
    font-size: 14px;
    font-weight: normal;
    text-transform: uppercase;
    text-align: center;
    margin: 10px 0 0 0;
  }

  .search-nft-description {
    color: #1a1a1a;
    width: 100%;
    font-size: 12px;
    font-weight: normal;
    text-align: center;
    margin: 0;
  }
}
</style>
