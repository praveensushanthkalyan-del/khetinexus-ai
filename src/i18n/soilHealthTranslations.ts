import { Language } from '../types';
import { LocalizedSoilHealthUIStrings } from './locales/soil/types';
import { SOIL_EN, SOIL_ES, SOIL_FR, SOIL_PT, SOIL_RU, SOIL_ZH, SOIL_AR } from './locales/soil/soilGlobal';
import { SOIL_HI, SOIL_TE, SOIL_TA, SOIL_KN, SOIL_ML } from './locales/soil/soilIndianPart1';
import { SOIL_MR, SOIL_GU, SOIL_BN, SOIL_PA, SOIL_OR, SOIL_AS, SOIL_UR } from './locales/soil/soilIndianPart2';
import { normalizeLang } from './farmValueTranslations';
import {
  localizeRegionalDeficiencyExtended,
  localizeRegenerativePracticeExtended,
  COMPOUND_SOIL_TEXTURE_MAP,
  localizeDatasetName,
  localizePrimarySoilType,
} from './soilRegionalTranslations';

export { localizeDatasetName, localizePrimarySoilType };

export type { LocalizedSoilHealthUIStrings };

export const SOIL_TRANSLATIONS: Record<Language, LocalizedSoilHealthUIStrings> = {
  en: SOIL_EN,
  hi: SOIL_HI,
  te: SOIL_TE,
  ta: SOIL_TA,
  kn: SOIL_KN,
  ml: SOIL_ML,
  mr: SOIL_MR,
  gu: SOIL_GU,
  bn: SOIL_BN,
  pa: SOIL_PA,
  or: SOIL_OR,
  as: SOIL_AS,
  ur: SOIL_UR,
  ar: SOIL_AR,
  es: SOIL_ES,
  fr: SOIL_FR,
  pt: SOIL_PT,
  ru: SOIL_RU,
  zh: SOIL_ZH,
};

export function getSoilHealthUIStrings(lang: Language): LocalizedSoilHealthUIStrings {
  const norm = (normalizeLang(lang) || 'en') as Language;
  return SOIL_TRANSLATIONS[norm] || SOIL_TRANSLATIONS.en;
}

/**
 * Localizes fertility, drainage, salinity and general soil quality rating tags
 */
export function localizeSoilRating(rating: string | undefined | null, lang: Language): string {
  if (!rating) return '';
  const ui = getSoilHealthUIStrings(lang);
  const raw = rating.trim();
  const lower = raw.toLowerCase();

  // 1. Exact English matches
  if (lower === 'low' || lower === 'deficient' || lower === 'deficit' || lower === 'very low' || lower === 'poor' || lower === 'severe' || lower === 'कम' || lower === 'तక్కువ' || lower === 'குறைவு' || lower === 'ಕಡಿಮೆ' || lower === 'കുറവ്' || lower === 'कमी' || lower === 'ઓછું' || lower === 'কম' || lower === 'ਘੱਟ' || lower === 'କମ୍' || lower === 'کم') {
    return ui.ratingLow || 'Low';
  }
  if (lower === 'medium' || lower === 'med' || lower === 'moderate' || lower === 'average' || lower === 'मध्यम' || lower === 'మధ్యస్థం' || lower === 'நடுத்தர' || lower === 'மிதமான' || lower === 'ಮಧ್ಯಮ' || lower === 'ഇടത്തരം' || lower === 'মাঝারি' || lower === 'ਦਰਮਿਆਨਾ' || lower === 'ମଧ୍ୟମ' || lower === 'درمیانہ') {
    return ui.ratingMedium || 'Medium';
  }
  if (lower === 'optimal' || lower === 'optimum' || lower === 'adequate' || lower === 'sufficient' || lower === 'good' || lower === 'balanced' || lower === 'इष्टतम' || lower === 'अनुकूल' || lower === 'संतुलित' || lower === 'అనుకూలం' || lower === 'అనుకూలం (సరైనది)' || lower === 'సరైనది' || lower === 'ఉత్తమం' || lower === 'உகந்தது' || lower === 'சீர்மிகு' || lower === 'ಸೂಕ್ತ' || lower === 'ಅನುಕೂಲ' || lower === 'അനുയോജ്യം' || lower === 'योग्य' || lower === 'યોગ્ય' || lower === 'অনুকূল' || lower === 'উপযুক্ত' || lower === 'ਢੁਕਵਾਂ' || lower === 'ଉପଯୁକ୍ତ' || lower === 'مناسب') {
    return ui.ratingOptimal || 'Optimal';
  }
  if (lower === 'high' || lower === 'excessive' || lower === 'very high' || lower === 'rich' || lower === 'उच्च' || lower === 'अधिक' || lower === 'ఎక్కువ' || lower === 'అధికం' || lower === 'அதிகம்' || lower === 'உயர்' || lower === 'ಹೆಚ್ಚು' || lower === 'ಅಧಿಕ' || lower === 'കൂടുതൽ' || lower === 'जास्त' || lower === 'વધારે' || lower === 'উচ্চ' || lower === 'ਵੱਧ' || lower === 'ଅଧିକ' || lower === 'زیادہ') {
    return ui.ratingHigh || 'High';
  }
  if (lower === 'acidic' || lower === 'acid' || lower === 'आम्लीय' || lower === 'ఆమ్లయుతం' || lower === 'ఆమ్ల' || lower === 'அமில' || lower === 'ಆಮ್ಲೀಯ' || lower === 'അമ്ലം') {
    return ui.ratingAcidic || 'Acidic';
  }
  if (lower === 'alkaline' || lower === 'alkali' || lower === 'क्षारीय' || lower === 'క్షారయుతం' || lower === 'క్షార' || lower === 'கார' || lower === 'ಕ್ಷಾರೀಯ' || lower === 'ക്ഷാരം') {
    return ui.ratingAlkaline || 'Alkaline';
  }
  if (lower === 'neutral' || lower === 'तटस्थ' || lower === 'తటస్థం' || lower === 'நடுநிலை' || lower === 'ತಟಸ್ಥ' || lower === 'ന്യൂട്രൽ') {
    return ui.ratingNeutral || 'Neutral';
  }
  if (lower === 'saline' || lower === 'लवणीय' || lower === 'లవణయుతం' || lower === 'உப்பு' || lower === 'ಉಪ್ಪು' || lower === 'ഉപ്പുരസം') {
    return ui.ratingSaline || 'Saline';
  }
  if (lower === 'non-saline' || lower === 'अलवणीय' || lower === 'ఉప్పులేనిది' || lower === 'உப்பற்ற' || lower === 'ಉಪ್ಪಿಲ್ಲದ') {
    return ui.ratingNonSaline || 'Non-Saline';
  }
  if (lower === 'not provided' || lower === 'not tested' || lower === 'untested' || lower === 'नमोदित नहीं' || lower === 'నమోదు చేయలేదు' || lower === 'பரிசோதிக்கப்படவில்லை' || lower === 'ಪರೀಕ್ಷಿಸಲಾಗಿಲ್ಲ') {
    return ui.notTested || ui.ratingNotProvided || 'Not Tested';
  }

  // 2. Substring detection
  if (lower.includes('low') || lower.includes('कम') || lower.includes('తక్కువ') || lower.includes('defic')) {
    return ui.ratingLow || 'Low';
  }
  if (lower.includes('med') || lower.includes('mod') || lower.includes('मध्यम') || lower.includes('మధ్య')) {
    return ui.ratingMedium || 'Medium';
  }
  if (lower.includes('opt') || lower.includes('adeq') || lower.includes('इष्टतम') || lower.includes('अनुकूल') || lower.includes('సరైన') || lower.includes('good')) {
    return ui.ratingOptimal || 'Optimal';
  }
  if (lower.includes('high') || lower.includes('उच्च') || lower.includes('अधिक') || lower.includes('ఎక్కువ')) {
    return ui.ratingHigh || 'High';
  }

  return raw;
}

/**
 * Common soil texture terms localized across Indian & global regional contexts
 */
export const SOIL_TEXTURE_MAP: Record<string, Partial<Record<Language, string>>> = {
  'clayey': {
    hi: 'चिकनी', te: 'బంకమట్టి', ta: 'களிமண்', kn: 'ಜೇಡಿಮಣ್ಣು', ml: 'കളിമണ്ണ്', mr: 'काळी चिकन', gu: 'ચીકણી', bn: 'এঁটেল', pa: 'ਚੀਕਣੀ', or: 'କାଦୁଆ', as: 'বোকা মাটি', ur: 'چکنی مٹی', es: 'Arcilloso', fr: 'Argileux', pt: 'Argiloso', ru: 'Глинистая', zh: '黏质', ar: 'طيني'
  },
  'loamy': {
    hi: 'दोमट', te: 'దుబ్బ / ఒండ్రు', ta: 'வண்டல்', kn: 'ಗೋಡು', ml: 'എക്കൽ', mr: 'पोयटा / दुमट', gu: 'ગોરાડુ / ગોરાટ', bn: 'দোআঁশ', pa: 'ਦੋਮਟ', or: 'ଦୋରସା', as: 'পলসুৱা', ur: 'دوماٹ مٹی', es: 'Franco', fr: 'Limoneux', pt: 'Franco', ru: 'Суглинок', zh: '壤土', ar: 'طفالي'
  },
  'sandy loam': {
    hi: 'बलुई दोमट', te: 'ఇసుక దుబ్బ', ta: 'மணல் வண்டல்', kn: 'ಮರಳು ಗೋಡು', ml: 'മണൽ കലർന്ന എക്കൽ', mr: 'रेतीयुक्त दुमट', gu: 'રેતાળ ગોરાડુ', bn: 'বেলে দোআঁশ', pa: 'ਰੇਤਲੀ ਦੋਮਟ', or: 'ବାଲିଆ ଦୋରସା', as: 'বালি পলসুৱা', ur: 'ریتلی دوماٹ', es: 'Franco arenoso', fr: 'Limon sableux', pt: 'Franco-arenoso', ru: 'Супесчаный', zh: '砂质壤土', ar: 'طمي رملي'
  },
  'clay': {
    hi: 'चिकनी मिट्टी', te: 'బంక నేల', ta: 'களிமண் நிலம்', kn: 'ಜೇಡಿ ಮಣ್ಣು', ml: 'കളിമണ്ണ്', mr: 'चिकनमाती', gu: 'ચીકણી માટી', bn: 'এঁটেল মাটি', pa: 'ਚੀਕਣੀ ਮਿੱਟੀ', or: 'ମଟାଳ ମାଟି', as: 'বোকা মাটি', ur: 'چکنی مٹی', es: 'Arcilla', fr: 'Argile', pt: 'Argila', ru: 'Глина', zh: '黏土', ar: 'طين'
  },
  'silt loam': {
    hi: 'गाद दोमट', te: 'మెత్తని ఒండ్రు', ta: 'வண்டல் மண்', kn: 'ಮೆಕ್ಕಲು ಗೋಡು', ml: 'എക്കൽ മണ്ണ്', mr: 'गाळाची दुमट', gu: 'કાંપવાળી ગોરાડુ', bn: 'পলি দোআঁশ', pa: 'ਸਿਲਟ ਦੋਮਟ', or: 'ପଟୁ ଦୋରସା', as: 'পলি দোমট', ur: 'سلٹ دوماٹ', es: 'Franco limoso', fr: 'Limon très fin', pt: 'Franco-siltoso', ru: 'Пылеватый суглинок', zh: '粉砂质壤土', ar: 'طمي غريني'
  },
  'sandy': {
    hi: 'बलुई / रेतीली', te: 'ఇసుక నేల', ta: 'மணற்பாங்கான', kn: 'ಮರಳು ಮಣ್ಣು', ml: 'മണൽ മണ്ണ്', mr: 'वाळूमय / रेताळ', gu: 'રેતાળ', bn: 'বেলে মাটি', pa: 'ਰੇਤਲੀ', or: 'ବାଲିଆ', as: 'বালি মাটি', ur: 'ریتلی مٹی', es: 'Arenoso', fr: 'Sableux', pt: 'Arenoso', ru: 'Песчаный', zh: '砂质', ar: 'رملي'
  },
  'deep clayey': {
    hi: 'गहरी चिकनी', te: 'లోతైన బంకమట్టి', ta: 'ஆழமான களிமண்', kn: 'ಆಳವಾದ ಜೇಡಿಮಣ್ಣು', ml: 'ആഴമേറിയ കളിമണ്ണ്', mr: 'खोल काळी चिकन', gu: 'ઊંડી ચીકણી', bn: 'গভীর এঁটেল', pa: 'ਡੂੰਘੀ ਚੀਕਣੀ', or: 'ଗଭୀର କାଦୁଆ', as: 'গভীৰ বোকা', ur: 'گہری چکنی', es: 'Arcilloso profundo', fr: 'Argileux profond', pt: 'Argiloso profundo', ru: 'Глубокая глина', zh: '深层黏土', ar: 'طيني عميق'
  },
  'medium black clayey': {
    hi: 'मध्यम काली चिकनी', te: 'మధ్యస్థ నల్ల బంకమట్టి', ta: 'நடுத்தர கருப்பு களிமண்', kn: 'ಮಧ್ಯಮ ಕಪ್ಪು ಜೇಡಿಮಣ್ಣು', ml: 'ഇടത്തരം കറുത്ത കളിമണ്ണ്', mr: 'मध्यम काळी चिकन', gu: 'મધ્યમ કાળી ચીકણી', bn: 'মাঝারি কালো এঁটেল', pa: 'ਦਰਮਿਆਨੀ ਕਾਲੀ ਚੀਕਣੀ', or: 'ମଧ୍ୟମ କଳା ମାଟି', as: 'মধ্যমীয়া ক’লা মাটি', ur: 'درمیانی کالی چکنی', es: 'Arcilloso negro medio', fr: 'Argileux noir moyen', pt: 'Argiloso preto médio', ru: 'Среднечерноземная глина', zh: '中度黑黏土', ar: 'طيني أسود متوسط'
  }
};

export function localizeSoilTexture(texture: string | undefined | null, lang: Language): string {
  if (!texture) return '';
  const norm = (normalizeLang(lang) || 'en').toLowerCase();
  if (norm === 'en') return texture;

  const lower = texture.trim().toLowerCase();

  // 1. Check compound textures first for full sentence translation
  for (const [key, mapping] of Object.entries(COMPOUND_SOIL_TEXTURE_MAP)) {
    if (lower === key || lower.includes(key) || key.includes(lower)) {
      if (mapping[norm]) return mapping[norm]!;
    }
  }

  // 2. Check atomic textures with fallback replacement
  for (const [key, mapping] of Object.entries(SOIL_TEXTURE_MAP)) {
    if (lower === key || lower.includes(key)) {
      const match = mapping[norm as Language];
      if (match) {
        return texture.toLowerCase().replace(key, match);
      }
    }
  }
  return texture;
}

/**
 * Drainage classification localization
 */
export const DRAINAGE_MAP: Record<string, Partial<Record<Language, string>>> = {
  'well drained': {
    hi: 'उत्कृष्ट जल निकासी', te: 'మంచి నీటి పారుదల', ta: 'நல்ல வடிகால் வசதி', kn: 'ಉತ್ತಮ ನೀರು ಬಸಿದುಹೋಗುವಿಕೆ', ml: 'നല്ല നീർവാർച്ചയുള്ളത്', mr: 'चांगला निचरा', gu: 'સારો નિકાલ', bn: 'উত্তম নিষ্কাশন', pa: 'ਵਧੀਆ ਜਲ ਨਿਕਾਸ', or: 'ଉତ୍ତମ ଜଳ ନିଷ୍କାସନ', as: 'ভাল পানী ওলোৱা ব্যৱস্থা', ur: 'بہترین نکاسی آب', es: 'Bien drenado', fr: 'Bien drainé', pt: 'Bem drenado', ru: 'Хорошо дренированная', zh: '排水良好', ar: 'جيد الصرف'
  },
  'moderately well drained': {
    hi: 'मध्यम जल निकासी', te: 'మితమైన నీటి పారుదల', ta: 'மிதமான வடிகால் வசதி', kn: 'ಸಾಧಾರಣ ನೀರು ಬಸಿದುಹೋಗುವಿಕೆ', ml: 'മിതമായ നീർവാർച്ച', mr: 'मध्यम निचरा', gu: 'મધ્યમ નિકાલ', bn: 'মাঝারি নিষ্কাশন', pa: 'ਦਰਮਿਆਨਾ ਜਲ ਨਿਕਾਸ', or: 'ମଧ୍ୟମ ଜଳ ନିଷ୍କାସନ', as: 'মধ্যমীয়া পানী নিষ্কাশন', ur: 'درمیانی نکاسی آب', es: 'Moderadamente bien drenado', fr: 'Modérément bien drainé', pt: 'Moderadamente bem drenado', ru: 'Умеренно дренированная', zh: '排水中等良好', ar: 'معتدل الصرف'
  },
  'poorly drained': {
    hi: 'धीमी/खराब जल निकासी', te: 'తక్కువ నీటి పారుదల', ta: 'மோசமான வடிகால்', kn: 'ಕಳಪೆ ನೀರು ಬಸಿದುಹೋಗುವಿಕೆ', ml: 'കുറഞ്ഞ നീർവാർച്ച', mr: 'कमी निचरा', gu: 'નબળો નિકાલ', bn: 'ধীর নিষ্কাশন', pa: 'ਮੰਦਾ ਜਲ ਨਿਕਾਸ', or: 'ମନ୍ଥର ଜଳ ନିଷ୍କାସନ', as: 'লেহেমীয়া পানী নিষ্কাশন', ur: 'ناقص نکاسی آب', es: 'Mal drenado', fr: 'Mal drainé', pt: 'Mal drenado', ru: 'Плохо дренированная', zh: '排水不良', ar: 'سيئ الصرف'
  },
  'excessively drained': {
    hi: 'अत्यधिक तीव्र जल निकासी', te: 'అధిక నీటి పారుదల', ta: 'அதிகப்படியான வடிகால்', kn: 'ಅತಿಯಾದ ನೀರು ಬಸಿದುಹೋಗುವಿಕೆ', ml: 'അമിത നീർവാർച്ച', mr: 'अतिजलद निचरा', gu: 'અતિ ઝડપી નિકાલ', bn: 'অত্যধিক দ্রুত নিষ্কাশন', pa: 'ਬਹੁਤ ਤੇਜ਼ ਜਲ ਨਿਕਾਸ', or: 'ଅତ୍ୟଧିକ ଜଳ ନିଷ୍କାସନ', as: 'অত্যধিক পানী নিষ্কাশন', ur: 'ضرورت سے زیادہ نکاسی آب', es: 'Excesivamente drenado', fr: 'Excessivement drainé', pt: 'Excessivamente drenado', ru: 'Чрезмерно дренированная', zh: '排水过快', ar: 'مفرط الصرف'
  }
};

export function localizeDrainageClass(drainage: string | undefined | null, lang: Language): string {
  if (!drainage) return '';
  const norm = (normalizeLang(lang) || 'en') as Language;
  if (norm === 'en') return drainage;

  const lower = drainage.trim().toLowerCase();
  for (const [key, mapping] of Object.entries(DRAINAGE_MAP)) {
    if (lower === key || lower.includes(key)) {
      return mapping[norm] || drainage;
    }
  }
  return drainage;
}

/**
 * Water retention capability localization
 */
export const WATER_RETENTION_MAP: Record<string, Partial<Record<Language, string>>> = {
  'very high': {
    hi: 'अति उच्च', te: 'చాలా ఎక్కువ', ta: 'மிக அதிகம்', kn: 'ಬಹಳ ಹೆಚ್ಚು', ml: 'വളരെ ഉയർന്നത്', mr: 'अतिशय उच्च', gu: 'ખૂબ ઊંચી', bn: 'অত্যন্ত উচ্চ', pa: 'ਬਹੁਤ ਉੱਚੀ', or: 'ଅତି ଅଧିକ', as: 'অতি উচ্চ', ur: 'بہت زیادہ', es: 'Muy alta', fr: 'Très élevée', pt: 'Muito alta', ru: 'Очень высокая', zh: '极高', ar: 'عالية جداً'
  },
  'high': {
    hi: 'उच्च', te: 'ఎక్కువ', ta: 'அதிகம்', kn: 'ಹೆಚ್ಚು', ml: 'ഉയർന്നത്', mr: 'जास्त / उच्च', gu: 'ઊંચી', bn: 'উচ্চ', pa: 'ਉੱਚੀ', or: 'ଅଧିକ', as: 'উচ্চ', ur: 'زیادہ', es: 'Alta', fr: 'Élevée', pt: 'Alta', ru: 'Высокая', zh: '高', ar: 'عالية'
  },
  'medium': {
    hi: 'मध्यम', te: 'మధ్యస్థం', ta: 'நடுத்தரம்', kn: 'ಮಧ್ಯಮ', ml: 'മിതമായത്', mr: 'मध्यम', gu: 'મધ્યમ', bn: 'মাঝারি', pa: 'ਦਰਮਿਆਨੀ', or: 'ମଧ୍ୟମ', as: 'মধ্যমীয়া', ur: 'درمیانی', es: 'Media', fr: 'Moyenne', pt: 'Média', ru: 'Средняя', zh: '中等', ar: 'متوسطة'
  },
  'low': {
    hi: 'कम', te: 'తక్కువ', ta: 'குறைவு', kn: 'ಕಡಿಮೆ', ml: 'കുറഞ്ഞത്', mr: 'कमी', gu: 'ઓછી', bn: 'কম', pa: 'ਘੱਟ', or: 'କମ', as: 'কম', ur: 'کم', es: 'Baja', fr: 'Faible', pt: 'Baixa', ru: 'Низкая', zh: '低', ar: 'منخفضة'
  },
  'moderate': {
    hi: 'संतुलित / सामान्य', te: 'సాధారణ', ta: 'மிதமான', kn: 'ಸಾಧಾರಣ', ml: 'സാധാരണ', mr: 'साधारण', gu: 'સાધારણ', bn: 'পরিমিত', pa: 'ਦਰਮਿਆਨੀ', or: 'ସାଧାରଣ', as: 'সাধাৰণ', ur: 'معتدل', es: 'Moderada', fr: 'Modérée', pt: 'Moderada', ru: 'Умеренная', zh: '适度', ar: 'معتدلة'
  }
};

export function localizeWaterRetention(retention: string | undefined | null, lang: Language): string {
  if (!retention) return '';
  const norm = (normalizeLang(lang) || 'en') as Language;
  if (norm === 'en') return retention;

  const lower = retention.trim().toLowerCase();
  for (const [key, mapping] of Object.entries(WATER_RETENTION_MAP)) {
    if (lower === key || lower.includes(key)) {
      return mapping[norm] || retention;
    }
  }
  return retention;
}

/**
 * Micronutrients with chemical symbols
 */
export const MICRONUTRIENT_MAP: Record<string, Partial<Record<Language, string>>> = {
  'zinc': {
    hi: 'जिंक (Zn)', te: 'జింక్ / జింకు (Zn)', ta: 'துத்தநாகம் (Zn)', kn: 'ಸತು (Zn)', ml: 'സിങ്ക് (Zn)', mr: 'जस्त (Zn)', gu: 'ઝીંક (Zn)', bn: 'দস্তা (Zn)', pa: 'ਜਿੰਕ (Zn)', or: 'ଦସ୍ତା (Zn)', as: 'জিংক (Zn)', ur: 'زنک (Zn)', es: 'Zinc (Zn)', fr: 'Zinc (Zn)', pt: 'Zinco (Zn)', ru: 'Цинк (Zn)', zh: '锌 (Zn)', ar: 'زنك (Zn)'
  },
  'iron': {
    hi: 'आयरन / लोहा (Fe)', te: 'ఇనుము / ఐరన్ (Fe)', ta: 'இரும்புச்சத்து (Fe)', kn: 'ಕಬ್ಬಿಣಾಂಶ (Fe)', ml: 'ഇരുമ്പ് (Fe)', mr: 'लोह (Fe)', gu: 'લોહતત્વ (Fe)', bn: 'লোহা (Fe)', pa: 'ਲੋਹਾ (Fe)', or: 'ଲୁହା (Fe)', as: 'লোহা (Fe)', ur: 'آئرن / لوہا (Fe)', es: 'Hierro (Fe)', fr: 'Fer (Fe)', pt: 'Ferro (Fe)', ru: 'Железо (Fe)', zh: '铁 (Fe)', ar: 'حديد (Fe)'
  },
  'boron': {
    hi: 'बोरॉन (B)', te: 'బోరాన్ (B)', ta: 'போரான் (B)', kn: 'ಬೋರಾನ್ (B)', ml: 'ബോറോൺ (B)', mr: 'बोरोन (B)', gu: 'બોરોન (B)', bn: 'বোরন (B)', pa: 'ਬੋਰੋਨ (B)', or: 'ବୋରୋନ (B)', as: 'ব’ৰন (B)', ur: 'بورون (B)', es: 'Boro (B)', fr: 'Bore (B)', pt: 'Boro (B)', ru: 'Бор (B)', zh: '硼 (B)', ar: 'بورون (B)'
  },
  'sulphur': {
    hi: 'सल्फर / गंधक (S)', te: 'గంధకం / సల్ఫర్ (S)', ta: 'கந்தகம் (S)', kn: 'ಗಂಧಕ (S)', ml: 'ഗന്ധകം (S)', mr: 'गंधक (S)', gu: 'ગંધક (S)', bn: 'গন্ধক (S)', pa: 'ਗੰਧਕ (S)', or: 'ଗନ୍ଧକ (S)', as: 'গন্ধক (S)', ur: 'سلفر / گندھک (S)', es: 'Azufre (S)', fr: 'Soufre (S)', pt: 'Enxofre (S)', ru: 'Сера (S)', zh: '硫 (S)', ar: 'كبريت (S)'
  },
  'sulfur': {
    hi: 'सल्फर / गंधक (S)', te: 'గంధకం / సల్ఫర్ (S)', ta: 'கந்தகம் (S)', kn: 'ಗಂಧಕ (S)', ml: 'ഗന്ധകം (S)', mr: 'गंधक (S)', gu: 'ગંધક (S)', bn: 'গন্ধক (S)', pa: 'ਗੰਧਕ (S)', or: 'ଗନ୍ଧକ (S)', as: 'গন্ধক (S)', ur: 'سلفر / گندھک (S)', es: 'Azufre (S)', fr: 'Soufre (S)', pt: 'Enxofre (S)', ru: 'Сера (S)', zh: '硫 (S)', ar: 'كبريت (S)'
  },
  'manganese': {
    hi: 'मैंगनीज (Mn)', te: 'మాంగనీస్ (Mn)', ta: 'மாங்கனீசு (Mn)', kn: 'ಮ್ಯಾಂಗನೀಸ್ (Mn)', ml: 'മാംഗനീസ് (Mn)', mr: 'मॅंगनीज (Mn)', gu: 'મેંગેનીઝ (Mn)', bn: 'ম্যাঙ্গানিজ (Mn)', pa: 'ਮੈਂਗਨੀਜ਼ (Mn)', or: 'ମାଙ୍ଗାନିଜ (Mn)', as: 'মেংগানিজ (Mn)', ur: 'مینگنیج (Mn)', es: 'Manganeso (Mn)', fr: 'Manganèse (Mn)', pt: 'Manganês (Mn)', ru: 'Марганец (Mn)', zh: '锰 (Mn)', ar: 'منغنيز (Mn)'
  },
  'copper': {
    hi: 'कॉपर / तांबा (Cu)', te: 'రాగి / కాపర్ (Cu)', ta: 'தாமிரம் (Cu)', kn: 'ತಾಮ್ರ (Cu)', ml: 'ചെമ്പ് (Cu)', mr: 'तांबे (Cu)', gu: 'તાંબુ (Cu)', bn: 'তামা (Cu)', pa: 'ਤਾਂਬਾ (Cu)', or: 'ତମ୍ବା (Cu)', as: 'তাম (Cu)', ur: 'کاپر / تانبا (Cu)', es: 'Cobre (Cu)', fr: 'Cuivre (Cu)', pt: 'Cobre (Cu)', ru: 'Медь (Cu)', zh: '铜 (Cu)', ar: 'نحاس (Cu)'
  },
  'molybdenum': {
    hi: 'मोलिब्डेनम (Mo)', te: 'మాలిబ్డినం (Mo)', ta: 'மாலிப்டினம் (Mo)', kn: 'ಮಾಲಿಬ್ಡಿನಮ್ (Mo)', ml: 'മോളിബ്ഡിനം (Mo)', mr: 'मॉलिब्डेनम (Mo)', gu: 'મોલિબ્ડેનમ (Mo)', bn: 'মলিবডেনাম (Mo)', pa: 'ਮੋਲੀਬਡੇਨਮ (Mo)', or: 'ମଲିବଡେନମ (Mo)', as: 'মলিবডেনাম (Mo)', ur: 'مولبڈینم (Mo)', es: 'Molibdeno (Mo)', fr: 'Molybdène (Mo)', pt: 'Molibdênio (Mo)', ru: 'Молибден (Mo)', zh: '钼 (Mo)', ar: 'موليبدينوم (Mo)'
  },
  'magnesium': {
    hi: 'मैग्नीशियम (Mg)', te: 'మెగ్నీషియం (Mg)', ta: 'மெக்னீசியம் (Mg)', kn: 'ಮೆಗ್ನೀಸಿಯಮ್ (Mg)', ml: 'മഗ്നീഷ്യം (Mg)', mr: 'मॅग्नेशियम (Mg)', gu: 'મેગ્નેશિયમ (Mg)', bn: 'ম্যাগনেসিয়াম (Mg)', pa: 'ਮੈਗਨੀਸ਼ੀਅਮ (Mg)', or: 'ମ୍ୟାଗ୍ନେସିୟମ (Mg)', as: 'মেগনেছিয়াম (Mg)', ur: 'میگنیشیم (Mg)', es: 'Magnesio (Mg)', fr: 'Magnésium (Mg)', pt: 'Magnésio (Mg)', ru: 'Магний (Mg)', zh: '镁 (Mg)', ar: 'مغنيسيوم (Mg)'
  },
  'calcium': {
    hi: 'कैल्शियम (Ca)', te: 'కాల్షియం (Ca)', ta: 'கால்சியம் (Ca)', kn: 'ಕ್ಯಾಲ್ಸಿಯಂ (Ca)', ml: 'കാൽസ്യം (Ca)', mr: 'कॅल्शियम (Ca)', gu: 'કેલ્શિયમ (Ca)', bn: 'ক্যালসিয়াম (Ca)', pa: 'ਕੈਲਸ਼ੀਅਮ (Ca)', or: 'କ୍ୟାଲସିୟମ (Ca)', as: 'কেলছিয়াম (Ca)', ur: 'کیلشیم (Ca)', es: 'Calcio (Ca)', fr: 'Calcium (Ca)', pt: 'Cálcio (Ca)', ru: 'Кальций (Ca)', zh: '钙 (Ca)', ar: 'كالسيوم (Ca)'
  }
};

export function localizeMicronutrient(micro: string | undefined | null, lang: Language): string {
  if (!micro) return '';
  const norm = (normalizeLang(lang) || 'en') as Language;
  if (norm === 'en') return micro;

  const lower = micro.trim().toLowerCase();
  for (const [key, mapping] of Object.entries(MICRONUTRIENT_MAP)) {
    if (lower.includes(key)) {
      return mapping[norm] || micro;
    }
  }
  return micro;
}

/**
 * Common regional deficiency phrases localized into farmer-friendly regional languages
 */
export function localizeRegionalDeficiency(def: string, lang: Language): string {
  const norm = (normalizeLang(lang) || 'en') as Language;
  if (norm === 'en' || !def) return def;

  const lower = def.toLowerCase();

  // Pattern matching for typical ICAR survey notes
  if (lower.includes('organic carbon') || lower.includes('som')) {
    if (lower.includes('low') || lower.includes('depleted') || lower.includes('sub-optimal')) {
      const map: Partial<Record<Language, string>> = {
        hi: 'मृदा में जैविक कार्बन की कमी; कम्पोस्ट व हरी खाद की आवश्यकता',
        te: 'నేలలో సేంద్రియ కర్బనం తక్కువగా ఉంది; కంపోస్ట్ మరియు పచ్చిరొట్ట ఎరువులు అవసరం',
        ta: 'மண்ணில் கரிம கார்பன் குறைவு; மக்கிய உரம் மற்றும் பசுந்தாள் உரம் தேவை',
        kn: 'ಮಣ್ಣಿನಲ್ಲಿ ಸಾವಯವ ಇಂಗಾಲದ ಕೊರತೆ; ಕಾಂಪೋಸ್ಟ್ ಮತ್ತು ಹಸಿರೆಲೆ ಗೊಬ್ಬರ ಅಗತ್ಯ',
        ml: 'മണ്ണിൽ ഓർഗാനിക് കാർബൺ കുറവ്; കമ്പോസ്റ്റും പച്ചിലവളവും ആവശ്യമാണ്',
        mr: 'मातीत सेंद्रिय कर्बाची कमतरता; शेणखत व हिरवळीच्या खताची गरज',
        gu: 'જમીનમાં કાર્બનિક કાર્બનની ઊણપ; છાણીયું ખાતર અને લીલો પડવાશ જરૂરી',
        bn: 'মাটিতে জৈব কার্বনের ঘাটতি; কম্পোস্ট ও সবুজ সার প্রয়োগ প্রয়োজন',
        pa: 'ਮਿੱਟੀ ਵਿੱਚ ਜੈਵਿਕ ਕਾਰਬਨ ਦੀ ਘਾਟ; ਰੂੜੀ ਅਤੇ ਹਰੀ ਖਾਦ ਦੀ ਲੋੜ',
        or: 'ମାଟିରେ ଜୈବିକ ଅଙ୍ଗାରକ କମ; କମ୍ପୋଷ୍ଟ ଏବଂ ସବୁଜ ଖତ ଆବଶ୍ୟକ',
        as: 'মাটিত জৈৱিক কাৰ্বনৰ ঘাটি; পচন সাৰ আৰু সেউজ সাৰ প্ৰয়োগ প্ৰয়োজন',
        ur: 'مٹی میں نامیاتی کاربن کی کمی؛ کمپوسٹ اور سبز کھاد کی ضرورت',
      };
      if (map[norm]) return map[norm]!;
    }
  }

  if (lower.includes('waterlogging') || lower.includes('poor internal drainage')) {
    const map: Partial<Record<Language, string>> = {
      hi: 'भारी वर्षा के दौरान जलभराव और आंतरिक जल निकासी में अवरोध',
      te: 'భారీ వర్షాల సమయంలో నీరు నిల్వ ఉండటం మరియు లోపలి నీటి పారుదల మందగించడం',
      ta: 'கனமழையின் போது நீர் தேங்குதல் மற்றும் மெதுவான வடிகால்',
      kn: 'ಭಾರೀ ಮಳೆಯ ಸಮಯದಲ್ಲಿ ನೀರು ನಿಲ್ಲುವುದು ಮತ್ತು ನಿಧಾನಗತಿಯ ಒಳಚರಂಡಿ',
      ml: 'കനത്ത മഴയിൽ വെള്ളക്കെട്ടും പതുക്കെയുള്ള നീർവാർച്ചയും',
      mr: 'मुसळधार पावसात पाणी साचणे व निचरा मंदावणे',
      gu: 'ભારે વરસાદમાં પાણી ભરાવું અને આંતરિક નિકાલ ધીમો પડવો',
      bn: 'ভারী বৃষ্টিতে জলাবদ্ধতা ও দুর্বল অভ্যন্তরীণ নিষ্কাশন',
      pa: 'ਭਾਰੀ ਬਾਰਿਸ਼ ਦੌਰਾਨ ਪਾਣੀ ਖੜ੍ਹਨਾ ਅਤੇ ਸੁਸਤ ਜਲ ਨਿਕਾਸ',
      or: 'ପ୍ରବଳ ବର୍ଷାରେ ଜଳବନ୍ଦୀ ଏବଂ ଜଳ ନିଷ୍କାସନ ସମସ୍ୟା',
      as: 'প্ৰবল বৰষুণত পানী জমা হোৱা আৰু লেহেমীয়া পানী ওলোৱা সমস্যা',
      ur: 'شدید بارش میں پانی جمع ہونا اور اندرونی نکاسی کی سستی',
    };
    if (map[norm]) return map[norm]!;
  }

  if (lower.includes('calcareous') || lower.includes('high free calcium')) {
    const map: Partial<Record<Language, string>> = {
      hi: 'चूनायुक्त मृदा की स्थिति (मुक्त कैल्शियम कार्बोनेट की अधिकता)',
      te: 'సున్నపు నేల స్వభావం (కాల్షియం కార్బోనేట్ అధికంగా ఉండటం)',
      ta: 'சுண்ணாம்பு படிவுகள் நிறைந்த மண் நிலை',
      kn: 'ಸುಣ್ಣದ ಅಂಶ ಹೆಚ್ಚಿರುವ ಮಣ್ಣು',
      ml: 'ചുണ്ണാമ്പ് അംശം കൂടുതലുള്ള അവസ്ഥ',
      mr: 'चुनखडीयुक्त माती (कॅल्शियम कार्बोनेटचे जास्त प्रमाण)',
      gu: 'ચૂનાવાળી જમીનની સ્થિતિ',
      bn: 'চুনযুক্ত মাটির বৈশিষ্ট্য',
      pa: 'ਚੂਨੇਦਾਰ ਮਿੱਟੀ ਦੀ ਸਥਿਤੀ',
      or: 'ଚୂନଯୁକ୍ତ ମାଟିର ପ୍ରଭାବ',
      as: 'চূণযুক্ত মাটিৰ অৱস্থা',
      ur: 'چونے والی مٹی کی حالت',
    };
    if (map[norm]) return map[norm]!;
  }

  // Fallback to comprehensive extended patterns for all remaining regional deficiencies across all 18 languages
  return localizeRegionalDeficiencyExtended(def, lang);
}

/**
 * Common regenerative biological practices localized into regional languages
 */
export function localizeRegenerativePractice(practice: string, lang: Language): string {
  const norm = (normalizeLang(lang) || 'en') as Language;
  if (norm === 'en' || !practice) return practice;

  const lower = practice.toLowerCase();

  if (lower.includes('cover cropping') || lower.includes('legume') || lower.includes('cowpea')) {
    const map: Partial<Record<Language, string>> = {
      hi: 'दलहनी फसलों (लोबिया, सनई) के साथ आवरण फसलें उगाएं जो नाइट्रोजन स्थिरीकरण करती हैं',
      te: 'నత్రజనిని స్థిరీకరించే పప్పుధాన్యాలతో (అలసందలు, జనుము) అంతర/కవర్ పంటల సాగు',
      ta: 'நைட்ரஜனை நிலைநிறுத்தும் பயறு வகைகளுடன் (காராமணி, சணப்பை) மூடு பயிர் சாகுபடி',
      kn: 'ಸಾರಜನಕ ಸ್ಥಿರೀಕರಿಸುವ ದ್ವಿದಳ ಧಾನ್ಯಗಳೊಂದಿಗೆ (ಅಲಸಂದಿ, ಸಣಬು) ಹೊದಿಕೆ ಬೆಳೆ ಬೆಳೆಯಿರಿ',
      ml: 'നൈട്രജൻ വർദ്ധിപ്പിക്കുന്ന പയർവർഗ്ഗങ്ങൾ (പയർ, ചണം) ആവരണവിളയായി കൃഷി ചെയ്യുക',
      mr: 'नायट्रोजन स्थिर करणाऱ्या कडधान्यांसह (चवळी, ताग) आच्छादन पिके घ्या',
      gu: 'નાઇટ્રોજન જાળવતી કઠોળ (ચોળી, શણ) સાથે આચ્છાદન પાકો વાવો',
      bn: 'নাইট্রোজেন সংবন্ধনকারী ডালশস্য (বরবটি, শণ) দিয়ে কভার ক্রপিং করুন',
      pa: 'ਨਾਈਟ੍ਰੋਜਨ ਵਧਾਉਣ ਵਾਲੀਆਂ ਦਾਲਾਂ (ਰਵਾਂਹ, ਸਣ) ਨਾਲ ਢੱਕਵੀਂ ਫ਼ਸਲ ਉਗਾਓ',
      or: 'ଯବକ୍ଷାରଜାନ ସ୍ଥିରୀକରଣ କରୁଥିବା ଡାଲି ଜାତୀୟ ଫସଲ ସହିତ ଆଚ୍ଛାଦନ ଫସଲ ଚାଷ କରନ୍ତୁ',
      as: 'নাইট্ৰ’জেন যোগান ধৰা মাহজাতীয় শস্যৰে আৱৰণ শস্য খেতি কৰক',
      ur: 'نائٹروجن مستحکم کرنے والی دالوں (لوبیا، سن) کے ساتھ کور فصلیں اگائیں',
    };
    if (map[norm]) return map[norm]!;
  }

  if (lower.includes('fym') || lower.includes('farmyard manure') || lower.includes('vermicompost')) {
    const map: Partial<Record<Language, string>> = {
      hi: 'गोबर की पकी खाद (FYM) या केंचुआ खाद (वर्मीकम्पोस्ट) 5–10 टन/हेक्टेयर की दर से डालें',
      te: 'ఎకరాకు లేదా హెక్టారుకు 5–10 టన్నుల పశువుల ఎరువు (FYM) లేదా వర్మీకంపోస్ట్ వేయండి',
      ta: 'மக்கிய தொழு உரம் (FYM) அல்லது மண்புழு உரத்தை ஹெக்டேருக்கு 5-10 டன் இடவும்',
      kn: 'ಹೆಕ್ಟೇರಿಗೆ 5–10 ಟನ್ ಕೊಟ್ಟಿಗೆ ಗೊಬ್ಬರ (FYM) ಅಥವಾ ಎರೆಹುಳು ಗೊಬ್ಬರ ಹಾಕಿ',
      ml: 'ഹെക്ടറിന് 5–10 ടൺ കാലിവളമോ (FYM) മണ്ണിരക്കമ്പോസ്റ്റോ ചേർക്കുക',
      mr: 'चांगले कुजलेले शेणखत किंवा गांडूळ खत ५–१० टन/हेक्टर या प्रमाणात द्या',
      gu: 'હેક્ટર દીઠ ૫–૧૦ ટન છાણીયું ખાતર અથવા વર્મીકમ્પોસ્ટ ઉમેરો',
      bn: 'হেক্টর প্রতি ৫–১০ টন গোবর সার বা কেঁচো সার প্রয়োগ করুন',
      pa: '੫–੧੦ ਟਨ/ਹੈਕਟੇਅਰ ਦੇ ਹਿਸਾਬ ਨਾਲ ਰੂੜੀ ਜਾਂ ਗੰਡੋਆ ਖਾਦ ਪਾਓ',
      or: 'ହେକ୍ଟର ପ୍ରତି ୫–୧୦ ଟନ ଗୋବର ଖତ ବା ଭର୍ମିକମ୍ପୋଷ୍ଟ ପ୍ରୟୋଗ କରନ୍ତୁ',
      as: 'হেক্টৰে প্ৰতি ৫–১০ টন পচন সাৰ বা কেঁচু সাৰ প্ৰয়োগ কৰক',
      ur: '5–10 ٹن فی ہیکٹر کے حساب سے گوبر کی کھاد یا ورمی کمپوسٹ ڈالیں',
    };
    if (map[norm]) return map[norm]!;
  }

  if (lower.includes('biochar') || lower.includes('carbon retention')) {
    const map: Partial<Record<Language, string>> = {
      hi: 'नमी और कार्बन संरक्षण के लिए बायोचार का प्रयोग करें',
      te: 'తేమ మరియు కర్బనాన్ని నేలలో నిల్వ ఉంచడానికి బయోచార్ ఉపయోగించండి',
      ta: 'ஈரப்பதம் மற்றும் கார்பனைத் தக்கவைக்க பயோசார் சேர்க்கவும்',
      kn: 'ತೇವಾಂಶ ಮತ್ತು ಇಂಗಾಲವನ್ನು ಹಿಡಿದಿಡಲು ಬಯೋಚಾರ್ ಬಳಸಿ',
      ml: 'ഈർപ്പവും കാർബണും നിലനിർത്താൻ ബയോചാർ ഉപയോഗിക്കുക',
      mr: 'ओलावा व सेंद्रिय कर्ब टिकवण्यासाठी बायोचारचा वापर करा',
      gu: 'ભેજ અને કાર્બન સંગ્રહ માટે બાયોચાર ઉમેરો',
      bn: 'আর্দ্রতা ও কার্বন ধরে রাখতে বায়োচার ব্যবহার করুন',
      pa: 'ਨਮੀ ਅਤੇ ਕਾਰਬਨ ਬਚਾਉਣ ਲਈ ਬਾਇਓਚਾਰ ਵਰਤੋ',
      or: 'ଆର୍ଦ୍ରତା ଓ ଅଙ୍ଗାରକ ସଂରକ୍ଷଣ ପାଇଁ ବାୟୋଚାର ପ୍ରୟୋଗ କରନ୍ତୁ',
      as: 'আৰ্দ্ৰতা আৰু কাৰ্বন সংৰক্ষণৰ বাবে বায়’চাৰ ব্যৱহাৰ কৰক',
      ur: 'نمی اور کاربن برقرار رکھنے کے لیے بائیو چار شامل کریں',
    };
    if (map[norm]) return map[norm]!;
  }

  if (lower.includes('mulch') || lower.includes('crop residue')) {
    const map: Partial<Record<Language, string>> = {
      hi: 'मल्चिंग करें और फसल अवशेषों को जलाने के बजाय मिट्टी में मिलाएं',
      te: 'తేమ ఆవిరి కాకుండా మల్చింగ్ చేయండి మరియు పంట వ్యర్థాలను కాల్చకుండా నేలలో కలపండి',
      ta: 'ஈரப்பதத்தை காக்க மூடாக்கு இடவும் மற்றும் பயிர் எச்சங்களை எரிக்காமல் மண்ணில் கலக்கவும்',
      kn: 'ತೇವಾಂಶ ಸಂರಕ್ಷಿಸಲು ಹೊದಿಕೆ (ಮಲ್ಚಿಂಗ್) ಮಾಡಿ ಮತ್ತು ಬೆಳೆ ತ್ಯಾಜ್ಯಗಳನ್ನು ಸುಡದೆ ಮಣ್ಣಿಗೆ ಸೇರಿಸಿ',
      ml: 'ഈർപ്പം നിലനിർത്താൻ പുതയിടുക, വിള അവശിഷ്ടങ്ങൾ കത്തിക്കാതെ മണ്ണിൽ ചേർക്കുക',
      mr: 'ओलावा टिकवण्यासाठी आच्छादन (मल्चिंग) करा व पिकांचे अवशेष जाळण्याऐवजी मातीत गाडा',
      gu: 'ભેજ જાળવવા મલ્ચિંગ કરો અને પાકના અવશેષો બાળવાને બદલે જમીનમાં ભેળવો',
      bn: 'আর্দ্রতা ধরে রাখতে মালচিং করুন ও ফসলের অবশিষ্টাংশ পোড়ানোর বদলে মাটিতে মিশিয়ে দিন',
      pa: 'ਨਮੀ ਬਚਾਉਣ ਲਈ ਮਲਚਿੰਗ ਕਰੋ ਅਤੇ ਰਹਿੰਦ-ਖੂੰਹਦ ਨੂੰ ਸਾੜਨ ਦੀ ਬਜਾਏ ਮਿੱਟੀ ਵਿੱਚ ਮਿਲਾਓ',
      or: 'ଆର୍ଦ୍ରତା ରକ୍ଷା ପାଇଁ ମଲଚିଂ କରନ୍ତୁ ଏବଂ ନଡ଼ା ନ ପୋଡ଼ି ମାଟିରେ ମିଶାନ୍ତୁ',
      as: 'আৰ্দ্ৰতা ৰক্ষাৰ বাবে মালচিং কৰক আৰু শস্যৰ অৱশিষ্ট অংশ নোপোৰাকৈ মাটিত মিহলাই দিয়ক',
      ur: 'نمی بچانے کے لیے ملچنگ کریں اور باقیات جلانے کے بجائے مٹی میں دبائیں',
    };
    if (map[norm]) return map[norm]!;
  }

  // Fallback to comprehensive extended patterns for all remaining practices across all 18 languages
  return localizeRegenerativePracticeExtended(practice, lang);
}

// Re-export comprehensive regional soil localization functions
export {
  localizeSoilOrder,
  localizeAgroClimaticZone,
  localizeCropSynergyAdvice,
  localizeSoilSummary,
} from './soilRegionalTranslations';

