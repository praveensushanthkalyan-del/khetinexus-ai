import { Language } from '../types';

export const translations = {
  en: {
    appName: 'KhetiNexus AI',
    tagline: 'Intelligent Agriculture. Regenerative Future.',
    heroDescription:
      'AI-powered agricultural intelligence for climate-resilient, localized, and regenerative farming across smallholder communities.',
    getAdvisoryBtn: 'Get Farm Advisory',
    diagnoseCropBtn: 'Diagnose Crop',
    exploreAgriNBtn: 'Explore AgriN Network',
    demoModeTag: 'Demo Data Mode',
    connectedAiTag: 'Gemini 3.8 AI Connected',

    // Nav
    navHome: 'Home',
    navDashboard: 'Dashboard',
    navFarmProfile: 'Farm Profile',
    navAdvisor: 'AI Farm Advisor',
    navCropDoctor: 'Crop Doctor',
    navWeather: 'Weather',
    navSoilHealth: 'Soil Health',
    navRegenerative: 'Regenerative Farming',
    navAgriN: 'AgriN Network',

    // Dashboard sections
    todaysAdvisory: "Today's Advisory",
    weather: 'Weather & Climate',
    soilHealth: 'Soil Health',
    cropHealth: 'Crop Health & Doctor',
    regenerativeActions: 'Regenerative Actions',
    quickActions: 'Quick Actions',
    recentDiagnoses: 'Recent Diagnoses',
    selectedCrop: 'Selected Crop',
    selectedLocation: 'Location',
    currentStage: 'Growth Stage',

    // Headings for advisory
    whatToDoToday: 'What to do today',
    waterManagement: 'Water management',
    cropProtection: 'Crop protection',
    regenerativePractice: 'Regenerative practice',
    next7Days: 'Next 7 days',
    disclaimerTitle: 'Agricultural Advisory Disclaimer',

    // Farm profile form
    farmerName: 'Farmer Name',
    country: 'Country',
    stateRegion: 'State / Region',
    farmLocation: 'Village / District / Location',
    farmSize: 'Farm Size',
    cropName: 'Primary Crop',
    growthStage: 'Crop Growth Stage',
    soilType: 'Dominant Soil Type',
    irrigationType: 'Irrigation System',
    saveProfile: 'Save Farm Profile',
    switchPreset: 'Load Sample BRICS Farm',

    // Crop Doctor
    uploadLeafImage: 'Upload Crop / Leaf Photo',
    dragDropText: 'Drag and drop image here, or browse from device',
    testSampleLeaves: 'Or click a sample test leaf to diagnose:',
    diagnosingCrop: 'Analyzing with Gemini Vision AI...',
    diagnoseBtn: 'Run AI Disease Diagnosis',
    symptomsLabel: 'Observed Symptoms (Optional)',
    symptomsPlaceholder: 'e.g., yellow spots on edges, curled leaves, white powder',
    possibleDisease: 'Identified Condition / Disease',
    confidenceLevel: 'Confidence Level',
    visibleSigns: 'Visible Symptoms',
    causes: 'Likely Causes',
    immediateAction: 'Recommended Immediate Actions',
    prevention: 'Regenerative Prevention & Soil Immunity',

    // Soil
    soilTestTitle: 'Soil Parameter Diagnostic',
    soilPh: 'Soil pH Level',
    nitrogen: 'Nitrogen (N)',
    phosphorus: 'Phosphorus (P)',
    potassium: 'Potassium (K)',
    soilMoisture: 'Soil Moisture (%)',
    organicMatter: 'Organic Matter (%)',
    analyzeSoilBtn: 'Generate Soil Advisory',
    soilSummary: 'Soil Vitality Summary',
    deficiencies: 'Identified Deficiencies',

    // Regenerative
    regenSubtitle: 'Restoring living ecosystems, soil carbon, and biodiversity while boosting yields.',
    learnMore: 'Explore Practice',

    // AgriN
    agrinTitle: 'BRICS AgriN Interoperable Network',
    agrinSubtitle:
      'A decentralized conceptual framework demonstrating digital agricultural intelligence cooperation between India, Brazil, Russia, China, and South Africa.',
  },
  hi: {
    appName: 'खेतीनेक्सस AI (KhetiNexus AI)',
    tagline: 'बुद्धिमान कृषि। पुनर्योजी भविष्य।',
    heroDescription:
      'छोटे एवं सीमांत किसानों के लिए जलवायु-अनुकूल और पुनर्योजी खेती हेतु AI-संचालित कृषि मार्गदर्शन मंच।',
    getAdvisoryBtn: 'कृषि सलाह प्राप्त करें',
    diagnoseCropBtn: 'फसल रोग जांचें',
    exploreAgriNBtn: 'AgriN नेटवर्क देखें',
    demoModeTag: 'डेमो डेटा मोड',
    connectedAiTag: 'जेमिनी 3.8 AI सक्रिय',

    // Nav
    navHome: 'होम',
    navDashboard: 'डैशबोर्ड',
    navFarmProfile: 'खेत प्रोफाइल',
    navAdvisor: 'AI कृषि सलाहकार',
    navCropDoctor: 'फसल डॉक्टर',
    navWeather: 'मौसम',
    navSoilHealth: 'मृदा स्वास्थ्य',
    navRegenerative: 'पुनर्योजी खेती',
    navAgriN: 'AgriN नेटवर्क',

    // Dashboard sections
    todaysAdvisory: 'आज की मुख्य सलाह',
    weather: 'मौसम एवं जलवायु',
    soilHealth: 'मृदा स्वास्थ्य',
    cropHealth: 'फसल स्वास्थ्य एवं डॉक्टर',
    regenerativeActions: 'पुनर्योजी कदम',
    quickActions: 'त्वरित क्रियाएं',
    recentDiagnoses: 'हालिया रोग जांच',
    selectedCrop: 'चयनित फसल',
    selectedLocation: 'स्थान',
    currentStage: 'विकास चरण',

    // Headings for advisory
    whatToDoToday: 'आज क्या करें',
    waterManagement: 'जल प्रबंधन',
    cropProtection: 'फसल सुरक्षा',
    regenerativePractice: 'पुनर्योजी पद्धति',
    next7Days: 'अगले 7 दिन की योजना',
    disclaimerTitle: 'कृषि सलाह अस्वीकरण (Disclaimer)',

    // Farm profile form
    farmerName: 'किसान का नाम',
    country: 'देश',
    stateRegion: 'राज्य / प्रांत',
    farmLocation: 'गांव / जिला / स्थान',
    farmSize: 'खेत का आकार',
    cropName: 'मुख्य फसल',
    growthStage: 'फसल का विकास चरण',
    soilType: 'मिट्टी का प्रकार',
    irrigationType: 'सिंचाई का साधन',
    saveProfile: 'प्रोफाइल सहेजें',
    switchPreset: 'नमूना BRICS खेत चुनें',

    // Crop Doctor
    uploadLeafImage: 'पत्ती या फसल की फोटो अपलोड करें',
    dragDropText: 'फोटो यहां खींचकर छोड़ें या डिवाइस से चुनें',
    testSampleLeaves: 'या परीक्षण हेतु इनमें से एक पत्ती चुनें:',
    diagnosingCrop: 'जेमिनी विज़न AI द्वारा जांच जारी है...',
    diagnoseBtn: 'AI रोग निदान शुरू करें',
    symptomsLabel: 'दिख रहे लक्षण (वैकल्पिक)',
    symptomsPlaceholder: 'उदा. पत्तों के किनारों पर पीले धब्बे, मुड़े हुए पत्ते',
    possibleDisease: 'संभावित रोग / समस्या',
    confidenceLevel: 'विश्वास स्तर (Confidence)',
    visibleSigns: 'दिखने वाले लक्षण',
    causes: 'संभावित कारण',
    immediateAction: 'त्वरित निवारक कदम',
    prevention: 'दीर्घकालिक जैविक रोकथाम',

    // Soil
    soilTestTitle: 'मृदा परीक्षण एवं विश्लेषण',
    soilPh: 'मृदा pH मान',
    nitrogen: 'नाइट्रोजन (N)',
    phosphorus: 'फास्फोरस (P)',
    potassium: 'पोटेशियम (K)',
    soilMoisture: 'मिट्टी की नमी (%)',
    organicMatter: 'जैविक कार्बन / पदार्थ (%)',
    analyzeSoilBtn: 'मृदा विश्लेषण सलाह पाएं',
    soilSummary: 'मृदा स्वास्थ्य सारांश',
    deficiencies: 'पहचानी गई कमियां',

    // Regenerative
    regenSubtitle: 'मिट्टी के जीवन, जैविक कार्बन और जैव विविधता को पुनर्जीवित करने वाली टिकाऊ पद्धतियां।',
    learnMore: 'पद्धति देखें',

    // AgriN
    agrinTitle: 'BRICS AgriN कृषि सहयोग नेटवर्क',
    agrinSubtitle:
      'भारत, ब्राज़ील, रूस, चीन और दक्षिण अफ्रीका के बीच डिजिटल कृषि और ज्ञान साझाकरण का एक वैचारिक ढांचा।',
  },
};

export function getTranslation(lang: Language) {
  return translations[lang] || translations.en;
}
