import React, { useState, useEffect } from 'react';
import {
  ActiveTab,
  Language,
  FarmProfile,
  AdvisoryResult,
  DiagnosisResult,
  SoilReport,
  WeatherData,
  EMPTY_SOIL_REPORT,
} from './types';
import {
  
  INITIAL_WEATHER_DATA,
} from './data/mockData';
import { fetchLiveWeatherPipeline } from './data/providers/weather/weatherProvider';
import { getTranslation, getRecommendedLanguageForLocation } from './i18n/translations';
import {
  getLocalizedInitialAdvisory,
  getLocalizedInitialDiagnoses,
  getLocalizedSoilReport,
} from './i18n/dataTranslations';
import { AppShell } from './components/AppShell';
import { LandingPage } from './components/LandingPage';
import { DashboardView } from './components/DashboardView';
import { FarmProfileView } from './components/FarmProfileView';
import { AdvisoryView } from './components/AdvisoryView';
import { CropDoctorView } from './components/CropDoctorView';
import { WeatherView } from './components/WeatherView';
import { SoilHealthView } from './components/SoilHealthView';
import { RegenerativeFarmingView } from './components/RegenerativeFarmingView';
import { AgriNNetworkView } from './components/AgriNNetworkView';
import { GeospatialIntelligenceView } from './components/GeospatialIntelligenceView';
import { DataSourcesView } from './components/DataSourcesView';
import { createUnifiedFarmContext } from './data/unifiedFarmContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { CountryProvider, useCountry } from './context/CountryContext';
import { PermissionProvider } from './context/PermissionContext';
import { AuthModal } from './components/AuthModal';
import { FarmModal } from './components/FarmModal';
import { PrivacyModal } from './components/PrivacyModal';
import { CountrySelectionModal } from './components/CountrySelectionModal';
import { AccessRequestModal } from './components/AccessRequestModal';
import { LoginWelcomeView } from './components/LoginWelcomeView';
import { Sprout, Globe2, ShieldCheck, Heart, Compass, Loader2 } from 'lucide-react';
import { saveAdvisoryHistory, saveDiagnosisRecord, saveSoilRecord, getFarmSoilRecords } from './lib/firestoreService';

interface KhetiNexusMainProps {
  language: Language;
  setLanguage: (lang: Language) => void;
}

function KhetiNexusMain({ language, setLanguage }: KhetiNexusMainProps) {
  const {
    user,
    loadingAuth,
    isGuestMode,
    exitGuestMode,
    setAuthModalOpen,
    setAuthModalMode,
    activeFarm,
    activeFarmProfile,
    setDemoFarmProfile,
  } = useAuth();

  const { countryModalOpen, setCountryModalOpen, activeCountry } = useCountry();

  // Navigation State: ALWAYS default to 'landing' (Home)
  const [activeTab, setActiveTab] = useState<ActiveTab>('landing');

  // Explicit Auth State Transition & Country Switch:
  // After ANY successful login, logout, user switch, or country switch, ALWAYS navigate to 'landing' (Home)
  useEffect(() => {
    setActiveTab('landing');

    // Clean up any lingering legacy navigation storage keys
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && (k.includes('lastFeature') || k.includes('activeTab') || k.includes('selectedView'))) {
          keysToRemove.push(k);
        }
      }
      keysToRemove.forEach((k) => localStorage.removeItem(k));
    } catch (e) {}
  }, [user?.uid, activeCountry, isGuestMode]);

  // Farm Profile State (Tracks activeFarmProfile or fallback preset)
  const [currentFarm, setCurrentFarm] = useState<FarmProfile>(() => activeFarmProfile);

  // Keep HTML document lang element in sync with global selected language
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
    }
  }, [language]);

  // Sync currentFarm whenever activeFarmProfile changes from Firestore / Switcher
  useEffect(() => {
    if (activeFarmProfile) {
      setCurrentFarm(activeFarmProfile);
      setWeather((prev) => ({
        ...prev,
        location: `${activeFarmProfile.location}, ${activeFarmProfile.stateRegion}`,
        country: activeFarmProfile.country,
      }));

      // Regional Language Recommendation (if user has not manually selected a preference)
      try {
        const isManuallySelected = localStorage.getItem('khetinexus_language_selected') === 'true';
        if (!isManuallySelected && activeFarmProfile.stateRegion) {
          const recommended = getRecommendedLanguageForLocation(
            activeFarmProfile.stateRegion,
            activeFarmProfile.country
          );
          if (recommended && recommended !== language) {
            setLanguage(recommended);
            localStorage.setItem('khetinexus_language', recommended);
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, [activeFarmProfile]);

  // Fetch authoritative soil record for authenticated farm, or clean empty state if none exists
  useEffect(() => {
    let isMounted = true;
    if (user?.uid && activeFarm?.id) {
      getFarmSoilRecords(user.uid, activeFarm.id, activeCountry, 1)
        .then((records) => {
          if (!isMounted) return;
          if (records && records.length > 0) {
            const latest = records[0];
            setSoilReport({
              soilType: activeFarm.soilType || currentFarm.soilType || 'Loam',
              ph: latest.ph !== undefined ? latest.ph : null,
              nitrogen: latest.nitrogen ?? null,
              phosphorus: latest.phosphorus ?? null,
              potassium: latest.potassium ?? null,
              soilMoisture: latest.soilMoisture !== undefined ? latest.soilMoisture : null,
              organicMatter: latest.organicMatter !== undefined ? latest.organicMatter : null,
              summary: latest.summary || '',
              deficiencies: latest.deficiencies || [],
              regenerativeRecommendations: latest.regenerativeRecommendations || [],
              organicMatterSuggestions: latest.organicMatterSuggestions || '',
              cropSpecificAdvice: latest.cropSpecificAdvice || '',
              isDemo: false,
              source: latest.source || 'User Soil Test',
              createdAt: latest.createdAt,
            });
          } else {
            // No soil test recorded for this farm yet -> display clean unprovided state (NEVER demo measurements)
            setSoilReport({
              ...EMPTY_SOIL_REPORT,
              soilType: activeFarm.soilType || currentFarm.soilType || '',
              isDemo: false,
              source: 'User Soil Test',
            });
          }
        })
        .catch((err) => {
          console.warn('Could not fetch soil records from Firestore:', err);
          if (isMounted) {
            setSoilReport({
              ...EMPTY_SOIL_REPORT,
              soilType: activeFarm.soilType || currentFarm.soilType || '',
              isDemo: false,
              source: 'User Soil Test',
            });
          }
        });
    } else if (!user) {
      // In guest / demo mode, load demo report
      setSoilReport(getLocalizedSoilReport(language, currentFarm));
    }
    return () => {
      isMounted = false;
    };
  }, [user?.uid, activeFarm?.id, activeFarm?.soilType, activeCountry, language]);

  const handleLanguageChange = (newLang: Language) => {
    setLanguage(newLang);
    try {
      localStorage.setItem('khetinexus_language', newLang);
      localStorage.setItem('khetinexus_language_selected', 'true');
    } catch (e) {
      console.error(e);
    }

    // When switching language, immediately localize current demo advisory, diagnoses, and soil report
    setAdvisory((prev) => (prev.isDemo ? getLocalizedInitialAdvisory(newLang, currentFarm) : prev));
    setSoilReport((prev) => (prev.isDemo ? getLocalizedSoilReport(newLang, currentFarm) : prev));
    setDiagnoses((prev) => {
      const allDemo = prev.every((d) => d.isDemo);
      return allDemo ? getLocalizedInitialDiagnoses(newLang) : prev;
    });
  };

  const t = getTranslation(language);

  // Core Data States
  const [advisory, setAdvisory] = useState<AdvisoryResult>(() =>
    getLocalizedInitialAdvisory(language, currentFarm)
  );
  const [diagnoses, setDiagnoses] = useState<DiagnosisResult[]>(() =>
    getLocalizedInitialDiagnoses(language)
  );
  const [soilReport, setSoilReport] = useState<SoilReport>(() =>
    getLocalizedSoilReport(language, currentFarm)
  );
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

  // Fetch real-time weather telemetry for current farm
  const fetchWeatherForCurrentFarm = (forceRefresh = false) => {
    const controller = new AbortController();
    const activeFarmSnapshot = {
      id: currentFarm.id,
      lat: currentFarm.coordinates?.lat ?? currentFarm.latitude,
      lon: currentFarm.coordinates?.lng ?? currentFarm.longitude,
      country: currentFarm.country,
    };

    fetchLiveWeatherPipeline(currentFarm, forceRefresh)
      .then((obs) => {
        if (obs) {
          // Verify active farm hasn't changed (UID / coordinates / ID match)
          if (
            currentFarm.id !== activeFarmSnapshot.id ||
            (currentFarm.coordinates?.lat ?? currentFarm.latitude) !== activeFarmSnapshot.lat ||
            (currentFarm.coordinates?.lng ?? currentFarm.longitude) !== activeFarmSnapshot.lon
          ) {
            return; // Ignore stale response for previous farm
          }

          setWeather({
            location: obs.locationName || `${currentFarm.location}, ${currentFarm.stateRegion || currentFarm.country}`,
            country: currentFarm.country,
            latitude: obs.latitude,
            longitude: obs.longitude,
            timezone: obs.timezone,
            utcOffsetSeconds: obs.utcOffsetSeconds,
            currentLocalTime: obs.currentLocalTime,
            currentLocalHour: obs.currentLocalHour,
            temperature: `${Math.round(obs.temperature)}°C`,
            tempValue: obs.temperature,
            humidity: `${Math.round(obs.humidity)}%`,
            humidityValue: obs.humidity,
            rainfall: `${obs.rainfallMm} mm`,
            rainfallMm: obs.rainfallMm,
            wind: `${Math.round(obs.windSpeedKmh)} km/h`,
            windSpeedKmh: obs.windSpeedKmh,
            condition: obs.condition,
            conditionCode: obs.conditionCode,
            forecast: (obs.dailyForecast && obs.dailyForecast.length > 0 ? obs.dailyForecast : obs.forecast || []).map((f: any) => ({
              day: f.day,
              date: f.date,
              temp: typeof f.tempMax === 'number' ? `${Math.round(f.tempMax)}°C` : `${f.temp ?? f.tempMax ?? 0}`,
              tempMax: typeof f.tempMax === 'number' ? Math.round(f.tempMax) : undefined,
              tempMin: typeof f.tempMin === 'number' ? Math.round(f.tempMin) : undefined,
              condition: f.condition,
              conditionCode: f.conditionCode,
              rainProb: f.rainProb,
              rainfallMm: f.rainfallMm,
              windSpeedKmh: f.windSpeedKmh,
            })),
            hourlyForecast: obs.hourlyForecast || [],
            dailyForecast: (obs.dailyForecast && obs.dailyForecast.length > 0 ? obs.dailyForecast : obs.forecast || []).map((f: any) => ({
              day: f.day,
              date: f.date,
              tempMax: typeof f.tempMax === 'number' ? Math.round(f.tempMax) : 0,
              tempMin: typeof f.tempMin === 'number' ? Math.round(f.tempMin) : 0,
              temp: typeof f.tempMax === 'number' ? `${Math.round(f.tempMax)}°C` : `${f.temp ?? f.tempMax ?? 0}`,
              rainfallMm: typeof f.rainfallMm === 'number' ? f.rainfallMm : 0,
              rainProb: f.rainProb,
              windSpeedKmh: typeof f.windSpeedKmh === 'number' ? f.windSpeedKmh : 0,
              condition: f.condition,
              conditionCode: f.conditionCode,
            })),
            isDemo: obs.status !== 'ACTIVE',
            notice: obs.status === 'ACTIVE'
              ? 'Real-time telemetry retrieved via Open-Meteo & IMD operational engine'
              : obs.statusMessage || 'Live weather telemetry temporarily unavailable',
            status: obs.status,
            statusMessage: obs.statusMessage,
            fetchedAt: obs.fetchedAt,
            observationDate: obs.observationDate,
            provider: obs.provider,
            datasetName: obs.datasetName,
            freshness: obs.freshness,
          });
        }
      })
      .catch((err) => {
        console.warn('Weather fetch error:', err);
      });
  };

  // Automatically fetch live weather whenever farm changes or coordinates change
  useEffect(() => {
    fetchWeatherForCurrentFarm(false);
  }, [
    currentFarm.id,
    currentFarm.location,
    currentFarm.country,
    currentFarm.latitude,
    currentFarm.longitude,
    currentFarm.coordinates?.lat,
    currentFarm.coordinates?.lng,
  ]);

  // Update farm profile & save to storage
  const handleSaveProfile = (updated: FarmProfile) => {
    setCurrentFarm(updated);
    if (!user) {
      setDemoFarmProfile(updated);
    }
  };

  // Switch farm preset
  const handleSelectFarmPreset = (preset: FarmProfile) => {
    handleSaveProfile(preset);
    setAdvisory((prev) => (prev.isDemo ? getLocalizedInitialAdvisory(language, preset) : prev));
    setSoilReport((prev) => (prev.isDemo ? getLocalizedSoilReport(language, preset) : prev));
  };

  // Handle advisory update & Firestore persistence
  const handleUpdateAdvisory = async (newAdv: AdvisoryResult): Promise<void> => {
    setAdvisory(newAdv);
    if (user && !newAdv.isDemo) {
      try {
        await saveAdvisoryHistory(user.uid, {
          farmId: activeFarm?.id,
          farmName: activeFarm?.farmName,
          countryCode: activeCountry,
          crop: currentFarm.crop,
          language,
          summary: newAdv.summary,
          todayAction: newAdv.todayAction,
          waterManagement: newAdv.waterManagement,
          soilHealth: newAdv.soilHealth,
          cropProtection: newAdv.cropProtection,
          regenerativePractice: newAdv.regenerativePractice,
          next7Days: newAdv.next7Days,
        });
      } catch (err) {
        console.warn('Could not persist advisory to Firestore:', err);
        throw err;
      }
    }
  };

  // Add new crop doctor diagnosis & Firestore persistence
  const handleAddDiagnosis = async (newDiag: DiagnosisResult): Promise<void> => {
    setDiagnoses([newDiag, ...diagnoses]);
    if (user && activeFarm?.id && !newDiag.isDemo) {
      const payload = { ...newDiag, farmId: activeFarm.id, countryCode: activeCountry } as any;
      delete payload.id;
      delete payload.createdAt;
      
      try {
        await saveDiagnosisRecord(user.uid, activeFarm.id, payload);
      } catch (err) {
        console.warn('Could not persist diagnosis to Firestore:', err);
        throw err;
      }
    }
  };

  // Handle soil report update & Firestore persistence
  const handleUpdateSoilReport = async (newReport: SoilReport): Promise<void> => {
    setSoilReport(newReport);
    if (user?.uid && activeFarm?.id && !newReport.isDemo) {
      const payload = { ...newReport, farmId: activeFarm.id, countryCode: activeCountry } as any;
      delete payload.id;
      delete payload.createdAt;

      try {
        await saveSoilRecord(user.uid, activeFarm.id, payload, activeCountry);
      } catch (err) {
        console.warn('Could not persist soil record to Firestore:', err);
        throw err;
      }
    }
  };

  // 1. Initial Authentication & Session Restoration Loading State
  if (loadingAuth) {
    return (
      <div className="min-h-screen bg-[#F4F7F2] dark:bg-[#06120a] flex flex-col items-center justify-center p-4 selection:bg-emerald-200 transition-colors">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-600 to-green-800 flex items-center justify-center text-white shadow-xl mb-4 animate-pulse">
          <Sprout className="w-8 h-8 text-emerald-100" />
        </div>
        <div className="flex items-center gap-2 text-emerald-950 dark:text-emerald-100 font-heading font-extrabold text-xl mb-2">
          <span>
            KhetiNexus <span className="text-emerald-600 dark:text-emerald-400">AI</span>
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-stone-600 dark:text-stone-300 bg-white dark:bg-stone-900 border border-[#E0E7DC] dark:border-stone-800 px-4 py-2 rounded-full shadow-2xs">
          <Loader2 className="w-4 h-4 animate-spin text-emerald-600 dark:text-emerald-400" />
          <span>{t.loadingIntelligence}</span>
        </div>
      </div>
    );
  }

  // 2. Unauthenticated and NOT in explicit Guest Preview: Render Login / Welcome Page
  if (!user && !isGuestMode) {
    return (
      <>
        <LoginWelcomeView
          currentLanguage={language}
          onLanguageChange={handleLanguageChange}
        />
        <AuthModal currentLanguage={language} />
        <PrivacyModal currentLanguage={language} />
      </>
    );
  }

  const unifiedContext = createUnifiedFarmContext(currentFarm, soilReport, weather);

  return (
    <AppShell
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      currentFarm={currentFarm}
      language={language}
      setLanguage={handleLanguageChange}
      hasGeminiKey={isGeminiActive ?? false}
    >
      {/* Guest Mode Notice Banner */}
      {!user && isGuestMode && (
        <div
          id="guest-mode-banner"
          className="bg-emerald-900 text-emerald-100 px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-2 border-b border-emerald-950 sticky top-14 sm:top-16 z-30 shadow-xs"
        >
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-emerald-300 shrink-0" />
            <span className="font-medium">{t.guestBannerNotice}</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              id="guest-banner-signin-btn"
              onClick={() => {
                setAuthModalMode('login');
                setAuthModalOpen(true);
              }}
              className="bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold px-3 py-1 rounded-lg text-xs transition-colors shadow-2xs cursor-pointer"
            >
              {t.guestSignInPrompt}
            </button>
            <button
              type="button"
              id="guest-banner-exit-btn"
              onClick={exitGuestMode}
              className="text-emerald-300 hover:text-white underline text-xs transition-colors font-medium cursor-pointer"
            >
              {t.guestExitBtn}
            </button>
          </div>
        </div>
      )}

      {/* Main View Router */}
      <div className="w-full">
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
            onUpdateAdvisory={handleUpdateAdvisory}
            language={language}
            soilReport={soilReport}
            weather={weather}
          />
        )}

        {activeTab === 'crop-doctor' && (
          <CropDoctorView
            currentFarm={currentFarm}
            diagnoses={diagnoses}
            onAddDiagnosis={handleAddDiagnosis}
            language={language}
            onLanguageChange={setLanguage}
            isLoggedIn={!!user}
            onOpenAuth={() => {
              setAuthModalMode('login');
              setAuthModalOpen(true);
            }}
          />
        )}

        {activeTab === 'weather' && (
          <WeatherView
            weather={weather}
            currentFarm={currentFarm}
            language={language}
            onRefreshWeather={() => fetchWeatherForCurrentFarm(true)}
          />
        )}

        {activeTab === 'soil-health' && (
          <SoilHealthView
            currentFarm={currentFarm}
            soilReport={soilReport}
            onUpdateSoilReport={handleUpdateSoilReport}
            onNavigateToProfile={() => setActiveTab('farm-profile')}
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

        {activeTab === 'geospatial-intel' && (
          <GeospatialIntelligenceView context={unifiedContext} />
        )}

        {activeTab === 'data-sources' && (
          <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6">
            <DataSourcesView />
          </div>
        )}
      </div>

      {/* Cloud & Authentication Modals */}
      <AuthModal currentLanguage={language} />
      <FarmModal currentLanguage={language} />
      <PrivacyModal currentLanguage={language} />
      <AccessRequestModal />
      <CountrySelectionModal
        isOpen={countryModalOpen}
        onClose={() => setCountryModalOpen(false)}
      />
    </AppShell>
  );
}

export default function App() {
  const [language, setLanguage] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('khetinexus_language');
      if (saved && typeof saved === 'string' && saved.trim() !== '') {
        return saved as Language;
      }
    } catch (e) {
      console.error(e);
    }
    return 'en';
  });

  return (
    <ThemeProvider>
      <CountryProvider initialLanguage={language} onLanguageChange={setLanguage}>
        <PermissionProvider>
          <AuthProvider currentLanguage={language}>
            <KhetiNexusMain language={language} setLanguage={setLanguage} />
          </AuthProvider>
        </PermissionProvider>
      </CountryProvider>
    </ThemeProvider>
  );
}
