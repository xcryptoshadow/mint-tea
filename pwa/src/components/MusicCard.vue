<template>
  <div
    v-if="
      token.metadata ||
      token.metadata.title ||
      token.metadata.name ||
      token.metadata.image ||
      token.metadata.description
    "
    class="music-nft"
  >
    <div v-if="token.metadata && token.metadata.name" class="music-nft-title">
      {{ token.metadata.name }}
    </div>
    <div v-if="token.metadata && token.metadata.image" class="music-nft-video">
      <video width="400" controls>
        <source :src="getUrlProtocol(token.metadata.image)" type="video/mp4" />
      </video>
    </div>
    <div
      v-if="token.metadata && token.metadata.description"
      class="music-nft-description"
    >
      {{ token.metadata.description }}
    </div>
  </div>
</template>
<script>
/* Import our IPFS and NftStorage Services */
import { generateLink } from "../services/helpers";
/* LFG */
export default {
  name: "NftCard",
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
          return "https://ipfs.io/ipfs/" + url.substring(7);
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

.music-nft {
  display: inline;
  float: left;
  box-sizing: border-box;
  max-width: 380px;
  background: $mint-black;
  border-radius: 15px;
  margin: 0 0 20px 0;
  padding: 0;
  overflow: hidden;

  .music-nft-video {
    width: 100%;
    margin: 0;
    padding: 0;
    overflow: hidden;
    background: $mint-black;
  }
  .music-nft-title {
    color: $white;
    width: 100%;
    font-size: 22px;
    font-weight: normal;
    text-transform: uppercase;
    text-align: center;
    margin: 10px 0 5px 0;
  }
  .music-nft-description {
    color: $white;
    width: 100%;
    font-size: 12px;
    font-weight: normal;
    text-align: center;
    margin: 0;
    padding: 10px 35px 15px;
  }
}
</style>
