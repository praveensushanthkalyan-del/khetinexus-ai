// src/context/CountryContext.tsx
// Centralized Country & Language Context for BRICS-ready KhetiNexus AI

import React, { createContext, useContext, useState, useEffect } from 'react';
import { SupportedCountry, Language } from '../types';
import { CountryAdapterConfig, getCountryAdapter, BRICS_COUNTRIES_LIST } from '../data/countryAdapters';

interface CountryContextType {
  activeCountry: SupportedCountry;
  activeLanguage: Language;
  countryAdapter: CountryAdapterConfig;
  setCountry: (country: SupportedCountry) => void;
  setLanguage: (lang: Language) => void;
  countryModalOpen: boolean;
  setCountryModalOpen: (open: boolean) => void;
  switchCountryWithConfirmation: (newCountry: SupportedCountry) => void;
  pendingCountry: SupportedCountry | null;
  confirmCountrySwitch: () => void;
  cancelCountrySwitch: () => void;
}

const CountryContext = createContext<CountryContextType | undefined>(undefined);

interface CountryProviderProps {
  children: React.ReactNode;
  initialLanguage?: Language;
  onLanguageChange?: (lang: Language) => void;
}

export const CountryProvider: React.FC<CountryProviderProps> = ({
  children,
  initialLanguage = 'en-IN',
  onLanguageChange,
}) => {
  // Active Country State (Default to India)
  const [activeCountry, setActiveCountry] = useState<SupportedCountry>(() => {
    try {
      const saved = localStorage.getItem('khetinexus_active_country');
      if (saved && BRICS_COUNTRIES_LIST.some((c) => c.name === saved)) {
        return saved as SupportedCountry;
      }
    } catch (e) {}
    return 'India';
  });

  // Active Language State (Store separately per prompt requirement #2)
  const [activeLanguage, setActiveLanguage] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('khetinexus_active_language');
      if (saved) return saved;
    } catch (e) {}
    return initialLanguage;
  });

  const [countryModalOpen, setCountryModalOpen] = useState(false);
  const [pendingCountry, setPendingCountry] = useState<SupportedCountry | null>(null);

  const countryAdapter = getCountryAdapter(activeCountry);

  const setCountry = (newCountry: SupportedCountry) => {
    setActiveCountry(newCountry);
    try {
      localStorage.setItem('khetinexus_active_country', newCountry);
    } catch (e) {}
    // Suggest default language for the new country if user hasn't manually overridden or if requested
    const adapter = getCountryAdapter(newCountry);
    if (adapter && adapter.defaultLanguage) {
      setActiveLanguage(adapter.defaultLanguage);
      localStorage.setItem('khetinexus_active_language', adapter.defaultLanguage);
      if (onLanguageChange) {
        onLanguageChange(adapter.defaultLanguage);
      }
    }
  };

  const setLanguage = (newLang: Language) => {
    setActiveLanguage(newLang);
    try {
      localStorage.setItem('khetinexus_active_language', newLang);
      localStorage.setItem('khetinexus_language_selected', 'true');
    } catch (e) {}
    if (onLanguageChange) {
      onLanguageChange(newLang);
    }
  };

  const switchCountryWithConfirmation = (newCountry: SupportedCountry) => {
    if (newCountry === activeCountry) return;
    setCountry(newCountry);
  };

  const confirmCountrySwitch = () => {
    if (pendingCountry) {
      setCountry(pendingCountry);
      setPendingCountry(null);
    }
  };

  const cancelCountrySwitch = () => {
    setPendingCountry(null);
  };

  return (
    <CountryContext.Provider
      value={{
        activeCountry,
        activeLanguage,
        countryAdapter,
        setCountry,
        setLanguage,
        countryModalOpen,
        setCountryModalOpen,
        switchCountryWithConfirmation,
        pendingCountry,
        confirmCountrySwitch,
        cancelCountrySwitch,
      }}
    >
      {children}
    </CountryContext.Provider>
  );
};

export const useCountry = () => {
  const context = useContext(CountryContext);
  if (!context) {
    throw new Error('useCountry must be used within a CountryProvider');
  }
  return context;
};
