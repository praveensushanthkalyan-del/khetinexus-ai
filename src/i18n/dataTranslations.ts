import { Language, FarmProfile, AdvisoryResult, DiagnosisResult, SoilReport } from '../types';
import {
  REGENERATIVE_PRACTICES,
  AGRIN_NODES,
  SHARED_KNOWLEDGE_MODULES,
} from '../data/mockData';
import {
  normalizeLang,
  localizeState,
  localizeDistrict,
  localizeSubDistrict,
  localizeFarmUnit,
  localizeFarmName,
  localizeFarmingType,
  isTextInLanguageScript,
  translatePlaceName,
  getFarmCropTranslation,
  getFarmSoilTranslation,
  getFarmIrrigationTranslation,
  getFarmGrowthStageTranslation,
  getFarmCountryTranslation,
} from './farmValueTranslations';

export {
  normalizeLang,
  localizeState,
  localizeDistrict,
  localizeSubDistrict,
  localizeFarmUnit,
  localizeFarmName,
  localizeFarmingType,
  isTextInLanguageScript,
  translatePlaceName,
};

// Country localization
export const COUNTRY_NAMES: Record<Language, Record<string, string>> = {
  en: {
    India: 'India',
    Brazil: 'Brazil',
    Russia: 'Russia',
    China: 'China',
    'South Africa': 'South Africa',
    Egypt: 'Egypt',
    Ethiopia: 'Ethiopia',
    UAE: 'UAE',
  },
  hi: {
    India: 'भारत',
    Brazil: 'ब्राजील',
    Russia: 'रूस',
    China: 'चीन',
    'South Africa': 'दक्षिण अफ्रीका',
    Egypt: 'मिस्र',
    Ethiopia: 'इथियोपिया',
    UAE: 'संयुक्त अरब अमीरात',
  },
  pt: {
    India: 'Índia',
    Brazil: 'Brasil',
    Russia: 'Rússia',
    China: 'China',
    'South Africa': 'África do Sul',
    Egypt: 'Egito',
    Ethiopia: 'Etiópia',
    UAE: 'Emirados Árabes Unidos',
  },
  ru: {
    India: 'Индия',
    Brazil: 'Бразилия',
    Russia: 'Россия',
    China: 'Китай',
    'South Africa': 'Южная Африка',
    Egypt: 'Египет',
    Ethiopia: 'Эфиопия',
    UAE: 'ОАЭ',
  },
  zh: {
    India: '印度',
    Brazil: '巴西',
    Russia: '俄罗斯',
    China: '中国',
    'South Africa': '南非',
    Egypt: '埃及',
    Ethiopia: '埃塞俄比亚',
    UAE: '阿联酋',
  },
};

// Crop names localization
export const CROP_NAMES: Record<Language, Record<string, string>> = {
  en: {
    Wheat: 'Wheat',
    Soybean: 'Soybean',
    Rice: 'Rice',
    'Maize (Corn)': 'Maize (Corn)',
    Corn: 'Corn',
    Barley: 'Barley',
    Cotton: 'Cotton',
    'Chickpeas / Gram': 'Chickpeas / Gram',
    'Millet (Bajra / Ragi)': 'Millet (Bajra / Ragi)',
    Tomato: 'Tomato',
    Potato: 'Potato',
    Sugarcane: 'Sugarcane',
    Sunflower: 'Sunflower',
  },
  hi: {
    Wheat: 'गेहूं',
    Soybean: 'सोयाबीन',
    Rice: 'धान / चावल',
    'Maize (Corn)': 'मक्का',
    Corn: 'मक्का',
    Barley: 'जौ',
    Cotton: 'कपास',
    'Chickpeas / Gram': 'चना',
    'Millet (Bajra / Ragi)': 'बाजरा / रागी',
    Tomato: 'टमाटर',
    Potato: 'आलू',
    Sugarcane: 'गन्ना',
    Sunflower: 'सूरजमुखी',
  },
  pt: {
    Wheat: 'Trigo',
    Soybean: 'Soja',
    Rice: 'Arroz',
    'Maize (Corn)': 'Milho',
    Corn: 'Milho',
    Barley: 'Cevada',
    Cotton: 'Algodão',
    'Chickpeas / Gram': 'Grão-de-bico',
    'Millet (Bajra / Ragi)': 'Painço / Milheto',
    Tomato: 'Tomate',
    Potato: 'Batata',
    Sugarcane: 'Cana-de-açúcar',
    Sunflower: 'Girassol',
  },
  ru: {
    Wheat: 'Пшеница',
    Soybean: 'Соя',
    Rice: 'Рис',
    'Maize (Corn)': 'Кукуруза',
    Corn: 'Кукуруза',
    Barley: 'Ячмень',
    Cotton: 'Хлопок',
    'Chickpeas / Gram': 'Нут',
    'Millet (Bajra / Ragi)': 'Просо / Пшено',
    Tomato: 'Томат',
    Potato: 'Картофель',
    Sugarcane: 'Сахарный тростник',
    Sunflower: 'Подсолнечник',
  },
  zh: {
    Wheat: '小麦',
    Soybean: '大豆',
    Rice: '水稻',
    'Maize (Corn)': '玉米',
    Corn: '玉米',
    Barley: '大麦',
    Cotton: '棉花',
    'Chickpeas / Gram': '鹰嘴豆',
    'Millet (Bajra / Ragi)': '谷子 / 粟',
    Tomato: '番茄',
    Potato: '马铃薯',
    Sugarcane: '甘蔗',
    Sunflower: '向日葵',
  },
};

// Growth stages localization
export const GROWTH_STAGE_NAMES: Record<Language, Record<string, string>> = {
  en: {
    Germination: 'Germination',
    Vegetative: 'Vegetative',
    Flowering: 'Flowering',
    'Grain filling': 'Grain filling',
    Maturity: 'Maturity',
  },
  hi: {
    Germination: 'अंकुरण',
    Vegetative: 'वानस्पतिक वृद्धि',
    Flowering: 'पुष्पन / फूल आना',
    'Grain filling': 'दाना भराव',
    Maturity: 'परिपक्वता',
  },
  pt: {
    Germination: 'Germinação',
    Vegetative: 'Vegetativo',
    Flowering: 'Floração',
    'Grain filling': 'Enchimento de grãos',
    Maturity: 'Maturidade / Maturação',
  },
  ru: {
    Germination: 'Прорастание',
    Vegetative: 'Вегетация',
    Flowering: 'Цветение',
    'Grain filling': 'Налив зерна',
    Maturity: 'Созревание',
  },
  zh: {
    Germination: '发芽期',
    Vegetative: '营养生长期',
    Flowering: '开花期',
    'Grain filling': '灌浆期',
    Maturity: '成熟期',
  },
};

// Soil types localization
export const SOIL_TYPE_NAMES: Record<Language, Record<string, string>> = {
  en: {
    'Alluvial Loam': 'Alluvial Loam',
    'Chernozem (Black Earth)': 'Chernozem (Black Earth)',
    'Chernozem (Black Soil)': 'Chernozem (Black Soil)',
    'Mollisol (Black Earth)': 'Mollisol (Black Earth)',
    'Cerrado Oxisol (Red Clay)': 'Cerrado Oxisol (Red Clay)',
    'Sandy Loam': 'Sandy Loam',
    'Clayey Soil': 'Clayey Soil',
    'Laterite Soil': 'Laterite Soil',
    'Silt Loam': 'Silt Loam',
    'Black Cotton Soil (Vertisol)': 'Black Cotton Soil (Vertisol)',
  },
  hi: {
    'Alluvial Loam': 'जलोढ़ दोमट मिट्टी',
    'Chernozem (Black Earth)': 'काली उपजाऊ मिट्टी',
    'Chernozem (Black Soil)': 'काली मिट्टी',
    'Mollisol (Black Earth)': 'काली भुरभुरी मिट्टी',
    'Cerrado Oxisol (Red Clay)': 'लाल चिकनी मिट्टी',
    'Sandy Loam': 'बलुई दोमट मिट्टी',
    'Clayey Soil': 'चिकनी मिट्टी',
    'Laterite Soil': 'लेटराइट मिट्टी',
    'Silt Loam': 'गाद दोमट मिट्टी',
    'Black Cotton Soil (Vertisol)': 'काली कपासी मिट्टी',
  },
  pt: {
    'Alluvial Loam': 'Franco-aluvial',
    'Chernozem (Black Earth)': 'Terra Negra',
    'Chernozem (Black Soil)': 'Solo Negro',
    'Mollisol (Black Earth)': 'Terra Negra Molisol',
    'Cerrado Oxisol (Red Clay)': 'Latossolo Vermelho',
    'Sandy Loam': 'Franco-arenoso',
    'Clayey Soil': 'Solo Argiloso',
    'Laterite Soil': 'Solo Laterítico',
    'Silt Loam': 'Franco-siltoso',
    'Black Cotton Soil (Vertisol)': 'Vertissolo Preto',
  },
  ru: {
    'Alluvial Loam': 'Аллювиальный суглинок',
    'Chernozem (Black Earth)': 'Чернозем',
    'Chernozem (Black Soil)': 'Плодородная черная почва',
    'Mollisol (Black Earth)': 'Моллисоль',
    'Cerrado Oxisol (Red Clay)': 'Красная глина',
    'Sandy Loam': 'Супесчаная почва',
    'Clayey Soil': 'Глинистая почва',
    'Laterite Soil': 'Латеритная почва',
    'Silt Loam': 'Пылеватый суглинок',
    'Black Cotton Soil (Vertisol)': 'Черная хлопковая почва',
  },
  zh: {
    'Alluvial Loam': '冲积壤土',
    'Chernozem (Black Earth)': '黑钙土',
    'Chernozem (Black Soil)': '肥沃黑土',
    'Mollisol (Black Earth)': '松软黑土',
    'Cerrado Oxisol (Red Clay)': '红粘土',
    'Sandy Loam': '砂质壤土',
    'Clayey Soil': '粘质土壤',
    'Laterite Soil': '红壤 / 砖红壤',
    'Silt Loam': '粉砂质壤土',
    'Black Cotton Soil (Vertisol)': '黑棉土',
  },
};

// Irrigation types localization
export const IRRIGATION_NAMES: Record<Language, Record<string, string>> = {
  en: {
    'Drip Irrigation': 'Drip Irrigation',
    Canal: 'Canal',
    Sprinkler: 'Sprinkler',
    Rainfed: 'Rainfed',
    'Borewell / Tube well': 'Borewell / Tube well',
  },
  hi: {
    'Drip Irrigation': 'टपक सिंचाई',
    Canal: 'नहर सिंचाई',
    Sprinkler: 'फव्वारा सिंचाई',
    Rainfed: 'वर्षा आधारित',
    'Borewell / Tube well': 'नलकूप / बोरवेल',
  },
  pt: {
    'Drip Irrigation': 'Irrigação por Gotejamento',
    Canal: 'Canal de Irrigação',
    Sprinkler: 'Aspersão',
    Rainfed: 'Sequeiro',
    'Borewell / Tube well': 'Poço Artesiano / Tubular',
  },
  ru: {
    'Drip Irrigation': 'Капельное орошение',
    Canal: 'Канальное орошение',
    Sprinkler: 'Дождевание',
    Rainfed: 'Богарное',
    'Borewell / Tube well': 'Артезианская скважина / Колодец',
  },
  zh: {
    'Drip Irrigation': '滴灌系统',
    Canal: '渠道灌溉',
    Sprinkler: '喷灌系统',
    Rainfed: '雨养农业',
    'Borewell / Tube well': '水井 / 管井灌溉',
  },
};

// Weather condition localization
export const WEATHER_CONDITIONS: Record<Language, Record<string, string>> = {
  en: {
    'Partly Cloudy': 'Partly Cloudy',
    Sunny: 'Sunny',
    'Scattered Showers': 'Scattered Showers',
    Overcast: 'Overcast',
    Rain: 'Rain',
    'Clear Sky': 'Clear Sky',
    Thunderstorm: 'Thunderstorm',
  },
  hi: {
    'Partly Cloudy': 'आंशिक रूप से बादल',
    Sunny: 'धूप खिली हुई',
    'Scattered Showers': 'छिटपुट बारिश',
    Overcast: 'घने बादल',
    Rain: 'बारिश',
    'Clear Sky': 'साफ आसमान',
    Thunderstorm: 'गरज के साथ बारिश',
  },
  pt: {
    'Partly Cloudy': 'Parcialmente Nublado',
    Sunny: 'Ensolarado',
    'Scattered Showers': 'Pancadas de Chuva Dispersas',
    Overcast: 'Nublado',
    Rain: 'Chuva',
    'Clear Sky': 'Céu Limpo',
    Thunderstorm: 'Tempestade',
  },
  ru: {
    'Partly Cloudy': 'Переменная облачность',
    Sunny: 'Солнечно',
    'Scattered Showers': 'Местами кратковременные дожди',
    Overcast: 'Пасмурно',
    Rain: 'Дождь',
    'Clear Sky': 'Ясно',
    Thunderstorm: 'Гроза',
  },
  zh: {
    'Partly Cloudy': '多云',
    Sunny: '晴朗',
    'Scattered Showers': '零星阵雨',
    Overcast: '阴天',
    Rain: '降雨',
    'Clear Sky': '晴空万里',
    Thunderstorm: '雷阵雨',
  },
};

// Forecast day names localization
export const FORECAST_DAYS: Record<Language, Record<string, string>> = {
  en: {
    Today: 'Today',
    Tomorrow: 'Tomorrow',
    'Day 3': 'Day 3',
    'Day 4': 'Day 4',
    'Day 5': 'Day 5',
  },
  hi: {
    Today: 'आज',
    Tomorrow: 'कल',
    'Day 3': 'तीसरा दिन',
    'Day 4': 'चौथा दिन',
    'Day 5': 'पांचवां दिन',
  },
  pt: {
    Today: 'Hoje',
    Tomorrow: 'Amanhã',
    'Day 3': 'Dia 3',
    'Day 4': 'Dia 4',
    'Day 5': 'Dia 5',
  },
  ru: {
    Today: 'Сегодня',
    Tomorrow: 'Завтра',
    'Day 3': 'День 3',
    'Day 4': 'День 4',
    'Day 5': 'День 5',
  },
  zh: {
    Today: '今天',
    Tomorrow: '明天',
    'Day 3': '第3天',
    'Day 4': '第4天',
    'Day 5': '第5天',
  },
};

// Helper methods
export function localizeCountry(country: string, lang: Language): string {
  const custom = getFarmCountryTranslation(country, lang);
  if (custom && custom !== country) return custom;
  const norm = normalizeLang(lang);
  return COUNTRY_NAMES[norm]?.[country] || COUNTRY_NAMES.en[country] || country;
}

export function formatFarmValue(
  originalValue: string | undefined | null,
  lang: Language,
  translator: (val: string, lang: Language) => string
): string {
  if (!originalValue) return '';
  const norm = normalizeLang(lang);
  if (norm === 'en') return originalValue;
  
  let translatedValue = translator(originalValue, lang);
  if (!translatedValue) return originalValue;
  
  // Clean any bracketed English original or terms
  translatedValue = translatedValue.replace(/\s*\([^)]*[a-zA-Z][^)]*\)/g, '').trim();
  
  return translatedValue || originalValue;
}

export function formatFarmLocation(
  locationName?: string,
  stateRegion?: string,
  lang?: Language
): string {
  const currentLang = lang || 'en';
  if (!locationName && !stateRegion) return '';

  let districtOrLoc = (locationName || '').trim();
  let stateOrRegion = (stateRegion || '').trim();

  // If districtOrLoc has a comma like "Adilabad, Telangana" or "Adilabad Rural, Adilabad, Telangana"
  if (districtOrLoc.includes(',')) {
    const parts = districtOrLoc.split(',').map(p => p.trim()).filter(Boolean);
    if (parts.length >= 2) {
      districtOrLoc = parts[0];
      if (!stateOrRegion) {
        stateOrRegion = parts.slice(1).join(', ');
      }
    }
  }

  if (normalizeLang(currentLang) === 'en') {
    if (districtOrLoc && stateOrRegion && !districtOrLoc.toLowerCase().includes(stateOrRegion.toLowerCase())) {
      return `${districtOrLoc}, ${stateOrRegion}`;
    }
    return districtOrLoc || stateOrRegion || '';
  }

  const locResolver = (val: string, l: Language) => {
    const d = localizeDistrict(val, l);
    if (d && d !== val) return d;
    const sd = localizeSubDistrict(val, l);
    if (sd && sd !== val) return sd;
    const s = localizeState(val, l);
    if (s && s !== val) return s;
    return val;
  };

  const locFormatted = districtOrLoc ? formatFarmValue(districtOrLoc, currentLang, locResolver) : '';
  const stateFormatted = stateOrRegion ? formatFarmValue(stateOrRegion, currentLang, localizeState) : '';

  if (locFormatted && stateFormatted && !districtOrLoc.toLowerCase().includes(stateOrRegion.toLowerCase())) {
    return `${locFormatted}, ${stateFormatted}`;
  }
  return locFormatted || stateFormatted || '';
}

export function localizeCrop(crop: string, lang: Language): string {
  const norm = normalizeLang(lang);
  const custom = getFarmCropTranslation(crop, lang);
  let res = (custom && custom !== crop) ? custom : (CROP_NAMES[norm]?.[crop] || CROP_NAMES.en[crop] || crop);
  if (norm !== 'en' && typeof res === 'string') {
    res = res.replace(/\s*\([^)]*[a-zA-Z][^)]*\)/g, '').trim();
  }
  return res;
}

export function localizeGrowthStage(stage: string, lang: Language): string {
  const norm = normalizeLang(lang);
  const custom = getFarmGrowthStageTranslation(stage, lang);
  let res = (custom && custom !== stage) ? custom : (GROWTH_STAGE_NAMES[norm]?.[stage] || GROWTH_STAGE_NAMES.en[stage] || stage);
  if (norm !== 'en' && typeof res === 'string') {
    res = res.replace(/\s*\([^)]*[a-zA-Z][^)]*\)/g, '').trim();
  }
  return res;
}

export function localizeSoilType(soil: string, lang: Language): string {
  const norm = normalizeLang(lang);
  const custom = getFarmSoilTranslation(soil, lang);
  let res = (custom && custom !== soil) ? custom : (SOIL_TYPE_NAMES[norm]?.[soil] || SOIL_TYPE_NAMES.en[soil] || soil);
  if (norm !== 'en' && typeof res === 'string') {
    res = res.replace(/\s*\([^)]*[a-zA-Z][^)]*\)/g, '').trim();
  }
  return res;
}

export function localizeIrrigation(irr: string, lang: Language): string {
  const norm = normalizeLang(lang);
  const custom = getFarmIrrigationTranslation(irr, lang);
  let res = (custom && custom !== irr) ? custom : (IRRIGATION_NAMES[norm]?.[irr] || IRRIGATION_NAMES.en[irr] || irr);
  if (norm !== 'en' && typeof res === 'string') {
    res = res.replace(/\s*\([^)]*[a-zA-Z][^)]*\)/g, '').trim();
  }
  return res;
}

export {
  localizeWeatherCondition,
  localizeForecastDay,
  localizeWindSpeed,
} from './weatherTranslations';

export {
  localizeCanopyStatus,
  localizeLandUse,
  localizeAgroClimaticZone,
  getLocalizedProvenanceBadgeLabel,
  localizeTelemetryPillarTitle,
} from './telemetryTranslations';

// Localized 8 Pillars of Regenerative Agriculture (All 19 supported languages)
export { getLocalizedPillars } from './regenerativeTranslations';

// Localized AgriN Nodes and Shared Modules (All 19 supported languages)
export { getLocalizedAgriNNodes, getLocalizedSharedModules } from './agrinTranslations';

function _legacyGetLocalizedAgriNNodesUnused(_lang: Language) {

  const nodeDetails: Record<
    'hi' | 'pt' | 'ru' | 'zh',
    Record<
      string,
      {
        country: string;
        institution: string;
        focusArea: string;
        agroClimatic: string;
        contributions: string[];
      }
    >
  > = {
    hi: {
      'node-in': {
        country: 'भारत (India)',
        institution: 'ICAR एवं AgriN भारत ज्ञान केंद्र',
        focusArea: 'छोटे किसानों में सूखा सहिष्णुता, मोटे अनाज (श्री अन्न), बायो-उत्तेजक और किफायती सूक्ष्म सिंचाई',
        agroClimatic: 'उष्णकटिबंधीय मानसून, अर्ध-शुष्क दक्कन, उपजाऊ भारत-गंगा जलोढ़ क्षेत्र',
        contributions: [
          'अर्ध-शुष्क दलहन जैव-लचीलापन आनुवंशिकी',
          'जीवामृत और किण्वित जैव-उर्वरक मानक',
          'सामुदायिक मानसून आगमन पूर्व चेतावनी मॉडल',
        ],
      },
      'node-br': {
        country: 'ब्राजील (Brazil)',
        institution: 'Embrapa एवं AgriN दक्षिण अमेरिका पारिस्थितिकी',
        focusArea: 'उष्णकटिबंधीय नो-टिल अनाज प्रणालियां, सोयाबीन में जैविक नाइट्रोजन स्थिरीकरण, एकीकृत फसल-पशुधन-वानिकी (ILPF)',
        agroClimatic: 'उष्णकटिबंधीय सवाना (Cerrado), आर्द्र उपोष्णकटिबंधीय, अमेज़ॅन संक्रमण क्षेत्र',
        contributions: [
          'जीरो-टिल उष्णकटिबंधीय मृदा कार्बन मॉडल',
          'Bradyrhizobium जैविक स्थिरीकरण मानक',
          'कैनोपी बायोमास उपग्रह अंशांकन डेटा',
        ],
      },
      'node-ru': {
        country: 'रूस (Russia)',
        institution: 'रूसी विज्ञान अकादमी एवं AgriN यूरेशिया',
        focusArea: 'उच्च अक्षांशीय जैविक गेहूं व जौ की खेती, शीत-सहिष्णु आच्छादन फसलें, चेरनोज़ेम कार्बन संरक्षण',
        agroClimatic: 'आर्द्र महाद्वीपीय, उप-बोरियल, उपजाऊ काली मिट्टी के मैदान (Chernozem)',
        contributions: [
          'चेरनोज़ेम गहरी कार्बन भंडारण आधार रेखाएं',
          'पाले के प्रति सहनशील शीतकालीन अनाज की किस्में',
          'निम्न-तापमान माइकोराइजा कवक उपभेद',
        ],
      },
      'node-cn': {
        country: 'चीन (China)',
        institution: 'चीनी कृषि विज्ञान अकादमी (CAAS)',
        focusArea: 'सटीक धान कृषि-पारिस्थितिकी, सीढ़ीदार जल संरक्षण, डिजिटल मृदा सेंसर नेटवर्क',
        agroClimatic: 'समशीतोष्ण से उपोष्णकटिबंधीय मानसून, विविध सूक्ष्म जलवायु',
        contributions: [
          'वैकल्पिक गीलापन व सुखाने (AWD) द्वारा धान मीथेन कमी डेटा',
          'IoT मृदा नमी टेलीमेट्री प्रोटोकॉल',
          'सटीक जैव-नियंत्रण ड्रोन अनुप्रयोग एल्गोरिदम',
        ],
      },
      'node-za': {
        country: 'दक्षिण अफ्रीका (South Africa)',
        institution: 'कृषि अनुसंधान परिषद (ARC)',
        focusArea: 'शुष्क व अर्ध-शुष्क संरक्षण कृषि, सूखा-सहिष्णु स्वदेशी अनाज (ज्वार/बाजरा)',
        agroClimatic: 'भूमध्यसागरीय दक्षिण-पश्चिम, अर्ध-शुष्क केंद्रीय पठार',
        contributions: [
          'ज्वार सूखा प्रतिक्रिया आनुवंशिक मार्कर',
          'समग्र पुनर्योजी चराई मृदा कार्बन मेट्रिक्स',
          'सौर ऊर्जा संचालित कम दबाव वाली ड्रिप सिंचाई रूपरेखा',
        ],
      },
    },
    pt: {
      'node-in': {
        country: 'Índia',
        institution: 'ICAR e Centro de Conhecimento AgriN Índia',
        focusArea: 'Resiliência à seca para pequenos produtores, milhetos, bioestimulantes e microirrigação de baixo custo',
        agroClimatic: 'Monção tropical, Deccan semiárido, aluvião fértil Indo-Gangético',
        contributions: [
          'Genética de bio-resiliência para leguminosas semiáridas',
          'Protocolos de biofertilizantes fermentados e Jeevamrut',
          'Modelos comunitários de alerta precoce de monções',
        ],
      },
      'node-br': {
        country: 'Brasil',
        institution: 'Embrapa e Ecossistema AgriN América do Sul',
        focusArea: 'Plantio direto em grãos tropicais, fixação biológica de nitrogênio (FBN) em soja, integração lavoura-pecuária-floresta (ILPF)',
        agroClimatic: 'Savana tropical (Cerrado), subtropical úmido e zonas de transição amazônica',
        contributions: [
          'Modelos de matéria orgânica do solo sob plantio direto tropical',
          'Parâmetros de fixação biológica com Bradyrhizobium',
          'Calibrações de biomassa de dossel via satélite NDVI',
        ],
      },
      'node-ru': {
        country: 'Rússia',
        institution: 'Academia Russa de Ciências e AgriN Eurásia',
        focusArea: 'Cultivo orgânico de trigo e cevada em altas latitudes, culturas de cobertura resistentes ao frio e preservação de Chernozem',
        agroClimatic: 'Continental úmido, sub-boreal, estepe de solo negro fértil (Chernozem)',
        contributions: [
          'Linhas de base de sequestro profundo de carbono em Chernozem',
          'Cultivares de cereais de inverno tolerantes a geadas',
          'Cepas de fungos micorrízicos adaptadas a baixas temperaturas',
        ],
      },
      'node-cn': {
        country: 'China',
        institution: 'Academia Chinesa de Ciências Agrícolas (CAAS)',
        focusArea: 'Agroecologia de precisão em arrozais, manejo de água em terraços e redes de sensores digitais de solo',
        agroClimatic: 'Monçônico temperado a subtropical, diversos microclimas',
        contributions: [
          'Dados de redução de metano em arrozais por molhamento e secagem alternados (AWD)',
          'Protocolos telemétricos de umidade do solo via IoT',
          'Algoritmos de aplicação biológica de precisão por drones',
        ],
      },
      'node-za': {
        country: 'África do Sul',
        institution: 'Conselho de Pesquisa Agrícola (ARC)',
        focusArea: 'Agricultura conservacionista em zonas áridas, cereais indígenas tolerantes à seca (sorgo/painço)',
        agroClimatic: 'Mediterrâneo a sudoeste, planalto central semiárido',
        contributions: [
          'Marcadores genéticos de resposta à seca em sorgo',
          'Métricas de carbono no solo em pastoreio regenerativo holístico',
          'Estruturas de irrigação por gotejamento solar de baixa pressão',
        ],
      },
    },
    ru: {
      'node-in': {
        country: 'Индия',
        institution: 'ICAR и Центр знаний AgriN Индия',
        focusArea: 'Засухоустойчивость для мелких фермеров, просо, биостимуляторы и недорогое микроорошение',
        agroClimatic: 'Тропический муссонный, полузасушливый Декан, плодородный Индо-Гангский аллювий',
        contributions: [
          'Генетика биоустойчивости зернобобовых для засушливых зон',
          'Протоколы биоудобрений естественного брожения (Дживамрут)',
          'Модели раннего оповещения о наступлении муссонов',
        ],
      },
      'node-br': {
        country: 'Бразилия',
        institution: 'Embrapa и экосистема AgriN Южная Америка',
        focusArea: 'Тропический No-Till, биологическая фиксация азота в сое, интеграция растениеводства, животноводства и лесоводства (ILPF)',
        agroClimatic: 'Тропическая саванна (Серрадо), влажные субтропики, переходные зоны Амазонии',
        contributions: [
          'Модели накопления органического углерода в тропических почвах',
          'Бенчмарки биологической фиксации азота Bradyrhizobium',
          'Спутниковая калибровка биомассы полога по NDVI',
        ],
      },
      'node-ru': {
        country: 'Россия',
        institution: 'Российская академия наук и AgriN Евразия',
        focusArea: 'Высокоширотное органическое земледелие (пшеница, ячмень), морозостойкие покровные культуры, сохранение черноземов',
        agroClimatic: 'Влажный континентальный, суббореальный, черноземная степь',
        contributions: [
          'Базовые уровни глубокого связывания углерода в черноземах',
          'Морозостойкие сорта озимых зерновых культур',
          'Холодостойкие штаммы микоризных грибов',
        ],
      },
      'node-cn': {
        country: 'Китай',
        institution: 'Китайская академия сельскохозяйственных наук (CAAS)',
        focusArea: 'Прецизионная рисовая агроэкология, террасное водопользование, сети цифровых датчиков почвы',
        agroClimatic: 'Умеренно-субтропический муссонный, разнообразные микроклиматы',
        contributions: [
          'Данные по снижению метана в рисоводстве методом периодического увлажнения (AWD)',
          'Протоколы IoT-телеметрии влажности почвы',
          'Алгоритмы точного внесения биопрепаратов агродронами',
        ],
      },
      'node-za': {
        country: 'Южная Африка',
        institution: 'Совет сельскохозяйственных исследований (ARC)',
        focusArea: 'Засушливое почвозащитное земледелие, устойчивые аборигенные злаки (сорго/просо)',
        agroClimatic: 'Средиземноморский юго-запад, засушливое центральное плато',
        contributions: [
          'Генетические маркеры засухоустойчивости сорго',
          'Метрики углерода при холистическом регенеративном выпасе',
          'Системы капельного орошения низкого давления на солнечной энергии',
        ],
      },
    },
    zh: {
      'node-in': {
        country: '印度',
        institution: 'ICAR 与 AgriN 印度农业智库中心',
        focusArea: '小农抗旱韧性、杂粮小米生态、生物刺激剂及低成本微灌技术',
        agroClimatic: '热带季风气候、德干半干旱高原、肥沃的恒河平原冲积土',
        contributions: [
          '半干旱区抗逆豆类种质资源遗传图谱',
          'Jeevamrut 发酵活性有机生物肥标准化配方',
          '社区级季风来临与突发强对流气象预警模型',
        ],
      },
      'node-br': {
        country: '巴西',
        institution: 'Embrapa 与 AgriN 南美农业生态中心',
        focusArea: '热带粮食作物免耕体系、大豆高效生物固氮技术 (BNF)、农牧林复合生态系统 (ILPF)',
        agroClimatic: '热带稀树草原 (塞拉多)、亚热带季风湿润区、亚马逊过渡生态带',
        contributions: [
          '热带热湿免耕土壤有机碳积累动力学模型',
          '根瘤菌 (Bradyrhizobium) 生物高效固氮基准参数',
          '基于卫星多光谱 NDVI 的冠层生物量反演标定算法',
        ],
      },
      'node-ru': {
        country: '俄罗斯',
        institution: '俄罗斯科学院 与 AgriN 欧亚农业协同中心',
        focusArea: '高纬度寒地有机小麦与大麦种植、耐寒覆盖作物群落、黑钙土深层有机碳固持',
        agroClimatic: '温带湿润大陆性气候、亚北方针叶林缘、肥沃黑钙土大草原',
        contributions: [
          '深层黑钙土长效碳汇基线测定标准',
          '极耐寒冬性禾谷类越冬抗冻性优良品种',
          '低温高效定殖丛枝菌根真菌种质库',
        ],
      },
      'node-cn': {
        country: '中国',
        institution: '中国农业科学院 (CAAS)',
        focusArea: '精准水稻农田生态学、梯田水系立体调控、农田物联网数字化土壤传感网',
        agroClimatic: '温带至亚热带季风气候区、复杂多元微气候生态圈',
        contributions: [
          '水稻间歇灌溉 (AWD) 稻田甲烷减排全周期数据',
          '农田物联网土壤水肥多参数原位遥测协议',
          '植保无人机超低容量精准生物防治作业算法',
        ],
      },
      'node-za': {
        country: '南非',
        institution: '农业研究理事会 (ARC)',
        focusArea: '干旱半干旱区保护性农业、抗旱本土传统杂粮（高粱/珍珠粟）',
        agroClimatic: '西南部地中海气候、内陆半干旱中央高原大草原',
        contributions: [
          '高粱抗旱生理响应核心功能基因组标记',
          '整体性多群轮牧再造草地土壤有机碳监测指标',
          '光伏离网驱动超低压重力滴灌系统设计规范',
        ],
      },
    },
  };

  const currentMap = null;
  if (!currentMap) return AGRIN_NODES;

  return AGRIN_NODES.map((node) => {
    const loc = currentMap[node.id];
    if (!loc) return node;
    return {
      ...node,
      country: loc.country,
      institution: loc.institution,
      focusArea: loc.focusArea,
      agroClimatic: loc.agroClimatic,
      contributions: loc.contributions,
    };
  });
}

// Localized Shared Knowledge Modules
function _legacyGetLocalizedSharedModules(lang: Language) {
  const norm = normalizeLang(lang);
  if (norm === 'en') return SHARED_KNOWLEDGE_MODULES;

  const moduleDetails: Record<
    'hi' | 'pt' | 'ru' | 'zh',
    Record<
      string,
      {
        title: string;
        leadCountry: string;
        description: string;
        beneficiaryImpact: string;
        recordsCount: string;
      }
    >
  > = {
    hi: {
      'mod-1': {
        title: 'जलवायु-सहिष्णु फसल पद्धतियां',
        leadCountry: 'भारत एवं दक्षिण अफ्रीका',
        description:
          'सूखा सहनशीलता, मोटे अनाज की अंतःफसली खेती और बिना रसायनों के फसल की सुरक्षा के मानकीकृत कृषि-पारिस्थितिक प्रोटोकॉल।',
        beneficiaryImpact: '42 लाख छोटे किसान हेक्टेयर',
        recordsCount: '1,420 सत्यापित क्षेत्रीय अध्ययन',
      },
      'mod-2': {
        title: 'जैव-उर्वरक एवं इनोक्युलेंट निर्माण',
        leadCountry: 'ब्राजील एवं भारत',
        description:
          'ओपन-सोर्स जैविक नाइट्रोजन स्थिरीकरण विधियां, माइकोराइजा जीवाणु संवर्धन और कंपोस्ट चाय वातन मानक।',
        beneficiaryImpact: 'सिंथेटिक NPK उर्वरकों में 35% कमी',
        recordsCount: '890 जैव-फॉर्मूलेशन विधियां',
      },
      'mod-3': {
        title: 'एकीकृत पारिस्थितिक कीट प्रबंधन (IPM)',
        leadCountry: 'चीन एवं ब्राजील',
        description:
          'सीमा पार कीट प्रवास ट्रैकिंग (जैसे फॉल आर्मीवॉर्म), मित्र ततैया छोड़ने का समय और नीम-आधारित प्राकृतिक कीट विकर्षक डेटा।',
        beneficiaryImpact: 'हानिकारक कीटनाशक बहाव में 92% की कमी',
        recordsCount: '2,650 कीट विकृति विज्ञान प्रोफाइल',
      },
      'mod-4': {
        title: 'सजीव मृदा पुनर्जनन एवं कार्बन मापन',
        leadCountry: 'रूस एवं दक्षिण अफ्रीका',
        description:
          'मानकीकृत मृदा जैविक कार्बन (SOC) अनुमान प्रोटोकॉल, आच्छादन फसल समाप्ति दिशानिर्देश और ह्यूमस सुरक्षा मानक।',
        beneficiaryImpact: '3 मौसमों में +0.8% जैविक पदार्थ वृद्धि',
        recordsCount: '3,100 मृदा प्रोफाइल बेंचमार्क',
      },
    },
    pt: {
      'mod-1': {
        title: 'Práticas de Culturas Resilientes ao Clima',
        leadCountry: 'Índia e África do Sul',
        description:
          'Protocolos agroecológicos padronizados para escape da seca, consórcio com milheto e resfriamento do dossel vegetal sem retardantes químicos.',
        beneficiaryImpact: '4,2 milhões de hectares de pequenos produtores',
        recordsCount: '1.420 Estudos de Campo Verificados',
      },
      'mod-2': {
        title: 'Formulações de Biofertilizantes e Inoculantes',
        leadCountry: 'Brasil e Índia',
        description:
          'Receitas de código aberto para fixação biológica de nitrogênio, multiplicação de esporos micorrízicos e aeração de chá de composto.',
        beneficiaryImpact: 'Redução de 35% no NPK sintético',
        recordsCount: '890 Bioformulações Registradas',
      },
      'mod-3': {
        title: 'Manejo Ecológico Integrado de Pragas (MIP)',
        leadCountry: 'China e Brasil',
        description:
          'Monitoramento de migração de pragas transfronteiriças (lagarta-do-cartucho), épocas de liberação de parasitoides e extratos botânicos de nim.',
        beneficiaryImpact: 'Redução de 92% na deriva de pulverizações sintéticas',
        recordsCount: '2.650 Perfis Fitossanitários',
      },
      'mod-4': {
        title: 'Restauração do Solo Vivo e Medição de Carbono',
        leadCountry: 'Rússia e África do Sul',
        description:
          'Protocolos padronizados de estimativa de carbono orgânico do solo (COS), manejo de culturas de cobertura e proteção de húmus.',
        beneficiaryImpact: '+0,8% de matéria orgânica em 3 safras',
        recordsCount: '3.100 Parâmetros de Perfis de Solo',
      },
    },
    ru: {
      'mod-1': {
        title: 'Климатически устойчивые методы выращивания культур',
        leadCountry: 'Индия и Южная Африка',
        description:
          'Стандартизированные агроэкологические протоколы преодоления засухи, совмещенных посевов проса и терморегуляции полога без химикатов.',
        beneficiaryImpact: '4,2 млн гектаров малых фермерских хозяйств',
        recordsCount: '1 420 подтвержденных полевых исследований',
      },
      'mod-2': {
        title: 'Рецептуры биоудобрений и биоинокулянтов',
        leadCountry: 'Бразилия и Индия',
        description:
          'Открытые методики биологической фиксации азота, размножения спор микоризы и аэрации компостных чаев.',
        beneficiaryImpact: 'Снижение использования синтетического NPK на 35%',
        recordsCount: '890 биологических рецептур',
      },
      'mod-3': {
        title: 'Интегрированная экологическая защита растений (ИЗР)',
        leadCountry: 'Китай и Бразилия',
        description:
          'Трансграничный мониторинг миграции вредителей (кукурузная совка), сроки выпуска паразитоидов и применение нима.',
        beneficiaryImpact: 'Снижение сноса пестицидов на 92%',
        recordsCount: '2 650 фитопатологических профилей',
      },
      'mod-4': {
        title: 'Восстановление живой почвы и учет углерода',
        leadCountry: 'Россия и Южная Африка',
        description:
          'Стандартизированные протоколы оценки органического углерода почвы (SOC), заделки сидератов и защиты гумуса.',
        beneficiaryImpact: '+0,8% органического вещества за 3 сезона',
        recordsCount: '3 100 эталонов почвенных профилей',
      },
    },
    zh: {
      'mod-1': {
        title: '气候韧性农业生产规程',
        leadCountry: '印度 与 南非',
        description:
          '标准化农田生态抗旱逃灾技术规范、杂粮间套作生态间距及非化学叶幕热缓冲技术体系。',
        beneficiaryImpact: '惠及 420万 公顷小农耕地',
        recordsCount: '1,420 篇田间实证对照数据',
      },
      'mod-2': {
        title: '生物菌肥与活体接种剂工程',
        leadCountry: '巴西 与 印度',
        description:
          '开源根瘤菌高效固氮扩繁工艺、丛枝菌根真菌快速孢子扩增及通气发酵堆肥茶配制标准。',
        beneficiaryImpact: '降低 35% 化学合成化肥使用量',
        recordsCount: '890 项生物制剂配方库',
      },
      'mod-3': {
        title: '生态综合有害生物防治体系 (IPM)',
        leadCountry: '中国 与 巴西',
        description:
          '跨境迁飞性重大害虫（如草地贪夜蛾）监测预警网络、寄生蜂田间释放最佳物候期与印楝抗拒食素数据。',
        beneficiaryImpact: '减少 92% 剧毒农药漂移损耗',
        recordsCount: '2,650 项有害生物病理档案',
      },
      'mod-4': {
        title: '土壤活力修复与长效碳储量测算',
        leadCountry: '俄罗斯 与 南非',
        description:
          '标准化土壤有机碳 (SOC) 遥感协同原位评估规程、覆盖作物终止时机指导及腐殖质长效保护规范。',
        beneficiaryImpact: '3个轮作季提升 +0.8% 土壤有机质',
        recordsCount: '3,100 套典型土壤剖面基准',
      },
    },
  };

  const currentMap = moduleDetails[norm as 'hi' | 'pt' | 'ru' | 'zh'];
  if (!currentMap) return SHARED_KNOWLEDGE_MODULES;

  return SHARED_KNOWLEDGE_MODULES.map((mod) => {
    const loc = currentMap[mod.id];
    if (!loc) return mod;
    return {
      ...mod,
      title: loc.title,
      leadCountry: loc.leadCountry,
      description: loc.description,
      beneficiaryImpact: loc.beneficiaryImpact,
      recordsCount: loc.recordsCount,
    };
  });
}

// Localized sample leaves for Crop Doctor
export function getLocalizedSampleLeaves(_lang: Language) {
  return [];
}

// Localized Initial Advisory for all 5 supported languages
export function getLocalizedInitialAdvisory(lang: Language, farm?: FarmProfile): AdvisoryResult {
  const norm = normalizeLang(lang);
  const crop = farm?.crop || 'Wheat';
  const loc = farm?.location || 'Ludhiana District';

  switch (norm) {
    case 'te':
      return {
        id: 'adv-001',
        summary: `${crop} (${loc}) పంట పెరుగుదలకు అనుకూల పరిస్థితులు ఉన్నాయి. మధ్యాహ్నం బాష్పోత్సేకం పెరిగే అవకాశం ఉంది; ఉపరితల ముల్చింగ్ మరియు సూక్ష్మ పోషకాల పిచికారీ సిఫార్సు చేయబడింది.`,
        todayAction:
          'ఆకులపై బూడిద తెగులు లేదా పసుపు కుంకుమ తెగులు మచ్చల కోసం పరిశీలించండి. సాయంత్రం వేళల్లో ఎకరాకు 200 లీటర్ల జీవామృతం పిచికారీ చేయండి.',
        waterManagement:
          'ఉదయాన్నే (05:30 - 08:30) బిందు సేద్యం ద్వారా 18 మి.మీ సమాన నీటిని అందించండి. వేర్ల కుళ్ళును నివారించడానికి మొదళ్ల వద్ద నీరు నిలవకుండా చూడండి.',
        soilHealth:
          'పంట వ్యర్థాల రక్షణ పొరను నేలపై అలాగే ఉంచండి. దుక్కి చేయని నేల భాగాలలో వానపాముల సంచారం పెరుగుతోంది.',
        cropProtection:
          'కాండం తొలుచు పురుగు మరియు పేను బంక నివారణకు హెక్టారుకు 5 లింగాకర్షక లేదా పసుపు రంగు జిగురు కార్డులను అమర్చండి.',
        regenerativePractice:
          'నత్రజని స్థిరీకరణ మరియు వేర్ల పోషణ కోసం అలసందలు లేదా పిల్లిపిసర పంటలతో అంతర పంట సాగు చేయండి.',
        next7Days:
          'రోజు 1: సూక్ష్మ నీటిపారుదల పరిశీలన. రోజు 3: జీవ ఉత్ప్రేరక పిచికారీ. రోజు 5: చేతి తొలికతో కలుపు నివారణ. రోజు 7: పూతకు పూర్వ పంట పరిశీలన.',
        disclaimer:
          'వ్యవసాయ వాతావరణ సమాచారంపై ఆధారపడిన AI సలహా. అధిక వ్యయంతో కూడిన పురుగుమందులు ఉపయోగించే ముందు స్థానిక KVK లేదా వ్యవసాయాధికారిని సంప్రదించండి.',
        timestamp: new Date().toLocaleDateString('te-IN'),
        isDemo: true,
        source: 'KhetiNexus AI (Gemini ready)',
      };

    case 'hi':
      return {
        id: 'adv-001',
        summary: `${crop} के वानस्पतिक विकास के लिए अनुकूल कृषि परिस्थितियां। दोपहर तक वाष्पीकरण तनाव की संभावना; सतह पर मल्चिंग और सूक्ष्म पोषक तत्वों के पर्ण छिड़काव की सिफारिश की जाती है।`,
        todayAction:
          'शुरुआती चूर्णिल आसिता (पाउडरी मिल्ड्यू) या पीले रतुए के धब्बों के लिए क्यारियों की निगरानी करें। शाम को 200 लीटर/हेक्टेयर जीवामृत का छिड़काव करें।',
        waterManagement:
          'सुबह (05:30 - 08:30) ड्रिप अथवा नाली द्वारा 18 मिमी के बराबर सिंचाई करें। फफूंद सड़न रोकने के लिए तने के पास जलभराव न होने दें।',
        soilHealth:
          'फसल अवशेषों का सुरक्षात्मक आवरण बनाए रखें। बिना जुताई वाले हिस्सों में केंचुओं की गतिविधि में निरंतर वृद्धि देखी जा रही है।',
        cropProtection:
          'तना छेदक और माहू की निगरानी हेतु प्रति हेक्टेयर 5 फेरोमोन व पीले चिपचिपे ट्रैप लगाएं। अनावश्यक रासायनिक कीटनाशकों के छिड़काव से बचें।',
        regenerativePractice:
          'हवा से नाइट्रोजन स्थिरीकरण और जड़ों के पोषण हेतु दलहनी फसलों (लोबिया या तिपतिया घास) के साथ अंतःफसली खेती करें।',
        next7Days:
          'दिन 1: सूक्ष्म सिंचाई जांच। दिन 3: पर्ण जैव-उत्तेजक। दिन 5: हाथ से गुड़ाई कर खरपतवार नियंत्रण। दिन 7: पुष्पन-पूर्व चंदवा निरीक्षण।',
        disclaimer:
          'कृषि-जलवायु डेटा मॉडल पर आधारित एआई-जनित कृषि सलाह। उच्च लागत वाले कृषि निवेश से पूर्व जिला कृषि विज्ञान केंद्र (केवीके) या स्थानीय कृषि विस्तार विशेषज्ञ से पुष्टि करें।',
        timestamp: new Date().toLocaleDateString('hi-IN'),
        isDemo: true,
        source: 'KhetiNexus AI (Gemini ready)',
      };

    case 'pt':
      return {
        id: 'adv-001',
        summary: `Condições favoráveis para o desenvolvimento vegetativo de ${crop} em ${loc}. Ligeiro estresse evaporativo esperado à tarde; recomenda-se cobertura morta (palhada) e pulverização foliar de micronutrientes.`,
        todayAction:
          'Inspecione as entrelinhas para detecção precoce de oídio ou ferrugem foliar. Aplique 200L/ha de extrato de composto fermentado ou biofertilizante ao final da tarde.',
        waterManagement:
          'Forneça o equivalente a 18mm via gotejamento nas primeiras horas da manhã (05:30 - 08:30). Evite empoçamento junto ao colo da planta para prevenir podridões fúngicas.',
        soilHealth:
          'Mantenha a palhada protetora sobre o solo. A atividade biológica e os coprólitos de minhocas estão aumentando nas áreas sob manejo regenerativo.',
        cropProtection:
          'Instale 5 armadilhas adesivas/feromônio por hectare para monitorar lagartas e pulgões. Evite pulverizações químicas profiláticas de amplo espectro.',
        regenerativePractice:
          'Consorcie com leguminosas de ciclo curto (feijão-caupi ou trevo) para fixação biológica de nitrogênio e exsudação radicular constante.',
        next7Days:
          'Dia 1: Checagem da microirrigação. Dia 3: Aplicação de bioestimulante foliar. Dia 5: Manejo mecânico de plantas espontâneas. Dia 7: Avaliação do dossel pré-florescimento.',
        disclaimer:
          'Recomendação agronômica gerada por IA com base em modelos agroclimáticos. Consulte um engenheiro agrônomo ou serviço de extensão rural antes de intervenções químicas de alto custo.',
        timestamp: new Date().toLocaleDateString('pt-BR'),
        isDemo: true,
        source: 'KhetiNexus AI (Gemini ready)',
      };

    case 'ru':
      return {
        id: 'adv-001',
        summary: `Благоприятные агроклиматические условия для вегетативного развития культуры (${crop}) в регионе ${loc}. Во второй половине дня ожидается умеренный испарительный стресс; рекомендовано поверхностное мульчирование и внекорневая подкормка микроэлементами.`,
        todayAction:
          'Осмотрите посевы на предмет ранних признаков мучнистой росы или желтой ржавчины. В конце дня внесите 200 л/га ферментированного компостного чая (биоинокулянта).',
        waterManagement:
          'Обеспечьте полив в объеме 18 мм капельным методом рано утром (05:30 - 08:30). Не допускайте застоя воды у прикорневой шейки во избежание корневых гнилей.',
        soilHealth:
          'Сохраняйте защитный слой растительных остатков (стерни). В ненарушенных участках почвы отмечается рост популяции дождевых червей.',
        cropProtection:
          'Установите 5 феромонных и клеевых ловушек на гектар для мониторинга тли и стеблевых вредителей. Избегайте превентивных синтетических пестицидов.',
        regenerativePractice:
          'Применяйте совместный посев с быстрорастущими бобовыми (вика, клевер) для биологической фиксации азота и питания полезной ризосферы.',
        next7Days:
          'День 1: Проверка системы микроорошения. День 3: Внекорневой биостимулятор. День 5: Механическая прополка сорняков. День 7: Оценка сомкнутости травостоя перед цветением.',
        disclaimer:
          'Агрономическая рекомендация сформирована ИИ на основе климатических моделей. Перед принятием дорогостоящих агротехнических решений проконсультируйтесь с местной агрономической службой.',
        timestamp: new Date().toLocaleDateString('ru-RU'),
        isDemo: true,
        source: 'KhetiNexus AI (Gemini ready)',
      };

    case 'zh':
      return {
        id: 'adv-001',
        summary: `${loc}地区${crop}目前处于适宜营养生长的农艺气象条件。午后可能出现轻微蒸发蒸腾胁迫；建议实施地表秸秆覆盖残茬并喷施微量元素叶面肥。`,
        todayAction:
          '巡查田间行道，监测白粉病或条锈病初期病斑。傍晚随水喷施200升/公顷发酵腐殖质提取液或生物菌剂。',
        waterManagement:
          '清晨（05:30 - 08:30）通过滴灌补充相当于18毫米的水量。避免茎基部积水以防范真菌性根腐病发生。',
        soilHealth:
          '保持保护性地表作物残茬覆盖。免耕监测样区内蚯蚓活动及粪便团聚体数量持续增加。',
        cropProtection:
          '每公顷布设5处性诱捕器和黄色粘虫板监测螟虫和蚜虫虫口密度。避免大面积预防性化学杀虫剂喷洒。',
        regenerativePractice:
          '间作套种短季豆科绿肥作物（如豇豆或三叶草），利用生物根瘤固氮并提供活性根系分泌物活化土壤。',
        next7Days:
          '第1天：微灌系统运行检查；第3天：叶面生物刺激素喷施；第5天：人工除草除杂；第7天：开花孕穗前冠层长势复查。',
        disclaimer:
          '基于农业微气象模型的AI辅助农艺咨询建议。在采取高投入农事措施前，请务必咨询当地农业技术推广部门或专业农艺师。',
        timestamp: new Date().toLocaleDateString('zh-CN'),
        isDemo: true,
        source: 'KhetiNexus AI (Gemini ready)',
      };

    default:
      return {
        id: 'adv-001',
        summary:
          'Optimal conditions for vegetative development. Slight evaporative stress expected by afternoon; recommended surface mulching and micro-nutrient foliar spray.',
        todayAction:
          'Scout field rows for early powdery mildew or yellow rust spots. Apply 200L/ha fermented compost extract (Jeevamrut/bio-tea) in late afternoon.',
        waterManagement:
          'Deliver 18mm equivalent via drip/furrow in early morning (05:30 - 08:30). Avoid pooling near stems to prevent fungal rot.',
        soilHealth:
          'Maintain protective crop residue cover. Earthworm casting count is increasing in undisturbed quadrants.',
        cropProtection:
          'Place 5 pheromone/sticky traps per hectare for stem borer and aphid monitoring. Avoid prophylactic chemical sprays.',
        regenerativePractice:
          'Intercrop with quick-growing cowpea or clover to fix atmospheric nitrogen and provide living root exudates.',
        next7Days:
          'Day 1: Micro-irrigation check. Day 3: Foliar bio-stimulant. Day 5: Weed suppression via hand hoeing. Day 7: Pre-flowering canopy inspection.',
        disclaimer:
          'AI-generated agricultural advisory based on simulated agro-climatic datasets. Verify with district agricultural extension agronomist before high-investment input deployment.',
        timestamp: new Date().toLocaleDateString('en-US'),
        isDemo: true,
        source: 'KhetiNexus AI (Gemini ready)',
      };
  }
}

// Localized Sample Diagnoses for Crop Doctor (all 5 samples across 5 languages)
export function getLocalizedSampleDiagnoses(_lang: Language): Record<string, DiagnosisResult> {
  return {};
}

export function getLocalizedInitialDiagnoses(_lang: Language): DiagnosisResult[] {
  return [];
}

// Localized Soil Report for all 5 languages
export function getLocalizedSoilReport(lang: Language, farm?: FarmProfile): SoilReport {
  const norm = normalizeLang(lang);
  const crop = farm?.crop || 'Wheat';
  const soilType = farm?.soilType || 'Alluvial Loam';

  switch (norm) {
    case 'hi':
      return {
        soilType,
        ph: 6.8,
        nitrogen: 'Medium',
        phosphorus: 'Optimal',
        potassium: 'Optimal',
        soilMoisture: 48,
        organicMatter: 1.85,
        summary: 'अनुकूल तटस्थ पीएच (6.8) के साथ संतुलित मिट्टी। जैविक कार्बन 1.85% है, जो पुनर्योजी प्रथाओं द्वारा कार्बन संचयन की पर्याप्त संभावना दर्शाता है।',
        deficiencies: [
          'वानस्पतिक विकास के चरम समय हेतु उपलब्ध नाइट्रोजन थोड़ा कम है।',
          'ग्रीष्मकालीन वाष्पीकरण से बचाव के लिए सतह पर जैविक कार्बन बढ़ाने की आवश्यकता है।',
        ],
        regenerativeRecommendations: [
          'फसल अंतराल में बहु-प्रजाति हरी खाद (सनई, सरसों) की बुवाई करें।',
          'प्रति हेक्टेयर 4-5 टन सड़ी हुई गोबर की खाद या वर्मीकम्पोस्ट मिलाएं।',
          'माइकोराइजा कवक जाल को सुरक्षित रखने के लिए शून्य या न्यूनतम जुताई अपनाएं।',
        ],
        organicMatterSuggestions:
          'कटाई के बाद 30% डंठल को मल्च के रूप में छोड़ें। अवशेषों को उर्वर ह्यूमस में बदलने के लिए बायो-डीकंपोजर का प्रयोग करें।',
        cropSpecificAdvice: `${crop} माइकोराइजा सहजीविता पर अच्छा रिस्पांस देता है; फास्फोरस के प्राकृतिक अवशोषण के लिए रासायनिक फास्फेटिक उर्वरक सीमित करें।`,
        isDemo: true,
        source: 'मृदा स्वास्थ्य एआई कोर',
      };
    case 'te':
      return {
        soilType,
        ph: 6.8,
        nitrogen: 'Medium',
        phosphorus: 'Optimal',
        potassium: 'Optimal',
        soilMoisture: 48,
        organicMatter: 1.85,
        summary: 'అనుకూలమైన తటస్థ pH (6.8) కలిగిన సమతుల్య నేల. సేంద్రియ పదార్థం 1.85% గా ఉంది, ఇది పునరుత్పాదక కర్బన సంరక్షణకు మరియు పంట దిగుబడి పెంపునకు గొప్ప అవకాశం కల్పిస్తుంది.',
        deficiencies: [
          'పైరు ఏపుగా పెరిగే దశలో అందుబాటులో ఉండే నత్రజని స్వల్పంగా తక్కువగా ఉంది.',
          'ఎండాకాలంలో తేమ ఆవిరి కాకుండా కాపాడుకోవడానికి ఉపరితల సేంద్రియ కర్బనాన్ని పెంచడం అవసరం.',
        ],
        regenerativeRecommendations: [
          'రెండు పంటల మధ్య ఖాళీ సమయంలో జీలుగ, జనుము వంటి బహుళ జాతుల పచ్చిరొట్ట పంటలను సాగు చేయండి.',
          'ఎకరాకు లేదా హెక్టారుకు 4-5 టన్నుల బాగా చివికిన పశువుల ఎరువు లేదా వర్మీకంపోస్ట్ కలపండి.',
          'నేలలో మేలు చేసే మైకోరైజా శిలీంధ్రాల నెట్‌వర్క్‌ను కాపాడటానికి జీరో టిల్లేజ్ (కనీస దుక్కి) పాటించండి.',
        ],
        organicMatterSuggestions:
          'కోత తర్వాత 30% కొయ్యలను పొలంలోనే మల్చింగ్‌గా వదిలేయండి. వ్యర్థాలను ఎరువుగా మార్చే బయో-డీకంపోజర్‌ను ఉపయోగించండి.',
        cropSpecificAdvice: `${crop} పంట మైకోరైజా సహజీవనానికి చక్కగా స్పందిస్తుంది; సహజసిద్ధంగా భాస్వరాన్ని గ్రహించేందుకు రసాయన ఎరువులను నియంత్రించండి.`,
        isDemo: true,
        source: 'మృదా హెల్త్ AI ఇంటెలిజెన్స్ కోర్',
      };
    case 'ta':
      return {
        soilType,
        ph: 6.8,
        nitrogen: 'Medium',
        phosphorus: 'Optimal',
        potassium: 'Optimal',
        soilMoisture: 48,
        organicMatter: 1.85,
        summary: 'ஏதுவான நடுநிலை pH (6.8) கொண்ட சீரான மண். கரிமப் பொருட்கள் 1.85% ஆக உள்ளது, இது மறுஉற்பத்தி கார்பன் சேமிப்புக்கான சிறந்த வாய்ப்பை வழங்குகிறது.',
        deficiencies: [
          'பயிரின் தீவிர வளர்ச்சிப் பருவத்திற்கு கிடைக்கக்கூடிய தழைச்சத்து சற்றே குறைவாக உள்ளது.',
          'கோடைக்கால ஈரப்பதம் ஆவியாவதைத் தடுக்க மேற்பரப்பு கரிமக் கார்பனை அதிகரிக்க வேண்டும்.',
        ],
        regenerativeRecommendations: [
          'பயிர் இடைவெளியில் சணப்பை, தக்கைப்பூண்டு போன்ற பலவகை பசுந்தாள் பயிர்களைப் பயிரிடவும்.',
          'ஹெக்டேருக்கு 4-5 டன் மக்கிய தொழு உரம் அல்லது மண்புழு உரத்தை இடவும்.',
          'மண்ணில் நன்மை தரும் மைக்கோரைசா பூஞ்சை வலையை பாதுகாக்க பூஜ்ஜிய அல்லது குறைந்தபட்ச உழவை மேற்கொள்ளவும்.',
        ],
        organicMatterSuggestions:
          'அறுவடைக்குப் பிறகு 30% பயிர்க்கழிவுகளை நிலத்திலேயே மூடாக்காக விடவும். மக்கும் நுண்ணுயிர் கலவையைப் பயன்படுத்தவும்.',
        cropSpecificAdvice: `${crop} பயிர் மைக்கோரைசா பூஞ்சை கூட்டமைப்புக்குச் சிறந்த பலன் தருகிறது; இரசாயன பாஸ்பேட் உரங்களை குறைக்கவும்.`,
        isDemo: true,
        source: 'மண் வள AI நுண்ணறிவு மையம்',
      };
    case 'kn':
      return {
        soilType,
        ph: 6.8,
        nitrogen: 'Medium',
        phosphorus: 'Optimal',
        potassium: 'Optimal',
        soilMoisture: 48,
        organicMatter: 1.85,
        summary: 'ಅನುಕೂಲಕರ ತಟಸ್ಥ pH (6.8) ಹೊಂದಿರುವ ಸಮತೋಲಿತ ಮಣ್ಣು. ಸಾವಯವ ಪದಾರ್ಥವು 1.85% ರಷ್ಟಿದ್ದು, ಪುನರುತ್ಪಾದಕ ಇಂಗಾಲ ಸಂಗ್ರಹಣೆಗೆ ಅತ್ಯುತ್ತಮ ಅವಕಾಶವನ್ನು ಸೂಚಿಸುತ್ತದೆ.',
        deficiencies: [
          'ಬೆಳೆಯ ಗರಿಷ್ಠ ಬೆಳವಣಿಗೆಯ ಹಂತದಲ್ಲಿ ಲಭ್ಯವಿರುವ ಸಾರಜನಕವು ಸ್ವಲ್ಪ ಪ್ರಮಾಣದಲ್ಲಿ ಕಡಿಮೆಯಾಗಿದೆ.',
          'ಬೇಸಿಗೆಯ ಆವಿಯಾಗುವಿಕೆಯನ್ನು ತಡೆದುಕೊಳ್ಳಲು ಮೇಲ್ಮೈ ಸಾವಯವ ಇಂಗಾಲವನ್ನು ಹೆಚ್ಚಿಸುವುದು ಅಗತ್ಯ.',
        ],
        regenerativeRecommendations: [
          'ಬೆಳೆಗಳ ನಡುವಿನ ಅವಧಿಯಲ್ಲಿ ಸೆಣಬು, ಡೈಂಚಾದಂತಹ ಬಹುಜಾತಿಯ ಹಸಿರೆಲೆ ಗೊಬ್ಬರ ಬೆಳೆಗಳನ್ನು ಬೆಳೆಯಿರಿ.',
          'ಪ್ರತಿ ಹೆಕ್ಟೇರ್‌ಗೆ 4-5 ಟನ್ ಕೊಳೆತ ಕೊಟ್ಟಿಗೆ ಗೊಬ್ಬರ ಅಥವಾ ಎರೆಹುಳು ಗೊಬ್ಬರವನ್ನು ಸೇರಿಸಿ.',
          'ಮೈಕೋರೈಜಾ ಶಿಲೀಂಧ್ರ ಜಾಲವನ್ನು ಸಂರಕ್ಷಿಸಲು ಶೂನ್ಯ ಅಥವಾ ಕನಿಷ್ಠ ಉಳುಮೆ ಪದ್ಧತಿಯನ್ನು ಅಳವಡಿಸಿಕೊಳ್ಳಿ.',
        ],
        organicMatterSuggestions:
          'ಕೊಯ್ಲಿನ ನಂತರ ಶೇ 30 ರಷ್ಟು ಬೆಳೆ ತ್ಯಾಜ್ಯವನ್ನು ಮಣ್ಣಿನ ಮೇಲೆ ಹೊದಿಕೆಯಾಗಿ ಬಿಡಿ. ಜೈವಿಕ ವಿಘಟಕಗಳನ್ನು ಬಳಸಿ.',
        cropSpecificAdvice: `${crop} ಬೆಳೆಯು ಮೈಕೋರೈಜಾ ಸಹಜೀವನಕ್ಕೆ ಉತ್ತಮವಾಗಿ ಸ್ಪಂದಿಸುತ್ತದೆ; ನೈಸರ್ಗಿಕ ರಂಜಕ ಹೀರಿಕೆಗೆ ರಾಸಾಯನಿಕ ರಂಜಕ ಕಡಿಮೆ ಮಾಡಿ.`,
        isDemo: true,
        source: 'ಮಣ್ಣಿನ ಆರೋಗ್ಯ AI ಕೋರ್',
      };
    case 'mr':
      return {
        soilType,
        ph: 6.8,
        nitrogen: 'Medium',
        phosphorus: 'Optimal',
        potassium: 'Optimal',
        soilMoisture: 48,
        organicMatter: 1.85,
        summary: 'अनुकूल तटस्थ सामू (6.8) सह संतुलित माती. सेंद्रिय घटक 1.85% असून, पुनरुत्पादक कार्बन साठवणूक आणि उत्पादकतेसाठी उत्तम संधी आहे.',
        deficiencies: [
          'पिकाच्या जोमदार वाढीच्या टप्प्यासाठी उपलब्ध नत्र किंचित कमी आहे.',
          'उन्हाळ्यात ओलावा टिकवून ठेवण्यासाठी जमिनीतील सेंद्रिय कर्ब वाढवणे आवश्यक आहे.',
        ],
        regenerativeRecommendations: [
          'पिकांच्या मधल्या काळात ताग, धैंचा यांसारखी बहु-प्रजाती हिरवळीची खते घ्या.',
          'प्रति हेक्टरी 4-5 टन चांगले कुजलेले शेणखत किंवा गांडूळ खत जमिनीत मिसळा.',
          'मातीतील मायकोरायझा बुरशीचे जाळे सुरक्षित ठेवण्यासाठी कमीत कमी मशागत करा.',
        ],
        organicMatterSuggestions:
          'कापणीनंतर ३०% काडीकचरा शेतात आच्छादन म्हणून ठेवा. सेंद्रिय अवशेष कुजवण्यासाठी वेस्ट डीकंपोजर वापरा.',
        cropSpecificAdvice: `${crop} पीक मायकोरायझा सहजीवनाला चांगला प्रतिसाद देते; नैसर्गिक स्फुरद उचलण्यासाठी रासायनिक खते मर्यादित ठेवा.`,
        isDemo: true,
        source: 'मृदा आरोग्य AI निदान केंद्र',
      };
    case 'gu':
      return {
        soilType,
        ph: 6.8,
        nitrogen: 'Medium',
        phosphorus: 'Optimal',
        potassium: 'Optimal',
        soilMoisture: 48,
        organicMatter: 1.85,
        summary: 'અનુકૂળ તટસ્થ pH (6.8) ધરાવતી સંતુલિત જમીન. કાર્બનિક પદાર્થ 1.85% છે, જે પુનર્જીવિત કાર્બન સંગ્રહ માટે ઉત્તમ તક દર્શાવે છે.',
        deficiencies: [
          'પાકના મહત્તમ વાનસ્પતિક વિકાસ માટે ઉપલબ્ધ નાઇટ્રોજન સહેજ ઓછો છે.',
          'ઉનાળામાં ભેજના રક્ષણ માટે સપાટી પર કાર્બનિક કાર્બન વધારવો જરૂરી છે.',
        ],
        regenerativeRecommendations: [
          'પાક વચ્ચેના ગાળામાં શણ, ઇકડ (ઢેંચા) જેવા લીલા પડવાશના પાકો વાવો.',
          'હેક્ટર દીઠ 4-5 ટન પાકેલું છાણીયું ખાતર અથવા અળસિયાનું ખાતર ઉમેરો.',
          'માઇકોરાઇઝા ફૂગના જાળને સુરક્ષિત રાખવા ન્યૂનતમ અથવા ઝીરો ટિલેજ પદ્ધતિ અપનાવો.',
        ],
        organicMatterSuggestions:
          'લણણી પછી 30% અવશેષો ખેતરમાં મલ્ચિંગ તરીકે રાખો. બાયો-ડીકમ્પોઝરનો ઉપયોગ કરો.',
        cropSpecificAdvice: `${crop} પાક માઇકોરાઇઝા સાથે સારો તાલમેલ ધરાવે છે; કુદરતી ફોસ્ફરસ ઉપાડ વધારવા રાસાયણિક ખાતરો મર્યાદિત કરો.`,
        isDemo: true,
        source: 'જમીન આરોગ્ય AI વિશ્લેષણ કોર',
      };
    case 'bn':
      return {
        soilType,
        ph: 6.8,
        nitrogen: 'Medium',
        phosphorus: 'Optimal',
        potassium: 'Optimal',
        soilMoisture: 48,
        organicMatter: 1.85,
        summary: 'অনুকূল নিরপেক্ষ pH (6.8) সহ সুষম মাটি। জৈব পদার্থ 1.85%, যা পুনরুজ্জীবক কার্বন সঞ্চয় ও ফসল বৃদ্ধির দুর্দান্ত সুযোগ দেয়।',
        deficiencies: [
          'সর্বোচ্চ বৃদ্ধির পর্যায়ে সহজলভ্য নাইট্রোজেন কিছুটা কম রয়েছে।',
          'গ্রীষ্মে মাটির আর্দ্রতা ধরে রাখতে উপরিভাগে জৈব কার্বন বৃদ্ধি করা প্রয়োজন।',
        ],
        regenerativeRecommendations: [
          'ফসলের অন্তর্বর্তী সময়ে ধৈঞ্চা, শণ ইত্যাদি বহুবিধ সবুজ সার চাষ করুন।',
          'হেক্টর প্রতি ৪-৫ টন পচা গোবর সার বা কেঁচো সার প্রয়োগ করুন।',
          'মাইকোরাইজা ছত্রাকের নেটওয়ার্ক সুরক্ষিত রাখতে ন্যূনতম চাষ পদ্ধতি অনুসরণ করুন।',
        ],
        organicMatterSuggestions:
          'ফসল কাটার পর ৩০% ফসলের অবশিষ্টাংশ জমিতে মালচ হিসেবে রাখুন। জৈব ডিকম্পোজার প্রয়োগ করুন।',
        cropSpecificAdvice: `${crop} ফসল মাইকোরাইজা মিথোজীবিতায় খুব ভালো সাড়া দেয়; প্রাকৃতিক ফসফরাস শোষণে রাসায়নিক সার সীমিত করুন।`,
        isDemo: true,
        source: 'মৃত্তিকা স্বাস্থ্য AI ইন্টেলিজেন্স',
      };
    case 'pa':
      return {
        soilType,
        ph: 6.8,
        nitrogen: 'Medium',
        phosphorus: 'Optimal',
        potassium: 'Optimal',
        soilMoisture: 48,
        organicMatter: 1.85,
        summary: 'ਅਨੁਕੂਲ ਨਿਰਪੱਖ pH (6.8) ਵਾਲੀ ਸੰਤੁਲਿਤ ਮਿੱਟੀ। ਜੈਵਿਕ ਮਾਦਾ 1.85% ਹੈ, ਜੋ ਕਾਰਬਨ ਸੰਭਾਲ ਅਤੇ ਉਪਜ ਵਧਾਉਣ ਦਾ ਵਧੀਆ ਮੌਕਾ ਦਰਸਾਉਂਦਾ ਹੈ।',
        deficiencies: [
          'ਫ਼ਸਲ ਦੇ ਮੁੱਖ ਵਾਧੇ ਦੇ ਸਮੇਂ ਨਾਈਟ੍ਰੋਜਨ ਦੀ ਉਪਲਬਧਤਾ ਕੁਝ ਘੱਟ ਹੈ।',
          'ਗਰਮੀਆਂ ਵਿੱਚ ਨਮੀ ਸੰਭਾਲਣ ਲਈ ਜ਼ਮੀਨ ਵਿੱਚ ਜੈਵਿਕ ਕਾਰਬਨ ਵਧਾਉਣਾ ਲਾਜ਼ਮੀ ਹੈ।',
        ],
        regenerativeRecommendations: [
          'ਫ਼ਸਲੀ ਵਕਫ਼ੇ ਦੌਰਾਨ ਜੰਤਰ ਜਾਂ ਸਣ ਵਰਗੀਆਂ ਹਰੀਆਂ ਖਾਦਾਂ ਦੀ ਕਾਸ਼ਤ ਕਰੋ।',
          'ਪ੍ਰਤੀ ਹੈਕਟੇਅਰ 4-5 ਟਨ ਚੰਗੀ ਗਲੀ-ਸੜੀ ਰੂੜੀ ਜਾਂ ਗੰਡੋਆ ਖਾਦ ਪਾਓ।',
          'ਮਾਈਕੋਰਾਈਜ਼ਾ ਉੱਲੀ ਦੇ ਜਾਲ ਨੂੰ ਸੁਰੱਖਿਅਤ ਰੱਖਣ ਲਈ ਘੱਟੋ-ਘੱਟ ਵਾਹੀ (ਜ਼ੀਰੋ-ਟਿਲੇਜ) ਅਪਣਾਓ।',
        ],
        organicMatterSuggestions:
          'ਵਾਢੀ ਤੋਂ ਬਾਅਦ 30% ਪਰਾਲੀ ਖੇਤ ਵਿੱਚ ਮਲਚ ਵਜੋਂ ਰੱਖੋ। ਵੇਸਟ ਡੀਕੰਪੋਜ਼ਰ ਵਰਤੋ।',
        cropSpecificAdvice: `${crop} ਫ਼ਸਲ ਮਾਈਕੋਰਾਈਜ਼ਾ ਨਾਲ ਵਧੀਆ ਤਾਲਮੇਲ ਦਿਖਾਉਂਦੀ ਹੈ; ਕੁਦਰਤੀ ਫਾਸਫੋਰਸ ਦੀ ਸਮਾਈ ਵਧਾਉਣ ਲਈ ਰਸਾਇਣਕ ਖਾਦਾਂ ਸੀਮਤ ਕਰੋ।`,
        isDemo: true,
        source: 'ਮਿੱਟੀ ਸਿਹਤ AI ਨਿਦਾਨ ਕੇਂਦਰ',
      };
    case 'ml':
      return {
        soilType,
        ph: 6.8,
        nitrogen: 'Medium',
        phosphorus: 'Optimal',
        potassium: 'Optimal',
        soilMoisture: 48,
        organicMatter: 1.85,
        summary: 'അനുയോജ്യമായ ന്യൂട്രൽ pH (6.8) ഉള്ള സമതുലിതമായ മണ്ണ്. ജൈവവസ്തുക്കൾ 1.85% ആണ്, ഇത് കാർബൺ സംഭരണത്തിന് മികച്ച അവസരം നൽകുന്നു.',
        deficiencies: [
          'വിളയുടെ വളർച്ചാ ഘട്ടത്തിൽ ലഭ്യമായ നൈട്രജൻ അല്പം കുറവാണ്.',
          'വേനൽക്കാലത്ത് ഈർപ്പം നിലനിർത്താൻ ഉപരിതല ഓർഗാനിക് കാർബൺ വർദ്ധിപ്പിക്കേണ്ടതുണ്ട്.',
        ],
        regenerativeRecommendations: [
          'ഇടവേളകളിൽ ചണം, പയർവർഗ്ഗങ്ങൾ തുടങ്ങിയ പച്ചിലവളങ്ങൾ കൃഷി ചെയ്യുക.',
          'ഹെക്ടറിന് 4-5 ടൺ ഉണങ്ങിയ ചാണകപ്പൊടിയോ മണ്ണിരക്കമ്പോസ്റ്റോ ചേർക്കുക.',
          'മണ്ണിലെ മൈക്കോറൈസ സൂക്ഷ്മാണുക്കളെ സംരക്ഷിക്കാൻ കുറഞ്ഞ ഉഴവ് രീതി സ്വീകരിക്കുക.',
        ],
        organicMatterSuggestions:
          'വിളവെടുപ്പിന് ശേഷം 30% അവശിഷ്ടങ്ങൾ പുതയായി നിലനിർത്തുക. ബയോ-ഡികമ്പോസർ ഉപയോഗിക്കുക.',
        cropSpecificAdvice: `${crop} മൈക്കോറൈസ ബാക്ടീരിയ കൂട്ടുകെട്ടിനോട് അനുകൂലമായി പ്രതികരിക്കുന്നു; ഫോസ്ഫറസ് ആഗിരണത്തിന് രാസവളങ്ങൾ പരിമിതപ്പെടുത്തുക.`,
        isDemo: true,
        source: 'മണ്ണ് ആരോഗ്യ AI ഡയഗ്നോസ്റ്റിക് കോർ',
      };
    case 'or':
      return {
        soilType,
        ph: 6.8,
        nitrogen: 'Medium',
        phosphorus: 'Optimal',
        potassium: 'Optimal',
        soilMoisture: 48,
        organicMatter: 1.85,
        summary: 'ଅନୁକୂଳ ତଟସ୍ଥ pH (6.8) ବିଶିଷ୍ଟ ସନ୍ତୁଳିତ ମାଟି। ଜୈବିକ ପଦାର୍ଥ 1.85% ରହିଛି, ଯାହା ଅଙ୍ଗାରକ ସଂରକ୍ଷଣ ଓ ଅମଳ ବୃଦ୍ଧିର ଉତ୍ତମ ସୁଯୋଗ ପ୍ରଦାନ କରେ।',
        deficiencies: [
          'ଫସଲର ବୃଦ୍ଧି ସମୟରେ ଉପଲବ୍ଧ ଯବକ୍ଷାରଜାନ ସାମାନ୍ୟ କମ ରହିଛି।',
          'ଖରା ଦିନେ ମାଟିର ଆର୍ଦ୍ରତା ରକ୍ଷା ପାଇଁ ଉପରିଭାଗ ଜୈବିକ ଅଙ୍ଗାରକ ବୃଦ୍ଧି ଆବଶ୍ୟକ।',
        ],
        regenerativeRecommendations: [
          'ଫସଲ ବ୍ୟବଧାନରେ ଧଇଞ୍ଚା, ଛଣ ଆଦି ସବୁଜ ଖତ ଫସଲ ଚାଷ କରନ୍ତୁ।',
          'ହେକ୍ଟର ପ୍ରତି ୪-୫ ଟନ ସଢ଼ା ଗୋବର ଖତ ବା ଭର୍ମିକମ୍ପୋଷ୍ଟ ପ୍ରୟୋଗ କରନ୍ତୁ।',
          'ମାଇକୋରାଇଜା ଜୀବାଣୁ ସୁରକ୍ଷା ପାଇଁ ସର୍ବନିମ୍ନ ଚାଷ ପ୍ରଣାଳୀ ଆପଣାନ୍ତୁ।',
        ],
        organicMatterSuggestions:
          'ଅମଳ ପରେ ୩୦% ନଡ଼ା କ୍ଷେତରେ ମଲଚ ଭାବେ ରଖନ୍ତୁ। ବାୟୋ-ଡିକମ୍ପୋଜର ବ୍ୟବହାର କରନ୍ତୁ।',
        cropSpecificAdvice: `${crop} ଫସଲ ମାଇକୋରାଇଜା ସହଜୀବିତାରେ ଭଲ ଫଳ ଦିଏ; ପ୍ରାକୃତିକ ଫସଫରସ ଗ୍ରହଣ ପାଇଁ ରାସାୟନିକ ସାର ସୀମିତ କରନ୍ତୁ।`,
        isDemo: true,
        source: 'ମୃତ୍ତିକା ସ୍ୱାସ୍ଥ୍ୟ AI କୋର',
      };
    case 'as':
      return {
        soilType,
        ph: 6.8,
        nitrogen: 'Medium',
        phosphorus: 'Optimal',
        potassium: 'Optimal',
        soilMoisture: 48,
        organicMatter: 1.85,
        summary: 'অনুকূল নিৰপেক্ষ pH (6.8) যুক্ত সুষম মাটি। জৈৱিক পদাৰ্থ 1.85%, যিয়ে কাৰ্বন সংৰক্ষণ আৰু শস্যৰ উৎপাদন বৃদ্ধিৰ উৎকৃষ্ট সুযোগ দিয়ে।',
        deficiencies: [
          'শস্যৰ প্ৰধান বৃদ্ধি কালত নাইট্ৰ’জেনৰ মাত্ৰা কিছু কম পৰিমাণে আছে।',
          'খৰালিত মাটিৰ সেমেকা ভাব ধৰি ৰাখিবলৈ জৈৱিক কাৰ্বন বৃদ্ধি কৰা প্ৰয়োজন।',
        ],
        regenerativeRecommendations: [
          'শস্যৰ মধ্যৱৰ্তী সময়ত ধাইঞ্চা বা শণ খেতি কৰি সেউজ সাৰ প্ৰয়ୋগ কৰক।',
          'হেক্টৰে প্ৰতি ৪-৫ টন পচন সাৰ বা কেঁচু সাৰ মাটিত মিহলাওক।',
          'মাইক’ৰাইজা ভেঁকুৰ সংৰক্ষণৰ বাবে শূন্য বা নূন্যতম চহ পদ্ধতি অৱলম্বন কৰক।',
        ],
        organicMatterSuggestions:
          'শস্য চপোৱাৰ পিছত ৩০% অৱশিষ্ট অংশ মাটিত আৱৰণ হিচাপে ৰাখক। ডিকম্প’জাৰ ব্যৱহাৰ কৰক।',
        cropSpecificAdvice: `${crop} শস্যই মাইক’ৰাইজাৰ সৈতে সুন্দৰ ফলাফল দিয়ে; ৰাসায়নিক ফছফেট সাৰ সীমিত কৰক।`,
        isDemo: true,
        source: 'মাটি স্বাস্থ্য AI কেন্দ্ৰ',
      };
    case 'ur':
      return {
        soilType,
        ph: 6.8,
        nitrogen: 'Medium',
        phosphorus: 'Optimal',
        potassium: 'Optimal',
        soilMoisture: 48,
        organicMatter: 1.85,
        summary: 'موافق متوازن پی ایچ (6.8) والی زرخیز مٹی۔ نامیاتی مادہ 1.85 فیصد ہے، جو کاربن کے ذخیرے اور پیداوار بڑھانے کا بہترین موقع فراہم کرتا ہے۔',
        deficiencies: [
          'فصل کی نشوونما کے عروج پر نائٹروجن کی دستیابی قدرے کم ہے۔',
          'گرمیوں میں نمی کے تحفظ کے لیے زمین میں نامیاتی کاربن بڑھانا ضروری ہے۔',
        ],
        regenerativeRecommendations: [
          'فصلوں کے درمیانی وقفے میں ڈھینچہ یا سن کی سبز کھاد کاشت کریں۔',
          'فی ہیکٹر 4-5 ٹن اچھی گلی سڑی گوبر کی کھاد یا ورمی کمپوسٹ ملائیں۔',
          'مائیکورائزا فنگس کے نظام کو بچانے کے لیے زیرو ٹل یا کم سے کم ہل چلانے کا طریقہ اپنائیں۔',
        ],
        organicMatterSuggestions:
          'کٹائی کے بعد 30 فیصد باقیات کو ملچ کے طور پر کھیت میں چھوڑیں۔ ویسٹ ڈی کمپوزر استعمال کریں۔',
        cropSpecificAdvice: `${crop} کی فصل مائیکورائزا کے ساتھ بہترین نتائج دیتی ہے؛ قدرتی فاسفورس کے حصول کے لیے کیمیائی کھادوں کا استعمال متوازن رکھیں۔`,
        isDemo: true,
        source: 'سوائل ہیلتھ AI تشخیصی مرکز',
      };
    case 'es':
      return {
        soilType,
        ph: 6.8,
        nitrogen: 'Medium',
        phosphorus: 'Optimal',
        potassium: 'Optimal',
        soilMoisture: 48,
        organicMatter: 1.85,
        summary: 'Suelo bien equilibrado con pH neutro favorable (6.8). La materia orgánica es del 1.85%, lo que sugiere una oportunidad significativa para el secuestro regenerativo de carbono.',
        deficiencies: [
          'El nitrógeno disponible es ligeramente subóptimo para el pico vegetativo.',
          'El carbono orgánico superficial debe mejorarse para resistir la pérdida por evaporación estival.',
        ],
        regenerativeRecommendations: [
          'Introduzca cultivos de cobertura multiespecies (crotalaria, mostaza, veza) en el barbecho.',
          'Incorpore estiércol maduro (FYM) o vermicompost a razón de 4-5 t/ha.',
          'Adopte labranza mínima para no perturbar las redes de hongos micorrízicos arbusculares.',
        ],
        organicMatterSuggestions:
          'Deje el 30% del rastrojo en el campo como acolchado. Bioinocule con hongos descomponedores.',
        cropSpecificAdvice: `El cultivo de ${crop} responde favorablemente a la colonización micorrízica; minimice los fertilizantes fosfatados sintéticos.`,
        isDemo: true,
        source: 'Núcleo de Diagnóstico de Salud del Suelo AI',
      };
    case 'fr':
      return {
        soilType,
        ph: 6.8,
        nitrogen: 'Medium',
        phosphorus: 'Optimal',
        potassium: 'Optimal',
        soilMoisture: 48,
        organicMatter: 1.85,
        summary: 'Sol bien équilibré avec un pH neutre favorable (6,8). La matière organique est de 1,85 %, offrant une belle opportunité de séquestration de carbone régénérative.',
        deficiencies: [
          'L’azote disponible est légèrement sous-optimal pour le pic végétatif.',
          'Le carbone organique de surface doit être enrichi pour limiter l’évaporation estivale.',
        ],
        regenerativeRecommendations: [
          'Implanter des couverts végétaux multi-espèces (crotalaire, moutarde, vesce) en interculture.',
          'Incorporer 4 à 5 t/ha de fumier bien décomposé ou de lombricompost.',
          'Adopter le non-labour pour préserver les réseaux mycorhiziens arbusculaires.',
        ],
        organicMatterSuggestions:
          'Conserver 30 % des chaumes après récolte comme paillage. Inoculer des bio-décomposeurs.',
        cropSpecificAdvice: `La culture de ${crop} réagit très bien à la mycorhization ; limitez les engrais phosphatés solubles.`,
        isDemo: true,
        source: 'Pôle Diagnostic Santé des Sols IA',
      };
    case 'ar':
      return {
        soilType,
        ph: 6.8,
        nitrogen: 'Medium',
        phosphorus: 'Optimal',
        potassium: 'Optimal',
        soilMoisture: 48,
        organicMatter: 1.85,
        summary: 'تربة متوازنة وممتازة ذات درجة حموضة محايدة (6.8). تبلغ المادة العضوية 1.85% مما يوفر فرصة كبيرة لاحتجاز الكربون العضوي التجديدي.',
        deficiencies: [
          'النيتروجين المتاح أقل قليلاً من المستوى الأمثل لذروة النمو الخضري.',
          'يحتاج الكربون العضوي السطحي إلى تعزيز لتحمل الفقد الناتج عن التبخر في الصيف.',
        ],
        regenerativeRecommendations: [
          'زراعة محاصيل تغطية متعددة الأنواع (سيسبانيا، خردل، بيقية) خلال فترات الراحة.',
          'إضافة السماد العضوي المتخمر أو كمبوست الديدان بمعدل 4-5 أطنان/هكتار.',
          'اعتماد الزراعة بدون حرث لحماية شبكات الفطريات الجذرية (الميكوريزا).',
        ],
        organicMatterSuggestions:
          'ترك 30% من بقايا المحصول كغطاء واقٍ للتربة. استخدام المحللات الحيوية للسيليلوز.',
        cropSpecificAdvice: `يستجيب محصول ${crop} بشكل إيجابي للتعايش الفطري؛ قلل الأسمدة الفوسفاتية الكيميائية لتحفيز الامتصاص الحيوي.`,
        isDemo: true,
        source: 'مركز الذكاء الاصطناعي لتشخيص صحة التربة',
      };
    case 'ru':
      return {
        soilType,
        ph: 6.8,
        nitrogen: 'Medium',
        phosphorus: 'Optimal',
        potassium: 'Optimal',
        soilMoisture: 48,
        organicMatter: 1.85,
        summary: 'Хорошо сбалансированная почва с благоприятным нейтральным pH (6,8). Органическое вещество составляет 1,85%, что открывает значительный потенциал для углеродного депонирования.',
        deficiencies: [
          'Доступный азот слегка ниже оптимума для пиковой вегетации.',
          'Поверхностный органический углерод требует пополнения для предотвращения испарения влаги.',
        ],
        regenerativeRecommendations: [
          'Вводите многовидовые покровные культуры (вика, горчица, редька) в промежуточный период.',
          'Вносите 4-5 т/га зрелого компоста или вермикомпоста.',
          'Используйте прямой посев (No-Till) для защиты микоризных сетей.',
        ],
        organicMatterSuggestions:
          'Оставляйте не менее 30% пожнивных остатков на поверхности. Проводите биодеструкцию стерни.',
        cropSpecificAdvice: `Культура (${crop}) активно откликается на микоризацию; снижайте синтетические фосфаты для развития симбиоза.`,
        isDemo: true,
        source: 'Диагностический модуль плодородия ИИ',
      };
    case 'zh':
      return {
        soilType,
        ph: 6.8,
        nitrogen: 'Medium',
        phosphorus: 'Optimal',
        potassium: 'Optimal',
        soilMoisture: 48,
        organicMatter: 1.85,
        summary: '土壤理化指标均衡，pH值为中性（6.8）。土壤有机质含量为1.85%，通过再生农业固碳提升潜力显著。',
        deficiencies: [
          '速效氮处于中等偏低水平，难以满足旺盛营养生长需求。',
          '表层有机碳需要进一步提升以抵御夏季地表水分强烈蒸发。',
        ],
        regenerativeRecommendations: [
          '在休闲期种植多物种混播覆盖绿肥作物（田菁、苜蓿、油菜）。',
          '每公顷施用4-5吨充分腐熟农家肥或生物有机肥。',
          '坚持保护性少免耕以防止破坏丛枝菌根真菌网络结构。',
        ],
        organicMatterSuggestions:
          '保留至少30%机收秸秆作为地表覆盖物，配合施用复合秸秆腐熟微生物菌剂。',
        cropSpecificAdvice: `${crop}对菌根真菌共生反应良好；适度控制化学速效磷肥用量以促进生物磷吸收。`,
        isDemo: true,
        source: '土壤健康智能诊断核心',
      };
    default:
      return {
        soilType,
        ph: 6.8,
        nitrogen: 'Medium',
        phosphorus: 'Optimal',
        potassium: 'Optimal',
        soilMoisture: 48,
        organicMatter: 1.85,
        summary:
          'Well-balanced soil with favorable neutral pH (6.8). Organic matter is moderately low (1.85%), suggesting significant opportunity for regenerative carbon sequestration.',
        deficiencies: [
          'Available Nitrogen is slightly sub-optimal for peak vegetative push.',
          'Surface organic carbon needs enhancement to withstand high summer evaporative loss.',
        ],
        regenerativeRecommendations: [
          'Introduce multi-species cover crops (sunn hemp, mustard, hairy vetch) during inter-season fallow.',
          'Incorporate aged farmyard manure (FYM) or vermicompost at 4-5 metric tons per hectare.',
          'Adopt minimum tillage to prevent disruption of arbuscular mycorrhizal fungal networks.',
        ],
        organicMatterSuggestions:
          'Leave 30% of post-harvest crop stubble on field as mulch. Bio-inoculate with cellulose-decomposing fungi.',
        cropSpecificAdvice: `${crop} responds favorably to mycorrhizal colonization; minimize synthetic phosphatic fertilizer.`,
        isDemo: true,
        source: 'Soil Health AI Diagnostic Core',
      };
  }
}

/**
 * Provides comprehensive Farm Profile UI labels translated across all supported languages
 */
export function getFarmProfileUILabels(lang: Language | string) {
  const norm = normalizeLang(lang);

  const labels: Record<string, Record<string, string>> = {
    te: {
      activeSourceOfTruth: 'అధికారిక ప్రాథమిక సమాచారం',
      synchronizedTelemetry: 'వ్యవసాయ సలహా & క్రాప్ డాక్టర్‌తో అనుసంధానించబడింది',
      cloudFirestoreRegistry: 'క్లౌడ్ రికార్డులు',
      userFarmsDesc: 'మీ క్లౌడ్‌లో భద్రపరచబడిన వ్యవసాయ క్షేత్రాలను నిర్వహించండి.',
      loginToPersonalize: 'ఎక్కువ పొలాలను భద్రపరచడానికి మరియు సింక్ చేయడానికి లాగిన్ చేయండి.',
      addFarm: 'పొలాన్ని జోడించండి',
      editFarm: 'సవరించండి',
      deleteFarm: 'తొలగించండి',
      activeFarm: 'యాక్టివ్',
      farmNameLabel: 'పొలం పేరు',
      farmNamePlaceholder: 'ఉదా. శ్రీ లక్ష్మీ నరసింహ పొలం',
      farmIdentificationHeader: '1. పొలం వివరాలు & లొకేషన్ సమాచారం',
      agronomicClassificationHeader: '2. పంట & నేల వర్గీకరణ',
      calibratesAdvisory: 'క్రాప్ డాక్టర్ & వ్యవసాయ సలహా వ్యవస్థకు ఉపయోగపడుతుంది',
      cropVarietyLabel: 'పంట రకం / వెరైటీ',
      cropVarietyPlaceholder: 'ఉదా. PBW-343, శరబతి, BPT-5204',
      soilTypeLabelShort: 'వర్గీకరణ',
      resetToSaved: 'సేవ్ చేసిన వివరాలకు రీసెట్ చేయి',
      useLiveGps: 'లైవ్ GPS లొకేషన్ ఉపయోగించండి',
      locating: 'లొకేషన్ సేకరిస్తోంది...',
      geocodeBtn: 'జియోకోడ్ రికవరీ',
      geocoding: 'కోఆర్డినేట్లు గుర్తిస్తోంది...',
      districtLabel: 'జిల్లా',
      subDistrictLabel: 'ఉప-జిల్లా / మండలం / తహసీల్',
      villageLabel: 'గ్రామం / పట్టణం / ప్రాంతం',
      deleteFarmModalTitle: 'పొలాన్ని తొలగించాలా?',
      deleteFarmModalDesc: 'ఈ చర్య ఈ పొలం మరియు దానికి సంబంధించిన అన్ని రికార్డులను శాశ్వతంగా తొలగిస్తుంది.',
      cancelBtn: 'రద్దు చేయి',
      deletingFarm: 'తొలగిస్తోంది...',
      locationResolved: 'లొకేషన్ గుర్తించబడింది',
      earthEngineReady: 'ఎర్త్ ఇంజిన్ & వాతావరణం సిద్ధంగా ఉన్నాయి',
      selectDistrictToResolve: 'వాతావరణం & ఉపగ్రహ సమాచారం కోసం జిల్లాను ఎంచుకోండి',
    },
    hi: {
      activeSourceOfTruth: 'सक्रिय प्राथमिक डेटा स्रोत',
      synchronizedTelemetry: 'कृषि सलाह और क्रॉप डॉक्टर के साथ एकीकृत',
      cloudFirestoreRegistry: 'क्लाउड रिकॉर्ड्स',
      userFarmsDesc: 'क्लाउड में सुरक्षित रखे गए अपने खेतों का प्रबंधन करें।',
      loginToPersonalize: 'कई खेतों को सहेजने और सिंक करने के लिए लॉगिन करें।',
      addFarm: 'नया खेत जोड़ें',
      editFarm: 'संपादित करें',
      deleteFarm: 'हटाएं',
      activeFarm: 'सक्रिय',
      farmNameLabel: 'खेत का नाम',
      farmNamePlaceholder: 'जैसे ग्रीन वैली फार्म',
      farmIdentificationHeader: '1. खेत की पहचान एवं स्थान जानकारी',
      agronomicClassificationHeader: '2. फसल एवं मिट्टी का कृषि वर्गीकरण',
      calibratesAdvisory: 'क्रॉप डॉक्टर और सलाह प्रणाली को कैलिब्रेट करता है',
      cropVarietyLabel: 'फसल की किस्म',
      cropVarietyPlaceholder: 'जैसे PBW-343, शरबती, BPT-5204',
      soilTypeLabelShort: 'वर्गीकरण',
      resetToSaved: 'सहेजे गए डेटा पर रीसेट करें',
      useLiveGps: 'लाइव जीपीएस स्थान का उपयोग करें',
      locating: 'स्थान प्राप्त किया जा रहा है...',
      geocodeBtn: 'जियोकोड खोजें',
      geocoding: 'निर्देशांक प्राप्त किए जा रहे हैं...',
      districtLabel: 'ज़िला',
      subDistrictLabel: 'उप-ज़िला / मंडल / तहसील',
      villageLabel: 'गाँव / कस्बा / क्षेत्र',
      deleteFarmModalTitle: 'खेत हटाएं?',
      deleteFarmModalDesc: 'यह कार्रवाई इस खेत और इसके सभी संबंधित रिकॉर्ड को स्थायी रूप से हटा देगी।',
      cancelBtn: 'रद्द करें',
      deletingFarm: 'हटाया जा रहा है...',
      locationResolved: 'स्थान पहचाना गया',
      earthEngineReady: 'अर्थ इंजन और मौसम डेटा तैयार',
      selectDistrictToResolve: 'मौसम और उपग्रह डेटा के लिए ज़िला चुनें',
    },
    ta: {
      activeSourceOfTruth: 'செயலில் உள்ள முதன்மை தரவு',
      synchronizedTelemetry: 'வேளாண் ஆலோசனை மற்றும் பயிர் மருத்துவருடன் இணைக்கப்பட்டுள்ளது',
      cloudFirestoreRegistry: 'கிளவுட் பதிவுகள்',
      userFarmsDesc: 'கிளவுடில் பாதுகாப்பாக சேமிக்கப்பட்ட உங்கள் பண்ணைகளை நிர்வகிக்கவும்.',
      loginToPersonalize: 'பல பண்ணைகளை சேமிக்க மற்றும் ஒத்திசைக்க உள்நுழையவும்.',
      addFarm: 'பண்ணையைச் சேர்',
      editFarm: 'திருத்து',
      deleteFarm: 'நீக்கு',
      activeFarm: 'செயலில்',
      farmNameLabel: 'பண்ணையின் பெயர்',
      farmNamePlaceholder: 'எ.கா. கிரீன் வேலி பண்ணை',
      farmIdentificationHeader: '1. பண்ணை அடையாளம் மற்றும் இடத் தகவல்',
      agronomicClassificationHeader: '2. பயிர் மற்றும் மண் வகைப்பாடு',
      calibratesAdvisory: 'பயிர் மருத்துவர் மற்றும் ஆலோசனை அமைப்பை அளவீடு செய்கிறது',
      cropVarietyLabel: 'பயிர் ரகம்',
      cropVarietyPlaceholder: 'எ.கா. PBW-343, BPT-5204',
      soilTypeLabelShort: 'வகைப்பாடு',
      resetToSaved: 'சேமிக்கப்பட்ட நிலைக்கு மீட்டமைக்க',
      useLiveGps: 'நேரலை ஜிபிஎஸ் பயன்படுத்தவும்',
      locating: 'இடத்தைக் கண்டறிகிறது...',
      geocodeBtn: 'புவிக்குறியீடு',
      geocoding: 'ஆயங்களை பெறுகிறது...',
      districtLabel: 'மாவட்டம்',
      subDistrictLabel: 'துணை மாவட்டம் / வட்டம்',
      villageLabel: 'கிராமம் / நகரம் / பகுதி',
      deleteFarmModalTitle: 'பண்ணையை நீக்கவா?',
      deleteFarmModalDesc: 'இந்த நடவடிக்கை இந்த பண்ணை மற்றும் அதன் அனைத்து தரவுகளையும் நிரந்தரமாக நீக்கும்.',
      cancelBtn: 'ரத்து செய்',
      deletingFarm: 'நீக்கப்படுகிறது...',
      locationResolved: 'இடம் கண்டறியப்பட்டது',
      earthEngineReady: 'எர்த் என்ஜின் மற்றும் வானிலை தயார்',
      selectDistrictToResolve: 'வானிலை மற்றும் செயற்கைக்கோள் தரவுக்கு மாவட்டத்தைத் தேர்ந்தெடுக்கவும்',
    },
    kn: {
      activeSourceOfTruth: 'ಸಕ್ರಿಯ ಪ್ರಾಥಮಿಕ ಮೂಲ',
      synchronizedTelemetry: 'ಸಲಹೆ ಮತ್ತು ಕ್ರಾಪ್ ಡಾಕ್ಟರ್ ಜೊತೆಗೆ ಸಂಯೋಜಿಸಲಾಗಿದೆ',
      cloudFirestoreRegistry: 'ಕ್ಲೌಡ್ ದಾಖಲೆಗಳು',
      userFarmsDesc: 'ಕ್ಲೌಡ್‌ನಲ್ಲಿ ಸುರಕ್ಷಿತವಾಗಿ ಸಂಗ್ರಹಿಸಲಾದ ನಿಮ್ಮ ಜಮೀನುಗಳನ್ನು ನಿರ್ವಹಿಸಿ.',
      loginToPersonalize: 'ಹಲವು ಜಮೀನುಗಳನ್ನು ಉಳಿಸಲು ಮತ್ತು ಸಿಂಕ್ ಮಾಡಲು ಲಾಗಿನ್ ಮಾಡಿ.',
      addFarm: 'ಜಮೀನು ಸೇರಿಸಿ',
      editFarm: 'ಸಂಪಾದಿಸಿ',
      deleteFarm: 'ಅಳಿಸಿ',
      activeFarm: 'ಸಕ್ರಿಯ',
      farmNameLabel: 'ಜಮೀನಿನ ಹೆಸರು',
      farmNamePlaceholder: 'ಉದಾ. ಗ್ರೀನ್ ವ್ಯಾಲಿ ಫಾರ್ಮ್',
      farmIdentificationHeader: '1. ಜಮೀನಿನ ಗುರುತು ಮತ್ತು ಸ್ಥಳ ಮಾಹಿತಿ',
      agronomicClassificationHeader: '2. ಬೆಳೆ ಮತ್ತು ಮಣ್ಣಿನ ವರ್ಗೀಕರಣ',
      calibratesAdvisory: 'ಕ್ರಾಪ್ ಡಾಕ್ಟರ್ ಮತ್ತು ಸಲಹಾ ವ್ಯವಸ್ಥೆಗೆ ಸಹಕಾರಿ',
      cropVarietyLabel: 'ಬೆಳೆಯ ತಳಿ',
      cropVarietyPlaceholder: 'ಉದಾ. PBW-343, BPT-5204',
      soilTypeLabelShort: 'ವರ್ಗೀಕರಣ',
      resetToSaved: 'ಉಳಿಸಿದ ಸ್ಥಿತಿಗೆ ಮರುಹೊಂದಿಸಿ',
      useLiveGps: 'ಲೈವ್ ಜಿಪಿಎಸ್ ಬಳಸಿ',
      locating: 'ಸ್ಥಳವನ್ನು ಪತ್ತೆಮಾಡಲಾಗುತ್ತಿದೆ...',
      geocodeBtn: 'ಜಿಯೋಕೋಡ್',
      geocoding: 'ನಿರ್ದೇಶಾಂಕ ಪಡೆಯಲಾಗುತ್ತಿದೆ...',
      districtLabel: 'ಜಿಲ್ಲೆ',
      subDistrictLabel: 'ಉಪ-ಜಿಲ್ಲೆ / ತಾಲೂಕು',
      villageLabel: 'ಗ್ರಾಮ / ಪಟ್ಟಣ / ಪ್ರದೇಶ',
      deleteFarmModalTitle: 'ಜಮೀನನ್ನು ಅಳಿಸಬೇಕೇ?',
      deleteFarmModalDesc: 'ಈ ಕ್ರಿಯೆಯು ಈ ಜಮೀನು ಮತ್ತು ಅದರ ಎಲ್ಲಾ ಸಂಬಂಧಿತ ದಾಖಲೆಗಳನ್ನು ಶಾಶ್ವತವಾಗಿ ಅಳಿಸುತ್ತದೆ.',
      cancelBtn: 'ರದ್ದುಗೊಳಿಸಿ',
      deletingFarm: 'ಅಳಿಸಲಾಗುತ್ತಿದೆ...',
      locationResolved: 'ಸ್ಥಳ ಪತ್ತೆಯಾಗಿದೆ',
      earthEngineReady: 'ಅರ್ಥ್ ಎಂಜಿನ್ ಮತ್ತು ಹವಾಮಾನ ಸಿದ್ಧವಾಗಿದೆ',
      selectDistrictToResolve: 'ಹವಾಮಾನ ಮತ್ತು ಉಪಗ್ರಹ ಡೇಟಾಗಾಗಿ ಜಿಲ್ಲೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ',
    },
    mr: {
      activeSourceOfTruth: 'सक्रिय प्राथमिक स्रोत',
      synchronizedTelemetry: 'सल्लागार आणि क्रॉप डॉक्टरशी जोडलेले',
      cloudFirestoreRegistry: 'क्लाउड रेकॉर्ड्स',
      userFarmsDesc: 'क्लाउडमध्ये सुरक्षित ठेवलेल्या तुमच्या शेतांचे व्यवस्थापन करा.',
      loginToPersonalize: 'अनेक शेत जतन करण्यासाठी आणि सिंक करण्यासाठी लॉग इन करा.',
      addFarm: 'नवीन शेत जोडा',
      editFarm: 'संपादित करा',
      deleteFarm: 'हटवा',
      activeFarm: 'सक्रिय',
      farmNameLabel: 'शेताचे नाव',
      farmNamePlaceholder: 'उदा. ग्रीन व्हॅली फार्म',
      farmIdentificationHeader: '1. शेताची ओळख आणि स्थान माहिती',
      agronomicClassificationHeader: '2. पीक आणि मातीचे वर्गीकरण',
      calibratesAdvisory: 'क्रॉप डॉक्टर आणि सल्ला प्रणाली कॅलिब्रेट करते',
      cropVarietyLabel: 'पिकाची जात / वाण',
      cropVarietyPlaceholder: 'उदा. PBW-343, शरबती, BPT-5204',
      soilTypeLabelShort: 'वर्गीकरण',
      resetToSaved: 'जतन केलेल्या डेटावर रीसेट करा',
      useLiveGps: 'थेट जीपीएस वापरा',
      locating: 'स्थान मिळवत आहे...',
      geocodeBtn: 'जिओकोड शोधा',
      geocoding: 'निर्देशांक मिळवत आहे...',
      districtLabel: 'जिल्हा',
      subDistrictLabel: 'उप-जिल्हा / तालुका',
      villageLabel: 'गाव / शहर / परिसर',
      deleteFarmModalTitle: 'शेत हटवायचे?',
      deleteFarmModalDesc: 'ही कारवाई हे शेत आणि त्याच्याशी संबंधित सर्व रेकॉर्ड कायमस्वरूपी हटवेल.',
      cancelBtn: 'रद्द करा',
      deletingFarm: 'हटवत आहे...',
      locationResolved: 'स्थान ओळखले',
      earthEngineReady: 'अर्थ इंजिन आणि हवामान डेटा तयार',
      selectDistrictToResolve: 'हवामान आणि उपग्रह डेटासाठी जिल्हा निवडा',
    },
    ml: {
      activeSourceOfTruth: 'സജീവ പ്രാഥമിക ഡാറ്റ',
      synchronizedTelemetry: 'അഡ്വൈസറി, ക്രോപ്പ് ഡോക്ടർ എന്നിവയുമായി സംയോജിപ്പിച്ചു',
      cloudFirestoreRegistry: 'ക്ലൗഡ് റെക്കോർഡുകൾ',
      userFarmsDesc: 'ക്ലൗഡിൽ സൂക്ഷിച്ചിരിക്കുന്ന നിങ്ങളുടെ ഫാമുകൾ കൈകാര്യം ചെയ്യുക.',
      loginToPersonalize: 'ഫാമുകൾ സേവ് ചെയ്യാനും സിങ്ക് ചെയ്യാനും ലോഗിൻ ചെയ്യുക.',
      addFarm: 'ഫാം ചേർക്കുക',
      editFarm: 'എഡിറ്റ് ചെയ്യുക',
      deleteFarm: 'ഡിലീറ്റ് ചെയ്യുക',
      activeFarm: 'ആക്ടീവ്',
      farmNameLabel: 'ഫാമിന്റെ പേര്',
      farmNamePlaceholder: 'ഉദാ: ഗ്രീൻ വാലി ഫാം',
      farmIdentificationHeader: '1. ഫാം തിരിച്ചറിയലും സ്ഥല വിവരങ്ങളും',
      agronomicClassificationHeader: '2. വിള, മണ്ണ് വർഗ്ഗീകരണം',
      calibratesAdvisory: 'ക്രോപ്പ് ഡോക്ടർ, അഡ്വൈസറി സിസ്റ്റം എന്നിവ ക്രമീകരിക്കുന്നു',
      cropVarietyLabel: 'വിള ഇനം',
      cropVarietyPlaceholder: 'ഉദാ: PBW-343, BPT-5204',
      soilTypeLabelShort: 'വർഗ്ഗീകരണം',
      resetToSaved: 'സേവ് ചെയ്തതിലേക്ക് റീസെറ്റ് ചെയ്യുക',
      useLiveGps: 'ലൈവ് ജിപിഎസ് ഉപയോഗിക്കുക',
      locating: 'സ്ഥലം കണ്ടെത്തുന്നു...',
      geocodeBtn: 'ജിയോകോഡ്',
      geocoding: 'നിർദ്ദേശാങ്കങ്ങൾ കണ്ടെത്തുന്നു...',
      districtLabel: 'ജില്ല',
      subDistrictLabel: 'ഉപജില്ല / താലൂക്ക്',
      villageLabel: 'ഗ്രാമം / പട്ടണം / പ്രദേശം',
      deleteFarmModalTitle: 'ഫാം ഡിലീറ്റ് ചെയ്യണോ?',
      deleteFarmModalDesc: 'ഈ പ്രവർത്തനം ഈ ഫാമും അതിലെ എല്ലാ റെക്കോർഡുകളും പൂർണ്ണമായും നീക്കം ചെയ്യും.',
      cancelBtn: 'റദ്ദാക്കുക',
      deletingFarm: 'ഡിലീറ്റ് ചെയ്യുന്നു...',
      locationResolved: 'സ്ഥലം കണ്ടെത്തി',
      earthEngineReady: 'എർത്ത് എഞ്ചിനും കാലാവസ്ഥയും തയാറാണ്',
      selectDistrictToResolve: 'കാലാവസ്ഥ, ഉപഗ്രഹ വിവരങ്ങൾക്ക് ജില്ല തിരഞ്ഞെടുക്കുക',
    },
    gu: {
      activeSourceOfTruth: 'સક્રિય પ્રાથમિક ડેટા સ્ત્રોત',
      synchronizedTelemetry: 'એડવાઈઝરી અને ક્રોપ ડોક્ટર સાથે સંકલિત',
      cloudFirestoreRegistry: 'ક્લાઉડ રેકોર્ડ્સ',
      userFarmsDesc: 'ક્લાઉડમાં સુરક્ષિત રીતે સંગ્રહિત તમારા ખેતરોનું સંચાલન કરો.',
      loginToPersonalize: 'અનેક ખેતરો સાચવવા અને સિંક કરવા માટે લોગિન કરો.',
      addFarm: 'નવું ખેતર ઉમેરો',
      editFarm: 'સંપાદિત કરો',
      deleteFarm: 'હટાવો',
      activeFarm: 'સક્રિય',
      farmNameLabel: 'ખેતરનું નામ',
      farmNamePlaceholder: 'દા.ત. ગ્રીન વેલી ફાર્મ',
      farmIdentificationHeader: '1. ખેતરની ઓળખ અને સ્થાનની માહિતી',
      agronomicClassificationHeader: '2. પાક અને જમીનનું વર્ગીકરણ',
      calibratesAdvisory: 'ક્રોપ ડોક્ટર અને એડવાઈઝરી માટે ઉપયોગી',
      cropVarietyLabel: 'પાકની જાત / વેરાયટી',
      cropVarietyPlaceholder: 'દા.ત. PBW-343, શરબતી, BPT-5204',
      soilTypeLabelShort: 'વર્ગીકરણ',
      resetToSaved: 'સાચવેલી સ્થિતિમાં રિસેટ કરો',
      useLiveGps: 'લાઈવ જીપીએસ વાપરો',
      locating: 'સ્થાન શોધી રહ્યું છે...',
      geocodeBtn: 'જીયોકોડ',
      geocoding: 'નિર્દેશાંક મેળવી રહ્યું છે...',
      districtLabel: 'જિલ્લો',
      subDistrictLabel: 'પેટા-જિલ્લો / તાલુકો',
      villageLabel: 'ગામ / નગર / વિસ્તાર',
      deleteFarmModalTitle: 'ખેતર હટાવવું છે?',
      deleteFarmModalDesc: 'આ ક્રિયાથી આ ખેતર અને તેનો તમામ ડેટા કાયમ માટે હટી જશે.',
      cancelBtn: 'રદ કરો',
      deletingFarm: 'હટાવી રહ્યું છે...',
      locationResolved: 'સ્થાન ઓળખાયું',
      earthEngineReady: 'અર્થ એન્જિન અને હવામાન ડેટા તૈયાર',
      selectDistrictToResolve: 'હવામાન અને સેટેલાઇટ ડેટા માટે જિલ્લો પસંદ કરો',
    },
    bn: {
      activeSourceOfTruth: 'সক্রিয় প্রাথমিক ডেটা উৎস',
      synchronizedTelemetry: 'কৃষি পরামর্শ ও ক্রপ ডাক্তারের সাথে সমন্বিত',
      cloudFirestoreRegistry: 'ক্লাউড রেকর্ডসমূহ',
      userFarmsDesc: 'ক্লাউডে নিরাপদে সংরক্ষিত আপনার খামারগুলি পরিচালনা করুন।',
      loginToPersonalize: 'একাধিক খামার সংরক্ষণ ও সিঙ্ক করতে লগইন করুন।',
      addFarm: 'খামার যোগ করুন',
      editFarm: 'সম্পাদনা করুন',
      deleteFarm: 'মুছে ফেলুন',
      activeFarm: 'সক্রিয়',
      farmNameLabel: 'খামারের নাম',
      farmNamePlaceholder: 'যেমন গ্রিন ভ্যালি ফার্ম',
      farmIdentificationHeader: '১. খামারের পরিচয় ও অবস্থানের বিবরণ',
      agronomicClassificationHeader: '২. ফসল ও মাটির কৃষি শ্রেণীবিন্যাস',
      calibratesAdvisory: 'ক্রপ ডাক্তার ও পরামর্শ ব্যবস্থার জন্য ব্যবহৃত',
      cropVarietyLabel: 'ফসলের জাত',
      cropVarietyPlaceholder: 'যেমন PBW-343, শরবতী, BPT-5204',
      soilTypeLabelShort: 'শ্রেণীবিন্যাস',
      resetToSaved: 'সংরক্ষিত তথ্যে রিসেট করুন',
      useLiveGps: 'লাইভ জিপিএস ব্যবহার করুন',
      locating: 'অবস্থান নির্ণয় করা হচ্ছে...',
      geocodeBtn: 'জিওকোড',
      geocoding: 'স্থানাঙ্ক নির্ণয় করা হচ্ছে...',
      districtLabel: 'জেলা',
      subDistrictLabel: 'উপ-জেলা / তহশিল',
      villageLabel: 'গ্রাম / শহর / এলাকা',
      deleteFarmModalTitle: 'খামার মুছে ফেলবেন?',
      deleteFarmModalDesc: 'এই পদক্ষেপের ফলে এই খামার এবং এর সমস্ত ডেটা স্থায়ীভাবে মুছে যাবে।',
      cancelBtn: 'বাতিল করুন',
      deletingFarm: 'মুছে ফেলা হচ্ছে...',
      locationResolved: 'অবস্থান পাওয়া গেছে',
      earthEngineReady: 'আর্থ ইঞ্জিন ও আবহাওয়া ডেটা প্রস্তুত',
      selectDistrictToResolve: 'আবহাওয়া ও স্যাটেলাইট ডেটার জন্য জেলা নির্বাচন করুন',
    },
    pa: {
      activeSourceOfTruth: 'ਸਰਗਰਮ ਪ੍ਰਾਇਮਰੀ ਡਾਟਾ ਸਰੋਤ',
      synchronizedTelemetry: 'ਖੇਤੀਬਾੜੀ ਸਲਾਹ ਅਤੇ ਕਰੌਪ ਡਾਕਟਰ ਨਾਲ ਜੋੜਿਆ ਗਿਆ',
      cloudFirestoreRegistry: 'ਕਲਾਊਡ ਰਿਕਾਰਡ',
      userFarmsDesc: 'ਕਲਾਊਡ ਵਿੱਚ ਸੁਰੱਖਿਅਤ ਰੱਖੇ ਆਪਣੇ ਖੇਤਾਂ ਦਾ ਪ੍ਰਬੰਧਨ ਕਰੋ।',
      loginToPersonalize: 'ਕਈ ਖੇਤਾਂ ਨੂੰ ਸੰਭਾਲਣ ਅਤੇ ਸਿੰਕ ਕਰਨ ਲਈ ਲੌਗਇਨ ਕਰੋ।',
      addFarm: 'ਨਵਾਂ ਖੇਤ ਜੋੜੋ',
      editFarm: 'ਸੋਧੋ',
      deleteFarm: 'ਹਟਾਓ',
      activeFarm: 'ਸਰਗਰਮ',
      farmNameLabel: 'ਖੇਤ ਦਾ ਨਾਮ',
      farmNamePlaceholder: 'ਜਿਵੇਂ ਗ੍ਰੀਨ ਵੈਲੀ ਫਾਰਮ',
      farmIdentificationHeader: '1. ਖੇਤ ਦੀ ਪਛਾਣ ਅਤੇ ਸਥਾਨ ਜਾਣਕਾਰੀ',
      agronomicClassificationHeader: '2. ਫਸਲ ਅਤੇ ਮਿੱਟੀ ਦਾ ਵਰਗੀਕਰਨ',
      calibratesAdvisory: 'ਕਰੌਪ ਡਾਕਟਰ ਅਤੇ ਸਲਾਹ ਪ੍ਰਣਾਲੀ ਲਈ ਉਪਯੋਗੀ',
      cropVarietyLabel: 'ਫਸਲ ਦੀ ਕਿਸਮ',
      cropVarietyPlaceholder: 'ਜਿਵੇਂ PBW-343, ਸ਼ਰਬਤੀ, BPT-5204',
      soilTypeLabelShort: 'ਵਰਗੀਕਰਨ',
      resetToSaved: 'ਸੰਭਾਲੇ ਡਾਟੇ ਤੇ ਰੀਸੈਟ ਕਰੋ',
      useLiveGps: 'ਲਾਈਵ ਜੀਪੀਐਸ ਵਰਤੋ',
      locating: 'ਸਥਾਨ ਲੱਭਿਆ ਜਾ ਰਿਹਾ ਹੈ...',
      geocodeBtn: 'ਜੀਓਕੋਡ',
      geocoding: 'ਨਿਰਦੇਸ਼ਾਂਕ ਪ੍ਰਾਪਤ ਕੀਤੇ ਜਾ ਰਹੇ ਹਨ...',
      districtLabel: 'ਜ਼ਿਲ੍ਹਾ',
      subDistrictLabel: 'ਉਪ-ਜ਼ਿਲ੍ਹਾ / ਤਹਿਸੀਲ',
      villageLabel: 'ਪਿੰਡ / ਕਸਬਾ / ਖੇਤਰ',
      deleteFarmModalTitle: 'ਖੇਤ ਹਟਾਉਣਾ ਹੈ?',
      deleteFarmModalDesc: 'ਇਹ ਕਾਰਵਾਈ ਇਸ ਖੇਤ ਅਤੇ ਇਸਦੇ ਸਾਰੇ ਡਾਟੇ ਨੂੰ ਹਮੇਸ਼ਾ ਲਈ ਹਟਾ ਦੇਵੇਗੀ।',
      cancelBtn: 'ਰੱਦ ਕਰੋ',
      deletingFarm: 'ਹਟਾਇਆ ਜਾ ਰਿਹਾ ਹੈ...',
      locationResolved: 'ਸਥਾਨ ਪਛਾਣਿਆ ਗਿਆ',
      earthEngineReady: 'ਅਰਥ ਇੰਜਣ ਅਤੇ ਮੌਸਮ ਡਾਟਾ ਤਿਆਰ',
      selectDistrictToResolve: 'ਮੌਸਮ ਅਤੇ ਸੈਟੇਲਾਈਟ ਡਾਟੇ ਲਈ ਜ਼ਿਲ੍ਹਾ ਚੁਣੋ',
    },
    or: {
      activeSourceOfTruth: 'ସକ୍ରିୟ ପ୍ରାଥମିକ ତଥ୍ୟ',
      synchronizedTelemetry: 'କୃଷି ପରାମର୍ଶ ଓ କ୍ରପ୍ ଡାକ୍ଟର ସହ ସଂଯୋଜିତ',
      cloudFirestoreRegistry: 'କ୍ଲାଉଡ୍ ରେକର୍ଡସ',
      userFarmsDesc: 'କ୍ଲାଉଡରେ ସୁରକ୍ଷିତ ରଖାଯାଇଥିବା ଆପଣଙ୍କ ଜମିଗୁଡ଼ିକର ପରିଚାଳନା କରନ୍ତୁ।',
      loginToPersonalize: 'ଏକାଧିକ ଜମି ସଂରକ୍ଷଣ ଓ ସିଙ୍କ୍ କରିବାକୁ ଲଗଇନ୍ କରନ୍ତୁ।',
      addFarm: 'ଜମି ଯୋଡ଼ନ୍ତୁ',
      editFarm: 'ସଂଶୋଧନ କରନ୍ତୁ',
      deleteFarm: 'ଲିଭାନ୍ତୁ',
      activeFarm: 'ସକ୍ରିୟ',
      farmNameLabel: 'ଜମିର ନାମ',
      farmNamePlaceholder: 'ଯେପରି ଗ୍ରୀନ୍ ଭ୍ୟାଲି ଫାର୍ମ',
      farmIdentificationHeader: '୧. ଜମିର ପରିଚୟ ଓ ଅବସ୍ଥାନ ବିବରଣୀ',
      agronomicClassificationHeader: '୨. ଫସଲ ଓ ମୃତ୍ତିକା ବର୍ଗୀକରଣ',
      calibratesAdvisory: 'କ୍ରପ୍ ଡାକ୍ଟର ଓ ପରାମର୍ଶ ପ୍ରଣାଳୀ ପାଇଁ ବ୍ୟବହୃତ',
      cropVarietyLabel: 'ଫସଲ ਦੀ କିସମ',
      cropVarietyPlaceholder: 'ଯେପରି PBW-343, ସୋନାଲିକା, BPT-5204',
      soilTypeLabelShort: 'ବର୍ଗୀକରଣ',
      resetToSaved: 'ସଂରକ୍ଷିତ ତଥ୍ୟକୁ ରିସେଟ୍ କରନ୍ତୁ',
      useLiveGps: 'ଲାଇଭ୍ ଜିପିଏସ୍ ବ୍ୟବହାର କରନ୍ତୁ',
      locating: 'ସ୍ଥାନ ଖୋଜାଯାଉଛି...',
      geocodeBtn: 'ଜିଓକୋଡ୍',
      geocoding: 'ସ୍ଥାନ ନିର୍ଦ୍ଦେଶାଙ୍କ ଗ୍ରହଣ କରାଯାଉଛି...',
      districtLabel: 'ଜିଲ୍ଲା',
      subDistrictLabel: 'ଉପ-ଜିଲ୍ଲା / ତହସିଲ',
      villageLabel: 'ଗ୍ରାମ / ସହର / ଅଞ୍ଚଳ',
      deleteFarmModalTitle: 'ଜମି ଲିଭାଇବେ କି?',
      deleteFarmModalDesc: 'ଏହି ପଦକ୍ଷେପ ଦ୍ୱାରା ଏହି ଜମି ଏବଂ ଏହାର ସମସ୍ତ ତଥ୍ୟ ସ୍ଥାୟୀ ଭାବରେ ଲିଭିଯିବ।',
      cancelBtn: 'ବାତିଲ କରନ୍ତୁ',
      deletingFarm: 'ଲିଭାଯାଉଛି...',
      locationResolved: 'ସ୍ଥାନ ଚିହ୍ନଟ ହେଲା',
      earthEngineReady: 'ଅର୍ଥ ଇଞ୍ଜିନ୍ ଓ ପାଣିପାଗ ତଥ୍ୟ ପ୍ରସ୍ତୁତ',
      selectDistrictToResolve: 'ପାଣିପାଗ ଓ ସାଟେଲାଇଟ୍ ତଥ୍ୟ ପାଇଁ ଜିଲ୍ଲା ଚୟନ କରନ୍ତୁ',
    },
    as: {
      activeSourceOfTruth: 'সক্ৰিয় প্ৰাথমিক উৎস',
      synchronizedTelemetry: 'কৃষি পৰামৰ্শ আৰু ক্ৰপ ডাক্তৰৰ সৈতে সংযোজিত',
      cloudFirestoreRegistry: 'ক্লাউড ৰেকৰ্ডসমূহ',
      userFarmsDesc: 'ক্লাউডত সুৰক্ষিতভাৱে সংৰক্ষিত আপোনাৰ পামসমূহ পৰিচালনা কৰক।',
      loginToPersonalize: 'একাধিক পাম সংৰক্ষণ আৰু সিংক কৰিবলৈ লগইন কৰক।',
      addFarm: 'পাম যোগ কৰক',
      editFarm: 'সম্পাদনা কৰক',
      deleteFarm: 'মচি পেলাওক',
      activeFarm: 'সক্ৰিয়',
      farmNameLabel: 'পামৰ নাম',
      farmNamePlaceholder: 'যেনে গ্ৰীন ভেলী ফাৰ্ম',
      farmIdentificationHeader: '১. পামৰ পৰিচয় আৰু স্থানৰ তথ্য',
      agronomicClassificationHeader: '২. শস্য আৰু মাটিৰ শ্ৰেণীবিভাজন',
      calibratesAdvisory: 'ক্ৰপ ডাক্তৰ আৰু পৰামৰ্শ ব্যৱস্থাৰ বাবে উপযোগী',
      cropVarietyLabel: 'শস্যৰ প্ৰকাৰ / কিসম',
      cropVarietyPlaceholder: 'যেনে PBW-343, BPT-5204',
      soilTypeLabelShort: 'শ্ৰেণীবিভাজন',
      resetToSaved: 'সংৰক্ষিত অৱস্থালৈ ৰিছেট কৰক',
      useLiveGps: 'লাইভ জিপিএছ ব্যৱহাৰ কৰক',
      locating: 'স্থান নিৰ্ণয় কৰা হৈছে...',
      geocodeBtn: 'জিঅ’ক’ড',
      geocoding: 'স্থানাংক সংগ্ৰহ কৰা হৈছে...',
      districtLabel: 'জিলা',
      subDistrictLabel: 'উপ-জিলা / তহচিল',
      villageLabel: 'গাঁৱ / চহৰ / অঞ্চল',
      deleteFarmModalTitle: 'পাম মচি পেলাব বিচাৰে নেকি?',
      deleteFarmModalDesc: 'এই পদক্ষেপে এই পাম আৰু ইয়াৰ সকলো ৰেকৰ্ড স্থায়ীভাৱে মচি পেলাব।',
      cancelBtn: 'বাতিল কৰক',
      deletingFarm: 'মচি থকা হৈছে...',
      locationResolved: 'স্থান চিনাক্ত হৈছে',
      earthEngineReady: 'আৰ্থ ইঞ্জীন আৰু বতৰৰ তথ্য প্ৰস্তুত',
      selectDistrictToResolve: 'বতৰ আৰু উপগ্ৰহৰ তথ্যৰ বাবে জিলা বাছনি কৰক',
    },
    ur: {
      activeSourceOfTruth: 'فعال بنیادی ماخذ',
      synchronizedTelemetry: 'زرعی مشورے اور کراپ ڈاکٹر کے ساتھ منسلک',
      cloudFirestoreRegistry: 'کلاؤڈ ریکارڈز',
      userFarmsDesc: 'کلاؤڈ میں محفوظ اپنے فارمز کا انتظام کریں۔',
      loginToPersonalize: 'متعدد فارمز محفوظ کرنے اور سنک کرنے کے لیے لاگ ان کریں۔',
      addFarm: 'فارم شامل کریں',
      editFarm: 'ترمیم کریں',
      deleteFarm: 'حذف کریں',
      activeFarm: 'فعال',
      farmNameLabel: 'فارم کا نام',
      farmNamePlaceholder: 'مثلاً گرین ویلی فارم',
      farmIdentificationHeader: '1. فارم کی شناخت اور مقام کی معلومات',
      agronomicClassificationHeader: '2. فصل اور مٹی کی درجہ بندی',
      calibratesAdvisory: 'کراپ ڈاکٹر اور مشاورتی نظام کے لیے مفید',
      cropVarietyLabel: 'فصل کی قسم',
      cropVarietyPlaceholder: 'مثلاً PBW-343، BPT-5204',
      soilTypeLabelShort: 'درجہ بندی',
      resetToSaved: 'محفوظ شدہ حالت پر ری سیٹ کریں',
      useLiveGps: 'لائیو GPS استعمال کریں',
      locating: 'مقام تلاش کیا جا رہا ہے...',
      geocodeBtn: 'جیو کوڈ',
      geocoding: 'مقام کے متغیرات حاصل ہو رہے ہیں...',
      districtLabel: 'ضلع',
      subDistrictLabel: 'ذیلی ضلع / تحصیل / منڈل',
      villageLabel: 'گاؤں / شہر / علاقہ',
      deleteFarmModalTitle: 'فارم حذف کریں؟',
      deleteFarmModalDesc: 'یہ عمل اس فارم اور اس سے متعلق تمام ڈیٹا کو مستقل طور پر ختم کر دے گا۔',
      cancelBtn: 'منسوخ کریں',
      deletingFarm: 'حذف ہو رہا ہے...',
      locationResolved: 'مقام کی تصدیق ہو گئی',
      earthEngineReady: 'ارتھ انجن اور موسم کا ڈیٹا تیار ہے',
      selectDistrictToResolve: 'موسم اور سیٹلائٹ ڈیٹا کے لیے ضلع کا انتخاب کریں',
    },
    ar: {
      activeSourceOfTruth: 'مصدر البيانات النشط',
      synchronizedTelemetry: 'متزامن مع المساعد الزراعي وطبيب المحصول',
      cloudFirestoreRegistry: 'سجلات السحابة',
      userFarmsDesc: 'إدارة مزارعك المحفوظة بأمان في السحابة.',
      loginToPersonalize: 'سجل الدخول لحفظ المزارع ومزامنتها.',
      addFarm: 'إضافة مزرعة',
      editFarm: 'تعديل',
      deleteFarm: 'حذف',
      activeFarm: 'نشط',
      farmNameLabel: 'اسم المزرعة',
      farmNamePlaceholder: 'مثال: مزرعة الوادي الأخضر',
      farmIdentificationHeader: '1. تعريف المزرعة ومعلومات الموقع',
      agronomicClassificationHeader: '2. تصنيف المحصول والتربة',
      calibratesAdvisory: 'يعاير طبيب المحصول والنظام الاستشاري',
      cropVarietyLabel: 'صنف المحصول',
      cropVarietyPlaceholder: 'مثال: PBW-343، BPT-5204',
      soilTypeLabelShort: 'التصنيف',
      resetToSaved: 'إعادة ضبط للمحفوظات',
      useLiveGps: 'استخدام GPS المباشر',
      locating: 'جاري تحديد الموقع...',
      geocodeBtn: 'تحديد إحداثيات',
      geocoding: 'جاري جلب الإحداثيات...',
      districtLabel: 'المنطقة / المقاطعة',
      subDistrictLabel: 'المركز / الحي / الناحية',
      villageLabel: 'القرية / المدينة / المنطقة',
      deleteFarmModalTitle: 'حذف المزرعة؟',
      deleteFarmModalDesc: 'سيؤدي هذا الإجراء إلى حذف هذه المزرعة وجميع بياناتها بشكل دائم.',
      cancelBtn: 'إلغاء',
      deletingFarm: 'جاري الحذف...',
      locationResolved: 'تم تحديد الموقع',
      earthEngineReady: 'محرك الأرض والطقس جاهزان',
      selectDistrictToResolve: 'اختر المنطقة للحصول على بيانات الطقس والأقمار الصناعية',
    },
    es: {
      activeSourceOfTruth: 'Fuente de datos activa',
      synchronizedTelemetry: 'Sincronizado con Asesor e Inspección de Cultivos',
      cloudFirestoreRegistry: 'Registros en la nube',
      userFarmsDesc: 'Administre sus granjas guardadas de forma segura en la nube.',
      loginToPersonalize: 'Inicie sesión para guardar y sincronizar sus granjas.',
      addFarm: 'Añadir granja',
      editFarm: 'Editar',
      deleteFarm: 'Eliminar',
      activeFarm: 'Activa',
      farmNameLabel: 'Nombre de la granja',
      farmNamePlaceholder: 'ej. Granja Valle Verde',
      farmIdentificationHeader: '1. Identificación de la granja y ubicación',
      agronomicClassificationHeader: '2. Clasificación agronómica de cultivo y suelo',
      calibratesAdvisory: 'Calibra las recomendaciones de la IA',
      cropVarietyLabel: 'Variedad de cultivo',
      cropVarietyPlaceholder: 'ej. PBW-343, Sharbati',
      soilTypeLabelShort: 'Clasificación',
      resetToSaved: 'Restablecer',
      useLiveGps: 'Usar GPS en vivo',
      locating: 'Localizando...',
      geocodeBtn: 'Geocodificar',
      geocoding: 'Geocodificando...',
      districtLabel: 'Distrito / Provincia',
      subDistrictLabel: 'Subdistrito / Municipio',
      villageLabel: 'Pueblo / Localidad',
      deleteFarmModalTitle: '¿Eliminar granja?',
      deleteFarmModalDesc: 'Esta acción eliminará permanentemente esta granja y sus datos.',
      cancelBtn: 'Cancelar',
      deletingFarm: 'Eliminando...',
      locationResolved: 'Ubicación identificada',
      earthEngineReady: 'Datos de satélite y clima listos',
      selectDistrictToResolve: 'Seleccione un distrito para obtener datos climáticos y satelitales',
    },
    fr: {
      activeSourceOfTruth: 'Source de données active',
      synchronizedTelemetry: 'Synchronisé avec l\'assistant IA et le médecin des cultures',
      cloudFirestoreRegistry: 'Registres Cloud',
      userFarmsDesc: 'Gérez vos exploitations enregistrées en toute sécurité dans le cloud.',
      loginToPersonalize: 'Connectez-vous pour enregistrer et synchroniser vos fermes.',
      addFarm: 'Ajouter une ferme',
      editFarm: 'Modifier',
      deleteFarm: 'Supprimer',
      activeFarm: 'Active',
      farmNameLabel: 'Nom de la ferme',
      farmNamePlaceholder: 'ex. Ferme de la Vallée Verte',
      farmIdentificationHeader: '1. Identification de la ferme et localisation',
      agronomicClassificationHeader: '2. Classification agronomique des cultures et des sols',
      calibratesAdvisory: 'Calibre le système de recommandation IA',
      cropVarietyLabel: 'Variété de culture',
      cropVarietyPlaceholder: 'ex. PBW-343, Sharbati',
      soilTypeLabelShort: 'Classification',
      resetToSaved: 'Réinitialiser',
      useLiveGps: 'Utiliser le GPS en direct',
      locating: 'Localisation...',
      geocodeBtn: 'Géocoder',
      geocoding: 'Géocodage...',
      districtLabel: 'District / Département',
      subDistrictLabel: 'Sous-district / Canton',
      villageLabel: 'Village / Commune / Localité',
      deleteFarmModalTitle: 'Supprimer la ferme ?',
      deleteFarmModalDesc: 'Cette action supprimera définitivement cette ferme et ses données.',
      cancelBtn: 'Annuler',
      deletingFarm: 'Suppression...',
      locationResolved: 'Emplacement identifié',
      earthEngineReady: 'Données météo et satellite prêtes',
      selectDistrictToResolve: 'Sélectionnez un district pour charger les données satellite et météo',
    },
    pt: {
      activeSourceOfTruth: 'Fonte de dados ativa',
      synchronizedTelemetry: 'Sincronizado com o Assistente Agrícola e Diagnóstico',
      cloudFirestoreRegistry: 'Registros na nuvem',
      userFarmsDesc: 'Gerencie suas fazendas salvas com segurança na nuvem.',
      loginToPersonalize: 'Faça login para salvar e sincronizar suas fazendas.',
      addFarm: 'Adicionar fazenda',
      editFarm: 'Editar',
      deleteFarm: 'Excluir',
      activeFarm: 'Ativa',
      farmNameLabel: 'Nome da fazenda',
      farmNamePlaceholder: 'ex. Fazenda Vale Verde',
      farmIdentificationHeader: '1. Identificação da fazenda e localização',
      agronomicClassificationHeader: '2. Classificação agronômica da cultura e solo',
      calibratesAdvisory: 'Calibra as recomendações de inteligência artificial',
      cropVarietyLabel: 'Variedade da cultura',
      cropVarietyPlaceholder: 'ex. BPT-5204, PBW-343',
      soilTypeLabelShort: 'Classificação',
      resetToSaved: 'Restaurar salvos',
      useLiveGps: 'Usar GPS ao vivo',
      locating: 'Localizando...',
      geocodeBtn: 'Geocodificar',
      geocoding: 'Obtendo coordenadas...',
      districtLabel: 'Distrito / Município',
      subDistrictLabel: 'Subdistrito / Bairro',
      villageLabel: 'Vila / Cidade / Localidade',
      deleteFarmModalTitle: 'Excluir fazenda?',
      deleteFarmModalDesc: 'Esta ação excluirá permanentemente esta fazenda e seus dados.',
      cancelBtn: 'Cancelar',
      deletingFarm: 'Excluindo...',
      locationResolved: 'Localização identificada',
      earthEngineReady: 'Dados climáticos e de satélite prontos',
      selectDistrictToResolve: 'Selecione um distrito para dados de clima e satélite',
    },
    ru: {
      activeSourceOfTruth: 'Активный источник данных',
      synchronizedTelemetry: 'Синхронизировано с ИИ-советником и диагностикой',
      cloudFirestoreRegistry: 'Облачные записи',
      userFarmsDesc: 'Управляйте вашими фермами, надежно сохраненными в облаке.',
      loginToPersonalize: 'Войдите, чтобы сохранять и синхронизировать фермы.',
      addFarm: 'Добавить ферму',
      editFarm: 'Редактировать',
      deleteFarm: 'Удалить',
      activeFarm: 'Активна',
      farmNameLabel: 'Название фермы',
      farmNamePlaceholder: 'напр. Заря',
      farmIdentificationHeader: '1. Идентификация фермы и местоположение',
      agronomicClassificationHeader: '2. Агрономическая классификация культур и почв',
      calibratesAdvisory: 'Калибрует ИИ-рекомендации',
      cropVarietyLabel: 'Сорт культуры',
      cropVarietyPlaceholder: 'напр. PBW-343, Шарбати',
      soilTypeLabelShort: 'Классификация',
      resetToSaved: 'Сбросить',
      useLiveGps: 'Живой GPS',
      locating: 'Поиск...',
      geocodeBtn: 'Геокод',
      geocoding: 'Получение координат...',
      districtLabel: 'Район / Округ',
      subDistrictLabel: 'Подрайон / Поселение',
      villageLabel: 'Село / Город / Местность',
      deleteFarmModalTitle: 'Удалить ферму?',
      deleteFarmModalDesc: 'Это действие навсегда удалит эту ферму и все ее данные.',
      cancelBtn: 'Отмена',
      deletingFarm: 'Удаление...',
      locationResolved: 'Местоположение определено',
      earthEngineReady: 'Спутниковые и метеоданные готовы',
      selectDistrictToResolve: 'Выберите район для получения метеоданных и снимков',
    },
    zh: {
      activeSourceOfTruth: '活动核心数据源',
      synchronizedTelemetry: '已与 AI 农艺顾问及病虫害诊断同步',
      cloudFirestoreRegistry: '云端档案',
      userFarmsDesc: '管理您安全保存在云端的农场。',
      loginToPersonalize: '登录以保存并同步您的多个农场。',
      addFarm: '添加农场',
      editFarm: '编辑',
      deleteFarm: '删除',
      activeFarm: '当前使用',
      farmNameLabel: '农场名称',
      farmNamePlaceholder: '例如：绿谷农场',
      farmIdentificationHeader: '1. 农场标识与位置信息',
      agronomicClassificationHeader: '2. 作物与土壤农艺分类',
      calibratesAdvisory: '校准 AI 病虫害诊断与农艺建议',
      cropVarietyLabel: '作物品种',
      cropVarietyPlaceholder: '例如：PBW-343, BPT-5204',
      soilTypeLabelShort: '分类',
      resetToSaved: '重置为已保存',
      useLiveGps: '使用实时 GPS 定位',
      locating: '正在定位...',
      geocodeBtn: '地理编码',
      geocoding: '正在获取经纬度...',
      districtLabel: '县 / 区 / 州',
      subDistrictLabel: '乡镇 / 街道',
      villageLabel: '村庄 / 城镇 / 区域',
      deleteFarmModalTitle: '确认删除农场？',
      deleteFarmModalDesc: '此操作将永久删除该农场及其关联数据。',
      cancelBtn: '取消',
      deletingFarm: '正在删除...',
      locationResolved: '位置已识别',
      earthEngineReady: '卫星遥感与气象数据已就绪',
      selectDistrictToResolve: '请选择地区以获取气象与遥感数据',
    },
  };

  const defaultEn: Record<string, string> = {
    activeSourceOfTruth: 'Active Source of Truth',
    synchronizedTelemetry: 'Synchronized with Advisory & Crop Doctor',
    cloudFirestoreRegistry: 'Cloud Firestore Registry',
    userFarmsDesc: 'Manage your saved farms stored securely in Cloud Firestore.',
    loginToPersonalize: 'Log in to save multiple farms and access cloud synchronization.',
    addFarm: 'Add Farm',
    editFarm: 'Edit Farm',
    deleteFarm: 'Delete Farm',
    activeFarm: 'Active',
    farmNameLabel: 'Farm Name',
    farmNamePlaceholder: 'e.g. Green Valley Farm',
    farmIdentificationHeader: '1. Farm Identification & Context',
    agronomicClassificationHeader: '2. Crop & Soil Agronomic Classification',
    calibratesAdvisory: 'Calibrates Crop Doctor & Advisory',
    cropVarietyLabel: 'Crop Variety',
    cropVarietyPlaceholder: 'e.g. PBW-343, Sharbati, Sonalika, BPT-5204',
    soilTypeLabelShort: 'Classification',
    resetToSaved: 'Reset to Saved',
    useLiveGps: 'Use Live GPS',
    locating: 'Locating...',
    geocodeBtn: 'Geocode',
    geocoding: 'Geocoding...',
    districtLabel: 'District',
    subDistrictLabel: 'Sub-District / Mandal / Tehsil',
    villageLabel: 'Village / Town / Area',
    deleteFarmModalTitle: 'Delete farm?',
    deleteFarmModalDesc: 'This action will permanently remove this farm and its farm-specific data.',
    cancelBtn: 'Cancel',
    deletingFarm: 'Deleting...',
    locationResolved: 'Location resolved',
    earthEngineReady: 'Earth Engine & Weather Ready',
    selectDistrictToResolve: 'Select District to resolve coordinates for Weather & Satellite intelligence',
  };

  const selected = labels[norm] || defaultEn;
  return new Proxy(selected, {
    get: (target, prop: string) => target[prop] || defaultEn[prop] || prop,
  }) as Record<keyof typeof defaultEn, string>;
}

/**
 * Provides comprehensive Crop Doctor UI labels translated across all supported languages
 */
export function getCropDoctorUILabels(lang: Language | string) {
  const norm = normalizeLang(lang);

  const labels: Record<string, Record<string, string>> = {
    te: {
      engineTitle: 'క్రాప్ డాక్టర్ AI రోగనిర్ధారణ వ్యవస్థ',
      registeredOnly: 'నమోదిత రైతులకు మాత్రమే',
      loginToUse: 'క్రాప్ డాక్టర్ ఉపయోగించడానికి లాగిన్ చేయండి',
      targetCrop: 'లక్ష్య పంట',
      diagnosedSpecimen: 'రోగనిర్ధారణ చేయబడిన ఆకు నమూనా',
      photosSelected: 'ఫోటోలు ఎంచుకోబడ్డాయి',
      newCase: 'కొత్త నమూనా',
      addEvidence: 'అదనపు ఫోటో జోడించండి',
      camera: 'కెమెరా',
      uploadFile: 'ఫైల్ అప్‌లోడ్',
      uploadFiles: 'ఫైల్స్ అప్‌లోడ్',
      takePhoto: 'లైవ్ ఫోటో తీయండి',
      addMore: 'మరిన్ని జోడించు',
      clearAll: 'అన్నీ తొలగించు',
      dragDropHint: 'ఫోటో తీయండి లేదా 1–5 ఆకు/పంట ఫోటోలను ఇక్కడ డ్రాప్ చేయండి',
      multiAngleHint: 'వివిధ కోణాలలో (పైన, కింద, కాండం) ఫోటోలు తీయడం వలన విశ్లేషణ మరింత ఖచ్చితంగా ఉంటుంది.',
      analysisActiveNotice: 'విశ్లేషణ పూర్తయింది. క్రింద చికిత్స విధానం చూడండి.',
      upTo5Images: 'గరిష్టంగా 5 ఫోటోలు',
      cropSpeciesLabel: 'పంట రకం / జాతి',
      cropSpeciesPlaceholder: 'ఉదా. వరి, గోధుమ, పత్తి, టమాటా',
      symptomsLabel: 'గమనించిన లక్షణాలు / ఫీల్డ్ సమాచారం',
      symptomsPlaceholder: 'ఉదా. ఆకులపై పసుపు మచ్చలు, ఎండిపోతున్న కాండం, వర్షం తర్వాత నల్లబడటం...',
      diagnosing: 'జెమిని విజన్ AI తో నమూనా విశ్లేషిస్తోంది...',
      diagnoseBtn: 'AI పంట ఆరోగ్య పరీక్ష ప్రారంభించు',
      useFiles: 'ఫైల్స్ ఉపయోగించండి',
      diagnosticPathologyHeader: 'రోగనిర్ధారణ వ్యాధికారక విశ్లేషణ & నిర్వహణ',
      viewfinderTitle: 'క్రాప్ డాక్టర్ కెమెరా వీవ్‌ఫైండర్',
      capturePhotoBtn: 'ఫోటో తీయండి',
      cancelBtn: 'రద్దు చేయి',
    },
    hi: {
      engineTitle: 'क्रॉप डॉक्टर एआई निदान इंजन',
      registeredOnly: 'केवल पंजीकृत किसानों के लिए',
      loginToUse: 'क्रॉप डॉक्टर का उपयोग करने के लिए लॉगिन करें',
      targetCrop: 'लक्ष्य फसल',
      diagnosedSpecimen: 'निदान किया गया फसल नमूना',
      photosSelected: 'फ़ोटो चुने गए',
      newCase: 'नया मामला',
      addEvidence: 'अतिरिक्त फ़ोटो जोड़ें',
      camera: 'कैमरा',
      uploadFile: 'फ़ाइल अपलोड करें',
      uploadFiles: 'फ़ाइलें अपलोड करें',
      takePhoto: 'लाइव फोटो लें',
      addMore: 'और जोड़ें',
      clearAll: 'सभी हटाएं',
      dragDropHint: 'फोटो लें या 1–5 पत्ती/फसल की तस्वीरें यहां ड्रॉप करें',
      multiAngleHint: 'विभिन्न कोणों से फोटो लेने से निदान की सटीकता बढ़ती है।',
      analysisActiveNotice: 'विश्लेषण सक्रिय है। नीचे नैदानिक ​​रिपोर्ट और उपचार देखें।',
      upTo5Images: 'अधिकतम 5 तस्वीरें',
      cropSpeciesLabel: 'फसल की प्रजाति / नाम',
      cropSpeciesPlaceholder: 'जैसे गेहूं, धान, कपास, टमाटर',
      symptomsLabel: 'देखे गए लक्षण या क्षेत्र की जानकारी',
      symptomsPlaceholder: 'जैसे पत्तियों पर पीले धब्बे, सूखते तने, भारी बारिश के बाद काला पड़ना...',
      diagnosing: 'जेमिनी विज़न एआई से पत्ती का विश्लेषण किया जा रहा है...',
      diagnoseBtn: 'एआई फसल स्वास्थ्य परीक्षण चलाएं',
      useFiles: 'फ़ाइलों का उपयोग करें',
      diagnosticPathologyHeader: 'नैदानिक ​​रोग विज्ञान एवं प्रबंधन',
      viewfinderTitle: 'क्रॉप डॉक्टर व्यूफाइंडर',
      capturePhotoBtn: 'फोटो कैप्चर करें',
      cancelBtn: 'रद्द करें',
    },
    ta: {
      engineTitle: 'பயிர் மருத்துவர் AI நோய் கண்டறிதல் என்ஜின்',
      registeredOnly: 'பதிவு செய்த விவசாயிகளுக்கு மட்டும்',
      loginToUse: 'பயிர் மருத்துவரைப் பயன்படுத்த உள்நுழையவும்',
      targetCrop: 'இலக்கு பயிர்',
      diagnosedSpecimen: 'பரிசோதிக்கப்பட்ட மாதிரி',
      photosSelected: 'புகைப்படங்கள் தேர்ந்தெடுக்கப்பட்டன',
      newCase: 'புதிய மாதிரி',
      addEvidence: 'கூடுதல் புகைப்படம் சேர்',
      camera: 'கேமரா',
      uploadFile: 'கோப்பைப் பதிவேற்று',
      uploadFiles: 'கோப்புகளைப் பதிவேற்று',
      takePhoto: 'நேரலை படம் எடுக்கவும்',
      addMore: 'மேலும் சேர்க்க',
      clearAll: 'அனைத்தையும் நீக்கு',
      dragDropHint: 'படம் எடுக்கவும் அல்லது 1–5 இலை புகைப்படங்களை இங்கே போடவும்',
      multiAngleHint: 'பல்வேறு கோணங்களில் படம் எடுப்பது துல்லியத்தை அதிகரிக்கும்.',
      analysisActiveNotice: 'பகுப்பாய்வு முடிந்தது. சிகிச்சை முறையை கீழே காண்க.',
      upTo5Images: '5 படங்கள் வரை',
      cropSpeciesLabel: 'பயிர் வகை',
      cropSpeciesPlaceholder: 'எ.கா. நெல், கோதுமை, பருத்தி, தக்காளி',
      symptomsLabel: 'கண்டறியப்பட்ட அறிகுறிகள்',
      symptomsPlaceholder: 'எ.கா. இலையில் மஞ்சள் புள்ளிகள், தண்டு வாடுதல்...',
      diagnosing: 'ஜெமினி விசன் மூலம் ஆராய்கிறது...',
      diagnoseBtn: 'AI பயிர் ஆரோக்கிய பரிசோதனை',
      useFiles: 'கோப்புகளைப் பயன்படுத்தவும்',
      diagnosticPathologyHeader: 'நோய் கண்டறிதல் மற்றும் மேலாண்மை',
      viewfinderTitle: 'பயிர் மருத்துவர் கேமரா',
      capturePhotoBtn: 'படம் எடுக்கவும்',
      cancelBtn: 'ரத்து செய்',
    },
    kn: {
      engineTitle: 'ಕ್ರಾಪ್ ಡಾಕ್ಟರ್ AI ರೋಗನಿರ್ಣಯ ವ್ಯವಸ್ಥೆ',
      registeredOnly: 'ನೊಂದಾಯಿತ ರೈತರಿಗೆ ಮಾತ್ರ',
      loginToUse: 'ಕ್ರಾಪ್ ಡಾಕ್ಟರ್ ಬಳಸಲು ಲಾಗಿನ್ ಮಾಡಿ',
      targetCrop: 'ಗುರಿ ಬೆಳೆ',
      diagnosedSpecimen: 'ರೋಗನಿರ್ಣಯ ಮಾಡಿದ ಮಾದರಿ',
      photosSelected: 'ಫೋಟೋಗಳನ್ನು ಆಯ್ಕೆಮಾಡಲಾಗಿದೆ',
      newCase: 'ಹೊಸ ಮಾದರಿ',
      addEvidence: 'ಹೆಚ್ಚುವರಿ ಫೋಟೋ ಸೇರಿಸಿ',
      camera: 'ಕ್ಯಾಮೆರಾ',
      uploadFile: 'ಫೈಲ್ ಅಪ್‌ಲೋಡ್',
      uploadFiles: 'ಫೈಲ್‌ಗಳನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ',
      takePhoto: 'ಲೈವ್ ಫೋಟೋ ತೆಗೆಯಿರಿ',
      addMore: 'ಇನ್ನಷ್ಟು ಸೇರಿಸಿ',
      clearAll: 'ಎಲ್ಲವನ್ನೂ ಅಳಿಸಿ',
      dragDropHint: 'ಫೋಟೋ ತೆಗೆಯಿರಿ ಅಥವಾ 1–5 ಎಲೆ ಫೋಟೋಗಳನ್ನು ಇಲ್ಲಿ ಹಾಕಿ',
      multiAngleHint: 'ವಿವಿಧ ಕೋನಗಳಲ್ಲಿ ಫೋಟೋ ತೆಗೆಯುವುದು ನಿಖರತೆಯನ್ನು ಹೆಚ್ಚಿಸುತ್ತದೆ.',
      analysisActiveNotice: 'ವಿಶ್ಲೇಷಣೆ ಪೂರ್ಣಗೊಂಡಿದೆ. ಚಿಕಿತ್ಸಾ ವಿಧಾನವನ್ನು ಕೆಳಗೆ ನೋಡಿ.',
      upTo5Images: 'ಗರಿಷ್ಠ 5 ಚಿತ್ರಗಳು',
      cropSpeciesLabel: 'ಬೆಳೆಯ ತಳಿ / ಹೆಸರು',
      cropSpeciesPlaceholder: 'ಉದಾ. ಭತ್ತ, ಗೋಧಿ, ಹತ್ತಿ, ಟೊಮೆಟೊ',
      symptomsLabel: 'ಕಂಡುಬಂದ ಲಕ್ಷಣಗಳು',
      symptomsPlaceholder: 'ಉದಾ. ಎಲೆಗಳ ಮೇಲೆ ಹಳದಿ ಚುಕ್ಕೆಗಳು, ಕಾಂಡ ಒಣಗುವುದು...',
      diagnosing: 'ಜೆಮಿನಿ ವಿಷನ್ ಜೊತೆಗೆ ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ...',
      diagnoseBtn: 'AI ಬೆಳೆ ಆರೋಗ್ಯ ತಪಾಸಣೆ',
      useFiles: 'ಫೈಲ್‌ಗಳನ್ನು ಬಳಸಿ',
      diagnosticPathologyHeader: 'ರೋಗನಿರ್ಣಯ ಮತ್ತು ನಿರ್ವಹಣೆ',
      viewfinderTitle: 'ಕ್ಯಾಮೆರಾ ವ್ಯೂಫೈಂಡರ್',
      capturePhotoBtn: 'ಫೋಟೋ ತೆಗೆಯಿರಿ',
      cancelBtn: 'ರದ್ದುಗೊಳಿಸಿ',
    },
    mr: {
      engineTitle: 'क्रॉप डॉक्टर एआय निदान इंजिन',
      registeredOnly: 'फक्त नोंदणीकृत शेतकऱ्यांसाठी',
      loginToUse: 'क्रॉप डॉक्टर वापरण्यासाठी लॉग इन करा',
      targetCrop: 'लक्ष्य पीक',
      diagnosedSpecimen: 'निदान झालेला नमुना',
      photosSelected: 'फोटो निवडले',
      newCase: 'नवीन नमुना',
      addEvidence: 'अतिरिक्त फोटो जोडा',
      camera: 'कॅमेरा',
      uploadFile: 'फाइल अपलोड करा',
      uploadFiles: 'फाइल्स अपलोड करा',
      takePhoto: 'थेट फोटो घ्या',
      addMore: 'अजून जोडा',
      clearAll: 'सर्व हटवा',
      dragDropHint: 'फोटो घ्या किंवा १-५ पानांचे फोटो येथे ड्रॉप करा',
      multiAngleHint: 'वेगवेगळ्या कोनातून फोटो घेतल्यास निदानाची अचूकता वाढते.',
      analysisActiveNotice: 'विश्लेषण पूर्ण झाले. खाली उपचार पद्धती पहा.',
      upTo5Images: 'जास्तीत जास्त ५ फोटो',
      cropSpeciesLabel: 'पिकाची जात / नाव',
      cropSpeciesPlaceholder: 'उदा. गहू, भात, कापूस, टोमॅटो',
      symptomsLabel: 'दिसणारी लक्षणे',
      symptomsPlaceholder: 'उदा. पानांवर पिवळे ठिपके, खोड वाळणे...',
      diagnosing: 'जेमिनी व्हिजन एआय द्वारे तपासणी सुरू आहे...',
      diagnoseBtn: 'एआय पीक आरोग्य तपासणी सुरू करा',
      useFiles: 'फाइल्स वापरा',
      diagnosticPathologyHeader: 'रोगनिदान आणि व्यवस्थापन',
      viewfinderTitle: 'कॅमेरा व्ह्यूफाइंडर',
      capturePhotoBtn: 'फोटो घ्या',
      cancelBtn: 'रद्द करा',
    },
    ml: {
      engineTitle: 'ക്രോപ്പ് ഡോക്ടർ AI രോഗനിർണ്ണയ സിസ്റ്റം',
      registeredOnly: 'രജിസ്റ്റർ ചെയ്ത കർഷകർക്ക് മാത്രം',
      loginToUse: 'ക്രോപ്പ് ഡോക്ടർ ഉപയോഗിക്കാൻ ലോഗിൻ ചെയ്യുക',
      targetCrop: 'ലക്ഷ്യ വിള',
      diagnosedSpecimen: 'പരിശോധിച്ച സാമ്പിൾ',
      photosSelected: 'ഫോട്ടോകൾ തിരഞ്ഞെടുത്തു',
      newCase: 'പുതിയ കേസ്',
      addEvidence: 'കൂടുതൽ ഫോട്ടോ ചേർക്കുക',
      camera: 'ക്യാമറ',
      uploadFile: 'ഫയൽ അപ്‌ലോഡ് ചെയ്യുക',
      uploadFiles: 'ഫയലുകൾ അപ്‌ലോഡ് ചെയ്യുക',
      takePhoto: 'ലൈവ് ഫോട്ടോ എടുക്കുക',
      addMore: 'കൂടുതൽ ചേർക്കുക',
      clearAll: 'എല്ലാം നീക്കം ചെയ്യുക',
      dragDropHint: 'ഫോട്ടോ എടുക്കുക അല്ലെങ്കിൽ 1-5 ഇല ചിത്രങ്ങൾ ഇവിടെ ഇടുക',
      multiAngleHint: 'വിവിധ കോണുകളിൽ നിന്ന് ഫോട്ടോ എടുക്കുന്നത് കൃത്യത വർദ്ധിപ്പിക്കും.',
      analysisActiveNotice: 'വിശകലനം പൂർത്തിയായി. ചികിത്സാ രീതി താഴെ കാണുക.',
      upTo5Images: 'പരമാവധി 5 ചിത്രങ്ങൾ',
      cropSpeciesLabel: 'വിള ഇനം / പേര്',
      cropSpeciesPlaceholder: 'ഉദാ: നെല്ല്, ഗോതമ്പ്, പരുത്തി, തക്കാളി',
      symptomsLabel: 'കണ്ടെത്തിയ രോഗലക്ഷണങ്ങൾ',
      symptomsPlaceholder: 'ഉദാ: ഇലകളിൽ മഞ്ഞപ്പൊട്ടുകൾ, തണ്ട് ഉണങ്ങുന്നത്...',
      diagnosing: 'ജെമിനി വിഷൻ AI പരിശോധിക്കുന്നു...',
      diagnoseBtn: 'AI വിള ആരോഗ്യ പരിശോധന നടത്തുക',
      useFiles: 'ഫയലുകൾ ഉപയോഗിക്കുക',
      diagnosticPathologyHeader: 'രോഗനിർണ്ണയവും പരിപാലനവും',
      viewfinderTitle: 'ക്യാമറ വ്യൂഫൈൻഡർ',
      capturePhotoBtn: 'ഫോട്ടോ എടുക്കുക',
      cancelBtn: 'റദ്ദാക്കുക',
    },
    gu: {
      engineTitle: 'ક્રોપ ડોક્ટર AI નિદાન સિસ્ટમ',
      registeredOnly: 'માત્ર નોંધાયેલા ખેડૂતો માટે',
      loginToUse: 'ક્રોપ ડોક્ટર વાપરવા લોગિન કરો',
      targetCrop: 'લક્ષ્ય પાક',
      diagnosedSpecimen: 'તપાસાયેલ પાક નમૂનો',
      photosSelected: 'ફોટા પસંદ થયા',
      newCase: 'નવો કેસ',
      addEvidence: 'વધુ ફોટો ઉમેરો',
      camera: 'કેમેરા',
      uploadFile: 'ફાઇલ અપલોડ કરો',
      uploadFiles: 'ફાઇલો અપલોડ કરો',
      takePhoto: 'લાઈવ ફોટો લો',
      addMore: 'વધુ ઉમેરો',
      clearAll: 'બધું હટાવો',
      dragDropHint: 'ફોટો લો અથવા ૧-૫ પાંદડાના ફોટા અહીં મૂકો',
      multiAngleHint: 'વિવિધ ખૂણાથી ફોટો લેવાથી નિદાનની સચોટતા વધે છે.',
      analysisActiveNotice: 'વિશ્લેષણ પૂર્ણ થયું. નીચે સારવાર જુઓ.',
      upTo5Images: 'વધારેમાં વધારે ૫ ફોટા',
      cropSpeciesLabel: 'પાકની જાત / નામ',
      cropSpeciesPlaceholder: 'દા.ત. ઘઉં, ડાંગર, કપાસ, ટામેટા',
      symptomsLabel: 'જોવાયેલા લક્ષણો',
      symptomsPlaceholder: 'દા.ત. પાંદડા પર પીળા ડાઘ, થડ સુકાવું...',
      diagnosing: 'જેમિની વિઝન AI દ્વારા તપાસ ચાલુ છે...',
      diagnoseBtn: 'AI પાક આરોગ્ય તપાસ શરૂ કરો',
      useFiles: 'ફાઇલો વાપરો',
      diagnosticPathologyHeader: 'રોગ નિદાન અને સંચાલન',
      viewfinderTitle: 'કેમેરા વ્યુફાઇન્ડર',
      capturePhotoBtn: 'ફોટો લો',
      cancelBtn: 'રદ કરો',
    },
    bn: {
      engineTitle: 'ক্রপ ডাক্তার AI রোগ নির্ণয় ইঞ্জিন',
      registeredOnly: 'শুধুমাত্র নিবন্ধিত কৃষকদের জন্য',
      loginToUse: 'ক্রপ ডাক্তার ব্যবহার করতে লগইন করুন',
      targetCrop: 'লক্ষ্য ফসল',
      diagnosedSpecimen: 'পরীক্ষিত নমুনা',
      photosSelected: 'ছবি নির্বাচিত হয়েছে',
      newCase: 'নতুন নমুনা',
      addEvidence: 'অতিরিক্ত ছবি যোগ করুন',
      camera: 'ক্যামেরা',
      uploadFile: 'ফাইল আপলোড করুন',
      uploadFiles: 'ফাইলসমূহ আপলোড করুন',
      takePhoto: 'লাইভ ছবি তুলুন',
      addMore: 'আরও যোগ করুন',
      clearAll: 'সব মুছে ফেলুন',
      dragDropHint: 'ছবি তুলুন বা ১–৫টি পাতার ছবি এখানে ড্রপ করুন',
      multiAngleHint: 'বিভিন্ন কোণ থেকে ছবি তুললে নির্ভুলতা বৃদ্ধি পায়।',
      analysisActiveNotice: 'বিশ্লেষণ সফল হয়েছে। নিচে চিকিৎসা পদ্ধতি দেখুন।',
      upTo5Images: 'সর্বোচ্চ ৫টি ছবি',
      cropSpeciesLabel: 'ফসলের জাত / নাম',
      cropSpeciesPlaceholder: 'যেমন ধান, গম, তুলা, টমেটো',
      symptomsLabel: 'দেখা যাওয়া লক্ষণসমূহ',
      symptomsPlaceholder: 'যেমন পাতায় হলুদ ছোপ, কাণ্ড শুকিয়ে যাওয়া...',
      diagnosing: 'জেমিনি ভিশন AI দ্বারা বিশ্লেষণ করা হচ্ছে...',
      diagnoseBtn: 'AI ফসল স্বাস্থ্য পরীক্ষা চালান',
      useFiles: 'ফাইল ব্যবহার করুন',
      diagnosticPathologyHeader: 'রোগ নির্ণয় ও ব্যবস্থাপনা',
      viewfinderTitle: 'ক্যামেরা ভিউফাইন্ডার',
      capturePhotoBtn: 'ছবি তুলুন',
      cancelBtn: 'বাতিল করুন',
    },
    pa: {
      engineTitle: 'ਕਰੌਪ ਡਾਕਟਰ AI ਨਿਦਾਨ ਪ੍ਰਣਾਲੀ',
      registeredOnly: 'ਸਿਰਫ਼ ਰਜਿਸਟਰਡ ਕਿਸਾਨਾਂ ਲਈ',
      loginToUse: 'ਕਰੌਪ ਡਾਕਟਰ ਵਰਤਣ ਲਈ ਲੌਗਇਨ ਕਰੋ',
      targetCrop: 'ਲਕਸ਼ ਫਸਲ',
      diagnosedSpecimen: 'ਜਾਂਚਿਆ ਗਿਆ ਨਮੂਨਾ',
      photosSelected: 'ਫੋਟੋਆਂ ਚੁਣੀਆਂ ਗਈਆਂ',
      newCase: 'ਨਵਾਂ ਮਾਮਲਾ',
      addEvidence: 'ਹੋਰ ਫੋਟੋ ਜੋੜੋ',
      camera: 'ਕੈਮਰਾ',
      uploadFile: 'ਫਾਈਲ ਅੱਪਲੋਡ ਕਰੋ',
      uploadFiles: 'ਫਾਈਲਾਂ ਅੱਪਲੋਡ ਕਰੋ',
      takePhoto: 'ਲਾਈਵ ਫੋਟੋ ਖਿੱਚੋ',
      addMore: 'ਹੋਰ ਜੋੜੋ',
      clearAll: 'ਸਭ ਹਟਾਓ',
      dragDropHint: 'ਫੋਟੋ ਖਿੱਚੋ ਜਾਂ 1-5 ਪੱਤਿਆਂ ਦੀਆਂ ਫੋਟੋਆਂ ਇੱਥੇ ਪਾਓ',
      multiAngleHint: 'ਵੱਖ-ਵੱਖ ਕੋਣਾਂ ਤੋਂ ਫੋਟੋਆਂ ਖਿੱਚਣ ਨਾਲ ਜਾਂਚ ਦੀ ਸ਼ੁੱਧਤਾ ਵਧਦੀ ਹੈ।',
      analysisActiveNotice: 'ਜਾਂਚ ਸਫਲ ਰਹੀ। ਹੇਠਾਂ ਇਲਾਜ ਦੇਖੋ।',
      upTo5Images: 'ਵੱਧ ਤੋਂ ਵੱਧ 5 ਫੋਟੋਆਂ',
      cropSpeciesLabel: 'ਫਸਲ ਦੀ ਕਿਸਮ / ਨਾਮ',
      cropSpeciesPlaceholder: 'ਜਿਵੇਂ ਕਣਕ, ਝੋਨਾ, ਕਪਾਹ, ਟਮਾਟਰ',
      symptomsLabel: 'ਦੇਖੇ ਗਏ ਲੱਛਣ',
      symptomsPlaceholder: 'ਜਿਵੇਂ ਪੱਤਿਆਂ ਤੇ ਪੀਲੇ ਧੱਬੇ, ਤਣਾ ਸੁੱਕਣਾ...',
      diagnosing: 'ਜੈਮਿਨੀ ਵਿਜ਼ਨ AI ਨਾਲ ਜਾਂਚ ਕੀਤੀ ਜਾ ਰਹੀ ਹੈ...',
      diagnoseBtn: 'AI ਫਸਲ ਸਿਹਤ ਜਾਂਚ ਸ਼ੁਰੂ ਕਰੋ',
      useFiles: 'ਫਾਈਲਾਂ ਵਰਤੋ',
      diagnosticPathologyHeader: 'ਬੀਮਾਰੀ ਨਿਦਾਨ ਅਤੇ ਪ੍ਰਬੰਧਨ',
      viewfinderTitle: 'ਕੈਮਰਾ ਵੀਊਫਾਈਂਡਰ',
      capturePhotoBtn: 'ਫੋਟੋ ਖਿੱਚੋ',
      cancelBtn: 'ਰੱਦ ਕਰੋ',
    },
    or: {
      engineTitle: 'କ୍ରପ୍ ଡାକ୍ଟର AI ରୋଗ ନିରୂପଣ ପ୍ରଣାଳୀ',
      registeredOnly: 'କେବଳ ପଞ୍ଜୀକୃତ କୃଷକଙ୍କ ପାଇଁ',
      loginToUse: 'କ୍ରପ୍ ଡାକ୍ଟର ବ୍ୟବହାର କରିବାକୁ ଲଗଇନ୍ କରନ୍ତୁ',
      targetCrop: 'ଲକ୍ଷ୍ୟ ଫସଲ',
      diagnosedSpecimen: 'ପରୀକ୍ଷିତ ନମୁନା',
      photosSelected: 'ଫଟୋ ଚୟନ ହେଲା',
      newCase: 'ନୂତନ ନମୁନା',
      addEvidence: 'ଅଧିକ ଫଟୋ ଯୋଡ଼ନ୍ତୁ',
      camera: 'କ୍ୟାମେରା',
      uploadFile: 'ଫାଇଲ୍ ଅପଲୋଡ୍ କରନ୍ତୁ',
      uploadFiles: 'ଫାଇଲଗୁଡ଼ିକ ଅପଲୋଡ୍ କରନ୍ତୁ',
      takePhoto: 'ଲାଇଭ୍ ଫଟୋ ଉଠାନ୍ତୁ',
      addMore: 'ଅଧିକ ଯୋଡ଼ନ୍ତୁ',
      clearAll: 'ସମସ୍ତ ଲିଭାନ୍ତୁ',
      dragDropHint: 'ଫଟୋ ଉଠାନ୍ତୁ କିମ୍ବା ୧-୫ଟି ପତ୍ର ଫଟୋ ଏଠାରେ ରଖନ୍ତୁ',
      multiAngleHint: 'ବିଭିନ୍ନ କୋଣରୁ ଫଟୋ ଉଠାଇଲେ ନିରୂପଣ ସଠିକ୍ ହୋଇଥାଏ।',
      analysisActiveNotice: 'ପରୀକ୍ଷା ସଫଳ ହେଲା। ତଳେ ଚିକିତ୍ସା ପ୍ରଣାଳୀ ଦେଖନ୍ତୁ।',
      upTo5Images: 'ସର୍ବାଧିକ ୫ଟି ଫଟୋ',
      cropSpeciesLabel: 'ଫସଲର କିସମ / ନାମ',
      cropSpeciesPlaceholder: 'ଯେପରି ଧାନ, ଗହମ, କପା, ବିଲାତି',
      symptomsLabel: 'ଦେଖାଯାଇଥିବା ଲକ୍ଷଣ',
      symptomsPlaceholder: 'ଯେପରି ପତ୍ରରେ ହଳଦିଆ ଦାଗ, କାଣ୍ଡ ଶୁଖିଯିବା...',
      diagnosing: 'ଜେମିନି ଭିଜନ୍ AI ଦ୍ୱାରା ପରୀକ୍ଷା ଚାଲିଛି...',
      diagnoseBtn: 'AI ଫସଲ ସ୍ୱାସ୍ଥ୍ୟ ପରୀକ୍ଷା କରନ୍ତୁ',
      useFiles: 'ଫାଇଲ୍ ବ୍ୟବହାର କରନ୍ତୁ',
      diagnosticPathologyHeader: 'ରୋଗ ନିରୂପଣ ଓ ପରିଚାଳନା',
      viewfinderTitle: 'କ୍ୟାମେରା ଭିଉଫାଇଣ୍ଡର',
      capturePhotoBtn: 'ଫଟୋ ଉଠାନ୍ତୁ',
      cancelBtn: 'ବାତିଲ କରନ୍ତୁ',
    },
    as: {
      engineTitle: 'ক্ৰপ ডাক্তৰ AI ৰোগ নিৰ্ণয় ব্যৱস্থা',
      registeredOnly: 'কেৱল পঞ্জীয়নভুক্ত কৃষকৰ বাবে',
      loginToUse: 'ক্ৰপ ডাক্তৰ ব্যৱহাৰ কৰিবলৈ লগইন কৰক',
      targetCrop: 'লক্ষ্য শস্য',
      diagnosedSpecimen: 'পৰীক্ষিত নমুনা',
      photosSelected: 'ফটো নিৰ্বাচিত হৈছে',
      newCase: 'নতুন নমুনা',
      addEvidence: 'অতিৰিক্ত ফটো যোগ কৰক',
      camera: 'কেমেৰা',
      uploadFile: 'ফাইল আপলোড কৰক',
      uploadFiles: 'ফাইলসমূহ আপলোড কৰক',
      takePhoto: 'লাইভ ফটো তুলক',
      addMore: 'আৰু যোগ কৰক',
      clearAll: 'সকলো মচি পেলাওক',
      dragDropHint: 'ফটো তুলক বা ১-৫খন পাতৰ ফটো ইয়াত দিয়ক',
      multiAngleHint: 'বিভিন্ন কোণৰ পৰা ফটো তুলিলে পৰীক্ষা অধিক নিখুঁত হয়।',
      analysisActiveNotice: 'পৰীক্ষা সম্পূৰ্ণ হ’ল। তলত চিকিৎসা পদ্ধতি চাওক।',
      upTo5Images: 'সর্বাধিক ৫খন ফটো',
      cropSpeciesLabel: 'শস্যৰ প্ৰকাৰ / নাম',
      cropSpeciesPlaceholder: 'যেনে ধান, ঘেঁহু, কপাহ, বিলাহী',
      symptomsLabel: 'দেখা পোৱা লক্ষণসমূহ',
      symptomsPlaceholder: 'যেনে পাতত হালধীয়া দাগ, গছ শুকোৱা...',
      diagnosing: 'জেמיני ভিজন AI ৰ দ্বাৰা পৰীক্ষা চলি আছে...',
      diagnoseBtn: 'AI শস্য স্বাস্থ্য পৰীক্ষা কৰক',
      useFiles: 'ফাইল ব্যৱহাৰ কৰক',
      diagnosticPathologyHeader: 'ৰোগ নিৰ্ণয় আৰু পৰিচালনা',
      viewfinderTitle: 'কেমেৰা ভিউফাইণ্ডাৰ',
      capturePhotoBtn: 'ফটো তুলক',
      cancelBtn: 'বাতিল কৰক',
    },
    ur: {
      engineTitle: 'کراپ ڈاکٹر AI تشخیص کا نظام',
      registeredOnly: 'صرف رجسٹرڈ کسانوں کے لیے',
      loginToUse: 'کراپ ڈاکٹر استعمال کرنے کے لیے لاگ ان کریں',
      targetCrop: 'ہدفی فصل',
      diagnosedSpecimen: 'تشخیص شدہ نمونہ',
      photosSelected: 'تصاویر منتخب کی گئیں',
      newCase: 'نیا کیس',
      addEvidence: 'مزید تصویر شامل کریں',
      camera: 'کیمرہ',
      uploadFile: 'فائل اپ لوڈ کریں',
      uploadFiles: 'فائلیں اپ لوڈ کریں',
      takePhoto: 'لائیو تصویر لیں',
      addMore: 'مزید شامل کریں',
      clearAll: 'تمام ختم کریں',
      dragDropHint: 'تصویر لیں یا 1–5 پتوں کی تصاویر یہاں رکھیں',
      multiAngleHint: 'مختلف زاویوں سے تصاویر لینے سے تشخیص زیادہ درست ہوتی ہے۔',
      analysisActiveNotice: 'تجزیہ مکمل ہو گیا۔ نیچے علاج دیکھیں۔',
      upTo5Images: 'زیادہ سے زیادہ 5 تصاویر',
      cropSpeciesLabel: 'فصل کی قسم / نام',
      cropSpeciesPlaceholder: 'مثلاً گندم، چاول، کپاس، ٹماٹر',
      symptomsLabel: 'دیکھی گئی علامات',
      symptomsPlaceholder: 'مثلاً پتوں پر پیلے دھبے، تنے کا سوکھنا...',
      diagnosing: 'جیمنائی ویژن AI سے تجزیہ ہو رہا ہے...',
      diagnoseBtn: 'AI فصل کی صحت کا معائنہ کریں',
      useFiles: 'فائلیں استعمال کریں',
      diagnosticPathologyHeader: 'تشخیص اور علاج کا طریقہ',
      viewfinderTitle: 'کیمرہ ویو فائنڈر',
      capturePhotoBtn: 'تصویر لیں',
      cancelBtn: 'منسوخ کریں',
    },
    ar: {
      engineTitle: 'نظام طبيب المحصول بالذكاء الاصطناعي',
      registeredOnly: 'للمزارعين المسجلين فقط',
      loginToUse: 'تسجيل الدخول لاستخدام طبيب المحصول',
      targetCrop: 'المحصول المستهدف',
      diagnosedSpecimen: 'العينة التي تم تشخيصها',
      photosSelected: 'الصور المختارة',
      newCase: 'عينة جديدة',
      addEvidence: 'إضافة صورة إضافية',
      camera: 'الكاميرا',
      uploadFile: 'رفع ملف',
      uploadFiles: 'رفع ملفات',
      takePhoto: 'التقاط صورة مباشرة',
      addMore: 'إضافة المزيد',
      clearAll: 'مسح الكل',
      dragDropHint: 'التقط صورة أو اسحب 1-5 صور للأوراق هنا',
      multiAngleHint: 'التقاط الصور من زوايا مختلفة يزيد من دقة التشخيص.',
      analysisActiveNotice: 'التشخيص مكتمل. راجع بروتوكول العلاج أدناه.',
      upTo5Images: 'حتى 5 صور',
      cropSpeciesLabel: 'نوع المحصول',
      cropSpeciesPlaceholder: 'مثال: القمح، الأرز، القطن، الطماطم',
      symptomsLabel: 'الأعراض الملاحظة',
      symptomsPlaceholder: 'مثال: بقع صفراء على الأوراق، ذبول الساق...',
      diagnosing: 'جاري تحليل العينة بواسطة Gemini Vision...',
      diagnoseBtn: 'بدء فحص صحة المحصول',
      useFiles: 'استخدام الملفات',
      diagnosticPathologyHeader: 'تشخيص الأمراض والعلاج',
      viewfinderTitle: 'محدد الكاميرا',
      capturePhotoBtn: 'التقاط الصورة',
      cancelBtn: 'إلغاء',
    },
    es: {
      engineTitle: 'Motor de Diagnóstico Médico de Cultivo AI',
      registeredOnly: 'Solo para agricultores registrados',
      loginToUse: 'Inicie sesión para usar el Médico de Cultivos',
      targetCrop: 'Cultivo objetivo',
      diagnosedSpecimen: 'Muestra diagnosticada',
      photosSelected: 'fotos seleccionadas',
      newCase: 'Nuevo caso',
      addEvidence: 'Añadir evidencia',
      camera: 'Cámara',
      uploadFile: 'Subir archivo',
      uploadFiles: 'Subir archivos',
      takePhoto: 'Tomar foto en vivo',
      addMore: 'Añadir más',
      clearAll: 'Borrar todo',
      dragDropHint: 'Tome una foto o arrastre de 1 a 5 fotos de hojas aquí',
      multiAngleHint: 'Fotos de varios ángulos mejoran la precisión del diagnóstico.',
      analysisActiveNotice: 'Análisis activo. Vea el informe clínico y tratamiento abajo.',
      upTo5Images: 'Hasta 5 imágenes',
      cropSpeciesLabel: 'Especie / Nombre del cultivo',
      cropSpeciesPlaceholder: 'ej. Trigo, Arroz, Algodón, Tomate',
      symptomsLabel: 'Síntomas observados o contexto del campo',
      symptomsPlaceholder: 'ej. Manchas amarillas en hojas, marchitamiento de tallos...',
      diagnosing: 'Analizando muestra con Gemini Vision AI...',
      diagnoseBtn: 'Ejecutar diagnóstico de salud vegetal AI',
      useFiles: 'Usar archivos',
      diagnosticPathologyHeader: 'Patología diagnóstica y tratamiento',
      viewfinderTitle: 'Visor de cámara',
      capturePhotoBtn: 'Capturar foto',
      cancelBtn: 'Cancelar',
    },
    fr: {
      engineTitle: 'Moteur de Diagnostic AI Médecin des Cultures',
      registeredOnly: 'Reservé aux agriculteurs enregistrés',
      loginToUse: 'Connectez-vous pour utiliser le Médecin des Cultures',
      targetCrop: 'Culture cible',
      diagnosedSpecimen: 'Échantillon diagnostiqué',
      photosSelected: 'photos sélectionnées',
      newCase: 'Nouveau cas',
      addEvidence: 'Ajouter une preuve',
      camera: 'Caméra',
      uploadFile: 'Importer un fichier',
      uploadFiles: 'Importer des fichiers',
      takePhoto: 'Prendre une photo en direct',
      addMore: 'Ajouter plus',
      clearAll: 'Tout effacer',
      dragDropHint: 'Prenez une photo ou déposez 1 à 5 photos de feuilles ici',
      multiAngleHint: 'Des photos sous plusieurs angles améliorent la précision du diagnostic.',
      analysisActiveNotice: 'Analyse active. Consultez le rapport clinique et traitement ci-dessous.',
      upTo5Images: 'Jusqu\'à 5 images',
      cropSpeciesLabel: 'Espèce / Nom de la culture',
      cropSpeciesPlaceholder: 'ex. Blé, Riz, Coton, Tomate',
      symptomsLabel: 'Symptômes observés ou contexte',
      symptomsPlaceholder: 'ex. Taches jaunes sur les feuilles, flétrissement...',
      diagnosing: 'Analyse de l\'échantillon par Gemini Vision AI...',
      diagnoseBtn: 'Lancer le diagnostic santé AI',
      useFiles: 'Utiliser des fichiers',
      diagnosticPathologyHeader: 'Pathologie diagnostique et gestion',
      viewfinderTitle: 'Viseur caméra',
      capturePhotoBtn: 'Prendre la photo',
      cancelBtn: 'Annuler',
    },
    pt: {
      engineTitle: 'Diagnóstico AI Médico de Cultivos',
      registeredOnly: 'Apenas para agricultores registrados',
      loginToUse: 'Faça login para usar o Médico de Cultivos',
      targetCrop: 'Cultura alvo',
      diagnosedSpecimen: 'Amostra diagnosticada',
      photosSelected: 'fotos selecionadas',
      newCase: 'Novo caso',
      addEvidence: 'Adicionar evidência',
      camera: 'Câmera',
      uploadFile: 'Enviar arquivo',
      uploadFiles: 'Enviar arquivos',
      takePhoto: 'Tirar foto ao vivo',
      addMore: 'Adicionar mais',
      clearAll: 'Limpar tudo',
      dragDropHint: 'Tire uma foto ou solte de 1 a 5 fotos de folhas aqui',
      multiAngleHint: 'Fotos de vários ângulos aumentam a precisão do diagnóstico.',
      analysisActiveNotice: 'Análise ativa. Veja o relatório clínico e tratamento abaixo.',
      upTo5Images: 'Até 5 imagens',
      cropSpeciesLabel: 'Espécie / Nome da cultura',
      cropSpeciesPlaceholder: 'ex. Trigo, Arroz, Algodão, Tomate',
      symptomsLabel: 'Sintomas observados ou contexto',
      symptomsPlaceholder: 'ex. Manchas amarelas nas folhas, murchamento do caule...',
      diagnosing: 'Analisando amostra com Gemini Vision AI...',
      diagnoseBtn: 'Executar diagnóstico de saúde AI',
      useFiles: 'Usar arquivos',
      diagnosticPathologyHeader: 'Patologia diagnóstica e manejo',
      viewfinderTitle: 'Visor da câmera',
      capturePhotoBtn: 'Capturar foto',
      cancelBtn: 'Cancelar',
    },
    ru: {
      engineTitle: 'ИИ Диагностика Врач Урожая',
      registeredOnly: 'Только для зарегистрированных фермеров',
      loginToUse: 'Войдите для использования Врача Урожая',
      targetCrop: 'Целевая культура',
      diagnosedSpecimen: 'Диагностированный образец',
      photosSelected: 'фото выбрано',
      newCase: 'Новый случай',
      addEvidence: 'Добавить фото',
      camera: 'Камера',
      uploadFile: 'Загрузить файл',
      uploadFiles: 'Загрузить файлы',
      takePhoto: 'Сделать фото',
      addMore: 'Добавить еще',
      clearAll: 'Очистить все',
      dragDropHint: 'Сделайте фото или перетащите 1–5 снимков листьев сюда',
      multiAngleHint: 'Снимки с разных ракурсов повышают точность диагностики.',
      analysisActiveNotice: 'Анализ завершен. Ознакомьтесь с отчетом и лечением ниже.',
      upTo5Images: 'До 5 изображений',
      cropSpeciesLabel: 'Вид / название культуры',
      cropSpeciesPlaceholder: 'напр. Пшеница, Рис, Хлопок, Томат',
      symptomsLabel: 'Наблюдаемые симптомы',
      symptomsPlaceholder: 'напр. Желтые пятна на листьях, увядание стеблей...',
      diagnosing: 'Анализ образца с помощью Gemini Vision AI...',
      diagnoseBtn: 'Запустить ИИ-диагностику здоровья',
      useFiles: 'Использовать файлы',
      diagnosticPathologyHeader: 'Диагностика патологий и лечение',
      viewfinderTitle: 'Видоискатель камеры',
      capturePhotoBtn: 'Сделать снимок',
      cancelBtn: 'Отмена',
    },
    zh: {
      engineTitle: '作物医生 AI 病虫害诊断引擎',
      registeredOnly: '仅限注册农户使用',
      loginToUse: '登录以使用作物医生功能',
      targetCrop: '目标作物',
      diagnosedSpecimen: '已诊断样本',
      photosSelected: '张照片已选择',
      newCase: '新病例',
      addEvidence: '添加补充照片',
      camera: '相机',
      uploadFile: '上传文件',
      uploadFiles: '上传照片',
      takePhoto: '实时拍照',
      addMore: '添加更多',
      clearAll: '清空全部',
      dragDropHint: '拍照或拖拽 1–5 张叶片/作物照片到此处',
      multiAngleHint: '多角度拍照（正面、背面、茎秆）可大幅提高诊断准确率。',
      analysisActiveNotice: '诊断分析已完成，请在下方查看临床报告与防治方案。',
      upTo5Images: '最多 5 张照片',
      cropSpeciesLabel: '作物品种 / 名称',
      cropSpeciesPlaceholder: '例如：小麦、水稻、棉花、番茄',
      symptomsLabel: '观察到的症状或田间背景',
      symptomsPlaceholder: '例如：叶片出现黄斑、茎秆萎蔫、大雨后发黑...',
      diagnosing: '正在使用 Gemini Vision AI 分析样本...',
      diagnoseBtn: '运行 AI 作物健康诊断',
      useFiles: '使用文件',
      diagnosticPathologyHeader: '病理诊断与综合防治',
      viewfinderTitle: '作物医生取景器',
      capturePhotoBtn: '拍摄照片',
      cancelBtn: '取消',
    },
  };

  const defaultEn: Record<string, string> = {
    engineTitle: 'Crop Doctor AI Diagnostic Engine',
    registeredOnly: 'Registered Users Only',
    loginToUse: 'Login to Use Crop Doctor',
    targetCrop: 'Target Crop',
    diagnosedSpecimen: 'Diagnosed Specimen',
    photosSelected: 'photos selected',
    newCase: 'New Case',
    addEvidence: 'Add Evidence',
    camera: 'Camera',
    uploadFile: 'Upload File',
    uploadFiles: 'Upload Files',
    takePhoto: 'Take Photo',
    addMore: 'Add More',
    clearAll: 'Clear All',
    dragDropHint: 'Take photo or drop 1–5 leaf/crop images here',
    multiAngleHint: 'Multi-angle photos (top, underside, stem) improve diagnostic accuracy.',
    analysisActiveNotice: 'Analysis active. See clinical report and treatment protocol below.',
    upTo5Images: 'Up to 5 images',
    cropSpeciesLabel: 'Crop Species / Name',
    cropSpeciesPlaceholder: 'e.g. Wheat, Paddy, Cotton, Tomato',
    symptomsLabel: 'Observed Symptoms or Field Context',
    symptomsPlaceholder: 'e.g. Yellow spots on upper leaves, wilting stems, browning edges after heavy rainfall...',
    diagnosing: 'Analyzing leaf specimen with Gemini Vision...',
    diagnoseBtn: 'Run AI Crop Health Diagnosis',
    useFiles: 'Use Files',
    diagnosticPathologyHeader: 'Diagnostic Pathology & Management',
    viewfinderTitle: 'Crop Doctor Viewfinder',
    capturePhotoBtn: 'Capture Photo',
    cancelBtn: 'Cancel',
  };

  const selected = labels[norm] || defaultEn;
  return new Proxy(selected, {
    get: (target, prop: string) => target[prop] || defaultEn[prop] || prop,
  }) as Record<keyof typeof defaultEn, string>;
}

