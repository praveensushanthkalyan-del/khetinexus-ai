// src/data/countryProviders.ts
// Country-Neutral Provider Adapter Architecture (BRICS-Ready) for KhetiNexus AI

import { SupportedCountry, FarmProfile, SoilReport, WeatherData } from '../types';
import { UnifiedFarmContext, createUnifiedFarmContext } from './unifiedFarmContext';
import { getEarthEngineContextForLocation, GEEServiceContext } from './earthEngineDatasets';
import { getFAOSTATContextForCountry, FAOSTATServiceContext } from './faostatDatasets';

export interface CountryProviderAdapter {
  country: SupportedCountry;
  getGeographicHierarchy(stateRegion?: string, locationName?: string): { state: string; district: string; zone: string };
  getNationalGeospatialContext(state: string, district: string, lat?: number | null, lon?: number | null): {
    providerName: string;
    available: boolean;
    layers: string[];
    provenance: string;
    notice: string;
  };
  getUnifiedFarmContext(farm: FarmProfile, userSoilReport?: SoilReport | null, weatherData?: WeatherData | null): UnifiedFarmContext;
}

// 1. India Provider Adapter (GEE + ISRO / NRSC / Bhuvan + FAOSTAT + IMD)
export const IndiaProviderAdapter: CountryProviderAdapter = {
  country: 'India',
  getGeographicHierarchy(stateRegion, locationName) {
    return {
      state: stateRegion || 'Punjab',
      district: locationName || 'Ludhiana',
      zone: 'Trans-Gangetic Plains Region (Zone VI)',
    };
  },
  getNationalGeospatialContext(state, district, lat, lon) {
    return {
      providerName: 'ISRO / NRSC / Bhuvan',
      available: true,
      layers: ['Bhuvan LULC 250k', 'Bhuvan Agro-Climatic Atlas', 'NRSC Land Degradation Map'],
      provenance: 'ISRO / NRSC / Bhuvan — India geospatial data',
      notice: `ISRO Bhuvan Open Data Layer active for ${district}, ${state}`,
    };
  },
  getUnifiedFarmContext(farm, userSoilReport, weatherData) {
    return createUnifiedFarmContext(farm, userSoilReport, weatherData);
  },
};

// 2. Brazil Provider Adapter (GEE + FAOSTAT + INPE / MAPBIOMAS Adapter)
export const BrazilProviderAdapter: CountryProviderAdapter = {
  country: 'Brazil',
  getGeographicHierarchy(stateRegion, locationName) {
    return {
      state: stateRegion || 'Mato Grosso',
      district: locationName || 'Sorriso',
      zone: 'Cerrado Agricultural Biome',
    };
  },
  getNationalGeospatialContext(state, district, lat, lon) {
    return {
      providerName: 'INPE / MapBiomas Brazil',
      available: true,
      layers: ['MapBiomas Land Cover v8', 'INPE PRODES Deforestation Alert'],
      provenance: 'INPE / MapBiomas — Brazil National Satellite Data',
      notice: `MapBiomas Brazil satellite coverage active for ${district}, ${state}`,
    };
  },
  getUnifiedFarmContext(farm, userSoilReport, weatherData) {
    return createUnifiedFarmContext(farm, userSoilReport, weatherData);
  },
};

// 3. Russia Provider Adapter (GEE + FAOSTAT + Roskosmos / IKOR Adapter)
export const RussiaProviderAdapter: CountryProviderAdapter = {
  country: 'Russia',
  getGeographicHierarchy(stateRegion, locationName) {
    return {
      state: stateRegion || 'Krasnodar Krai',
      district: locationName || 'Krasnodar',
      zone: 'Chernozem Soil Agricultural Zone',
    };
  },
  getNationalGeospatialContext(state, district, lat, lon) {
    return {
      providerName: 'Roskosmos / IKOR Satellite Archive',
      available: true,
      layers: ['Roskosmos Agricultural Land Monitoring', 'VEGA Satellite Vegetation Telemetry'],
      provenance: 'Roskosmos / VEGA — Russian Earth Observation',
      notice: `VEGA Agricultural Remote Sensing active for ${district}, ${state}`,
    };
  },
  getUnifiedFarmContext(farm, userSoilReport, weatherData) {
    return createUnifiedFarmContext(farm, userSoilReport, weatherData);
  },
};

// 4. China Provider Adapter (GEE + FAOSTAT + CASEarth / Gaofen Adapter)
export const ChinaProviderAdapter: CountryProviderAdapter = {
  country: 'China',
  getGeographicHierarchy(stateRegion, locationName) {
    return {
      state: stateRegion || 'Heilongjiang',
      district: locationName || 'Harbin',
      zone: 'Northeast China Black Soil Agricultural Region',
    };
  },
  getNationalGeospatialContext(state, district, lat, lon) {
    return {
      providerName: 'CASEarth / Gaofen Crop Monitoring',
      available: true,
      layers: ['Gaofen High-Res Agricultural Index', 'CASEarth Global Cropland Grid'],
      provenance: 'CASEarth / Gaofen — China Satellite Data',
      notice: `Gaofen Satellite Monitoring active for ${district}, ${state}`,
    };
  },
  getUnifiedFarmContext(farm, userSoilReport, weatherData) {
    return createUnifiedFarmContext(farm, userSoilReport, weatherData);
  },
};

// 5. South Africa Provider Adapter (GEE + FAOSTAT + SANSA / AGRI-SAT Adapter)
export const SouthAfricaProviderAdapter: CountryProviderAdapter = {
  country: 'South Africa',
  getGeographicHierarchy(stateRegion, locationName) {
    return {
      state: stateRegion || 'Free State',
      district: locationName || 'Bloemfontein',
      zone: 'Highveld Maize Agro-Climatic Belt',
    };
  },
  getNationalGeospatialContext(state, district, lat, lon) {
    return {
      providerName: 'SANSA (South African National Space Agency)',
      available: true,
      layers: ['SANSA Crop Census Layer', 'NCBI Soil Water Telemetry'],
      provenance: 'SANSA — South Africa Earth Observation',
      notice: `SANSA Agricultural Satellite Monitoring active for ${district}, ${state}`,
    };
  },
  getUnifiedFarmContext(farm, userSoilReport, weatherData) {
    return createUnifiedFarmContext(farm, userSoilReport, weatherData);
  },
};

// Master Provider Dispatcher
export function getCountryProviderAdapter(country: string = 'India'): CountryProviderAdapter {
  switch (country.trim()) {
    case 'Brazil':
      return BrazilProviderAdapter;
    case 'Russia':
      return RussiaProviderAdapter;
    case 'China':
      return ChinaProviderAdapter;
    case 'South Africa':
      return SouthAfricaProviderAdapter;
    case 'India':
    default:
      return IndiaProviderAdapter;
  }
}
