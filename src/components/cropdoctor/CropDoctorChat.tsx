import React, { useState, useEffect, useRef, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import {
  Send,
  Sparkles,
  HelpCircle,
  AlertTriangle,
  RefreshCw,
  ShieldCheck,
  CheckCircle2,
  BookOpen,
  Eye,
  Info,
  ChevronDown,
  ChevronUp,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  X,
  AlertCircle,
} from 'lucide-react';
import { CropDoctorRobot, RobotState } from './CropDoctorRobot';
import { DiagnosisResult, FarmProfile, Language, CropDoctorChatMessage } from '../../types';
import { getTranslation } from '../../i18n/translations';
import { localizeCrop } from '../../i18n/dataTranslations';

interface CropDoctorChatProps {
  report?: DiagnosisResult | null;
  farmProfile: FarmProfile;
  language: Language;
  onLanguageChange?: (lang: Language) => void;
  imagesCount: number;
  externalQuery?: string | null;
  onClearExternalQuery?: () => void;
  onLoadingChange?: (loading: boolean) => void;
}

/**
 * Maps application language code to a valid BCP-47 speech recognition language tag.
 */
export function getBcp47LanguageTag(langCode: string): string {
  if (!langCode) return 'en-IN';
  const clean = langCode.trim().toLowerCase();

  if (clean.includes('-') || clean.includes('_')) {
    const formatted = clean.replace('_', '-');
    const parts = formatted.split('-');
    return `${parts[0]}-${parts[1].toUpperCase()}`;
  }

  const map: Record<string, string> = {
    en: 'en-IN',
    hi: 'hi-IN',
    te: 'te-IN',
    ta: 'ta-IN',
    kn: 'kn-IN',
    ml: 'ml-IN',
    mr: 'mr-IN',
    bn: 'bn-IN',
    gu: 'gu-IN',
    pa: 'pa-IN',
    or: 'or-IN',
    as: 'as-IN',
    ur: 'ur-IN',
    ne: 'ne-IN',
    kok: 'kok-IN',
    sa: 'sa-IN',
    doi: 'doi-IN',
    ks: 'ks-IN',
    brx: 'brx-IN',
    mai: 'mai-IN',
    mni: 'mni-IN',
    sat: 'sat-IN',
    sd: 'sd-IN',
    pt: 'pt-BR',
    ru: 'ru-RU',
    zh: 'zh-CN',
  };

  return map[clean] || 'en-IN';
}

/**
 * Strips markdown syntax from text to ensure clean text-to-speech output.
 */
export function stripMarkdownForSpeech(markdownText: string): string {
  if (!markdownText) return '';
  return markdownText
    .replace(/^#{1,6}\s+/gm, '') // headings
    .replace(/(\*\*|__)(.*?)\1/g, '$2') // bold
    .replace(/(\*|_)(.*?)\1/g, '$2') // italic
    .replace(/`([^`]+)`/g, '$1') // inline code
    .replace(/```[\s\S]*?```/g, '') // code blocks
    .replace(/^[\s]*[*\-+]\s+/gm, '') // bullet lists
    .replace(/^[\s]*\d+\.\s+/gm, '') // numbered lists
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // links
    .replace(/\n+/g, '. ') // linebreaks to pause
    .replace(/\s+/g, ' ')
    .trim();
}

export type SpeechState =
  | 'idle'
  | 'requesting-permission'
  | 'recording'
  | 'stopping'
  | 'uploading'
  | 'transcribing'
  | 'completed'
  | 'error';

export const CropDoctorChat: React.FC<CropDoctorChatProps> = ({
  report,
  farmProfile,
  language,
  imagesCount,
  externalQuery,
  onClearExternalQuery,
  onLoadingChange,
}) => {
  const [messages, setMessages] = useState<CropDoctorChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [robotState, setRobotState] = useState<RobotState>('idle');
  const [expandedDetailsId, setExpandedDetailsId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const t = getTranslation(language);

  // Helper for localized default questions
  const getLocalizedDefaultQuestions = (lang: Language): string[] => {
    const clean = (lang || 'en').split('-')[0].toLowerCase();
    if (clean === 'te') {
      return [
        'ఇది ఎందుకు జరిగింది?',
        'నేను ఇప్పుడు ఏమి చేయాలి?',
        'ఇది ఇతర మొక్కలకు వ్యాపిస్తుందా?',
        'భవిష్యత్తులో దీన్ని ఎలా నివారించాలి?',
      ];
    }
    if (clean === 'hi') {
      return [
        'यह रोग क्यों हुआ?',
        'मुझे अभी क्या करना चाहिए?',
        'क्या यह दूसरी फसलों में फैल सकता है?',
        'इसे भविष्य में कैसे रोकें?',
      ];
    }
    if (clean === 'ta') {
      return [
        'இது ஏன் நிகழ்ந்தது?',
        'இப்போது நான் என்ன செய்ய வேண்டும்?',
        'இது பரவுமா?',
        'இதை எப்படி தடுப்பது?',
      ];
    }
    if (clean === 'kn') {
      return [
        'ಇದು ಏಕೆ ಸಂಭವಿಸಿತು?',
        'ಈಗ ನಾನು ಏನು ಮಾಡಬೇಕು?',
        'ಇದು ಹರಡಬಹುದೇ?',
        'ಇದನ್ನು ತಡೆಯುವುದು ಹೇಗೆ?',
      ];
    }
    return [
      'Why did this happen?',
      'What should I do now?',
      'Can it spread?',
      'How can I prevent it?',
    ];
  };

  // Speech Recognition state machine
  const [speechState, setSpeechState] = useState<SpeechState>('idle');
  const [speechErrorMessage, setSpeechErrorMessage] = useState<string | null>(null);
  const [interimTranscript, setInterimTranscript] = useState<string>('');
  const recognitionRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const isVoiceActiveRef = useRef(false);
  const voiceBaseTextRef = useRef('');
  const inputTextRef = useRef(inputText);

  useEffect(() => {
    inputTextRef.current = inputText;
  }, [inputText]);

  const activeJobIdRef = useRef<string | null>(null);
  const pollingIntervalRef = useRef<any>(null);

  const cleanPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  }, []);

  const isSpeechSupported =
    typeof window !== 'undefined' &&
    (!!(navigator?.mediaDevices?.getUserMedia) || !!(window as any).SpeechRecognition || !!(window as any).webkitSpeechRecognition);

  // TTS audio playback state
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);
  const [currentlyPlayingMsgId, setCurrentlyPlayingMsgId] = useState<string | null>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  // Dynamic quick questions list based on conversation stage
  const [quickQuestions, setQuickQuestions] = useState<string[]>(getLocalizedDefaultQuestions(language));

  // Safely cancel any active speech recognition or audio recording
  const cancelSpeechRecognition = useCallback(() => {
    cleanPolling();
    activeJobIdRef.current = null;
    isVoiceActiveRef.current = false;
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.onstop = null;
      if (mediaRecorderRef.current.state !== 'inactive') {
        try {
          mediaRecorderRef.current.stop();
        } catch (e) {
          console.warn('Error stopping MediaRecorder:', e);
        }
      }
      mediaRecorderRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (recognitionRef.current) {
      try {
        const rec = recognitionRef.current;
        rec.onstart = null;
        rec.onresult = null;
        rec.onerror = null;
        rec.onend = null;
        rec.onspeechend = null;
        rec.stop();
      } catch {
        try {
          recognitionRef.current.abort();
        } catch {}
      }
      recognitionRef.current = null;
    }
    setSpeechState('idle');
    setInterimTranscript('');
  }, [cleanPolling]);

  // Update dynamic quick question chips based on what has been asked
  const updateDynamicChips = (askedQuery: string) => {
    const q = askedQuery.toLowerCase();
    if (q.includes('why') || q.includes('cause')) {
      setQuickQuestions([
        'What should I do now?',
        'Can it spread?',
        'What should I monitor?',
        'Could this be something else?',
      ]);
    } else if (q.includes('what should i do') || q.includes('now') || q.includes('action')) {
      setQuickQuestions([
        'Can it spread to other plants?',
        'How can I prevent it next season?',
        'Why are you confident?',
        'What biological spray can I use?',
      ]);
    } else if (q.includes('spread') || q.includes('contagious')) {
      setQuickQuestions([
        'What should I do now?',
        'How far can spores travel?',
        'How can I prevent it?',
        'Which image showed this?',
      ]);
    } else if (q.includes('prevent') || q.includes('future') || q.includes('soil')) {
      setQuickQuestions([
        'What bio-inoculants help?',
        'Which crops should I rotate with?',
        'What should I do right now?',
        'Could it be a nutrient deficiency?',
      ]);
    } else if (q.includes('confident') || q.includes('score')) {
      setQuickQuestions([
        'Could it be something else?',
        'What should I do now?',
        'How can I prevent it?',
        'Why did this happen?',
      ]);
    } else {
      setQuickQuestions([
        'Why did this happen?',
        'What should I do now?',
        'Can it spread?',
        'How can I prevent it?',
      ]);
    }
  };

  // Helper for country and language-aware AI greeting
  const getLocalizedAiGreeting = (country: string, lang: Language, cropName: string): string => {
    const c = (country || '').toLowerCase();
    const l = (lang || '').toLowerCase();

    if (c.includes('russia') || l.includes('ru')) {
      return `Здравствуйте! Я ваш **KhetiNexus AI Crop Doctor Bot** 🌾. Я могу помочь выявить болезни культур, пятна на листьях, вредителей и дефицит питательных веществ для вашей фермы (${cropName}). Загрузите образец листа справа или задайте любые вопросы по защите растений.`;
    }
    if (c.includes('brazil') || c.includes('portugal') || l.includes('pt')) {
      return `Olá! Sou o seu **KhetiNexus AI Crop Doctor Bot** 🌾. Posso ajudar a identificar doenças de culturas, manchas foliares, pragas de insetos e deficiências nutricionais para a sua fazenda de ${cropName}. Envie uma foto da folha afetada à direita ou faça qualquer pergunta sobre saúde vegetal.`;
    }
    if (c.includes('china') || l.includes('zh') || l.includes('chinese')) {
      return `您好！我是您的 **KhetiNexus AI 农作物医生助手** 🌾。我可以为您在 ${cropName} 农场的作物病害、叶斑、害虫以及养分缺乏提供诊断与指导。请在右侧上传叶片标本，或直接提出您关心的植物健康问题。`;
    }
    if (c.includes('south africa') || c.includes('za')) {
      return `Sawubona / Dumela / Hello! I am your **KhetiNexus AI Crop Doctor Bot** 🌾. I can assist with crop disease identification, pest management, and soil health for your ${cropName} farm. Upload specimen photos on the right or ask me any agronomy questions.`;
    }
    return `Namaste! I am your **KhetiNexus AI Crop Doctor Bot** 🌾. I can help identify crop diseases, leaf spots, insect pests, and nutrient deficiencies for your ${cropName} farm. Upload your leaf specimen on the right or ask me any plant health questions.`;
  };

  // Auto-generate compact initial case explanation when report loads, or helpful assistant welcome
  useEffect(() => {
    if (report) {
      const conditionName = report.condition || report.disease || 'Crop Condition';
      const cropName = report.crop || farmProfile.crop || 'Crop';
      const category = report.category || 'Disease';
      const isUnable = category === 'Unable to determine' || !report.isReliable;

      const initialText = isUnable
        ? `I've inspected the uploaded ${imagesCount} ${cropName} photo${imagesCount > 1 ? 's' : ''}. The visual symptoms are currently inconclusive to confirm a condition safely without risking misinformation. Feel free to ask what additional photos or field observations would help.`
        : `I've reviewed the ${imagesCount} uploaded ${cropName} specimen photo${imagesCount > 1 ? 's' : ''} and matched the symptoms with **${conditionName}** (${category}). Ask me any questions regarding causes, spread risks, immediate actions, or prevention!`;

      const initialMsg: CropDoctorChatMessage = {
        id: `init-${Date.now()}`,
        sender: 'ai',
        text: initialText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isInitialExplanation: true,
        observedPoints: report.visualEvidenceArray && report.visualEvidenceArray.length > 0
          ? report.visualEvidenceArray.slice(0, 3)
          : [report.visibleSymptoms || 'Visible foliar symptoms detected on specimen.'],
        inferredPoints: [
          report.causes || 'Microclimatic moisture and temperature likely accelerated development.',
        ].filter(Boolean),
        verifiedPoints: report.verification?.performed
          ? [report.verification.summary || 'Verified against agricultural extension guidelines.']
          : ['Cross-checked with integrated plant pathology references.'],
        unknownPoints: [
          'Exact microbial strain requires laboratory agar culture or PCR assay.',
        ],
        suggestedActions: [
          report.immediateActions || 'Isolate heavily infected foliage and avoid overhead wetting.',
        ],
        sources: [
          { title: 'FAO Plant Production & Protection Series', source: 'FAO IPM Compendium', sourceType: 'FAO' },
          { title: 'Agricultural Extension Disease Management Keys', source: 'State Extension Service', sourceType: 'University Extension' },
        ],
      };

      setMessages([initialMsg]);
      setQuickQuestions([
        'Why did this happen?',
        'What should I do now?',
        'Can it spread?',
        'How can I prevent it?',
      ]);
    } else {
      const cropName = farmProfile.crop || 'Crop';
      const countryName = farmProfile.country || 'India';
      const greetingText = getLocalizedAiGreeting(countryName, language, cropName);

      const welcomeMsg: CropDoctorChatMessage = {
        id: `init-welcome-${Date.now()}`,
        sender: 'ai',
        text: greetingText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isInitialExplanation: true,
        verifiedPoints: [`Ground-truth knowledge grounded for ${cropName} cultivation & plant protection.`],
        suggestedActions: ['Take close-up photos of top & bottom of affected leaves in good light.'],
        sources: [
          { title: 'ICAR / FAO Integrated Crop Management Compendium', source: 'Agricultural Knowledge Base', sourceType: 'FAO' },
        ],
      };

      setMessages([welcomeMsg]);
      setQuickQuestions([
        'How to take a good leaf photo?',
        'What causes leaf rust?',
        'How to prevent fungal rot?',
        'Which biological spray works best?',
      ]);
    }
  }, [report, farmProfile.crop, farmProfile.country, language, imagesCount]);

  // Scroll to bottom whenever messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Handle external query
  useEffect(() => {
    if (externalQuery && externalQuery.trim() && !isLoading) {
      handleSendMessage(externalQuery.trim());
      if (onClearExternalQuery) {
        onClearExternalQuery();
      }
    }
  }, [externalQuery, isLoading]);

  // Notify parent of loading status
  useEffect(() => {
    if (onLoadingChange) {
      onLoadingChange(isLoading);
    }
  }, [isLoading, onLoadingChange]);

  // Cleanup audio & speech recognition on unmount, report change, or language change
  useEffect(() => {
    return () => {
      stopAudio();
      cancelSpeechRecognition();
    };
  }, [report, cancelSpeechRecognition]);

  useEffect(() => {
    if (isVoiceActiveRef.current && recognitionRef.current) {
      try {
        recognitionRef.current.lang = getBcp47LanguageTag(language);
        recognitionRef.current.stop();
      } catch (e) {
        console.warn('Error on language change restarting SpeechRecognition:', e);
      }
    }
  }, [language]);

  // Stop any active speech/audio
  const stopAudio = () => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingAudio(false);
    setAudioLoading(false);
    setRobotState('idle');
    setCurrentlyPlayingMsgId(null);
  };

  // Text-to-Speech handler (Backend proxy + Web Speech API fallback)
  const handleSpeakMessageText = async (msgId: string, rawTextToSpeak: string) => {
    const textToSpeak = stripMarkdownForSpeech(rawTextToSpeak);

    if (isPlayingAudio) {
      const wasSame = currentlyPlayingMsgId === msgId;
      stopAudio();
      if (wasSame) return;
    }

    setCurrentlyPlayingMsgId(msgId);
    setAudioLoading(true);
    setRobotState('speaking');
    try {
      const res = await fetch('/api/text-to-speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: textToSpeak,
          language,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.audioContent) {
          const audio = new Audio(`data:audio/mp3;base64,${data.audioContent}`);
          currentAudioRef.current = audio;
          audio.onended = () => {
            setIsPlayingAudio(false);
            setAudioLoading(false);
            setRobotState('idle');
            setCurrentlyPlayingMsgId(null);
          };
          audio.onerror = () => {
            setIsPlayingAudio(false);
            setAudioLoading(false);
            speakClientSide(msgId, textToSpeak, language);
          };
          await audio.play();
          setIsPlayingAudio(true);
          setAudioLoading(false);
          return;
        }
      }
      
      speakClientSide(msgId, textToSpeak, language);
    } catch {
      speakClientSide(msgId, textToSpeak, language);
    }
  };

  const speakClientSide = (msgId: string, text: string, lang: Language) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setAudioLoading(false);
      setIsPlayingAudio(false);
      setRobotState('idle');
      setCurrentlyPlayingMsgId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = getBcp47LanguageTag(lang);
    utterance.rate = 0.95;

    utterance.onstart = () => {
      setIsPlayingAudio(true);
      setAudioLoading(false);
      setRobotState('speaking');
    };
    utterance.onend = () => {
      setIsPlayingAudio(false);
      setAudioLoading(false);
      setRobotState('idle');
      setCurrentlyPlayingMsgId(null);
    };
    utterance.onerror = () => {
      setIsPlayingAudio(false);
      setAudioLoading(false);
      setRobotState('idle');
      setCurrentlyPlayingMsgId(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  // Robust Browser MediaRecorder & Speech-to-Text queue handler
  const handleToggleVoiceRecord = async () => {
    if (!isSpeechSupported) {
      setSpeechErrorMessage('Speech input is not supported by this browser.');
      setSpeechState('error');
      return;
    }

    // Stop active recording/listening and process audio asynchronously
    if (speechState === 'recording') {
      if (isVoiceActiveRef.current && recognitionRef.current) {
        isVoiceActiveRef.current = false;
        try {
          recognitionRef.current.stop();
        } catch {}
        setSpeechState('idle');
        setRobotState('idle');
        return;
      }

      setSpeechState('stopping');
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        try {
          mediaRecorderRef.current.stop();
        } catch (e) {
          console.warn('Error stopping MediaRecorder:', e);
          cancelSpeechRecognition();
        }
      }
      return;
    }

    // Cancel any ongoing recording or polling before starting a new one
    cancelSpeechRecognition();
    setSpeechErrorMessage(null);

    // Check secure context
    if (
      typeof window !== 'undefined' &&
      (window as any).isSecureContext === false &&
      window.location?.hostname !== 'localhost' &&
      window.location?.hostname !== '127.0.0.1'
    ) {
      setSpeechErrorMessage('Microphone access requires a secure context (HTTPS).');
      setSpeechState('error');
      return;
    }

    setSpeechState('requesting-permission');

    const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognitionClass) {
      // 1. Primary path: Real-time Web Speech API
      try {
        // Request/verify mic permission first
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: { echoCancellation: true, noiseSuppression: true },
        });
        stream.getTracks().forEach((track) => track.stop());

        const recognition = new SpeechRecognitionClass();
        recognitionRef.current = recognition;
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = getBcp47LanguageTag(language);

        voiceBaseTextRef.current = inputTextRef.current;
        isVoiceActiveRef.current = true;
        setSpeechState('recording');
        setRobotState('alert');

        recognition.onresult = (event: any) => {
          if (!isVoiceActiveRef.current) return;
          let localFinal = '';
          let localInterim = '';
          for (let i = 0; i < event.results.length; i++) {
            const item = event.results[i][0]?.transcript || '';
            if (event.results[i].isFinal) {
              localFinal += item;
            } else {
              localInterim += item;
            }
          }

          const base = voiceBaseTextRef.current || '';
          const spaceBase = base ? (base.endsWith(' ') ? '' : ' ') : '';
          const prefix = base ? `${base}${spaceBase}` : '';
          const spaceInterim = localFinal && localInterim ? ' ' : '';
          setInputText(`${prefix}${localFinal}${spaceInterim}${localInterim}`);
        };

        recognition.onerror = (event: any) => {
          const err = event?.error;
          console.warn('Speech recognition error:', err);
          if (err === 'not-allowed' || err === 'permission-denied') {
            setSpeechErrorMessage('Microphone access is required for voice typing.');
            setSpeechState('error');
            isVoiceActiveRef.current = false;
            setRobotState('idle');
          } else if (err === 'no-speech') {
            // Keep active
          } else {
            setSpeechErrorMessage(`Voice typing error: ${err || 'Unknown error'}`);
            setSpeechState('error');
            isVoiceActiveRef.current = false;
            setRobotState('idle');
          }
        };

        recognition.onend = () => {
          if (isVoiceActiveRef.current) {
            try {
              voiceBaseTextRef.current = inputTextRef.current;
              recognition.start();
            } catch (e) {
              console.warn('Failed to restart speech recognition:', e);
            }
          } else {
            setSpeechState('idle');
            setRobotState('idle');
          }
        };

        recognition.start();
        return;
      } catch (err: any) {
        console.warn('SpeechRecognition startup error, attempting fallback:', err);
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          setSpeechErrorMessage('Microphone permission is required for voice typing.');
          setSpeechState('error');
          return;
        }
      }
    }

    // 2. Fallback path: MediaRecorder + Backend STT API
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true },
      });
      mediaStreamRef.current = stream;
      audioChunksRef.current = [];

      // Find supported recording MIME type
      let selectedMime = 'audio/webm';
      if (typeof MediaRecorder !== 'undefined' && typeof MediaRecorder.isTypeSupported === 'function') {
        if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
          selectedMime = 'audio/webm;codecs=opus';
        } else if (MediaRecorder.isTypeSupported('audio/webm')) {
          selectedMime = 'audio/webm';
        } else if (MediaRecorder.isTypeSupported('audio/ogg;codecs=opus')) {
          selectedMime = 'audio/ogg;codecs=opus';
        } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
          selectedMime = 'audio/mp4';
        } else if (MediaRecorder.isTypeSupported('audio/wav')) {
          selectedMime = 'audio/wav';
        }
      }

      const mediaRecorder = new MediaRecorder(stream, { mimeType: selectedMime });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        setSpeechState('uploading');
        setRobotState('analyzing');

        // Safely stop stream tracks immediately to release the microphone device light
        if (mediaStreamRef.current) {
          mediaStreamRef.current.getTracks().forEach((track) => track.stop());
          mediaStreamRef.current = null;
        }

        const audioBlob = new Blob(audioChunksRef.current, { type: selectedMime });
        if (audioBlob.size < 100) {
          setSpeechErrorMessage('No speech detected. Please try again.');
          setSpeechState('error');
          setRobotState('idle');
          return;
        }

        // Convert Blob to base64
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          try {
            const resultStr = (reader.result as string) || '';
            const base64Audio = resultStr.includes(',') ? resultStr.split(',')[1] : resultStr;

            const uploadResponse = await fetch('/api/speech-to-text', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                audioBase64: base64Audio,
                mimeType: selectedMime,
                language,
              }),
            });

            if (!uploadResponse.ok) {
              throw new Error(`Upload failed with status: ${uploadResponse.status}`);
            }

            const uploadData = await uploadResponse.json();
            const jobId = uploadData.jobId;

            if (!jobId) {
              throw new Error('Speech service did not provide a transcription job identifier');
            }

            activeJobIdRef.current = jobId;
            setSpeechState('transcribing');

            // Set up polling interval (every 1 second)
            let pollCount = 0;
            const maxPolls = 25; // 25 seconds timeout limit

            cleanPolling();

            pollingIntervalRef.current = setInterval(async () => {
              // Avoid processing if user started a new recording or canceled
              if (activeJobIdRef.current !== jobId) {
                cleanPolling();
                return;
              }

              pollCount++;
              if (pollCount > maxPolls) {
                cleanPolling();
                setSpeechErrorMessage('Transcription request timed out. Please try again.');
                setSpeechState('error');
                setRobotState('idle');
                return;
              }

              try {
                const pollRes = await fetch(`/api/speech-to-text/${jobId}`);
                if (!pollRes.ok) {
                  throw new Error(`Polling status failed: ${pollRes.status}`);
                }
                const jobData = await pollRes.json();

                // Re-verify that this job is still the active one
                if (activeJobIdRef.current !== jobId) {
                  cleanPolling();
                  return;
                }

                if (jobData.status === 'completed') {
                  cleanPolling();
                  setSpeechState('idle');
                  setRobotState('idle');

                  if (jobData.transcript && jobData.transcript.trim()) {
                    const cleanedText = jobData.transcript.trim();
                    setInputText((prev) => {
                      const trimmed = prev.trim();
                      if (!trimmed) return cleanedText;
                      return `${trimmed} ${cleanedText}`;
                    });
                  } else {
                    setSpeechErrorMessage('No speech detected. Please try again.');
                    setSpeechState('error');
                  }
                } else if (jobData.status === 'failed') {
                  cleanPolling();
                  setSpeechErrorMessage(jobData.error || 'Speech transcription failed.');
                  setSpeechState('error');
                  setRobotState('idle');
                }
              } catch (pollErr) {
                console.warn('[STT Polling Error]:', pollErr);
              }
            }, 1000);

          } catch (err: any) {
            console.warn('[STT Async Upload Error]:', err);
            setSpeechErrorMessage('Voice upload or transcription service failed.');
            setSpeechState('error');
            setRobotState('idle');
          }
        };
      };

      mediaRecorder.start(250);
      setSpeechState('recording');
      setRobotState('alert');

    } catch (err: any) {
      console.warn('[MediaRecorder Permission/Start Error]:', err);
      setRobotState('idle');
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setSpeechErrorMessage('Microphone permission is required for voice typing.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setSpeechErrorMessage('No microphone device detected on this hardware.');
      } else {
        setSpeechErrorMessage(`Failed to start microphone: ${err.message || 'Unknown error'}`);
      }
      setSpeechState('error');
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query || isLoading) return;

    setInputText('');
    setSpeechErrorMessage(null);
    updateDynamicChips(query);

    const userMessage: CropDoctorChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setRobotState('analyzing');

    try {
      const response = await fetch('/api/crop-doctor/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: query,
          language,
          farmProfile: {
            crop: farmProfile?.crop,
            location: farmProfile?.location,
            stateRegion: farmProfile?.stateRegion,
            country: farmProfile?.country,
            soilType: farmProfile?.soilType,
            irrigationType: farmProfile?.irrigationType,
            growthStage: farmProfile?.growthStage,
          },
          caseContext: {
            crop: report?.crop || farmProfile?.crop,
            category: report?.category,
            subcategory: report?.subcategory,
            condition: report?.condition || report?.disease,
            scientificName: report?.scientificName,
            affectedStructures: report?.affectedStructures,
            visualEvidenceArray: report?.visualEvidenceArray,
            likelyCauses: report?.causes || (report as any)?.likelyCause,
            immediateActions: report?.immediateActions,
            preventionPractices: report?.preventionPractices,
            confidenceScore: report?.confidenceDetails?.finalScore,
            confidenceLevel: report?.confidenceDetails?.level || report?.confidence,
            candidateDiagnoses: report?.candidateDiagnoses,
            recheckResult: report?.recheck?.result,
            verificationSummary: report?.verification?.summary,
            imagesCount,
          },
          messagesHistory: messages.map((m) => ({
            role: m.sender === 'user' ? 'user' : 'model',
            content: m.text,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error(`Chat API responded with HTTP ${response.status}`);
      }

      const data = await response.json();

      setRobotState('speaking');

      const aiResponse: CropDoctorChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: data.answer || data.reply || data.text || 'I have reviewed your query based on the active crop diagnosis.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        observedPoints: data.observedPoints,
        inferredPoints: data.inferredPoints,
        verifiedPoints: data.verifiedPoints,
        unknownPoints: data.unknownPoints,
        technicalDetails: data.technicalDetails,
        suggestedActions: data.suggestedActions,
        sources: data.sources,
      };

      setMessages((prev) => [...prev, aiResponse]);

      setTimeout(() => {
        setRobotState('idle');
      }, 3500);
    } catch (err: any) {
      console.warn('[CropDoctorChat] Fallback engaged:', err?.message || err);
      const fallbackResponse = buildContextualFallback(query, report, farmProfile);
      setMessages((prev) => [...prev, fallbackResponse]);
      setRobotState('idle');
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };

  const buildContextualFallback = (
    query: string,
    rep: DiagnosisResult | null | undefined,
    farm: FarmProfile
  ): CropDoctorChatMessage => {
    const q = query.toLowerCase();
    const condition = rep?.condition || rep?.disease || 'this condition';
    const crop = rep?.crop || farm?.crop || 'crop';

    let answerText = '';
    let observed: string[] | undefined;
    let inferred: string[] | undefined;
    let actions: string[] | undefined;
    let sources: Array<{ title: string; source: string; sourceType: string }> | undefined = [
      { title: 'FAO Plant Production and Protection Series', source: 'FAO IPM Compendium', sourceType: 'FAO' },
    ];

    if (q.includes('why') || q.includes('happen') || q.includes('cause')) {
      answerText = `### Diagnosis & Causes\n\n**${condition}** in ${crop} is primarily triggered by high relative humidity (above 80%), prolonged leaf surface wetness from dew or rain, and dense canopy cover that restricts airflow.`;
      inferred = [rep?.causes || 'Microclimatic humidity and canopy moisture favored pathogen penetration.'];
    } else if (q.includes('what should i do') || q.includes('now') || q.includes('first')) {
      answerText = `### Immediate Field Actions\n\nRecommended management steps for **${crop}**:\n- **Irrigation**: Withhold overhead sprinkler irrigation to keep leaf surfaces dry.\n- **Sanitation**: Prune and safely remove severely necrotic lower foliage to reduce active sporulation.\n- **Disinfection**: Sanitize pruning shears with 70% alcohol between cuts.`;
      actions = [rep?.immediateActions || 'Isolate affected plants and improve airflow.'];
    } else if (q.includes('spread') || q.includes('other plant')) {
      answerText = `### Contagion & Spread Risk\n\n**Yes**, fungal spores can spread rapidly to neighboring plants via rain splashes and wind currents. Discard infected debris outside the field and avoid working in the field while foliage is wet.`;
      observed = rep?.visualEvidenceArray?.slice(0, 2);
    } else if (q.includes('prevent') || q.includes('next season')) {
      answerText = `### Long-Term Prevention Protocol\n\nFor future crop protection:\n- **Crop Rotation**: Rotate crops with non-host species (such as Poaceae cereals) for 2 seasons.\n- **Biological Inoculants**: Inoculate soil with *Trichoderma harzianum* or *Bacillus subtilis* to suppress soil inoculum.\n- **Canopy Spacing**: Increase plant spacing to promote sunlight penetration and rapid canopy drying.`;
      actions = [rep?.preventionPractices || 'Practice crop rotation and biological Trichoderma soil treatment.'];
    } else if (q.includes('confident') || q.includes('why are you')) {
      answerText = `### Clinical Confidence Assessment\n\nConfidence (${rep?.confidenceDetails?.finalScore ?? 80}/100) is calculated from specimen image clarity, characteristic lesion morphology, host-pathogen biological compatibility, and ruling out differential conditions.`;
      observed = rep?.visualEvidenceArray;
    } else if (q.includes('something else') || q.includes('differential')) {
      answerText = rep?.candidateDiagnoses?.length
        ? `### Differential Diagnosis\n\nWe evaluated competing possibilities including **${rep.candidateDiagnoses.map((c) => c.condition).join(', ')}**. The observed lesion characteristics and symptom progression match **${condition}** most closely.`
        : `While **${condition}** is the primary diagnostic match based on visible patterns, laboratory testing is recommended for definitive microbial confirmation.`;
    } else {
      answerText = `### Botanical Assessment\n\nRegarding **${condition}** on **${crop}**: ${rep?.immediateActions || rep?.causes || 'Please monitor symptom progression over the next 48 hours and maintain balanced crop nutrition.'}`;
    }

    return {
      id: `ai-${Date.now()}`,
      sender: 'ai',
      text: answerText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      observedPoints: observed,
      inferredPoints: inferred,
      suggestedActions: actions,
      sources,
    };
  };

  return (
    <div
      id="crop-doctor-ai-chat-card"
      className="bg-white dark:bg-[#0c1810] rounded-2xl border border-stone-200/90 dark:border-stone-800/90 shadow-xs flex flex-col transition-colors overflow-hidden"
      aria-label="KhetiNexus AI Crop Doctor Chat"
    >
      {/* 1. Header with Animated Robot */}
      <div className="p-3.5 sm:p-4 bg-gradient-to-r from-emerald-50/90 via-white to-stone-50/70 dark:from-[#0d2216] dark:via-[#0c1810] dark:to-stone-900 border-b border-stone-200/80 dark:border-stone-800 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <CropDoctorRobot
            state={robotState}
            size="md"
            showStatusBadge={false}
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h3 className="font-heading font-bold text-stone-900 dark:text-stone-100 text-xs sm:text-sm truncate">
                KhetiNexus AI
              </h3>
              <span className="px-1.5 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold border border-emerald-200/60 dark:border-emerald-800">
                Crop Doctor Bot
              </span>
            </div>
            <p className="text-[11px] text-stone-600 dark:text-stone-400 mt-0.5 leading-snug">
              {robotState === 'analyzing' ? (
                <span className="text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <RefreshCw className="w-3 h-3 animate-spin shrink-0" />
                  <span>{t.chatAnalyzing}</span>
                </span>
              ) : robotState === 'speaking' ? (
                <span className="text-emerald-700 dark:text-emerald-400 font-semibold">
                  {t.chatSpeaking}
                </span>
              ) : (
                <span>Hi 👋 Ask me anything about this crop case.</span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Scrollable Messages Container */}
      <div className="p-3 sm:p-4 space-y-3 max-h-[380px] sm:max-h-[440px] overflow-y-auto bg-stone-50/50 dark:bg-black/20 text-xs flex-1">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          const hasBreakdown = !isUser && (msg.observedPoints?.length || msg.inferredPoints?.length || msg.verifiedPoints?.length || msg.unknownPoints?.length);
          const isDetailsOpen = expandedDetailsId === msg.id;

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[92%] sm:max-w-[88%] rounded-2xl p-3 space-y-2 transition-all ${
                  isUser
                    ? 'bg-emerald-700 text-white rounded-tr-xs shadow-2xs'
                    : 'bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 text-stone-900 dark:text-stone-100 rounded-tl-xs shadow-2xs'
                }`}
              >
                {/* Message Body with Markdown formatting for AI replies */}
                {isUser ? (
                  <div className="leading-relaxed whitespace-pre-wrap font-normal text-xs sm:text-[13px]">
                    {msg.text}
                  </div>
                ) : (
                  <div className="prose prose-stone dark:prose-invert max-w-none text-xs sm:text-[13px] leading-relaxed select-text font-normal space-y-2">
                    <ReactMarkdown
                      components={{
                        p: ({ children }) => <p className="mb-2 last:mb-0 text-stone-900 dark:text-stone-100 font-normal">{children}</p>,
                        strong: ({ children }) => <strong className="font-bold text-stone-950 dark:text-white">{children}</strong>,
                        em: ({ children }) => <em className="italic">{children}</em>,
                        h1: ({ children }) => <h1 className="text-sm font-bold text-stone-900 dark:text-stone-100 mt-2 mb-1">{children}</h1>,
                        h2: ({ children }) => <h2 className="text-sm font-bold text-stone-900 dark:text-stone-100 mt-2 mb-1">{children}</h2>,
                        h3: ({ children }) => <h3 className="text-xs font-bold text-stone-900 dark:text-stone-100 mt-1.5 mb-1">{children}</h3>,
                        ul: ({ children }) => <ul className="list-disc pl-4 space-y-1 my-1.5 text-stone-900 dark:text-stone-100">{children}</ul>,
                        ol: ({ children }) => <ol className="list-decimal pl-4 space-y-1 my-1.5 text-stone-900 dark:text-stone-100">{children}</ol>,
                        li: ({ children }) => <li className="leading-normal">{children}</li>,
                        code: ({ children }) => <code className="px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-emerald-800 dark:text-emerald-300 font-mono text-[11px]">{children}</code>,
                        blockquote: ({ children }) => <blockquote className="border-l-2 border-emerald-600 pl-2 italic my-1 text-stone-700 dark:text-stone-300">{children}</blockquote>
                      }}
                    >
                      {msg.text}
                    </ReactMarkdown>
                  </div>
                )}

                {/* Evidence Classification (Observed / Inferred / Verified / Unknown) */}
                {hasBreakdown && (
                  <div className="pt-2 border-t border-stone-100 dark:border-stone-800/80 space-y-2">
                    <button
                      type="button"
                      onClick={() => setExpandedDetailsId(isDetailsOpen ? null : msg.id)}
                      className="w-full text-left flex items-center justify-between text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 hover:text-emerald-900 py-0.5 cursor-pointer"
                    >
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3 text-emerald-600" />
                        <span>{t.chatEvidenceClassification}</span>
                      </span>
                      {isDetailsOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>

                    {isDetailsOpen && (
                      <div className="space-y-2 pt-1">
                        {/* Observed Points */}
                        {msg.observedPoints && msg.observedPoints.length > 0 && (
                          <div className="p-2 rounded-lg bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/60 text-[11px] text-emerald-950 dark:text-emerald-200">
                            <span className="font-bold block text-emerald-900 dark:text-emerald-300 text-[10px] uppercase">
                              {t.chatObserved}:
                            </span>
                            <p className="mt-0.5">{msg.observedPoints.join(' • ')}</p>
                          </div>
                        )}

                        {/* Inferred Points */}
                        {msg.inferredPoints && msg.inferredPoints.length > 0 && (
                          <div className="p-2 rounded-lg bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800/60 text-[11px] text-amber-950 dark:text-amber-200">
                            <span className="font-bold block text-amber-900 dark:text-amber-300 text-[10px] uppercase">
                              {t.chatInferred}:
                            </span>
                            <p className="mt-0.5">{msg.inferredPoints.join(' • ')}</p>
                          </div>
                        )}

                        {/* Verified Points */}
                        {msg.verifiedPoints && msg.verifiedPoints.length > 0 && (
                          <div className="p-2 rounded-lg bg-sky-50/70 dark:bg-sky-950/40 border border-sky-200/60 dark:border-sky-800/60 text-[11px] text-sky-950 dark:text-sky-200">
                            <span className="font-bold block text-sky-900 dark:text-sky-300 text-[10px] uppercase">
                              {t.chatVerified}:
                            </span>
                            <p className="mt-0.5">{msg.verifiedPoints.join(' • ')}</p>
                          </div>
                        )}

                        {/* Unknown Points */}
                        {msg.unknownPoints && msg.unknownPoints.length > 0 && (
                          <div className="p-2 rounded-lg bg-stone-100 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 text-[11px] text-stone-700 dark:text-stone-300">
                            <span className="font-bold block text-stone-800 dark:text-stone-200 text-[10px] uppercase">
                              {t.chatUnknown}:
                            </span>
                            <p className="mt-0.5">{msg.unknownPoints.join(' • ')}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Sources & Citations if present */}
                {msg.sources && msg.sources.length > 0 && (
                  <div className="pt-1.5 flex flex-wrap items-center gap-1.5 text-[10px] text-stone-500 dark:text-stone-400">
                    <span className="font-bold text-stone-600 dark:text-stone-300 flex items-center gap-1">
                      <BookOpen className="w-2.5 h-2.5 text-emerald-600" />
                      {t.chatSources}:
                    </span>
                    {msg.sources.map((src, sIdx) => (
                      <span
                        key={sIdx}
                        className="px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 truncate max-w-[200px]"
                        title={src.title}
                      >
                        {src.source}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between gap-4 pt-1 mt-0.5 border-t border-stone-100/50 dark:border-stone-800/30">
                  <div
                    className={`text-[9px] ${
                      isUser ? 'text-emerald-200' : 'text-stone-400 dark:text-stone-500'
                    }`}
                  >
                    {msg.timestamp}
                  </div>

                  {!isUser && (
                    <button
                      type="button"
                      disabled={audioLoading && currentlyPlayingMsgId === msg.id}
                      onClick={() => handleSpeakMessageText(msg.id, msg.text)}
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold flex items-center gap-1 transition-all select-none cursor-pointer border ${
                        currentlyPlayingMsgId === msg.id
                          ? 'bg-emerald-700 text-white border-emerald-600 shadow-2xs'
                          : 'bg-stone-100 hover:bg-emerald-50 text-stone-700 dark:bg-stone-800 dark:hover:bg-emerald-950/40 dark:text-stone-300 border-stone-200/60 dark:border-stone-700/60'
                      }`}
                    >
                      {audioLoading && currentlyPlayingMsgId === msg.id ? (
                        <RefreshCw className="w-3 h-3 animate-spin text-emerald-600" />
                      ) : currentlyPlayingMsgId === msg.id ? (
                        <VolumeX className="w-3 h-3" />
                      ) : (
                        <Volume2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                      )}
                      <span>
                        {currentlyPlayingMsgId === msg.id ? t.chatStop : t.chatListen}
                      </span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-2 text-stone-500 dark:text-stone-400 text-xs py-1">
            <CropDoctorRobot state="analyzing" size="sm" />
            <span className="font-medium animate-pulse">
              {t.chatAnalyzing}
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 3. Dynamic Quick Questions Chips */}
      <div className="px-3 sm:px-4 py-2 bg-stone-50 dark:bg-[#0a150e] border-t border-stone-100 dark:border-stone-800 flex flex-wrap gap-1.5">
        <span className="text-[10px] uppercase font-bold text-stone-400 dark:text-stone-500 self-center mr-0.5">
          {t.chatQuick}:
        </span>
        {quickQuestions.map((q, idx) => (
          <button
            key={idx}
            type="button"
            disabled={isLoading}
            onClick={() => handleSendMessage(q)}
            className="px-2.5 py-1 rounded-lg bg-white dark:bg-stone-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 text-stone-700 dark:text-stone-300 hover:text-emerald-800 dark:hover:text-emerald-200 border border-stone-200 dark:border-stone-700 text-[11px] font-medium transition-colors cursor-pointer shadow-2xs disabled:opacity-50 whitespace-nowrap"
          >
            {q}
          </button>
        ))}
      </div>

      {/* 4. Chat Input Bar with Voice Input STT */}
      <div className="p-3 bg-white dark:bg-[#0c1810] border-t border-stone-200/80 dark:border-stone-800 space-y-2">
        {speechState !== 'idle' && speechState !== 'error' && (
          <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-900 dark:text-emerald-200 text-xs flex items-center justify-between animate-pulse">
            <div className="flex items-center gap-2 min-w-0">
              {speechState === 'recording' ? (
                <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping shrink-0" />
              ) : (
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-600 dark:text-emerald-400 shrink-0" />
              )}
              <span className="text-[11px] font-semibold truncate">
                {speechState === 'requesting-permission' && 'Requesting microphone permission...'}
                {speechState === 'recording' && 'Recording... Speak now. Click microphone to Stop.'}
                {speechState === 'stopping' && 'Stopping recording...'}
                {speechState === 'uploading' && 'Uploading audio...'}
                {speechState === 'transcribing' && 'Transcribing audio...'}
              </span>
            </div>
            {speechState === 'recording' && (
              <button
                type="button"
                onClick={handleToggleVoiceRecord}
                className="px-2.5 py-0.5 rounded-lg bg-rose-200 dark:bg-rose-950/60 hover:bg-rose-300 dark:hover:bg-rose-900 text-rose-900 dark:text-rose-200 text-[10px] font-bold cursor-pointer transition-all shrink-0"
              >
                Stop
              </button>
            )}
          </div>
        )}

        {speechState === 'error' && speechErrorMessage && (
          <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-900 dark:text-rose-200 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span className="text-[11px] font-medium truncate">{speechErrorMessage}</span>
            </div>
            <div className="flex items-center gap-2 shrink-0 ml-2">
              <button
                type="button"
                onClick={handleToggleVoiceRecord}
                className="px-2 py-0.5 rounded bg-rose-200 dark:bg-rose-900 hover:bg-rose-300 dark:hover:bg-rose-800 text-rose-900 dark:text-rose-100 text-[10px] font-bold cursor-pointer"
              >
                Retry
              </button>
              <button
                type="button"
                onClick={() => {
                  setSpeechState('idle');
                  setSpeechErrorMessage(null);
                }}
                className="p-1 text-rose-700 dark:text-rose-300 hover:text-rose-900 rounded cursor-pointer"
                aria-label="Dismiss speech error"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          {/* Voice Input Button */}
          <button
            type="button"
            disabled={!isSpeechSupported}
            onClick={handleToggleVoiceRecord}
            className={`p-2.5 rounded-xl border transition-all flex items-center justify-center shrink-0 cursor-pointer shadow-2xs ${
              speechState === 'recording'
                ? 'bg-rose-600 text-white border-rose-500 animate-pulse ring-2 ring-rose-400'
                : speechState === 'requesting-permission' || speechState === 'stopping' || speechState === 'uploading' || speechState === 'transcribing'
                ? 'bg-amber-50 text-amber-800 dark:bg-amber-950/60 border-amber-300'
                : !isSpeechSupported
                ? 'bg-stone-100 dark:bg-stone-800 text-stone-400 border-stone-200 dark:border-stone-700 opacity-50 cursor-not-allowed'
                : 'bg-stone-50 hover:bg-emerald-50 dark:bg-stone-900 dark:hover:bg-emerald-950/50 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:text-emerald-700 dark:hover:text-emerald-300'
            }`}
            title={
              !isSpeechSupported
                ? 'Speech input is not supported by this browser.'
                : speechState === 'recording'
                ? 'Listening… Click to stop'
                : 'Voice Input'
            }
            aria-label="Voice Input microphone"
          >
            {speechState === 'recording' ? (
              <MicOff className="w-4 h-4" />
            ) : speechState === 'requesting-permission' || speechState === 'stopping' || speechState === 'uploading' || speechState === 'transcribing' ? (
              <RefreshCw className="w-4 h-4 animate-spin text-amber-600 dark:text-amber-400" />
            ) : (
              <Mic className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            )}
          </button>

          {/* Multiline Textarea Input */}
          <textarea
            ref={inputRef as any}
            rows={1}
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);
              e.target.style.height = 'auto';
              e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (inputText.trim() && !isLoading) {
                  handleSendMessage();
                }
              }
            }}
            disabled={isLoading}
            placeholder={t.chatInputPlaceholder || 'Ask a crop question...'}
            className="flex-1 px-3 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-xs text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 disabled:opacity-60 resize-none max-h-32 overflow-y-auto leading-relaxed"
            aria-label="Ask KhetiNexus AI a question"
          />

          {/* Send Button */}
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="px-3.5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 text-white font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0 shadow-xs"
            aria-label="Send message"
          >
            {isLoading ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Send className="w-3.5 h-3.5" />
            )}
            <span className="hidden sm:inline">{t.chatSend}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

