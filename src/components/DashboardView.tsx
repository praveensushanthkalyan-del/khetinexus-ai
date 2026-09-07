import React from 'react';
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* 1. Farmer Overview Header Bar */}
      <div className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-600 to-green-700 text-white flex items-center justify-center text-xl font-bold shadow-md shadow-emerald-900/10 shrink-0">
            {currentFarm.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-heading text-xl sm:text-2xl font-bold text-stone-900">
                {currentFarm.name}
              </h1>
              <span className="text-lg">{getCountryFlag(currentFarm.country)}</span>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                {currentFarm.country}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone-500 mt-1">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-stone-400" />
                {currentFarm.location}, {currentFarm.stateRegion}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Sprout className="w-3.5 h-3.5 text-emerald-600" />
                <strong>{currentFarm.crop}</strong> ({currentFarm.growthStage})
              </span>
              <span>•</span>
              <span>
                {currentFarm.farmSize} {currentFarm.farmUnit}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-stone-100">
          <button
            id="dash-quick-advisory-btn"
            onClick={() => setActiveTab('ai-advisor')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>New Advisory</span>
          </button>

          <button
            id="dash-quick-crop-doctor-btn"
            onClick={() => setActiveTab('crop-doctor')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-stone-300 hover:border-emerald-600 text-stone-700 hover:text-emerald-800 text-xs font-semibold transition-colors cursor-pointer"
          >
            <Stethoscope className="w-3.5 h-3.5 text-emerald-700" />
            <span>Crop Doctor</span>
          </button>

          <button
            id="dash-edit-profile-btn"
            onClick={() => setActiveTab('farm-profile')}
            className="px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium transition-colors cursor-pointer"
          >
            Edit Farm
          </button>
        </div>
      </div>

      {/* Main Grid: Today's Advisory + Weather */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Section: Today's Advisory (2 Columns on large) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-stone-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-heading text-lg font-bold text-stone-900">
                    {t.todaysAdvisory}
                  </h2>
                  <span className="text-[11px] text-stone-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Updated {advisory.timestamp || 'Today'} • {advisory.source || 'Gemini 3.8'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('ai-advisor')}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
              >
                <span>Full Advisory</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Executive Summary Card */}
            <div className="bg-emerald-50/70 border border-emerald-200/70 rounded-xl p-4 mb-4">
              <p className="text-xs sm:text-sm text-emerald-950 font-medium leading-relaxed">
                {advisory.summary}
              </p>
            </div>

            {/* Structured Advisory Points */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="bg-stone-50 rounded-xl p-3.5 border border-stone-100">
                <div className="flex items-center gap-2 text-xs font-bold text-stone-800 mb-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{t.whatToDoToday}</span>
                </div>
                <p className="text-xs text-stone-600 leading-normal">{advisory.todayAction}</p>
              </div>

              <div className="bg-stone-50 rounded-xl p-3.5 border border-stone-100">
                <div className="flex items-center gap-2 text-xs font-bold text-stone-800 mb-1">
                  <Droplets className="w-3.5 h-3.5 text-sky-600" />
                  <span>{t.waterManagement}</span>
                </div>
                <p className="text-xs text-stone-600 leading-normal">{advisory.waterManagement}</p>
              </div>

              <div className="bg-stone-50 rounded-xl p-3.5 border border-stone-100">
                <div className="flex items-center gap-2 text-xs font-bold text-stone-800 mb-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                  <span>{t.cropProtection}</span>
                </div>
                <p className="text-xs text-stone-600 leading-normal">{advisory.cropProtection}</p>
              </div>

              <div className="bg-stone-50 rounded-xl p-3.5 border border-stone-100">
                <div className="flex items-center gap-2 text-xs font-bold text-stone-800 mb-1">
                  <Layers className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{t.regenerativePractice}</span>
                </div>
                <p className="text-xs text-stone-600 leading-normal">{advisory.regenerativePractice}</p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400">
            <span>AI advisory engine tailored for {currentFarm.crop}</span>
            <span className="text-amber-700 font-medium">Verify critical decisions with local agronomist</span>
          </div>
        </div>

        {/* Section: Weather Card (1 Column) */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-800 flex items-center justify-center">
                  <CloudSun className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-heading text-lg font-bold text-stone-900">{t.weather}</h2>
                  <span className="text-[11px] text-stone-500">{weather.location}</span>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('weather')}
                className="text-xs font-semibold text-sky-700 hover:text-sky-900 flex items-center gap-1"
              >
                <span>Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Current Weather Display */}
            <div className="flex items-center justify-between my-2">
              <div>
                <span className="text-3xl font-extrabold text-stone-900 tracking-tight">
                  {weather.temperature}
                </span>
                <p className="text-xs font-medium text-stone-600 mt-0.5">{weather.condition}</p>
              </div>
              <div className="text-right text-xs space-y-1 text-stone-600">
                <div className="flex items-center justify-end gap-1.5">
                  <Droplets className="w-3.5 h-3.5 text-sky-600" />
                  <span>Humidity: <strong>{weather.humidity}</strong></span>
                </div>
                <div className="flex items-center justify-end gap-1.5">
                  <CloudSun className="w-3.5 h-3.5 text-blue-500" />
                  <span>Rainfall: <strong>{weather.rainfall}</strong></span>
                </div>
                <div className="flex items-center justify-end gap-1.5">
                  <Wind className="w-3.5 h-3.5 text-stone-500" />
                  <span>Wind: <strong>{weather.wind}</strong></span>
                </div>
              </div>
            </div>

            {/* 3-day preview snippet */}
            <div className="mt-4 pt-3 border-t border-stone-100 space-y-2">
              <span className="text-[11px] uppercase font-bold tracking-wider text-stone-400">
                Next Days Outlook
              </span>
              <div className="grid grid-cols-3 gap-2">
                {weather.forecast.slice(0, 3).map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-stone-50 rounded-lg p-2 text-center border border-stone-100"
                  >
                    <span className="block text-[10px] text-stone-500">{item.day}</span>
                    <span className="block text-xs font-bold text-stone-800 my-0.5">{item.temp}</span>
                    <span className="block text-[10px] text-sky-700 font-medium">{item.rainProb}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 pt-2 text-[10px] text-stone-400 text-center">
            {weather.notice}
          </div>
        </div>
      </div>

      {/* Secondary Row: Soil Health + Crop Health Doctor + Regenerative Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Section: Soil Health Mini Widget */}
        <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
                  <FlaskConical className="w-3.5 h-3.5" />
                </div>
                <h3 className="font-heading text-base font-bold text-stone-900">{t.soilHealth}</h3>
              </div>
              <button
                onClick={() => setActiveTab('soil-health')}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-900"
              >
                Analyze
              </button>
            </div>

            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-stone-500">Soil Type</span>
                <strong className="text-stone-800">{currentFarm.soilType}</strong>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-stone-500">Soil pH</span>
                <span className="font-bold text-emerald-800 px-2 py-0.5 bg-emerald-50 rounded-md">
                  {soilReport.ph} (Near-Optimal)
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-stone-500">Organic Matter</span>
                <span className="font-bold text-stone-800">
                  {soilReport.organicMatter}% <span className="text-[10px] text-stone-400">(Target: &gt;3%)</span>
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-stone-500">NPK Balance</span>
                <span className="text-[11px] font-medium text-stone-700">
                  N: <span className="text-amber-600">Med</span> • P: <span className="text-emerald-600">Opt</span> • K: <span className="text-emerald-600">Opt</span>
                </span>
              </div>
            </div>

            <div className="mt-3 p-2.5 rounded-lg bg-amber-50/60 border border-amber-200/60 text-[11px] text-amber-900">
              💡 <em>Priority:</em> Surface mulching will safeguard earthworm activity from peak afternoon heat.
            </div>
          </div>
        </div>

        {/* Section: Crop Health & Doctor Diagnoses */}
        <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-rose-100 text-rose-800 flex items-center justify-center">
                  <Stethoscope className="w-3.5 h-3.5" />
                </div>
                <h3 className="font-heading text-base font-bold text-stone-900">{t.cropHealth}</h3>
              </div>
              <button
                onClick={() => setActiveTab('crop-doctor')}
                className="text-xs font-semibold text-rose-700 hover:text-rose-900 flex items-center gap-1"
              >
                <span>Upload Leaf</span>
                <PlusCircle className="w-3 h-3" />
              </button>
            </div>

            {diagnoses.length > 0 ? (
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-stone-50 border border-stone-100">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-stone-900 truncate">
                      {diagnoses[0].disease}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                      {diagnoses[0].confidence}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-600 line-clamp-2">
                    {diagnoses[0].immediateActions}
                  </p>
                  <span className="block text-[10px] text-stone-400 mt-1">
                    Diagnosed: {diagnoses[0].timestamp}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-stone-400 text-xs">
                No recent diagnoses recorded. Scan a leaf with Crop Doctor.
              </div>
            )}
          </div>

          <button
            onClick={() => setActiveTab('crop-doctor')}
            className="w-full mt-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 text-xs font-bold transition-colors text-center cursor-pointer"
          >
            Launch Crop Doctor Vision
          </button>
        </div>

        {/* Section: Regenerative Actions Checklist */}
        <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Layers className="w-3.5 h-3.5" />
                </div>
                <h3 className="font-heading text-base font-bold text-stone-900">
                  {t.regenerativeActions}
                </h3>
              </div>
              <button
                onClick={() => setActiveTab('regenerative')}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-900"
              >
                All 8 Pillars
              </button>
            </div>

            <ul className="space-y-2 text-xs text-stone-700">
              <li className="flex items-start gap-2 p-2 rounded-lg bg-stone-50 border border-stone-100">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Maintain 3-4 inch residue mulch across crop beds</span>
              </li>
              <li className="flex items-start gap-2 p-2 rounded-lg bg-stone-50 border border-stone-100">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Prepare liquid bio-fertilizer (compost tea) for weekend foliar spray</span>
              </li>
              <li className="flex items-start gap-2 p-2 rounded-lg bg-stone-50 border border-stone-100">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Scout border flowering rows for predatory ladybugs & wasps</span>
              </li>
            </ul>
          </div>

          <button
            onClick={() => setActiveTab('regenerative')}
            className="w-full mt-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs font-bold transition-colors text-center cursor-pointer"
          >
            Explore Regenerative Methods
          </button>
        </div>
      </div>
    </div>
  );
};
