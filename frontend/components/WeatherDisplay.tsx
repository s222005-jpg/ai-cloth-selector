import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Cloud, Sun, CloudRain, Wind, Droplets, Thermometer } from 'lucide-react';
import backend from '~backend/client';

interface WeatherData {
  temperature: number;
  condition: string;
  description: string;
  humidity: number;
  windSpeed: number;
  feelsLike: number;
}

export function WeatherDisplay() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWeather();
  }, []);

  const loadWeather = async () => {
    try {
      const data = await backend.weather.getCurrentWeather();
      setWeather(data);
    } catch (error) {
      console.error('Failed to load weather:', error);
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'clear':
        return Sun;
      case 'rain':
        return CloudRain;
      case 'clouds':
        return Cloud;
      default:
        return Cloud;
    }
  };

  if (loading) {
    return (
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="text-center text-muted-foreground" aria-live="polite">
            Loading weather data...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!weather) {
    return (
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="text-center text-muted-foreground">
            Unable to load weather data
          </div>
        </CardContent>
      </Card>
    );
  }

  const WeatherIcon = getWeatherIcon(weather.condition);

  return (
    <Card className="mb-6" role="region" aria-label="Current weather">
      <CardContent className="p-4">
        <div className="flex items-center justify-center gap-4 mb-4">
          <WeatherIcon className="h-8 w-8 text-primary" aria-hidden="true" />
          <div className="text-center">
            <div className="text-2xl font-bold" aria-label={`Temperature ${weather.temperature} degrees Celsius`}>
              {weather.temperature}°C
            </div>
            <div className="text-sm text-muted-foreground capitalize">
              {weather.description}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Thermometer className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <span aria-label={`Feels like ${weather.feelsLike} degrees`}>
              Feels {weather.feelsLike}°C
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Droplets className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <span aria-label={`Humidity ${weather.humidity} percent`}>
              {weather.humidity}%
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Wind className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <span aria-label={`Wind speed ${weather.windSpeed} meters per second`}>
              {weather.windSpeed} m/s
            </span>
          </div>
          <div className="text-xs text-muted-foreground">
            Hong Kong
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
