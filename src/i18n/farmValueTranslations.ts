import { Language } from '../types';

export function normalizeLang(lang?: Language | string): string {
  if (!lang) return 'en';
  if (lang === 'hi-IN') return 'hi';
  if (lang === 'te-IN') return 'te';
  if (lang === 'ta-IN') return 'ta';
  if (lang === 'kn-IN') return 'kn';
  if (lang === 'ml-IN') return 'ml';
  if (lang === 'mr-IN') return 'mr';
  if (lang === 'gu-IN') return 'gu';
  if (lang === 'bn-IN') return 'bn';
  if (lang === 'pa-IN') return 'pa';
  if (lang === 'or-IN') return 'or';
  if (lang === 'as-IN') return 'as';
  if (lang === 'ur-IN') return 'ur';
  if (typeof lang === 'string' && lang.includes('-')) return lang.split('-')[0];
  return lang as string;
}

export const STATE_NAMES: Record<string, Record<string, string>> = {
  te: {
    'Telangana': 'తెలంగాణ',
    'Andhra Pradesh': 'ఆంధ్రప్రదేశ్',
    'Maharashtra': 'మహారాష్ట్ర',
    'Karnataka': 'కర్ణాటక',
    'Tamil Nadu': 'తమిళనాడు',
    'Kerala': 'కేరళ',
    'Punjab': 'పంజాబ్',
    'Haryana': 'హర్యానా',
    'Uttar Pradesh': 'ఉత్తరప్రదేశ్',
    'Madhya Pradesh': 'మధ్యప్రదేశ్',
    'Gujarat': 'గుజరాత్',
    'Rajasthan': 'రాజస్థాన్',
    'West Bengal': 'పశ్చిమ బెంగాల్',
    'Bihar': 'బీహార్',
    'Odisha': 'ఒడిశా',
    'Assam': 'అస్సాం',
    'Jharkhand': 'జార్ఖండ్',
    'Chhattisgarh': 'ఛత్తీస్‌గఢ్',
    'Himachal Pradesh': 'హిమాచల్ ప్రదేశ్',
    'Uttarakhand': 'ఉత్తరాఖండ్',
    'Goa': 'గోవా',
    'Tripura': 'త్రిపుర',
    'Meghalaya': 'మేఘాలయ',
    'Manipur': 'మణిపూర్',
    'Nagaland': 'నాగాలాండ్',
    'Mizoram': 'మిజోరం',
    'Sikkim': 'సిక్కిం',
    'Arunachal Pradesh': 'అరుణాచల్ ప్రదేశ్',
    'Delhi': 'ఢిల్లీ',
    'Jammu and Kashmir': 'జమ్మూ కాశ్మీర్',
    'Ladakh': 'లడఖ్',
    'Puducherry': 'పుదుచ్చేరి',
    'Chandigarh': 'చండీగఢ్',
    'Andaman and Nicobar Islands': 'అండమాన్ మరియు నికోబార్ దీవులు',
    'Dadra and Nagar Haveli and Daman and Diu': 'దాద్రా నగర్ హవేలీ మరియు డామన్ దియూ',
    'Lakshadweep': 'లక్షద్వీప్',
  },
  hi: {
    'Telangana': 'तेलंगाना',
    'Andhra Pradesh': 'आंध्र प्रदेश',
    'Maharashtra': 'महाराष्ट्र',
    'Karnataka': 'कर्नाटक',
    'Tamil Nadu': 'तमिलनाडु',
    'Kerala': 'केरल',
    'Punjab': 'पंजाब',
    'Haryana': 'हरियाणा',
    'Uttar Pradesh': 'उत्तर प्रदेश',
    'Madhya Pradesh': 'मध्य प्रदेश',
    'Gujarat': 'गुजरात',
    'Rajasthan': 'राजस्थान',
    'West Bengal': 'पश्चिम बंगाल',
    'Bihar': 'बिहार',
    'Odisha': 'ओडिशा',
    'Assam': 'असम',
    'Jharkhand': 'झारखंड',
    'Chhattisgarh': 'छत्तीसगढ़',
    'Himachal Pradesh': 'हिमाचल प्रदेश',
    'Uttarakhand': 'उत्तराखंड',
    'Goa': 'गोवा',
    'Tripura': 'त्रिपुरा',
    'Meghalaya': 'मेघालय',
    'Manipur': 'मणिपुर',
    'Nagaland': 'नागालैंड',
    'Mizoram': 'मिजोरम',
    'Sikkim': 'सिक्किम',
    'Arunachal Pradesh': 'अरुणाचल प्रदेश',
    'Delhi': 'दिल्ली',
    'Jammu and Kashmir': 'जम्मू और कश्मीर',
    'Ladakh': 'लद्दाख',
    'Puducherry': 'पुदुचेरी',
    'Chandigarh': 'चंडीगढ़',
    'Andaman and Nicobar Islands': 'अंडमान और निकोबार द्वीप समूह',
    'Dadra and Nagar Haveli and Daman and Diu': 'दादरा और नगर हवेली और दमन और दीव',
    'Lakshadweep': 'लक्षद्वीप',
  },
  ta: {
    'Telangana': 'தெலங்கானா',
    'Andhra Pradesh': 'ஆந்திரப் பிரதேசம்',
    'Maharashtra': 'மகாராஷ்டிரா',
    'Karnataka': 'கர்நாடகா',
    'Tamil Nadu': 'தமிழ்நாடு',
    'Kerala': 'கேரளா',
    'Punjab': 'பஞ்சாப்',
    'Haryana': 'ஹரியானா',
    'Uttar Pradesh': 'உத்தரப் பிரதேசம்',
    'Madhya Pradesh': 'மத்தியப் பிரதேசம்',
    'Gujarat': 'குஜராத்',
    'Rajasthan': 'ராஜஸ்தான்',
    'West Bengal': 'மேற்கு வங்காளம்',
    'Bihar': 'பீகார்',
    'Odisha': 'ஒடிசா',
    'Assam': 'அசாம்',
    'Jharkhand': 'ஜார்க்கண்ட்',
    'Chhattisgarh': 'சத்தீஸ்கர்',
    'Himachal Pradesh': 'இமாச்சலப் பிரதேசம்',
    'Uttarakhand': 'உத்தராகண்ட்',
    'Goa': 'கோவா',
    'Tripura': 'திரிபுரா',
    'Meghalaya': 'மேகலாயா',
    'Manipur': 'மணிப்பூர்',
    'Nagaland': 'நாகாலாந்து',
    'Mizoram': 'மிசோரம்',
    'Sikkim': 'சிக்கிம்',
    'Arunachal Pradesh': 'அருணாச்சலப் பிரதேசம்',
    'Delhi': 'டெல்லி',
    'Jammu and Kashmir': 'ஜம்மு காஷ்மீர்',
    'Ladakh': 'லடாக்',
    'Puducherry': 'புதுச்சேரி',
    'Chandigarh': 'சண்டிகர்',
    'Andaman and Nicobar Islands': 'அந்தமான் நிகோபார் தீவுகள்',
    'Dadra and Nagar Haveli and Daman and Diu': 'தாத்ரா நகர் ஹவேலி டாமன் டையூ',
    'Lakshadweep': 'லட்சத்தீவு',
  },
  kn: {
    'Telangana': 'ತೆಲಂಗಾಣ',
    'Andhra Pradesh': 'ಆಂಧ್ರಪ್ರದೇಶ',
    'Maharashtra': 'ಮಹಾರಾಷ್ಟ್ರ',
    'Karnataka': 'ಕರ್ನಾಟಕ',
    'Tamil Nadu': 'ತಮಿಳುನಾಡು',
    'Kerala': 'ಕೇರಳ',
    'Punjab': 'ಪಂಜಾಬ್',
    'Haryana': 'ಹರಿಯಾಣ',
    'Uttar Pradesh': 'ಉತ್ತರ ಪ್ರದೇಶ',
    'Madhya Pradesh': 'ಮಧ್ಯಪ್ರದೇಶ',
    'Gujarat': 'ಗುಜರಾತ್',
    'Rajasthan': 'ರಾಜಸ್ಥಾನ',
    'West Bengal': 'ಪಶ್ಚಿಮ ಬಂಗಾಳ',
    'Bihar': 'ಬಿಹಾರ',
    'Odisha': 'ಒಡಿಶಾ',
    'Assam': 'ಅಸ್ಸಾಂ',
    'Jharkhand': 'ಜಾರ್ಖಂಡ್',
    'Chhattisgarh': 'ಛತ್ತೀಸ್‌ಗಢ',
    'Himachal Pradesh': 'ಹಿಮಾಚಲ ಪ್ರದೇಶ',
    'Uttarakhand': 'ಉತ್ತರಾಖಂಡ',
    'Goa': 'ಗೋವಾ',
    'Tripura': 'ತ್ರಿಪುರ',
    'Meghalaya': 'ಮೇಘಾಲಯ',
    'Manipur': 'ಮಣಿಪುರ',
    'Nagaland': 'ನಾಗಾಲ್ಯಾಂಡ್',
    'Mizoram': 'ಮಿಜೋರಾಂ',
    'Sikkim': 'ಸಿಕ್ಕಿಂ',
    'Arunachal Pradesh': 'ಅರುಣಾಚಲ ಪ್ರದೇಶ',
    'Delhi': 'ದೆಹಲಿ',
    'Jammu and Kashmir': 'ಜಮ್ಮು ಮತ್ತು ಕಾಶ್ಮೀರ',
    'Ladakh': 'ಲಡಾಖ್',
    'Puducherry': 'ಪುದುಚೇರಿ',
    'Chandigarh': 'ಚಂಡೀಗಢ',
    'Andaman and Nicobar Islands': 'ಅಂಡಮಾನ್ ಮತ್ತು ನಿಕೋಬಾರ್ ದ್ವೀಪಗಳು',
    'Dadra and Nagar Haveli and Daman and Diu': 'ದಾದ್ರಾ ಮತ್ತು ನಗರ ಹವೇಲಿ ಮತ್ತು ದಮನ್ ಮತ್ತು ದೀವ್',
    'Lakshadweep': 'ಲಕ್ಷದ್ವೀಪ',
  },
  ml: {
    'Telangana': 'തെലങ്കാന',
    'Andhra Pradesh': 'ആന്ധ്രാപ്രദേശ്',
    'Maharashtra': 'മഹാരാഷ്ട്ര',
    'Karnataka': 'കർണാടക',
    'Tamil Nadu': 'തമിഴ്നാട്',
    'Kerala': 'കേരളം',
    'Punjab': 'പഞ്ചാബ്',
    'Haryana': 'ഹരിയാന',
    'Uttar Pradesh': 'ഉത്തർപ്രദേശ്',
    'Madhya Pradesh': 'മധ്യപ്രദേശ്',
    'Gujarat': 'ഗുജറാത്ത്',
    'Rajasthan': 'രാജസ്ഥാൻ',
    'West Bengal': 'പശ്ചിമ ബംഗാൾ',
    'Bihar': 'ബീഹാർ',
    'Odisha': 'ഒഡീഷ',
    'Assam': 'അസം',
    'Jharkhand': 'ജാർഖണ്ഡ്',
    'Chhattisgarh': 'ഛത്തീസ്ഗഡ്',
    'Himachal Pradesh': 'ഹിമാചൽ പ്രദേശ്',
    'Uttarakhand': 'ഉത്തരാഖണ്ഡ്',
    'Goa': 'ഗോവ',
    'Delhi': 'ഡൽഹി',
    'Jammu and Kashmir': 'ജമ്മു കാശ്മീർ',
    'Ladakh': 'ലഡാക്ക്',
    'Puducherry': 'പുതുച്ചേരി',
  },
  mr: {
    'Telangana': 'तेलंगणा',
    'Andhra Pradesh': 'आंध्र प्रदेश',
    'Maharashtra': 'महाराष्ट्र',
    'Karnataka': 'कर्नाटक',
    'Tamil Nadu': 'तमिळनाडू',
    'Kerala': 'केरळ',
    'Punjab': 'पंजाब',
    'Haryana': 'हरियाणा',
    'Uttar Pradesh': 'उत्तर प्रदेश',
    'Madhya Pradesh': 'मध्य प्रदेश',
    'Gujarat': 'गुजरात',
    'Rajasthan': 'राजस्थान',
    'West Bengal': 'पश्चिम बंगाल',
    'Bihar': 'बिहार',
    'Odisha': 'ओडिशा',
    'Assam': 'आसाम',
    'Jharkhand': 'झारखंड',
    'Chhattisgarh': 'छत्तीसगढ',
    'Himachal Pradesh': 'हिमाचल प्रदेश',
    'Uttarakhand': 'उत्तराखंड',
    'Goa': 'गोवा',
    'Delhi': 'दिल्ली',
    'Jammu and Kashmir': 'जम्मू आणि काश्मीर',
    'Ladakh': 'लडाख',
    'Puducherry': 'पुडुचेरी',
  },
  gu: {
    'Telangana': 'તેલંગાણા',
    'Andhra Pradesh': 'આંધ્ર પ્રદેશ',
    'Maharashtra': 'મહારાષ્ટ્ર',
    'Karnataka': 'કર્ણાટક',
    'Tamil Nadu': 'તમિલનાડુ',
    'Kerala': 'કેરળ',
    'Punjab': 'પંજાબ',
    'Haryana': 'હરિયાણા',
    'Uttar Pradesh': 'ઉત્તર પ્રદેશ',
    'Madhya Pradesh': 'મધ્ય પ્રદેશ',
    'Gujarat': 'ગુજરાત',
    'Rajasthan': 'રાજસ્થાન',
    'West Bengal': 'પશ્ચિમ બંગાળ',
    'Bihar': 'બિહાર',
    'Odisha': 'ઓડિશા',
    'Assam': 'અસમ',
    'Delhi': 'દિલ્હી',
    'Jammu and Kashmir': 'જમ્મુ અને કાશ્મીર',
  },
  bn: {
    'Telangana': 'তেলেঙ্গানা',
    'Andhra Pradesh': 'অন্ধ্রপ্রদেশ',
    'Maharashtra': 'মহারাষ্ট্র',
    'Karnataka': 'কর্ণাটক',
    'Tamil Nadu': 'তামিলনাড়ু',
    'Kerala': 'কেরালা',
    'Punjab': 'পাঞ্জাব',
    'Haryana': 'হরিয়ানা',
    'Uttar Pradesh': 'উত্তর প্রদেশ',
    'Madhya Pradesh': 'মধ্য প্রদেশ',
    'Gujarat': 'গুজরাট',
    'Rajasthan': 'রাজস্থান',
    'West Bengal': 'পশ্চিমবঙ্গ',
    'Bihar': 'বিহার',
    'Odisha': 'ওড়িশা',
    'Assam': 'অসম',
    'Jharkhand': 'ঝাড়খণ্ড',
    'Chhattisgarh': 'ছত্তিশগড়',
    'Delhi': 'দিল্লি',
  },
  pa: {
    'Telangana': 'ਤੇਲੰਗਾਨਾ',
    'Andhra Pradesh': 'ਆਂਧਰਾ ਪ੍ਰਦੇਸ਼',
    'Maharashtra': 'ਮਹਾਰਾਸ਼ਟਰ',
    'Karnataka': 'ਕਰਨਾਟਕ',
    'Tamil Nadu': 'ਤਾਮਿਲਨਾਡੂ',
    'Kerala': 'ਕੇਰਲ',
    'Punjab': 'ਪੰਜਾਬ',
    'Haryana': 'ਹਰਿਆਣਾ',
    'Uttar Pradesh': 'ਉੱਤਰ ਪ੍ਰਦੇਸ਼',
    'Madhya Pradesh': 'ਮੱਧ ਪ੍ਰਦੇਸ਼',
    'Gujarat': 'ਗੁਜਰਾਤ',
    'Rajasthan': 'ਰਾਜਸਥਾਨ',
    'West Bengal': 'ਪੱਛਮੀ ਬੰਗਾਲ',
    'Bihar': 'ਬਿਹਾਰ',
    'Delhi': 'ਦਿੱਲੀ',
    'Jammu and Kashmir': 'ਜੰਮੂ ਅਤੇ ਕਸ਼ਮੀਰ',
  },
  or: {
    'Telangana': 'ତେଲେଙ୍ଗାନା',
    'Andhra Pradesh': 'ଆନ୍ଧ୍ରପ୍ରଦେଶ',
    'Maharashtra': 'ମହାରାଷ୍ଟ୍ର',
    'Karnataka': 'କର୍ଣ୍ଣାଟକ',
    'Tamil Nadu': 'ତାମିଲନାଡୁ',
    'Kerala': 'କେରଳ',
    'Punjab': 'ପଞ୍ଜାବ',
    'Haryana': 'ହରିୟାଣା',
    'Uttar Pradesh': 'ଉତ୍ତର ପ୍ରଦେଶ',
    'Madhya Pradesh': 'ମଧ୍ୟ ପ୍ରଦେଶ',
    'Gujarat': 'ଗୁଜରାଟ',
    'Rajasthan': 'ରାଜସ୍ଥାନ',
    'West Bengal': 'ପଶ୍ଚିମ ବଙ୍ଗ',
    'Bihar': 'ବିହାର',
    'Odisha': 'ଓଡ଼ିଶା',
    'Assam': 'ଆସାମ',
    'Delhi': 'ଦିଲ୍ଲୀ',
  },
  as: {
    'Telangana': 'তেলেংগানা',
    'Andhra Pradesh': 'অন্ধ্ৰ প্ৰদেশ',
    'Maharashtra': 'মহাৰাষ্ট্ৰ',
    'Karnataka': 'কৰ্ণাটক',
    'Tamil Nadu': 'তামিলনাডু',
    'Kerala': 'কেৰেলা',
    'Punjab': 'পাঞ্জাব',
    'Haryana': 'হাৰিয়ানা',
    'Uttar Pradesh': 'উত্তৰ প্ৰদেশ',
    'Madhya Pradesh': 'মধ্য প্ৰদেশ',
    'Gujarat': 'গুজৰাট',
    'Rajasthan': 'ৰাজস্থান',
    'West Bengal': 'পশ্চিম বংগ',
    'Bihar': 'বিহাৰ',
    'Odisha': 'ওড়িশা',
    'Assam': 'অসম',
    'Delhi': 'দিল্লী',
  },
  ur: {
    'Telangana': 'تلنگانہ',
    'Andhra Pradesh': 'آندھرا پردیش',
    'Maharashtra': 'مہاراشٹرا',
    'Karnataka': 'کرناٹک',
    'Tamil Nadu': 'تامل ناڈو',
    'Kerala': 'کیرالہ',
    'Punjab': 'پنجاب',
    'Haryana': 'ہریانہ',
    'Uttar Pradesh': 'اتر پردیش',
    'Madhya Pradesh': 'مدھیہ پردیش',
    'Gujarat': 'گجرات',
    'Rajasthan': 'راجستھان',
    'West Bengal': 'مغربی بنگال',
    'Bihar': 'بہار',
    'Delhi': 'دہلی',
    'Jammu and Kashmir': 'جموں و کشمیر',
  },
  ar: {
    'Telangana': 'تيلانجانا',
    'Andhra Pradesh': 'أندرا براديش',
    'Maharashtra': 'ماهاراشترا',
    'Karnataka': 'كارناتاكا',
    'Tamil Nadu': 'تاميل نادو',
    'Kerala': 'كيرالا',
    'Punjab': 'البنجاب',
    'Haryana': 'هاريانا',
    'Uttar Pradesh': 'أوتار براديش',
    'Madhya Pradesh': 'ماديا براديش',
    'Gujarat': 'غوجارات',
    'Rajasthan': 'راجستان',
    'West Bengal': 'البنغال الغربية',
    'Bihar': 'بيهار',
    'Delhi': 'دلهي',
  },
  es: {
    'Telangana': 'Telangana',
    'Andhra Pradesh': 'Andhra Pradesh',
    'Maharashtra': 'Maharashtra',
    'Karnataka': 'Karnataka',
    'Tamil Nadu': 'Tamil Nadu',
    'Kerala': 'Kerala',
    'Punjab': 'Punyab',
    'Haryana': 'Haryana',
    'Uttar Pradesh': 'Uttar Pradesh',
    'Madhya Pradesh': 'Madhya Pradesh',
    'Gujarat': 'Guyarat',
    'Rajasthan': 'Rajastán',
    'West Bengal': 'Bengala Occidental',
    'Bihar': 'Bihar',
    'Delhi': 'Delhi',
  },
  fr: {
    'Telangana': 'Telangana',
    'Andhra Pradesh': 'Andhra Pradesh',
    'Maharashtra': 'Maharashtra',
    'Karnataka': 'Karnataka',
    'Tamil Nadu': 'Tamil Nadu',
    'Kerala': 'Kerala',
    'Punjab': 'Penjab',
    'Haryana': 'Haryana',
    'Uttar Pradesh': 'Uttar Pradesh',
    'Madhya Pradesh': 'Madhya Pradesh',
    'Gujarat': 'Goudjarat',
    'Rajasthan': 'Rajasthan',
    'West Bengal': 'Bengale-Occidental',
    'Bihar': 'Bihar',
    'Delhi': 'Delhi',
  },
  pt: {
    'Telangana': 'Telangana',
    'Andhra Pradesh': 'Andhra Pradesh',
    'Maharashtra': 'Maharashtra',
    'Karnataka': 'Karnataka',
    'Tamil Nadu': 'Tamil Nadu',
    'Kerala': 'Kerala',
    'Punjab': 'Punjab',
    'Haryana': 'Haryana',
    'Uttar Pradesh': 'Uttar Pradesh',
    'Madhya Pradesh': 'Madhya Pradesh',
    'Gujarat': 'Gujarat',
    'West Bengal': 'Bengala Ocidental',
    'Bihar': 'Bihar',
    'Delhi': 'Deli',
  },
  ru: {
    'Telangana': 'Телангана',
    'Andhra Pradesh': 'Андхра-Прадеш',
    'Maharashtra': 'Махараштра',
    'Karnataka': 'Карнатака',
    'Tamil Nadu': 'Тамилнад',
    'Kerala': 'Керала',
    'Punjab': 'Пенджаб',
    'Haryana': 'Харьяна',
    'Uttar Pradesh': 'Уттар-Прадеш',
    'Madhya Pradesh': 'Мадхья-Прадеш',
    'Gujarat': 'Гуджарат',
    'Rajasthan': 'Раджастхан',
    'West Bengal': 'Западная Бенгалия',
    'Bihar': 'Бихар',
    'Delhi': 'Дели',
  },
  zh: {
    'Telangana': '泰伦加纳邦',
    'Andhra Pradesh': '安得拉邦',
    'Maharashtra': '马哈拉施特拉邦',
    'Karnataka': '卡纳塔克邦',
    'Tamil Nadu': '泰米尔纳德邦',
    'Kerala': '喀拉拉邦',
    'Punjab': '旁遮普邦',
    'Haryana': '哈里亚纳邦',
    'Uttar Pradesh': '北方邦',
    'Madhya Pradesh': '中央邦',
    'Gujarat': '古吉拉特邦',
    'Rajasthan': '拉贾斯坦邦',
    'West Bengal': '西孟加拉邦',
    'Bihar': '比哈尔邦',
    'Delhi': '德里',
  },
};

export const DISTRICT_NAMES: Record<string, Record<string, string>> = {
  te: {
    // Telangana
    'Adilabad': 'ఆదిలాబాద్',
    'Warangal': 'వరంగల్',
    'Karimnagar': 'కరీంనగర్',
    'Nizamabad': 'నిజామాబాద్',
    'Khammam': 'ఖమ్మం',
    'Nalgonda': 'నల్గొండ',
    'Mahabubnagar': 'మహబూబ్‌నగర్',
    'Sangareddy': 'సంగారెడ్డి',
    'Siddipet': 'సిద్దిపేట',
    'Rangareddy': 'రంగారెడ్డి',
    'Hyderabad': 'హైదరాబాద్',
    'Medak': 'మెదక్',
    'Kamareddy': 'కామారెడ్డి',
    'Jagtial': 'జగిత్యాల',
    'Peddapalli': 'పెద్దపల్లి',
    'Rajanna Sircilla': 'రాజన్న సిరిసిల్ల',
    'Bhadradri Kothagudem': 'భద్రాద్రి కొత్తగూడెం',
    'Jayashankar Bhupalpally': 'జయశంకర్ భూపాలపల్లి',
    'Jangaon': 'జనగామ',
    'Mahabubabad': 'మహబూబాబాద్',
    'Suryapet': 'సూర్యాపేట',
    'Yadadri Bhuvanagiri': 'యాదాద్రి భువనగిరి',
    'Vikarabad': 'వికారాబాద్',
    'Medchal-Malkajgiri': 'మేడ్చల్-మల్కాజ్‌గిరి',
    'Wanaparthy': 'వనపర్తి',
    'Nagarkurnool': 'నాగర్‌కర్నూల్',
    'Jogulamba Gadwal': 'జోగులాంబ గద్వాల',
    'Narayanpet': 'నారాయణపేట',
    'Mulugu': 'ములుగు',
    'Nirmal': 'నిర్మల్',
    'Mancherial': 'మంచిర్యాల',
    'Komaram Bheem Asifabad': 'కొమరం భీమ్ ఆసిఫాబాద్',
    // Andhra Pradesh
    'Guntur': 'గుంటూరు',
    'Krishna': 'కృష్ణా',
    'East Godavari': 'తూర్పు గోదావరి',
    'West Godavari': 'పశ్చిమ గోదావరి',
    'Visakhapatnam': 'విశాఖపట్నం',
    'Kurnool': 'కర్నూలు',
    'Chittoor': 'చిత్తూరు',
    'Ananthapuramu': 'అనంతపురం',
    'Anantapur': 'అనంతపురం',
    'Prakasam': 'ప్రకాశం',
    'Srikakulam': 'శ్రీకాకుళం',
    'Vizianagaram': 'విజయనగరం',
    'YSR Kadapa': 'వైఎస్ఆర్ కడప',
    'Kadapa': 'కడప',
    'Sri Potti Sriramulu Nellore': 'శ్రీ పొట్టి శ్రీరాములు నెల్లూరు',
    'Nellore': 'నెల్లూరు',
    'Tirupati': 'తిరుపతి',
    'Nandyal': 'నంద్యాల',
    'Eluru': 'ఏలూరు',
    'Kakinada': 'కాకినాడ',
    'Konaseema': 'కోనసీమ',
    'Palnadu': 'పల్నాడు',
    'Bapatla': 'బాపట్ల',
    'Anakapalli': 'అనకాపల్లి',
    'Alluri Sitharama Raju': 'అల్లూరి సీతారామరాజు',
    'Parvathipuram Manyam': 'పార్వతీపురం మన్యం',
    'Sri Sathya Sai': 'శ్రీ సత్యసాయి',
    'Annamayya': 'అన్నమయ్య',
    'NTR': 'ఎన్టీఆర్',
    // Others
    'Ludhiana': 'లూధియానా',
    'Amritsar': 'అమృతసర్',
    'Karnal': 'కర్నాల్',
    'Pune': 'పుణె',
    'Nashik': 'నాసిక్',
    'Nagpur': 'నాగ్‌పూర్',
    'Indore': 'ఇండోర్',
    'Bhopal': 'భోపాల్',
    'Belagavi': 'బెళగావి',
    'Mysuru': 'మైసూరు',
    'Thanjavur': 'తంజావూరు',
    'Madurai': 'మధురై',
    'Coimbatore': 'కోయంబత్తూరు',
  },
  hi: {
    // Telangana
    'Adilabad': 'आदिलाबाद',
    'Warangal': 'वारंगल',
    'Karimnagar': 'करीमनगर',
    'Nizamabad': 'निज़ामाबाद',
    'Khammam': 'खम्मम',
    'Nalgonda': 'नलगोंडा',
    'Mahabubnagar': 'महबूबनगर',
    'Sangareddy': 'संगारेड्डी',
    'Siddipet': 'सिद्दिपेट',
    'Rangareddy': 'रंगारेड्डी',
    'Hyderabad': 'हैदराबाद',
    'Medak': 'मेदक',
    'Kamareddy': 'कामारेड्डी',
    'Jagtial': 'जगतियाल',
    'Peddapalli': 'पेद्दापल्ली',
    'Rajanna Sircilla': 'राजन्ना सिरसिल्ला',
    'Bhadradri Kothagudem': 'भद्राद्री कोठागुडेम',
    'Jayashankar Bhupalpally': 'जयशंकर भूपालपल्ली',
    'Jangaon': 'जनगांव',
    'Mahabubabad': 'महबूबाबाद',
    'Suryapet': 'सूर्यापेट',
    'Yadadri Bhuvanagiri': 'यादाद्री भुवनगिरी',
    'Vikarabad': 'विकाराबाद',
    'Medchal-Malkajgiri': 'मेदचल-मलकाजगिरी',
    'Wanaparthy': 'वनपर्ति',
    'Nagarkurnool': 'नागरकर्नूल',
    'Jogulamba Gadwal': 'जोगुलाम्बा गडवाल',
    'Narayanpet': 'नारायणपेट',
    'Mulugu': 'मुलुगु',
    'Nirmal': 'निर्मल',
    'Mancherial': 'मंचेरियल',
    'Komaram Bheem Asifabad': 'कोमाराम भीम आसिफाबाद',
    // Andhra Pradesh
    'Guntur': 'गुंटूर',
    'Krishna': 'कृष्णा',
    'East Godavari': 'पूर्वी गोदावरी',
    'West Godavari': 'पश्चिम गोदावरी',
    'Visakhapatnam': 'विशाखापट्टनम',
    'Kurnool': 'कुरनूल',
    'Chittoor': 'चित्तूर',
    'Ananthapuramu': 'अनंतपुर',
    'Anantapur': 'अनंतपुर',
    'Prakasam': 'प्रकाशम',
    'Srikakulam': 'श्रीकाकुलम',
    'Vizianagaram': 'विजयनगरम',
    'YSR Kadapa': 'कडपा',
    'Kadapa': 'कडपा',
    'Sri Potti Sriramulu Nellore': 'नेल्लोर',
    'Nellore': 'नेल्लोर',
    'Tirupati': 'तिरुपति',
    // Others
    'Ludhiana': 'लुधियाना',
    'Amritsar': 'अमृतसर',
    'Karnal': 'करनाल',
    'Pune': 'पुणे',
    'Nashik': 'नासिक',
    'Nagpur': 'नागपुर',
    'Indore': 'इंदौर',
    'Bhopal': 'भोपाल',
    'Belagavi': 'बेलगावी',
    'Mysuru': 'मैसूरु',
    'Thanjavur': 'तंजौर',
    'Madurai': 'मदुरै',
    'Coimbatore': 'कोयंबटूर',
    'Patna': 'पटना',
    'Gaya': 'गया',
    'Lucknow': 'लखनऊ',
    'Kanpur': 'कानपुर',
    'Varanasi': 'वाराणसी',
    'Jaipur': 'जयपुर',
    'Jodhpur': 'जोधपुर',
  },
  ta: {
    'Adilabad': 'ஆதிலாபாத்',
    'Warangal': 'வாரங்கல்',
    'Karimnagar': 'கரீம்நகர்',
    'Nizamabad': 'நிஜாமாபாத்',
    'Khammam': 'கம்மம்',
    'Nalgonda': 'நல்கொண்டா',
    'Mahabubnagar': 'மஹபூப்நகர்',
    'Sangareddy': 'சங்காரெட்டி',
    'Siddipet': 'சித்திபேட்டை',
    'Rangareddy': 'ரெங்காரெட்டி',
    'Hyderabad': 'ஹைதராபாத்',
    'Guntur': 'குண்டூர்',
    'Krishna': 'கிருஷ்ணா',
    'East Godavari': 'கிழக்கு கோதாவரி',
    'West Godavari': 'மேற்கு கோதாவரி',
    'Visakhapatnam': 'விசாகப்பட்டினம்',
    'Kurnool': 'கர்நூல்',
    'Chittoor': 'சித்தூர்',
    'Thanjavur': 'தஞ்சாவூர்',
    'Madurai': 'மதுரை',
    'Coimbatore': 'கோயம்புத்தூர்',
    'Salem': 'சேலம்',
    'Tiruchirappalli': 'திருச்சிராப்பள்ளி',
    'Tirunelveli': 'திருநெல்வேலி',
  },
  kn: {
    'Adilabad': 'ಆದಿಲಾಬಾದ್',
    'Warangal': 'ವಾರಂಗಲ್',
    'Karimnagar': 'ಕರೀಂನಗರ',
    'Nizamabad': 'ನಿಜಾಮಾಬಾದ್',
    'Hyderabad': 'ಹೈದರಾಬಾದ್',
    'Belagavi': 'ಬೆಳಗಾವಿ',
    'Mysuru': 'ಮೈಸೂರು',
    'Dharwad': 'ಧಾರವಾಡ',
    'Kalaburagi': 'ಕಲಬುರಗಿ',
    'Ballari': 'ಬಳ್ಳಾರಿ',
    'Vijayapura': 'ವಿಜಯಪುರ',
    'Shivamogga': 'ಶಿವಮೊಗ್ಗ',
  },
  mr: {
    'Adilabad': 'आदिलाबाद',
    'Warangal': 'वारंगळ',
    'Karimnagar': 'करीमनगर',
    'Nizamabad': 'निझामाबाद',
    'Hyderabad': 'हैदराबाद',
    'Pune': 'पुणे',
    'Nashik': 'नाशिक',
    'Nagpur': 'नागपूर',
    'Solapur': 'सोलापूर',
    'Kolhapur': 'कोल्हापूर',
    'Amravati': 'अमरावती',
    'Aurangabad': 'औरंगाबाद',
  },
  pa: {
    'Adilabad': 'ਆਦਿਲਾਬਾਦ',
    'Warangal': 'ਵਾਰੰਗਲ',
    'Ludhiana': 'ਲੁਧਿਆਣਾ',
    'Amritsar': 'ਅੰਮ੍ਰਿਤਸਰ',
    'Jalandhar': 'ਜਲੰਧਰ',
    'Patiala': 'ਪਟਿਆਲਾ',
    'Bathinda': 'ਬਠਿੰਡਾ',
  },
  bn: {
    'Adilabad': 'আদিলবাদ',
    'Warangal': 'ওয়ারাঙ্গল',
    'Hyderabad': 'হায়দ্রাবাদ',
    'Kolkata': 'কলকাতা',
    'Howrah': 'হাওড়া',
    'Darjeeling': 'দার্জিলিং',
  },
  gu: {
    'Adilabad': 'આદિલાબાદ',
    'Warangal': 'વરંગલ',
    'Hyderabad': 'હૈદરાબાદ',
    'Ahmedabad': 'અમદાવાદ',
    'Surat': 'સુરત',
    'Rajkot': 'રાજકોટ',
  },
  or: {
    'Adilabad': 'ଆଦିଲାବାଦ',
    'Warangal': 'ୱାରଙ୍ଗଲ',
    'Hyderabad': 'ହାଇଦ୍ରାବାଦ',
    'Cuttack': 'କଟକ',
    'Bhubaneswar': 'ଭୁବନେଶ୍ୱର',
  },
  as: {
    'Adilabad': 'আদিলাবাদ',
    'Warangal': 'ৱাৰংগল',
    'Hyderabad': 'হায়দৰাবাদ',
    'Guwahati': 'গুৱাহাটী',
  },
  ur: {
    'Adilabad': 'عادل آباد',
    'Warangal': 'وارنگل',
    'Hyderabad': 'حیدرآباد',
    'Karimnagar': 'کریم نگر',
  },
};

export const SUB_DISTRICT_NAMES: Record<string, Record<string, string>> = {
  te: {
    'Adilabad Rural': 'ఆదిలాబాద్ గ్రామీణ',
    'Adilabad Urban': 'ఆదిలాబాద్ పట్టణ',
    'Jainad': 'జైనాథ్',
    'Bela': 'బేల',
    'Utnoor': 'ఉట్నూరు',
    'Bazarhatnoor': 'బజార్‌హత్నూర్',
    // Andhra Pradesh
    'Guntur East': 'గుంటూరు తూర్పు',
    'Guntur West': 'గుంటూరు పశ్చిమ',
    'Tenali': 'తెనాలి',
    'Mangalagiri': 'మంగళగిరి',
    'Ponnur': 'పొన్నూరు',
    'Amaravati': 'అమరావతి',
    'Sattenapalle': 'సత్తెనపల్లి',
    'Bapatla': 'బాపట్ల',
    'Repalle': 'రేపల్లె',
    'Narasaraopet': 'నరసరావుపేట',
    'Chilakaluripet': 'చిలకలూరిపేట',
    'Macherla': 'మాచర్ల',
    'Vinukonda': 'వినుకొండ',
    'Vijayawada': 'విజయవాడ',
    'Gudivada': 'గుడివాడ',
    'Machilipatnam': 'మచిలీపట్నం',
    'Nuzvid': 'నూజివీడు',
    'Jaggayyapeta': 'జగ్గయ్యపేట',
    'Tiruvuru': 'తిరువూరు',
    'Vuyyuru': 'ఉయ్యూరు',
    'Gannavaram': 'గన్నవరం',
    'Kaikaluru': 'కైకలూరు',
    'Rajahmundry': 'రాజమండ్రి',
    'Kakinada': 'కాకినాడ',
    'Amalapuram': 'అమలాపురం',
    'Peddapuram': 'పెద్దాపురం',
    'Mandapeta': 'మండపేట',
    'Ramachandrapuram': 'రామచంద్రపురం',
    'Razole': 'రాజోలు',
    'Eluru': 'ఏలూరు',
    'Tadepalligudem': 'తాడేపల్లిగూడెం',
    'Bhimavaram': 'భీమవరం',
    'Narsapuram': 'నర్సాపురం',
    'Tanuku': 'తణుకు',
    'Palakollu': 'పాలకొల్లు',
    'Jangareddygudem': 'జంగారెడ్డిగూడెం',
    'Anantapur': 'అనంతపురం',
    'Dharmavaram': 'ధర్మవరం',
    'Penukonda': 'పెనుకొండ',
    'Gooty': 'గుత్తి',
    'Kadiri': 'కదిరి',
    'Hindupur': 'హిందూపురం',
    'Rayadurg': 'రాయదుర్గం',
    'Tadipatri': 'తాడిపత్రి',
    'Chittoor': 'చిత్తూరు',
    'Madanapalle': 'మదనపల్లె',
    'Palamaner': 'పలమనేరు',
    'Nagari': 'నగరి',
    'Kuppam': 'కుప్పం',
    'Punganur': 'పుంగనూరు',
    'Pileru': 'పీలేరు',
    'Kurnool': 'కర్నూలు',
    'Nandyal': 'నంద్యాల',
    'Adoni': 'ఆదోని',
    'Yemmiganur': 'ఎమ్మిగనూరు',
    'Dhone': 'డోన్',
    'Allagadda': 'ఆళ్లగడ్డ',
    'Nandikotkur': 'నందికొట్కూరు',
    'Banaganapalle': 'బనగానపల్లె',
    'Ongole': 'ఒంగోలు',
    'Kandukur': 'కందుకూరు',
    'Markapur': 'మార్కాపురం',
    'Giddalur': 'గిద్దలూరు',
    'Chirala': 'చీరాల',
    'Kanigiri': 'కనిగిరి',
    'Podili': 'పొదిలి',
    'Srikakulam': 'శ్రీకాకుళం',
    'Tekkali': 'టెక్కలి',
    'Palakonda': 'పాలకొండ',
    'Sompeta': 'సోంపేట',
    'Amadalavalasa': 'ఆమదాలవలస',
    'Rajam': 'రాజాం',
    'Ichchapuram': 'ఇచ్ఛాపురం',
    'Visakhapatnam Urban': 'విశాఖపట్నం పట్టణ',
    'Visakhapatnam Rural': 'విశాఖపట్నం గ్రామీణ',
    'Anakapalle': 'అనకాపల్లి',
    'Bheemunipatnam': 'భీమునిపట్నం',
    'Narsipatnam': 'నర్సీపట్నం',
    'Gajuwaka': 'గాజువాక',
    'Pendurthi': 'పెందుర్తి',
    'Vizianagaram': 'విజయనగరం',
    'Bobbali': 'బొబ్బిలి',
    'Parvathipuram': 'పార్వతీపురం',
    'Salur': 'సాలూరు',
    'Cheepurupalli': 'చీపురుపల్లి',
    'Kadapa': 'కడప',
    'Proddatur': 'ప్రొద్దుటూరు',
    'Rayachoti': 'రాయచోటి',
    'Jammalamadugu': 'జమ్మలమడుగు',
    'Pulivendula': 'పులివెందుల',
    'Badvel': 'బద్వేలు',
    'Mydukur': 'మైదుకూరు',
    'Nellore': 'నెల్లూరు',
    'Kavali': 'కావలి',
    'Gudur': 'గూడూరు',
    'Atmakur': 'ఆత్మకూరు',
    'Sullurpeta': 'సూళ్లూరుపేట',
    'Venkatagiri': 'వెంకటగిరి',
    'Naidupeta': 'నాయుడుపేట',
    'Tirupati Urban': 'తిరుపతి పట్టణ',
    'Tirupati Rural': 'తిరుపతి గ్రామీణ',
    'Srikalahasti': 'శ్రీకాళహస్తి',
    'Chandragiri': 'చంద్రగిరి',
    // Telangana
    'Warangal': 'వరంగల్',
    'Hanamkonda': 'హనుమకొండ',
    'Kazipet': 'కాజీపేట',
    'Jangaon': 'జనగామ',
    'Mahabubabad': 'మహబూబాబాద్',
    'Parkal': 'పరకాల',
    'Narsampet': 'నర్సంపేట',
    'Karimnagar': 'కరీంనగర్',
    'Huzurabad': 'హుజూరాబాద్',
    'Manakondur': 'మానకొండూరు',
    'Choppadandi': 'చొప్పదండి',
    'Nizamabad': 'నిజామాబాద్',
    'Bodhan': 'బోధన్',
    'Armoor': 'ఆర్మూరు',
    'Banswada': 'బాన్సువాడ',
    'Kamareddy': 'కామారెడ్డి',
    'Khammam': 'ఖమ్మం',
    'Madhira': 'మధిర',
    'Wyra': 'వైరా',
    'Sathupalli': 'సత్తుపల్లి',
    'Kothagudem': 'కొత్తగూడెం',
    'Palwancha': 'పాల్వంచ',
    'Yellandu': 'ఇల్లందు',
    'Bhadrachalam': 'భద్రాచలం',
    'Nalgonda': 'నల్గొండ',
    'Miryalaguda': 'మిర్యాలగూడ',
    'Devarakonda': 'దేవరకొండ',
    'Suryapet': 'సూర్యాపేట',
    'Kodad': 'కోదాడ',
    'Huzurnagar': 'హుజూర్ నగర్',
    'Mahabubnagar': 'మహబూబ్‌నగర్',
    'Jadcherla': 'జడ్చర్ల',
    'Shadnagar': 'షాద్‌నగర్',
    'Nagarkurnool': 'నాగర్‌కర్నూల్',
    'Wanaparthy': 'వనపర్తి',
    'Gadwal': 'గద్వాల',
    'Narayanpet': 'నారాయణపేట',
    'Sangareddy': 'సంగారెడ్డి',
    'Zaheerabad': 'జహీరాబాద్',
    'Patancheru': 'పటాన్‌చెరు',
    'Siddipet': 'సిద్దిపేట',
    'Gajwel': 'గజ్వేల్',
    'Dubbak': 'దుబ్బాక',
    'Medak': 'మెదక్',
    'Narsapur': 'నర్సాపూర్',
    'Vikarabad': 'వికారాబాద్',
    'Tandur': 'తాండూరు',
    'Chevella': 'చేవెళ్ల',
    'Ibrahimpatnam': 'ఇబ్రహీంపట్నం',
    'Maheshwaram': 'మహేశ్వరం',
    'Rajendranagar': 'రాజేంద్రనగర్',
    'Serilingampally': 'శేరిలింగంపల్లి',
    'Malkajgiri': 'మల్కాజ్‌గిరి',
    'Medchal': 'మేడ్చల్',
    'Uppal': 'ఉప్పల్',
    'Quthbullapur': 'కుత్బుల్లాపూర్',
    'Kukatpally': 'కూకట్‌పల్లి',
    'Nirmal': 'నిర్మల్',
    'Mancherial': 'మంచిర్యాల',
  },
  hi: {
    'Adilabad Rural': 'आदिलाबाद ग्रामीण',
    'Adilabad Urban': 'आदिलाबाद शहरी',
    'Jainad': 'जैनद',
    'Bela': 'बेला',
    'Utnoor': 'उटनूर',
    'Bazarhatnoor': 'बाजारहथनूर',
    'Guntur East': 'गुंटूर पूर्व',
    'Guntur West': 'गुंटूर पश्चिम',
    'Tenali': 'तेनाली',
    'Mangalagiri': 'मंगलगिरि',
    'Ponnur': 'पोन्नूर',
    'Amaravati': 'अमरावती',
    'Sattenapalle': 'सत्तेनापल्ली',
    'Bapatla': 'बापटला',
    'Vijayawada': 'विजयवाड़ा',
    'Gudivada': 'गुडिवाडा',
    'Machilipatnam': 'मछिलीपटनम',
    'Nuzvid': 'नूज़िवीड',
    'Jaggayyapeta': 'जग्गय्यापेटा',
    'Rajahmundry': 'राजमुंदरी',
    'Kakinada': 'काकीनाड़ा',
    'Amalapuram': 'अमलापुरम',
    'Eluru': 'एलुरु',
    'Tadepalligudem': 'ताड़ेपल्लीगुडेम',
    'Bhimavaram': 'भीमावरम',
    'Anantapur': 'अनंतपुर',
    'Dharmavaram': 'धर्मावरम',
    'Chittoor': 'चित्तूर',
    'Madanapalle': 'मदनपल्ले',
    'Kurnool': 'कुरनूल',
    'Nandyal': 'नंद्याल',
    'Adoni': 'आदोनी',
    'Ongole': 'ओंगोल',
    'Srikakulam': 'श्रीकाकुलम',
    'Visakhapatnam Urban': 'विशाखापट्टनम शहरी',
    'Vizianagaram': 'विजयनगरम',
    'Kadapa': 'कडपा',
    'Nellore': 'नेल्लोर',
    'Tirupati Urban': 'तिरुपति शहरी',
    'Tirupati Rural': 'तिरुपति ग्रामीण',
    'Srikalahasti': 'श्रीकालहस्ती',
    'Warangal': 'वारंगल',
    'Karimnagar': 'करीमनगर',
    'Nizamabad': 'निज़ामाबाद',
    'Khammam': 'खम्मम',
    'Nalgonda': 'नलगोंडा',
    'Mahabubnagar': 'महबूबनगर',
    'Siddipet': 'सिद्दिपेट',
    'Kothagudem': 'कोठागुडेम',
    'Ludhiana': 'लुधियाना',
    'Amritsar': 'अमृतसर',
  },
  ta: {
    'Adilabad Rural': 'ஆதிலாபாத் கிராமப்புறம்',
    'Adilabad Urban': 'ஆதிலாபாத் நகர்ப்புறம்',
    'Tenali': 'தெனாலி',
    'Vijayawada': 'விஜயவாடா',
    'Tirupati': 'திருப்பதி',
    'Guntur': 'குண்டூர்',
    'Nellore': 'நெல்லூர்',
    'Visakhapatnam': 'விசாகப்பட்டினம்',
    'Warangal': 'வாரங்கல்',
    'Hyderabad': 'ஹைதராபாத்',
  },
};

export const CROP_TRANSLATIONS: Record<string, Record<string, string>> = {
  te: {
    'Rice': 'వరి',
    'Wheat': 'గోధుమలు',
    'Soybean': 'సోయాబీన్',
    'Cotton': 'పత్తి',
    'Sugarcane': 'చెరకు',
    'Maize (Corn)': 'మొక్కజొన్న',
    'Corn': 'మొక్కజొన్న',
    'Barley': 'బార్లీ',
    'Chickpeas / Gram': 'శనగలు',
    'Millet (Bajra / Ragi)': 'చిరుధాన్యాలు (సజ్జలు / రాగులు)',
    'Tomato': 'టమోటా',
    'Potato': 'బంగాళాదుంప',
    'Sunflower': 'పొద్దుతిరుగుడు',
    'Mustard': 'ఆవాలు',
    'Groundnut': 'వేరుశనగ',
  },
  hi: {
    'Rice': 'चावल',
    'Wheat': 'गेहूं',
    'Soybean': 'सोयाबीन',
    'Cotton': 'कपास',
    'Sugarcane': 'गन्ना',
    'Maize (Corn)': 'मक्का',
    'Corn': 'मक्का',
    'Barley': 'जौ',
    'Chickpeas / Gram': 'चना',
    'Millet (Bajra / Ragi)': 'बाजरा / रागी',
    'Tomato': 'टमाटर',
    'Potato': 'आलू',
    'Sunflower': 'सूरजमुखी',
    'Mustard': 'सरसों',
    'Groundnut': 'मूंगफली',
  },
  ta: {
    'Rice': 'நெல்',
    'Wheat': 'கோதுமை',
    'Soybean': 'சோயாபீன்',
    'Cotton': 'பருத்தி',
    'Sugarcane': 'கரும்பு',
    'Maize (Corn)': 'மக்காச்சோளம்',
    'Corn': 'மக்காச்சோளம்',
    'Barley': 'பார்லி',
    'Chickpeas / Gram': 'கொண்டைக்கடலை',
    'Millet (Bajra / Ragi)': 'கம்பு / கேழ்வரகு',
    'Tomato': 'தக்காளி',
    'Potato': 'உருளைக்கிழங்கு',
    'Sunflower': 'சூரியகாந்தி',
    'Mustard': 'கடுகு',
    'Groundnut': 'வேர்க்கடலை',
  },
  kn: {
    'Rice': 'ಭತ್ತ',
    'Wheat': 'ಗೋಧಿ',
    'Soybean': 'ಸೋಯಾಬೀನ್',
    'Cotton': 'ಹತ್ತಿ',
    'Sugarcane': 'ಕಬ್ಬು',
    'Maize (Corn)': 'ಮೆಕ್ಕೆಜೋಳ',
    'Corn': 'ಮೆಕ್ಕೆಜೋಳ',
    'Barley': 'ಬಾರ್ಲಿ',
    'Chickpeas / Gram': 'ಕಡಲೆ',
    'Millet (Bajra / Ragi)': 'ಸಜ್ಜೆ / ರಾಗಿ',
    'Tomato': 'ಟೊಮೆಟೊ',
    'Potato': 'ಆಲೂಗಡ್ಡೆ',
    'Sunflower': 'ಸೂರ್ಯಕಾಂತಿ',
    'Mustard': 'ಸಾಸಿವೆ',
    'Groundnut': 'ಕಡಲೆಕಾಯಿ',
  },
  ml: {
    'Rice': 'നെല്ല്',
    'Wheat': 'ഗോതമ്പ്',
    'Soybean': 'സോയാബീൻ',
    'Cotton': 'പരുത്തി',
    'Sugarcane': 'കരിമ്പ്',
    'Maize (Corn)': 'ചോളം',
    'Corn': 'ചോളം',
    'Barley': 'ബാർലി',
    'Chickpeas / Gram': 'കടല',
    'Millet (Bajra / Ragi)': 'റാഗി / തിന',
    'Tomato': 'തക്കാളി',
    'Potato': 'ഉരുളക്കിഴങ്ങ്',
    'Sunflower': 'സൂര്യകാന്തി',
    'Mustard': 'കടുക്',
    'Groundnut': 'നിലക്കടല',
  },
  mr: {
    'Rice': 'भात / तांदूळ',
    'Wheat': 'गहू',
    'Soybean': 'सोयाबीन',
    'Cotton': 'कापूस',
    'Sugarcane': 'ऊस',
    'Maize (Corn)': 'मका',
    'Corn': 'मका',
    'Barley': 'जव',
    'Chickpeas / Gram': 'हरभरा',
    'Millet (Bajra / Ragi)': 'बाजरी / नाचणी',
    'Tomato': 'टोमॅटो',
    'Potato': 'बटाटा',
    'Sunflower': 'सूर्यफूल',
    'Mustard': 'मोहरी',
    'Groundnut': 'भुईमूग',
  },
  gu: {
    'Rice': 'ડાંગર / ચોખા',
    'Wheat': 'ઘઉં',
    'Soybean': 'સોયાબીન',
    'Cotton': 'કપાસ',
    'Sugarcane': 'શેરડી',
    'Maize (Corn)': 'મકાઈ',
    'Corn': 'મકાઈ',
    'Barley': 'જવ',
    'Chickpeas / Gram': 'ચણા',
    'Millet (Bajra / Ragi)': 'બાજરી / રાગી',
    'Tomato': 'ટામેટા',
    'Potato': 'બટાટા',
    'Sunflower': 'સૂર્યમુખી',
    'Mustard': 'રાઈ / સરસવ',
    'Groundnut': 'મગફળી',
  },
  bn: {
    'Rice': 'ধান / চাল',
    'Wheat': 'গম',
    'Soybean': 'সয়াবিন',
    'Cotton': 'তুলা',
    'Sugarcane': 'আখ',
    'Maize (Corn)': 'ভুট্টা',
    'Corn': 'ভুট্টা',
    'Barley': 'যব',
    'Chickpeas / Gram': 'ছোলা',
    'Millet (Bajra / Ragi)': 'বাজরা / রাগি',
    'Tomato': 'টমেটো',
    'Potato': 'আলু',
    'Sunflower': 'সূর্যমুখী',
    'Mustard': 'সরিষা',
    'Groundnut': 'চীনাবাদাম',
  },
  pa: {
    'Rice': 'ਝੋਨਾ / ਚਾਵਲ',
    'Wheat': 'ਕਣਕ',
    'Soybean': 'ਸੋਇਆਬੀਨ',
    'Cotton': 'ਕਪਾਹ',
    'Sugarcane': 'ਗੰਨਾ',
    'Maize (Corn)': 'ਮੱਕੀ',
    'Corn': 'ਮੱਕੀ',
    'Barley': 'ਜੌਂ',
    'Chickpeas / Gram': 'ਛੋਲੇ',
    'Millet (Bajra / Ragi)': 'ਬਾਜਰਾ / ਰਾਗੀ',
    'Tomato': 'ਟਮਾਟਰ',
    'Potato': 'ਆਲੂ',
    'Sunflower': 'ਸੂਰਜਮੁਖੀ',
    'Mustard': 'ਸਰ੍ਹੋਂ',
    'Groundnut': 'ਮੂੰਗਫਲੀ',
  },
  or: {
    'Rice': 'ଧାନ',
    'Wheat': 'ଗହମ',
    'Soybean': 'ସୋୟାବିନ୍',
    'Cotton': 'କପା',
    'Sugarcane': 'ଆଖୁ',
    'Maize (Corn)': 'ମକା',
    'Corn': 'ମକା',
    'Barley': 'ଯବ',
    'Chickpeas / Gram': 'ବୁଟ',
    'Millet (Bajra / Ragi)': 'ମାଣ୍ଡିଆ',
    'Tomato': 'ଟମାଟୋ',
    'Potato': 'ଆଳୁ',
    'Sunflower': 'ସୂର୍ଯ୍ୟମୁଖୀ',
    'Mustard': 'ସୋରିଷ',
    'Groundnut': 'ଚିନାବାଦାମ',
  },
  as: {
    'Rice': 'ধান',
    'Wheat': 'ঘেঁহু',
    'Soybean': 'চয়াবিন',
    'Cotton': 'কপাহ',
    'Sugarcane': 'কুঁহিয়াৰ',
    'Maize (Corn)': 'মাকৈ',
    'Corn': 'মাকৈ',
    'Barley': 'বাৰ্লি',
    'Chickpeas / Gram': 'বুট',
    'Millet (Bajra / Ragi)': 'বাজৰা',
    'Tomato': 'টমেটো',
    'Potato': 'আলু',
    'Sunflower': 'সূৰ্যমুখী',
    'Mustard': 'সৰিয়হ',
    'Groundnut': 'বাদাম',
  },
  ur: {
    'Rice': 'چاول',
    'Wheat': 'گندم',
    'Soybean': 'سویا بین',
    'Cotton': 'کپاس',
    'Sugarcane': 'گنا',
    'Maize (Corn)': 'مکئی',
    'Corn': 'مکئی',
    'Barley': 'جو',
    'Chickpeas / Gram': 'چنا',
    'Millet (Bajra / Ragi)': 'باجرہ',
    'Tomato': 'ٹماٹر',
    'Potato': 'آلو',
    'Sunflower': 'سورج مکھی',
    'Mustard': 'سرسوں',
    'Groundnut': 'مونگ پھلی',
  },
  ar: {
    'Rice': 'أرز',
    'Wheat': 'قمح',
    'Soybean': 'فول الصويا',
    'Cotton': 'قطن',
    'Sugarcane': 'قصب السكر',
    'Maize (Corn)': 'ذرة',
    'Corn': 'ذرة',
    'Barley': 'شعير',
    'Chickpeas / Gram': 'حمص',
    'Millet (Bajra / Ragi)': 'دخن',
    'Tomato': 'طماطم',
    'Potato': 'بطاطس',
    'Sunflower': 'عباد الشمس',
    'Mustard': 'خردل',
    'Groundnut': 'فول سوداني',
  },
  es: {
    'Rice': 'Arroz',
    'Wheat': 'Trigo',
    'Soybean': 'Soja',
    'Cotton': 'Algodón',
    'Sugarcane': 'Caña de azúcar',
    'Maize (Corn)': 'Maíz',
    'Corn': 'Maíz',
    'Barley': 'Cebada',
    'Chickpeas / Gram': 'Garbanzos',
    'Millet (Bajra / Ragi)': 'Mijo',
    'Tomato': 'Tomate',
    'Potato': 'Patata',
    'Sunflower': 'Girasol',
    'Mustard': 'Mostaza',
    'Groundnut': 'Cacahuete',
  },
  fr: {
    'Rice': 'Riz',
    'Wheat': 'Blé',
    'Soybean': 'Soja',
    'Cotton': 'Coton',
    'Sugarcane': 'Canne à sucre',
    'Maize (Corn)': 'Maïs',
    'Corn': 'Maïs',
    'Barley': 'Orge',
    'Chickpeas / Gram': 'Pois chiches',
    'Millet (Bajra / Ragi)': 'Millet',
    'Tomato': 'Tomate',
    'Potato': 'Pomme de terre',
    'Sunflower': 'Tournesol',
    'Mustard': 'Moutarde',
    'Groundnut': 'Arachide',
  },
  pt: {
    'Rice': 'Arroz',
    'Wheat': 'Trigo',
    'Soybean': 'Soja',
    'Cotton': 'Algodão',
    'Sugarcane': 'Cana-de-açúcar',
    'Maize (Corn)': 'Milho',
    'Corn': 'Milho',
    'Barley': 'Cevada',
    'Chickpeas / Gram': 'Grão-de-bico',
    'Millet (Bajra / Ragi)': 'Milheto',
    'Tomato': 'Tomate',
    'Potato': 'Batata',
    'Sunflower': 'Girassol',
    'Mustard': 'Mostarda',
    'Groundnut': 'Amendoim',
  },
  ru: {
    'Rice': 'Рис',
    'Wheat': 'Пшеница',
    'Soybean': 'Соя',
    'Cotton': 'Хлопок',
    'Sugarcane': 'Сахарный тростник',
    'Maize (Corn)': 'Кукуруза',
    'Corn': 'Кукуруза',
    'Barley': 'Ячмень',
    'Chickpeas / Gram': 'Нут',
    'Millet (Bajra / Ragi)': 'Просо',
    'Tomato': 'Томат',
    'Potato': 'Картофель',
    'Sunflower': 'Подсолнечник',
    'Mustard': 'Горчица',
    'Groundnut': 'Aрахис',
  },
  zh: {
    'Rice': '水稻',
    'Wheat': '小麦',
    'Soybean': '大豆',
    'Cotton': '棉花',
    'Sugarcane': '甘蔗',
    'Maize (Corn)': '玉米',
    'Corn': '玉米',
    'Barley': '大麦',
    'Chickpeas / Gram': '鹰嘴豆',
    'Millet (Bajra / Ragi)': '谷子 / 粟',
    'Tomato': '番茄',
    'Potato': '马铃薯',
    'Sunflower': '向日葵',
    'Mustard': '芥菜 / 芥末',
    'Groundnut': '花生',
  },
};

export const SOIL_TRANSLATIONS: Record<string, Record<string, string>> = {
  te: {
    'Black Cotton Soil (Vertisol)': 'నల్ల రేగడి నేల',
    'Black (Regur)': 'నల్ల నేల (రేగడి)',
    'Black Soil': 'నల్ల నేల',
    'Alluvial Loam': 'ఒండ్రు నేల',
    'Alluvial': 'ఒండ్రు నేల',
    'Red': 'ఎర్ర నేల',
    'Sandy Loam': 'ఇసుక నేల',
    'Clayey Soil': 'బంకమన్ను నేల',
    'Laterite Soil': 'లేటరైట్ నేల',
    'Laterite': 'లేటరైట్ నేల',
    'Silt Loam': 'సిల్ట్ నేల',
    'Desert': 'ఎడారి నేల',
    'Mountain': 'పర్వత నేల',
    'Chernozem (Black Earth)': 'నల్ల నేల',
    'Chernozem (Black Soil)': 'నల్ల నేల',
    'Mollisol (Black Earth)': 'నల్ల నేల',
    'Cerrado Oxisol (Red Clay)': 'ఎర్ర బంకమన్ను',
  },
  hi: {
    'Black Cotton Soil (Vertisol)': 'काली कपासी मिट्टी',
    'Black (Regur)': 'काली मिट्टी (रेगुर)',
    'Black Soil': 'काली मिट्टी',
    'Alluvial Loam': 'जलोढ़ दोमट',
    'Alluvial': 'जलोढ़ मिट्टी',
    'Red': 'लाल मिट्टी',
    'Sandy Loam': 'बलुई दोमट',
    'Clayey Soil': 'चिकनी मिट्टी',
    'Laterite Soil': 'लेटराइट मिट्टी',
    'Laterite': 'लेटराइट मिट्टी',
    'Silt Loam': 'गाद दोमट',
    'Desert': 'रेगिस्तानी मिट्टी',
    'Mountain': 'पर्वतीय मिट्टी',
    'Chernozem (Black Earth)': 'काली उपजाऊ मिट्टी',
    'Chernozem (Black Soil)': 'काली मिट्टी',
    'Mollisol (Black Earth)': 'काली भुरभुरी मिट्टी',
    'Cerrado Oxisol (Red Clay)': 'लाल चिकनी मिट्टी',
  },
  ta: {
    'Black Cotton Soil (Vertisol)': 'கரிசல் மண்',
    'Black (Regur)': 'கரிசல் மண்',
    'Black Soil': 'கரிசல் மண்',
    'Alluvial Loam': 'வண்டல் மண்',
    'Alluvial': 'வண்டல் மண்',
    'Red': 'செம்மண்',
    'Sandy Loam': 'மணல் வண்டல் மண்',
    'Clayey Soil': 'களிமண்',
    'Laterite Soil': 'லேட்டரைட் மண்',
    'Laterite': 'லேட்டரைட் மண்',
    'Silt Loam': 'வண்டல் மண்',
    'Desert': 'பாலைவன மண்',
    'Mountain': 'மலை மண்',
    'Chernozem (Black Earth)': 'கரிசல் மண்',
    'Cerrado Oxisol (Red Clay)': 'சிவப்பு களிமண்',
  },
  kn: {
    'Black Cotton Soil (Vertisol)': 'ಕಪ್ಪು ಹತ್ತಿ ಮಣ್ಣು',
    'Black (Regur)': 'ಕಪ್ಪು ಮಣ್ಣು (ರೆಗೂರ್)',
    'Black Soil': 'ಕಪ್ಪು ಮಣ್ಣು',
    'Alluvial Loam': 'ಮೆಕ್ಕಲು ಮಣ್ಣು',
    'Alluvial': 'ಮೆಕ್ಕಲು ಮಣ್ಣು',
    'Red': 'ಕೆಂಪು ಮಣ್ಣು',
    'Sandy Loam': 'ಮರಳು ಮಿಶ್ರಿತ ಮಣ್ಣು',
    'Clayey Soil': 'ಜೇಡಿ ಮಣ್ಣು',
    'Laterite Soil': 'ಲ್ಯಾಟರೈಟ್ ಮಣ್ಣು',
    'Laterite': 'ಲ್ಯಾಟರೈಟ್ ಮಣ್ಣು',
    'Silt Loam': 'ಹೂಳು ಮಣ್ಣು',
    'Desert': 'ಮರುಭೂಮಿ ಮಣ್ಣು',
    'Mountain': 'ಪರ್ವತ ಮಣ್ಣು',
  },
  mr: {
    'Black Cotton Soil (Vertisol)': 'काळी कापशी माती (व्हर्टिसोल)',
    'Black (Regur)': 'काळी माती (रेगूर)',
    'Black Soil': 'काळी माती',
    'Alluvial Loam': 'गाळाची माती',
    'Alluvial': 'गाळाची माती',
    'Red': 'तांबडी माती',
    'Sandy Loam': 'रेतीयुक्त पोयटा',
    'Clayey Soil': 'चिकणमाती',
    'Laterite Soil': 'जांभी माती',
    'Laterite': 'जांभी माती',
    'Silt Loam': 'गाळयुक्त पोयटा',
    'Desert': 'वाळवंटी माती',
    'Mountain': 'पर्वतीय माती',
  },
  gu: {
    'Black Cotton Soil (Vertisol)': 'કાળી કપાસની જમીન',
    'Black (Regur)': 'કાળી જમીન',
    'Black Soil': 'કાળી જમીન',
    'Alluvial Loam': 'કાંપવાળી ગોરાડુ જમીન',
    'Alluvial': 'કાંપવાળી જમીન',
    'Red': 'રાતી જમીન',
    'Sandy Loam': 'રેતાળ ગોરાડુ જમીન',
    'Clayey Soil': 'માટીયાળ જમીન',
    'Laterite Soil': 'પડખાઉ જમીન',
  },
  bn: {
    'Black Cotton Soil (Vertisol)': 'কৃষ্ণ মৃত্তিকা',
    'Black Soil': 'কালো মাটি',
    'Alluvial Loam': 'পলি দোআঁশ মাটি',
    'Alluvial': 'পলি মাটি',
    'Red': 'লাল মাটি',
    'Sandy Loam': 'বেলে দোআঁশ মাটি',
    'Clayey Soil': 'এটেল মাটি',
    'Laterite Soil': 'ল্যাটেরাইট মাটি',
  },
  pa: {
    'Black Cotton Soil (Vertisol)': 'ਕਾਲੀ ਮਿੱਟੀ',
    'Black Soil': 'ਕਾਲੀ ਮਿੱਟੀ',
    'Alluvial Loam': 'ਜਲੋੜ ਮਿੱਟੀ',
    'Alluvial': 'ਜਲੋੜ ਮਿੱਟੀ',
    'Red': 'ਲਾਲ ਮਿੱਟੀ',
    'Sandy Loam': 'ਰੇਤਲੀ ਮਿੱਟੀ',
    'Clayey Soil': 'ਚੀਕਣੀ ਮਿੱਟੀ',
  },
  or: {
    'Black Cotton Soil (Vertisol)': 'କଳା ମାଟି',
    'Black Soil': 'କଳା ମାଟି',
    'Alluvial Loam': 'ପଟୁ ମାଟି',
    'Alluvial': 'ପଟୁ ମାଟି',
    'Red': 'ଲାଲ ମାଟି',
    'Sandy Loam': 'ବାଲିଆ ମାଟି',
    'Clayey Soil': 'ମାଟିଆ ମାଟି',
  },
  as: {
    'Black Cotton Soil (Vertisol)': 'কলা মাটি',
    'Alluvial Loam': 'পলি মাটি',
    'Red': 'ৰঙা মাটি',
    'Sandy Loam': 'বালিয়া মাটি',
    'Clayey Soil': 'এটেল মাটি',
  },
  ur: {
    'Black Cotton Soil (Vertisol)': 'کالی مٹی',
    'Alluvial Loam': 'زرخیز مٹی',
    'Red': 'سرخ مٹی',
    'Sandy Loam': 'ریتیلی مٹی',
    'Clayey Soil': 'चिकنی مٹی',
  },
  ar: {
    'Black Cotton Soil (Vertisol)': 'تربة سوداء',
    'Alluvial Loam': 'تربة طميية',
    'Red': 'تربة حمراء',
    'Sandy Loam': 'تربة رملية',
    'Clayey Soil': 'تربة طينية',
  },
  es: {
    'Black Cotton Soil (Vertisol)': 'Suelo negro (Vertisol)',
    'Alluvial Loam': 'Suelo aluvial',
    'Red': 'Suelo rojo',
    'Sandy Loam': 'Franco arenoso',
    'Clayey Soil': 'Suelo arcilloso',
  },
  fr: {
    'Black Cotton Soil (Vertisol)': 'Sol noir (Vertisol)',
    'Alluvial Loam': 'Limon alluvial',
    'Red': 'Sol rouge',
    'Sandy Loam': 'Limon sablonneux',
    'Clayey Soil': 'Sol argileux',
  },
  pt: {
    'Black Cotton Soil (Vertisol)': 'Solo negro (Vertissolo)',
    'Alluvial Loam': 'Solo aluvial',
    'Red': 'Solo vermelho',
    'Sandy Loam': 'Franco-arenoso',
    'Clayey Soil': 'Solo argiloso',
  },
  ru: {
    'Black Cotton Soil (Vertisol)': 'Чернозем / Вертисоль',
    'Alluvial Loam': 'Аллювиальный суглинок',
    'Red': 'Краснозем',
    'Sandy Loam': 'Супесчаная почва',
    'Clayey Soil': 'Глинистая почва',
  },
  zh: {
    'Black Cotton Soil (Vertisol)': '黑棉土 (变性土)',
    'Alluvial Loam': '冲积壤土',
    'Red': '红壤 / 红土',
    'Sandy Loam': '砂质壤土',
    'Clayey Soil': '黏土',
  },
};

export const IRRIGATION_TRANSLATIONS: Record<string, Record<string, string>> = {
  te: {
    'Drip Irrigation': 'బిందు సేద్యం',
    'Rainfed': 'వర్షాధారితం',
    'Sprinkler': 'తుంపర సేద్యం',
    'Canal': 'కాలువ',
    'Borewell / Tube well': 'బోరుబావి / ట్యూబ్‌వెల్',
  },
  hi: {
    'Drip Irrigation': 'टपक सिंचाई',
    'Rainfed': 'वर्षा आधारित',
    'Sprinkler': 'फव्वारा सिंचाई',
    'Canal': 'नहर सिंचाई',
    'Borewell / Tube well': 'नलकूप / बोरवेल',
  },
  ta: {
    'Drip Irrigation': 'சொட்டு நீர் பாசனம்',
    'Rainfed': 'மானாவாரி',
    'Sprinkler': 'தெளிப்பு நீர் பாசனம்',
    'Canal': 'கால்வாய் பாசனம்',
    'Borewell / Tube well': 'ஆழ்துளை கிணறு',
  },
  kn: {
    'Drip Irrigation': 'హని నీರಾವರಿ',
    'Rainfed': 'ಮಳೆಯಾಶ್ರಿತ',
    'Sprinkler': 'ತುಂತುರು నీರಾವರಿ',
    'Canal': 'ಕಾಲುವೆ నీರಾವರಿ',
    'Borewell / Tube well': 'ಬೋರ್‌ವೆಲ್ / ಕೊಳವೆಬಾವಿ',
  },
  ml: {
    'Drip Irrigation': 'തുള്ളിനന',
    'Rainfed': 'മഴയെ ആശ്രയിച്ച്',
    'Sprinkler': 'തളിക്കൽ നന',
    'Canal': 'കനാൽ നന',
    'Borewell / Tube well': 'കുഴൽക്കിണർ',
  },
  mr: {
    'Drip Irrigation': 'ठिबक सिंचन',
    'Rainfed': 'कोरडवाहू (पावसावर)',
    'Sprinkler': 'तुषार सिंचन',
    'Canal': 'कालवा सिंचन',
    'Borewell / Tube well': 'बोअरवेल / कूपनलिका',
  },
  gu: {
    'Drip Irrigation': 'ટપક પદ્ધતિ',
    'Rainfed': 'વરસાદ આધારિત',
    'Sprinkler': 'ફુવારા પદ્ધતિ',
    'Canal': 'નહેર સિંચાઈ',
    'Borewell / Tube well': 'બોરવેલ / ટ્યુબવેલ',
  },
  bn: {
    'Drip Irrigation': 'ড্রিপ সেচ',
    'Rainfed': 'বৃষ্টি নির্ভর',
    'Sprinkler': 'স্প্রিংকলার সেচ',
    'Canal': 'খাল সেচ',
    'Borewell / Tube well': 'নলকূপ',
  },
  pa: {
    'Drip Irrigation': 'ਤੁਪਕਾ ਸਿੰਚਾਈ',
    'Rainfed': 'ਮੀਂਹ ਆਧਾਰਿਤ',
    'Sprinkler': 'ਫੁਹਾਰਾ ਸਿੰਚਾਈ',
    'Canal': 'ਨਹਿਰੀ ਸਿੰਚਾਈ',
    'Borewell / Tube well': 'ਟਿਊਬਵੈੱਲ / ਬੋਰਵੈੱਲ',
  },
  or: {
    'Drip Irrigation': 'ବିନ୍ଦୁ ଜଳସେଚନ',
    'Rainfed': 'ବର୍ଷା ନିର୍ଭର',
    'Sprinkler': 'ସ୍ପ୍ରିଙ୍କଲର ଜଳସେଚନ',
    'Canal': 'କେନାଲ ଜଳସେଚନ',
    'Borewell / Tube well': 'ନଳକୂପ',
  },
  as: {
    'Drip Irrigation': 'টোপাল জলসিঞ্চন',
    'Rainfed': 'বৰষুণৰ ওপৰত নিৰ্ভৰশীল',
    'Sprinkler': 'স্প্ৰিংকলাৰ জলসিঞ্চন',
    'Canal': 'খাল জলসিঞ্চন',
    'Borewell / Tube well': 'নলকূপ',
  },
  ur: {
    'Drip Irrigation': 'ڈرپ ایریگیشن',
    'Rainfed': 'بارانی',
    'Sprinkler': 'سپرنکلر',
    'Canal': 'نہر',
    'Borewell / Tube well': 'ٹیوب ویل / بور ویل',
  },
  ar: {
    'Drip Irrigation': 'الري بالتنقيط',
    'Rainfed': 'بعلي (مطري)',
    'Sprinkler': 'الري بالرش',
    'Canal': 'الري بالقنوات',
    'Borewell / Tube well': 'بئر أنبوبي',
  },
  es: {
    'Drip Irrigation': 'Riego por goteo',
    'Rainfed': 'Temporal (de lluvia)',
    'Sprinkler': 'Riego por aspersión',
    'Canal': 'Riego por canal',
    'Borewell / Tube well': 'Pozo / Tubo de agua',
  },
  fr: {
    'Drip Irrigation': 'Irrigation au goutte-à-goutte',
    'Rainfed': 'Culture pluviale',
    'Sprinkler': 'Irrigation par aspersion',
    'Canal': 'Irrigation par canal',
    'Borewell / Tube well': 'Puits foré',
  },
  pt: {
    'Drip Irrigation': 'Irrigação por gotejamento',
    'Rainfed': 'Sequeiro (pluvial)',
    'Sprinkler': 'Irrigação por aspersão',
    'Canal': 'Irrigação por canal',
    'Borewell / Tube well': 'Poço artesiano',
  },
  ru: {
    'Drip Irrigation': 'Капельное орошение',
    'Rainfed': 'Богарное (богара)',
    'Sprinkler': 'Дождевание',
    'Canal': 'Канальное орошение',
    'Borewell / Tube well': 'Скважина',
  },
  zh: {
    'Drip Irrigation': '滴灌',
    'Rainfed': '雨养 / 靠天吃饭',
    'Sprinkler': '喷灌',
    'Canal': '渠道灌溉',
    'Borewell / Tube well': '深井 / 管井灌溉',
  },
};

export const GROWTH_STAGE_TRANSLATIONS: Record<string, Record<string, string>> = {
  te: {
    'Germination': 'మొలక దశ',
    'Vegetative': 'శాకీయ పెరుగుదల దశ',
    'Flowering': 'పూత దశ',
    'Grain filling': 'గింజ తయారయ్యే దశ',
    'Maturity': 'పక్వత / కోత దశ',
  },
  hi: {
    'Germination': 'अंकुरण',
    'Vegetative': 'वानस्पतिक वृद्धि',
    'Flowering': 'फूल आना / पुष्पन',
    'Grain filling': 'दाना भराव',
    'Maturity': 'परिपक्वता',
  },
  ta: {
    'Germination': 'முளைப்பு நிலை',
    'Vegetative': 'வளர்ச்சி நிலை',
    'Flowering': 'பூக்கும் நிலை',
    'Grain filling': 'தானிய நிரப்பு நிலை',
    'Maturity': 'முதிர்ச்சி நிலை',
  },
  kn: {
    'Germination': 'ಮೊಳಕೆಯೊಡೆಯುವಿಕೆ',
    'Vegetative': 'ಸಸ್ಯಕ ಹಂತ',
    'Flowering': 'ಹೂ ಬಿಡುವ ಹಂತ',
    'Grain filling': 'ಕಾಳು ತುಂಬುವ ಹಂತ',
    'Maturity': 'ಪಕ್ವತೆ ಹಂತ',
  },
  ml: {
    'Germination': 'മുളയ്ക്കൽ',
    'Vegetative': 'കായിക വളർച്ച',
    'Flowering': 'പൂവിടൽ',
    'Grain filling': 'ധാന്യങ്ങൾ നിറയൽ',
    'Maturity': 'വിളവെടുപ്പ് പക്വത',
  },
  mr: {
    'Germination': 'अंकुरण',
    'Vegetative': 'शाकीय वाढ',
    'Flowering': 'फुलोरा',
    'Grain filling': 'दाणे भरणे',
    'Maturity': 'परिपक्वता',
  },
  gu: {
    'Germination': 'અંકુરણ',
    'Vegetative': 'વાનસ્પતિક વૃદ્ધિ',
    'Flowering': 'ફૂલ આવવા',
    'Grain filling': 'દાણા ભરાવા',
    'Maturity': 'પરિપક્વતા',
  },
  bn: {
    'Germination': 'অঙ্কুরোদগম',
    'Vegetative': 'অঙ্গজ বৃদ্ধি',
    'Flowering': 'ফুল ফোটা',
    'Grain filling': 'দানা গঠন',
    'Maturity': 'পরিপক্বতা',
  },
  pa: {
    'Germination': 'ਪੁੰਗਰਨਾ',
    'Vegetative': 'ਬਨਸਪਤੀ ਵਾਧਾ',
    'Flowering': 'ਫੁੱਲ ਪੈਣਾ',
    'Grain filling': 'ਦਾਣਾ ਭਰਨਾ',
    'Maturity': 'ਪੱਕਣਾ',
  },
  or: {
    'Germination': 'ଗଜା ହେବା',
    'Vegetative': 'ଶାଖା ପ୍ରଶାଖା ବୃଦ୍ଧି',
    'Flowering': 'ଫୁଲ ଫୁଟିବା',
    'Grain filling': 'ଦାନା ବାନ୍ଧିବା',
    'Maturity': 'ପାଚିବା',
  },
  as: {
    'Germination': 'অংকুৰণ',
    'Vegetative': 'অঙ্গজ বৃদ্ধি',
    'Flowering': 'ফুল ধৰা',
    'Grain filling': 'দানা বন্ধা',
    'Maturity': 'প্ৰাপ্তি / পকা',
  },
  ur: {
    'Germination': 'پھوٹنا',
    'Vegetative': 'نباتی نشوونما',
    'Flowering': 'پھول آنا',
    'Grain filling': 'دانہ بھرنا',
    'Maturity': 'پختگی',
  },
  ar: {
    'Germination': 'الإنبات',
    'Vegetative': 'النمو الخضري',
    'Flowering': 'الإزهار',
    'Grain filling': 'امتلاء الحبوب',
    'Maturity': 'النضج',
  },
  es: {
    'Germination': 'Germinación',
    'Vegetative': 'Etapa vegetativa',
    'Flowering': 'Floración',
    'Grain filling': 'Llenado de grano',
    'Maturity': 'Madurez',
  },
  fr: {
    'Germination': 'Germination',
    'Vegetative': 'Stade végétatif',
    'Flowering': 'Floraison',
    'Grain filling': 'Remplissage des grains',
    'Maturity': 'Maturité',
  },
  pt: {
    'Germination': 'Germinação',
    'Vegetative': 'Fase vegetativa',
    'Flowering': 'Floração',
    'Grain filling': 'Enchimento de grãos',
    'Maturity': 'Maturação',
  },
  ru: {
    'Germination': 'Прорастание',
    'Vegetative': 'Вегетация',
    'Flowering': 'Цветение',
    'Grain filling': 'Налив зерна',
    'Maturity': 'Созревание',
  },
  zh: {
    'Growth Stage': '生长阶段',
    'Germination': '发芽期',
    'Vegetative': '营养生长阶段',
    'Flowering': '开花期',
    'Grain filling': '灌浆期',
    'Maturity': '成熟期',
  },
};

export const COUNTRY_TRANSLATIONS: Record<string, Record<string, string>> = {
  te: {
    'India': 'భారతదేశం',
    'Brazil': 'బ్రెజిల్',
    'Russia': 'రష్యా',
    'China': 'చైనా',
    'South Africa': 'దక్షిణాఫ్రికా',
    'Egypt': 'ఈజిప్ట్',
    'Ethiopia': 'ఇథియోపియా',
    'UAE': 'యునైటెడ్ అరబ్ ఎమిరేట్స్',
  },
  hi: {
    'India': 'भारत',
    'Brazil': 'ब्राजील',
    'Russia': 'रूस',
    'China': 'चीन',
    'South Africa': 'दक्षिण अफ्रीका',
    'Egypt': 'मिस्र',
    'Ethiopia': 'इथियोपिया',
    'UAE': 'संयुक्त अरब अमीरात',
  },
  ta: {
    'India': 'இந்தியா',
    'Brazil': 'பிரேசில்',
    'Russia': 'ரஷ்யா',
    'China': 'சீனா',
    'South Africa': 'தென்னாப்பிரிக்கா',
    'Egypt': 'எகிப்து',
    'Ethiopia': 'எத்தியோப்பியா',
    'UAE': 'ஐக்கிய அரபு எமிரேட்ஸ்',
  },
  kn: {
    'India': 'ಭಾರತ',
    'Brazil': 'ಬ್ರೆಜಿಲ್',
    'Russia': 'ರಷ್ಯಾ',
    'China': 'ಚೀನಾ',
    'South Africa': 'ದಕ್ಷಿಣ ಆಫ್ರಿಕಾ',
  },
  mr: {
    'India': 'भारत',
    'Brazil': 'ब्राझील',
    'Russia': 'रशिया',
    'China': 'चीन',
    'South Africa': 'दक्षिण आफ्रिका',
  },
  gu: {
    'India': 'ભારત',
    'Brazil': 'બ્રાઝિલ',
    'Russia': 'રશિયા',
    'China': 'ચીન',
  },
  bn: {
    'India': 'ভারত',
    'Brazil': 'ব্রাজিল',
    'Russia': 'রাশিয়া',
    'China': 'চীন',
  },
  pa: {
    'India': 'ਭਾਰਤ',
    'Brazil': 'ਬ੍ਰਾਜ਼ੀਲ',
    'Russia': 'ਰੂਸ',
    'China': 'ਚੀਨ',
  },
  or: {
    'India': 'ଭାରତ',
    'Brazil': 'ବ୍ରାଜିଲ୍',
    'Russia': 'ରୁଷିଆ',
    'China': 'ଚୀନ୍',
  },
  as: {
    'India': 'ভাৰত',
    'Brazil': 'ব্ৰাজিল',
    'Russia': 'ৰাছিয়া',
    'China': 'চীন',
  },
  ur: {
    'India': 'بھارت',
    'Brazil': 'برازیل',
    'Russia': 'روس',
    'China': 'چین',
  },
  ar: {
    'India': 'الهند',
    'Brazil': 'البرازيل',
    'Russia': 'روسيا',
    'China': 'الصين',
  },
  es: {
    'India': 'India',
    'Brazil': 'Brasil',
    'Russia': 'Rusia',
    'China': 'China',
  },
  fr: {
    'India': 'Inde',
    'Brazil': 'Brésil',
    'Russia': 'Russie',
    'China': 'Chine',
  },
  pt: {
    'India': 'Índia',
    'Brazil': 'Brasil',
    'Russia': 'Rússia',
    'China': 'China',
  },
  ru: {
    'India': 'Индия',
    'Brazil': 'Бразилия',
    'Russia': 'Россия',
    'China': 'Китай',
  },
  zh: {
    'India': '印度',
    'Brazil': '巴西',
    'Russia': '俄罗斯',
    'China': '中国',
  },
};

export const UNIT_TRANSLATIONS: Record<string, Record<string, string>> = {
  te: {
    'acres': 'ఎకరాలు',
    'hectares': 'హెక్టార్లు',
  },
  hi: {
    'acres': 'एकड़',
    'hectares': 'हेक्टेयर',
  },
  ta: {
    'acres': 'ஏக்கர்',
    'hectares': 'ஹெக்டேர்',
  },
  kn: {
    'acres': 'ಎಕರೆ',
    'hectares': 'ಹೆಕ್ಟೇರ್',
  },
  mr: {
    'acres': 'एकर',
    'hectares': 'हेक्टर',
  },
  ml: {
    'acres': 'ഏക്കർ',
    'hectares': 'ഹെക്ടർ',
  },
  gu: {
    'acres': 'એકર',
    'hectares': 'હેક્ટર',
  },
  bn: {
    'acres': 'একর',
    'hectares': 'হেক্টর',
  },
  pa: {
    'acres': 'ਏਕੜ',
    'hectares': 'ਹੈਕਟੇਅਰ',
  },
  or: {
    'acres': 'ଏକର',
    'hectares': 'ହେକ୍ଟର',
  },
  as: {
    'acres': 'একৰ',
    'hectares': 'হেক্টৰ',
  },
  ur: {
    'acres': 'ایکڑ',
    'hectares': 'ہیکٹر',
  },
  ar: {
    'acres': 'فدان / أكر',
    'hectares': 'هكتار',
  },
  es: {
    'acres': 'Acres',
    'hectares': 'Hectáreas',
  },
  fr: {
    'acres': 'Acres',
    'hectares': 'Hectares',
  },
  pt: {
    'acres': 'Acres',
    'hectares': 'Hectares',
  },
  ru: {
    'acres': 'Акры',
    'hectares': 'Гектары',
  },
  zh: {
    'acres': '英亩',
    'hectares': '公顷',
  },
};

// Pure Localization Helpers (returns translated string or original)
export function localizeState(state: string, lang: Language): string {
  if (!state) return '';
  const norm = normalizeLang(lang);
  if (norm === 'en') return state;
  const dict = STATE_NAMES[norm] || {};
  if (dict[state]) return dict[state];
  const lower = state.toLowerCase();
  for (const k of Object.keys(dict)) {
    if (k.toLowerCase() === lower) return dict[k];
  }
  return state;
}

export function localizeDistrict(district: string, lang: Language): string {
  if (!district) return '';
  const norm = normalizeLang(lang);
  if (norm === 'en') return district;
  const dict = DISTRICT_NAMES[norm] || {};
  if (dict[district]) return dict[district];
  const lower = district.toLowerCase();
  for (const k of Object.keys(dict)) {
    if (k.toLowerCase() === lower) return dict[k];
  }
  return district;
}

export function localizeSubDistrict(subDistrict: string, lang: Language): string {
  if (!subDistrict) return '';
  const norm = normalizeLang(lang);
  if (norm === 'en') return subDistrict;
  if (SUB_DISTRICT_NAMES[norm]?.[subDistrict]) {
    return SUB_DISTRICT_NAMES[norm][subDistrict];
  }

  const ruralUrbanMap: Record<string, Record<string, string>> = {
    te: { 'Rural': 'గ్రామీణ', 'Urban': 'పట్టణ', 'North': 'ఉత్తర', 'South': 'దక్షిణ', 'East': 'తూర్పు', 'West': 'పశ్చిమ' },
    hi: { 'Rural': 'ग्रामीण', 'Urban': 'शहरी', 'North': 'उत्तर', 'South': 'दक्षिण', 'East': 'पूर्व', 'West': 'पश्चिम' },
    ta: { 'Rural': 'கிராமப்புறம்', 'Urban': 'நகர்ப்புறம்', 'North': 'வடக்கு', 'South': 'தெற்கு', 'East': 'கிழக்கு', 'West': 'மேற்கு' },
    kn: { 'Rural': 'ಗ್ರಾಮೀಣ', 'Urban': 'ನಗರ', 'North': 'ಉತ್ತರ', 'South': 'ದಕ್ಷಿಣ', 'East': 'ಪೂರ್ವ', 'West': 'ಪಶ್ಚಿಮ' },
    mr: { 'Rural': 'ग्रामीण', 'Urban': 'शहरी', 'North': 'उत्तर', 'South': 'दक्षिण', 'East': 'पूर्व', 'West': 'पश्चिम' },
    pa: { 'Rural': 'ਪੇਂਡੂ', 'Urban': 'ਸ਼ਹਿਰੀ', 'North': 'ਉੱਤਰ', 'South': 'ਦੱਖਣ', 'East': 'ਪੂਰਬ', 'West': 'ਪੱਛਮ' },
    bn: { 'Rural': 'গ্রামীণ', 'Urban': 'শহুরে', 'North': 'উত্তর', 'South': 'দক্ষিণ', 'East': 'পূর্ব', 'West': 'পশ্চিম' },
    gu: { 'Rural': 'ગ્રામીણ', 'Urban': 'શહેરી', 'North': 'ઉત્તર', 'South': 'દક્ષિણ', 'East': 'પૂર્વ', 'West': 'પશ્ચિમ' },
    ml: { 'Rural': 'ഗ്രാമീണ', 'Urban': 'നഗര', 'North': 'വടക്ക്', 'South': 'തെക്ക്', 'East': 'കിഴക്ക്', 'West': 'പടിഞ്ഞാറ്' },
    or: { 'Rural': 'ଗ୍ରାମୀଣ', 'Urban': 'ସହରୀ', 'North': 'ଉତ୍ତର', 'South': 'ଦକ୍ଷିଣ', 'East': 'ପୂର୍ବ', 'West': 'ପଶ୍ଚିମ' },
  };

  const ru = ruralUrbanMap[norm];
  if (ru) {
    for (const [kw, trans] of Object.entries(ru)) {
      if (subDistrict.includes(kw)) {
        const base = subDistrict.replace(kw, '').trim();
        const baseTrans = DISTRICT_NAMES[norm]?.[base] || SUB_DISTRICT_NAMES[norm]?.[base] || base;
        return `${baseTrans} ${trans}`.trim();
      }
    }
  }

  if (DISTRICT_NAMES[norm]?.[subDistrict]) {
    return DISTRICT_NAMES[norm][subDistrict];
  }

  return subDistrict;
}

export function localizeCrop(crop: string, lang: Language): string {
  if (!crop) return '';
  const norm = normalizeLang(lang);
  if (norm === 'en') return crop;
  const dict = CROP_TRANSLATIONS[norm] || {};
  if (dict[crop]) return dict[crop];
  const lower = crop.toLowerCase();
  for (const k of Object.keys(dict)) {
    if (k.toLowerCase() === lower) return dict[k];
  }
  return crop;
}

export function localizeSoilType(soil: string, lang: Language): string {
  if (!soil) return '';
  const norm = normalizeLang(lang);
  if (norm === 'en') return soil;
  const dict = SOIL_TRANSLATIONS[norm] || {};
  if (dict[soil]) return dict[soil];
  const lower = soil.toLowerCase();
  for (const k of Object.keys(dict)) {
    if (k.toLowerCase() === lower) return dict[k];
  }
  return soil;
}

export function localizeIrrigation(irr: string, lang: Language): string {
  if (!irr) return '';
  const norm = normalizeLang(lang);
  if (norm === 'en') return irr;
  const dict = IRRIGATION_TRANSLATIONS[norm] || {};
  if (dict[irr]) return dict[irr];
  const lower = irr.toLowerCase();
  for (const k of Object.keys(dict)) {
    if (k.toLowerCase() === lower) return dict[k];
  }
  return irr;
}

export function localizeGrowthStage(stage: string, lang: Language): string {
  if (!stage) return '';
  const norm = normalizeLang(lang);
  if (norm === 'en') return stage;
  const dict = GROWTH_STAGE_TRANSLATIONS[norm] || {};
  if (dict[stage]) return dict[stage];
  const lower = stage.toLowerCase();
  for (const k of Object.keys(dict)) {
    if (k.toLowerCase() === lower) return dict[k];
  }
  return stage;
}

export function localizeCountry(country: string, lang: Language): string {
  if (!country) return '';
  const norm = normalizeLang(lang);
  if (norm === 'en') return country;
  const dict = COUNTRY_TRANSLATIONS[norm] || {};
  if (dict[country]) return dict[country];
  const lower = country.toLowerCase();
  for (const k of Object.keys(dict)) {
    if (k.toLowerCase() === lower) return dict[k];
  }
  return country;
}

export function localizeFarmName(farmName: string, lang: Language): string {
  if (!farmName) return '';
  const norm = normalizeLang(lang);
  if (norm === 'en') return farmName;

  const directMap: Record<string, Record<string, string>> = {
    te: {
      'My Farm': 'నా పొలం',
      'Green Valley Farm': 'గ్రీన్ వ్యాలీ ఫార్మ్',
      'Telangana Farm': 'తెలంగాణ పొలం',
      'Telangana Cotton Farm': 'తెలంగాణ పత్తి పొలం',
      'Cotton Farm': 'పత్తి పొలం',
      'Rice Farm': 'వరి పొలం',
      'Wheat Farm': 'గోధుమ పొలం',
      'Punjab Farm': 'పంజాబ్ పొలం',
      'Punjab Wheat Farm': 'పంజాబ్ గోధుమ పొలం',
      'Sunrise Farm': 'సన్‌రైజ్ పొలం',
      'Organic Farm': 'సేంద్రీయ పొలం',
    },
    hi: {
      'My Farm': 'मेरा खेत',
      'Green Valley Farm': 'ग्रीन वैली फार्म',
      'Telangana Farm': 'तेलंगाना खेत',
      'Telangana Cotton Farm': 'तेलंगाना कपास खेत',
      'Cotton Farm': 'कपास खेत',
      'Rice Farm': 'चावल खेत',
      'Wheat Farm': 'गेहूं खेत',
      'Punjab Farm': 'पंजाब खेत',
      'Punjab Wheat Farm': 'पंजाब गेहूं खेत',
      'Sunrise Farm': 'सनराइज खेत',
      'Organic Farm': 'जैविक खेत',
    },
    ta: {
      'My Farm': 'என் பண்ணை',
      'Green Valley Farm': 'கிரீன் வேலி பண்ணை',
      'Telangana Farm': 'தெலங்கானா பண்ணை',
      'Cotton Farm': 'பருத்தி பண்ணை',
      'Rice Farm': 'நெல் பண்ணை',
      'Wheat Farm': 'கோதுமை பண்ணை',
      'Organic Farm': 'இயற்கை பண்ணை',
    },
    kn: {
      'My Farm': 'ನನ್ನ ಜಮೀನು',
      'Green Valley Farm': 'ಗ್ರೀನ್ ವ್ಯಾಲಿ ಫಾರ್ಮ್',
      'Cotton Farm': 'ಹತ್ತಿ ಜಮೀನು',
      'Rice Farm': 'ಭತ್ತದ ಜಮೀನು',
      'Wheat Farm': 'ಗೋಧಿ ಜಮೀನು',
      'Organic Farm': 'ಸಾವಯವ ಜಮೀನು',
    },
    mr: {
      'My Farm': 'माझे शेत',
      'Green Valley Farm': 'ग्रीन व्हॅली फार्म',
      'Cotton Farm': 'कापूस शेत',
      'Rice Farm': 'भात शेत',
      'Wheat Farm': 'गहू शेत',
      'Organic Farm': 'सेंद्रिय शेत',
    },
    bn: {
      'My Farm': 'আমার খামার',
      'Green Valley Farm': 'গ্রিন ভ্যালি খামার',
      'Cotton Farm': 'তুলা খামার',
      'Rice Farm': 'ধান খামার',
      'Wheat Farm': 'গম খামার',
    },
    gu: {
      'My Farm': 'મારું ખેતર',
      'Green Valley Farm': 'ગ્રીન વેલી ફાર્મ',
      'Cotton Farm': 'કપાસ ખેતર',
      'Rice Farm': 'ડાંગર ખેતર',
      'Wheat Farm': 'ઘઉં ખેતર',
    },
    pa: {
      'My Farm': 'ਮੇਰਾ ਖੇਤ',
      'Green Valley Farm': 'ਗਰੀਨ ਵੈਲੀ ਫਾਰਮ',
      'Cotton Farm': 'ਨਰਮਾ ਖੇਤ',
      'Rice Farm': 'ਝੋਨਾ ਖੇਤ',
      'Wheat Farm': 'ਕਣਕ ਖੇਤ',
      'Punjab Wheat Farm': 'ਪੰਜਾਬ ਕਣਕ ਖੇਤ',
    },
  };

  if (directMap[norm]?.[farmName]) {
    return directMap[norm][farmName];
  }

  const farmWord: Record<string, string> = {
    te: 'పొలం',
    hi: 'खेत',
    ta: 'பண்ணை',
    kn: 'ಜಮೀನು',
    mr: 'शेत',
    bn: 'খামার',
    gu: 'ખેતર',
    pa: 'ਖੇਤ',
    ml: 'ഫാം',
    or: 'ଜମି',
  };

  let translated = farmName;
  if (/\bFarm\b/i.test(farmName) && farmWord[norm]) {
    translated = translated.replace(/\bFarm\b/gi, farmWord[norm]);
  }

  const stateKeys = Object.keys(STATE_NAMES[norm] || {});
  for (const st of stateKeys) {
    if (new RegExp(`\\b${st}\\b`, 'i').test(translated)) {
      translated = translated.replace(new RegExp(`\\b${st}\\b`, 'gi'), STATE_NAMES[norm][st]);
    }
  }

  const cropKeys = Object.keys(CROP_TRANSLATIONS[norm] || {});
  for (const cr of cropKeys) {
    if (new RegExp(`\\b${cr}\\b`, 'i').test(translated)) {
      translated = translated.replace(new RegExp(`\\b${cr}\\b`, 'gi'), CROP_TRANSLATIONS[norm][cr]);
    }
  }

  const distKeys = Object.keys(DISTRICT_NAMES[norm] || {});
  for (const dt of distKeys) {
    if (new RegExp(`\\b${dt}\\b`, 'i').test(translated)) {
      translated = translated.replace(new RegExp(`\\b${dt}\\b`, 'gi'), DISTRICT_NAMES[norm][dt]);
    }
  }

  if (translated && translated !== farmName) {
    return translated;
  }
  return farmName;
}

export function localizeFarmingType(farmingType: string, lang: Language): string {
  if (!farmingType) return '';
  const norm = normalizeLang(lang);
  if (norm === 'en') return farmingType;

  const directMap: Record<string, Record<string, string>> = {
    te: {
      'Organic': 'సేంద్రీయ',
      'Conventional': 'సాంప్రదాయ',
      'Regenerative': 'పునరుత్పాదక',
      'Hydroponic': 'హైడ్రోపోనిక్',
      'Natural': 'సహజ',
    },
    hi: {
      'Organic': 'जैविक',
      'Conventional': 'पारंपरिक',
      'Regenerative': 'पुनर्योजी',
      'Hydroponic': 'हाइड्रोपोनिक',
      'Natural': 'प्राकृतिक',
    },
    ta: {
      'Organic': 'இயற்கை',
      'Conventional': 'பாரம்பரிய',
      'Regenerative': 'மீளுருவாக்கம்',
      'Hydroponic': 'ஹைட்ரோபோனிக்',
      'Natural': 'இயற்கை வழி',
    },
    kn: {
      'Organic': 'ಸಾವಯವ',
      'Conventional': 'ಸಾಂಪ್ರದಾಯಿಕ',
      'Regenerative': 'ಪುನರುತ್ಪಾದಕ',
      'Hydroponic': 'ಹೈಡ್ರೋಪೋನಿಕ್',
      'Natural': 'ನೈಸರ್ಗಿಕ',
    },
    mr: {
      'Organic': 'सेंद्रिय',
      'Conventional': 'पारंपरिक',
      'Regenerative': 'पुनरुत्पादक',
      'Hydroponic': 'हायड्रोपोनिक',
      'Natural': 'नैसर्गिक',
    },
    bn: {
      'Organic': 'জৈব',
      'Conventional': 'প্রচলিত',
      'Regenerative': 'পুনরুৎপাদনশীল',
      'Hydroponic': 'হাইড্রোপনিক',
      'Natural': 'প্রাকৃতিক',
    },
    gu: {
      'Organic': 'ઓર્ગેનિક / સજીવ',
      'Conventional': 'પરંપરાગત',
      'Regenerative': 'પુનર્જીવિત',
      'Hydroponic': 'હાઇડ્રોપોનિક',
      'Natural': 'કુદરતી',
    },
    pa: {
      'Organic': 'ਜੈਵਿਕ',
      'Conventional': 'ਪਰੰਪਰਾਗਤ',
      'Regenerative': 'ਪੁਨਰਜਨਮ',
      'Hydroponic': 'ਹਾਈਡ੍ਰੋਪੋਨਿਕ',
      'Natural': 'ਕੁਦਰਤੀ',
    },
    ml: {
      'Organic': 'ജൈവ',
      'Conventional': 'പരമ്പരാഗത',
      'Regenerative': 'പുനരുൽപ്പാദനക്ഷമമായ',
      'Hydroponic': 'ഹൈഡ്രോപോണിക്',
      'Natural': 'സ്വാഭാവിക',
    },
    or: {
      'Organic': 'ଜୈବିକ',
      'Conventional': 'ପାରମ୍ପରିକ',
      'Regenerative': 'ପୁନର୍ଜନ୍ମ',
      'Hydroponic': 'ହାଇଡ୍ରୋପୋନିକ୍',
      'Natural': 'ପ୍ରାକୃତିକ',
    }
  };

  const clean = farmingType.trim();
  if (directMap[norm]?.[clean]) {
    return directMap[norm][clean];
  }

  // Handle case-insensitive fallback
  const lower = clean.toLowerCase();
  const dict = directMap[norm] || {};
  for (const [k, v] of Object.entries(dict)) {
    if (k.toLowerCase() === lower) {
      return v;
    }
  }

  return farmingType;
}

export function localizeFarmUnit(unit: string, lang: Language): string {
  if (!unit) return '';
  const norm = normalizeLang(lang);
  return UNIT_TRANSLATIONS[norm]?.[unit] || unit;
}

export function getFarmCropTranslation(crop: string, lang: Language): string {
  return localizeCrop(crop, lang);
}

export function getFarmSoilTranslation(soil: string, lang: Language): string {
  return localizeSoilType(soil, lang);
}

export function getFarmIrrigationTranslation(irr: string, lang: Language): string {
  return localizeIrrigation(irr, lang);
}

export function getFarmGrowthStageTranslation(stage: string, lang: Language): string {
  return localizeGrowthStage(stage, lang);
}

export function getFarmCountryTranslation(country: string, lang: Language): string {
  return localizeCountry(country, lang);
}

export function isTextInLanguageScript(text: string, lang: Language): boolean {
  if (!text || !text.trim()) return false;
  const norm = normalizeLang(lang);
  switch (norm) {
    case 'te':
      return /[\u0C00-\u0C7F]/.test(text);
    case 'hi':
    case 'mr':
      return /[\u0900-\u097F]/.test(text);
    case 'ta':
      return /[\u0B80-\u0BFF]/.test(text);
    case 'kn':
      return /[\u0C80-\u0CFF]/.test(text);
    case 'ml':
      return /[\u0D00-\u0D7F]/.test(text);
    case 'bn':
      return /[\u0980-\u09FF]/.test(text);
    case 'gu':
      return /[\u0A80-\u0AFF]/.test(text);
    case 'pa':
      return /[\u0A00-\u0A7F]/.test(text);
    case 'or':
      return /[\u0B00-\u0B7F]/.test(text);
    default:
      return /[\u0900-\u0D7F]/.test(text);
  }
}

export function translatePlaceName(name: string, lang: Language): string {
  if (!name || !name.trim()) return '';
  const norm = normalizeLang(lang);
  if (norm === 'en') return '';
  if (isTextInLanguageScript(name, lang)) return '';

  const clean = name.trim();

  if (SUB_DISTRICT_NAMES[norm]?.[clean]) {
    return SUB_DISTRICT_NAMES[norm][clean];
  }
  if (DISTRICT_NAMES[norm]?.[clean]) {
    return DISTRICT_NAMES[norm][clean];
  }
  if (STATE_NAMES[norm]?.[clean]) {
    return STATE_NAMES[norm][clean];
  }

  const lower = clean.toLowerCase();
  const subDict = SUB_DISTRICT_NAMES[norm] || {};
  for (const k of Object.keys(subDict)) {
    if (k.toLowerCase() === lower) {
      return subDict[k];
    }
  }

  const distDict = DISTRICT_NAMES[norm] || {};
  for (const k of Object.keys(distDict)) {
    if (k.toLowerCase() === lower) {
      return distDict[k];
    }
  }

  const localized = localizeSubDistrict(clean, lang);
  if (localized && localized !== clean) {
    return localized;
  }

  return '';
}
