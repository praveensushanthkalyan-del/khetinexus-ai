import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Play, Pause, RotateCcw, Send, Sparkles, Radio, CheckCircle2, AlertCircle, Loader2, Keyboard, ChevronDown, ChevronUp, ChevronRight, Activity } from 'lucide-react';
import { FarmProfile, WeatherData, SoilReport, AdvisoryResult, DiagnosisResult } from '../types';
import { getVoiceConfig, VoiceLanguageConfig } from '../config/voiceConfig';
import { normalizeLang } from '../i18n/dataTranslations';
import { voiceStreamingClient } from '../lib/voiceStreamingClient';

const getVoiceUiStrings = (lang: string, nativeName: string) => {
  const norm = normalizeLang(lang);
  
  if (norm === 'te') {
    return {
      activeBadge: 'క్రియాశీలం',
      voiceTitle: 'వాయిస్ లైవ్',
      unmuteTitle: 'వాయిస్ ఆన్ చేయండి',
      muteTitle: 'వాయిస్ మ్యూట్ చేయండి',
      listening: `${nativeName}లో వింటోంది...`,
      thinking: 'ఆలోచిస్తోంది...',
      speaking: `${nativeName}లో మాట్లాడుతోంది`,
      paused: 'వాయిస్ పాజ్ చేయబడింది',
      tapToSpeak: `మాట్లాడటానికి నొక్కండి (${nativeName})`,
      speakPrompt: 'మీ ప్రశ్నను సహజంగా మాట్లాడండి...',
      speakingHint: 'ప్రశ్న అడగడానికి లేదా పాజ్ చేయడానికి నొక్కండి',
      defaultHint: 'పంటలు, నేల, నీరు లేదా తెగుళ్ల హెచ్చరికల గురించి ఏదైనా అడగండి',
      you: 'మీరు',
      responseTitle: `వాయిస్ సమాధానం (${nativeName})`,
      pause: 'పాజ్',
      play: 'ప్లే',
      replay: 'మళ్లీ వినండి',
      hideKeyboard: 'కీబోర్డ్ దాచండి',
      typeQuestion: 'టైప్ చేసి అడగండి',
      inputPlaceholder: `${nativeName}లో ప్రశ్నను టైప్ చేయండి...`,
      send: 'పంపండి',
      voiceConnecting: 'వాయిస్ AI కనెక్ట్ అవుతోంది. దయచేసి మైక్ నొక్కి మళ్లీ ప్రయత్నించండి.',
      stopListening: 'వినడం ఆపండి',
      tapToStart: 'మాట్లాడటానికి నొక్కండి',
    };
  }

  if (norm === 'hi') {
    return {
      activeBadge: 'सक्रिय',
      voiceTitle: 'वॉइस लाइव',
      unmuteTitle: 'आवाज़ चालू करें',
      muteTitle: 'आवाज़ बंद करें',
      listening: `${nativeName} में सुन रहा है...`,
      thinking: 'सोच रहा है...',
      speaking: `${nativeName} में बोल रहा है`,
      paused: 'आवाज़ रोकी गई',
      tapToSpeak: `बोलने के लिए टैप करें (${nativeName})`,
      speakPrompt: 'अपना प्रश्न स्वाभाविक रूप से बोलें...',
      speakingHint: 'बातचीत करने के लिए रोकें या प्रश्न पूछें',
      defaultHint: 'फसल, मिट्टी, पानी या कीट चेतावनियों के बारे में कुछ भी पूछें',
      you: 'आप',
      responseTitle: `वॉइस उत्तर (${nativeName})`,
      pause: 'रोकें',
      play: 'चलाएं',
      replay: 'पुनः सुनें',
      hideKeyboard: 'कीबोर्ड छुपाएं',
      typeQuestion: 'लिखकर पूछें',
      inputPlaceholder: `${nativeName} में प्रश्न लिखें...`,
      send: 'भेजें',
      voiceConnecting: 'वॉइस AI कनेक्ट हो रहा है। कृपया माइक टैप करके पुनः प्रयास करें।',
      stopListening: 'सुनना बंद करें',
      tapToStart: 'बोलने के लिए टैप करें',
    };
  }

  if (norm === 'ta') {
    return {
      activeBadge: 'செயலில்',
      voiceTitle: 'குரல் நேரடி',
      unmuteTitle: 'குரலை இயக்கு',
      muteTitle: 'குரலை முடக்கு',
      listening: `${nativeName}இல் கேட்கிறது...`,
      thinking: 'சிந்திக்கிறது...',
      speaking: `${nativeName}இல் பேசுகிறது`,
      paused: 'குரல் இடைநிறுத்தப்பட்டது',
      tapToSpeak: `பேச தட்டவும் (${nativeName})`,
      speakPrompt: 'உங்கள் கேள்வியை இயல்பாகப் பேசுங்கள்...',
      speakingHint: 'தொடர்புகொள்ள இடைநிறுத்தவும் அல்லது கேட்கவும்',
      defaultHint: 'பயிர்கள், மண், நீர் அல்லது பூச்சி எச்சரிக்கைகள் பற்றி கேளுங்கள்',
      you: 'நீங்கள்',
      responseTitle: `குரல் பதில் (${nativeName})`,
      pause: 'நிறுத்து',
      play: 'இயக்கு',
      replay: 'மீண்டும் கேள்',
      hideKeyboard: 'விசைப்பலகையை மறை',
      typeQuestion: 'கேள்வி தட்டச்சு செய்',
      inputPlaceholder: `${nativeName}இல் தட்டச்சு செய்க...`,
      send: 'அனுப்பு',
      voiceConnecting: 'குரல் AI இணைகிறது. மீண்டும் முயற்சிக்க மைக்கைத் தட்டவும்.',
      stopListening: 'கேட்பதை நிறுத்து',
      tapToStart: 'பேச தட்டவும்',
    };
  }

  if (norm === 'kn') {
    return {
      activeBadge: 'ಸಕ್ರಿಯ',
      voiceTitle: 'ಧ್ವನಿ ಲೈವ್',
      unmuteTitle: 'ಧ್ವನಿ ಆನ್ ಮಾಡಿ',
      muteTitle: 'ಧ್ವನಿ ಮ್ಯೂಟ್ ಮಾಡಿ',
      listening: `${nativeName}ನಲ್ಲಿ ಆಲಿಸುತ್ತಿದೆ...`,
      thinking: 'ಯೋಚಿಸುತ್ತಿದೆ...',
      speaking: `${nativeName}ನಲ್ಲಿ ಮಾತನಾಡುತ್ತಿದೆ`,
      paused: 'ಧ್ವನಿ ವಿರಾಮಗೊಳಿಸಲಾಗಿದೆ',
      tapToSpeak: `ಮಾತನಾಡಲು ಟ್ಯಾಪ್ ಮಾಡಿ (${nativeName})`,
      speakPrompt: 'ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ಸ್ವಾಭಾವಿಕವಾಗಿ ಮಾತನಾಡಿ...',
      speakingHint: 'ಸಂವಾದಿಸಲು ವಿರಾಮಗೊಳಿಸಿ ಅಥವಾ ಪ್ರಶ್ನಿಸಿ',
      defaultHint: 'ಬೆಳೆಗಳು, ಮಣ್ಣು, ನೀರು ಅಥವಾ ಕೀಟ ಎಚ್ಚರಿಕೆಗಳ ಬಗ್ಗೆ ಏನಾದರೂ ಕೇಳಿ',
      you: 'ನೀವು',
      responseTitle: `ಧ್ವನಿ ಉತ್ತರ (${nativeName})`,
      pause: 'ವಿರಾಮ',
      play: 'ಪ್ಲೇ',
      replay: 'ಮರುಪ್ಲೇ',
      hideKeyboard: 'ಕೀಬೋರ್ಡ್ ಮರೆಮಾಡಿ',
      typeQuestion: 'ಪ್ರಶ್ನೆ ಟೈಪ್ ಮಾಡಿ',
      inputPlaceholder: `${nativeName}ನಲ್ಲಿ ಟೈಪ್ ಮಾಡಿ...`,
      send: 'ಕಳುಹಿಸಿ',
      voiceConnecting: 'ಧ್ವನಿ AI ಸಂಪರ್ಕಿಸುತ್ತಿದೆ. ದಯವಿಟ್ಟು ಮೈಕ್ ಟ್ಯಾಪ್ ಮಾಡಿ ಮರುಪ್ರಯತ್ನಿಸಿ.',
      stopListening: 'ಆಲಿಸುವುದನ್ನು ನಿಲ್ಲಿಸಿ',
      tapToStart: 'ಮಾತನಾಡಲು ಟ್ಯಾಪ್ ಮಾಡಿ',
    };
  }

  if (norm === 'ml') {
    return {
      activeBadge: 'സജീവം',
      voiceTitle: 'വോയ്സ് ലൈവ്',
      unmuteTitle: 'ശബ്ദം ഓണാക്കുക',
      muteTitle: 'ശബ്ദം ഓഫാക്കുക',
      listening: `${nativeName}ൽ കേൾക്കുന്നു...`,
      thinking: 'ചിന്തിക്കുന്നു...',
      speaking: `${nativeName}ൽ സംസാരിക്കുന്നു`,
      paused: 'ശബ്ദം നിർത്തിവച്ചു',
      tapToSpeak: `സംസാരിക്കാൻ ടാപ്പ് ചെയ്യുക (${nativeName})`,
      speakPrompt: 'നിങ്ങളുടെ ചോദ്യം സ്വാഭാവികമായി സംസാരിക്കുക...',
      speakingHint: 'സംവദിക്കാൻ താൽക്കാലികമായി നിർത്തുകയോ ചോദിക്കുകയോ ചെയ്യുക',
      defaultHint: 'വിളകൾ, മണ്ണ്, ജലം അല്ലെങ്കിൽ കീട മുന്നറിയിപ്പുകൾ എന്നിവയെക്കുറിച്ച് ചോദിക്കുക',
      you: 'നിങ്ങൾ',
      responseTitle: `വോയ്സ് മറുപടി (${nativeName})`,
      pause: 'നിർത്തുക',
      play: 'പ്ലേ',
      replay: 'വീണ്ടും കേൾക്കുക',
      hideKeyboard: 'കീബോർഡ് മറയ്ക്കുക',
      typeQuestion: 'ചോദ്യം ടൈപ്പ് ചെയ്യുക',
      inputPlaceholder: `${nativeName}ൽ ടൈപ്പ് ചെയ്യുക...`,
      send: 'അയക്കുക',
      voiceConnecting: 'വോയ്സ് AI ബന്ധിപ്പിക്കുന്നു. ദയവായി മൈക്ക് ടാപ്പ് ചെയ്ത് വീണ്ടും ശ്രമിക്കുക.',
      stopListening: 'കേൾക്കുന്നത് നിർത്തുക',
      tapToStart: 'സംസാരിക്കാൻ ടാപ്പ് ചെയ്യുക',
    };
  }

  if (norm === 'mr') {
    return {
      activeBadge: 'सक्रिय',
      voiceTitle: 'व्हॉईस लाईव्ह',
      unmuteTitle: 'आवाज चालू करा',
      muteTitle: 'आवाज बंद करा',
      listening: `${nativeName} मध्ये ऐकत आहे...`,
      thinking: 'विचार करत आहे...',
      speaking: `${nativeName} मध्ये बोलत आहे`,
      paused: 'आवाज थांबवला',
      tapToSpeak: `बोलण्यासाठी टॅप करा (${nativeName})`,
      speakPrompt: 'तुमचा प्रश्न सहजतेने बोला...',
      speakingHint: 'संवाद साधण्यासाठी विराम द्या किंवा विचारा',
      defaultHint: 'पिके, माती, पाणी किंवा कीड सूचनांबद्दल काहीही विचारा',
      you: 'तुम्ही',
      responseTitle: `व्हॉईस उत्तर (${nativeName})`,
      pause: 'विराम',
      play: 'प्ले',
      replay: 'पुन्हा ऐका',
      hideKeyboard: 'कीबोर्ड लपवा',
      typeQuestion: 'प्रश्न टाईप करा',
      inputPlaceholder: `${nativeName} मध्ये टाईप करा...`,
      send: 'पाठवा',
      voiceConnecting: 'व्हॉईस AI जोडत आहे. कृपया माइक टॅप करून पुन्हा प्रयत्न करा.',
      stopListening: 'ऐकणे थांबवा',
      tapToStart: 'बोलण्यासाठी टॅप करा',
    };
  }

  if (norm === 'gu') {
    return {
      activeBadge: 'સક્રિય',
      voiceTitle: 'વોઇસ લાઇવ',
      unmuteTitle: 'અવાજ ચાલુ કરો',
      muteTitle: 'અવાજ બંધ કરો',
      listening: `${nativeName}માં સાંભળી રહ્યું છે...`,
      thinking: 'વિચારી રહ્યું છે...',
      speaking: `${nativeName}માં બોલી રહ્યું છે`,
      paused: 'અવાજ થોભાવેલ છે',
      tapToSpeak: `બોલવા માટે ટેપ કરો (${nativeName})`,
      speakPrompt: 'તમારો પ્રશ્ન સહજતાથી બોલો...',
      speakingHint: 'વાતચીત કરવા થોભો અથવા પૂછો',
      defaultHint: 'પાક, જમીન, પાણી અથવા જીવાત ચેતવણીઓ વિશે કંઈપણ પૂછો',
      you: 'તમે',
      responseTitle: `વોઇસ જવાબ (${nativeName})`,
      pause: 'થોભો',
      play: 'ચલાવો',
      replay: 'ફરી સાંભળો',
      hideKeyboard: 'કીબોર્ડ છુપાવો',
      typeQuestion: 'પ્રશ્ન ટાઈપ કરો',
      inputPlaceholder: `${nativeName}માં ટાઈપ કરો...`,
      send: 'મોકલો',
      voiceConnecting: 'વોઇસ AI કનેક્ટ થઈ રહ્યું છે. કૃપા કરીને માઇક ટેપ કરી ફરી પ્રયાસ કરો.',
      stopListening: 'સાંભળવાનું બંધ કરો',
      tapToStart: 'બોલવા માટે ટેપ કરો',
    };
  }

  if (norm === 'bn') {
    return {
      activeBadge: 'সক্রিয়',
      voiceTitle: 'ভয়েস লাইভ',
      unmuteTitle: 'শব্দ চালু করুন',
      muteTitle: 'শব্দ বন্ধ করুন',
      listening: `${nativeName}য় শুনছে...`,
      thinking: 'ভাবছে...',
      speaking: `${nativeName}য় কথা বলছে`,
      paused: 'ভয়েস পজ করা হয়েছে',
      tapToSpeak: `কথা বলতে ট্যাপ করুন (${nativeName})`,
      speakPrompt: 'আপনার প্রশ্ন স্বাভাবিকভাবে বলুন...',
      speakingHint: 'মিথস্ক্রিয়ার জন্য পজ করুন বা প্রশ্ন করুন',
      defaultHint: 'ফসল, মাটি, জল বা পোকা সতর্কবার্তা সম্পর্কে কিছু জিজ্ঞাসা করুন',
      you: 'আপনি',
      responseTitle: `ভয়েস উত্তর (${nativeName})`,
      pause: 'পজ',
      play: 'চালান',
      replay: 'পুনরায় শুনুন',
      hideKeyboard: 'কীবোর্ড লুকান',
      typeQuestion: 'প্রশ্ন লিখুন',
      inputPlaceholder: `${nativeName}য় লিখুন...`,
      send: 'পাঠান',
      voiceConnecting: 'ভয়েস AI সংযুক্ত হচ্ছে। অনুগ্রহ করে মাইকে ট্যাপ করে আবার চেষ্টা করুন।',
      stopListening: 'শোনা বন্ধ করুন',
      tapToStart: 'কথা বলতে ট্যাপ করুন',
    };
  }

  if (norm === 'pa') {
    return {
      activeBadge: 'ਸਰਗਰਮ',
      voiceTitle: 'ਵੌਇਸ ਲਾਈਵ',
      unmuteTitle: 'ਆਵਾਜ਼ ਚਾਲੂ ਕਰੋ',
      muteTitle: 'ਆਵਾਜ਼ ਬੰਦ ਕਰੋ',
      listening: `${nativeName} ਵਿੱਚ ਸੁਣ ਰਿਹਾ ਹੈ...`,
      thinking: 'ਸੋਚ ਰਿਹਾ ਹੈ...',
      speaking: `${nativeName} ਵਿੱਚ ਬੋਲ ਰਿਹਾ ਹੈ`,
      paused: 'ਆਵਾਜ਼ ਰੋਕੀ ਗਈ',
      tapToSpeak: `ਬੋਲਣ ਲਈ ਟੈਪ ਕਰੋ (${nativeName})`,
      speakPrompt: 'ਆਪਣਾ ਸਵਾਲ ਸੁਭਾਵਿਕ ਤੌਰ ਤੇ ਬੋਲੋ...',
      speakingHint: 'ਸੰਵਾਦ ਲਈ ਰੋਕੋ ਜਾਂ ਸਵਾਲ ਪੁੱਛੋ',
      defaultHint: 'ਫਸਲਾਂ, ਮਿੱਟੀ, ਪਾਣੀ ਜਾਂ ਕੀੜਿਆਂ ਦੀਆਂ ਚਿਤਾਵਨੀਆਂ ਬਾਰੇ ਕੁਝ ਵੀ ਪੁੱਛੋ',
      you: 'ਤੁਸੀਂ',
      responseTitle: `ਵੌਇਸ ਜਵਾਬ (${nativeName})`,
      pause: 'ਰੋਕੋ',
      play: 'ਚਲਾਓ',
      replay: 'ਦੁਬਾਰਾ ਸੁਣੋ',
      hideKeyboard: 'ਕੀਬੋਰਡ ਲੁਕਾਓ',
      typeQuestion: 'ਸਵਾਲ ਟਾਈਪ ਕਰੋ',
      inputPlaceholder: `${nativeName} ਵਿੱਚ ਟਾਈਪ ਕਰੋ...`,
      send: 'ਭੇਜੋ',
      voiceConnecting: 'ਵੌਇਸ AI ਜੁੜ ਰਿਹਾ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਮਾਈਕ ਦਬਾ ਕੇ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।',
      stopListening: 'ਸੁਣਨਾ ਬੰਦ ਕਰੋ',
      tapToStart: 'ਬੋਲਣ ਲਈ ਟੈਪ ਕਰੋ',
    };
  }

  if (norm === 'ur') {
    return {
      activeBadge: 'فعال',
      voiceTitle: 'وائس لائیو',
      unmuteTitle: 'آواز کھولیں',
      muteTitle: 'آواز بند کریں',
      listening: `${nativeName} میں سن رہا ہے...`,
      thinking: 'سوچ رہا ہے...',
      speaking: `${nativeName} میں بول رہا ہے`,
      paused: 'آواز موقوف ہے',
      tapToSpeak: `بولنے کے لیے ٹیپ کریں (${nativeName})`,
      speakPrompt: 'اپنا سوال قدرتی انداز میں بولیں...',
      speakingHint: 'بات چیت کے لیے وقفہ لیں یا پوچھیں',
      defaultHint: 'فصلوں، مٹی، پانی یا کیڑوں کی تنبیہ کے بارے میں کچھ بھی پوچھیں',
      you: 'آپ',
      responseTitle: `وائس جواب (${nativeName})`,
      pause: 'وقفہ',
      play: 'چلائیں',
      replay: 'دوبارہ سنیں',
      hideKeyboard: 'کی بورڈ چھپائیں',
      typeQuestion: 'سوال لکھیں',
      inputPlaceholder: `${nativeName} میں لکھیں...`,
      send: 'بھیجیں',
      voiceConnecting: 'وائس AI رابطہ قائم کر رہا ہے۔ براہ کرم مائیک پر ٹیپ کر کے دوبارہ کوشش کریں۔',
      stopListening: 'سننا بند کریں',
      tapToStart: 'بولنے کے لیے ٹیپ کریں',
    };
  }

  // Default English
  return {
    activeBadge: 'ACTIVE',
    voiceTitle: 'Voice Live',
    unmuteTitle: 'Unmute voice',
    muteTitle: 'Mute voice',
    listening: `Listening in ${nativeName}...`,
    thinking: 'Thinking...',
    speaking: `Speaking in ${nativeName}`,
    paused: 'Voice Paused',
    tapToSpeak: `Tap to Speak (${nativeName})`,
    speakPrompt: 'Speak your question naturally...',
    speakingHint: 'Tap pause or question to interact',
    defaultHint: 'Ask anything about crops, soil, water or pest alerts',
    you: 'You',
    responseTitle: `Voice Response (${nativeName})`,
    pause: 'Pause',
    play: 'Play',
    replay: 'Replay',
    hideKeyboard: 'Hide keyboard',
    typeQuestion: 'Type question',
    inputPlaceholder: `Type query in ${nativeName}...`,
    send: 'Send',
    voiceConnecting: 'Voice AI is connecting. Please tap the mic to try again.',
    stopListening: 'Stop listening',
    tapToStart: 'Tap to start talking',
  };
};

interface VoiceAgentProps {
  language: string;
  currentFarm?: FarmProfile;
  weather?: WeatherData;
  soilReport?: SoilReport;
  advisory?: AdvisoryResult;
  diagnoses?: DiagnosisResult[];
  compact?: boolean;
}

export const VoiceAgent: React.FC<VoiceAgentProps> = ({
  language,
  currentFarm,
  weather,
  soilReport,
  advisory,
  diagnoses,
  compact = false,
}) => {
  const [voiceConfig, setVoiceConfig] = useState<VoiceLanguageConfig>(() => getVoiceConfig(language));
  const [inputText, setInputText] = useState('');
  const [showTextInput, setShowTextInput] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentResponse, setCurrentResponse] = useState<string | null>(null);
  const [currentAudioBase64, setCurrentAudioBase64] = useState<string | null>(null);
  const [activeProvider, setActiveProvider] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [transcriptLive, setTranscriptLive] = useState<string>('');
  const [lastAskedQuestion, setLastAskedQuestion] = useState<string | null>(null);
  const [voiceHistory, setVoiceHistory] = useState<{role: 'user' | 'model', text: string}[]>([]);

  const recognitionRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(typeof window !== 'undefined' ? window.speechSynthesis : null);
  const pinnedVoiceRef = useRef<SpeechSynthesisVoice | null>(null);
  const activeUtteranceTextRef = useRef<string | null>(null);
  const hasReceivedAudioChunksRef = useRef<boolean>(false);

  // Strictly identify and lock the exact native voice for this locale
  const updatePinnedVoice = (locale: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    const voices = window.speechSynthesis.getVoices();
    if (!voices || voices.length === 0) return;

    const cleanLoc = locale.toLowerCase().replace('_', '-');
    const baseLoc = cleanLoc.split('-')[0];

    // 1. Exact match (e.g. te-IN, hi-IN, ta-IN)
    let matched = voices.find((v) => v.lang.toLowerCase().replace('_', '-') === cleanLoc);
    // 2. Contains locale match
    if (!matched) matched = voices.find((v) => v.lang.toLowerCase().replace('_', '-').includes(cleanLoc));
    // 3. Base language match (e.g. te, hi, ta)
    if (!matched) matched = voices.find((v) => v.lang.toLowerCase().startsWith(baseLoc));
    // 4. Fallback to any Indian English if English or Indian locale
    if (!matched && cleanLoc.endsWith('in')) {
      matched = voices.find((v) => v.lang.toLowerCase().includes('in'));
    }

    if (matched) {
      pinnedVoiceRef.current = matched;
    }
  };

  useEffect(() => {
    const config = getVoiceConfig(language);
    setVoiceConfig(config);
    stopAudio();
    setErrorMessage(null);
    setTranscriptLive('');
    setVoiceHistory([]);

    updatePinnedVoice(config.locale);

    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = () => {
        updatePinnedVoice(config.locale);
      };
    }
  }, [language]);

  useEffect(() => {
    // Proactively connect to WebSocket Voice Live server
    voiceStreamingClient.connect();
    return () => {
      voiceStreamingClient.cancel();
      stopAudio();
    };
  }, []);

  // Synchronize mute state with active sound outputs dynamically
  useEffect(() => {
    voiceStreamingClient.setMuted(isMuted);

    if (audioRef.current) {
      audioRef.current.muted = isMuted;
      audioRef.current.volume = isMuted ? 0 : 1;
    }

    if (isMuted) {
      // If Web Speech is playing and user mutes, stop synthesis immediately
      if (synthRef.current && synthRef.current.speaking) {
        synthRef.current.cancel();
        setIsPlaying(false);
        setIsPaused(false);
      }
    } else {
      // If user unmutes, resume speaking or start speech if a response is present
      if (audioRef.current) {
        audioRef.current.muted = false;
        audioRef.current.volume = 1;
      } else if (currentResponse && !isPlaying && !isPaused && !isListening && !isGenerating) {
        playSpeech(currentResponse, currentAudioBase64);
      } else if (currentResponse && isPlaying) {
        // Cancel the silent Web Speech and play it with full volume
        playSpeech(currentResponse, currentAudioBase64);
      }
    }
  }, [isMuted]);

  const stopAudio = () => {
    voiceStreamingClient.stopAudioPlayback();
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    setIsPlaying(false);
    setIsPaused(false);
  };

  // Toggle Live Speech Recognition
  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setErrorMessage('Speech recognition is not supported in this browser. Please type your query below.');
      setShowTextInput(true);
      return;
    }

    try {
      stopAudio();
      setTranscriptLive('');
      const recognition = new SpeechRecognition();
      recognition.lang = voiceConfig.locale;
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsListening(true);
        setErrorMessage(null);
      };

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
        setTranscriptLive(transcript);
        setInputText(transcript);
        (recognition as any)._capturedText = transcript;
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition event:', event.error);
        setIsListening(false);
        if (event.error !== 'no-speech') {
          setErrorMessage(`Mic: ${event.error}. You can tap to try again or type your question.`);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        // Automatically ask Voice Agent if speech was transcribed
        const captured = (recognition as any)._capturedText;
        if (captured && captured.trim().length > 0) {
          handleAskVoiceAgent(captured);
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      console.error('Failed to start speech recognition:', err);
      setIsListening(false);
      setErrorMessage('Microphone access denied or unavailable. Please check browser permissions.');
    }
  };

  // Play audio response with strict voice consistency
  const playSpeech = (text: string, base64Audio?: string | null) => {
    stopAudio();

    activeUtteranceTextRef.current = text;

    // Prefer Base64 audio if returned by server TTS
    if (base64Audio) {
      try {
        const mimeType = 'audio/wav';
        const audioSrc = base64Audio.startsWith('data:') ? base64Audio : `data:${mimeType};base64,${base64Audio}`;
        const audio = new Audio(audioSrc);
        audio.muted = isMuted;
        audio.volume = isMuted ? 0 : 1;
        audioRef.current = audio;

        audio.onplay = () => {
          setIsPlaying(true);
          setIsPaused(false);
        };
        audio.onpause = () => {
          if (audio.currentTime < audio.duration) {
            setIsPaused(true);
          }
        };
        audio.onended = () => {
          setIsPlaying(false);
          setIsPaused(false);
        };
        audio.onerror = () => {
          fallbackWebSpeech(text);
        };

        audio.play().catch(() => {
          fallbackWebSpeech(text);
        });
        return;
      } catch (e) {
        fallbackWebSpeech(text);
        return;
      }
    }

    fallbackWebSpeech(text);
  };

  // Fallback speech synthesis with pinned voice to prevent voice/slang switching
  const fallbackWebSpeech = (text: string) => {
    if (audioRef.current) {
      try {
        audioRef.current.pause();
      } catch (e) {}
      audioRef.current = null;
    }

    if (!synthRef.current) return;

    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = voiceConfig.locale;
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.volume = isMuted ? 0 : 1;

    if (!pinnedVoiceRef.current) {
      updatePinnedVoice(voiceConfig.locale);
    }
    if (pinnedVoiceRef.current) {
      utterance.voice = pinnedVoiceRef.current;
    }

    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
    };
    utterance.onpause = () => {
      setIsPaused(true);
    };
    utterance.onresume = () => {
      setIsPaused(false);
    };
    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };
    utterance.onerror = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    synthRef.current.speak(utterance);
  };

  // Safe Pause & Resume Toggle ensuring identical voice/slang and smooth continuity
  const handleTogglePause = () => {
    if (isPlaying && !isPaused) {
      // User requested Pause
      voiceStreamingClient.pausePlayback();
      if (audioRef.current && !audioRef.current.paused) {
        audioRef.current.pause();
      }
      if (synthRef.current && synthRef.current.speaking) {
        synthRef.current.pause();
      }
      setIsPaused(true);
    } else if (isPaused) {
      // User requested Resume
      voiceStreamingClient.resumePlayback();
      if (audioRef.current && audioRef.current.paused && audioRef.current.currentTime > 0) {
        audioRef.current.play().then(() => setIsPaused(false)).catch(() => {});
      } else if (synthRef.current && synthRef.current.paused) {
        synthRef.current.resume();
        setIsPaused(false);
      } else if (currentResponse) {
        setIsPaused(false);
        playSpeech(currentResponse, currentAudioBase64);
      }
    } else if (currentResponse) {
      playSpeech(currentResponse, currentAudioBase64);
    }
  };

  const handleAskVoiceAgent = async (promptToUse?: string) => {
    const prompt = (promptToUse || inputText || transcriptLive).trim();
    if (!prompt) return;

    setLastAskedQuestion(prompt);
    stopAudio();
    setIsGenerating(true);
    setErrorMessage(null);

    const latestDiagnosis: any = diagnoses && diagnoses.length > 0 ? diagnoses[0] : null;

    // Connect complete app and farm context seamlessly behind the scenes (not rendered on screen)
    const farmCtxPayload = {
      farmName: currentFarm?.name || 'My Farm',
      location: currentFarm ? `${currentFarm.location}, ${currentFarm.stateRegion || currentFarm.country}` : 'Farm Location',
      stateRegion: currentFarm?.stateRegion || '',
      country: currentFarm?.country || 'India',
      villageArea: currentFarm?.villageArea || '',
      subDistrict: currentFarm?.subDistrict || '',
      district: currentFarm?.district || '',
      state: currentFarm?.state || currentFarm?.stateRegion || '',
      crop: currentFarm?.crop || 'Crop',
      cropVariety: currentFarm?.cropVariety || 'Standard',
      growthStage: currentFarm?.growthStage || 'Vegetative Stage',
      soilType: currentFarm?.soilType || 'Loam',
      irrigationType: currentFarm?.irrigationType || 'Drip Irrigation',
      farmSize: currentFarm?.farmSize ? `${currentFarm.farmSize} ${currentFarm.farmUnit || 'hectares'}` : '1.5 hectares',
      temperature: weather?.temperature || '28°C',
      humidity: weather?.humidity || '60%',
      rainfall: weather?.rainfall || '0 mm',
      windSpeed: weather?.wind || '12 km/h',
      weatherCondition: weather?.condition || 'Clear Sky',
      forecastSummary: weather?.forecast && weather.forecast.length > 0 
        ? weather.forecast.slice(0, 3).map((f: any) => `${f.day}: ${f.tempMax || f.temp || '28°C'}, ${f.condition}`).join('; ')
        : 'Stable weather outlook for next 3 days',
      soilPh: soilReport?.ph != null ? soilReport.ph : '6.8 (Neutral)',
      soilNitrogen: soilReport?.nitrogen || 'Adequate',
      soilPhosphorus: soilReport?.phosphorus || 'Medium',
      soilPotassium: soilReport?.potassium || 'Optimal',
      soilMoisture: soilReport?.soilMoisture != null ? `${soilReport.soilMoisture}%` : '24% Volumetric',
      organicMatter: soilReport?.organicMatter != null ? `${soilReport.organicMatter}%` : '1.8%',
      soilSummary: soilReport?.summary || 'Good organic matter with balanced topsoil moisture.',
      deficiencies: soilReport?.deficiencies || [],
      soilRegenerativePractices: soilReport?.regenerativeRecommendations || [],
      advisorySummary: advisory?.summary || 'Regular crop care and targeted rootzone water management.',
      todayAction: advisory?.todayAction || 'Check rootzone moisture and inspect for early pest activity.',
      waterManagement: advisory?.waterManagement || 'Maintain drip irrigation run time based on weather.',
      cropProtection: advisory?.cropProtection || 'Scout field edges for early insect activity.',
      regenerativePractice: advisory?.regenerativePractice || 'Maintain organic mulching between rows.',
      next7Days: advisory?.next7Days || 'Day 1: Water check; Day 3: Bio-fertilizer application; Day 5: Pest scouting.',
      recentDiagnosis: latestDiagnosis ? {
        condition: latestDiagnosis.condition || latestDiagnosis.disease || 'Healthy',
        category: latestDiagnosis.category || 'Healthy',
        visualConfidence: latestDiagnosis.visualConfidence != null ? `${latestDiagnosis.visualConfidence}%` : (latestDiagnosis.confidence || 'High'),
        symptoms: latestDiagnosis.visualEvidenceArray || latestDiagnosis.visibleSymptoms || [],
        immediateActions: latestDiagnosis.immediateActionsList || latestDiagnosis.immediateActions || [],
      } : null,
    };

    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      setIsGenerating(false);
      setErrorMessage('Voice AI requires an active internet connection.');
      return;
    }

    try {
      await voiceStreamingClient.sendQuestion(
        prompt,
        voiceConfig.locale,
        farmCtxPayload,
        voiceHistory,
        {
          onStart: () => {
            hasReceivedAudioChunksRef.current = false;
            setIsGenerating(true);
            setErrorMessage(null);
          },
          onTextChunk: (_reqId, fullText) => {
            setCurrentResponse(fullText);
            setInputText('');
            setTranscriptLive('');
          },
          onAudioChunk: (_reqId, _seq, data) => {
            hasReceivedAudioChunksRef.current = true;
            setIsPlaying(true);
            setIsPaused(false);
            setCurrentAudioBase64(data);
          },
          onAudioEnd: () => {
            // Audio finished streaming from server
          },
          onAudioPlaybackEnded: () => {
            setIsPlaying(false);
            setIsPaused(false);
          },
          onAnswerEnd: (_reqId, fullText, provider) => {
            setCurrentResponse(fullText);
            setActiveProvider(provider);
            setIsGenerating(false);
            setInputText('');
            setTranscriptLive('');

            setVoiceHistory((prev) => [
              ...prev,
              { role: 'user', text: prompt },
              { role: 'model', text: fullText },
            ]);

            // If audio chunks were not received (e.g. TTS quota limit reached), play speech locally
            if (!hasReceivedAudioChunksRef.current && !isMuted) {
              playSpeech(fullText, null);
            }
          },
          onError: (_reqId, message) => {
            console.warn('[VoiceAgent Stream] Error:', message);
            setIsGenerating(false);
            setErrorMessage('Voice AI is connecting. Please tap the mic to try again.');
          },
          onFallback: (reason) => {
            console.info('[VoiceAgent Stream] Transparent fallback:', reason);
          },
        }
      );
    } catch (err: any) {
      console.warn('Voice Agent error:', err);
      setErrorMessage('Voice AI is connecting. Please tap the mic to try again.');
      setIsGenerating(false);
    }
  };

  const ui = getVoiceUiStrings(language, voiceConfig.nativeName);

  return (
    <div className={`relative overflow-hidden bg-white dark:bg-[#07170e] text-stone-900 dark:text-stone-100 rounded-2xl shadow-sm border border-emerald-900/15 dark:border-emerald-800/40 transition-all ${compact ? 'p-4' : 'p-5 sm:p-6'}`}>
      {/* Ambient background glow matching app's theme */}
      <div className="absolute top-0 right-1/4 w-72 h-72 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-lime-500/5 dark:bg-lime-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Voice Live Header Bar - Compact horizontal flex row: [Voice Live] [ACTIVE] [Speaker] [Language] */}
      <div className="relative z-10 flex items-center justify-between gap-1.5 sm:gap-2 pb-3 border-b border-emerald-100 dark:border-emerald-900/40 w-full min-w-0 flex-nowrap">
        {/* Left: Voice Live Title & ACTIVE Badge */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 min-w-0">
          <div className="flex items-center gap-1.5 shrink-0">
            <div className="w-7 h-7 sm:w-7.5 sm:h-7.5 rounded-lg bg-emerald-600 dark:bg-emerald-700 text-white flex items-center justify-center shadow-xs shrink-0">
              <Radio className={`w-3.5 h-3.5 text-emerald-100 ${isListening || (isPlaying && !isPaused) ? 'animate-pulse' : ''}`} />
            </div>
            <h3 className="font-heading font-extrabold text-xs sm:text-sm text-stone-900 dark:text-stone-100 whitespace-nowrap leading-none">
              {ui.voiceTitle}
            </h3>
          </div>

          <span className="inline-flex items-center justify-center gap-1 px-2 py-0.5 rounded-full text-[9.5px] sm:text-[10px] font-bold tracking-wide uppercase whitespace-nowrap shrink-0 bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300/60 dark:border-emerald-800 leading-none h-5.5 sm:h-6">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            {ui.activeBadge}
          </span>
        </div>

        {/* Right: Speaker/Mute Button */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 min-w-0">
          {/* Speaker / Mute Toggle Button */}
          <button
            type="button"
            onClick={() => setIsMuted(!isMuted)}
            title={isMuted ? ui.unmuteTitle : ui.muteTitle}
            aria-label={isMuted ? ui.unmuteTitle : ui.muteTitle}
            className={`w-7 h-7 sm:w-7.5 sm:h-7.5 rounded-lg border transition-all cursor-pointer flex items-center justify-center shrink-0 p-0 ${
              isMuted
                ? 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-900/60 text-red-600 dark:text-red-400 shadow-xs'
                : 'bg-emerald-50/70 dark:bg-emerald-950/50 border-emerald-200/80 dark:border-emerald-800/60 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 shadow-2xs'
            }`}
          >
            {isMuted ? (
              <VolumeX className="w-3.5 h-3.5 shrink-0 animate-pulse" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 shrink-0" />
            )}
          </button>
        </div>
      </div>

      {/* Interactive Voice Live Sphere & Soundwave Radar */}
      <div className="relative z-10 my-4 flex flex-col items-center justify-center text-center">
        {/* Animated Radial Waves & Live Mic Orb */}
        <div className="relative flex items-center justify-center my-3">
          {/* Pulsing rings in active listening mode */}
          {isListening && (
            <>
              <span className="absolute w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-emerald-500/15 dark:bg-emerald-400/20 animate-ping" />
              <span className="absolute w-26 h-26 sm:w-32 sm:h-32 rounded-full bg-emerald-500/25 dark:bg-emerald-400/30 animate-pulse" />
            </>
          )}

          {/* Pulsing rings in active speaking mode */}
          {isPlaying && !isPaused && (
            <>
              <span className="absolute w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-lime-500/15 dark:bg-lime-400/20 animate-ping" />
              <span className="absolute w-26 h-26 sm:w-32 sm:h-32 rounded-full bg-emerald-500/20 dark:bg-emerald-400/25 animate-pulse" />
            </>
          )}

          {/* Central Voice Orb Button */}
          <button
            type="button"
            onClick={toggleListening}
            disabled={isGenerating}
            title={isListening ? ui.stopListening : ui.tapToStart}
            className={`relative z-10 w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center shadow-md transition-all transform active:scale-95 cursor-pointer ${
              isListening
                ? 'bg-gradient-to-tr from-emerald-600 via-teal-500 to-emerald-400 text-white ring-4 ring-emerald-400/50 shadow-emerald-500/30'
                : isGenerating
                ? 'bg-gradient-to-tr from-emerald-700 via-lime-600 to-emerald-500 text-white ring-4 ring-lime-400/40 animate-pulse'
                : isPlaying && !isPaused
                ? 'bg-gradient-to-tr from-emerald-600 via-teal-600 to-emerald-500 text-white ring-4 ring-emerald-400/50 shadow-emerald-500/25'
                : 'bg-gradient-to-tr from-emerald-800 via-emerald-700 to-emerald-600 hover:from-emerald-700 hover:to-emerald-500 text-white shadow-emerald-950/20'
            }`}
          >
            {isGenerating ? (
              <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 animate-spin text-emerald-100" />
            ) : isListening ? (
              <MicOff className="w-8 h-8 sm:w-10 sm:h-10 animate-bounce text-white" />
            ) : isPlaying && !isPaused ? (
              <Volume2 className="w-8 h-8 sm:w-10 sm:h-10 animate-pulse text-white" />
            ) : (
              <Mic className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            )}
          </button>
        </div>

        {/* Live Audio Visualizer Bar when Speaking or Listening */}
        {(isListening || (isPlaying && !isPaused)) && (
          <div className="flex items-center gap-1 my-2 justify-center h-6">
            <span className="w-1 bg-emerald-500 dark:bg-emerald-400 rounded-full animate-bounce h-2 [animation-delay:-0.4s]" />
            <span className="w-1 bg-emerald-600 dark:bg-emerald-300 rounded-full animate-bounce h-4 [animation-delay:-0.2s]" />
            <span className="w-1 bg-teal-500 dark:bg-teal-400 rounded-full animate-bounce h-5.5" />
            <span className="w-1 bg-lime-500 dark:bg-lime-400 rounded-full animate-bounce h-3 [animation-delay:-0.3s]" />
            <span className="w-1 bg-emerald-500 dark:bg-emerald-400 rounded-full animate-bounce h-2 [animation-delay:-0.1s]" />
          </div>
        )}

        {/* Live Voice Status Label */}
        <div className="space-y-0.5 mt-1">
          <p className="font-heading font-bold text-sm text-stone-800 dark:text-stone-100">
            {isListening
              ? ui.listening
              : isGenerating
              ? ui.thinking
              : isPlaying && !isPaused
              ? ui.speaking
              : isPaused
              ? ui.paused
              : ui.tapToSpeak}
          </p>
          <p className="text-[11px] text-stone-500 dark:text-stone-400">
            {isListening
              ? ui.speakPrompt
              : isPlaying && !isPaused
              ? ui.speakingHint
              : ui.defaultHint}
          </p>
        </div>

        {/* Live Speech Transcription preview */}
        {transcriptLive && (
          <div className="mt-2.5 px-3 py-1.5 rounded-lg bg-emerald-50/80 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800/60 text-xs text-stone-700 dark:text-stone-300 max-w-md">
            <span className="font-semibold text-emerald-700 dark:text-emerald-400">{ui.you}: </span>
            "{transcriptLive}"
          </div>
        )}
      </div>

      {/* Small, Compact Quick Questions Bar */}
      <div className="relative z-10 p-2 sm:p-2.5 bg-stone-50/50 dark:bg-[#030d07]/40 border border-emerald-900/10 dark:border-emerald-800/20 rounded-xl max-w-xl mx-auto mt-2.5 mb-1.5 shadow-3xs">
        <div className="flex flex-col gap-1.5 w-full">
          {voiceConfig.quickPrompts.slice(0, 4).map((qp, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setInputText(qp.prompt);
                handleAskVoiceAgent(qp.prompt);
              }}
              disabled={isGenerating || isListening}
              className="text-[11px] leading-normal bg-stone-50 hover:bg-emerald-50 text-stone-700 dark:bg-stone-900/60 dark:hover:bg-emerald-950/60 dark:text-stone-300 border border-stone-200/80 dark:border-emerald-900/50 hover:border-emerald-500/50 px-3.5 py-2.5 rounded-xl transition-all cursor-pointer disabled:opacity-50 text-left font-semibold active:scale-98 shadow-2xs flex items-center justify-between w-full"
            >
              <span>{qp.label}</span>
              <ChevronRight className="w-3.5 h-3.5 text-stone-400 dark:text-stone-500 shrink-0 ml-2" />
            </button>
          ))}
        </div>
      </div>

      {/* Error Notice */}
      {errorMessage && (
        <div className="relative z-10 p-2.5 my-2 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 rounded-xl text-xs text-red-700 dark:text-red-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Spoken Voice Answer Card (Clean, voice-focused) */}
      {currentResponse && (
        <div className="relative z-10 mt-3 bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 rounded-xl p-3.5 sm:p-4 space-y-3 shadow-2xs">
          {/* Last Asked Question Bubble */}
          {lastAskedQuestion && (
            <div className="bg-stone-50/80 dark:bg-[#040e08]/60 border border-stone-200/50 dark:border-emerald-900/30 rounded-lg p-2.5 text-xs text-stone-700 dark:text-stone-300">
              <span className="font-bold text-stone-500 dark:text-stone-400 block mb-0.5 uppercase tracking-wide text-[9.5px]">
                {ui.you}
              </span>
              <p className="italic font-medium">"{lastAskedQuestion}"</p>
            </div>
          )}

          <div className="flex items-center justify-between gap-2 border-b border-emerald-200/60 dark:border-emerald-900/60 pb-2">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300">
                {ui.responseTitle}
              </span>
            </div>

            {/* Audio Controls */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setIsMuted(!isMuted)}
                title={isMuted ? ui.unmuteTitle : ui.muteTitle}
                className="p-1 rounded-md bg-white dark:bg-stone-800 hover:bg-emerald-50 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 text-xs transition-colors border border-stone-200 dark:border-stone-700 cursor-pointer"
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5 text-stone-400" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />}
              </button>

              {/* Pause / Resume Button */}
              <button
                type="button"
                onClick={handleTogglePause}
                title={isPlaying && !isPaused ? ui.pause : ui.play}
                className="px-2 py-1 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-semibold transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
              >
                {isPlaying && !isPaused ? (
                  <>
                    <Pause className="w-3 h-3 text-white" />
                    <span>{ui.pause}</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3 h-3 text-white" />
                    <span>{ui.play}</span>
                  </>
                )}
              </button>

              {/* Replay */}
              <button
                type="button"
                onClick={() => playSpeech(currentResponse, currentAudioBase64)}
                title={ui.replay}
                className="p-1 rounded-md bg-white dark:bg-stone-800 hover:bg-emerald-50 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 text-xs transition-colors border border-stone-200 dark:border-stone-700 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              </button>
            </div>
          </div>

          {/* Response Text */}
          <p className="text-xs sm:text-sm leading-relaxed text-stone-800 dark:text-emerald-100 font-medium">
            "{currentResponse}"
          </p>
        </div>
      )}

      {/* Subtle Collapsible Text Option */}
      <div className="relative z-10 pt-2 mt-2 border-t border-emerald-100/80 dark:border-emerald-900/30">
        <button
          type="button"
          onClick={() => setShowTextInput(!showTextInput)}
          className="flex items-center justify-center gap-1 mx-auto text-[11px] text-stone-500 dark:text-stone-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors py-0.5 cursor-pointer"
        >
          <Keyboard className="w-3 h-3" />
          <span>{showTextInput ? ui.hideKeyboard : ui.typeQuestion}</span>
          {showTextInput ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>

        {showTextInput && (
          <div className="flex items-center gap-2 mt-2 bg-stone-50 dark:bg-stone-900/80 border border-stone-200 dark:border-emerald-900/60 rounded-xl p-1.5 shadow-2xs focus-within:ring-2 focus-within:ring-emerald-500/30 focus-within:border-emerald-500 transition-all">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAskVoiceAgent();
              }}
              placeholder={ui.inputPlaceholder}
              disabled={isGenerating}
              className="flex-1 bg-transparent text-xs text-stone-900 dark:text-white placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none px-2 font-medium"
            />
            <button
              type="button"
              onClick={() => handleAskVoiceAgent()}
              disabled={isGenerating || !inputText.trim()}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-2.5 py-1 rounded-lg text-xs flex items-center gap-1 shadow-xs transition-colors cursor-pointer disabled:opacity-40 shrink-0"
            >
              {isGenerating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
              <span>{ui.send}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
