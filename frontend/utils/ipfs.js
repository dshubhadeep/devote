/**
 * Stored at https://ipfs.infura.io/ipfs/{file-hash}
 */

import IPFS from "ipfs-http-client";

const ipfs = IPFS("ipfs.infura.io", 5001, { protocol: "https" });

export default ipfs;
