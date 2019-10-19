import Web3 from "web3";

const provider = new Web3.providers.HttpProvider("http://127.0.0.1:8545");

const web3 = new Web3(provider);
console.log("SERVER: web3 setup");

export default web3;
