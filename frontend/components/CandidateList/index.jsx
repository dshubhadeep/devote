import React, { useEffect, useState } from "react";
import { Button, Table, message } from "antd";

import generateCampaignInstance from "../../utils/campaign";
let campaign;

const columns = [
  {
    title: "Sr. No.",
    dataIndex: "sno",
    key: "sno"
  },
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
  },
  {
    title: "Actions",
    dataIndex: "actions",
    key: "actions"
  }
];

const handleApproveEntry = async index => {
  try {
    await campaign.methods.approveEntry(index + 1).send({
      from: window.ethereum.selectedAddress
    });

    message.success(`Approved candidate ${index + 1}`);
  } catch (err) {
    console.log(err);
  }
};

const handleRejectEntry = async index => {
  try {
    await campaign.methods.rejectEntry(index + 1).send({
      from: window.ethereum.selectedAddress
    });

    message.success(`Rejected candidate ${index + 1}`);
  } catch (err) {
    console.log(err);
  }
};

const getCandidateData = async (candidateCount, address) => {
  const entryStages = ["Rejected", "Not Decided", "Accepted"];

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
          sno: index + 1,
          status: entryStages[stage],
          docLink: (
            <a
              href={`https://ipfs.infura.io/ipfs/${ipfsHash}`}
              rel="noopener noreferrer"
              target="_blank">
              View docs
            </a>
          ),
          actions: (
            <Button.Group>
              <Button
                onClick={() => handleApproveEntry(index)}
                disabled={stage == 2}>
                Approve
              </Button>
              <Button
                type="danger"
                onClick={() => handleRejectEntry(index)}
                disabled={stage == 0}>
                Reject
              </Button>
            </Button.Group>
          )
        };
      })
  );

  return candidates;
};

const CandidateList = ({ candidateCount, address }) => {
  const [candidates, setCandidates] = useState([]);
  campaign = generateCampaignInstance(address);

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
