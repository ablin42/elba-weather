const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

export interface Coordinates {
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

export const getWeather = async ({ lat, lon }: Coordinates) => {
  try {
    const data = await fetcher(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`
    );
    return data;
  } catch (err) {
    console.log("Error while fetching weather", err);
  }
};
