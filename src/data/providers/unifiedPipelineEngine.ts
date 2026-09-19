import { FarmProfile, SoilReport } from '../../types';
import { resolveIndianGeographicContext } from '../indiaGeographicHierarchy';

import {
  fetchWeatherPipeline,
  WeatherObservation,
} from './weather/weatherProvider';

import {
  fetchEarthEnginePipeline,
  EarthEngineObservation,
} from './earth-engine/earthEngineProvider';

import {
  fetchFAOSTATPipeline,
  FAOSTATObservation,
} from './faostat/faostatProvider';

import {
  fetchISROBhuvanPipeline,
  BhuvanObservation,
} from './isro-bhuvan/isroBhuvanProvider';

import {
  fetchIndiaGovPipeline,
  IndiaGovObservation,
} from './india-government/indiaGovProvider';

export interface DataConflictWarning {
  type: 'MOISTURE_RAINFALL_ANOMALY' | 'GEOGRAPHIC_MISMATCH' | 'STALE_OBSERVATION' | 'UNIT_MISMATCH';
  severity: 'WARNING' | 'INFO' | 'CRITICAL';
  description: string;
  sources: string[];
}

export interface PipelineExecutionResult {
  farmId: string;
  evaluatedAt: string;
  geographicResolver: {
    hierarchyPath: string; // e.g. "India -> Punjab -> Ludhiana -> Samrala"
    resolutionLevel: string;
    agroClimaticZone: string;
    coordinatesValid: boolean;
  };
  providers: {
    weather: WeatherObservation;
    earthEngine: EarthEngineObservation;
    faostat: FAOSTATObservation;
    isroBhuvan: BhuvanObservation;
    indiaGov: IndiaGovObservation;
  };
  conflicts: DataConflictWarning[];
  overallDataHealthScore: number; // 0 - 100%
  activeProvidersCount: number;
}

export async function executeUnifiedDataPipeline(
  farm: FarmProfile,
  soilReport?: SoilReport | null,
  forceRefresh = false
): Promise<PipelineExecutionResult> {
  const evaluatedAt = new Date().toISOString();

  // Step 1: Geographic Resolution
  const geoResolution = resolveIndianGeographicContext(
    farm.state,
    farm.district,
    farm.subDistrict
  );

  const coordsValid =
    typeof farm.coordinates?.lat === 'number' &&
    typeof farm.coordinates?.lng === 'number' &&
    farm.coordinates.lat >= -90 &&
    farm.coordinates.lat <= 90 &&
    farm.coordinates.lng >= -180 &&
    farm.coordinates.lng <= 180;

  // Step 2: Parallel Fetch of all Provider Pipelines
  const [weatherRes, geeRes, faoRes, bhuvanRes, govRes] = await Promise.all([
    fetchWeatherPipeline(farm, forceRefresh),
    fetchEarthEnginePipeline(farm, forceRefresh),
    fetchFAOSTATPipeline(farm, forceRefresh),
    fetchISROBhuvanPipeline(farm, forceRefresh),
    fetchIndiaGovPipeline(farm, forceRefresh),
  ]);

  // Step 3: Conflict Check & Quality Gates
  const conflicts: DataConflictWarning[] = [];

  // Conflict Gate 1: Weather Rainfall vs GEE SMAP Moisture Anomaly
  if (
    weatherRes.status === 'ACTIVE' &&
    geeRes.status === 'ACTIVE' &&
    weatherRes.rainfallMm > 20 &&
    geeRes.indicators.smapSoilMoistureVolumetric < 0.15
  ) {
    conflicts.push({
      type: 'MOISTURE_RAINFALL_ANOMALY',
      severity: 'WARNING',
      description: `High surface rainfall (${weatherRes.rainfallMm}mm) observed alongside low satellite soil moisture (${geeRes.indicators.smapSoilMoistureVolumetric} m³/m³). Indicates rapid surface runoff or sandy soil percolation.`,
      sources: ['Open-Meteo Weather', 'NASA SMAP Satellite'],
    });
  }

  // Conflict Gate 2: Geographic Mismatch for Non-Indian Farms
  if (farm.country && farm.country !== 'India') {
    if (bhuvanRes.status === 'ACTIVE') {
      conflicts.push({
        type: 'GEOGRAPHIC_MISMATCH',
        severity: 'CRITICAL',
        description: `ISRO Bhuvan dataset erroneously executed on non-Indian territory (${farm.country}). Bhuvan context suppressed.`,
        sources: ['ISRO / NRSC / Bhuvan'],
      });
    }
  }

  // Step 4: Health Score Calculation
  const providerStatuses = [
    weatherRes.status,
    geeRes.status,
    faoRes.status,
    bhuvanRes.status,
    govRes.status,
  ];
  const activeCount = providerStatuses.filter((s) => s === 'ACTIVE').length;
  const healthScore = Math.round((activeCount / providerStatuses.length) * 100);

  return {
    farmId: farm.id,
    evaluatedAt,
    geographicResolver: {
      hierarchyPath: `${farm.country || 'India'} → ${farm.stateRegion || farm.state || 'State'} → ${
        farm.district || 'District'
      }${farm.subDistrict ? ' → ' + farm.subDistrict : ''}`,
      resolutionLevel: geoResolution.resolutionLabel,
      agroClimaticZone: geoResolution.agroClimaticZone,
      coordinatesValid: coordsValid,
    },
    providers: {
      weather: weatherRes,
      earthEngine: geeRes,
      faostat: faoRes,
      isroBhuvan: bhuvanRes,
      indiaGov: govRes,
    },
    conflicts,
    overallDataHealthScore: healthScore,
    activeProvidersCount: activeCount,
  };
}
