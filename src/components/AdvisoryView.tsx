import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Droplets,
  Sprout,
  ShieldAlert,
  Layers,
  Calendar,
  AlertTriangle,
  RefreshCw,
  Copy,
  Check,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
} from 'lucide-react';
import { FarmProfile, AdvisoryResult, Language, SoilReport, WeatherData } from '../types';
import { getTranslation } from '../i18n/translations';
import {
  localizeCountry,
  localizeCrop,
  localizeGrowthStage,
  localizeSoilType,
  localizeIrrigation,
  localizeFarmUnit,
  localizeFarmName,
  formatFarmValue,
  formatFarmLocation,
  normalizeLang,
} from '../i18n/dataTranslations';

import { safeFetchJson } from '../lib/apiUtils';

interface AdvisoryViewProps {
  currentFarm: FarmProfile;
  advisory: AdvisoryResult;
  onUpdateAdvisory: (newAdvisory: AdvisoryResult) => void;
  language: Language;
  soilReport?: SoilReport;
  weather?: WeatherData;
}

export const AdvisoryView: React.FC<AdvisoryViewProps> = ({
  currentFarm,
  advisory,
  onUpdateAdvisory,
  language,
  soilReport,
  weather,
}) => {
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Advisory generator parameters (prefilled from active farm)
  const [crop, setCrop] = useState(currentFarm.crop || '');
  const [location, setLocation] = useState(currentFarm.location || '');
  const [growthStage, setGrowthStage] = useState<string>(currentFarm.growthStage || 'Vegetative');
  const [soilType, setSoilType] = useState(currentFarm.soilType || '');
  const [irrigation, setIrrigation] = useState<string>(currentFarm.irrigationType || 'Drip Irrigation');
  const [farmSize, setFarmSize] = useState(
    currentFarm.farmSize ? `${currentFarm.farmSize} ${currentFarm.farmUnit}` : ''
  );
  const [soilMoisture, setSoilMoisture] = useState('');
  const [recentRainfall, setRecentRainfall] = useState('');
  const [temperature, setTemperature] = useState('');

  const t = getTranslation(language);

  // Helper for localized labels: Clean native term in user's language, falling back to English
  const getLocalizedLabel = (english: string, localizedMap: Record<string, string>) => {
    const norm = normalizeLang(language);
    if (norm === 'en') return english;
    const trans = localizedMap[norm];
    if (trans && trans.trim()) {
      return trans.trim();
    }
    return english;
  };

  const cropTransMap: Record<string, string> = {
    te: 'పంట',
    hi: 'फसल',
    ta: 'பயிர்',
    kn: 'ಬೆಳೆ',
    ml: 'വിള',
    mr: 'पीक',
    gu: 'પાક',
    bn: 'ফসল',
    pa: 'ਫ਼ਸਲ',
    or: 'ଫସଲ',
    as: 'শস্য',
    ur: 'فصل',
    ar: 'المحصول',
    es: 'Cultivo',
    fr: 'Culture',
    pt: 'Cultura',
    ru: 'Культура',
    zh: '作物',
  };

  const locationTransMap: Record<string, string> = {
    te: 'గ్రామం / జిల్లా / ప్రదేశం',
    hi: 'स्थान / खेत का पता',
    ta: 'பண்ணை அமைவிடம்',
    kn: 'ಕೃಷಿ ಸ್ಥಳ',
    ml: 'കൃഷിസ്ഥലം',
    mr: 'शेताचे ठिकाण',
    gu: 'ખેતરનું સ્થાન',
    bn: 'খামারের অবস্থান',
    pa: 'ਖੇਤ ਦਾ ਸਥਾਨ',
    or: 'ଚାଷ ଜମିର ଅବସ୍ଥିତି',
    as: 'পথাৰৰ অৱস্থান',
    ur: 'کھیت کا مقام',
    ar: 'موقع المزرعة',
    es: 'Ubicación de la finca',
    fr: 'Emplacement de la ferme',
    pt: 'Localização da fazenda',
    ru: 'Расположение фермы',
    zh: '农场位置',
  };

  const growthStageTransMap: Record<string, string> = {
    te: 'పెరుగుదల దశ',
    hi: 'वृद्धि अवस्था',
    ta: 'வளர்ச்சி நிலை',
    kn: 'ಬೆಳವಣಿಗೆಯ ಹಂತ',
    ml: 'വളർച്ച ഘട്ടം',
    mr: 'वाढीची अवस्था',
    gu: 'વિકાસનો તબક્કો',
    bn: 'বৃদ্ধির পর্যায়',
    pa: 'ਵਾਧੇ ਦਾ ਪੜਾਅ',
    or: 'ବୃଦ୍ଧି ଅବସ୍ଥା',
    as: 'বৃদ্ধিৰ স্তৰ',
    ur: 'بڑھوتری کا مرحلہ',
    ar: 'مرحلة النمو',
    es: 'Etapa de crecimiento',
    fr: 'Stade de croissance',
    pt: 'Estágio de crescimento',
    ru: 'Стадия роста',
    zh: '生长期',
  };

  const soilTypeTransMap: Record<string, string> = {
    te: 'నేల రకం',
    hi: 'मिट्टी का प्रकार',
    ta: 'மண் வகை',
    kn: 'ಮಣ್ಣಿನ ಪ್ರಕಾರ',
    ml: 'മണ്ണ് തരം',
    mr: 'मातीचा प्रकार',
    gu: 'જમીનનો પ્રકાર',
    bn: 'মাটির ধরন',
    pa: 'ਮਿੱਟੀ ਦੀ ਕਿਸਮ',
    or: 'ମୃତ୍ତିକା ପ୍ରକାର',
    as: 'মাটিৰ প্ৰকাৰ',
    ur: 'مٹی کی قسم',
    ar: 'نوع التربة',
    es: 'Tipo de suelo',
    fr: 'Type de sol',
    pt: 'Tipo de solo',
    ru: 'Тип почвы',
    zh: '土壤类型',
  };

  const soilMoistureTransMap: Record<string, string> = {
    te: 'నేలలో తేమ %',
    hi: 'मिट्टी की नमी %',
    ta: 'மண் ஈரப்பதம் %',
    kn: 'ಮಣ್ಣಿನ ತೇವಾಂಶ %',
    ml: 'മണ്ണിലെ ഈർപ്പം %',
    mr: 'मातीतील ओलावा %',
    gu: 'જમીનનો ભેજ %',
    bn: 'মাটির আর্দ্রতা %',
    pa: 'ਮਿੱਟੀ ਵਿੱਚ ਨਮੀ %',
    or: 'ମାଟିରେ ଆର୍ଦ୍ରତା %',
    as: 'মাটিৰ আৰ্দ্ৰতা %',
    ur: 'مٹی کی نمی %',
    ar: 'رطوبة التربة ٪',
    es: 'Humedad del suelo %',
    fr: 'Humidité du sol %',
    pt: 'Umidade do solo %',
    ru: 'Влажность почвы %',
    zh: '土壤湿度 %',
  };

  const recentRainfallTransMap: Record<string, string> = {
    te: 'ఇటీవలి వర్షపాతం',
    hi: 'हालिया वर्षा',
    ta: 'சமீபத்திய மழை',
    kn: 'ಇತ್ತೀಚಿನ ಮಳೆ',
    ml: 'സമീപകാല മഴ',
    mr: 'अलीकडील पाऊस',
    gu: 'તાજેતરનો વરસાદ',
    bn: 'সাম্প্রতিক বৃষ্টিপাত',
    pa: 'ਤਾਜ਼ਾ ਬਾਰਿਸ਼',
    or: 'ସମ୍ପ୍ରତି ବର୍ଷା',
    as: 'শেহতীয়া বৰষুণ',
    ur: 'حالیہ بارش',
    ar: 'هطول الأمطار الأخير',
    es: 'Lluvia reciente',
    fr: 'Précipitations récentes',
    pt: 'Chuva recente',
    ru: 'Недавние осадки',
    zh: '近期降雨量',
  };

  const temperatureTransMap: Record<string, string> = {
    te: 'ఉష్ణోగ్రత',
    hi: 'तापमान',
    ta: 'வெப்பநிலை',
    kn: 'ತಾಪಮಾನ',
    ml: 'താപനില',
    mr: 'तापमान',
    gu: 'તાપમાન',
    bn: 'তাপমাত্রা',
    pa: 'ਤਾਪਮਾਨ',
    or: 'ତାପମାତ୍ରା',
    as: 'তাপমাত্ৰা',
    ur: 'درجہ حرارت',
    ar: 'درجة الحرارة',
    es: 'Temperatura',
    fr: 'Température',
    pt: 'Temperatura',
    ru: 'Температура',
    zh: '温度',
  };

  const irrigationTransMap: Record<string, string> = {
    te: 'నీటిపారుదల రకం',
    hi: 'सिंचाई प्रणाली',
    ta: 'பாசன முறை',
    kn: 'ನೀರಾವರಿ ವ್ಯವಸ್ಥೆ',
    ml: 'ജലസേചന രീതി',
    mr: 'सिंचन पद्धत',
    gu: 'પિયત પદ્ધતિ',
    bn: 'সেচ ব্যবস্থা',
    pa: 'ਸਿੰਚਾਈ ਪ੍ਰਣਾਲੀ',
    or: 'ଜଳସେଚନ ପଦ୍ଧତି',
    as: 'জলসিঞ্চন ব্যৱস্থা',
    ur: 'آبپاشی کا نظام',
    ar: 'نظام الري',
    es: 'Tipo de riego',
    fr: 'Système d’irrigation',
    pt: 'Sistema de irrigação',
    ru: 'Тип орошения',
    zh: '灌溉方式',
  };

  const farmSizeTransMap: Record<string, string> = {
    te: 'పొలం విస్తీర్ణం',
    hi: 'खेत का आकार',
    ta: 'பண்ணை அளவு',
    kn: 'ಜಮೀನಿನ ವಿಸ್ತೀರ್ಣ',
    ml: 'കൃഷിയിടത്തിന്റെ വിസ്തൃതി',
    mr: 'शेताचा आकार',
    gu: 'ખેતરનું કદ',
    bn: 'খামারের আকার',
    pa: 'ਖੇਤ ਦਾ ਆਕਾਰ',
    or: 'ଚାଷ ଜମିର ଆକାର',
    as: 'পথাৰৰ আকাৰ',
    ur: 'کھیت کا سائز',
    ar: 'مساحة المزرعة',
    es: 'Tamaño de la finca',
    fr: 'Taille de la ferme',
    pt: 'Tamanho da fazenda',
    ru: 'Размер фермы',
    zh: '农场面积',
  };

  const cropLabel = getLocalizedLabel('Primary Crop', cropTransMap);
  const locationLabel = getLocalizedLabel('Farm Location', locationTransMap);
  const growthStageLabel = getLocalizedLabel('Growth Stage', growthStageTransMap);
  const soilTypeLabel = getLocalizedLabel('Soil Type', soilTypeTransMap);
  const soilMoistureLabel = getLocalizedLabel('Soil Moisture', soilMoistureTransMap);
  const recentRainfallLabel = getLocalizedLabel('Recent Rainfall', recentRainfallTransMap);
  const temperatureLabel = getLocalizedLabel('Temperature', temperatureTransMap);
  const irrigationLabel = getLocalizedLabel('Irrigation Type', irrigationTransMap);
  const farmSizeLabel = getLocalizedLabel('Farm Size', farmSizeTransMap);

  useEffect(() => {
    setCrop(
      currentFarm.crop
        ? formatFarmValue(currentFarm.crop, language, localizeCrop)
        : ''
    );
    setLocation(
      currentFarm.location
        ? formatFarmLocation(
            currentFarm.location,
            currentFarm.stateRegion || currentFarm.state,
            language
          )
        : currentFarm.district
        ? formatFarmLocation(
            currentFarm.district,
            currentFarm.stateRegion || currentFarm.state,
            language
          )
        : ''
    );
    setGrowthStage(
      currentFarm.growthStage
        ? formatFarmValue(currentFarm.growthStage, language, localizeGrowthStage)
        : 'Vegetative'
    );
    setSoilType(
      currentFarm.soilType
        ? formatFarmValue(currentFarm.soilType, language, localizeSoilType)
        : ''
    );
    setIrrigation(
      currentFarm.irrigationType
        ? formatFarmValue(currentFarm.irrigationType, language, localizeIrrigation)
        : 'Drip Irrigation'
    );
    setFarmSize(
      currentFarm.farmSize
        ? `${currentFarm.farmSize} ${formatFarmValue(currentFarm.farmUnit || 'Acres', language, localizeFarmUnit)}`
        : ''
    );

    // Sync Soil Moisture
    if (soilReport && soilReport.soilMoisture !== undefined && soilReport.soilMoisture !== null) {
      setSoilMoisture(`${soilReport.soilMoisture}%`);
    } else {
      const unavail = formatFarmValue('Unavailable', language, (v, l) => {
        const norm = normalizeLang(l);
        if (norm === 'te') return 'లభ్యం కాలేదు';
        if (norm === 'hi') return 'अनुपलब्ध';
        return v;
      });
      setSoilMoisture(unavail);
    }

    // Sync Recent Rainfall
    if (weather && weather.rainfallMm !== undefined && weather.rainfallMm !== null) {
      setRecentRainfall(`${weather.rainfallMm} mm`);
    } else if (weather && weather.rainfall && weather.rainfall.trim() !== '') {
      setRecentRainfall(weather.rainfall);
    } else {
      const unavail = formatFarmValue('Unavailable', language, (v, l) => {
        const norm = normalizeLang(l);
        if (norm === 'te') return 'లభ్యం కాలేదు';
        if (norm === 'hi') return 'अनुपलब्ध';
        return v;
      });
      setRecentRainfall(unavail);
    }

    // Sync Temperature
    if (weather && weather.temperature && weather.temperature.trim() !== '') {
      setTemperature(weather.temperature);
    } else {
      setTemperature('28°C');
    }
  }, [currentFarm, soilReport, weather, language]);

  const handleGenerateAdvisory = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const data = await safeFetchJson('/api/advisory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location: location || currentFarm.location,
          crop: crop || currentFarm.crop,
          growthStage: growthStage || currentFarm.growthStage,
          soilType: soilType || currentFarm.soilType,
          soilMoisture,
          recentRainfall,
          temperature,
          irrigation: irrigation || currentFarm.irrigationType,
          farmSize: farmSize || `${currentFarm.farmSize} ${currentFarm.farmUnit}`,
          country: currentFarm.country,
          language,
        }),
      });
      onUpdateAdvisory({
        id: `adv-${Date.now()}`,
        summary: data.summary,
        todayAction: data.todayAction,
        waterManagement: data.waterManagement,
        soilHealth: data.soilHealth,
        cropProtection: data.cropProtection,
        regenerativePractice: data.regenerativePractice,
        next7Days: data.next7Days,
        disclaimer: data.disclaimer,
        timestamp: 'Just now',
        isDemo: data.isDemo,
        source: data.source,
      });
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'AI service is temporarily unavailable. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    const activeCropName = crop || currentFarm.crop || '';
    const activeLocationName = location || currentFarm.location || '';
    const textToCopy = `KhetiNexus AI (${activeCropName} - ${activeLocationName}):
${t.advisoryOverview}: ${advisory.summary}
${t.whatToDoToday}: ${advisory.todayAction}
${t.waterManagement}: ${advisory.waterManagement}
${t.soilHealth}: ${advisory.soilHealth}
${t.cropProtection}: ${advisory.cropProtection}
${t.regenerativePractice}: ${advisory.regenerativePractice}
${t.next7Days}: ${advisory.next7Days}
${t.disclaimerTitle}: ${advisory.disclaimer}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-6 sm:space-y-8 min-w-0">
      {/* Header */}
      <div className="bg-white dark:bg-[#0c1810] rounded-2xl border border-stone-200/80 dark:border-stone-800/80 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-heading text-2xl font-bold text-stone-900 dark:text-stone-100">
              {t.advisoryTitle}
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-0.5">
              {t.advisorySubtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-stone-300 dark:border-stone-700 hover:border-emerald-600 text-stone-700 dark:text-stone-300 hover:text-emerald-800 dark:hover:text-emerald-300 text-xs font-semibold transition-colors cursor-pointer min-h-[40px]"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? t.copiedAdvisory : t.copyAdvisoryBtn}</span>
          </button>
        </div>
      </div>

      {/* Advisory Parameter Customizer & Form */}
      <div className="bg-white dark:bg-[#0c1810] rounded-2xl border border-stone-200/80 dark:border-stone-800/80 p-5 sm:p-6 shadow-xs space-y-4 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-stone-200/70 dark:border-stone-800/70">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
            {formatFarmValue('Advisory Parameters', language, (v, l) => {
              const norm = normalizeLang(l);
              if (norm === 'te') return 'సలహా పారామితులు';
              if (norm === 'hi') return 'सलाह पैरामीटर्स';
              return v;
            })}
          </span>
          <span className="text-xs text-stone-500 dark:text-stone-400">
            {formatFarmValue('Active Farm', language, (v, l) => normalizeLang(l) === 'te' ? 'క్రియాశీల పొలం' : normalizeLang(l) === 'hi' ? 'सक्रिय खेत' : v)}: <strong className="text-stone-800 dark:text-stone-200 font-semibold">{formatFarmValue(currentFarm.name, language, localizeFarmName)}</strong> ({localizeCountry(currentFarm.country, language)})
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-3.5 items-end">
          {/* 1. Crop */}
          <div className="flex flex-col justify-end w-full min-w-0">
            <label
              htmlFor="input-advisory-crop"
              title={cropLabel}
              className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1.5 leading-tight truncate"
            >
              {cropLabel}
            </label>
            <input
              id="input-advisory-crop"
              type="text"
              value={crop}
              onChange={(e) => setCrop(e.target.value)}
              className="w-full h-11 min-h-[44px] px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 text-xs sm:text-sm font-normal text-stone-900 dark:text-stone-100 bg-white dark:bg-stone-900 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 outline-none transition-all shadow-2xs box-border"
            />
          </div>

          {/* 2. Farm Location */}
          <div className="flex flex-col justify-end w-full min-w-0">
            <label
              htmlFor="input-advisory-location"
              title={locationLabel}
              className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1.5 leading-tight truncate"
            >
              {locationLabel}
            </label>
            <input
              id="input-advisory-location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full h-11 min-h-[44px] px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 text-xs sm:text-sm font-normal text-stone-900 dark:text-stone-100 bg-white dark:bg-stone-900 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 outline-none transition-all shadow-2xs box-border"
            />
          </div>

          {/* 3. Growth Stage */}
          <div className="flex flex-col justify-end w-full min-w-0">
            <label
              htmlFor="input-advisory-growth-stage"
              title={growthStageLabel}
              className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1.5 leading-tight truncate"
            >
              {growthStageLabel}
            </label>
            <input
              id="input-advisory-growth-stage"
              type="text"
              value={growthStage}
              onChange={(e) => setGrowthStage(e.target.value as any)}
              className="w-full h-11 min-h-[44px] px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 text-xs sm:text-sm font-normal text-stone-900 dark:text-stone-100 bg-white dark:bg-stone-900 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 outline-none transition-all shadow-2xs box-border"
            />
          </div>

          {/* 4. Soil Type */}
          <div className="flex flex-col justify-end w-full min-w-0">
            <label
              htmlFor="input-advisory-soil-type"
              title={soilTypeLabel}
              className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1.5 leading-tight truncate"
            >
              {soilTypeLabel}
            </label>
            <input
              id="input-advisory-soil-type"
              type="text"
              value={soilType}
              onChange={(e) => setSoilType(e.target.value)}
              className="w-full h-11 min-h-[44px] px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 text-xs sm:text-sm font-normal text-stone-900 dark:text-stone-100 bg-white dark:bg-stone-900 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 outline-none transition-all shadow-2xs box-border"
            />
          </div>

          {/* 5. Soil Moisture */}
          <div className="flex flex-col justify-end w-full min-w-0">
            <label
              htmlFor="input-advisory-soil-moisture"
              title={soilMoistureLabel}
              className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1.5 leading-tight truncate"
            >
              {soilMoistureLabel}
            </label>
            <input
              id="input-advisory-soil-moisture"
              type="text"
              value={soilMoisture}
              onChange={(e) => setSoilMoisture(e.target.value)}
              className="w-full h-11 min-h-[44px] px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 text-xs sm:text-sm font-normal text-stone-900 dark:text-stone-100 bg-white dark:bg-stone-900 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 outline-none transition-all shadow-2xs box-border"
            />
          </div>

          {/* 6. Recent Rainfall */}
          <div className="flex flex-col justify-end w-full min-w-0">
            <label
              htmlFor="input-advisory-rainfall"
              title={recentRainfallLabel}
              className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1.5 leading-tight truncate"
            >
              {recentRainfallLabel}
            </label>
            <input
              id="input-advisory-rainfall"
              type="text"
              value={recentRainfall}
              onChange={(e) => setRecentRainfall(e.target.value)}
              className="w-full h-11 min-h-[44px] px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 text-xs sm:text-sm font-normal text-stone-900 dark:text-stone-100 bg-white dark:bg-stone-900 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 outline-none transition-all shadow-2xs box-border"
            />
          </div>

          {/* 7. Temperature */}
          <div className="flex flex-col justify-end w-full min-w-0">
            <label
              htmlFor="input-advisory-temperature"
              title={temperatureLabel}
              className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1.5 leading-tight truncate"
            >
              {temperatureLabel}
            </label>
            <input
              id="input-advisory-temperature"
              type="text"
              value={temperature}
              onChange={(e) => setTemperature(e.target.value)}
              className="w-full h-11 min-h-[44px] px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 text-xs sm:text-sm font-normal text-stone-900 dark:text-stone-100 bg-white dark:bg-stone-900 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 outline-none transition-all shadow-2xs box-border"
            />
          </div>

          {/* 8. Irrigation */}
          <div className="flex flex-col justify-end w-full min-w-0">
            <label
              htmlFor="input-advisory-irrigation"
              title={irrigationLabel}
              className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1.5 leading-tight truncate"
            >
              {irrigationLabel}
            </label>
            <input
              id="input-advisory-irrigation"
              type="text"
              value={irrigation}
              onChange={(e) => setIrrigation(e.target.value as any)}
              className="w-full h-11 min-h-[44px] px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 text-xs sm:text-sm font-normal text-stone-900 dark:text-stone-100 bg-white dark:bg-stone-900 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 outline-none transition-all shadow-2xs box-border"
            />
          </div>

          {/* 9. Farm Size */}
          <div className="flex flex-col justify-end w-full min-w-0">
            <label
              htmlFor="input-advisory-farm-size"
              title={farmSizeLabel}
              className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1.5 leading-tight truncate"
            >
              {farmSizeLabel}
            </label>
            <input
              id="input-advisory-farm-size"
              type="text"
              value={farmSize}
              onChange={(e) => setFarmSize(e.target.value)}
              className="w-full h-11 min-h-[44px] px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 text-xs sm:text-sm font-normal text-stone-900 dark:text-stone-100 bg-white dark:bg-stone-900 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 outline-none transition-all shadow-2xs box-border"
            />
          </div>

          {/* Action Button */}
          <div className="flex flex-col justify-end w-full min-w-0">
            <button
              id="generate-ai-advisory-btn"
              disabled={loading}
              onClick={handleGenerateAdvisory}
              className="w-full h-11 min-h-[44px] px-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 disabled:opacity-50 text-white font-semibold text-xs sm:text-sm shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer box-border"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin shrink-0" />
                  <span className="truncate">{t.generatingAdvisory}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 shrink-0 text-emerald-200" />
                  <span className="truncate">{t.generateAdvisoryBtn}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-800 dark:text-rose-300 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>

      {/* Structured Output Cards */}
      {advisory.isDemo ? (
        <div className="bg-emerald-50/60 dark:bg-emerald-950/20 border border-dashed border-emerald-300 dark:border-emerald-800 rounded-2xl p-6 sm:p-10 text-center space-y-4 max-w-4xl mx-auto">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 flex items-center justify-center shadow-2xs">
            <Sparkles className="w-7 h-7" />
          </div>
          <div className="space-y-2 max-w-2xl mx-auto">
            <h3 className="font-heading text-lg sm:text-xl font-bold text-stone-900 dark:text-stone-100 tracking-tight">
              {t.noAdvisoryYet || 'No AI Farm Advisory Generated Yet'}
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
              {t.noAdvisoryPrompt || 'Generate personalized AI agronomic recommendations for'}{' '}
              <strong className="text-stone-800 dark:text-stone-200">{formatFarmValue(currentFarm.name, language, localizeFarmName)}</strong>{' '}
              ({formatFarmValue(currentFarm.crop, language, localizeCrop)}, {formatFarmLocation(currentFarm.location, currentFarm.stateRegion, language)}){' '}
              {t.advisoryContextSuffix || 'based on live weather, soil, satellite data, and growth stage.'}
            </p>
          </div>
          <div className="pt-2">
            <button
              onClick={handleGenerateAdvisory}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-950/10 transition-all cursor-pointer disabled:opacity-60 min-h-[44px]"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-emerald-200" />}
              <span>{loading ? (t.generatingAdvisory || 'Generating AI Advisory...') : (t.generateAdvisoryBtn || 'Generate AI Advisory Now')}</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Executive Summary Card */}
          <div className="bg-gradient-to-br from-emerald-900 via-emerald-950 to-stone-900 text-white rounded-2xl p-5 sm:p-6 md:p-7 shadow-sm border border-emerald-800/80">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-emerald-300 mb-3 pb-2 border-b border-emerald-800/50">
              <span className="uppercase font-bold tracking-wider text-[11px] sm:text-xs">{t.agronomicAssessment}</span>
              <span className="text-[11px] sm:text-xs text-emerald-300/90 font-medium">
                {formatFarmValue('Source', language, (v, l) => {
                  const norm = normalizeLang(l);
                  if (norm === 'te') return 'ఆధారం';
                  if (norm === 'hi') return 'स्रोत';
                  if (norm === 'ta') return 'ஆதாரம்';
                  if (norm === 'kn') return 'ಮೂಲ';
                  if (norm === 'ml') return 'ഉറവിടം';
                  if (norm === 'mr') return 'स्रोत';
                  if (norm === 'gu') return 'સ્ત્રોત';
                  if (norm === 'bn') return 'উৎস';
                  if (norm === 'pa') return 'ਸਰੋਤ';
                  if (norm === 'or') return 'ଉତ୍ସ';
                  if (norm === 'as') return 'উৎস';
                  if (norm === 'ur') return 'ماخذ';
                  if (norm === 'ar') return 'المصدر';
                  if (norm === 'es') return 'Fuente';
                  if (norm === 'fr') return 'Source';
                  if (norm === 'pt') return 'Fonte';
                  if (norm === 'ru') return 'Источник';
                  if (norm === 'zh') return '来源';
                  return v;
                })}: <strong className="text-white">{advisory.source || 'Gemini 3.1 Flash-Lite'}</strong>
              </span>
            </div>
            <p className="text-sm sm:text-base md:text-lg font-medium leading-relaxed text-emerald-50/95">
              {advisory.summary}
            </p>
          </div>

          {/* 6 Structured Advisory Modules - Stacked 1 by 1 on Mobile with Uniform Width & Size */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4 md:gap-5 w-full min-w-full">
            {/* 1. "What to do today" */}
            <div className="bg-white dark:bg-[#0c1810] rounded-2xl border border-stone-200/80 dark:border-stone-800/80 p-4.5 sm:p-5 md:p-6 shadow-xs flex flex-col justify-between transition-all hover:border-emerald-500/40 w-full min-w-full">
              <div className="w-full min-w-full space-y-2.5 sm:space-y-3">
                <div className="flex items-center gap-3 text-stone-900 dark:text-stone-100 pb-2.5 border-b border-stone-100 dark:border-stone-800/80">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 flex items-center justify-center shrink-0 shadow-2xs">
                    <Sprout className="w-5 h-5" />
                  </div>
                  <h3 className="font-heading text-base sm:text-lg font-bold truncate text-stone-900 dark:text-stone-50">{t.whatToDoToday}</h3>
                </div>
                <p className="text-stone-700 dark:text-stone-300 text-xs sm:text-sm leading-relaxed break-words">{advisory.todayAction}</p>
              </div>
            </div>

            {/* 2. "Water management" */}
            <div className="bg-white dark:bg-[#0c1810] rounded-2xl border border-stone-200/80 dark:border-stone-800/80 p-4.5 sm:p-5 md:p-6 shadow-xs flex flex-col justify-between transition-all hover:border-sky-500/40 w-full min-w-full">
              <div className="w-full min-w-full space-y-2.5 sm:space-y-3">
                <div className="flex items-center gap-3 text-stone-900 dark:text-stone-100 pb-2.5 border-b border-stone-100 dark:border-stone-800/80">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-sky-100 dark:bg-sky-950/80 text-sky-800 dark:text-sky-300 flex items-center justify-center shrink-0 shadow-2xs">
                    <Droplets className="w-5 h-5" />
                  </div>
                  <h3 className="font-heading text-base sm:text-lg font-bold truncate text-stone-900 dark:text-stone-50">{t.waterManagement}</h3>
                </div>
                <p className="text-stone-700 dark:text-stone-300 text-xs sm:text-sm leading-relaxed break-words">{advisory.waterManagement}</p>
              </div>
            </div>

            {/* 3. "Soil health" */}
            <div className="bg-white dark:bg-[#0c1810] rounded-2xl border border-stone-200/80 dark:border-stone-800/80 p-4.5 sm:p-5 md:p-6 shadow-xs flex flex-col justify-between transition-all hover:border-amber-500/40 w-full min-w-full">
              <div className="w-full min-w-full space-y-2.5 sm:space-y-3">
                <div className="flex items-center gap-3 text-stone-900 dark:text-stone-100 pb-2.5 border-b border-stone-100 dark:border-stone-800/80">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 flex items-center justify-center shrink-0 shadow-2xs">
                    <Layers className="w-5 h-5" />
                  </div>
                  <h3 className="font-heading text-base sm:text-lg font-bold truncate text-stone-900 dark:text-stone-50">{t.soilHealth}</h3>
                </div>
                <p className="text-stone-700 dark:text-stone-300 text-xs sm:text-sm leading-relaxed break-words">{advisory.soilHealth}</p>
              </div>
            </div>

            {/* 4. "Crop protection" */}
            <div className="bg-white dark:bg-[#0c1810] rounded-2xl border border-stone-200/80 dark:border-stone-800/80 p-4.5 sm:p-5 md:p-6 shadow-xs flex flex-col justify-between transition-all hover:border-rose-500/40 w-full min-w-full">
              <div className="w-full min-w-full space-y-2.5 sm:space-y-3">
                <div className="flex items-center gap-3 text-stone-900 dark:text-stone-100 pb-2.5 border-b border-stone-100 dark:border-stone-800/80">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 flex items-center justify-center shrink-0 shadow-2xs">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <h3 className="font-heading text-base sm:text-lg font-bold truncate text-stone-900 dark:text-stone-50">{t.cropProtection}</h3>
                </div>
                <p className="text-stone-700 dark:text-stone-300 text-xs sm:text-sm leading-relaxed break-words">{advisory.cropProtection}</p>
              </div>
            </div>

            {/* 5. "Regenerative practice" */}
            <div className="bg-white dark:bg-[#0c1810] rounded-2xl border border-stone-200/80 dark:border-stone-800/80 p-4.5 sm:p-5 md:p-6 shadow-xs flex flex-col justify-between transition-all hover:border-emerald-500/40 w-full min-w-full">
              <div className="w-full min-w-full space-y-2.5 sm:space-y-3">
                <div className="flex items-center gap-3 text-stone-900 dark:text-stone-100 pb-2.5 border-b border-stone-100 dark:border-stone-800/80">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 flex items-center justify-center shrink-0 shadow-2xs">
                    <Layers className="w-5 h-5" />
                  </div>
                  <h3 className="font-heading text-base sm:text-lg font-bold truncate text-stone-900 dark:text-stone-50">{t.regenerativePractice}</h3>
                </div>
                <p className="text-stone-700 dark:text-stone-300 text-xs sm:text-sm leading-relaxed break-words">{advisory.regenerativePractice}</p>
              </div>
            </div>

            {/* 6. "Next 7 days" */}
            <div className="bg-white dark:bg-[#0c1810] rounded-2xl border border-stone-200/80 dark:border-stone-800/80 p-4.5 sm:p-5 md:p-6 shadow-xs flex flex-col justify-between transition-all hover:border-purple-500/40 w-full min-w-full">
              <div className="w-full min-w-full space-y-2.5 sm:space-y-3">
                <div className="flex items-center gap-3 text-stone-900 dark:text-stone-100 pb-2.5 border-b border-stone-100 dark:border-stone-800/80">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-purple-100 dark:bg-purple-950/80 text-purple-800 dark:text-purple-300 flex items-center justify-center shrink-0 shadow-2xs">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <h3 className="font-heading text-base sm:text-lg font-bold truncate text-stone-900 dark:text-stone-50">{t.next7Days}</h3>
                </div>
                <p className="text-stone-700 dark:text-stone-300 text-xs sm:text-sm leading-relaxed break-words">{advisory.next7Days}</p>
              </div>
            </div>
          </div>

          {/* Agricultural Agronomic Disclaimer */}
          <div className="rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 p-5 text-amber-950 dark:text-amber-200 flex items-start gap-3.5 shadow-2xs">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs sm:text-sm">
              <h4 className="font-bold text-amber-900 dark:text-amber-300">{t.disclaimerTitle}</h4>
              <p className="text-amber-800/90 dark:text-amber-300/90 leading-relaxed">
                {advisory.disclaimer ||
                  'This advisory is generated through artificial intelligence models for informational and educational purposes. It does not constitute guaranteed agronomic or chemical prescription. Always consult your district agricultural extension officer or Krishi Vigyan Kendra (KVK) before applying significant investments, chemical fungicides, or altering primary irrigation schedules.'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
