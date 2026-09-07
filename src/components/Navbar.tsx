import React, { useState } from 'react';
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
} from 'lucide-react';
import { ActiveTab, FarmProfile, Language } from '../types';
import { getTranslation } from '../i18n/translations';

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
  const t = getTranslation(language);

  const navItems = [
    { id: 'landing' as ActiveTab, label: t.navHome, icon: Home },
    { id: 'dashboard' as ActiveTab, label: t.navDashboard, icon: LayoutDashboard },
    { id: 'farm-profile' as ActiveTab, label: t.navFarmProfile, icon: UserCheck },
    { id: 'ai-advisor' as ActiveTab, label: t.navAdvisor, icon: Sparkles },
    { id: 'crop-doctor' as ActiveTab, label: t.navCropDoctor, icon: Stethoscope },
    { id: 'weather' as ActiveTab, label: t.navWeather, icon: CloudSun },
    { id: 'soil-health' as ActiveTab, label: t.navSoilHealth, icon: FlaskConical },
    { id: 'regenerative' as ActiveTab, label: t.navRegenerative, icon: Layers },
    { id: 'agrin-network' as ActiveTab, label: t.navAgriN, icon: Globe2 },
  ];

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
    <header className="sticky top-0 z-50 bg-[#F8FAF6]/95 backdrop-blur-md border-b border-[#E2E8DF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div
            id="brand-logo-btn"
            className="flex items-center gap-3 cursor-pointer select-none"
            onClick={() => setActiveTab('landing')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-green-800 flex items-center justify-center text-white shadow-sm shadow-emerald-900/10">
              <Sprout className="w-6 h-6 text-emerald-100" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-bold text-lg text-emerald-950 tracking-tight">
                  KhetiNexus <span className="text-emerald-600">AI</span>
                </span>
                <span className="hidden sm:inline-block text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  AgriN MVP
                </span>
              </div>
              <p className="hidden md:block text-[11px] text-stone-500 font-medium leading-none mt-0.5">
                Intelligent Agriculture. Regenerative Future.
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'text-stone-700 hover:text-emerald-900 hover:bg-emerald-50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-200' : 'text-stone-500'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Utility Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Active Farm Indicator */}
            <button
              id="active-farm-badge"
              onClick={() => setActiveTab('farm-profile')}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-white border border-[#D9E2D5] rounded-full text-xs text-stone-700 hover:border-emerald-500 transition-colors shadow-2xs"
              title="Active farm profile"
            >
              <span>{getCountryFlag(currentFarm.country)}</span>
              <span className="font-medium text-stone-800 max-w-[90px] truncate">{currentFarm.crop}</span>
              <span className="text-stone-400 text-[10px]">|</span>
              <span className="text-stone-500 text-[11px]">{currentFarm.country}</span>
            </button>

            {/* AI Engine Status Pill */}
            <div className="relative">
              <button
                id="ai-status-indicator"
                onClick={() => setStatusTooltipOpen(!statusTooltipOpen)}
                className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-[11px] font-semibold border transition-all ${
                  hasGeminiKey
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : 'bg-amber-50 text-amber-800 border-amber-300'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full animate-pulse ${
                    hasGeminiKey ? 'bg-emerald-500' : 'bg-amber-500'
                  }`}
                />
                <span className="hidden sm:inline">
                  {hasGeminiKey ? 'Gemini 3.8 AI' : 'Demo Engine'}
                </span>
              </button>

              {statusTooltipOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-stone-200 p-3 z-50 text-xs">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-stone-100">
                    <span className="font-semibold text-stone-900">AI Engine Security Status</span>
                    <button
                      onClick={() => setStatusTooltipOpen(false)}
                      className="text-stone-400 hover:text-stone-700"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {hasGeminiKey ? (
                    <div className="space-y-1.5 text-stone-600">
                      <div className="flex items-center gap-1 text-emerald-700 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Live Gemini 3.8 Flash Active</span>
                      </div>
                      <p className="text-[11px] leading-relaxed text-stone-500">
                        Requests are routed securely through the backend server. The GEMINI_API_KEY is never exposed to client browsers.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-1.5 text-stone-600">
                      <div className="flex items-center gap-1 text-amber-700 font-medium">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Operating in Offline Demo Mode</span>
                      </div>
                      <p className="text-[11px] leading-relaxed text-stone-500">
                        All agronomic workflows, diagnostics, and sample images function seamlessly with realistic demo intelligence.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Multilingual Selector */}
            <div className="flex items-center bg-white border border-[#D9E2D5] rounded-lg p-0.5 shadow-2xs">
              <button
                id="lang-en-btn"
                onClick={() => setLanguage('en')}
                className={`px-2 py-1 text-xs font-semibold rounded-md transition-colors ${
                  language === 'en'
                    ? 'bg-emerald-700 text-white'
                    : 'text-stone-600 hover:text-stone-950'
                }`}
              >
                EN
              </button>
              <button
                id="lang-hi-btn"
                onClick={() => setLanguage('hi')}
                className={`px-2 py-1 text-xs font-semibold rounded-md transition-colors ${
                  language === 'hi'
                    ? 'bg-emerald-700 text-white'
                    : 'text-stone-600 hover:text-stone-950'
                }`}
              >
                हिं
              </button>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#E2E8DF] bg-white px-4 pt-2 pb-4 space-y-1 shadow-lg">
          <div className="py-2 mb-2 border-b border-stone-100 flex items-center justify-between text-xs text-stone-500">
            <span>Selected Farm: <strong>{currentFarm.name}</strong> ({currentFarm.country})</span>
            <span>{currentFarm.crop}</span>
          </div>
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
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-emerald-700 text-white'
                    : 'text-stone-700 hover:bg-emerald-50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-stone-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
