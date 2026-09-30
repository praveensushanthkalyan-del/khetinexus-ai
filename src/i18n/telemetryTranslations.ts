import { Language } from '../types';
import { normalizeLang } from './farmValueTranslations';
import { localizeSoilRating } from './soilHealthTranslations';

export { localizeSoilRating };

// -------------------------------------------------------------
// 1. Canopy Health Status (Sentinel-2 / MODIS NDVI)
// -------------------------------------------------------------
export const CANOPY_STATUS_MAP: Record<string, Record<string, string>> = {
  te: {
    'optimal': 'ఆరోగ్యకరమైన పచ్చని పైరు',
    'vigorous': 'బలమైన పచ్చని పంట పెరుగుదల',
    'vigorous canopy health': 'ఆరోగ్యకరమైన పచ్చని పైరు',
    'moderate stress': 'మితమైన పంట ఒత్తిడి',
    'moderate canopy stress': 'మితమైన పంట ఒత్తిడి',
    'high canopy stress': 'అధిక పంట ఒత్తిడి',
    'severe stress': 'తీవ్రమైన పంట ఒత్తిడి',
    'dormant / fallow': 'విశ్రాంతి / బీడు భూమి',
    'fallow': 'బీడు భూమి',
  },
  hi: {
    'optimal': 'स्वस्थ एवं सघन फसल छत्र',
    'vigorous': 'सघन एवं हरी-भरी फसल',
    'vigorous canopy health': 'स्वस्थ एवं सघन फसल छत्र',
    'moderate stress': 'मध्यम फसल तनाव',
    'moderate canopy stress': 'मध्यम फसल तनाव',
    'high canopy stress': 'उच्च फसल तनाव',
    'severe stress': 'गंभीर फसल तनाव',
    'dormant / fallow': 'सुप्त / परती भूमि',
    'fallow': 'परती भूमि',
  },
  ta: {
    'optimal': 'ஆரோக்கியமான பயிர் பசுமை',
    'vigorous': 'செழிப்பான பயிர் வளர்ச்சி',
    'vigorous canopy health': 'ஆரோக்கியமான பயிர் பசுமை',
    'moderate stress': 'மிதமான பயிர் அழுத்தம்',
    'moderate canopy stress': 'மிதமான பயிர் அழுத்தம்',
    'high canopy stress': 'அதிக பயிர் அழுத்தம்',
    'severe stress': 'தீவிர பயிர் அழுத்தம்',
    'dormant / fallow': 'தரிசு / ஓய்வு நிலம்',
    'fallow': 'தரிசு நிலம்',
  },
  kn: {
    'optimal': 'ಉತ್ತಮ ಬೆಳೆ ಹಸಿರು / ಕ್ಯಾನೋಪಿ',
    'vigorous': 'ಹುಲುಸಾದ ಬೆಳೆ ಬೆಳವಣಿಗೆ',
    'vigorous canopy health': 'ಉತ್ತಮ ಬೆಳೆ ಹಸಿರು / ಕ್ಯಾನೋಪಿ',
    'moderate stress': 'ಮಧ್ಯಮ ಬೆಳೆ ಒತ್ತಡ',
    'moderate canopy stress': 'ಮಧ್ಯಮ ಬೆಳೆ ಒತ್ತಡ',
    'high canopy stress': 'ಹೆಚ್ಚಿನ ಬೆಳೆ ಒತ್ತಡ',
    'severe stress': 'ತೀವ್ರ ಬೆಳೆ ಒತ್ತಡ',
    'dormant / fallow': 'ಪಾಳು / ವಿಶ್ರಾಂತಿ ಭೂಮಿ',
    'fallow': 'ಪಾಳು ಭೂಮಿ',
  },
  mr: {
    'optimal': 'उत्कृष्ट पीक आरोग्य व घनता',
    'vigorous': 'जोमदार पीक वाढ',
    'vigorous canopy health': 'उत्कृष्ट पीक आरोग्य व घनता',
    'moderate stress': 'मध्यम पीक ताण',
    'moderate canopy stress': 'मध्यम पीक ताण',
    'high canopy stress': 'तीव्र पीक ताण',
    'severe stress': 'अति तीव्र पीक ताण',
    'dormant / fallow': 'पडीक / सुप्त जमीन',
    'fallow': 'पडीक जमीन',
  },
  gu: {
    'optimal': 'તંદુરસ્ત પાક છત્રપટ',
    'vigorous': 'જોમદાર પાક વિકાસ',
    'vigorous canopy health': 'તંદુરસ્ત પાક છત્રપટ',
    'moderate stress': 'મધ્યમ પાક તાણ',
    'moderate canopy stress': 'મધ્યમ પાક તાણ',
    'high canopy stress': 'ઉચ્ચ પાક તાણ',
    'severe stress': 'ગંભીર પાક તાણ',
    'dormant / fallow': 'પડતર / સુષુપ્ત જમીન',
    'fallow': 'પડતર જમીન',
  },
  bn: {
    'optimal': 'সুস্থ ও সতেজ ক্যানোপি',
    'vigorous': 'উচ্চ সতেজতা ও বৃদ্ধি',
    'vigorous canopy health': 'সুস্থ ও সতেজ ক্যানোপি',
    'moderate stress': 'মাঝারি ক্যানোপি চাপ',
    'moderate canopy stress': 'মাঝারি ক্যানোপি চাপ',
    'high canopy stress': 'উচ্চ ক্যানোপি চাপ',
    'severe stress': 'তীব্র ক্যানোপি চাপ',
    'dormant / fallow': 'অনাবাদী / পতিত জমি',
    'fallow': 'পতিত জমি',
  },
  pa: {
    'optimal': 'ਸਿਹਤਮੰਦ ਅਤੇ ਸੰਘਣੀ ਫਸਲ',
    'vigorous': 'ਸ਼ਾਨਦਾਰ ਫਸਲ ਵਾਧਾ',
    'vigorous canopy health': 'ਸਿਹਤਮੰਦ ਅਤੇ ਸੰਘਣੀ ਫਸਲ',
    'moderate stress': 'ਦਰਮਿਆਨਾ ਫਸਲ ਤਣਾਅ',
    'moderate canopy stress': 'ਦਰਮਿਆਨਾ ਫਸਲ ਤਣਾਅ',
    'high canopy stress': 'ਉੱਚ ਫਸਲ ਤਣਾਅ',
    'severe stress': 'ਗੰਭੀਰ ਫਸਲ ਤਣਾਅ',
    'dormant / fallow': 'ਪਰਤੀ / ਖਾਲੀ ਜ਼ਮੀਨ',
    'fallow': 'ਖਾਲੀ ਜ਼ਮੀਨ',
  },
  ml: {
    'optimal': 'മികച്ച വിള ആരോഗ്യം',
    'vigorous': 'ആരോഗ്യമുള്ള പച്ചപ്പ്',
    'vigorous canopy health': 'മികച്ച വിള ആരോഗ്യം',
    'moderate stress': 'മിതമായ വിള സമ്മർദ്ദം',
    'moderate canopy stress': 'മിതമായ വിള സമ്മർദ്ദം',
    'high canopy stress': 'കൂടിയ വിള സമ്മർദ്ദം',
    'severe stress': 'തീവ്രമായ വിള സമ്മർദ്ദം',
    'dormant / fallow': 'തരിശുഭൂമി',
    'fallow': 'തരിശുഭൂമി',
  },
  or: {
    'optimal': 'ଉତ୍ତମ ଫସଲ ସବୁଜିମା',
    'vigorous': 'ସୁସ୍ଥ ଫସଲ ବୃଦ୍ଧି',
    'vigorous canopy health': 'ଉତ୍ତମ ଫସଲ ସବୁଜିମା',
    'moderate stress': 'ମଧ୍ୟମ ଫସଲ ଚାପ',
    'moderate canopy stress': 'ମଧ୍ୟମ ଫସଲ ଚାପ',
    'high canopy stress': 'ଅଧିକ ଫସଲ ଚାପ',
    'severe stress': 'ଗୁରୁତର ଫସଲ ଚାପ',
    'dormant / fallow': 'ପଡ଼ିଆ / ବିଶ୍ରାମ ଜମି',
    'fallow': 'ପଡ଼ିଆ ଜମି',
  },
  as: {
    'optimal': 'উন্নত ফচলৰ স্বাস্থ্য',
    'vigorous': 'সতেজ ফচলৰ বৃদ্ধি',
    'vigorous canopy health': 'উন্নত ফচলৰ স্বাস্থ্য',
    'moderate stress': 'মধ্যমীয়া ফচলৰ চাপ',
    'moderate canopy stress': 'মধ্যমীয়া ফচলৰ চাপ',
    'high canopy stress': 'উচ্চ ফচলৰ চাপ',
    'severe stress': 'গুৰুতৰ ফচলৰ চাপ',
    'dormant / fallow': 'পতিত / সুপ্ত ভূমি',
    'fallow': 'পতিত ভূমি',
  },
  ur: {
    'optimal': 'صحت مند اور گھنی فصل',
    'vigorous': 'بہترین فصلی بڑھوتری',
    'vigorous canopy health': 'صحت مند اور گھنی فصل',
    'moderate stress': 'معتدل فصلی تناؤ',
    'moderate canopy stress': 'معتدل فصلی تناؤ',
    'high canopy stress': 'شدید فصلی تناؤ',
    'severe stress': 'انتہائی شدید تناؤ',
    'dormant / fallow': 'غیر کاشت شدہ / پرتی زمین',
    'fallow': 'پرتی زمین',
  },
  es: {
    'optimal': 'Vigor óptimo del dosel',
    'vigorous': 'Crecimiento vigoroso',
    'vigorous canopy health': 'Vigor óptimo del dosel',
    'moderate stress': 'Estrés moderado del dosel',
    'moderate canopy stress': 'Estrés moderado del dosel',
    'high canopy stress': 'Alto estrés del dosel',
    'severe stress': 'Estrés severo',
    'dormant / fallow': 'Inactivo / Barbecho',
    'fallow': 'Barbecho',
  },
  fr: {
    'optimal': 'Vigueur optimale de la canopée',
    'vigorous': 'Croissance vigoureuse',
    'vigorous canopy health': 'Vigueur optimale de la canopée',
    'moderate stress': 'Stress modéré de la canopée',
    'moderate canopy stress': 'Stress modéré de la canopée',
    'high canopy stress': 'Stress élevé de la canopée',
    'severe stress': 'Stress sévère',
    'dormant / fallow': 'En dormance / Jachère',
    'fallow': 'Jachère',
  },
  pt: {
    'optimal': 'Vigor ótimo do dossel',
    'vigorous': 'Crescimento vigoroso',
    'vigorous canopy health': 'Vigor ótimo do dossel',
    'moderate stress': 'Estresse moderado do dossel',
    'moderate canopy stress': 'Estresse moderado do dossel',
    'high canopy stress': 'Alto estresse do dossel',
    'severe stress': 'Estresse severo',
    'dormant / fallow': 'Dormência / Pousio',
    'fallow': 'Pousio',
  },
  ru: {
    'optimal': 'Отличное состояние растительности',
    'vigorous': 'Интенсивный рост покрова',
    'vigorous canopy health': 'Отличное состояние растительности',
    'moderate stress': 'Умеренный стресс растительности',
    'moderate canopy stress': 'Умеренный стресс растительности',
    'high canopy stress': 'Высокий стресс растительности',
    'severe stress': 'Критический стресс',
    'dormant / fallow': 'В состоянии покоя / Пар',
    'fallow': 'Пар',
  },
  ar: {
    'optimal': 'صحة ممتازة للغطاء النباتي',
    'vigorous': 'نمو نباتي قوي',
    'vigorous canopy health': 'صحة ممتازة للغطاء النباتي',
    'moderate stress': 'إجهاد معتدل للغطاء النباتي',
    'moderate canopy stress': 'إجهاد معتدل للغطاء النباتي',
    'high canopy stress': 'إجهاد عالي للغطاء النباتي',
    'severe stress': 'إجهاد شديد',
    'dormant / fallow': 'أرض بوار / غير مزروعة',
    'fallow': 'أرض بوار',
  },
  zh: {
    'optimal': '冠层长势茂盛良好',
    'vigorous': '生长健壮旺盛',
    'vigorous canopy health': '冠层长势茂盛良好',
    'moderate stress': '中度冠层胁迫',
    'moderate canopy stress': '中度冠层胁迫',
    'high canopy stress': '严重冠层胁迫',
    'severe stress': '重度胁迫',
    'dormant / fallow': '休眠 / 休耕',
    'fallow': '休耕',
  },
};

export function localizeCanopyStatus(status: string | undefined | null, lang: Language): string {
  if (!status) return '';
  const norm = normalizeLang(lang);
  if (norm === 'en') {
    if (status.toLowerCase() === 'optimal') return 'Vigorous Canopy Health';
    return status;
  }

  const dict = CANOPY_STATUS_MAP[norm];
  if (dict) {
    const key = status.trim().toLowerCase();
    if (dict[key]) return dict[key];
    for (const [k, v] of Object.entries(dict)) {
      if (key.includes(k) || k.includes(key)) return v;
    }
  }

  return status;
}

// -------------------------------------------------------------
// 2. ISRO Bhuvan Land Use / Land Cover Categories
// -------------------------------------------------------------
export const LAND_USE_MAP: Record<string, Record<string, string>> = {
  te: {
    'double-cropped irrigated agricultural land': 'రెండు పంటల సాగు భూమి',
    'single-cropped rainfed agricultural land': 'వర్షాధార ఏక పంట భూమి',
    'kharif & rabi agricultural land': 'ఖరీఫ్ & రబీ వ్యవసాయ భూమి',
    'intensive cropping zone': 'సాంద్ర పంటల సాగు మండలం',
    'plantation / horticultural land': 'తోటల / ఉద్యానవన భూమి',
    'fallow land': 'బీడు భూమి',
    'agricultural land': 'వ్యవసాయ భూమి',
    'cropland': 'పంట సాగు భూమి',
    'unresolved': 'విశ్లేషించబడుతోంది',
    'n/a': 'లభ్యం కాలేదు',
  },
  hi: {
    'double-cropped irrigated agricultural land': 'दोहरी फसल सिंचित कृषि भूमि',
    'single-cropped rainfed agricultural land': 'एकल फसल वर्षा आधारित भूमि',
    'kharif & rabi agricultural land': 'खरीफ एवं रबी कृषि भूमि',
    'intensive cropping zone': 'सघन कृषि फसल क्षेत्र',
    'plantation / horticultural land': 'बागवानी / उद्यानिकी भूमि',
    'fallow land': 'परती भूमि',
    'agricultural land': 'कृषि भूमि',
    'cropland': 'फसली भूमि',
    'unresolved': 'विश्लेषणाधीन',
    'n/a': 'अनुपलब्ध',
  },
  ta: {
    'double-cropped irrigated agricultural land': 'இருபோக பாசன வேளாண் நிலம்',
    'single-cropped rainfed agricultural land': 'மானாவாரி ஒருபோக நிலம்',
    'kharif & rabi agricultural land': 'காரிஃப் & ரபி பயிர் நிலம்',
    'intensive cropping zone': 'தீவிர பயிர் சாகுபடி மண்டலம்',
    'plantation / horticultural land': 'தோட்டக்கலை பயிர் நிலம்',
    'fallow land': 'தரிசு நிலம்',
    'agricultural land': 'விவசாய நிலம்',
    'cropland': 'பயிர் நிலம்',
    'unresolved': 'பரிசீலனையில்',
    'n/a': 'கிடைக்கவில்லை',
  },
  kn: {
    'double-cropped irrigated agricultural land': 'ದ್ವಿಬೆಳೆ ನೀರಾವರಿ ಕೃಷಿ ಭೂಮಿ',
    'single-cropped rainfed agricultural land': 'ಮಳೆಯಾಶ್ರಿತ ಏಕಬೆಳೆ ಭೂಮಿ',
    'kharif & rabi agricultural land': 'ಖಾರೀಫ್ ಮತ್ತು ರಬಿ ಕೃಷಿ ಭೂಮಿ',
    'intensive cropping zone': 'ಸಾಂದ್ರ ಬೆಳೆ ವಲಯ',
    'plantation / horticultural land': 'ತೋಟಗಾರಿಕೆ ಕೃಷಿ ಭೂಮಿ',
    'fallow land': 'ಪಾಳು ಭೂಮಿ',
    'agricultural land': 'ಕೃಷಿ ಭೂಮಿ',
    'cropland': 'ಬೆಳೆ ಭೂಮಿ',
    'unresolved': 'ಪರಿಶೀಲನೆಯಲ್ಲಿದೆ',
    'n/a': 'ಲಭ್ಯವಿಲ್ಲ',
  },
  mr: {
    'double-cropped irrigated agricultural land': 'दुबार बागायती शेती जमीन',
    'single-cropped rainfed agricultural land': 'जिरायती एकपीक शेती जमीन',
    'kharif & rabi agricultural land': 'खरीप व रब्बी शेतजमीन',
    'intensive cropping zone': 'सघन पीक लागवड क्षेत्र',
    'plantation / horticultural land': 'बागायत / फलोत्पादन जमीन',
    'fallow land': 'पडीक जमीन',
    'agricultural land': 'शेतजमीन',
    'cropland': 'पीक क्षेत्र',
    'unresolved': 'प्रक्रियेत',
    'n/a': 'उपलब्ध नाही',
  },
  gu: {
    'double-cropped irrigated agricultural land': 'બેવડી પિયત ખેતીની જમીન',
    'single-cropped rainfed agricultural land': 'વરસાદ આધારિત એક પાકની જમીન',
    'kharif & rabi agricultural land': 'ખરીફ અને રવિ ખેત જમીન',
    'intensive cropping zone': 'સઘન પાક વિસ્તાર',
    'plantation / horticultural land': 'બાગાયતી ખેતી જમીન',
    'fallow land': 'પડતર જમીન',
    'agricultural land': 'ખેતીની જમીન',
    'cropland': 'પાકની જમીન',
    'unresolved': 'વિશ્લેષણાધીન',
    'n/a': 'અનુપલબ્ધ',
  },
  bn: {
    'double-cropped irrigated agricultural land': 'দোফসলা সেচযুক্ত কৃষি জমি',
    'single-cropped rainfed agricultural land': 'একফসলা বৃষ্টি-নির্ভর জমি',
    'kharif & rabi agricultural land': 'খরিফ ও রবি কৃষি জমি',
    'intensive cropping zone': 'নিবিড় ফসল অঞ্চল',
    'plantation / horticultural land': 'উদ্যানপালন / বাগান জমি',
    'fallow land': 'পতিত জমি',
    'agricultural land': 'কৃষি জমি',
    'cropland': 'ফসল জমি',
    'unresolved': 'প্রক্রিয়াধীন',
    'n/a': 'অনুপলব্ধ',
  },
  pa: {
    'double-cropped irrigated agricultural land': 'ਦੋਹਰੀ ਫਸਲੀ ਸਿੰਚਾਈ ਵਾਲੀ ਜ਼ਮੀਨ',
    'single-cropped rainfed agricultural land': 'ਬਾਰਾਨੀ ਇਕਹਰੀ ਫਸਲ ਵਾਲੀ ਜ਼ਮੀਨ',
    'kharif & rabi agricultural land': 'ਖਰੀਫ ਅਤੇ ਰਬੀ ਖੇਤੀ ਜ਼ਮੀਨ',
    'intensive cropping zone': 'ਸੰਘਣਾ ਫਸਲੀ ਖੇਤਰ',
    'plantation / horticultural land': 'ਬਾਗਬਾਨੀ ਵਾਲੀ ਜ਼ਮੀਨ',
    'fallow land': 'ਖਾਲੀ ਜ਼ਮੀਨ',
    'agricultural land': 'ਖੇਤੀਬਾੜੀ ਜ਼ਮੀਨ',
    'cropland': 'ਫਸਲੀ ਜ਼ਮੀਨ',
    'unresolved': 'ਜਾਰੀ ਹੈ',
    'n/a': 'ਉਪਲਬਧ ਨਹੀਂ',
  },
  ml: {
    'double-cropped irrigated agricultural land': 'ഇരുവിള ജലസേചന കൃഷിഭൂമി',
    'single-cropped rainfed agricultural land': 'മഴയെ ആശ്രയിച്ചുള്ള ഏകവിള ഭൂമി',
    'kharif & rabi agricultural land': 'ഖാരിഫ് & റാബി കൃഷിഭൂമി',
    'intensive cropping zone': 'തീവ്ര കൃഷി മേഖല',
    'plantation / horticultural land': 'തോട്ടവിള കൃഷിഭൂമി',
    'fallow land': 'തരിശുഭൂമി',
    'agricultural land': 'കൃഷിഭൂമി',
    'cropland': 'വിളഭൂമി',
    'unresolved': 'നിരീക്ഷണത്തിൽ',
    'n/a': 'ലഭ്യമല്ല',
  },
  or: {
    'double-cropped irrigated agricultural land': 'ଦ୍ୱି-ଫସଲୀ ଜଳସେଚିତ କୃଷି ଜମି',
    'single-cropped rainfed agricultural land': 'ବୃଷ୍ଟିପୁଷ୍ଟ ଏକ-ଫସଲୀ ଜମି',
    'kharif & rabi agricultural land': 'ଖରିଫ ଓ ରବି କୃଷି ଜମି',
    'intensive cropping zone': 'ସଘନ ଫସଲ ମଣ୍ଡଳ',
    'plantation / horticultural land': 'ଉଦ୍ୟାନ କୃଷି ଜମି',
    'fallow land': 'ପଡ଼ିଆ ଜମି',
    'agricultural land': 'କୃଷି ଜମି',
    'cropland': 'ଫସଲ ଜମି',
    'unresolved': 'ପ୍ରକ୍ରିୟାଧୀନ',
    'n/a': 'ଅନୁପଲବ୍ଧ',
  },
  as: {
    'double-cropped irrigated agricultural land': 'দ্বি-ফচলীয় জলসিঞ্চিত কৃষি ভূমি',
    'single-cropped rainfed agricultural land': 'বৰষুণ-নিৰ্ভৰশীল এক-ফচলীয় ভূমি',
    'kharif & rabi agricultural land': 'খাৰিফ আৰু ৰবি কৃষি ভূমি',
    'intensive cropping zone': 'ঘন শস্য মণ্ডল',
    'plantation / horticultural land': 'উদ্যান শস্যৰ ভূমি',
    'fallow land': 'পতিত ভূমি',
    'agricultural land': 'কৃষি ভূমি',
    'cropland': 'শস্য ভূমি',
    'unresolved': 'প্ৰক্ৰিয়াধীন',
    'n/a': 'অনুপলব্ধ',
  },
  ur: {
    'double-cropped irrigated agricultural land': 'دو فصلی سیراب زرعی زمین',
    'single-cropped rainfed agricultural land': 'بارانی یک فصلی زمین',
    'kharif & rabi agricultural land': 'خریف اور ربیع زرعی اراضی',
    'intensive cropping zone': 'گھنا فصلی زون',
    'plantation / horticultural land': 'باغبانی و باغات کی اراضی',
    'fallow land': 'پرتی اراضی',
    'agricultural land': 'زرعی زمین',
    'cropland': 'کاشت کاری زمین',
    'unresolved': 'زیر عمل',
    'n/a': 'دستیاب نہیں',
  },
  es: {
    'double-cropped irrigated agricultural land': 'Tierra agrícola de doble cultivo bajo riego',
    'single-cropped rainfed agricultural land': 'Tierra de secano de cultivo único',
    'kharif & rabi agricultural land': 'Tierra agrícola Kharif y Rabi',
    'intensive cropping zone': 'Zona de cultivo intensivo',
    'plantation / horticultural land': 'Plantación y tierra hortícola',
    'fallow land': 'Tierra en barbecho',
    'agricultural land': 'Tierra agrícola',
    'cropland': 'Tierra de cultivo',
    'unresolved': 'En resolución',
    'n/a': 'No disponible',
  },
  fr: {
    'double-cropped irrigated agricultural land': 'Terre irriguée à double récolte',
    'single-cropped rainfed agricultural land': 'Terre pluviale à récolte unique',
    'kharif & rabi agricultural land': 'Terre agricole Kharif & Rabi',
    'intensive cropping zone': 'Zone de culture intensive',
    'plantation / horticultural land': 'Plantation et horticulture',
    'fallow land': 'Terre en jachère',
    'agricultural land': 'Terre agricole',
    'cropland': 'Terre cultivée',
    'unresolved': 'En traitement',
    'n/a': 'Indisponible',
  },
  pt: {
    'double-cropped irrigated agricultural land': 'Área irrigada de safra dupla',
    'single-cropped rainfed agricultural land': 'Área de sequeiro de safra única',
    'kharif & rabi agricultural land': 'Terra agrícola Kharif & Rabi',
    'intensive cropping zone': 'Zona de cultivo intensivo',
    'plantation / horticultural land': 'Plantação e horticultura',
    'fallow land': 'Terra em pousio',
    'agricultural land': 'Terra agrícola',
    'cropland': 'Terra cultivável',
    'unresolved': 'Em resolução',
    'n/a': 'Indisponível',
  },
  ru: {
    'double-cropped irrigated agricultural land': 'Орошаемые земли с двукратным севооборотом',
    'single-cropped rainfed agricultural land': 'Богарные земли с однократным севом',
    'kharif & rabi agricultural land': 'Сельхозугодья Хариф и Раби',
    'intensive cropping zone': 'Зона интенсивного земледелия',
    'plantation / horticultural land': 'Плантации и садоводство',
    'fallow land': 'Паровые земли',
    'agricultural land': 'Сельхозугодья',
    'cropland': 'Пахотные земли',
    'unresolved': 'Обрабатывается',
    'n/a': 'Н/Д',
  },
  ar: {
    'double-cropped irrigated agricultural land': 'أراضٍ مروية مزدوجة المحصول',
    'single-cropped rainfed agricultural land': 'أراضٍ مطرية بمحصول واحد',
    'kharif & rabi agricultural land': 'أراضٍ زراعية خريفية وربيعية',
    'intensive cropping zone': 'منطقة زراعة مكثفة',
    'plantation / horticultural land': 'مزارع وبساتين',
    'fallow land': 'أراضٍ بوار',
    'agricultural land': 'أراضٍ زراعية',
    'cropland': 'أراضٍ مزروعة',
    'unresolved': 'قيد المعالجة',
    'n/a': 'غير متاح',
  },
  zh: {
    'double-cropped irrigated agricultural land': '双季灌溉农田',
    'single-cropped rainfed agricultural land': '单季雨养农田',
    'kharif & rabi agricultural land': '秋收与春收农作区',
    'intensive cropping zone': '集约化密集种植区',
    'plantation / horticultural land': '种植园与园艺用地',
    'fallow land': '休耕闲置农地',
    'agricultural land': '农业用地',
    'cropland': '耕地',
    'unresolved': '正在解析',
    'n/a': '暂无数据',
  },
};

export function localizeLandUse(category: string | undefined | null, lang: Language): string {
  if (!category) return '';
  const norm = normalizeLang(lang);
  if (norm === 'en') return category;

  const dict = LAND_USE_MAP[norm];
  if (dict) {
    const key = category.trim().toLowerCase();
    if (dict[key]) return dict[key];
    for (const [k, v] of Object.entries(dict)) {
      if (key.includes(k) || k.includes(key)) return v;
    }
  }

  return category;
}

// -------------------------------------------------------------
// 3. Agro-Climatic Zones
// -------------------------------------------------------------
export const AGRO_ZONE_MAP: Record<string, Record<string, string>> = {
  te: {
    'zone vi - trans-gangetic plains': 'మండలం 6 - ట్రాన్స్-గంగా మైదానాలు',
    'trans-gangetic plains': 'ట్రాన్స్-గంగా మైదాన ప్రాంతం',
    'southern plateau and hills': 'దక్షిణ పీఠభూమి మరియు కొండల ప్రాంతం',
    'eastern plateau and hills': 'తూర్పు పీఠభూమి మరియు కొండల ప్రాంతం',
    'western plateau and hills': 'పశ్చిమ పీఠభూమి మరియు కొండల ప్రాంతం',
    'central plateau and hills': 'మధ్య పీఠభూమి ప్రాంతం',
    'east coast plains and hills': 'తూర్పు తీర మైదానాలు',
    'west coast plains and ghats': 'పశ్చిమ తీర మైదానాలు మరియు ఘాట్స్',
    'gujarat plains and hills': 'గుజరాత్ మైదానాలు మరియు కొండలు',
    'western dry region': 'పశ్చిమ శుష్క ప్రాంతం',
    'n/a (international)': 'అంతర్జాతీయ భూభాగం',
  },
  hi: {
    'zone vi - trans-gangetic plains': 'जोन 6 - ट्रांस-गंगा मैदान',
    'trans-gangetic plains': 'ट्रांस-गंगा मैदानी क्षेत्र',
    'southern plateau and hills': 'दक्षिणी पठार एवं पहाड़ी क्षेत्र',
    'eastern plateau and hills': 'पूर्वी पठार एवं पहाड़ी क्षेत्र',
    'western plateau and hills': 'पश्चिमी पठार एवं पहाड़ी क्षेत्र',
    'central plateau and hills': 'मध्य पठार एवं पहाड़ी क्षेत्र',
    'east coast plains and hills': 'पूर्वी तटीय मैदान',
    'west coast plains and ghats': 'पश्चिमी तटीय मैदान एवं घाट',
    'gujarat plains and hills': 'गुजरात मैदान एवं पहाड़ियाँ',
    'western dry region': 'पश्चिमी शुष्क क्षेत्र',
    'n/a (international)': 'अंतर्राष्ट्रीय क्षेत्र',
  },
  ta: {
    'zone vi - trans-gangetic plains': 'மண்டலம் 6 - கங்கை சமவெளி பகுதி',
    'southern plateau and hills': 'தென் பீடபூமி மற்றும் மலைப்பகுதி',
    'eastern plateau and hills': 'கிழக்கு பீடபூமி பகுதி',
    'western plateau and hills': 'மேற்கு பீடபூமி பகுதி',
    'east coast plains and hills': 'கிழக்கு கடற்கரை சமவெளி',
    'west coast plains and ghats': 'மேற்கு கடற்கரை சமவெளி மற்றும் தொடர்ச்சி மலை',
    'n/a (international)': 'சர்வதேச பகுதி',
  },
  kn: {
    'zone vi - trans-gangetic plains': 'ವಲಯ 6 - ಗಂಗಾ ಬಯಲು ಪ್ರದೇಶ',
    'southern plateau and hills': 'ದಕ್ಷಿಣ ಪ್ರಸ್ಥಭೂಮಿ ಮತ್ತು ಬೆಟ್ಟ ಪ್ರದೇಶ',
    'eastern plateau and hills': 'ಪೂರ್ವ ಪ್ರಸ್ಥಭೂಮಿ ಪ್ರದೇಶ',
    'western plateau and hills': 'ಪಶ್ಚಿಮ ಪ್ರಸ್ಥಭೂಮಿ ಪ್ರದೇಶ',
    'east coast plains and hills': 'ಪೂರ್ವ ಕರಾವಳಿ ಬಯಲು',
    'west coast plains and ghats': 'ಪಶ್ಚಿಮ ಕರಾವಳಿ ಬಯಲು ಮತ್ತು ಘಟ್ಟಗಳು',
    'n/a (international)': 'ಅಂತರರಾಷ್ಟ್ರೀಯ ಪ್ರದೇಶ',
  },
  mr: {
    'zone vi - trans-gangetic plains': 'विभाग ६ - गंगा मैदानी प्रदेश',
    'southern plateau and hills': 'दक्षिण पठार व डोंगरी प्रदेश',
    'western plateau and hills': 'पश्चिम पठारी प्रदेश',
    'central plateau and hills': 'मध्य पठारी प्रदेश',
    'west coast plains and ghats': 'पश्चिम किनारपट्टी व घाट प्रदेश',
    'n/a (international)': 'आंतरराष्ट्रीय क्षेत्र',
  },
  gu: {
    'zone vi - trans-gangetic plains': 'ઝોન 6 - ગંગા મેદાની પ્રદેશ',
    'gujarat plains and hills': 'ગુજરાત મેદાનો અને ટેકરીઓ',
    'western dry region': 'પશ્ચિમ સૂકો પ્રદેશ',
    'n/a (international)': 'આંતરરાષ્ટ્રીય પ્રદેશ',
  },
  bn: {
    'zone vi - trans-gangetic plains': 'অঞ্চল ৬ - গাঙ্গেয় সমভূমি',
    'eastern plateau and hills': 'পূর্ব মালভূমি ও পার্বত্য অঞ্চল',
    'lower gangetic plains': 'নিম্ন গাঙ্গেয় সমভূমি অঞ্চল',
    'n/a (international)': 'আন্তর্জাতিক অঞ্চল',
  },
  pa: {
    'zone vi - trans-gangetic plains': 'ਜ਼ੋਨ 6 - ਟਰਾਂਸ-ਗੰਗਾ ਮੈਦਾਨ',
    'n/a (international)': 'ਅੰਤਰਰਾਸ਼ਟਰੀ ਖੇਤਰ',
  },
};

export function localizeAgroClimaticZone(zone: string | undefined | null, lang: Language): string {
  if (!zone) return '';
  const norm = normalizeLang(lang);
  if (norm === 'en') return zone;

  const dict = AGRO_ZONE_MAP[norm];
  if (dict) {
    const key = zone.trim().toLowerCase();
    if (dict[key]) return dict[key];
    for (const [k, v] of Object.entries(dict)) {
      if (key.includes(k) || k.includes(key)) return v;
    }
  }

  return zone;
}

// -------------------------------------------------------------
// 4. Data Provenance Badges Localization
// -------------------------------------------------------------
export const PROVENANCE_LABELS: Record<string, Record<string, string>> = {
  earth_engine: {
    en: 'Google Earth Engine — satellite-derived',
    te: 'గూగుల్ ఎర్త్ ఇంజిన్ — ఉపగ్రహ డేటా',
    hi: 'गूगल अर्थ इंजन — उपग्रह आधारित',
    ta: 'கூகிள் எர்த் எஞ்சின் — செயற்கைக்கோள் தரவு',
    kn: 'ಗೂಗಲ್ ಅರ್ಥ್ ಎಂಜಿನ್ — ಉಪಗ್ರಹ ಆಧಾರಿತ',
    ml: 'ഗൂഗിൾ എർത്ത് എഞ്ചിൻ — ഉപഗ്രഹ ഡാറ്റ',
    mr: 'गुगल अर्थ इंजिन — उपग्रह आधारित',
    gu: 'ગુગલ અર્થ એન્જિન — ઉપગ્રહ આધારિત',
    bn: 'গুগল আর্থ ইঞ্জিন — উপগ্রহ ভিত্তিক',
    pa: 'ਗੂਗਲ ਅਰਥ ਇੰਜਨ — ਉਪਗ੍ਰਹਿ ਅਧਾਰਤ',
    or: 'ଗୁଗଲ ଆର୍ଥ ଇଞ୍ଜିନ — ଉପଗ୍ରହ ଆଧାରିତ',
    as: 'গুগল আৰ্থ ইঞ্জিন — উপগ্ৰহ ভিত্তিক',
    ur: 'گوگل ارتھ انجن — سیٹلائٹ ماخوذ',
    es: 'Google Earth Engine — satelital',
    fr: 'Google Earth Engine — données satellite',
    pt: 'Google Earth Engine — satélite',
    ru: 'Google Earth Engine — спутниковые данные',
    ar: 'جوجل إيرث إنجين — بيانات الأقمار الصناعية',
    zh: '谷歌地球引擎 — 卫星遥感',
  },
  isro_bhuvan: {
    en: 'ISRO / NRSC / Bhuvan — India geospatial data',
    te: 'ఇస్రో / NRSC / భువన్ — భారత భూభాగ డేటా',
    hi: 'इसरो / NRSC / भुवन — भारत भू-स्थानिक डेटा',
    ta: 'இஸ்ரோ / NRSC / புவன் — இந்திய நிலப்பரப்பு தரவு',
    kn: 'ಇಸ್ರೋ / NRSC / ಭುವನ್ — ಭಾರತದ ಭೂಸ್ಥಳೀಯ ಡೇಟಾ',
    ml: 'ഐ.എസ്.ആർ.ഒ / ഭുവൻ — ഭൗമ ഡാറ്റ',
    mr: 'इस्रो / NRSC / भुवन — भारत भू-स्थानिक डेटा',
    gu: 'ઇસરો / NRSC / ભુવન — ભારત ભૌગોલિક ડેટા',
    bn: 'ইসরো / NRSC / ভুবন — ভারত ভূ-স্থানিক ডেটা',
    pa: 'ਇਸਰੋ / NRSC / ਭੁਵਨ — ਭਾਰਤੀ ਭੂ-ਸਥਾਨਕ ਡਾਟਾ',
    or: 'ଇସ୍ରୋ / NRSC / ଭୁବନ — ଭୌଗୋଳିକ ଡାଟା',
    as: 'ইছৰো / NRSC / ভুৱন — ভাৰত ভূ-স্থানিক তথ্য',
    ur: 'اسرو / بھون — ہندوستانی جغرافیائی ڈیٹا',
    es: 'ISRO / Bhuvan — datos geoespaciales',
    fr: 'ISRO / Bhuvan — données géospatiales',
    pt: 'ISRO / Bhuvan — dados geoespaciais',
    ru: 'ISRO / Bhuvan — геоданные Индии',
    ar: 'إسرو / بهوفان — البيانات الجغرافية',
    zh: 'ISRO / Bhuvan — 印度地理空间数据',
  },
  faostat: {
    en: 'FAOSTAT — agricultural statistics',
    te: 'FAOSTAT — వ్యవసాయ గణాంకాలు',
    hi: 'FAOSTAT — कृषि सांख्यिकी',
    ta: 'FAOSTAT — வேளாண் புள்ளிவிவரங்கள்',
    kn: 'FAOSTAT — ಕೃಷಿ ಅಂಕಿಅಂಶಗಳು',
    ml: 'FAOSTAT — കാർഷിക സ്ഥിതിവിവരക്കണക്കുകൾ',
    mr: 'FAOSTAT — कृषी आकडेवारी',
    gu: 'FAOSTAT — કૃષિ આંકડાકીય માહિતી',
    bn: 'FAOSTAT — কৃষি পরিসংখ্যান',
    pa: 'FAOSTAT — ਖੇਤੀਬਾੜੀ ਅੰਕੜੇ',
    or: 'FAOSTAT — କୃଷି ପରିସଂଖ୍ୟାନ',
    as: 'FAOSTAT — কৃষি পৰিসংখ্যা',
    ur: 'FAOSTAT — زرعی اعداد و شمار',
    es: 'FAOSTAT — estadísticas agrícolas',
    fr: 'FAOSTAT — statistiques agricoles',
    pt: 'FAOSTAT — estatísticas agrícolas',
    ru: 'FAOSTAT — статистика ФАО ООН',
    ar: 'منظمة الأغذية والزراعة — إحصاءات زراعية',
    zh: 'FAOSTAT — 联合国粮农统计',
  },
  user_soil_test: {
    en: 'User Soil Test — Farm Profile',
    te: 'రైతు నేల పరీక్ష — ఫారం ప్రొఫైల్',
    hi: 'किसान मृदा परीक्षण — फार्म प्रोफ़ाइल',
    ta: 'விவசாயி மண் பரிசோதனை — பண்ணை சுயவிவரம்',
    kn: 'ರೈತರ ಮಣ್ಣು ಪರೀಕ್ಷೆ — ಕೃಷಿ ಪ್ರೊಫೈಲ್',
    ml: 'കർഷക മണ്ണ് പരിശോധന — ഫാം പ്രൊഫൈൽ',
    mr: 'शेतकरी माती परीक्षण — फार्म प्रोफाइल',
    gu: 'ખેડૂત જમીન ચકાસણી — ફાર્મ પ્રોફાઇલ',
    bn: 'কৃষক মৃত্তিকা পরীক্ষা — খামার প্রোফাইল',
    pa: 'ਕਿਸਾਨ ਮਿੱਟੀ ਪਰਖ — ਫਾਰਮ ਪ੍ਰੋਫਾਈਲ',
    or: 'କୃଷକ ମୃତ୍ତିକା ପରୀକ୍ଷା — ଫାର୍ମ ପ୍ରୋଫାଇଲ୍',
    as: 'কৃষক মাটি পৰীক্ষা — ফাৰ্ম প্ৰ\'ফাইল',
    ur: 'کسان مٹی ٹیسٹ — فارم پروفائل',
    es: 'Análisis de suelo del usuario — Perfil',
    fr: 'Test de sol utilisateur — Profil',
    pt: 'Teste de solo do usuário — Perfil',
    ru: 'Анализ почвы пользователя — профиль',
    ar: 'فحص تربة المزارع — ملف المزرعة',
    zh: '用户土壤检测 — 农场档案',
  },
  gemini_ai: {
    en: 'Gemini AI — Reasoning Engine',
    te: 'జెమిని AI — వ్యవసాయ మేధస్సు',
    hi: 'जेमिनी AI — कृषि बुद्धिमत्ता',
    ta: 'ஜெமினி AI — வேளாண் நுண்ணறிவு',
    kn: 'ಜೆಮಿನಿ AI — ಕೃಷಿ ಇಂಟೆಲಿಜೆನ್ಸ್',
    ml: 'ജെമിനി AI — കാർഷിക ഇന്റലിജൻസ്',
    mr: 'जेमिनी AI — कृषी बुद्धिमत्ता',
    gu: 'જેમિની AI — કૃષિ બુદ્ધિમત્તા',
    bn: 'জেমিনি AI — কৃষি বুদ্ধিমত্তা',
    pa: 'ਜੈਮਿਨੀ AI — ਖੇਤੀਬਾੜੀ ਇੰਟੈਲੀਜੈਂਸ',
    or: 'ଜେମିନି AI — କୃଷି ବୁଦ୍ଧିମତ୍ତା',
    as: 'জেমিনী AI — কৃষি বুদ্ধিমত্তা',
    ur: 'جیمنی AI — زرعی ذہانت',
    es: 'Gemini AI — Motor de razonamiento',
    fr: 'Gemini AI — Moteur de raisonnement',
    pt: 'Gemini AI — Motor de raciocínio',
    ru: 'Gemini AI — агроинтеллект',
    ar: 'جيميني AI — محرك الاستنتاج الزراعي',
    zh: '双子座 AI — 农业推理引擎',
  },
  imd_weather: {
    en: 'IMD — Weather Surface Telemetry',
    te: 'IMD — వాతావరణ టెలిమెట్రీ',
    hi: 'IMD — मौसम टेलीमेट्री',
    ta: 'IMD — வானிலை தரவு',
    kn: 'IMD — ಹವಾಮಾನ ಟೆಲಿಮೆಟ್ರಿ',
    ml: 'IMD — കാലാവസ്ഥാ ടെലിമെട്രി',
    mr: 'IMD — हवामान टेलिमेट्री',
    gu: 'IMD — હવામાન ટેલિમેટ્રી',
    bn: 'IMD — আবহাওয়া টেলিমেট্রি',
    pa: 'IMD — ਮੌਸਮ ਟੈਲੀਮੈਟਰੀ',
    or: 'IMD — ପାଣିପାଗ ଟେଲିମେଟ୍ରି',
    as: 'IMD — বতৰ টেলিমেট্ৰি',
    ur: 'IMD — موسمی ٹیلی میٹری',
    es: 'IMD — Telemetría meteorológica',
    fr: 'IMD — Télémétrie météo',
    pt: 'IMD — Telemetria meteorológica',
    ru: 'IMD — метеорологические данные',
    ar: 'الأرصاد الجوية — القياس عن بعد',
    zh: 'IMD — 气象地面遥测',
  },
  india_gov: {
    en: 'India Open Data — Portal',
    te: 'భారత ప్రభుత్వం — ఓపెన్ డేటా పోర్టల్',
    hi: 'भारत सरकार — ओपन डेटा पोर्टल',
    ta: 'இந்திய அரசு — திறந்த தரவு தளம்',
    kn: 'ಭಾರತ ಸರಕಾರ — ಓಪನ್ ಡೇಟಾ ಪೋರ್ಟಲ್',
    ml: 'ഇന്ത്യൻ ഗവൺമെന്റ് — ഓപ്പൺ ഡാറ്റാ പോർട്ടൽ',
    mr: 'भारत सरकार — ओपन डेटा पोर्टल',
    gu: 'ભારત સરકાર — ઓપન ડેટા પોર્ટલ',
    bn: 'ভারত সরকার — উন্মুক্ত ডেটা পোর্টাল',
    pa: 'ਭਾਰਤ ਸਰਕਾਰ — ਓਪਨ ਡਾਟਾ ਪੋਰਟਲ',
    or: 'ଭାରତ ସରକାର — ଓପନ୍ ଡାଟା ପୋର୍ଟାଲ୍',
    as: 'ভাৰত চৰকাৰ — মুক্ত তথ্য প\'ৰ্টেল',
    ur: 'حکومت ہند — اوپن ڈیٹا پورٹل',
    es: 'Portal de datos abiertos de la India',
    fr: 'Portail de données ouvertes de l\'Inde',
    pt: 'Portal de dados abertos da Índia',
    ru: 'Портал открытых данных Индии',
    ar: 'بوابة البيانات المفتوحة للحكومة الهندية',
    zh: '印度政府开放数据门户',
  },
};

export function getLocalizedProvenanceBadgeLabel(
  type: string,
  lang: Language,
  customText?: string
): string {
  if (customText) return customText;
  const norm = normalizeLang(lang);
  const typeMap = PROVENANCE_LABELS[type];
  if (typeMap) {
    return typeMap[norm] || typeMap['en'] || '';
  }
  return '';
}

// -------------------------------------------------------------
// 5. Telemetry Pillar Headers
// -------------------------------------------------------------
export const TELEMETRY_PILLAR_TITLES: Record<string, Record<string, string>> = {
  sentinel2Modis: {
    en: 'Sentinel-2 / MODIS',
    te: 'సెంటినెల్-2 / మోడిస్ (ఉపగ్రహం)',
    hi: 'सेंटिनल-2 / मोडिस (उपग्रह)',
    ta: 'சென்டினல்-2 / மோடிஸ் (செயற்கைக்கோள்)',
    kn: 'ಸೆಂಟಿನೆಲ್-2 / ಮೊಡಿಸ್ (ಉಪಗ್ರಹ)',
    ml: 'സെന്റിനൽ-2 / മോഡിസ് (ഉപഗ്രഹം)',
    mr: 'सेंटिनेल-2 / मोडिस (उपग्रह)',
    gu: 'સેન્ટિનેલ-2 / મોડિસ (સેટેલાઇટ)',
    bn: 'সেন্টিনেল-২ / মোডিস (উপগ্রহ)',
    pa: 'ਸੈਂਟੀਨਲ-2 / ਮੋਡਿਸ (ਉਪਗ੍ਰਹਿ)',
    or: 'ସେଣ୍ଟିନେଲ-୨ / ମୋଡିସ୍ (ଉପଗ୍ରହ)',
    as: 'চেণ্টিনেল-২ / মডিছ (উপগ্ৰহ)',
    ur: 'سینٹینل-2 / موڈیس (سیٹلائٹ)',
    es: 'Sentinel-2 / MODIS (Satélite)',
    fr: 'Sentinel-2 / MODIS (Satellite)',
    pt: 'Sentinel-2 / MODIS (Satélite)',
    ru: 'Sentinel-2 / MODIS (Спутник)',
    ar: 'سينتينيل-2 / موديس (قمر صناعي)',
    zh: '哨兵-2 / MODIS (遥感卫星)',
  },
  nasaSmapGee: {
    en: 'NASA SMAP / GEE',
    te: 'నాసా SMAP / GEE (నేల తేమ)',
    hi: 'नासा SMAP / GEE (मृदा नमी)',
    ta: 'நாசா SMAP / GEE (மண் ஈரப்பதம்)',
    kn: 'ನಾಸಾ SMAP / GEE (ಮಣ್ಣಿನ ತೇವಾಂಶ)',
    ml: 'നാസ SMAP / GEE (മണ്ണിലെ ഈർപ്പം)',
    mr: 'नासा SMAP / GEE (मातीचा ओलावा)',
    gu: 'નાસા SMAP / GEE (જમીનનો ભેજ)',
    bn: 'নাসা SMAP / GEE (মাটির আর্দ্রতা)',
    pa: 'ਨਾਸਾ SMAP / GEE (ਮਿੱਟੀ ਦੀ ਨਮੀ)',
    or: 'ନାସା SMAP / GEE (ମାଟି ଆର୍ଦ୍ରତା)',
    as: 'নাছা SMAP / GEE (মাটিৰ আৰ্দ্ৰতা)',
    ur: 'ناسا SMAP / GEE (مٹی کی نمی)',
    es: 'NASA SMAP / GEE (Humedad)',
    fr: 'NASA SMAP / GEE (Humidité)',
    pt: 'NASA SMAP / GEE (Umidade)',
    ru: 'NASA SMAP / GEE (Влажность почвы)',
    ar: 'ناسا SMAP / GEE (رطوبة التربة)',
    zh: 'NASA SMAP / GEE (土壤水分)',
  },
  isroBhuvan: {
    en: 'ISRO / NRSC Bhuvan',
    te: 'ఇస్రో భువన్ / NRSC (భూభాగం)',
    hi: 'इसरो भुवन / NRSC (भू-स्थानिक)',
    ta: 'இஸ்ரோ புவன் / NRSC (நிலப்பரப்பு)',
    kn: 'ಇಸ್ರೋ ಭುವನ್ / NRSC (ಭೂಸ್ಥಳೀಯ)',
    ml: 'ഐ.എസ്.ആർ.ഒ ഭുവൻ / NRSC (ഭൗമം)',
    mr: 'इस्रो भुवन / NRSC (भू-स्थानिक)',
    gu: 'ઇસરો ભુવન / NRSC (જમીન વર્ગીકરણ)',
    bn: 'ইসরো ভুবন / NRSC (ভূ-স্থানিক)',
    pa: 'ਇਸਰੋ ਭੁਵਨ / NRSC (ਭੂ-ਵਰਗੀਕਰਨ)',
    or: 'ଇସ୍ରୋ ଭୁବନ / NRSC (ଭୌଗୋଳିକ)',
    as: 'ইছৰো ভুৱন / NRSC (ভূ-স্থানিক)',
    ur: 'اسرو بھون / NRSC (جغرافیائی)',
    es: 'ISRO / NRSC Bhuvan (Geoespacial)',
    fr: 'ISRO / NRSC Bhuvan (Géospatial)',
    pt: 'ISRO / NRSC Bhuvan (Geoespacial)',
    ru: 'ISRO / NRSC Bhuvan (Геоданные)',
    ar: 'إسرو بهوفان / NRSC (جغرافي)',
    zh: '印度航天局 普梵 / NRSC (地物分类)',
  },
  openMeteoHighRes: {
    en: 'Open-Meteo High-Res',
    te: 'ఓపెన్-మెటియో వాతావరణం',
    hi: 'ओपन-मेटियो मौसम पूर्वानुमान',
    ta: 'ஓபன்-மெட்டியோ வானிலை',
    kn: 'ಓಪನ್-ಮೆಟಿಯೊ ಹವಾಮಾನ',
    ml: 'ഓപ്പൺ-മെറ്റിയോ കാലാവസ്ഥ',
    mr: 'ओपन-मेटिओ हवामान अंदाज',
    gu: 'ઓપન-મેટિઓ હવામાન આગાહી',
    bn: 'ওপেন-মেটিও আবহাওয়া পূর্বাভাস',
    pa: 'ਓਪਨ-ਮੈਟੀਓ ਮੌਸਮ ਅਨੁਮਾਨ',
    or: 'ଓପନ୍-ମେଟିଓ ପାଣିପାଗ ପୂର୍ବାନୁମାନ',
    as: 'অপেন-মেটিঅ\' বতৰ পূৰ্বানুমান',
    ur: 'اوپن میٹیو موسمی پیشگوئی',
    es: 'Open-Meteo Alta Resolución',
    fr: 'Open-Meteo Haute Résolution',
    pt: 'Open-Meteo Alta Resolução',
    ru: 'Open-Meteo Высокое разрешение',
    ar: 'أوبن ميتيو عالي الدقة',
    zh: 'Open-Meteo 高精度气象',
  },
};

export function localizeTelemetryPillarTitle(
  key: 'sentinel2Modis' | 'nasaSmapGee' | 'isroBhuvan' | 'openMeteoHighRes',
  lang: Language
): string {
  const norm = normalizeLang(lang);
  const pillarMap = TELEMETRY_PILLAR_TITLES[key];
  if (pillarMap) {
    return pillarMap[norm] || pillarMap['en'];
  }
  return '';
}
