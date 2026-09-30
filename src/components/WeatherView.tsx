import React, { useState, useMemo, useEffect, useRef } from 'react';
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
  TrendingUp,
  Activity,
  Sparkles,
  Layers,
  ArrowUpRight,
  Info,
  Clock,
  MapPin,
  Flame,
  Snowflake,
  BarChart3,
  Gauge,
  CircleGauge,
  Sunrise,
  Sunset,
  Moon,
  ChevronLeft,
  ChevronRight,
  Check,
  AlertCircle,
  HelpCircle,
  Sprout,
  Tractor,
} from 'lucide-react';
import { WeatherData, FarmProfile, Language, HourlyForecastPoint } from '../types';
import { getTranslation } from '../i18n/translations';
import {
  localizeCountry,
  localizeCrop,
  localizeGrowthStage,
  formatFarmLocation,
} from '../i18n/dataTranslations';
import {
  localizeWeatherCondition,
  localizeForecastDay,
  localizeTimeOfDay,
  localizeTimeDisplay,
  getLocalizedTemperatureStatus,
  getLocalizedRainStatus,
  getLocalizedHumidityStatus,
  getLocalizedWindStatus,
  localizeWindSpeed,
  getLocalizedFarmGuidance,
  getLocalizedWeatherStory,
} from '../i18n/weatherTranslations';
import { getWeatherUIStrings } from '../i18n/weatherGuidanceData';

interface WeatherViewProps {
  weather: WeatherData;
  currentFarm: FarmProfile;
  onRefreshWeather?: () => void;
  language: Language;
}

type MetricMode = 'temp' | 'precip' | 'humidity' | 'wind';

// -------------------------------------------------------------
// Farmer-Friendly Plain Language Status Classifiers (Localized)
// -------------------------------------------------------------
export function getTemperatureStatus(temp: number, lang: Language = 'en'): { label: string; color: string; bg: string } {
  return getLocalizedTemperatureStatus(temp, lang);
}

export function getRainStatus(prob: number, lang: Language = 'en'): { label: string; color: string; bg: string } {
  return getLocalizedRainStatus(prob, lang);
}

export function getHumidityStatus(hum: number, lang: Language = 'en'): { label: string; color: string; bg: string } {
  return getLocalizedHumidityStatus(hum, lang);
}

export function getWindStatus(speed: number, lang: Language = 'en'): { label: string; color: string; bg: string } {
  return getLocalizedWindStatus(speed, lang);
}

// -------------------------------------------------------------
// Time formatting helper
// -------------------------------------------------------------
export function formatHour12(timeStrOrHour: string | number): string {
  if (typeof timeStrOrHour === 'number') {
    const hour = ((timeStrOrHour % 24) + 24) % 24;
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 === 0 ? 12 : hour % 12;
    return `${hour12} ${ampm}`;
  }

  const str = String(timeStrOrHour || '').trim();
  if (!str) return '';

  // Already in 12-hour format e.g. "2 PM", "12 AM", "2:00 PM"
  if (/^\d{1,2}(:\d{2})?\s*(AM|PM)$/i.test(str)) {
    return str.toUpperCase();
  }

  // Handle ISO string or "HH:mm"
  let timePart = str;
  if (str.includes('T')) {
    timePart = str.split('T')[1];
  }
  const parts = timePart.split(':');
  if (parts.length >= 1) {
    const parsedHour = parseInt(parts[0], 10);
    if (!isNaN(parsedHour)) {
      const hour = ((parsedHour % 24) + 24) % 24;
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const hour12 = hour % 12 === 0 ? 12 : hour % 12;
      return `${hour12} ${ampm}`;
    }
  }
  return str;
}

export function formatLocalTimeStandard(localTimeStr?: string, hourNum?: number): string {
  if (localTimeStr) {
    const timePart = localTimeStr.includes('T') ? localTimeStr.split('T')[1] : localTimeStr;
    const parts = timePart.split(':');
    if (parts.length >= 2) {
      const h = parseInt(parts[0], 10);
      const m = parts[1].slice(0, 2);
      if (!isNaN(h)) {
        const ampm = h >= 12 ? 'PM' : 'AM';
        const h12 = h % 12 === 0 ? 12 : h % 12;
        return `${h12}:${m} ${ampm}`;
      }
    }
  }
  if (typeof hourNum === 'number') {
    return formatHour12(hourNum);
  }
  return '';
}

export function computeCurrentFarmHourIndex(hourly: HourlyForecastPoint[], timezone?: string, utcOffsetSeconds?: number): number {
  if (!hourly || hourly.length === 0) return 0;
  
  const now = new Date();
  let localHour = 0;
  let localDateStr = now.toISOString().split('T')[0];

  const offsetSec = typeof utcOffsetSeconds === 'number' ? utcOffsetSeconds : 0;
  const localMs = now.getTime() + offsetSec * 1000;
  const d = new Date(localMs);
  localHour = d.getUTCHours();
  localDateStr = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`;

  if (timezone) {
    try {
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        hour12: false,
      });
      const parts = formatter.formatToParts(now);
      const getP = (type: string) => parts.find(p => p.type === type)?.value || '';
      const yr = getP('year');
      const mo = getP('month');
      const da = getP('day');
      let hr = parseInt(getP('hour'), 10);
      if (hr === 24) hr = 0;
      if (!isNaN(hr)) localHour = hr;
      if (yr && mo && da) localDateStr = `${yr}-${mo}-${da}`;
    } catch {
      // fallback to utcOffsetSeconds calculation above
    }
  }

  const targetIsoHour = `${localDateStr}T${String(localHour).padStart(2, '0')}:00`;
  const exactMatch = hourly.findIndex(h => h.localTime === targetIsoHour || h.isoTime === targetIsoHour || (h.hour === localHour && (h.localTime || '').startsWith(localDateStr)));
  if (exactMatch >= 0) return exactMatch;

  const hourMatch = hourly.findIndex(h => h.hour === localHour);
  if (hourMatch >= 0) return hourMatch;

  const isNowMatch = hourly.findIndex(h => h.isNow === true);
  if (isNowMatch >= 0) return isNowMatch;

  return 0;
}

export function validateWeatherTimePipeline(weather: WeatherData, hourlyData: HourlyForecastPoint[]): { pass: boolean; report: string } {
  const issues: string[] = [];
  const timezone = weather.timezone;
  const offset = weather.utcOffsetSeconds;

  if (!timezone) issues.push('timezone exists: missing');
  if (offset === undefined || offset === null) issues.push('utc_offset_seconds exists: missing');
  if (!Array.isArray(hourlyData) || hourlyData.length === 0) issues.push('hourly.time exists: missing or empty');

  let prevTime = 0;
  for (let i = 0; i < hourlyData.length; i++) {
    const pt = hourlyData[i];
    const tMs = pt.isoTimestamp ? new Date(pt.isoTimestamp).getTime() : 0;
    if (tMs <= prevTime && i > 0) {
      issues.push(`timestamps are chronological & unique: violation at index ${i} (${pt.localTime})`);
    }
    prevTime = tMs;
  }

  const pass = issues.length === 0;
  const report = pass ? 'WEATHER TIME VALIDATION: PASS' : `WEATHER TIME VALIDATION: FAIL\nissues: ${issues.join(', ')}\ntimezone: ${timezone}\noffset: ${offset}`;
  console.log(report);
  return { pass, report };
}

// -------------------------------------------------------------
// Main Component
// -------------------------------------------------------------
export const WeatherView: React.FC<WeatherViewProps> = ({
  weather,
  currentFarm,
  onRefreshWeather,
  language,
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [metricMode, setMetricMode] = useState<MetricMode>('temp');
  const [selectedHourIndex, setSelectedHourIndex] = useState<number>(0);
  const [currentTick, setCurrentTick] = useState<number>(() => Date.now());

  const hourlyStripRef = useRef<HTMLDivElement>(null);
  const t = getTranslation(language);
  const weatherUi = getWeatherUIStrings(language);

  // Periodic timer to keep farm time and NOW indicator live as real-world time progresses
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTick(Date.now());
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  // Build or format 24-hour time series from real provider data (no synthetic values)
  const hourlyData: HourlyForecastPoint[] = useMemo(() => {
    if (weather.status === 'UNAVAILABLE') {
      return [];
    }
    if (Array.isArray(weather.hourlyForecast) && weather.hourlyForecast.length > 0) {
      return weather.hourlyForecast;
    }
    return [];
  }, [weather.status, weather.hourlyForecast]);

  // Selected hour index within range - strictly matches real current instant in active farm timezone
  const nowIndex = useMemo(() => {
    if (!hourlyData || hourlyData.length === 0) return 0;
    return computeCurrentFarmHourIndex(hourlyData, weather.timezone, weather.utcOffsetSeconds);
  }, [hourlyData, weather.timezone, weather.utcOffsetSeconds, currentTick]);

  // Reset/recalculate selection to NOW point when data loads, farm changes, or weather refreshes
  useEffect(() => {
    setSelectedHourIndex(nowIndex);
  }, [nowIndex, currentFarm.id, weather.latitude, weather.longitude, weather.fetchedAt]);

  // Active selected point (synced across Current Card, Hourly Strip, Graph, and Telemetry)
  const selectedPoint = hourlyData[selectedHourIndex] || hourlyData[0] || null;

  // Live formatted farm time from active farm timezone
  const liveFarmTime = useMemo(() => {
    const now = new Date();
    if (weather.timezone) {
      try {
        const langLocale = language || 'en';
        const fmt = new Intl.DateTimeFormat(langLocale, {
          timeZone: weather.timezone,
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        });
        const formatted = fmt.format(now);
        return localizeTimeDisplay(formatted, language);
      } catch {
        // fallback
      }
    }
    const raw = formatLocalTimeStandard(weather.currentLocalTime, weather.currentLocalHour);
    return localizeTimeDisplay(raw, language);
  }, [weather.timezone, weather.currentLocalTime, weather.currentLocalHour, currentTick, language]);

  // [WEATHER CURRENT HOUR DEBUG] & Global Context Logging as required
  useEffect(() => {
    const now = new Date();
    const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'unknown';
    const currentInstantUTC = now.toISOString();
    
    let farmLocalDateStr = '';
    let farmLocalFormattedTime = '';
    let farmLocalHour = 0;

    if (weather.timezone) {
      try {
        const fmt = new Intl.DateTimeFormat('en-US', {
          timeZone: weather.timezone,
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        });
        const parts = fmt.formatToParts(now);
        const getP = (type: string) => parts.find(p => p.type === type)?.value || '';
        const yr = getP('year');
        const mo = getP('month');
        const da = getP('day');
        let hr = parseInt(getP('hour'), 10);
        if (hr === 24) hr = 0;
        if (!isNaN(hr)) farmLocalHour = hr;
        if (yr && mo && da) farmLocalDateStr = `${yr}-${mo}-${da}`;
        
        const h12 = farmLocalHour % 12 === 0 ? 12 : farmLocalHour % 12;
        const ampm = farmLocalHour >= 12 ? 'PM' : 'AM';
        farmLocalFormattedTime = `${h12}:${getP('minute')} ${ampm}`;
      } catch {
        farmLocalFormattedTime = now.toUTCString();
      }
    }

    console.log('[WEATHER CURRENT HOUR DEBUG]', {
      realUtc: currentInstantUTC,
      farmTimezone: weather.timezone || 'Asia/Kolkata',
      farmLocalDate: farmLocalDateStr,
      farmLocalTime: farmLocalFormattedTime,
      farmLocalHour,
      apiTimezone: weather.timezone,
      apiCurrentTime: weather.currentLocalTime,
      selectedObservationTime: selectedPoint?.displayTime12 || selectedPoint?.time || '',
      selectedObservationIndex: selectedHourIndex,
    });

    console.log('[GLOBAL WEATHER TIME DEBUG]', {
      countryCode: currentFarm.country || 'unknown',
      farmId: currentFarm.id || 'unknown',
      latitude: weather.latitude,
      longitude: weather.longitude,
      farmTimezone: weather.timezone || 'unknown',
      providerTimezone: weather.timezone || 'unknown',
      utcOffsetSeconds: weather.utcOffsetSeconds ?? 'unknown',
      browserTimezone,
      currentInstantUTC,
      farmLocalDate: farmLocalDateStr,
      farmLocalTime: farmLocalFormattedTime,
      farmLocalHour,
      selectedWeatherTimestamp: selectedPoint?.isoTimestamp || selectedPoint?.localTime || '',
      selectedWeatherIndex: selectedHourIndex,
    });
  }, [weather, currentFarm, selectedHourIndex, selectedPoint, currentTick]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    if (onRefreshWeather) {
      onRefreshWeather();
    }
    setTimeout(() => setIsRefreshing(false), 800);
  };

  // Weather icon helper
  const getWeatherIcon = (cond?: string, className = 'w-6 h-6') => {
    const lower = (cond || '').toLowerCase();
    if (lower.includes('thunder') || lower.includes('lightning') || lower.includes('storm')) {
      return <CloudLightning className={`${className} text-amber-500`} />;
    }
    if (lower.includes('rain') || lower.includes('shower') || lower.includes('drizzle')) {
      return <CloudRain className={`${className} text-sky-400`} />;
    }
    if (lower.includes('cloud') || lower.includes('overcast') || lower.includes('fog')) {
      return <CloudSun className={`${className} text-stone-400 dark:text-stone-300`} />;
    }
    return <Sun className={`${className} text-amber-400`} />;
  };

  const getTimeOfDayIcon = (timeOfDay?: string, className = 'w-4 h-4') => {
    switch (timeOfDay) {
      case 'Morning':
        return <Sunrise className={`${className} text-amber-500`} />;
      case 'Afternoon':
        return <Sun className={`${className} text-orange-500`} />;
      case 'Evening':
        return <Sunset className={`${className} text-rose-500`} />;
      default:
        return <Moon className={`${className} text-indigo-400`} />;
    }
  };

  // Chart min/max scaling calculations
  const chartMetrics = useMemo(() => {
    if (!hourlyData || hourlyData.length === 0) {
      return { min: 0, max: 40, values: [] };
    }

    let values: number[] = [];
    if (metricMode === 'temp') {
      values = hourlyData.map((d) => d.temp);
    } else if (metricMode === 'precip') {
      values = hourlyData.map((d) => d.rainProb);
    } else if (metricMode === 'humidity') {
      values = hourlyData.map((d) => d.humidity);
    } else {
      values = hourlyData.map((d) => d.windSpeedKmh);
    }

    const minRaw = Math.min(...values);
    const maxRaw = Math.max(...values);
    const padding = metricMode === 'temp' ? 2 : metricMode === 'precip' || metricMode === 'humidity' ? 10 : 3;
    const min = Math.max(0, Math.floor(minRaw - padding));
    const max = Math.ceil(maxRaw + padding);

    return { min, max: Math.max(max, min + 1), values };
  }, [hourlyData, metricMode]);

  // SVG Chart Geometry
  const svgWidth = 800;
  const svgHeight = 200;
  const paddingX = 40;
  const paddingY = 24;
  const plotWidth = svgWidth - paddingX * 2;
  const plotHeight = svgHeight - paddingY * 2;

  const points = useMemo(() => {
    if (!chartMetrics.values.length) return [];
    const count = chartMetrics.values.length;
    const range = chartMetrics.max - chartMetrics.min || 1;

    return chartMetrics.values.map((val, idx) => {
      const x = paddingX + (idx / (count - 1)) * plotWidth;
      const normalizedY = (val - chartMetrics.min) / range;
      const y = paddingY + plotHeight - normalizedY * plotHeight;
      return { x, y, val, data: hourlyData[idx], idx };
    });
  }, [chartMetrics, hourlyData, plotWidth, plotHeight, paddingX, paddingY]);

  // Run runtime validation routine on data load and check consistency
  useEffect(() => {
    if (hourlyData.length > 0 && selectedPoint) {
      validateWeatherTimePipeline(weather, hourlyData);
      
      const graphSelectedPoint = points.find(p => p.idx === selectedHourIndex)?.data;
      const hourlySelectedPoint = hourlyData[selectedHourIndex];

      if (graphSelectedPoint && hourlySelectedPoint && graphSelectedPoint.isoTimestamp !== hourlySelectedPoint.isoTimestamp) {
        console.error("[WEATHER PIPELINE CONSISTENCY FAILURE]", {
          cardTimestamp: selectedPoint.isoTimestamp,
          graphTimestamp: graphSelectedPoint.isoTimestamp,
          hourlyTimestamp: hourlySelectedPoint.isoTimestamp,
        });
      } else {
        console.log("[WEATHER PIPELINE CONSISTENCY]", {
          status: "PASS",
          activeFarmId: currentFarm.id,
          activeFarmLat: currentFarm.latitude,
          activeFarmLon: currentFarm.longitude,
          weatherLat: weather.latitude,
          weatherLon: weather.longitude,
          timezone: weather.timezone,
          selectedTimestamp: selectedPoint.isoTimestamp,
          selectedDisplayTime: selectedPoint.displayTime12,
        });
      }
    }
  }, [weather, hourlyData, selectedPoint, selectedHourIndex, points, currentFarm]);

  // Generate SVG path string with smooth curves
  const linePath = useMemo(() => {
    if (points.length === 0) return '';
    return points.reduce((acc, pt, idx, arr) => {
      if (idx === 0) return `M ${pt.x} ${pt.y}`;
      const prev = arr[idx - 1];
      const cpX1 = prev.x + (pt.x - prev.x) / 2;
      const cpY1 = prev.y;
      const cpX2 = prev.x + (pt.x - prev.x) / 2;
      const cpY2 = pt.y;
      return `${acc} C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${pt.x} ${pt.y}`;
    }, '');
  }, [points]);

  const areaPath = useMemo(() => {
    if (!linePath || points.length === 0) return '';
    const first = points[0];
    const last = points[points.length - 1];
    const bottomY = paddingY + plotHeight;
    return `${linePath} L ${last.x} ${bottomY} L ${first.x} ${bottomY} Z`;
  }, [linePath, points, paddingY, plotHeight]);

  // Dynamic status evaluation for selected hour (Localized)
  const tempEval = selectedPoint ? getLocalizedTemperatureStatus(selectedPoint.temp, language) : getLocalizedTemperatureStatus(28, language);
  const rainEval = selectedPoint ? getLocalizedRainStatus(selectedPoint.rainProb, language) : getLocalizedRainStatus(10, language);
  const humEval = selectedPoint ? getLocalizedHumidityStatus(selectedPoint.humidity, language) : getLocalizedHumidityStatus(50, language);
  const windEval = selectedPoint ? getLocalizedWindStatus(selectedPoint.windSpeedKmh, language) : getLocalizedWindStatus(10, language);

  // Dynamic Actionable Guidance for the selected point (Fully Localized for selected language)
  const farmGuidance = useMemo(() => {
    return getLocalizedFarmGuidance(selectedPoint, language);
  }, [selectedPoint, language]);

  // "Today's Weather Story" breakdown generated from the 24-hour dataset (Fully Localized)
  const weatherStory = useMemo(() => {
    return getLocalizedWeatherStory(hourlyData, language);
  }, [hourlyData, language]);

  // Daily Forecast list
  const dailyForecast = weather.dailyForecast && weather.dailyForecast.length > 0
    ? weather.dailyForecast
    : weather.forecast;

  useEffect(() => {
    if (dailyForecast && dailyForecast.length > 0) {
      console.log('[DAILY WEATHER DEBUG - FRONTEND]', {
        farmId: currentFarm.id,
        latitude: weather.latitude ?? currentFarm.latitude,
        longitude: weather.longitude ?? currentFarm.longitude,
        timezone: weather.timezone,
        dailyForecastCount: dailyForecast.length,
        forecast: dailyForecast,
      });
    }
  }, [dailyForecast, currentFarm.id, weather.latitude, weather.longitude, weather.timezone]);

  // Clean UNAVAILABLE state if farm coordinates are missing or weather is unavailable
  if (weather.status === 'UNAVAILABLE') {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-12 text-center space-y-5">
        <div className="w-16 h-16 rounded-3xl bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400 flex items-center justify-center mx-auto shadow-sm">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <div className="space-y-2 max-w-lg mx-auto">
          <h2 className="font-heading text-xl font-bold text-stone-900 dark:text-stone-100">
            {weather.statusMessage || weatherUi.farmCoordinatesRequired}
          </h2>
          <p className="text-sm text-stone-600 dark:text-stone-400">
            {weatherUi.coordinatesNotice}
          </p>
        </div>
        <div className="pt-3">
          <button
            type="button"
            onClick={onRefreshWeather}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-sm transition-colors cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>{weatherUi.retryTelemetry}</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-6 sm:space-y-8 min-w-0">
      {/* 1. VIEW HEADER */}
      <div className="bg-white dark:bg-[#0c1a12] rounded-3xl border border-stone-200/80 dark:border-emerald-950/80 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-700 text-white flex items-center justify-center shrink-0 shadow-md shadow-sky-950/20">
            <CloudSun className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-heading text-xl sm:text-2xl font-black text-stone-900 dark:text-stone-100 tracking-tight">
                {weatherUi.weatherTitle}
              </h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold border border-emerald-300 dark:border-emerald-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>{weatherUi.liveBadge}</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-0.5 truncate">
              {weatherUi.farmLabel}: <strong className="text-stone-700 dark:text-stone-200">{currentFarm.name}</strong> • {formatFarmLocation(currentFarm.location || currentFarm.district, currentFarm.stateRegion || currentFarm.state, language) || currentFarm.location || ''} ({localizeCountry(currentFarm.country, language)}) • {weatherUi.cropLabel}: <span className="font-semibold text-emerald-700 dark:text-emerald-400">{localizeCrop(currentFarm.crop, language)}</span>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-900/80 text-stone-600 dark:text-stone-400 text-xs border border-stone-200 dark:border-stone-800">
            <Clock className="w-3.5 h-3.5 text-stone-400" />
            <span>{weatherUi.farmTime}: <strong>{liveFarmTime || localizeTimeDisplay(formatLocalTimeStandard(weather.currentLocalTime, weather.currentLocalHour), language) || weatherUi.live}</strong></span>
            {weather.timezone && <span className="text-[10px] text-stone-400">({weather.timezone})</span>}
          </div>

          <button
            type="button"
            id="weather-refresh-btn"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 active:scale-98 text-white text-xs font-bold shadow-sm shadow-sky-950/20 transition-all cursor-pointer min-h-[40px]"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? weatherUi.syncing : weatherUi.refreshWeather}</span>
          </button>
        </div>
      </div>

      {/* 2. CURRENT WEATHER SNAPSHOT (HERO CARD) */}
      <div className="bg-gradient-to-br from-[#0c2838] via-[#091f2c] to-[#06151e] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-sky-900/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Main Temperature & Condition (Left 5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs text-sky-200 font-medium">
              <Compass className="w-3.5 h-3.5 text-sky-300" />
              <span>
                {weatherUi.observedAt} {localizeTimeDisplay(selectedPoint?.displayTime12 || selectedPoint?.time || formatLocalTimeStandard(weather.currentLocalTime, weather.currentLocalHour), language) || weatherUi.live} ({weatherUi.localFarmTime}) • {formatFarmLocation(currentFarm.location || currentFarm.district || weather.location, currentFarm.stateRegion || currentFarm.state, language) || weather.location}
              </span>
            </div>

            <div className="flex items-baseline gap-4">
              <span className="font-heading text-6xl sm:text-7xl font-black tracking-tighter text-white">
                {selectedPoint?.temp !== undefined ? `${selectedPoint.temp}°C` : weather.temperature}
              </span>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2 text-lg sm:text-xl font-bold text-sky-100">
                  {getWeatherIcon(selectedPoint?.condition || weather.condition, 'w-6 h-6')}
                  <span>{localizeWeatherCondition(selectedPoint?.condition || weather.condition, language)}</span>
                </div>
                <div className="text-xs text-sky-300/90 font-medium">
                  {weatherUi.cropStage}: <span className="text-white font-bold">{localizeGrowthStage(currentFarm.growthStage || 'Vegetative', language)}</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-sky-200/90 leading-relaxed max-w-md">
              {weatherUi.weatherTapHint}
            </p>
          </div>

          {/* Current Quick Telemetry Grid (Right 7 Cols) */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Temperature & Feels */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 hover:bg-white/15 transition-colors">
              <div className="flex items-center gap-1.5 text-sky-200 text-xs font-semibold mb-1.5">
                <Thermometer className="w-4 h-4 text-amber-300 shrink-0" />
                <span>{weatherUi.temperature}</span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-white">
                {selectedPoint?.temp !== undefined ? `${selectedPoint.temp}°C` : weather.temperature}
              </div>
              <div className="text-[10px] text-amber-300 mt-1 font-medium">
                {getLocalizedTemperatureStatus(selectedPoint?.temp ?? weather.tempValue ?? 28, language).label}
              </div>
            </div>

            {/* Rain chance */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 hover:bg-white/15 transition-colors">
              <div className="flex items-center gap-1.5 text-sky-200 text-xs font-semibold mb-1.5">
                <CloudRain className="w-4 h-4 text-sky-300 shrink-0" />
                <span>{weatherUi.rainChance}</span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-white">
                {selectedPoint?.rainProb !== undefined ? `${selectedPoint.rainProb}%` : (hourlyData[0]?.rainProb !== undefined ? `${hourlyData[0].rainProb}%` : '10%')}
              </div>
              <div className="text-[10px] text-sky-300 mt-1">
                {getLocalizedRainStatus(selectedPoint?.rainProb ?? hourlyData[0]?.rainProb ?? 10, language).label}
              </div>
            </div>

            {/* Humidity */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 hover:bg-white/15 transition-colors">
              <div className="flex items-center gap-1.5 text-sky-200 text-xs font-semibold mb-1.5">
                <Droplets className="w-4 h-4 text-sky-300 shrink-0" />
                <span>{weatherUi.humidity}</span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-white">
                {selectedPoint?.humidity !== undefined ? `${selectedPoint.humidity}%` : weather.humidity}
              </div>
              <div className="text-[10px] text-emerald-300 mt-1 font-medium">
                {getLocalizedHumidityStatus(selectedPoint?.humidity ?? weather.humidityValue ?? 60, language).label}
              </div>
            </div>

            {/* Wind */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 hover:bg-white/15 transition-colors">
              <div className="flex items-center gap-1.5 text-sky-200 text-xs font-semibold mb-1.5">
                <Wind className="w-4 h-4 text-sky-300 shrink-0" />
                <span>{weatherUi.wind}</span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-white">
                {selectedPoint?.windSpeedKmh !== undefined ? localizeWindSpeed(`${selectedPoint.windSpeedKmh} km/h`, language) : localizeWindSpeed(weather.wind, language)}
              </div>
              <div className="text-[10px] text-emerald-300 mt-1 font-medium">
                {getLocalizedWindStatus(selectedPoint?.windSpeedKmh ?? weather.windSpeedKmh ?? 12, language).label}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. INTERACTIVE 24-HOUR HOURLY TIMELINE STRIP */}
      <div className="bg-white dark:bg-[#0c1a12] rounded-3xl border border-stone-200/80 dark:border-emerald-950/80 p-5 sm:p-6 shadow-xs space-y-3 transition-colors">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <h2 className="font-heading text-sm sm:text-base font-bold text-stone-900 dark:text-stone-100">
              {weatherUi.hourlyStripTitle}
            </h2>
          </div>
          <span className="text-[11px] text-stone-500 dark:text-stone-400 font-medium">
            {weatherUi.twentyFourHourForecast}
          </span>
        </div>

        {/* Scrollable Hourly Cards Row */}
        <div
          ref={hourlyStripRef}
          className="flex items-center gap-2.5 overflow-x-auto pb-2 pt-1 scrollbar-thin scrollbar-thumb-stone-300 dark:scrollbar-thumb-stone-700 touch-pan-x"
        >
          {hourlyData.map((hour, idx) => {
            const isSelected = selectedHourIndex === idx;
            const isNow = hour.isNow || idx === nowIndex;
            return (
              <button
                key={idx}
                type="button"
                id={`weather-hour-btn-${idx}`}
                onClick={() => setSelectedHourIndex(idx)}
                className={`flex-shrink-0 w-24 p-3 rounded-2xl text-center border transition-all cursor-pointer flex flex-col items-center gap-1.5 select-none ${
                  isSelected
                    ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-900/30 scale-102 font-bold ring-2 ring-emerald-400'
                    : isNow
                    ? 'bg-sky-50 dark:bg-sky-950/40 text-stone-800 dark:text-stone-200 border-sky-300 dark:border-sky-800 hover:border-emerald-500'
                    : 'bg-stone-50/80 dark:bg-stone-900/60 text-stone-700 dark:text-stone-300 border-stone-200/80 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-800/80 hover:border-emerald-500/60'
                }`}
              >
                <div className="flex items-center gap-1">
                  <span className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-stone-900 dark:text-stone-100'}`}>
                    {localizeTimeDisplay(hour.displayTime12 || formatHour12(hour.time), language)}
                  </span>
                  {isNow && (
                    <span
                      className={`text-[9px] px-1 py-0.2 rounded font-extrabold uppercase ${
                        isSelected ? 'bg-white text-emerald-800' : 'bg-sky-600 text-white'
                      }`}
                    >
                      {weatherUi.nowLabel}
                    </span>
                  )}
                </div>

                <div className="my-0.5">
                  {getWeatherIcon(hour.condition, isSelected ? 'w-5 h-5 text-white' : 'w-5 h-5')}
                </div>

                <div className={`text-sm font-extrabold ${isSelected ? 'text-white' : 'text-stone-900 dark:text-stone-100'}`}>
                  {hour.temp}°
                </div>

                <div
                  className={`text-[10px] font-semibold flex items-center gap-0.5 ${
                    isSelected ? 'text-emerald-100' : hour.rainProb >= 40 ? 'text-blue-600 dark:text-blue-400' : 'text-stone-500 dark:text-stone-400'
                  }`}
                >
                  <CloudRain className="w-2.5 h-2.5" />
                  <span>{hour.rainProb}%</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. MAIN INTERACTIVE GRAPH & CONTROLS */}
      <div className="bg-white dark:bg-[#0c1a12] rounded-3xl border border-stone-200/80 dark:border-emerald-950/80 p-5 sm:p-7 shadow-xs space-y-5 transition-colors">
        {/* Graph Header + Metric Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-stone-100 dark:border-emerald-950/60">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-sky-600 dark:text-sky-400" />
              <h2 className="font-heading text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100">
                {weatherUi.weatherTrendGraph}
              </h2>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              {weatherUi.clickGraphHint}
            </p>
          </div>

          {/* Metric Selector Tabs with Simple Farmer Icons & Names */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-stone-100 dark:bg-stone-900/80 rounded-2xl border border-stone-200 dark:border-stone-800 self-start sm:self-auto">
            <button
              type="button"
              id="chart-metric-temp"
              onClick={() => setMetricMode('temp')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                metricMode === 'temp'
                  ? 'bg-white dark:bg-stone-800 text-amber-600 dark:text-amber-400 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              <span>🌡️ {weatherUi.temperature}</span>
            </button>

            <button
              type="button"
              id="chart-metric-precip"
              onClick={() => setMetricMode('precip')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                metricMode === 'precip'
                  ? 'bg-white dark:bg-stone-800 text-sky-600 dark:text-sky-400 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              <span>🌧️ {weatherUi.rainChance}</span>
            </button>

            <button
              type="button"
              id="chart-metric-humidity"
              onClick={() => setMetricMode('humidity')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                metricMode === 'humidity'
                  ? 'bg-white dark:bg-stone-800 text-emerald-600 dark:text-emerald-400 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              <span>💧 {weatherUi.humidity}</span>
            </button>

            <button
              type="button"
              id="chart-metric-wind"
              onClick={() => setMetricMode('wind')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                metricMode === 'wind'
                  ? 'bg-white dark:bg-stone-800 text-purple-600 dark:text-purple-400 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
              }`}
            >
              <span>💨 {weatherUi.wind}</span>
            </button>
          </div>
        </div>

        {/* SVG High-Precision Time Series Chart */}
        <div className="relative w-full overflow-x-auto sm:overflow-x-hidden scrollbar-thin">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-[650px] sm:w-full h-64 sm:h-64 select-none touch-pan-x min-w-[650px] sm:min-w-0"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
              </linearGradient>
              <linearGradient id="precipGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0284c7" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#0284c7" stopOpacity="0.0" />
              </linearGradient>
              <linearGradient id="humidityGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
              </linearGradient>
              <linearGradient id="windGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Horizontal Gridlines */}
            {[0, 0.33, 0.66, 1].map((ratio, i) => {
              const y = paddingY + plotHeight * (1 - ratio);
              const val = Math.round(chartMetrics.min + ratio * (chartMetrics.max - chartMetrics.min));
              return (
                <g key={i}>
                  <line
                    x1={paddingX}
                    y1={y}
                    x2={svgWidth - paddingX}
                    y2={y}
                    stroke="currentColor"
                    strokeDasharray="3 3"
                    className="text-stone-200 dark:text-stone-800"
                    strokeWidth="1"
                  />
                  <text
                    x={paddingX - 8}
                    y={y + 4}
                    textAnchor="end"
                    className="text-[10px] fill-stone-400 dark:fill-stone-500 font-mono"
                  >
                    {val}
                    {metricMode === 'temp' ? '°' : metricMode === 'precip' || metricMode === 'humidity' ? '%' : ''}
                  </text>
                </g>
              );
            })}

            {/* Area Fill */}
            <path
              d={areaPath}
              fill={
                metricMode === 'temp'
                  ? 'url(#tempGradient)'
                  : metricMode === 'precip'
                  ? 'url(#precipGradient)'
                  : metricMode === 'humidity'
                  ? 'url(#humidityGradient)'
                  : 'url(#windGradient)'
              }
            />

            {/* Primary Curve Line */}
            <path
              d={linePath}
              fill="none"
              stroke={
                metricMode === 'temp'
                  ? '#f59e0b'
                  : metricMode === 'precip'
                  ? '#0284c7'
                  : metricMode === 'humidity'
                  ? '#10b981'
                  : '#8b5cf6'
              }
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Selected Hour Vertical Indicator Line */}
            {points[selectedHourIndex] && (
              <g>
                <line
                  x1={points[selectedHourIndex].x}
                  y1={paddingY - 5}
                  x2={points[selectedHourIndex].x}
                  y2={paddingY + plotHeight}
                  stroke="#10b981"
                  strokeWidth="2"
                  strokeDasharray="4 3"
                />
                {/* Highlighted point halo */}
                <circle
                  cx={points[selectedHourIndex].x}
                  cy={points[selectedHourIndex].y}
                  r="8"
                  className="fill-emerald-500/30"
                />
                <circle
                  cx={points[selectedHourIndex].x}
                  cy={points[selectedHourIndex].y}
                  r="5"
                  className="fill-emerald-600"
                  stroke="#ffffff"
                  strokeWidth="2"
                />
              </g>
            )}

            {/* Interactive Targets & X-Axis Time Labels */}
            {points.map((pt, idx) => {
              const isSelected = selectedHourIndex === idx;
              return (
                <g
                  key={idx}
                  onClick={() => setSelectedHourIndex(idx)}
                  className="cursor-pointer"
                >
                  {/* Invisible wide hit area */}
                  <rect
                    x={pt.x - 14}
                    y={paddingY}
                    width="28"
                    height={plotHeight}
                    fill="transparent"
                  />

                  {/* Standard dot if not selected */}
                  {!isSelected && (
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r="2.5"
                      className="fill-stone-400 dark:fill-stone-600 hover:fill-emerald-500 transition-colors"
                      stroke="#ffffff"
                      strokeWidth="1"
                    />
                  )}

                  {/* X Axis Time Labels (Every 3 hours) */}
                  {idx % 3 === 0 && (
                    <text
                      x={pt.x}
                      y={svgHeight - 4}
                      textAnchor="middle"
                      className={`text-[10px] font-sans font-semibold ${
                        isSelected
                          ? 'fill-emerald-600 dark:fill-emerald-400 font-bold text-xs'
                          : 'fill-stone-500 dark:fill-stone-400'
                      }`}
                    >
                      {localizeTimeDisplay(pt.data.displayTime12 || formatHour12(pt.data.time), language)}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* 5. SELECTED TIMELINE HOUR DETAILS & ACTIONABLE FARM GUIDANCE */}
      {selectedPoint && (
        <div className="bg-white dark:bg-[#0c1a12] rounded-3xl border-2 border-emerald-500/80 dark:border-emerald-700/80 p-6 sm:p-8 shadow-md space-y-6 transition-colors">
          {/* Top Selection Header with Navigation Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-stone-200 dark:border-emerald-950/80">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 flex items-center justify-center font-black text-base border border-emerald-300 dark:border-emerald-800 shrink-0">
                {localizeTimeDisplay(selectedPoint.displayTime12 || formatHour12(selectedPoint.time), language)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-heading text-lg sm:text-xl font-bold text-stone-900 dark:text-stone-100">
                    {weatherUi.selectedHour}: {localizeTimeDisplay(selectedPoint.displayTime12 || formatHour12(selectedPoint.time), language)}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-semibold">
                    {getTimeOfDayIcon(selectedPoint.timeOfDay)}
                    <span>{localizeTimeOfDay(selectedPoint.timeOfDay, language)}</span>
                  </span>
                  {selectedHourIndex === nowIndex && (
                    <span className="px-2 py-0.5 rounded-full bg-sky-600 text-white text-[10px] font-bold">
                      {weatherUi.currentTimeNow}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                  <span className="font-medium text-stone-700 dark:text-stone-300 flex items-center gap-1">
                    {getWeatherIcon(selectedPoint.condition, 'w-3.5 h-3.5')}
                    {localizeWeatherCondition(selectedPoint.condition, language)}
                  </span>
                  <span>•</span>
                  <span>{formatFarmLocation(currentFarm.location || currentFarm.district, currentFarm.stateRegion || currentFarm.state, language) || currentFarm.location}</span>
                </div>
              </div>
            </div>

            {/* Quick Step Controls (Prev / Next Hour) */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                type="button"
                id="weather-prev-hour-btn"
                disabled={selectedHourIndex <= 0}
                onClick={() => setSelectedHourIndex((prev) => Math.max(0, prev - 1))}
                className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/80 hover:text-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                title={weatherUi.prevHour}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                type="button"
                id="weather-now-btn"
                onClick={() => setSelectedHourIndex(nowIndex)}
                className="px-3 py-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-bold text-xs hover:bg-emerald-200 transition-colors cursor-pointer"
              >
                {weatherUi.jumpToNow}
              </button>

              <button
                type="button"
                id="weather-next-hour-btn"
                disabled={selectedHourIndex >= hourlyData.length - 1}
                onClick={() => setSelectedHourIndex((prev) => Math.min(hourlyData.length - 1, prev + 1))}
                className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/80 hover:text-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                title={weatherUi.nextHour}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Plain-Language Metric Interpretation Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            {/* Temperature */}
            <div className="bg-stone-50/90 dark:bg-stone-900/80 p-4 rounded-2xl border border-stone-200/80 dark:border-stone-800 space-y-1">
              <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
                <span className="flex items-center gap-1 font-semibold">
                  <Thermometer className="w-3.5 h-3.5 text-amber-500" />
                  {weatherUi.temperature}
                </span>
                <span className={`px-2 py-0.2 rounded text-[10px] font-bold ${tempEval.bg} ${tempEval.color}`}>
                  {tempEval.label}
                </span>
              </div>
              <div className="text-2xl font-black text-stone-900 dark:text-stone-100">
                {selectedPoint.temp}°C
              </div>
              <div className="text-[11px] text-stone-500 dark:text-stone-400">
                {weatherUi.feelsLike}: <strong className="text-stone-700 dark:text-stone-300">{selectedPoint.apparentTemp ?? selectedPoint.temp}°C</strong>
              </div>
            </div>

            {/* Rain Chance */}
            <div className="bg-stone-50/90 dark:bg-stone-900/80 p-4 rounded-2xl border border-stone-200/80 dark:border-stone-800 space-y-1">
              <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
                <span className="flex items-center gap-1 font-semibold">
                  <CloudRain className="w-3.5 h-3.5 text-sky-500" />
                  {weatherUi.rainChance}
                </span>
                <span className={`px-2 py-0.2 rounded text-[10px] font-bold ${rainEval.bg} ${rainEval.color}`}>
                  {rainEval.label}
                </span>
              </div>
              <div className="text-2xl font-black text-stone-900 dark:text-stone-100">
                {selectedPoint.rainProb}%
              </div>
              <div className="text-[11px] text-stone-500 dark:text-stone-400">
                {weatherUi.rainfall} <strong className="text-stone-700 dark:text-stone-300">{selectedPoint.rainfallMm} mm</strong>
              </div>
            </div>

            {/* Humidity */}
            <div className="bg-stone-50/90 dark:bg-stone-900/80 p-4 rounded-2xl border border-stone-200/80 dark:border-stone-800 space-y-1">
              <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
                <span className="flex items-center gap-1 font-semibold">
                  <Droplets className="w-3.5 h-3.5 text-emerald-500" />
                  {weatherUi.humidity}
                </span>
                <span className={`px-2 py-0.2 rounded text-[10px] font-bold ${humEval.bg} ${humEval.color}`}>
                  {humEval.label}
                </span>
              </div>
              <div className="text-2xl font-black text-stone-900 dark:text-stone-100">
                {selectedPoint.humidity}%
              </div>
              <div className="text-[11px] text-stone-500 dark:text-stone-400">
                {weatherUi.dewPoint}: <strong className="text-stone-700 dark:text-stone-300">{selectedPoint.dewPoint ?? Math.round(selectedPoint.temp - 4)}°C</strong>
              </div>
            </div>

            {/* Wind */}
            <div className="bg-stone-50/90 dark:bg-stone-900/80 p-4 rounded-2xl border border-stone-200/80 dark:border-stone-800 space-y-1">
              <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
                <span className="flex items-center gap-1 font-semibold">
                  <Wind className="w-3.5 h-3.5 text-purple-500" />
                  {weatherUi.wind}
                </span>
                <span className={`px-2 py-0.2 rounded text-[10px] font-bold ${windEval.bg} ${windEval.color}`}>
                  {windEval.label}
                </span>
              </div>
              <div className="text-2xl font-black text-stone-900 dark:text-stone-100">
                {selectedPoint.windSpeedKmh} <span className="text-sm font-normal text-stone-500">km/h</span>
              </div>
              <div className="text-[11px] text-stone-500 dark:text-stone-400">
                {weatherUi.waterLoss}: <strong className="text-stone-700 dark:text-stone-300">{selectedPoint.evapotranspiration ?? 0.25} mm/h</strong>
              </div>
            </div>
          </div>

          {/* Plain Language Farm Advice Summary Banner */}
          <div className="bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <span className="font-heading font-bold text-xs uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                {weatherUi.farmAdviceFor} {localizeTimeDisplay(selectedPoint.displayTime12 || formatHour12(selectedPoint.time), language)} ({localizeTimeOfDay(selectedPoint.timeOfDay, language)})
              </span>
              <p className="text-sm font-medium text-emerald-950 dark:text-emerald-100 leading-relaxed">
                "{farmGuidance.overallAdvice}"
              </p>
            </div>
          </div>

          {/* Farming Actions Decision Matrix for Selected Hour */}
          <div>
            <h3 className="font-heading text-sm font-bold text-stone-900 dark:text-stone-100 mb-3 flex items-center gap-2">
              <Tractor className="w-4 h-4 text-emerald-600" />
              {weatherUi.farmingOperationsCheck} {localizeTimeDisplay(selectedPoint.displayTime12 || formatHour12(selectedPoint.time), language)}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {/* Field Work */}
              <div className="p-4 rounded-2xl bg-stone-50/80 dark:bg-stone-900/60 border border-stone-200/80 dark:border-stone-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                    <Tractor className="w-3.5 h-3.5 text-stone-500" />
                    {weatherUi.fieldWork}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      farmGuidance.fieldWork.tone === 'good'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : farmGuidance.fieldWork.tone === 'caution'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        : 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                    }`}
                  >
                    {farmGuidance.fieldWork.status}
                  </span>
                </div>
                <p className="text-[11px] text-stone-600 dark:text-stone-400 leading-relaxed">
                  {farmGuidance.fieldWork.reason}
                </p>
              </div>

              {/* Spraying Conditions */}
              <div className="p-4 rounded-2xl bg-stone-50/80 dark:bg-stone-900/60 border border-stone-200/80 dark:border-stone-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-stone-500" />
                    {weatherUi.spraying}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      farmGuidance.spraying.tone === 'good'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : farmGuidance.spraying.tone === 'caution'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        : 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                    }`}
                  >
                    {farmGuidance.spraying.status}
                  </span>
                </div>
                <p className="text-[11px] text-stone-600 dark:text-stone-400 leading-relaxed">
                  {farmGuidance.spraying.reason}
                </p>
              </div>

              {/* Watering Outlook */}
              <div className="p-4 rounded-2xl bg-stone-50/80 dark:bg-stone-900/60 border border-stone-200/80 dark:border-stone-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                    <Droplets className="w-3.5 h-3.5 text-sky-500" />
                    {weatherUi.watering}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      farmGuidance.irrigation.tone === 'good'
                        ? 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    }`}
                  >
                    {farmGuidance.irrigation.status}
                  </span>
                </div>
                <p className="text-[11px] text-stone-600 dark:text-stone-400 leading-relaxed">
                  {farmGuidance.irrigation.reason}
                </p>
                <div className="text-[9px] text-stone-400 italic pt-1">
                  {weatherUi.weatherBasedEstimate}
                </div>
              </div>

              {/* Harvesting */}
              <div className="p-4 rounded-2xl bg-stone-50/80 dark:bg-stone-900/60 border border-stone-200/80 dark:border-stone-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                    <Sprout className="w-3.5 h-3.5 text-amber-500" />
                    {weatherUi.harvesting}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      farmGuidance.harvesting.tone === 'good'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    }`}
                  >
                    {farmGuidance.harvesting.status}
                  </span>
                </div>
                <p className="text-[11px] text-stone-600 dark:text-stone-400 leading-relaxed">
                  {farmGuidance.harvesting.reason}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. WHAT CHANGES THROUGH THE DAY (TODAY'S WEATHER STORY) */}
      <div className="bg-white dark:bg-[#0c1a12] rounded-3xl border border-stone-200/80 dark:border-emerald-950/80 p-6 sm:p-7 shadow-xs space-y-4 transition-colors">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-emerald-950/60">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <h3 className="font-heading text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100">
              {weatherUi.todaysWeatherStory}
            </h3>
          </div>
          <span className="text-xs text-stone-500 dark:text-stone-400">
            {weatherUi.calculatedFromHourly}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {weatherStory.map((story, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-stone-50/80 dark:bg-stone-900/60 border border-stone-100 dark:border-stone-800 space-y-2 hover:border-emerald-500/60 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-stone-800 dark:text-stone-200">
                  {story.title}
                </span>
                <span className="text-xs font-black text-emerald-700 dark:text-emerald-400">
                  {story.temp}
                </span>
              </div>
              <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                {story.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 7. 7-DAY AGRICULTURAL OUTLOOK */}
      <div className="bg-white dark:bg-[#0c1a12] rounded-3xl border border-stone-200/80 dark:border-emerald-950/80 p-6 sm:p-7 shadow-xs space-y-5 transition-colors">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-emerald-950/60">
          <div className="flex items-center gap-2.5">
            <Calendar className="w-5 h-5 text-sky-600 dark:text-sky-400" />
            <h3 className="font-heading text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100">
              {weatherUi.sevenDayForecast}
            </h3>
          </div>
          <span className="text-xs text-stone-500 dark:text-stone-400">
            {weatherUi.highResModel}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {dailyForecast.map((fc, idx) => (
            <div
              key={idx}
              className={`rounded-2xl p-4 border flex flex-col items-center text-center space-y-2 transition-all ${
                idx === 0
                  ? 'bg-sky-50/80 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800 shadow-2xs'
                  : 'bg-stone-50/80 dark:bg-stone-900/60 border-stone-100 dark:border-stone-800'
              }`}
            >
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold text-stone-800 dark:text-stone-200">
                  {localizeForecastDay(fc.day, language)}
                </span>
                {idx === 0 && (
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-500" title={weatherUi.today} />
                )}
              </div>

              <div className="my-1">{getWeatherIcon(fc.condition, 'w-8 h-8')}</div>

              <div className="flex items-baseline justify-center gap-1 my-0.5">
                <span className="text-base font-black text-stone-900 dark:text-stone-100">
                  {fc.tempMax !== undefined ? `${fc.tempMax}°C` : fc.temp}
                </span>
                {fc.tempMin !== undefined && fc.tempMin !== fc.tempMax && (
                  <span className="text-[11px] font-semibold text-stone-400 dark:text-stone-500">
                    / {fc.tempMin}°C
                  </span>
                )}
              </div>

              <span className="text-[11px] text-stone-500 dark:text-stone-400 line-clamp-1 font-medium">
                {localizeWeatherCondition(fc.condition, language)}
              </span>

              <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950/80 text-sky-800 dark:text-sky-300 font-bold border border-sky-200/80 dark:border-sky-800">
                {weatherUi.rainLabel} {fc.rainProb}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 8. DATA PROVENANCE & STRICT SEPARATION NOTICE */}
      <div className="bg-stone-100/80 dark:bg-stone-900/60 rounded-2xl border border-stone-200 dark:border-stone-800/80 p-4 text-xs text-stone-600 dark:text-stone-400 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>
            <strong className="text-stone-800 dark:text-stone-200">{weatherUi.forecastSource}</strong> {weatherUi.forecastSourceDesc} ({weather.latitude ?? currentFarm.latitude ?? '—'}, {weather.longitude ?? currentFarm.longitude ?? '—'}).
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0 font-medium text-[11px] text-stone-500 dark:text-stone-400">
          <span>{formatFarmLocation(currentFarm.location || currentFarm.district, currentFarm.stateRegion || currentFarm.state, language) || currentFarm.location}</span>
        </div>
      </div>
    </div>
  );
};
