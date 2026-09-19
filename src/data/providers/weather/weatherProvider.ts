import { FarmProfile, HourlyForecastPoint, DailyForecastPoint } from '../../../types';

export interface WeatherObservation {
  provider: 'Open-Meteo / IMD Operational';
  datasetName: 'Open-Meteo High-Resolution Meteorological Forecast Engine';
  freshness: 'LIVE' | 'NEAR_REAL_TIME' | 'LATEST_AVAILABLE' | 'HISTORICAL' | 'UNAVAILABLE';
  status: 'ACTIVE' | 'UNAVAILABLE' | 'STALE' | 'ERROR';
  statusMessage?: string;
  reason?: string;
  observationDate: string; // ISO string or formatted date
  fetchedAt: string;
  latitude: number;
  longitude: number;
  locationName: string;
  timezone?: string;
  utcOffsetSeconds?: number;
  currentLocalTime?: string;
  currentLocalHour?: number;
  temperature: number; // °C
  humidity: number; // %
  rainfallMm: number; // mm
  windSpeedKmh: number; // km/h
  condition: string;
  conditionCode: string;
  forecast: Array<{
    day: string;
    tempMax: string | number;
    tempMin: string | number;
    condition: string;
    rainProb: string;
  }>;
  hourlyForecast?: HourlyForecastPoint[];
  dailyForecast?: DailyForecastPoint[];
}

const CACHE_KEY = 'khetinexus_weather_cache';
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes TTL

export async function fetchLiveWeatherPipeline(
  farm: FarmProfile,
  forceRefresh = false
): Promise<WeatherObservation> {
  const lat = farm.coordinates?.lat ?? farm.latitude;
  const lon = farm.coordinates?.lng ?? farm.longitude;
  const locationName = `${farm.district ? farm.district + ', ' : farm.location ? farm.location + ', ' : ''}${farm.state || farm.stateRegion || ''}, ${farm.country || 'India'}`;

  // Strict check: if coordinates are not available, return UNAVAILABLE with MISSING_COORDINATES
  if (
    lat === undefined ||
    lat === null ||
    isNaN(Number(lat)) ||
    lon === undefined ||
    lon === null ||
    isNaN(Number(lon))
  ) {
    return {
      provider: 'Open-Meteo / IMD Operational',
      datasetName: 'Open-Meteo High-Resolution Meteorological Forecast Engine',
      freshness: 'UNAVAILABLE',
      status: 'UNAVAILABLE',
      statusMessage: 'Farm coordinates required to fetch live meteorological telemetry. Please update farm location in Farm Profile.',
      reason: 'MISSING_COORDINATES',
      observationDate: new Date().toISOString(),
      fetchedAt: new Date().toISOString(),
      latitude: 0,
      longitude: 0,
      locationName,
      temperature: 0,
      humidity: 0,
      rainfallMm: 0,
      windSpeedKmh: 0,
      condition: 'Unavailable',
      conditionCode: 'unknown',
      forecast: [],
      hourlyForecast: [],
      dailyForecast: [],
    };
  }

  // Check TTL cache if not forcing refresh
  if (!forceRefresh) {
    try {
      const cachedRaw = localStorage.getItem(`${CACHE_KEY}_${farm.id}`);
      if (cachedRaw) {
        const cached = JSON.parse(cachedRaw);
        const age = Date.now() - new Date(cached.fetchedAt).getTime();
        if (
          age < CACHE_TTL_MS &&
          cached.latitude === lat &&
          cached.longitude === lon &&
          cached.status === 'ACTIVE'
        ) {
          return cached;
        }
      }
    } catch {
      // Ignore cache parse errors
    }
  }

  try {
    const response = await fetch(
      `/api/providers/weather?lat=${lat}&lon=${lon}&farmId=${encodeURIComponent(
        farm.id || ''
      )}&location=${encodeURIComponent(locationName)}&country=${encodeURIComponent(
        farm.country || 'India'
      )}`,
      {
        headers: { 'Cache-Control': forceRefresh ? 'no-cache' : 'default' },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP Error ${response.status}`);
    }

    const data = await response.json();

    if (data.status === 'UNAVAILABLE') {
      return {
        provider: 'Open-Meteo / IMD Operational',
        datasetName: 'Open-Meteo High-Resolution Meteorological Forecast Engine',
        freshness: 'UNAVAILABLE',
        status: 'UNAVAILABLE',
        statusMessage: data.statusMessage || 'Farm coordinates required to fetch live meteorological telemetry. Please update farm location in Farm Profile.',
        reason: data.reason || 'MISSING_COORDINATES',
        observationDate: new Date().toISOString(),
        fetchedAt: new Date().toISOString(),
        latitude: lat,
        longitude: lon,
        locationName,
        temperature: 0,
        humidity: 0,
        rainfallMm: 0,
        windSpeedKmh: 0,
        condition: 'Unavailable',
        conditionCode: 'unknown',
        forecast: [],
        hourlyForecast: [],
        dailyForecast: [],
      };
    }

    const tempNum = typeof data.tempValue === 'number'
      ? data.tempValue
      : typeof data.temperature === 'number'
      ? data.temperature
      : typeof data.temperature === 'string'
      ? parseFloat(data.temperature) || 28
      : 28;

    const result: WeatherObservation = {
      provider: 'Open-Meteo / IMD Operational',
      datasetName: 'Open-Meteo High-Resolution Meteorological Forecast Engine',
      freshness: 'LIVE',
      status: 'ACTIVE',
      observationDate: data.observationDate || new Date().toISOString(),
      fetchedAt: new Date().toISOString(),
      latitude: lat,
      longitude: lon,
      locationName,
      timezone: data.timezone,
      utcOffsetSeconds: data.utcOffsetSeconds,
      currentLocalTime: data.currentLocalTime,
      currentLocalHour: data.currentLocalHour,
      temperature: tempNum,
      humidity: Math.min(100, Math.max(0, data.humidityValue ?? (typeof data.humidity === 'number' ? data.humidity : parseInt(data.humidity, 10) || 60))),
      rainfallMm: Math.max(0, data.rainfallMm ?? (typeof data.rainfall === 'number' ? data.rainfall : parseFloat(data.rainfall) || 0)),
      windSpeedKmh: Math.max(0, data.windSpeedKmh ?? (typeof data.wind === 'number' ? data.wind : parseInt(data.wind, 10) || 10)),
      condition: data.condition || 'Clear',
      conditionCode: data.conditionCode || 'clear',
      forecast: Array.isArray(data.forecast) ? data.forecast : [],
      hourlyForecast: Array.isArray(data.hourlyForecast) ? data.hourlyForecast : [],
      dailyForecast: Array.isArray(data.dailyForecast) ? data.dailyForecast : [],
    };

    // Store in cache
    try {
      localStorage.setItem(`${CACHE_KEY}_${farm.id}`, JSON.stringify(result));
    } catch {
      // Ignore cache write errors
    }

    return result;
  } catch (err: any) {
    console.warn('[Weather Pipeline] Real-time fetch error:', err?.message);
    return {
      provider: 'Open-Meteo / IMD Operational',
      datasetName: 'Open-Meteo High-Resolution Meteorological Forecast Engine',
      freshness: 'UNAVAILABLE',
      status: 'UNAVAILABLE',
      statusMessage: `Weather pipeline unavailable: ${err?.message || 'Connection error'}`,
      reason: 'PROVIDER_ERROR',
      observationDate: new Date().toISOString(),
      fetchedAt: new Date().toISOString(),
      latitude: lat,
      longitude: lon,
      locationName,
      temperature: 0,
      humidity: 0,
      rainfallMm: 0,
      windSpeedKmh: 0,
      condition: 'Unavailable',
      conditionCode: 'unknown',
      forecast: [],
      hourlyForecast: [],
      dailyForecast: [],
    };
  }
}

export const fetchWeatherPipeline = fetchLiveWeatherPipeline;
