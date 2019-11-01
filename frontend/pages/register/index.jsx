import React from "react";
import { Row, Col } from "antd";

import CustomLayout from "../../components/CustomLayout";
import EntryForm from "../../components/forms/EntryForm";

import generateCampaignInstance from "../../utils/campaign";

// TODO Show that election is closed
const CampaignRegister = ({ address, summary }) => {
  return (
    <CustomLayout navbar={false} title="Register">
      <div style={{ textAlign: "center", marginBottom: "36px" }}>
        <h1 className="header">{summary.name}</h1>
        <h2>Registration Form</h2>
      </div>

      <Row>
        <Col span={12} offset={6}>
          <EntryForm address={address} memberFee={summary.fee} />
        </Col>
      </Row>

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

CampaignRegister.getInitialProps = async ({ query }) => {
  const { id } = query;

  const address = typeof id === "string" ? id : id[0];
  const campaign = generateCampaignInstance(address);
  const summary = await campaign.methods.getSummary().call();

  return { address, summary };
};

export default CampaignRegister;
