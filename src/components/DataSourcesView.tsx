import React from 'react';
import {
  Database,
  Satellite,
  Globe,
  CloudSun,
  ShieldAlert,
  ExternalLink,
  CheckCircle2,
  Clock,
  Layers,
} from 'lucide-react';
import { DataProvenanceBadge } from './DataProvenanceBadge';

export const DataSourcesView: React.FC = () => {
  const sources = [
    {
      id: 'gee',
      name: 'Google Earth Engine & Copernicus Earth Observation',
      badgeType: 'earth_engine' as const,
      icon: Satellite,
      color: 'text-cyan-600 dark:text-cyan-400',
      bgColor: 'bg-cyan-50 dark:bg-cyan-950/40 border-cyan-200 dark:border-cyan-800/60',
      description: 'Provides high-resolution multispectral satellite imagery, vegetation indices (NDVI/EVI), and volumetric soil moisture telemetry for farm boundaries.',
      whatItProvides: '10m-20m Sentinel-2 Surface Reflectance, Normalized Difference Vegetation Index (NDVI), NASA-USDA SMAP 10km soil moisture, and MODIS Evapotranspiration (ET).',
      geographicScope: 'Global (Any latitude & longitude bounding box)',
      freshnessCharacteristic: 'LATEST_AVAILABLE (Updated every 5 days upon Sentinel-2 satellite pass)',
      datasetName: 'COPERNICUS/S2_SR_HARMONIZED & NASA/USDA/HSL/SMAP10KM',
      limitations: 'Satellite optical imagery can be obstructed by heavy cloud cover during monsoon peak weeks; fallback radar or soil telemetry applied.',
    },
    {
      id: 'isro',
      name: 'ISRO / NRSC / Bhuvan Geoportal',
      badgeType: 'isro_bhuvan' as const,
      icon: Layers,
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60',
      description: 'Official Indian Space Research Organisation geospatial layers, land use / land cover classification, and agro-climatic terrain mapping.',
      whatItProvides: '1:50,000 scale Land Use / Land Cover (LULC), Soil Salinity & Degradation Atlas, Surface Water Reservoir Telemetry, and Agro-Climatic Planning Zone boundaries.',
      geographicScope: 'India Only (28 States & 8 Union Territories)',
      freshnessCharacteristic: 'LATEST_AVAILABLE (Seasonal / Annual NRSC Atlas Surveys)',
      datasetName: 'Bhuvan 1:50,000 LULC & NRSC Agro-Climatic Atlas',
      limitations: 'Bhuvan spatial layers apply exclusively to Indian sovereign territories. Unavailable for non-Indian farm profiles.',
    },
    {
      id: 'faostat',
      name: 'Food and Agriculture Organization (FAOSTAT)',
      badgeType: 'faostat' as const,
      icon: Globe,
      color: 'text-amber-600 dark:text-amber-400',
      bgColor: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/60',
      description: 'Global agricultural statistical domain providing national yield benchmarks, fertilizer intensity, and crop production volumes.',
      whatItProvides: 'National crop yield averages (tonnes/ha), harvested area (ha), annual production totals (tonnes), and fertilizer consumption intensity (kg N/ha).',
      geographicScope: 'Global (All FAO Member States including India, Brazil, Russia, China, South Africa)',
      freshnessCharacteristic: 'HISTORICAL / LATEST AVAILABLE (Annual FAOSTAT Statistical Reporting, e.g. Year 2023/2024)',
      datasetName: 'FAOSTAT Production Quantities & Crop Yields (Domain QCL)',
      limitations: 'FAOSTAT reports aggregate national macro-statistics. Must be used as a comparative benchmark, not a direct micro-field measurement.',
    },
    {
      id: 'weather',
      name: 'Open-Meteo & IMD Meteorological Engine',
      badgeType: 'imd_weather' as const,
      icon: CloudSun,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800/60',
      description: 'Operational high-resolution meteorological telemetry providing real-time ambient temperature, relative humidity, precipitation, and 5-day forecasts.',
      whatItProvides: 'Current ambient temperature (°C), relative humidity (%), surface precipitation (mm), wind speed/direction, and 5-day localized weather forecast.',
      geographicScope: 'Global (Localized by precise farm latitude & longitude)',
      freshnessCharacteristic: 'LIVE (Hourly real-time sensor updates)',
      datasetName: 'Open-Meteo High-Resolution Meteorological Forecast Engine',
      limitations: 'Rapid micro-climate shifts in mountain valleys can cause short-term variance from station forecasts.',
    },
    {
      id: 'indiagov',
      name: 'Ministry of Agriculture & Farmers Welfare (Agmarknet)',
      badgeType: 'india_gov' as const,
      icon: Database,
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-50 dark:bg-orange-950/40 border-orange-200 dark:border-orange-800/60',
      description: 'Official Indian agricultural market prices and Agromet bulletins from the Directorate of Marketing and Inspection.',
      whatItProvides: 'Daily APMC mandi modal prices (₹/quintal), min/max market rates, Minimum Support Price (MSP) benchmarks, and IMD Agromet bulletins.',
      geographicScope: 'India (District-level APMC mandis across Indian States)',
      freshnessCharacteristic: 'NEAR_REAL_TIME (Daily mandi trading telemetry)',
      datasetName: 'Agmarknet Daily Mandi Telemetry & Agromet Advisories',
      limitations: 'Mandi price updates depend on trading day APMC arrivals and market operational hours.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="bg-white dark:bg-stone-900 rounded-2xl p-6 shadow-xs border border-stone-200 dark:border-stone-800 space-y-2">
        <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
          <Database className="w-4 h-4" />
          <span>Authoritative Open Data Provenance & Transparency</span>
        </div>
        <h1 className="text-2xl font-bold text-stone-900 dark:text-white">
          Data Sources, Providers & Limitations
        </h1>
        <p className="text-sm text-stone-600 dark:text-stone-300 max-w-3xl leading-relaxed">
          KhetiNexus AI strictly separates ground-truth lab soil tests from remote-sensing satellite imagery and official macro-statistics. Review our connected open data providers, dataset names, freshness models, and scope limitations.
        </p>
      </div>

      {/* Grid of Data Sources */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sources.map((src) => {
          const Icon = src.icon;
          return (
            <div
              key={src.id}
              className={`rounded-2xl p-5 border shadow-xs space-y-4 ${src.bgColor}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className={`p-2 rounded-xl bg-white dark:bg-stone-900 shadow-xs ${src.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-stone-900 dark:text-white">
                      {src.name}
                    </h3>
                    <div className="mt-1">
                      <DataProvenanceBadge type={src.badgeType} />
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed font-medium">
                {src.description}
              </p>

              <div className="space-y-2 pt-2 border-t border-stone-200/60 dark:border-stone-800/60 text-xs">
                <div>
                  <span className="font-bold text-stone-900 dark:text-white">Data Provided: </span>
                  <span className="text-stone-700 dark:text-stone-300">{src.whatItProvides}</span>
                </div>
                <div>
                  <span className="font-bold text-stone-900 dark:text-white">Geographic Scope: </span>
                  <span className="text-stone-700 dark:text-stone-300">{src.geographicScope}</span>
                </div>
                <div>
                  <span className="font-bold text-stone-900 dark:text-white">Freshness Model: </span>
                  <span className="text-stone-700 dark:text-stone-300">{src.freshnessCharacteristic}</span>
                </div>
                <div>
                  <span className="font-bold text-stone-900 dark:text-white">Official Dataset: </span>
                  <code className="text-[11px] font-mono bg-white/80 dark:bg-stone-900/80 px-1.5 py-0.5 rounded text-stone-800 dark:text-stone-200">
                    {src.datasetName}
                  </code>
                </div>
                <div className="pt-1 text-[11px] text-stone-600 dark:text-stone-400 italic">
                  <strong>Limitations: </strong> {src.limitations}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Non-Endorsement & Scientific Transparency Notice */}
      <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-200 text-xs space-y-2">
        <div className="flex items-center gap-2 font-bold text-sm">
          <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          <span>Non-Endorsement & Academic Hackathon Disclaimer</span>
        </div>
        <p className="leading-relaxed text-amber-800 dark:text-amber-300">
          KhetiNexus AI is an independent open-source hackathon project designed for agricultural intelligence and regenerative farming recommendations. Data is retrieved via public REST endpoints, open geospatial APIs, and official statistical APIs (FAOSTAT, Open-Meteo, Copernicus, Bhuvan, Agmarknet). Mention of ISRO, FAO, Google Earth Engine, or Ministry datasets does not imply official government or institutional endorsement.
        </p>
      </div>
    </div>
  );
};
