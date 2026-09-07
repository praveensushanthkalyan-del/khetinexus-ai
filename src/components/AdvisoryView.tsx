import React, { useState } from 'react';
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
} from 'lucide-react';
import { FarmProfile, AdvisoryResult, Language } from '../types';
import { getTranslation } from '../i18n/translations';

interface AdvisoryViewProps {
  currentFarm: FarmProfile;
  advisory: AdvisoryResult;
  onUpdateAdvisory: (newAdvisory: AdvisoryResult) => void;
  language: Language;
}

export const AdvisoryView: React.FC<AdvisoryViewProps> = ({
  currentFarm,
  advisory,
  onUpdateAdvisory,
  language,
}) => {
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Advisory generator parameters (prefilled from farm profile)
  const [location, setLocation] = useState(currentFarm.location);
  const [crop, setCrop] = useState(currentFarm.crop);
  const [growthStage, setGrowthStage] = useState(currentFarm.growthStage);
  const [soilType, setSoilType] = useState(currentFarm.soilType);
  const [soilMoisture, setSoilMoisture] = useState('Medium (45-55%)');
  const [recentRainfall, setRecentRainfall] = useState('14 mm');
  const [temperature, setTemperature] = useState('28°C');
  const [irrigation, setIrrigation] = useState(currentFarm.irrigationType);
  const [farmSize, setFarmSize] = useState(`${currentFarm.farmSize} ${currentFarm.farmUnit}`);

  const t = getTranslation(language);

  const handleGenerateAdvisory = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const res = await fetch('/api/advisory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location,
          crop,
          growthStage,
          soilType,
          soilMoisture,
          recentRainfall,
          temperature,
          irrigation,
          farmSize,
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
    const textToCopy = `KhetiNexus AI Agricultural Advisory for ${crop} (${location}):
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <h1 className="font-heading text-2xl font-bold text-stone-900">{t.navAdvisor}</h1>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Gemini-powered localized agronomy engine synthesizing weather, soil biology, growth cycles, and regenerative solutions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {advisory.isDemo && (
            <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold">
              Demo Data Mode
            </span>
          )}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-stone-300 hover:border-emerald-600 text-stone-700 hover:text-emerald-800 text-xs font-medium transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Advisory'}</span>
          </button>
        </div>
      </div>

      {/* Advisory Parameter Customizer & Form */}
      <div className="bg-stone-50/80 rounded-2xl border border-stone-200 p-5 sm:p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-700">
            Advisory Input Parameters (Fine-tune before generating)
          </span>
          <span className="text-[11px] text-stone-500">
            Active Farm: <strong>{currentFarm.name}</strong> ({currentFarm.country})
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-stone-600 mb-1">Crop</label>
            <input
              type="text"
              value={crop}
              onChange={(e) => setCrop(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs text-stone-900 bg-white"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-stone-600 mb-1">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs text-stone-900 bg-white"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-stone-600 mb-1">Growth Stage</label>
            <input
              type="text"
              value={growthStage}
              onChange={(e) => setGrowthStage(e.target.value as any)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs text-stone-900 bg-white"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-stone-600 mb-1">Soil Type</label>
            <input
              type="text"
              value={soilType}
              onChange={(e) => setSoilType(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs text-stone-900 bg-white"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-stone-600 mb-1">Soil Moisture</label>
            <input
              type="text"
              value={soilMoisture}
              onChange={(e) => setSoilMoisture(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs text-stone-900 bg-white"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-stone-600 mb-1">Recent Rainfall</label>
            <input
              type="text"
              value={recentRainfall}
              onChange={(e) => setRecentRainfall(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs text-stone-900 bg-white"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-stone-600 mb-1">Temperature</label>
            <input
              type="text"
              value={temperature}
              onChange={(e) => setTemperature(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs text-stone-900 bg-white"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-stone-600 mb-1">Irrigation</label>
            <input
              type="text"
              value={irrigation}
              onChange={(e) => setIrrigation(e.target.value as any)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs text-stone-900 bg-white"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-stone-600 mb-1">Farm Size</label>
            <input
              type="text"
              value={farmSize}
              onChange={(e) => setFarmSize(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 text-xs text-stone-900 bg-white"
            />
          </div>

          <div className="flex items-end">
            <button
              id="generate-ai-advisory-btn"
              disabled={loading}
              onClick={handleGenerateAdvisory}
              className="w-full py-2 px-3 rounded-lg bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Synthesizing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Generate Advisory</span>
                </>
              )}
            </button>
          </div>
        </div>

        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>

      {/* Structured Output Cards */}
      <div className="space-y-6">
        {/* Executive Summary Card */}
        <div className="bg-emerald-900 text-white rounded-2xl p-6 shadow-md border border-emerald-800/80">
          <div className="flex items-center justify-between text-xs text-emerald-300 mb-2">
            <span className="uppercase font-bold tracking-wider">Agronomic Assessment</span>
            <span>Source: {advisory.source || 'Gemini 3.8'}</span>
          </div>
          <p className="text-base sm:text-lg font-medium leading-relaxed text-emerald-50">
            {advisory.summary}
          </p>
        </div>

        {/* 6 Required Headings from Prompt */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 1. "What to do today" */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2.5 mb-3 text-stone-900">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Sprout className="w-5 h-5" />
                </div>
                <h3 className="font-heading text-lg font-bold">{t.whatToDoToday}</h3>
              </div>
              <p className="text-stone-700 text-sm leading-relaxed">{advisory.todayAction}</p>
            </div>
          </div>

          {/* 2. "Water management" */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2.5 mb-3 text-stone-900">
                <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center">
                  <Droplets className="w-5 h-5" />
                </div>
                <h3 className="font-heading text-lg font-bold">{t.waterManagement}</h3>
              </div>
              <p className="text-stone-700 text-sm leading-relaxed">{advisory.waterManagement}</p>
            </div>
          </div>

          {/* 3. "Soil health" */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2.5 mb-3 text-stone-900">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                  <Layers className="w-5 h-5" />
                </div>
                <h3 className="font-heading text-lg font-bold">{t.soilHealth}</h3>
              </div>
              <p className="text-stone-700 text-sm leading-relaxed">{advisory.soilHealth}</p>
            </div>
          </div>

          {/* 4. "Crop protection" */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2.5 mb-3 text-stone-900">
                <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <h3 className="font-heading text-lg font-bold">{t.cropProtection}</h3>
              </div>
              <p className="text-stone-700 text-sm leading-relaxed">{advisory.cropProtection}</p>
            </div>
          </div>

          {/* 5. "Regenerative practice" */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2.5 mb-3 text-stone-900">
                <div className="w-9 h-9 rounded-xl bg-green-100 text-green-800 flex items-center justify-center">
                  <Layers className="w-5 h-5" />
                </div>
                <h3 className="font-heading text-lg font-bold">{t.regenerativePractice}</h3>
              </div>
              <p className="text-stone-700 text-sm leading-relaxed">{advisory.regenerativePractice}</p>
            </div>
          </div>

          {/* 6. "Next 7 days" */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2.5 mb-3 text-stone-900">
                <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center">
                  <Calendar className="w-5 h-5" />
                </div>
                <h3 className="font-heading text-lg font-bold">{t.next7Days}</h3>
              </div>
              <p className="text-stone-700 text-sm leading-relaxed">{advisory.next7Days}</p>
            </div>
          </div>
        </div>

        {/* Mandatory Agricultural Disclaimer Banner */}
        <div className="rounded-2xl bg-amber-50 border border-amber-200 p-5 text-amber-950 flex items-start gap-3.5 shadow-2xs">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs sm:text-sm">
            <h4 className="font-bold text-amber-900">{t.disclaimerTitle}</h4>
            <p className="text-amber-800/90 leading-relaxed">
              {advisory.disclaimer ||
                'This advisory is generated through artificial intelligence models for informational and educational purposes. It does not constitute guaranteed agronomic or chemical prescription. Always consult your district agricultural extension officer or Krishi Vigyan Kendra (KVK) before applying significant investments, chemical fungicides, or altering primary irrigation schedules.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
