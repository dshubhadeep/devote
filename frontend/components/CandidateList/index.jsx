import React, { useEffect, useState } from "react";
import { Table } from "antd";

import generateCampaignInstance from "../../utils/campaign";

const columns = [
  {
    title: "Candidate Name",
    dataIndex: "name",
    key: "name"
  },
  {
    title: "Members",
    dataIndex: "members",
    key: "members"
  },
  {
    title: "Entry status",
    dataIndex: "status",
    key: "status"
  },
  {
    title: "Document link",
    dataIndex: "docLink",
    key: "docLink"
  },
  {
    title: "Vote Count",
    dataIndex: "noOfVotes",
    key: "noOfVotes"
  }
];

const getCandidateData = async (candidateCount, address) => {
  const campaign = generateCampaignInstance(address);

  const entryStages = ["Reject", "Not Decided", "Accept"];

  const candidates = await Promise.all(
    Array(candidateCount)
      .fill(undefined)
      .map(async (el, index) => {
        const {
          name,
          members,
          ipfsHash,
          stage,
          noOfVotes
        } = await campaign.methods.candidates(index + 1).call();

        return {
          name,
          members,
          noOfVotes,
          key: index,
          status: entryStages[stage],
          docLink: ipfsHash
        };
      })
  );

  return candidates;
};

const CandidateList = ({ candidateCount, address }) => {
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const getCandidates = async () => {
      const campaignData = await getCandidateData(candidateCount, address);

      if (isMounted) {
        setCandidates(campaignData);
      }
    };

    getCandidates();

    return () => {
      /**
       * Cleanup
       * @see https://github.com/facebook/react/issues/14369
       */
      isMounted = false;
    };
  }, []);

  return (
    <div style={{ marginTop: "18px", marginBottom: "32px" }}>
      {candidateCount > 0 ? (
        <Table
          columns={columns}
          dataSource={candidates}
          pagination={false}
          bordered={true}
        />
      ) : (
        <p>No candidates found</p>
      )}
    </div>
  );
};

export default CandidateList;
