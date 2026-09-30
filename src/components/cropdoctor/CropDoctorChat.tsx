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
  X,
  AlertCircle,
  Plus,
  History,
  Trash2,
  Clock,
  Cloud,
  CloudOff,
  Search,
  MessageSquare,
} from 'lucide-react';
import { CropDoctorRobot, RobotState } from './CropDoctorRobot';
import { DiagnosisResult, FarmProfile, Language, CropDoctorChatMessage, ChatSession } from '../../types';
import { getTranslation } from '../../i18n/translations';
import { localizeCrop } from '../../i18n/dataTranslations';
import { safeFetchJson } from '../../lib/apiUtils';
import { useAuth } from '../../context/AuthContext';
import { useCountry } from '../../context/CountryContext';
import {
  saveConversationSession,
  getUserConversations,
  deleteConversationSession,
} from '../../lib/firestoreService';
import {
  getCropDoctorAiGreeting,
  getCropDoctorInitialExplanation,
  getCropDoctorVerifiedPoint,
  getCropDoctorSuggestedAction,
  getCropDoctorDefaultQuickQuestions,
  getCropDoctorReportQuickQuestions,
  getCropDoctorDynamicFollowupQuestions,
  localizeDiseaseName,
  getCropDoctorDefaultSources,
  getCropDoctorBotBadge,
  getCropDoctorShortGreeting,
  getCropDoctorSessionTranslations,
  getCropDoctorLocalizedFallback,
  getLocalizedConsultationTitle,
  getLocalizedDefaultObservedPoint,
  getLocalizedDefaultInferredPoint,
  getLocalizedDefaultUnknownPoint,
  getLocalizedDefaultSuggestedAction,
} from '../../i18n/cropDoctorChatTranslations';
import { getCropDoctorReportTranslations } from '../../i18n/cropDoctorTranslations';

interface CropDoctorChatProps {
  report?: DiagnosisResult | null;
  farmProfile: FarmProfile;
  language: Language;
  onLanguageChange?: (lang: Language) => void;
  imagesCount: number;
  externalQuery?: string | null;
  onClearExternalQuery?: () => void;
  onLoadingChange?: (loading: boolean) => void;
  weather?: any;
  soilReport?: any;
  advisory?: any;
  onNavigateTab?: (tab: string) => void;
}

function formatSessionDate(isoString: string): string {
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return '';
    const now = new Date();
    const isToday = d.toDateString() === now.toDateString();
    if (isToday) {
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
  } catch {
    return '';
  }
}

export const CropDoctorChat: React.FC<CropDoctorChatProps> = ({
  report,
  farmProfile,
  language,
  onLanguageChange,
  imagesCount,
  externalQuery,
  onClearExternalQuery,
  onLoadingChange,
  weather,
  soilReport,
  advisory,
}) => {
  const { user, setAuthModalOpen } = useAuth();
  const { activeCountry } = useCountry();
  const sessionI18n = getCropDoctorSessionTranslations(language);

  // Generate unique initial session ID
  const [currentSessionId, setCurrentSessionId] = useState<string>(
    () => `conv_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`
  );
  const [currentSessionTitle, setCurrentSessionTitle] = useState<string>('');
  const sessionCreatedAtRef = useRef<string>(new Date().toISOString());

  const [messages, setMessages] = useState<CropDoctorChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [robotState, setRobotState] = useState<RobotState>('idle');
  const [expandedDetailsId, setExpandedDetailsId] = useState<string | null>(null);

  // Session & History drawer state
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [searchHistoryQuery, setSearchHistoryQuery] = useState('');
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Track whether initial history load & active session restore has been performed
  const hasLoadedInitialHistoryRef = useRef<boolean>(false);
  const prevUserIdRef = useRef<string | undefined>(user?.uid);

  // Set to guard against duplicate delete requests
  const deletingSessionIdsRef = useRef<Set<string>>(new Set());

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const isMountedRef = useRef(true);

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

  // Dynamic quick questions list based on conversation stage
  const [quickQuestions, setQuickQuestions] = useState<string[]>(getLocalizedDefaultQuestions(language));

  // Create initial message based on report or general greeting
  const buildInitialMessage = useCallback((): CropDoctorChatMessage => {
    if (report) {
      const rawCondition = report.condition || report.disease || 'Crop Condition';
      const conditionName = localizeDiseaseName(rawCondition, language);
      const category = report.category || 'Disease';
      const reportI18n = getCropDoctorReportTranslations(language);
      const categoryName = (reportI18n.categories as any)?.[category]?.label || (reportI18n.categories as any)?.[category]?.defaultTitle || category;
      const isUnable = category === 'Unable to determine' || !report.isReliable;

      const initialText = getCropDoctorInitialExplanation(
        language,
        conditionName,
        categoryName,
        isUnable,
        imagesCount
      );

      const observed = report.visualEvidenceArray && report.visualEvidenceArray.length > 0
        ? report.visualEvidenceArray
        : [getLocalizedDefaultObservedPoint(language)];

      const inferred = report.causes || (report as any)?.likelyCause
        ? [report.causes || (report as any)?.likelyCause]
        : [getLocalizedDefaultInferredPoint(language)];

      const verified = report.recheck?.result || report.verification?.summary
        ? [getCropDoctorVerifiedPoint(language, report.recheck?.result || report.verification?.summary)]
        : [getCropDoctorVerifiedPoint(language, farmProfile.crop || 'Crop')];

      const unknown = isUnable
        ? [getLocalizedDefaultUnknownPoint(language)]
        : ['Exact pathogen strain requires laboratory culture assay if non-responsive to first-line treatment.'];

      const suggestedActions = report.immediateActions
        ? [report.immediateActions, ...(report.preventionPractices ? [report.preventionPractices] : [])]
        : [getLocalizedDefaultSuggestedAction(language)];

      const defaultSources = getCropDoctorDefaultSources(language);

      return {
        id: `init-${Date.now()}`,
        sender: 'ai',
        text: initialText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        language,
        observedPoints: observed,
        inferredPoints: inferred,
        verifiedPoints: verified,
        unknownPoints: unknown,
        suggestedActions,
        sources: defaultSources,
      };
    }

    return {
      id: `init-${Date.now()}`,
      sender: 'ai',
      text: getCropDoctorAiGreeting(language, activeCountry, farmProfile.crop),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      language,
    };
  }, [report, farmProfile, language, imagesCount, activeCountry]);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (onLoadingChange) {
      onLoadingChange(isLoading);
    }
  }, [isLoading, onLoadingChange]);

  // Load chat history for authenticated user and restore active session if available
  const loadUserHistory = useCallback(async () => {
    if (!user?.uid) {
      setSessions([]);
      hasLoadedInitialHistoryRef.current = false;
      const initMsg = buildInitialMessage();
      setMessages([initMsg]);
      return;
    }

    setIsLoadingHistory(true);
    try {
      const fetched = await getUserConversations(user.uid, activeCountry, 30);
      if (isMountedRef.current) {
        setSessions(fetched);

        // On first load or after user login / refresh, restore the latest active session if present
        if (!hasLoadedInitialHistoryRef.current) {
          if (fetched && fetched.length > 0) {
            const latest = fetched[0];
            if (latest.messages && latest.messages.length > 0) {
              setCurrentSessionId(latest.id);
              setCurrentSessionTitle(latest.title || 'Crop Consultation');
              sessionCreatedAtRef.current = latest.createdAt || new Date().toISOString();
              setMessages(latest.messages);
            } else {
              const initMsg = buildInitialMessage();
              setMessages([initMsg]);
            }
          } else {
            const initMsg = buildInitialMessage();
            setMessages([initMsg]);
          }
          hasLoadedInitialHistoryRef.current = true;
        }
      }
    } catch (err) {
      console.warn('[CropDoctorChat] Failed to load chat history:', err);
      if (isMountedRef.current && !hasLoadedInitialHistoryRef.current) {
        const initMsg = buildInitialMessage();
        setMessages([initMsg]);
        hasLoadedInitialHistoryRef.current = true;
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoadingHistory(false);
      }
    }
  }, [user?.uid, activeCountry, buildInitialMessage]);

  // Detect user switch / login / logout
  useEffect(() => {
    if (prevUserIdRef.current !== user?.uid) {
      prevUserIdRef.current = user?.uid;
      hasLoadedInitialHistoryRef.current = false;
      loadUserHistory();
    }
  }, [user?.uid, loadUserHistory]);

  // Initial load effect
  useEffect(() => {
    loadUserHistory();
  }, [loadUserHistory]);

  // Set initial default title & quick questions on report/crop changes
  useEffect(() => {
    let defaultTitle = '';
    if (report) {
      const condition = report.condition || report.disease || 'Crop Diagnosis';
      defaultTitle = getLocalizedConsultationTitle(condition, language);
    } else {
      defaultTitle = getCropDoctorShortGreeting(language);
    }

    // Only update session title if current session is empty
    if (!currentSessionTitle || messages.length <= 1) {
      setCurrentSessionTitle(defaultTitle);
    }

    if (report) {
      setQuickQuestions(getCropDoctorReportQuickQuestions(language));
    } else {
      setQuickQuestions(getCropDoctorDefaultQuickQuestions(language));
    }
  }, [report, farmProfile.crop, language]);

  // If a new diagnostic report becomes active or language changes, and the user has not started a custom conversation yet,
  // update the welcome message to reflect the active diagnostic findings in the selected language.
  const prevReportIdRef = useRef<string | undefined>(undefined);
  const prevLangRef = useRef<Language>(language);
  useEffect(() => {
    const reportChanged = report?.id !== prevReportIdRef.current;
    const langChanged = language !== prevLangRef.current;
    if (reportChanged) prevReportIdRef.current = report?.id;
    if (langChanged) prevLangRef.current = language;

    if (reportChanged || langChanged) {
      setMessages((prevMsgs) => {
        const hasUserMessage = prevMsgs.some((m) => m.sender === 'user');
        if (!hasUserMessage) {
          return [buildInitialMessage()];
        }
        return prevMsgs;
      });
    }
  }, [report?.id, language, buildInitialMessage]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Update dynamic quick questions after user input
  const updateDynamicChips = (lastQuery: string) => {
    const dynamic = getCropDoctorDynamicFollowupQuestions(lastQuery, language);
    setQuickQuestions(dynamic);
  };

  // Cloud persistence helper (guarantees immediate write to Firestore with complete metadata)
  const persistSessionToCloud = useCallback(
    async (messagesToSave: CropDoctorChatMessage[], customTitle?: string) => {
      if (!user?.uid) return;
      setIsSyncing(true);
      try {
        const titleToUse = customTitle || currentSessionTitle || 'Crop Consultation';
        const sessionObj: ChatSession = {
          id: currentSessionId,
          userId: user.uid,
          title: titleToUse,
          messages: messagesToSave,
          updatedAt: new Date().toISOString(),
          createdAt: sessionCreatedAtRef.current,
          farmId: farmProfile?.id,
          farmName: farmProfile?.farmName,
          crop: report?.crop || farmProfile?.crop || 'Crop',
          condition: report?.condition || report?.disease,
          selectedLanguage: language,
          conversationType: 'crop-doctor',
          countryCode: activeCountry,
        };

        await saveConversationSession(user.uid, sessionObj, activeCountry);

        if (isMountedRef.current) {
          setSessions((prev) => {
            const filtered = prev.filter((s) => s.id !== sessionObj.id);
            const updated = [sessionObj, ...filtered];
            return updated.sort(
              (a, b) => new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime()
            );
          });
        }
      } catch (err) {
        console.warn('[CropDoctorChat] Cloud sync failed:', err);
      } finally {
        if (isMountedRef.current) {
          setIsSyncing(false);
        }
      }
    },
    [user?.uid, currentSessionId, currentSessionTitle, report, farmProfile, language, activeCountry]
  );

  // Handle external queries
  useEffect(() => {
    if (externalQuery && externalQuery.trim()) {
      handleSendMessage(externalQuery);
      if (onClearExternalQuery) {
        onClearExternalQuery();
      }
    }
  }, [externalQuery]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query || isLoading) return;

    setInputText('');
    updateDynamicChips(query);

    const isFirstUserQuery = !messages.some((m) => m.sender === 'user');
    let titleToSet = currentSessionTitle;
    if (isFirstUserQuery) {
      const truncated = query.length > 42 ? query.slice(0, 40) + '...' : query;
      titleToSet = truncated;
      setCurrentSessionTitle(truncated);
    }

    const userMessage: CropDoctorChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      language,
    };

    const updatedMessagesWithUser = [...messages, userMessage];
    setMessages(updatedMessagesWithUser);
    setIsLoading(true);
    setRobotState('analyzing');

    // Save user message immediately to Firestore
    await persistSessionToCloud(updatedMessagesWithUser, titleToSet);

    try {
      const data = await safeFetchJson('/api/crop-doctor/chat', {
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
          weatherContext: weather || {},
          soilContext: soilReport || {},
          advisoryContext: advisory || {},
          caseContext: {
            hasActiveDiagnosis: !!report,
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
          messagesHistory: updatedMessagesWithUser.map((m) => ({
            role: m.sender === 'user' ? 'user' : 'model',
            content: m.text,
          })),
        }),
      });

      setRobotState('idle');

      const aiResponse: CropDoctorChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: data.answer || data.reply || data.text || 'I have reviewed your query based on the active crop diagnosis.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        language,
        observedPoints: data.observedPoints,
        inferredPoints: data.inferredPoints,
        verifiedPoints: data.verifiedPoints,
        unknownPoints: data.unknownPoints,
        technicalDetails: data.technicalDetails,
        suggestedActions: data.suggestedActions,
        sources: data.sources,
      };

      const finalMessages = [...updatedMessagesWithUser, aiResponse];
      setMessages(finalMessages);

      // Save bot response to Firestore
      await persistSessionToCloud(finalMessages, titleToSet);
    } catch (err: any) {
      console.warn('[CropDoctorChat] Fallback engaged:', err?.message || err);
      const fallbackResponse = buildContextualFallback(query, report, farmProfile);
      const finalMessages = [...updatedMessagesWithUser, fallbackResponse];
      setMessages(finalMessages);
      setRobotState('idle');
      await persistSessionToCloud(finalMessages, titleToSet);
    } finally {
      setIsLoading(false);
    }
  };

  const buildContextualFallback = (
    userQuery: string,
    reportData?: DiagnosisResult | null,
    farm?: FarmProfile
  ): CropDoctorChatMessage => {
    const rawCondition = reportData?.condition || reportData?.disease || 'Crop Disease';
    const conditionName = localizeDiseaseName(rawCondition, language);
    const rawCrop = reportData?.crop || farm?.crop || 'Crop';
    const cropName = localizeCrop(rawCrop, language);

    const fallbackResult = getCropDoctorLocalizedFallback(
      userQuery,
      conditionName,
      cropName,
      reportData?.immediateActions,
      reportData?.causes,
      language
    );

    const fallbackText = typeof fallbackResult === 'string' ? fallbackResult : fallbackResult.text;
    const defaultSources = getCropDoctorDefaultSources(language);

    return {
      id: `ai-fb-${Date.now()}`,
      sender: 'ai',
      text: fallbackText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      language,
      observedPoints: [getLocalizedDefaultObservedPoint(language)],
      inferredPoints: [getLocalizedDefaultInferredPoint(language)],
      verifiedPoints: [getCropDoctorVerifiedPoint(language, farmProfile.crop || 'Crop')],
      unknownPoints: [getLocalizedDefaultUnknownPoint(language)],
      suggestedActions: [getLocalizedDefaultSuggestedAction(language)],
      sources: defaultSources,
    };
  };

  const startNewSession = () => {
    const newId = `conv_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    setCurrentSessionId(newId);
    sessionCreatedAtRef.current = new Date().toISOString();
    const initMsg = buildInitialMessage();
    setMessages([initMsg]);
    const defaultTitle = report
      ? getLocalizedConsultationTitle(report.condition || report.disease || 'Diagnosis', language)
      : getCropDoctorShortGreeting(language);
    setCurrentSessionTitle(defaultTitle);
    setQuickQuestions(report ? getCropDoctorReportQuickQuestions(language) : getLocalizedDefaultQuestions(language));
    setIsHistoryOpen(false);
  };

  const switchSession = (session: ChatSession) => {
    console.log(`[CropDoctor History] Selecting conversation: ${session.id}, Message count: ${session.messages?.length || 0}`);
    setCurrentSessionId(session.id);
    setCurrentSessionTitle(session.title || 'Crop Consultation');
    sessionCreatedAtRef.current = session.createdAt || new Date().toISOString();
    setMessages(session.messages || []);
    if (session.selectedLanguage && onLanguageChange && session.selectedLanguage !== language) {
      onLanguageChange(session.selectedLanguage);
    }
    setIsHistoryOpen(false);
  };

  const handleDeleteSession = async (sessionIdToDelete: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (deletingSessionIdsRef.current.has(sessionIdToDelete)) return;
    deletingSessionIdsRef.current.add(sessionIdToDelete);

    setSessions((prev) => prev.filter((s) => s.id !== sessionIdToDelete));

    if (user?.uid) {
      try {
        await deleteConversationSession(user.uid, sessionIdToDelete, activeCountry);
      } catch (err) {
        console.warn('[CropDoctorChat] Delete session failed:', err);
      } finally {
        deletingSessionIdsRef.current.delete(sessionIdToDelete);
      }
    } else {
      deletingSessionIdsRef.current.delete(sessionIdToDelete);
    }

    if (sessionIdToDelete === currentSessionId) {
      startNewSession();
    }
  };

  const filteredSessions = sessions.filter((s) => {
    if (!searchHistoryQuery.trim()) return true;
    const q = searchHistoryQuery.toLowerCase();
    return (
      s.title?.toLowerCase().includes(q) ||
      s.crop?.toLowerCase().includes(q) ||
      s.condition?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#0c1810] rounded-2xl border border-stone-200/80 dark:border-stone-800 shadow-md overflow-hidden relative">
      {/* 1. Header with Robot Status Badge & Session History Drawer Toggle */}
      <div className="p-3 sm:p-4 bg-gradient-to-r from-emerald-900 via-emerald-850 to-teal-900 text-white flex items-center justify-between gap-3 shadow-xs shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <CropDoctorRobot state={robotState} size="md" />
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-heading font-bold text-sm sm:text-base tracking-tight truncate">
                {t.cropDoctorChatTitle || 'Crop Doctor AI Chatbot'}
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-700/80 text-emerald-100 font-medium border border-emerald-500/40 shrink-0">
                {getCropDoctorBotBadge(language)}
              </span>
            </div>
            <p className="text-[11px] text-emerald-200/90 truncate mt-0.5">
              {currentSessionTitle || (report ? `${report.crop || farmProfile.crop} • ${report.condition || report.disease}` : farmProfile.crop)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {/* New Chat Button */}
          <button
            type="button"
            onClick={startNewSession}
            className="p-1.5 sm:px-2.5 sm:py-1 rounded-xl bg-emerald-800/80 hover:bg-emerald-700 text-emerald-100 border border-emerald-600/50 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-all shadow-2xs"
            title={sessionI18n.newChat}
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{sessionI18n.newChat}</span>
          </button>

          {/* History Drawer Toggle Button */}
          <button
            type="button"
            onClick={() => setIsHistoryOpen(!isHistoryOpen)}
            className={`p-1.5 sm:px-2.5 sm:py-1 rounded-xl border text-xs font-semibold flex items-center gap-1 cursor-pointer transition-all shadow-2xs relative ${
              isHistoryOpen
                ? 'bg-emerald-500 text-emerald-950 border-emerald-300'
                : 'bg-emerald-800/80 hover:bg-emerald-700 text-emerald-100 border-emerald-600/50'
            }`}
            title={sessionI18n.history}
          >
            <History className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{sessionI18n.history}</span>
            {sessions.length > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 text-[9px] rounded-full bg-emerald-950 text-emerald-200 font-bold border border-emerald-600/60">
                {sessions.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Slide-out Chat History Drawer Overlay */}
      {isHistoryOpen && (
        <div className="absolute inset-0 z-30 bg-stone-900/60 backdrop-blur-xs flex justify-end transition-opacity">
          <div className="w-full sm:w-80 bg-white dark:bg-[#0c1810] h-full shadow-2xl flex flex-col border-l border-stone-200 dark:border-stone-800 animate-in slide-in-from-right duration-200">
            {/* Drawer Header */}
            <div className="p-3 bg-stone-100 dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-emerald-600" />
                <h4 className="font-heading font-bold text-xs text-stone-900 dark:text-stone-100">
                  {sessionI18n.history}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setIsHistoryOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-stone-200 dark:hover:bg-stone-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Search Input */}
            <div className="p-2 border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-[#0a150e]">
              <div className="relative flex items-center">
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5" />
                <input
                  type="text"
                  value={searchHistoryQuery}
                  onChange={(e) => setSearchHistoryQuery(e.target.value)}
                  placeholder={sessionI18n.searchPlaceholder}
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-xs text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:border-emerald-600"
                />
                {searchHistoryQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchHistoryQuery('')}
                    className="absolute right-2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>

            {/* Session List */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
              {!user?.uid && (
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-amber-900 dark:text-amber-200 text-xs space-y-1.5">
                  <p className="font-medium text-[11px] leading-relaxed">
                    {sessionI18n.signInToSave}
                  </p>
                  <button
                    type="button"
                    onClick={() => setAuthModalOpen(true)}
                    className="px-2.5 py-1 rounded-lg bg-amber-700 hover:bg-amber-800 text-white font-bold text-[10px] cursor-pointer"
                  >
                    {t.login}
                  </button>
                </div>
              )}

              {isLoadingHistory ? (
                <div className="p-4 text-center text-xs text-stone-400 flex items-center justify-center gap-2">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-600" />
                  <span>Loading consultations...</span>
                </div>
              ) : filteredSessions.length === 0 ? (
                <div className="p-6 text-center text-stone-400 dark:text-stone-500 text-xs">
                  <MessageSquare className="w-6 h-6 mx-auto mb-1.5 opacity-40" />
                  <p className="font-medium">{sessionI18n.noSavedChats}</p>
                </div>
              ) : (
                filteredSessions.map((session) => {
                  const isActive = session.id === currentSessionId;
                  return (
                    <div
                      key={session.id}
                      onClick={() => switchSession(session)}
                      className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all flex items-start justify-between gap-2 group ${
                        isActive
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 shadow-2xs'
                          : 'bg-white hover:bg-stone-50 dark:bg-stone-900/60 dark:hover:bg-stone-800/60 border-stone-200/80 dark:border-stone-800'
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-stone-900 dark:text-stone-100 truncate text-xs">
                            {session.title || 'Crop Consultation'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-[10px] text-stone-500 dark:text-stone-400">
                          <span className="flex items-center gap-1 truncate">
                            <Clock className="w-2.5 h-2.5" />
                            {formatSessionDate(session.createdAt || session.updatedAt)}
                          </span>
                          {session.messages?.length > 0 && (
                            <span>• {session.messages.length} msgs</span>
                          )}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => handleDeleteSession(session.id, e)}
                        className="p-1 rounded text-stone-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-stone-100 dark:hover:bg-stone-800 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shrink-0"
                        title={sessionI18n.deleteConfirm}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2. Chat Conversation Stream */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3.5">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center text-center p-6 sm:p-8 my-auto space-y-3">
            <CropDoctorRobot state={robotState} size="xl" />
            <div className="space-y-1 max-w-sm">
              <h4 className="font-heading font-bold text-sm sm:text-base text-stone-900 dark:text-stone-100">
                {t.cropDoctorChatTitle || 'Crop Doctor AI Chatbot'}
              </h4>
              <p className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
                {language === 'te'
                  ? 'మీ పంటల ఆరోగ్యం, తెగుళ్ల నివారణ లేదా సేంద్రీయ చికిత్స గురించి నన్ను అడగండి.'
                  : language === 'hi'
                  ? 'अपनी फसल के स्वास्थ्य, कीट रोकथाम या जैविक उपचार के बारे में मुझसे पूछें।'
                  : 'Ask me anything about crop diseases, organic treatments, chemical dosages, or prevention.'}
              </p>
            </div>
          </div>
        )}

        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          const isExpanded = expandedDetailsId === msg.id;

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[92%] sm:max-w-[85%] ${
                isUser ? 'ml-auto' : 'mr-auto'
              }`}
            >
              <div
                className={`p-3 sm:p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed space-y-2 shadow-2xs ${
                  isUser
                    ? 'bg-emerald-700 text-white rounded-br-2xs'
                    : 'bg-stone-100 dark:bg-stone-900/90 text-stone-900 dark:text-stone-100 border border-stone-200/80 dark:border-stone-800 rounded-bl-2xs'
                }`}
              >
                {/* Message Header */}
                <div className="flex items-center justify-between gap-2 border-b border-stone-200/40 dark:border-stone-800/40 pb-1 text-[10px] font-semibold text-stone-400 dark:text-stone-400">
                  <div className="flex items-center gap-1.5">
                    {!isUser && <CropDoctorRobot state="idle" size="xs" />}
                    <span className={isUser ? 'text-emerald-100' : 'text-emerald-700 dark:text-emerald-400 font-bold'}>
                      {isUser ? t.chatYou || 'You' : t.cropDoctorChatTitle || 'KhetiNexus AI Agent'}
                    </span>
                  </div>
                </div>

                {/* Main Markdown Body */}
                <div className="prose prose-xs dark:prose-invert max-w-none">
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>

                {/* Structured Evidence Accordion (AI Responses Only) */}
                {!isUser && (msg.observedPoints || msg.inferredPoints || msg.verifiedPoints || msg.unknownPoints || msg.suggestedActions) && (
                  <div className="pt-1 mt-1 border-t border-stone-200/60 dark:border-stone-800/60 space-y-2">
                    <button
                      type="button"
                      onClick={() => setExpandedDetailsId(isExpanded ? null : msg.id)}
                      className="flex items-center justify-between w-full text-[10px] font-bold text-emerald-800 dark:text-emerald-300 hover:text-emerald-900 dark:hover:text-emerald-200 cursor-pointer pt-0.5"
                    >
                      <span className="flex items-center gap-1">
                        <Info className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                        {t.chatEvidenceDetails || 'Structured Clinical Diagnosis Evidence'}
                      </span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>

                    {isExpanded && (
                      <div className="space-y-2 pt-1.5 animate-in fade-in duration-150">
                        {/* Observed Points */}
                        {msg.observedPoints && msg.observedPoints.length > 0 && (
                          <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-900/60 text-[11px] text-emerald-900 dark:text-emerald-200">
                            <span className="font-bold block text-emerald-900 dark:text-emerald-300 text-[10px] uppercase">
                              {t.chatObserved}:
                            </span>
                            <p className="mt-0.5">{msg.observedPoints.join(' • ')}</p>
                          </div>
                        )}

                        {/* Inferred Points */}
                        {msg.inferredPoints && msg.inferredPoints.length > 0 && (
                          <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-900/60 text-[11px] text-amber-900 dark:text-amber-200">
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

      {/* 4. Text Input Bar */}
      <div className="p-3 bg-white dark:bg-[#0c1810] border-t border-stone-200/80 dark:border-stone-800 space-y-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          {/* Multiline Textarea Input */}
          <textarea
            ref={inputRef}
            rows={1}
            value={inputText}
            onChange={(e) => {
              const val = e.target.value;
              setInputText(val);
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
