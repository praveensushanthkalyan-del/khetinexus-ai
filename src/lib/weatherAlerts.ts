import { WeatherData, Language, FarmProfile } from '../types';
import { normalizeLang } from '../i18n/farmValueTranslations';

export interface ExtremeWeatherAlert {
  id: string;
  type: 'heatwave' | 'heavy_rain' | 'severe_wind' | 'frost' | 'storm';
  severity: 'critical' | 'warning' | 'info';
  title: string;
  metric: string;
  conditionName: string;
  description: string;
  actionableAdvice: string;
  cropImpactAdvice: string;
}

export function detectExtremeWeatherAlerts(
  weather?: WeatherData | null,
  language?: Language,
  farm?: FarmProfile | null
): ExtremeWeatherAlert[] {
  if (!weather) return [];

  const alerts: ExtremeWeatherAlert[] = [];
  const normLang = (normalizeLang(language) || 'en').toLowerCase();
  const cropName = farm?.crop || 'crop';

  // Extract numerical values safely
  let tempVal = weather.tempValue;
  if (tempVal === undefined && weather.temperature) {
    const match = weather.temperature.match(/(-?\d+(\.\d+)?)/);
    if (match) tempVal = parseFloat(match[1]);
  }

  let rainMm = weather.rainfallMm;
  if (rainMm === undefined && weather.rainfall) {
    const match = weather.rainfall.match(/(\d+(\.\d+)?)/);
    if (match) rainMm = parseFloat(match[1]);
  }

  let windKmh = weather.windSpeedKmh;
  if (windKmh === undefined && weather.wind) {
    const match = weather.wind.match(/(\d+(\.\d+)?)/);
    if (match) windKmh = parseFloat(match[1]);
  }

  const conditionText = (weather.condition || '').toLowerCase();

  // Check 1: Heatwave / Extreme Heat
  const isHeatwaveCondition =
    conditionText.includes('heatwave') ||
    conditionText.includes('heat wave') ||
    conditionText.includes('extreme heat') ||
    conditionText.includes('excessive heat') ||
    conditionText.includes('extreme high temp');

  const maxForecastTemp = weather.forecast
    ? Math.max(...weather.forecast.map((f) => f.tempMax || 0))
    : 0;

  if (
    (tempVal !== undefined && tempVal >= 38) ||
    isHeatwaveCondition ||
    maxForecastTemp >= 40
  ) {
    const displayTemp = tempVal ? `${tempVal}°C` : weather.temperature || '38+°C';
    alerts.push(getHeatwaveAlert(displayTemp, normLang, cropName));
  }

  // Check 2: Heavy Rain / Torrential Downpour
  const isHeavyRainCondition =
    conditionText.includes('heavy rain') ||
    conditionText.includes('torrential') ||
    conditionText.includes('downpour') ||
    conditionText.includes('deluge') ||
    conditionText.includes('cloudburst') ||
    conditionText.includes('heavy shower') ||
    conditionText.includes('heavy thunderstorm') ||
    conditionText.includes('heavy rain shower');

  const maxForecastRain = weather.forecast
    ? Math.max(...weather.forecast.map((f) => f.rainfallMm || 0))
    : 0;

  if (
    (rainMm !== undefined && rainMm >= 20) ||
    isHeavyRainCondition ||
    maxForecastRain >= 25
  ) {
    const displayRain = rainMm ? `${rainMm} mm` : weather.rainfall || 'Heavy';
    alerts.push(getHeavyRainAlert(displayRain, normLang, cropName));
  }

  // Check 3: Severe Wind / Gale / Storm
  const isWindCondition =
    conditionText.includes('severe wind') ||
    conditionText.includes('gale') ||
    conditionText.includes('squall') ||
    conditionText.includes('cyclone') ||
    conditionText.includes('high wind') ||
    conditionText.includes('dust storm');

  if ((windKmh !== undefined && windKmh >= 45) || isWindCondition) {
    const displayWind = windKmh ? `${windKmh} km/h` : weather.wind || 'Strong';
    alerts.push(getSevereWindAlert(displayWind, normLang, cropName));
  }

  // Check 4: Frost / Freezing Temperature
  const isFrostCondition =
    conditionText.includes('frost') ||
    conditionText.includes('freezing') ||
    conditionText.includes('cold wave');

  if ((tempVal !== undefined && tempVal <= 3) || isFrostCondition) {
    const displayTemp = tempVal ? `${tempVal}°C` : weather.temperature || 'Freezing';
    alerts.push(getFrostAlert(displayTemp, normLang, cropName));
  }

  return alerts;
}

function getHeatwaveAlert(temp: string, lang: string, crop: string): ExtremeWeatherAlert {
  const i18n: Record<
    string,
    { title: string; desc: string; advice: string; impact: string }
  > = {
    te: {
      title: 'తీవ్రమైన వేడి గాలులు (Heatwave Alert)',
      desc: `ప్రస్తుత ఉష్ణోగ్రత ${temp} దాటింది. తీవ్రమైన ఎండల వల్ల పంటలో నీటి ఆవిరి వేగం పెరిగే ప్రమాదం ఉంది.`,
      advice: 'ఉదయాన్నే లేదా సాయంత్రం వేళల్లో తేలికపాటి నీటిపారుదల అందించండి. మధ్యాహ్నం వేళలో ఎరువులు చల్లవద్దు.',
      impact: `${crop} పంట కాలిపోకుండా నేల తేమను కాపాడుకోండి.`,
    },
    hi: {
      title: 'भीषण गर्मी व लू की चेतावनी (Heatwave Alert)',
      desc: `वर्तमान तापमान ${temp} दर्ज किया गया है। अत्यधिक गर्मी से फसल में वाष्पीकरण और तनाव का खतरा है।`,
      advice: 'सुबह या शाम के समय हल्की सिंचाई करें। दोपहर के समय उर्वरक व छिड़काव से बचें।',
      impact: `${crop} फसल को जलने से बचाने के लिए खेत में नमी बनाए रखें।`,
    },
    ta: {
      title: 'கடும் வெப்ப அலை எச்சரிக்கை (Heatwave Alert)',
      desc: `தற்போதைய வெப்பநிலை ${temp} ஐ எட்டியுள்ளது. அதிக வெப்பத்தால் பயிரில் நீர் இழப்பு ஏற்படும் அபாயம் உள்ளது.`,
      advice: 'காலை அல்லது மாலை வேளையில் லேசான நீர்ப்பாசனம் செய்யுங்கள். உச்ச வெயிலில் உரம் போட வேண்டாம்.',
      impact: `${crop} பயிரைப் பாதுகாக்க மண் ஈரப்பதத்தைப் பராமரிக்கவும்.`,
    },
    kn: {
      title: 'ತೀವ್ರ ಬಿಸಿಗಾಳಿ ಎಚ್ಚರಿಕೆ (Heatwave Alert)',
      desc: `ಪ್ರಸ್ತುತ ತಾಪಮಾನ ${temp} ದಾಟಿದೆ. ಅತಿಯಾದ ಶಾಖದಿಂದ ಬೆಳೆಯಲ್ಲಿ ತೇವಾಂಶ ಬೇಗನೆ ಕಡಿಮೆಯಾಗುವ ಸಾಧ್ಯತೆಯಿದೆ.`,
      advice: 'ಬೆಳಿಗ್ಗೆ ಅಥವಾ ಸಂಜೆ ಹಗುರ ನೀರಾವರಿ ನೀಡಿ. ಮಧ್ಯಾಹ್ನ ಗೊಬ್ಬರ ಹಾಕುವುದನ್ನು ತಪ್ಪಿಸಿ.',
      impact: `${crop} ಬೆಳೆಯನ್ನು ರಕ್ಷಿಸಲು ಹೊಲದಲ್ಲಿ ಪದುನು ಕಾಪಾಡಿಕೊಳ್ಳಿ.`,
    },
    mr: {
      title: 'तीव्र उष्णतेची लाट इशारा (Heatwave Alert)',
      desc: `सध्याचे तापमान ${temp} नोंदवले गेले आहे. प्रचंड उन्हामुळे पिकावर ताण येण्याची शक्यता आहे.`,
      advice: 'सकाळी किंवा संध्याकाळी हलकी बागायती करा. दुपारी खते व औषध फवारणी टाळा.',
      impact: `${crop} पिकाचे संरक्षण करण्यासाठी मातीतील ओलावा टिकवून ठेवा.`,
    },
    gu: {
      title: 'કાળઝાળ ગરમી અને હીટવેવ ચેતવણી (Heatwave Alert)',
      desc: `વર્તમાન તાપમાન ${temp} નોંધાયું છે. ભારે ગરમીથી પાકમાં ભેજ ઉડી જવાનો ભય છે.`,
      advice: 'સવારે અથવા સાંજે હળવું પિયત આપો. બપોરના સમયે ખાતર આપવાનું ટાળો.',
      impact: `${crop} પાકને બળવાથી બચાવવા ખેતરમાં યોગ્ય ભેજ જાળવો.`,
    },
    bn: {
      title: 'তীব্র তাপদাহ সতর্কতা (Heatwave Alert)',
      desc: `বর্তমান তাপমাত্রা ${temp} এ পৌঁছেছে। অতিরিক্ত গরমে ফসলে জলের ঘাটতি হতে পারে।`,
      advice: 'সকালে বা সন্ধ্যায় হালকা সেচ দিন। দুপুরবেলায় সার প্রয়োগ বন্ধ রাখুন।',
      impact: `${crop} ফসল বাঁচাতে জমিতে রসের মাত্রা বজায় রাখুন।`,
    },
    pa: {
      title: 'ਭਾਰੀ ਗਰਮੀ ਅਤੇ ਲੂ ਦੀ ਚੇਤਾਵਨੀ (Heatwave Alert)',
      desc: `ਮੌਜੂਦਾ ਤਾਪਮਾਨ ${temp} 'ਤੇ ਪਹੁੰਚ ਗਿਆ ਹੈ। ਜ਼ਿਆਦਾ ਗਰਮੀ ਨਾਲ ਫ਼ਸਲ ਵਿੱਚ ਨਮੀ ਘਟਣ ਦਾ ਖ਼ਤਰਾ ਹੈ।`,
      advice: 'ਸਵੇਰੇ ਜਾਂ ਸ਼ਾਮ ਵੇਲੇ ਹਲਕੀ ਸਿੰਚਾਈ ਕਰੋ। ਦੁਪਹਿਰ ਵੇਲੇ ਖਾਦ ਪਾਉਣ ਤੋਂ ਗੁਰੇਜ਼ ਕਰੋ।',
      impact: `${crop} ਫ਼ਸਲ ਦੇ ਬਚਾਅ ਲਈ ਖੇਤ ਵਿੱਚ ਨਮੀ ਬਣਾ ਕੇ ਰੱਖੋ।`,
    },
    ml: {
      title: 'കടുത്ത ഉഷ്ണതരംഗ മുന്നറിയിപ്പ് (Heatwave Alert)',
      desc: `നിലവിലെ താപനില ${temp} ആണ്. കടുത്ത ചൂട് വിളകൾക്ക് ദോഷം ചെയ്യും.`,
      advice: 'രാവിലെയോ വൈകുന്നേരമോ നനയ്ക്കുക. ഉച്ചസമയത്ത് വളപ്രയോഗം ഒഴിവാക്കുക.',
      impact: `${crop} വിള സംരക്ഷിക്കാൻ മണ്ണിൽ ഈർപ്പം നിലനിർത്തുക.`,
    },
    or: {
      title: 'ପ୍ରବଳ ଗ୍ରୀଷ୍ମ ପ୍ରବାହ ଚେତାବନୀ (Heatwave Alert)',
      desc: `ବର୍ତ୍ତମାନର ତାପମାତ୍ରା ${temp} ରେ ପହଞ୍ଚିଛି। ଅତ୍ୟଧିକ ଖରା ଯୋଗୁଁ ଫସଲରେ ଜଳୀୟ ଅଂଶ କମିପାରେ।`,
      advice: 'ସକାଳ କିମ୍ବା ସନ୍ଧ୍ୟାରେ ହାଲୁକା ସିଞ୍ଚନ କରନ୍ତୁ। ଖରାରେ ସାର ଦିଅନ୍ତୁ ନାହିଁ।',
      impact: `${crop} ଫସଲକୁ ସୁରକ୍ଷିତ ରଖିବା ପାଇଁ ଜମିରେ ଓଦା ଭାବ ରଖନ୍ତୁ।`,
    },
    as: {
      title: 'তীব্র উত্তাপৰ সতৰ্কবাণী (Heatwave Alert)',
      desc: `বৰ্তমানৰ উত্তাপ ${temp} হৈছে। অত্যন্ত গৰমৰ বাবে শস্যত পানীৰ অভাৱ হ'ব পাৰে।`,
      advice: 'ৰাতিপুৱা বা গধূলি পাতল পানী যোগান দিয়ক। দুপৰীয়া সাৰ নিদিব।',
      impact: `${crop} শস্য ৰক্ষা কৰিবলৈ মাটিত সেমেকা ভাৱ ৰাখক।`,
    },
    ur: {
      title: 'شدید گرمی اور لو کی الرٹ (Heatwave Alert)',
      desc: `موجودہ درجہ حرارت ${temp} تک پہنچ گیا ہے۔ شدید گرمی سے فصل کو نقصان پہنچ سکتا ہے۔`,
      advice: 'صبح یا شام کے وقت ہلکی آبپاشی کریں۔ دوپہر میں کھاد کے استعمال سے گریز کریں۔',
      impact: `${crop} کی فصل کو بچانے کے لیے کھیت میں نمی برقرار رکھیں۔`,
    },
    en: {
      title: 'Extreme Heatwave Alert',
      desc: `Current temperature has reached ${temp}. Extreme ambient thermal stress detected.`,
      advice: 'Apply light irrigation during early morning or late evening. Avoid daytime fertilizer or chemical spraying.',
      impact: `Protect your ${crop} field from moisture desiccation and heat stress.`,
    },
  };

  const selected = i18n[lang] || i18n.en;
  return {
    id: `heatwave-${Date.now()}`,
    type: 'heatwave',
    severity: 'critical',
    title: selected.title,
    metric: temp,
    conditionName: 'Heatwave',
    description: selected.desc,
    actionableAdvice: selected.advice,
    cropImpactAdvice: selected.impact,
  };
}

function getHeavyRainAlert(rain: string, lang: string, crop: string): ExtremeWeatherAlert {
  const i18n: Record<
    string,
    { title: string; desc: string; advice: string; impact: string }
  > = {
    te: {
      title: 'భారీ వర్షపాతం హెచ్చరిక (Heavy Rain Alert)',
      desc: `పొలంలో ${rain} భారీ వర్షపాతం నమోదైంది. నీరు నిలిచి వేర్లు కుళ్ళే ప్రమాదం ఉంది.`,
      advice: 'చేను గట్ల గుండా తక్షణమే నీటి మురుగు కాలువలు తెరచి అదనపు నీటిని బయటకు మళ్లించండి.',
      impact: `${crop} పైరు దెబ్బతినకుండా పొలంలో నీరు నిల్వ ఉండకుండా చూసుకోండి.`,
    },
    hi: {
      title: 'भारी वर्षा व जलभराव की चेतावनी (Heavy Rain Alert)',
      desc: `खेत में ${rain} भारी बारिश दर्ज की गई है। अत्यधिक पानी से जड़ों के गलने की आशंका है।`,
      advice: 'खेत से अतिरिक्त पानी की निकासी के लिए तुरंत नाली बनाएं और जलभराव रोकें।',
      impact: `${crop} फसल को सड़ने से बचाने के लिए पानी तुरंत बाहर निकालें।`,
    },
    ta: {
      title: 'கனமழை எச்சரிக்கை (Heavy Rain Alert)',
      desc: `பண்ணையில் ${rain} கனமழை பதிவாகியுள்ளது. வேர் அழுகல் நோய் ஏற்பட வாய்ப்புள்ளது.`,
      advice: 'பண்ணையிலிருந்து உபரி நீரை உடனடியாக வெளியேற்ற வடிகால் வசதி செய்யுங்கள்.',
      impact: `${crop} பயிரைப் பாதுகாக்க தங்கி நிற்கும் நீரை அகற்றவும்.`,
    },
    kn: {
      title: 'ಅತಿ ભારે ಮಳೆ ಎಚ್ಚರಿಕೆ (Heavy Rain Alert)',
      desc: `ಜಮೀನಿನಲ್ಲಿ ${rain} ಭಾರಿ ಮಳೆ ದಾಖಲಾಗಿದೆ. ನೀರು ನಿಂತು ಬೇರು ಕೊಳೆಯುವ ಅಪಾಯವಿದೆ.`,
      advice: 'ತಕ್ಷಣವೇ ಕಾಲುವೆ ಮಾಡಿ ಜಮೀನಿನ ಹೆಚ್ಚುವರಿ ನೀರನ್ನು ಹೊರಗೆ ಹಾಕಿ.',
      impact: `${crop} ಬೆಳೆಗೆ ಹಾನಿಯಾಗದಂತೆ ನೀರು ನಿಲ್ಲದಂತೆ ನೋಡಿಕೊಳ್ಳಿ.`,
    },
    mr: {
      title: 'मुसळधार पावसाचा इशारा (Heavy Rain Alert)',
      desc: `शेतात ${rain} मुसळधार पाऊस झाला आहे. मुळांमध्ये पाणी साचून नुकसान होऊ शकते.`,
      advice: 'शेतात साचलेले अतिरिक्त पाणी काढून टाकण्यासाठी तत्काळ पाटाची सोय करा.',
      impact: `${crop} पिकाला वाचवण्यासाठी पाणी साचू देऊ नका.`,
    },
    gu: {
      title: 'ભારે વરસાદ અને જળબંબાકારની ચેતવણી (Heavy Rain Alert)',
      desc: `ખેતરમાં ${rain} ભારે વરસાદ નોંધાયો છે. વધારે પાણીથી મૂળ સડી જવાનો ભય છે.`,
      advice: 'ખેતરમાંથી વધારાનું પાણી બહાર કાઢવા માટે ત્વરિત નિકાલ નાળી બનાવો.',
      impact: `${crop} પાકને નુકસાનથી બચાવવા પાણી ભરાવા ન દો.`,
    },
    bn: {
      title: 'ভারী বর্ষণ সতর্কতা (Heavy Rain Alert)',
      desc: `খামারে ${rain} ভারী বৃষ্টিপাত রেকর্ড করা হয়েছে। শেকড় পচে যাওয়ার ঝুঁকি রয়েছে।`,
      advice: 'জমি থেকে অতিরিক্ত জল বের করে দেওয়ার জন্য দ্রুত নিকাশী নালা তৈরি করুন।',
      impact: `${crop} ফসল রক্ষায় জমিতে জল জমতে দেবেন না।`,
    },
    pa: {
      title: 'ਭਾਰੀ ਮੀਂਹ ਅਤੇ ਪਾਣੀ ਭਰਨ ਦੀ ਚੇਤਾਵਨੀ (Heavy Rain Alert)',
      desc: `ਖੇਤ ਵਿੱਚ ${rain} ਭਾਰੀ ਮੀਂਹ ਦਰਜ ਕੀਤਾ ਗਿਆ ਹੈ। ਜੜ੍ਹਾਂ ਗਲਣ ਦਾ ਖ਼ਤਰਾ ਹੈ।`,
      advice: 'ਖੇਤ ਵਿੱਚੋਂ ਵਾਧੂ ਪਾਣੀ ਕੱਢਣ ਲਈ ਤੁਰੰਤ ਨਿਕਾਸੀ ਦਾ ਪ੍ਰਬੰਧ ਕਰੋ।',
      impact: `${crop} ਫ਼ਸਲ ਨੂੰ ਖਰਾਬ ਹੋਣ ਤੋਂ ਬਚਾਉਣ ਲਈ ਪਾਣੀ ਖੜ੍ਹਾ ਨਾ ਹੋਣ ਦਿਓ।`,
    },
    ml: {
      title: 'കനത്ത മഴ മുന്നറിയിപ്പ് (Heavy Rain Alert)',
      desc: `കൃഷിയിടത്തിൽ ${rain} കനത്ത മഴ രേഖപ്പെടുത്തി. വേരുകൾ അഴുകാൻ സാധ്യതയുണ്ട്.`,
      advice: 'വെള്ളക്കെട്ട് ഒഴിവാക്കാൻ ഉടൻ ഡ്രെയിനേജ് ചാലുകൾ തുറക്കുക.',
      impact: `${crop} വിള സംരക്ഷിക്കാൻ കെട്ടിക്കിടക്കുന്ന വെള്ളം പുറന്തള്ളുക.`,
    },
    or: {
      title: 'ପ୍ରବଳ ବର୍ଷା ଚେତାବନୀ (Heavy Rain Alert)',
      desc: `ଜମିରେ ${rain} ପ୍ରବଳ ବର୍ଷା ହୋଇଛି। ଜଳବନ୍ଦୀ ଯୋଗୁଁ ଚେର ସଢ଼ିଯିବାର ଆଶଙ୍କା ଅଛି।`,
      advice: 'ଜମିରୁ ଅତିରିକ୍ତ ଜଳ ନିଷ୍କାସନ ପାଇଁ ତୁରନ୍ତ ନାଳ ପ୍ରସ୍ତୁତ କରନ୍ତୁ।',
      impact: `${crop} ଫସଲକୁ ବଞ୍ଚାଇବା ପାଇଁ ଜଳ ନିଷ୍କାସନ ବ୍ୟବସ୍ଥା କରନ୍ତୁ।`,
    },
    as: {
      title: 'প্রবল বৃষ্টিপাতৰ সতৰ্কবাণী (Heavy Rain Alert)',
      desc: `পামত ${rain} প্ৰবল বৰষুণ হৈছে। পানী জমা হৈ শিপা পচি যোৱাৰ আশংকা আছে।`,
      advice: 'অতিৰিক্ত পানী ওলাই যাবলৈ নলা খন্দাৰ ব্যৱস্থা কৰক।',
      impact: `${crop} শস্য ৰক্ষা কৰিবলৈ পানী জমা হ'বলৈ নিদিব।`,
    },
    ur: {
      title: 'شدید بارش اور بادل ناہوش کی الرٹ (Heavy Rain Alert)',
      desc: `کھیت میں ${rain} شدید بارش ریکارڈ کی گئی ہے۔ جڑوں کے سڑنے کا خدشہ ہے۔`,
      advice: 'کھیت سے اضافی پانی کے اخراج کے لیے نالیاں کھولیں۔',
      impact: `${crop} کی فصل کو بچانے کے لیے پانی جمع نہ ہونے دیں۔`,
    },
    en: {
      title: 'Torrential Rain & Inundation Alert',
      desc: `Substantial precipitation (${rain}) detected. High surface runoff and root hypoxia risk.`,
      advice: 'Clear drainage trenches immediately to prevent root zone waterlogging.',
      impact: `Protect ${crop} root systems from saturated soil hypoxia.`,
    },
  };

  const selected = i18n[lang] || i18n.en;
  return {
    id: `heavyrain-${Date.now()}`,
    type: 'heavy_rain',
    severity: 'critical',
    title: selected.title,
    metric: rain,
    conditionName: 'Heavy Rainfall',
    description: selected.desc,
    actionableAdvice: selected.advice,
    cropImpactAdvice: selected.impact,
  };
}

function getSevereWindAlert(wind: string, lang: string, crop: string): ExtremeWeatherAlert {
  const i18n: Record<
    string,
    { title: string; desc: string; advice: string; impact: string }
  > = {
    te: {
      title: 'ఈదురు గాలుల హెచ్చరిక (Severe Wind Alert)',
      desc: `ప్రాంతంలో ${wind} వేగంతో గాలులు వీస్తున్నాయి. పంటలు పడిపోయే ప్రమాదం ఉంది.`,
      advice: 'ఎత్తైన పంటలకు కర్రలతో ఆధారాలు (staking) వేయండి. ఈ సమయంలో పిచికారీలు ఆపండి.',
      impact: `${crop} పైరు విరిగిపోకుండా రక్షణ కల్పించండి.`,
    },
    hi: {
      title: 'तेज आंधी व हवाओं की चेतावनी (Severe Wind Alert)',
      desc: `क्षेत्र में ${wind} की गति से तेज हवाएं चल रही हैं। फसल गिरने का खतरा है।`,
      advice: 'लंबी फसलों को सहारा दें और तेज हवाओं के दौरान छिड़काव कार्य रोक दें।',
      impact: `${crop} फसल को गिरने और टूटने से बचाएं।`,
    },
    en: {
      title: 'High Wind & Squall Alert',
      desc: `Gale force wind gusts of ${wind} detected. High risk of crop lodging.`,
      advice: 'Stake tall crops and suspend all foliar spraying activities during high winds.',
      impact: `Prevent mechanical lodging in ${crop} plants.`,
    },
  };

  const selected = i18n[lang] || i18n.en;
  return {
    id: `wind-${Date.now()}`,
    type: 'severe_wind',
    severity: 'warning',
    title: selected.title,
    metric: wind,
    conditionName: 'High Winds',
    description: selected.desc,
    actionableAdvice: selected.advice,
    cropImpactAdvice: selected.impact,
  };
}

function getFrostAlert(temp: string, lang: string, crop: string): ExtremeWeatherAlert {
  const i18n: Record<
    string,
    { title: string; desc: string; advice: string; impact: string }
  > = {
    te: {
      title: 'మంచు ప్రభావ హెచ్చరిక (Frost & Freeze Alert)',
      desc: `ఉష్ణోగ్రత ${temp} కి పడిపోయింది. మంచు తుంపర్ల వల్ల ఆకులు మాడిపోయే ప్రమాదం ఉంది.`,
      advice: 'నేలలో వేడిని నిలపడానికి సాయంత్రం వేళల్లో తేలికపాటి తడి అందించండి.',
      impact: `${crop} పైరు మంచు దెబ్బకు గురికాకుండా చూడండి.`,
    },
    hi: {
      title: 'पाले व शीत लहर की चेतावनी (Frost & Freeze Alert)',
      desc: `तापमान गिरकर ${temp} हो गया है। पाला पड़ने से पत्तियों के झुलसने का खतरा है।`,
      advice: 'पाले के असर से बचाने के लिए शाम को खेत में हल्की सिंचाई करें।',
      impact: `${crop} फसल को पाले से बचाएं।`,
    },
    en: {
      title: 'Frost & Freeze Warning',
      desc: `Sub-normal low temperature (${temp}) recorded. High risk of cellular freezing in leaves.`,
      advice: 'Provide evening light irrigation to release soil latent heat and buffer root thermal mass.',
      impact: `Shield ${crop} canopy from frost necrosis.`,
    },
  };

  const selected = i18n[lang] || i18n.en;
  return {
    id: `frost-${Date.now()}`,
    type: 'frost',
    severity: 'critical',
    title: selected.title,
    metric: temp,
    conditionName: 'Frost',
    description: selected.desc,
    actionableAdvice: selected.advice,
    cropImpactAdvice: selected.impact,
  };
}
