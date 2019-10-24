import React from "react";
import { Row, Col } from "antd";

import CustomLayout from "../../components/CustomLayout";
import CampaignForm from "../../components/forms/CampaignForm";

const NewCampaignPage = () => {
  return (
    <CustomLayout title="New Campaign">
      <Row>
        <Col span={7} offset={2}>
          <h1 style={{ fontWeight: "bold", marginBottom: "20px" }}>
            New Campaign
          </h1>
        </Col>
      </Row>
      <Row>
        <Col span={8} offset={2}>
          <CampaignForm />
        </Col>
      </Row>
    </CustomLayout>
  );
};

export default NewCampaignPage;
