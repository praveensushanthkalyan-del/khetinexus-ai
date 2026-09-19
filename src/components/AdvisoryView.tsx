import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Droplets,
  Sprout,
  ShieldAlert,
  Layers,
  Calendar,
  AlertTriangle,
  RefreshCw,
  Copy,
  Check,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
} from 'lucide-react';
import { FarmProfile, AdvisoryResult, Language, SoilReport, WeatherData } from '../types';
import { getTranslation } from '../i18n/translations';
import { localizeCountry, localizeCrop } from '../i18n/dataTranslations';

interface AdvisoryViewProps {
  currentFarm: FarmProfile;
  advisory: AdvisoryResult;
  onUpdateAdvisory: (newAdvisory: AdvisoryResult) => void;
  language: Language;
  soilReport?: SoilReport;
  weather?: WeatherData;
}

export const AdvisoryView: React.FC<AdvisoryViewProps> = ({
  currentFarm,
  advisory,
  onUpdateAdvisory,
  language,
  soilReport,
  weather,
}) => {
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Advisory generator parameters (prefilled from active farm)
  const [crop, setCrop] = useState(currentFarm.crop || '');
  const [location, setLocation] = useState(currentFarm.location || '');
  const [growthStage, setGrowthStage] = useState(currentFarm.growthStage || 'Vegetative');
  const [soilType, setSoilType] = useState(currentFarm.soilType || '');
  const [irrigation, setIrrigation] = useState(currentFarm.irrigationType || 'Drip Irrigation');
  const [farmSize, setFarmSize] = useState(
    currentFarm.farmSize ? `${currentFarm.farmSize} ${currentFarm.farmUnit}` : ''
  );
  const [soilMoisture, setSoilMoisture] = useState('');
  const [recentRainfall, setRecentRainfall] = useState('');
  const [temperature, setTemperature] = useState('');

  const t = getTranslation(language);

  useEffect(() => {
    setCrop(currentFarm.crop || '');
    setLocation(
      currentFarm.location
        ? `${currentFarm.location}${currentFarm.stateRegion ? ', ' + currentFarm.stateRegion : ''}`
        : ''
    );
    setGrowthStage(currentFarm.growthStage || 'Vegetative');
    setSoilType(currentFarm.soilType || '');
    setIrrigation(currentFarm.irrigationType || 'Drip Irrigation');
    setFarmSize(currentFarm.farmSize ? `${currentFarm.farmSize} ${currentFarm.farmUnit}` : '');

    // Sync Soil Moisture
    if (soilReport && soilReport.soilMoisture !== undefined && soilReport.soilMoisture !== null) {
      setSoilMoisture(`${soilReport.soilMoisture}%`);
    } else {
      setSoilMoisture('Unavailable');
    }

    // Sync Recent Rainfall
    if (weather && weather.rainfallMm !== undefined && weather.rainfallMm !== null) {
      setRecentRainfall(`${weather.rainfallMm} mm`);
    } else if (weather && weather.rainfall && weather.rainfall.trim() !== '') {
      setRecentRainfall(weather.rainfall);
    } else {
      setRecentRainfall('Unavailable');
    }

    // Sync Temperature
    if (weather && weather.temperature && weather.temperature.trim() !== '') {
      setTemperature(weather.temperature);
    } else {
      setTemperature('28°C');
    }
  }, [currentFarm, soilReport, weather]);

  const handleGenerateAdvisory = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const res = await fetch('/api/advisory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location: location || currentFarm.location,
          crop: crop || currentFarm.crop,
          growthStage: growthStage || currentFarm.growthStage,
          soilType: soilType || currentFarm.soilType,
          soilMoisture,
          recentRainfall,
          temperature,
          irrigation: irrigation || currentFarm.irrigationType,
          farmSize: farmSize || `${currentFarm.farmSize} ${currentFarm.farmUnit}`,
          country: currentFarm.country,
          language,
        }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => null);
        throw new Error(errJson?.error || 'AI service is temporarily unavailable. Please try again.');
      }

      const data = await res.json();
      onUpdateAdvisory({
        id: `adv-${Date.now()}`,
        summary: data.summary,
        todayAction: data.todayAction,
        waterManagement: data.waterManagement,
        soilHealth: data.soilHealth,
        cropProtection: data.cropProtection,
        regenerativePractice: data.regenerativePractice,
        next7Days: data.next7Days,
        disclaimer: data.disclaimer,
        timestamp: 'Just now',
        isDemo: data.isDemo,
        source: data.source,
      });
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'AI service is temporarily unavailable. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    const activeCropName = crop || currentFarm.crop || 'Crop';
    const activeLocationName = location || currentFarm.location || 'Farm';
    const textToCopy = `KhetiNexus AI Agricultural Advisory for ${activeCropName} (${activeLocationName}):
Summary: ${advisory.summary}
What to do today: ${advisory.todayAction}
Water management: ${advisory.waterManagement}
Soil health: ${advisory.soilHealth}
Crop protection: ${advisory.cropProtection}
Regenerative practice: ${advisory.regenerativePractice}
Next 7 days: ${advisory.next7Days}
Disclaimer: ${advisory.disclaimer}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-6 sm:space-y-8 min-w-0">
      {/* Header */}
      <div className="bg-white dark:bg-[#0c1810] rounded-2xl border border-stone-200/80 dark:border-stone-800/80 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-heading text-2xl font-bold text-stone-900 dark:text-stone-100">
              {t.advisoryTitle}
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-0.5">
              {t.advisorySubtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {advisory.isDemo && (
            <span className="px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 text-xs font-semibold border border-amber-200 dark:border-amber-800">
              {t.demoData}
            </span>
          )}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-stone-300 dark:border-stone-700 hover:border-emerald-600 text-stone-700 dark:text-stone-300 hover:text-emerald-800 dark:hover:text-emerald-300 text-xs font-semibold transition-colors cursor-pointer min-h-[40px]"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? t.copiedAdvisory : t.copyAdvisoryBtn}</span>
          </button>
        </div>
      </div>

      {/* Advisory Parameter Customizer & Form */}
      <div className="bg-white dark:bg-[#0c1810] rounded-2xl border border-stone-200/80 dark:border-stone-800/80 p-5 sm:p-6 shadow-xs space-y-4 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-stone-100 dark:border-stone-800">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
            {t.fineTuneParams}
          </span>
          <span className="text-xs text-stone-500 dark:text-stone-400">
            {t.activeFarmLabel}: <strong className="text-stone-800 dark:text-stone-200">{currentFarm.name}</strong> ({localizeCountry(currentFarm.country, language)})
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-3.5">
          <div className="flex flex-col justify-end w-full min-w-0">
            <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 min-h-[32px] flex items-end mb-1.5 leading-tight">
              {t.cropName}
            </label>
            <input
              type="text"
              value={crop}
              onChange={(e) => setCrop(e.target.value)}
              className="w-full h-10 px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 text-xs text-stone-900 dark:text-stone-100 bg-white dark:bg-stone-900 focus:border-emerald-600 outline-none box-border"
            />
          </div>

          <div className="flex flex-col justify-end w-full min-w-0">
            <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 min-h-[32px] flex items-end mb-1.5 leading-tight">
              {t.farmLocation}
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full h-10 px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 text-xs text-stone-900 dark:text-stone-100 bg-white dark:bg-stone-900 focus:border-emerald-600 outline-none box-border"
            />
          </div>

          <div className="flex flex-col justify-end w-full min-w-0">
            <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 min-h-[32px] flex items-end mb-1.5 leading-tight">
              {t.growthStage}
            </label>
            <input
              type="text"
              value={growthStage}
              onChange={(e) => setGrowthStage(e.target.value as any)}
              className="w-full h-10 px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 text-xs text-stone-900 dark:text-stone-100 bg-white dark:bg-stone-900 focus:border-emerald-600 outline-none box-border"
            />
          </div>

          <div className="flex flex-col justify-end w-full min-w-0">
            <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 min-h-[32px] flex items-end mb-1.5 leading-tight">
              {t.soilType}
            </label>
            <input
              type="text"
              value={soilType}
              onChange={(e) => setSoilType(e.target.value)}
              className="w-full h-10 px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 text-xs text-stone-900 dark:text-stone-100 bg-white dark:bg-stone-900 focus:border-emerald-600 outline-none box-border"
            />
          </div>

          <div className="flex flex-col justify-end w-full min-w-0">
            <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 min-h-[32px] flex items-end mb-1.5 leading-tight">
              {t.soilMoisture}
            </label>
            <input
              type="text"
              value={soilMoisture}
              onChange={(e) => setSoilMoisture(e.target.value)}
              className="w-full h-10 px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 text-xs text-stone-900 dark:text-stone-100 bg-white dark:bg-stone-900 focus:border-emerald-600 outline-none box-border"
            />
          </div>

          <div className="flex flex-col justify-end w-full min-w-0">
            <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 min-h-[32px] flex items-end mb-1.5 leading-tight">
              {t.recentRainfall}
            </label>
            <input
              type="text"
              value={recentRainfall}
              onChange={(e) => setRecentRainfall(e.target.value)}
              className="w-full h-10 px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 text-xs text-stone-900 dark:text-stone-100 bg-white dark:bg-stone-900 focus:border-emerald-600 outline-none box-border"
            />
          </div>

          <div className="flex flex-col justify-end w-full min-w-0">
            <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 min-h-[32px] flex items-end mb-1.5 leading-tight">
              {t.temperature}
            </label>
            <input
              type="text"
              value={temperature}
              onChange={(e) => setTemperature(e.target.value)}
              className="w-full h-10 px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 text-xs text-stone-900 dark:text-stone-100 bg-white dark:bg-stone-900 focus:border-emerald-600 outline-none box-border"
            />
          </div>

          <div className="flex flex-col justify-end w-full min-w-0">
            <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 min-h-[32px] flex items-end mb-1.5 leading-tight">
              {t.irrigationType}
            </label>
            <input
              type="text"
              value={irrigation}
              onChange={(e) => setIrrigation(e.target.value as any)}
              className="w-full h-10 px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 text-xs text-stone-900 dark:text-stone-100 bg-white dark:bg-stone-900 focus:border-emerald-600 outline-none box-border"
            />
          </div>

          <div className="flex flex-col justify-end w-full min-w-0">
            <label className="text-xs font-semibold text-stone-700 dark:text-stone-300 min-h-[32px] flex items-end mb-1.5 leading-tight">
              {t.farmSize}
            </label>
            <input
              type="text"
              value={farmSize}
              onChange={(e) => setFarmSize(e.target.value)}
              className="w-full h-10 px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 text-xs text-stone-900 dark:text-stone-100 bg-white dark:bg-stone-900 focus:border-emerald-600 outline-none box-border"
            />
          </div>

          <div className="flex flex-col justify-end w-full min-w-0">
            <div className="min-h-[32px] mb-1.5 hidden lg:flex items-end select-none opacity-0" aria-hidden="true">
              <span className="text-xs font-semibold leading-tight">&nbsp;</span>
            </div>
            <button
              id="generate-ai-advisory-btn"
              disabled={loading}
              onClick={handleGenerateAdvisory}
              className="w-full h-10 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer box-border"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin shrink-0" />
                  <span className="truncate">{t.generatingAdvisory}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{t.generateAdvisoryBtn}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-800 dark:text-rose-300 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>

      {/* Structured Output Cards */}
      <div className="space-y-6">
        {/* Executive Summary Card */}
        <div className="bg-emerald-900 text-white rounded-2xl p-6 sm:p-7 shadow-md border border-emerald-800/80">
          <div className="flex items-center justify-between text-xs text-emerald-300 mb-2">
            <span className="uppercase font-bold tracking-wider">{t.agronomicAssessment}</span>
            <span>Source: {advisory.source || 'Gemini 3.1 Flash-Lite'}</span>
          </div>
          <p className="text-base sm:text-lg font-medium leading-relaxed text-emerald-50">
            {advisory.summary}
          </p>
        </div>

        {/* 6 Structured Advisory Modules */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 1. "What to do today" */}
          <div className="bg-white dark:bg-[#0c1810] rounded-2xl border border-stone-200/80 dark:border-stone-800/80 p-6 shadow-xs flex flex-col justify-between transition-colors">
            <div>
              <div className="flex items-center gap-2.5 mb-3 text-stone-900 dark:text-stone-100">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 flex items-center justify-center">
                  <Sprout className="w-5 h-5" />
                </div>
                <h3 className="font-heading text-lg font-bold">{t.whatToDoToday}</h3>
              </div>
              <p className="text-stone-700 dark:text-stone-300 text-sm leading-relaxed">{advisory.todayAction}</p>
            </div>
          </div>

          {/* 2. "Water management" */}
          <div className="bg-white dark:bg-[#0c1810] rounded-2xl border border-stone-200/80 dark:border-stone-800/80 p-6 shadow-xs flex flex-col justify-between transition-colors">
            <div>
              <div className="flex items-center gap-2.5 mb-3 text-stone-900 dark:text-stone-100">
                <div className="w-9 h-9 rounded-xl bg-sky-100 dark:bg-sky-950/80 text-sky-800 dark:text-sky-300 flex items-center justify-center">
                  <Droplets className="w-5 h-5" />
                </div>
                <h3 className="font-heading text-lg font-bold">{t.waterManagement}</h3>
              </div>
              <p className="text-stone-700 dark:text-stone-300 text-sm leading-relaxed">{advisory.waterManagement}</p>
            </div>
          </div>

          {/* 3. "Soil health" */}
          <div className="bg-white dark:bg-[#0c1810] rounded-2xl border border-stone-200/80 dark:border-stone-800/80 p-6 shadow-xs flex flex-col justify-between transition-colors">
            <div>
              <div className="flex items-center gap-2.5 mb-3 text-stone-900 dark:text-stone-100">
                <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 flex items-center justify-center">
                  <Layers className="w-5 h-5" />
                </div>
                <h3 className="font-heading text-lg font-bold">{t.soilHealth}</h3>
              </div>
              <p className="text-stone-700 dark:text-stone-300 text-sm leading-relaxed">{advisory.soilHealth}</p>
            </div>
          </div>

          {/* 4. "Crop protection" */}
          <div className="bg-white dark:bg-[#0c1810] rounded-2xl border border-stone-200/80 dark:border-stone-800/80 p-6 shadow-xs flex flex-col justify-between transition-colors">
            <div>
              <div className="flex items-center gap-2.5 mb-3 text-stone-900 dark:text-stone-100">
                <div className="w-9 h-9 rounded-xl bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 flex items-center justify-center">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <h3 className="font-heading text-lg font-bold">{t.cropProtection}</h3>
              </div>
              <p className="text-stone-700 dark:text-stone-300 text-sm leading-relaxed">{advisory.cropProtection}</p>
            </div>
          </div>

          {/* 5. "Regenerative practice" */}
          <div className="bg-white dark:bg-[#0c1810] rounded-2xl border border-stone-200/80 dark:border-stone-800/80 p-6 shadow-xs flex flex-col justify-between transition-colors">
            <div>
              <div className="flex items-center gap-2.5 mb-3 text-stone-900 dark:text-stone-100">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 flex items-center justify-center">
                  <Layers className="w-5 h-5" />
                </div>
                <h3 className="font-heading text-lg font-bold">{t.regenerativePractice}</h3>
              </div>
              <p className="text-stone-700 dark:text-stone-300 text-sm leading-relaxed">{advisory.regenerativePractice}</p>
            </div>
          </div>

          {/* 6. "Next 7 days" */}
          <div className="bg-white dark:bg-[#0c1810] rounded-2xl border border-stone-200/80 dark:border-stone-800/80 p-6 shadow-xs flex flex-col justify-between transition-colors">
            <div>
              <div className="flex items-center gap-2.5 mb-3 text-stone-900 dark:text-stone-100">
                <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-950/80 text-purple-800 dark:text-purple-300 flex items-center justify-center">
                  <Calendar className="w-5 h-5" />
                </div>
                <h3 className="font-heading text-lg font-bold">{t.next7Days}</h3>
              </div>
              <p className="text-stone-700 dark:text-stone-300 text-sm leading-relaxed">{advisory.next7Days}</p>
            </div>
          </div>
        </div>

        {/* Agricultural Agronomic Disclaimer */}
        <div className="rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 p-5 text-amber-950 dark:text-amber-200 flex items-start gap-3.5 shadow-2xs">
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs sm:text-sm">
            <h4 className="font-bold text-amber-900 dark:text-amber-300">{t.disclaimerTitle}</h4>
            <p className="text-amber-800/90 dark:text-amber-300/90 leading-relaxed">
              {advisory.disclaimer ||
                'This advisory is generated through artificial intelligence models for informational and educational purposes. It does not constitute guaranteed agronomic or chemical prescription. Always consult your district agricultural extension officer or Krishi Vigyan Kendra (KVK) before applying significant investments, chemical fungicides, or altering primary irrigation schedules.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
