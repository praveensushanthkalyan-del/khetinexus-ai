export interface VoiceLanguageConfig {
  id: string;
  locale: string;
  languageName: string;
  nativeName: string;
  geminiVoiceName: string;
  speechStyle: string;
  regionalStyleInstructions: string;
  examplePhrase: string;
  quickPrompts: {
    label: string;
    prompt: string;
  }[];
}

export const VOICE_CONFIGS: Record<string, VoiceLanguageConfig> = {
  'te-IN': {
    id: 'te-IN',
    locale: 'te-IN',
    languageName: 'Telugu',
    nativeName: 'తెలుగు',
    geminiVoiceName: 'Kore',
    speechStyle: 'Warm, respectful, conversational Telugu agricultural advisor',
    regionalStyleInstructions: `Respond in natural, spoken Telugu appropriate for farmers in Telangana and Andhra Pradesh.
Use clear, warm, conversational Telugu that sounds like a real local agricultural advisor speaking directly to a farmer.
Avoid textbook or excessively formal Telugu.
Use standard agricultural terms (e.g., నేలలో తేమ, పిచికారీ, సేద్యం, ఎరువులు).
Keep numbers, measurements (kg, acres, litres, °C), crop names, pesticide/chemical dosages, and safety warnings technically precise and accurate. Never use slang for dosages or safety warnings.`,
    examplePhrase: 'ఇప్పుడు మీ పొలంలో పరిస్థితి బాగానే ఉంది. నేలలో తేమ కొంచెం తగ్గుతోంది కాబట్టి ఈరోజు నీటి పరిస్థితిని ఒకసారి చెక్ చేయండి.',
    quickPrompts: [
      { label: 'పొలం పరిస్థితి ఎలా ఉంది?', prompt: 'నా పొలం ప్రస్తుత పరిస్థితి మరియు ఈరోజు చేయాల్సిన పనులు వివరించండి.' },
      { label: 'నీటి తడి అందించాలా?', prompt: 'ఈరోజు వాతావరణం మరియు నేల తేమ ఆధారంగా పొలానికి నీరు పెట్టాలా?' },
      { label: 'పంట రక్షణ సలహా', prompt: 'నా పంటలో పురుగులు లేదా తెగుళ్ల నివారణకు ఏ జాగ్రత్తలు తీసుకోవాలి?' },
      { label: 'ఎరువుల యాజమాన్యం', prompt: 'ఈ ఎదుగుదల దశలో పంటకు ఏ ఎరువులు అందించాలి?' },
    ],
  },
  'hi-IN': {
    id: 'hi-IN',
    locale: 'hi-IN',
    languageName: 'Hindi',
    nativeName: 'हिन्दी',
    geminiVoiceName: 'Kore',
    speechStyle: 'Warm, respectful, conversational Indian Hindi farmer advisor',
    regionalStyleInstructions: `Respond in natural, spoken conversational Hindi appropriate for farmers in India.
Use clear, farmer-friendly Hindi that sounds like a respectful local agricultural advisor.
Avoid overly formal literary Hindi or rigid textbook translations.
Use common farming terms (खेत, नमी, सिंचाई, छिड़काव, खाद, फसल).
Keep numbers, measurements, crop names, pesticide dosages, and safety warnings accurate and clear.`,
    examplePhrase: 'अभी आपके खेत की स्थिति ठीक है। मिट्टी में नमी थोड़ी कम हो रही है, इसलिए आज एक बार सिंचाई की स्थिति देख लें।',
    quickPrompts: [
      { label: 'खेत का हाल बताएं', prompt: 'मेरे खेत की वर्तमान स्थिति और आज के जरूरी काम बताएं।' },
      { label: 'क्या आज सिंचाई करें?', prompt: 'मौसम और मिट्टी की नमी देखकर बताएं कि क्या आज खेत में पानी देना चाहिए?' },
      { label: 'कीट एवं रोग सलाह', prompt: 'फसल को कीटों और बीमारियों से बचाने के लिए क्या उपाय करें?' },
      { label: 'खाद और पोषण सलाह', prompt: 'इस समय फसल को कौन सी खाद या जैविक पोषण देना चाहिए?' },
    ],
  },
  'ta-IN': {
    id: 'ta-IN',
    locale: 'ta-IN',
    languageName: 'Tamil',
    nativeName: 'தமிழ்',
    geminiVoiceName: 'Zephyr',
    speechStyle: 'Respectful, natural conversational Tamil agricultural expert',
    regionalStyleInstructions: `Respond in natural, spoken conversational Tamil suitable for farmers in Tamil Nadu.
Use clear, friendly Tamil appropriate for agricultural discussions.
Avoid excessively formal literary Tamil. Use commonly understood farmer terminology (பண்ணை, மண் ஈரம், பாசனம், உரம், தெளிப்பு).
Keep all measurements, dosage numbers, and safety instructions exact and precise.`,
    examplePhrase: 'இப்போது உங்கள் வயலின் நிலை நன்றாக உள்ளது. மண்ணில் ஈரம் சற்று குறைந்து வருகிறது, எனவே இன்று பாசனத்தை சரிபார்க்கவும்.',
    quickPrompts: [
      { label: 'வயல் நிலைமை எப்படி?', prompt: 'என் வயலின் தற்போதைய நிலை மற்றும் இன்றைய விவசாயப் பணிகளைக் கூறுங்கள்.' },
      { label: 'இன்று தண்ணீர் பாய்ச்சலாமா?', prompt: 'வானிலை மற்றும் மண் ஈரப்பதம் கொண்டு இன்று நீர் பாய்ச்ச வேண்டுமா?' },
      { label: 'பயிர் பாதுகாப்பு', prompt: 'பயிரில் பூச்சி மற்றும் நோய் தாக்குதலைத் தடுக்க என்ன செய்ய வேண்டும்?' },
      { label: 'உர மேலாண்மை', prompt: 'இந்த வளர்ச்சி நிலையில் பயிருக்கு என்ன உரம் இட வேண்டும்?' },
    ],
  },
  'kn-IN': {
    id: 'kn-IN',
    locale: 'kn-IN',
    languageName: 'Kannada',
    nativeName: 'ಕನ್ನಡ',
    geminiVoiceName: 'Zephyr',
    speechStyle: 'Respectful, spoken conversational Kannada farming guide',
    regionalStyleInstructions: `Respond in natural spoken conversational Kannada suitable for Karnataka farmers.
Use warm, clear Kannada phrasing commonly used in farming communities.
Avoid high literary or rigid textbook Kannada.
Keep numbers, crop names, chemical dosages, and safety warnings precise and accurate.`,
    examplePhrase: 'ಈಗ ನಿಮ್ಮ ಜಮೀನಿನ ಪರಿಸ್ಥಿತಿ ಚೆನ್ನಾಗಿದೆ. ಮಣ್ಣಿನಲ್ಲಿ ತೇವಾಂಶ ಸ್ವಲ್ಪ ಕಡಿಮೆಯಾಗುತ್ತಿದೆ, ಹೀಗಾಗಿ ಇಂದು ನೀರಾವರಿ ಪರಿಶೀಲಿಸಿ.',
    quickPrompts: [
      { label: 'ಜಮೀನಿನ ಸ್ಥಿತಿ ತಿಳಿಸಿ', prompt: 'ನನ್ನ ಜಮೀನಿನ ಇಂದಿನ ಸ್ಥಿತಿ ಮತ್ತು ಮಾಡಬೇಕಾದ ಕೆಲಸಗಳನ್ನು ತಿಳಿಸಿ.' },
      { label: 'ಇಂದು ನೀರು ಹಾಯಿಸಬೇಕೇ?', prompt: 'ಹವಾಮಾನ ಮತ್ತು ಮಣ್ಣಿನ ತೇವಾಂಶ ನೋಡಿ ಇಂದು ನೀರು ನೀಡಬೇಕೇ ತಿಳಿಸಿ.' },
      { label: 'ಕೀಟ ಮತ್ತು ರೋಗ ನಿಯಂತ್ರಣ', prompt: 'ಬೆಳೆಗೆ ಕೀಟ ಅಥವಾ ರೋಗ ಬಾಧೆ ತಡೆಯಲು ಏನು ಮಾಡಬೇಕು?' },
      { label: 'ಗೊಬ್ಬರ ನಿರ್ವಹಣೆ', prompt: 'ಈ ಹಂತದಲ್ಲಿ ಬೆಳೆಗೆ ಯಾವ ಗೊಬ್ಬರ ಅಥವಾ ಪೋಷಕಾಂಶ ನೀಡಬೇಕು?' },
    ],
  },
  'ml-IN': {
    id: 'ml-IN',
    locale: 'ml-IN',
    languageName: 'Malayalam',
    nativeName: 'മലയാളം',
    geminiVoiceName: 'Zephyr',
    speechStyle: 'Warm, clear conversational Malayalam agricultural specialist',
    regionalStyleInstructions: `Respond in natural spoken conversational Malayalam suitable for Kerala farmers.
Use respectful, easy-to-understand farmer terminology (തോട്ടം, മണ്ണിലെ ഈർപ്പം, നനയ്ക്കൽ, വളപ്രയോഗം).
Avoid artificial textbook Malayalam. Keep technical numbers, pesticide dosages, and safety warnings clear and accurate.`,
    examplePhrase: 'ഇപ്പോൾ നിങ്ങളുടെ പറമ്പിലെ അവസ്ഥ നല്ലതാണ്. മണ്ണിൽ ഈർപ്പം കുറയുന്നുണ്ട്, അതിനാൽ ഇന്ന് നനയ്ക്കുന്ന കാര്യം ശ്രദ്ധിക്കുക.',
    quickPrompts: [
      { label: 'കൃഷിയിടത്തിലെ അവസ്ഥ', prompt: 'എന്റെ കൃഷിയിടത്തിലെ ഇന്നത്തെ അവസ്ഥയും ചെയ്യേണ്ട കാര്യങ്ങളും വിശദീകരിക്കുക.' },
      { label: 'ഇന്ന് നനയ്ക്കണോ?', prompt: 'അന്തരീക്ഷവും മണ്ണിലെ ഈർപ്പവും അനുസരിച്ച് ഇന്ന് നനയ്ക്കേണ്ടതുണ്ടോ?' },
      { label: 'രോഗ കീട നിയന്ത്രണം', prompt: 'വിളയിലെ കീടങ്ങളെയും രോഗങ്ങളെയും തടയാൻ എന്താണ് ചെയ്യേണ്ടത്?' },
      { label: 'വളപ്രയോഗം', prompt: 'ഈ വളർച്ചാ ഘട്ടത്തിൽ വിളയ്ക്ക് നൽകേണ്ട വളങ്ങൾ ഏതെല്ലാമാണ്?' },
    ],
  },
  'mr-IN': {
    id: 'mr-IN',
    locale: 'mr-IN',
    languageName: 'Marathi',
    nativeName: 'मराठी',
    geminiVoiceName: 'Kore',
    speechStyle: 'Warm, respectful conversational Marathi agricultural advisor',
    regionalStyleInstructions: `Respond in natural spoken conversational Marathi appropriate for farmers in Maharashtra.
Use easy-to-understand Marathi farming terminology (शेत, मातीतील ओलावा, सिंचन, फवारणी, खत).
Avoid highly academic or archaic Marathi.
Ensure dosage numbers, safety warnings, and measurements remain strictly accurate.`,
    examplePhrase: 'सध्या तुमच्या शेताची स्थिती चांगली आहे. मातीत ओलावा थोडा कमी होत आहे, त्यामुळे आज एकदा सिंचनाची पाहणी करून घ्या.',
    quickPrompts: [
      { label: 'शेताची स्थिती सांगा', prompt: 'माझ्या शेताची आजची स्थिती आणि आवश्यक कामे सांगा.' },
      { label: 'आज पाणी द्यावे का?', prompt: 'हवामान आणि मातीतील ओलावा पाहून सांगा की आज पिकाला पाणी द्यावे का?' },
      { label: 'कीड व रोग नियंत्रण', prompt: 'पिकावरील कीड आणि रोगांपासून संरक्षणासाठी काय उपाय करावेत?' },
      { label: 'खत व्यवस्थापन', prompt: 'या वाढीच्या टप्प्यात पिकाला कोणते खत दिले पाहिजे?' },
    ],
  },
  'gu-IN': {
    id: 'gu-IN',
    locale: 'gu-IN',
    languageName: 'Gujarati',
    nativeName: 'ગુજરાતી',
    geminiVoiceName: 'Kore',
    speechStyle: 'Respectful, clear conversational Gujarati farming expert',
    regionalStyleInstructions: `Respond in natural spoken Gujarati appropriate for farmers in Gujarat.
Use common Gujarati farming words (ખેતર, ભેજ, પિયત, ખાતર, છંટકાવ).
Keep language respectful and simple. Ensure numbers, dosage, and safety instructions are exact.`,
    examplePhrase: 'હાલમાં તમારા ખેતરની સ્થિતિ સારી છે. જમીનમાં ભેજ થોડો ઓછો થઈ રહ્યો છે, તેથી આજે પિયતની જરૂરિયાત ચકાસી લો.',
    quickPrompts: [
      { label: 'ખેતરની હાલત જણાવો', prompt: 'મારા ખેતરની આજની સ્થિતિ અને જરૂરી કામો જણાવો.' },
      { label: 'આજે પિયત આપવું?', prompt: 'હવામાન અને જમીનમાં ભેજ જોઈને જણાવો કે આજે પાણી આપવું જોઈએ?' },
      { label: 'જીવાત અને રોગ નિયંત્રણ', prompt: 'પાકને જીવાત અને રોગથી બચાવવા શું કરવું?' },
      { label: 'ખાતર વ્યવસ્થાપન', prompt: 'આ તબક્કે પાકને કયું ખાતર કે પોષણ આપવું?' },
    ],
  },
  'bn-IN': {
    id: 'bn-IN',
    locale: 'bn-IN',
    languageName: 'Bengali',
    nativeName: 'বাংলা',
    geminiVoiceName: 'Zephyr',
    speechStyle: 'Warm, respectful conversational Bengali agricultural advisor',
    regionalStyleInstructions: `Respond in natural spoken conversational Bengali suitable for farmers in West Bengal and Eastern India.
Use clear, practical Bengali farming expressions (জমি, মাটির আর্দ্রতা, সেচ, সার, স্প্রে).
Avoid excessively formal literary Bengali. Keep numbers, chemical dosages, and safety warnings accurate.`,
    examplePhrase: 'এখন আপনার জমির অবস্থা বেশ ভালো। মাটিতে আর্দ্রতা কিছুটা কমছে, তাই আজ একবার সেচের ব্যবস্থা দেখে নিন।',
    quickPrompts: [
      { label: 'জমির অবস্থা জানান', prompt: 'আমার জমির আজকের অবস্থা এবং করণীয় কাজগুলি বলুন।' },
      { label: 'আজ সেচ দেব কি?', prompt: 'আবহাওয়া এবং মাটির আর্দ্রতা দেখে বলুন আজ কি সেচ দেওয়া প্রয়োজন?' },
      { label: 'পোকা ও রোগ নিয়ন্ত্রণ', prompt: 'ফসলে পোকা বা রোগের আক্রমণ ঠেকাতে কী করা উচিত?' },
      { label: 'সার প্রয়োগ', prompt: 'এই বৃদ্ধিদশায় ফসলে কোন সার প্রয়োগ করা দরকার?' },
    ],
  },
  'pa-IN': {
    id: 'pa-IN',
    locale: 'pa-IN',
    languageName: 'Punjabi',
    nativeName: 'ਪੰਜਾਬੀ',
    geminiVoiceName: 'Kore',
    speechStyle: 'Energetic, respectful conversational Punjabi farming specialist',
    regionalStyleInstructions: `Respond in natural spoken conversational Punjabi suitable for farmers in Punjab.
Use warm, respectful Punjabi terminology (ਖੇਤ, ਸਿੱਲ੍ਹ, ਸਿੰਚਾਈ, ਖਾਦ, ਸਪ੍ਰੇਅ).
Avoid dry textbook Punjabi. Keep dosages, safety instructions, and numbers completely accurate.`,
    examplePhrase: 'ਹੁਣ ਤੁਹਾਡੇ ਖੇਤ ਦੀ ਹਾਲਤ ਵਧੀਆ ਹੈ। ਮਿੱਟੀ ਵਿੱਚ ਸਿੱਲ੍ਹ ਥੋੜ੍ਹੀ ਘਟ ਰਹੀ ਹੈ, ਇਸ ਲਈ ਅੱਜ ਇੱਕ ਵਾਰ ਪਾਣੀ ਦੀ ਲੋੜ ਜ਼ਰੂਰ ਦੇਖ ਲਵੋ।',
    quickPrompts: [
      { label: 'ਖੇਤ ਦਾ ਹਾਲ ਦੱਸੋ', prompt: 'ਮੇਰੇ ਖੇਤ ਦੀ ਅੱਜ ਦੀ ਸਥਿਤੀ ਅਤੇ ਕਰਨ ਵਾਲੇ ਜ਼ਰੂਰੀ ਕੰਮ ਦੱਸੋ।' },
      { label: 'ਕੀ ਅੱਜ ਪਾਣੀ ਲਾਈਏ?', prompt: 'ਮੌਸਮ ਅਤੇ ਮਿੱਟੀ ਦੀ ਸਿੱਲ੍ਹ ਦੇਖ ਕੇ ਦੱਸੋ ਕਿ ਕੀ ਅੱਜ ਖੇਤ ਨੂੰ ਪਾਣੀ ਲਾਉਣਾ ਚਾਹੀਦਾ ਹੈ?' },
      { label: 'ਕੀੜੇ ਤੇ ਬਿਮਾਰੀ ਰੋਕਥਾਮ', prompt: 'ਫਸਲ ਨੂੰ ਕੀੜਿਆਂ ਤੇ ਬਿਮਾਰੀਆਂ ਤੋਂ ਬਚਾਉਣ ਲਈ ਕੀ ਉਪਾਅ ਕਰੀਏ?' },
      { label: 'ਖਾਦ ਪ੍ਰਬੰਧਨ', prompt: 'ਇਸ ਸਮੇਂ ਫਸਲ ਨੂੰ ਕਿਹੜੀ ਖਾਦ ਜਾਂ ਪੋਸ਼ਕ ਤੱਤ ਦੇਣੇ ਚਾਹੀਦੇ ਹਨ?' },
    ],
  },
  'ur-IN': {
    id: 'ur-IN',
    locale: 'ur-IN',
    languageName: 'Urdu',
    nativeName: 'اردو',
    geminiVoiceName: 'Charon',
    speechStyle: 'Polite, respectful conversational Urdu agricultural expert',
    regionalStyleInstructions: `Respond in natural spoken Indian conversational Urdu appropriate for agricultural discussions.
Use warm, respectful phrasing (کھیت, نمی, آبپاشی, کھاد, اسپرے).
Avoid highly complicated literary Urdu. Keep numbers, dosage, and safety instructions accurate and precise.`,
    examplePhrase: 'ابھی آپ کے کھیت کی حالت اچھی ہے۔ مٹی میں نمی تھوڑی کم ہو رہی ہے، اس لیے آج ایک بار آبپاشی کی ضرورت دیکھ لیں۔',
    quickPrompts: [
      { label: 'کھیت کی صورتحال', prompt: 'میرے کھیت کی موجودہ صورتحال اور آج کے ضروری کام بتائیں۔' },
      { label: 'کیا آج پانی دیں؟', prompt: 'موسم اور مٹی کی نمی دیکھ کر بتائیں کہ کیا آج کھیت میں پانی دینا چاہیے؟' },
      { label: 'کیڑے اور بیماری سے بچاؤ', prompt: 'فصل کو کیڑوں اور بیماریوں سے بچانے کے لیے کیا تدبیر کریں؟' },
      { label: 'کھاد کی ہدایت', prompt: 'اس مرحلے پر فصل کو کون سی کھاد دینی چاہیے؟' },
    ],
  },
  'en-IN': {
    id: 'en-IN',
    locale: 'en-IN',
    languageName: 'Indian English',
    nativeName: 'Indian English',
    geminiVoiceName: 'Puck',
    speechStyle: 'Warm, professional, conversational Indian English agricultural advisor',
    regionalStyleInstructions: `Respond in natural Indian English conversational phrasing suitable for agricultural extension in India.
Use clear, farmer-friendly terms (field condition, soil moisture, irrigation schedule, fertilizer dosage, pest scouting).
Keep numbers, crop names, measurements, pesticide/chemical dosages, and safety warnings technically precise and clear.`,
    examplePhrase: 'Your field condition is looking good right now. Soil moisture is dipping slightly, so please check the irrigation requirement today.',
    quickPrompts: [
      { label: 'How is my farm today?', prompt: 'Give me a complete update on my farm condition and key actions for today.' },
      { label: 'Should I irrigate today?', prompt: 'Based on current weather and soil moisture, should I apply water to the field today?' },
      { label: 'Pest & disease advice', prompt: 'What crop protection steps should I take to prevent pests or disease?' },
      { label: 'Nutrient & soil care', prompt: 'What fertilizer or bio-inoculant should I apply at this growth stage?' },
    ],
  },
};

/**
 * Helper to get the VoiceLanguageConfig for a given language code
 */
export function getVoiceConfig(lang?: string): VoiceLanguageConfig {
  if (!lang) return VOICE_CONFIGS['en-IN'];
  
  const clean = lang.trim();
  if (VOICE_CONFIGS[clean]) return VOICE_CONFIGS[clean];

  // Map 2-letter ISO prefix
  const base = clean.split('-')[0].toLowerCase();
  const matchKey = Object.keys(VOICE_CONFIGS).find(k => k.startsWith(base));
  if (matchKey && VOICE_CONFIGS[matchKey]) {
    return VOICE_CONFIGS[matchKey];
  }

  return VOICE_CONFIGS['en-IN'];
}
