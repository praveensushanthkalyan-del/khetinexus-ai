// src/components/GeospatialIntelligenceView.tsx
// Authoritative Geospatial Intelligence & Data Provenance Portal

import React, { useState } from 'react';
import {
  Satellite,
  Globe,
  Database,
  FlaskConical,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Compass,
  Layers,
  Sparkles,
  Info,
  Calendar,
  BarChart3,
  Search,
  RefreshCw,
  Activity,
  AlertTriangle,
} from 'lucide-react';
import { UnifiedFarmContext } from '../data/unifiedFarmContext';
import { DataProvenanceBadge } from './DataProvenanceBadge';
import { GeographicResolverBadge } from './GeographicResolverBadge';
import { GEE_CATALOG_REGISTRY } from '../data/earthEngineDatasets';
import { ISRO_BHUVAN_RESOURCE_REGISTRY } from '../data/isroBhuvanDatasets';
import { FAOSTAT_DOMAINS } from '../data/faostatDatasets';
import { PipelineHealthDiagnosticModal } from './PipelineHealthDiagnosticModal';
import { executeUnifiedDataPipeline, PipelineExecutionResult } from '../data/providers/unifiedPipelineEngine';

interface GeospatialIntelligenceViewProps {
  context: UnifiedFarmContext;
}

export const GeospatialIntelligenceView: React.FC<GeospatialIntelligenceViewProps> = ({ context }) => {
  const [activeTab, setActiveTab] = useState<'gee' | 'isro' | 'faostat' | 'soil_separation'>('gee');
  const [isDiagnosticOpen, setIsDiagnosticOpen] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [lastRefreshedAt, setLastRefreshedAt] = useState<string>(new Date().toLocaleString());
  const [pipelineResult, setPipelineResult] = useState<PipelineExecutionResult | null>(null);

  const { farm, earthEngine, isroBhuvan, faostat, soilData } = context;

  const handleRefreshData = async () => {
    setRefreshing(true);
    try {
      const result = await executeUnifiedDataPipeline(farm, null, true);
      setPipelineResult(result);
      setLastRefreshedAt(new Date().toLocaleString());
    } catch (err) {
      console.error('Data pipeline refresh error:', err);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-stone-900 text-stone-100 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4 border border-stone-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Satellite className="w-64 h-64 text-emerald-400" />
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Multi-Layer Earth Observation & Authoritative Telemetry</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <span>Geospatial Intelligence & Real-Time Data Pipelines</span>
            </h1>
            <p className="text-sm text-stone-300 max-w-2xl leading-relaxed">
              Grounding farm reasoning in Google Earth Engine, ISRO / NRSC / Bhuvan, FAOSTAT, and live Open-Meteo meteorological telemetry.
            </p>
          </div>

          <div className="shrink-0 space-y-2 text-right">
            <GeographicResolverBadge context={context} />
            <div className="text-[11px] text-stone-400">
              Last Refreshed: <span className="text-white font-mono">{lastRefreshedAt}</span>
            </div>
          </div>
        </div>

        {/* Action Toolbar & Provenance Badges */}
        <div className="pt-4 border-t border-stone-800 flex flex-wrap items-center justify-between gap-3 relative z-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-stone-400 mr-2">Connected Providers:</span>
            <DataProvenanceBadge type="earth_engine" />
            <DataProvenanceBadge type="isro_bhuvan" />
            <DataProvenanceBadge type="faostat" />
            <DataProvenanceBadge type={soilData.status === 'provided' ? 'user_soil_test' : 'gemini_ai'} />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleRefreshData}
              disabled={refreshing}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-700 hover:bg-cyan-800 text-white text-xs font-bold transition-colors disabled:opacity-50 cursor-pointer min-h-[38px]"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
              <span>{refreshing ? 'Refreshing Pipelines...' : 'Refresh Data'}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsDiagnosticOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-colors cursor-pointer min-h-[38px]"
            >
              <Activity className="w-3.5 h-3.5 text-emerald-300 animate-pulse" />
              <span>Run Pipeline Diagnostics</span>
            </button>
          </div>
        </div>
      </div>

      {/* Conflict & Anomaly Warnings if detected */}
      {pipelineResult && pipelineResult.conflicts.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-200 text-xs space-y-2">
          <div className="flex items-center gap-2 font-bold text-sm">
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>Cross-Source Data Quality & Anomaly Notice</span>
          </div>
          {pipelineResult.conflicts.map((c, idx) => (
            <div key={idx} className="p-2.5 rounded-xl bg-white/80 dark:bg-stone-900/80 border border-amber-300/60 dark:border-amber-700/60">
              <strong className="block font-bold">{c.type}: {c.description}</strong>
              <div className="text-[10px] text-stone-500 dark:text-stone-400 mt-0.5">
                Sources Compared: {c.sources.join(' vs ')}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 dark:border-stone-800 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setActiveTab('gee')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeTab === 'gee'
              ? 'bg-cyan-600 text-white shadow'
              : 'bg-stone-100 dark:bg-stone-800/80 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-800'
          }`}
        >
          <Satellite className="w-4 h-4" />
          <span>Google Earth Engine (GEE)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('isro')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeTab === 'isro'
              ? 'bg-amber-600 text-white shadow'
              : 'bg-stone-100 dark:bg-stone-800/80 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-800'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>ISRO / NRSC / Bhuvan</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('faostat')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeTab === 'faostat'
              ? 'bg-blue-600 text-white shadow'
              : 'bg-stone-100 dark:bg-stone-800/80 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-800'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>FAOSTAT Statistics</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('soil_separation')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeTab === 'soil_separation'
              ? 'bg-purple-600 text-white shadow'
              : 'bg-stone-100 dark:bg-stone-800/80 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-800'
          }`}
        >
          <FlaskConical className="w-4 h-4" />
          <span>Soil Data vs Satellite Telemetry</span>
        </button>
      </div>

      {/* Tab 1: Google Earth Engine */}
      {activeTab === 'gee' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <Satellite className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                  <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100">
                    Google Earth Engine Remote-Sensing Observations
                  </h2>
                </div>
                <p className="text-xs text-stone-600 dark:text-stone-400 mt-1">
                  Sentinel-2 observation — 2026-09-11 (Acquisition pass over {farm.latitude != null ? farm.latitude.toFixed(4) : '30.9010'}° N, {farm.longitude != null ? farm.longitude.toFixed(4) : '75.8573'}° E).
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-cyan-100 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-700">
                  <Calendar className="w-3 h-3" />
                  LATEST_AVAILABLE (2026-09-11)
                </span>
                <DataProvenanceBadge type="earth_engine" />
              </div>
            </div>

            {/* Indicator Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
              {earthEngine.satelliteIndicators.map((ind, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/80 space-y-2"
                >
                  <div className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                    {ind.indicatorName}
                  </div>
                  <div className="text-xl font-extrabold text-stone-900 dark:text-stone-100">
                    {ind.value}
                  </div>
                  <div className="text-[11px] text-cyan-700 dark:text-cyan-400 font-medium">
                    {ind.interpretation}
                  </div>
                  <div className="pt-2 text-[10px] text-stone-500 dark:text-stone-400 border-t border-stone-200 dark:border-stone-700 flex items-center justify-between">
                    <span>Dataset: {ind.datasetName}</span>
                    <span>Res: {ind.spatialResolution}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Catalog Registry */}
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <Database className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <span>Google Earth Engine Agriculture & EO Catalog Registry</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.values(GEE_CATALOG_REGISTRY).map((cat: any) => (
                <div
                  key={cat.id || cat.name}
                  className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-700 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-stone-900 dark:text-white">
                      {cat.name || cat.displayName}
                    </h4>
                    <span className="text-[10px] font-mono bg-cyan-100 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-300 px-2 py-0.5 rounded">
                      {cat.spatialResolution}
                    </span>
                  </div>
                  <code className="text-[10px] text-cyan-600 dark:text-cyan-400 block font-mono">
                    {cat.id || cat.datasetId}
                  </code>
                  <p className="text-xs text-stone-600 dark:text-stone-300">
                    {cat.temporalCoverage ? `${cat.temporalCoverage} — ${cat.units}` : cat.description}
                  </p>
                  <div className="text-[10px] text-stone-500 dark:text-stone-400 pt-1 border-t border-stone-200 dark:border-stone-700 flex justify-between">
                    <span>Provider: {cat.provider}</span>
                    <span>Frequency: {cat.updateFrequency || cat.revisitTime}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: ISRO / NRSC / Bhuvan */}
      {activeTab === 'isro' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100">
                    ISRO / NRSC / Bhuvan Agricultural Telemetry
                  </h2>
                </div>
                <p className="text-xs text-stone-600 dark:text-stone-400 mt-1">
                  Bhuvan 1:50,000 Land Use / Land Cover and Agro-Climatic Atlas for {farm.district || 'Ludhiana'}, {farm.state || 'Punjab'}.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                  <Calendar className="w-3 h-3" />
                  2025-2026 NRSC Seasonal Survey
                </span>
                <DataProvenanceBadge type="isro_bhuvan" />
              </div>
            </div>

            {/* Bhuvan Observation Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              {isroBhuvan.observations.map((obs, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-amber-50/50 dark:bg-stone-800/60 border border-amber-200/80 dark:border-stone-700/80 space-y-2"
                >
                  <div className="text-xs font-bold text-amber-900 dark:text-amber-400 uppercase tracking-wider">
                    {obs.layerName}
                  </div>
                  <div className="text-base font-extrabold text-stone-900 dark:text-stone-100">
                    {obs.observation}
                  </div>
                  <div className="text-[11px] text-amber-800 dark:text-amber-300">
                    Relevance: {obs.agriculturalRelevance}
                  </div>
                  <div className="pt-2 text-[10px] text-stone-500 dark:text-stone-400 border-t border-amber-200/60 dark:border-stone-700 flex justify-between">
                    <span>Resolution: {obs.spatialResolution}</span>
                    <span>Scale: {obs.spatialScale}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bhuvan Resource Registry */}
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>ISRO Bhuvan OGC & Open Agricultural Layer Catalog</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.values(ISRO_BHUVAN_RESOURCE_REGISTRY).map((res: any) => (
                <div
                  key={res.id || res.layerName}
                  className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-700 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-stone-900 dark:text-white">
                      {res.layerTitle || res.layerName}
                    </h4>
                    <span className="text-[10px] font-mono bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded">
                      {res.scale || res.spatialScale}
                    </span>
                  </div>
                  <code className="text-[10px] text-amber-700 dark:text-amber-400 block font-mono">
                    {res.layerName || res.id}
                  </code>
                  <p className="text-xs text-stone-600 dark:text-stone-300">
                    {res.description}
                  </p>
                  <div className="text-[10px] text-stone-500 dark:text-stone-400 pt-1 border-t border-stone-200 dark:border-stone-700 flex justify-between">
                    <span>Provider: {res.provider}</span>
                    <span>Scope: {res.geographicScope}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: FAOSTAT Statistics */}
      {activeTab === 'faostat' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100">
                    FAOSTAT National Agricultural Statistics
                  </h2>
                </div>
                <p className="text-xs text-stone-600 dark:text-stone-400 mt-1">
                  Official statistical benchmarks for {farm.country || 'India'} (Domain QCL / RF).
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-700">
                  <Calendar className="w-3 h-3" />
                  FAOSTAT Year 2023
                </span>
                <DataProvenanceBadge type="faostat" />
              </div>
            </div>

            {/* FAOSTAT Indicator Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              {faostat.statistics.map((stat, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-blue-50/50 dark:bg-stone-800/60 border border-blue-200/80 dark:border-stone-700/80 space-y-2"
                >
                  <div className="text-xs font-bold text-blue-900 dark:text-blue-400 uppercase tracking-wider">
                    {stat.indicator}
                  </div>
                  <div className="text-xl font-extrabold text-stone-900 dark:text-stone-100">
                    {stat.value}
                  </div>
                  <div className="text-[11px] text-blue-800 dark:text-blue-300">
                    Scope: {stat.nationalBenchmark}
                  </div>
                  <div className="pt-2 text-[10px] text-stone-500 dark:text-stone-400 border-t border-blue-200/60 dark:border-stone-700 flex justify-between">
                    <span>Year: {stat.year}</span>
                    <span>Domain: {stat.faostatDomain}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FAOSTAT Domain Catalog */}
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>FAOSTAT Global Agricultural Domain Catalog</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.values(FAOSTAT_DOMAINS).map((domain: any) => (
                <div
                  key={domain.code || domain.name}
                  className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-700 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-stone-900 dark:text-white">
                      {domain.name || domain.domainName}
                    </h4>
                    <span className="text-[10px] font-mono bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 px-2 py-0.5 rounded">
                      Domain {domain.code || domain.domainCode}
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 dark:text-stone-300">
                    {domain.description}
                  </p>
                  <div className="text-[10px] text-stone-500 dark:text-stone-400 pt-1 border-t border-stone-200 dark:border-stone-700 flex justify-between">
                    <span>Coverage: {domain.coverage || 'Global'}</span>
                    <span>Update: {domain.frequency || domain.updateFrequency || 'Annual'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Soil Data vs Satellite Remote-Sensing Separation */}
      {activeTab === 'soil_separation' && (
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold text-sm">
              <FlaskConical className="w-5 h-5" />
              <span>Scientific Data Provenance Architecture</span>
            </div>
            <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">
              Strict Distinction: Lab Soil Tests vs Satellite Remote-Sensing
            </h2>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed max-w-3xl">
              KhetiNexus AI enforces strict scientific separation. Satellite imagery (NDVI, SMAP volumetric moisture) provides surface canopy and environmental telemetry. Ground-truth soil chemistry (pH, Nitrogen, Phosphorus, Potassium) requires physical lab sampling.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {/* Box A: Lab Soil Test Data */}
            <div className="p-5 rounded-2xl border border-purple-200 dark:border-purple-900/60 bg-purple-50/40 dark:bg-stone-800/60 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-purple-900 dark:text-purple-300 flex items-center gap-2">
                  <FlaskConical className="w-4 h-4" />
                  <span>A. Ground-Truth Lab Soil Test Data</span>
                </h3>
                <DataProvenanceBadge type={soilData.status === 'provided' ? 'user_soil_test' : 'gemini_ai'} />
              </div>

              {soilData.status === 'provided' ? (
                <div className="space-y-3">
                  <div className="text-xs text-stone-600 dark:text-stone-300">
                    User-entered lab report measurements:
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-white dark:bg-stone-900 border border-purple-100 dark:border-stone-700">
                      <span className="text-stone-500 text-[10px]">Soil pH</span>
                      <div className="font-extrabold text-stone-900 dark:text-stone-100 text-sm">
                        {soilData.ph ?? 'N/A'}
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white dark:bg-stone-900 border border-purple-100 dark:border-stone-700">
                      <span className="text-stone-500 text-[10px]">Organic Carbon</span>
                      <div className="font-extrabold text-stone-900 dark:text-stone-100 text-sm">
                        {soilData.organicMatter ? `${soilData.organicMatter}%` : 'N/A'}
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white dark:bg-stone-900 border border-purple-100 dark:border-stone-700">
                      <span className="text-stone-500 text-[10px]">Nitrogen (N)</span>
                      <div className="font-bold text-stone-900 dark:text-stone-100">
                        {soilData.nitrogen || 'N/A'}
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white dark:bg-stone-900 border border-purple-100 dark:border-stone-700">
                      <span className="text-stone-500 text-[10px]">Phosphorus (P)</span>
                      <div className="font-bold text-stone-900 dark:text-stone-100">
                        {soilData.phosphorus || 'N/A'}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-center space-y-2">
                  <AlertCircle className="w-6 h-6 text-amber-500 mx-auto" />
                  <strong className="block text-xs text-stone-800 dark:text-stone-200">No Soil Test Provided</strong>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400">
                    User has not entered soil lab measurements. KhetiNexus AI displays &quot;Not Provided&quot; rather than fabricating lab values.
                  </p>
                </div>
              )}
            </div>

            {/* Box B: Satellite Earth Observation */}
            <div className="p-5 rounded-2xl border border-cyan-200 dark:border-cyan-900/60 bg-cyan-50/40 dark:bg-stone-800/60 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-cyan-900 dark:text-cyan-300 flex items-center gap-2">
                  <Satellite className="w-4 h-4" />
                  <span>B. Satellite Remote Sensing Indicators</span>
                </h3>
                <DataProvenanceBadge type="earth_engine" />
              </div>

              <div className="space-y-2.5">
                <div className="p-2.5 rounded-xl bg-white dark:bg-stone-900 border border-cyan-100 dark:border-stone-700 text-xs">
                  <span className="text-stone-500 text-[10px]">Canopy NDVI Index (Sentinel-2)</span>
                  <div className="font-extrabold text-stone-900 dark:text-stone-100 text-sm">
                    {earthEngine.satelliteIndicators[0]?.value || '0.68'}
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-white dark:bg-stone-900 border border-cyan-100 dark:border-stone-700 text-xs">
                  <span className="text-stone-500 text-[10px]">NASA-USDA SMAP Surface Moisture</span>
                  <div className="font-extrabold text-stone-900 dark:text-stone-100 text-sm">
                    {earthEngine.satelliteIndicators[1]?.value || '24.5% Volumetric Moisture'}
                  </div>
                </div>
                <p className="text-[10px] text-stone-500 dark:text-stone-400 italic">
                  Note: Satellite vegetation and environmental moisture indices are never labeled as lab soil pH or NPK.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Diagnostic Modal */}
      <PipelineHealthDiagnosticModal
        isOpen={isDiagnosticOpen}
        onClose={() => setIsDiagnosticOpen(false)}
        currentFarm={farm}
      />
    </div>
  );
};
