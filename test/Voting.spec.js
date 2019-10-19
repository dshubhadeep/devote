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
let accounts, factory, voting;

before(async () => {
  accounts = await web3.eth.getAccounts();

  factory = await new web3.eth.Contract(VotingFactory.abi)
    .deploy({ data: VotingFactory.bytecode, arguments: [] })
    .send({ from: accounts[0], gas: GAS_VALUE });

  // Create a campaign using factory
  await factory.methods
    .createCampaign(10000, "Campaign 1")
    .send({ from: accounts[0], gas: GAS_VALUE });

  /**
   * Entry stages
   * 0 - Rejected
   * 1 - Not decided
   * 2 - Accepted
   */

  const campaign = await factory.methods.getCampaign(1).call();
  const address = campaign["0"];

  voting = new web3.eth.Contract(Voting.abi, address);
});

describe("Voting Factory", () => {
  it("deploys contract", () => {
    assert.ok(factory.options.address);
  });

  it("creates campaign", async () => {
    await factory.methods
      .createCampaign(5000, "Campaign 2")
      .send({ from: accounts[0], gas: GAS_VALUE });

    const campaign = await factory.methods.getCampaign(2).call();

    assert.strictEqual(campaign["1"], "Campaign 2");
  });

  it("only allows EC to create campaign", async () => {
    let noErrFlag = false;

    try {
      await factory.methods
        .createCampaign(5000, "Campaign 2")
        .send({ from: accounts[1], gas: GAS_VALUE });

      noErrFlag = true;
    } catch (err) {
      assert.ok(err);
    }

    assert.strictEqual(noErrFlag, false);
  });
});

describe("Voting", () => {
  it("deploys contract", () => {
    assert.ok(voting.options.address);
  });

  it("marks sender as EC", async () => {
    const EC = await voting.methods.electionCommission().call();

    assert.strictEqual(EC, accounts[0]);
  });

  it("accepts entry by candidate", async () => {
    await voting.methods.submitEntry("Candidate 1", 2, "IPFSHash").send({
      from: accounts[1],
      gas: GAS_VALUE,
      value: "20000"
    });

    const { name } = await voting.methods.candidates(1).call();
    const noOfCandidate = await voting.methods.noOfCandidates().call();

    assert.strictEqual("Candidate 1", name);
    assert.strictEqual(Number(noOfCandidate), 1);
  });

  it("rejects entry by EC", async () => {
    let noErrFlag = false;

    try {
      await voting.methods.submitEntry("Candidate 2", 5, "IPFSHash").send({
        from: accounts[0],
        gas: GAS_VALUE,
        value: "50000"
      });

      noErrFlag = true;
    } catch (err) {
      assert.ok(err);
    }

    assert.strictEqual(noErrFlag, false);
  });

  it("doesn't allow candidate entry with same name", async () => {
    let noErrFlag = false;

    try {
      await voting.methods.submitEntry("Candidate 1", 2, "IPFSHash").send({
        from: accounts[1],
        gas: GAS_VALUE,
        value: "20000"
      });

      noErrFlag = true;
    } catch (err) {
      assert.ok(err);
    }

    assert.strictEqual(noErrFlag, false);
  });

  it("candidate entry requires registration fee", async () => {
    let noErrFlag = false;

    try {
      await voting.methods.submitEntry("Candidate 3", 2, "IPFSHash").send({
        from: accounts[1],
        gas: GAS_VALUE,
        value: "10000"
      });

      noErrFlag = true;
    } catch (err) {
      assert.ok(err);
    }

    assert.strictEqual(noErrFlag, false);
  });

  it("doesn't allow candidate with 0 members", async () => {
    let noErrFlag = false;

    try {
      await voting.methods.submitEntry("Candidate 3", 0, "IPFSHash").send({
        from: accounts[1],
        gas: GAS_VALUE
      });

      noErrFlag = true;
    } catch (err) {
      assert.ok(err);
    }

    assert.strictEqual(noErrFlag, false);
  });

  it("allows EC to approve entry", async () => {
    await voting.methods.approveEntry(1).send({
      from: accounts[0],
      gas: GAS_VALUE
    });

    const { name, stage } = await voting.methods.candidates(1).call();

    assert.strictEqual(name, "Candidate 1");
    assert.strictEqual(Number(stage), 2);
  });

  it("allows EC to reject entry", async () => {
    // Create another candidate
    await voting.methods.submitEntry("Candidate 2", 1, "IPFSHash").send({
      from: accounts[1],
      gas: GAS_VALUE,
      value: "10000"
    });

    await voting.methods.rejectEntry(2).send({
      from: accounts[0],
      gas: GAS_VALUE
    });

    const { name, stage } = await voting.methods.candidates(2).call();

    assert.strictEqual(name, "Candidate 2");
    assert.equal(stage, 0);
  });

  it("doesn't allow invalid candidate id for approval", async () => {
    let noErrFlag = false;

    try {
      await voting.methods.approveEntry(101).send({
        from: accounts[0],
        gas: GAS_VALUE
      });

      noErrFlag = true;
    } catch (err) {
      assert.ok(err);
    }

    assert.strictEqual(noErrFlag, false);
  });

  it("doesn't allow random user to approve entry", async () => {
    let noErrFlag = false;

    try {
      await voting.methods.approveEntry(1).send({
        from: accounts[1],
        gas: GAS_VALUE
      });

      noErrFlag = true;
    } catch (err) {
      assert.ok(err);
    }

    assert.strictEqual(noErrFlag, false);
  });

  it("allows user to vote", async () => {
    await voting.methods.vote(1).send({
      from: accounts[2],
      gas: GAS_VALUE
    });

    const { name, noOfVotes } = await voting.methods.candidates(1).call();

    assert.strictEqual(name, "Candidate 1");
    assert.strictEqual(Number(noOfVotes), 1);
  });

  it("allows user to vote only ONCE", async () => {
    let noErrFlag = false;

    try {
      await voting.methods.vote(1).send({
        from: accounts[2],
        gas: GAS_VALUE
      });

      noErrFlag = true;
    } catch (err) {
      assert.ok(err);
    }

    assert.strictEqual(noErrFlag, false);
  });

  it("allows user to vote only for eligible candidates", async () => {
    let noErrFlag = false;

    try {
      await voting.methods.vote(2).send({
        from: accounts[3],
        gas: GAS_VALUE
      });

      noErrFlag = true;
    } catch (err) {
      assert.ok(err);
    }

    assert.strictEqual(noErrFlag, false);
  });

  it("doesn't allow user to vote for candidate with invalid ID", async () => {
    let noErrFlag = false;

    try {
      await voting.methods.vote(20).send({
        from: accounts[3],
        gas: GAS_VALUE
      });

      noErrFlag = true;
    } catch (err) {
      assert.ok(err);
    }

    assert.strictEqual(noErrFlag, false);
  });

  it("allows EC to close campaign", async () => {
    await voting.methods.closeCampaign().send({
      from: accounts[0],
      gas: GAS_VALUE
    });

    const completed = await voting.methods.completed().call();

    assert(completed);
  });

  it("rejects entry after campaign is closed", async () => {
    let noErrFlag = false;

    try {
      await voting.methods.submitEntry("Candidate 3", 5, "IPFSHash").send({
        from: accounts[1],
        gas: GAS_VALUE,
        value: "50000"
      });

      noErrFlag = true;
    } catch (err) {
      assert.ok(err);
    }

    assert.strictEqual(noErrFlag, false);
  });

  it("doesn't allow EC to approve entry after campaign is closed", async () => {
    let noErrFlag = false;

    try {
      await voting.methods.approveEntry(1).send({
        from: accounts[0],
        gas: GAS_VALUE
      });

      noErrFlag = true;
    } catch (err) {
      assert.ok(err);
    }

    assert.strictEqual(noErrFlag, false);
  });
});
