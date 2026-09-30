import { Language, HourlyForecastPoint } from '../types';
import { normalizeLang } from './farmValueTranslations';

export type LocalizedTone = 'good' | 'caution' | 'bad';

export interface LocalizedFarmGuidance {
  overallAdvice: string;
  fieldWork: { status: string; tone: LocalizedTone; reason: string };
  irrigation: { status: string; tone: LocalizedTone; reason: string };
  spraying: { status: string; tone: LocalizedTone; reason: string };
  harvesting: { status: string; tone: LocalizedTone; reason: string };
}

interface GuidanceLocaleDict {
  labels: {
    good: string;
    avoid: string;
    caution: string;
    suitable: string;
    goodIrrigate: string;
    rainReducesIrr: string;
    waitIrr: string;
  };
  fieldWork: {
    good: string;
    rainBad: string;
    heatCaution: string;
    windCaution: string;
  };
  spraying: {
    good: string;
    rainBad: (p: number) => string;
    windBad: (w: number) => string;
    heatBad: (t: number) => string;
    windCaution: (w: number) => string;
    rainCaution: (p: number) => string;
    tempCaution: (t: number) => string;
  };
  irrigation: {
    good: string;
    rainCaution: (p: number) => string;
    sunCaution: string;
  };
  harvesting: {
    good: string;
    rainBad: string;
    windCaution: string;
  };
  overall: {
    good: (t: number) => string;
    rain: (p: number) => string;
    heat: (t: number) => string;
    wind: (w: number) => string;
    stable: string;
  };
  story: {
    morningTitle: string;
    afternoonTitle: string;
    eveningTitle: string;
    nightTitle: string;
    morningRain: (p: number) => string;
    morningGood: (t: number) => string;
    morningMild: (t: number) => string;
    afternoonHeat: (t: number) => string;
    afternoonRain: (p: number) => string;
    afternoonClear: (t: number, w: number) => string;
    eveningRain: (p: number) => string;
    eveningCool: (t: number) => string;
    nightDesc: (t: number) => string;
  };
}

const GUIDANCE_DICTS: Record<string, GuidanceLocaleDict> = {
  en: {
    labels: {
      good: '🟢 Good',
      avoid: '🔴 Avoid',
      caution: '🟡 Caution',
      suitable: 'Suitable',
      goodIrrigate: 'Good time to irrigate',
      rainReducesIrr: 'Rain may reduce irrigation need',
      waitIrr: 'Consider waiting',
    },
    fieldWork: {
      good: 'Conditions are comfortable for manual and tractor operations.',
      rainBad: 'High likelihood of muddy soil and rainfall.',
      heatCaution: 'Extreme heat. Rest farm workers and livestock during peak sun.',
      windCaution: 'Strong gusts may blow dust and dry topsoil.',
    },
    spraying: {
      good: 'Wind is light and rain chance is low.',
      rainBad: (p) => `Rain is likely soon (${p}%). Chemical wash-off will occur.`,
      windBad: (w) => `High wind (${w} km/h). Excessive chemical drift will damage adjacent crops.`,
      heatBad: (t) => `High heat (${t}°C). Liquid drops evaporate too quickly and may scorch leaves.`,
      windCaution: (w) => `Wind is moderately strong (${w} km/h). Spray drift may increase.`,
      rainCaution: (p) => `Marginal rain chance (${p}%). Check local sky before spraying.`,
      tempCaution: (t) => `Warm temperature (${t}°C). Prefer early morning or late evening.`,
    },
    irrigation: {
      good: 'Low rain probability and moderate water loss from field.',
      rainCaution: (p) => `Natural rainfall is likely (${p}% chance). Save water and power.`,
      sunCaution: 'Peak afternoon sun causes high surface evaporation. Prefer evening watering.',
    },
    harvesting: {
      good: 'Canopy is dry with minimal moisture risk.',
      rainBad: 'High humidity or rain risk can spoil harvested grain/produce.',
      windCaution: 'Moderate to high wind gusts may cause threshing and handling losses.',
    },
    overall: {
      good: (t) => `Calm conditions with comfortable temperature (${t}°C) and low rain risk. Excellent window for farm operations.`,
      rain: (p) => `Rain likely (${p}%). Halt spraying and keep harvested crops covered.`,
      heat: (t) => `Hot weather (${t}°C). Avoid spraying during peak afternoon heat and ensure sufficient crop watering in early morning or evening.`,
      wind: (w) => `Breezy (${w} km/h). Exercise caution with chemical sprays to prevent unwanted drift.`,
      stable: 'Stable conditions. Plan tasks according to crop stage and soil requirements.',
    },
    story: {
      morningTitle: '🌅 Morning',
      afternoonTitle: '☀️ Afternoon',
      eveningTitle: '🌇 Evening',
      nightTitle: '🌙 Night',
      morningRain: (p) => `Morning dampness with chance of rain (${p}%). Delay sensitive sprays.`,
      morningGood: (t) => `Cool and calm (${t}°C). Optimal window for spraying and field labor.`,
      morningMild: (t) => `Mild (${t}°C) with gentle morning breeze.`,
      afternoonHeat: (t) => `Peak heat reaches ${t}°C with higher water loss from field.`,
      afternoonRain: (p) => `Cloudy with showers possible (${p}%).`,
      afternoonClear: (t, w) => `Warm and clear (${t}°C) with steady ${w} km/h wind.`,
      eveningRain: (p) => `Rain chances increase (${p}%). Check field drainage.`,
      eveningCool: (t) => `Temperatures ease to ${t}°C. Good for post-sunset irrigation.`,
      nightDesc: (t) => `Temperatures drop to ${t}°C with rising relative humidity.`,
    },
  },
  te: {
    labels: {
      good: '🟢 మంచిది',
      avoid: '🔴 నివారించండి',
      caution: '🟡 జాగ్రత్త',
      suitable: 'అనుకూలం',
      goodIrrigate: 'నీటిపారుదలకు మంచి సమయం',
      rainReducesIrr: 'వర్షం వల్ల నీటి అవసరం తగ్గుతుంది',
      waitIrr: 'వేచి ఉండడం మంచిది',
    },
    fieldWork: {
      good: 'ట్రాక్టర్ మరియు ఇతర పొలం పనులకు వాతావరణం చాలా అనుకూలంగా ఉంది.',
      rainBad: 'భారీ వర్షం మరియు నేల బురదగా మారే అవకాశం ఎక్కువ.',
      heatCaution: 'తీవ్రమైన ఎండ. మధ్యాహ్నం వేళ కూలీలకు మరియు పశువులకు విశ్రాంతి ఇవ్వండి.',
      windCaution: 'బలమైన గాలుల వల్ల దుమ్ము రేగి పై పొర నేల ఎండిపోయే అవకాశం ఉంది.',
    },
    spraying: {
      good: 'గాలి వేగం తక్కువగా ఉంది మరియు వర్షం పడే అవకాశం తక్కువ.',
      rainBad: (p) => `త్వరలో వర్షం పడే అవకాశం ఉంది (${p}%). మందులు కొట్టుకుపోయే ప్రమాదం ఉంది.`,
      windBad: (w) => `బలమైన గాలి (${w} km/h). మందు పక్క పొలాలకు కొట్టుకుపోయే ప్రమాదం ఉంది.`,
      heatBad: (t) => `తీవ్రమైన వేడి (${t}°C). పిచికారీ బిందువులు త్వరగా ఆవిరై ఆకులు మాడిపోయే అవకాశం ఉంది.`,
      windCaution: (w) => `మోస్తరు గాలి (${w} km/h). పిచికారీ కొట్టుకుపోకుండా జాగ్రత్తగా చేయండి.`,
      rainCaution: (p) => `స్వల్ప వర్ష సూచన (${p}%). ఆకాశాన్ని గమనించి పిచికారీ చేయండి.`,
      tempCaution: (t) => `ఉష్ణోగ్రత కాస్త ఎక్కువ (${t}°C). ఉదయం లేదా సాయంత్రం వేళల్లో చేయండి.`,
    },
    irrigation: {
      good: 'వర్షం అవకాశం తక్కువ మరియు పొలంలో నీటి ఆవిరి మోస్తరుగా ఉంది.',
      rainCaution: (p) => `సహజ వర్షం పడే అవకాశం ఉంది (${p}%). నీరు మరియు విద్యుత్‌ను ఆదా చేయండి.`,
      sunCaution: 'మధ్యాహ్నపు ఎండ వల్ల నీరు త్వరగా ఆవిరైపోతుంది. సాయంత్రం నీరు పెట్టడం మంచిది.',
    },
    harvesting: {
      good: 'పంట పొడిగా ఉంది, తేమ వల్ల ఎటువంటి ముప్పు లేదు.',
      rainBad: 'ఎక్కువ తేమ లేదా వర్షం వల్ల కోసిన పంట పాడయ్యే ప్రమాదం ఉంది.',
      windCaution: 'బలమైన గాలుల వల్ల నూర్పిడి మరియు కోత పనుల్లో నష్టం రావచ్చు.',
    },
    overall: {
      good: (t) => `ప్రశాంతమైన వాతావరణం, అనుకూల ఉష్ణోగ్రత (${t}°C) మరియు వర్షం ముప్పు తక్కువగా ఉంది. వ్యవసాయ పనులకు అనువైన సమయం.`,
      rain: (p) => `వర్షం పడే అవకాశం ఉంది (${p}%). పిచికారీని ఆపి, కోసిన పంటను కప్పి ఉంచండి.`,
      heat: (t) => `ఎండ తీవ్రత ఎక్కువ (${t}°C). మధ్యాహ్నం వేళ పిచికారీని నివారించి, ఉదయం లేదా సాయంత్రం నీరు పెట్టండి.`,
      wind: (w) => `ఈదురు గాలులు వీస్తున్నాయి (${w} km/h). రసాయనాలు కొట్టుకుపోకుండా పిచికారీ సమయంలో జాగ్రత్త వహించండి.`,
      stable: 'స్థిరమైన పరిస్థితులు. పంట దశ మరియు నేల తేమను బట్టి పనులను ప్లాన్ చేసుకోండి.',
    },
    story: {
      morningTitle: '🌅 ఉదయం',
      afternoonTitle: '☀️ మధ్యాహ్నం',
      eveningTitle: '🌇 సాయంత్రం',
      nightTitle: '🌙 రాత్రి',
      morningRain: (p) => `ఉదయం తేమగా ఉండి వర్షం పడే అవకాశం ఉంది (${p}%). సున్నితమైన పిచికారీని వాయిదా వేయండి.`,
      morningGood: (t) => `చల్లగా మరియు ప్రశాంతంగా ఉంటుంది (${t}°C). పిచికారీ మరియు పొలం పనులకు ఉత్తమ సమయం.`,
      morningMild: (t) => `హాయిగా (${t}°C) ఉండి ఉదయం తేలికపాటి గాలి వీస్తుంది.`,
      afternoonHeat: (t) => `గరిష్ట ఉష్ణోగ్రత ${t}°C కి చేరుతుంది, పొలం నుండి నీటి ఆవిరి పెరుగుతుంది.`,
      afternoonRain: (p) => `మేఘావృతమై ఉండి జల్లులు పడే అవకాశం ఉంది (${p}%).`,
      afternoonClear: (t, w) => `వెచ్చగా మరియు నిర్మలంగా ఉంటుంది (${t}°C), ${w} km/h స్థిరమైన గాలి ఉంటుంది.`,
      eveningRain: (p) => `వర్షం పడే అవకాశాలు పెరుగుతాయి (${p}%). పొలంలో నీటి పారుదల కాలువలను సరిచూసుకోండి.`,
      eveningCool: (t) => `ఉష్ణోగ్రతలు ${t}°C కి తగ్గుతాయి. సూర్యాస్తమయం తర్వాత నీటిపారుదలకు మంచిది.`,
      nightDesc: (t) => `ఉష్ణోగ్రతలు ${t}°C కి పడిపోతాయి మరియు సాపేక్ష ఆర్ద్రత పెరుగుతుంది.`,
    },
  },
  hi: {
    labels: {
      good: '🟢 अच्छा',
      avoid: '🔴 टालें',
      caution: '🟡 सावधानी',
      suitable: 'अनुकूल',
      goodIrrigate: 'सिंचाई के लिए उपयुक्त समय',
      rainReducesIrr: 'बारिश के कारण सिंचाई की जरूरत नहीं',
      waitIrr: 'प्रतीक्षा करना बेहतर है',
    },
    fieldWork: {
      good: 'ट्रैक्टर और सामान्य कृषि कार्यों के लिए मौसम अनुकूल है।',
      rainBad: 'मिट्टी गीली/कीचड़ होने और तेज बारिश की उच्च संभावना।',
      heatCaution: 'अत्यधिक गर्मी। दोपहर के समय मजदूरों और मवेशियों को आराम दें।',
      windCaution: 'तेज हवाओं से धूल उड़ सकती है और ऊपरी मिट्टी सूख सकती है।',
    },
    spraying: {
      good: 'हवा शांत है और बारिश की संभावना बहुत कम है।',
      rainBad: (p) => `जल्द बारिश होने की संभावना है (${p}%)। दवा बह जाएगी।`,
      windBad: (w) => `तेज हवा (${w} किमी/घंटा)। छिड़काव की दवा हवा में उड़ जाएगी।`,
      heatBad: (t) => `अत्यधिक गर्मी (${t}°C)। बूंदें जल्दी सूख जाएंगी और पत्तियों को नुकसान हो सकता है।`,
      windCaution: (w) => `मध्यम हवा (${w} किमी/घंटा)। दवा के फैलाव पर ध्यान दें।`,
      rainCaution: (p) => `थोड़ी बारिश की संभावना (${p}%)। मौसम देखकर छिड़काव करें।`,
      tempCaution: (t) => `गर्म तापमान (${t}°C)। सुबह या देर शाम का समय चुनें।`,
    },
    irrigation: {
      good: 'बारिश की कम संभावना और खेत से सामान्य जल वाष्पीकरण।',
      rainCaution: (p) => `प्राकृतिक वर्षा की संभावना (${p}%)। पानी और बिजली की बचत करें।`,
      sunCaution: 'कड़क धूप में वाष्पीकरण अधिक होता है। शाम को पानी देना बेहतर होगा।',
    },
    harvesting: {
      good: 'फसल सूखी है और नमी का कोई जोखिम नहीं है।',
      rainBad: 'अधिक नमी या बारिश से कटी हुई उपज खराब होने का खतरा है।',
      windCaution: 'तेज हवाओं के कारण थ्रेशिंग और कटाई में नुकसान हो सकता है।',
    },
    overall: {
      good: (t) => `शांत मौसम, अनुकूल तापमान (${t}°C) और बारिश का कम जोखिम। कृषि कार्यों के लिए बेहतरीन समय।`,
      rain: (p) => `बारिश की संभावना (${p}%)। छिड़काव रोकें और कटी फसल को ढक कर सुरक्षित रखें।`,
      heat: (t) => `गर्म मौसम (${t}°C)। दोपहर की धूप में छिड़काव से बचें और सुबह या शाम के समय पानी दें।`,
      wind: (w) => `हवा तेज है (${w} किमी/घंटा)। दवा के फैलाव से बचने के लिए छिड़काव में सावधानी बरतें।`,
      stable: 'स्थिर मौसम। अपनी फसल की अवस्था और मिट्टी की आवश्यकता अनुसार कार्य करें।',
    },
    story: {
      morningTitle: '🌅 सुबह',
      afternoonTitle: '☀️ दोपहर',
      eveningTitle: '🌇 शाम',
      nightTitle: '🌙 रात',
      morningRain: (p) => `सुबह नमी रहेगी और बारिश की संभावना (${p}%) है। संवेदनशील छिड़काव टालें।`,
      morningGood: (t) => `ठंडा और शांत मौसम (${t}°C)। छिड़काव और खेत के काम के लिए सर्वोत्तम समय।`,
      morningMild: (t) => `सुहावना (${t}°C) और हल्की सुबह की हवा।`,
      afternoonHeat: (t) => `अधिकतम तापमान ${t}°C तक पहुंचेगा, खेत से पानी का वाष्पीकरण बढ़ेगा।`,
      afternoonRain: (p) => `बादल छाए रहेंगे और बौछारें पड़ने की संभावना (${p}%) है।`,
      afternoonClear: (t, w) => `गर्म और साफ मौसम (${t}°C), ${w} किमी/घंटा की स्थिर हवा के साथ।`,
      eveningRain: (p) => `बारिश की संभावना बढ़ रही है (${p}%)। खेत की जल निकासी जांचें।`,
      eveningCool: (t) => `तापमान घटकर ${t}°C तक आ जाएगा। सूर्यास्त के बाद सिंचाई के लिए अच्छा समय।`,
      nightDesc: (t) => `रात में तापमान गिरकर ${t}°C तक पहुंचेगा और नमी में वृद्धि होगी।`,
    },
  },
  ta: {
    labels: {
      good: '🟢 நல்லது',
      avoid: '🔴 தவிர்க்கவும்',
      caution: '🟡 எச்சரிக்கை',
      suitable: 'பொருத்தமானது',
      goodIrrigate: 'நீர்ப்பாசனத்திற்கு ஏற்ற நேரம்',
      rainReducesIrr: 'மழையால் நீர்ப்பாசன தேவை குறைகிறது',
      waitIrr: 'காத்திருப்பது நல்லது',
    },
    fieldWork: {
      good: 'டிராக்டர் மற்றும் பண்ணை வேலைகளுக்கு சாதகமான வானிலை.',
      rainBad: 'அதிக மழை மற்றும் நிலம் சேறாகும் வாய்ப்பு அதிகம்.',
      heatCaution: 'கடும் வெப்பம். மதிய வேளையில் தொழிலாளர்களுக்கு ஓய்வு கொடுங்கள்.',
      windCaution: 'பலத்த காற்று வீசக்கூடும்.',
    },
    spraying: {
      good: 'காற்று மெதுவாகவும் மழை வாய்ப்பு குறைவாகவும் உள்ளது.',
      rainBad: (p) => `விரைவில் மழை பெய்ய வாய்ப்புள்ளது (${p}%). மருந்து அடிப்பதைக் கைவிடவும்.`,
      windBad: (w) => `பலத்த காற்று (${w} கி.மீ/மணி). மருந்து காற்றில் அடித்துச் செல்லப்படும்.`,
      heatBad: (t) => `அதிக வெப்பம் (${t}°C). காலை அல்லது மாலை வேளையைத் தேர்ந்தெடுக்கவும்.`,
      windCaution: (w) => `மிதமான காற்று (${w} கி.மீ/மணி). கவனமாக தெளிக்கவும்.`,
      rainCaution: (p) => `லேசான மழை வாய்ப்பு (${p}%). வானிலையைக் கவனித்து தெளிக்கவும்.`,
      tempCaution: (t) => `வெப்பநிலை அதிகம் (${t}°C). காலை நேரத்தைத் தேர்ந்தெடுக்கவும்.`,
    },
    irrigation: {
      good: 'மழை வாய்ப்பு குறைவு, மிதமான நீர் இழப்பு.',
      rainCaution: (p) => `மழை பெய்ய வாய்ப்புள்ளது (${p}%). நீர் மற்றும் மின்சாரத்தைச் சேமிக்கவும்.`,
      sunCaution: 'மதிய வெயிலில் நீர் ஆவியாகும். மாலையில் நீர் பாய்ச்சவும்.',
    },
    harvesting: {
      good: 'பயிர் காய்ந்துள்ளது, ஈரப்பத அபாயம் இல்லை.',
      rainBad: 'மழை மற்றும் அதிக ஈரப்பதம் அறுவடை செய்த பயிரைப் பாதிக்கலாம்.',
      windCaution: 'காற்றினால் அறுவடை இழப்பு ஏற்பட வாய்ப்புள்ளது.',
    },
    overall: {
      good: (t) => `அமைதியான வானிலை, மிதமான வெப்பநிலை (${t}°C). பண்ணை வேலைகளுக்கு உகந்த நேரம்.`,
      rain: (p) => `மழை வாய்ப்பு (${p}%). தெளிப்பதை நிறுத்தி, பயிரைப் பாதுகாக்கவும்.`,
      heat: (t) => `வெப்பமான வானிலை (${t}°C). அதிக வெயிலைத் தவிர்க்கவும்.`,
      wind: (w) => `காற்று வேகம் (${w} கி.மீ/மணி). தெளிக்கும் போது கவனம் தேவை.`,
      stable: 'நிலையான வானிலை. பயிர் நிலைக்கு ஏற்ப திட்டமிடவும்.',
    },
    story: {
      morningTitle: '🌅 காலை',
      afternoonTitle: '☀️ மதியம்',
      eveningTitle: '🌇 மாலை',
      nightTitle: '🌙 இரவு',
      morningRain: (p) => `காலை ஈரப்பதம் மற்றும் மழை வாய்ப்பு (${p}%).`,
      morningGood: (t) => `குளிர்ந்த மற்றும் அமைதியான வானிலை (${t}°C).`,
      morningMild: (t) => `இதமான காலை வானிலை (${t}°C).`,
      afternoonHeat: (t) => `மதிய வெப்பம் ${t}°C வரை உயரும்.`,
      afternoonRain: (p) => `மேகமூட்டம் மற்றும் மழை வாய்ப்பு (${p}%).`,
      afternoonClear: (t, w) => `வெப்பமும் தெளிவான வானிலையும் (${t}°C).`,
      eveningRain: (p) => `மழை வாய்ப்பு அதிகரிக்கிறது (${p}%).`,
      eveningCool: (t) => `வெப்பநிலை ${t}°C ஆகக் குறையும்.`,
      nightDesc: (t) => `இரவு வெப்பநிலை ${t}°C ஆகக் குறையும்.`,
    },
  },
  kn: {
    labels: {
      good: '🟢 ಉತ್ತಮ',
      avoid: '🔴 ತಪ್ಪಿಸಿ',
      caution: '🟡 ಎಚ್ಚರಿಕೆ',
      suitable: 'ಸೂಕ್ತ',
      goodIrrigate: 'ನೀರಾವರಿಗೆ ಸೂಕ್ತ ಸಮಯ',
      rainReducesIrr: 'ಮಳೆಯಿಂದಾಗಿ ನೀರಾವರಿ ಅಗತ್ಯವಿಲ್ಲ',
      waitIrr: 'ಕಾಯುವುದು ಉತ್ತಮ',
    },
    fieldWork: {
      good: 'ಹೊಲದ ಕೆಲಸಗಳಿಗೆ ಮತ್ತು ಟ್ರ್ಯಾಕ್ಟರ್ ಕಾರ್ಯಾಚರಣೆಗೆ ಅನುಕೂಲಕರ ವಾತಾವರಣ.',
      rainBad: 'ಭಾರಿ ಮಳೆ ಮತ್ತು ಮಣ್ಣು ಕೆಸರಾಗುವ ಹೆಚ್ಚಿನ ಸಾಧ್ಯತೆ.',
      heatCaution: 'ವಿಪರೀತ ಬಿಸಿಲು. ಮಧ್ಯಾಹ್ನ ಕೆಲಸಗಾರರಿಗೆ ವಿಶ್ರಾಂತಿ ನೀಡಿ.',
      windCaution: 'ಬಲವಾದ ಗಾಳಿಯಿಂದ ಧೂಳು ಏಳಬಹುದು.',
    },
    spraying: {
      good: 'ಗಾಳಿಯು ಶಾಂತವಾಗಿದ್ದು ಮಳೆ ಸಾಧ್ಯತೆ ಕಡಿಮೆ ಇದೆ.',
      rainBad: (p) => `ಶೀಘ್ರದಲ್ಲೇ ಮಳೆ ಸಾಧ್ಯತೆ (${p}%). ಔಷಧ ಸಿಂಪಡಣೆ ರದ್ದುಮಾಡಿ.`,
      windBad: (w) => `ಬಲವಾದ ಗಾಳಿ (${w} ಕಿ.ಮೀ/ಗಂ). ಔಷಧ ಗಾಳಿಯಲ್ಲಿ ತೇಲಿಹೋಗಬಹುದು.`,
      heatBad: (t) => `ಹೆಚ್ಚಿನ ಬಿಸಿಲು (${t}°C). ಎಲೆಗಳು ಒಣಗುವ ಅಪಾಯವಿದೆ.`,
      windCaution: (w) => `ಮಧ್ಯಮ ಗಾಳಿ (${w} ಕಿ.ಮೀ/ಗಂ). ಎಚ್ಚರಿಕೆಯಿಂದ ಸಿಂಪಡಿಸಿ.`,
      rainCaution: (p) => `ಸ್ವಲ್ಪ ಮಳೆ ಸಾಧ್ಯತೆ (${p}%). ಮೋಡ ಗಮನಿಸಿ ಸಿಂಪಡಿಸಿ.`,
      tempCaution: (t) => `ಬೆಚ್ಚನೆಯ ತಾಪಮಾನ (${t}°C). ಮುಂಜಾನೆ ಸಮಯ ಉತ್ತಮ.`,
    },
    irrigation: {
      good: 'ಮಳೆ ಸಾಧ್ಯತೆ ಕಡಿಮೆ ಮತ್ತು ಸಾಮಾನ್ಯ ನೀರಿನ ನಷ್ಟ.',
      rainCaution: (p) => `ನೈಸರ್ಗಿಕ ಮಳೆ ಸಾಧ್ಯತೆ (${p}%). ನೀರು ಮತ್ತು ವಿದ್ಯುತ್ ಉಳಿಸಿ.`,
      sunCaution: 'ಮಧ್ಯಾಹ್ನದ ಬಿಸಿಲಿನಲ್ಲಿ ನೀರು ಆವಿಯಾಗುತ್ತದೆ. ಸಂಜೆ ನೀರು ಕೊಡಿ.',
    },
    harvesting: {
      good: 'ಬೆಳೆ ಒಣಗಿದೆ, ತೇವಾಂಶದ ಅಪಾಯವಿಲ್ಲ.',
      rainBad: 'ಮಳೆ ಮತ್ತು ತೇವಾಂಶದಿಂದ ಕೊಯ್ಲು ಹಾಳಾಗಬಹುದು.',
      windCaution: 'ಗಾಳಿಯಿಂದ ಕೊಯ್ಲು ನಷ್ಟವಾಗಬಹುದು.',
    },
    overall: {
      good: (t) => `ಶಾಂತ ವಾತಾವರಣ, ಹಿತಕರ ತಾಪಮಾನ (${t}°C). ಕೃಷಿ ಚಟುವಟಿಕೆಗಳಿಗೆ ಸೂಕ್ತ ಸಮಯ.`,
      rain: (p) => `ಮಳೆ ಸಾಧ್ಯತೆ (${p}%). ಸಿಂಪಡಣೆ ನಿಲ್ಲಿಸಿ ಮತ್ತು ಬೆಳೆ ರಕ್ಷಿಸಿ.`,
      heat: (t) => `ಬಿಸಿಲಿನ ವಾತಾವರಣ (${t}°C). ಮಧ್ಯಾಹ್ನದ ಸಿಂಪಡಣೆ ತಪ್ಪಿಸಿ.`,
      wind: (w) => `ಗಾಳಿಯ ವೇಗ ಹೆಚ್ಚಾಗಿದೆ (${w} ಕಿ.ಮೀ/ಗಂ). ಜಾಗರೂಕರಾಗಿರಿ.`,
      stable: 'ಸ್ಥಿರ ಹವಾಮಾನ. ಬೆಳೆಯ ಹಂತಕ್ಕೆ ತಕ್ಕಂತೆ ಕೆಲಸ ಯೋಜಿಸಿ.',
    },
    story: {
      morningTitle: '🌅 ಮುಂಜಾನೆ',
      afternoonTitle: '☀️ ಮಧ್ಯಾಹ್ನ',
      eveningTitle: '🌇 ಸಂಜೆ',
      nightTitle: '🌙 ರಾತ್ರಿ',
      morningRain: (p) => `ಮುಂಜಾನೆ ತೇವಾಂಶ ಮತ್ತು ಮಳೆ ಸಾಧ್ಯತೆ (${p}%).`,
      morningGood: (t) => `ತಂಪಾದ ಮತ್ತು ಶಾಂತ ವಾತಾವರಣ (${t}°C). ಸಿಂಪಡಣೆಗೆ ಉತ್ತಮ.`,
      morningMild: (t) => `ಹಿತಕರ ಮುಂಜಾನೆ (${t}°C).`,
      afternoonHeat: (t) => `ಮಧ್ಯಾಹ್ನದ ಗರಿಷ್ಠ ತಾಪಮಾನ ${t}°C ಮುಟ್ಟುತ್ತದೆ.`,
      afternoonRain: (p) => `ಮೋಡ ಕವಿದ ವಾತಾವರಣ ಮತ್ತು ಮಳೆ ಸಾಧ್ಯತೆ (${p}%).`,
      afternoonClear: (t, w) => `ಬೆಚ್ಚಗಿನ ಮತ್ತು ಸ್ವಚ್ಛ ಆಕಾಶ (${t}°C).`,
      eveningRain: (p) => `ಸಂಜೆ ಮಳೆ ಸಾಧ್ಯತೆ ಹೆಚ್ಚಾಗುತ್ತದೆ (${p}%).`,
      eveningCool: (t) => `ತಾಪಮಾನ ${t}°C ಗೆ ಇಳಿಯುತ್ತದೆ.`,
      nightDesc: (t) => `ರಾತ್ರಿ ತಾಪಮಾನ ${t}°C ಗೆ ಇಳಿಯುತ್ತದೆ.`,
    },
  },
  es: {
    labels: {
      good: '🟢 Favorable',
      avoid: '🔴 Evitar',
      caution: '🟡 Precaución',
      suitable: 'Adecuado',
      goodIrrigate: 'Buen momento para regar',
      rainReducesIrr: 'La lluvia reduce la necesidad de riego',
      waitIrr: 'Se recomienda esperar',
    },
    fieldWork: {
      good: 'Condiciones óptimas para labores manuales y con maquinaria.',
      rainBad: 'Alto riesgo de suelo encharcado y precipitaciones.',
      heatCaution: 'Calor extremo. Evite labores pesadas en horas pico de sol.',
      windCaution: 'Rachas de viento fuertes que pueden levantar polvo.',
    },
    spraying: {
      good: 'Viento suave y baja probabilidad de lluvia.',
      rainBad: (p) => `Lluvia inminente (${p}%). Se producirá lavado de producto.`,
      windBad: (w) => `Viento fuerte (${w} km/h). Alta deriva del producto químico.`,
      heatBad: (t) => `Temperatura alta (${t}°C). Rápida evaporación y riesgo de fitotoxicidad.`,
      windCaution: (w) => `Viento moderado (${w} km/h). Extreme precauciones con la deriva.`,
      rainCaution: (p) => `Probabilidad marginal de lluvia (${p}%). Verifique el cielo local.`,
      tempCaution: (t) => `Temperatura cálida (${t}°C). Prefiera primeras horas de la mañana.`,
    },
    irrigation: {
      good: 'Baja probabilidad de lluvia y moderada pérdida de agua.',
      rainCaution: (p) => `Precipitación natural probable (${p}%). Ahorre agua y energía.`,
      sunCaution: 'Alta evaporación por el sol del mediodía. Riegue al atardecer.',
    },
    harvesting: {
      good: 'Follaje seco y condiciones seguras para cosechar.',
      rainBad: 'La humedad excesiva o lluvia puede dañar la cosecha.',
      windCaution: 'Rachas de viento que pueden dificultar el manejo de la cosecha.',
    },
    overall: {
      good: (t) => `Condiciones estables con temperatura agradable (${t}°C) y sin riesgo de lluvia. Excelente ventana de trabajo.`,
      rain: (p) => `Lluvia probable (${p}%). Suspenda pulverizaciones y proteja la cosecha.`,
      heat: (t) => `Calor intenso (${t}°C). Evite aplicaciones químicas al mediodía y asegure riego adecuado.`,
      wind: (w) => `Viento notable (${w} km/h). Cuidado con la deriva de productos fitosanitarios.`,
      stable: 'Condiciones estables. Planifique las labores según la etapa del cultivo.',
    },
    story: {
      morningTitle: '🌅 Mañana',
      afternoonTitle: '☀️ Tarde',
      eveningTitle: '🌇 Atardecer',
      nightTitle: '🌙 Noche',
      morningRain: (p) => `Humedad matutina con posibilidad de lluvia (${p}%).`,
      morningGood: (t) => `Fresco y en calma (${t}°C). Ventana ideal para aplicaciones y labores.`,
      morningMild: (t) => `Mañana templada (${t}°C) con brisa suave.`,
      afternoonHeat: (t) => `La temperatura máxima alcanzará ${t}°C con mayor evapotranspiración.`,
      afternoonRain: (p) => `Nuboso con chubascos posibles (${p}%).`,
      afternoonClear: (t, w) => `Cálido y despejado (${t}°C) con viento de ${w} km/h.`,
      eveningRain: (p) => `Aumenta la probabilidad de lluvia (${p}%).`,
      eveningCool: (t) => `Las temperaturas descienden a ${t}°C. Favorable para riego.`,
      nightDesc: (t) => `Las temperaturas caen a ${t}°C con aumento de la humedad relativa.`,
    },
  },
  fr: {
    labels: {
      good: '🟢 Favorable',
      avoid: '🔴 À éviter',
      caution: '🟡 Prudence',
      suitable: 'Favorable',
      goodIrrigate: 'Bon créneau pour irriguer',
      rainReducesIrr: 'La pluie réduit le besoin d’irrigation',
      waitIrr: 'Attente conseillée',
    },
    fieldWork: {
      good: 'Conditions confortables pour les travaux manuels et au tracteur.',
      rainBad: 'Risque élevé de sol boueux et d’averses.',
      heatCaution: 'Forte chaleur. Ménagez le personnel et le bétail aux heures chaudes.',
      windCaution: 'Rafales de vent susceptibles d’assécher le sol superficiel.',
    },
    spraying: {
      good: 'Vent faible et faible risque de pluie.',
      rainBad: (p) => `Pluie probable (${p}%). Risque de lessivage des traitements.`,
      windBad: (w) => `Vent fort (${w} km/h). Dérive chimique importante.`,
      heatBad: (t) => `Forte chaleur (${t}°C). Évaporation trop rapide des gouttes.`,
      windCaution: (w) => `Vent modéré (${w} km/h). Surveillez la dérive.`,
      rainCaution: (p) => `Risque marginal de pluie (${p}%). Vérifiez le ciel local.`,
      tempCaution: (t) => `Température tiède (${t}°C). Privilégiez le matin ou le soir.`,
    },
    irrigation: {
      good: 'Faible risque de pluie et évaporation modérée.',
      rainCaution: (p) => `Pluie naturelle probable (${p}%). Économisez l’eau et l’énergie.`,
      sunCaution: 'Forte évaporation au zénith. Privilégiez l’arrosage en soirée.',
    },
    harvesting: {
      good: 'Végétation sèche avec risque minimal d’humidité.',
      rainBad: 'L’humidité excessive ou la pluie peut altérer la récolte.',
      windCaution: 'Rafales de vent risquant de compliquer le battage.',
    },
    overall: {
      good: (t) => `Conditions calmes, température agréable (${t}°C) et faible risque de pluie. Excellente fenêtre agricole.`,
      rain: (p) => `Pluie probable (${p}%). Arrêtez les pulvérisations et couvrez les récoltes.`,
      heat: (t) => `Chaleur marquée (${t}°C). Évitez les pulvérisations aux heures chaudes.`,
      wind: (w) => `Vent soutenu (${w} km/h). Prudence avec les traitements chimiques.`,
      stable: 'Conditions stables. Planifiez les travaux selon le stade de la culture.',
    },
    story: {
      morningTitle: '🌅 Matin',
      afternoonTitle: '☀️ Après-midi',
      eveningTitle: '🌇 Soirée',
      nightTitle: '🌙 Nuit',
      morningRain: (p) => `Humidité matinale avec risque de pluie (${p}%).`,
      morningGood: (t) => `Frais et calme (${t}°C). Créneau idéal pour pulvérisation et travaux.`,
      morningMild: (t) => `Matinée douce (${t}°C) avec brise légère.`,
      afternoonHeat: (t) => `Pic de chaleur atteignant ${t}°C avec hausse de l’évapotranspiration.`,
      afternoonRain: (p) => `Nuageux avec averses possibles (${p}%).`,
      afternoonClear: (t, w) => `Chaud et dégagé (${t}°C) avec vent régulier de ${w} km/h.`,
      eveningRain: (p) => `Les risques de pluie augmentent (${p}%).`,
      eveningCool: (t) => `Les températures diminuent à ${t}°C. Favorable à l’arrosage.`,
      nightDesc: (t) => `Baisse des températures à ${t}°C et hausse de l’humidité relative.`,
    },
  },
  ar: {
    labels: {
      good: '🟢 مناسب',
      avoid: '🔴 تجنب',
      caution: '🟡 تنبيه',
      suitable: 'ملائم',
      goodIrrigate: 'وقت مناسب للري',
      rainReducesIrr: 'المطر يقلل الحاجة للري',
      waitIrr: 'يُفضل الانتظار',
    },
    fieldWork: {
      good: 'الظروف الجوية ممتازة للأعمال الحقلية والجرارات.',
      rainBad: 'احتمال كبير لتشكل الوحل والأمطار الغزيرة.',
      heatCaution: 'حرارة مرتفعة. يُنصح بإراحة العمال والماشية وقت الظهيرة.',
      windCaution: 'رياح نشطة قد تثير الغبار وتجفف الطبقة السطحية.',
    },
    spraying: {
      good: 'الرياح هادئة وفرصة هطول الأمطار ضئيلة.',
      rainBad: (p) => `أمطار وشيكة (${p}%). تجنب الرش لمنع انجراف المبيد.`,
      windBad: (w) => `رياح قوية (${w} كم/س). تطاير رذاذ الرش خارج النطاق.`,
      heatBad: (t) => `حرارة عالية (${t}°C). تبخر سريع للقطرات وإجهاد للأوراق.`,
      windCaution: (w) => `رياح معتدلة (${w} كم/س). توخ الحذر أثناء الرش.`,
      rainCaution: (p) => `احتمال ضعيف للمطر (${p}%). تفقد الأجواء قبل الرش.`,
      tempCaution: (t) => `حرارة دافئة (${t}°C). يُفضل الرش في الصباح الباكر أو المساء.`,
    },
    irrigation: {
      good: 'فرصة مطر منخفضة وفقد مائي معتدل من التربة.',
      rainCaution: (p) => `هطول أمطار طبيعية محتمل (${p}%). وفر المياه والطاقة.`,
      sunCaution: 'تبخر شديد في ذروة الظهيرة. يُفضل الري مساءً.',
    },
    harvesting: {
      good: 'المحصول جاف ومخاطر الرطوبة منعدمة.',
      rainBad: 'الرطوبة العالية أو المطر قد تتلف المحصول المحصود.',
      windCaution: 'هبات الرياح قد تسبب فواقد أثناء الجمع والدراس.',
    },
    overall: {
      good: (t) => `أجواء هادئة مع حرارة مريحة (${t}°C) وخطر مطر منخفض. وقت مثالي للعمليات الزراعية.`,
      rain: (p) => `أمطار محتملة (${p}%). أوقف الرش وغط المحاصيل المحصودة.`,
      heat: (t) => `طقس حار (${t}°C). تجنب الرش وقت الظهيرة واعتنِ بري المحصول.`,
      wind: (w) => `رياح نشطة (${w} كم/س). انتبه لتطاير رذاذ المبيدات.`,
      stable: 'أجواء مستقرة. خطط للعمليات وفق مرحلة نمو المحصول.',
    },
    story: {
      morningTitle: '🌅 الصباح',
      afternoonTitle: '☀️ الظهيرة',
      eveningTitle: '🌇 المساء',
      nightTitle: '🌙 الليل',
      morningRain: (p) => `رطوبة صباحية مع احتمال مطر (${p}%).`,
      morningGood: (t) => `أجواء لطيفة وهادئة (${t}°C). وقت مثالي للرش والعمل.`,
      morningMild: (t) => `صباح معتدل (${t}°C) مع نسيم خفيف.`,
      afternoonHeat: (t) => `تصل الحرارة إلى ${t}°C مع زيادة البخر.`,
      afternoonRain: (p) => `غائم مع احتمال زخات مطر (${p}%).`,
      afternoonClear: (t, w) => `دافئ وصافٍ (${t}°C) مع رياح بسرعة ${w} كم/س.`,
      eveningRain: (p) => `تزداد احتمالات هطول المطر (${p}%).`,
      eveningCool: (t) => `تنخفض درجات الحرارة إلى ${t}°C. مناسب للري.`,
      nightDesc: (t) => `تنخفض الحرارة إلى ${t}°C مع ارتفاع الرطوبة النسبية.`,
    },
  },
  ml: {
    labels: {
      good: '🟢 നല്ലത്',
      avoid: '🔴 ഒഴിവാക്കുക',
      caution: '🟡 ജാഗ്രത',
      suitable: 'അനുയോജ്യം',
      goodIrrigate: 'നനയ്ക്കാൻ നല്ല സമയം',
      rainReducesIrr: 'മഴ കാരണം നനയ്ക്കൽ ആവശ്യം കുറയും',
      waitIrr: 'കാത്തിരിക്കുന്നത് നല്ലത്',
    },
    fieldWork: {
      good: 'ട്രാക്ടർ, പാടം പണികൾക്ക് കാലാവസ്ഥ വളരെ അനുകൂലമാണ്.',
      rainBad: 'ശക്തമായ മഴയ്ക്കും പാടം ചെളിനിറയാനും സാധ്യത കൂടുതലാണ്.',
      heatCaution: 'കഠിനമായ ചൂട്. ഉച്ചസമയത്ത് തൊഴിലാളികൾക്കും കന്നുകാലികൾക്കും വിശ്രമം നൽകുക.',
      windCaution: 'ശക്തമായ കാറ്റിൽ മേൽമണ്ണ് ഉണങ്ങാനും പൊടി ഉയരാനും സാധ്യതയുണ്ട്.',
    },
    spraying: {
      good: 'കാറ്റിന്റെ വേഗത കുറവാണ്, മഴ സാധ്യതയും കുറവാണ്.',
      rainBad: (p) => `ഉടൻ മഴ പെയ്യാൻ സാധ്യതയുണ്ട് (${p}%). മരുന്ന് ഒലിച്ചുപോകും.`,
      windBad: (w) => `ശക്തമായ കാറ്റ് (${w} കി.മീ/മണിക്കൂർ). മരുന്ന് വഴിതിരിഞ്ഞുപോയി അടുത്ത വിളകളെ ബാധിക്കാം.`,
      heatBad: (t) => `കഠിനമായ ചൂട് (${t}°C). മരുന്ന് വേഗത്തിൽ ബാഷ്പീകരിക്കപ്പെടുകയും ഇലകൾ വാടുകയും ചെയ്യും.`,
      windCaution: (w) => `മിതമായ കാറ്റുണ്ട് (${w} കി.മീ/മണിക്കൂർ). സ്പ്രേ ചെയ്യുമ്പോൾ ശ്രദ്ധിക്കുക.`,
      rainCaution: (p) => `ചെറിയ മഴ സാധ്യതയുണ്ട് (${p}%). സ്പ്രേ ചെയ്യുന്നതിന് മുൻപ് ആകാശം നിരീക്ഷിക്കുക.`,
      tempCaution: (t) => `ചൂടുള്ള കാലാവസ്ഥ (${t}°C). അതിരാവിലെയോ വൈകുന്നേരമോ തിരഞ്ഞെടുക്കുക.`,
    },
    irrigation: {
      good: 'കുറഞ്ഞ മഴ സാധ്യത, മണ്ണിൽ നിന്നുള്ള നീരാവി നഷ്ടം മിതമാണ്.',
      rainCaution: (p) => `മഴ പെയ്യാൻ സാധ്യതയുണ്ട് (${p}%). വെള്ളവും വൈദ്യുതിയും ലാഭിക്കാം.`,
      sunCaution: 'ഉച്ചവെയിലിൽ ബാഷ്പീകരണം വളരെ കൂടുതലാണ്. വൈകുന്നേരം നനയ്ക്കുക.',
    },
    harvesting: {
      good: 'വിളവെടുപ്പിന് അനുയോജ്യമായ ഉണങ്ങിയ അവസ്ഥ.',
      rainBad: 'അമിതമായ ഈർപ്പമോ മഴയോ വിളവ് കേടാക്കാൻ സാധ്യതയുണ്ട്.',
      windCaution: 'ശക്തമായ കാറ്റ് കാരണം കതിരുകൾ കൊഴിയാൻ സാധ്യതയുണ്ട്.',
    },
    overall: {
      good: (t) => `ശാന്തമായ കാലാവസ്ഥയും സുഖകരമായ ഊഷ്മാവും (${t}°C). കൃഷിപ്പണികൾക്ക് ഉത്തമ സമയം.`,
      rain: (p) => `മഴയ്ക്ക് സാധ്യതയുണ്ട് (${p}%). സ്പ്രേ ചെയ്യുന്നത് നിർത്തി വിളവുകൾ മൂടി സൂക്ഷിക്കുക.`,
      heat: (t) => `കഠിനമായ ചൂട് (${t}°C). ഉച്ചസമയത്തെ സ്പ്രേ ഒഴിവാക്കുക, അതിരാവിലെയോ വൈകുന്നേരമോ നനയ്ക്കുക.`,
      wind: (w) => `കാറ്റുള്ള കാലാവസ്ഥ (${w} കി.മീ/മണിക്കൂർ). കീടനാശിനി തളിക്കുമ്പോൾ ജാഗ്രത പാലിക്കുക.`,
      stable: 'സ്ഥിരതയുള്ള കാലാവസ്ഥ. വിളയുടെ വളർച്ചാ ഘട്ടത്തിനനുസരിച്ച് പണികൾ ആസൂത്രണം ചെയ്യുക.',
    },
    story: {
      morningTitle: '🌅 പ്രഭാതം',
      afternoonTitle: '☀️ ഉച്ചയ്ക്ക്',
      eveningTitle: '🌇 വൈകുന്നേരം',
      nightTitle: '🌙 രാത്രി',
      morningRain: (p) => `പ്രഭാതത്തിൽ ഈർപ്പവും മഴയ്ക്ക് സാധ്യതയും (${p}%). സ്പ്രേ മാറ്റിവെക്കുക.`,
      morningGood: (t) => `തണുത്തതും ശാന്തവുമായ പ്രഭാതം (${t}°C). സ്പ്രേ ചെയ്യാനും പണികൾക്കും ഉത്തമം.`,
      morningMild: (t) => `ശാന്തമായ പ്രഭാതം (${t}°C) ഇളം കാറ്റോടെ.`,
      afternoonHeat: (t) => `ഉച്ചയ്ക്ക് ഊഷ്മാവ് ${t}°C വരെ ഉയരുന്നു, ജലനഷ്ടം കൂടും.`,
      afternoonRain: (p) => `മേഘാവൃതവും മഴയ്ക്ക് സാധ്യതയും (${p}%).`,
      afternoonClear: (t, w) => `തെളിഞ്ഞ കാലാവസ്ഥ (${t}°C), മണിക്കൂറിൽ ${w} കി.മീ കാറ്റ്.`,
      eveningRain: (p) => `വൈകുന്നേരം മഴ സാധ്യത കൂടുന്നു (${p}%). പാടത്തെ നീർവാർച്ച പരിശോധിക്കുക.`,
      eveningCool: (t) => `ഊഷ്മാവ് ${t}°C ആയി കുറയുന്നു. സൂര്യാസ്തമയത്തിന് ശേഷം നനയ്ക്കാൻ ഉചിതം.`,
      nightDesc: (t) => `രാത്രിയിൽ ഊഷ്മാവ് ${t}°C ആയി കുറയുന്നു, അന്തരീക്ഷ ഈർപ്പം വർദ്ധിക്കുന്നു.`,
    },
  },
  mr: {
    labels: {
      good: '🟢 उत्तम',
      avoid: '🔴 टाळा',
      caution: '🟡 दक्षता',
      suitable: 'योग्य',
      goodIrrigate: 'सिंचनासाठी योग्य वेळ',
      rainReducesIrr: 'पावसामुळे पाण्याची गरज भासणार नाही',
      waitIrr: 'काही वेळ थांबणे योग्य',
    },
    fieldWork: {
      good: 'ट्रॅक्टर व शेतातील इतर मशागतीसाठी हवामान अत्यंत अनुकूल आहे.',
      rainBad: 'जोरदार पाऊस आणि शेतात चिखल होण्याची दाट शक्यता.',
      heatCaution: 'तीव्र ऊन. दुपारच्या वेळी शेतमजूर आणि जनावरांना सावलीत विश्रांती द्या.',
      windCaution: 'जोराच्या वाऱ्यामुळे धूळ उडेल आणि जमिनीतील ओलावा कमी होईल.',
    },
    spraying: {
      good: 'वाऱ्याचा वेग मंद आहे आणि पावसाची शक्यता कमी आहे.',
      rainBad: (p) => `लवकरच पावसाची शक्यता आहे (${p}%). औषध वाहून जाण्याचा धोका आहे.`,
      windBad: (w) => `वेगवान वारा (${w} किमी/तास). औषध उडून शेजारच्या पिकांवर जाण्याची शक्यता.`,
      heatBad: (t) => `जास्त तापमान (${t}°C). औषधाचे थेंब लगेच बाष्पीभवन होऊन पाने करपू शकतात.`,
      windCaution: (w) => `मध्यम वारा आहे (${w} किमी/तास). फवारणी करताना काळजी घ्या.`,
      rainCaution: (p) => `पावसाची हलकी शक्यता (${p}%). फवारणीपूर्वी आभाळाची स्थिती तपासा.`,
      tempCaution: (t) => `उष्ण हवामान (${t}°C). सकाळच्या किंवा संध्याकाळच्या वेळी फवारणी करा.`,
    },
    irrigation: {
      good: 'पावसाची शक्यता कमी असून जमिनीतून पाण्याचे बाष्पीभवन मध्यम आहे.',
      rainCaution: (p) => `पाऊस पडण्याची शक्यता आहे (${p}%). पाणी आणि वीज वाचवा.`,
      sunCaution: 'दुपारच्या कडक उन्हात बाष्पीभवन जास्त होते. संध्याकाळी पाणी द्यावे.',
    },
    harvesting: {
      good: 'कापणीसाठी अनुकूल कोरडे हवामान.',
      rainBad: 'जास्त ओलावा किंवा पावसामुळे काढणी केलेले धान्य खराब होऊ शकते.',
      windCaution: 'वाऱ्याच्या झोतामुळे मळणीच्या वेळी धान्याचे नुकसान होऊ शकते.',
    },
    overall: {
      good: (t) => `शांत वातावरण, सुखावह तापमान (${t}°C) आणि पावसाचा धोका नाही. शेतीकामांसाठी उत्तम वेळ.`,
      rain: (p) => `पावसाची शक्यता (${p}%). फवारणी थांबवा आणि काढणी केलेले पीक झाकून ठेवा.`,
      heat: (t) => `गरम हवामान (${t}°C). दुपारच्या उन्हात फवारणी टाळा आणि पिकांना वेळेवर पाणी द्या.`,
      wind: (w) => `वारा वाहत आहे (${w} किमी/तास). औषध फवारणी करताना काळजी घ्या.`,
      stable: 'हवामान स्थिर आहे. पिकांच्या वाढीच्या टप्प्यानुसार कामांचे नियोजन करा.',
    },
    story: {
      morningTitle: '🌅 सकाळ',
      afternoonTitle: '☀️ दुपार',
      eveningTitle: '🌇 संध्याकाळ',
      nightTitle: '🌙 रात्र',
      morningRain: (p) => `सकाळी हवेत गारवा आणि पावसाची शक्यता (${p}%). संवेदनशील फवारणी पुढे ढकला.`,
      morningGood: (t) => `थंड आणि शांत सकाळ (${t}°C). फवारणी आणि शेतातील कामांसाठी सर्वोत्तम वेळ.`,
      morningMild: (t) => `सुखद सकाळ (${t}°C) मंद वाऱ्यासह.`,
      afternoonHeat: (t) => `दुपारी तापमान ${t}°C पर्यंत पोहोचेल, बाष्पीभवन वाढेल.`,
      afternoonRain: (p) => `ढगाळ हवामान आणि सरींची शक्यता (${p}%).`,
      afternoonClear: (t, w) => `स्वच्छ व उबदार हवामान (${t}°C), वाऱ्याचा वेग ${w} किमी/तास.`,
      eveningRain: (p) => `संध्याकाळी पावसाची शक्यता वाढेल (${p}%). शेतातील निचरा तपासा.`,
      eveningCool: (t) => `तापमान कमी होऊन ${t}°C होईल. सूर्यास्तानंतर पाणी देण्यासाठी योग्य वेळ.`,
      nightDesc: (t) => `रात्री तापमान ${t}°C पर्यंत घसरेल आणि हवेतील आर्द्रता वाढेल.`,
    },
  },
  gu: {
    labels: {
      good: '🟢 ઉત્તમ',
      avoid: '🔴 ટાળો',
      caution: '🟡 સાવચેતી',
      suitable: 'અનુકૂળ',
      goodIrrigate: 'પિયત માટે ઉત્તમ સમય',
      rainReducesIrr: 'વરસાદથી પિયતની જરૂરિયાત ઘટી શકે છે',
      waitIrr: 'રાહ જોવી યોગ્ય',
    },
    fieldWork: {
      good: 'ટ્રેક્ટર અને ખેતરના મજૂરીકામ માટે વાતાવરણ ખૂબ અનુકૂળ છે.',
      rainBad: 'ભારે વરસાદ અને ખેતરમાં કાદવ-કીચડ થવાની શક્યતા વધારે છે.',
      heatCaution: 'તીવ્ર ગરમી. બપોરે ખેતમજૂરો અને પશુઓને છાંયડે આરામ આપો.',
      windCaution: 'ઝડપી પવનથી ધૂળ ઉડશે અને જમીનની ભેજ સુકાશે.',
    },
    spraying: {
      good: 'પવન ધીમો છે અને વરસાદની શક્યતા નહિવત છે.',
      rainBad: (p) => `ટૂંક સમયમાં વરસાદની શક્યતા છે (${p}%). દવાનો છંટકાવ ધોવાઈ જશે.`,
      windBad: (w) => `તેજ પવન (${w} કિમી/કલાક). દવા ઉડીને પાડોશી પાકને નુકસાન પહોંચાડી શકે છે.`,
      heatBad: (t) => `વધુ ગરમી (${t}°C). દવાનું ઝડપી બાષ્પીભવન થશે અને પાંદડા બળી શકે છે.`,
      windCaution: (w) => `મધ્યમ પવન (${w} કિમી/કલાક). છંટકાવ કરતી વખતે કાળજી રાખો.`,
      rainCaution: (p) => `વરસાદની સામાન્ય શક્યતા (${p}%). છંટકાવ પહેલાં આકાશનું નિરીક્ષણ કરો.`,
      tempCaution: (t) => `ગરમ વાતાવરણ (${t}°C). વહેલી સવારે કે સાંજે છંટકાવ કરવો હિતાવહ છે.`,
    },
    irrigation: {
      good: 'વરસાદની શક્યતા ઓછી અને જમીનમાંથી ભેજનો વ્યય સામાન્ય છે.',
      rainCaution: (p) => `કુદરતી વરસાદની શક્યતા છે (${p}%). પાણી અને વીજળી બચાવો.`,
      sunCaution: 'બપોરના તડકામાં બાષ્પીભવન વધુ થાય છે. સાંજે પિયત આપવું.',
    },
    harvesting: {
      good: 'લણણી માટે અનુકૂળ સૂકું વાતાવરણ.',
      rainBad: 'વધુ ભેજ કે વરસાદથી લણેલો પાક બગડવાનો ભય છે.',
      windCaution: 'પવનના ઝાપટાંથી દાણા ખરવાનો ભય રહે છે.',
    },
    overall: {
      good: (t) => `શાંત વાતાવરણ, અનુકૂળ તાપમાન (${t}°C) અને વરસાદનો ભય નથી. ખેતી કાર્યો માટે શ્રેષ્ઠ સમય.`,
      rain: (p) => `વરસાદની શક્યતા (${p}%). દવાનો છંટકાવ રોકો અને લણેલો પાક ઢાંકીને રાખો.`,
      heat: (t) => `ગરમ હવામાન (${t}°C). બપોરના તડકામાં છંટકાવ ટાળો અને સવારે કે સાંજે પિયત આપો.`,
      wind: (w) => `પવનવાળું વાતાવરણ (${w} કિમી/કલાક). રાસાયણિક છંટકાવમાં સાવચેતી રાખો.`,
      stable: 'હવામાન સ્થિર છે. પાકના તબક્કા મુજબ કામનું આયોજન કરો.',
    },
    story: {
      morningTitle: '🌅 સવાર',
      afternoonTitle: '☀️ બપોર',
      eveningTitle: '🌇 સાંજ',
      nightTitle: '🌙 રાત',
      morningRain: (p) => `સવારે ભેજ અને વરસાદની શક્યતા (${p}%). સંવેદનશીલ છંટકાવ મુલતવી રાખો.`,
      morningGood: (t) => `ઠંડક અને શાંત સવાર (${t}°C). છંટકાવ અને ખેતકામ માટે ઉત્તમ સમય.`,
      morningMild: (t) => `મંદ પવન સાથે ખુશનુમા સવાર (${t}°C).`,
      afternoonHeat: (t) => `બપોરે તાપમાન ${t}°C સુધી પહોંચશે અને બાષ્પીભવન વધશે.`,
      afternoonRain: (p) => `વાદળછાયું આકાશ અને ઝરમર વરસાદની શક્યતા (${p}%).`,
      afternoonClear: (t, w) => `સ્વચ્છ અને હૂંફાળું વાતાવરણ (${t}°C), પવનની ગતિ ${w} કિમી/કલાક.`,
      eveningRain: (p) => `સાંજે વરસાદની શક્યતા વધશે (${p}%). ખેતરમાં પાણીના નિકાલની ચકાસણી કરો.`,
      eveningCool: (t) => `તાપમાન ઘટીને ${t}°C થશે. સૂર્યાસ્ત પછી પિયત આપવા માટે અનુકૂળ.`,
      nightDesc: (t) => `રાત્રે તાપમાન ઘટીને ${t}°C થશે અને હવામાં ભેજનું પ્રમાણ વધશે.`,
    },
  },
  bn: {
    labels: {
      good: '🟢 ভালো',
      avoid: '🔴 এড়িয়ে চলুন',
      caution: '🟡 সতর্কতা',
      suitable: 'উপযুক্ত',
      goodIrrigate: 'সেচের উপযুক্ত সময়',
      rainReducesIrr: 'বৃষ্টির কারণে সেচের প্রয়োজন কমতে পারে',
      waitIrr: 'অপেক্ষা করা ভালো',
    },
    fieldWork: {
      good: 'ট্র্যাক্টর ও ক্ষেতের সাধারণ কাজকর্মের জন্য আবহাওয়া অত্যন্ত অনুকূল।',
      rainBad: 'ভারী বৃষ্টি ও ক্ষেতে কাদা জমার প্রবল সম্ভাবনা।',
      heatCaution: 'তীব্র তাপপ্রবাহ। দুপুরে শ্রমিক ও গবাদি পশুকে বিশ্রামে রাখুন।',
      windCaution: 'ঝড়ো বাতাসে ধুলো উড়বে এবং মাটির উপরিভাগের আর্দ্রতা কমে যাবে।',
    },
    spraying: {
      good: 'বাতাসের গতি কম এবং বৃষ্টির সম্ভাবনা নেই বললেই চলে।',
      rainBad: (p) => `শীঘ্রই বৃষ্টির সম্ভাবনা (${p}%)। ওষুধের কার্যকারিতা নষ্ট হতে পারে।`,
      windBad: (w) => `প্রবল বাতাস (${w} কিমি/ঘণ্টা)। ওষুধ উড়ে পাশের ফসলের ক্ষতি করতে পারে।`,
      heatBad: (t) => `অতিরিক্ত তাপমাত্রা (${t}°C)। দ্রুত বাষ্পীভবনে পাতা পুড়ে যাওয়ার ঝুঁকি থাকে।`,
      windCaution: (w) => `মাঝারি বাতাস বইছে (${w} কিমি/ঘণ্টা)। স্প্রে করার সময় সতর্ক থাকুন।`,
      rainCaution: (p) => `সামান্য বৃষ্টির সম্ভাবনা (${p}%)। স্প্রে করার আগে আকাশ পর্যবেক্ষণ করুন।`,
      tempCaution: (t) => `উষ্ণ আবহাওয়া (${t}°C)। খুব ভোরে বা বিকেলে স্প্রে করা উত্তম।`,
    },
    irrigation: {
      good: 'বৃষ্টির ঝুঁকি কম এবং মাটি থেকে স্বাভাবিক জল ক্ষয় হচ্ছে।',
      rainCaution: (p) => `প্রাকৃতিক বৃষ্টির সম্ভাবনা রয়েছে (${p}%)। জল ও বিদ্যুৎ সাশ্রয় করুন।`,
      sunCaution: 'দুপুরের কড়া রোদে বাষ্পীভবন বেশি হয়। বিকেলে সেচ দেওয়া ভালো।',
    },
    harvesting: {
      good: 'ফসল তোলার জন্য উপযুক্ত শুষ্ক আবহাওয়া।',
      rainBad: 'অতিরিক্ত আর্দ্রতা বা বৃষ্টিতে কাটা ফসল নষ্ট হওয়ার ঝুঁকি থাকে।',
      windCaution: 'বাতাসের ধাক্কায় মাড়াইয়ের সময় শস্যের ক্ষতি হতে পারে।',
    },
    overall: {
      good: (t) => `শান্ত আবহাওয়া, আরামদায়ক তাপমাত্রা (${t}°C) এবং বৃষ্টির ঝুঁকি নেই। কৃষি কাজের জন্য চমৎকার সময়।`,
      rain: (p) => `বৃষ্টির সম্ভাবনা (${p}%)। স্প্রে বন্ধ রাখুন এবং কাটা ফসল ঢেকে রাখুন।`,
      heat: (t) => `উষ্ণ আবহাওয়া (${t}°C)। দুপুরের তীব্র রোদে স্প্রে এড়িয়ে চলুন এবং পর্যাপ্ত জলসেচ দিন।`,
      wind: (w) => `বাতাস বইছে (${w} কিমি/ঘণ্টা)। রাসায়নিক স্প্রে করার সময় সতর্কতা অবলম্বন করুন।`,
      stable: 'আবহাওয়া স্থিতিশীল। ফসলের বৃদ্ধির পর্যায় অনুযায়ী কাজের পরিকল্পনা করুন।',
    },
    story: {
      morningTitle: '🌅 সকাল',
      afternoonTitle: '☀️ দুপুর',
      eveningTitle: '🌇 বিকেল',
      nightTitle: '🌙 রাত',
      morningRain: (p) => `সকালে আর্দ্রতা ও বৃষ্টির সম্ভাবনা (${p}%)। সংবেদনশীল স্প্রে স্থগিত রাখুন।`,
      morningGood: (t) => `শীতল ও শান্ত সকাল (${t}°C)। স্প্রে ও মাঠের কাজের জন্য সেরা সময়।`,
      morningMild: (t) => `মৃদু বাতাস সহ মনোরম সকাল (${t}°C)।`,
      afternoonHeat: (t) => `দুপুরে তাপমাত্রা ${t}°C পর্যন্ত উঠবে, জল বাষ্পীভবন বাড়বে।`,
      afternoonRain: (p) => `মেঘলা আকাশ ও বৃষ্টির সম্ভাবনা (${p}%)।`,
      afternoonClear: (t, w) => `পরিষ্কার ও রৌদ্রোজ্জ্বল আবহাওয়া (${t}°C), বাতাসের গতিবেগ ${w} কিমি/ঘণ্টা।`,
      eveningRain: (p) => `বিকেলে বৃষ্টির সম্ভাবনা বৃদ্ধি পাচ্ছে (${p}%)। ক্ষেতের নিকাশী নালা পরীক্ষা করুন।`,
      eveningCool: (t) => `তাপমাত্রা হ্রাস পেয়ে ${t}°C হবে। সূর্যাস্তের পর সেচের জন্য উপযুক্ত।`,
      nightDesc: (t) => `রাতে তাপমাত্রা নেমে ${t}°C হবে এবং বাতাসে আর্দ্রতা বাড়বে।`,
    },
  },
  pa: {
    labels: {
      good: '🟢 ਵਧੀਆ',
      avoid: '🔴 ਬਚੋ',
      caution: '🟡 ਸਾਵਧਾਨੀ',
      suitable: 'ਢੁਕਵਾਂ',
      goodIrrigate: 'ਸਿੰਚਾਈ ਲਈ ਸਹੀ ਸਮਾਂ',
      rainReducesIrr: 'ਮੀਂਹ ਕਾਰਨ ਪਾਣੀ ਦੀ ਲੋੜ ਘੱਟ ਸਕਦੀ ਹੈ',
      waitIrr: 'ਉਡੀਕ ਕਰਨਾ ਬਿਹਤਰ',
    },
    fieldWork: {
      good: 'ਟਰੈਕਟਰ ਅਤੇ ਖੇਤ ਦੇ ਕੰਮਾਂ ਲਈ ਮੌਸਮ ਬਹੁਤ ਅਨੁਕੂਲ ਹੈ।',
      rainBad: 'ਭਾਰੀ ਮੀਂਹ ਅਤੇ ਖੇਤ ਵਿੱਚ ਚਿੱਕੜ ਹੋਣ ਦੀ ਜ਼ਿਆਦਾ ਸੰਭਾਵਨਾ।',
      heatCaution: 'ਬਹੁਤ ਜ਼ਿਆਦਾ ਗਰਮੀ। ਦੁਪਹਿਰ ਵੇਲੇ ਮਜ਼ਦੂਰਾਂ ਅਤੇ ਪਸ਼ੂਆਂ ਨੂੰ ਛਾਂ ਵਿੱਚ ਆਰਾਮ ਦਿਓ।',
      windCaution: 'ਤੇਜ਼ ਹਵਾਵਾਂ ਕਾਰਨ ਧੂੜ ਉੱਡੇਗੀ ਅਤੇ ਜ਼ਮੀਨ ਦੀ ਨਮੀ ਸੁੱਕ ਜਾਵੇਗੀ।',
    },
    spraying: {
      good: 'ਹਵਾ ਦੀ ਗਤੀ ਘੱਟ ਹੈ ਅਤੇ ਮੀਂਹ ਦੀ ਸੰਭਾਵਨਾ ਨਹੀਂ ਹੈ।',
      rainBad: (p) => `ਜਲਦੀ ਮੀਂਹ ਪੈਣ ਦੀ ਸੰਭਾਵਨਾ ਹੈ (${p}%)। ਦਵਾਈ ਧੁਲ ਜਾਣ ਦਾ ਖ਼ਤਰਾ ਹੈ।`,
      windBad: (w) => `ਤੇਜ਼ ਹਵਾ (${w} ਕਿਮੀ/ਘੰਟਾ)। ਦਵਾਈ ਉੱਡ ਕੇ ਨਾਲ ਦੀ ਫ਼ਸਲ ਨੂੰ ਨੁਕਸਾਨ ਪਹੁੰਚਾ ਸਕਦੀ ਹੈ।`,
      heatBad: (t) => `ਜ਼ਿਆਦਾ ਤਾਪਮਾਨ (${t}°C)। ਦਵਾਈ ਛੇਤੀ ਭਾਫ਼ ਬਣ ਜਾਵੇਗੀ ਅਤੇ ਪੱਤੇ ਸੜ ਸਕਦੇ ਹਨ।`,
      windCaution: (w) => `ਦਰਮਿਆਨੀ ਹਵਾ ਹੈ (${w} ਕਿਮੀ/ਘੰਟਾ)। ਸਪਰੇਅ ਕਰਦੇ ਸਮੇਂ ਧਿਆਨ ਰੱਖੋ।`,
      rainCaution: (p) => `ਮੀਂਹ ਦੀ ਹਲਕੀ ਸੰਭਾਵਨਾ ਹੈ (${p}%)। ਸਪਰੇਅ ਤੋਂ ਪਹਿਲਾਂ ਅਸਮਾਨ ਦੀ ਜਾਂਚ ਕਰੋ।`,
      tempCaution: (t) => `ਗਰਮ ਮੌਸਮ (${t}°C)। ਸਵੇਰੇ ਜਲਦੀ ਜਾਂ ਸ਼ਾਮ ਨੂੰ ਸਪਰੇਅ ਕਰੋ।`,
    },
    irrigation: {
      good: 'ਮੀਂਹ ਦੀ ਸੰਭਾਵਨਾ ਘੱਟ ਅਤੇ ਖੇਤ ਵਿੱਚੋਂ ਪਾਣੀ ਦਾ ਵਾਸ਼ਪੀਕਰਨ ਆਮ ਹੈ।',
      rainCaution: (p) => `ਕੁਦਰਤੀ ਮੀਂਹ ਪੈਣ ਦੀ ਸੰਭਾਵਨਾ ਹੈ (${p}%)। ਪਾਣੀ ਅਤੇ ਬਿਜਲੀ ਬਚਾਓ।`,
      sunCaution: 'ਦੁਪਹਿਰ ਦੀ ਤੇਜ਼ ਧੁੱਪ ਵਿੱਚ ਪਾਣੀ ਉੱਡ ਜਾਂਦਾ ਹੈ। ਸ਼ਾਮ ਵੇਲੇ ਪਾਣੀ ਦਿਓ।',
    },
    harvesting: {
      good: 'ਵਾਢੀ ਲਈ ਅਨੁਕੂਲ ਖੁਸ਼ਕ ਮੌਸਮ।',
      rainBad: 'ਜ਼ਿਆਦਾ ਨਮੀ ਜਾਂ ਮੀਂਹ ਨਾਲ ਕੱਟੀ ਹੋਈ ਫ਼ਸਲ ਖ਼ਰਾਬ ਹੋਣ ਦਾ ਖ਼ਤਰਾ ਹੈ।',
      windCaution: 'ਤੇਜ਼ ਹਵਾ ਕਾਰਨ ਗਹਾਈ ਦੌਰਾਨ ਦਾਣੇ ਖਿੱਲਰਨ ਦਾ ਖ਼ਤਰਾ ਹੋ ਸਕਦਾ ਹੈ।',
    },
    overall: {
      good: (t) => `ਸ਼ਾਂਤ ਮੌਸਮ, ਸੁਖਾਵਾਂ ਤਾਪਮਾਨ (${t}°C) ਅਤੇ ਮੀਂਹ ਦਾ ਕੋਈ ਖ਼ਤਰਾ ਨਹੀਂ। ਖੇਤੀਬਾੜੀ ਦੇ ਕੰਮਾਂ ਲਈ ਉੱਤਮ ਸਮਾਂ।`,
      rain: (p) => `ਮੀਂਹ ਦੀ ਸੰਭਾਵਨਾ ਹੈ (${p}%)। ਸਪਰੇਅ ਰੋਕੋ ਅਤੇ ਕੱਟੀ ਫ਼ਸਲ ਨੂੰ ਢੱਕ ਕੇ ਰੱਖੋ।`,
      heat: (t) => `ਗਰਮ ਮੌਸਮ (${t}°C)। ਦੁਪਹਿਰ ਵੇਲੇ ਸਪਰੇਅ ਤੋਂ ਬਚੋ ਅਤੇ ਫ਼ਸਲ ਨੂੰ ਸਹੀ ਪਾਣੀ ਦਿਓ।`,
      wind: (w) => `ਹਵਾ ਚੱਲ ਰਹੀ ਹੈ (${w} ਕਿਮੀ/ਘੰਟਾ)। ਦਵਾਈ ਦੀ ਸਪਰੇਅ ਕਰਦੇ ਸਮੇਂ ਸਾਵਧਾਨੀ ਵਰਤੋ।`,
      stable: 'ਮੌਸਮ ਸਥਿਰ ਹੈ। ਫ਼ਸਲ ਦੇ ਵਾਧੇ ਦੇ ਪੜਾਅ ਅਨੁਸਾਰ ਕੰਮਾਂ ਦੀ ਯੋਜਨਾ ਬਣਾਓ।',
    },
    story: {
      morningTitle: '🌅 ਸਵੇਰ',
      afternoonTitle: '☀️ ਦੁਪਹਿਰ',
      eveningTitle: '🌇 ਸ਼ਾਮ',
      nightTitle: '🌙 ਰਾਤ',
      morningRain: (p) => `ਸਵੇਰੇ ਨਮੀ ਅਤੇ ਮੀਂਹ ਦੀ ਸੰਭਾਵਨਾ (${p}%)। ਜ਼ਰੂਰੀ ਸਪਰੇਅ ਮੁਲਤਵੀ ਕਰੋ।`,
      morningGood: (t) => `ਠੰਢੀ ਅਤੇ ਸ਼ਾਂਤ ਸਵੇਰ (${t}°C)। ਸਪਰੇਅ ਅਤੇ ਖੇਤ ਦੇ ਕੰਮਾਂ ਲਈ ਸਭ ਤੋਂ ਵਧੀਆ ਸਮਾਂ।`,
      morningMild: (t) => `ਹਲਕੀ ਹਵਾ ਨਾਲ ਸੁਹਾਵਣੀ ਸਵੇਰ (${t}°C)।`,
      afternoonHeat: (t) => `ਦੁਪਹਿਰ ਨੂੰ ਤਾਪਮਾਨ ${t}°C ਤੱਕ ਪਹੁੰਚੇਗਾ, ਪਾਣੀ ਦੀ ਖਪਤ ਵਧੇਗੀ।`,
      afternoonRain: (p) => `ਬੱਦਲਵਾਈ ਅਤੇ ਮੀਂਹ ਦੀ ਸੰਭਾਵਨਾ (${p}%)।`,
      afternoonClear: (t, w) => `ਸਾਫ਼ ਅਤੇ ਗਰਮ ਮੌਸਮ (${t}°C), ਹਵਾ ਦੀ ਗਤੀ ${w} ਕਿਮੀ/ਘੰਟਾ।`,
      eveningRain: (p) => `ਸ਼ਾਮ ਨੂੰ ਮੀਂਹ ਦੀ ਸੰਭਾਵਨਾ ਵਧੇਗੀ (${p}%)। ਖੇਤ ਦੇ ਨਿਕਾਸੀ ਪ੍ਰਬੰਧ ਦੀ ਜਾਂਚ ਕਰੋ।`,
      eveningCool: (t) => `ਤਾਪਮਾਨ ਘਟ ਕੇ ${t}°C ਹੋ ਜਾਵੇਗਾ। ਸੂਰਜ ਡੁੱਬਣ ਤੋਂ ਬਾਅਦ ਪਾਣੀ ਦੇਣ ਲਈ ਢੁਕਵਾਂ।`,
      nightDesc: (t) => `ਰਾਤ ਨੂੰ ਤਾਪਮਾਨ ${t}°C ਤੱਕ ਡਿੱਗੇਗਾ ਅਤੇ ਹਵਾ ਵਿੱਚ ਨਮੀ ਵਧੇਗੀ।`,
    },
  },
  or: {
    labels: {
      good: '🟢 ଉତ୍ତମ',
      avoid: '🔴 ଏଡ଼ାନ୍ତୁ',
      caution: '🟡 ସତର୍କତା',
      suitable: 'ଅନୁକୂଳ',
      goodIrrigate: 'ଜଳସେଚନ ପାଇଁ ଉତ୍ତମ ସମୟ',
      rainReducesIrr: 'ବର୍ଷା ଯୋଗୁଁ ଜଳ ଆବଶ୍ୟକତା କମିପାରେ',
      waitIrr: 'ଅପେକ୍ଷା କରିବା ଭଲ',
    },
    fieldWork: {
      good: 'ଟ୍ରାକ୍ଟର ଓ ଜମି କାମ ପାଇଁ ପାଣିପାଗ ଖୁବ୍ ଅନୁକୂଳ ରହିଛି।',
      rainBad: 'ପ୍ରବଳ ବର୍ଷା ଓ ଜମି କାଦୁଅ ହେବାର ଆଶଙ୍କା ଅଧିକ।',
      heatCaution: 'ଅତ୍ୟଧିକ ଖରା। ମଧ୍ୟାହ୍ନରେ ଶ୍ରମିକ ଓ ଗୃହପାଳିତ ପଶୁଙ୍କୁ ବିଶ୍ରାମ ଦିଅନ୍ତୁ।',
      windCaution: 'ପବନ ଯୋଗୁଁ ଧୂଳି ଉଡ଼ିବ ଓ ମାଟିର ଆର୍ଦ୍ରତା ଶୁଖିଯିବ।',
    },
    spraying: {
      good: 'ପବନର ଗତି ମନ୍ଥର ଏବଂ ବର୍ଷାର ସମ୍ଭାବନା ନାହିଁ।',
      rainBad: (p) => `ଶୀଘ୍ର ବର୍ଷା ହେବାର ସମ୍ଭାବନା ଅଛି (${p}%)। ଔଷଧ ଧୋଇଯିବାର ଭୟ ରହିଛି।`,
      windBad: (w) => `ପ୍ରବଳ ପବନ (${w} କିମି/ଘଣ୍ଟା)। ଔଷଧ ଉଡ଼ି ଅନ୍ୟ ଫସଲକୁ କ୍ଷତି ପହଞ୍ଚାଇପାରେ।`,
      heatBad: (t) => `ଅଧିକ ତାପମାତ୍ରା (${t}°C)। ଔଷଧ ବାଷ୍ପୀଭୂତ ହୋଇ ପତ୍ର ପୋଡ଼ିଯାଇପାରେ।`,
      windCaution: (w) => `ମଧ୍ୟମ ପବନ ବହୁଛି (${w} କିମି/ଘଣ୍ଟା)। ସ୍ପ୍ରେ କରିବା ସମୟରେ ସତର୍କ ରୁହନ୍ତୁ।`,
      rainCaution: (p) => `ସାମାନ୍ୟ ବର୍ଷା ଆଶଙ୍କା (${p}%)। ସ୍ପ୍ରେ କରିବା ପୂର୍ବରୁ ଆକାଶ ଯାଞ୍ଚ କରନ୍ତୁ।`,
      tempCaution: (t) => `ଗରମ ପାଗ (${t}°C)। ସକାଳେ କିମ୍ବା ସନ୍ଧ୍ୟାରେ ସ୍ପ୍ରେ କରିବା ଉଚିତ।`,
    },
    irrigation: {
      good: 'ବର୍ଷା ସମ୍ଭାବନା କମ୍ ଓ ମାଟିରୁ ଜଳ କ୍ଷୟ ସ୍ୱାଭାବିକ ଅଛି।',
      rainCaution: (p) => `ପ୍ରାକୃତିକ ବର୍ଷା ହୋଇପାରେ (${p}%)। ପାଣି ଓ ବିଦ୍ୟୁତ୍ ସଞ୍ଚୟ କରନ୍ତୁ।`,
      sunCaution: 'ମଧ୍ୟାହ୍ନ ଖରାରେ ବାଷ୍ପୀଭବନ ଅଧିକ ହୁଏ। ସନ୍ଧ୍ୟାରେ ପାଣି ଦିଅନ୍ତୁ।',
    },
    harvesting: {
      good: 'ଅମଳ ପାଇଁ ଅନୁକୂଳ ଶୁଖିଲା ପାଣିପାଗ।',
      rainBad: 'ଅଧିକ ଆର୍ଦ୍ରତା ବା ବର୍ଷାରେ ଅମଳ ହୋଇଥିବା ଫସଲ ନଷ୍ଟ ହୋଇପାରେ।',
      windCaution: 'ପବନର ଝଟକା ଯୋଗୁଁ ଅମଳ ସମୟରେ ଶସ୍ୟ ନଷ୍ଟ ହୋଇପାରେ।',
    },
    overall: {
      good: (t) => `ଶାନ୍ତ ପାଣିପାଗ, ଅନୁକୂଳ ତାପମାତ୍ରା (${t}°C) ଓ ବର୍ଷା ଭୟ ନାହିଁ। କୃଷି କାର୍ଯ୍ୟ ପାଇଁ ଶ୍ରେଷ୍ଠ ସମୟ।`,
      rain: (p) => `ବର୍ଷା ସମ୍ଭାବନା ଅଛି (${p}%)। ସ୍ପ୍ରେ ବନ୍ଦ ରଖନ୍ତୁ ଓ ଅମଳ ଫସଲ ଘୋଡ଼ାଇ ରଖନ୍ତୁ।`,
      heat: (t) => `ଗରମ ପାଗ (${t}°C)। ମଧ୍ୟାହ୍ନରେ ସ୍ପ୍ରେ କରନ୍ତୁ ନାହିଁ ଏବଂ ଫସଲରେ ଠିକ୍ ଭାବେ ଜଳସେଚନ କରନ୍ତୁ।`,
      wind: (w) => `ପବନ ବହୁଛି (${w} କିମି/ଘଣ୍ଟା)। ରାସାୟନିକ ସ୍ପ୍ରେ ବେଳେ ସାବଧାନତା ଅବଲମ୍ବନ କରନ୍ତୁ।`,
      stable: 'ପାଣିପାଗ ସ୍ଥିର ଅଛି। ଫସଲର ଅବସ୍ଥା ଅନୁସାରେ କାମର ଯୋଜନା କରନ୍ତୁ।',
    },
    story: {
      morningTitle: '🌅 ସକାଳ',
      afternoonTitle: '☀️ ମଧ୍ୟାହ୍ନ',
      eveningTitle: '🌇 ସନ୍ଧ୍ୟା',
      nightTitle: '🌙 ରାତି',
      morningRain: (p) => `ସକାଳେ ଆର୍ଦ୍ରତା ଓ ବର୍ଷା ସମ୍ଭାବନା (${p}%)। ଜରୁରୀ ସ୍ପ୍ରେ ସ୍ଥଗିତ ରଖନ୍ତୁ।`,
      morningGood: (t) => `ଶୀତଳ ଓ ଶାନ୍ତ ସକାଳ (${t}°C)। ସ୍ପ୍ରେ ଓ ଜମି କାମ ପାଇଁ ସର୍ବୋତ୍ତମ ସମୟ।`,
      morningMild: (t) => `ମୃଦୁ ପବନ ସହ ସୁନ୍ଦର ସକାଳ (${t}°C)।`,
      afternoonHeat: (t) => `ମଧ୍ୟାହ୍ନରେ ତାପମାତ୍ରା ${t}°C ହେବ, ଜଳକ୍ଷୟ ବଢ଼ିବ।`,
      afternoonRain: (p) => `ମେଘୁଆ ପାଗ ଓ ବର୍ଷା ସମ୍ଭାବନା (${p}%)।`,
      afternoonClear: (t, w) => `ନିର୍ମଳ ଓ ଉଷୁମ ପାଗ (${t}°C), ପବନର ବେଗ ${w} କିମି/ଘଣ୍ଟା।`,
      eveningRain: (p) => `ସନ୍ଧ୍ୟାରେ ବର୍ଷା ସମ୍ଭାବନା ବଢ଼ିବ (${p}%)। ଜମିର ଜଳ ନିଷ୍କାସନ ଯାଞ୍ଚ କରନ୍ତୁ।`,
      eveningCool: (t) => `ତାପମାତ୍ରା କମି ${t}°C ହେବ। ସୂର୍ଯ୍ୟାସ୍ତ ପରେ ଜଳସେଚନ ପାଇଁ ଉପଯୁକ୍ତ।`,
      nightDesc: (t) => `ରାତିରେ ତାପମାତ୍ରା ${t}°C କୁ ଖସିବ ଏବଂ ଆର୍ଦ୍ରତା ବୃଦ୍ଧି ପାଇବ।`,
    },
  },
  as: {
    labels: {
      good: '🟢 ভাল',
      avoid: '🔴 এৰাই চলক',
      caution: '🟡 সাৱধানতা',
      suitable: 'উপযুক্ত',
      goodIrrigate: 'জলসিঞ্চনৰ উপযুক্ত সময়',
      rainReducesIrr: 'বৰষুণৰ বাবে পানীৰ প্ৰয়োজন কমিব পাৰে',
      waitIrr: 'অপেক্ষা কৰা ভাল',
    },
    fieldWork: {
      good: 'ট্ৰেক্টৰ আৰু পথাৰৰ কাম-কাজৰ বাবে বতৰ অতি অনুকূল।',
      rainBad: 'প্ৰবল বৰষুণ আৰু পথাৰত বোকা হোৱাৰ সম্ভাৱনা অধিক।',
      heatCaution: 'প্ৰখৰ ৰ’দ। দুপৰীয়া শ্ৰমিক আৰু গৰু-মহক জিৰণি দিয়ক।',
      windCaution: 'বতাহৰ বাবে ধূলি উৰিব আৰু মাটিৰ আৰ্দ্ৰতা শুকাই যাব।',
    },
    spraying: {
      good: 'বতাহৰ গতি মন্থৰ আৰু বৰষুণৰ সম্ভাৱনা নাই।',
      rainBad: (p) => `শীঘ্ৰে বৰষুণৰ সম্ভাৱনা (${p}%)। দৰব ধুই যোৱাৰ আশংকা আছে।`,
      windBad: (w) => `প্ৰবল বতাহ (${w} কিমি/ঘণ্টা)। দৰব উৰি কাষৰ শস্যৰ ক্ষতি কৰিব পাৰে।`,
      heatBad: (t) => `অধিক উত্তাপ (${t}°C)। দৰব সোনকালে বাষ্পীভূত হৈ পাত পুৰি যাব পাৰে।`,
      windCaution: (w) => `মজলীয়া বতাহ বলিছে (${w} কিমি/ঘণ্টা)। স্প্ৰে’ কৰোঁতে সাৱধান হওক।`,
      rainCaution: (p) => `সামান্য বৰষুণৰ আশংকা (${p}%)। স্প্ৰে’ কৰাৰ আগতে আকাশ পৰীক্ষা কৰক।`,
      tempCaution: (t) => `উষ্ণ বতৰ (${t}°C)। ৰাতিপুৱা বা গধূলি স্প্ৰে’ কৰা উচিত।`,
    },
    irrigation: {
      good: 'বৰষুণৰ সম্ভাৱনা কম আৰু মাটিৰ পৰা পানীৰ ক্ষয় স্বাভাৱিক।',
      rainCaution: (p) => `প্ৰাকৃতিক বৰষুণৰ সম্ভাৱনা আছে (${p}%)। পানী আৰু বিদ্যুৎ ৰাহি কৰক।`,
      sunCaution: 'দুপৰীয়াৰ চোকা ৰ’দত পানী সোনকালে শুকায়। গধূলি পানী দিয়ক।',
    },
    harvesting: {
      good: 'শস্য চপোৱাৰ বাবে অনুকূল শুকান বতৰ।',
      rainBad: 'অধিক আৰ্দ্ৰতা বা বৰষুণত চপোৱা শস্য নষ্ট হ’ব পাৰে।',
      windCaution: 'বতাহৰ বাবে মৰণা মৰাৰ সময়ত শস্যৰ ক্ষতি হ’ব পাৰে।',
    },
    overall: {
      good: (t) => `শান্ত বতৰ, আৰামদায়ক উষ্ণতা (${t}°C) আৰু বৰষুণৰ আশংকা নাই। কৃষি কাৰ্যৰ বাবে উত্তম সময়।`,
      rain: (p) => `বৰষুণৰ সম্ভাৱনা আছে (${p}%)। স্প্ৰে’ বন্ধ ৰাখক আৰু চপোৱা শস্য ঢাকি ৰাখক।`,
      heat: (t) => `গৰম বতৰ (${t}°C)। দুপৰীয়া স্প্ৰে’ নকৰিব আৰু শস্যত সঠিকভাৱে পানী দিয়ক।`,
      wind: (w) => `বতাহ বলিছে (${w} কিমি/ঘণ্টা)। ৰাসায়নিক স্প্ৰে’ কৰোঁতে সতৰ্ক হওক।`,
      stable: 'বতৰ সুস্থিৰ। শস্যৰ বৃদ্ধি অনুসৰি কামৰ পৰিকল্পনা কৰক।',
    },
    story: {
      morningTitle: '🌅 ৰাতিপুৱা',
      afternoonTitle: '☀️ দুপৰীয়া',
      eveningTitle: '🌇 গধূলি',
      nightTitle: '🌙 ৰাতি',
      morningRain: (p) => `ৰাতিপুৱা আৰ্দ্ৰতা আৰু বৰষুণৰ সম্ভাৱনা (${p}%)। জৰুৰী স্প্ৰে’ স্থগিত ৰাখক।`,
      morningGood: (t) => `শীতল আৰু শান্ত পুৱা (${t}°C)। স্প্ৰে’ আৰু পথাৰৰ কামৰ বাবে সৰ্বোত্তম সময়।`,
      morningMild: (t) => `মৃদু বতাহৰ সৈতে সুন্দৰ পুৱা (${t}°C)।`,
      afternoonHeat: (t) => `দুপৰীয়া উষ্ণতা ${t}°C লৈ বৃদ্ধি পাব, পানীৰ অপচয় বাঢ়িব।`,
      afternoonRain: (p) => `ডাৱৰীয়া বতৰ আৰু বৰষুণৰ সম্ভাৱনা (${p}%)।`,
      afternoonClear: (t, w) => `পৰিষ্কাৰ আৰু উমাল বতৰ (${t}°C), বতাহৰ গতিবেগ ${w} কিমি/ঘণ্টা।`,
      eveningRain: (p) => `গধূলি বৰষুণৰ সম্ভাৱনা বাঢ়িব (${p}%)। পথাৰৰ নলা পৰীক্ষা কৰক।`,
      eveningCool: (t) => `উষ্ণতা কমি ${t}°C হ’ব। সূৰ্যাস্তৰ পিছত জলসিঞ্চনৰ বাবে উপযোগী।`,
      nightDesc: (t) => `ৰাতি উষ্ণতা ${t}°C লৈ নামিব আৰু বতাহত আৰ্দ্ৰতা বাঢ়িব।`,
    },
  },
  ur: {
    labels: {
      good: '🟢 بہترین',
      avoid: '🔴 گریز کریں',
      caution: '🟡 احتیاط',
      suitable: 'مناسب',
      goodIrrigate: 'آبپاشی کا بہترین وقت',
      rainReducesIrr: 'بارش کی وجہ سے آبپاشی کی ضرورت کم ہو سکتی ہے',
      waitIrr: 'انتظار کرنا بہتر ہے',
    },
    fieldWork: {
      good: 'ٹریکٹر اور کھیت کے کاموں کے لیے موسم انتہائی سازگار ہے۔',
      rainBad: 'تیز بارش اور کھیت میں کیچڑ ہونے کا شدید امکان۔',
      heatCaution: 'شدید گرمی۔ دوپہر کے وقت مزدوروں اور مویشیوں کو آرام دیں۔',
      windCaution: 'تیز ہوا کی وجہ سے گرد اڑے گی اور مٹی کی نمی کم ہو جائے گی۔',
    },
    spraying: {
      good: 'ہوا کی رفتار کم ہے اور بارش کا امکان نہیں ہے۔',
      rainBad: (p) => `جلد بارش کا امکان ہے (${p}%)۔ دوا بہہ جانے کا خطرہ ہے۔`,
      windBad: (w) => `تیز ہوا (${w} کلومیٹر/گھنٹہ)۔ دوا اڑ کر ملحقہ فصلوں کو نقصان پہنچا سکتی ہے۔`,
      heatBad: (t) => `زیادہ درجہ حرارت (${t}°C)۔ دوا جلدی بخارات بن جائے گی اور پتے جھلس سکتے ہیں۔`,
      windCaution: (w) => `معتدل ہوا چل رہی ہے (${w} کلومیٹر/گھنٹہ)۔ اسپرے کرتے وقت محتاط رہیں۔`,
      rainCaution: (p) => `بارش کا ہلکا امکان ہے (${p}%)۔ اسپرے سے پہلے مطلع چیک کریں۔`,
      tempCaution: (t) => `گرم موسم (${t}°C)۔ صبح سویرے یا شام کے وقت اسپرے کریں۔`,
    },
    irrigation: {
      good: 'بارش کا امکان کم اور مٹی سے نمی کا اخراج معمول کے مطابق ہے۔',
      rainCaution: (p) => `قدرتی بارش متوقع ہے (${p}%)۔ پانی اور بجلی کی بچت کریں۔`,
      sunCaution: 'دوپہر کی تیز دھوپ میں پانی ضائع ہوتا ہے۔ شام کے وقت پانی دیں۔',
    },
    harvesting: {
      good: 'کٹائی کے لیے موزوں خشک موسم۔',
      rainBad: 'زیادہ نمی یا بارش سے کٹی ہوئی فصل خراب ہونے کا اندیشہ ہے۔',
      windCaution: 'تیز ہوا کے جھونکوں سے گہائی کے دوران اناج ضائع ہو سکتا ہے۔',
    },
    overall: {
      good: (t) => `پرامن موسم، خوشگوار درجہ حرارت (${t}°C) اور بارش کا خطرہ نہیں۔ زرعی کاموں کے لیے بہترین وقت۔`,
      rain: (p) => `بارش کا امکان ہے (${p}%)۔ اسپرے روک دیں اور کٹی فصل کو ڈھانپ دیں۔`,
      heat: (t) => `گرم موسم (${t}°C)۔ دوپہر میں اسپرے سے گریز کریں اور فصل کو مناسب پانی دیں۔`,
      wind: (w) => `ہوا چل رہی ہے (${w} کلومیٹر/گھنٹہ)۔ کیمیائی اسپرے میں احتیاط برتیں۔`,
      stable: 'موسم مستحکم ہے۔ فصل کی ضروریات کے مطابق کام کی منصوبہ بندی کریں۔',
    },
    story: {
      morningTitle: '🌅 صبح',
      afternoonTitle: '☀️ دوپہر',
      eveningTitle: '🌇 شام',
      nightTitle: '🌙 رات',
      morningRain: (p) => `صبح نمی اور بارش کا امکان (${p}%)۔ ضروری اسپرے مؤخر کریں۔`,
      morningGood: (t) => `ٹھنڈی اور پرسکون صبح (${t}°C)۔ اسپرے اور کھیت کے کاموں کے لیے بہترین وقت۔`,
      morningMild: (t) => `ہلکی ہوا کے ساتھ خوشگوار صبح (${t}°C)۔`,
      afternoonHeat: (t) => `دوپہر کو درجہ حرارت ${t}°C تک پہنچے گا، پانی کا اخراج بڑھے گا۔`,
      afternoonRain: (p) => `ابر آلود مطلع اور بارش کا امکان (${p}%)۔`,
      afternoonClear: (t, w) => `صاف اور گرم موسم (${t}°C)، ہوا کی رفتار ${w} کلومیٹر/گھنٹہ۔`,
      eveningRain: (p) => `شام کو بارش کا امکان بڑھے گا (${p}%)۔ نکاسی آب کا معائنہ کریں۔`,
      eveningCool: (t) => `درجہ حرارت گر کر ${t}°C ہو جائے گا۔ غروب آفتاب کے بعد آبپاشی کے لیے موزوں۔`,
      nightDesc: (t) => `رات کو درجہ حرارت ${t}°C تک گرے گا اور ہوا میں نمی بڑھے گی۔`,
    },
  },
  pt: {
    labels: {
      good: '🟢 Bom',
      avoid: '🔴 Evitar',
      caution: '🟡 Atenção',
      suitable: 'Adequado',
      goodIrrigate: 'Bom momento para irrigar',
      rainReducesIrr: 'Chuva pode reduzir necessidade de irrigação',
      waitIrr: 'Recomenda-se aguardar',
    },
    fieldWork: {
      good: 'Condições excelentes para operações com trator e trabalho de campo.',
      rainBad: 'Alta probabilidade de chuva e solo encharcado.',
      heatCaution: 'Calor excessivo. Descanse trabalhadores e animais nos horários de pico solar.',
      windCaution: 'Rajadas de vento fortes podem levantar poeira e dessecar o solo superficial.',
    },
    spraying: {
      good: 'Vento brando e risco mínimo de precipitação.',
      rainBad: (p) => `Chuva iminente (${p}%). O defensivo será lavado e perdido.`,
      windBad: (w) => `Vento forte (${w} km/h). Risco de deriva excessiva para lavouras vizinhas.`,
      heatBad: (t) => `Temperatura elevada (${t}°C). Rápida evaporação das gotas e risco de fitotoxicidade.`,
      windCaution: (w) => `Vento moderado (${w} km/h). Aumente a atenção durante a pulverização.`,
      rainCaution: (p) => `Pequena chance de chuva (${p}%). Avalie o céu antes de aplicar.`,
      tempCaution: (t) => `Clima quente (${t}°C). Dê preferência às primeiras horas da manhã ou fim de tarde.`,
    },
    irrigation: {
      good: 'Baixa probabilidade de chuva e evapotranspiração moderada.',
      rainCaution: (p) => `Chuva natural provável (${p}%). Economize água e energia.`,
      sunCaution: 'Sol forte do meio-dia causa alta evaporação. Irrigue ao entardecer.',
    },
    harvesting: {
      good: 'Lavoura seca com baixo risco de umidade.',
      rainBad: 'Excesso de umidade ou chuva pode deteriorar os grãos colhidos.',
      windCaution: 'Rajadas de vento podem provocar perdas no recolhimento e trilha.',
    },
    overall: {
      good: (t) => `Tempo estável, temperatura agradável (${t}°C) e sem risco de chuva. Ótima janela para manejo agrícola.`,
      rain: (p) => `Chuva prevista (${p}%). Interrompa pulverizações e proteja a colheita.`,
      heat: (t) => `Calor intenso (${t}°C). Evite pulverizações no meio do dia e mantenha a irrigação em dia.`,
      wind: (w) => `Vento moderado (${w} km/h). Atenção redobrada na deriva de defensivos.`,
      stable: 'Condições estáveis. Planeje os tratos culturais de acordo com o estágio da lavoura.',
    },
    story: {
      morningTitle: '🌅 Manhã',
      afternoonTitle: '☀️ Tarde',
      eveningTitle: '🌇 Fim de Tarde',
      nightTitle: '🌙 Noite',
      morningRain: (p) => `Umidade matinal com chance de chuva (${p}%). Adie pulverizações sensíveis.`,
      morningGood: (t) => `Ameno e calmo (${t}°C). Janela ideal para pulverização e trabalho no campo.`,
      morningMild: (t) => `Manhã agradável (${t}°C) com brisa leve.`,
      afternoonHeat: (t) => `Calor atinge ${t}°C com aumento da taxa de evapotranspiração.`,
      afternoonRain: (p) => `Nublado com possibilidade de pancadas de chuva (${p}%).`,
      afternoonClear: (t, w) => `Tempo aberto e quente (${t}°C) com vento constante a ${w} km/h.`,
      eveningRain: (p) => `Chances de chuva aumentam (${p}%). Verifique a drenagem da área.`,
      eveningCool: (t) => `Temperatura cai para ${t}°C. Momento propício para irrigação pós-pôr do sol.`,
      nightDesc: (t) => `Temperaturas baixam para ${t}°C com elevação da umidade relativa do ar.`,
    },
  },
  ru: {
    labels: {
      good: '🟢 Благоприятно',
      avoid: '🔴 Не рекомендуется',
      caution: '🟡 Внимание',
      suitable: 'Подходит',
      goodIrrigate: 'Хорошее время для полива',
      rainReducesIrr: 'Дождь снижает потребность в орошении',
      waitIrr: 'Рекомендуется подождать',
    },
    fieldWork: {
      good: 'Отличные погодные условия для механизированных и ручных полевых работ.',
      rainBad: 'Высокая вероятность осадков и переувлажнения почвы.',
      heatCaution: 'Сильная жара. Обеспечьте отдых полевым работникам в полдень.',
      windCaution: 'Порывистый ветер может высушить верхний слой почвы и поднять пыль.',
    },
    spraying: {
      good: 'Слабый ветер и минимальная вероятность осадков.',
      rainBad: (p) => `Высокая вероятность дождя (${p}%). Препарат смоется с листьев.`,
      windBad: (w) => `Сильный ветер (${w} км/ч). Высокий снос рабочего раствора на соседние культуры.`,
      heatBad: (t) => `Высокая температура (${t}°C). Быстрое испарение капель и риск ожога листьев.`,
      windCaution: (w) => `Умеренный ветер (${w} км/ч). Соблюдайте осторожность при обработке.`,
      rainCaution: (p) => `Небольшая вероятность дождя (${p}%). Оцените состояние неба перед опрыскиванием.`,
      tempCaution: (t) => `Теплая погода (${t}°C). Рекомендуется опрыскивание рано утром или вечером.`,
    },
    irrigation: {
      good: 'Низкая вероятность дождя и умеренное испарение влаги.',
      rainCaution: (p) => `Ожидаются осадки (${p}%). Сэкономьте воду и ресурсы.`,
      sunCaution: 'Полуденное солнце вызывает сильное испарение. Поливайте вечером.',
    },
    harvesting: {
      good: 'Сухая растительность и минимальный риск влажности.',
      rainBad: 'Повышенная влажность или дождь могут испортить собранный урожай.',
      windCaution: 'Порывы ветра могут вызвать потери зерна при уборке и обмолоте.',
    },
    overall: {
      good: (t) => `Спокойные условия, комфортная температура (${t}°C) и сухая погода. Отличное окно для агротехнических работ.`,
      rain: (p) => `Ожидается дождь (${p}%). Приостановите химобработку и укройте урожай.`,
      heat: (t) => `Жаркая погода (${t}°C). Избегайте дневных обработок и обеспечьте своевременный полив.`,
      wind: (w) => `Ветрено (${w} км/ч). Контролируйте снос химических препаратов.`,
      stable: 'Стабильные условия. Планируйте работы в зависимости от фазы развития культуры.',
    },
    story: {
      morningTitle: '🌅 Утро',
      afternoonTitle: '☀️ День',
      eveningTitle: '🌇 Вечер',
      nightTitle: '🌙 Ночь',
      morningRain: (p) => `Утренняя сырость с вероятностью дождя (${p}%). Отложите чувствительные обработки.`,
      morningGood: (t) => `Прохладное и тихое утро (${t}°C). Идеальное время для опрыскивания и полевых работ.`,
      morningMild: (t) => `Приятное утро (${t}°C) с легким ветерком.`,
      afternoonHeat: (t) => `Пик жары достигает ${t}°C, увеличиваются потери влаги.`,
      afternoonRain: (p) => `Облачно, возможны дождевые осадки (${p}%).`,
      afternoonClear: (t, w) => `Ясно и тепло (${t}°C), умеренный ветер со скоростью ${w} км/ч.`,
      eveningRain: (p) => `Вероятность осадков повышается (${p}%). Проверьте дренажные каналы.`,
      eveningCool: (t) => `Температура снижается до ${t}°C. Благоприятно для вечернего полива.`,
      nightDesc: (t) => `Ночью температура опустится до ${t}°C, относительная влажность воздуха возрастет.`,
    },
  },
  zh: {
    labels: {
      good: '🟢 适宜',
      avoid: '🔴 避免',
      caution: '🟡 注意',
      suitable: '适宜作业',
      goodIrrigate: '适宜灌溉时段',
      rainReducesIrr: '降雨将补充土壤水分，减少灌溉需求',
      waitIrr: '建议暂缓',
    },
    fieldWork: {
      good: '气象条件优良，极利于农机下田和田间作业。',
      rainBad: '降雨概率高，田间泥泞易打滑，不宜机械作业。',
      heatCaution: '高温炎热，午间请合理安排农工与牲畜避暑歇凉。',
      windCaution: '阵风较大可能吹扬尘土并加速表层水分失墒。',
    },
    spraying: {
      good: '风速轻缓，降雨概率低，喷洒条件良好。',
      rainBad: (p) => `即将降雨 (${p}%)，药液易被冲刷流失，严禁喷洒。`,
      windBad: (w) => `大风 (${w} km/h)，极易造成药雾漂移引发临近作物药害。`,
      heatBad: (t) => `高温达 ${t}°C，雾滴蒸发过快易引起灼叶药害。`,
      windCaution: (w) => `风力偏大 (${w} km/h)，喷洒作业时请严格控制喷头高度防漂移。`,
      rainCaution: (p) => `有轻微降水可能 (${p}%)，请在作业前观察天色云系。`,
      tempCaution: (t) => `气温偏暖 (${t}°C)，建议避开午间高温，选择清晨或傍晚喷药。`,
    },
    irrigation: {
      good: '降雨概率极低且田间蒸发平稳，适宜补灌。',
      rainCaution: (p) => `预测有天然降水 (${p}%)，可节约灌溉用水与电能。`,
      sunCaution: '午间强光暴晒蒸发剧烈，建议改在傍晚落日后灌溉。',
    },
    harvesting: {
      good: '田间冠层干燥，湿度极低，适宜机收与晾晒。',
      rainBad: '高湿或降雨易导致收割谷物发霉受损。',
      windCaution: '强阵风可能引起收割脱粒损失。',
    },
    overall: {
      good: (t) => `天气晴好平稳，温度适中 (${t}°C)，降雨风险低，是开展田间农事的黄金窗口期。`,
      rain: (p) => `有降雨可能 (${p}%)，请停止植保喷药并遮盖已收获农产品。`,
      heat: (t) => `天气酷热 (${t}°C)，避免午间高温作业，注意早晚适时灌溉补水。`,
      wind: (w) => `风力明显 (${w} km/h)，农药喷施作业时须防范雾滴漂移。`,
      stable: '气象指标平稳，请结合当前作物品种及生育期合理统筹农事。',
    },
    story: {
      morningTitle: '🌅 早晨',
      afternoonTitle: '☀️ 下午',
      eveningTitle: '🌇 傍晚',
      nightTitle: '🌙 夜间',
      morningRain: (p) => `清晨湿度偏大且有降雨风险 (${p}%)，请推迟敏感药剂喷洒。`,
      morningGood: (t) => `晨间清凉平静 (${t}°C)，是植保喷药与农活作业的最佳时段。`,
      morningMild: (t) => `晨风轻拂，温度温和舒适 (${t}°C)。`,
      afternoonHeat: (t) => `午后最高气温攀升至 ${t}°C，农田水分蒸腾耗散加剧。`,
      afternoonRain: (p) => `午后多云，局地可能有阵雨 (${p}%)。`,
      afternoonClear: (t, w) => `晴朗温暖 (${t}°C)，伴随稳劲风速 (${w} km/h)。`,
      eveningRain: (p) => `傍晚降水概率有所上升 (${p}%)，请巡查田间排涝沟渠。`,
      eveningCool: (t) => `日落后气温回落至 ${t}°C，适宜进行田间夜灌。`,
      nightDesc: (t) => `夜间最低气温降至 ${t}°C，相对湿度逐渐回升。`,
    },
  },
};

function getDict(lang: Language): GuidanceLocaleDict {
  const norm = normalizeLang(lang);
  return GUIDANCE_DICTS[norm] || GUIDANCE_DICTS.en;
}

export function computeFarmGuidance(
  selectedPoint: HourlyForecastPoint | null,
  lang: Language
): LocalizedFarmGuidance {
  const dict = getDict(lang);

  if (!selectedPoint) {
    return {
      overallAdvice: dict.overall.stable,
      fieldWork: { status: dict.labels.suitable, tone: 'good', reason: dict.fieldWork.good },
      irrigation: { status: dict.labels.goodIrrigate, tone: 'good', reason: dict.irrigation.good },
      spraying: { status: dict.labels.good, tone: 'good', reason: dict.spraying.good },
      harvesting: { status: dict.labels.suitable, tone: 'good', reason: dict.harvesting.good },
    };
  }

  const { temp, rainProb, windSpeedKmh, humidity, evapotranspiration } = selectedPoint;

  interface OpItem {
    status: string;
    tone: LocalizedTone;
    reason: string;
  }

  // 1. Spraying
  let spraying: OpItem = { status: dict.labels.good, tone: 'good', reason: dict.spraying.good };
  if (rainProb >= 40) {
    spraying = { status: dict.labels.avoid, tone: 'bad', reason: dict.spraying.rainBad(rainProb) };
  } else if (windSpeedKmh > 20) {
    spraying = { status: dict.labels.avoid, tone: 'bad', reason: dict.spraying.windBad(windSpeedKmh) };
  } else if (temp > 35) {
    spraying = { status: dict.labels.avoid, tone: 'bad', reason: dict.spraying.heatBad(temp) };
  } else if (windSpeedKmh >= 14) {
    spraying = { status: dict.labels.caution, tone: 'caution', reason: dict.spraying.windCaution(windSpeedKmh) };
  } else if (rainProb >= 25) {
    spraying = { status: dict.labels.caution, tone: 'caution', reason: dict.spraying.rainCaution(rainProb) };
  } else if (temp > 32) {
    spraying = { status: dict.labels.caution, tone: 'caution', reason: dict.spraying.tempCaution(temp) };
  }

  // 2. Field Work
  let fieldWork: OpItem = { status: dict.labels.suitable, tone: 'good', reason: dict.fieldWork.good };
  if (rainProb >= 60) {
    fieldWork = { status: dict.labels.avoid, tone: 'bad', reason: dict.fieldWork.rainBad };
  } else if (temp >= 38) {
    fieldWork = { status: dict.labels.caution, tone: 'caution', reason: dict.fieldWork.heatCaution };
  } else if (windSpeedKmh >= 35) {
    fieldWork = { status: dict.labels.caution, tone: 'caution', reason: dict.fieldWork.windCaution };
  }

  // 3. Irrigation
  let irrigation: OpItem = { status: dict.labels.goodIrrigate, tone: 'good', reason: dict.irrigation.good };
  if (rainProb >= 50) {
    irrigation = { status: dict.labels.rainReducesIrr, tone: 'caution', reason: dict.irrigation.rainCaution(rainProb) };
  } else if (temp > 34 && (evapotranspiration ?? 0.3) > 0.35) {
    irrigation = { status: dict.labels.waitIrr, tone: 'caution', reason: dict.irrigation.sunCaution };
  }

  // 4. Harvesting
  let harvesting: OpItem = { status: dict.labels.suitable, tone: 'good', reason: dict.harvesting.good };
  if (rainProb >= 40 || humidity > 85) {
    harvesting = { status: dict.labels.avoid, tone: 'bad', reason: dict.harvesting.rainBad };
  } else if (windSpeedKmh > 28) {
    harvesting = { status: dict.labels.caution, tone: 'caution', reason: dict.harvesting.windCaution };
  }

  // 5. Overall
  let overallAdvice = '';
  if (spraying.tone === 'good' && fieldWork.tone === 'good') {
    overallAdvice = dict.overall.good(temp);
  } else if (spraying.tone === 'bad' && rainProb >= 40) {
    overallAdvice = dict.overall.rain(rainProb);
  } else if (temp >= 35) {
    overallAdvice = dict.overall.heat(temp);
  } else if (windSpeedKmh >= 18) {
    overallAdvice = dict.overall.wind(windSpeedKmh);
  } else {
    overallAdvice = dict.overall.stable;
  }

  return { overallAdvice, fieldWork, irrigation, spraying, harvesting };
}

export function computeWeatherStory(
  hourlyData: HourlyForecastPoint[],
  lang: Language
): Array<{ title: string; temp: string; desc: string; rainProb: number }> {
  if (!hourlyData || hourlyData.length === 0) return [];
  const dict = getDict(lang);

  const getPeriodSummary = (
    startH: number,
    endH: number,
    key: 'morning' | 'afternoon' | 'evening' | 'night'
  ) => {
    const subset = hourlyData.filter((h) => {
      const hourNum = typeof h.hour === 'number'
        ? h.hour
        : parseInt(h.displayTime24?.split(':')[0] || h.time.split(':')[0], 10);
      if (startH > endH) {
        return hourNum >= startH || hourNum <= endH;
      }
      return hourNum >= startH && hourNum <= endH;
    });

    if (subset.length === 0) return null;

    const temps = subset.map((s) => s.temp);
    const avgTemp = Math.round((temps.reduce((a, b) => a + b, 0) / temps.length) * 10) / 10;
    const maxRainProb = Math.max(...subset.map((s) => s.rainProb));
    const maxWind = Math.max(...subset.map((s) => s.windSpeedKmh));
    const maxTemp = Math.max(...temps);
    const minTemp = Math.min(...temps);

    let title = '';
    let desc = '';

    if (key === 'morning') {
      title = dict.story.morningTitle;
      desc = maxRainProb > 40
        ? dict.story.morningRain(maxRainProb)
        : maxWind < 12
        ? dict.story.morningGood(avgTemp)
        : dict.story.morningMild(avgTemp);
    } else if (key === 'afternoon') {
      title = dict.story.afternoonTitle;
      desc = avgTemp > 34
        ? dict.story.afternoonHeat(maxTemp)
        : maxRainProb > 40
        ? dict.story.afternoonRain(maxRainProb)
        : dict.story.afternoonClear(avgTemp, maxWind);
    } else if (key === 'evening') {
      title = dict.story.eveningTitle;
      desc = maxRainProb > 40
        ? dict.story.eveningRain(maxRainProb)
        : dict.story.eveningCool(avgTemp);
    } else {
      title = dict.story.nightTitle;
      desc = dict.story.nightDesc(minTemp);
    }

    return { title, temp: `${avgTemp}°C`, desc, rainProb: maxRainProb };
  };

  return [
    getPeriodSummary(5, 11, 'morning'),
    getPeriodSummary(12, 16, 'afternoon'),
    getPeriodSummary(17, 20, 'evening'),
    getPeriodSummary(21, 4, 'night'),
  ].filter(Boolean) as Array<{ title: string; temp: string; desc: string; rainProb: number }>;
}
