// src/components/DataProvenanceBadge.tsx
// Data Provenance & Source Labeling Badge Component

import React from 'react';
import { Globe, Satellite, Database, FlaskConical, CloudSun, ShieldCheck } from 'lucide-react';

export type ProvenanceType =
  | 'earth_engine'
  | 'isro_bhuvan'
  | 'faostat'
  | 'user_soil_test'
  | 'imd_weather'
  | 'india_gov'
  | 'gemini_ai';

interface DataProvenanceBadgeProps {
  type: ProvenanceType;
  customText?: string;
  size?: 'xs' | 'sm';
  className?: string;
}

export const DataProvenanceBadge: React.FC<DataProvenanceBadgeProps> = ({
  type,
  customText,
  size = 'xs',
  className = '',
}) => {
  const sizeClasses = size === 'xs' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';

  switch (type) {
    case 'earth_engine':
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full bg-cyan-100 dark:bg-cyan-950/80 text-cyan-900 dark:text-cyan-200 border border-cyan-300/60 dark:border-cyan-800 font-medium ${sizeClasses} ${className}`}
          title="Google Earth Engine — Remote Sensing & Satellite Telemetry Catalog"
        >
          <Satellite className="w-3 h-3 text-cyan-600 dark:text-cyan-400 shrink-0" />
          <span>{customText || 'Google Earth Engine — satellite-derived'}</span>
        </span>
      );

    case 'isro_bhuvan':
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 border border-amber-300/60 dark:border-amber-800 font-medium ${sizeClasses} ${className}`}
          title="ISRO / NRSC / Bhuvan — National Geospatial & Remote Sensing Layer"
        >
          <Globe className="w-3 h-3 text-amber-600 dark:text-amber-400 shrink-0" />
          <span>{customText || 'ISRO / NRSC / Bhuvan — India geospatial data'}</span>
        </span>
      );

    case 'faostat':
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-900 dark:text-blue-200 border border-blue-300/60 dark:border-blue-800 font-medium ${sizeClasses} ${className}`}
          title="FAOSTAT — Official UN Food & Agriculture Organization Statistical Datasets"
        >
          <Database className="w-3 h-3 text-blue-600 dark:text-blue-400 shrink-0" />
          <span>{customText || 'FAOSTAT — agricultural statistics'}</span>
        </span>
      );

    case 'user_soil_test':
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full bg-purple-100 dark:bg-purple-950/80 text-purple-900 dark:text-purple-200 border border-purple-300/60 dark:border-purple-800 font-medium ${sizeClasses} ${className}`}
          title="Authenticated User Soil Test / Laboratory Report from Farm Profile"
        >
          <FlaskConical className="w-3 h-3 text-purple-600 dark:text-purple-400 shrink-0" />
          <span>{customText || 'User Soil Test — Farm Profile'}</span>
        </span>
      );

    case 'imd_weather':
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full bg-sky-100 dark:bg-sky-950/80 text-sky-900 dark:text-sky-200 border border-sky-300/60 dark:border-sky-800 font-medium ${sizeClasses} ${className}`}
          title="IMD / National Meteorological Surface Telemetry"
        >
          <CloudSun className="w-3 h-3 text-sky-600 dark:text-sky-400 shrink-0" />
          <span>{customText || 'IMD — weather'}</span>
        </span>
      );

    case 'india_gov':
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-200 border border-emerald-300/60 dark:border-emerald-800 font-medium ${sizeClasses} ${className}`}
          title="India Open Government Data / Agmarknet Portal"
        >
          <Database className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>{customText || 'India Open Data — Portal'}</span>
        </span>
      );

    case 'gemini_ai':
    default:
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-200 border border-emerald-300/60 dark:border-emerald-800 font-medium ${sizeClasses} ${className}`}
          title="Gemini AI Multimodal Agricultural Reasoning Engine"
        >
          <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>{customText || 'Gemini AI — Reasoning Engine'}</span>
        </span>
      );
  }
};
