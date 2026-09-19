import { FarmProfile } from '../../../types';

export interface FAOSTATObservation {
  provider: 'Food and Agriculture Organization (FAOSTAT)';
  datasetName: 'FAOSTAT Production Quantities & Crop Yields (Domain QCL)';
  freshness: 'LIVE' | 'NEAR_REAL_TIME' | 'LATEST_AVAILABLE' | 'HISTORICAL' | 'UNAVAILABLE';
  status: 'ACTIVE' | 'UNAVAILABLE' | 'STALE' | 'ERROR';
  statusMessage?: string;
  observationYear: number; // Statistical Year e.g. 2023 or 2024
  fetchedAt: string;
  country: string;
  crop: string;
  benchmarkYieldTonnesPerHa: number;
  nationalProductionTonnes: number;
  nationalHarvestedAreaHa: number;
  fertilizerConsumptionKgPerHa: number;
  dataQuality: string; // e.g. "Official FAOSTAT Statistical Reporting"
}

const FAO_CACHE_KEY = 'khetinexus_faostat_cache';
const FAO_CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours TTL

export async function fetchFAOSTATPipeline(
  farm: FarmProfile,
  forceRefresh = false
): Promise<FAOSTATObservation> {
  const country = farm.country || 'India';
  const crop = farm.currentCrop || 'Wheat';

  if (!forceRefresh) {
    try {
      const cachedRaw = localStorage.getItem(`${FAO_CACHE_KEY}_${farm.id}`);
      if (cachedRaw) {
        const cached = JSON.parse(cachedRaw);
        const age = Date.now() - new Date(cached.fetchedAt).getTime();
        if (age < FAO_CACHE_TTL_MS) {
          return cached;
        }
      }
    } catch {
      // Ignore cache errors
    }
  }

  try {
    const response = await fetch(
      `/api/providers/faostat?country=${encodeURIComponent(
        country
      )}&crop=${encodeURIComponent(crop)}`,
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
        provider: 'Food and Agriculture Organization (FAOSTAT)',
        datasetName: 'FAOSTAT Production Quantities & Crop Yields (Domain QCL)',
        freshness: 'UNAVAILABLE',
        status: 'UNAVAILABLE',
        statusMessage: data.statusMessage || 'FAOSTAT statistical service temporarily unavailable',
        observationYear: 2023,
        fetchedAt: new Date().toISOString(),
        country,
        crop,
        benchmarkYieldTonnesPerHa: 0,
        nationalProductionTonnes: 0,
        nationalHarvestedAreaHa: 0,
        fertilizerConsumptionKgPerHa: 0,
        dataQuality: 'Unavailable',
      };
    }

    // Quality Gate: Validate yield (must be non-negative)
    const yieldVal = Number(data.benchmarkYieldTonnesPerHa);
    if (isNaN(yieldVal) || yieldVal < 0) {
      throw new Error(`Invalid FAOSTAT yield value: ${yieldVal}`);
    }

    const result: FAOSTATObservation = {
      provider: 'Food and Agriculture Organization (FAOSTAT)',
      datasetName: 'FAOSTAT Production Quantities & Crop Yields (Domain QCL)',
      freshness: 'LATEST_AVAILABLE',
      status: 'ACTIVE',
      observationYear: data.observationYear || 2023,
      fetchedAt: new Date().toISOString(),
      country,
      crop,
      benchmarkYieldTonnesPerHa: Math.round(yieldVal * 100) / 100,
      nationalProductionTonnes: data.nationalProductionTonnes || 0,
      nationalHarvestedAreaHa: data.nationalHarvestedAreaHa || 0,
      fertilizerConsumptionKgPerHa: data.fertilizerConsumptionKgPerHa || 0,
      dataQuality: data.dataQuality || 'Official FAOSTAT Statistical Reporting',
    };

    try {
      localStorage.setItem(`${FAO_CACHE_KEY}_${farm.id}`, JSON.stringify(result));
    } catch {
      // Ignore cache write error
    }

    return result;
  } catch (err: any) {
    console.warn('[FAOSTAT Pipeline] Error:', err?.message);
    return {
      provider: 'Food and Agriculture Organization (FAOSTAT)',
      datasetName: 'FAOSTAT Production Quantities & Crop Yields (Domain QCL)',
      freshness: 'UNAVAILABLE',
      status: 'UNAVAILABLE',
      statusMessage: `FAOSTAT pipeline error: ${err?.message || 'Connection error'}`,
      observationYear: 2023,
      fetchedAt: new Date().toISOString(),
      country,
      crop,
      benchmarkYieldTonnesPerHa: 0,
      nationalProductionTonnes: 0,
      nationalHarvestedAreaHa: 0,
      fertilizerConsumptionKgPerHa: 0,
      dataQuality: 'Unavailable',
    };
  }
}
