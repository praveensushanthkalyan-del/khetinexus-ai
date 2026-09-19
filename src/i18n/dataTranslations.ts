import { Language, FarmProfile, AdvisoryResult, DiagnosisResult, SoilReport } from '../types';
import {
  REGENERATIVE_PRACTICES,
  AGRIN_NODES,
  SHARED_KNOWLEDGE_MODULES,
} from '../data/mockData';

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
    India: 'भारत (India)',
    Brazil: 'ब्राजील (Brazil)',
    Russia: 'रूस (Russia)',
    China: 'चीन (China)',
    'South Africa': 'दक्षिण अफ्रीका (South Africa)',
    Egypt: 'मिस्र (Egypt)',
    Ethiopia: 'इथियोपिया (Ethiopia)',
    UAE: 'संयुक्त अरब अमीरात (UAE)',
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
    Wheat: 'गेहूं (Wheat)',
    Soybean: 'सोयाबीन (Soybean)',
    Rice: 'धान / चावल (Rice)',
    'Maize (Corn)': 'मक्का (Maize/Corn)',
    Corn: 'मक्का (Corn)',
    Barley: 'जौ (Barley)',
    Cotton: 'कपास (Cotton)',
    'Chickpeas / Gram': 'चना (Chickpeas/Gram)',
    'Millet (Bajra / Ragi)': 'बाजरा / रागी (Millets)',
    Tomato: 'टमाटर (Tomato)',
    Potato: 'आलू (Potato)',
    Sugarcane: 'गन्ना (Sugarcane)',
    Sunflower: 'सूरजमुखी (Sunflower)',
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
    'Chickpeas / Gram': 'Нут (Турецкий горох)',
    'Millet (Bajra / Ragi)': 'Просо / Пшено',
    Tomato: 'Томат (Помидор)',
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
    'Millet (Bajra / Ragi)': '谷子 / 粟 (小米)',
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
    Germination: 'अंकुरण (Germination)',
    Vegetative: 'वानस्पतिक वृद्धि (Vegetative)',
    Flowering: 'पुष्पन / फूल आना (Flowering)',
    'Grain filling': 'दाना भराव (Grain filling)',
    Maturity: 'परिपक्वता (Maturity)',
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
    'Alluvial Loam': 'जलोढ़ दोमट (Alluvial Loam)',
    'Chernozem (Black Earth)': 'चेरनोज़ेम / काली मिट्टी (Chernozem)',
    'Chernozem (Black Soil)': 'चेरनोज़ेम / काली मिट्टी (Chernozem)',
    'Mollisol (Black Earth)': 'मॉलिसोल / काली मिट्टी (Mollisol)',
    'Cerrado Oxisol (Red Clay)': 'सेराडो ऑक्सीसोल / लाल चिकनी मिट्टी (Oxisol)',
    'Sandy Loam': 'बलुई दोमट (Sandy Loam)',
    'Clayey Soil': 'चिकनी मिट्टी (Clayey Soil)',
    'Laterite Soil': 'लेटराइट मिट्टी (Laterite Soil)',
    'Silt Loam': 'गाद दोमट (Silt Loam)',
    'Black Cotton Soil (Vertisol)': 'काली कपासी मिट्टी (Vertisol)',
  },
  pt: {
    'Alluvial Loam': 'Franco-aluvial',
    'Chernozem (Black Earth)': 'Chernozem (Terra Negra)',
    'Chernozem (Black Soil)': 'Chernozem (Solo Negro)',
    'Mollisol (Black Earth)': 'Molisol (Terra Negra)',
    'Cerrado Oxisol (Red Clay)': 'Latossolo Vermelho do Cerrado',
    'Sandy Loam': 'Franco-arenoso',
    'Clayey Soil': 'Solo Argiloso',
    'Laterite Soil': 'Solo Laterítico',
    'Silt Loam': 'Franco-siltoso',
    'Black Cotton Soil (Vertisol)': 'Vertissolo (Solo de Algodão Preto)',
  },
  ru: {
    'Alluvial Loam': 'Аллювиальный суглинок',
    'Chernozem (Black Earth)': 'Чернозем (Черная земля)',
    'Chernozem (Black Soil)': 'Чернозем (Плодородная черная почва)',
    'Mollisol (Black Earth)': 'Моллисоль (Черноземовидная почва)',
    'Cerrado Oxisol (Red Clay)': 'Серрадо Оксисоль (Красная глина)',
    'Sandy Loam': 'Супесчаная почва',
    'Clayey Soil': 'Глинистая почва',
    'Laterite Soil': 'Латеритная почва',
    'Silt Loam': 'Пылеватый суглинок',
    'Black Cotton Soil (Vertisol)': 'Черная хлопковая почва (Вертисоль)',
  },
  zh: {
    'Alluvial Loam': '冲积壤土',
    'Chernozem (Black Earth)': '黑钙土 (黑土)',
    'Chernozem (Black Soil)': '黑钙土 (肥沃黑土)',
    'Mollisol (Black Earth)': '软土 (松软黑土)',
    'Cerrado Oxisol (Red Clay)': '塞拉多富铁土 (红粘土)',
    'Sandy Loam': '砂质壤土',
    'Clayey Soil': '粘质土壤',
    'Laterite Soil': '红壤 / 砖红壤',
    'Silt Loam': '粉砂质壤土',
    'Black Cotton Soil (Vertisol)': '黑棉土 (变性土)',
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
    'Drip Irrigation': 'टपक सिंचाई (Drip Irrigation)',
    Canal: 'नहर सिंचाई (Canal)',
    Sprinkler: 'फव्वारा सिंचाई (Sprinkler)',
    Rainfed: 'वर्षा आधारित (Rainfed)',
    'Borewell / Tube well': 'नलकूप / बोरवेल (Borewell)',
  },
  pt: {
    'Drip Irrigation': 'Irrigação por Gotejamento',
    Canal: 'Canal de Irrigação',
    Sprinkler: 'Aspersão',
    Rainfed: 'Sequeiro (Alimentado por Chuva)',
    'Borewell / Tube well': 'Poço Artesiano / Tubular',
  },
  ru: {
    'Drip Irrigation': 'Капельное орошение',
    Canal: 'Канальное орошение',
    Sprinkler: 'Дождевание',
    Rainfed: 'Богарное (Богара / Дождевое)',
    'Borewell / Tube well': 'Артезианская скважина / Трубчатый колодец',
  },
  zh: {
    'Drip Irrigation': '滴灌系统',
    Canal: '渠道灌溉',
    Sprinkler: '喷灌系统',
    Rainfed: '雨养农业 (靠天降雨)',
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
    Today: 'आज (Today)',
    Tomorrow: 'कल (Tomorrow)',
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

function normalizeLang(lang: Language): string {
  if (!lang) return 'en';
  if (lang === 'hi-IN') return 'hi';
  if (lang.includes('-')) return lang.split('-')[0];
  return lang;
}

// Helper methods
export function localizeCountry(country: string, lang: Language): string {
  const norm = normalizeLang(lang);
  return COUNTRY_NAMES[norm]?.[country] || COUNTRY_NAMES.en[country] || country;
}

export function localizeCrop(crop: string, lang: Language): string {
  const norm = normalizeLang(lang);
  return CROP_NAMES[norm]?.[crop] || CROP_NAMES.en[crop] || crop;
}

export function localizeGrowthStage(stage: string, lang: Language): string {
  const norm = normalizeLang(lang);
  return GROWTH_STAGE_NAMES[norm]?.[stage] || GROWTH_STAGE_NAMES.en[stage] || stage;
}

export function localizeSoilType(soil: string, lang: Language): string {
  const norm = normalizeLang(lang);
  return SOIL_TYPE_NAMES[norm]?.[soil] || SOIL_TYPE_NAMES.en[soil] || soil;
}

export function localizeIrrigation(irr: string, lang: Language): string {
  const norm = normalizeLang(lang);
  return IRRIGATION_NAMES[norm]?.[irr] || IRRIGATION_NAMES.en[irr] || irr;
}

export function localizeWeatherCondition(cond: string, lang: Language): string {
  const norm = normalizeLang(lang);
  return WEATHER_CONDITIONS[norm]?.[cond] || WEATHER_CONDITIONS.en[cond] || cond;
}

export function localizeForecastDay(day: string, lang: Language): string {
  const norm = normalizeLang(lang);
  return FORECAST_DAYS[norm]?.[day] || FORECAST_DAYS.en[day] || day;
}

// Localized 8 Pillars of Regenerative Agriculture
export function getLocalizedPillars(lang: Language) {
  const norm = normalizeLang(lang);
  if (norm === 'en') return REGENERATIVE_PRACTICES;

  const translationsMap: Record<
    'hi' | 'pt' | 'ru' | 'zh',
    Record<
      string,
      {
        title: string;
        tag: string;
        description: string;
        benefits: string[];
        implementation: string;
      }
    >
  > = {
    hi: {
      'crop-rotation': {
        title: 'फसल चक्र एवं विविधीकरण',
        tag: 'मृदा जीवन शक्ति',
        description:
          'गहरी जड़ों और उथली जड़ों वाली फसलों को दलहनी फसलों के साथ बारी-बारी से उगाने से कीट-रोग चक्र टूटता है और मिट्टी की उर्वरता स्वतः पुनर्जीवित होती है।',
        benefits: ['खरपतवार एवं कीट चक्र का टूटना', 'प्राकृतिक नाइट्रोजन संतुलन', 'मिट्टी की बनावट में सुधार'],
        implementation:
          '3-4 मौसमों का फसल चक्र बनाएं जिसमें अनाज (गेहूं/मक्का) के बाद दलहन (चना/मसूर) और तिलहन लगाएं।',
      },
      'cover-crops': {
        title: 'बहु-प्रजाति आच्छादन फसलें (Cover Crops)',
        tag: 'कटाव रोकथाम व जैव संवर्धन',
        description:
          'वर्ष भर खेतों में जीवित जड़ें बनाए रखने से मिट्टी के लाभकारी रोगाणुओं को जैविक पोषण मिलता है और मिट्टी तेज धूप व बारिश के कटाव से बचती है।',
        benefits: ['80%+ खरपतवारों पर नियंत्रण', 'मृदा क्षरण की रोकथाम', 'सक्रिय माइकोराइजा में वृद्धि'],
        implementation:
          'मुख्य फसलों के बीच खाली समय में लोबिया, सनई, ढैंचा या मूंग जैसी बहु-प्रजाति आच्छादन फसलें बोएं।',
      },
      'compost-organic': {
        title: 'जीवामृत, कंपोस्ट व जैविक संवर्धक',
        tag: 'सूक्ष्मजीवी जीवन',
        description:
          'सिंथेटिक उर्वरकों की जगह वर्मीकंपोस्ट, बायोचार और जीवामृत/कंपोस्ट चाय का प्रयोग मिट्टी में अरबों लाभकारी जीवाणुओं और कवक को सक्रिय करता है।',
        benefits: ['मृदा pH संतुलित करना', 'जल अवशोषण में वृद्धि', 'दीर्घकालिक जैविक पोषण'],
        implementation:
          'बुआई से पहले 2-3 टन परिपक्व कंपोस्ट प्रति हेक्टेयर डालें, साथ ही शाम के समय जीवामृत का छिड़काव करें।',
      },
      'reduced-tillage': {
        title: 'न्यूनतम / शून्य जुताई (Zero Tillage)',
        tag: 'कार्बन अवशोषण',
        description:
          'अत्यधिक यांत्रिक जुताई मिट्टी के कार्बन को नष्ट करती है। शून्य जुताई मिट्टी की स्वाभाविक संरचना, सूक्ष्म छिद्रों और केंचुओं के आवास को सुरक्षित रखती है।',
        benefits: ['डीजल एवं श्रम की बचत', 'मिट्टी की नमी का संरक्षण', 'मिट्टी में कार्बन का संचय'],
        implementation:
          'हैप्पी सीडर या जीरो टिल ड्रिल की सहायता से फसल अवशेषों के बीच सीधे बीज बोएं।',
      },
      'water-conservation': {
        title: 'सटीक जल संरक्षण एवं सूक्ष्म सिंचाई',
        tag: 'जलवायु सहनशीलता',
        description:
          'टपक (ड्रिप) सिंचाई, नमी सेंसर और वर्षा जल संचयन मेड़ों का उपयोग जल की 50% तक बचत करता है और लवणता रोकता है।',
        benefits: ['भूजल का संरक्षण', 'जड़ों के सड़ने से बचाव', 'सूखे के प्रभाव को न्यूनतम करना'],
        implementation:
          'गुरुत्वाकर्षण आधारित या कम दबाव वाली ड्रिप लाइनें स्थापित करें और मिट्टी में नमी की जांच करें।',
      },
      'soil-moisture': {
        title: 'जीवित आच्छादन एवं मल्चिंग',
        tag: 'वाष्पीकरण नियंत्रण',
        description:
          'फसल अवशेषों (भूसा/पुआल) से मिट्टी को ढकने से मिट्टी का तापमान 10-15°C तक कम रहता है और वाष्पीकरण में 40% की कमी आती है।',
        benefits: ['तेज गर्मी से सूक्ष्मजीवों की सुरक्षा', 'नमी का टिकाऊ संरक्षण', 'केंचुओं के लिए आदर्श परिवेश'],
        implementation:
          'फसल के ठूंठ को कभी न जलाएं; कटे हुए भूसे या पत्तियों को कतारों के बीच समान रूप से बिछाएं।',
      },
      biodiversity: {
        title: 'कृषि-जैव विविधता व पुष्प पट्टी',
        tag: 'पारिस्थितिक संतुलन',
        description:
          'खेत की मेड़ों पर फूलदार झाड़ियां और छायादार पेड़ लगाने से मित्र कीटों (लेडीबग, परजीवी ततैया) और मधुमक्खियों को स्थायी आश्रय मिलता है।',
        benefits: ['कीटों का प्राकृतिक भक्षण', 'तेज हवाओं से सुरक्षा', 'अतिरिक्त शहद व परागण लाभ'],
        implementation:
          'खेत की 5-8% सीमाओं पर गेंदा, सरसों व दलहनी फूलों की पट्टियां विकसित करें।',
      },
      ipm: {
        title: 'एकीकृत पारिस्थितिक कीट प्रबंधन (IPM)',
        tag: 'जैविक नियंत्रण',
        description:
          'जहरीले कीटनाशकों के स्थान पर ट्राइकोडर्मा, बेसिलस थुरिंजिएंसिस (Bt), नीम तेल और फेरोमोन ट्रैप का सुरक्षित उपयोग।',
        benefits: ['शून्य रासायनिक अवशेष', 'मधुमक्खियों का संरक्षण', 'कीटों में प्रतिरोधक क्षमता का बचाव'],
        implementation:
          'सीमाओं पर ट्रैप फसलें (अरंडी/गेंदा) लगाएं और कीट दिखने पर तुरंत जैविक घोल का छिड़काव करें।',
      },
    },
    pt: {
      'crop-rotation': {
        title: 'Rotação e Diversificação de Culturas',
        tag: 'Vitalidade do Solo',
        description:
          'Alternar culturas de raízes profundas com leguminosas quebra o ciclo de pragas e doenças, restaurando a fertilidade natural do solo.',
        benefits: ['Quebra ciclos de pragas e ervas', 'Equilíbrio natural de nitrogênio', 'Melhora a estrutura do solo'],
        implementation:
          'Desenhe uma rotação de 3-4 safras alternando cereais (milho/trigo) com leguminosas (soja/feijão) e brássicas.',
      },
      'cover-crops': {
        title: 'Culturas de Cobertura Multi-espécies',
        tag: 'Erosão e Biologia',
        description:
          'Manter raízes vivas no solo o ano todo nutre a teia alimentar microbiológica e protege o solo contra erosão e altas temperaturas.',
        benefits: ['Suprime mais de 80% das plantas daninhas', 'Previne erosão hídrica e eólica', 'Aumenta micorrizas ativas'],
        implementation:
          'Semeie misturas de leguminosas, milheto e rabanete forrageiro nos períodos de pousio entre as safras principais.',
      },
      'compost-organic': {
        title: 'Compostagem e Bio-inoculantes',
        tag: 'Vida Microbiana',
        description:
          'Substituir fertilizantes químicos de alta salinidade por biofertilizantes, biochar e compostagem ativa inocula bilhões de fungos e bactérias benéficas.',
        benefits: ['Equilibra o pH do solo', 'Aumenta infiltração de água', 'Nutrição orgânica de liberação gradual'],
        implementation:
          'Aplique 2 a 3 toneladas de composto orgânico curado por hectare antes da semeadura, com bioestimulantes foliares.',
      },
      'reduced-tillage': {
        title: 'Plantio Direto / Semeadura Direta',
        tag: 'Sequestro de Carbono',
        description:
          'O preparo mecânico do solo oxida a matéria orgânica em CO2. O plantio direto preserva a arquitetura do solo e a biologia subterrânea.',
        benefits: ['Economiza combustível e mão de obra', 'Retém umidade profunda no solo', 'Fixa carbono no solo'],
        implementation:
          'Transite para o plantio direto na palha utilizando rolo-faca e semeadoras especializadas.',
      },
      'water-conservation': {
        title: 'Conservação de Água de Precisão',
        tag: 'Resiliência Climática',
        description:
          'Gotejamento, agendamento com sensores e curvas de nível evitam a salinização e reduzem o uso de água em até 50%.',
        benefits: ['Preserva água subterrânea', 'Evita asfixia radicular', 'Mitiga estresse por estiagem'],
        implementation:
          'Instale fitas gotejadoras de baixa pressão guiadas por tensiômetros manuais simples.',
      },
      'soil-moisture': {
        title: 'Palhada Protetora e Mulching Vivo',
        tag: 'Proteção contra Evaporação',
        description:
          'Cobrir o solo com 7 a 10 cm de resíduos reduz a temperatura da superfície em 10-15°C e corta a evaporação em até 40%.',
        benefits: ['Protege microbioma do calor excessivo', 'Mantém a umidade constante', 'Cria habitat para minhocas'],
        implementation:
          'Nunca queime a palhada; distribua palha picada ou bagaço uniformemente nas entrelinhas.',
      },
      biodiversity: {
        title: 'Agrobiodiversidade e Cercas Vivas',
        tag: 'Equilíbrio Ecológico',
        description:
          'O plantio de faixas florais de polinizadores e quebra-ventos cria refúgios permanentes para predadores naturais e abelhas.',
        benefits: ['Predação biológica de pragas', 'Proteção contra ventos fortes', 'Produção complementar de mel'],
        implementation:
          'Dedique de 5% a 8% das bordas da fazenda para arbustos nativos, tagetes (cravo-de-defunto) e árvores fixadoras de nitrogênio.',
      },
      ipm: {
        title: 'Manejo Ecológico Integrado de Pragas (MIP)',
        tag: 'Controle Biológico',
        description:
          'Utilização de agentes biológicos (Trichoderma, Bacillus thuringiensis, óleo de nim), armadilhas e feromônios no lugar de organofosforados.',
        benefits: ['Zero resíduos tóxicos no alimento', 'Protege abelhas e polinizadores', 'Evita resistência química de pragas'],
        implementation:
          'Instale culturas-armadilha e libere agentes parasitoides biológicos logo no início do monitoramento.',
      },
    },
    ru: {
      'crop-rotation': {
        title: 'Севооборот и диверсификация культур',
        tag: 'Плодородие почвы',
        description:
          'Чередование глубокоукореняющихся культур с бобовыми разрушает жизненный цикл вредителей и болезней, восстанавливая баланс питательных веществ.',
        benefits: ['Прерывание циклов сорняков и вредителей', 'Естественный азотный баланс', 'Улучшение структуры почвы'],
        implementation:
          'Спланируйте 3-4-летний севооборот, чередуя зерновые (пшеница/кукуруза) с зернобобовыми (нут/чечевица) и крестоцветными.',
      },
      'cover-crops': {
        title: 'Многовидовые покровные культуры',
        tag: 'Эрозия и биология',
        description:
          'Круглогодичное присутствие живых корней в почве питает полезные почвенные микроорганизмы и физически защищает плодородный слой от эрозии.',
        benefits: ['Подавление сорняков более чем на 80%', 'Защита от водной и ветровой эрозии', 'Увеличение популяции микоризы'],
        implementation:
          'Высевайте многовидовые смеси (вика, горчица, редька масличная) в межатмосферные периоды между основными товарными культурами.',
      },
      'compost-organic': {
        title: 'Компост и биоинокулянты',
        tag: 'Микробная жизнь',
        description:
          'Замена высокосолевых синтетических удобрений зрелым биогумусом, биоуглем и аэрированным компостным чаем оживляет почвенную микрофлору.',
        benefits: ['Буферизация pH почвы', 'Улучшение влагопоглощения', 'Пролонгированное органическое питание'],
        implementation:
          'Вносите 2–3 тонны созревшего компоста на гектар перед посевом в сочетании с некорневой биологической подкормкой.',
      },
      'reduced-tillage': {
        title: 'Минимальная / Нулевая обработка (No-Till)',
        tag: 'Связывание углерода',
        description:
          'Механическая вспашка окисляет почвенный углерод до CO2 и разрушает мицелий. No-till сохраняет капиллярную структуру почвы и ходы дождевых червей.',
        benefits: ['Экономия топлива и трудозатрат', 'Удержание влаги в почве', 'Фиксация углерода в почве'],
        implementation:
          'Переходите на прямой посев по растительным остаткам с использованием специализированных сеялок прямого сева.',
      },
      'water-conservation': {
        title: 'Точное водосбережение и микроорошение',
        tag: 'Климатическая устойчивость',
        description:
          'Капельное орошение, контроль влажности датчиками и террасирование предотвращают засоление и снижают расход воды на 50%.',
        benefits: ['Сбережение подземных вод', 'Предотвращение кислородного голодания корней', 'Снижение рисков засухи'],
        implementation:
          'Установите гравитационные или низконапорные капельные линии с использованием простых почвенных тензиометров.',
      },
      'soil-moisture': {
        title: 'Мульчирующий покров и сохранение влаги',
        tag: 'Защита от испарения',
        description:
          'Слой мульчи из пожнивных остатков толщиной 7–10 см снижает температуру поверхности на 10–15°C и сокращает испарение на 40%.',
        benefits: ['Защита микробиома от перегрева', 'Сохранение почвенной влаги', 'Благоприятная среда для червей'],
        implementation:
          'Никогда не сжигайте стерню; равномерно распределяйте измельченную солому по междурядьям.',
      },
      biodiversity: {
        title: 'Агробиоразнообразие и живые изгороди',
        tag: 'Экологический баланс',
        description:
          'Цветущие полосы по периметру полей и лесополосы создают надежные убежища для хищных насекомых-энтомофагов и пчел-опылителей.',
        benefits: ['Естественный контроль вредителей', 'Ветрозащитная функция', 'Дополнительный сбор меда'],
        implementation:
          'Выделяйте 5–8% площади границ полей под цветущие многолетники, бархатцы и азотфиксирующие кустарники.',
      },
      ipm: {
        title: 'Интегрированная экологическая защита растений (ИЗР)',
        tag: 'Биологический контроль',
        description:
          'Использование биопрепаратов (Триходерма, Битоксибациллин, масло нима), феромонных ловушек и ловчих культур вместо токсичных химикатов.',
        benefits: ['Отсутствие токсичных остатков в урожае', 'Безопасность для пчел', 'Предотвращение резистентности вредителей'],
        implementation:
          'Высаживайте ловчие культуры на границах полей и применяйте биопрепараты при первых признаках появления вредителей.',
      },
    },
    zh: {
      'crop-rotation': {
        title: '轮作与作物多样化',
        tag: '土壤活力',
        description:
          '深根性与浅根性作物交替种植，结合豆科固氮作物，能有效打破病虫害生命周期并补充各土层养分。',
        benefits: ['打破杂草与病虫害周期', '天然氮素生态平衡', '显著改善土壤物理团粒结构'],
        implementation:
          '制定3-4季轮作方案，将禾谷类（小麦/玉米）与豆类（鹰嘴豆/扁豆）及十字花科作物轮换。',
      },
      'cover-crops': {
        title: '多物种覆盖作物 (Cover Crops)',
        tag: '水土保持与生物增殖',
        description:
          '让农田全年保持活体根系，持续向地下分泌有机碳源滋养微生物群落，同时防止暴雨冲刷和风蚀。',
        benefits: ['抑制80%以上杂草萌发', '防止水土流失与地表板结', '促进菌根真菌活性增长'],
        implementation:
          '在主粮作物收获后的休耕期间，播种绿豆、高粱、红三叶草等复合覆盖种子。',
      },
      'compost-organic': {
        title: '堆肥与活性生物接种剂',
        tag: '微生态系统',
        description:
          '以高活性蚯蚓堆肥、生物炭和发酵堆肥茶替代高盐分化肥，向土壤接种数十亿有益菌群与真菌。',
        benefits: ['调节并缓冲土壤pH值', '大幅提高水分下渗效率', '长效缓释有机养分供给'],
        implementation:
          '播种前每公顷施用2-3吨充分腐熟的有机堆肥，配合傍晚叶面微生态发酵液喷施。',
      },
      'reduced-tillage': {
        title: '保护性耕作 / 免耕栽培 (No-Till)',
        tag: '土壤固碳',
        description:
          '剧烈机械翻耕会使土壤有机碳加速氧化为CO2并破坏菌丝。免耕能完好保护土壤孔隙度和蚯蚓通道。',
        benefits: ['节约燃油与人工成本', '深层保蓄土壤毛管水分', '将碳长效锁定在土壤中'],
        implementation:
          '通过压青留茬机并在覆草秸秆覆盖物上直接使用免耕精量播种机作业。',
      },
      'water-conservation': {
        title: '精准节水与高效微灌技术',
        tag: '气候适应韧性',
        description:
          '采用膜下滴灌、张力计土壤湿度传感器监测及雨水集蓄梯田，杜绝次生盐碱化并节水达50%。',
        benefits: ['涵养保护深层地下水', '防止作物根系缺氧沤根', '增强农田抗旱缓冲能力'],
        implementation:
          '敷设低压或重力滴灌管线，并在田间关键根系层埋设简易土壤湿度张力探针。',
      },
      'soil-moisture': {
        title: '活体覆盖物与秸秆保墒',
        tag: '抑制水分蒸发',
        description:
          '用7-10厘米秸秆残茬覆盖地表，可使盛夏地表温度降低10-15°C，并将无效蒸发损耗削减40%。',
        benefits: ['保护根际微生物免受高温灼伤', '持久保蓄耕作层有效水', '为蚯蚓繁衍营造温润栖息地'],
        implementation:
          '严禁田间焚烧秸秆；将粉碎秸秆或甘蔗渣均匀撒布于行间土表。',
      },
      biodiversity: {
        title: '农田生物多样性与生态植被隔离带',
        tag: '生态系统平衡',
        description:
          '在农田田埂边缘种植蜜源开花植物与农田防护林带，为天敌昆虫（草蛉、寄生蜂、瓢虫）提供永久栖息地。',
        benefits: ['天然生物天敌治虫', '营造防风固沙微气候', '兼收天然蜂蜜与优质绿肥'],
        implementation:
          '在农田5-8%的边界带种植万寿菊、油菜花及固氮灌木等本土蜜源植物。',
      },
      ipm: {
        title: '生态综合有害生物防治 (IPM)',
        tag: '非化学绿色防控',
        description:
          '运用哈茨木霉菌、苏云金杆菌 (Bt)、印楝素生物农药配合性诱剂性迷向，全面替代剧毒化学农药。',
        benefits: ['农产品零化学农残风险', '全面保护传粉蜜蜂种群', '避免害虫快速产生抗药性'],
        implementation:
          '地头种植诱集作物（如蓖麻/向日葵），在监测到害虫初发期及时释放天敌昆虫卵卡。',
      },
    },
  };

  const currentMap = translationsMap[norm as 'hi' | 'pt' | 'ru' | 'zh'];
  if (!currentMap) return REGENERATIVE_PRACTICES;

  return REGENERATIVE_PRACTICES.map((p) => {
    const loc = currentMap[p.id];
    if (!loc) return p;
    return {
      ...p,
      title: loc.title,
      tag: loc.tag,
      description: loc.description,
      benefits: loc.benefits,
      implementation: loc.implementation,
    };
  });
}

// Localized AgriN Nodes
export function getLocalizedAgriNNodes(lang: Language) {
  const norm = normalizeLang(lang);
  if (norm === 'en') return AGRIN_NODES;

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

  const currentMap = nodeDetails[norm as 'hi' | 'pt' | 'ru' | 'zh'];
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
export function getLocalizedSharedModules(lang: Language) {
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
    case 'pt':
      return {
        soilType,
        ph: 6.8,
        nitrogen: 'Medium',
        phosphorus: 'Optimal',
        potassium: 'Optimal',
        soilMoisture: 48,
        organicMatter: 1.85,
        summary: 'Solo equilibrado com pH neutro favorável (6,8). Matéria orgânica em 1,85%, indicando excelente oportunidade para sequestro de carbono regenerativo.',
        deficiencies: [
          'Nitrogênio disponível ligeiramente abaixo do ideal para o pico vegetativo.',
          'Carbono orgânico superficial precisa ser aumentado para resistir ao estresse hídrico.',
        ],
        regenerativeRecommendations: [
          'Introduza plantas de cobertura multiespécies (crotalária, milheto, nabo forrageiro) na entressafra.',
          'Incorpore 4 a 5 t/ha de composto orgânico maturado ou esterco curtido.',
          'Adote plantio direto contínuo para preservar as redes de fungos micorrízicos arbusculares.',
        ],
        organicMatterSuggestions:
          'Mantenha 30% da palhada da colheita como cobertura morta. Inocule com decompositores biológicos.',
        cropSpecificAdvice: `A cultura de ${crop} responde positivamente à colonização micorrízica; reduza fertilizantes fosfatados solúveis.`,
        isDemo: true,
        source: 'Núcleo de Diagnóstico de Solos AI',
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

