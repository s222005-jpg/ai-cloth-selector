import { api } from "encore.dev/api";
import { secret } from "encore.dev/config";

const openWeatherApiKey = secret("OpenWeatherApiKey");

export interface WeatherData {
  temperature: number;
  condition: string;
  description: string;
  humidity: number;
  windSpeed: number;
  feelsLike: number;
}

// Gets current weather data for Hong Kong.
export const getCurrentWeather = api<void, WeatherData>(
  { expose: true, method: "GET", path: "/weather/current" },
  async (): Promise<WeatherData> => {
    const apiKey = openWeatherApiKey();
    const url = `https://api.openweathermap.org/data/2.5/weather?q=Hong Kong,HK&appid=${apiKey}&units=metric`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }
    
    const data = await response.json() as any;
    
    return {
      temperature: data.main.temp,
      condition: data.weather[0].main,
      description: data.weather[0].description,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
      feelsLike: data.main.feels_like
    };
  }
);
