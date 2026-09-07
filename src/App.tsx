import React, { useState, useEffect } from 'react';
import {
  ActiveTab,
  Language,
  FarmProfile,
  AdvisoryResult,
  DiagnosisResult,
  SoilReport,
  WeatherData,
} from './types';
import {
  BRICS_FARM_PRESETS,
  INITIAL_ADVISORY,
  INITIAL_DIAGNOSES,
  INITIAL_SOIL_REPORT,
  INITIAL_WEATHER_DATA,
} from './data/mockData';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { DashboardView } from './components/DashboardView';
import { FarmProfileView } from './components/FarmProfileView';
import { AdvisoryView } from './components/AdvisoryView';
import { CropDoctorView } from './components/CropDoctorView';
import { WeatherView } from './components/WeatherView';
import { SoilHealthView } from './components/SoilHealthView';
import { RegenerativeFarmingView } from './components/RegenerativeFarmingView';
import { AgriNNetworkView } from './components/AgriNNetworkView';
import { Sprout, Globe2, ShieldCheck, Heart } from 'lucide-react';

export default function App() {
  // Navigation & Localization
  const [activeTab, setActiveTab] = useState<ActiveTab>('landing');
  const [language, setLanguage] = useState<Language>('en');

  // Farm Profile State (Persisted in localStorage)
  const [currentFarm, setCurrentFarm] = useState<FarmProfile>(() => {
    try {
      const saved = localStorage.getItem('khetinexus_farm_profile');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return BRICS_FARM_PRESETS[0]; // Default: Gurpreet Singh, India
  });

  // Core Data States
  const [advisory, setAdvisory] = useState<AdvisoryResult>(INITIAL_ADVISORY);
  const [diagnoses, setDiagnoses] = useState<DiagnosisResult[]>(INITIAL_DIAGNOSES);
  const [soilReport, setSoilReport] = useState<SoilReport>(INITIAL_SOIL_REPORT);
  const [weather, setWeather] = useState<WeatherData>(INITIAL_WEATHER_DATA);

  // AI Backend Health check
  const [isGeminiActive, setIsGeminiActive] = useState<boolean | null>(null);

  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => {
        setIsGeminiActive(data.hasGeminiKey === true || data.geminiKeyConfigured === true);
      })
      .catch((err) => {
        console.warn('API health check fallback:', err);
        setIsGeminiActive(false);
      });
  }, []);

  // Update farm profile & save to storage
  const handleSaveProfile = (updated: FarmProfile) => {
    setCurrentFarm(updated);
    try {
      localStorage.setItem('khetinexus_farm_profile', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }

    // Auto update weather location label
    setWeather((prev) => ({
      ...prev,
      location: `${updated.location}, ${updated.stateRegion}`,
      country: updated.country,
    }));
  };

  // Switch farm preset
  const handleSelectFarmPreset = (preset: FarmProfile) => {
    handleSaveProfile(preset);
  };

  // Add new crop doctor diagnosis
  const handleAddDiagnosis = (newDiag: DiagnosisResult) => {
    setDiagnoses([newDiag, ...diagnoses]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-100/70 text-stone-900 selection:bg-emerald-200 selection:text-emerald-950 font-sans">
      {/* Universal Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        language={language}
        setLanguage={setLanguage}
        currentFarm={currentFarm}
        hasGeminiKey={isGeminiActive ?? false}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {activeTab === 'landing' && (
          <LandingPage
            setActiveTab={setActiveTab}
            language={language}
            onSelectFarmPreset={handleSelectFarmPreset}
            currentFarm={currentFarm}
          />
        )}

        {activeTab === 'dashboard' && (
          <DashboardView
            currentFarm={currentFarm}
            advisory={advisory}
            diagnoses={diagnoses}
            soilReport={soilReport}
            weather={weather}
            setActiveTab={setActiveTab}
            language={language}
          />
        )}

        {activeTab === 'farm-profile' && (
          <FarmProfileView
            currentFarm={currentFarm}
            onSaveProfile={handleSaveProfile}
            language={language}
          />
        )}

        {activeTab === 'ai-advisor' && (
          <AdvisoryView
            currentFarm={currentFarm}
            advisory={advisory}
            onUpdateAdvisory={setAdvisory}
            language={language}
          />
        )}

        {activeTab === 'crop-doctor' && (
          <CropDoctorView
            currentFarm={currentFarm}
            diagnoses={diagnoses}
            onAddDiagnosis={handleAddDiagnosis}
            language={language}
          />
        )}

        {activeTab === 'weather' && (
          <WeatherView
            weather={weather}
            currentFarm={currentFarm}
            language={language}
            onRefreshWeather={() => {
              setWeather((prev) => ({
                ...prev,
                notice: 'Telemetry refreshed just now',
              }));
            }}
          />
        )}

        {activeTab === 'soil-health' && (
          <SoilHealthView
            currentFarm={currentFarm}
            soilReport={soilReport}
            onUpdateSoilReport={setSoilReport}
            language={language}
          />
        )}

        {activeTab === 'regenerative' && (
          <RegenerativeFarmingView
            currentFarm={currentFarm}
            language={language}
          />
        )}

        {activeTab === 'agrin-network' && (
          <AgriNNetworkView language={language} />
        )}
      </main>

      {/* Comprehensive Footer */}
      <footer className="bg-stone-900 text-stone-300 border-t border-stone-800 mt-12 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand & Purpose */}
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center">
                  <Sprout className="w-5 h-5 text-emerald-300" />
                </div>
                <span className="font-heading font-extrabold text-lg text-white">
                  KhetiNexus <span className="text-emerald-400">AI</span>
                </span>
              </div>
              <p className="font-heading text-sm font-semibold text-emerald-400">
                &ldquo;Intelligent Agriculture. Regenerative Future.&rdquo;
              </p>
              <p className="text-xs text-stone-400 max-w-md leading-relaxed">
                An interoperable digital agriculture intelligence platform engineered for small and marginal farmers.
                Designed around the AgriN / Regenerative Agricultural Intelligence challenge to foster knowledge exchange across BRICS nations.
              </p>
            </div>

            {/* Quick Navigation Links */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-200 mb-3">
                Platform Modules
              </h4>
              <ul className="space-y-1.5 text-xs text-stone-400">
                <li>
                  <button
                    onClick={() => setActiveTab('dashboard')}
                    className="hover:text-emerald-400 transition-colors"
                  >
                    Farmer Dashboard
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('ai-advisor')}
                    className="hover:text-emerald-400 transition-colors"
                  >
                    AI Farm Advisor (Gemini 3.8)
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('crop-doctor')}
                    className="hover:text-emerald-400 transition-colors"
                  >
                    Crop Doctor Vision
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('soil-health')}
                    className="hover:text-emerald-400 transition-colors"
                  >
                    Soil Microbiome Analysis
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('regenerative')}
                    className="hover:text-emerald-400 transition-colors"
                  >
                    8 Regenerative Pillars
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('agrin-network')}
                    className="hover:text-emerald-400 transition-colors"
                  >
                    AgriN BRICS Interoperability
                  </button>
                </li>
              </ul>
            </div>

            {/* Participating Countries & Ethics */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-200 mb-3">
                Participating Framework
              </h4>
              <div className="flex flex-wrap gap-2 text-lg mb-4">
                <span title="India">🇮🇳</span>
                <span title="Brazil">🇧🇷</span>
                <span title="Russia">🇷🇺</span>
                <span title="China">🇨🇳</span>
                <span title="South Africa">🇿🇦</span>
              </div>
              <p className="text-[11px] text-stone-400 leading-relaxed">
                Adhering to sovereign data boundaries: farm ownership and private telemetry remain locally stored, while agronomic intelligence is shared openly.
              </p>
            </div>
          </div>

          {/* Agricultural Advisory Disclaimer Banner */}
          <div className="pt-6 border-t border-stone-800 text-[11px] text-stone-500 leading-relaxed space-y-1">
            <p>
              <strong>Agricultural & AI Disclaimer:</strong> KhetiNexus AI is an educational and decision-support prototype. Recommendations and crop disease classifications are generated using artificial intelligence (Google Gemini). They do not constitute guaranteed agricultural prescriptions or replace advice from accredited agronomic extension officers, Krishi Vigyan Kendras (KVKs), or national agricultural ministries.
            </p>
            <p className="pt-2 text-stone-400 flex items-center justify-between">
              <span>© {new Date().getFullYear()} KhetiNexus AI. Built for the AgriN Hackathon.</span>
              <span className="flex items-center gap-1">
                Crafted for smallholder farmers worldwide <Heart className="w-3 h-3 text-rose-500" />
              </span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
