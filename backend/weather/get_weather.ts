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
    try {
      const apiKey = openWeatherApiKey();
      if (!apiKey) {
        throw new Error("OpenWeather API key not configured");
      }
      
      const url = `https://api.openweathermap.org/data/2.5/weather?q=Hong Kong,HK&appid=${apiKey}&units=metric`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json() as any;
      
      return {
        temperature: Math.round(data.main.temp),
        condition: data.weather[0].main,
        description: data.weather[0].description,
        humidity: data.main.humidity,
        windSpeed: Math.round(data.wind.speed * 10) / 10,
        feelsLike: Math.round(data.main.feels_like)
      };
    } catch (error) {
      console.error("Error fetching weather:", error);
      // Return mock data as fallback
      return {
        temperature: 25,
        condition: "Clear",
        description: "clear sky",
        humidity: 70,
        windSpeed: 2.5,
        feelsLike: 26
      };
    }
  }
);
