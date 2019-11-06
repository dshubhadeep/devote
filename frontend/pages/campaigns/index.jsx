import React from "react";
import { Col, Row, Button, Badge, message } from "antd";
import Router from "next/router";

import CampaignActions from "../../components/CampaignActions";
import CampaignDetail from "../../components/CampaignDetail";
import CandidateTable from "../../components/CandidateTable";
import CustomLayout from "../../components/CustomLayout";

import generateCampaignInstance from "../../utils/campaign";

const Campaign = ({ summary, address }) => {
  const campaign = generateCampaignInstance(address);

  const closeCampaign = async () => {
    try {
      if (summary.status) {
        message.info("Campaign is already closed");
      } else {
        await campaign.methods.closeCampaign().send({
          from: window.ethereum.selectedAddress
        });

        message.success("Closed campaign", 2);

        setTimeout(() => {
          Router.push("/");
        }, 2500);
      }
    } catch (err) {
      message.error(err.message);
    }
  };

  const getWinner = async () => {
    const winnerId = await campaign.methods.getWinner().call();
    const { name } = await campaign.methods.candidates(winnerId).call();

    console.log(campaign);

    message.info(`${name} is the winner`, 10);
  };

  return (
    <CustomLayout title={summary.name}>
      <Row>
        <Col span={4} offset={2}>
          <h1 className="header">{summary.name}</h1>
        </Col>
        <Col span={4} offset={14}>
          <Button style={{ background: "#1A202C" }} size="large" disabled>
            <Badge
              status="processing"
              text={summary.status ? "Completed" : "Ongoing"}
              style={{ color: "white" }}
              color={summary.status ? "green" : ""}
            />
          </Button>
        </Col>
      </Row>
      <Row>
        <Col offset={2} span={20}>
          <CampaignDetail {...summary} />
        </Col>
      </Row>
      <Row>
        <Col offset={2} span={15}>
          <h2 className="header">Candidates</h2>
          <CandidateTable
            candidateCount={Number(summary.candidateCount)}
            address={address}
          />
        </Col>
      </Row>
      <Row>
        <Col offset={2} span={11}>
          <h2 className="header">Actions</h2>
          <CampaignActions handleClick={closeCampaign} getWinner={getWinner} />
        </Col>
      </Row>

      <style jsx>{`
        .header {
          font-weight: bold;
          color: #2d3748;
        }
      `}</style>
    </CustomLayout>
  );
};

Campaign.getInitialProps = async ({ query }) => {
  const { id } = query;

  const address = typeof id === "string" ? id : id[0];
  const campaign = generateCampaignInstance(address);
  const summary = await campaign.methods.getSummary().call();

  console.log(campaign.methods);

  return { address, summary, campaign };
};

export default Campaign;
