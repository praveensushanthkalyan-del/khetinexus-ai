// src/components/CountrySelectionModal.tsx
// BRICS Country Selection Modal / Onboarding Step

import React, { useState } from 'react';
import { Globe2, Check, ArrowRight, ShieldCheck, Languages } from 'lucide-react';
import { useCountry } from '../context/CountryContext';
import { BRICS_COUNTRIES_LIST, getCountryAdapter } from '../data/countryAdapters';
import { SUPPORTED_LANGUAGES } from '../i18n/translations';
import { SupportedCountry, Language } from '../types';

interface CountrySelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: () => void;
  isInitialSetup?: boolean;
}

export const CountrySelectionModal: React.FC<CountrySelectionModalProps> = ({
  isOpen,
  onClose,
  onComplete,
  isInitialSetup = false,
}) => {
  const { activeCountry, setCountry, activeLanguage, setLanguage } = useCountry();
  const [selectedCountry, setSelectedCountry] = useState<SupportedCountry>(activeCountry);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(activeLanguage);
  const [step, setStep] = useState<'country' | 'language'>('country');

  if (!isOpen) return null;

  const handleCountryNext = () => {
    setCountry(selectedCountry);
    setStep('language');
  };

  const handleFinish = () => {
    setCountry(selectedCountry);
    setLanguage(selectedLanguage);
    if (onComplete) onComplete();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-[#0b1f14] border border-emerald-900/20 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-emerald-800 to-green-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-emerald-200">
              <Globe2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-heading">
                {step === 'country' ? 'Select Your Country' : 'Select Your Preferred Language'}
              </h2>
              <p className="text-xs text-emerald-200/80">
                {step === 'country'
                  ? 'Choose your country to personalize KhetiNexus AI for your agricultural region.'
                  : 'Country and language are independent. Choose your language.'}
              </p>
            </div>
          </div>
          <div className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/10 text-emerald-200">
            {step === 'country' ? 'Step 1 of 2' : 'Step 2 of 2'}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {step === 'country' ? (
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {BRICS_COUNTRIES_LIST.map((c) => {
                  const isSelected = selectedCountry === c.name;
                  return (
                    <div
                      key={c.code}
                      onClick={() => setSelectedCountry(c.name)}
                      className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-100 shadow-sm'
                          : 'border-stone-200 dark:border-emerald-900/50 hover:border-emerald-400 bg-white dark:bg-[#07130b] text-stone-800 dark:text-stone-200'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-2xl shrink-0">{c.flag}</span>
                        <div className="min-w-0">
                          <p className="font-semibold text-sm truncate">{c.name}</p>
                          <p className="text-[11px] text-stone-500 dark:text-stone-400 truncate">
                            {c.nativeName} • {c.region}
                          </p>
                        </div>
                      </div>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-2 mb-3 text-xs text-stone-600 dark:text-stone-400 font-medium">
                <Languages className="w-4 h-4 text-emerald-600" />
                <span>Languages Available for {selectedCountry}</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-72 overflow-y-auto pr-1">
                {getCountryAdapter(selectedCountry).supportedLanguages.map((l) => {
                  const isSelected = selectedLanguage === l.code;
                  return (
                    <div
                      key={l.code}
                      onClick={() => setSelectedLanguage(l.code as Language)}
                      className={`p-3 rounded-lg border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-950 dark:text-emerald-100 font-medium'
                          : 'border-stone-200 dark:border-emerald-900/40 hover:border-emerald-400 bg-white dark:bg-[#07130b] text-stone-800 dark:text-stone-200'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-lg shrink-0">{(l as any).flag || getCountryAdapter(selectedCountry).flag}</span>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold truncate">{l.name}</p>
                          <p className="text-[10px] text-stone-500 truncate">{l.nativeName}</p>
                        </div>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-stone-50 dark:bg-emerald-950/30 border-t border-stone-200 dark:border-emerald-900/50 flex items-center justify-between">
          {step === 'language' ? (
            <button
              onClick={() => setStep('country')}
              className="px-4 py-2 text-xs font-semibold text-stone-600 dark:text-stone-300 hover:text-stone-900 cursor-pointer"
            >
              Back to Country
            </button>
          ) : (
            <div className="text-xs text-stone-500 dark:text-stone-400">
              Selected: <strong className="text-emerald-700 dark:text-emerald-300">{selectedCountry}</strong>
            </div>
          )}

          <div className="flex items-center gap-2">
            {!isInitialSetup && (
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-stone-600 dark:text-stone-400 hover:bg-stone-200/50 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
            )}
            {step === 'country' ? (
              <button
                onClick={handleCountryNext}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-md transition-all cursor-pointer"
              >
                <span>Next: Language</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={handleFinish}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-md transition-all cursor-pointer"
              >
                <span>Save & Personalize</span>
                <ShieldCheck className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
