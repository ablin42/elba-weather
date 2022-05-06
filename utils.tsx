const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

export interface Coordinates {
  lat: number;
  lon: number;
}

export interface GeoCode {
  country: string;
  name: string;
  state: string;
  lat: number;
  lon: number;
}

export interface Main {
  feels_like: number;
  humidity: number;
  pressure: number;
  temp: number;
  temp_max: number;
  temp_min: number;
}

export interface Weather {
  id: number;
  main: string;
  description: string;
  icon: string;
}
export interface Details {
  weather: Array<Weather>;
  main: Main;
  name: string;
}

export interface WeatherEntry {
  weather: Details;
  label: string;
}

export const fetcher = async (query: string) => {
  try {
    const res = await fetch(query);
    return await res.json();
  } catch (err) {
    console.log("Failed to fetch:", query);
  }
};

export const getGeoCodes = async (search: string) => {
  try {
    if (search.length <= 0) return;
    const data = await fetcher(
      `http://api.openweathermap.org/geo/1.0/direct?q=${search}&limit=${10}&appid=${API_KEY}`
    );

    return data;
  } catch (err) {
    console.log("Error while fetching GeoCodes:", err);
  }
};

export const generateGeoCodesEntry = (
  geoCodes: Array<GeoCode>,
  addToFav: Function
) =>
  geoCodes.map((item, index) => (
    <div className="wrapper" key={item.name + index}>
      <div className="weather-entry">
        <div className="weather-text">
          {item.country} / {item.name} / {item.state}
        </div>
        <button
          type="button"
          className="btn btn-success btn-action"
          onClick={() => addToFav(item)}
        >
          +
        </button>
      </div>
    </div>
  ));

export const generateFavEntry = (
  geoCodes: Array<GeoCode>,
  removeFromFav: Function
) =>
  geoCodes.map((item, index) => (
    <div className="wrapper" key={item.name + index}>
      <div className="weather-entry">
        <div className="weather-text">
          {item.country} / {item.name} / {item.state}
        </div>
        <button
          type="button"
          className="btn btn-danger btn-action"
          onClick={() => removeFromFav(item)}
        >
          -
        </button>
      </div>
    </div>
  ));

export const getWeather = async ({ lat, lon }: Coordinates) => {
  try {
    const data = await fetcher(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
    return data;
  } catch (err) {
    console.log("Error while fetching weather", err);
  }
};

export const generateWeatherEntry = ({ weather, label }: WeatherEntry) => {
  const { name } = weather;
  const { temp } = weather.main;
  const { main, icon } = weather.weather[0];

  return (
    <div>
      <h5 style={{ marginBottom: "-10px" }}>{label}</h5>
      <span style={{ fontSize: "18px" }}>
        {name}, {temp} °C {main}
      </span>
      <img src={`http://openweathermap.org/img/wn/${icon}@2x.png`} />
    </div>
  );
};

export const getExtremeWeather = ({ favDetails }: any) => {
  if (favDetails.length <= 0) return;
  const sorted = favDetails.sort((a: any, b: any) => a.main.temp < b.main.temp);
  const hottest = sorted[0];
  const coldest = sorted[sorted.length - 1];

  return (
    <>
      <div className="col-6">
        {generateWeatherEntry({
          weather: hottest,
          label: "Hottest Destination",
        })}
      </div>
      <div className="col-6">
        {generateWeatherEntry({
          weather: coldest,
          label: "Coldest Destination",
        })}
      </div>
    </>
  );
};
