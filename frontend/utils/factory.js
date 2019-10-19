import web3 from "./web3";

import VotingFactory from "../build/contracts/VotingFactory.json";
import { address } from "../build/contracts/address.json";

const contract = new web3.eth.Contract(VotingFactory.abi, address);

export default contract;
