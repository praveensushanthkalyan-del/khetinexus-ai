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
  localizeWindSpeed,
  localizeIrrigation,
  localizeFarmName,
  localizeFarmUnit,
  formatFarmValue,
  formatFarmLocation,
  localizeCanopyStatus,
  localizeLandUse,
  localizeAgroClimaticZone,
  localizeTelemetryPillarTitle,
} from '../i18n/dataTranslations';
import { localizeSoilRating, localizeSoilSummary } from '../i18n/soilHealthTranslations';
import { normalizeLang } from '../i18n/farmValueTranslations';
import { useAuth } from '../context/AuthContext';
import { DataProvenanceBadge } from './DataProvenanceBadge';
import { createUnifiedFarmContext } from '../data/unifiedFarmContext';
import { PipelineHealthDiagnosticModal } from './PipelineHealthDiagnosticModal';
import { executeUnifiedDataPipeline, PipelineExecutionResult } from '../data/providers/unifiedPipelineEngine';
import { detectExtremeWeatherAlerts } from '../lib/weatherAlerts';
import { WeatherAlertBanner } from './WeatherAlertBanner';

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
  const { user, userProfile, farmerName } = useAuth();
  const [isDiagnosticOpen, setIsDiagnosticOpen] = useState(false);
  const [pipelineResult, setPipelineResult] = useState<PipelineExecutionResult | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefreshedAt, setLastRefreshedAt] = useState<string>(t.notSyncedYet);
  const [satelliteViewActive, setSatelliteViewActive] = useState<'ndvi' | 'moisture' | 'evi'>('ndvi');

  const unifiedContext = createUnifiedFarmContext(currentFarm, soilReport, weather);

  // Auto-fetch pipeline telemetry when active farm changes
  React.useEffect(() => {
    let isMounted = true;
    if (currentFarm && currentFarm.id !== 'new-farm') {
      executeUnifiedDataPipeline(currentFarm, soilReport, false)
        .then((res) => {
          if (isMounted && res) {
            setPipelineResult(res);
            setLastRefreshedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
          }
        })
        .catch((err) => {
          console.warn('Initial pipeline fetch error:', err);
        });
    }
    return () => {
      isMounted = false;
    };
  }, [currentFarm.id, currentFarm.latitude, currentFarm.longitude]);


  if (currentFarm.id === 'new-farm') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-fade-in">
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-8 sm:p-12 text-center shadow-sm">
          <div className="w-16 h-16 mx-auto bg-emerald-100 dark:bg-emerald-900/50 rounded-2xl flex items-center justify-center mb-6">
            <Sprout className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-stone-900 dark:text-white mb-3">
            {t.welcomeToKhetiNexus}
          </h2>
          <p className="text-stone-600 dark:text-stone-400 max-w-lg mx-auto mb-8 leading-relaxed">
            {t.addFarmPrompt}
          </p>
          <button
            onClick={() => setActiveTab('farm-profile')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-colors"
          >
            <PlusCircle className="w-5 h-5" />
            <span>{t.addFarmBtn}</span>
          </button>
        </div>
      </div>
    );
  }

  const getGreeting = () => {
    const hour = new Date().getHours();
    const norm = (normalizeLang(language) || 'en').toLowerCase();

    const morningMap: Record<string, string> = {
      te: 'శుభోదయం',
      hi: 'शुभ प्रभात',
      ta: 'காலை வணக்கம்',
      kn: 'ಶುಭೋದಯ',
      ml: 'സുപ്രഭാതം',
      mr: 'शुभ प्रभात',
      gu: 'શુભ સવાર',
      bn: 'সুপ্রভাত',
      pa: 'ਸ਼ੁਭ ਸਵੇਰ',
      or: 'ଶୁଭ ସକାଳ',
      as: 'শুভ পুৱা',
      ur: 'صبح بخیر',
      es: 'Buenos días',
      fr: 'Bonjour',
      pt: 'Bom dia',
      ru: 'Доброе утро',
      zh: '早上好',
      ar: 'صباح الخير',
      en: 'Good morning',
    };

    const afternoonMap: Record<string, string> = {
      te: 'శుభ మధ్యాహ్నం',
      hi: 'शुभ दोपहर',
      ta: 'மதிய வணக்கம்',
      kn: 'ಶುಭ ಮಧ್ಯಾಹ್ನ',
      ml: 'ശുഭ ഉച്ചതിരിഞ്ഞ്',
      mr: 'शुभ दुपार',
      gu: 'શુભ બપોર',
      bn: 'শুভ দুপুর',
      pa: 'ਸ਼ੁਭ ਦੁਪਹਿਰ',
      or: 'ଶୁଭ ଅପରାହ୍ନ',
      as: 'শুভ দুপৰীয়া',
      ur: 'دوپہر بخیر',
      es: 'Buenas tardes',
      fr: 'Bon après-midi',
      pt: 'Boa tarde',
      ru: 'Добрый день',
      zh: '下午好',
      ar: 'مساء الخير',
      en: 'Good afternoon',
    };

    const eveningMap: Record<string, string> = {
      te: 'శుభ సాయంత్రం',
      hi: 'शुभ संध्या',
      ta: 'மாலை வணக்கம்',
      kn: 'ಶುಭ ಸಂಜೆ',
      ml: 'ശുഭ സായാഹ്നം',
      mr: 'शुभ संध्याकाळ',
      gu: 'શુભ સાંજ',
      bn: 'শুভ সন্ধ্যা',
      pa: 'ਸ਼ੁਭ ਸ਼ਾਮ',
      or: 'ଶୁଭ ସନ୍ଧ୍ୟା',
      as: 'শুভ সন্ধিয়া',
      ur: 'شام بخیر',
      es: 'Buenas noches',
      fr: 'Bonsoir',
      pt: 'Boa noite',
      ru: 'Добрый вечер',
      zh: '晚上好',
      ar: 'مساء الخير',
      en: 'Good evening',
    };

    if (hour < 12) return t.greetingMorning || morningMap[norm] || morningMap.en;
    if (hour < 17) return t.greetingAfternoon || afternoonMap[norm] || afternoonMap.en;
    return t.greetingEvening || eveningMap[norm] || eveningMap.en;
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

  const farmerWord: Record<string, string> = {
    te: 'రైతు మిత్రమా',
    hi: 'किसान साथी',
    ta: 'விவசாயி நண்பரே',
    kn: 'ರೈತ ಮಿತ್ರ',
    ml: 'കർഷക സുഹൃത്തേ',
    mr: 'शेतकरी मित्र',
    gu: 'ખેડૂત મિત્ર',
    bn: 'কৃষক বন্ধু',
    pa: 'ਕਿਸਾਨ ਵੀਰ',
    or: 'କୃଷକ ବନ୍ଧୁ',
    as: 'কৃষক বন্ধু',
    ur: 'کسان دوست',
    es: 'Agricultor',
    fr: 'Agriculteur',
    pt: 'Agricultor',
    ru: 'Фермер',
    zh: '农友',
    ar: 'مزارع',
    en: 'Farmer',
  };

  const norm = (normalizeLang(language) || 'en').toLowerCase();
  const rawDisplayName =
    currentFarm?.farmerName ||
    farmerName ||
    userProfile?.name ||
    user?.displayName ||
    (typeof window !== 'undefined' ? localStorage.getItem('khetinexus_farmer_name') : '') ||
    (user?.email ? user.email.split('@')[0] : '');
  const farmerDisplayName =
    rawDisplayName && rawDisplayName !== 'Farmer'
      ? rawDisplayName
      : currentFarm.name
      ? formatFarmValue(currentFarm.name, language, localizeFarmName)
      : farmerWord[norm] || 'Farmer';

  const handleRefreshTelemetry = async () => {
    setRefreshing(true);
    try {
      const res = await executeUnifiedDataPipeline(currentFarm, soilReport, true);
      setPipelineResult(res);
      setLastRefreshedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } catch (err) {
      console.warn('Telemetry refresh error:', err);
    } finally {
      setRefreshing(false);
    }
  };

  const extremeAlerts = detectExtremeWeatherAlerts(weather, language, currentFarm);

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-6 sm:space-y-8 min-w-0">
      {/* EXTREME WEATHER NOTIFICATION ALERTS */}
      <WeatherAlertBanner
        alerts={extremeAlerts}
        onNavigateTab={setActiveTab}
        language={language}
      />

      {/* GUEST PREVIEW DEMO FARM INDICATOR */}
      {!user && (
        <div className="bg-emerald-950/90 dark:bg-emerald-950/95 border border-emerald-800/80 rounded-2xl p-4 sm:p-5 text-emerald-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-800/80 flex items-center justify-center shrink-0">
              <Compass className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-800 text-emerald-200">
                  Guest Preview
                </span>
                <span className="text-xs font-bold text-emerald-300">
                  KhetiNexus Demo Farm • Warangal, Telangana
                </span>
              </div>
              <p className="text-xs text-emerald-200/90 mt-0.5">
                Demonstration mode. Live weather and AI advisory pipelines are active using demo farm context.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setActiveTab('farm-profile')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 text-xs font-bold transition-colors cursor-pointer shrink-0 self-start sm:self-auto"
          >
            <span>View Demo Profile</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 1. Header & Active Farm Intelligence Hero */}
      <div className="bg-white dark:bg-[#0c1810] rounded-2xl border border-stone-200/80 dark:border-stone-800/80 p-5 sm:p-7 shadow-xs transition-colors w-full">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          <div className="flex items-start sm:items-center gap-3.5 sm:gap-4 min-w-0">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-800 dark:from-emerald-700 dark:to-emerald-950 text-white flex items-center justify-center text-xl sm:text-2xl font-bold shadow-md shadow-emerald-900/10 shrink-0 font-heading">
              {currentFarm.name.charAt(0)}
            </div>
            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] sm:text-xs font-semibold text-emerald-700 dark:text-emerald-400 break-words max-w-full">
                  {getGreeting()}, {farmerDisplayName}
                </span>
                <span className="text-stone-300 dark:text-stone-700">•</span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-900/60">
                  <span>{getCountryFlag(currentFarm.country)}</span>
                  <span>{localizeCountry(currentFarm.country, language)}</span>
                </span>
                <span className="text-[10px] font-mono text-stone-400 bg-stone-100 dark:bg-stone-900 px-2 py-0.5 rounded border border-stone-200 dark:border-stone-800">
                  {currentFarm.latitude ? `${currentFarm.latitude}°, ${currentFarm.longitude}°` : t.gpsCalibrated}
                </span>
              </div>
              <h1 className="font-heading text-xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-50 tracking-tight truncate">
                {formatFarmValue(currentFarm.name, language, localizeFarmName)}
              </h1>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-stone-600 dark:text-stone-400">
                <span className="inline-flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span className="truncate">
                    {formatFarmLocation(currentFarm.location, currentFarm.stateRegion, language)}
                  </span>
                </span>
                <span className="text-stone-300 dark:text-stone-700">•</span>
                <span className="inline-flex items-center gap-1 font-semibold text-stone-800 dark:text-stone-200">
                  <Sprout className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>{formatFarmValue(currentFarm.crop, language, localizeCrop)}</span>
                  <span className="font-normal text-stone-500 dark:text-stone-400">
                    ({localizeGrowthStage(currentFarm.growthStage, language)})
                  </span>
                </span>
                <span className="text-stone-300 dark:text-stone-700">•</span>
                <span>
                  {currentFarm.farmSize} {localizeFarmUnit(currentFarm.farmUnit, language)}
                </span>
                <span className="text-stone-300 dark:text-stone-700">•</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-medium">
                  {formatFarmValue(currentFarm.irrigationType, language, localizeIrrigation)}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Action Navigation Buttons */}
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 sm:gap-2.5 pt-3 lg:pt-0 border-t lg:border-t-0 border-stone-100 dark:border-stone-800/80 w-full lg:w-auto">
            <button
              id="dash-quick-advisory-btn"
              onClick={() => setActiveTab('ai-advisor')}
              className="flex-1 sm:flex-initial sm:min-w-[140px] inline-flex items-center justify-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer min-h-[44px] text-center whitespace-nowrap"
            >
              <Sparkles className="w-4 h-4 text-emerald-200 shrink-0" />
              <span>{t.newAdvisoryBtn}</span>
            </button>

            <button
              id="dash-quick-crop-doctor-btn"
              onClick={() => setActiveTab('crop-doctor')}
              className="flex-1 sm:flex-initial sm:min-w-[140px] inline-flex items-center justify-center gap-2 px-3.5 sm:px-4 py-2.5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer min-h-[44px] text-center whitespace-nowrap"
            >
              <Stethoscope className="w-4 h-4 text-rose-200 shrink-0" />
              <span>{t.cropDoctorBtn}</span>
            </button>

            <button
              id="dash-diagnostics-btn"
              onClick={() => setIsDiagnosticOpen(true)}
              className="flex-1 sm:flex-initial sm:min-w-[140px] inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 text-xs font-semibold transition-colors cursor-pointer min-h-[44px] text-center whitespace-nowrap"
            >
              <Activity className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>{t.pipelineHealth}</span>
            </button>

            <button
              id="dash-edit-profile-btn"
              onClick={() => setActiveTab('farm-profile')}
              className="flex-1 sm:flex-initial sm:min-w-[140px] inline-flex items-center justify-center px-3.5 py-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 text-xs font-medium transition-colors cursor-pointer min-h-[44px] text-center whitespace-nowrap"
            >
              {t.editFarmBtn}
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
                {t.geospatialPipelineTitle}
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold">
                {t.liveTelemetry}
              </span>
            </div>
            <p className="text-xs text-stone-400 max-w-2xl">
              {t.geospatialPipelineDesc}
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
              <span>{refreshing ? t.syncing : t.syncTelemetry}</span>
            </button>
            <button
              type="button"
              id="dash-view-diagnostics-btn"
              onClick={() => setIsDiagnosticOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              <Activity className="w-3.5 h-3.5" />
              <span>{t.telemetryMatrix}</span>
            </button>
          </div>
        </div>

        {/* 4 Satellite Telemetry Pillars */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
          {/* 1: Vegetation Vigor (NDVI) */}
          <div className="bg-stone-800/80 rounded-xl p-3.5 border border-stone-700/80 space-y-1">
            <div className="flex items-center justify-between text-[11px] text-stone-400">
              <span className="font-semibold">{localizeTelemetryPillarTitle('sentinel2Modis', language) || t.sentinel2Modis}</span>
              <span className={pipelineResult ? "text-emerald-400 font-bold" : "text-stone-500 font-bold"}>
                {pipelineResult ? t.live : t.pending}
              </span>
            </div>
            <div className="text-lg sm:text-xl font-bold font-heading text-white">
              {pipelineResult ? `NDVI ${pipelineResult.providers.earthEngine.indicators.ndvi.toFixed(2)}` : t.ndviNotAvailable}
            </div>
            <p className="text-[11px] text-emerald-300 font-medium">
              {pipelineResult ? localizeCanopyStatus(pipelineResult.providers.earthEngine.indicators.canopyHealthStatus, language) : t.clickToSyncTelemetry}
            </p>
          </div>

          {/* 2: Satellite Soil Moisture (SMAP) */}
          <div className="bg-stone-800/80 rounded-xl p-3.5 border border-stone-700/80 space-y-1">
            <div className="flex items-center justify-between text-[11px] text-stone-400">
              <span className="font-semibold">{localizeTelemetryPillarTitle('nasaSmapGee', language) || t.nasaSmapGee}</span>
              <span className={pipelineResult ? "text-sky-400 font-bold" : "text-stone-500 font-bold"}>
                {pipelineResult ? t.recent : t.pending}
              </span>
            </div>
            <div className="text-lg sm:text-xl font-bold font-heading text-white">
              {pipelineResult ? `${Math.round(pipelineResult.providers.earthEngine.indicators.smapSoilMoistureVolumetric * 100)}% Vol` : (weather.humidity || t.noData)}
            </div>
            <p className="text-[11px] text-sky-300 font-medium">
              {pipelineResult ? t.satelliteSoilVolumetric : t.clickToSyncTelemetry}
            </p>
          </div>

          {/* 3: ISRO LULC & Zonation */}
          <div className="bg-stone-800/80 rounded-xl p-3.5 border border-stone-700/80 space-y-1">
            <div className="flex items-center justify-between text-[11px] text-stone-400">
              <span className="font-semibold">{localizeTelemetryPillarTitle('isroBhuvan', language) || t.isroBhuvan}</span>
              <span className={pipelineResult ? "text-amber-400 font-bold" : "text-stone-500 font-bold"}>
                {pipelineResult ? t.resolved : t.pending}
              </span>
            </div>
            <div className="text-lg sm:text-xl font-bold font-heading text-white truncate">
              {pipelineResult ? localizeAgroClimaticZone(pipelineResult.providers.isroBhuvan.agroClimaticZone, language) : (formatFarmLocation(undefined, currentFarm.stateRegion, language) || t.noData)}
            </div>
            <p className="text-[11px] text-stone-300 truncate">
              {pipelineResult ? localizeLandUse(pipelineResult.providers.isroBhuvan.landUseCategory, language) : t.agroClimaticZone}
            </p>
          </div>

          {/* 4: Open-Meteo Agromet Risk */}
          <div className="bg-stone-800/80 rounded-xl p-3.5 border border-stone-700/80 space-y-1">
            <div className="flex items-center justify-between text-[11px] text-stone-400">
              <span className="font-semibold">{localizeTelemetryPillarTitle('openMeteoHighRes', language) || t.openMeteoHighRes}</span>
              <span className="text-emerald-400 font-bold">{t.live}</span>
            </div>
            <div className="text-lg sm:text-xl font-bold font-heading text-white">
              {weather.temperature || t.noData}
            </div>
            <p className="text-[11px] text-emerald-300 font-medium">
              {localizeWeatherCondition(weather.condition, language) || t.lowInfectionRisk}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-stone-800 text-[11px] text-stone-400">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-stone-300">{t.groundingEngines}</span>
            <DataProvenanceBadge type="earth_engine" language={language} />
            <DataProvenanceBadge type="isro_bhuvan" language={language} />
            <DataProvenanceBadge type="faostat" language={language} />
            <DataProvenanceBadge type={soilReport.isDemo ? 'gemini_ai' : 'user_soil_test'} language={language} />
          </div>
          <span className="text-[10px] text-stone-400">
            {t.lastSynced}: <span className="text-stone-200 font-mono">{lastRefreshedAt}</span>
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
            <span className="font-semibold">{t.weather}</span>
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
            <span className="font-semibold">{t.cropLabel}</span>
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
            <span className="font-semibold">{t.soilHealth}</span>
            <FlaskConical className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100 font-heading">
              {soilReport.ph !== null && soilReport.ph !== undefined
                ? `pH ${soilReport.ph.toFixed(1)}`
                : t.notProvided}
            </span>
          </div>
          <span className="text-[11px] text-stone-500 dark:text-stone-400 truncate block">
            {currentFarm.soilType ? localizeSoilType(currentFarm.soilType, language) : t.alluvial}
          </span>
        </div>

        {/* Farm Health / Crop Doctor Status */}
        <div
          onClick={() => setActiveTab('crop-doctor')}
          className="bg-white dark:bg-[#0c1810] rounded-xl border border-stone-200/80 dark:border-stone-800/80 p-4 shadow-2xs hover:border-rose-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-stone-500 dark:text-stone-400 text-xs mb-1.5">
            <span className="font-semibold">{t.cropHealth}</span>
            <HeartPulse className="w-4 h-4 text-rose-500 group-hover:scale-110 transition-transform" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100 font-heading truncate">
              {diagnoses.length > 0 ? diagnoses[0].disease : t.noIssuesLogged}
            </span>
          </div>
          <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
            {diagnoses.length > 0 ? `${diagnoses.length} ${t.recorded}` : t.readyToScan}
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
                    {t.todaysAdvisory}
                  </h2>
                  <span className="text-[11px] text-stone-500 dark:text-stone-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {t.updatedLabel} {advisory.timestamp || t.today} •{' '}
                    {advisory.source || t.geminiReasoningEngine}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('ai-advisor')}
                className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
              >
                <span>{t.fullAdvisoryBtn}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {advisory.isDemo ? (
              <div className="bg-emerald-50/60 dark:bg-emerald-950/20 border border-dashed border-emerald-300 dark:border-emerald-800 rounded-2xl p-6 sm:p-8 text-center space-y-3.5 my-2">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 flex items-center justify-center">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-heading text-base font-bold text-stone-900 dark:text-stone-100">
                    {t.noAdvisoryYet}
                  </h3>
                  <p className="text-xs text-stone-600 dark:text-stone-400 max-w-md mx-auto mt-1 leading-relaxed">
                    {t.noAdvisoryPrompt} <strong className="text-stone-800 dark:text-stone-200">{currentFarm.name}</strong> ({currentFarm.crop}, {currentFarm.location}) {t.advisoryContextSuffix}
                  </p>
                </div>
                <button
                  id="dash-generate-advisory-btn"
                  onClick={() => setActiveTab('ai-advisor')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer min-h-[40px]"
                >
                  <Sparkles className="w-4 h-4 text-emerald-200" />
                  <span>{t.generateAiAdvisoryNow}</span>
                </button>
              </div>
            ) : (
              <>
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
                      <span>{t.whatToDoToday}</span>
                    </div>
                    <p className="text-xs text-stone-600 dark:text-stone-300 leading-normal">{advisory.todayAction}</p>
                  </div>

                  <div className="bg-stone-50/80 dark:bg-stone-900/60 rounded-xl p-3.5 border border-stone-100 dark:border-stone-800">
                    <div className="flex items-center gap-2 text-xs font-bold text-stone-800 dark:text-stone-200 mb-1">
                      <Droplets className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
                      <span>{t.waterManagement}</span>
                    </div>
                    <p className="text-xs text-stone-600 dark:text-stone-300 leading-normal">{advisory.waterManagement}</p>
                  </div>

                  <div className="bg-stone-50/80 dark:bg-stone-900/60 rounded-xl p-3.5 border border-stone-100 dark:border-stone-800">
                    <div className="flex items-center gap-2 text-xs font-bold text-stone-800 dark:text-stone-200 mb-1">
                      <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                      <span>{t.cropProtection}</span>
                    </div>
                    <p className="text-xs text-stone-600 dark:text-stone-300 leading-normal">{advisory.cropProtection}</p>
                  </div>

                  <div className="bg-stone-50/80 dark:bg-stone-900/60 rounded-xl p-3.5 border border-stone-100 dark:border-stone-800">
                    <div className="flex items-center gap-2 text-xs font-bold text-stone-800 dark:text-stone-200 mb-1">
                      <Layers className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0" />
                      <span>{t.regenerativePractice}</span>
                    </div>
                    <p className="text-xs text-stone-600 dark:text-stone-300 leading-normal">{advisory.regenerativePractice}</p>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="mt-5 pt-3 border-t border-stone-100 dark:border-stone-800 flex flex-wrap items-center justify-between text-[11px] text-stone-400 dark:text-stone-500 gap-2">
            <span>
              {t.aiEngineTailoredFor}: {localizeCrop(currentFarm.crop, language)} (
              {localizeGrowthStage(currentFarm.growthStage, language)})
            </span>
            <span className="text-amber-700 dark:text-amber-400 font-medium">
              {t.verifyWithAgronomist}
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
                    {t.weather}
                  </h2>
                  <span className="text-[11px] text-stone-500 dark:text-stone-400">
                    {formatFarmLocation(weather.location, undefined, language) || formatFarmLocation(currentFarm.location, currentFarm.stateRegion, language)}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('weather')}
                className="text-xs font-semibold text-sky-700 dark:text-sky-400 hover:text-sky-900 dark:hover:text-sky-300 flex items-center gap-1 cursor-pointer"
              >
                <span>{t.weatherDetailsBtn}</span>
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
                    {t.humidityLabel}: <strong>{weather.humidity}</strong>
                  </span>
                </div>
                <div className="flex items-center justify-end gap-1.5">
                  <CloudSun className="w-3.5 h-3.5 text-blue-500" />
                  <span>
                    {t.rainfallLabel}: <strong>{weather.rainfall}</strong>
                  </span>
                </div>
                <div className="flex items-center justify-end gap-1.5">
                  <Wind className="w-3.5 h-3.5 text-stone-500 dark:text-stone-400" />
                  <span>
                    {t.windLabel}: <strong>{localizeWindSpeed(weather.wind, language)}</strong>
                  </span>
                </div>
              </div>
            </div>

            {/* 3-day forecast preview snippet */}
            <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800 space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 dark:text-stone-500">
                {t.nextDaysOutlook}
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
            {t.telemetryNotice || weather.notice || t.telemetryNoticeDefault}
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
                  {t.soilHealth}
                </h3>
              </div>
              <button
                onClick={() => setActiveTab('soil-health')}
                className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 cursor-pointer"
              >
                {t.analyzeBtn}
              </button>
            </div>

            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-stone-500 dark:text-stone-400">{t.soilTypeLabelShort}</span>
                <strong className="text-stone-800 dark:text-stone-200 font-semibold">
                  {currentFarm.soilType ? localizeSoilType(currentFarm.soilType, language) : t.notProvided}
                </strong>
              </div>
              <div className="flex items-center justify-between text-xs gap-2">
                <span className="text-stone-500 dark:text-stone-400 shrink-0">{t.soilPhLabel}</span>
                <span className="font-bold text-stone-800 dark:text-stone-200 px-2 py-0.5 bg-stone-100 dark:bg-stone-800 rounded-md text-xs truncate text-right">
                  {soilReport.ph !== null && soilReport.ph !== undefined ? (
                    `${soilReport.ph.toFixed(1)} (${
                      soilReport.ph < 6.0
                        ? t.phAcidic
                        : soilReport.ph > 7.5
                        ? t.phAlkaline
                        : t.phOptimal
                    })`
                  ) : (
                    <span className="text-stone-400 font-normal">{t.notProvided}</span>
                  )}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs gap-2">
                <span className="text-stone-500 dark:text-stone-400 shrink-0">{t.organicMatterLabel}</span>
                <span className="font-bold text-stone-800 dark:text-stone-200 text-xs truncate text-right">
                  {soilReport.organicMatter !== null && soilReport.organicMatter !== undefined ? (
                    `${soilReport.organicMatter.toFixed(1)}%`
                  ) : (
                    <span className="text-stone-400 font-normal">{t.notProvided}</span>
                  )}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-stone-500 dark:text-stone-400">{t.npkBalanceLabel}</span>
                <span className="text-[11px] font-medium text-stone-700 dark:text-stone-300">
                  {soilReport.nitrogen || soilReport.phosphorus || soilReport.potassium ? (
                    <>
                      N: <span className="font-semibold text-stone-800 dark:text-stone-200">{soilReport.nitrogen ? localizeSoilRating(soilReport.nitrogen, language) : '—'}</span> • P:{' '}
                      <span className="font-semibold text-stone-800 dark:text-stone-200">{soilReport.phosphorus ? localizeSoilRating(soilReport.phosphorus, language) : '—'}</span> • K:{' '}
                      <span className="font-semibold text-stone-800 dark:text-stone-200">{soilReport.potassium ? localizeSoilRating(soilReport.potassium, language) : '—'}</span>
                    </>
                  ) : (
                    <span className="text-stone-400 font-normal">{t.notProvided}</span>
                  )}
                </span>
              </div>
            </div>

            <div className="mt-3 p-2.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/50 text-[11px] text-amber-900 dark:text-amber-300 flex items-center justify-between">
              <span className="line-clamp-2">
                {(() => {
                  const localizedSummary = localizeSoilSummary(soilReport.summary, language, currentFarm);
                  return localizedSummary
                    ? (localizedSummary.length > 95 ? localizedSummary.slice(0, 95) + '...' : localizedSummary)
                    : t.soilPriorityTip;
                })()}
              </span>
              <span className="ml-2 px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 shrink-0">
                {t.soilRecord}
              </span>
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
                  {t.cropHealth}
                </h3>
              </div>
              <button
                onClick={() => setActiveTab('crop-doctor')}
                className="text-xs font-semibold text-rose-700 dark:text-rose-400 hover:text-rose-900 dark:hover:text-rose-300 flex items-center gap-1 cursor-pointer"
              >
                <span>{t.diagnose}</span>
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
                    {t.diagnosedLabel}: {diagnoses[0].timestamp}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-stone-400 dark:text-stone-500 text-xs">
                {t.noPathologicalIssues}
              </div>
            )}
          </div>

          <button
            onClick={() => setActiveTab('crop-doctor')}
            className="w-full mt-3 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-950/70 text-rose-800 dark:text-rose-300 text-xs font-bold transition-colors text-center cursor-pointer min-h-[40px]"
          >
            {t.launchCropDoctorBtn}
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
                  {t.regenerativeActions}
                </h3>
              </div>
              <button
                onClick={() => setActiveTab('regenerative')}
                className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 cursor-pointer"
              >
                {t.explore}
              </button>
            </div>

            <ul className="space-y-2 text-xs text-stone-700 dark:text-stone-300">
              <li className="flex items-start gap-2 p-2 rounded-xl bg-stone-50/80 dark:bg-stone-900/60 border border-stone-100 dark:border-stone-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-tight">{t.regenAction1}</span>
              </li>
              <li className="flex items-start gap-2 p-2 rounded-xl bg-stone-50/80 dark:bg-stone-900/60 border border-stone-100 dark:border-stone-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-tight">{t.regenAction2}</span>
              </li>
              <li className="flex items-start gap-2 p-2 rounded-xl bg-stone-50/80 dark:bg-stone-900/60 border border-stone-100 dark:border-stone-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-tight">{t.regenAction3}</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => setActiveTab('regenerative')}
            className="w-full mt-3 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-950/70 text-emerald-900 dark:text-emerald-300 text-xs font-bold transition-colors text-center cursor-pointer min-h-[40px]"
          >
            {t.openRegenerativeFarming}
          </button>
        </div>
      </div>

      {/* Pipeline Health Diagnostic Modal */}
      {isDiagnosticOpen && (
        <PipelineHealthDiagnosticModal
          currentFarm={currentFarm}
          isOpen={isDiagnosticOpen}
          onClose={() => setIsDiagnosticOpen(false)}
          language={language}
        />
      )}
    </div>
  );
};
