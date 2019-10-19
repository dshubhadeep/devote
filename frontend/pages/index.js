import React from "react";
import Link from "next/link";
import { Row, Col, Button } from "antd";

import CustomLayout from "../components/CustomLayout";

const Home = () => (
  <CustomLayout>
    <Row>
      <Col span={4} offset={2}>
        <h1 style={{ fontWeight: "bold" }}>Campaigns</h1>
      </Col>
      <Col span={4} offset={14}>
        <Link href="/campaigns/new">
          <Button icon="plus" style={{ fontSize: "16px" }} size="large">
            Create
          </Button>
        </Link>
      </Col>
    </Row>
  </CustomLayout>
);

export default Home;
