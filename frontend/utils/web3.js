import Web3 from "web3";

let web3 = {};

if (typeof window === "undefined") {
  const provider = new Web3.providers.HttpProvider("http://127.0.0.1:8545");

  web3 = new Web3(provider);
  console.log("SERVER: web3 setup");
} else {
  if (window.ethereum) web3 = new Web3(window.ethereum);
  else if (window.web3) web3 = new Web3(window.web3.currentProvider);
}

export default web3;
