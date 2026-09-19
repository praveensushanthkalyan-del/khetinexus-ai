import { Language } from '../types';
import { TranslationDictionary } from './types';
import { en } from './locales/en';
import { hi } from './locales/hi';
import { te } from './locales/te';
import { ta } from './locales/ta';
import { kn } from './locales/kn';
import { ml } from './locales/ml';
import { mr } from './locales/mr';
import { gu } from './locales/gu';
import { bn } from './locales/bn';
import { pa } from './locales/pa';
import { or } from './locales/or';
import { as } from './locales/as';
import { ur } from './locales/ur';
import { pt } from './locales/pt';
import { ru } from './locales/ru';
import { zh } from './locales/zh';
import { BricsLanguageAdapter } from './adapters/bricsAdapter';

export { type TranslationDictionary } from './types';

export const translations: Record<string, TranslationDictionary> = {
  en,
  hi,
  te,
  ta,
  kn,
  ml,
  mr,
  gu,
  bn,
  pa,
  or,
  as,
  ur,
  pt,
  ru,
  zh,
};

export interface IndiaLanguageConfig {
  id: Language;
  code: Language;
  name: string;
  nativeName: string;
  shortCode: string;
  label: string;
  text: boolean;
  speechInput: boolean;
  speechOutput: boolean;
  flag: string;
}

/**
 * Official Eighth Schedule Languages of India (22 Languages + English)
 */
export const INDIA_LANGUAGES: IndiaLanguageConfig[] = [
  { id: 'en-IN', code: 'en-IN', name: 'English', nativeName: 'English', shortCode: 'EN', label: 'EN', text: true, speechInput: true, speechOutput: true, flag: '🌐' },
  { id: 'hi-IN', code: 'hi-IN', name: 'Hindi', nativeName: 'हिन्दी', shortCode: 'HI', label: 'HI', text: true, speechInput: true, speechOutput: true, flag: '🇮🇳' },
  { id: 'te-IN', code: 'te-IN', name: 'Telugu', nativeName: 'తెలుగు', shortCode: 'TE', label: 'TE', text: true, speechInput: true, speechOutput: true, flag: '🌾' },
  { id: 'ta-IN', code: 'ta-IN', name: 'Tamil', nativeName: 'தமிழ்', shortCode: 'TA', label: 'TA', text: true, speechInput: true, speechOutput: true, flag: '🌴' },
  { id: 'kn-IN', code: 'kn-IN', name: 'Kannada', nativeName: 'ಕನ್ನಡ', shortCode: 'KN', label: 'KN', text: true, speechInput: true, speechOutput: true, flag: '🌱' },
  { id: 'ml-IN', code: 'ml-IN', name: 'Malayalam', nativeName: 'മലയാളം', shortCode: 'ML', label: 'ML', text: true, speechInput: true, speechOutput: true, flag: '🥥' },
  { id: 'mr-IN', code: 'mr-IN', name: 'Marathi', nativeName: 'मराठी', shortCode: 'MR', label: 'MR', text: true, speechInput: true, speechOutput: true, flag: '🚜' },
  { id: 'gu-IN', code: 'gu-IN', name: 'Gujarati', nativeName: 'ગુજરાતી', shortCode: 'GU', label: 'GU', text: true, speechInput: true, speechOutput: true, flag: '🌻' },
  { id: 'bn-IN', code: 'bn-IN', name: 'Bengali', nativeName: 'বাংলা', shortCode: 'BN', label: 'BN', text: true, speechInput: true, speechOutput: true, flag: '💧' },
  { id: 'pa-IN', code: 'pa-IN', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', shortCode: 'PA', label: 'PA', text: true, speechInput: true, speechOutput: true, flag: '🌾' },
  { id: 'or-IN', code: 'or-IN', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', shortCode: 'OR', label: 'OR', text: true, speechInput: true, speechOutput: true, flag: '🍀' },
  { id: 'as-IN', code: 'as-IN', name: 'Assamese', nativeName: 'অসমীয়া', shortCode: 'AS', label: 'AS', text: true, speechInput: true, speechOutput: true, flag: '🌿' },
  { id: 'ur-IN', code: 'ur-IN', name: 'Urdu', nativeName: 'اردو', shortCode: 'UR', label: 'UR', text: true, speechInput: true, speechOutput: true, flag: '🕌' },
  { id: 'brx-IN', code: 'brx-IN', name: 'Bodo', nativeName: 'बर\'', shortCode: 'BRX', label: 'BRX', text: true, speechInput: false, speechOutput: false, flag: '🏔️' },
  { id: 'doi-IN', code: 'doi-IN', name: 'Dogri', nativeName: 'डोगरी', shortCode: 'DOI', label: 'DOI', text: true, speechInput: false, speechOutput: false, flag: '⛰️' },
  { id: 'ks-IN', code: 'ks-IN', name: 'Kashmiri', nativeName: 'कॉशुर / كأشُر', shortCode: 'KS', label: 'KS', text: true, speechInput: false, speechOutput: false, flag: '🌸' },
  { id: 'kok-IN', code: 'kok-IN', name: 'Konkani', nativeName: 'कोंकणी', shortCode: 'KOK', label: 'KOK', text: true, speechInput: true, speechOutput: false, flag: '🏖️' },
  { id: 'mai-IN', code: 'mai-IN', name: 'Maithili', nativeName: 'मैथिली', shortCode: 'MAI', label: 'MAI', text: true, speechInput: false, speechOutput: false, flag: '🌺' },
  { id: 'mni-IN', code: 'mni-IN', name: 'Manipuri', nativeName: 'মৈতৈলোন্', shortCode: 'MNI', label: 'MNI', text: true, speechInput: false, speechOutput: false, flag: '🌄' },
  { id: 'ne-IN', code: 'ne-IN', name: 'Nepali', nativeName: 'नेपाली', shortCode: 'NE', label: 'NE', text: true, speechInput: true, speechOutput: true, flag: '🏔️' },
  { id: 'sa-IN', code: 'sa-IN', name: 'Sanskrit', nativeName: 'संस्कृतम्', shortCode: 'SA', label: 'SA', text: true, speechInput: false, speechOutput: false, flag: '📜' },
  { id: 'sat-IN', code: 'sat-IN', name: 'Santali', nativeName: 'ᱥᱟᱱᱛᱟᱲᱤ', shortCode: 'SAT', label: 'SAT', text: true, speechInput: false, speechOutput: false, flag: '🌲' },
  { id: 'sd-IN', code: 'sd-IN', name: 'Sindhi', nativeName: 'सिन्धी / سنڌي', shortCode: 'SD', label: 'SD', text: true, speechInput: false, speechOutput: false, flag: '🌊' },
];

/**
 * Derived list of India-First supported languages
 */
export const SUPPORTED_LANGUAGES = INDIA_LANGUAGES.map((l) => ({
  code: l.code,
  shortCode: l.shortCode,
  name: l.name,
  label: l.label,
  flag: l.flag,
  nativeName: l.nativeName,
}));

/**
 * Location-based regional language recommendation
 */
export function getRecommendedLanguageForLocation(stateRegion?: string, country?: string): Language {
  const state = (stateRegion || '').toLowerCase();
  const c = (country || '').toLowerCase();

  if (c === 'india' || c === 'in' || state) {
    if (state.includes('telangana') || state.includes('andhra')) return 'te-IN';
    if (state.includes('tamil')) return 'ta-IN';
    if (state.includes('karnataka')) return 'kn-IN';
    if (state.includes('kerala')) return 'ml-IN';
    if (state.includes('maharashtra') || state.includes('mumbai') || state.includes('pune')) return 'mr-IN';
    if (state.includes('gujarat')) return 'gu-IN';
    if (state.includes('bengal') || state.includes('kolkata')) return 'bn-IN';
    if (state.includes('punjab')) return 'pa-IN';
    if (state.includes('odisha') || state.includes('orissa')) return 'or-IN';
    if (state.includes('assam')) return 'as-IN';
    if (state.includes('goa')) return 'kok-IN';
    if (state.includes('kashmir') || state.includes('jammu')) return 'ks-IN';
    if (state.includes('manipur')) return 'mni-IN';

    const hindiStates = [
      'bihar', 'delhi', 'haryana', 'himachal', 'jharkhand', 'madhya pradesh',
      'rajasthan', 'uttar pradesh', 'uttarakhand', 'chhattisgarh', 'up', 'mp', 'ncr'
    ];
    if (hindiStates.some((hs) => state.includes(hs))) {
      return 'hi-IN';
    }
    return 'en-IN';
  }
  return 'en';
}

export function getTranslation(lang: Language): TranslationDictionary {
  let lookupKey = lang;
  if (lang === 'hi-IN' || lang === 'hi') {
    lookupKey = 'hi';
  } else if (lang === 'en-IN' || lang === 'en') {
    lookupKey = 'en';
  } else if (lang.includes('-')) {
    lookupKey = lang.split('-')[0];
  }

  let selected = translations[lookupKey];
  if (!selected) {
    selected = BricsLanguageAdapter.getDictionary(lang) || translations.en;
  }
  const fallback = translations.en;

  // Proxy guarantees missing dictionary keys fall back to English
  return new Proxy(selected, {
    get(target, prop: string) {
      if (prop in target) {
        const val = (target as any)[prop];
        if (val !== undefined && val !== null && val !== '') {
          return val;
        }
      }
      return (fallback as any)[prop] || '';
    },
  });
}

