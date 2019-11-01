import React from "react";
import { Col, Row } from "antd";

import VoterForm from "../components/forms/VoterForm";
import CustomLayout from "../components/CustomLayout";

import generateCampaignInstance from "../utils/campaign";

// TODO Show that election is closed
const VotePage = ({ address, summary }) => {
  return (
    <CustomLayout title="Voting form" navbar={false}>
      <div style={{ textAlign: "center", marginBottom: "36px" }}>
        <h1 className="header">{summary.name}</h1>
        <h2>Voting Form</h2>
      </div>

      <Row>
        <Col span={12} offset={6}>
          <VoterForm
            address={address}
            candidateCount={Number(summary.candidateCount)}
          />
        </Col>
      </Row>

      <style jsx>{`
        .header {
          font-weight: bold;
          color: #2d3748;
          text-align: center;
        }
      `}</style>

      <style jsx>{`
        .header {
          font-weight: bold;
          color: #2d3748;
          text-align: center;
        }
      `}</style>
    </CustomLayout>
  );
};

VotePage.getInitialProps = async ({ query }) => {
  const { id } = query;

  const address = typeof id === "string" ? id : id[0];
  const campaign = generateCampaignInstance(address);
  const summary = await campaign.methods.getSummary().call();

  return { address, summary };
};

export default VotePage;
