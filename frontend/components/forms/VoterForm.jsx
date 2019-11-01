import { useEffect, useState } from "react";
import { message } from "antd";

import VotingCandidateList from "../VotingCandidateList";

import generateCampaignInstance from "../../utils/campaign";

let campaign;

const getCandidateData = async candidateCount => {
  const entryStages = ["Rejected", "Not Decided", "Accepted"];

  const candidates = await Promise.all(
    Array(candidateCount)
      .fill(undefined)
      .map(async (el, index) => {
        const { name, stage } = await campaign.methods
          .candidates(index + 1)
          .call();

        return {
          name,
          key: index,
          status: entryStages[stage]
        };
      })
  );

  // return only eligible candidates
  return candidates.filter(candidate => candidate["status"] === "Accepted");
};

const handleVote = async id => {
  try {
    await campaign.methods.vote(id).send({
      from: window.ethereum.selectedAddress,
      gas: "2000000"
    });

    message.success(`Voted for candidate ${id}`, 2);
  } catch (err) {
    console.log(err);
    message.error(err.message, 2);
  }
};

const VoterForm = ({ candidateCount, address }) => {
  const [candidates, setCandidates] = useState([]);
  campaign = generateCampaignInstance(address);

  useEffect(() => {
    let isMounted = true;

    const getCandidates = async () => {
      const campaignData = await getCandidateData(candidateCount);

      if (isMounted) {
        setCandidates(campaignData);
      }
    };

    getCandidates();

    return () => {
      isMounted = false;
    };
  }, [candidateCount]);

  return (
    <div>
      <VotingCandidateList candidates={candidates} onVote={handleVote} />
    </div>
  );
};

export default VoterForm;
