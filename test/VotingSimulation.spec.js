/**
 * Simulate the whole voting process,
 * and ensures it behaves correctly
 */

const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");

// Contracts
const VotingFactory = require("../frontend/build/contracts/VotingFactory.json");
const Voting = require("../frontend/build/contracts/Voting.json");

const web3 = new Web3(
  ganache.provider({
    gasLimit: 8000000
  })
);

const GAS_VALUE = "5000000";
let accounts, factory, voting, EC;

before(async () => {
  accounts = await web3.eth.getAccounts();

  EC = accounts[0];

  factory = await new web3.eth.Contract(VotingFactory.abi)
    .deploy({ data: VotingFactory.bytecode, arguments: [] })
    .send({ from: EC, gas: GAS_VALUE });

  // Create a campaign using factory
  await factory.methods
    .createCampaign(10000, "Campaign 1")
    .send({ from: EC, gas: GAS_VALUE });

  const campaign = await factory.methods.getCampaign(1).call();

  voting = new web3.eth.Contract(Voting.abi, campaign["0"]);
});

describe("Voting simulation", () => {
  it("creates 3 candidates", async () => {
    for (let i = 1; i <= 3; i++) {
      await voting.methods.submitEntry(`Candidate ${i}`, i, "hash").send({
        from: accounts[i],
        gas: GAS_VALUE,
        value: Number(i * 10000).toString()
      });
    }

    const candidates = await voting.methods.noOfCandidates().call();

    assert.strictEqual(Number(candidates), 3);
  });

  it("EC approves candidates for election", async () => {
    for (let i = 1; i <= 3; i++) {
      await voting.methods.approveEntry(i).send({
        from: EC,
        gas: GAS_VALUE
      });
    }
  });

  it("start voting", async () => {
    // 1 voter for candidate 1
    await voting.methods.vote(1).send({
      from: accounts[4],
      gas: GAS_VALUE
    });

    // 3 voters for candidate 2
    for (let i = 6; i <= 8; i++) {
      await voting.methods.vote(2).send({
        from: accounts[i],
        gas: GAS_VALUE
      });
    }

    // 1 voter for candidate 3
    await voting.methods.vote(3).send({
      from: accounts[5],
      gas: GAS_VALUE
    });

    const candidate1 = await voting.methods.candidates(1).call();
    const candidate2 = await voting.methods.candidates(2).call();
    const candidate3 = await voting.methods.candidates(3).call();

    assert.strictEqual(Number(candidate1.noOfVotes), 1);
    assert.strictEqual(Number(candidate2.noOfVotes), 3);
    assert.strictEqual(Number(candidate3.noOfVotes), 1);
  });

  it("get correct winner", async () => {
    const winningId = await voting.methods.getWinner().call();

    assert.strictEqual(Number(winningId), 2);
  });

  it("close campaign", async () => {
    await voting.methods.closeCampaign().send({
      from: EC,
      gas: GAS_VALUE
    });

    const campaignStatus = await voting.methods.completed().call();

    assert(campaignStatus);
  });
});
