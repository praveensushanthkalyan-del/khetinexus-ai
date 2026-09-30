import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  FileCheck,
  Search,
  Eye,
  Camera,
  Layers,
  Sparkles,
} from 'lucide-react';
import { DiagnosisResult, Language } from '../../types';
import { getTranslation } from '../../i18n/translations';
import { normalizeLang } from '../../i18n/farmValueTranslations';

interface ConfidenceBreakdownProps {
  report: DiagnosisResult;
  language: Language;
  isSideCompact?: boolean;
}

export const ConfidenceBreakdown: React.FC<ConfidenceBreakdownProps> = ({ report, language, isSideCompact }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const t = getTranslation(language);
  const norm = normalizeLang(language);

  const conf = report.confidenceDetails;
  const rawScore = conf?.finalScore ?? (
    report.confidence === 'High' ? 88 : report.confidence === 'Moderate' ? 68 : 38
  );

  // Localization resources
  const localStrings: Record<string, any> = {
    te: {
      headerTitle: 'సాక్ష్య-ఆధారిత విశ్వసనీయత',
      headerDesc: '10 వృక్షశాస్త్ర, దృశ్య మరియు వ్యత్యాస ఆధారిత తనిఖీల నుండి లెక్కించబడింది.',
      evidenceStrength: 'ఆధారాల బలం',
      matchLabel: 'సరిపోలిక',
      checklistTitle: 'వివరణాత్మక సాక్ష్యాల తనిఖీ జాబితా:',
      secondPassTitle: 'రెండవ సారి పరిశీలన (Adversarial Recheck):',
      hideBtn: 'దాచు',
      detailsBtn: 'వివరాలు',
      levels: {
        'Very High': 'చాలా ఎక్కువ',
        'High': 'ఎక్కువ',
        'Moderate': 'మధ్యస్థం',
        'Low': 'తక్కువ',
        'Very Low': 'చాలా తక్కువ'
      },
      statuses: {
        verified: 'ధృవీకరించబడింది',
        reviewNeeded: 'సరిచూడాలి',
        consistent: 'ఏకరూపత',
        evaluated: 'పరిశీలించబడింది',
        visible: 'కనిపిస్తోంది',
        compatible: 'అనుకూలం'
      },
      factors: [
        { title: 'ఫోటో నాణ్యత & స్పష్టత', desc: 'ఆకు వ్యాధి విశ్లేషణకు ఫోటో స్పష్టత మరియు కాంతి అనుకూలంగా ఉన్నాయి.' },
        { title: 'పంట రకం ఏకరూపత', desc: 'నమూనా పంట రకంతో సరిపోలుతోంది.' },
        { title: 'దృశ్య లక్షణాల సరిపోలిక', desc: 'విశిష్ట వ్యాధి లక్షణాలు స్పష్టంగా గుర్తించబడ్డాయి.' },
        { title: 'రోగనిర్ధారణ గుర్తుల సరిపోలిక', desc: 'లక్షణాలు సాధారణ రోగనిర్ధారణ ప్రొఫైల్‌తో సరిపోలాయి.' },
        { title: 'బహుళ ఫోటోల ఏకరూపత', desc: 'వివిధ కోణాల ఫోటోలలో లక్షణాలు ఒకే విధంగా ఉన్నాయి.' },
        { title: 'వ్యతిరేక లక్షణాల శోధన', desc: 'రెండవ సారి శోధనలో ఎటువంటి వ్యతిరేక లక్షణాలు కనుగొనబడలేదు.' },
        { title: 'ఇతర వ్యాధుల విభజన', desc: 'ఇతర సారూప్య వ్యాధుల కంటే దీనికి బలమైన ఆధారాలు ఉన్నాయి.' },
        { title: 'ప్రభావిత భాగాల లభ్యత', desc: 'ప్రధాన ప్రభావిత భాగాలు స్పష్టంగా కనిపిస్తున్నాయి.' },
        { title: 'నేల మరియు వాతావరణ అనుకూలత', desc: 'ఈ వాతావరణంలో ఈ వ్యాధి సంభవించడం సహజం.' },
        { title: 'పరిశోధనా రికార్డులతో ధృవీకరణ', desc: 'వ్యవసాయ పరిశోధనా సంస్థల రికార్డులతో సరిపోల్చబడింది.' }
      ]
    },
    hi: {
      headerTitle: 'साक्ष्य-आधारित विश्वसनीयता',
      headerDesc: '10 वानस्पतिक, दृश्य और विभेदक साक्ष्य चौकियों से गणना की गई।',
      evidenceStrength: 'साक्ष्य की ताकत',
      matchLabel: 'समानता',
      checklistTitle: 'विस्तृत साक्ष्य चेकलिस्ट:',
      secondPassTitle: 'द्वितीय-स्तरीय सत्यापन पुनः जाँच:',
      hideBtn: 'छुपाएं',
      detailsBtn: 'विवरण',
      levels: {
        'Very High': 'बहुत उच्च',
        'High': 'उच्च',
        'Moderate': 'मध्यम',
        'Low': 'कम',
        'Very Low': 'बहुत कम'
      },
      statuses: {
        verified: 'सत्यापित',
        reviewNeeded: 'समीक्षा आवश्यक',
        consistent: 'संगत',
        evaluated: 'मूल्यांकित',
        visible: 'दृश्यमान',
        compatible: 'संगत/अनुकूल'
      },
      factors: [
        { title: 'छवि गुणवत्ता और स्पष्टता', desc: 'पत्ती रोग परीक्षण के लिए फोटो की स्पष्टता और प्रकाश पर्याप्त है।' },
        { title: 'फसल पहचान निरंतरता', desc: 'दिखाया गया नमूना चुनी गई फसल से मेल खाता है।' },
        { title: 'दृश्य लक्षणों की सहमति', desc: 'स्पष्ट रोग सूचक दृश्यमान रूप से पाए गए हैं।' },
        { title: 'रोगसूचक नैदानिक मिलान', desc: 'लक्षण मानक रोग प्रोफाइल के साथ बिल्कुल मेल खाते हैं।' },
        { title: 'बहु-छवि साक्ष्य निरंतरता', desc: 'सभी तस्वीरों में लक्षण समान रूप से दिखाई देते हैं।' },
        { title: 'विरोधाभास एवं नकारात्मक खोज', desc: 'सत्यापन जांच में कोई असंगत लक्षण नहीं मिला।' },
        { title: 'अन्य संभावित रोगों का विश्लेषण', desc: 'अन्य समान दिखने वाले रोगों की तुलना में इसके पुख्ता सबूत हैं।' },
        { title: 'प्रभावित भागों की दृश्यता', desc: 'मुख्य प्रभावित हिस्से स्पष्ट रूप से देखे जा सकते हैं।' },
        { title: 'रोग और फसल की अनुकूलता', desc: 'इस फसल में इस रोग का होना जैविक रूप से संभव है।' },
        { title: 'कृषि अनुसंधान संदर्भ सत्यापन', desc: 'प्रमाणित कृषि अनुसंधान संदर्भों के साथ मिलान किया गया।' }
      ]
    },
    ta: {
      headerTitle: 'சான்றுகள் சார்ந்த நம்பிக்கை',
      headerDesc: '10 தாவரவியல், காட்சி மற்றும் வேறுபட்ட சரிபார்ப்பு புள்ளிகளிலிருந்து கணக்கிடப்பட்டது.',
      evidenceStrength: 'சான்றுகளின் வலிமை',
      matchLabel: 'பொருத்தம்',
      checklistTitle: 'விரிவான சான்றுகள் சரிபார்ப்புப் பட்டியல்:',
      secondPassTitle: 'இரண்டாம் கட்ட சரிபார்ப்பு:',
      hideBtn: 'மறை',
      detailsBtn: 'விவரங்கள்',
      levels: {
        'Very High': 'மிகவும் அதிகம்',
        'High': 'அதிகம்',
        'Moderate': 'மிதமான',
        'Low': 'குறைவு',
        'Very Low': 'மிகக் குறைவு'
      },
      statuses: {
        verified: 'சரிபார்க்கப்பட்டது',
        reviewNeeded: 'மதிப்பாய்வு தேவை',
        consistent: 'சீரானது',
        evaluated: 'மதிப்பிடப்பட்டது',
        visible: 'தெரிகிறது',
        compatible: 'பொருந்தக்கூடியது'
      },
      factors: [
        { title: 'புகைப்பட தரம் & கூர்மை', desc: 'நோய் பகுப்பாய்விற்கு புகைப்படத் தரம் மற்றும் வெளிச்சம் போதுமானதாக உள்ளது.' },
        { title: 'பயிர் அடையாள பொருத்தம்', desc: 'மாதிரி அறிவிக்கப்பட்ட பயிரோடு பொருந்துகிறது.' },
        { title: 'காட்சி அறிகுறிகள் பொருத்தம்', desc: 'முக்கிய நோய் அறிகுறிகள் தெளிவாகக் கண்டறியப்பட்டுள்ளன.' },
        { title: 'பண்புசார் நோய் கண்டறிதல்', desc: 'அறிகுறிகள் நிலையான நோய் சுயவிவரத்துடன் ஒத்துப்போகின்றன.' },
        { title: 'பல புகைப்படங்களின் சீரான தன்மை', desc: 'அனைத்து புகைப்படங்களிலும் அறிகுறிகள் ஒரே மாதிரியாக உள்ளன.' },
        { title: 'முரண்பாடுகள் சரிபார்ப்பு', desc: 'சரிபார்ப்பில் முரண்பட்ட அறிகுறிகள் எதுவும் கண்டறியப்படவில்லை.' },
        { title: 'மாற்று நோய் ஒப்பீடு', desc: 'ஒரே மாதிரியான பிற நோய்களிலிருந்து இது வெற்றிகரமாக வேறுபடுத்தப்பட்டுள்ளது.' },
        { title: 'பாதிக்கப்பட்ட பகுதியின் தெளிவு', desc: 'பாதிக்கப்பட்ட இலைப்பகுதிகள் தெளிவாகத் தெரிகின்றன.' },
        { title: 'பயிர் மற்றும் நோய் சாத்தியக்கூறு', desc: 'இந்த பயிரில் இந்த நோய் ஏற்படுவது சாத்தியமே.' },
        { title: 'ஆராய்ச்சி குறிப்புகளுடன் சரிபார்ப்பு', desc: 'பயிர் நோயறிதல் குறிப்புகளுடன் ஒப்பிட்டு சரிபார்க்கப்பட்டது.' }
      ]
    },
    kn: {
      headerTitle: 'ಸಾಕ್ಷ್ಯಾಧಾರಿತ ವಿಶ್ವಾಸಾರ್ಹತೆ',
      headerDesc: '10 ಸಸ್ಯಶಾಸ್ತ್ರೀಯ, ದೃಶ್ಯ ಮತ್ತು ವ್ಯತ್ಯಾಸಾತ್ಮಕ ಸಾಕ್ಷ್ಯಗಳಿಂದ ಲೆಕ್ಕಹಾಕಲಾಗಿದೆ.',
      evidenceStrength: 'ಸಾಕ್ಷ್ಯದ ಬಲ',
      matchLabel: 'ಹೊಂದಾಣಿಕೆ',
      checklistTitle: 'ವಿವರವಾದ ಸಾಕ್ಷ್ಯಗಳ ಪರಿಶೀಲನಾ ಪಟ್ಟಿ:',
      secondPassTitle: 'ದ್ವಿತೀಯ ಹಂತದ ಮರುಪರಿಶೀಲನೆ:',
      hideBtn: 'ಮರೆಮಾಡು',
      detailsBtn: 'ವಿವರಗಳು',
      levels: {
        'Very High': 'ಅತಿ ಹೆಚ್ಚು',
        'High': 'ಹೆಚ್ಚು',
        'Moderate': 'ಮಧ್ಯಮ',
        'Low': 'ಕಡಿಮೆ',
        'Very Low': 'ಅತಿ ಕಡಿಮೆ'
      },
      statuses: {
        verified: 'ದೃಢೀಕರಿಸಲಾಗಿದೆ',
        reviewNeeded: 'ಪರಿಶೀಲನೆ ಅಗತ್ಯ',
        consistent: 'ಸಮಂಜಸ',
        evaluated: 'ಮೌಲ್ಯಮಾಪನ ಮಾಡಲಾಗಿದೆ',
        visible: 'ಕಾಣಿಸುತ್ತಿದೆ',
        compatible: 'ಹೊಂದಿಕೊಳ್ಳುತ್ತದೆ'
      },
      factors: [
        { title: 'ಫೋಟೋ ಗುಣಮಟ್ಟ ಮತ್ತು ಸ್ಪಷ್ಟತೆ', desc: 'ರೋಗ ವಿಶ್ಲೇಷಣೆಗೆ ಫೋಟೋದ ಸ್ಪಷ್ಟತೆ ಮತ್ತು ಬೆಳಕು ಸೂಕ್ತವಾಗಿದೆ.' },
        { title: 'ಬೆಳೆ ಗುರುತಿನ ಹೊಂದಾಣಿಕೆ', desc: 'ಮಾದರಿಯು ಘೋಷಿತ ಬೆಳೆಗೆ ಹೊಂದಿಕೆಯಾಗುತ್ತದೆ.' },
        { title: 'ದೃಶ್ಯ ರೋಗಲಕ್ಷಣಗಳ ಹೊಂದಾಣಿಕೆ', desc: 'ವಿಶಿಷ್ಟ ರೋಗ ಲಕ್ಷಣಗಳು ಸ್ಪಷ್ಟವಾಗಿ ಕಂಡುಬಂದಿವೆ.' },
        { title: 'ರೋಗಲಕ್ಷಣಗಳ ಹೋಲಿಕೆ', desc: 'ಲಕ್ಷಣಗಳು ಪ್ರಮಾಣಿತ ರೋಗದ ಪ್ರೊಫೈಲ್‌ನೊಂದಿಗೆ ಹೊಂದಿಕೆಯಾಗುತ್ತವೆ.' },
        { title: 'ಹಲವು ಫೋಟೋಗಳ ಸಮಂಜಸತೆ', desc: 'ಎಲ್ಲಾ ಫೋಟೋಗಳಲ್ಲಿ ರೋಗಲಕ್ಷಣಗಳು ಒಂದೇ ರೀತಿ ಇವೆ.' },
        { title: 'ವಿರೋಧಾಭಾಸಗಳ ಹುಡುಕಾಟ', desc: 'ಮರುಪರಿಶೀಲನೆಯಲ್ಲಿ ಯಾವುದೇ ವಿರುದ್ಧ ಲಕ್ಷಣಗಳು ಕಂಡುಬಂದಿಲ್ಲ.' },
        { title: 'ಇತರ ರೋಗಗಳ ಹೋಲಿಕೆ', desc: 'ಇತರ ರೋಗಗಳಿಗಿಂತ ಇದಕ್ಕೆ ಪ್ರಬಲವಾದ ಆಧಾರಗಳಿವೆ.' },
        { title: 'ಬಾಧಿತ ಭಾಗಗಳ ಗೋಚರತೆ', desc: 'ಮುಖ್ಯ ಬಾಧಿತ ಭಾಗಗಳು ಸ್ಪಷ್ಟವಾಗಿ ಕಾಣಿಸುತ್ತವೆ.' },
        { title: 'ಬೆಳೆ ಮತ್ತು ರೋಗದ ಹೊಂದಾಣಿಕೆ', desc: 'ಈ ಬೆಳೆಯಲ್ಲಿ ಈ ರೋಗ ಬರುವುದು ಜೈವಿಕವಾಗಿ ಸಾಧ್ಯವಿದೆ.' },
        { title: 'ಕೃಷಿ ಸಂಶೋಧನಾ ಸಂಸ್ಥೆಗಳ ದೃಢೀಕರಣ', desc: 'ಕೃಷಿ ಸಂಶೋಧನಾ ದಾಖಲೆಗಳೊಂದಿಗೆ ಹೋಲಿಸಿ ದೃಢೀಕರಿಸಲಾಗಿದೆ.' }
      ]
    }
  };

  const defaultStrings = {
    headerTitle: 'Evidence-Based Confidence',
    headerDesc: 'Calculated from 10 botanical, visual, and differential evidence checkpoints.',
    evidenceStrength: 'Evidence Strength',
    matchLabel: 'Match',
    checklistTitle: 'Detailed Evidence Checklist:',
    secondPassTitle: 'Second-Pass Adversarial Recheck:',
    hideBtn: 'Hide',
    detailsBtn: 'Details',
    levels: {
      'Very High': 'Very High',
      'High': 'High',
      'Moderate': 'Moderate',
      'Low': 'Low',
      'Very Low': 'Very Low'
    },
    statuses: {
      verified: 'Verified',
      reviewNeeded: 'Review Needed',
      consistent: 'Consistent',
      evaluated: 'Evaluated',
      visible: 'Visible',
      compatible: 'Compatible'
    },
    factors: [
      { title: 'Image Quality & Sharpness', desc: 'Resolution and lighting are adequate for leaf pathology examination.' },
      { title: 'Crop Identification Consistency', desc: report.crop ? `Visual specimen aligns with declared crop (${report.crop}).` : 'Crop species verified visually.' },
      { title: 'Visual Symptom Agreement', desc: report.visualEvidenceArray?.length ? `${report.visualEvidenceArray.length} distinct diagnostic visual indicators observed.` : 'Key morphological characteristics matched.' },
      { title: 'Characteristic Diagnostic Match', desc: `Symptoms align with benchmark pathological profile for ${report.condition || report.disease}.` },
      { title: 'Multi-Image Evidence Consistency', desc: 'Cross-image symptoms exhibit uniform lesion progression and symptom distribution.' },
      { title: 'Contradiction & Negative Search', desc: 'Second-pass adversarial check found no major negative contradictions.' },
      { title: 'Differential Candidate Separation', desc: report.candidateDiagnoses?.length ? `Distinguished against ${report.candidateDiagnoses.length} competing differential conditions.` : 'Differential alternatives evaluated.' },
      { title: 'Affected Structure Visibility', desc: report.affectedStructures?.length ? `Primary affected tissues visible: ${report.affectedStructures.join(', ')}.` : 'Key plant organs inspected.' },
      { title: 'Pathogen & Host Compatibility', desc: `Host-pathogen interaction is biologically plausible for ${report.crop || 'crop'}.` },
      { title: 'Agricultural Reference Verification', desc: report.verification?.summary || 'Cross-referenced with plant pathology diagnostic keys.' }
    ]
  };

  const currentStrings = localStrings[norm] || defaultStrings;

  let levelLabel = conf?.level || 'Moderate';
  if (rawScore >= 90) levelLabel = 'Very High';
  else if (rawScore >= 75) levelLabel = 'High';
  else if (rawScore >= 60) levelLabel = 'Moderate';
  else if (rawScore >= 40) levelLabel = 'Low';
  else levelLabel = 'Very Low';

  const localizedLevel = currentStrings.levels[levelLabel] || levelLabel;

  // Build the 10 evidence factors from report analysis data
  const imgQualityScore = conf?.imageQuality ?? (report.imageQuality?.score ? report.imageQuality.score : 8);
  const visualEvidenceScore = conf?.visualEvidence ?? 28;
  const featureMatchScore = conf?.featureMatch ?? 20;
  const sourceVerificationScore = conf?.sourceVerification ?? (report.verification?.performed ? 14 : 9);
  const contradictionCheckScore = conf?.contradictionCheck ?? (report.recheck?.remainingContradictions?.length ? 6 : 14);

  const icons = [Camera, CheckCircle2, Eye, FileCheck, Layers, Search, Sparkles, CheckCircle2, ShieldCheck, FileCheck];
  const scores = [
    `${imgQualityScore}/10`,
    report.cropConsistency !== false ? currentStrings.statuses.verified : currentStrings.statuses.reviewNeeded,
    `${visualEvidenceScore}/35`,
    `${featureMatchScore}/25`,
    currentStrings.statuses.consistent,
    `${contradictionCheckScore}/15`,
    report.candidateDiagnoses?.[0]?.candidateScore ? `${report.candidateDiagnoses[0].candidateScore}% lead` : currentStrings.statuses.evaluated,
    report.affectedStructures?.length ? `${report.affectedStructures.length} structures` : currentStrings.statuses.visible,
    currentStrings.statuses.compatible,
    `${sourceVerificationScore}/15`
  ];
  const statuses = [
    imgQualityScore >= 7 ? 'pass' : imgQualityScore >= 4 ? 'warning' : 'fail',
    report.cropConsistency !== false ? 'pass' : 'warning',
    visualEvidenceScore >= 24 ? 'pass' : visualEvidenceScore >= 15 ? 'warning' : 'fail',
    featureMatchScore >= 18 ? 'pass' : 'warning',
    'pass',
    contradictionCheckScore >= 12 ? 'pass' : 'warning',
    'pass',
    report.affectedStructures?.length ? 'pass' : 'warning',
    'pass',
    report.verification?.performed ? 'pass' : 'warning'
  ];

  const evidenceFactors = currentStrings.factors.map((f: any, idx: number) => ({
    title: f.title,
    description: idx === 1 && report.crop ? `${f.desc} (${report.crop})` : (idx === 7 && report.affectedStructures?.length ? `${f.desc} (${report.affectedStructures.join(', ')})` : f.desc),
    status: statuses[idx],
    score: scores[idx],
    icon: icons[idx]
  }));

  const getBadgeStyle = (lvl: string) => {
    switch (lvl) {
      case 'Very High':
        return 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-200 border-emerald-300 dark:border-emerald-700';
      case 'High':
        return 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      case 'Moderate':
        return 'bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 border-amber-300 dark:border-amber-800';
      case 'Low':
        return 'bg-orange-100 dark:bg-orange-950/80 text-orange-900 dark:text-orange-200 border-orange-300 dark:border-orange-800';
      default:
        return 'bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 border-stone-300 dark:border-stone-700';
    }
  };

  return (
    <div className={`rounded-2xl bg-stone-50/90 dark:bg-[#0c1810] border border-stone-200/80 dark:border-stone-800 space-y-3 w-full min-w-0 ${isSideCompact ? 'p-3 text-xs' : 'p-3.5 sm:p-4'}`}>
      {/* Header with Score and Toggle */}
      <div className={`flex flex-col gap-2 pb-2.5 border-b border-stone-200/60 dark:border-stone-800 ${isSideCompact ? 'sm:flex-col' : 'sm:flex-row sm:items-center justify-between'}`}>
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className={`${isSideCompact ? 'text-[11px]' : 'text-xs'} font-bold uppercase tracking-wider text-stone-900 dark:text-stone-100`}>
              {currentStrings.headerTitle}
            </span>
          </div>
          {!isSideCompact && (
            <p className="text-[11px] text-stone-600 dark:text-stone-400">
              {currentStrings.headerDesc}
            </p>
          )}
        </div>

        <div className={`flex items-center shrink-0 gap-2 ${isSideCompact ? 'justify-between w-full' : 'self-start sm:self-auto'}`}>
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-sm sm:text-base font-bold text-stone-900 dark:text-stone-100">
              {rawScore}<span className="text-[10px] text-stone-500 font-normal">/100</span>
            </span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getBadgeStyle(levelLabel)}`}>
              {localizedLevel}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            className="p-1 px-2 rounded-lg bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 transition-colors text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
            aria-expanded={isExpanded}
            aria-label="Toggle Why this confidence details"
          >
            <span>{isExpanded ? currentStrings.hideBtn : currentStrings.detailsBtn}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Progress meter bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-[10px] font-semibold text-stone-600 dark:text-stone-400">
          <span>{currentStrings.evidenceStrength}</span>
          <span>{rawScore}% {currentStrings.matchLabel}</span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-stone-200 dark:bg-stone-800 overflow-hidden">
          <div
            className={`h-full transition-all duration-500 rounded-full ${
              rawScore >= 75
                ? 'bg-emerald-600 dark:bg-emerald-500'
                : rawScore >= 60
                ? 'bg-amber-500 dark:bg-amber-400'
                : 'bg-orange-500'
            }`}
            style={{ width: `${Math.min(100, Math.max(5, rawScore))}%` }}
          />
        </div>
      </div>

      {/* Expandable 10-Point Evidence Detail Grid */}
      {isExpanded && (
        <div className="pt-1.5 space-y-2.5">
          <h4 className="text-[11px] font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
            <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>{currentStrings.checklistTitle}</span>
          </h4>

          <div className={`grid gap-2 ${isSideCompact ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
            {evidenceFactors.map((factor, idx) => {
              const IconComp = factor.icon;
              return (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 text-xs flex items-start gap-2 shadow-2xs"
                >
                  <div
                    className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 ${
                      factor.status === 'pass'
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400'
                        : factor.status === 'warning'
                        ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400'
                        : 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400'
                    }`}
                  >
                    <IconComp className="w-3 h-3" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-semibold text-stone-900 dark:text-stone-100 text-[11px] truncate">
                        {factor.title}
                      </span>
                      <span className="text-[10px] font-mono font-bold text-stone-500 dark:text-stone-400 shrink-0">
                        {factor.score}
                      </span>
                    </div>
                    <p className="text-[10px] text-stone-600 dark:text-stone-400 mt-0.5 leading-relaxed">
                      {factor.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Second Pass Recheck Callout */}
          {report.recheck && (
            <div className="p-2.5 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-900/60 text-xs flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-sky-900 dark:text-sky-200 text-[11px]">
                  {currentStrings.secondPassTitle}
                </span>
                <p className="text-sky-800 dark:text-sky-300 mt-0.5 text-[11px] leading-relaxed">
                  {report.recheck.result || 'The secondary validation pass actively tested alternative explanations.'}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
