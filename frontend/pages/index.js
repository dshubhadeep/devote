import React from "react";
import Head from "next/head";

import { address } from "../utils/address.json";

const Home = () => (
  <div>
    <Head>
      <title>Home</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <div className="hero">
      <h1 className="title">Welcome to Next.js!</h1>
      <p className="description">
        Contract deployed at <strong>{address}</strong>
      </p>
    </div>

    <style jsx>{`
      .hero {
        font-family: "Inter Medium", sans-serif;
        width: 100%;
        color: #333;
      }
      .title {
        margin: 0;
        width: 100%;
        padding-top: 80px;
        line-height: 1.15;
        font-size: 48px;
      }
      .title,
      .description {
        text-align: center;
      }
    `}</style>
  </div>
);

export default Home;
