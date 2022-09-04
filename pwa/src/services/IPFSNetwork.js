import { encode } from "base-64";
export default class IPFSNetwork {
  constructor() {
    this.endpoint = new URL("https://ipfs.infura.io:5001");
  }

  /**
   * @param {Blob|File} blob
   * @returns {Promise<String|Error>}
   */
  async storeBlob(blob) {
    const infuraKey = import.meta.env.VITE_INFURA_API_KEY;
    const infuraSecret = import.meta.env.VITE_INFURA_API_SECRET;
    const url = new URL("/api/v0/add?stream-channels=true", this.endpoint);

    console.log("Blob: ", blob);
    if (blob.size === 0) {
      throw new Error("Content size is 0, make sure to provide some content");
    }

    const formData = new FormData();
    formData.append("file", blob);

    console.log("infuraKey", infuraKey);
    console.log("infuraSecret", infuraSecret);

    const request = await fetch(url.toString(), {
      method: "POST",
      headers: new Headers({
        Authorization: "Basic " + encode(infuraKey.toString() + ":" + infuraSecret.toString()),
        "Content-Type": "application/json",
      }),
      body: formData,
    });
    console.log("request: ", request);
    const result = await request.json();

    console.log("result: ", result);

    if (request.ok) {
      return result.Hash;
    } else {
      throw new Error(`Error while upload into IPFS Network`);
    }
  }
}
