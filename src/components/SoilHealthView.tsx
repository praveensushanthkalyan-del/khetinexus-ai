import React, { useState } from 'react';
import {
  FlaskConical,
  Sprout,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Sparkles,
  Layers,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { SoilReport, FarmProfile, Language } from '../types';
import { getTranslation } from '../i18n/translations';

interface SoilHealthViewProps {
  currentFarm: FarmProfile;
  soilReport: SoilReport;
  onUpdateSoilReport: (rep: SoilReport) => void;
  language: Language;
}

export const SoilHealthView: React.FC<SoilHealthViewProps> = ({
  currentFarm,
  soilReport,
  onUpdateSoilReport,
  language,
}) => {
  const [soilType, setSoilType] = useState(soilReport.soilType || currentFarm.soilType);
  const [ph, setPh] = useState(soilReport.ph);
  const [nitrogen, setNitrogen] = useState(soilReport.nitrogen);
  const [phosphorus, setPhosphorus] = useState(soilReport.phosphorus);
  const [potassium, setPotassium] = useState(soilReport.potassium);
  const [soilMoisture, setSoilMoisture] = useState(soilReport.soilMoisture);
  const [organicMatter, setOrganicMatter] = useState(soilReport.organicMatter);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const t = getTranslation(language);

  const handleAnalyzeSoil = async () => {
    setLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/soil-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          soilType,
          ph,
          nitrogen,
          phosphorus,
          potassium,
          soilMoisture: `${soilMoisture}%`,
          organicMatter: `${organicMatter}%`,
          crop: currentFarm.crop,
          country: currentFarm.country,
          language,
        }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => null);
        throw new Error(errJson?.error || 'Soil analysis service temporarily unavailable. Please retry.');
      }

      const data = await res.json();
      onUpdateSoilReport({
        soilType,
        ph,
        nitrogen,
        phosphorus,
        potassium,
        soilMoisture,
        organicMatter,
        summary: data.summary,
        deficiencies: data.deficiencies,
        regenerativeRecommendations: data.regenerativeRecommendations,
        organicMatterSuggestions: data.organicMatterSuggestions,
        cropSpecificAdvice: data.cropSpecificAdvice,
        isDemo: data.isDemo,
        source: data.source,
      });
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Error communicating with soil analysis engine.');
    } finally {
      setLoading(false);
    }
  };

  const getPhRating = (val: number) => {
    if (val < 6.0) return { label: 'Acidic', color: 'text-rose-700 bg-rose-50' };
    if (val > 7.5) return { label: 'Alkaline', color: 'text-amber-700 bg-amber-50' };
    return { label: 'Optimal (Near Neutral)', color: 'text-emerald-700 bg-emerald-50' };
  };

  const getOrganicMatterRating = (om: number) => {
    if (om < 2.0) return { label: 'Low - Carbon Depleted', color: 'text-amber-700' };
    if (om < 3.5) return { label: 'Moderate - Building Vitality', color: 'text-emerald-700' };
    return { label: 'Excellent Living Soil', color: 'text-green-800 font-bold' };
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
              <FlaskConical className="w-4 h-4" />
            </div>
            <h1 className="font-heading text-2xl font-bold text-stone-900">{t.navSoilHealth}</h1>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Evaluate soil chemical and biological vitality. Generate biological amendments and organic carbon enrichment strategies.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {soilReport.isDemo && (
            <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold">
              Demo Data Mode
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Input Sliders & Controls (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-5">
          <h2 className="font-heading text-base font-bold text-stone-900 pb-2 border-b border-stone-100">
            {t.soilTestTitle}
          </h2>

          {/* Soil Type */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">{t.soilType}</label>
            <input
              type="text"
              value={soilType}
              onChange={(e) => setSoilType(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs text-stone-900 bg-white"
            />
          </div>

          {/* pH Slider */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <label className="font-bold text-stone-700">{t.soilPh}</label>
              <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${getPhRating(ph).color}`}>
                {ph.toFixed(1)} — {getPhRating(ph).label}
              </span>
            </div>
            <input
              type="range"
              min="4.5"
              max="9.0"
              step="0.1"
              value={ph}
              onChange={(e) => setPh(parseFloat(e.target.value))}
              className="w-full accent-emerald-700 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-stone-400 mt-0.5">
              <span>4.5 (Acidic)</span>
              <span>6.5 - 7.0 (Ideal)</span>
              <span>9.0 (Alkaline)</span>
            </div>
          </div>

          {/* N-P-K Selectors */}
          <div className="space-y-3 pt-2">
            <span className="block text-xs font-bold text-stone-700">Macronutrients (NPK)</span>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-[11px] text-stone-500 mb-1">{t.nitrogen}</label>
                <select
                  value={nitrogen}
                  onChange={(e) => setNitrogen(e.target.value as any)}
                  className="w-full p-2 text-xs border border-stone-300 rounded-lg bg-white"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="Optimal">Optimal</option>
                  <option value="High">High</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-stone-500 mb-1">{t.phosphorus}</label>
                <select
                  value={phosphorus}
                  onChange={(e) => setPhosphorus(e.target.value as any)}
                  className="w-full p-2 text-xs border border-stone-300 rounded-lg bg-white"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="Optimal">Optimal</option>
                  <option value="High">High</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-stone-500 mb-1">{t.potassium}</label>
                <select
                  value={potassium}
                  onChange={(e) => setPotassium(e.target.value as any)}
                  className="w-full p-2 text-xs border border-stone-300 rounded-lg bg-white"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="Optimal">Optimal</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>
          </div>

          {/* Soil Moisture Slider */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <label className="font-bold text-stone-700">{t.soilMoisture}</label>
              <span className="font-bold text-stone-800">{soilMoisture}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="90"
              step="1"
              value={soilMoisture}
              onChange={(e) => setSoilMoisture(parseInt(e.target.value))}
              className="w-full accent-sky-700 cursor-pointer"
            />
          </div>

          {/* Organic Matter Slider */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <label className="font-bold text-stone-700">{t.organicMatter}</label>
              <span className="text-xs font-bold text-stone-800">
                {organicMatter.toFixed(1)}%
              </span>
            </div>
            <input
              type="range"
              min="0.5"
              max="6.0"
              step="0.1"
              value={organicMatter}
              onChange={(e) => setOrganicMatter(parseFloat(e.target.value))}
              className="w-full accent-emerald-700 cursor-pointer"
            />
            <p className="text-[11px] text-stone-500 mt-1">
              Status: <span className="font-semibold">{getOrganicMatterRating(organicMatter).label}</span>
            </p>
          </div>

          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          <button
            id="analyze-soil-btn"
            disabled={loading}
            onClick={handleAnalyzeSoil}
            className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold text-sm shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Analyzing Soil Microbiome...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>{t.analyzeSoilBtn}</span>
              </>
            )}
          </button>
        </div>

        {/* Right: Diagnostic Report & Recommendations (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Summary Banner */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-heading text-lg font-bold text-stone-900">
                {t.soilSummary}
              </h3>
              <span className="text-xs text-stone-500">
                Target Crop: <strong>{currentFarm.crop}</strong>
              </span>
            </div>

            <p className="text-sm text-stone-700 leading-relaxed font-medium">
              {soilReport.summary}
            </p>

            {/* Deficiencies */}
            {soilReport.deficiencies && soilReport.deficiencies.length > 0 && (
              <div className="pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 mb-2">
                  {t.deficiencies}
                </h4>
                <div className="space-y-1.5">
                  {soilReport.deficiencies.map((def, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2 p-2.5 rounded-lg bg-amber-50/70 border border-amber-200/60 text-xs text-amber-950"
                    >
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <span>{def}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Regenerative Soil Restorations */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
              <Layers className="w-4 h-4 text-emerald-700" />
              <h3 className="font-heading text-base font-bold text-stone-900">
                Regenerative Biological Soil Restoration
              </h3>
            </div>

            <div className="space-y-2">
              {(soilReport.regenerativeRecommendations || []).map((rec, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2 p-3 rounded-xl bg-stone-50 border border-stone-100 text-xs sm:text-sm text-stone-800"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{rec}</span>
                </div>
              ))}
            </div>

            {soilReport.organicMatterSuggestions && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 mt-3">
                <strong className="block mb-1 text-emerald-900">Organic Carbon Build-Up Strategy:</strong>
                {soilReport.organicMatterSuggestions}
              </div>
            )}

            {soilReport.cropSpecificAdvice && (
              <div className="p-4 rounded-xl bg-sky-50 border border-sky-200 text-xs text-sky-950 mt-2">
                <strong className="block mb-1 text-sky-900">Crop Synergy for {currentFarm.crop}:</strong>
                {soilReport.cropSpecificAdvice}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
