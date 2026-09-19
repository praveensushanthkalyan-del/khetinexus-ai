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
import { localizeCrop } from '../i18n/dataTranslations';
import { useAuth } from '../context/AuthContext';

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
  const { user } = useAuth();

  const demoSteps = [
    { num: 1, title: t.step1Title, desc: t.step1Desc },
    { num: 2, title: t.step2Title, desc: t.step2Desc },
    { num: 3, title: t.step3Title, desc: t.step3Desc },
    { num: 4, title: t.step4Title, desc: t.step4Desc },
    { num: 5, title: t.step5Title, desc: t.step5Desc },
    { num: 6, title: t.step6Title, desc: t.step6Desc },
    { num: 7, title: t.step7Title, desc: t.step7Desc },
    { num: 8, title: t.step8Title, desc: t.step8Desc },
    { num: 9, title: t.step9Title, desc: t.step9Desc },
    { num: 10, title: t.step10Title, desc: t.step10Desc },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-8 sm:space-y-12 pb-16">
      {/* Hero Section with Visible Agricultural Field Background */}
      <section className="relative overflow-hidden pt-8 pb-10 sm:pt-12 sm:pb-16 text-white rounded-2xl sm:rounded-3xl px-4 sm:px-8 lg:px-12 shadow-xl border border-emerald-800/40 w-full">
        {/* Agricultural Farm Background Image */}
        <div className="absolute inset-0 w-full h-full">
          <img
            src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=2000&q=85"
            alt="Lush green agricultural farm fields under bright sky"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center brightness-100 contrast-105"
          />
          {/* Balanced gradient overlay so background image is clearly visible while text is easily readable */}
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/75 via-emerald-950/55 to-green-950/85 dark:from-black/80 dark:via-black/60 dark:to-black/85" />
          {/* Subtle agricultural mesh overlay */}
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#48bb78_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center space-y-5 sm:space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-emerald-800/80 border border-emerald-600/40 text-emerald-200 text-xs sm:text-sm font-medium shadow-inner">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{t.heroEyebrow}</span>
          </div>

          <h1 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            KhetiNexus <span className="text-emerald-400">AI</span>
          </h1>

          <p className="font-heading text-lg sm:text-2xl font-semibold text-emerald-200 tracking-normal">
            &ldquo;{t.tagline}&rdquo;
          </p>

          <p className="text-sm sm:text-lg text-emerald-100/90 max-w-2xl mx-auto leading-relaxed">
            {t.heroDescription}
          </p>

          {/* Core Call to Action Buttons */}
          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-4 pt-2 sm:pt-4 w-full">
            <button
              id="hero-get-advisory-btn"
              onClick={() => setActiveTab('ai-advisor')}
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold text-sm sm:text-base shadow-lg hover:shadow-emerald-500/25 transition-all transform active:scale-98 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-emerald-950 shrink-0" />
              <span>{t.getAdvisoryBtn}</span>
            </button>

            <button
              id="hero-diagnose-crop-btn"
              onClick={() => setActiveTab('crop-doctor')}
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-white hover:bg-emerald-50 text-emerald-950 font-bold text-sm sm:text-base shadow-md transition-all active:scale-98 cursor-pointer"
            >
              <Stethoscope className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>{t.diagnoseCropBtn}</span>
            </button>

            <button
              id="hero-explore-agrin-btn"
              onClick={() => setActiveTab('agrin-network')}
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-emerald-800/80 hover:bg-emerald-800 text-emerald-100 border border-emerald-600/50 font-semibold text-sm sm:text-base transition-all active:scale-98 cursor-pointer"
            >
              <Globe2 className="w-4 h-4 text-emerald-300 shrink-0" />
              <span>{t.exploreAgriNBtn}</span>
            </button>
          </div>


        </div>
      </section>

      {/* Architecture & BRICS Scalability Positioning Banner (Available in Demo/Guest mode) */}
      {!user && (
        <section className="w-full">
          <div className="bg-white dark:bg-stone-900 rounded-2xl p-4 sm:p-6 border border-emerald-200/80 dark:border-emerald-900/60 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 flex items-center justify-center shrink-0 mt-0.5">
                <Globe2 className="w-5 h-5" />
              </div>
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold uppercase tracking-wider text-purple-800 dark:text-purple-400">
                    {t.crossBorderTitle || 'Cross-Border Agricultural Interoperability'}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    {t.interoperableTagline || 'Localized for the farmer, interoperable by design.'}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed max-w-4xl break-words">
                  {t.bricsArchitectureConcept ||
                    'KhetiNexus AI starts with a localized Indian farmer experience, but its data-driven architecture is designed to scale across BRICS agricultural ecosystems.'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('agrin-network')}
              className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/60 dark:hover:bg-purple-900/80 text-purple-900 dark:text-purple-200 border border-purple-200 dark:border-purple-800 text-xs font-bold transition-all cursor-pointer"
            >
              <span>{t.exploreAgriNBtn || 'Explore AgriN Network'}</span>
              <ArrowRight className="w-3.5 h-3.5 shrink-0" />
            </button>
          </div>
        </section>
      )}

      {/* 5 Core Feature Cards */}
      <section className="w-full">
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100">
            {t.featuresTitle}
          </h2>
          <p className="text-stone-600 dark:text-stone-400 text-xs sm:text-sm mt-1">
            {t.featuresSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 w-full">
          {/* 1. 🌱 Regenerative Farming */}
          <div
            id="card-regenerative-farming"
            onClick={() => setActiveTab('regenerative')}
            className="group bg-white dark:bg-stone-900 rounded-2xl p-5 sm:p-6 border border-stone-200 dark:border-stone-800 hover:border-emerald-500 hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-800 dark:text-emerald-300 mb-4 group-hover:bg-emerald-700 group-hover:text-white transition-colors">
                <span className="text-2xl">🌱</span>
              </div>
              <h3 className="font-heading text-lg font-bold text-stone-900 dark:text-stone-100 group-hover:text-emerald-800 dark:group-hover:text-emerald-300 transition-colors">
                {t.feature1Title}
              </h3>
              <p className="text-stone-600 dark:text-stone-400 text-xs sm:text-sm mt-2 leading-relaxed">
                {t.feature1Desc}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              <span>{t.pillarsHeading}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform shrink-0" />
            </div>
          </div>

          {/* 2. 🌦️ Climate Intelligence */}
          <div
            id="card-climate-intelligence"
            onClick={() => setActiveTab('weather')}
            className="group bg-white dark:bg-stone-900 rounded-2xl p-5 sm:p-6 border border-stone-200 dark:border-stone-800 hover:border-emerald-500 hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-sky-100 dark:bg-sky-950 flex items-center justify-center text-sky-800 dark:text-sky-300 mb-4 group-hover:bg-sky-700 group-hover:text-white transition-colors">
                <span className="text-2xl">🌦️</span>
              </div>
              <h3 className="font-heading text-lg font-bold text-stone-900 dark:text-stone-100 group-hover:text-emerald-800 dark:group-hover:text-emerald-300 transition-colors">
                {t.feature2Title}
              </h3>
              <p className="text-stone-600 dark:text-stone-400 text-xs sm:text-sm mt-2 leading-relaxed">
                {t.feature2Desc}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs font-semibold text-sky-700 dark:text-sky-400">
              <span>{t.fiveDayOutlook}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform shrink-0" />
            </div>
          </div>

          {/* 3. 🤖 AI Farm Advisor */}
          <div
            id="card-ai-farm-advisor"
            onClick={() => setActiveTab('ai-advisor')}
            className="group bg-white dark:bg-stone-900 rounded-2xl p-5 sm:p-6 border border-stone-200 dark:border-stone-800 hover:border-emerald-500 hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-950 flex items-center justify-center text-amber-800 dark:text-amber-300 mb-4 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                <span className="text-2xl">🤖</span>
              </div>
              <h3 className="font-heading text-lg font-bold text-stone-900 dark:text-stone-100 group-hover:text-emerald-800 dark:group-hover:text-emerald-300 transition-colors">
                {t.feature3Title}
              </h3>
              <p className="text-stone-600 dark:text-stone-400 text-xs sm:text-sm mt-2 leading-relaxed">
                {t.feature3Desc}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs font-semibold text-amber-700 dark:text-amber-400">
              <span>{t.generateAdvisoryBtn}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform shrink-0" />
            </div>
          </div>

          {/* 4. 📷 Crop Disease Detection */}
          <div
            id="card-crop-disease-detection"
            onClick={() => setActiveTab('crop-doctor')}
            className="group bg-white dark:bg-stone-900 rounded-2xl p-5 sm:p-6 border border-stone-200 dark:border-stone-800 hover:border-emerald-500 hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-rose-100 dark:bg-rose-950 flex items-center justify-center text-rose-800 dark:text-rose-300 mb-4 group-hover:bg-rose-600 group-hover:text-white transition-colors">
                <span className="text-2xl">📷</span>
              </div>
              <h3 className="font-heading text-lg font-bold text-stone-900 dark:text-stone-100 group-hover:text-emerald-800 dark:group-hover:text-emerald-300 transition-colors">
                {t.feature4Title}
              </h3>
              <p className="text-stone-600 dark:text-stone-400 text-xs sm:text-sm mt-2 leading-relaxed">
                {t.feature4Desc}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs font-semibold text-rose-700 dark:text-rose-400">
              <span>{t.diagnoseBtn}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform shrink-0" />
            </div>
          </div>

          {/* 5. 🌍 Agricultural Cooperation */}
          <div
            id="card-agricultural-cooperation"
            onClick={() => setActiveTab('agrin-network')}
            className="group bg-white dark:bg-stone-900 rounded-2xl p-5 sm:p-6 border border-stone-200 dark:border-stone-800 hover:border-emerald-500 hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between md:col-span-2 lg:col-span-2"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-950 flex items-center justify-center text-purple-800 dark:text-purple-300 mb-4 group-hover:bg-purple-700 group-hover:text-white transition-colors">
                <span className="text-2xl">🌍</span>
              </div>
              <h3 className="font-heading text-lg font-bold text-stone-900 dark:text-stone-100 group-hover:text-emerald-800 dark:group-hover:text-emerald-300 transition-colors">
                {t.feature5Title}
              </h3>
              <p className="text-stone-600 dark:text-stone-400 text-xs sm:text-sm mt-2 leading-relaxed">
                {t.feature5Desc}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs font-semibold text-purple-700 dark:text-purple-400">
              <span>{t.exploreAgriNBtn}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform shrink-0" />
            </div>
          </div>
        </div>
      </section>

      {/* 5–7 Minute Hackathon Evaluation Guide (Available in Demo/Guest mode) */}
      {!user && (
        <section className="w-full">
          <div className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30 rounded-2xl border border-emerald-200 dark:border-emerald-900/60 p-4 sm:p-8 shadow-xs w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 sm:pb-6 border-b border-emerald-200 dark:border-emerald-900/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0">
                  <PlayCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading text-base sm:text-lg font-bold text-emerald-950 dark:text-emerald-200">
                    {t.workflowTitle}
                  </h3>
                  <p className="text-xs text-stone-600 dark:text-stone-400">
                    {t.workflowSubtitle}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('dashboard')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                <span>{t.openDashboardBtn}</span>
                <ArrowRight className="w-3.5 h-3.5 shrink-0" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mt-4 sm:mt-6 w-full">
              {demoSteps.map((step) => (
                <div
                  key={step.num}
                  className="bg-white dark:bg-stone-900 rounded-xl p-3 border border-emerald-100 dark:border-emerald-900/40 shadow-2xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 text-xs font-bold mb-1">
                      <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-[11px] shrink-0">
                        {step.num}
                      </span>
                      <span className="truncate">{step.title}</span>
                    </div>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-tight">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
