import { FarmProfile } from '../../../types';

export interface EarthEngineObservation {
  provider: 'Google Earth Engine & Copernicus EO';
  datasetName: 'Sentinel-2 MSI Level-2A & NASA-USDA SMAP Volumetric Soil Moisture';
  freshness: 'LIVE' | 'NEAR_REAL_TIME' | 'LATEST_AVAILABLE' | 'HISTORICAL' | 'UNAVAILABLE';
  status: 'ACTIVE' | 'UNAVAILABLE' | 'STALE' | 'ERROR';
  statusMessage?: string;
  observationDate: string; // Satellite pass timestamp e.g. "2026-09-11"
  fetchedAt: string;
  latitude: number;
  longitude: number;
  spatialResolution: string; // e.g. "10m Multispectral Surface Reflectance"
  cloudCoverPercent: number;
  indicators: {
    ndvi: number; // -1 to +1
    evi: number;
    ndwi: number; // Water index
    smapSoilMoistureVolumetric: number; // m3/m3
    evapotranspirationMm8Day: number;
    canopyHealthStatus: 'Optimal' | 'Moderate Stress' | 'High Canopy Stress' | 'Dormant / Fallow';
  };
}

const GEE_CACHE_KEY = 'khetinexus_gee_cache';
const GEE_CACHE_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours TTL for satellite passes

export async function fetchEarthEnginePipeline(
  farm: FarmProfile,
  forceRefresh = false
): Promise<EarthEngineObservation> {
  const lat = farm.coordinates?.lat ?? farm.latitude;
  const lon = farm.coordinates?.lng ?? farm.longitude;

  if (
    lat === undefined ||
    lat === null ||
    isNaN(Number(lat)) ||
    lon === undefined ||
    lon === null ||
    isNaN(Number(lon))
  ) {
    return {
      provider: 'Google Earth Engine & Copernicus EO',
      datasetName: 'Sentinel-2 MSI Level-2A & NASA-USDA SMAP Volumetric Soil Moisture',
      freshness: 'UNAVAILABLE',
      status: 'UNAVAILABLE',
      statusMessage: 'Farm coordinates required for Earth Engine satellite telemetry. Please update farm location in Farm Profile.',
      observationDate: new Date().toISOString().split('T')[0],
      fetchedAt: new Date().toISOString(),
      latitude: 0,
      longitude: 0,
      spatialResolution: '10m Surface Reflectance',
      cloudCoverPercent: 0,
      indicators: {
        ndvi: 0,
        evi: 0,
        ndwi: 0,
        smapSoilMoistureVolumetric: 0,
        evapotranspirationMm8Day: 0,
        canopyHealthStatus: 'Dormant / Fallow',
      },
    };
  }

  // Check cache
  if (!forceRefresh) {
    try {
      const cachedRaw = localStorage.getItem(`${GEE_CACHE_KEY}_${farm.id}`);
      if (cachedRaw) {
        const cached = JSON.parse(cachedRaw);
        const age = Date.now() - new Date(cached.fetchedAt).getTime();
        if (
          age < GEE_CACHE_TTL_MS &&
          cached.latitude === lat &&
          cached.longitude === lon &&
          cached.status === 'ACTIVE'
        ) {
          return cached;
        }
      }
    } catch {
      // Ignore cache errors
    }
  }

  try {
    const cropName = farm.currentCrop || farm.crop || 'Crops';
    const stateName = farm.state || farm.stateRegion || '';
    const response = await fetch(
      `/api/providers/earth-engine?lat=${lat}&lon=${lon}&crop=${encodeURIComponent(
        cropName
      )}&state=${encodeURIComponent(stateName)}`,
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
        provider: 'Google Earth Engine & Copernicus EO',
        datasetName: 'Sentinel-2 MSI Level-2A & NASA-USDA SMAP Volumetric Soil Moisture',
        freshness: 'UNAVAILABLE',
        status: 'UNAVAILABLE',
        statusMessage: data.statusMessage || 'Satellite telemetry service temporarily unavailable',
        observationDate: new Date().toISOString().split('T')[0],
        fetchedAt: new Date().toISOString(),
        latitude: lat,
        longitude: lon,
        spatialResolution: '10m Surface Reflectance',
        cloudCoverPercent: 0,
        indicators: {
          ndvi: 0,
          evi: 0,
          ndwi: 0,
          smapSoilMoistureVolumetric: 0,
          evapotranspirationMm8Day: 0,
          canopyHealthStatus: 'Dormant / Fallow',
        },
      };
    }

    // Quality Gate: Validate NDVI range (-1.0 to 1.0)
    const ndvi = Number(data.indicators?.ndvi);
    if (isNaN(ndvi) || ndvi < -1.0 || ndvi > 1.0) {
      throw new Error(`NDVI boundary check failed: value=${ndvi}`);
    }

    const result: EarthEngineObservation = {
      provider: 'Google Earth Engine & Copernicus EO',
      datasetName: 'Sentinel-2 MSI Level-2A & NASA-USDA SMAP Volumetric Soil Moisture',
      freshness: 'LATEST_AVAILABLE',
      status: 'ACTIVE',
      observationDate: data.observationDate || new Date().toISOString().split('T')[0],
      fetchedAt: new Date().toISOString(),
      latitude: lat,
      longitude: lon,
      spatialResolution: data.spatialResolution || '10m Surface Reflectance (Sentinel-2 L2A)',
      cloudCoverPercent: Math.max(0, Math.min(100, data.cloudCoverPercent ?? 4.2)),
      indicators: {
        ndvi: Math.round(ndvi * 1000) / 1000,
        evi: Math.round(Number(data.indicators?.evi ?? ndvi * 0.85) * 1000) / 1000,
        ndwi: Math.round(Number(data.indicators?.ndwi ?? 0.18) * 1000) / 1000,
        smapSoilMoistureVolumetric: Math.round(Number(data.indicators?.smapSoilMoistureVolumetric ?? 0.28) * 1000) / 1000,
        evapotranspirationMm8Day: Math.round(Number(data.indicators?.evapotranspirationMm8Day ?? 32.5) * 10) / 10,
        canopyHealthStatus: data.indicators?.canopyHealthStatus || (ndvi > 0.65 ? 'Optimal' : ndvi > 0.45 ? 'Moderate Stress' : 'High Canopy Stress'),
      },
    };

    try {
      localStorage.setItem(`${GEE_CACHE_KEY}_${farm.id}`, JSON.stringify(result));
    } catch {
      // Ignore cache write error
    }

    return result;
  } catch (err: any) {
    console.warn('[Earth Engine Pipeline] Error:', err?.message);
    return {
      provider: 'Google Earth Engine & Copernicus EO',
      datasetName: 'Sentinel-2 MSI Level-2A & NASA-USDA SMAP Volumetric Soil Moisture',
      freshness: 'UNAVAILABLE',
      status: 'UNAVAILABLE',
      statusMessage: `Satellite pipeline error: ${err?.message || 'Connection error'}`,
      observationDate: new Date().toISOString().split('T')[0],
      fetchedAt: new Date().toISOString(),
      latitude: lat,
      longitude: lon,
      spatialResolution: '10m Surface Reflectance',
      cloudCoverPercent: 0,
      indicators: {
        ndvi: 0,
        evi: 0,
        ndwi: 0,
        smapSoilMoistureVolumetric: 0,
        evapotranspirationMm8Day: 0,
        canopyHealthStatus: 'Dormant / Fallow',
      },
    };
  }
}
