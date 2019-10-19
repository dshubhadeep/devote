import React from "react";
import Head from "next/head";
import "antd/dist/antd.css";

import NavBar from "./NavBar";

const CustomLayout = ({ children, navbar = true, title = "Home" }) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <link
          href="https://fonts.googleapis.com/css?family=Open+Sans&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {navbar && <NavBar />}
      <div style={{ marginTop: "36px" }}>{children}</div>
      <style global jsx>
        {`
          body {
            font-family: "Open Sans", sans-serif;
            background-color: #edf2f7;
          }
        `}
      </style>
    </>
  );
};

export default CustomLayout;
