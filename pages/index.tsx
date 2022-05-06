import type { NextPage } from "next";
import styled from "styled-components";
import Head from "next/head";

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Very Cool Weather App</title>
        <meta
          name="description"
          content="It's not much, but it's honest work"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1>Hello world</h1>
    </div>
  );
};

export default Home;
