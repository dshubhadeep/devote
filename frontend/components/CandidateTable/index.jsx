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
    key: "status",
    filters: [
      {
        text: "Accepted",
        value: "Accepted"
      },
      {
        text: "Rejected",
        value: "Rejected"
      },
      {
        text: "Not Decided",
        value: "Not Decided"
      }
    ],
    onFilter: (value, record) => record.status == value
  },
  {
    title: "Document link",
    dataIndex: "docLink",
    key: "docLink"
  },
  {
    title: "Vote Count",
    dataIndex: "noOfVotes",
    key: "noOfVotes",
    sorter: (a, b) => a.noOfVotes - b.noOfVotes,
    sortDirections: ["descend", "ascend"]
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

const getCandidateData = async candidateCount => {
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

const CandidateTable = ({ candidateCount, address }) => {
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

export default CandidateTable;
