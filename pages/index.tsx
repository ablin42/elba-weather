import type { NextPage } from "next";
import { useState } from "react";
// import styled from "styled-components";
import Head from "next/head";
import { getWeather } from "../utils";
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

// { localWeather }
const Home: NextPage = () => {
  const [myWeather, setMyWeather] = useState();

  const getLocation = () => {
    if (navigator && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const myWeather = await getWeather({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });

        setMyWeather(myWeather);
      });
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  };
  getLocation();

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

// export async function getServerSideProps() {
//   // Fetch data from external API
//   let myWeather = {lat: 0, lon: 0};
//   if (navigator && navigator.geolocation) {
//     navigator.geolocation.getCurrentPosition( position => {
//       myWeather = {
//         lat: position.coords.latitude,
//         lon: position.coords.longitude,
//       };
//     })
//   } else {
//     console.error("Geolocation is not supported by this browser.");
//   }

//   const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${myWeather.lat}&lon=${myWeather.lon}&appid=${API_KEY}`)
//   const localWeather = await res.json()

//   // Pass data to the page via props
//   return { props: { localWeather } }
// }

export default Home;
