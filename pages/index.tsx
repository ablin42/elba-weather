import type { NextPage } from "next";
import { useState, useEffect } from "react";
// import styled from "styled-components";
import Head from "next/head";
import {
  getWeather,
  generateWeatherEntry,
  getGeoCodes,
  generateGeoCodesEntry,
  GeoCode,
  generateFavEntry,
} from "../utils";
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

// { localWeather }
const Home: NextPage = () => {
  const [myWeather, setMyWeather] = useState();
  const [geoCodes, setGeoCodes] = useState<Array<GeoCode>>([]);
  const [fav, setFav] = useState<Array<GeoCode>>([]);

  // useEffect(() => {
  //   console.log(myWeather)
  //   if (!myWeather) getLocation();
  // }, []);

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

  const addToFav = (geoCode: GeoCode) => setFav([...fav, geoCode]);
  const removeFromFav = (geoCode: GeoCode) =>
    setFav(
      fav.filter((item) => item.lon !== geoCode.lon && item.lat !== geoCode.lat)
    );

  return (
    <div className="container">
      <Head>
        <title>Very Cool Weather App</title>
        <meta
          name="description"
          content="It's not much, but it's honest work"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {myWeather && generateWeatherEntry(myWeather)}
      <input
        type="text"
        className="form-control"
        onChange={async (e) => setGeoCodes(await getGeoCodes(e.target.value))}
      />
      {generateGeoCodesEntry(geoCodes, addToFav)}
      <h3>my fav</h3>
      {generateFavEntry(fav, removeFromFav)}
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
