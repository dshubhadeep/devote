/**
 * Returns instance of campaign contract given an address
 */

import web3 from "./web3";

import Voting from "../build/contracts/Voting.json";

export default address => {
  return new web3.eth.Contract(Voting.abi, address);
};
