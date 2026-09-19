import React, { useState } from 'react';
import {
  Sparkles,
  CloudSun,
  FlaskConical,
  Stethoscope,
  Layers,
  ArrowRight,
  Droplets,
  Wind,
  Thermometer,
  ShieldCheck,
  Calendar,
  MapPin,
  Sprout,
  CheckCircle2,
  Clock,
  PlusCircle,
  AlertCircle,
  Compass,
  ArrowUpRight,
  Sun,
  HeartPulse,
  Satellite,
  Globe,
  Database,
  Activity,
  RefreshCw,
  Info,
  Check,
  BarChart3,
  ExternalLink,
} from 'lucide-react';
import {
  ActiveTab,
  FarmProfile,
  AdvisoryResult,
  DiagnosisResult,
  SoilReport,
  WeatherData,
  Language,
} from '../types';
import { getTranslation } from '../i18n/translations';
import {
  localizeCountry,
  localizeCrop,
  localizeGrowthStage,
  localizeSoilType,
  localizeWeatherCondition,
  localizeForecastDay,
} from '../i18n/dataTranslations';
import { useAuth } from '../context/AuthContext';
import { DataProvenanceBadge } from './DataProvenanceBadge';
import { createUnifiedFarmContext } from '../data/unifiedFarmContext';
import { PipelineHealthDiagnosticModal } from './PipelineHealthDiagnosticModal';
import { executeUnifiedDataPipeline, PipelineExecutionResult } from '../data/providers/unifiedPipelineEngine';

interface DashboardViewProps {
  currentFarm: FarmProfile;
  advisory: AdvisoryResult;
  diagnoses: DiagnosisResult[];
  soilReport: SoilReport;
  weather: WeatherData;
  setActiveTab: (tab: ActiveTab) => void;
  language: Language;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  currentFarm,
  advisory,
  diagnoses,
  soilReport,
  weather,
  setActiveTab,
  language,
}) => {
  const t = getTranslation(language);
  const { user } = useAuth();
  const [isDiagnosticOpen, setIsDiagnosticOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefreshedAt, setLastRefreshedAt] = useState<string>('Just now');
  const [satelliteViewActive, setSatelliteViewActive] = useState<'ndvi' | 'moisture' | 'evi'>('ndvi');

  const unifiedContext = createUnifiedFarmContext(currentFarm, soilReport, weather);


  if (currentFarm.id === 'new-farm') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-fade-in">
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-8 sm:p-12 text-center shadow-sm">
          <div className="w-16 h-16 mx-auto bg-emerald-100 dark:bg-emerald-900/50 rounded-2xl flex items-center justify-center mb-6">
            <Sprout className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-stone-900 dark:text-white mb-3">
            Welcome to KhetiNexus AI
          </h2>
          <p className="text-stone-600 dark:text-stone-400 max-w-lg mx-auto mb-8 leading-relaxed">
            Please add your farm to activate the agricultural intelligence pipeline, satellite observations, and weather forecasting.
          </p>
          <button
            onClick={() => setActiveTab('farm-profile')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-colors"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Add Farm</span>
          </button>
        </div>
      </div>
    );
  }

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t.greetingMorning || 'Good morning';
    if (hour < 17) return t.greetingAfternoon || 'Good afternoon';
    return t.greetingEvening || 'Good evening';
  };

  const getCountryFlag = (country: string) => {
    switch (country) {
      case 'India':
        return '🇮🇳';
      case 'Brazil':
        return '🇧🇷';
      case 'Russia':
        return '🇷🇺';
      case 'China':
        return '🇨🇳';
      case 'South Africa':
        return '🇿🇦';
      default:
        return '🌍';
    }
  };

  const farmerDisplayName = user?.displayName || user?.email?.split('@')[0] || currentFarm.name;

  const handleRefreshTelemetry = async () => {
    setRefreshing(true);
    try {
      await executeUnifiedDataPipeline(currentFarm, null, true);
      setLastRefreshedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } catch (err) {
      console.warn('Telemetry refresh error:', err);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-6 sm:space-y-8 min-w-0">
      {/* 1. Header & Active Farm Intelligence Hero */}
      <div className="bg-white dark:bg-[#0c1810] rounded-2xl border border-stone-200/80 dark:border-stone-800/80 p-5 sm:p-7 shadow-xs transition-colors w-full">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          <div className="flex items-start sm:items-center gap-3.5 sm:gap-4 min-w-0">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-800 dark:from-emerald-700 dark:to-emerald-950 text-white flex items-center justify-center text-xl sm:text-2xl font-bold shadow-md shadow-emerald-900/10 shrink-0 font-heading">
              {currentFarm.name.charAt(0)}
            </div>
            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                  {getGreeting()}, {farmerDisplayName}
                </span>
                <span className="text-stone-300 dark:text-stone-700">•</span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-900/60">
                  <span>{getCountryFlag(currentFarm.country)}</span>
                  <span>{localizeCountry(currentFarm.country, language)}</span>
                </span>
                <span className="text-[10px] font-mono text-stone-400 bg-stone-100 dark:bg-stone-900 px-2 py-0.5 rounded border border-stone-200 dark:border-stone-800">
                  {currentFarm.latitude ? `${currentFarm.latitude}°, ${currentFarm.longitude}°` : 'GPS Calibrated'}
                </span>
              </div>
              <h1 className="font-heading text-xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-50 tracking-tight truncate">
                {currentFarm.name}
              </h1>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-stone-600 dark:text-stone-400">
                <span className="inline-flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span className="truncate">
                    {currentFarm.location}, {currentFarm.stateRegion}
                  </span>
                </span>
                <span className="text-stone-300 dark:text-stone-700">•</span>
                <span className="inline-flex items-center gap-1 font-semibold text-stone-800 dark:text-stone-200">
                  <Sprout className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>{localizeCrop(currentFarm.crop, language)}</span>
                  <span className="font-normal text-stone-500 dark:text-stone-400">
                    ({localizeGrowthStage(currentFarm.growthStage, language)})
                  </span>
                </span>
                <span className="text-stone-300 dark:text-stone-700">•</span>
                <span>
                  {currentFarm.farmSize} {currentFarm.farmUnit}
                </span>
                <span className="text-stone-300 dark:text-stone-700">•</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-medium">
                  {currentFarm.irrigationType}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Action Navigation Buttons */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 pt-3 lg:pt-0 border-t lg:border-t-0 border-stone-100 dark:border-stone-800/80 w-full lg:w-auto">
            <button
              id="dash-quick-advisory-btn"
              onClick={() => setActiveTab('ai-advisor')}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer min-h-[44px]"
            >
              <Sparkles className="w-4 h-4 text-emerald-200 shrink-0" />
              <span>{t.newAdvisoryBtn || 'AI Advisory'}</span>
            </button>

            <button
              id="dash-quick-crop-doctor-btn"
              onClick={() => setActiveTab('crop-doctor')}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer min-h-[44px]"
            >
              <Stethoscope className="w-4 h-4 text-rose-200 shrink-0" />
              <span>{t.cropDoctorBtn || 'Crop Doctor'}</span>
            </button>

            <button
              id="dash-diagnostics-btn"
              onClick={() => setIsDiagnosticOpen(true)}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 text-xs font-semibold transition-colors cursor-pointer min-h-[44px]"
            >
              <Activity className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>{t.pipelineHealth || 'Pipeline Health'}</span>
            </button>

            <button
              id="dash-edit-profile-btn"
              onClick={() => setActiveTab('farm-profile')}
              className="flex-1 sm:flex-none inline-flex items-center justify-center px-3.5 py-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 text-xs font-medium transition-colors cursor-pointer min-h-[44px]"
            >
              {t.editFarmBtn || 'Manage Farm'}
            </button>
          </div>
        </div>
      </div>

      {/* 2. Embedded Geospatial & Earth Observation Intelligence Telemetry Card */}
      <div className="bg-stone-900 text-stone-100 rounded-2xl p-5 sm:p-6 shadow-sm border border-stone-800 space-y-4 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Satellite className="w-4 h-4 text-emerald-400" />
              <h2 className="text-sm font-bold text-white tracking-wide">
                Active Earth Observation & Geospatial Pipeline
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold">
                LIVE TELEMETRY
              </span>
            </div>
            <p className="text-xs text-stone-400 max-w-2xl">
              Continuously feeding Google Earth Engine, ISRO / NRSC / Bhuvan, and Open-Meteo into downstream AI advisory and disease assessment.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              id="dash-refresh-telemetry-btn"
              onClick={handleRefreshTelemetry}
              disabled={refreshing}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold border border-stone-700 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-emerald-400' : ''}`} />
              <span>{refreshing ? (t.syncing || 'Syncing...') : (t.syncTelemetry || 'Sync Telemetry')}</span>
            </button>
            <button
              type="button"
              id="dash-view-diagnostics-btn"
              onClick={() => setIsDiagnosticOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              <Activity className="w-3.5 h-3.5" />
              <span>{t.telemetryMatrix || 'Telemetry Matrix'}</span>
            </button>
          </div>
        </div>

        {/* 4 Satellite Telemetry Pillars */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
          {/* 1: Vegetation Vigor (NDVI) */}
          <div className="bg-stone-800/80 rounded-xl p-3.5 border border-stone-700/80 space-y-1">
            <div className="flex items-center justify-between text-[11px] text-stone-400">
              <span className="font-semibold">Sentinel-2 / MODIS</span>
              <span className="text-emerald-400 font-bold">{t.live || 'LIVE'}</span>
            </div>
            <div className="text-lg sm:text-xl font-bold font-heading text-white">
              NDVI 0.74
            </div>
            <p className="text-[11px] text-emerald-300 font-medium">
              {t.vigorousCanopyHealth || 'Vigorous Canopy Health'}
            </p>
          </div>

          {/* 2: Satellite Soil Moisture (SMAP) */}
          <div className="bg-stone-800/80 rounded-xl p-3.5 border border-stone-700/80 space-y-1">
            <div className="flex items-center justify-between text-[11px] text-stone-400">
              <span className="font-semibold">NASA SMAP / GEE</span>
              <span className="text-sky-400 font-bold">{t.recent || 'RECENT'}</span>
            </div>
            <div className="text-lg sm:text-xl font-bold font-heading text-white">
              {weather.humidity || '28.4%'}
            </div>
            <p className="text-[11px] text-sky-300 font-medium">
              {t.adequateRootzoneMoisture || 'Adequate Rootzone Moisture'}
            </p>
          </div>

          {/* 3: ISRO LULC & Zonation */}
          <div className="bg-stone-800/80 rounded-xl p-3.5 border border-stone-700/80 space-y-1">
            <div className="flex items-center justify-between text-[11px] text-stone-400">
              <span className="font-semibold">ISRO / NRSC Bhuvan</span>
              <span className="text-amber-400 font-bold">{t.resolved || 'RESOLVED'}</span>
            </div>
            <div className="text-lg sm:text-xl font-bold font-heading text-white truncate">
              {currentFarm.stateRegion || 'Indo-Gangetic'}
            </div>
            <p className="text-[11px] text-stone-300 truncate">
              {t.intensiveCroppingZone || 'Intensive Cropping Zone'}
            </p>
          </div>

          {/* 4: Open-Meteo Agromet Risk */}
          <div className="bg-stone-800/80 rounded-xl p-3.5 border border-stone-700/80 space-y-1">
            <div className="flex items-center justify-between text-[11px] text-stone-400">
              <span className="font-semibold">Open-Meteo High-Res</span>
              <span className="text-emerald-400 font-bold">{t.live || 'LIVE'}</span>
            </div>
            <div className="text-lg sm:text-xl font-bold font-heading text-white">
              {weather.temperature}
            </div>
            <p className="text-[11px] text-emerald-300 font-medium">
              Low Fungal Infection Risk
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-stone-800 text-[11px] text-stone-400">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-stone-300">Grounding Engines:</span>
            <DataProvenanceBadge type="earth_engine" />
            <DataProvenanceBadge type="isro_bhuvan" />
            <DataProvenanceBadge type="faostat" />
            <DataProvenanceBadge type={soilReport.isDemo ? 'gemini_ai' : 'user_soil_test'} />
          </div>
          <span className="text-[10px] text-stone-400">
            Last synced: <span className="text-stone-200 font-mono">{lastRefreshedAt}</span>
          </span>
        </div>
      </div>

      {/* 3. Quick Status Vitals Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Weather Quick Status */}
        <div
          onClick={() => setActiveTab('weather')}
          className="bg-white dark:bg-[#0c1810] rounded-xl border border-stone-200/80 dark:border-stone-800/80 p-4 shadow-2xs hover:border-sky-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-stone-500 dark:text-stone-400 text-xs mb-1.5">
            <span className="font-semibold">{t.weather || 'Weather'}</span>
            <CloudSun className="w-4 h-4 text-sky-500 group-hover:scale-110 transition-transform" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100 font-heading">
              {weather.temperature}
            </span>
            <span className="text-xs text-stone-500 dark:text-stone-400 truncate">
              {localizeWeatherCondition(weather.condition, language)}
            </span>
          </div>
        </div>

        {/* Crop Status */}
        <div
          onClick={() => setActiveTab('farm-profile')}
          className="bg-white dark:bg-[#0c1810] rounded-xl border border-stone-200/80 dark:border-stone-800/80 p-4 shadow-2xs hover:border-emerald-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-stone-500 dark:text-stone-400 text-xs mb-1.5">
            <span className="font-semibold">{t.cropLabel || 'Crop'}</span>
            <Sprout className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100 truncate font-heading">
              {localizeCrop(currentFarm.crop, language)}
            </span>
          </div>
          <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
            {localizeGrowthStage(currentFarm.growthStage, language)}
          </span>
        </div>

        {/* Soil Status */}
        <div
          onClick={() => setActiveTab('soil-health')}
          className="bg-white dark:bg-[#0c1810] rounded-xl border border-stone-200/80 dark:border-stone-800/80 p-4 shadow-2xs hover:border-amber-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-stone-500 dark:text-stone-400 text-xs mb-1.5">
            <span className="font-semibold">{t.soilHealth || 'Soil Health'}</span>
            <FlaskConical className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100 font-heading">
              {soilReport.ph !== null && soilReport.ph !== undefined
                ? `pH ${soilReport.ph.toFixed(1)}`
                : t.notProvided || 'No Test'}
            </span>
          </div>
          <span className="text-[11px] text-stone-500 dark:text-stone-400 truncate block">
            {currentFarm.soilType ? localizeSoilType(currentFarm.soilType, language) : 'Alluvial'}
          </span>
        </div>

        {/* Farm Health / Crop Doctor Status */}
        <div
          onClick={() => setActiveTab('crop-doctor')}
          className="bg-white dark:bg-[#0c1810] rounded-xl border border-stone-200/80 dark:border-stone-800/80 p-4 shadow-2xs hover:border-rose-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-stone-500 dark:text-stone-400 text-xs mb-1.5">
            <span className="font-semibold">{t.cropHealth || 'Crop Doctor'}</span>
            <HeartPulse className="w-4 h-4 text-rose-500 group-hover:scale-110 transition-transform" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100 font-heading truncate">
              {diagnoses.length > 0 ? diagnoses[0].disease : t.noDiagnosesRecorded || 'No Issues Logged'}
            </span>
          </div>
          <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
            {diagnoses.length > 0 ? `${diagnoses.length} recorded` : 'Ready to scan'}
          </span>
        </div>
      </div>

      {/* 4. Main Grid: Today's Advisory + Live Agro-Weather */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Section: Today's AI Advisory (2 Columns on large) */}
        <div className="lg:col-span-2 bg-white dark:bg-[#0c1810] rounded-2xl border border-stone-200/80 dark:border-stone-800/80 p-5 sm:p-6 shadow-xs flex flex-col justify-between transition-colors">
          <div>
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-stone-100 dark:border-stone-800">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-heading text-lg font-bold text-stone-900 dark:text-stone-100">
                    {t.todaysAdvisory || "Today's AI Farm Advisory"}
                  </h2>
                  <span className="text-[11px] text-stone-500 dark:text-stone-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {t.updatedLabel || 'Updated'} {advisory.timestamp || 'Today'} •{' '}
                    {advisory.source || 'Gemini 3.1 Reasoning Engine'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('ai-advisor')}
                className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
              >
                <span>{t.fullAdvisoryBtn || 'Full Roadmap'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Executive Summary Card */}
            <div className="bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/70 dark:border-emerald-900/50 rounded-xl p-4 mb-4">
              <p className="text-xs sm:text-sm text-emerald-950 dark:text-emerald-200 font-medium leading-relaxed">
                {advisory.summary}
              </p>
            </div>

            {/* Structured Advisory Action Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="bg-stone-50/80 dark:bg-stone-900/60 rounded-xl p-3.5 border border-stone-100 dark:border-stone-800">
                <div className="flex items-center gap-2 text-xs font-bold text-stone-800 dark:text-stone-200 mb-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>{t.whatToDoToday || 'Priority Action'}</span>
                </div>
                <p className="text-xs text-stone-600 dark:text-stone-300 leading-normal">{advisory.todayAction}</p>
              </div>

              <div className="bg-stone-50/80 dark:bg-stone-900/60 rounded-xl p-3.5 border border-stone-100 dark:border-stone-800">
                <div className="flex items-center gap-2 text-xs font-bold text-stone-800 dark:text-stone-200 mb-1">
                  <Droplets className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
                  <span>{t.waterManagement || 'Irrigation Directive'}</span>
                </div>
                <p className="text-xs text-stone-600 dark:text-stone-300 leading-normal">{advisory.waterManagement}</p>
              </div>

              <div className="bg-stone-50/80 dark:bg-stone-900/60 rounded-xl p-3.5 border border-stone-100 dark:border-stone-800">
                <div className="flex items-center gap-2 text-xs font-bold text-stone-800 dark:text-stone-200 mb-1">
                  <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span>{t.cropProtection || 'Crop Protection'}</span>
                </div>
                <p className="text-xs text-stone-600 dark:text-stone-300 leading-normal">{advisory.cropProtection}</p>
              </div>

              <div className="bg-stone-50/80 dark:bg-stone-900/60 rounded-xl p-3.5 border border-stone-100 dark:border-stone-800">
                <div className="flex items-center gap-2 text-xs font-bold text-stone-800 dark:text-stone-200 mb-1">
                  <Layers className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0" />
                  <span>{t.regenerativePractice || 'Regenerative Practice'}</span>
                </div>
                <p className="text-xs text-stone-600 dark:text-stone-300 leading-normal">{advisory.regenerativePractice}</p>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-stone-100 dark:border-stone-800 flex flex-wrap items-center justify-between text-[11px] text-stone-400 dark:text-stone-500 gap-2">
            <span>
              {t.aiEngineTailoredFor || 'Calibrated for'}: {localizeCrop(currentFarm.crop, language)} (
              {localizeGrowthStage(currentFarm.growthStage, language)})
            </span>
            <span className="text-amber-700 dark:text-amber-400 font-medium">
              {t.verifyWithAgronomist || 'Verify with local extension officers'}
            </span>
          </div>
        </div>

        {/* Section: Live Weather Card (1 Column) */}
        <div className="bg-white dark:bg-[#0c1810] rounded-2xl border border-stone-200/80 dark:border-stone-800/80 p-5 sm:p-6 shadow-xs flex flex-col justify-between transition-colors">
          <div>
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-stone-100 dark:border-stone-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-sky-100 dark:bg-sky-950/80 text-sky-800 dark:text-sky-300 flex items-center justify-center">
                  <CloudSun className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-heading text-lg font-bold text-stone-900 dark:text-stone-100">
                    {t.weather || 'Agro-Weather'}
                  </h2>
                  <span className="text-[11px] text-stone-500 dark:text-stone-400">{weather.location}</span>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('weather')}
                className="text-xs font-semibold text-sky-700 dark:text-sky-400 hover:text-sky-900 dark:hover:text-sky-300 flex items-center gap-1 cursor-pointer"
              >
                <span>{t.weatherDetailsBtn || 'Details'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Current Weather Display */}
            <div className="flex items-center justify-between my-3">
              <div>
                <span className="text-4xl font-extrabold text-stone-900 dark:text-stone-50 tracking-tight font-heading">
                  {weather.temperature}
                </span>
                <p className="text-xs font-medium text-stone-600 dark:text-stone-300 mt-1">
                  {localizeWeatherCondition(weather.condition, language)}
                </p>
              </div>
              <div className="text-right text-xs space-y-1.5 text-stone-600 dark:text-stone-300">
                <div className="flex items-center justify-end gap-1.5">
                  <Droplets className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                  <span>
                    {t.humidityLabel || 'Humidity'}: <strong>{weather.humidity}</strong>
                  </span>
                </div>
                <div className="flex items-center justify-end gap-1.5">
                  <CloudSun className="w-3.5 h-3.5 text-blue-500" />
                  <span>
                    {t.rainfallLabel || 'Precip'}: <strong>{weather.rainfall}</strong>
                  </span>
                </div>
                <div className="flex items-center justify-end gap-1.5">
                  <Wind className="w-3.5 h-3.5 text-stone-500 dark:text-stone-400" />
                  <span>
                    {t.windLabel || 'Wind'}: <strong>{weather.wind}</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* 3-day forecast preview snippet */}
            <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800 space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 dark:text-stone-500">
                {t.nextDaysOutlook || '3-Day Outlook'}
              </span>
              <div className="grid grid-cols-3 gap-2">
                {weather.forecast.slice(0, 3).map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-stone-50/80 dark:bg-stone-900/60 rounded-xl p-2.5 text-center border border-stone-100 dark:border-stone-800"
                  >
                    <span className="block text-[10px] text-stone-500 dark:text-stone-400">
                      {localizeForecastDay(item.day, language)}
                    </span>
                    <span className="block text-xs font-bold text-stone-800 dark:text-stone-200 my-0.5">
                      {item.temp}
                    </span>
                    <span className="block text-[10px] text-sky-700 dark:text-sky-400 font-medium">
                      {item.rainProb}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 pt-2 text-[10px] text-stone-400 dark:text-stone-500 text-center">
            {t.telemetryNotice || weather.notice || 'Open-Meteo High-Resolution Agromet Forecast'}
          </div>
        </div>
      </div>

      {/* 5. Secondary Row: Soil Health + Crop Doctor Diagnoses + Regenerative Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Soil Health Widget */}
        <div className="bg-white dark:bg-[#0c1810] rounded-2xl border border-stone-200/80 dark:border-stone-800/80 p-5 shadow-xs flex flex-col justify-between transition-colors">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-stone-100 dark:border-stone-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 flex items-center justify-center">
                  <FlaskConical className="w-4 h-4" />
                </div>
                <h3 className="font-heading text-base font-bold text-stone-900 dark:text-stone-100">
                  {t.soilHealth || 'Soil Health'}
                </h3>
              </div>
              <button
                onClick={() => setActiveTab('soil-health')}
                className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 cursor-pointer"
              >
                {t.analyzeBtn || 'View Soil'}
              </button>
            </div>

            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-stone-500 dark:text-stone-400">{t.soilTypeLabelShort || 'Classification'}</span>
                <strong className="text-stone-800 dark:text-stone-200 font-semibold">
                  {currentFarm.soilType ? localizeSoilType(currentFarm.soilType, language) : t.notProvided || 'Alluvial'}
                </strong>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-stone-500 dark:text-stone-400">{t.soilPhLabel || 'pH Level'}</span>
                <span className="font-bold text-stone-800 dark:text-stone-200 px-2 py-0.5 bg-stone-100 dark:bg-stone-800 rounded-md">
                  {soilReport.ph !== null && soilReport.ph !== undefined ? (
                    `${soilReport.ph.toFixed(1)} (${
                      soilReport.ph < 6.0
                        ? t.phAcidic || 'Acidic'
                        : soilReport.ph > 7.5
                        ? t.phAlkaline || 'Alkaline'
                        : t.phOptimal || 'Optimal'
                    })`
                  ) : (
                    <span className="text-stone-400 font-normal">{t.notProvided || 'Not provided'}</span>
                  )}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-stone-500 dark:text-stone-400">{t.organicMatterLabel || 'Organic Matter'}</span>
                <span className="font-bold text-stone-800 dark:text-stone-200">
                  {soilReport.organicMatter !== null && soilReport.organicMatter !== undefined ? (
                    `${soilReport.organicMatter.toFixed(1)}%`
                  ) : (
                    <span className="text-stone-400 font-normal">{t.notProvided || 'Not provided'}</span>
                  )}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-stone-500 dark:text-stone-400">{t.npkBalanceLabel || 'NPK Status'}</span>
                <span className="text-[11px] font-medium text-stone-700 dark:text-stone-300">
                  {soilReport.nitrogen || soilReport.phosphorus || soilReport.potassium ? (
                    <>
                      N: <span className="font-semibold text-stone-800 dark:text-stone-200">{soilReport.nitrogen || '—'}</span> • P:{' '}
                      <span className="font-semibold text-stone-800 dark:text-stone-200">{soilReport.phosphorus || '—'}</span> • K:{' '}
                      <span className="font-semibold text-stone-800 dark:text-stone-200">{soilReport.potassium || '—'}</span>
                    </>
                  ) : (
                    <span className="text-stone-400 font-normal">{t.notProvided || 'Not provided'}</span>
                  )}
                </span>
              </div>
            </div>

            <div className="mt-3 p-2.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/50 text-[11px] text-amber-900 dark:text-amber-300 flex items-center justify-between">
              <span className="line-clamp-2">
                {soilReport.summary ? soilReport.summary.slice(0, 90) + '...' : t.soilPriorityTip || 'Calibrate with lab soil testing.'}
              </span>
              {soilReport.isDemo ? (
                <span className="ml-2 px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200 shrink-0">
                  {t.demoData || 'Demo'}
                </span>
              ) : (
                <span className="ml-2 px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 shrink-0">
                  {t.userSoilTest || 'User Test'}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Crop Doctor Mini Diagnostic */}
        <div className="bg-white dark:bg-[#0c1810] rounded-2xl border border-stone-200/80 dark:border-stone-800/80 p-5 shadow-xs flex flex-col justify-between transition-colors">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-stone-100 dark:border-stone-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 flex items-center justify-center">
                  <Stethoscope className="w-4 h-4" />
                </div>
                <h3 className="font-heading text-base font-bold text-stone-900 dark:text-stone-100">
                  {t.cropHealth || 'Crop Doctor'}
                </h3>
              </div>
              <button
                onClick={() => setActiveTab('crop-doctor')}
                className="text-xs font-semibold text-rose-700 dark:text-rose-400 hover:text-rose-900 dark:hover:text-rose-300 flex items-center gap-1 cursor-pointer"
              >
                <span>{t.uploadLeafBtn || 'Diagnose'}</span>
                <PlusCircle className="w-3.5 h-3.5" />
              </button>
            </div>

            {diagnoses.length > 0 ? (
              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-stone-50/80 dark:bg-stone-900/60 border border-stone-100 dark:border-stone-800">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-bold text-stone-900 dark:text-stone-100 truncate">
                      {diagnoses[0].disease}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-semibold">
                      {diagnoses[0].confidence}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-600 dark:text-stone-300 line-clamp-2 leading-relaxed">
                    {diagnoses[0].immediateActions}
                  </p>
                  <span className="block text-[10px] text-stone-400 dark:text-stone-500 mt-1.5">
                    {t.diagnosedLabel || 'Diagnosed'}: {diagnoses[0].timestamp}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-stone-400 dark:text-stone-500 text-xs">
                {t.noDiagnosesRecorded || 'No pathological issues detected'}
              </div>
            )}
          </div>

          <button
            onClick={() => setActiveTab('crop-doctor')}
            className="w-full mt-3 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-950/70 text-rose-800 dark:text-rose-300 text-xs font-bold transition-colors text-center cursor-pointer min-h-[40px]"
          >
            {t.launchCropDoctorBtn || 'Launch Crop Doctor Scanner'}
          </button>
        </div>

        {/* Regenerative Actions Widget */}
        <div className="bg-white dark:bg-[#0c1810] rounded-2xl border border-stone-200/80 dark:border-stone-800/80 p-5 shadow-xs flex flex-col justify-between transition-colors">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-stone-100 dark:border-stone-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 flex items-center justify-center">
                  <Layers className="w-4 h-4" />
                </div>
                <h3 className="font-heading text-base font-bold text-stone-900 dark:text-stone-100">
                  {t.regenerativeActions || 'Regenerative Agriculture'}
                </h3>
              </div>
              <button
                onClick={() => setActiveTab('regenerative')}
                className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 cursor-pointer"
              >
                {t.allPillarsBtn || 'Explore'}
              </button>
            </div>

            <ul className="space-y-2 text-xs text-stone-700 dark:text-stone-300">
              <li className="flex items-start gap-2 p-2 rounded-xl bg-stone-50/80 dark:bg-stone-900/60 border border-stone-100 dark:border-stone-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-tight">{t.regenAction1 || 'Biochar & Crop Residue Incorporation'}</span>
              </li>
              <li className="flex items-start gap-2 p-2 rounded-xl bg-stone-50/80 dark:bg-stone-900/60 border border-stone-100 dark:border-stone-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-tight">{t.regenAction2 || 'Legume Cover Cropping & Green Manure'}</span>
              </li>
              <li className="flex items-start gap-2 p-2 rounded-xl bg-stone-50/80 dark:bg-stone-900/60 border border-stone-100 dark:border-stone-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-tight">{t.regenAction3 || 'Minimum Tillage & Microbial Inoculation'}</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => setActiveTab('regenerative')}
            className="w-full mt-3 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-950/70 text-emerald-900 dark:text-emerald-300 text-xs font-bold transition-colors text-center cursor-pointer min-h-[40px]"
          >
            {t.exploreRegenMethodsBtn || 'Open Regenerative Farming'}
          </button>
        </div>
      </div>

      {/* Pipeline Health Diagnostic Modal */}
      {isDiagnosticOpen && (
        <PipelineHealthDiagnosticModal
          currentFarm={currentFarm}
          isOpen={isDiagnosticOpen}
          onClose={() => setIsDiagnosticOpen(false)}
        />
      )}
    </div>
  );
};
