import React, { useState, useEffect, useRef } from 'react';
import {
  Layers,
  Sprout,
  Droplets,
  RotateCw,
  Sun,
  ShieldCheck,
  Bug,
  ShieldAlert,
  CheckCircle2,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  Leaf,
  Info,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import { FarmProfile, Language } from '../types';
import { getTranslation } from '../i18n/translations';
import {
  getLocalizedPillars,
  localizeCountry,
  localizeCrop,
  localizeSoilType,
} from '../i18n/dataTranslations';
import { useAuth } from '../context/AuthContext';
import { useCountry } from '../context/CountryContext';
import { getRegenerativePillars, saveRegenerativePillars } from '../lib/firestoreService';

interface RegenerativeFarmingViewProps {
  currentFarm: FarmProfile;
  language: Language;
}

export const RegenerativeFarmingView: React.FC<RegenerativeFarmingViewProps> = ({
  currentFarm,
  language,
}) => {
  const { user, refreshFarms } = useAuth();
  const { activeCountry } = useCountry();
  const pillars = getLocalizedPillars(language);
  const [selectedPillarId, setSelectedPillarId] = useState<string>('crop-rotation');
  const [expandedPillars, setExpandedPillars] = useState<Record<string, boolean>>({});
  const [adoptedPillars, setAdoptedPillars] = useState<string[]>([]);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const saveInProgressRef = useRef<number>(0);
  const t = getTranslation(language);

  const farmCountry = currentFarm?.country || activeCountry;

  // Load farm regenerative practices from Firestore on farm change or mount
  useEffect(() => {
    let isMounted = true;
    if (user?.uid && currentFarm?.id) {
      setSaveStatus('saving');
      getRegenerativePillars(user.uid, currentFarm.id, farmCountry)
        .then((saved) => {
          if (isMounted) {
            if (Array.isArray(saved)) {
              setAdoptedPillars(saved);
            } else {
              setAdoptedPillars([]);
            }
            setSaveStatus('idle');
          }
        })
        .catch((err) => {
          if (isMounted) {
            console.error('Failed to load regenerative practices:', err);
            setSaveStatus('error');
          }
        });
    } else if (currentFarm) {
      setAdoptedPillars(currentFarm.adoptedPillars || currentFarm.regenerativeFarming?.adoptedPillars || []);
      setSaveStatus('idle');
    }
    return () => {
      isMounted = false;
    };
  }, [user?.uid, currentFarm?.id, farmCountry]);

  const selectedPillar = pillars.find((p) => p.id === selectedPillarId) || pillars[0];

  const togglePillarAdoption = async (id: string) => {
    const updated = adoptedPillars.includes(id)
      ? adoptedPillars.filter((p) => p !== id)
      : [...adoptedPillars, id];

    setAdoptedPillars(updated);
    setSaveStatus('saving');

    const saveId = ++saveInProgressRef.current;

    try {
      if (user?.uid && currentFarm?.id) {
        await saveRegenerativePillars(user.uid, currentFarm.id, updated, farmCountry);
        if (saveId === saveInProgressRef.current) {
          if (refreshFarms) {
            await refreshFarms();
          }
          setSaveStatus('saved');
          setTimeout(() => {
            if (saveId === saveInProgressRef.current) {
              setSaveStatus('idle');
            }
          }, 2500);
        }
      } else {
        if (saveId === saveInProgressRef.current) {
          setSaveStatus('saved');
          setTimeout(() => {
            if (saveId === saveInProgressRef.current) {
              setSaveStatus('idle');
            }
          }, 2500);
        }
      }
    } catch (err) {
      console.error('Failed to save regenerative practices:', err);
      if (saveId === saveInProgressRef.current) {
        setSaveStatus('error');
      }
    }
  };

  const toggleExpandPillar = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedPillars((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Carbon and moisture score based on adopted practices
  const score = Math.round((adoptedPillars.length / pillars.length) * 100);
  const farmSizeNum = typeof currentFarm.farmSize === 'number' ? currentFarm.farmSize : (parseFloat(currentFarm.farmSize as any) || 4.5);
  const carbonEstimate = (adoptedPillars.length * 0.45 * farmSizeNum).toFixed(1);
  const waterSavings = adoptedPillars.length * 4.5;

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-6 sm:space-y-8 min-w-0">
      {/* Header */}
      <div className="bg-white dark:bg-[#0c1810] rounded-2xl border border-stone-200/80 dark:border-stone-800/80 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-heading text-2xl font-bold text-stone-900 dark:text-stone-100">
              {t.regenTitle}
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-0.5">
              {t.regenSubtitle} {t.calibratedFor} {localizeCrop(currentFarm.crop, language)} {t.onSoil} {localizeSoilType(currentFarm.soilType, language)} ({localizeCountry(currentFarm.country, language)}).
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {saveStatus === 'saving' && (
            <span className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-xs font-bold flex items-center gap-1.5 animate-pulse">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-600" />
              Saving...
            </span>
          )}
          {saveStatus === 'saved' && (
            <span className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Saved to Farm
            </span>
          )}
          {saveStatus === 'error' && (
            <span className="px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800 text-xs font-bold flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
              Unable to save
            </span>
          )}
          <span className="px-3.5 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold">
            {t.farmVitalityScore}: {score}%
          </span>
        </div>
      </div>

      {/* Purpose Banner Required by Prompt */}
      <div className="bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/80 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 text-xs sm:text-sm text-emerald-950 dark:text-emerald-200 leading-relaxed">
        <Info className="w-5 h-5 text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <strong className="block text-emerald-900 dark:text-emerald-100 font-bold mb-0.5">
            Purpose of Regenerative Farming:
          </strong>
          Regenerative Farming connects soil health improvement, water-use efficiency, cover cropping, and biodiversity targets directly to active farm telemetry ({currentFarm.name || 'Active Farm'} — {localizeCrop(currentFarm.crop, language)}) to build long-term climate resilience and soil organic carbon.
        </div>
      </div>

      {/* Impact Metric Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-emerald-800 to-green-950 text-white rounded-2xl p-5 shadow-xs">
          <span className="text-xs uppercase tracking-wider text-emerald-300 font-bold block mb-1">
            {t.carbonSequestered}
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold">{carbonEstimate}</span>
            <span className="text-xs text-emerald-200">{t.carbonUnit}</span>
          </div>
          <p className="text-[11px] text-emerald-200/80 mt-1">
            {t.acrossSoil} {farmSizeNum} {currentFarm.farmUnit || 'Acres'}.
          </p>
        </div>

        <div className="bg-gradient-to-br from-sky-800 to-blue-950 text-white rounded-2xl p-5 shadow-xs">
          <span className="text-xs uppercase tracking-wider text-sky-300 font-bold block mb-1">
            {t.waterConserved}
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold">~{waterSavings}%</span>
            <span className="text-xs text-sky-200">{t.waterSavingsUnit}</span>
          </div>
          <p className="text-[11px] text-sky-200/80 mt-1">
            {t.viaMulch}
          </p>
        </div>

        <div className="bg-gradient-to-br from-amber-800 to-stone-950 text-white rounded-2xl p-5 shadow-xs">
          <span className="text-xs uppercase tracking-wider text-amber-300 font-bold block mb-1">
            {t.activePillarsCount}
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold">{adoptedPillars.length} / 8</span>
            <span className="text-xs text-amber-200">{t.pillarsUnit}</span>
          </div>
          <p className="text-[11px] text-amber-200/80 mt-1">
            {t.clickToAdopt}
          </p>
        </div>
      </div>

      {/* 8 Core Pillars Grid with Accordion Arrow Expansion */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-lg font-bold text-stone-900 dark:text-stone-100">
            {t.pillarsHeading}
          </h2>
          <span className="text-xs text-stone-500 dark:text-stone-400">
            Click arrows to expand guides
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {pillars.map((pillar) => {
            const isAdopted = adoptedPillars.includes(pillar.id);
            const isSelected = selectedPillar.id === pillar.id;
            const isExpanded = !!expandedPillars[pillar.id];

            return (
              <div
                key={pillar.id}
                onClick={() => setSelectedPillarId(pillar.id)}
                className={`rounded-2xl p-5 border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-emerald-600 dark:border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/30 shadow-xs'
                    : 'border-stone-200/80 dark:border-stone-800/80 bg-white dark:bg-[#0c1810] hover:border-emerald-400 dark:hover:border-emerald-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-200/60 dark:border-stone-700">
                      {pillar.tag}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        togglePillarAdoption(pillar.id);
                      }}
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full transition-colors cursor-pointer ${
                        isAdopted
                          ? 'bg-emerald-700 text-white'
                          : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-emerald-100 dark:hover:bg-emerald-900 hover:text-emerald-900 dark:hover:text-emerald-200'
                      }`}
                    >
                      {isAdopted ? t.activeBtn : t.adoptBtn}
                    </button>
                  </div>

                  <h3 className="font-heading text-sm font-bold text-stone-900 dark:text-stone-100 mb-1.5">
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-stone-600 dark:text-stone-400 line-clamp-3 leading-relaxed">
                    {pillar.description}
                  </p>

                  {/* Accordion Expanded Content */}
                  {isExpanded && (
                    <div className="mt-3 pt-3 border-t border-stone-200/60 dark:border-stone-800 space-y-2 animate-fadeIn">
                      <p className="text-[11px] text-stone-700 dark:text-stone-300 leading-snug">
                        <strong>Guide:</strong> {pillar.implementation}
                      </p>
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase text-emerald-800 dark:text-emerald-400">Benefits:</span>
                        {pillar.benefits.slice(0, 2).map((b, idx) => (
                          <div key={idx} className="flex items-center gap-1.5 text-[11px] text-emerald-900 dark:text-emerald-300">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
                            <span>{b}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={(e) => toggleExpandPillar(pillar.id, e)}
                  className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800 w-full flex items-center justify-between text-xs text-emerald-700 dark:text-emerald-400 font-semibold hover:text-emerald-800 dark:hover:text-emerald-300 transition-colors cursor-pointer"
                  aria-label="Toggle Expand"
                >
                  <span className="flex items-center gap-1">
                    {isExpanded ? 'Collapse' : t.viewDetails}
                  </span>
                  <span className="p-1 rounded-md hover:bg-stone-100 dark:hover:bg-stone-800">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Deep-Dive Selected Pillar Card */}
      {selectedPillar && (
        <div className="bg-white dark:bg-[#0c1810] rounded-2xl border border-stone-200/80 dark:border-stone-800/80 p-6 sm:p-8 shadow-xs space-y-5 transition-colors">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100 dark:border-stone-800">
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-emerald-800 dark:text-emerald-400">
                {t.pillarSpotlight}: {selectedPillar.tag}
              </span>
              <h3 className="font-heading text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100 mt-1">
                {selectedPillar.title}
              </h3>
            </div>

            <button
              onClick={() => togglePillarAdoption(selectedPillar.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer min-h-[38px] ${
                adoptedPillars.includes(selectedPillar.id)
                  ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                  : 'bg-emerald-700 text-white hover:bg-emerald-800'
              }`}
            >
              {adoptedPillars.includes(selectedPillar.id)
                ? t.activeOnFarm
                : t.markImplemented}
            </button>
          </div>

          <p className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed font-normal">
            {selectedPillar.description}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="bg-emerald-50/60 dark:bg-emerald-950/30 rounded-xl p-4 border border-emerald-200/60 dark:border-emerald-900/50">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-950 dark:text-emerald-300 mb-2">
                {t.ecologicalBenefits}
              </h4>
              <ul className="space-y-1.5 text-xs text-emerald-900 dark:text-emerald-200">
                {selectedPillar.benefits.map((b, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-stone-50/80 dark:bg-stone-900/60 rounded-xl p-4 border border-stone-200/60 dark:border-stone-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800 dark:text-stone-300 mb-2">
                {t.implementationGuide} ({localizeCrop(currentFarm.crop, language)}):
              </h4>
              <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed">
                {selectedPillar.implementation}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

