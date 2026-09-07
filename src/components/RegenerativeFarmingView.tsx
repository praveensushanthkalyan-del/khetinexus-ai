import React, { useState } from 'react';
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
  TrendingUp,
  Leaf,
} from 'lucide-react';
import { FarmProfile, Language } from '../types';
import { getTranslation } from '../i18n/translations';
import { REGENERATIVE_PRACTICES } from '../data/mockData';

interface RegenerativeFarmingViewProps {
  currentFarm: FarmProfile;
  language: Language;
}

export const RegenerativeFarmingView: React.FC<RegenerativeFarmingViewProps> = ({
  currentFarm,
  language,
}) => {
  const [selectedPillar, setSelectedPillar] = useState(REGENERATIVE_PRACTICES[0]);
  const [adoptedPillars, setAdoptedPillars] = useState<string[]>([
    'crop-rotation',
    'soil-moisture',
  ]);
  const t = getTranslation(language);

  const togglePillarAdoption = (id: string) => {
    if (adoptedPillars.includes(id)) {
      setAdoptedPillars(adoptedPillars.filter((p) => p !== id));
    } else {
      setAdoptedPillars([...adoptedPillars, id]);
    }
  };

  // Carbon and moisture score based on adopted practices
  const score = Math.round((adoptedPillars.length / REGENERATIVE_PRACTICES.length) * 100);
  const carbonEstimate = (adoptedPillars.length * 0.45 * currentFarm.farmSize).toFixed(1);
  const waterSavings = adoptedPillars.length * 4.5;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
            <h1 className="font-heading text-2xl font-bold text-stone-900">
              {t.navRegenerative}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            {t.regenSubtitle} Calibrated for {currentFarm.crop} on {currentFarm.soilType} ({currentFarm.country}).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-bold">
            Farm Vitality Score: {score}%
          </span>
        </div>
      </div>

      {/* Impact Metric Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-emerald-800 to-green-950 text-white rounded-2xl p-5 shadow-xs">
          <span className="text-xs uppercase tracking-wider text-emerald-300 font-bold block mb-1">
            Estimated Carbon Sequestered
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold">{carbonEstimate}</span>
            <span className="text-xs text-emerald-200">tons CO₂e / year</span>
          </div>
          <p className="text-[11px] text-emerald-200/80 mt-1">
            Across {currentFarm.farmSize} {currentFarm.farmUnit} of living soil root systems.
          </p>
        </div>

        <div className="bg-gradient-to-br from-sky-800 to-blue-950 text-white rounded-2xl p-5 shadow-xs">
          <span className="text-xs uppercase tracking-wider text-sky-300 font-bold block mb-1">
            Irrigation Water Conserved
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold">~{waterSavings}%</span>
            <span className="text-xs text-sky-200">reduction in run-time</span>
          </div>
          <p className="text-[11px] text-sky-200/80 mt-1">
            Via mulch cover and improved humus water-holding capacity.
          </p>
        </div>

        <div className="bg-gradient-to-br from-amber-800 to-stone-950 text-white rounded-2xl p-5 shadow-xs">
          <span className="text-xs uppercase tracking-wider text-amber-300 font-bold block mb-1">
            Active Biological Practices
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold">{adoptedPillars.length} / 8</span>
            <span className="text-xs text-amber-200">Pillars in Action</span>
          </div>
          <p className="text-[11px] text-amber-200/80 mt-1">
            Click any pillar card below to mark as adopted on your farm.
          </p>
        </div>
      </div>

      {/* 8 Core Pillars Grid */}
      <div className="space-y-4">
        <h2 className="font-heading text-lg font-bold text-stone-900">
          8 Pillars of Regenerative Agriculture
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {REGENERATIVE_PRACTICES.map((pillar) => {
            const isAdopted = adoptedPillars.includes(pillar.id);
            const isSelected = selectedPillar.id === pillar.id;

            return (
              <div
                key={pillar.id}
                onClick={() => setSelectedPillar(pillar)}
                className={`rounded-2xl p-5 border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-emerald-600 bg-emerald-50/40 shadow-sm'
                    : 'border-stone-200 bg-white hover:border-emerald-400'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-stone-100 text-stone-600">
                      {pillar.tag}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        togglePillarAdoption(pillar.id);
                      }}
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full transition-colors ${
                        isAdopted
                          ? 'bg-emerald-700 text-white'
                          : 'bg-stone-100 text-stone-600 hover:bg-emerald-100 hover:text-emerald-900'
                      }`}
                    >
                      {isAdopted ? '✓ Active' : '+ Adopt'}
                    </button>
                  </div>

                  <h3 className="font-heading text-sm font-bold text-stone-900 mb-1.5">
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-emerald-700 font-semibold">
                  <span>View Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Deep-Dive Selected Pillar Card */}
      {selectedPillar && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-emerald-800">
                Pillar Spotlight: {selectedPillar.tag}
              </span>
              <h3 className="font-heading text-xl sm:text-2xl font-bold text-stone-900 mt-1">
                {selectedPillar.title}
              </h3>
            </div>

            <button
              onClick={() => togglePillarAdoption(selectedPillar.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                adoptedPillars.includes(selectedPillar.id)
                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                  : 'bg-emerald-700 text-white hover:bg-emerald-800'
              }`}
            >
              {adoptedPillars.includes(selectedPillar.id)
                ? '✓ Active on Current Farm'
                : 'Mark as Implemented'}
            </button>
          </div>

          <p className="text-sm text-stone-700 leading-relaxed font-normal">
            {selectedPillar.description}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="bg-emerald-50/60 rounded-xl p-4 border border-emerald-200/60">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-950 mb-2">
                Documented Ecological Benefits:
              </h4>
              <ul className="space-y-1.5 text-xs text-emerald-900">
                {selectedPillar.benefits.map((b, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-stone-50 rounded-xl p-4 border border-stone-200/60">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800 mb-2">
                Implementation Guide for {currentFarm.crop}:
              </h4>
              <p className="text-xs text-stone-700 leading-relaxed">
                {selectedPillar.implementation}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
