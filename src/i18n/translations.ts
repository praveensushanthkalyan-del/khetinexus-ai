import { Language } from '../types';
import { TranslationDictionary } from './types';
import { en } from './locales/en';
import { ar } from './locales/ar';
import { as } from './locales/as';
import { bn } from './locales/bn';
import { es } from './locales/es';
import { fr } from './locales/fr';
import { gu } from './locales/gu';
import { hi } from './locales/hi';
import { kn } from './locales/kn';
import { ml } from './locales/ml';
import { mr } from './locales/mr';
import { or } from './locales/or';
import { pa } from './locales/pa';
import { pt } from './locales/pt';
import { ru } from './locales/ru';
import { ta } from './locales/ta';
import { te } from './locales/te';
import { ur } from './locales/ur';
import { zh } from './locales/zh';

export { type TranslationDictionary } from './types';

const dictionaries: Record<string, TranslationDictionary> = {
  'en-IN': en,
  'en': en,
  'ar': ar,
  'as-IN': as,
  'bn-IN': bn,
  'es': es,
  'fr': fr,
  'gu-IN': gu,
  'hi-IN': hi,
  'kn-IN': kn,
  'ml-IN': ml,
  'mr-IN': mr,
  'or-IN': or,
  'pa-IN': pa,
  'pt': pt,
  'ru': ru,
  'ta-IN': ta,
  'te-IN': te,
  'ur-IN': ur,
  'zh': zh,
};

export const GLOBAL_LANGUAGES = [
  { id: 'en-IN', code: 'en-IN', name: 'English', nativeName: 'English', shortCode: 'EN', label: 'EN', text: true, speechInput: true, speechOutput: true, flag: '🌐' },
  { id: 'te-IN', code: 'te-IN', name: 'Telugu', nativeName: 'తెలుగు', shortCode: 'TE', label: 'TE', text: true, speechInput: true, speechOutput: true, flag: '🌾' },
  { id: 'hi-IN', code: 'hi-IN', name: 'Hindi', nativeName: 'हिन्दी', shortCode: 'HI', label: 'HI', text: true, speechInput: true, speechOutput: true, flag: '🇮🇳' },
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
  { id: 'ar', code: 'ar', name: 'Arabic', nativeName: 'العربية', shortCode: 'AR', label: 'AR', text: true, speechInput: true, speechOutput: true, flag: '🌙' },
  { id: 'es', code: 'es', name: 'Spanish', nativeName: 'Español', shortCode: 'ES', label: 'ES', text: true, speechInput: true, speechOutput: true, flag: '🇪🇸' },
  { id: 'fr', code: 'fr', name: 'French', nativeName: 'Français', shortCode: 'FR', label: 'FR', text: true, speechInput: true, speechOutput: true, flag: '🇫🇷' },
  { id: 'pt', code: 'pt', name: 'Portuguese', nativeName: 'Português', shortCode: 'PT', label: 'PT', text: true, speechInput: true, speechOutput: true, flag: '🇧🇷' },
  { id: 'ru', code: 'ru', name: 'Russian', nativeName: 'Русский', shortCode: 'RU', label: 'RU', text: true, speechInput: true, speechOutput: true, flag: '🇷🇺' },
  { id: 'zh', code: 'zh', name: 'Chinese', nativeName: '中文', shortCode: 'ZH', label: 'ZH', text: true, speechInput: true, speechOutput: true, flag: '🇨🇳' },
];

export const INDIA_LANGUAGES = GLOBAL_LANGUAGES;

export const SUPPORTED_LANGUAGES = GLOBAL_LANGUAGES.map((l) => ({
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
    if (state.includes('telangana') || state.includes('andhra')) return 'te-IN' as Language;
    if (state.includes('tamil')) return 'ta-IN' as Language;
    if (state.includes('karnataka')) return 'kn-IN' as Language;
    if (state.includes('kerala')) return 'ml-IN' as Language;
    if (state.includes('maharashtra') || state.includes('mumbai') || state.includes('pune')) return 'mr-IN' as Language;
    if (state.includes('gujarat')) return 'gu-IN' as Language;
    if (state.includes('bengal') || state.includes('kolkata')) return 'bn-IN' as Language;
    if (state.includes('punjab')) return 'pa-IN' as Language;
    if (state.includes('odisha') || state.includes('orissa')) return 'or-IN' as Language;
    if (state.includes('assam')) return 'as-IN' as Language;

    const hindiStates = [
      'bihar', 'delhi', 'haryana', 'himachal', 'jharkhand', 'madhya pradesh',
      'rajasthan', 'uttar pradesh', 'uttarakhand', 'chhattisgarh', 'up', 'mp', 'ncr'
    ];
    if (hindiStates.some((hs) => state.includes(hs))) {
      return 'hi-IN' as Language;
    }
    return 'en-IN' as Language;
  }
  return 'en' as Language;
}

export function getTranslation(lang: Language | string): TranslationDictionary {
  let dict = en;
  const isEnglish = !lang || lang === 'en' || lang === 'en-IN';

  if (lang) {
    if (dictionaries[lang]) {
      dict = dictionaries[lang];
    } else if (dictionaries[`${lang}-IN`]) {
      dict = dictionaries[`${lang}-IN`];
    } else {
      const base = lang.split('-')[0];
      if (dictionaries[base]) {
        dict = dictionaries[base];
      } else if (dictionaries[`${base}-IN`]) {
        dict = dictionaries[`${base}-IN`];
      }
    }
  }

  // Create a Proxy to fall back to the English dictionary for any missing keys,
  // ensuring pure native script translation without appended English strings in brackets.
  return new Proxy(dict, {
    get(target, prop) {
      if (typeof prop === 'string') {
        let val = target[prop] !== undefined && target[prop] !== '' ? target[prop] : en[prop];
        if (!val) return '';

        if (isEnglish) return val;

        // Clean any bracketed English strings next to words in non-English modes
        if (typeof val === 'string') {
          val = val.replace(/\s*\([^)]*[a-zA-Z][^)]*\)/g, '').trim();
        }

        return val;
      }
      return Reflect.get(target, prop);
    },
  }) as TranslationDictionary;
}
