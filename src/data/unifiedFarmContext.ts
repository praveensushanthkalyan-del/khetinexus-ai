// src/data/unifiedFarmContext.ts
// Centralized Provenance-Preserving Farm Context Architecture for KhetiNexus AI

import { FarmProfile, SoilReport, WeatherData } from '../types';
import { resolveIndianGeographicContext, IndianGeographicContext } from './indiaGeographicHierarchy';
import { getEarthEngineContextForLocation, GEEServiceContext } from './earthEngineDatasets';
import { getISROBhuvanContextForLocation, ISROBhuvanServiceContext } from './isroBhuvanDatasets';
import { getFAOSTATContextForCountry, FAOSTATServiceContext } from './faostatDatasets';
import { resolveRegionalSoilProfile, RegionalSoilProfile } from './regionalSoilDatasets';

export interface UnifiedSoilDataContext {
  status: 'provided' | 'regional_baseline';
  source: 'User Soil Test' | 'Laboratory Report' | 'ICAR / NRSC Regional Baseline';
  ph: number | null;
  nitrogen: 'Low' | 'Medium' | 'Optimal' | 'High' | null;
  nitrogenKgHa?: number | null;
  phosphorus: 'Low' | 'Medium' | 'Optimal' | 'High' | null;
  phosphorusKgHa?: number | null;
  potassium: 'Low' | 'Medium' | 'Optimal' | 'High' | null;
  potassiumKgHa?: number | null;
  organicMatter: number | null;
  soilMoisture: number | null;
  electricalConductivity?: number | null;
  cationExchangeCapacity?: number | null;
  deficiencies: string[];
  isSatelliteDerived: false; // Mandatory distinction: chemical soil data is NEVER confused with satellite indicators
  provenance: 'MEASURED' | 'REGIONAL_BASELINE';
  provenanceLabel: string;
  spatialResolution: string;
  notice: string;
  regionalBaseline?: {
    soilOrder: string;
    texture: string;
    drainageClass: string;
    datasetName: string;
  };
}

export interface UnifiedFarmContext {
  farm: {
    id: string;
    name: string;
    country: string;
    state: string;
    stateRegion: string;
    location: string;
    district: string;
    subDistrict: string;
    localRegion: string;
    agroClimaticZone: string;
    latitude: number | null;
    longitude: number | null;
    crop: string;
    cropVariety?: string;
    growthStage: 'Germination' | 'Vegetative' | 'Flowering' | 'Grain filling' | 'Maturity';
    soilType: string;
    irrigationType: 'Drip Irrigation' | 'Canal' | 'Sprinkler' | 'Rainfed' | 'Borewell / Tube well';
    farmSize: number;
    farmUnit: 'hectares' | 'acres';
    geographicResolutionLevel: IndianGeographicContext['geographicResolutionLevel'];
    resolutionLabel: string;
  };
  earthEngine: GEEServiceContext;
  isroBhuvan: ISROBhuvanServiceContext;
  faostat: FAOSTATServiceContext;
  soilData: UnifiedSoilDataContext;
  weatherData: {
    source: string; // "IMD / Meteorological Service"
    location: string;
    country: string;
    temperature: string;
    humidity: string;
    rainfall: string;
    wind: string;
    condition: string;
    notice: string;
  };
  createdAt: string;
}

// Construct Unified Context from Farm Profile, User Soil Test, and Weather
export function createUnifiedFarmContext(
  farm: FarmProfile,
  userSoilReport?: SoilReport | null,
  weatherData?: WeatherData | null
): UnifiedFarmContext {
  // 1. Resolve Indian Geographic Hierarchy
  const geoContext = resolveIndianGeographicContext(
    farm.country || 'India',
    farm.stateRegion || 'Punjab',
    farm.location || 'Ludhiana',
    farm.latitude,
    farm.longitude
  );

  // 2. Fetch Google Earth Engine context
  const eeContext = getEarthEngineContextForLocation(
    geoContext.latitude,
    geoContext.longitude,
    farm.crop || 'Wheat'
  );

  // 3. Fetch ISRO / NRSC / Bhuvan context
  const isroContext = getISROBhuvanContextForLocation(
    geoContext.country,
    geoContext.state,
    geoContext.district,
    geoContext.latitude,
    geoContext.longitude
  );

  // 4. Fetch official FAOSTAT context
  const faostatContext = getFAOSTATContextForCountry(
    geoContext.country,
    farm.crop || 'Wheat'
  );

  // 5. Build Soil Data Context (Strictly separate from satellite remote sensing)
  const regionalSoil = resolveRegionalSoilProfile(
    geoContext.state,
    geoContext.district,
    geoContext.country
  );

  const hasSoilData = !!userSoilReport && (
    userSoilReport.ph != null ||
    userSoilReport.nitrogen != null ||
    userSoilReport.phosphorus != null ||
    userSoilReport.potassium != null ||
    userSoilReport.organicMatter != null
  );

  const soilData: UnifiedSoilDataContext = hasSoilData
    ? {
        status: 'provided',
        source: userSoilReport?.isDemo ? 'User Soil Test' : 'Laboratory Report',
        ph: userSoilReport?.ph ?? null,
        nitrogen: userSoilReport?.nitrogen ?? null,
        nitrogenKgHa: userSoilReport?.nitrogenKgHa ?? null,
        phosphorus: userSoilReport?.phosphorus ?? null,
        phosphorusKgHa: userSoilReport?.phosphorusKgHa ?? null,
        potassium: userSoilReport?.potassium ?? null,
        potassiumKgHa: userSoilReport?.potassiumKgHa ?? null,
        organicMatter: userSoilReport?.organicMatter ?? null,
        soilMoisture: userSoilReport?.soilMoisture ?? null,
        electricalConductivity: userSoilReport?.electricalConductivity ?? null,
        cationExchangeCapacity: regionalSoil.cationExchangeCapacity.value,
        deficiencies: userSoilReport?.deficiencies || [],
        isSatelliteDerived: false,
        provenance: 'MEASURED',
        provenanceLabel: `Laboratory Soil Test (${farm.name})`,
        spatialResolution: `Farm Specific (${farm.name})`,
        notice: 'Lab Soil Test measurements active from Farm Record',
        regionalBaseline: {
          soilOrder: regionalSoil.soilOrder,
          texture: regionalSoil.texture,
          drainageClass: regionalSoil.drainageClass,
          datasetName: regionalSoil.datasetName,
        },
      }
    : {
        status: 'regional_baseline',
        source: 'ICAR / NRSC Regional Baseline',
        ph: regionalSoil.ph.value,
        nitrogen: regionalSoil.nitrogen.value,
        nitrogenKgHa: regionalSoil.nitrogenKgHa?.value ?? null,
        phosphorus: regionalSoil.phosphorus.value,
        phosphorusKgHa: regionalSoil.phosphorusKgHa?.value ?? null,
        potassium: regionalSoil.potassium.value,
        potassiumKgHa: regionalSoil.potassiumKgHa?.value ?? null,
        organicMatter: regionalSoil.organicMatterPercent.value,
        soilMoisture: null,
        electricalConductivity: regionalSoil.electricalConductivityDsM.value,
        cationExchangeCapacity: regionalSoil.cationExchangeCapacity.value,
        deficiencies: regionalSoil.regionalDeficiencies,
        isSatelliteDerived: false,
        provenance: 'REGIONAL_BASELINE',
        provenanceLabel: `${regionalSoil.sourceAgency} Baseline`,
        spatialResolution: `${geoContext.district}, ${geoContext.state} Regional Baseline`,
        notice: `Area-based regional soil baseline active (${geoContext.district}, ${geoContext.state}). Enter lab test to calibrate farm-specific measurements.`,
        regionalBaseline: {
          soilOrder: regionalSoil.soilOrder,
          texture: regionalSoil.texture,
          drainageClass: regionalSoil.drainageClass,
          datasetName: regionalSoil.datasetName,
        },
      };

  // 6. Build Weather Context
  const weather = weatherData || {
    source: 'IMD / Meteorological Service',
    location: `${geoContext.district}, ${geoContext.state}`,
    country: geoContext.country,
    temperature: '28°C',
    humidity: '62%',
    rainfall: '12 mm',
    wind: '14 km/h NW',
    condition: 'Partly Cloudy',
    notice: 'Live agricultural weather telemetric data',
  };

  return {
    farm: {
      id: farm.id,
      name: farm.name || 'My Farm',
      country: geoContext.country,
      state: geoContext.state,
      stateRegion: geoContext.state,
      location: `${geoContext.district}, ${geoContext.state}`,
      district: geoContext.district,
      subDistrict: geoContext.subDistrict,
      localRegion: geoContext.localRegion,
      agroClimaticZone: geoContext.agroClimaticZone,
      latitude: geoContext.latitude,
      longitude: geoContext.longitude,
      crop: farm.crop || 'Wheat',
      cropVariety: farm.cropVariety || '',
      growthStage: (['Germination', 'Vegetative', 'Flowering', 'Grain filling', 'Maturity'].includes(farm.growthStage) ? (farm.growthStage as any) : 'Vegetative'),
      soilType: farm.soilType || 'Alluvial',
      irrigationType: (['Drip Irrigation', 'Canal', 'Sprinkler', 'Rainfed', 'Borewell / Tube well'].includes(farm.irrigationType) ? (farm.irrigationType as any) : 'Drip Irrigation'),
      farmSize: farm.farmSize || 5,
      farmUnit: (farm.farmUnit === 'hectares' ? 'hectares' : 'acres'),
      geographicResolutionLevel: geoContext.geographicResolutionLevel,
      resolutionLabel: geoContext.resolutionLabel,
    },
    earthEngine: eeContext,
    isroBhuvan: isroContext,
    faostat: faostatContext,
    soilData,
    weatherData: {
      source: 'IMD / Meteorological Service',
      location: weather.location,
      country: weather.country,
      temperature: weather.temperature,
      humidity: weather.humidity,
      rainfall: weather.rainfall,
      wind: weather.wind,
      condition: weather.condition,
      notice: weather.notice,
    },
    createdAt: new Date().toISOString(),
  };
}
