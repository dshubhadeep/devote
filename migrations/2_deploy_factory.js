const VotingFactory = artifacts.require("VotingFactory");

module.exports = function(deployer) {
  deployer.deploy(VotingFactory);
};
