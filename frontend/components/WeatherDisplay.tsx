import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Cloud, Sun, CloudRain, Wind, Droplets, Thermometer, Eye, Gauge } from 'lucide-react';
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

  const getWeatherGradient = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'clear':
        return 'from-yellow-400 to-orange-500';
      case 'rain':
        return 'from-blue-400 to-indigo-600';
      case 'clouds':
        return 'from-gray-400 to-slate-600';
      default:
        return 'from-blue-400 to-cyan-500';
    }
  };

  if (loading) {
    return (
      <div className="relative mb-8">
        <Card className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl">
          <CardContent className="p-8">
            <div className="flex items-center justify-center">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white/20 animate-pulse"></div>
                <div className="space-y-2">
                  <div className="w-32 h-6 bg-white/20 rounded animate-pulse"></div>
                  <div className="w-24 h-4 bg-white/20 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!weather) {
    return (
      <div className="relative mb-8">
        <Card className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl">
          <CardContent className="p-8">
            <div className="text-center text-slate-300">
              <Cloud className="h-8 w-8 mx-auto mb-2 opacity-50" />
              Weather data unavailable
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const WeatherIcon = getWeatherIcon(weather.condition);
  const gradient = getWeatherGradient(weather.condition);

  return (
    <div className="relative mb-8">
      {/* Ambient glow */}
      <div className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-20 blur-3xl rounded-3xl`}></div>
      
      <Card className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl overflow-hidden" role="region" aria-label="Current weather">
        {/* Animated particles */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-4 right-8 w-2 h-2 bg-white/30 rounded-full animate-ping"></div>
          <div className="absolute bottom-6 left-12 w-1 h-1 bg-blue-400/50 rounded-full animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 right-1/4 w-1.5 h-1.5 bg-cyan-400/40 rounded-full animate-ping delay-500"></div>
        </div>

        <CardContent className="relative p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-6">
              <div className={`relative p-4 rounded-2xl bg-gradient-to-br ${gradient} shadow-lg`}>
                <WeatherIcon className="h-8 w-8 text-white" aria-hidden="true" />
                <div className="absolute inset-0 bg-white/20 rounded-2xl animate-pulse"></div>
              </div>
              
              <div>
                <div className="text-4xl font-bold text-white mb-1" aria-label={`Temperature ${weather.temperature} degrees Celsius`}>
                  {weather.temperature}°C
                </div>
                <div className="text-slate-300 capitalize font-medium">
                  {weather.description}
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-2xl font-light text-slate-200 mb-1">
                Hong Kong
              </div>
              <div className="text-xs text-slate-400 font-mono">
                REAL-TIME DATA
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="group p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 border border-white/10">
              <div className="flex items-center gap-3 mb-2">
                <Thermometer className="h-4 w-4 text-orange-400" aria-hidden="true" />
                <span className="text-xs text-slate-400 uppercase tracking-wide">Feels Like</span>
              </div>
              <span className="text-lg font-semibold text-white" aria-label={`Feels like ${weather.feelsLike} degrees`}>
                {weather.feelsLike}°C
              </span>
            </div>

            <div className="group p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 border border-white/10">
              <div className="flex items-center gap-3 mb-2">
                <Droplets className="h-4 w-4 text-blue-400" aria-hidden="true" />
                <span className="text-xs text-slate-400 uppercase tracking-wide">Humidity</span>
              </div>
              <span className="text-lg font-semibold text-white" aria-label={`Humidity ${weather.humidity} percent`}>
                {weather.humidity}%
              </span>
            </div>

            <div className="group p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 border border-white/10">
              <div className="flex items-center gap-3 mb-2">
                <Wind className="h-4 w-4 text-cyan-400" aria-hidden="true" />
                <span className="text-xs text-slate-400 uppercase tracking-wide">Wind</span>
              </div>
              <span className="text-lg font-semibold text-white" aria-label={`Wind speed ${weather.windSpeed} meters per second`}>
                {weather.windSpeed} m/s
              </span>
            </div>

            <div className="group p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 border border-white/10">
              <div className="flex items-center gap-3 mb-2">
                <Gauge className="h-4 w-4 text-green-400" aria-hidden="true" />
                <span className="text-xs text-slate-400 uppercase tracking-wide">Condition</span>
              </div>
              <span className="text-lg font-semibold text-white capitalize">
                {weather.condition}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}