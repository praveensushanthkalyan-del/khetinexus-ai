import { Language } from '../types';
import { LocalizedRegenerativeUIStrings, LocalizedPillar } from './locales/regenerative/types';
import {
  REGEN_EN,
  REGEN_ES,
  REGEN_FR,
  REGEN_PT,
  REGEN_RU,
  REGEN_ZH,
  REGEN_AR,
} from './locales/regenerative/regenGlobal';
import {
  REGEN_HI,
  REGEN_TE,
  REGEN_TA,
  REGEN_KN,
  REGEN_ML,
} from './locales/regenerative/regenIndianPart1';
import {
  REGEN_MR,
  REGEN_GU,
  REGEN_BN,
  REGEN_PA,
  REGEN_OR,
  REGEN_AS,
  REGEN_UR,
} from './locales/regenerative/regenIndianPart2';
import { normalizeLang } from './farmValueTranslations';
import { REGENERATIVE_PRACTICES } from '../data/mockData';

export type { LocalizedRegenerativeUIStrings, LocalizedPillar };

export const REGENERATIVE_TRANSLATIONS: Record<string, LocalizedRegenerativeUIStrings> = {
  en: REGEN_EN,
  hi: REGEN_HI,
  te: REGEN_TE,
  ta: REGEN_TA,
  kn: REGEN_KN,
  ml: REGEN_ML,
  mr: REGEN_MR,
  gu: REGEN_GU,
  bn: REGEN_BN,
  pa: REGEN_PA,
  or: REGEN_OR,
  as: REGEN_AS,
  ur: REGEN_UR,
  ar: REGEN_AR,
  es: REGEN_ES,
  fr: REGEN_FR,
  pt: REGEN_PT,
  ru: REGEN_RU,
  zh: REGEN_ZH,
};

/**
 * Returns localized UI strings for the Regenerative Farming page in any user-selected language.
 */
export function getRegenerativeUIStrings(lang: Language): LocalizedRegenerativeUIStrings {
  const norm = normalizeLang(lang) || 'en';
  return REGENERATIVE_TRANSLATIONS[norm] || REGENERATIVE_TRANSLATIONS.en;
}

/**
 * Returns the 8 Pillars of Regenerative Agriculture localized for any user-selected language.
 */
export function getLocalizedPillars(lang: Language) {
  const norm = normalizeLang(lang) || 'en';
  const localizedData = REGENERATIVE_TRANSLATIONS[norm] || REGENERATIVE_TRANSLATIONS.en;

  return REGENERATIVE_PRACTICES.map((p) => {
    const loc = localizedData.pillars[p.id];
    if (!loc) return p;

    if (norm === 'en') {
      return {
        ...p,
        title: loc.title,
        tag: loc.tag,
        description: loc.description,
        benefits: loc.benefits,
        implementation: loc.implementation,
      };
    }

    // Clean any existing trailing brackets from loc.title or loc.tag
    const cleanLocTitle = loc.title.replace(/\s*\([^)]*\)$/, '').trim();
    const cleanLocTag = loc.tag.replace(/\s*\([^)]*\)$/, '').trim();

    return {
      ...p,
      title: `${cleanLocTitle} (${p.title})`,
      tag: `${cleanLocTag} (${p.tag})`,
      description: loc.description,
      benefits: loc.benefits,
      implementation: loc.implementation,
    };
  });
}
