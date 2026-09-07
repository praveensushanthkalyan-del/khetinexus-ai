import React from 'react';
import {
  Sparkles,
  Stethoscope,
  Globe2,
  Layers,
  CloudSun,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  PlayCircle,
  TrendingUp,
} from 'lucide-react';
import { ActiveTab, FarmProfile, Language } from '../types';
import { getTranslation } from '../i18n/translations';
import { BRICS_FARM_PRESETS } from '../data/mockData';

interface LandingPageProps {
  setActiveTab: (tab: ActiveTab) => void;
  language: Language;
  onSelectFarmPreset: (farm: FarmProfile) => void;
  currentFarm: FarmProfile;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  setActiveTab,
  language,
  onSelectFarmPreset,
  currentFarm,
}) => {
  const t = getTranslation(language);

  const demoSteps = [
    { num: 1, title: 'Open KhetiNexus AI', desc: 'Review active profile & agro-climatic context' },
    { num: 2, title: 'Create / Select Farm', desc: 'Toggle BRICS profiles (India, Brazil, etc.)' },
    { num: 3, title: 'Input Crop & Soil Data', desc: 'Refine growth stage, moisture & soil type' },
    { num: 4, title: 'Generate AI Advisory', desc: 'Get daily actionable agricultural guidance' },
    { num: 5, title: 'Review Weather Intelligence', desc: '5-day agro-forecast & spray suitability' },
    { num: 6, title: 'Upload Crop Leaf Image', desc: 'Click test sample or upload camera photo' },
    { num: 7, title: 'AI Disease Diagnosis', desc: 'Gemini Vision confidence & organic remedy' },
    { num: 8, title: 'Regenerative Recommendations', desc: 'Biological carbon & soil stewardship' },
    { num: 9, title: 'Open AgriN Network', desc: 'Multi-nation conceptual architecture' },
    { num: 10, title: 'BRICS Interoperability', desc: 'Knowledge sharing for food security' },
  ];

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-12 sm:pt-12 sm:pb-16 bg-gradient-to-b from-emerald-900 via-emerald-850 to-green-950 text-white rounded-3xl mx-2 sm:mx-4 px-6 sm:px-12 shadow-xl border border-emerald-800/40">
        {/* Subtle decorative agricultural mesh */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#48bb78_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-800/80 border border-emerald-600/40 text-emerald-200 text-xs sm:text-sm font-medium shadow-inner">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>AgriN Challenge • Regenerative Agricultural Intelligence</span>
          </div>

          <h1 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            KhetiNexus <span className="text-emerald-400">AI</span>
          </h1>

          <p className="font-heading text-xl sm:text-2xl font-semibold text-emerald-200 tracking-normal">
            &ldquo;{t.tagline}&rdquo;
          </p>

          <p className="text-base sm:text-lg text-emerald-100/90 max-w-2xl mx-auto leading-relaxed">
            AI-powered agricultural intelligence for climate-resilient and regenerative farming.
            Empowering small and marginal farmers across BRICS nations with real-time agronomic insights, computer-vision plant pathology, and soil restoration guidance.
          </p>

          {/* Core Call to Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-4">
            <button
              id="hero-get-advisory-btn"
              onClick={() => setActiveTab('ai-advisor')}
              className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold text-sm sm:text-base shadow-lg hover:shadow-emerald-500/25 transition-all transform active:scale-98 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-emerald-950" />
              <span>{t.getAdvisoryBtn}</span>
            </button>

            <button
              id="hero-diagnose-crop-btn"
              onClick={() => setActiveTab('crop-doctor')}
              className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-white hover:bg-emerald-50 text-emerald-950 font-bold text-sm sm:text-base shadow-md transition-all active:scale-98 cursor-pointer"
            >
              <Stethoscope className="w-4 h-4 text-emerald-700" />
              <span>{t.diagnoseCropBtn}</span>
            </button>

            <button
              id="hero-explore-agrin-btn"
              onClick={() => setActiveTab('agrin-network')}
              className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-emerald-800/80 hover:bg-emerald-800 text-emerald-100 border border-emerald-600/50 font-semibold text-sm sm:text-base transition-all active:scale-98 cursor-pointer"
            >
              <Globe2 className="w-4 h-4 text-emerald-300" />
              <span>{t.exploreAgriNBtn}</span>
            </button>
          </div>

          {/* Quick preset switch bar */}
          <div className="pt-6 border-t border-emerald-800/60 mt-8">
            <p className="text-xs uppercase tracking-wider text-emerald-300 font-semibold mb-3">
              Explore Demo Farm Presets (BRICS Nations):
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {BRICS_FARM_PRESETS.map((farm) => {
                const isSelected = currentFarm.id === farm.id;
                return (
                  <button
                    key={farm.id}
                    onClick={() => onSelectFarmPreset(farm)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-emerald-400 text-emerald-950 font-bold shadow-xs'
                        : 'bg-emerald-950/60 text-emerald-200 hover:bg-emerald-800 border border-emerald-700/40'
                    }`}
                  >
                    <span>
                      {farm.country === 'India'
                        ? '🇮🇳'
                        : farm.country === 'Brazil'
                        ? '🇧🇷'
                        : farm.country === 'Russia'
                        ? '🇷🇺'
                        : farm.country === 'China'
                        ? '🇨🇳'
                        : '🇿🇦'}
                    </span>
                    <span>{farm.name}</span>
                    <span className="opacity-75">({farm.crop})</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 5 Core Feature Cards Required by Prompt */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-stone-900">
            Comprehensive Digital Agricultural Suite
          </h2>
          <p className="text-stone-600 text-sm mt-1">
            Engineered around the AgriN challenge for resilient, sustainable, and high-yield farming.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* 1. 🌱 Regenerative Farming */}
          <div
            id="card-regenerative-farming"
            onClick={() => setActiveTab('regenerative')}
            className="group bg-white rounded-2xl p-6 border border-stone-200 hover:border-emerald-500 hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800 mb-4 group-hover:bg-emerald-700 group-hover:text-white transition-colors">
                <span className="text-2xl">🌱</span>
              </div>
              <h3 className="font-heading text-lg font-bold text-stone-900 group-hover:text-emerald-800 transition-colors">
                Regenerative Farming
              </h3>
              <p className="text-stone-600 text-xs sm:text-sm mt-2 leading-relaxed">
                Rebuild living soil organic matter, restore mycorrhizal fungi, cut expensive chemical inputs, and maximize long-term biological fertility.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-emerald-700">
              <span>8 Core Regenerative Pillars</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 2. 🌦️ Climate Intelligence */}
          <div
            id="card-climate-intelligence"
            onClick={() => setActiveTab('weather')}
            className="group bg-white rounded-2xl p-6 border border-stone-200 hover:border-emerald-500 hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-sky-100 flex items-center justify-center text-sky-800 mb-4 group-hover:bg-sky-700 group-hover:text-white transition-colors">
                <span className="text-2xl">🌦️</span>
              </div>
              <h3 className="font-heading text-lg font-bold text-stone-900 group-hover:text-emerald-800 transition-colors">
                Climate Intelligence
              </h3>
              <p className="text-stone-600 text-xs sm:text-sm mt-2 leading-relaxed">
                Hyper-local agro-weather telemetry, precipitation forecasts, evapotranspiration rates, and optimal windows for irrigation and foliar application.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-sky-700">
              <span>View 5-Day Agro Forecast</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 3. 🤖 AI Farm Advisor */}
          <div
            id="card-ai-farm-advisor"
            onClick={() => setActiveTab('ai-advisor')}
            className="group bg-white rounded-2xl p-6 border border-stone-200 hover:border-emerald-500 hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800 mb-4 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                <span className="text-2xl">🤖</span>
              </div>
              <h3 className="font-heading text-lg font-bold text-stone-900 group-hover:text-emerald-800 transition-colors">
                AI Farm Advisor
              </h3>
              <p className="text-stone-600 text-xs sm:text-sm mt-2 leading-relaxed">
                Powered by Google Gemini 3.8. Formulates tailored recommendations covering water management, soil microbiome health, and chronological 7-day roadmaps.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-amber-700">
              <span>Generate Localized Advisory</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 4. 📷 Crop Disease Detection */}
          <div
            id="card-crop-disease-detection"
            onClick={() => setActiveTab('crop-doctor')}
            className="group bg-white rounded-2xl p-6 border border-stone-200 hover:border-emerald-500 hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-rose-100 flex items-center justify-center text-rose-800 mb-4 group-hover:bg-rose-600 group-hover:text-white transition-colors">
                <span className="text-2xl">📷</span>
              </div>
              <h3 className="font-heading text-lg font-bold text-stone-900 group-hover:text-emerald-800 transition-colors">
                Crop Disease Detection
              </h3>
              <p className="text-stone-600 text-xs sm:text-sm mt-2 leading-relaxed">
                Upload leaf or plant photos. Gemini Vision AI examines pathology patterns, assesses diagnosis confidence, and offers biological remediation plans.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-rose-700">
              <span>Scan or Test Sample Leaves</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 5. 🌍 Agricultural Cooperation */}
          <div
            id="card-agricultural-cooperation"
            onClick={() => setActiveTab('agrin-network')}
            className="group bg-white rounded-2xl p-6 border border-stone-200 hover:border-emerald-500 hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between md:col-span-2 lg:col-span-2"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center text-purple-800 mb-4 group-hover:bg-purple-700 group-hover:text-white transition-colors">
                <span className="text-2xl">🌍</span>
              </div>
              <h3 className="font-heading text-lg font-bold text-stone-900 group-hover:text-emerald-800 transition-colors">
                Agricultural Cooperation (AgriN Network)
              </h3>
              <p className="text-stone-600 text-xs sm:text-sm mt-2 leading-relaxed">
                Demonstrating interoperable knowledge exchange across BRICS agricultural institutions (India 🇮🇳, Brazil 🇧🇷, Russia 🇷🇺, China 🇨🇳, South Africa 🇿🇦).
                Sharing climate adaptation tactics, bio-stimulant formulations, and pest migration early warnings.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-purple-700">
              <span>Explore Conceptual Data Architecture</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* 5–7 Minute Hackathon Evaluation Guide */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl border border-emerald-200 p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-emerald-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center">
                <PlayCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading text-lg font-bold text-emerald-950">
                  5–7 Minute Hackathon Demonstration Flow
                </h3>
                <p className="text-xs text-stone-600">
                  Follow these 10 seamless steps to inspect the complete full-stack workflow.
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('dashboard')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs cursor-pointer"
            >
              <span>Start Flow on Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-6">
            {demoSteps.map((step) => (
              <div
                key={step.num}
                className="bg-white rounded-xl p-3 border border-emerald-100 shadow-2xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1.5 text-emerald-700 text-xs font-bold mb-1">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-[11px]">
                      {step.num}
                    </span>
                    <span className="truncate">{step.title}</span>
                  </div>
                  <p className="text-[11px] text-stone-500 leading-tight">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
