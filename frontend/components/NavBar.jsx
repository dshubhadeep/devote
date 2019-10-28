import { Layout, Menu } from "antd";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

const { Header } = Layout;

const NavBar = () => {
  const router = useRouter();
  const isCampaignPage = /campaigns/.test(router.pathname);
  const id = router.query.id;

  let links = [
    {
      href: "/",
      text: "Campaigns"
    }
  ];

  let campaignLinks = [
    {
      href: `/register?id=${id}`,
      text: "Register"
    },
    {
      href: `/vote?id=${id}`,
      text: "Vote"
    }
  ];

  links = isCampaignPage ? [...links, ...campaignLinks] : links;

  return (
    <Layout className="layout">
      <Header>
        <div className="logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          style={{ lineHeight: "64px", float: "right" }}>
          {links.map((link, idx) => {
            return (
              <Menu.Item key={idx}>
                <Link href={link.href}>
                  <a>{link.text}</a>
                </Link>
              </Menu.Item>
            );
          })}
        </Menu>
      </Header>
    </Layout>
  );
};

export default NavBar;
