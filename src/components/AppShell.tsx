import React, { useState, useRef, useEffect } from 'react';
import {
  Sprout,
  Home,
  LayoutDashboard,
  UserCheck,
  Sparkles,
  Stethoscope,
  CloudSun,
  FlaskConical,
  Layers,
  Globe2,
  Menu,
  X,
  Languages,
  ChevronDown,
  ChevronRight,
  Sun,
  Moon,
  LogIn,
  LogOut,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Activity,
  Compass,
  MapPin,
  Satellite,
  Database,
  ArrowUpRight,
  Mic,
  MoreVertical,
} from 'lucide-react';
import { ActiveTab, FarmProfile, Language, WeatherData, SoilReport, AdvisoryResult, DiagnosisResult } from '../types';
import { getTranslation, INDIA_LANGUAGES } from '../i18n/translations';
import { localizeCountry, localizeCrop, normalizeLang } from '../i18n/dataTranslations';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useCountry } from '../context/CountryContext';
import { FarmSwitcher } from './FarmSwitcher';
import { VoiceAgent } from './VoiceAgent';
import { PWAInstallButton } from './PWAInstallButton';
import { OfflineIndicator } from './OfflineIndicator';

interface AppShellProps {
  children: React.ReactNode;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  currentFarm: FarmProfile;
  language: Language;
  setLanguage: (lang: Language) => void;
  hasGeminiKey: boolean;
  weather?: WeatherData | null;
  soilReport?: SoilReport | null;
  advisory?: AdvisoryResult | null;
  diagnoses?: DiagnosisResult[];
}

export const AppShell: React.FC<AppShellProps> = ({
  children,
  activeTab,
  setActiveTab,
  currentFarm,
  language,
  setLanguage,
  hasGeminiKey,
  weather,
  soilReport,
  advisory,
  diagnoses,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileUtilsOpen, setMobileUtilsOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [statusTooltipOpen, setStatusTooltipOpen] = useState(false);
  const [voiceLiveOpen, setVoiceLiveOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    try {
      const saved = localStorage.getItem('khetinexus_sidebar_collapsed');
      if (saved !== null) return saved === 'true';
      // Default to collapsed on tablet-sized screens (768px-1024px)
      if (typeof window !== 'undefined' && window.innerWidth >= 768 && window.innerWidth < 1024) {
        return true;
      }
      return false;
    } catch {
      return false;
    }
  });

  const toggleSidebar = () => {
    setSidebarCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('khetinexus_sidebar_collapsed', String(next));
      } catch {
        // Ignore storage errors
      }
      return next;
    });
  };

  const langDropdownRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const mobileUtilsRef = useRef<HTMLDivElement>(null);

  const t = getTranslation(language);
  const { theme, toggleTheme } = useTheme();
  const { countryAdapter } = useCountry();

  const {
    user,
    logout,
    setAuthModalOpen,
    setAuthModalMode,
    setPrivacyModalOpen,
    activeFarm,
  } = useAuth();

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
        setLangDropdownOpen(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
      if (statusRef.current && !statusRef.current.contains(event.target as Node)) {
        setStatusTooltipOpen(false);
      }
      if (mobileUtilsRef.current && !mobileUtilsRef.current.contains(event.target as Node)) {
        setMobileUtilsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Lock body scroll and close open dropdowns when mobile menu opens
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      setLangDropdownOpen(false);
      setUserDropdownOpen(false);
      setStatusTooltipOpen(false);
      setMobileUtilsOpen(false);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Handle Escape key to close navigation drawer or open popups
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
        setLangDropdownOpen(false);
        setUserDropdownOpen(false);
        setStatusTooltipOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const currentLangObj = countryAdapter.supportedLanguages.find((l) => l.code === language || (l as any).id === language) || countryAdapter.supportedLanguages[0];

  // PRIMARY NAVIGATION (9 canonical items - NO standalone geospatial or data sources)
  const navItems = [
    { id: 'landing' as ActiveTab, label: t.navHome || 'Home', icon: Home },
    { id: 'dashboard' as ActiveTab, label: t.navDashboard || 'Dashboard', icon: LayoutDashboard },
    { id: 'farm-profile' as ActiveTab, label: t.navFarmProfile || 'Farm Profile', icon: UserCheck },
    { id: 'ai-advisor' as ActiveTab, label: t.navAdvisor || 'AI Farm Advisory', icon: Sparkles },
    { id: 'crop-doctor' as ActiveTab, label: t.navCropDoctor || 'Crop Doctor', icon: Stethoscope },
    { id: 'weather' as ActiveTab, label: t.navWeather || 'Weather', icon: CloudSun },
    { id: 'soil-health' as ActiveTab, label: t.navSoilHealth || 'Soil Health', icon: FlaskConical },
    { id: 'regenerative' as ActiveTab, label: t.navRegenerative || 'Regenerative Farming', icon: Layers },
    { id: 'agrin-network' as ActiveTab, label: t.navAgriN || 'AgriN Network', icon: Globe2 },
  ];

  const getVoiceDrawerTitle = (lang: string) => {
    const norm = normalizeLang(lang);
    if (norm === 'te') return 'వాయిస్ లైవ్ సహాయకుడు';
    if (norm === 'hi') return 'वॉइस लाइव सहायक';
    if (norm === 'ta') return 'குரல் நேரடி வழிகாட்டி';
    if (norm === 'kn') return 'ಧ್ವನಿ ಲೈವ್ ಮಾರ್ಗದರ್ಶಿ';
    if (norm === 'ml') return 'വോയ്സ് ലൈവ് സഹായി';
    if (norm === 'mr') return 'व्हॉईस लाईव्ह सहाय्यक';
    if (norm === 'gu') return 'વોઇસ લાઇવ સહાયક';
    if (norm === 'bn') return 'ভয়েস লাইভ সহায়ক';
    if (norm === 'pa') return 'ਵੌਇਸ ਲਾਈਵ ਸਹਾਇਕ';
    if (norm === 'or') return 'ଭଏସ୍ ଲାଇଭ୍ ସହାୟକ';
    if (norm === 'as') return 'ভইচ লাইভ সহায়ক';
    if (norm === 'ur') return 'وائس لائیو ساتھی';
    if (norm === 'ar') return 'المساعد الصوتي المباشر';
    if (norm === 'es') return 'Compañero de Voz en Vivo';
    if (norm === 'fr') return 'Compagnon Vocal en Direct';
    if (norm === 'pt') return 'Companheiro de Voz ao Vivo';
    if (norm === 'ru') return 'Голосовой помощник';
    if (norm === 'zh') return '语音实时助手';
    return 'Voice Live Companion';
  };

  const getVoiceDrawerIntro = (lang: string) => {
    const norm = normalizeLang(lang);
    if (norm === 'te') return 'KhetiNexus వాయిస్ లైవ్‌కు స్వాగతం. మైక్ నొక్కి మీ పొలం ప్రొఫైల్, వాతావరణ అంచనాలు, నేల ఆరోగ్యం లేదా పంట తెగుళ్ల గురించి ఏదైనా అడగండి.';
    if (norm === 'hi') return 'KhetiNexus वॉइस लाइव में आपका स्वागत है। माइक पर टैप करें और अपने खेत, मौसम पूर्वानुमान, मिट्टी के स्वास्थ्य या फसल रोगों के बारे में कोई भी सवाल पूछें।';
    if (norm === 'ta') return 'KhetiNexus குரல் நேரடிக்கு வரவேற்கிறோம். மைக்கை அழுத்தி உங்கள் பண்ணை விவரம், வானிலை முன்னறிவிப்பு, மண் வளம் அல்லது பயிர் நோய்கள் குறித்து கேளுங்கள்.';
    if (norm === 'kn') return 'KhetiNexus ಧ್ವನಿ ಲೈವ್‌ಗೆ ಸುಸ್ವಾಗತ. ಮೈಕ್ ಟ್ಯಾಪ್ ಮಾಡಿ ನಿಮ್ಮ ಕೃಷಿ ವಿವರ, ಹವಾಮಾನ ಮುನ್ಸೂಚನೆ, ಮಣ್ಣಿನ ಆರೋಗ್ಯ ಅಥವಾ ಬೆಳೆ ರೋಗಗಳ ಬಗ್ಗೆ ಕೇಳಿ.';
    if (norm === 'ml') return 'KhetiNexus വോയ്സ് ലൈവിലേക്ക് സ്വാഗതം. മൈക്ക് ടാപ്പ് ചെയ്ത് നിങ്ങളുടെ കൃഷിയിടം, കാലാവസ്ഥ, മണ്ണ് ആരോഗ്യം അല്ലെങ്കിൽ വിള രോഗങ്ങൾ എന്നിവയെക്കുറിച്ച് ചോദിക്കുക.';
    if (norm === 'mr') return 'KhetiNexus व्हॉईस लाईव्हमध्ये आपले स्वागत आहे. माइकवर टॅप करा आणि आपल्या शेताची माहिती, हवामान अंदाज, मातीचे आरोग्य किंवा पीक रोगांविषयी काहीही विचारा.';
    if (norm === 'gu') return 'KhetiNexus વોઇસ લાઇવમાં આપનું સ્વાગત છે. માઇક પર ટેપ કરો અને તમારા ખેતર, હવામાન, જમીન સ્વાસ્થ્ય અથવા પાકના રોગો વિશે પૂછો.';
    if (norm === 'bn') return 'KhetiNexus ভয়েস লাইভ-এ স্বাগতম। মাইকে ট্যাপ করুন এবং আপনার জমি, আবহাওয়ার পূর্বাভাস, মাটির স্বাস্থ্য বা ফসলের রোগ সম্পর্কে জিজ্ঞাসা করুন।';
    if (norm === 'pa') return 'KhetiNexus ਵੌਇਸ ਲਾਈਵ ਵਿੱਚ ਤੁਹਾਡਾ ਸਵਾਗਤ ਹੈ। ਮਾਈਕ ਦਬਾਓ ਅਤੇ ਆਪਣੇ ਖੇਤ, ਮੌਸਮ, ਮਿੱਟੀ ਦੀ ਸਿਹਤ ਜਾਂ ਫਸਲੀ ਬਿਮਾਰੀਆਂ ਬਾਰੇ ਕੁਝ ਵੀ ਪੁੱਛੋ।';
    if (norm === 'or') return 'KhetiNexus ଭଏସ୍ ଲାଇଭ୍ କୁ ସ୍ୱାଗତ। ମାଇକ୍ ଟ୍ୟାପ୍ କରନ୍ତୁ ଏବଂ ନିଜ ଚାଷ, ପାଣିପାଗ, ମାଟି ସ୍ୱାସ୍ଥ୍ୟ କିମ୍ବା ଫସଲ ରୋଗ ବିଷୟରେ ପଚାରନ୍ତୁ।';
    if (norm === 'as') return 'KhetiNexus ভইচ লাইভলৈ স্বাগতম। মাইক টিপি আপোনাৰ পথাৰ, বতৰৰ আগজাননী, মাটিৰ স্বাস্থ্য বা শস্যৰ ৰোগৰ বিষয়ে সুধিব পাৰে।';
    if (norm === 'ur') return 'KhetiNexus وائس لائیو میں خوش آمدید۔ مائیک کو دبائیں اور اپنے کھیت، موسم کی پیش گوئی، مٹی کی صحت یا فصل کی بیماریوں کے بارے میں کوئی بھی سوال پوچھیں۔';
    return 'Welcome to KhetiNexus Voice Live. Tap the mic and ask any question about your farm profile, weather forecasts, soil health, or crop diseases.';
  };

  const getActiveTabTitle = () => {
    const item = navItems.find((n) => n.id === activeTab);
    return item ? item.label : 'Farm Intelligence';
  };

  return (
    <div className="min-h-screen flex w-full max-w-full min-w-0 overflow-x-hidden bg-[#f7f9f5] dark:bg-[#07130b] text-stone-900 dark:text-stone-100 font-sans transition-colors selection:bg-emerald-200 dark:selection:bg-emerald-900">
      {/* DESKTOP COMPACT LEFT NAVIGATION SIDEBAR WITH LOGO TOGGLE - LOCKED TO VIEWPORT */}
      <aside
        id="app-sidebar"
        aria-label="Application Navigation Sidebar"
        className={`hidden md:flex flex-col justify-between fixed top-0 left-0 bottom-0 h-screen bg-[#0e1f14] dark:bg-[#08150c] text-stone-200 border-r border-emerald-950/80 dark:border-stone-800/80 transition-all duration-300 ease-in-out z-40 select-none overscroll-y-contain [overscroll-behavior-y:contain] ${
          sidebarCollapsed ? 'w-20 min-w-[80px] max-w-[80px]' : 'w-64 min-w-[256px] max-w-[256px]'
        }`}
      >
        {/* Top Section: Interactive Logo Header + Independent Scrolling Nav */}
        <div className="flex flex-col min-h-0 flex-1 overflow-x-hidden">
          {/* Logo Toggle Header (Clicking Logo toggles sidebar expansion) */}
          <div className="p-3.5 border-b border-emerald-950/70 dark:border-stone-800/70 shrink-0 flex items-center justify-center">
            <button
              type="button"
              id="sidebar-brand-btn"
              onClick={toggleSidebar}
              aria-label={sidebarCollapsed ? 'Expand navigation' : 'Collapse navigation'}
              title={sidebarCollapsed ? 'Expand navigation' : 'Collapse navigation'}
              className={`w-full flex items-center gap-3 p-1.5 rounded-2xl hover:bg-emerald-950/60 dark:hover:bg-stone-800/60 transition-all cursor-pointer group text-left ${
                sidebarCollapsed ? 'justify-center p-0' : ''
              }`}
            >
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-green-700 flex items-center justify-center text-white shadow-md shadow-emerald-950/50 shrink-0 group-hover:scale-105 transition-transform">
                <Sprout className="w-5.5 h-5.5 text-white" />
              </div>
              {!sidebarCollapsed && (
                <div className="min-w-0 flex-1 overflow-hidden whitespace-nowrap">
                  <div className="flex items-center gap-1.5">
                    <span className="font-heading font-black text-base text-white tracking-tight truncate">
                      KhetiNexus<span className="text-emerald-400 font-extrabold">-AI</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider truncate">
                      {t.tagline || 'AI for Smarter Farming'}
                    </span>
                  </div>
                </div>
              )}
            </button>
          </div>

          {/* Nav Items List with Independent Vertical Scrolling */}
          <nav
            id="sidebar-nav-container"
            className="p-3 space-y-1.5 overflow-y-auto overflow-x-hidden min-h-0 flex-1 relative z-10 no-scrollbar overscroll-y-contain [overscroll-behavior-y:contain]"
          >
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <div key={item.id} className="relative group flex justify-center w-full min-w-0">
                  <button
                    type="button"
                    id={`sidebar-nav-${item.id}`}
                    onClick={() => setActiveTab(item.id)}
                    aria-label={item.label}
                    title={sidebarCollapsed ? item.label : undefined}
                    className={`flex items-center gap-3 transition-all cursor-pointer ${
                      sidebarCollapsed
                        ? 'w-11 h-11 min-w-[44px] max-w-[44px] justify-center rounded-xl p-0 my-0.5'
                        : 'w-full px-3 py-2.5 rounded-xl text-xs font-semibold'
                    } ${
                      isActive
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/40 font-bold'
                        : 'text-stone-300 hover:text-white hover:bg-emerald-950/50 dark:hover:bg-stone-800/50'
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-transform ${
                        isActive ? 'text-white scale-110' : 'text-emerald-400/90 group-hover:text-emerald-300'
                      }`}
                    />
                    {!sidebarCollapsed && (
                      <span className="truncate min-w-0 flex-1 text-left whitespace-nowrap overflow-hidden">
                        {item.label}
                      </span>
                    )}
                  </button>

                  {/* Tooltip on collapsed state - Fixed position so it never expands layout or causes scrollWidth overflow */}
                  {sidebarCollapsed && (
                    <div className="fixed left-[88px] px-3 py-1.5 bg-stone-900 border border-emerald-900 text-white text-xs font-semibold rounded-xl shadow-xl whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
                      {item.label}
                      {isActive && (
                        <span className="ml-1.5 px-1.5 py-0.5 rounded bg-emerald-700 text-[10px] font-bold">
                          Active
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        {/* Bottom Sidebar Farm Status Card */}
        <div className="p-2.5 border-t border-emerald-950/70 dark:border-stone-800/70 space-y-1.5 shrink-0 relative z-30">
          {!sidebarCollapsed ? (
            <FarmSwitcher currentLanguage={language} variant="sidebar" forceClose={mobileMenuOpen} />
          ) : (
            <button
              type="button"
              id="sidebar-collapsed-farm-btn"
              className="w-11 h-11 mx-auto rounded-xl bg-emerald-950/60 border border-emerald-900/60 flex items-center justify-center text-emerald-400 text-xs font-bold cursor-pointer hover:bg-emerald-900 transition-colors"
              title={`Active Farm: ${currentFarm.name} (${currentFarm.location})`}
              onClick={() => setActiveTab('farm-profile')}
              aria-label="View Active Farm Profile"
            >
              <Sprout className="w-5 h-5" />
            </button>
          )}

          {/* Telemetry Status Line */}
          <div
            className={`flex items-center gap-2 text-[11px] text-stone-400 ${
              sidebarCollapsed ? 'justify-center px-0' : 'px-2'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full shrink-0 ${
                hasGeminiKey ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
              }`}
            />
            {!sidebarCollapsed && (
              <span className="truncate text-[10px]">
                {hasGeminiKey ? 'Gemini 3.1 Live Engine' : 'Offline / Demo Telemetry'}
              </span>
            )}
          </div>
        </div>
      </aside>

      {/* MAIN LAYOUT WRAPPER - SHIFTS DYNAMICALLY BASED ON VIEWPORT-LOCKED SIDEBAR */}
      <div
        className={`flex-1 flex flex-col min-w-0 min-h-screen max-w-full overflow-x-hidden transition-[margin-left] duration-300 ease-in-out ${
          sidebarCollapsed ? 'md:ml-20' : 'md:ml-64'
        }`}
      >
        {/* TOP CONTEXTUAL HEADER */}
        <header className={`fixed top-0 right-0 z-40 bg-white/95 dark:bg-[#07130b]/95 backdrop-blur-md border-b border-stone-200/80 dark:border-stone-800/80 shadow-2xs transition-all duration-300 ease-in-out left-0 ${
          sidebarCollapsed ? 'md:left-20' : 'md:left-64'
        }`}>
          <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-3">
            {/* Left Header: Mobile Logo Toggle + Breadcrumb Title */}
            <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0 min-w-0">
              <button
                type="button"
                id="mobile-sidebar-toggle-btn"
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                className="md:hidden flex items-center gap-1.5 p-1 rounded-xl text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800/80 cursor-pointer focus:outline-none transition-colors shrink-0"
                aria-label={mobileMenuOpen ? 'Close navigation' : 'Open navigation'}
                title={mobileMenuOpen ? 'Close navigation' : 'Open navigation'}
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-green-700 flex items-center justify-center text-white shadow-xs shrink-0">
                  <Sprout className="w-4 h-4 text-white" />
                </div>
                <span className="font-heading font-black text-xs sm:text-sm text-stone-900 dark:text-stone-100 tracking-tight whitespace-nowrap shrink-0">
                  KhetiNexus<span className="text-emerald-600 dark:text-emerald-400 font-extrabold">-AI</span>
                </span>
              </button>

              <div className="hidden sm:flex items-center gap-1.5 sm:gap-2 min-w-max shrink-0">
                <span className="text-xs font-semibold text-stone-400 dark:text-stone-500 whitespace-nowrap shrink-0">
                  KhetiNexus-AI
                </span>
                <span className="text-stone-300 dark:text-stone-700 shrink-0">/</span>
                <h1 className="font-heading font-bold text-sm sm:text-base text-stone-900 dark:text-stone-100 whitespace-nowrap truncate min-w-0">
                  {getActiveTabTitle()}
                </h1>
              </div>

              <div className="flex sm:hidden items-center gap-1 min-w-0">
                <span className="text-stone-300 dark:text-stone-700 shrink-0">/</span>
                <span className="font-heading font-bold text-xs text-stone-700 dark:text-stone-300 whitespace-nowrap truncate max-w-[100px] xs:max-w-[140px]">
                  {getActiveTabTitle()}
                </span>
              </div>
            </div>

            {/* Right Header Utility Controls */}
            <div className="flex items-center gap-1 sm:gap-2.5 shrink-0">
              {/* AI Engine Status Pill */}
              <div className="relative" ref={statusRef}>
                <button
                  type="button"
                  id="topbar-ai-status-pill"
                  onClick={() => setStatusTooltipOpen(!statusTooltipOpen)}
                  className={`flex items-center gap-1 px-1.5 sm:px-2.5 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[10px] sm:text-[11px] font-semibold border transition-all cursor-pointer ${
                    hasGeminiKey
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
                      : 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800'
                  }`}
                  title="AI Engine Status"
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      hasGeminiKey ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                    }`}
                  />
                  <span className="hidden sm:inline whitespace-nowrap">
                    {hasGeminiKey ? 'Gemini AI' : 'Demo'}
                  </span>
                </button>

                {statusTooltipOpen && (
                  <div className="absolute right-0 mt-2 w-64 sm:w-72 max-w-[calc(100vw-1.5rem)] bg-white dark:bg-stone-900 rounded-2xl shadow-xl border border-stone-200 dark:border-stone-800 p-3.5 z-50 text-xs animate-fade-in">
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-stone-100 dark:border-stone-800">
                      <span className="font-bold text-stone-900 dark:text-stone-100">
                        {t.aiSecurityStatus || 'AI Intelligence Engine'}
                      </span>
                      <button
                        type="button"
                        onClick={() => setStatusTooltipOpen(false)}
                        className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    {hasGeminiKey ? (
                      <div className="space-y-1.5 text-stone-600 dark:text-stone-300">
                        <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-semibold">
                          <CheckCircle2 className="w-4 h-4 shrink-0" />
                          <span>{t.geminiMultimodalActive || 'Gemini 3.1 & 3.8 Multimodal Active'}</span>
                        </div>
                        <p className="text-[11px] leading-relaxed text-stone-500 dark:text-stone-400">
                          {t.liveGeminiDesc ||
                            'Real-time reasoning connected with satellite and weather grounding.'}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-1.5 text-stone-600 dark:text-stone-300">
                        <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400 font-semibold">
                          <AlertTriangle className="w-4 h-4 shrink-0" />
                          <span>{t['shell.localDemoMode'] || 'Local Demo Mode'}</span>
                        </div>
                        <p className="text-[11px] leading-relaxed text-stone-500 dark:text-stone-400">
                          {t.offlineDemoDesc ||
                            'Sample agronomic datasets active. Connect API key for live inference.'}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* PWA Install Button */}
              <PWAInstallButton variant="navbar" />

              {/* Voice Live Toggle Button */}
              <button
                type="button"
                id="topbar-voice-live-btn"
                onClick={() => setVoiceLiveOpen(true)}
                className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center p-0 transition-all cursor-pointer shadow-xs shrink-0 ${
                  voiceLiveOpen
                    ? 'bg-emerald-700 text-white ring-2 ring-emerald-400 ring-offset-2 dark:ring-offset-[#07130b]'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white border border-emerald-500/80'
                }`}
                title="Voice Live Assistant"
                aria-label="Voice Live Assistant"
              >
                <Mic className="w-4 h-4 text-white shrink-0" />
              </button>

              {/* Mobile Collapsed Utility Controls (Account, Language, Light/Dark) */}
              <div className="relative sm:hidden" ref={mobileUtilsRef}>
                <button
                  type="button"
                  id="mobile-header-collapse-btn"
                  onClick={() => setMobileUtilsOpen((prev) => !prev)}
                  aria-label="Account, Language and Theme settings"
                  title="Settings & Account"
                  className={`w-8 h-8 rounded-lg border transition-colors cursor-pointer flex items-center justify-center shrink-0 ${
                    mobileUtilsOpen
                      ? 'bg-emerald-50 dark:bg-emerald-950/80 border-emerald-500 text-emerald-700 dark:text-emerald-300'
                      : 'bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:text-emerald-600 dark:hover:text-emerald-400'
                  }`}
                >
                  {user ? (
                    user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={user.displayName || 'User'}
                        referrerPolicy="no-referrer"
                        className="w-5 h-5 rounded-full object-cover border border-emerald-600 shrink-0"
                      />
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                        {(user.displayName || user.email || 'U')[0].toUpperCase()}
                      </div>
                    )
                  ) : (
                    <MoreVertical className="w-4 h-4" />
                  )}
                </button>

                {mobileUtilsOpen && (
                  <div className="absolute right-0 mt-2 w-64 max-w-[calc(100vw-1.5rem)] bg-white dark:bg-stone-900 rounded-2xl shadow-xl border border-stone-200 dark:border-stone-800 p-3 z-50 text-xs animate-fade-in space-y-3">
                    {/* 1. Account Section */}
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 dark:text-stone-500 block mb-1.5">
                        {t['shell.account'] || 'Account'}
                      </span>
                      {user ? (
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2 p-2 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-100 dark:border-stone-800">
                            {user.photoURL ? (
                              <img
                                src={user.photoURL}
                                alt={user.displayName || 'User'}
                                referrerPolicy="no-referrer"
                                className="w-7 h-7 rounded-full object-cover border border-emerald-600 shrink-0"
                              />
                            ) : (
                              <div className="w-7 h-7 rounded-full bg-emerald-700 text-white flex items-center justify-center text-xs font-bold shrink-0">
                                {(user.displayName || user.email || 'U')[0].toUpperCase()}
                              </div>
                            )}
                            <div className="min-w-0 flex-1">
                              <p className="font-bold text-stone-900 dark:text-stone-100 truncate text-xs">
                                {user.displayName || 'Farmer'}
                              </p>
                              <p className="text-[10px] text-stone-500 dark:text-stone-400 truncate">
                                {user.email}
                              </p>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-1.5 pt-1">
                            <button
                              type="button"
                              onClick={() => {
                                setActiveTab('farm-profile');
                                setMobileUtilsOpen(false);
                              }}
                              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:text-emerald-600 dark:hover:text-emerald-400 text-[11px] font-medium transition-colors cursor-pointer"
                            >
                              <UserCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span className="truncate">{t.myFarms || 'Farms'}</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setPrivacyModalOpen(true);
                                setMobileUtilsOpen(false);
                              }}
                              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:text-emerald-600 dark:hover:text-emerald-400 text-[11px] font-medium transition-colors cursor-pointer"
                            >
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span className="truncate">{t.privacyDataTitle || 'Privacy'}</span>
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              logout();
                              setMobileUtilsOpen(false);
                            }}
                            className="w-full flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-[11px] font-semibold transition-colors mt-1 cursor-pointer"
                          >
                            <LogOut className="w-3.5 h-3.5" />
                            <span>{t.signOutBtn || 'Sign Out'}</span>
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            setAuthModalMode('login');
                            setAuthModalOpen(true);
                            setMobileUtilsOpen(false);
                          }}
                          className="w-full flex items-center justify-center gap-2 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                        >
                          <LogIn className="w-3.5 h-3.5" />
                          <span>{t.login || 'Sign In'}</span>
                        </button>
                      )}
                    </div>

                    <div className="border-t border-stone-100 dark:border-stone-800" />

                    {/* 2. Language Section */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 dark:text-stone-500 flex items-center gap-1">
                          <Languages className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                          <span>{t['shell.selectLanguage'] || 'Language'}</span>
                        </span>
                        <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                          {currentLangObj.nativeName}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-1 max-h-36 overflow-y-auto pr-0.5 scrollbar-thin">
                        {countryAdapter.supportedLanguages.map((lang) => {
                          const isSelected = lang.code === language || (lang as any).id === language;
                          return (
                            <button
                              key={lang.code}
                              type="button"
                              onClick={() => {
                                setLanguage(lang.code as Language);
                                try {
                                  localStorage.setItem('khetinexus_language', lang.code);
                                  localStorage.setItem('khetinexus_language_selected', 'true');
                                } catch (e) {
                                  console.error(e);
                                }
                                setMobileUtilsOpen(false);
                              }}
                              className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-[11px] font-medium transition-colors text-left truncate cursor-pointer ${
                                isSelected
                                  ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-950 dark:text-emerald-200 font-bold border border-emerald-300 dark:border-emerald-800'
                                  : 'bg-stone-50 dark:bg-stone-800/60 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                              }`}
                            >
                              <span className="font-mono text-[9px] px-1 rounded bg-stone-200 dark:bg-stone-700 shrink-0">
                                {lang.shortCode || (lang as any).label}
                              </span>
                              <span className="truncate">{lang.nativeName}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="border-t border-stone-100 dark:border-stone-800" />

                    {/* 3. Light / Dark Theme Button */}
                    <div className="flex items-center justify-between pt-0.5">
                      <span className="text-[11px] font-semibold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                        {theme === 'dark' ? (
                          <Moon className="w-3.5 h-3.5 text-stone-400" />
                        ) : (
                          <Sun className="w-3.5 h-3.5 text-amber-500" />
                        )}
                        <span>{theme === 'dark' ? (t.themeDark || 'Dark Mode') : (t.themeLight || 'Light Mode')}</span>
                      </span>
                      <button
                        type="button"
                        onClick={toggleTheme}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-[11px] font-semibold text-stone-800 dark:text-stone-200 hover:text-emerald-600 transition-colors cursor-pointer"
                      >
                        {theme === 'dark' ? (
                          <>
                            <Sun className="w-3.5 h-3.5 text-amber-400" />
                            <span>{t.themeLight || 'Light'}</span>
                          </>
                        ) : (
                          <>
                            <Moon className="w-3.5 h-3.5 text-stone-600 dark:text-stone-400" />
                            <span>{t.themeDark || 'Dark'}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Theme Toggle (Desktop) */}
              <button
                type="button"
                id="topbar-theme-toggle-btn"
                onClick={toggleTheme}
                aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                className="hidden sm:flex p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer"
              >
                {theme === 'dark' ? (
                  <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
                ) : (
                  <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-stone-600" />
                )}
              </button>

              {/* Multilingual Selector (Desktop) */}
              <div className="relative hidden sm:block" ref={langDropdownRef}>
                <button
                  type="button"
                  id="topbar-language-select-btn"
                  onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                  className="flex items-center gap-1 px-1.5 sm:px-2.5 py-1 sm:py-1.5 bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-emerald-500 rounded-lg sm:rounded-xl text-xs font-semibold text-stone-800 dark:text-stone-200 transition-colors cursor-pointer"
                  title="Select Language"
                >
                  <Languages className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span className="hidden sm:inline">{(currentLangObj as any)?.flag || countryAdapter.flag}</span>
                  <span className="font-bold text-[10px] sm:text-[11px] px-1 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-mono">
                    {currentLangObj.shortCode || (currentLangObj as any).label}
                  </span>
                  <span className="hidden sm:inline font-medium">{currentLangObj.nativeName}</span>
                  <ChevronDown
                    className={`w-2.5 h-2.5 sm:w-3 sm:h-3 text-stone-400 transition-transform ${
                      langDropdownOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {langDropdownOpen && (
                  <div className="absolute right-0 mt-1.5 w-60 sm:w-64 max-w-[calc(100vw-1.5rem)] max-h-80 overflow-y-auto bg-white dark:bg-stone-900 rounded-2xl shadow-xl border border-stone-200 dark:border-stone-800 py-1.5 z-50 animate-fade-in scrollbar-thin">
                    <div className="px-3 py-1.5 border-b border-stone-100 dark:border-stone-800 text-[10px] uppercase font-bold tracking-wider text-stone-400 flex items-center justify-between">
                      <span>{t['shell.selectLanguage'] || 'Select Language'}</span>
                      <span>{countryAdapter.countryName} Languages</span>
                    </div>
                    {countryAdapter.supportedLanguages.map((lang) => {
                      const isSelected = lang.code === language || (lang as any).id === language;
                      return (
                        <button
                          key={lang.code}
                          type="button"
                          id={`lang-opt-${lang.code}`}
                          onClick={() => {
                            setLanguage(lang.code as Language);
                            try {
                              localStorage.setItem('khetinexus_language', lang.code);
                              localStorage.setItem('khetinexus_language_selected', 'true');
                            } catch (e) {
                              console.error(e);
                            }
                            setLangDropdownOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-300 font-bold'
                              : 'text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <span className="text-sm">{(lang as any).flag || countryAdapter.flag}</span>
                            <span className="font-bold text-[10px] px-1 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 font-mono">
                              {lang.shortCode || (lang as any).label}
                            </span>
                            <span>{lang.nativeName}</span>
                            {lang.name !== lang.nativeName && (
                              <span className="text-[11px] text-stone-400">({lang.name})</span>
                            )}
                          </span>
                          {isSelected && (
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                              ✓
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* User Account / Sign In (Desktop) */}
              {user ? (
                <div className="relative hidden sm:block" ref={userDropdownRef}>
                  <button
                    type="button"
                    id="topbar-user-menu-btn"
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-1 p-1 sm:px-2 sm:py-1 bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-emerald-500 rounded-lg sm:rounded-xl text-xs text-stone-800 dark:text-stone-200 transition-colors cursor-pointer"
                  >
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={user.displayName || 'User'}
                        referrerPolicy="no-referrer"
                        className="w-5 h-5 sm:w-6 sm:h-6 rounded-full object-cover border border-emerald-600 shrink-0"
                      />
                    ) : (
                      <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                        {(user.displayName || user.email || 'U')[0].toUpperCase()}
                      </div>
                    )}
                    <span className="hidden sm:inline font-medium max-w-[90px] truncate">
                      {user.displayName || user.email?.split('@')[0]}
                    </span>
                    <ChevronDown className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-stone-400" />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-52 sm:w-56 max-w-[calc(100vw-1.5rem)] bg-white dark:bg-stone-900 rounded-2xl shadow-xl border border-stone-200 dark:border-stone-800 py-1.5 z-50 text-xs animate-fade-in">
                      <div className="px-3.5 py-2 border-b border-stone-100 dark:border-stone-800">
                        <p className="font-bold text-stone-900 dark:text-stone-100 truncate">
                          {user.displayName || 'Farmer'}
                        </p>
                        <p className="text-[11px] text-stone-500 dark:text-stone-400 truncate">
                          {user.email}
                        </p>
                        <div className="mt-1 inline-flex items-center gap-1 text-[10px] text-emerald-700 dark:text-emerald-400 font-medium px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/80">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{t['shell.authenticatedUser'] || 'Authenticated User'}</span>
                        </div>
                      </div>

                      <div className="py-1">
                        <button
                          type="button"
                          id="topbar-user-menu-farms"
                          onClick={() => {
                            setActiveTab('farm-profile');
                            setUserDropdownOpen(false);
                          }}
                          className="w-full flex items-center gap-2 px-3.5 py-2 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 text-left cursor-pointer"
                        >
                          <UserCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          <span>{t.myFarms || 'Manage Farms'}</span>
                        </button>

                        <button
                          type="button"
                          id="topbar-user-menu-privacy"
                          onClick={() => {
                            setPrivacyModalOpen(true);
                            setUserDropdownOpen(false);
                          }}
                          className="w-full flex items-center gap-2 px-3.5 py-2 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 text-left cursor-pointer"
                        >
                          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          <span>{t.privacyDataTitle || 'Privacy & Security'}</span>
                        </button>
                      </div>

                      <div className="pt-1 border-t border-stone-100 dark:border-stone-800">
                        <button
                          type="button"
                          id="topbar-user-menu-logout"
                          onClick={() => {
                            logout();
                            setUserDropdownOpen(false);
                          }}
                          className="w-full flex items-center gap-2 px-3.5 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 text-left font-medium cursor-pointer"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>{t.signOutBtn || 'Sign Out'}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  type="button"
                  id="topbar-signin-btn"
                  onClick={() => {
                    setAuthModalMode('login');
                    setAuthModalOpen(true);
                  }}
                  className="hidden sm:flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5 shrink-0" />
                  <span className="hidden xs:inline">{t.login || 'Sign In'}</span>
                </button>
              )}
            </div>
          </div>
        </header>

        {/* MOBILE NAVIGATION DRAWER & BACKDROP LAYER */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-[1000] md:hidden flex overflow-hidden">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300 z-[900]"
              onClick={() => setMobileMenuOpen(false)}
              aria-hidden="true"
            />

            {/* Mobile Fixed Drawer Panel - Single vertical scroll container */}
            <div
              id="mobile-navigation-drawer"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile Navigation Drawer"
              className="relative z-[1000] w-72 max-w-[85vw] h-[100dvh] bg-[#0e1f14] dark:bg-[#08150c] text-stone-200 flex flex-col justify-between shadow-2xl transition-transform duration-300 ease-in-out border-r border-emerald-950/80 dark:border-stone-800/80 overflow-y-auto overflow-x-hidden custom-sidebar-scroll overscroll-y-contain [overscroll-behavior-y:contain]"
            >
              {/* 1. Top Header Section with KhetiNexus Logo Toggle */}
              <div className="p-4 border-b border-emerald-950/80 dark:border-stone-800/80 flex items-center justify-between shrink-0">
                <button
                  type="button"
                  id="mobile-drawer-brand-btn"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 group cursor-pointer text-left focus:outline-none"
                  aria-label="Close navigation"
                  title="Close navigation"
                >
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-green-700 flex items-center justify-center text-white shadow-md shadow-emerald-950/50 shrink-0 group-hover:scale-105 transition-transform">
                    <Sprout className="w-5 h-5 text-white" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-heading font-black text-base text-white tracking-tight truncate">
                      KhetiNexus<span className="text-emerald-400 font-extrabold">-AI</span>
                    </div>
                    <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider truncate">
                      {t.tagline || 'AI for Smarter Farming'}
                    </div>
                  </div>
                </button>
                <button
                  type="button"
                  id="mobile-drawer-close-btn"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-emerald-950/60 transition-colors cursor-pointer"
                  aria-label="Close navigation"
                  title="Close navigation"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* 2. Mobile Nav Items List - Part of single mobile sidebar scroll container */}
              <nav
                id="mobile-drawer-nav-container"
                className="p-3 space-y-1.5 relative z-10 shrink-0"
              >
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      id={`mobile-nav-${item.id}`}
                      onClick={() => {
                        setActiveTab(item.id);
                        setMobileMenuOpen(false);
                      }}
                      aria-label={item.label}
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/40 font-bold'
                          : 'text-stone-300 hover:text-white hover:bg-emerald-950/50'
                      }`}
                    >
                      <Icon
                        className={`w-4.5 h-4.5 shrink-0 transition-transform ${
                          isActive ? 'text-white scale-110' : 'text-emerald-400'
                        }`}
                      />
                      <span className="truncate min-w-0 flex-1 text-left">{item.label}</span>
                    </button>
                  );
                })}
              </nav>

              {/* 3. Bottom Drawer Active Farm & Auth Footer */}
              <div className="p-2.5 border-t border-emerald-950/80 dark:border-stone-800/80 space-y-2 shrink-0 bg-[#0a180f] dark:bg-[#06110a] relative z-30">
                <FarmSwitcher currentLanguage={language} variant="sidebar" forceClose={!mobileMenuOpen} />

                <PWAInstallButton variant="sidebar" />

                {user ? (
                  <button
                    type="button"
                    id="mobile-drawer-signout-btn"
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold text-red-400 bg-red-950/50 hover:bg-red-900/60 border border-red-900/50 rounded-xl transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>{t.signOutBtn || 'Sign Out'}</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    id="mobile-drawer-signin-btn"
                    onClick={() => {
                      setAuthModalMode('login');
                      setAuthModalOpen(true);
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>{t.login || 'Sign In'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* MAIN BODY VIEW CONTENT */}
        <main className="flex-1 w-full max-w-full min-w-0 overflow-x-hidden pt-14 sm:pt-16">
          <OfflineIndicator />
          {children}
        </main>

        {/* COMPACT CLEAN FOOTER */}
        <footer className="bg-stone-900 text-stone-400 border-t border-stone-800 py-8 px-4 sm:px-6 lg:px-8 mt-12 text-xs">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-lg bg-emerald-700 text-white flex items-center justify-center">
                <Sprout className="w-3.5 h-3.5 text-emerald-300" />
              </div>
              <span className="font-heading font-bold text-stone-200">
                KhetiNexus<span className="text-emerald-400">-AI</span>
              </span>
              <span className="text-stone-500">•</span>
              <span className="text-stone-400">{t.tagline || 'AI for Smarter Farming'}</span>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-[11px] text-stone-400">
              <span>{t['shell.providerGee'] || 'Google Earth Engine'}</span>
              <span>•</span>
              <span>ISRO / Bhuvan</span>
              <span>•</span>
              <span>{t['shell.providerOpenMeteo'] || 'Open-Meteo'}</span>
              <span>•</span>
              <span>Gemini 3.1 & 3.8</span>
              <span>•</span>
              <span>© {new Date().getFullYear()} KhetiNexus</span>
            </div>
          </div>
        </footer>
      </div>

      {/* VOICE LIVE RIGHT SIDEBAR DRAWER */}
      {voiceLiveOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
          <div className="absolute inset-0 overflow-hidden">
            {/* Backdrop with fade-in effect */}
            <div 
              className="absolute inset-0 bg-stone-900/40 dark:bg-stone-950/60 backdrop-blur-xs transition-opacity cursor-pointer" 
              onClick={() => setVoiceLiveOpen(false)}
            />

            <div className="pointer-events-none fixed inset-y-0 right-0 flex w-full max-w-full sm:max-w-md pl-0 sm:pl-10">
              {/* Drawer Panel */}
              <div className="pointer-events-auto w-full max-w-full sm:max-w-md transform transition-all duration-300 ease-in-out bg-white dark:bg-[#08120a] shadow-2xl flex flex-col h-full border-l border-stone-200/80 dark:border-stone-800/80">
                {/* Header of Drawer */}
                <div className="px-4 py-3 sm:px-5 sm:py-4 border-b border-stone-100 dark:border-stone-800/80 flex items-center justify-between bg-stone-50 dark:bg-[#040905]">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping shrink-0" />
                    <span className="font-heading font-extrabold text-sm text-stone-900 dark:text-stone-100 tracking-wide">
                      {getVoiceDrawerTitle(language)}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setVoiceLiveOpen(false)}
                    className="p-1 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Body of Drawer: VoiceAgent Component */}
                <div className="flex-1 overflow-y-auto p-3.5 sm:p-5 scrollbar-thin">
                  <p className="text-[11px] text-stone-600 dark:text-stone-400 leading-relaxed mb-4">
                    {getVoiceDrawerIntro(language)}
                  </p>
                  
                  <VoiceAgent
                    language={language}
                    currentFarm={currentFarm}
                    weather={weather || undefined}
                    soilReport={soilReport || undefined}
                    advisory={advisory || undefined}
                    diagnoses={diagnoses}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
