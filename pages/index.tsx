import type { NextPage } from "next";
import { useState, useEffect } from "react";
import Head from "next/head";
import {
  getWeather,
  generateWeatherEntry,
  getGeoCodes,
  generateGeoCodesEntry,
  GeoCode,
  generateFavEntry,
  getExtremeWeather,
} from "../utils";

const Home: NextPage = () => {
  const [myWeather, setMyWeather] = useState<any>();
  const [geoCodes, setGeoCodes] = useState<Array<GeoCode>>([]);
  const [fav, setFav] = useState<Array<GeoCode>>([]);
  const [favDetails, setFavDetails] = useState<Array<any>>([]); 

  useEffect(() => {
    if (!myWeather) getLocation();
  });

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

  const getFavDetails = async (favList: Array<any>) => {
    const list = [];
    for (const location of favList) list.push(await getWeather(location));

    setFavDetails(list);
  };

  const addToFav = (geoCode: GeoCode) => {
    const newFav = [...new Set([...fav, geoCode])];
    setFav(newFav);
    getFavDetails(newFav);
  };

  const removeFromFav = (geoCode: GeoCode) => {
    const newFav = fav.filter(
      (item) => item.lon !== geoCode.lon && item.lat !== geoCode.lat
    );
    setFav(newFav);
    getFavDetails(newFav);
  };

  return (
    <div className="container main-container mt-5">
      <Head>
        <title>Very Cool Weather App</title>
        <meta
          name="description"
          content="It's not much, but it's honest work"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1 className="mb-3">Live Weather</h1>
      <div className="row">
        {myWeather &&
          generateWeatherEntry({
            weather: myWeather,
            label: `Your location: ${myWeather.name}`,
          })}
      </div>

      <div className="row col-8 offset-2">
        {getExtremeWeather({ favDetails })}
      </div>

      <div className="input-group mb-4 search-input">
        <span className="input-group-text" id="inputGroup-sizing-default">
          Search a location
        </span>
        <input
          type="text"
          className="form-control"
          onChange={async (e) => setGeoCodes(await getGeoCodes(e.target.value))}
          placeholder="London"
        />
      </div>

      <div className="row mt-3 col-8 offset-2">
        {geoCodes?.length > 0 && (
          <div className="col-6">
            <div>
              <h4 className="mb-3">Add Destination</h4>
              {generateGeoCodesEntry(geoCodes, addToFav)}
            </div>
          </div>
        )}

        {fav?.length > 0 && (
          <div className="col-6">
            <div>
              <h3 className="mb-3">Remove Destination</h3>
              {generateFavEntry(fav, removeFromFav)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
