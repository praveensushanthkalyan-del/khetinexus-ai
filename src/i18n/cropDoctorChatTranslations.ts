import { Language, FarmProfile, DiagnosisResult, CropDoctorChatMessage } from '../types';
import { localizeCrop } from './dataTranslations';
import { normalizeLang } from './farmValueTranslations';

export interface CropDoctorFrameworkCard {
  id: string;
  stepNumber: string;
  title: string;
  description: string;
}

export function getCropDoctorInitialExplanation(
  lang: Language,
  conditionName: string,
  categoryName: string,
  isUnable: boolean,
  imagesCount: number
): string {
  const norm = normalizeLang(lang);
  const countLabel = imagesCount > 1 ? 'photos' : 'photo';

  if (isUnable) {
    switch (norm) {
      case 'te':
        return 'నేను అప్‌లోడ్ చేసిన ఫోటోలను పరిశీలించాను. దృశ్య లక్షణాలు ప్రస్తుతం అసంపూర్ణంగా ఉన్నాయి. దయచేసి స్పష్టమైన నమూనాను అందించండి.';
      case 'hi':
        return 'मैंने अपलोड की गई तस्वीरों का निरीक्षण किया है। दृश्य लक्षण फिलहाल अनिर्णायक हैं। कृपया अच्छी रोशनी में स्पष्ट तस्वीर अपलोड करें।';
      case 'ta':
        return 'பதிவேற்றப்பட்ட புகைப்படங்களை ஆய்வு செய்தேன். காட்சி அறிகுறிகள் தற்போது முடிவற்றதாக உள்ளன. தயவுசெய்து தெளிவான மாதிரியைப் பதிவேற்றவும்.';
      case 'kn':
        return 'ಅಪ್‌ಲೋಡ್ ಮಾಡಿದ ಫೋಟೋಗಳನ್ನು ಪರಿಶೀಲಿಸಲಾಗಿದೆ. ದೃಶ್ಯ ಲಕ್ಷಣಗಳು ಪ್ರಸ್ತುತ ಅನಿರ್ದಿಷ್ಟವಾಗಿವೆ. ದಯವಿಟ್ಟು ಸ್ಪಷ್ಟವಾದ ಫೋಟೋ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ.';
      case 'ml':
        return 'അപ്‌ലോഡ് ചെയ്ത ഫോട്ടോകൾ പരിശോധിച്ചു. ലക്ഷണങ്ങൾ ഇപ്പോൾ വ്യക്തമല്ല. ദയവായി വ്യക്തമായ ചിത്രം നൽകുക.';
      case 'mr':
        return 'अपलोड केलेल्या छायाचित्रांची पाहणी केली. दृश्य लक्षणे सध्या अनिर्णित आहेत. कृपया स्पष्ट छायाचित्र अपलोड करा.';
      case 'gu':
        return 'અપલોડ કરેલા ફોટા તપાસ્યા છે. લક્ષણો હાલમાં અસ્પષ્ટ છે. કૃપા કરીને સ્પષ્ટ ફોટો અપલોડ કરો.';
      case 'bn':
        return 'আপলোড করা ছবি পরীক্ষা করা হয়েছে। দৃশ্যমান লক্ষণগুলি আপাতত অনির্ণায়ক। অনুগ্রহ করে পরিষ্কার ছবি আপলোড করুন।';
      case 'pa':
        return 'ਅਪਲੋਡ ਕੀਤੀਆਂ ਫੋਟੋਆਂ ਦੀ ਜਾਂਚ ਕੀਤੀ ਗਈ ਹੈ। ਲੱਛਣ ਅਜੇ ਸਪੱਸ਼ਟ ਨਹੀਂ ਹਨ। ਕਿਰਪਾ ਕਰਕੇ ਸਾਫ਼ ਫੋਟੋ ਅਪਲੋਡ ਕਰੋ।';
      case 'or':
        return 'ଅପଲୋଡ୍ ହୋଇଥିବା ଫଟୋଗୁଡ଼ିକ ପରୀକ୍ଷା କରାଯାଇଛି। ଲକ୍ଷଣଗୁଡ଼ିକ ଏବେ ଅସ୍ପଷ୍ଟ ଅଛି। ଦୟାକରି ସ୍ପଷ୍ଟ ଫଟୋ ଦିଅନ୍ତୁ।';
      case 'as':
        return 'আপলোড কৰা ফটোসমূহ পৰীক্ষা কৰা হৈছে। দৃশ্যমান লক্ষণসমূহ বৰ্তমান স্পষ্ট নহয়। অনুগ্ৰহ কৰি স্পষ্ট ফটো আপলোড কৰক।';
      case 'ur':
        return 'اپ لوڈ کردہ تصاویر کا جائزہ لیا گیا ہے۔ علامات فی الحال غیر حتمی ہیں۔ براہ کرم واضح تصویر فراہم کریں۔';
      case 'es':
        return 'He inspeccionado las fotos subidas. Los síntomas visuales son actualmente inconclusos.';
      case 'fr':
        return 'J\'ai inspecté les photos téléchargées. Les symptômes visuels ne sont pas concluants pour le moment.';
      case 'pt':
        return 'Inspecionei as fotos enviadas. Os sintomas visuais são atualmente inconclusivos.';
      case 'ar':
        return 'لقد قمت بفحص الصور المرفوعة. الأعراض المرئية غير حاسمة حالياً.';
      case 'ru':
        return 'Я проверил загруженные фотографии. Визуальные симптомы в настоящее время неубедительны.';
      case 'zh':
        return '我已经检查了上传的照片。目前的视觉症状尚不明确。请上传更清晰的样本。';
      default:
        return `I've inspected the uploaded ${countLabel}. The visual symptoms are currently inconclusive.`;
    }
  }

  switch (norm) {
    case 'te':
      return `నేను అప్‌లోడ్ చేసిన నమూనా ఫోటోలను పరిశీలించాను. లక్షణాల ఆధారంగా ఇది **${conditionName}** (${categoryName}) గా గుర్తించబడింది.`;
    case 'hi':
      return `मैंने अपलोड किए गए नमूने की तस्वीरों की जांच की है और लक्षणों का मिलान **${conditionName}** (${categoryName}) से हुआ है।`;
    case 'ta':
      return `பதிவேற்றப்பட்ட மாதிரி புகைப்படங்களை ஆய்வு செய்து, அறிகுறிகள் **${conditionName}** (${categoryName}) உடன் பொருந்துகின்றன.`;
    case 'kn':
      return `ಅಪ್‌ಲೋಡ್ ಮಾಡಿದ ಮಾದರಿ ಫೋಟೋಗಳನ್ನು ಪರಿಶೀಲಿಸಿ ರೋಗಲಕ್ಷಣಗಳು **${conditionName}** (${categoryName}) ಗೆ ಹೊಂದಿಕೆಯಾಗುತ್ತವೆ.`;
    case 'ml':
      return `അപ്‌ലോഡ് ചെയ്ത ഫോട്ടോകൾ പരിശോധിച്ച് ലക്ഷണങ്ങൾ **${conditionName}** (${categoryName}) എന്ന് കണ്ടെത്തി.`;
    case 'mr':
      return `अपलोड केलेल्या नमुना छायाचित्रांची पाहणी केली असून लक्षणे **${conditionName}** (${categoryName}) शी जुळत आहेत.`;
    case 'gu':
      return `અપલોડ કરેલા નમૂનાના ફોટા તપાસ્યા છે અને લક્ષણો **${conditionName}** (${categoryName}) સાથે મેળ ખાય છે.`;
    case 'bn':
      return `আপলোড করা নমুনার ছবি পরীক্ষা করে লক্ষণগুলি **${conditionName}** (${categoryName}) এর সাথে মিলেছে।`;
    case 'pa':
      return `ਅਪਲੋਡ ਕੀਤੀਆਂ ਨਮੂਨੇ ਦੀਆਂ ਫੋਟੋਆਂ ਦੀ ਜਾਂਚ ਕੀਤੀ ਗਈ ਹੈ ਅਤੇ ਲੱਛਣ **${conditionName}** (${categoryName}) ਨਾਲ ਮੇਲ ਖਾਂਦੇ ਹਨ।`;
    case 'or':
      return `ଅପଲୋଡ୍ ହୋଇଥିବା ନମୁନା ଫଟୋଗୁଡ଼ିକୁ ପରୀକ୍ଷା କରି ଲକ୍ଷଣଗୁଡ଼ିକ **${conditionName}** (${categoryName}) ସହିତ ମେଳ ଖାଉଛି।`;
    case 'as':
      return `আপলোড কৰা নমুনাৰ ফটো পৰীক্ষা কৰি লক্ষণসমূহ **${conditionName}** (${categoryName}) ৰ সৈতে মিল পাইছো।`;
    case 'ur':
      return `اپ لوڈ کردہ نمونے کی تصاویر کی جانچ کی گئی ہے اور علامات کا موازنہ **${conditionName}** (${categoryName}) سے ہوا ہے۔`;
    case 'es':
      return `He revisado las fotos de las muestras subidas y los síntomas coinciden con **${conditionName}** (${categoryName}).`;
    case 'fr':
      return `J'ai examiné les photos d'échantillons téléchargées et les symptômes correspondent à **${conditionName}** (${categoryName}).`;
    case 'pt':
      return `Analisei as fotos das amostras enviadas e os sintomas coincidem com **${conditionName}** (${categoryName}).`;
    case 'ar':
      return `لقد فحصت صور العينات المرفوعة وتطابقت الأعراض مع **${conditionName}** (${categoryName}).`;
    case 'ru':
      return `Я изучил загруженные фотографии образцов, симптомы соответствуют **${conditionName}** (${categoryName}).`;
    case 'zh':
      return `我已经检查了上传的样本照片，症状与 **${conditionName}** (${categoryName}) 相符。`;
    default:
      return `I've reviewed the uploaded specimen ${countLabel} and matched the symptoms with **${conditionName}** (${categoryName}).`;
  }
}

export function getCropDoctorAiGreeting(lang: Language, country: string, rawCropName: string): string {
  const norm = normalizeLang(lang);
  const crop = localizeCrop(rawCropName, lang) || rawCropName;

  switch (norm) {
    case 'te':
      return `నమస్కారం! నేను మీ **KhetiNexus AI క్రాప్ డాక్టర్ బాట్** 🌾. మీ ${crop} పంట కోసం తెగుళ్లు, ఆకుల మచ్చలు, కీటకాలు మరియు పోషక లోపాలను గుర్తించడంలో నేను సహాయపడగలను. కుడివైపున మీ ఆకు నమూనాను అప్‌లోడ్ చేయండి లేదా పంట ఆరోగ్యంపై ఏవైనా ప్రశ్నలను అడగండి.`;
    case 'hi':
      return `नमस्ते! मैं आपका **KhetiNexus AI क्रॉप डॉक्टर बॉट** 🌾 हूँ। मैं आपके ${crop} खेत के लिए फसल रोगों, पत्तियों के धब्बों, कीटों और पोषक तत्वों की कमी की पहचान करने में मदद कर सकता हूँ। दाईं ओर प्रभावित पत्ती का नमूना अपलोड करें या मुझसे कोई भी प्रश्न पूछें।`;
    case 'ta':
      return `வணக்கம்! நான் உங்கள் **KhetiNexus AI பயிர் மருத்துவர் பாட்** 🌾. உங்கள் ${crop} பயிருக்கான நோய்கள், இலை புள்ளிகள், பூச்சிகள் மற்றும் ஊட்டச்சத்து குறைபாடுகளைக் கண்டறிய உதவ முடியும். வலதுபுறத்தில் இலை மாதிரியைப் பதிவேற்றவும் அல்லது கேள்விகளைக் கேட்கவும்.`;
    case 'kn':
      return `ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ **KhetiNexus AI ಕ್ರಾಪ್ ಡಾಕ್ಟರ್ ಬಾಟ್** 🌾. ನಿಮ್ಮ ${crop} ಬೆಳೆಯ ರೋಗಗಳು, ಎಲೆ ಮಚ್ಚೆಗಳು, ಕೀಟಗಳು ಮತ್ತು ಪೋಷಕಾಂಶಗಳ ಕೊರತೆಯನ್ನು ಗುರುತಿಸಲು ನಾನು ಸಹಾಯ ಮಾಡಬಲ್ಲೆ. ಬಲಭಾಗದಲ್ಲಿ ಎಲೆಯ ಮಾದರಿಯನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ ಅಥವಾ ಪ್ರಶ್ನೆಗಳನ್ನು ಕೇಳಿ.`;
    case 'ml':
      return `നമസ്കാരം! ഞാൻ നിങ്ങളുടെ **KhetiNexus AI ക്രോപ്പ് ഡോക്ടർ ബോട്ട്** 🌾 ആണ്. നിങ്ങളുടെ ${crop} കൃഷിക്കുള്ള രോഗങ്ങൾ, ഇലകളിലെ പാടുകൾ, കീടങ്ങൾ, പോഷകക്കുറവ് എന്നിവ തിരിച്ചറിയാൻ എനിക്ക് സഹായിക്കാനാകും. വലതുവശത്ത് ഇലയുടെ ചിത്രം അപ്‌ലോഡ് ചെയ്യുക.`;
    case 'mr':
      return `नमस्कार! मी तुमचा **KhetiNexus AI क्रॉप डॉक्टर बॉट** 🌾 आहे. मी तुमच्या ${crop} पिकावरील रोग, पानांवरील डाग, कीड आणि पोषक घटकांची कमतरता ओळखण्यात मदत करू शकतो. उजवीकडे पानांचे छायाचित्र अपलोड करा किंवा कोणताही प्रश्न विचारा.`;
    case 'gu':
      return `નમસ્તે! હું તમારો **KhetiNexus AI ક્રોપ ડૉક્ટર બોટ** 🌾 છું. હું તમારા ${crop} પાકના રોગો, પાંદડાના ડાઘ, જીવાતો અને પોષક તત્વોની ઉણપ ઓળખવામાં મદદ કરી શકું છું. જમણી બાજુએ પાંદડાનો નમૂનો અપલોડ કરો.`;
    case 'bn':
      return `নমস্কার! আমি আপনার **KhetiNexus AI ক্রপ ডক্টর বট** 🌾। আমি আপনার ${crop} ফসলের রোগ, পাতার দাগ, ক্ষতিকারক পোকা এবং পুষ্টির ঘাটতি শনাক্ত করতে সাহায্য করতে পারি। ডানদিকে পাতার নমুনা আপলোড করুন বা প্রশ্ন করুন।`;
    case 'pa':
      return `ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਤੁਹਾਡਾ **KhetiNexus AI ਫਸਲ ਡਾਕਟਰ ਬੋਟ** 🌾 ਹਾਂ। ਮੈਂ ਤੁਹਾਡੀ ${crop} ਫਸਲ ਦੀਆਂ ਬਿਮਾਰੀਆਂ, ਪੱਤਿਆਂ ਦੇ ਧੱਬੇ, ਕੀੜੇ ਅਤੇ ਪੋਸ਼ਕ ਤੱਤਾਂ ਦੀ ਘਾਟ ਦੀ ਪਛਾਣ ਕਰਨ ਵਿੱਚ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ। ਸੱਜੇ ਪਾਸੇ ਪੱਤੇ ਦੀ ਫੋਟੋ ਅਪਲੋਡ ਕਰੋ।`;
    case 'or':
      return `ନମସ୍କାର! ମୁଁ ଆପଣଙ୍କର **KhetiNexus AI ଫସଲ ଡାକ୍ତର ବଟ୍** 🌾। ମୁଁ ଆପଣଙ୍କର ${crop} ଫସଲ ରୋଗ, ପତ୍ର ଦାଗ, କୀଟ ଏବଂ ପୋଷକ ତତ୍ତ୍ୱର ଅଭାବ ଚିହ୍ନଟ କରିବାରେ ସାହାଯ୍ୟ କରିପାରିବି। ଡାହାଣ ପଟେ ପତ୍ରର ଫଟୋ ଅପଲୋଡ୍ କରନ୍ତୁ।`;
    case 'as':
      return `নমস্কাৰ! মই আপোনাৰ **KhetiNexus AI শস্য চিকিৎসক বট** 🌾। মই আপোনাৰ ${crop} খেতিৰ ৰোগ, পাতৰ দাগ, পোক-পতংগ আৰু পুষ্টিহীনতা চিনাক্ত কৰাত সহায় কৰিব পাৰোঁ। সোঁফালে পাতৰ ফটো আপলোড কৰক।`;
    case 'ur':
      return `السلام علیکم! میں آپ کا **KhetiNexus AI کراپ ڈاکٹر بوٹ** 🌾 ہوں۔ میں آپ کی ${crop} فصل کے امراض، پتوں کے داغ، کیڑوں اور غذائی کمی کی شناخت میں مدد کر سکتا ہوں۔ دائیں جانب پتے کا نمونہ اپ لوڈ کریں یا کوئی سوال پوچھیں۔`;
    case 'ar':
      return `مرحباً! أنا **مساعد طبيب المحاصيل الذكي KhetiNexus AI** 🌾. يمكنني مساعدتك في تشخيص أمراض محصول الـ ${crop}، وتبقعات الأوراق، والآفات الحشرية، ونقص العناصر الغذائية.`;
    case 'es':
      return `¡Hola! Soy tu **KhetiNexus AI Crop Doctor Bot** 🌾. Puedo ayudarte a identificar enfermedades de cultivos, manchas foliares, plagas y deficiencias de nutrientes en tu cultivo de ${crop}.`;
    case 'fr':
      return `Bonjour ! Je suis votre **KhetiNexus AI Crop Doctor Bot** 🌾. Je peux vous aider à identifier les maladies des cultures, les taches foliaires, les ravageurs et les carences en nutriments pour votre culture de ${crop}.`;
    case 'pt':
      return `Olá! Sou o seu **KhetiNexus AI Crop Doctor Bot** 🌾. Posso ajudar a identificar doenças de culturas, manchas foliares, pragas de insetos e deficiências nutricionais para a sua fazenda de ${crop}. Envie uma foto da folha afetada à direita ou faça qualquer pergunta sobre saúde vegetal.`;
    case 'ru':
      return `Здравствуйте! Я ваш **KhetiNexus AI Crop Doctor Bot** 🌾. Я могу помочь выявить болезни культур, пятна на листьях, вредителей и дефицит питательных веществ для вашей фермы (${crop}). Загрузите образец листа справа или задайте любые вопросы по защите растений.`;
    case 'zh':
      return `您好！我是您的 **KhetiNexus AI 农作物医生助手** 🌾。我可以为您在 ${crop} 农场的作物病害、叶斑、害虫以及养分缺乏提供诊断与指导。请在右侧上传叶片标本，或直接提出您关心的植物健康问题。`;
    default:
      return `Namaste! I am your **KhetiNexus AI Crop Doctor Bot** 🌾. I can help identify crop diseases, leaf spots, insect pests, and nutrient deficiencies for your ${crop} farm. Upload your leaf specimen on the right or ask me any plant health questions.`;
  }
}

export function getCropDoctorVerifiedPoint(lang: Language, rawCropName: string): string {
  const norm = normalizeLang(lang);
  const crop = localizeCrop(rawCropName, lang) || rawCropName;

  switch (norm) {
    case 'te':
      return `${crop} సాగు మరియు సస్యరక్షణ కోసం పరిశోధనాత్మక క్షేత్ర జ్ఞానం అనుసంధానించబడింది.`;
    case 'hi':
      return `${crop} की खेती एवं पादप सुरक्षा के लिए प्रमाणित कृषि अनुसंधान ज्ञान जुड़ा हुआ है।`;
    case 'ta':
      return `${crop} சாகுபடி மற்றும் பயிர் பாதுகாப்புக்கான கள அறிவியல் வழிகாட்டுதல் இணைக்கப்பட்டுள்ளது.`;
    case 'kn':
      return `${crop} ಕೃಷಿ ಮತ್ತು ಬೆಳೆ ಸಂರಕ್ಷಣೆಗಾಗಿ ಸಂಶೋಧನಾತ್ಮಕ ಕೃಷಿ ಜ್ಞಾನ ಅಳವಡಿಸಲಾಗಿದೆ.`;
    case 'ml':
      return `${crop} കൃഷിക്കും സസ്യസംരക്ഷണത്തിനുമുള്ള ശാസ്ത്രീയ അറിവുകൾ അടിസ്ഥാനമാക്കി തയ്യാറാക്കിയത്.`;
    case 'mr':
      return `${crop} लागवड आणि पीक संरक्षणासाठी प्रमाणित कृषी विस्तार ज्ञान जोडलेले आहे.`;
    case 'gu':
      return `${crop} ખેતી અને પાક સંરક્ષણ માટે પ્રમાણિત કૃષિ સંશોધન જ્ઞાન જોડાયેલું છે.`;
    case 'bn':
      return `${crop} চাষ এবং ফসল সুরক্ষার জন্য প্রামাণ্য কৃষি গবেষণা জ্ঞান সংযুক্ত।`;
    case 'pa':
      return `${crop} ਕਾਸ਼ਤ ਅਤੇ ਫਸਲ ਸੁਰੱਖਿਆ ਲਈ ਪ੍ਰਮਾਣਿਤ ਖੇਤੀਬਾੜੀ ਗਿਆਨ ਅਧਾਰਤ।`;
    case 'or':
      return `${crop} ଚାଷ ଏବଂ ଫସଲ ସୁରକ୍ଷା ପାଇଁ ପ୍ରାମାଣିକ କୃଷି ଗବେଷଣା ଜ୍ଞାନ ସଂଯୁକ୍ତ।`;
    case 'as':
      return `${crop} খেতি আৰু শস্য সুৰক্ষাৰ বাবে প্ৰামাণিক কৃষি গৱেষণা তথ্য সংলগ্ন।`;
    case 'ur':
      return `${crop} کاشتکاری اور پودوں کے تحفظ کے لیے مستند زرعی تحقیقی معلومات مربوط ہیں۔`;
    case 'pt':
      return `Conhecimento fitossanitário integrado para cultivo e proteção de ${crop}.`;
    case 'es':
      return `Conocimiento agronómico verificado para el cultivo y protección de ${crop}.`;
    case 'fr':
      return `Connaissances agronomiques vérifiées pour la culture et la protection de ${crop}.`;
    case 'ar':
      return `تم التحقق من المعرفة الزراعية والوقائية لزراعة وحماية محصول الـ ${crop}.`;
    case 'ru':
      return `Агрономические знания верифицированы для возделывания и защиты культуры ${crop}.`;
    case 'zh':
      return `基于 ${crop} 种植与植保技术的农业综合知识库支持。`;
    default:
      return `Ground-truth knowledge grounded for ${crop} cultivation & plant protection.`;
  }
}

export function getCropDoctorSuggestedAction(lang: Language): string {
  const norm = normalizeLang(lang);

  switch (norm) {
    case 'te':
      return 'మంచి వెలుతురులో ఆకుల పైభాగం & కింద భాగం యొక్క స్పష్టమైన ఫోటోలను తీయండి.';
    case 'hi':
      return 'अच्छी रोशनी में प्रभावित पत्तियों के ऊपरी व निचले हिस्से की स्पष्ट तस्वीरें लें।';
    case 'ta':
      return 'நல்ல வெளிச்சத்தில் பாதிக்கப்பட்ட இலைகளின் மேல் மற்றும் கீழ் பகுதிகளை புகைப்படம் எடுக்கவும்.';
    case 'kn':
      return 'ಉತ್ತಮ ಬೆಳಕಿನಲ್ಲಿ ಪೀಡಿತ ಎಲೆಗಳ ಮೇಲ್ಭಾಗ ಮತ್ತು ಕೆಳಭಾಗದ ಸ್ಪಷ್ಟ ಫೋಟೋಗಳನ್ನು ತೆಗೆಯಿರಿ.';
    case 'ml':
      return 'നല്ല വെളിച്ചത്തിൽ ഇലകളുടെ മുകൾഭാഗവും അടിഭാഗവും വ്യക്തമായി ഫോട്ടോ എടുക്കുക.';
    case 'mr':
      return 'चांगल्या प्रकाशात प्रादुर्भावग्रस्त पानांच्या वरच्या आणि खालच्या भागाचे स्पष्ट फोटो घ्या.';
    case 'gu':
      return 'સારા પ્રકાશમાં અસરગ્રસ્ત પાંદડાની ઉપરની અને નીચેની સપાટીના સ્પષ્ટ ફોટા લો.';
    case 'bn':
      return 'ভালো আলোতে আক্রান্ত পাতার ওপরের ও নিচের পিঠের স্পষ্ট ছবি তুলুন।';
    case 'pa':
      return 'ਚੰਗੀ ਰੋਸ਼ਨੀ ਵਿੱਚ ਪ੍ਰਭਾਵਿਤ ਪੱਤਿਆਂ ਦੇ ਉੱਪਰਲੇ ਅਤੇ ਹੇਠਲੇ ਹਿੱਸੇ ਦੀਆਂ ਸਾਫ਼ ਫੋਟੋਆਂ ਖਿੱਚੋ।';
    case 'or':
      return 'ଭଲ ଆଲୋକରେ ପ୍ରଭାବିତ ପତ୍ରର ଉପର ଏବଂ ତଳ ପାର୍ଶ୍ୱର ସ୍ପଷ୍ଟ ଫଟୋ ଉଠାନ୍ତୁ।';
    case 'as':
      return 'ভাল পোহৰত আক্ৰান্ত পাতৰ ওপৰ আৰু তল পিঠিৰ স্পষ্ট ফটো তোলক।';
    case 'ur':
      return 'اچھی روشنی میں متاثرہ پتوں کے اوپری اور نچلے حصے کی واضح تصاویر لیں۔';
    case 'pt':
      return 'Tire fotos nítidas da parte superior e inferior das folhas afetadas com boa iluminação.';
    case 'es':
      return 'Tome fotografías nítidas del haz y el envés de las hojas afectadas con buena luz.';
    case 'fr':
      return 'Prenez des photos nettes du dessus et du dessous des feuilles sous une bonne lumière.';
    case 'ar':
      return 'التقط صوراً واضحة لسطح الأوراق العلوي والسفلي في إضاءة جيدة.';
    case 'ru':
      return 'Сделайте четкие фотографии верхней и нижней стороны пораженных листьев при хорошем освещении.';
    case 'zh':
      return '请在良好光线下拍摄受影响叶片的正面与背面清晰特写照片。';
    default:
      return 'Take close-up photos of top & bottom of affected leaves in good light.';
  }
}

export function getCropDoctorDefaultQuickQuestions(lang: Language): string[] {
  const norm = normalizeLang(lang);

  switch (norm) {
    case 'te':
      return [
        'మంచి ఆకు ఫోటో ఎలా తీయాలి?',
        'ఆకు తుప్పు తెగులు దేనివల్ల వస్తుంది?',
        'శిలీంధ్ర కుళ్లును ఎలా నివారించాలి?',
        'ఏ సేంద్రియ పిచికారీ ఉత్తమంగా పనిచేస్తుంది?',
      ];
    case 'hi':
      return [
        'अच्छी पत्ती की फोटो कैसे लें?',
        'पत्ती का रतुआ रोग क्यों होता है?',
        'फफूंद सड़न को कैसे रोकें?',
        'कौन सा जैविक स्प्रे सबसे अच्छा है?',
      ];
    case 'ta':
      return [
        'நல்ல இலை புகைப்படம் எடுப்பது எப்படி?',
        'இலை துரு நோய் எதனால் ஏற்படுகிறது?',
        'பூஞ்சை அழுகலை எப்படி தடுப்பது?',
        'எந்த இயற்கை தெளிப்பான் சிறந்தது?',
      ];
    case 'kn':
      return [
        'ಉತ್ತಮ ಎಲೆಯ ಫೋಟೋ ತೆಗೆಯುವುದು ಹೇಗೆ?',
        'ಎಲೆ ತುಕ್ಕು ರೋಗ ಏಕೆ ಬರುತ್ತದೆ?',
        'ಶಿಲೀಂಧ್ರ ಕೊಳೆತವನ್ನು ತಡೆಯುವುದು ಹೇಗೆ?',
        'ಯಾವ ಜೈವಿಕ ಸಿಂಪಡಣೆ ಅತ್ಯುತ್ತಮ?',
      ];
    case 'ml':
      return [
        'നല്ല ഇലയുടെ ഫോട്ടോ എങ്ങനെ എടുക്കാം?',
        'ഇല തുരുമ്പ് രോഗം വരുന്നത് എന്തുകൊണ്ട്?',
        'ഫംഗസ് ചീയൽ എങ്ങനെ തടയാം?',
        'ഏത് ജൈവ സ്പ്രേയാണ് ഏറ്റവും നല്ലത്?',
      ];
    case 'mr':
      return [
        'पानाचे चांगले छायाचित्र कसे घ्यावे?',
        'पानांवरील तांबेरा का येतो?',
        'बुरशीजन्य कुज कशी रोखावी?',
        'कोणती जैविक फवारणी सर्वात चांगली आहे?',
      ];
    case 'gu':
      return [
        'પાંદડાનો સારો ફોટો કેવી રીતે લેવો?',
        'પાંદડાનો ગેરુ રોગ કેમ થાય છે?',
        'ફૂગના સડાને કેવી રીતે રોકવો?',
        'કયો જૈવિક સ્પ્રે શ્રેષ્ઠ છે?',
      ];
    case 'bn':
      return [
        'ভালো পাতার ছবি কিভাবে তুলবেন?',
        'পাতার মরিচা রোগ কেন হয়?',
        'ছত্রাকজনিত পচন কীভাবে রোধ করবেন?',
        'কোন জৈব স্প্রে সবচেয়ে ভালো কাজ করে?',
      ];
    case 'pa':
      return [
        'ਚੰਗੀ ਪੱਤੇ ਦੀ ਫੋਟੋ ਕਿਵੇਂ ਖਿੱਚੀਏ?',
        'ਪੱਤਿਆਂ ਦੀ ਕੁੰਗੀ ਕਿਉਂ ਲੱਗਦੀ ਹੈ?',
        'ਉੱਲੀ ਦੇ ਗਲਣ ਨੂੰ ਕਿਵੇਂ ਰੋਕੀਏ?',
        'ਕਿਹੜਾ ਜੈਵਿਕ ਸਪਰੇਅ ਸਭ ਤੋਂ ਵਧੀਆ ਹੈ?',
      ];
    case 'or':
      return [
        'ଭଲ ପତ୍ରର ଫଟୋ କିପରି ଉଠାଇବେ?',
        'ପତ୍ର କଳଙ୍କି ରୋଗ କାହିଁକି ହୁଏ?',
        'କବକ ଜନିତ ପଚନକୁ କିପରି ରୋକିବେ?',
        'କେଉଁ ଜୈବିକ ସ୍ପ୍ରେ ସବୁଠାରୁ ଭଲ?',
      ];
    case 'as':
      return [
        'ভাল পাতৰ ফটো কেনেকৈ তুলিব?',
        'পাতৰ মামৰে ধৰা ৰোগ কিয় হয়?',
        'ভেঁকুৰজনিত পচন কেনেকৈ ৰোধ কৰিব?',
        'কোনটো জৈৱিক স্প্ৰে আটাইতকৈ ভাল?',
      ];
    case 'ur':
      return [
        'اچھی پتی کی تصویر کیسے لیں؟',
        'پتے کا زنگ کیوں لگتا ہے؟',
        'پھپھوندی کی سڑن کو کیسے روکیں؟',
        'کون سا نامیاتی اسپرے بہترین ہے؟',
      ];
    case 'pt':
      return [
        'Como tirar uma boa foto da folha?',
        'O que causa a ferrugem foliar?',
        'Como prevenir a podridão fúngica?',
        'Qual pulverização biológica funciona melhor?',
      ];
    case 'es':
      return [
        '¿Cómo tomar una buena foto de la hoja?',
        '¿Qué causa la roya foliar?',
        '¿Cómo prevenir la pudrición fúngica?',
        '¿Qué pulverización orgánica funciona mejor?',
      ];
    case 'fr':
      return [
        'Comment prendre une bonne photo de feuille ?',
        'Quelle est la cause de la rouille foliaire ?',
        'Comment prévenir la pourriture fongique ?',
        'Quel traitement biologique fonctionne le mieux ?',
      ];
    case 'ar':
      return [
        'كيف ألتقط صورة واضحة للورقة؟',
        'ما الذي يسبب صدأ الأوراق؟',
        'كيف أمنع تعفن الفطريات؟',
        'ما هو أفضل رش عضوي فعال؟',
      ];
    case 'ru':
      return [
        'Как сделать качественное фото листа?',
        'Что вызывает ржавчину листьев?',
        'Как предотвратить грибковую гниль?',
        'Какой биопрепарат наиболее эффективен?',
      ];
    case 'zh':
      return [
        '如何拍摄清晰的叶片照片？',
        '是什么引起叶锈病？',
        '如何预防真菌性腐烂？',
        '哪种生物喷剂效果最好？',
      ];
    default:
      return [
        'How to take a good leaf photo?',
        'What causes leaf rust?',
        'How to prevent fungal rot?',
        'Which biological spray works best?',
      ];
  }
}

export function getCropDoctorReportQuickQuestions(lang: Language): string[] {
  const norm = normalizeLang(lang);

  switch (norm) {
    case 'te':
      return [
        'ఇది ఎందుకు జరిగింది?',
        'నేను ఇప్పుడు ఏమి చేయాలి?',
        'ఇది ఇతర మొక్కలకు వ్యాపిస్తుందా?',
        'భవిష్యత్తులో దీన్ని ఎలా నివారించాలి?',
      ];
    case 'hi':
      return [
        'यह रोग क्यों हुआ?',
        'मुझे अभी क्या करना चाहिए?',
        'क्या यह दूसरी फसलों में फैल सकता है?',
        'इसे भविष्य में कैसे रोकें?',
      ];
    case 'ta':
      return [
        'இது ஏன் ஏற்பட்டது?',
        'நான் இப்போது என்ன செய்ய வேண்டும்?',
        'இது மற்ற பயிர்களுக்கு பரவுமா?',
        'எதிர்காலத்தில் இதை எவ்வாறு தடுப்பது?',
      ];
    case 'kn':
      return [
        'ಇದು ಏಕೆ ಸಂಭವಿಸಿತು?',
        'ನಾನು ಈಗ ಏನು ಮಾಡಬೇಕು?',
        'ಇದು ಇತರ ಬೆಳೆಗಳಿಗೆ ಹರಡಬಹುದೇ?',
        'ಇದನ್ನು ತಡೆಯುವುದು ಹೇಗೆ?',
      ];
    case 'ml':
      return [
        'ഇത് എന്തുകൊണ്ട് സംഭവിച്ചു?',
        'ഞാൻ ഇപ്പോൾ എന്താണ് ചെയ്യേണ്ടത്?',
        'ഇത് മറ്റ് ചെടികളിലേക്ക് പടരുമോ?',
        'ഇത് എങ്ങനെ തടയാം?',
      ];
    case 'mr':
      return [
        'हे का घडले?',
        'मी आता काय करावे?',
        'हे इतर पिकांवर पसरू शकते का?',
        'याचा प्रतिबंध कसा करावा?',
      ];
    case 'gu':
      return [
        'આ શા માટે થયું?',
        'મારે હવે શું કરવું જોઈએ?',
        'શું આ અન્ય છોડમાં ફેલાઈ શકે છે?',
        'આને કેવી રીતે અટકાવવું?',
      ];
    case 'bn':
      return [
        'এটি কেন হয়েছে?',
        'আমার এখন কি করা উচিত?',
        'এটি কি অন্য গাছে ছড়াতে পারে?',
        'ভবিষ্যতে এটি কীভাবে প্রতিরোধ করবেন?',
      ];
    case 'pa':
      return [
        'ਇਹ ਕਿਉਂ ਹੋਇਆ?',
        'ਮੈਨੂੰ ਹੁਣ ਕੀ ਕਰਨਾ ਚਾਹੀਦਾ ਹੈ?',
        'ਕੀ ਇਹ ਹੋਰ ਬੂਟਿਆਂ ਵਿੱਚ ਫੈਲ ਸਕਦਾ ਹੈ?',
        'ਇਸ ਨੂੰ ਕਿਵੇਂ ਰੋਕਿਆ ਜਾਵੇ?',
      ];
    case 'or':
      return [
        'ଏହା କାହିଁକି ହେଲା?',
        'ମୁଁ ଏବେ କ’ଣ କରିବା ଉଚିତ୍?',
        'ଏହା ଅନ୍ୟ ଗଛକୁ ବ୍ୟାପିପାରେ କି?',
        'ଭବିଷ୍ୟତରେ ଏହାକୁ କିପରି ରୋକିବେ?',
      ];
    case 'as':
      return [
        'এইটো কিয় হ’ল?',
        'মই এতিয়া কি কৰা উচিত?',
        'এইটো আন গছলৈ বিয়পিব পাৰে নেকি?',
        'ভৱিষ্যতে ইয়াক কেনেকৈ ৰোধ কৰিব?',
      ];
    case 'ur':
      return [
        'یہ کیوں ہوا؟',
        'مجھے اب کیا کرنا چاہیے؟',
        'کیا یہ دوسرے پودوں میں پھیل سکتا ہے؟',
        'اسے کیسے روکا جائے؟',
      ];
    case 'pt':
      return [
        'Por que isso aconteceu?',
        'O que devo fazer agora?',
        'Pode se espalhar para outras plantas?',
        'Como prevenir no futuro?',
      ];
    case 'es':
      return [
        '¿Por qué sucedió esto?',
        '¿Qué debo hacer ahora?',
        '¿Puede propagarse a otras plantas?',
        '¿Cómo prevenirlo en el futuro?',
      ];
    case 'fr':
      return [
        'Pourquoi cela est-il arrivé ?',
        'Que dois-je faire maintenant ?',
        'Est-ce que cela peut se propager ?',
        'Comment prévenir à l\'avenir ?',
      ];
    case 'ar':
      return [
        'لماذا حدث هذا؟',
        'ماذا يجب أن أفعل الآن؟',
        'هل يمكن أن ينتقل للآخرين؟',
        'كيف أمنعه في المستقبل؟',
      ];
    case 'ru':
      return [
        'Почему это произошло?',
        'Что мне делать сейчас?',
        'Может ли это распространиться?',
        'Как это предотвратить в будущем?',
      ];
    case 'zh':
      return [
        '为什么会发生这种情况？',
        '我现在应该怎么做？',
        '它会传染给其他植株吗？',
        '以后如何预防？',
      ];
    default:
      return [
        'Why did this happen?',
        'What should I do now?',
        'Can it spread?',
        'How can I prevent it?',
      ];
  }
}

export function getCropDoctorDynamicFollowupQuestions(askedQuery: string, lang: Language): string[] {
  const norm = normalizeLang(lang);
  const q = askedQuery.toLowerCase();

  // If query asks why / causes
  if (q.includes('why') || q.includes('cause') || q.includes('ఎందుకు') || q.includes('क्यों') || q.includes('ஏன்') || q.includes('ಏಕೆ') || q.includes('का')) {
    switch (norm) {
      case 'te':
        return ['నేను ఇప్పుడు ఏమి చేయాలి?', 'ఇది ఇతర మొక్కలకు వ్యాపిస్తుందా?', 'నేను ఏమి పర్యవేక్షించాలి?', 'ఇది మరేదైనా కారణం కావచ్చా?'];
      case 'hi':
        return ['मुझे अभी क्या करना चाहिए?', 'क्या यह फैल सकता है?', 'मुझे क्या निगरानी रखनी चाहिए?', 'क्या यह कुछ और हो सकता है?'];
      case 'ta':
        return ['நான் இப்போது என்ன செய்ய வேண்டும்?', 'இது பரவுமா?', 'எதை கண்காணிக்க வேண்டும்?', 'இது வேறொன்றாக இருக்க முடியுமா?'];
      case 'kn':
        return ['ನಾನು ಈಗ ಏನು ಮಾಡಬೇಕು?', 'ಇದು ಹರಡಬಹುದೇ?', 'ನಾನು ಏನನ್ನು ಗಮನಿಸಬೇಕು?', 'ಇದು ಬೇರೇನಾದರೂ ಇರಬಹುದೇ?'];
      case 'mr':
        return ['मी आता काय करावे?', 'हे पसरू शकते का?', 'मी कशावर लक्ष ठेवावे?', 'हे इतर काही असू शकते का?'];
      default:
        return ['What should I do now?', 'Can it spread?', 'What should I monitor?', 'Could this be something else?'];
    }
  }

  // If query asks what should I do now
  if (q.includes('what should') || q.includes('do now') || q.includes('action') || q.includes('ఏమి చేయాలి') || q.includes('क्या करना')) {
    switch (norm) {
      case 'te':
        return ['ఇది ఇతర మొక్కలకు వ్యాపిస్తుందా?', 'వచ్చే సీజన్‌లో ఎలా నివారించాలి?', 'మీ నిర్ధారణ ఎంతవరకు ఖచ్చితమైనది?', 'ఏ సేంద్రియ పిచికారీ వాడాలి?'];
      case 'hi':
        return ['क्या यह दूसरी फसलों में फैल सकता है?', 'अगले सीजन में कैसे रोकें?', 'यह कितना सटीक है?', 'कौन सा जैविक स्प्रे इस्तेमाल करें?'];
      case 'ta':
        return ['மற்ற செடிகளுக்கு பரவுமா?', 'அடுத்த பருவத்தில் எப்படி தடுப்பது?', 'இது எவ்வளவு துல்லியமானது?', 'என்ன இயற்கை தெளிப்பான் பயன்படுத்தலாம்?'];
      case 'kn':
        return ['ಇದು ಇತರ ಗಿಡಗಳಿಗೆ ಹರಡಬಹುದೇ?', 'ಮುಂದಿನ ಋತುವಿನಲ್ಲಿ ಹೇಗೆ ತಡೆಯುವುದು?', 'ಇದು ಎಷ್ಟು ನಿಖರವಾಗಿದೆ?', 'ಯಾವ ಜೈವಿಕ ಸಿಂಪಡಣೆ ಬಳಸಬೇಕು?'];
      default:
        return ['Can it spread to other plants?', 'How can I prevent it next season?', 'Why are you confident?', 'What biological spray can I use?'];
    }
  }

  // If query asks about spread
  if (q.includes('spread') || q.includes('వ్యాపిస్తుందా') || q.includes('फैल')) {
    switch (norm) {
      case 'te':
        return ['నేను ఇప్పుడు ఏమి చేయాలి?', 'బీజాంశాలు ఎంత దూరం వ్యాపిస్తాయి?', 'భవిష్యత్తులో దీన్ని ఎలా నివారించాలి?', 'ఏ ఫోటోలో ఈ లక్షణం కనిపించింది?'];
      case 'hi':
        return ['मुझे अभी क्या करना चाहिए?', 'रोग के बीजाणु कितनी दूर फैलते हैं?', 'इसे कैसे रोकें?', 'किस फोटो में यह दिखा?'];
      default:
        return ['What should I do now?', 'How far can spores travel?', 'How can I prevent it?', 'Which image showed this?'];
    }
  }

  return getCropDoctorReportQuickQuestions(lang);
}

export function getCropDoctorFrameworkCards(lang: Language): CropDoctorFrameworkCard[] {
  const norm = normalizeLang(lang);

  switch (norm) {
    case 'te':
      return [
        {
          id: 'card-1',
          stepNumber: '1',
          title: '1. బహుళ-కోణాల నమూనా సేకరణ',
          description: 'ఆకు పైభాగం, కింద భాగం, తెగులు మచ్చలు మరియు కాండం కణుపులతో సహా గరిష్టంగా 5 స్పష్టమైన ఫోటోలను తీయండి లేదా అప్‌లోడ్ చేయండి.',
        },
        {
          id: 'card-2',
          stepNumber: '2',
          title: '2. 6-అంశాల వృక్షశాస్త్ర ధృవీకరణ',
          description: 'తప్పుడు నిర్ధారణలను నివారించడానికి ICAR మరియు FAO మొక్కల రక్షణ ప్రమాణాలతో ఆకు లక్షణాలను Gemini Vision విశ్లేషిస్తుంది.',
        },
        {
          id: 'card-3',
          stepNumber: '3',
          title: '3. ఆచరణాత్మక సమగ్ర సస్యరక్షణ & నేల నిర్వహణ',
          description: 'తక్షణ క్షేత్ర నివారణ చర్యలతో పాటు దీర్ఘకాలిక సేంద్రియ నివారణ మరియు నేల ఆరోగ్య పరిరక్షణ సూచనలను పొందండి.',
        },
      ];
    case 'hi':
      return [
        {
          id: 'card-1',
          stepNumber: '1',
          title: '1. बहु-कोणीय नमूना संग्रह',
          description: 'पत्ती के ऊपरी भाग, निचली सतह, घाव/धब्बों और तने सहित अधिकतम 5 स्पष्ट तस्वीरें लें या अपलोड करें।',
        },
        {
          id: 'card-2',
          stepNumber: '2',
          title: '2. 6-चरणीय वानस्पतिक सत्यापन',
          description: 'गलत पहचान से बचने के लिए Gemini Vision आईसीएआर (ICAR) और एफएओ (FAO) पौध संरक्षण मानकों के अनुसार लक्षणों का विश्लेषण करता है।',
        },
        {
          id: 'card-3',
          stepNumber: '3',
          title: '3. व्यावहारिक आईपीएम (IPM) व मृदा प्रबंधन',
          description: 'तत्काल खेत में की जाने वाली कार्रवाई के साथ-साथ दीर्घकालिक जैविक रोकथाम और मिट्टी के स्वास्थ्य के उपाय प्राप्त करें।',
        },
      ];
    case 'ta':
      return [
        {
          id: 'card-1',
          stepNumber: '1',
          title: '1. பல கோண மாதிரி பதிவு',
          description: 'இலையின் மேற்பகுதி, கீழ்ப்பகுதி, புண்கள் மற்றும் தண்டுப் பகுதிகள் உட்பட 5 தெளிவான புகைப்படங்களை எடுக்கவும் அல்லது பதிவேற்றவும்.',
        },
        {
          id: 'card-2',
          stepNumber: '2',
          title: '2. 6-புள்ளி தாவரவியல் சரிபார்ப்பு',
          description: 'தவறான முடிவுகளைத் தவிர்க்க ICAR மற்றும் FAO தாவரப் பாதுகாப்பு வழிகாட்டுதல்களின்படி Gemini Vision இலை அறிகுறிகளை பகுப்பாய்வு செய்கிறது.',
        },
        {
          id: 'card-3',
          stepNumber: '3',
          title: '3. ஒருங்கிணைந்த பூச்சி மேலாண்மை & மண் நெறிமுறை',
          description: 'உடனடி கள மேலாண்மை நடவடிக்கைகளுடன் நீண்ட கால இயற்கை தடுப்பு மற்றும் மண் ஆரோக்கிய வழிகாட்டுதல்களைப் பெறுங்கள்.',
        },
      ];
    case 'kn':
      return [
        {
          id: 'card-1',
          stepNumber: '1',
          title: '1. ಬಹು-ಕೋನ ಮಾದರಿ ಸಂಗ್ರಹ',
          description: 'ಎಲೆಯ ಮೇಲ್ಭಾಗ, ಕೆಳಭಾಗ, ಮಚ್ಚೆಗಳು ಮತ್ತು ಕಾಂಡ ಸೇರಿದಂತೆ ಗರಿಷ್ಠ 5 ಸ್ಪಷ್ಟ ಫೋಟೋಗಳನ್ನು ತೆಗೆಯಿರಿ ಅಥವಾ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ.',
        },
        {
          id: 'card-2',
          stepNumber: '2',
          title: '2. 6-ಹಂತದ ಸಸ್ಯಶಾಸ್ತ್ರೀಯ ಪರಿಶೀಲನೆ',
          description: 'ತಪ್ಪು ರೋಗನಿರ್ಣಯವನ್ನು ತಪ್ಪಿಸಲು ICAR ಮತ್ತು FAO ಸಸ್ಯ ಸಂರಕ್ಷಣಾ ಮಾನದಂಡಗಳೊಂದಿಗೆ Gemini Vision ಎಲೆಯ ಲಕ್ಷಣಗಳನ್ನು ವಿಶ್ಲೇಷಿಸುತ್ತದೆ.',
        },
        {
          id: 'card-3',
          stepNumber: '3',
          title: '3. ಸಮಗ್ರ ಕೀಟ ನಿರ್ವಹಣೆ (IPM) ಮತ್ತು ಮಣ್ಣಿನ ಆರೈಕೆ',
          description: 'ತಕ್ಷಣದ ಹೊಲದ ನಿರ್ವಹಣಾ ಕ್ರಮಗಳೊಂದಿಗೆ ದೀರ್ಘಕಾಲೀನ ಜೈವಿಕ ನಿಯಂತ್ರಣ ಮತ್ತು ಮಣ್ಣಿನ ಆರೋಗ್ಯದ ಮಾರ್ಗದರ್ಶನ ಪಡೆಯಿರಿ.',
        },
      ];
    case 'ml':
      return [
        {
          id: 'card-1',
          stepNumber: '1',
          title: '1. വിവിധ കോണുകളിൽ നിന്നുള്ള സാമ്പിൾ',
          description: 'ഇലയുടെ മുകൾഭാഗം, അടിഭാഗം, പാടുകൾ, തണ്ട് എന്നിവ ഉൾപ്പെടെ പരമാവധി 5 വ്യക്തമായ ഫോട്ടോകൾ എടുക്കുകയോ അപ്‌ലോഡ് ചെയ്യുകയോ ചെയ്യുക.',
        },
        {
          id: 'card-2',
          stepNumber: '2',
          title: '2. 6-ഘട്ട ബൊട്ടാണിക്കൽ സ്ഥിരീകരണം',
          description: 'തെറ്റായ രോഗനിർണയം ഒഴിവാക്കാൻ ICAR, FAO സസ്യസംരക്ഷണ മാനദണ്ഡങ്ങൾക്കനുസൃതമായി Gemini Vision രോഗലക്ഷണങ്ങൾ വിശകലനം ചെയ്യുന്നു.',
        },
        {
          id: 'card-3',
          stepNumber: '3',
          title: '3. സമഗ്ര കീടനിയന്ത്രണവും (IPM) മണ്ണുസംരക്ഷണവും',
          description: 'ഉടനടിയുള്ള കൃഷിയിട പരിഹാര മാർഗ്ഗങ്ങൾക്കൊപ്പം ദീർഘകാല ജൈവ പ്രതിരോധവും മണ്ണുസംരക്ഷണ നിർദ്ദേശങ്ങളും നേടുക.',
        },
      ];
    case 'mr':
      return [
        {
          id: 'card-1',
          stepNumber: '1',
          title: '1. बहु-कोनीय नमुना संकलन',
          description: 'पानाचा वरचा भाग, खालची बाजू, डाग आणि खोड यासह जास्तीत जास्त 5 स्पष्ट फोटो घ्या किंवा अपलोड करा.',
        },
        {
          id: 'card-2',
          stepNumber: '2',
          title: '2. 6-मुद्द्यांचे वनस्पतीशास्त्रीय प्रमाणीकरण',
          description: 'चुकीचे निदान टाळण्यासाठी Gemini Vision ICAR आणि FAO पीक संरक्षण मार्गदर्शक तत्त्वांनुसार लक्षणांचे विश्लेषण करते.',
        },
        {
          id: 'card-3',
          stepNumber: '3',
          title: '3. एकात्मिक कीड व्यवस्थापन (IPM) आणि माती प्रोटोकॉल',
          description: 'तातडीच्या क्षेत्रीय व्यवस्थापन उपायांसह दीर्घकालीन जैविक प्रतिबंध आणि माती आरोग्य मार्गदर्शक तत्त्वे मिळवा.',
        },
      ];
    case 'gu':
      return [
        {
          id: 'card-1',
          stepNumber: '1',
          title: '1. બહુ-કોણીય નમૂના સંગ્રહ',
          description: 'પાંદડાની ઉપરની સપાટી, નીચેની સપાટી, ડાઘ અને થડ સહિત વધુમાં વધુ 5 સ્પષ્ટ ફોટા લો અથવા અપલોડ કરો.',
        },
        {
          id: 'card-2',
          stepNumber: '2',
          title: '2. 6-મુદ્દાની વનસ્પતિશાસ્ત્રીય ચકાસણી',
          description: 'ખોટા નિદાનને ટાળવા માટે Gemini Vision ICAR અને FAO પાક સંરક્ષણ માપદંડો મુજબ લક્ષણોનું વિશ્લેષણ કરે છે.',
        },
        {
          id: 'card-3',
          stepNumber: '3',
          title: '3. સંકલિત જીવાત નિયંત્રણ (IPM) અને જમીન વ્યવસ્થાપન',
          description: 'તાત્કાલિક ક્ષેત્ર વ્યવસ્થાપન પગલાં સાથે લાંબા ગાળાના જૈવિક નિવારણ અને જમીન આરોગ્ય માર્ગદર્શન મેળવો.',
        },
      ];
    case 'bn':
      return [
        {
          id: 'card-1',
          stepNumber: '1',
          title: '1. বহু-কোণী নমুনা গ্রহণ',
          description: 'পাতার ওপরের পিঠ, নিচের পিঠ, দাগ এবং কান্ড সহ সর্বোচ্চ ৫টি স্পষ্ট ছবি তুলুন বা আপলোড করুন।',
        },
        {
          id: 'card-2',
          stepNumber: '2',
          title: '2. ৬-দফা উদ্ভিদতাত্ত্বিক যাচাইকরণ',
          description: 'ভুল নির্ণয় রোধ করতে Gemini Vision ICAR এবং FAO উদ্ভিদ সুরক্ষা নির্দেশিকা অনুসারে লক্ষণগুলি বিশ্লেষণ করে।',
        },
        {
          id: 'card-3',
          stepNumber: '3',
          title: '3. সমন্বিত বালাই দমন (IPM) ও মাটির পরিচর্যা',
          description: 'তাৎক্ষণিক মাঠ পর্যায়ের প্রতিকারমূলক ব্যবস্থার সাথে দীর্ঘমেয়াদী জৈব প্রতিরোধ এবং মাটির স্বাস্থ্যের দিকনির্দেশনা পান।',
        },
      ];
    case 'pa':
      return [
        {
          id: 'card-1',
          stepNumber: '1',
          title: '1. ਬਹੁ-ਕੋਣੀ ਨਮੂਨਾ ਇਕੱਠਾ ਕਰਨਾ',
          description: 'ਪੱਤੇ ਦੇ ਉੱਪਰਲੇ ਹਿੱਸੇ, ਹੇਠਲੀ ਸਤ੍ਹਾ, ਧੱਬਿਆਂ ਅਤੇ ਤਣੇ ਸਮੇਤ ਵੱਧ ਤੋਂ ਵੱਧ 5 ਸਪਸ਼ਟ ਫੋਟੋਆਂ ਖਿੱਚੋ ਜਾਂ ਅਪਲੋਡ ਕਰੋ।',
        },
        {
          id: 'card-2',
          stepNumber: '2',
          title: '2. 6-ਨੁਕਾਤੀ ਬਨਸਪਤੀ ਪੁਸ਼ਟੀਕਰਨ',
          description: 'ਗਲਤ ਨਿਦਾਨ ਤੋਂ ਬਚਣ ਲਈ Gemini Vision ICAR ਅਤੇ FAO ਪੌਦਾ ਸੁਰੱਖਿਆ ਮਿਆਰਾਂ ਅਨੁਸਾਰ ਲੱਛਣਾਂ ਦਾ ਵਿਸ਼ਲੇਸ਼ਣ ਕਰਦਾ ਹੈ।',
        },
        {
          id: 'card-3',
          stepNumber: '3',
          title: '3. ਏਕੀਕ੍ਰਿਤ ਕੀਟ ਪ੍ਰਬੰਧਨ (IPM) ਅਤੇ ਮਿੱਟੀ ਦੀ ਸਾਂਭ-ਸੰਭਾਲ',
          description: 'ਤੁਰੰਤ ਖੇਤੀ ਰੋਕਥਾਮ ਕਦਮਾਂ ਦੇ ਨਾਲ ਲੰਬੇ ਸਮੇਂ ਦੇ ਜੈਵਿਕ ਬਚਾਅ ਅਤੇ ਮਿੱਟੀ ਦੀ ਸਿਹਤ ਦੇ ਸੁਝਾਅ ਪ੍ਰਾਪਤ ਕਰੋ।',
        },
      ];
    case 'or':
      return [
        {
          id: 'card-1',
          stepNumber: '1',
          title: '1. ବହୁ-କୋଣୀୟ ନମୁନା ସଂଗ୍ରହ',
          description: 'ପତ୍ରର ଉପର ପାର୍ଶ୍ୱ, ତଳ ପାର୍ଶ୍ୱ, ଦାଗ ଏବଂ କାଣ୍ଡ ସହିତ ସର୍ବାଧିକ 5ଟି ସ୍ପଷ୍ଟ ଫଟୋ ଉଠାନ୍ତୁ କିମ୍ବା ଅପଲୋଡ୍ କରନ୍ତୁ।',
        },
        {
          id: 'card-2',
          stepNumber: '2',
          title: '2. 6-ବିନ୍ଦୁ ଉଦ୍ଭିଦତାତ୍ତ୍ୱିକ ଯାଞ୍ଚ',
          description: 'ଭୁଲ ଚିହ୍ନଟକୁ ଏଡ଼ାଇବା ପାଇଁ Gemini Vision ICAR ଏବଂ FAO ଉଦ୍ଭିଦ ସୁରକ୍ଷା ମାନଦଣ୍ଡ ଅନୁଯାୟୀ ଲକ୍ଷଣଗୁଡ଼ିକୁ ବିଶ୍ଳେଷଣ କରେ।',
        },
        {
          id: 'card-3',
          stepNumber: '3',
          title: '3. ସମନ୍ୱିତ କୀଟ ପରିଚାଳନା (IPM) ଏବଂ ମୃତ୍ତିକା ଯତ୍ନ',
          description: 'ତୁରନ୍ତ କ୍ଷେତ୍ର ପ୍ରତିକାର ପଦକ୍ଷେପ ସହିତ ଦୀର୍ଘକାଳୀନ ଜୈବିକ ପ୍ରତିରୋଧ ଏବଂ ମୃତ୍ତିକା ସ୍ୱାସ୍ଥ୍ୟ ପରାମର୍ଶ ପାଆନ୍ତୁ।',
        },
      ];
    case 'as':
      return [
        {
          id: 'card-1',
          stepNumber: '1',
          title: '1. বহু-কোণী নমুনা সংগ্ৰহ',
          description: 'পাতৰ ওপৰৰ পিঠি, তলৰ পিঠি, দাগ আৰু কাণ্ডকে ধৰি সৰ্বাধিক ৫ খন স্পষ্ট ফটো তোলক বা আপলোড কৰক।',
        },
        {
          id: 'card-2',
          stepNumber: '2',
          title: '2. ৬-দফা উদ্ভিদবৈজ্ঞানিক সত্যাপন',
          description: 'ভুল নিদান প্ৰতিৰোধ কৰিবলৈ Gemini Vision এ ICAR আৰু FAO উদ্ভিদ সুৰক্ষা নিৰ্দেশনাৱলী অনুসৰি লক্ষণসমূহ বিশ্লেষণ কৰে।',
        },
        {
          id: 'card-3',
          stepNumber: '3',
          title: '3. সমন্বিত কীট ব্যৱস্থাপনা (IPM) আৰু মাটিৰ যত্ন',
          description: 'তাৎক্ষণিক পথাৰ ব্যৱস্থাপনা পদক্ষেপৰ সৈতে দীৰ্ঘম্যাদী জৈৱিক প্ৰতিৰোধ আৰু মাটিৰ স্বাস্থ্যৰ পৰামৰ্শ লাভ কৰক।',
        },
      ];
    case 'ur':
      return [
        {
          id: 'card-1',
          stepNumber: '1',
          title: '1. کثیر زاویہ نمونہ وصولی',
          description: 'پتے کے اوپری اور نچلے حصے، داغ دھبوں اور تنے سمیت زیادہ سے زیادہ 5 واضح تصاویر لیں یا اپ لوڈ کریں۔',
        },
        {
          id: 'card-2',
          stepNumber: '2',
          title: '2. 6-نکاتی نباتاتی تصدیق',
          description: 'غلط تشخیص سے بچنے کے لیے Gemini Vision آئی سی اے آر (ICAR) اور ایف اے او (FAO) پودوں کے تحفظ کے اصولوں کے مطابق علامات کا تجزیہ کرتا ہے۔',
        },
        {
          id: 'card-3',
          stepNumber: '3',
          title: '3. جامع کیڑوں کا انتظام (IPM) اور مٹی کا تحفظ',
          description: 'فوری فیلڈ اقدامات کے ساتھ ساتھ طویل مدتی حیاتیاتی روک تھام اور مٹی کی صحت سے متعلق رہنمائی حاصل کریں۔',
        },
      ];
    case 'pt':
      return [
        {
          id: 'card-1',
          stepNumber: '1',
          title: '1. Coleta de Espécimes Multiângulos',
          description: 'Capture ou envie até 5 fotos nítidas, incluindo a parte superior e inferior das folhas, lesões e nós do caule.',
        },
        {
          id: 'card-2',
          stepNumber: '2',
          title: '2. Verificação Botânica em 6 Pontos',
          description: 'O Gemini Vision analisa assinaturas morfológicas contra compêndios de fitossanidade da FAO/ICAR para eliminar falsos positivos.',
        },
        {
          id: 'card-3',
          stepNumber: '3',
          title: '3. Protocolo Prático de MIP e Solo',
          description: 'Receba etapas imediatas de intervenção no campo juntamente com prevenção biológica a longo prazo e manejo da saúde do solo.',
        },
      ];
    case 'es':
      return [
        {
          id: 'card-1',
          stepNumber: '1',
          title: '1. Muestreo Multiángulo de la Planta',
          description: 'Capture o cargue hasta 5 fotos nítidas incluyendo el haz, envés de hojas, lesiones y nudos del tallo.',
        },
        {
          id: 'card-2',
          stepNumber: '2',
          title: '2. Verificación Botánica en 6 Puntos',
          description: 'Gemini Vision analiza patrones morfológicos contra guías de protección vegetal FAO/ICAR para evitar diagnósticos erróneos.',
        },
        {
          id: 'card-3',
          stepNumber: '3',
          title: '3. Protocolo Práctico de MIP y Suelo',
          description: 'Reciba medidas inmediatas en campo junto con prevención biológica y manejo del suelo a largo plazo.',
        },
      ];
    case 'fr':
      return [
        {
          id: 'card-1',
          stepNumber: '1',
          title: '1. Échantillonnage Multi-Angle',
          description: 'Prenez ou téléversez jusqu\'à 5 photos nettes incluant le dessus, le dessous des feuilles, les lésions et les tiges.',
        },
        {
          id: 'card-2',
          stepNumber: '2',
          title: '2. Vérification Botanique en 6 Points',
          description: 'Gemini Vision analyse les signes morphologiques selon les critères FAO/ICAR pour éliminer les faux diagnostics.',
        },
        {
          id: 'card-3',
          stepNumber: '3',
          title: '3. Protocole Pratique de Lutte Intégrée & Sol',
          description: 'Recevez des actions immédiates au champ avec des mesures préventives biologiques et de santé des sols.',
        },
      ];
    case 'ar':
      return [
        {
          id: 'card-1',
          stepNumber: '1',
          title: '1. أخذ عينات متعددة الزوايا',
          description: 'التقط أو حمّل ما يصل إلى 5 صور واضحة بما في ذلك أسطح الأوراق وأسفلها والبقع والعقد.',
        },
        {
          id: 'card-2',
          stepNumber: '2',
          title: '2. التحقق النباتي من 6 نقاط',
          description: 'يقوم Gemini Vision بتحليل العلامات النباتية وفقاً لمعايير ICAR و FAO لتجنب التشخيص الخاطئ.',
        },
        {
          id: 'card-3',
          stepNumber: '3',
          title: '3. بروتوكول المكافحة المتكاملة وتربة صحية',
          description: 'احصل على خطوات فورية للتدخل في الحقل مع حلول وقائية عضوية وصحة التربة طويلة الأجل.',
        },
      ];
    case 'ru':
      return [
        {
          id: 'card-1',
          stepNumber: '1',
          title: '1. Съемка образца с нескольких ракурсов',
          description: 'Сделайте или загрузите до 5 четких фотографий, включая верхнюю и нижнюю стороны листьев, очаги поражения и узлы стебля.',
        },
        {
          id: 'card-2',
          stepNumber: '2',
          title: '2. 6-точечная ботаническая верификация',
          description: 'Gemini Vision сопоставляет морфологические признаки с базами защиты растений ICAR и FAO для исключения ложноположительных диагнозов.',
        },
        {
          id: 'card-3',
          stepNumber: '3',
          title: '3. Практический протокол ИЗР и здоровья почвы',
          description: 'Получите четкие оперативные шаги полевого вмешательства наряду с долгосрочной биологической защитой и поддержанием микробиома.',
        },
      ];
    case 'zh':
      return [
        {
          id: 'card-1',
          stepNumber: '1',
          title: '1. 多角度样本采集',
          description: '拍摄或上传最多5张清晰照片，包括叶片正面、背面、病斑特写及茎节部位。',
        },
        {
          id: 'card-2',
          stepNumber: '2',
          title: '2. 6维植物病理双重核验',
          description: 'Gemini Vision 结合 ICAR 与 FAO 植保标准分析形态特征，杜绝误诊并消除假阳性。',
        },
        {
          id: 'card-3',
          stepNumber: '3',
          title: '3. 实用的综合病虫害管理与土壤方案',
          description: '获取即时田间干预指导，以及长期的生物防治与土壤健康培育方案。',
        },
      ];
    default:
      return [
        {
          id: 'card-1',
          stepNumber: '1',
          title: '1. Multi-Angle Specimen Intake',
          description: 'Capture or upload up to 5 clear photos including leaf tops, undersides, lesions, and stem nodes.',
        },
        {
          id: 'card-2',
          stepNumber: '2',
          title: '2. 6-Point Botanical Verification',
          description: 'Gemini Vision analyzes morphological signatures against ICAR & FAO plant protection compendia to eliminate false positives.',
        },
        {
          id: 'card-3',
          stepNumber: '3',
          title: '3. Actionable IPM & Soil Protocol',
          description: 'Receive immediate field intervention steps alongside long-term biological prevention and soil health stewardship.',
        },
      ];
  }
}

/**
 * Localizes crop disease, pest, nutrient deficiency, and physiological condition names
 * based on selected user language.
 */
export function localizeDiseaseName(condition: string, lang: Language): string {
  if (!condition) return condition;
  const norm = normalizeLang(lang);
  if (norm === 'en') return condition;

  const cond = condition.trim().toLowerCase();

  const translations: Record<string, Record<string, string>> = {
    'leaf rust': {
      te: 'ఆకు తుప్పు తెగులు (Leaf Rust)',
      hi: 'पत्ती का रतुआ रोग (Leaf Rust)',
      ta: 'இலை துரு நோய் (Leaf Rust)',
      kn: 'ಎಲೆ ತುಕ್ಕು ರೋಗ (Leaf Rust)',
      ml: 'ഇല തുരുമ്പ് രോഗം (Leaf Rust)',
      mr: 'पानावरील तांबेरा रोग (Leaf Rust)',
      gu: 'પાનનો ગેરુ રોગ (Leaf Rust)',
      bn: 'পাতার মরচে রোগ (Leaf Rust)',
      pa: 'ਪੱਤਿਆਂ ਦਾ ਕੁੰਗੀ ਰੋਗ (Leaf Rust)',
      or: 'ପତ୍ର କଳଙ୍କି ରୋଗ (Leaf Rust)',
      as: 'পাতৰ মামৰে ধৰা ৰোগ (Leaf Rust)',
      ur: 'پتوں کا زنگ کا مرض (Leaf Rust)',
      pt: 'Ferrugem Foliar (Leaf Rust)',
      es: 'Roya Foliar (Leaf Rust)',
      fr: 'Rouille Foliaire (Leaf Rust)',
      ar: 'صدأ الأوراق (Leaf Rust)',
      ru: 'Листовая ржавчина (Leaf Rust)',
      zh: '叶锈病 (Leaf Rust)',
    },
    'rust': {
      te: 'తుప్పు తెగులు (Rust)',
      hi: 'रतुआ रोग (Rust)',
      ta: 'துரு நோய் (Rust)',
      kn: 'ತುಕ್ಕು ರೋಗ (Rust)',
      ml: 'തുരുമ്പ് രോഗം (Rust)',
      mr: 'तांबेरा रोग (Rust)',
      gu: 'ગેરુ રોગ (Rust)',
      bn: 'মরচে রোগ (Rust)',
      pa: 'ਕੁੰਗੀ ਰੋਗ (Rust)',
      or: 'କଳଙ୍କି ରୋଗ (Rust)',
      as: 'মামৰে ধৰা ৰোগ (Rust)',
      ur: 'زنگ کا مرض (Rust)',
      pt: 'Ferrugem (Rust)',
      es: 'Roya (Rust)',
      fr: 'Rouille (Rust)',
      ar: 'الصدأ (Rust)',
      ru: 'Ржавчина (Rust)',
      zh: '锈病 (Rust)',
    },
    'rice blast': {
      te: 'వరి అగ్గితెగులు (Rice Blast)',
      hi: 'धान का झुलसा/ब्लास्ट रोग (Rice Blast)',
      ta: 'நெல் குலை நோய் (Rice Blast)',
      kn: 'ಬತ್ತದ ಬೆಂಕಿ ರೋಗ (Rice Blast)',
      ml: 'നെല്ലിലെ കുലവാട്ടം / ബ്ലാസ്റ്റ് (Rice Blast)',
      mr: 'भातावरील करपा / ब्लास्ट (Rice Blast)',
      gu: 'ડાંગરનો કરપો / બ્લાસ્ટ (Rice Blast)',
      bn: 'ধানের ব্লাস্ট রোগ (Rice Blast)',
      pa: 'ਝੋਨੇ ਦਾ ਬਲਾਸਟ ਰੋਗ (Rice Blast)',
      or: 'ଧାନ ବ୍ଲାଷ୍ଟ ରୋଗ (Rice Blast)',
      as: 'ধানৰ ব্লাষ্ট ৰোগ (Rice Blast)',
      ur: 'چاول کا بلاسٹ مرض (Rice Blast)',
      pt: 'Brusone do Arroz (Rice Blast)',
      es: 'Piricularia del Arroz (Rice Blast)',
      fr: 'Pyriculariose du Riz (Rice Blast)',
      ar: 'لفحة الأرز (Rice Blast)',
      ru: 'Пирикуляриоз риса (Rice Blast)',
      zh: '稻瘟病 (Rice Blast)',
    },
    'powdery mildew': {
      te: 'బూడిద తెగులు (Powdery Mildew)',
      hi: 'चूर्णिल आसिता / पाउडरी फफूंद (Powdery Mildew)',
      ta: 'சாம்பல் நோய் (Powdery Mildew)',
      kn: 'ಬೂದಿ ರೋಗ (Powdery Mildew)',
      ml: 'ചാരപ്പൂപ്പ് രോഗം (Powdery Mildew)',
      mr: 'भुरी रोग (Powdery Mildew)',
      gu: 'છારો રોગ (Powdery Mildew)',
      bn: 'পাউডারি মিলডিউ (Powdery Mildew)',
      pa: 'ਉੱਲੀ ਰੋਗ (Powdery Mildew)',
      or: 'ପାଉଡରୀ ମିଲଡିୟୁ (Powdery Mildew)',
      as: 'ভেঁকুৰজনিত বগা দাগ (Powdery Mildew)',
      ur: 'چورن پھپھوند (Powdery Mildew)',
      pt: 'Oídio (Powdery Mildew)',
      es: 'Oídio (Powdery Mildew)',
      fr: 'Oïdium (Powdery Mildew)',
      ar: 'البياض الدقيقي (Powdery Mildew)',
      ru: 'Мучнистая роса (Powdery Mildew)',
      zh: '白粉病 (Powdery Mildew)',
    },
    'downy mildew': {
      te: 'డౌనీ బూజు తెగులు (Downy Mildew)',
      hi: 'मृदुरोमिल आसिता (Downy Mildew)',
      ta: 'அடிச்சாம்பல் நோய் (Downy Mildew)',
      kn: 'ಡೌನಿ ಶಿಲೀಂಧ್ರ ರೋಗ (Downy Mildew)',
      ml: 'അടിപ്പൂപ്പ് രോഗം (Downy Mildew)',
      mr: 'केवडा / डाउनी मिल्ड्यू (Downy Mildew)',
      gu: 'તળછારો રોગ (Downy Mildew)',
      bn: 'ডাউনি মিলডিউ (Downy Mildew)',
      pa: 'ਡਾਊਨੀ ਉੱਲੀ ਰੋਗ (Downy Mildew)',
      or: 'ଡାଉନି ମିଲଡିୟୁ (Downy Mildew)',
      as: 'তলভেঁকুৰ ৰোগ (Downy Mildew)',
      ur: 'ڈاؤنی پھپھوند (Downy Mildew)',
      pt: 'Míldio (Downy Mildew)',
      es: 'Mildiú (Downy Mildew)',
      fr: 'Mildiou (Downy Mildew)',
      ar: 'البياض الزغبي (Downy Mildew)',
      ru: 'Ложная мучнистая роса (Downy Mildew)',
      zh: '霜霉病 (Downy Mildew)',
    },
    'early blight': {
      te: 'ముందస్తు ఆకు ఎండు తెగులు (Early Blight)',
      hi: 'अगेती झुलसा रोग (Early Blight)',
      ta: 'முன் பருவ கருகல் நோய் (Early Blight)',
      kn: 'ಮುಂಗಾರು ಎಲೆ ಅಂಗಮಾರಿ (Early Blight)',
      ml: 'നേരത്തെയുള്ള ഇലക്കരിച്ചിൽ (Early Blight)',
      mr: 'लवकर येणारा करपा (Early Blight)',
      gu: 'અગેતરો સુકારો (Early Blight)',
      bn: 'আাম পাতাপোড়া রোগ (Early Blight)',
      pa: 'ਅਗੇਤਾ ਝੁਲਸ ਰੋਗ (Early Blight)',
      or: 'ଆଗୁଆ ପତ୍ର ପୋଡ଼ା ରୋଗ (Early Blight)',
      as: 'আগতীয়া পাত পোৰা ৰোগ (Early Blight)',
      ur: 'ابتدائی جھلساؤ (Early Blight)',
      pt: 'Pinta Preta / Requeima Precoce (Early Blight)',
      es: 'Tizón Temprano (Early Blight)',
      fr: 'Alternariose (Early Blight)',
      ar: 'اللفحة المبكرة (Early Blight)',
      ru: 'Ранний сухой фитофтороз / Альтернариоз (Early Blight)',
      zh: '早疫病 (Early Blight)',
    },
    'late blight': {
      te: 'ఆలస్యపు ఆకు ఎండు తెగులు (Late Blight)',
      hi: 'पछेती झुलसा रोग (Late Blight)',
      ta: 'பின் பருவ கருகல் நோய் (Late Blight)',
      kn: 'ಹಿಂಗಾರು ಎಲೆ ಅಂಗಮಾರಿ (Late Blight)',
      ml: 'വൈകിയുള്ള ഇലക്കരിച്ചിൽ (Late Blight)',
      mr: 'उशिरा येणारा करपा (Late Blight)',
      gu: 'પછેતરો સુકારો (Late Blight)',
      bn: 'নাভি পাতাপোড়া রোগ (Late Blight)',
      pa: 'ਪਛੇਤਾ ਝੁਲਸ ਰੋਗ (Late Blight)',
      or: 'ପଛୁଆ ପତ୍ର ପୋଡ଼ା ରୋଗ (Late Blight)',
      as: 'পলমীয়া পাত পোৰা ৰোগ (Late Blight)',
      ur: 'پچھتی جھلساؤ (Late Blight)',
      pt: 'Requeima Tardia (Late Blight)',
      es: 'Tizón Tardío (Late Blight)',
      fr: 'Mildiou Tardif (Late Blight)',
      ar: 'اللفحة المتأخرة (Late Blight)',
      ru: 'Фитофтороз (Late Blight)',
      zh: '晚疫病 (Late Blight)',
    },
    'anthracnose': {
      te: 'ఆంత్రాక్నోస్ తెగులు (Anthracnose)',
      hi: 'एन्थ्रेक्नोज / श्याम वर्ण रोग (Anthracnose)',
      ta: 'ஆந்த்ராக்னோஸ் நோய் (Anthracnose)',
      kn: 'ಆಂಥ್ರಾಕ್ನೋಸ್ ರೋಗ (Anthracnose)',
      ml: 'ആന്ത്രാക്നോസ് കുമിൾരോഗം (Anthracnose)',
      mr: 'अँथ्रॅक्नोज / फळकुज (Anthracnose)',
      gu: 'કાળીયો રોગ (Anthracnose)',
      bn: 'অ্যানথ্রাকনোজ রোগ (Anthracnose)',
      pa: 'ਐਂਥ੍ਰੈਕਨੋਜ਼ ਰੋਗ (Anthracnose)',
      or: 'ଆନ୍ଥ୍ରାକନୋଜ ରୋଗ (Anthracnose)',
      as: 'এনথ্ৰাকনোজ ৰোগ (Anthracnose)',
      ur: 'اینتھراکنوز (Anthracnose)',
      pt: 'Antracnose (Anthracnose)',
      es: 'Antracnosis (Anthracnose)',
      fr: 'Anthracnose (Anthracnose)',
      ar: 'الأنثراكنوز (Anthracnose)',
      ru: 'Антракноз (Anthracnose)',
      zh: '炭疽病 (Anthracnose)',
    },
    'bacterial leaf blight': {
      te: 'బాక్టీరియల్ ఆకు ఎండు తెగులు (Bacterial Leaf Blight)',
      hi: 'जीवाणु पत्ती झुलसा (Bacterial Leaf Blight)',
      ta: 'பாக்டீரியல் இலை கருகல் (Bacterial Leaf Blight)',
      kn: 'ಬ್ಯಾಕ್ಟೀರಿಯಲ್ ಎಲೆ ಕರಕಲು (Bacterial Leaf Blight)',
      ml: 'ബാക്ടീരിയൽ ഇലക്കരിച്ചിൽ (Bacterial Leaf Blight)',
      mr: 'जिवाणूजन्य करपा (Bacterial Leaf Blight)',
      gu: 'જીવાણુજન્ય પાનનો સુકારો (Bacterial Leaf Blight)',
      bn: 'ব্যাকটেরিয়াল পাতার ব্লাইট (Bacterial Leaf Blight)',
      pa: 'ਜੀਵਾਣੂ ਝੁਲਸ ਰੋਗ (Bacterial Leaf Blight)',
      or: 'ଜୀବାଣୁଜନିତ ପତ୍ର ପୋଡ଼ା (Bacterial Leaf Blight)',
      as: 'বেক্টেৰিয়াজনিত পাত পোৰা (Bacterial Leaf Blight)',
      ur: 'بیکٹیریائی پتوں کا جھلساؤ (Bacterial Leaf Blight)',
      pt: 'Bacteriose Foliar (Bacterial Leaf Blight)',
      es: 'Tizón Bacteriano Foliar (Bacterial Leaf Blight)',
      fr: 'Flétrissement Bactérien (Bacterial Leaf Blight)',
      ar: 'اللفحة البكتيرية للأوراق (Bacterial Leaf Blight)',
      ru: 'Бактериальный ожог листьев (Bacterial Leaf Blight)',
      zh: '细菌性叶枯病 (Bacterial Leaf Blight)',
    },
    'nitrogen deficiency': {
      te: 'నత్రజని పోషక లోపం (Nitrogen Deficiency)',
      hi: 'नाइट्रोजन पोषक तत्व की कमी (Nitrogen Deficiency)',
      ta: 'தழைச்சத்து குறைபாடு (Nitrogen Deficiency)',
      kn: 'ಸಾರಜನಕ ಕೊರತೆ (Nitrogen Deficiency)',
      ml: 'നൈട്രജൻ അപര്യാപ്തത (Nitrogen Deficiency)',
      mr: 'नत्र कमतरता (Nitrogen Deficiency)',
      gu: 'નાઇટ્રોજનની ઉણપ (Nitrogen Deficiency)',
      bn: 'নাইট্রোজেনের ঘাটতি (Nitrogen Deficiency)',
      pa: 'ਨਾਈਟ੍ਰੋਜਨ ਦੀ ਘਾਟ (Nitrogen Deficiency)',
      or: 'ନାଇଟ୍ରୋଜେନ୍ ଅଭାବ (Nitrogen Deficiency)',
      as: 'নাইট্ৰ’জেনৰ অভাৱ (Nitrogen Deficiency)',
      ur: 'نائٹروجن کی کمی (Nitrogen Deficiency)',
      pt: 'Deficiência de Nitrogênio (Nitrogen Deficiency)',
      es: 'Deficiencia de Nitrógeno (Nitrogen Deficiency)',
      fr: 'Carence en Azote (Nitrogen Deficiency)',
      ar: 'نقص النيتروجين (Nitrogen Deficiency)',
      ru: 'Дефицит азота (Nitrogen Deficiency)',
      zh: '缺氮症 (Nitrogen Deficiency)',
    },
    'potassium deficiency': {
      te: 'పొటాషియం లోపం (Potassium Deficiency)',
      hi: 'पोटाश की कमी (Potassium Deficiency)',
      ta: 'சாம்பல் சத்து குறைபாடு (Potassium Deficiency)',
      kn: 'ಪೊಟ್ಯಾಶ್ ಕೊರತೆ (Potassium Deficiency)',
      ml: 'പൊട്ടാസ്യം കുറവ് (Potassium Deficiency)',
      mr: 'पोटॅश कमतरता (Potassium Deficiency)',
      gu: 'પોટાશની ઉણપ (Potassium Deficiency)',
      bn: 'পটাশিয়াম ঘাটতি (Potassium Deficiency)',
      pa: 'ਪੋਟਾਸ਼ੀਅਮ ਦੀ ਘਾਟ (Potassium Deficiency)',
      or: 'ପୋଟାସିୟମ୍ ଅଭାବ (Potassium Deficiency)',
      as: 'পটাছিয়ামৰ অভাৱ (Potassium Deficiency)',
      ur: 'پوٹاشیم کی کمی (Potassium Deficiency)',
      pt: 'Deficiência de Potássio (Potassium Deficiency)',
      es: 'Deficiencia de Potasio (Potassium Deficiency)',
      fr: 'Carence en Potassium (Potassium Deficiency)',
      ar: 'نقص البوتاسيوم (Potassium Deficiency)',
      ru: 'Дефицит калия (Potassium Deficiency)',
      zh: '缺钾症 (Potassium Deficiency)',
    },
    'healthy plant': {
      te: 'ఆరోగ్యకరమైన పంట (Healthy Plant)',
      hi: 'स्वस्थ फसल / पौधा (Healthy Plant)',
      ta: 'ஆரோக்கியமான பயிர் (Healthy Plant)',
      kn: 'ಆರೋಗ್ಯಕರ ಸಸ್ಯ (Healthy Plant)',
      ml: 'ആരോഗ്യമുള്ള വിള (Healthy Plant)',
      mr: 'निरोगी पीक (Healthy Plant)',
      gu: 'તંદુરસ્ત પાક (Healthy Plant)',
      bn: 'সুস্থ ফসল (Healthy Plant)',
      pa: 'ਤੰਦਰੁਸਤ ਫਸਲ (Healthy Plant)',
      or: 'ସୁସ୍ଥ ଫସଲ (Healthy Plant)',
      as: 'সুস্থ শস্য (Healthy Plant)',
      ur: 'صحت مند پودا (Healthy Plant)',
      pt: 'Planta Saudável (Healthy Plant)',
      es: 'Planta Sana (Healthy Plant)',
      fr: 'Plante Saine (Healthy Plant)',
      ar: 'نبات سليم (Healthy Plant)',
      ru: 'Здоровое растение (Healthy Plant)',
      zh: '健康植株 (Healthy Plant)',
    },
    'normal growth': {
      te: 'సాధారణ పంట పెరుగుదల (Normal Growth)',
      hi: 'सामान्य फसल वृद्धि (Normal Growth)',
      ta: 'இயல்பான வளர்ச்சி (Normal Growth)',
      kn: 'ಸಾಮಾನ್ಯ ಬೆಳವಣಿಗೆ (Normal Growth)',
      ml: 'സ്വാഭാവിക വളർച്ച (Normal Growth)',
      mr: 'नैसर्गिक वाढ (Normal Growth)',
      gu: 'સામાન્ય વૃદ્ધિ (Normal Growth)',
      bn: 'স্বাভাবিক বৃদ্ধি (Normal Growth)',
      pa: 'ਆਮ ਵਾਧਾ (Normal Growth)',
      or: 'ସ୍ୱାଭାବିକ ବୃଦ୍ଧି (Normal Growth)',
      as: 'স্বাভাৱিক বৃদ্ধি (Normal Growth)',
      ur: 'عمومی نشوونما (Normal Growth)',
      pt: 'Crescimento Normal (Normal Growth)',
      es: 'Crecimiento Normal (Normal Growth)',
      fr: 'Croissance Normale (Normal Growth)',
      ar: 'نمو طبيعي (Normal Growth)',
      ru: 'Нормальный рост (Normal Growth)',
      zh: '正常生长发育 (Normal Growth)',
    },
  };

  // Find exact or partial match
  for (const [key, mapping] of Object.entries(translations)) {
    if (cond === key || cond.includes(key) || key.includes(cond)) {
      if (mapping[norm]) return mapping[norm];
    }
  }

  return condition;
}

/**
 * Returns localized Crop Doctor Bot badge text
 */
export function getCropDoctorBotBadge(lang: Language): string {
  const norm = normalizeLang(lang);
  const badgeMap: Record<string, string> = {
    te: 'క్రాప్ డాక్టర్ బాట్',
    hi: 'क्रॉप डॉक्टर बॉट',
    ta: 'பயிர் மருத்துவர் பாட்',
    kn: 'ಕ್ರಾಪ್ ಡಾಕ್ಟರ್ ಬಾಟ್',
    ml: 'ക്രോപ്പ് ഡോക്ടർ ബോട്ട്',
    mr: 'क्रॉप डॉक्टर बॉट',
    gu: 'ક્રોપ ડૉક્ટર બોટ',
    bn: 'ক্রপ ডক্টর বট',
    pa: 'ਫਸਲ ਡਾਕਟਰ ਬੋਟ',
    or: 'ଫସଲ ଡାକ୍ତର ବଟ୍',
    as: 'শস্য চিকিৎসক বট',
    ur: 'کراپ ڈاکٹر بوٹ',
    ar: 'طبيب المحاصيل الذكي',
    es: 'Bot Médico de Cultivos',
    fr: 'Bot Docteur des Cultures',
    pt: 'Bot Doutor de Cultivos',
    ru: 'Бот-агроном',
    zh: '农作物医生助手',
  };
  return badgeMap[norm] || 'Crop Doctor Bot';
}

/**
 * Returns localized short idle greeting for the Crop Doctor chatbot
 */
export function getCropDoctorShortGreeting(lang: Language): string {
  const norm = normalizeLang(lang);
  const greetingMap: Record<string, string> = {
    te: 'నమస్కారం 👋 ఈ పంట వ్యాధి లేదా ఆరోగ్యం గురించి ఏదైనా అడగండి.',
    hi: 'नमस्ते 👋 इस फसल की स्थिति या बीमारी के बारे में कुछ भी पूछें।',
    ta: 'வணக்கம் 👋 இந்த பயிர் பாதிப்பு குறித்து எதையும் கேளுங்கள்.',
    kn: 'ನಮಸ್ಕಾರ 👋 ಈ ಬೆಳೆ ರೋಗ ಅಥವಾ ಆರೋಗ್ಯದ ಬಗ್ಗೆ ಏನಾದರೂ ಕೇಳಿ.',
    ml: 'നമസ്കാരം 👋 ഈ വിളയുടെ രോഗത്തെക്കുറിച്ച് എന്തും ചോദിക്കാം.',
    mr: 'नमस्कार 👋 या पिकाच्या रोगाविषयी किंवा आरोग्याविषयी काहीही विचारा.',
    gu: 'નમસ્તે 👋 આ પાકના રોગ અથવા સ્થિતિ વિશે કંઈપણ પૂછો.',
    bn: 'নমস্কার 👋 এই ফসলের রোগ বা অবস্থা সম্পর্কে যেকোনো প্রশ্ন করুন।',
    pa: 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ 👋 ਇਸ ਫਸਲ ਦੀ ਬਿਮਾਰੀ ਬਾਰੇ ਕੋਈ ਵੀ ਸਵਾਲ ਪੁੱਛੋ।',
    or: 'ନମସ୍କାର 👋 ଏହି ଫସଲ ସମ୍ବନ୍ଧରେ ଯେକୌଣସି ପ୍ରଶ୍ନ ପଚାରନ୍ତୁ।',
    as: 'নমস্কাৰ 👋 এই শস্যৰ বিষয়ে যিকোনো প্ৰশ্ন সোধক।',
    ur: 'السلام علیکم 👋 اس فصل کی بیماری کے بارے میں کچھ بھی پوچھیں۔',
    ar: 'مرحباً 👋 اسألني أي شيء عن حالة هذا المحصول.',
    es: 'Hola 👋 Pregúntame lo que sea sobre este cultivo.',
    fr: 'Bonjour 👋 Posez-moi vos questions sur cette culture.',
    pt: 'Olá 👋 Pergunte-me qualquer dúvida sobre este caso de cultivo.',
    ru: 'Здравствуйте 👋 Спросите меня о состоянии этой культуры.',
    zh: '您好 👋 欢迎咨询关于此作物的任何病害与防治问题。',
  };
  return greetingMap[norm] || 'Hi 👋 Ask me anything about this crop case.';
}

/**
 * Returns localized default source badges for the Crop Doctor initial/welcome state
 */
export function getCropDoctorDefaultSources(lang: Language): Array<{ title: string; source: string; sourceType: string }> {
  const norm = normalizeLang(lang);

  const sourcesMap: Record<string, Array<{ title: string; source: string; sourceType: string }>> = {
    te: [
      { title: 'FAO సమగ్ర సస్యరక్షణ మరియు వ్యాధి నిర్వహణ మార్గదర్శకాలు', source: 'ఐక్యరాజ్యసమితి ఆహార వ్యవసాయ సంస్థ (FAO)', sourceType: 'FAO' },
      { title: 'ICAR పంట సంరక్షణ మరియు చీడపీడల నియంత్రణ హ్యాండ్‌బుక్', source: 'భారతీయ వ్యవసాయ పరిశోధనా మండలి (ICAR)', sourceType: 'ICAR' },
    ],
    hi: [
      { title: 'एफएओ एकीकृत पादप उत्पादन एवं संरक्षण श्रृंखला', source: 'खाद्य एवं कृषि संगठन (FAO)', sourceType: 'FAO' },
      { title: 'आईसीएआर पौध सुरक्षा एवं रोग प्रबंधन नियमावली', source: 'भारतीय कृषि अनुसंधान परिषद (ICAR)', sourceType: 'ICAR' },
    ],
    ta: [
      { title: 'FAO ஒருங்கிணைந்த பயிர் பாதுகாப்பு வழிகாட்டுதல்கள்', source: 'ஐக்கிய நாடுகளின் உணவு மற்றும் வேளாண்மை அமைப்பு (FAO)', sourceType: 'FAO' },
      { title: 'ICAR பயிர் பூச்சி மற்றும் நோய் மேலாண்மை கையேடு', source: 'இந்திய வேளாண் ஆராய்ச்சி குழுமம் (ICAR)', sourceType: 'ICAR' },
    ],
    kn: [
      { title: 'FAO ಸಮಗ್ರ ಬೆಳೆ ಉತ್ಪಾದನೆ ಮತ್ತು ಸಂರಕ್ಷಣಾ ಕೈಪಿಡಿ', source: 'ಆಹಾರ ಮತ್ತು ಕೃಷಿ ಸಂಸ್ಥೆ (FAO)', sourceType: 'FAO' },
      { title: 'ICAR ಬೆಳೆ ರೋಗ ನಿರ್ವಹಣೆ ಮತ್ತು ಸಸ್ಯ ಸಂರಕ್ಷಣಾ ಮಾರ್ಗಸೂಚಿಗಳು', source: 'ಭಾರತೀಯ ಕೃಷಿ ಸಂಶೋಧನಾ ಮಂಡಳಿ (ICAR)', sourceType: 'ICAR' },
    ],
    ml: [
      { title: 'FAO സംയോജിത സസ്യസംരക്ഷണ മാർഗ്ഗരേഖ', source: 'ഭക്ഷ്യ-കാർഷിക സംഘടന (FAO)', sourceType: 'FAO' },
      { title: 'ICAR വിള രോഗനിയന്ത്രണ കൈപ്പുസ്തകം', source: 'ഇന്ത്യൻ കാർഷിക ഗവേഷണ കൗൺസിൽ (ICAR)', sourceType: 'ICAR' },
    ],
    mr: [
      { title: 'FAO एकात्मिक पीक संरक्षण व रोग व्यवस्थापन मार्गदर्शिका', source: 'अन्न आणि कृषी संघटना (FAO)', sourceType: 'FAO' },
      { title: 'ICAR पीक संरक्षण व कीड नियंत्रण नियमावली', source: 'भारतीय कृषी संशोधन परिषद (ICAR)', sourceType: 'ICAR' },
    ],
    gu: [
      { title: 'FAO સંકલિત પાક ઉત્પાદન અને સંરક્ષણ માર્ગદર્શિકા', source: 'ખાદ્ય અને કૃષિ સંસ્થા (FAO)', sourceType: 'FAO' },
      { title: 'ICAR પાક સંરક્ષણ અને રોગ નિયંત્રણ પુસ્તિકા', source: 'ભારતીય કૃષિ સંશોધન પરિષદ (ICAR)', sourceType: 'ICAR' },
    ],
    bn: [
      { title: 'FAO সমন্বিত ফসল সুরক্ষা ও রোগ ব্যবস্থাপনা নির্দেশিকা', source: 'খাদ্য ও কৃষি সংস্থা (FAO)', sourceType: 'FAO' },
      { title: 'ICAR ফসল রোগ নিয়ন্ত্রণ ও সুরক্ষা হ্যান্ডবুক', source: 'ভারতীয় কৃষি গবেষণা পরিষদ (ICAR)', sourceType: 'ICAR' },
    ],
    pa: [
      { title: 'FAO ਏਕੀਕ੍ਰਿਤ ਫਸਲ ਸੁਰੱਖਿਆ ਅਤੇ ਬਿਮਾਰੀ ਪ੍ਰਬੰਧਨ ਗਾਈਡ', source: 'ਖੁਰਾਕ ਅਤੇ ਖੇਤੀਬਾੜੀ ਸੰਗਠਨ (FAO)', sourceType: 'FAO' },
      { title: 'ICAR ਪੌਦਾ ਸੁਰੱਖਿਆ ਅਤੇ ਕੀਟ ਪ੍ਰਬੰਧਨ ਹੈਂਡਬੁੱਕ', source: 'ਭਾਰਤੀ ਖੇਤੀਬਾੜੀ ਖੋਜ ਪ੍ਰੀਸ਼ਦ (ICAR)', sourceType: 'ICAR' },
    ],
    or: [
      { title: 'FAO ସମନ୍ୱିତ ଫସଲ ସୁରକ୍ଷା ଏବଂ ରୋଗ ପରିଚାଳନା ନିର୍ଦ୍ଦେଶାବଳୀ', source: 'ଖାଦ୍ୟ ଏବଂ କୃଷି ସଂଗଠନ (FAO)', sourceType: 'FAO' },
      { title: 'ICAR ଫସଲ ସୁରକ୍ଷା ଓ କୀଟ ନିୟନ୍ତ୍ରଣ ପୁସ୍ତିକା', source: 'ଭାରତୀୟ କୃଷି ଗବେଷଣା ପରିଷଦ (ICAR)', sourceType: 'ICAR' },
    ],
    as: [
      { title: 'FAO সমন্বিত শস্য সুৰক্ষা আৰু ৰোগ নিয়ন্ত্ৰণ নিৰ্দেশনাৱলী', source: 'খাদ্য আৰু কৃষি সংস্থা (FAO)', sourceType: 'FAO' },
      { title: 'ICAR শস্য ৰোগ ব্যৱস্থাপনা হাতপুথি', source: 'ভাৰতীয় কৃষি গৱেষণা পৰিষদ (ICAR)', sourceType: 'ICAR' },
    ],
    ur: [
      { title: 'ایف اے او جامع تحفظ نباتات اور انتظام امراض گائیڈ', source: 'ادارہ برائے خوراک و زراعت (FAO)', sourceType: 'FAO' },
      { title: 'آئی سی اے آر پودوں کا تحفظ و انسداد امراض کتابچہ', source: 'انڈین کونسل آف ایگریکلچرل ریسرچ (ICAR)', sourceType: 'ICAR' },
    ],
    pt: [
      { title: 'Série de Produção e Proteção Vegetal da FAO', source: 'Compêndio de MIP da FAO', sourceType: 'FAO' },
      { title: 'Manual de Fitopatologia e Manejo Integrado de Pragas', source: 'Serviço de Extensão Agrícola', sourceType: 'University Extension' },
    ],
    ru: [
      { title: 'Руководство ФАО по интегрированной защите растений', source: 'Продовольственная и сельскохозяйственная организация ООН (ФАО)', sourceType: 'FAO' },
      { title: 'Справочник по защите растений и фитопатологии', source: 'Аграрная научно-консультационная служба', sourceType: 'Extension' },
    ],
    zh: [
      { title: '联合国粮农组织 (FAO) 作物综合植保技术指南', source: '联合国粮农组织 (FAO)', sourceType: 'FAO' },
      { title: '国家农业科学研究院植保与病害综合防治手册', source: '农业扩展与科研中心', sourceType: 'Extension' },
    ],
  };

  return sourcesMap[norm] || [
    { title: 'FAO Plant Production & Protection Series', source: 'FAO IPM Compendium', sourceType: 'FAO' },
    { title: 'Agricultural Extension Disease Management Keys', source: 'State Extension Service', sourceType: 'University Extension' },
  ];
}

export interface CropDoctorSessionI18n {
  newChat: string;
  history: string;
  savedConsultations: string;
  noSavedChats: string;
  signInToSave: string;
  searchPlaceholder: string;
  deleteConfirm: string;
  activeSession: string;
  messagesCount: string;
  syncedToCloud: string;
  saving: string;
  ephemeralNotice: string;
}

export function getCropDoctorSessionTranslations(lang: Language): CropDoctorSessionI18n {
  const norm = normalizeLang(lang);

  const map: Record<string, CropDoctorSessionI18n> = {
    te: {
      newChat: 'కొత్త సంభాషణ',
      history: 'చరిత్ర',
      savedConsultations: 'భద్రపరిచిన సంభాషణలు',
      noSavedChats: 'ఇంకా సంభాషణలు లేవు. మీ చాట్ ఇక్కడ భద్రపరచబడుతుంది.',
      signInToSave: 'చాట్ చరిత్రను భద్రపరచడానికి లాగిన్ అవ్వండి',
      searchPlaceholder: 'సంభాషణలను వెతకండి...',
      deleteConfirm: 'ఈ సంభాషణను తొలగించాలా?',
      activeSession: 'ప్రస్తుతం',
      messagesCount: 'సందేశాలు',
      syncedToCloud: 'క్లౌడ్‌లో భద్రపరచబడింది',
      saving: 'భద్రపరుస్తోంది…',
      ephemeralNotice: 'లాగిన్ చేయడం ద్వారా మీ చాట్ చరిత్ర సురక్షితంగా సేవ్ అవుతుంది.',
    },
    hi: {
      newChat: 'नई बातचीत',
      history: 'इतिहास',
      savedConsultations: 'सहेजी गई बातचीत',
      noSavedChats: 'अभी तक कोई सहेजी गई बातचीत नहीं है। आपकी चर्चा यहाँ सुरक्षित रहेगी।',
      signInToSave: 'बातचीत का इतिहास सहेजने के लिए लॉगिन करें',
      searchPlaceholder: 'बातचीत खोजें...',
      deleteConfirm: 'क्या आप इस बातचीत को हटाना चाहते हैं?',
      activeSession: 'सक्रिय',
      messagesCount: 'संदेश',
      syncedToCloud: 'क्लाउड में सुरक्षित',
      saving: 'सहेजा जा रहा है…',
      ephemeralNotice: 'लॉगिन करने से आपकी सभी बातचीत स्थायी रूप से सुरक्षित रहेंगी।',
    },
    ta: {
      newChat: 'புதிய உரையாடல்',
      history: 'வரலாறு',
      savedConsultations: 'சேமிக்கப்பட்ட உரையாடல்கள்',
      noSavedChats: 'இன்னும் உரையாடல்கள் இல்லை. உங்கள் ஆலோசனைகள் இங்கே சேமிக்கப்படும்.',
      signInToSave: 'உரையாடல் வரலாற்றைச் சேமிக்க உள்நுழையவும்',
      searchPlaceholder: 'உரையாடல்களைத் தேடுக...',
      deleteConfirm: 'இந்த உரையாடலை நீக்க விரும்புகிறீர்களா?',
      activeSession: 'செயலில்',
      messagesCount: 'செய்திகள்',
      syncedToCloud: 'மேகக்கணியில் சேமிக்கப்பட்டது',
      saving: 'சேமிக்கப்படுகிறது…',
      ephemeralNotice: 'உள்நுழைவதன் மூலம் உங்கள் உரையாடல்கள் நிரந்தரமாக சேமிக்கப்படும்.',
    },
    kn: {
      newChat: 'ಹೊಸ ಸಂಭಾಷಣೆ',
      history: 'ಇತಿಹಾಸ',
      savedConsultations: 'ಉಳಿಸಿದ ಸಂಭಾಷಣೆಗಳು',
      noSavedChats: 'ಇನ್ನೂ ಯಾವುದೇ ಉಳಿಸಿದ ಸಂಭಾಷಣೆಗಳಿಲ್ಲ.',
      signInToSave: 'ಸಂಭಾಷಣೆಯನ್ನು ಉಳಿಸಲು ಲಾಗಿನ್ ಆಗಿ',
      searchPlaceholder: 'ಸಂಭಾಷಣೆಗಳನ್ನು ಹುಡುಕಿ...',
      deleteConfirm: 'ಈ ಸಂಭಾಷಣೆಯನ್ನು ಅಳಿಸಬೇಕೆ?',
      activeSession: 'ಸಕ್ರಿಯ',
      messagesCount: 'ಸಂದೇಶಗಳು',
      syncedToCloud: 'ಕ್ಲೌಡ್‌ನಲ್ಲಿ ಉಳಿಸಲಾಗಿದೆ',
      saving: 'ಉಳಿಸಲಾಗುತ್ತಿದೆ…',
      ephemeralNotice: 'ಲಾಗಿನ್ ಮಾಡುವ ಮೂಲಕ ನಿಮ್ಮ ಸಂಭಾಷಣೆ ಇತಿಹಾಸವನ್ನು ಸುರಕ್ಷಿತವಾಗಿಡಬಹುದು.',
    },
    ml: {
      newChat: 'പുതിയ സംഭാഷണം',
      history: 'ചരിത്രം',
      savedConsultations: 'സംരക്ഷിച്ച സംഭാഷണങ്ങൾ',
      noSavedChats: 'സംഭാഷണങ്ങൾ ഇതുവരെ ഇല്ല.',
      signInToSave: 'സംഭാഷണം സംരക്ഷിക്കാൻ ലോഗിൻ ചെയ്യുക',
      searchPlaceholder: 'തിരയുക...',
      deleteConfirm: 'ഈ സംഭാഷണം ഇല്ലാതാക്കണോ?',
      activeSession: 'സജീവം',
      messagesCount: 'സന്ദേശങ്ങൾ',
      syncedToCloud: 'ക്ലൗഡിൽ സംരക്ഷിച്ചു',
      saving: 'സംരക്ഷിക്കുന്നു…',
      ephemeralNotice: 'ലോഗിൻ ചെയ്യുന്നതിലൂടെ സംഭാഷണ ചരിത്രം സുരക്ഷിതമായി സൂക്ഷിക്കാം.',
    },
    mr: {
      newChat: 'नवीन संभाषण',
      history: 'इतिहास',
      savedConsultations: 'जतन केलेले संभाषण',
      noSavedChats: 'अद्याप कोणतेही संभाषण जतन केलेले नाही.',
      signInToSave: 'इतिहास जतन करण्यासाठी लॉग इन करा',
      searchPlaceholder: 'संभाषण शोधा...',
      deleteConfirm: 'हे संभाषण हटवायचे का?',
      activeSession: 'सक्रिय',
      messagesCount: 'संदेश',
      syncedToCloud: 'क्लाउडवर जतन केले',
      saving: 'जतन करत आहे…',
      ephemeralNotice: 'लॉग इन केल्याने आपले सर्व संभाषण सुरक्षित राहील.',
    },
    gu: {
      newChat: 'નવી વાતચીત',
      history: 'ઇતિહાસ',
      savedConsultations: 'સાચવેલી વાતચીત',
      noSavedChats: 'હજુ સુધી કોઈ સાચવેલી વાતચીત નથી.',
      signInToSave: 'ઇતિહાસ સાચવવા માટે લૉગ ઇન કરો',
      searchPlaceholder: 'વાતચીત શોધો...',
      deleteConfirm: 'શું તમે આ વાતચીત કાઢી નાખવા માંગો છો?',
      activeSession: 'સક્રિય',
      messagesCount: 'સંદેશાઓ',
      syncedToCloud: 'ક્લાઉડમાં સુરક્ષિત',
      saving: 'સાચવી રહ્યું છે…',
      ephemeralNotice: 'લૉગ ઇન કરીને તમારી બધી વાતચીત સુરક્ષિત રીતે સંગ્રહિત થશે.',
    },
    bn: {
      newChat: 'নতুন কথোপকথন',
      history: 'ইতিহাস',
      savedConsultations: 'সংরক্ষিত কথোপকথন',
      noSavedChats: 'এখনও কোনো কথোপকথন সংরক্ষিত নেই।',
      signInToSave: 'কথোপকথন সংরক্ষণ করতে লগইন করুন',
      searchPlaceholder: 'অনুসন্ধান করুন...',
      deleteConfirm: 'এই কথোপকথনটি মুছতে চান?',
      activeSession: 'সক্রিয়',
      messagesCount: 'বার্তা',
      syncedToCloud: 'ক্লাউডে সংরক্ষিত',
      saving: 'সংরক্ষণ করা হচ্ছে…',
      ephemeralNotice: 'লগইন করলে আপনার সকল পরামর্শের ইতিহাস সংরক্ষিত থাকবে।',
    },
    pa: {
      newChat: 'ਨਵੀਂ ਗੱਲਬਾਤ',
      history: 'ਇਤਿਹਾਸ',
      savedConsultations: 'ਸੰਭਾਲੀ ਗੱਲਬਾਤ',
      noSavedChats: 'ਅਜੇ ਤੱਕ ਕੋਈ ਗੱਲਬਾਤ ਸੰਭਾਲੀ ਨਹੀਂ ਗਈ।',
      signInToSave: 'ਇਤਿਹਾਸ ਸੰਭਾਲਣ ਲਈ ਲੌਗਇਨ ਕਰੋ',
      searchPlaceholder: 'ਖੋਜੋ...',
      deleteConfirm: 'ਕੀ ਤੁਸੀਂ ਇਹ ਗੱਲਬਾਤ ਮਿਟਾਉਣਾ ਚਾਹੁੰਦੇ ਹੋ?',
      activeSession: 'ਸਰਗਰਮ',
      messagesCount: 'ਸੁਨੇਹੇ',
      syncedToCloud: 'ਕਲਾਊਡ ਵਿੱਚ ਸੰਭਾਲਿਆ',
      saving: 'ਸੰਭਾਲਿਆ ਜਾ ਰਿਹਾ ਹੈ…',
      ephemeralNotice: 'ਲੌਗਇਨ ਕਰਨ ਨਾਲ ਤੁਹਾਡੀ ਗੱਲਬਾਤ ਦਾ ਇਤਿਹਾਸ ਸੁਰੱਖਿਅਤ ਰਹੇਗਾ।',
    },
    or: {
      newChat: 'ନୂତନ ବାର୍ତ୍ତାଳାପ',
      history: 'ଇତିହାସ',
      savedConsultations: 'ସଂରକ୍ଷିତ ବାର୍ତ୍ତାଳାପ',
      noSavedChats: 'ଏପର୍ଯ୍ୟନ୍ତ କୌଣସି ସଂରକ୍ଷିତ ବାର୍ତ୍ତାଳାପ ନାହିଁ।',
      signInToSave: 'ସଂରକ୍ଷଣ କରିବାକୁ ଲଗ୍ ଇନ୍ କରନ୍ତୁ',
      searchPlaceholder: 'ଖୋଜନ୍ତୁ...',
      deleteConfirm: 'ଏହି ବାର୍ତ୍ତାଳାପକୁ ବିଲୋପ କରିବେ କି?',
      activeSession: 'ସକ୍ରିୟ',
      messagesCount: 'ବାର୍ତ୍ତା',
      syncedToCloud: 'କ୍ଲାଉଡ୍ ରେ ସୁରକ୍ଷିତ',
      saving: 'ସଂରକ୍ଷିତ ହେଉଛି…',
      ephemeralNotice: 'ଲଗ୍ ଇନ୍ କଲେ ଆପଣଙ୍କର ସମସ୍ତ ବାର୍ତ୍ତାଳାପ ସୁରକ୍ଷିତ ରହିବ।',
    },
    as: {
      newChat: 'নতুন বাৰ্তালাপ',
      history: 'ইতিহাস',
      savedConsultations: 'সংৰক্ষিত বাৰ্তালাপ',
      noSavedChats: 'এতিয়ালৈকে কোনো বাৰ্তালাপ সংৰক্ষিত হোৱা নাই।',
      signInToSave: 'সংৰক্ষণ কৰিবলৈ লগ ইন কৰক',
      searchPlaceholder: 'সন্ধান কৰক...',
      deleteConfirm: 'এই বাৰ্তালাপটো মচি পেলাব বিচাৰেনে?',
      activeSession: 'সক্ৰিয়',
      messagesCount: 'বাৰ্তা',
      syncedToCloud: 'ক্লাউডত সংৰক্ষিত',
      saving: 'সংৰক্ষণ হৈ আছে…',
      ephemeralNotice: 'লগ ইন কৰিলে আপোনাৰ সকলো বাৰ্তালাপ সুৰক্ষিত থাকিব।',
    },
    ur: {
      newChat: 'نئی بات چیت',
      history: 'تاریخچہ',
      savedConsultations: 'محفوظ شدہ مکالمے',
      noSavedChats: 'ابھی تک کوئی بات چیت محفوظ نہیں ہے۔',
      signInToSave: 'ہسٹری محفوظ کرنے کیلئے لاگ ان کریں',
      searchPlaceholder: 'تلاش کریں...',
      deleteConfirm: 'کیا آپ یہ بات چیت حذف کرنا چاہتے ہیں؟',
      activeSession: 'فعال',
      messagesCount: 'پیغامات',
      syncedToCloud: 'کلاؤڈ پر محفوظ',
      saving: 'محفوظ ہو رہا ہے…',
      ephemeralNotice: 'لاگ ان کرنے سے آپ کی تمام بات چیت محفوظ رہے گی۔',
    },
    pt: {
      newChat: 'Nova Consulta',
      history: 'Histórico',
      savedConsultations: 'Consultas Salvas',
      noSavedChats: 'Nenhuma consulta salva ainda.',
      signInToSave: 'Faça login para salvar o histórico',
      searchPlaceholder: 'Buscar consultas...',
      deleteConfirm: 'Excluir esta conversa?',
      activeSession: 'Ativa',
      messagesCount: 'mensagens',
      syncedToCloud: 'Sincronizado na Nuvem',
      saving: 'Salvando…',
      ephemeralNotice: 'Faça login para manter suas consultas salvas com segurança.',
    },
    es: {
      newChat: 'Nueva Consulta',
      history: 'Historial',
      savedConsultations: 'Consultas Guardadas',
      noSavedChats: 'No hay consultas guardadas aún.',
      signInToSave: 'Inicia sesión para guardar el historial',
      searchPlaceholder: 'Buscar consultas...',
      deleteConfirm: '¿Eliminar esta conversación?',
      activeSession: 'Activa',
      messagesCount: 'mensajes',
      syncedToCloud: 'Guardado en la Nube',
      saving: 'Guardando…',
      ephemeralNotice: 'Inicia sesión para guardar automáticamente tus diagnósticos en todos tus dispositivos.',
    },
    fr: {
      newChat: 'Nouvelle Consultation',
      history: 'Historique',
      savedConsultations: 'Consultations Enregistrées',
      noSavedChats: 'Aucune consultation enregistrée pour l\'instant.',
      signInToSave: 'Connectez-vous pour enregistrer l\'historique',
      searchPlaceholder: 'Rechercher des consultations...',
      deleteConfirm: 'Supprimer cette conversation ?',
      activeSession: 'Active',
      messagesCount: 'messages',
      syncedToCloud: 'Enregistré dans le Cloud',
      saving: 'Enregistrement…',
      ephemeralNotice: 'Connectez-vous pour conserver vos consultations agricoles en toute sécurité.',
    },
    ar: {
      newChat: 'محادثة جديدة',
      history: 'السجل',
      savedConsultations: 'الاستشارات المحفوظة',
      noSavedChats: 'لا توجد استشارات محفوظة حتى الآن.',
      signInToSave: 'سجل الدخول لحفظ السجل',
      searchPlaceholder: 'بحث في الاستشارات...',
      deleteConfirm: 'حذف هذه المحادثة؟',
      activeSession: 'نشط',
      messagesCount: 'رسائل',
      syncedToCloud: 'محفوظ في السحابة',
      saving: 'جارٍ الحفظ…',
      ephemeralNotice: 'تسجيل الدخول يحفظ استشاراتك الزراعية بشكل دائم عبر أجهزتك.',
    },
    ru: {
      newChat: 'Новый диалог',
      history: 'История',
      savedConsultations: 'Сохраненные диалоги',
      noSavedChats: 'Нет сохраненных диалогов.',
      signInToSave: 'Войдите, чтобы сохранять историю',
      searchPlaceholder: 'Поиск диалогов...',
      deleteConfirm: 'Удалить этот диалог?',
      activeSession: 'Активен',
      messagesCount: 'сообщений',
      syncedToCloud: 'Сохранено в облаке',
      saving: 'Сохранение…',
      ephemeralNotice: 'Войдите в систему для постоянного сохранения ваших консультаций.',
    },
    zh: {
      newChat: '新对话',
      history: '历史记录',
      savedConsultations: '已保存的咨询',
      noSavedChats: '暂无已保存的对话。',
      signInToSave: '登录以保存对话历史',
      searchPlaceholder: '搜索咨询记录...',
      deleteConfirm: '确定删除此对话？',
      activeSession: '进行中',
      messagesCount: '条消息',
      syncedToCloud: '已同步至云端',
      saving: '正在保存…',
      ephemeralNotice: '登录后即可永久保存您的农作物咨询记录。',
    },
  };

  return (
    map[norm] || {
      newChat: 'New Consultation',
      history: 'History',
      savedConsultations: 'Saved Consultations',
      noSavedChats: 'No saved consultations yet. Your discussions with the AI Doctor will appear here.',
      signInToSave: 'Sign in to save chat history',
      searchPlaceholder: 'Search consultations...',
      deleteConfirm: 'Delete this conversation session?',
      activeSession: 'Active',
      messagesCount: 'messages',
      syncedToCloud: 'Saved to Cloud',
      saving: 'Saving…',
      ephemeralNotice: 'Sign in to automatically save your diagnostic conversations across devices.',
    }
  );
}

/**
 * Builds a localized, rich fallback response when server AI is unavailable.
 */
export function getCropDoctorLocalizedFallback(
  query: string,
  condition: string,
  crop: string,
  immediateAction: string | undefined,
  cause: string | undefined,
  lang: Language
): { text: string; speechText?: string; observed?: string[]; inferred?: string[]; actions?: string[] } {
  const norm = normalizeLang(lang);
  const q = query.toLowerCase();

  switch (norm) {
    case 'te': {
      if (q.includes('ఎందుకు') || q.includes('కారణం') || q.includes('why')) {
        return {
          text: `### వ్యాధి నిర్ధారణ & కారణాలు\n\n**${crop}** లో **${condition}** ప్రధానంగా గాలిలో తేమ శాతం అధికంగా ఉండటం (80% కంటే ఎక్కువ), ఆకులపై ఎక్కువ సమయం తేమ నిలవడం మరియు గాలి ప్రసరణ తక్కువగా ఉండటం వల్ల వస్తుంది.`,
          inferred: [cause || 'వాతావరణ తేమ మరియు నీటి నిల్వ వల్ల వ్యాధికారకం వ్యాపించింది.'],
        };
      }
      if (q.includes('చేయాలి') || q.includes('ఇప్పుడు') || q.includes('what should i do')) {
        return {
          text: `### తక్షణ క్షేత్ర యాజమాన్య చర్యలు\n\n**${crop}** రక్షణ కోసం సిఫార్సు చేయబడిన చర్యలు:\n- **నీటి యాజమాన్యం**: ఆకులపై నీరు పడకుండా తుంపర్ల నీటిపారుదలను ఆపండి.\n- **పరిశుభ్రత**: బాగా దెబ్బతిన్న దిగువ ఆకులను తొలగించి నాశనం చేయండి.\n- **సేంద్రియ రక్షణ**: ట్రైకోడెర్మా లేదా వేప నూనె ద్రావణాన్ని పిచికారీ చేయండి.`,
          actions: [immediateAction || 'వ్యాధి సోకిన మొక్కలను వేరుచేసి గాలి ప్రసరణను మెరుగుపరచండి.'],
        };
      }
      if (q.includes('వ్యాపిస్తుందా') || q.includes('spread')) {
        return {
          text: `### వ్యాప్తి ప్రమాదం\n\n**అవును**, గాలి మరియు వర్షపు తుంపర్ల ద్వారా శిలీంధ్ర బీజాలు పక్క పంటలకు త్వరగా వ్యాపిస్తాయి. తెగులు సోకిన ఆకులను పొలం బయట వేసి పూడ్చివేయండి.`,
        };
      }
      return {
        text: `### సస్యరక్షణ విశ్లేషణ\n\n**${crop}** లో **${condition}** సంబంధించి: ${immediateAction || cause || 'తదుపరి 48 గంటల్లో లక్షణాల మార్పులను గమనించండి మరియు సమతుల్య పోషణ అందించండి.'}`,
      };
    }
    case 'hi': {
      if (q.includes('क्यों') || q.includes('कारण') || q.includes('why')) {
        return {
          text: `### रोग निदान एवं कारण\n\n**${crop}** में **${condition}** मुख्य रूप से अधिक आर्द्रता (80% से अधिक), पत्तियों पर लंबे समय तक नमी टिके रहने और हवा के कम संचार के कारण फैलता है।`,
          inferred: [cause || 'सूक्ष्म जलवायु में अधिक नमी ने रोगजनक को बढ़ावा दिया।'],
        };
      }
      if (q.includes('क्या करें') || q.includes('उपाय') || q.includes('what should i do')) {
        return {
          text: `### तत्काल खेत प्रबंधन कदम\n\n**${crop}** के लिए अनुशंसित उपाय:\n- **सिंचाई प्रबंधन**: पत्तियों को सूखा रखने के लिए फव्वारा सिंचाई रोकें।\n- **स्वच्छता**: संक्रमित निचली पत्तियों को काटकर खेत से दूर नष्ट करें।\n- **जैविक उपचार**: ट्राइकोडर्मा या नीम तेल (10,000 ppm) का छिड़काव करें।`,
          actions: [immediateAction || 'संक्रमित पौधों को अलग करें और वायु संचार में सुधार करें।'],
        };
      }
      if (q.includes('फैल') || q.includes('spread')) {
        return {
          text: `### प्रसार जोखिम\n\n**हाँ**, फफूंद के बीजाणु हवा और बारिश की बूंदों से आस-पास के पौधों में तेजी से फैल सकते हैं। गीली पत्तियों के समय खेत में काम करने से बचें।`,
        };
      }
      return {
        text: `### पादप स्वास्थ्य परामर्श\n\n**${crop}** में **${condition}** के संदर्भ में: ${immediateAction || cause || 'कृपया अगले 48 घंटों तक फसल का निरीक्षण करें और संतुलित पोषण दें।'}`
      };
    }
    case 'ta': {
      if (q.includes('ஏன்') || q.includes('காரணம்') || q.includes('why')) {
        return {
          text: `### நோய் கண்டறிதல் & காரணங்கள்\n\n**${crop}** பயிரில் **${condition}** முக்கியமாக அதிக ஈரப்பதம் (80% மேல்), இலைகளில் அதிக நேரம் தண்ணீர் தங்குவது மற்றும் போதிய காற்றோட்டமின்மையால் ஏற்படுகிறது.`,
          inferred: [cause || 'அதிக ஈரப்பதம் நோய்க்கிருமி பெருக்கத்திற்கு சாதகமாக அமைந்தது.'],
        };
      }
      if (q.includes('செய்ய வேண்டும்') || q.includes('என்ன செய்ய') || q.includes('what should i do')) {
        return {
          text: `### உடனடி கள மேலாண்மை முறைகள்\n\n**${crop}** பயிருக்கான பரிந்துரைக்கப்பட்ட நடவடிக்கைகள்:\n- **பாசனம்**: இலைகள் நனையாதவாறு தெளிப்புப் பாசனத்தை தவிர்க்கவும்.\n- **களத்தூய்மை**: பாதிக்கப்பட்ட கீழ் இலைகளை அகற்றி அழிக்கவும்.\n- **இயற்கை கட்டுப்பாடு**: டிரைக்கோடெர்மா அல்லது வேப்பெண்ணெய் கரைசல் தெளிக்கவும்.`,
          actions: [immediateAction || 'பாதிக்கப்பட்ட செடிகளை பிரித்து காற்றோட்டத்தை அதிகரிக்கவும்.'],
        };
      }
      return {
        text: `### பயிர் பாதுகாப்பு ஆலோசனை\n\n**${crop}** பயிரில் **${condition}** குறித்து: ${immediateAction || cause || 'அடுத்த 48 மணிநேரத்திற்கு அறிகுறிகளைக் கண்காணித்து சீரான ஊட்டச்சத்து அளியுங்கள்.'}`,
      };
    }
    case 'kn': {
      if (q.includes('ಏಕೆ') || q.includes('ಕಾರಣ') || q.includes('why')) {
        return {
          text: `### ರೋಗ ನಿರ್ಣಯ ಮತ್ತು ಕಾರಣಗಳು\n\n**${crop}** ಬೆಳೆಯಲ್ಲಿ **${condition}** ಮುಖ್ಯವಾಗಿ ಹೆಚ್ಚಿನ ಆರ್ದ್ರತೆ (80% ಕ್ಕಿಂತ ಹೆಚ್ಚು), ಎಲೆಗಳ ಮೇಲೆ ಹೆಚ್ಚು ಕಾಲ ತೇವಾಂಶ ಇರುವುದು ಮತ್ತು ಗಾಳಿಯ ಸಂಚಾರ ಕೊರತೆಯಿಂದ ಹರಡುತ್ತದೆ.`,
          inferred: [cause || 'ವಾತಾವರಣದ ತೇವಾಂಶವು ರೋಗಾಣು ಬೆಳವಣಿಗೆಗೆ ಕಾರಣವಾಯಿತು.'],
        };
      }
      if (q.includes('ಮಾಡಬೇಕು') || q.includes('ಕ್ರಮ') || q.includes('what should i do')) {
        return {
          text: `### ತುರ್ತು ಕ್ಷೇತ್ರ ನಿರ್ವಹಣಾ ಕ್ರಮಗಳು\n\n**${crop}** ರಕ್ಷಣೆಗಾಗಿ ಶಿಫಾರಸು ಮಾಡಿದ ಕ್ರಮಗಳು:\n- **ನೀರಾವರಿ**: ಎಲೆಗಳ ಮೇಲೆ ನೀರು ಬೀಳದಂತೆ ತುಂತುರು ನೀರಾವರಿ ನಿಲ್ಲಿಸಿ.\n- **ಸ್ವಚ್ಛತೆ**: ಬಾಧಿತ ಕೆಳಗಿನ ಎಲೆಗಳನ್ನು ಕಿತ್ತು ನಾಶಪಡಿಸಿ.\n- **ಜೈವಿಕ ಚಿಕಿತ್ಸೆ**: ಟ್ರೈಕೋಡರ್ಮಾ ಅಥವಾ ಬೇವಿನ ಎಣ್ಣೆ ಸಿಂಪಡಿಸಿ.`,
          actions: [immediateAction || 'ಪೀಡಿತ ಸಸ್ಯಗಳನ್ನು ಪ್ರತ್ಯೇಕಿಸಿ ಮತ್ತು ಗಾಳಿಯಾಡುವಂತೆ ಮಾಡಿ.'],
        };
      }
      if (q.includes('ಹರಡ') || q.includes('spread')) {
        return {
          text: `### ಹರಡುವ ಅಪಾಯ\n\n**ಹೌದು**, ಗಾಳಿ ಮತ್ತು ಮಳೆಯ ಹನಿಗಳ ಮೂಲಕ ಶಿಲೀಂಧ್ರ ಬೀಜಕಗಳು ಪಕ್ಕದ ಗಿಡಗಳಿಗೆ ವೇಗವಾಗಿ ಹರಡಬಹುದು. ಎಲೆಗಳು ಒದ್ದೆಯಾಗಿರುವಾಗ ಕೃಷಿ ಕೆಲಸ ಮಾಡಬೇಡಿ.`,
        };
      }
      return {
        text: `### ಸಸ್ಯ ಆರೋಗ್ಯ ಸಮಾಲೋಚನೆ\n\n**${crop}** ಬೆಳೆಯಲ್ಲಿ **${condition}** ಬಗ್ಗೆ: ${immediateAction || cause || 'ಮುಂದಿನ 48 ಗಂಟೆಗಳ ಕಾಲ ರೋಗಲಕ್ಷಣಗಳನ್ನು ಗಮನಿಸಿ ಮತ್ತು ಸಮತೋಲಿತ ಪೋಷಣೆ ನೀಡಿ.'}`,
      };
    }
    case 'ml': {
      if (q.includes('എന്തുകൊണ്ട്') || q.includes('കാരണം') || q.includes('why')) {
        return {
          text: `### രോഗനിർണയവും കാരണങ്ങളും\n\n**${crop}** കൃഷിയിൽ **${condition}** പ്രധാനമായും ഉയർന്ന അന്തരീക്ഷ ഈർപ്പം (80% ൽ കൂടുതൽ), ഇലകളിൽ ഈർപ്പം തങ്ങിനിൽക്കുന്നത് എന്നിവ മൂലമാണ് ഉണ്ടാകുന്നത്.`,
          inferred: [cause || 'അന്തരീക്ഷ ഈർപ്പവും ഈർപ്പ സാന്നിധ്യവും രോഗത്തിന് കാരണമായി.'],
        };
      }
      if (q.includes('ചെയ്യണം') || q.includes('നടപടി') || q.includes('what should i do')) {
        return {
          text: `### അടിയന്തര പരിപാലന നടപടികൾ\n\n**${crop}** സംരക്ഷണത്തിനായി:\n- **നന**: ഇലകൾ നനയാതിരിക്കാൻ സ്പ്രിംഗ്ലർ നന ഒഴിവാക്കുക.\n- **ശുചിത്വം**: ബാധിച്ച ഇലകൾ മുറിച്ചുമാറ്റി നശിപ്പിക്കുക.\n- **ജൈവ നിയന്ത്രണം**: ട്രൈക്കോഡെർമ അല്ലെങ്കിൽ വേപ്പെണ്ണ സ്പ്രേ ചെയ്യുക.`,
          actions: [immediateAction || 'രോഗം ബാധിച്ച ഭാഗങ്ങൾ മാറ്റി വായുസഞ്ചാരം ഉറപ്പാക്കുക.'],
        };
      }
      return {
        text: `### വിള ആരോഗ്യ നിർദേശം\n\n**${crop}** ലെ **${condition}** സംബന്ധിച്ച്: ${immediateAction || cause || 'ലക്ഷണങ്ങൾ നിരീക്ഷിച്ച് ഉചിതമായ സംരക്ഷണ നടപടികൾ സ്വീകരിക്കുക.'}`,
      };
    }
    case 'mr': {
      if (q.includes('का') || q.includes('कारण') || q.includes('why')) {
        return {
          text: `### रोग निदान आणि कारणे\n\n**${crop}** पिकावर **${condition}** प्रामुख्याने हवेतील उच्च आर्द्रता (८०% पेक्षा जास्त), पानांवर सतत ओलावा आणि अपुरा हवा खेळता राहिल्यामुळे उद्भवतो.`,
          inferred: [cause || 'हवेतील ओलावा व अनुकूल तापमानामुळे बुरशीची वाढ झाली.'],
        };
      }
      if (q.includes('करावे') || q.includes('उपाय') || q.includes('what should i do')) {
        return {
          text: `### तात्काळ शेत व्यवस्थापन उपाय\n\n**${crop}** पिकाच्या संरक्षणासाठी:\n- **सिंचन**: पानांवर पाणी न पडू देता ठिबक सिंचन वापरा.\n- **स्वच्छता**: रोगट खालची पाने खुडून शेताबाहेर नष्ट करा.\n- **जैविक फवारणी**: ट्रायकोडर्मा किंवा कडुनिंब तेलाची (१०,००० ppm) फवारणी करा.`,
          actions: [immediateAction || 'रोगग्रस्त झाडे वेगळी करा आणि हवा खेळती ठेवा.'],
        };
      }
      if (q.includes('पसर') || q.includes('spread')) {
        return {
          text: `### प्रसार धोका\n\n**होय**, बुरशीचे बीजाणू वारा आणि पावसाच्या थेंबांद्वारे लगतच्या पिकांवर वेगाने पसरू शकतात. पाने ओली असताना शेतात काम करणे टाळा.`,
        };
      }
      return {
        text: `### पीक संरक्षण सल्ला\n\n**${crop}** वरील **${condition}** बाबत: ${immediateAction || cause || 'पुढील ४८ तास लक्ष ठेवा आणि संतुलित पोषण द्या.'}`,
      };
    }
    case 'gu': {
      if (q.includes('કેમ') || q.includes('કારણ') || q.includes('why')) {
        return {
          text: `### રોગ નિદાન અને કારણો\n\n**${crop}** પાકમાં **${condition}** મુખ્યત્વે હવામાં વધુ ભેજ (૮૦% થી વધુ), પાંદડા પર લાંબા સમય સુધી પાણી રહેવાને કારણે થાય છે.`,
          inferred: [cause || 'વાતાવરણમાં વધુ ભેજને કારણે રોગ ફેલાયો.'],
        };
      }
      if (q.includes('કરવું') || q.includes('ઉપાય') || q.includes('what should i do')) {
        return {
          text: `### તાત્કાલિક ખેત વ્યવસ્થાપન પગલાં\n\n**${crop}** ના સંરક્ષણ માટે:\n- **પિયત**: પાંદડા સૂકા રાખવા માટે ફુવારા પિયત બંધ કરો.\n- **સ્વચ્છતા**: રોગગ્રસ્ત નીચલા પાંદડા કાપીને ખેતર બહાર નાશ કરો.\n- **જૈવિક સારવાર**: ટ્રાઈકોડર્મા અથવા લીમડાના તેલનો છંટકಾವ કરો.`,
          actions: [immediateAction || 'અસરગ્રસ્ત છોડને અલગ કરો અને હવાની અવરજવર સુધારો.'],
        };
      }
      return {
        text: `### પાક સંરક્ષણ માર્ગદર્શન\n\n**${crop}** માં **${condition}** સંદર્ભે: ${immediateAction || cause || 'આગામી ૪૮ કલાક સુધી લક્ષણોનું નિરીક્ષણ કરો.'}`,
      };
    }
    case 'bn': {
      if (q.includes('কেন') || q.includes('কারণ') || q.includes('why')) {
        return {
          text: `### রোগ নির্ণয় ও কারণ\n\n**${crop}** ফসলে **${condition}** মূলত বাতাসে অতিরিক্ত আর্দ্রতা (৮০% এর বেশি) এবং পাতার ওপর দীর্ঘক্ষণ জল জমে থাকার কারণে ঘটে থাকে।`,
          inferred: [cause || 'অনুকূল তাপমাত্রা ও আর্দ্রতার কারণে জীবাণু ছড়িয়েছে।'],
        };
      }
      if (q.includes('করব') || q.includes('উপায়') || q.includes('what should i do')) {
        return {
          text: `### তাৎক্ষণিক করণীয় ব্যবস্থা\n\n**${crop}** ফসল সুরক্ষায় প্রস্তাবিত ব্যবস্থা:\n- **সেচ**: পাতায় জল ছেটানো বন্ধ রাখুন।\n- **পরিচ্ছন্নতা**: আক্রান্ত নিচের পাতাগুলো ছাঁটাই করে নষ্ট করুন।\n- **জৈব প্রতিকার**: ট্রাইকোডার্মা বা নিম তেলের স্প্রে ব্যবহার করুন।`,
          actions: [immediateAction || 'আক্রান্ত গাছ আলাদা করুন এবং আলো-বাতাস চলাচলের ব্যবস্থা করুন।'],
        };
      }
      return {
        text: `### উদ্ভিদ স্বাস্থ্য পরামর্শ\n\n**${crop}** ফসলে **${condition}** সম্পর্কিত: ${immediateAction || cause || 'পরবর্তী ৪৮ ঘণ্টা লক্ষণগুলি পর্যবেক্ষণ করুন।'}`
      };
    }
    case 'pa': {
      if (q.includes('ਕਿਉਂ') || q.includes('ਕਾਰਨ') || q.includes('why')) {
        return {
          text: `### ਰੋਗ ਨਿਦਾਨ ਅਤੇ ਕਾਰਨ\n\n**${crop}** ਦੀ ਫ਼ਸਲ ਵਿੱਚ **${condition}** ਮੁੱਖ ਤੌਰ 'ਤੇ ਹਵਾ ਵਿੱਚ ਜ਼ਿਆਦਾ ਨਮੀ (80% ਤੋਂ ਵੱਧ) ਅਤੇ ਪੱਤਿਆਂ 'ਤੇ ਲੰਬਾ ਸਮਾਂ ਪਾਣੀ ਰਹਿਣ ਕਾਰਨ ਹੁੰਦਾ ਹੈ।`,
          inferred: [cause || 'ਵੱਧ ਨਮੀ ਕਾਰਨ ਬਿਮਾਰੀ ਫੈਲੀ।'],
        };
      }
      if (q.includes('ਕੀ ਕਰੀਏ') || q.includes('ਹੱਲ') || q.includes('what should i do')) {
        return {
          text: `### ਤੁਰੰਤ ਖੇਤ ਪ੍ਰਬੰਧਨ ਕਦਮ\n\n**${crop}** ਦੀ ਸੁਰੱਖਿਆ ਲਈ ਸਿਫ਼ਾਰਸ਼ਾਂ:\n- **ਸਿੰਚਾਈ**: ਪੱਤਿਆਂ 'ਤੇ ਪਾਣੀ ਪੈਣ ਤੋਂ ਰੋਕੋ।\n- **ਸਫ਼ਾਈ**: ਖ਼ਰਾਬ ਪੱਤਿਆਂ ਨੂੰ ਤੋੜ ਕੇ ਨਸ਼ਟ ਕਰੋ।\n- **ਜੈਵਿਕ ਛਿੜਕਾਅ**: ਟ੍ਰਾਈਕੋਡਰਮਾ ਜਾਂ ਨਿੰਮ ਦੇ ਤੇਲ ਦਾ ਛਿੜਕਾਅ ਕਰੋ।`,
          actions: [immediateAction || 'ਪ੍ਰਭਾਵਿਤ ਬੂਟਿਆਂ ਦੀ ਦੇਖਭਾਲ ਕਰੋ ਅਤੇ ਹਵਾ ਦਾ ਵਹਾਅ ਵਧਾਓ।'],
        };
      }
      return {
        text: `### ਫ਼ਸਲ ਸੁਰੱਖਿਆ ਸਲਾਹ\n\n**${crop}** ਵਿੱਚ **${condition}** ਬਾਰੇ: ${immediateAction || cause || 'ਅਗਲੇ 48 ਘੰਟਿਆਂ ਲਈ ਲੱਛਣਾਂ ਦੀ ਨਿਗਰਾਨੀ ਕਰੋ।'}`
      };
    }
    case 'or': {
      return {
        text: `### ଫସଲ ସ୍ୱାସ୍ଥ୍ୟ ପରାମର୍ଶ\n\n**${crop}** ଫସଲରେ **${condition}** ବିଷୟରେ: ${immediateAction || cause || 'ଆଗାମୀ ୪୮ ଘଣ୍ଟା ପର୍ଯ୍ୟନ୍ତ ଲକ୍ଷଣ ଉପରେ ନଜର ରଖନ୍ତୁ ଏବଂ ସନ୍ତୁଳିତ ପୋଷଣ ପ୍ରଦାନ କରନ୍ତୁ।'}`
      };
    }
    case 'as': {
      return {
        text: `### শস্য স্বাস্থ্য পৰামৰ্শ\n\n**${crop}** খেতিত **${condition}** সম্পৰ্কে: ${immediateAction || cause || 'অহা ৪৮ ঘণ্টা লক্ষণসমূহ নিৰীক্ষণ কৰক আৰু সুষম পুষ্টি যোগান ধৰক।'}`
      };
    }
    case 'ur': {
      return {
        text: `### پودوں کے علاج کا مشورہ\n\n**${crop}** میں **${condition}** کے متعلق: ${immediateAction || cause || 'براہ کرم اگلے 48 گھنٹوں تک علامات کا مشاہدہ کریں اور مناسب دیکھ بھال کریں۔'}`
      };
    }
    case 'pt': {
      if (q.includes('por que') || q.includes('causa') || q.includes('why')) {
        return {
          text: `### Diagnóstico e Causas\n\n**${condition}** em **${crop}** é provocado principalmente por alta umidade relativa (>80%), molhamento foliar prolongado e baixa circulação de ar.`,
          inferred: [cause || 'Microclima úmido favoreceu a penetração do patógeno.'],
        };
      }
      if (q.includes('fazer') || q.includes('ação') || q.includes('what should i do')) {
        return {
          text: `### Ações Imediatas de Campo\n\nRecomendações para **${crop}**:\n- **Irrigação**: Evite irrigação por aspersão nas folhas.\n- **Sanidade**: Poda e eliminação de folhas necróticas inferiores.\n- **Tratamento Biológico**: Aplicação de *Trichoderma* ou óleo de Neem.`,
          actions: [immediateAction || 'Isole as plantas afetadas e melhore o arejamento.'],
        };
      }
      return {
        text: `### Avaliação Fitossanitária\n\nSobre **${condition}** em **${crop}**: ${immediateAction || cause || 'Monitore a evolução dos sintomas nas próximas 48 horas.'}`
      };
    }
    case 'es': {
      if (q.includes('por qué') || q.includes('causa') || q.includes('why')) {
        return {
          text: `### Diagnóstico y Causas\n\n**${condition}** en **${crop}** se produce principalmente por alta humedad relativa (>80%), follaje mojado por tiempo prolongado y poca ventilación.`,
          inferred: [cause || 'La humedad ambiental favoreció el desarrollo del patógeno.'],
        };
      }
      if (q.includes('hacer') || q.includes('acción') || q.includes('what should i do')) {
        return {
          text: `### Medidas Inmediatas en Campo\n\nAcciones recomendadas para **${crop}**:\n- **Riego**: Suspenda el riego por aspersión sobre las hojas.\n- **Sanidad**: Pode y retire las hojas inferiores enfermas.\n- **Control Biológico**: Aplique *Trichoderma* o aceite de Neem.`,
          actions: [immediateAction || 'Aísle las plantas afectadas y mejore la ventilación.'],
        };
      }
      return {
        text: `### Evaluación Fitosanitaria\n\nRespecto a **${condition}** en **${crop}**: ${immediateAction || cause || 'Monitoree los síntomas durante las próximas 48 horas.'}`
      };
    }
    case 'fr': {
      return {
        text: `### Évaluation Phytosanitaire\n\nConcernant **${condition}** sur **${crop}** : ${immediateAction || cause || 'Veuillez surveiller l\'évolution des symptômes au cours des prochaines 48 heures.'}`
      };
    }
    case 'ar': {
      return {
        text: `### تشخيص وقاية النبات\n\nبخصوص **${condition}** في محصول **${crop}**: ${immediateAction || cause || 'يرجى مراقبة تطور الأعراض خلال الساعات الـ 48 القادمة.'}`
      };
    }
    case 'ru': {
      return {
        text: `### Фитосанитарная оценка\n\nОтносительно **${condition}** на культуре **${crop}**: ${immediateAction || cause || 'Пожалуйста, наблюдайте за динамикой симптомов в течение следующих 48 часов.'}`
      };
    }
    case 'zh': {
      return {
        text: `### 植物健康评估\n\n关于 **${crop}** 上的 **${condition}**：${immediateAction || cause || '请在接下来的 48 小时内密切观察症状变化并保持均衡营养。'}`
      };
    }
    default: {
      if (q.includes('why') || q.includes('cause') || q.includes('happen')) {
        return {
          text: `### Diagnosis & Underlying Causes\n\n**${condition}** in **${crop}** is primarily triggered by high relative humidity (above 80%), prolonged leaf wetness from dew or precipitation, and dense canopy cover that restricts airflow.`,
          inferred: [cause || 'Microclimatic humidity and canopy moisture favored pathogen penetration.'],
        };
      }
      if (q.includes('what should i do') || q.includes('now') || q.includes('first')) {
        return {
          text: `### Immediate Field Actions\n\nRecommended management steps for **${crop}**:\n- **Irrigation**: Withhold overhead sprinkler irrigation to keep foliage dry.\n- **Sanitation**: Prune and safely destroy severely necrotic lower leaves.\n- **Biological Treatment**: Apply *Trichoderma viride* or Neem oil solution (10,000 ppm).`,
          actions: [immediateAction || 'Isolate affected plants and improve airflow.'],
        };
      }
      if (q.includes('spread') || q.includes('contagion')) {
        return {
          text: `### Contagion & Spread Risk\n\n**Yes**, spores can spread rapidly to neighboring plants via rain splashes and wind currents. Discard infected debris outside the field and avoid working when foliage is wet.`,
        };
      }
      return {
        text: `### Botanical Assessment\n\nRegarding **${condition}** on **${crop}**: ${immediateAction || cause || 'Please monitor symptom progression over the next 48 hours and maintain balanced crop nutrition.'}`,
      };
    }
  }
}

/**
 * Returns localized consultation session title
 */
export function getLocalizedConsultationTitle(cropName: string, lang: Language): string {
  const norm = normalizeLang(lang);
  switch (norm) {
    case 'te': return `${cropName} సలహా సంప్రదింపులు`;
    case 'hi': return `${cropName} परामर्श`;
    case 'ta': return `${cropName} ஆலோசனை`;
    case 'kn': return `${cropName} ಸಮಾಲೋಚನೆ`;
    case 'ml': return `${cropName} കൺಸൾട്ടേഷൻ`;
    case 'mr': return `${cropName} सल्ला मसलत`;
    case 'gu': return `${cropName} પરામર્શ`;
    case 'bn': return `${cropName} পরামর্শ`;
    case 'pa': return `${cropName} ਸਲਾਹ-ਮਸ਼ਵਰਾ`;
    case 'or': return `${cropName} ପରାମର୍ଶ`;
    case 'as': return `${cropName} পৰামৰ্শ`;
    case 'ur': return `${cropName} مشاورت`;
    case 'ar': return `استشارة ${cropName}`;
    case 'es': return `Consulta de ${cropName}`;
    case 'fr': return `Consultation de ${cropName}`;
    case 'pt': return `Consulta de ${cropName}`;
    case 'ru': return `Консультация по ${cropName}`;
    case 'zh': return `${cropName} 诊断咨询`;
    default: return `${cropName} Consultation`;
  }
}

/**
 * Returns localized default observed point when no visual evidence array is provided
 */
export function getLocalizedDefaultObservedPoint(lang: Language): string {
  const norm = normalizeLang(lang);
  switch (norm) {
    case 'te': return 'నమూనా ఆకుపై కనిపించే లక్షణాలు నమోదు చేయబడ్డాయి.';
    case 'hi': return 'पत्ती के नमूने पर दृश्य लक्षण दर्ज किए गए हैं।';
    case 'ta': return 'இலை மாதிரியில் காணக்கூடிய அறிகுறிகள் பதிவு செய்யப்பட்டுள்ளன.';
    case 'kn': return 'ಎಲೆಯ ಮಾದರಿಯಲ್ಲಿ ಗೋಚರಿಸುವ ಲಕ್ಷಣಗಳನ್ನು ದಾಖಲಿಸಲಾಗಿದೆ.';
    case 'ml': return 'ഇലയിലെ ദൃശ്യ ലക്ഷണങ്ങൾ രേഖപ്പെടുത്തി.';
    case 'mr': return 'पानावरील दृश्य लक्षणे नोंदवण्यात आली आहेत.';
    case 'gu': return 'પાંદડાના નમૂના પર દ્રશ્ય લક્ષણો નોંધાયેલા છે.';
    case 'bn': return 'পাতার নমুনায় দৃশ্যমান লক্ষণ রেকর্ড করা হয়েছে।';
    case 'pa': return 'ਪੱਤੇ ਦੇ ਨਮੂਨੇ ਉੱਤੇ ਦਿਸਣ ਵਾਲੇ ਲੱਛਣ ਦਰਜ ਕੀਤੇ ਗਏ ਹਨ।';
    default: return 'Visible foliar symptoms detected on specimen.';
  }
}

/**
 * Returns localized default inferred point
 */
export function getLocalizedDefaultInferredPoint(lang: Language): string {
  const norm = normalizeLang(lang);
  switch (norm) {
    case 'te': return 'వాతావరణ తేమ మరియు ఉష్ణోగ్రత వ్యాధి తీవ్రతకు దోహదం చేసి ఉండవచ్చు.';
    case 'hi': return 'सूक्ष्म जलवायु में नमी और तापमान ने रोग के विकास को बढ़ावा दिया हो सकता है।';
    case 'ta': return 'அதிக ஈரப்பதம் மற்றும் வெப்பநிலை நோயின் வளர்ச்சியை துரிதப்படுத்தியிருக்கலாம்.';
    case 'kn': return 'ವಾತಾವರಣದ ತೇವಾಂಶ ಮತ್ತು ತಾಪಮಾನವು ರೋಗದ ಬೆಳವಣಿಗೆಗೆ ಕಾರಣವಾಗಿರಬಹುದು.';
    case 'ml': return 'അന്തരീക്ഷ ഈർപ്പവും താപനിലയും രോഗവളർച്ചയെ ത്വരിതപ്പെടുത്തിയിരിക്കാം.';
    case 'mr': return 'हवेतील आर्द्रता आणि तापमानामुळे रोगाचा प्रादुर्भाव वाढला असण्याची शक्यता आहे.';
    case 'gu': return 'વાતાવરણમાં ભેજ અને તાપમાને રોગના વિકાસમાં વધારો કર્યો હોઈ શકે છે.';
    case 'bn': return 'আবহাওয়ার আর্দ্রতা ও তাপমাত্রা রোগের বিস্তার ঘটাতে পারে।';
    case 'pa': return 'ਹਵਾ ਵਿੱਚ ਨਮੀ ਅਤੇ ਤਾਪਮਾਨ ਨੇ ਬਿਮਾਰੀ ਦੇ ਫੈਲਾਅ ਨੂੰ ਤੇਜ਼ ਕੀਤਾ ਹੋ ਸਕਦਾ ਹੈ।';
    default: return 'Microclimatic moisture and temperature likely accelerated development.';
  }
}

/**
 * Returns localized default unknown point
 */
export function getLocalizedDefaultUnknownPoint(lang: Language): string {
  const norm = normalizeLang(lang);
  switch (norm) {
    case 'te': return 'ఖచ్చితమైన సూక్ష్మజీవి జాతి నిర్ధారణకు లేబొರೇటరీ కల్చర్ లేదా పిసిఆర్ పరీక్ష అవసరం.';
    case 'hi': return 'सटीक सूक्ष्मजीव प्रजाति पुष्टि के लिए प्रयोगशाला संवर्धन या पीसीआर जांच आवश्यक है।';
    case 'ta': return 'துல்லியமான நுண்ணுயிரி வகையை உறுதிப்படுத்த ஆய்வக பரிசோதனை தேவை.';
    case 'kn': return 'ನಿಖರವಾದ ಸೂಕ್ಷ್ಮಜೀವಿ ಪ್ರಭೇದ ದೃಢೀಕರಣಕ್ಕೆ ಪ್ರಯೋಗಾಲಯ ಪರೀಕ್ಷೆ ಅಗತ್ಯವಿದೆ.';
    case 'ml': return 'കൃത്യമായ രോഗാണു നിർണയത്തിന് ലബോറട്ടറി പരിശോധന ആവശ്യമാണ്.';
    case 'mr': return 'अचूक रोगकारक प्रजाती निश्चित करण्यासाठी प्रयोगशाळा चाचणी आवश्यक आहे.';
    case 'gu': return 'ચોક્કસ જીવાણુ ઓળખ માટે લેબોરેટરી કલ્ચર અથવા પીસીઆર પરીક્ષણ જરૂરી છે.';
    case 'bn': return 'সঠিক জীবাণু প্রজাতি শনাক্ত করতে ল্যাবরেটরি পরীক্ষা প্রয়োজন।';
    case 'pa': return 'ਸਹੀ ਜੀਵਾਣੂ ਦੀ ਪਛਾਣ ਲਈ ਲੈਬ ਟੈਸਟ ਦੀ ਲੋੜ ਹੈ।';
    default: return 'Exact microbial strain requires laboratory agar culture or PCR assay.';
  }
}

/**
 * Returns localized default suggested action
 */
export function getLocalizedDefaultSuggestedAction(lang: Language): string {
  const norm = normalizeLang(lang);
  switch (norm) {
    case 'te': return 'బాగా దెబ్బతిన్న ఆకులను వేరుచేసి పైనుంచి నీరు చల్లడాన్ని నివారించండి.';
    case 'hi': return 'संक्रमित पत्तियों को अलग करें और ऊपर से पानी के छिड़काव से बचें।';
    case 'ta': return 'பாதிக்கப்பட்ட இலைகளை அகற்றி மேலே தெளிப்பு நீர் பாய்ச்சுவதை தவிர்க்கவும்.';
    case 'kn': return 'ತೀವ್ರವಾಗಿ ಬಾಧಿತ ಎಲೆಗಳನ್ನು ಪ್ರತ್ಯೇಕಿಸಿ ಮತ್ತು ಮೇಲಿನಿಂದ ನೀರು ಚಿಮುಕಿಸುವುದನ್ನು ತಪ್ಪಿಸಿ.';
    case 'ml': return 'രോഗം ബാധിച്ച ഇലകൾ മുറിച്ചുമാറ്റി മുകളിലൂടെ വെള്ളമൊഴിക്കുന്നത് ഒഴിവാക്കുക.';
    case 'mr': return 'रोगट पाने काढून टाका आणि वरून पाणी देणे टाळा.';
    case 'gu': return 'અસરગ્રસ્ત પાંદડા અલગ કરો અને ઉપરથી પાણી છાંટવાનું ટાળો.';
    case 'bn': return 'আক্রান্ত পাতা আলাদা করুন এবং ওপর থেকে জল দেওয়া বন্ধ রাখুন।';
    case 'pa': return 'ਖ਼ਰਾਬ ਪੱਤਿਆਂ ਨੂੰ ਤੋੜੋ ਅਤੇ ਉੱਪਰੋਂ ਪਾਣੀ ਪਾਉਣ ਤੋਂ ਬਚੋ।';
    default: return 'Isolate heavily infected foliage and avoid overhead wetting.';
  }
}

