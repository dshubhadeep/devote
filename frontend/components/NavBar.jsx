import { Layout, Menu, Icon } from "antd";
import React from "react";
import Link from "next/link";

const { Header } = Layout;

const NavBar = () => {
  return (
    <Layout className="layout">
      <Header>
        <div className="logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          style={{ lineHeight: "64px", float: "right" }}>
          <Menu.Item key="1">
            <Link href="/">
              <a>Campaigns</a>
            </Link>
          </Menu.Item>
          {/* <Menu.Item key="2">
            <Icon type="logout" />
            Logout
          </Menu.Item> */}
        </Menu>
      </Header>
    </Layout>
  );
};

export default NavBar;
