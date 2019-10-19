/**
 * This script creates a json file which contains
 * address of the deployed factory contract
 */

const fs = require("fs");
const VotingFactory = artifacts.require("VotingFactory");

module.exports = async deployer => {
  const factory = await VotingFactory.deployed();

  fs.writeFileSync(
    "./frontend/build/contracts/address.json",
    JSON.stringify({ address: factory.address })
  );

  console.log(`Contract deployed at ${factory.address}`);
};
