import React, { useState } from 'react';
import {
  Sprout,
  Sparkles,
  Layers,
  CloudSun,
  Stethoscope,
  Globe2,
  ShieldCheck,
  Compass,
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Languages,
  ChevronDown,
  Sun,
  Moon,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useCountry } from '../context/CountryContext';
import { Language } from '../types';
import { getTranslation, SUPPORTED_LANGUAGES } from '../i18n/translations';
import { BRICS_COUNTRIES_LIST, getCountryAdapter } from '../data/countryAdapters';

interface LoginWelcomeViewProps {
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
}

export const LoginWelcomeView: React.FC<LoginWelcomeViewProps> = ({
  currentLanguage,
  onLanguageChange,
}) => {
  const t = getTranslation(currentLanguage);
  const { theme, toggleTheme } = useTheme();
  const { activeCountry, setCountry, activeLanguage, setLanguage, countryAdapter } = useCountry();
  const {
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    resetPassword,
    enterGuestMode,
  } = useAuth();

  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const [countrySelectorExpanded, setCountrySelectorExpanded] = useState(() => {
    return !localStorage.getItem('khetinexus_active_country');
  });

  const handleCountrySelect = (c: typeof BRICS_COUNTRIES_LIST[0]) => {
    setCountry(c.name);
    const adapter = getCountryAdapter(c.name);
    if (adapter && adapter.defaultLanguage) {
      setLanguage(adapter.defaultLanguage as Language);
      onLanguageChange(adapter.defaultLanguage as Language);
    }
    setCountrySelectorExpanded(false);
  };

  const currentLangObj =
    countryAdapter.supportedLanguages.find((l) => l.code === currentLanguage) ||
    countryAdapter.supportedLanguages[0];

  const clearForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setName('');
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleModeSwitch = (newMode: 'login' | 'register' | 'forgot') => {
    setMode(newMode);
    clearForm();
  };

  const parseAuthError = (err: any): string => {
    const code = err?.code || '';
    if (
      code === 'auth/invalid-credential' ||
      code === 'auth/wrong-password' ||
      code === 'auth/user-not-found'
    ) {
      return t.invalidCredentials;
    }
    if (code === 'auth/email-already-in-use') {
      return t.emailInUse;
    }
    if (code === 'auth/weak-password') {
      return t.weakPassword;
    }
    if (code === 'auth/popup-closed-by-user') {
      return '';
    }
    if (code === 'auth/unauthorized-domain') {
      return 'This domain is not authorized for Google Sign-In. Please add it to the authorized domains in the Firebase Console.';
    }
    return err?.message || t.authErrorDefault;
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (mode === 'register') {
      if (!name.trim()) {
        setErrorMessage('Please enter your full name.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage(t.passwordsDoNotMatch);
        return;
      }
      if (password.length < 6) {
        setErrorMessage(t.weakPassword);
        return;
      }

      setIsSubmitting(true);
      try {
        await signUpWithEmail(email.trim(), password, name.trim());
      } catch (err: any) {
        setErrorMessage(parseAuthError(err));
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    if (mode === 'login') {
      if (!email.trim() || !password) {
        setErrorMessage(t.invalidCredentials);
        return;
      }

      setIsSubmitting(true);
      try {
        await signInWithEmail(email.trim(), password);
      } catch (err: any) {
        setErrorMessage(parseAuthError(err));
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    if (mode === 'forgot') {
      if (!email.trim()) {
        setErrorMessage('Please enter your registered email address.');
        return;
      }

      setIsSubmitting(true);
      try {
        await resetPassword(email.trim());
        setSuccessMessage(t.resetEmailSent);
      } catch (err: any) {
        setErrorMessage(parseAuthError(err));
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsGoogleSubmitting(true);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      const msg = parseAuthError(err);
      if (msg) setErrorMessage(msg);
    } finally {
      setIsGoogleSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFBF9] dark:bg-[#06120a] text-stone-900 dark:text-stone-100 font-sans transition-colors duration-200 overflow-x-hidden">
      {/* ======================================================= */}
      {/* 1. TOP PUBLIC HEADER                                   */}
      {/* ======================================================= */}
      <header className="sticky top-0 z-50 bg-[#FAFBF9]/95 dark:bg-[#06120a]/95 backdrop-blur-md border-b border-[#E2E8DF] dark:border-emerald-950/80 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-green-800 flex items-center justify-center text-white shadow-xs shadow-emerald-950/20">
              <Sprout className="w-6 h-6 text-emerald-100" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-extrabold text-lg text-emerald-950 dark:text-emerald-100 tracking-tight">
                  KhetiNexus <span className="text-emerald-600 dark:text-emerald-400">AI</span>
                </span>
                <span className="hidden sm:inline-block text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  AgriN MVP
                </span>
              </div>
              <p className="hidden md:block text-[11px] text-stone-500 dark:text-stone-400 font-medium leading-none mt-0.5">
                {t.tagline}
              </p>
            </div>
          </div>

          {/* Right Action Controls: Theme Toggle + Language Selector + Guest Preview */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme Toggle (Light / Dark) */}
            <button
              type="button"
              id="welcome-theme-toggle-btn"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? t.themeLight : t.themeDark}
              title={theme === 'dark' ? t.themeLight : t.themeDark}
              className="p-2 rounded-xl bg-white dark:bg-stone-900 border border-[#D9E2D5] dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-500 shadow-2xs transition-colors"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-stone-600" />
              )}
            </button>

            {/* Language Selector */}
            <div className="relative">
              <button
                type="button"
                id="welcome-lang-dropdown-btn"
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white dark:bg-stone-900 border border-[#D9E2D5] dark:border-stone-800 hover:border-emerald-600 rounded-xl text-xs font-semibold text-stone-700 dark:text-stone-300 shadow-2xs transition-colors"
                title="Select Language"
              >
                <Languages className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>{(currentLangObj as any).flag || countryAdapter.flag}</span>
                <span className="font-bold text-[11px] px-1 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300">
                  {currentLangObj.shortCode || (currentLangObj as any).label}
                </span>
                <span className="font-medium hidden sm:inline">{currentLangObj.nativeName}</span>
                <ChevronDown
                  className={`w-3 h-3 text-stone-400 transition-transform ${
                    langDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 mt-1.5 w-60 max-h-80 overflow-y-auto bg-white dark:bg-stone-900 rounded-xl shadow-lg border border-stone-200 dark:border-stone-800 py-1 z-50 animate-in fade-in slide-in-from-top-1 duration-150 scrollbar-thin">
                  <div className="px-3 py-1.5 border-b border-stone-100 dark:border-stone-800 text-[10px] uppercase font-bold tracking-wider text-stone-400">
                    Select Language
                  </div>
                  {countryAdapter.supportedLanguages.map((lang) => {
                    const isSelected = lang.code === currentLanguage;
                    return (
                      <button
                        key={lang.code}
                        type="button"
                        id={`welcome-lang-${lang.code}`}
                        onClick={() => {
                          onLanguageChange(lang.code as Language);
                          setLangDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left transition-colors ${
                          isSelected
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-300 font-semibold'
                            : 'text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className="text-base">{(lang as any).flag || countryAdapter.flag}</span>
                          <span className="font-bold text-[10px] px-1 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 font-mono">
                            {lang.shortCode || (lang as any).label}
                          </span>
                          <span>{lang.nativeName}</span>
                          {lang.name !== lang.nativeName && (
                            <span className="text-[11px] text-stone-400">({lang.name})</span>
                          )}
                        </span>
                        {isSelected && (
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                            ✓
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Quick Guest Preview Button */}
            <button
              type="button"
              id="top-guest-preview-btn"
              onClick={enterGuestMode}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/70 hover:bg-emerald-100 dark:hover:bg-emerald-900/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/80 rounded-xl text-xs font-semibold transition-colors"
            >
              <Compass className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>{t.exploreAsGuest}</span>
            </button>
          </div>
        </div>
      </header>

      {/* ======================================================= */}
      {/* 2. FULL AGRICULTURAL HERO BACKGROUND SECTION            */}
      {/* ======================================================= */}
      <section
        id="hero-agricultural-section"
        className="relative w-full min-h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden"
      >
        {/* AGRICULTURAL FARMER / FIELD BACKGROUND */}
        <div className="absolute inset-0 w-full h-full">
          {!imageError ? (
            <img
              src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=2000&q=85"
              alt="Farmer standing in lush green agricultural field with smart farming intelligence"
              referrerPolicy="no-referrer"
              className={`w-full h-full object-cover object-center saturate-[1.35] contrast-[1.08] brightness-[1.04] transition-opacity duration-700 ${
                imageLoaded ? 'opacity-100' : 'opacity-90'
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
          ) : (
            /* Bespoke Scalable Vector Agricultural Landscape Fallback */
            <div className="w-full h-full bg-gradient-to-b from-[#11321b] via-[#0e2a16] to-[#07160c] relative">
              <svg
                className="absolute inset-0 w-full h-full opacity-60"
                viewBox="0 0 1200 800"
                preserveAspectRatio="xMidYMid slice"
              >
                <circle cx="950" cy="180" r="100" fill="#fde047" opacity="0.3" />
                <path
                  d="M0 520 C300 420 500 500 800 440 C1000 400 1100 460 1200 430 L1200 800 L0 800 Z"
                  fill="#1b4d27"
                  opacity="0.7"
                />
                <path
                  d="M0 580 Q350 510 700 540 T1200 520 L1200 800 L0 800 Z"
                  fill="#236332"
                />
                <path
                  d="M0 640 Q400 570 800 600 T1200 580 L1200 800 L0 800 Z"
                  fill="#2b753b"
                />
              </svg>
            </div>
          )}

          {/* Minimal non-blurring gradient: keeps the farm landscape, vibrant colors, sunlight, crops, and farmer clearly visible */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/25 via-transparent to-black/20 dark:from-black/45 dark:via-black/15 dark:to-black/35 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent pointer-events-none" />

          {/* Smooth Bottom Blend into Features Section */}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#F4F7F2] dark:from-[#07130b] to-transparent pointer-events-none" />
        </div>

        {/* HERO INNER CONTENT (Text on Left, Login Card on Right) */}
        <div className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* =================================================== */}
            {/* LEFT / HERO BRANDING & TEXT (No blur, image visible) */}
            {/* =================================================== */}
            <div className="lg:col-span-7 space-y-6 text-white p-2 sm:p-4 rounded-3xl">
              {/* Sovereign BRICS AgriN Pill */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/85 border border-emerald-400/50 text-emerald-200 text-xs font-semibold shadow-lg">
                <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
                <span>{t.bricsInitiative}</span>
              </div>

              {/* Main Headline */}
              <div className="space-y-3">
                <h1 className="font-heading font-extrabold text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-[1.15] drop-shadow-[0_3px_8px_rgba(0,0,0,0.85)]">
                  {t.appName}
                  <span className="block text-emerald-300 text-2xl sm:text-3xl lg:text-4xl font-bold mt-1.5 drop-shadow-[0_2px_6px_rgba(0,0,0,0.85)]">
                    {t.tagline}
                  </span>
                </h1>
                <p className="text-base sm:text-lg text-white/95 max-w-xl leading-relaxed font-medium drop-shadow-[0_2px_6px_rgba(0,0,0,0.85)]">
                  {t.welcomeHeroHeadline}
                </p>
              </div>

              {/* Floating Agricultural Telemetry Chips */}
              <div className="flex flex-wrap items-center gap-2.5 pt-2">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 border border-white/20 text-emerald-100 text-xs font-medium shadow-md">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{t.sentinel2Telemetry || 'Sentinel-2 Field Telemetry'}</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 border border-white/20 text-emerald-100 text-xs font-medium shadow-md">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
                  <span>{t.geminiLiveAI || 'Gemini 3.1 Live AI'}</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 border border-white/20 text-emerald-100 text-xs font-medium shadow-md">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                  <span>{t.sovereignFarmerData || 'Sovereign Farmer Data'}</span>
                </div>
              </div>
              {/* National Agronomic Interoperability Flags */}
              <div className="pt-2 flex items-center gap-3 text-xs text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
                <span className="font-semibold text-emerald-200">{t.participatingNodes || 'Participating Agronomic Nodes:'}</span>
                <span className="tracking-wider text-sm">🇮🇳 🇧🇷 🇷🇺 🇨🇳 🇿🇦</span>
              </div>
            </div>

            {/* =================================================== */}
            {/* RIGHT / AUTHENTICATION CARD OVER HERO               */}
            {/* =================================================== */}
            <div className="lg:col-span-5">
              <div className="bg-white/95 dark:bg-stone-900/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/60 dark:border-emerald-800/40 relative overflow-hidden transition-colors">
                {/* Emerald Accent Line */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-green-600 to-emerald-700" />

                {/* =================================================== */}
                {/* BRICS COUNTRY SELECTION ONBOARDING SECTION           */}
                {/* =================================================== */}
                <div className="mb-5 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/45 border border-emerald-200/90 dark:border-emerald-800/60 overflow-hidden">
                  {!countrySelectorExpanded ? (
                    <button
                      type="button"
                      onClick={() => setCountrySelectorExpanded(true)}
                      className="w-full flex items-center justify-between px-4 py-3 hover:bg-emerald-100/50 dark:hover:bg-emerald-900/40 transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <Globe2 className="w-4.5 h-4.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span className="text-base shrink-0 leading-none">{countryAdapter.flag}</span>
                        <h3 className="text-sm font-bold text-stone-900 dark:text-emerald-100">
                          {activeCountry}
                        </h3>
                        <span className="text-stone-400 dark:text-stone-500 text-xs mx-0.5">•</span>
                        <span className="text-[11px] font-mono font-bold text-emerald-700 dark:text-emerald-400 tracking-wider bg-emerald-100 dark:bg-emerald-900/50 px-1.5 py-0.5 rounded">
                          {countryAdapter.countryCode}
                        </span>
                      </div>
                      <ChevronDown className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    </button>
                  ) : (
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <Globe2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          <h3 className="text-xs font-extrabold font-heading text-stone-900 dark:text-emerald-100 uppercase tracking-wide">
                            Select Your Country
                          </h3>
                        </div>
                        {localStorage.getItem('khetinexus_active_country') && (
                          <button
                            type="button"
                            onClick={() => setCountrySelectorExpanded(false)}
                            className="text-stone-500 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <p className="text-[11px] text-stone-600 dark:text-emerald-200/80 mb-3 leading-snug">
                        Choose your country to personalize KhetiNexus AI for your agricultural region.
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-44 overflow-y-auto pr-1">
                        {BRICS_COUNTRIES_LIST.map((c) => {
                          const isSelected = activeCountry === c.name;
                          return (
                            <button
                              key={c.code}
                              type="button"
                              onClick={() => handleCountrySelect(c)}
                              className={`p-2 rounded-xl border text-left transition-all flex items-center justify-between gap-1 cursor-pointer ${
                                isSelected
                                  ? 'border-emerald-600 bg-emerald-600 text-white font-bold shadow-xs'
                                  : 'border-stone-200 dark:border-emerald-900/50 hover:border-emerald-400 bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-200'
                              }`}
                            >
                              <div className="flex items-center gap-1.5 truncate">
                                <span className="text-sm shrink-0">{c.flag}</span>
                                <span className="text-[11px] truncate">{c.name}</span>
                              </div>
                              {isSelected && <CheckCircle2 className="w-3 h-3 text-white shrink-0" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Mode Switcher Tabs (Sign In / Create Account) */}
                {mode !== 'forgot' && (
                  <div className="flex bg-[#F0F5EE] dark:bg-stone-800/80 p-1 rounded-xl mb-5">
                    <button
                      type="button"
                      id="switch-login-tab-btn"
                      onClick={() => handleModeSwitch('login')}
                      className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                        mode === 'login'
                          ? 'bg-white dark:bg-stone-900 text-emerald-950 dark:text-emerald-300 shadow-xs'
                          : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                      }`}
                    >
                      {t.signInBtn}
                    </button>
                    <button
                      type="button"
                      id="switch-register-tab-btn"
                      onClick={() => handleModeSwitch('register')}
                      className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                        mode === 'register'
                          ? 'bg-white dark:bg-stone-900 text-emerald-950 dark:text-emerald-300 shadow-xs'
                          : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                      }`}
                    >
                      {t.signUpBtn}
                    </button>
                  </div>
                )}

                {/* Header Title & Subtitle */}
                <div className="mb-5">
                  {mode === 'login' && (
                    <>
                      <h2 className="text-xl sm:text-2xl font-bold font-heading text-stone-900 dark:text-stone-100 tracking-tight">
                        {t.welcomeToKhetiNexus}
                      </h2>
                      <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
                        {t.welcomeBackSubtitle}
                      </p>
                    </>
                  )}

                  {mode === 'register' && (
                    <>
                      <h2 className="text-xl sm:text-2xl font-bold font-heading text-stone-900 dark:text-stone-100 tracking-tight">
                        {t.signUpBtn}
                      </h2>
                      <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
                        {t.loginToPersonalize}
                      </p>
                    </>
                  )}

                  {mode === 'forgot' && (
                    <>
                      <h2 className="text-xl sm:text-2xl font-bold font-heading text-stone-900 dark:text-stone-100 tracking-tight">
                        {t.forgotPassword}
                      </h2>
                      <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
                        Enter your registered email to receive a secure password reset link.
                      </p>
                    </>
                  )}
                </div>

                {/* Feedback Alerts */}
                {errorMessage && (
                  <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-900/60 text-red-700 dark:text-red-300 text-xs flex items-start gap-2 animate-in fade-in">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span className="leading-snug">{errorMessage}</span>
                  </div>
                )}

                {successMessage && (
                  <div className="mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-start gap-2 animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
                    <span className="leading-snug">{successMessage}</span>
                  </div>
                )}

                {/* Main Auth Form */}
                <form onSubmit={handleEmailSubmit} className="space-y-3.5">
                  {/* Register Mode: Name Field */}
                  {mode === 'register' && (
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                        {t.nameLabel}
                      </label>
                      <input
                        type="text"
                        required
                        id="welcome-name-input"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={t.namePlaceholder}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500 transition-colors"
                      />
                    </div>
                  )}

                  {/* Email Address Field */}
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                      {t.emailLabel}
                    </label>
                    <input
                      type="email"
                      required
                      id="welcome-email-input"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t.emailPlaceholder}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500 transition-colors"
                    />
                  </div>

                  {/* Password Field (for login & register) */}
                  {mode !== 'forgot' && (
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                          {t.passwordLabel}
                        </label>
                        {mode === 'login' && (
                          <button
                            type="button"
                            id="welcome-forgot-password-btn"
                            onClick={() => handleModeSwitch('forgot')}
                            className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 hover:underline"
                          >
                            {t.forgotPassword}
                          </button>
                        )}
                      </div>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          id="welcome-password-input"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder={t.passwordPlaceholder}
                          className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500 transition-colors"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 p-1"
                        >
                          {showPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Register Mode: Confirm Password */}
                  {mode === 'register' && (
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                        {t.confirmPasswordLabel}
                      </label>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        id="welcome-confirm-password-input"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder={t.passwordPlaceholder}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500 transition-colors"
                      />
                    </div>
                  )}

                  {/* Primary Submit Button */}
                  <button
                    type="submit"
                    id="welcome-submit-auth-btn"
                    disabled={isSubmitting}
                    className="w-full mt-2 py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md shadow-emerald-950/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>{t.loading}</span>
                      </>
                    ) : (
                      <>
                        <span>
                          {mode === 'login'
                            ? t.signInBtn
                            : mode === 'register'
                            ? t.signUpBtn
                            : t.resetPasswordBtn}
                        </span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                {/* Forgot Password Mode: Back to Login */}
                {mode === 'forgot' && (
                  <div className="mt-4 text-center">
                    <button
                      type="button"
                      id="back-to-login-from-forgot-btn"
                      onClick={() => handleModeSwitch('login')}
                      className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 hover:underline"
                    >
                      ← {t.backToLogin}
                    </button>
                  </div>
                )}

                {/* Google Sign In (for login & register modes) */}
                {mode !== 'forgot' && (
                  <>
                    <div className="relative my-4">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-stone-200 dark:border-stone-700" />
                      </div>
                      <div className="relative flex justify-center text-xs">
                        <span className="bg-white dark:bg-stone-900 px-2 text-stone-400 dark:text-stone-500 font-semibold uppercase tracking-wider text-[10px]">
                          {t.orDivider}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      id="welcome-google-signin-btn"
                      onClick={handleGoogleSignIn}
                      disabled={isGoogleSubmitting}
                      className="w-full py-2.5 px-4 bg-white dark:bg-stone-800 hover:bg-stone-50 dark:hover:bg-stone-700 border border-stone-300 dark:border-stone-700 rounded-xl text-xs sm:text-sm font-semibold text-stone-700 dark:text-stone-200 flex items-center justify-center gap-2.5 transition-colors shadow-2xs cursor-pointer"
                    >
                      {isGoogleSubmitting ? (
                        <Loader2 className="w-4 h-4 animate-spin text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                          <path
                            fill="#4285F4"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          />
                          <path
                            fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                          />
                          <path
                            fill="#EA4335"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                          />
                        </svg>
                      )}
                      <span>{t.continueWithGoogleBtn}</span>
                    </button>

                    <div className="mt-3 text-center">
                      {mode === 'login' ? (
                        <p className="text-xs text-stone-600 dark:text-stone-400">
                          {t.dontHaveAccount}{' '}
                          <button
                            type="button"
                            id="goto-create-account-btn"
                            onClick={() => handleModeSwitch('register')}
                            className="font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 hover:underline"
                          >
                            {t.signUpBtn}
                          </button>
                        </p>
                      ) : (
                        <p className="text-xs text-stone-600 dark:text-stone-400">
                          {t.alreadyHaveAccount}{' '}
                          <button
                            type="button"
                            id="goto-signin-btn"
                            onClick={() => handleModeSwitch('login')}
                            className="font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 hover:underline"
                          >
                            {t.signInBtn}
                          </button>
                        </p>
                      )}
                    </div>
                  </>
                )}

                {/* =================================================== */}
                {/* CLEARLY DEMARCATED GUEST PREVIEW ACTION             */}
                {/* =================================================== */}
                <div className="mt-6 pt-5 border-t border-stone-200 dark:border-stone-700">
                  <div className="bg-emerald-50/90 dark:bg-emerald-950/40 border border-emerald-200/90 dark:border-emerald-800/60 rounded-2xl p-4 text-center">
                    <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-900 dark:text-emerald-200 mb-1">
                      <Compass className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                      <span>{t.exploreAsGuest}</span>
                    </div>
                    <p className="text-[11px] text-stone-600 dark:text-emerald-300/80 leading-snug mb-3">
                      {t.guestPreviewDesc}
                    </p>
                    <button
                      type="button"
                      id="welcome-guest-preview-action-btn"
                      onClick={enterGuestMode}
                      className="w-full py-2 px-3 bg-white dark:bg-emerald-900/60 hover:bg-emerald-100/70 dark:hover:bg-emerald-800/70 border border-emerald-300 dark:border-emerald-700 text-emerald-850 dark:text-emerald-100 font-bold rounded-xl text-xs transition-colors shadow-2xs flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>{t.exploreAsGuest}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-300" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================= */}
      {/* 3. FEATURES SECTION (COMPLETELY BELOW THE HERO)         */}
      {/* ======================================================= */}
      <section
        id="features-showcase-section"
        className="w-full bg-[#F4F7F2] dark:bg-[#0c1a11] py-16 px-4 sm:px-6 lg:px-8 border-t border-[#DFE7DB] dark:border-emerald-900/30 transition-colors"
      >
        <div className="max-w-7xl mx-auto">
          {/* Section Heading */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/90 px-3 py-1 rounded-full border border-emerald-300/60 dark:border-emerald-800/60">
              {t.whyKhetiNexusTitle}
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-extrabold text-stone-900 dark:text-emerald-50 tracking-tight mt-3">
              {t.everythingYouNeedTitle}
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-emerald-200/80 mt-2 max-w-2xl mx-auto">
              {t.everythingYouNeedSubtitle}
            </p>
          </div>

          {/* 4 Feature Cards: 1-col mobile, 2x2 tablet, 4-col desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Feature 1: Personalized Farm Intelligence */}
            <div
              id="feature-card-intelligence"
              className="bg-white dark:bg-stone-900/90 border border-[#E0E7DC] dark:border-emerald-900/50 hover:border-emerald-500/50 dark:hover:border-emerald-500/50 rounded-2xl p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 flex items-center justify-center text-emerald-700 dark:text-emerald-400 mb-4">
                  <Sprout className="w-5 h-5" />
                </div>
                <h3 className="font-heading font-bold text-base text-stone-900 dark:text-emerald-100 leading-snug">
                  {t.featureHighlight1}
                </h3>
                <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed mt-2">
                  {t.featureHighlight1Desc}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                <span>Hyper-localized advisory</span>
              </div>
            </div>

            {/* Feature 2: Weather & Agricultural Insights */}
            <div
              id="feature-card-weather"
              className="bg-white dark:bg-stone-900/90 border border-[#E0E7DC] dark:border-emerald-900/50 hover:border-amber-500/50 dark:hover:border-amber-500/50 rounded-2xl p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/80 flex items-center justify-center text-amber-700 dark:text-amber-400 mb-4">
                  <CloudSun className="w-5 h-5" />
                </div>
                <h3 className="font-heading font-bold text-base text-stone-900 dark:text-emerald-100 leading-snug">
                  {t.featureHighlight2}
                </h3>
                <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed mt-2">
                  {t.featureHighlight2Desc}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800 text-[11px] font-semibold text-amber-700 dark:text-amber-400 flex items-center gap-1">
                <span>Optimal spray windows</span>
              </div>
            </div>

            {/* Feature 3: AI Crop Diagnosis */}
            <div
              id="feature-card-diagnosis"
              className="bg-white dark:bg-stone-900/90 border border-[#E0E7DC] dark:border-emerald-900/50 hover:border-blue-500/50 dark:hover:border-blue-500/50 rounded-2xl p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/80 flex items-center justify-center text-blue-700 dark:text-blue-400 mb-4">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <h3 className="font-heading font-bold text-base text-stone-900 dark:text-emerald-100 leading-snug">
                  {t.featureHighlight3}
                </h3>
                <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed mt-2">
                  {t.featureHighlight3Desc}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800 text-[11px] font-semibold text-blue-700 dark:text-blue-400 flex items-center gap-1">
                <span>Multimodal vision doctor</span>
              </div>
            </div>

            {/* Feature 4: Regenerative Agriculture */}
            <div
              id="feature-card-regenerative"
              className="bg-white dark:bg-stone-900/90 border border-[#E0E7DC] dark:border-emerald-900/50 hover:border-teal-500/50 dark:hover:border-teal-500/50 rounded-2xl p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-950/80 flex items-center justify-center text-teal-700 dark:text-teal-400 mb-4">
                  <Layers className="w-5 h-5" />
                </div>
                <h3 className="font-heading font-bold text-base text-stone-900 dark:text-emerald-100 leading-snug">
                  {t.featureHighlight4}
                </h3>
                <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed mt-2">
                  {t.featureHighlight4Desc}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800 text-[11px] font-semibold text-teal-700 dark:text-teal-400 flex items-center gap-1">
                <span>Living soil & carbon</span>
              </div>
            </div>
          </div>

          {/* AgriN Sovereignty and Trust Bar */}
          <div className="mt-8 flex flex-wrap items-center justify-between gap-3 p-4 bg-white dark:bg-stone-900/80 border border-[#E0E7DC] dark:border-emerald-900/40 rounded-2xl text-xs text-stone-600 dark:text-stone-300 shadow-2xs">
            <div className="flex items-center gap-2">
              <Globe2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>{t.privacyPoint3}</span>
            </div>
            <div className="flex items-center gap-2 text-stone-400 dark:text-stone-500 text-[11px] font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Google Cloud Firestore + Gemini Live AI</span>
              <span>•</span>
              <span className="tracking-wider">🇮🇳 🇧🇷 🇷🇺 🇨🇳 🇿🇦</span>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================= */}
      {/* 4. FOOTER                                               */}
      {/* ======================================================= */}
      <footer className="w-full border-t border-[#E0E7DC] dark:border-emerald-950 bg-white dark:bg-[#07110a] py-6 text-xs text-stone-500 dark:text-stone-400 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>
            © {new Date().getFullYear()} {t.footerCopyright}
          </span>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>{t.sovereignDataArchitecture || 'Sovereign Farmer Data Architecture'}</span>
            </span>
            <span className="tracking-wider text-stone-400">🇮🇳 🇧🇷 🇷🇺 🇨🇳 🇿🇦</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
