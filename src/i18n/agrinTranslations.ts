import { Language } from '../types';
import { normalizeLang } from './farmValueTranslations';
import { LocalizedAgriNUIStrings, LocalizedAgriNNode, LocalizedSharedModule } from './locales/agrin/types';
import { agrinGlobalTranslations } from './locales/agrin/agrinGlobal';
import { agrinIndianPart1Translations } from './locales/agrin/agrinIndianPart1';
import { agrinIndianPart2Translations } from './locales/agrin/agrinIndianPart2';

const allAgriNTranslations: Record<string, LocalizedAgriNUIStrings> = {
  ...agrinGlobalTranslations,
  ...agrinIndianPart1Translations,
  ...agrinIndianPart2Translations,
};

export function getAgriNUIStrings(lang: Language): LocalizedAgriNUIStrings {
  const norm = normalizeLang(lang);
  return allAgriNTranslations[norm] || allAgriNTranslations['en'];
}

export function getLocalizedAgriNNodes(lang: Language): LocalizedAgriNNode[] {
  const ui = getAgriNUIStrings(lang);
  return ui.nodes || allAgriNTranslations['en'].nodes;
}

export function getLocalizedSharedModules(lang: Language): LocalizedSharedModule[] {
  const ui = getAgriNUIStrings(lang);
  return ui.modules || allAgriNTranslations['en'].modules;
}
