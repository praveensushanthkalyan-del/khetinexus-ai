import React, { useState, useRef, useEffect } from 'react';
import {
  Sprout,
  Menu,
  X,
  Languages,
  Sparkles,
  Layers,
  CloudSun,
  FlaskConical,
  Stethoscope,
  Globe2,
  UserCheck,
  Home,
  LayoutDashboard,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  LogIn,
  LogOut,
  ShieldCheck,
  User as UserIcon,
  Compass,
  Sun,
  Moon,
  Satellite,
  Database,
  Shield,
} from 'lucide-react';
import { ActiveTab, FarmProfile, Language } from '../types';
import { getTranslation, INDIA_LANGUAGES } from '../i18n/translations';
import { localizeCountry, localizeCrop } from '../i18n/dataTranslations';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useCountry } from '../context/CountryContext';
import { usePermissions } from '../context/PermissionContext';
import { FarmSwitcher } from './FarmSwitcher';



interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  currentFarm: FarmProfile;
  language: Language;
  setLanguage: (lang: Language) => void;
  hasGeminiKey: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentFarm,
  language,
  setLanguage,
  hasGeminiKey,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [statusTooltipOpen, setStatusTooltipOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const langDropdownRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const t = getTranslation(language);
  const { theme, toggleTheme } = useTheme();

  const {
    user,
    userProfile,
    logout,
    setAuthModalOpen,
    setAuthModalMode,
    setPrivacyModalOpen,
  } = useAuth();

  const { activeCountry, countryAdapter, setCountryModalOpen } = useCountry();
  const { setAccessModalOpen } = usePermissions();

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
        setLangDropdownOpen(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLangObj = INDIA_LANGUAGES.find((l) => l.code === language || l.id === language) || INDIA_LANGUAGES[0];

  const navItems = [
    { id: 'landing' as ActiveTab, label: t.navHome, icon: Home },
    { id: 'dashboard' as ActiveTab, label: t.navDashboard, icon: LayoutDashboard },
    { id: 'farm-profile' as ActiveTab, label: t.navFarmProfile, icon: UserCheck },
    { id: 'ai-advisor' as ActiveTab, label: t.navAdvisor, icon: Sparkles },
    { id: 'crop-doctor' as ActiveTab, label: t.navCropDoctor, icon: Stethoscope },
    { id: 'geospatial-intel' as ActiveTab, label: 'Geospatial & Satellite', icon: Satellite },
    { id: 'weather' as ActiveTab, label: t.navWeather, icon: CloudSun },
    { id: 'soil-health' as ActiveTab, label: t.navSoilHealth, icon: FlaskConical },
    { id: 'regenerative' as ActiveTab, label: t.navRegenerative, icon: Layers },
    { id: 'data-sources' as ActiveTab, label: 'Data Sources & Limits', icon: Database },
    { id: 'agrin-network' as ActiveTab, label: t.navAgriN, icon: Globe2 },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#F8FAF6]/98 dark:bg-[#07130b]/98 backdrop-blur-md border-b border-[#E2E8DF] dark:border-emerald-950/80 transition-colors w-full shadow-xs">
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* ROW 1: BRAND IDENTITY + UTILITY CONTROLS */}
        <div className="flex items-center justify-between py-2.5 sm:py-3 gap-2 sm:gap-4 border-b border-stone-200/60 dark:border-emerald-950/50">
          {/* Brand */}
          <div
            id="brand-logo-btn"
            className="flex items-center gap-2 sm:gap-3 cursor-pointer select-none min-w-0 shrink-0"
            onClick={() => setActiveTab('landing')}
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-green-800 flex items-center justify-center text-white shadow-xs shrink-0">
              <Sprout className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-100" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-heading font-bold text-base sm:text-lg text-emerald-950 dark:text-emerald-100 tracking-tight whitespace-nowrap">
                  KhetiNexus <span className="text-emerald-600 dark:text-emerald-400">AI</span>
                </span>
                <span className="hidden sm:inline-block text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 shrink-0">
                  AgriN MVP
                </span>
              </div>
              <p className="hidden md:block text-[11px] text-stone-500 dark:text-stone-400 font-medium leading-none mt-0.5 truncate">
                {t.tagline}
              </p>
            </div>
          </div>

          {/* Right Utility Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Country Selector Pill */}
            <button
              onClick={() => setCountryModalOpen(true)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-950 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 transition-all cursor-pointer shadow-2xs"
              title="Change Country"
            >
              <span className="text-base">{countryAdapter.flag}</span>
              <span className="hidden sm:inline font-bold">{activeCountry}</span>
            </button>

            {/* Active Farm Switcher (Shown in Row 1 on md+ desktop) */}
            <div className="hidden md:block">
              <FarmSwitcher currentLanguage={language} variant="nav" />
            </div>

            {/* AI Engine Status Pill */}
            <div className="relative">
              <button
                id="ai-status-indicator"
                onClick={() => setStatusTooltipOpen(!statusTooltipOpen)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[11px] font-semibold border transition-all cursor-pointer ${
                  hasGeminiKey
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
                    : 'bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800'
                }`}
                title="AI Engine Status"
              >
                <span
                  className={`w-2 h-2 rounded-full animate-pulse ${
                    hasGeminiKey ? 'bg-emerald-500' : 'bg-amber-500'
                  }`}
                />
                <span className="hidden sm:inline whitespace-nowrap">
                  {hasGeminiKey ? 'Gemini 3.1' : t.demoData}
                </span>
              </button>

              {statusTooltipOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-stone-900 rounded-xl shadow-xl border border-stone-200 dark:border-stone-800 p-3 z-50 text-xs animate-in fade-in">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-stone-100 dark:border-stone-800">
                    <span className="font-semibold text-stone-900 dark:text-stone-100">{t.aiSecurityStatus}</span>
                    <button
                      onClick={() => setStatusTooltipOpen(false)}
                      className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {hasGeminiKey ? (
                    <div className="space-y-1.5 text-stone-600 dark:text-stone-300">
                      <div className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                        <span>{t.liveGeminiActive}</span>
                      </div>
                      <p className="text-[11px] leading-relaxed text-stone-500 dark:text-stone-400">
                        {t.liveGeminiDesc}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-1.5 text-stone-600 dark:text-stone-300">
                      <div className="flex items-center gap-1 text-amber-700 dark:text-amber-400 font-medium">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                        <span>{t.offlineDemoMode}</span>
                      </div>
                      <p className="text-[11px] leading-relaxed text-stone-500 dark:text-stone-400">
                        {t.offlineDemoDesc}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Theme Toggle Button */}
            <button
              type="button"
              id="navbar-theme-toggle-btn"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? t.themeLight : t.themeDark}
              title={theme === 'dark' ? t.themeLight : t.themeDark}
              className="p-1.5 sm:p-2 rounded-xl bg-white dark:bg-stone-900 border border-[#D9E2D5] dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-500 shadow-2xs transition-colors cursor-pointer"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-stone-600 dark:text-stone-400" />
              )}
            </button>

            {/* Access Request / Permissions Modal Button */}
            <button
              type="button"
              id="open-access-request-modal-btn"
              onClick={() => setAccessModalOpen(true)}
              aria-label="Access Request Permissions"
              title="Access Request Permissions"
              className="p-1.5 sm:p-2 rounded-xl bg-white dark:bg-stone-900 border border-[#D9E2D5] dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-500 shadow-2xs transition-colors cursor-pointer"
            >
              <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </button>

              {/* Multilingual Selector (Official Eighth Schedule Indian Languages) */}
              <div className="relative" ref={langDropdownRef}>
                <button
                  id="language-selector-dropdown-btn"
                  onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                  className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 bg-white dark:bg-stone-900 border border-[#D9E2D5] dark:border-stone-800 hover:border-emerald-600 rounded-xl text-xs font-semibold text-stone-700 dark:text-stone-300 shadow-2xs transition-colors cursor-pointer"
                  title="Select Language"
                >
                  <Languages className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>{currentLangObj.flag}</span>
                  <span className="hidden sm:inline font-medium">{currentLangObj.nativeName}</span>
                  <ChevronDown className={`w-3 h-3 text-stone-400 transition-transform ${langDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {langDropdownOpen && (
                  <div className="absolute right-0 mt-1.5 w-52 max-h-72 overflow-y-auto bg-white dark:bg-stone-900 rounded-xl shadow-lg border border-stone-200 dark:border-stone-800 py-1 z-50 animate-in fade-in slide-in-from-top-1 duration-150 scrollbar-thin">
                    {INDIA_LANGUAGES.map((lang) => {
                      const isSelected = lang.code === language || lang.id === language;
                      return (
                        <button
                          key={lang.id}
                          id={`lang-select-${lang.code}`}
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
                              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-300 font-semibold'
                              : 'text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <span className="text-base">{lang.flag}</span>
                            <span>{lang.nativeName}</span>
                          </span>
                          {isSelected && <span className="text-emerald-600 dark:text-emerald-400 font-bold text-xs">✓</span>}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

            {/* User Account / Sign In */}
            {user ? (
              <div className="relative" ref={userDropdownRef}>
                <button
                  type="button"
                  id="user-profile-menu-btn"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-1.5 px-2 py-1 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-emerald-500 rounded-xl text-xs text-stone-800 dark:text-stone-200 transition-colors shadow-2xs cursor-pointer"
                >
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || 'User'}
                      referrerPolicy="no-referrer"
                      className="w-6 h-6 rounded-full object-cover border border-emerald-600 shrink-0"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                      {(user.displayName || user.email || 'U')[0].toUpperCase()}
                    </div>
                  )}
                  <span className="hidden sm:inline font-medium max-w-[90px] truncate">
                    {user.displayName || user.email?.split('@')[0]}
                  </span>
                  <ChevronDown className="w-3 h-3 text-stone-400" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-stone-900 rounded-2xl shadow-xl border border-stone-200 dark:border-stone-800 py-1.5 z-50 text-xs animate-fade-in">
                    <div className="px-3.5 py-2 border-b border-stone-100 dark:border-stone-800">
                      <p className="font-bold text-stone-900 dark:text-stone-100 truncate">
                        {user.displayName || 'Farmer'}
                      </p>
                      <p className="text-[11px] text-stone-500 dark:text-stone-400 truncate">{user.email}</p>
                      <div className="mt-1 inline-flex items-center gap-1 text-[10px] text-emerald-700 dark:text-emerald-400 font-medium px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/80">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{t.authenticatedUser}</span>
                      </div>
                    </div>

                    <div className="py-1">
                      <button
                        type="button"
                        id="user-menu-farms"
                        onClick={() => {
                          setActiveTab('farm-profile');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-3.5 py-2 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 text-left cursor-pointer"
                      >
                        <UserCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span>{t.myFarms}</span>
                      </button>

                      <button
                        type="button"
                        id="user-menu-privacy"
                        onClick={() => {
                          setPrivacyModalOpen(true);
                          setUserDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-3.5 py-2 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 text-left cursor-pointer"
                      >
                        <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span>{t.privacyDataTitle}</span>
                      </button>
                    </div>

                    <div className="pt-1 border-t border-stone-100 dark:border-stone-800">
                      <button
                        type="button"
                        id="user-menu-logout"
                        onClick={() => {
                          logout();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-3.5 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 text-left font-medium cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>{t.signOutBtn}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200/80 dark:border-emerald-800 px-2 py-0.5 rounded-lg whitespace-nowrap">
                  <Compass className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                  <span>{t.guestFarmer}</span>
                </span>
                <button
                  type="button"
                  id="navbar-signin-btn"
                  onClick={() => {
                    setAuthModalMode('login');
                    setAuthModalOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5 shrink-0" />
                  <span className="inline">{t.login}</span>
                </button>
              </div>
            )}

            {/* Mobile / Tablet Menu Toggle (Visible below md) */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 sm:p-2 rounded-xl text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* ROW 2: FULL DESKTOP NAVIGATION BAR (>= 768px / md) - EXACTLY ONE HORIZONTAL LINE */}
        <nav className="hidden md:flex flex-nowrap items-center justify-between gap-1 py-1.5 w-full overflow-x-auto no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-2 sm:px-2.5 lg:px-3 py-1.5 rounded-xl text-xs xl:text-sm font-semibold transition-all cursor-pointer shrink-0 whitespace-nowrap ${
                  isActive
                    ? 'bg-emerald-700 dark:bg-emerald-600 text-white shadow-xs'
                    : 'text-stone-700 dark:text-stone-300 hover:text-emerald-900 dark:hover:text-emerald-200 hover:bg-emerald-100/60 dark:hover:bg-emerald-950/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${isActive ? 'text-emerald-100' : 'text-stone-500 dark:text-stone-400'}`} />
                <span className="whitespace-nowrap">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Mobile / Tablet Drawer Menu (< md) */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E2E8DF] dark:border-stone-800 bg-white dark:bg-stone-900 px-4 pt-3 pb-5 space-y-3 shadow-xl max-h-[85vh] overflow-y-auto animate-in slide-in-from-top-2 duration-150">
          {/* Mobile Farm Switcher */}
          <div className="py-2 border-b border-stone-100 dark:border-stone-800">
            <FarmSwitcher currentLanguage={language} variant="inline" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-emerald-700 dark:bg-emerald-600 text-white shadow-xs'
                      : 'text-stone-700 dark:text-stone-200 hover:bg-emerald-50 dark:hover:bg-stone-800'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-stone-500 dark:text-stone-400'}`} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
            {user ? (
              <button
                type="button"
                id="mobile-logout-btn"
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 rounded-xl cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>{t.signOutBtn}</span>
              </button>
            ) : (
              <button
                type="button"
                id="mobile-login-btn"
                onClick={() => {
                  setAuthModalMode('login');
                  setAuthModalOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>{t.login}</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
