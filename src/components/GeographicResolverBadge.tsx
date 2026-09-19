// src/components/GeographicResolverBadge.tsx
// Geographic Resolution Level & Location Hierarchy Badge

import React from 'react';
import { MapPin, Compass, Navigation } from 'lucide-react';
import { UnifiedFarmContext } from '../data/unifiedFarmContext';

interface GeographicResolverBadgeProps {
  context: UnifiedFarmContext;
  className?: string;
}

export const GeographicResolverBadge: React.FC<GeographicResolverBadgeProps> = ({ context, className = '' }) => {
  const { farm } = context;
  const isCoordinates = farm.geographicResolutionLevel === 'farm_coordinates';

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold ${
        isCoordinates
          ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
          : 'bg-stone-100 dark:bg-stone-800/80 border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-300'
      } ${className}`}
    >
      {isCoordinates ? (
        <Compass className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 animate-spin-slow" />
      ) : (
        <MapPin className="w-3.5 h-3.5 text-stone-600 dark:text-stone-400 shrink-0" />
      )}
      <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-2">
        <span className="font-bold">{farm.country}</span>
        <span className="hidden sm:inline text-stone-400">•</span>
        <span>{farm.state}</span>
        <span className="hidden sm:inline text-stone-400">•</span>
        <span>{farm.district}</span>
        {farm.subDistrict && (
          <>
            <span className="hidden sm:inline text-stone-400">•</span>
            <span className="opacity-90">{farm.subDistrict}</span>
          </>
        )}
      </div>
      <span className="ml-auto text-[10px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/10">
        {isCoordinates ? 'GPS Exact' : 'District Fallback'}
      </span>
    </div>
  );
};
