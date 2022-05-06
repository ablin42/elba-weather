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
    <div key={item.name + index}>
      {item.name} / {item.country} / {item.state}
      <button
        type="button"
        className="btn btn-success"
        onClick={() => addToFav(item)}
      >
        +
      </button>
    </div>
  ));

export const generateFavEntry = (
  geoCodes: Array<GeoCode>,
  removeFromFav: Function
) =>
  geoCodes.map((item, index) => (
    <div key={item.name + index}>
      {item.name} / {item.country} / {item.state}
      <button
        type="button"
        className="btn btn-danger"
        onClick={() => removeFromFav(item)}
      >
        -
      </button>
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

export const generateWeatherEntry = ({ weather, label }) => {
  const { name } = weather;
  const { temp } = weather.main;
  const { description, main, icon } = weather.weather[0];

  return (
    <div>
      <h5>{label}</h5>
      {weather.name} / {weather.main.temp} °C / {weather.weather[0].main}
      <img
        src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
      />
    </div>
  );
};

export const getExtremeWeather = ({ favDetails }) => {
  if (favDetails.length <= 0) return;
  const sorted = favDetails.sort((a, b) => a.main.temp < b.main.temp);
  const hottest = sorted[0];
  const coldest = sorted[sorted.length - 1];

  console.log({ sorted, hottest, coldest });
  return (
    <>
      {generateWeatherEntry({ weather: hottest, label: "Hottest" })}
      {generateWeatherEntry({ weather: coldest, label: "Coldest" })}
    </>
  );
};
