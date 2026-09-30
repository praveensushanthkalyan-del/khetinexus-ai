import { Language } from '../../types';
import { TranslationDictionary } from '../types';
import { pt } from '../locales/pt';
import { ru } from '../locales/ru';
import { zh } from '../locales/zh';

export interface InternationalLanguageConfig {
  code: Language;
  label: string;
  flag: string;
  name: string;
  nativeName: string;
  dictionary: TranslationDictionary;
}

export const BRICS_LANGUAGES: InternationalLanguageConfig[] = [
  { code: 'pt', label: 'PT', flag: '🇧🇷', name: 'Portuguese', nativeName: 'Português', dictionary: pt },
  { code: 'ru', label: 'RU', flag: '🇷🇺', name: 'Russian', nativeName: 'Русский', dictionary: ru },
  { code: 'zh', label: '中', flag: '🇨🇳', name: 'Chinese', nativeName: '简体中文', dictionary: zh },
];

/**
 * Modular BRICS / International Language Adapter
 * Allows plugging external non-Indian languages into the application
 * without cluttering the India-First farmer interface.
 */
export class BricsLanguageAdapter {
  private static registeredLanguages = new Map<Language, InternationalLanguageConfig>(
    BRICS_LANGUAGES.map((l) => [l.code, l])
  );

  static getLanguages(): InternationalLanguageConfig[] {
    return Array.from(this.registeredLanguages.values());
  }

  static registerLanguage(config: InternationalLanguageConfig): void {
    this.registeredLanguages.set(config.code, config);
  }

  static isBricsLanguage(code: Language): boolean {
    return this.registeredLanguages.has(code);
  }

  static getDictionary(code: Language): TranslationDictionary | undefined {
    return this.registeredLanguages.get(code)?.dictionary;
  }
}
