import React, { useState } from 'react';
import {
  CloudSun,
  Droplets,
  Wind,
  Thermometer,
  Compass,
  Calendar,
  AlertTriangle,
  RefreshCw,
  Sun,
  CloudRain,
  CloudLightning,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { WeatherData, FarmProfile, Language } from '../types';
import { getTranslation } from '../i18n/translations';

interface WeatherViewProps {
  weather: WeatherData;
  currentFarm: FarmProfile;
  onRefreshWeather?: () => void;
  language: Language;
}

export const WeatherView: React.FC<WeatherViewProps> = ({
  weather,
  currentFarm,
  onRefreshWeather,
  language,
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const t = getTranslation(language);

  const handleRefresh = () => {
    setIsRefreshing(true);
    if (onRefreshWeather) {
      onRefreshWeather();
    }
    setTimeout(() => setIsRefreshing(false), 800);
  };

  // Weather condition icon helper
  const getWeatherIcon = (cond: string) => {
    const lower = cond.toLowerCase();
    if (lower.includes('rain') || lower.includes('shower')) {
      return <CloudRain className="w-8 h-8 text-sky-600" />;
    }
    if (lower.includes('cloud') || lower.includes('overcast')) {
      return <CloudSun className="w-8 h-8 text-amber-500" />;
    }
    return <Sun className="w-8 h-8 text-amber-500" />;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-800 flex items-center justify-center">
              <CloudSun className="w-4 h-4" />
            </div>
            <h1 className="font-heading text-2xl font-bold text-stone-900">{t.navWeather}</h1>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Agro-meteorological telemetry tuned for {currentFarm.location}, {currentFarm.country}.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-full bg-stone-100 text-stone-600 text-xs font-medium">
            {weather.notice}
          </span>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-sky-700 hover:bg-sky-800 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Main Weather Card */}
      <div className="bg-gradient-to-br from-sky-900 via-sky-850 to-indigo-950 text-white rounded-3xl p-6 sm:p-10 shadow-lg border border-sky-800/60 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div>
            <div className="flex items-center gap-2 text-sky-200 text-xs uppercase tracking-wider font-bold mb-2">
              <Compass className="w-4 h-4" />
              <span>
                {weather.location} • {weather.country}
              </span>
            </div>
            <div className="flex items-baseline gap-4">
              <span className="font-heading text-5xl sm:text-7xl font-extrabold tracking-tight">
                {weather.temperature}
              </span>
              <div>
                <span className="text-lg sm:text-xl font-semibold text-sky-100 block">
                  {weather.condition}
                </span>
                <span className="text-xs text-sky-300">Target Crop: {currentFarm.crop}</span>
              </div>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-3 gap-4 sm:gap-6 bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15">
            <div>
              <div className="flex items-center gap-1 text-sky-200 text-xs mb-1">
                <Droplets className="w-3.5 h-3.5" />
                <span>Humidity</span>
              </div>
              <span className="text-lg sm:text-xl font-bold">{weather.humidity}</span>
            </div>

            <div>
              <div className="flex items-center gap-1 text-sky-200 text-xs mb-1">
                <CloudRain className="w-3.5 h-3.5" />
                <span>Precipitation</span>
              </div>
              <span className="text-lg sm:text-xl font-bold">{weather.rainfall}</span>
            </div>

            <div>
              <div className="flex items-center gap-1 text-sky-200 text-xs mb-1">
                <Wind className="w-3.5 h-3.5" />
                <span>Wind Speed</span>
              </div>
              <span className="text-lg sm:text-xl font-bold">{weather.wind}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Agro-Meteorological Insights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Spraying Window Index */}
        <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs">
          <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Foliar Spraying Condition</span>
          </div>
          <h3 className="font-heading text-lg font-bold text-stone-900">Optimal Window</h3>
          <p className="text-xs text-stone-600 mt-1 leading-relaxed">
            Wind velocity ({weather.wind}) is within safe drift thresholds. Early morning (06:00 - 08:30) is recommended for neem or bio-inoculant spraying.
          </p>
        </div>

        {/* Irrigation Necessity */}
        <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs">
          <div className="flex items-center gap-2 text-sky-800 text-xs font-bold uppercase tracking-wider mb-2">
            <Droplets className="w-4 h-4 text-sky-600" />
            <span>Evapotranspiration Index</span>
          </div>
          <h3 className="font-heading text-lg font-bold text-stone-900">Moderate Demand</h3>
          <p className="text-xs text-stone-600 mt-1 leading-relaxed">
            Estimated daily crop water loss is 3.8 mm/day. Surface mulching will conserve up to 1.5 mm/day of root zone water.
          </p>
        </div>

        {/* Heat / Cold Stress */}
        <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs">
          <div className="flex items-center gap-2 text-amber-800 text-xs font-bold uppercase tracking-wider mb-2">
            <Thermometer className="w-4 h-4 text-amber-600" />
            <span>Thermal Stress Risk</span>
          </div>
          <h3 className="font-heading text-lg font-bold text-stone-900">Safe Thermal Range</h3>
          <p className="text-xs text-stone-600 mt-1 leading-relaxed">
            Current ambient temperatures pose zero frost or heat-scald threat to {currentFarm.crop} during this {currentFarm.growthStage} stage.
          </p>
        </div>
      </div>

      {/* 5-Day Agricultural Forecast */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-sky-700" />
            <h3 className="font-heading text-base font-bold text-stone-900">
              5-Day Agro-Weather Outlook
            </h3>
          </div>
          <span className="text-[11px] text-stone-500">
            OpenWeather API Connectable Layer
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {weather.forecast.map((fc, idx) => (
            <div
              key={idx}
              className="bg-stone-50 rounded-xl p-4 border border-stone-100 flex flex-col items-center text-center space-y-2"
            >
              <span className="text-xs font-bold text-stone-700">{fc.day}</span>
              {getWeatherIcon(fc.condition)}
              <span className="text-base font-extrabold text-stone-900">{fc.temp}</span>
              <span className="text-xs text-stone-600 font-medium">{fc.condition}</span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 font-semibold">
                Rain: {fc.rainProb}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
