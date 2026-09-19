import React, { useState, useRef, useEffect } from 'react';
import {
  Stethoscope,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  HelpCircle,
  X,
  FileCheck,
  Info,
  Camera,
  Plus,
  Trash2,
  Lock,
  LogIn,
} from 'lucide-react';
import { DiagnosisResult, FarmProfile, Language } from '../types';
import { getTranslation, getRecommendedLanguageForLocation } from '../i18n/translations';
import { localizeCrop } from '../i18n/dataTranslations';
import { CropDoctorChat } from './cropdoctor/CropDoctorChat';
import { PathologicalAssessmentCard } from './cropdoctor/PathologicalAssessmentCard';

interface CropDoctorViewProps {
  currentFarm: FarmProfile;
  diagnoses: DiagnosisResult[];
  onAddDiagnosis: (res: DiagnosisResult) => void;
  language: Language;
  onLanguageChange?: (lang: Language) => void;
  isLoggedIn?: boolean;
  onOpenAuth?: () => void;
}

export const CropDoctorView: React.FC<CropDoctorViewProps> = ({
  currentFarm,
  diagnoses,
  onAddDiagnosis,
  language,
  onLanguageChange,
  isLoggedIn = false,
  onOpenAuth,
}) => {
  const [selectedCrop, setSelectedCrop] = useState(currentFarm.crop || '');
  const [symptoms, setSymptoms] = useState('');
  const [images, setImages] = useState<{ base64: string; mimeType: string; id: string }[]>([]);
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [activeReport, setActiveReport] = useState<DiagnosisResult | null>(null);
  const [externalChatQuery, setExternalChatQuery] = useState<string | null>(null);
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Camera Modal & Options State
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  const [isCameraLoading, setIsCameraLoading] = useState(false);
  const [showAddPhotoOptions, setShowAddPhotoOptions] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  const t = getTranslation(language);

  useEffect(() => {
    setSelectedCrop(currentFarm.crop || '');
  }, [currentFarm.crop]);

  // Automatically recommend regional Indian languages for India-First KhetiNexus AI
  useEffect(() => {
    try {
      const userSelected = localStorage.getItem('khetinexus_language_selected') === 'true';
      if (!userSelected && onLanguageChange) {
        const recommended = getRecommendedLanguageForLocation(
          currentFarm?.stateRegion,
          currentFarm?.country
        );
        if (recommended && recommended !== language) {
          onLanguageChange(recommended);
        }
      }
    } catch (e) {
      console.error('Error selecting regional recommended language:', e);
    }
  }, [currentFarm?.stateRegion, currentFarm?.country, language, onLanguageChange]);

  // Clean up media stream when component unmounts
  useEffect(() => {
    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Bind media stream to video element when camera modal opens
  useEffect(() => {
    if (isCameraModalOpen && videoRef.current && mediaStreamRef.current) {
      videoRef.current.srcObject = mediaStreamRef.current;
    }
  }, [isCameraModalOpen]);

  const clearPreviousDiagnosis = () => {
    setActiveReport(null);
    setErrorMessage(null);
    setCameraError(null);
  };

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;

    clearPreviousDiagnosis();
    setSymptoms('');
    setShowAddPhotoOptions(false);

    const newFiles = Array.from(fileList);
    if (images.length + newFiles.length > 5) {
      setErrorMessage('Maximum 5 images allowed per diagnostic case.');
      return;
    }

    const validFiles = newFiles.filter((file) => {
      if (!file.type.startsWith('image/')) {
        setErrorMessage(t.validImageError);
        return false;
      }
      if (file.size > 10 * 1024 * 1024) {
        setErrorMessage(t.imageTooLargeError);
        return false;
      }
      return true;
    });

    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages((prev) => [
          ...prev,
          {
            base64: reader.result as string,
            mimeType: file.type,
            id: Math.random().toString(36).substring(7),
          },
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
    e.target.value = '';
  };

  const handleCameraFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
    e.target.value = '';
  };

  const handleTriggerCamera = async () => {
    setCameraError(null);
    setErrorMessage(null);
    setShowAddPhotoOptions(false);

    if (images.length >= 5) {
      setErrorMessage('Maximum 5 images allowed per diagnostic case.');
      return;
    }

    // Attempt browser WebRTC getUserMedia first
    if (navigator.mediaDevices && typeof navigator.mediaDevices.getUserMedia === 'function') {
      setIsCameraLoading(true);
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: 'environment' },
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          },
        });
        mediaStreamRef.current = stream;
        setIsCameraModalOpen(true);
        setIsCameraLoading(false);
      } catch (err: any) {
        setIsCameraLoading(false);
        console.warn('WebRTC camera error:', err);

        // Fallback: Trigger native camera file input with capture="environment"
        if (cameraInputRef.current) {
          cameraInputRef.current.click();
        } else {
          setCameraError(
            'Camera access was denied or camera is unavailable on this device. You can upload an image from your gallery instead.'
          );
        }
      }
    } else if (cameraInputRef.current) {
      // Direct fallback to HTML file input capture="environment" for native devices
      cameraInputRef.current.click();
    } else {
      setCameraError(
        'Camera is unavailable on this device browser. Please use the Upload Images button to select from gallery.'
      );
    }
  };

  const handleCaptureCameraPhoto = () => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);

      clearPreviousDiagnosis();
      setSymptoms('');
      setImages((prev) => [
        ...prev,
        {
          base64: dataUrl,
          mimeType: 'image/jpeg',
          id: Math.random().toString(36).substring(7),
        },
      ]);
    }

    handleCloseCameraModal();
  };

  const handleCloseCameraModal = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    setIsCameraModalOpen(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const handleClearImage = () => {
    setImages([]);
    clearPreviousDiagnosis();
    setSymptoms('');
    setShowAddPhotoOptions(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  const handleRemoveImage = (idToRemove: string) => {
    setImages((prev) => prev.filter((img) => img.id !== idToRemove));
    clearPreviousDiagnosis();
  };

  const compressAndOptimizeImage = (
    dataUrl: string,
    mimeType: string,
    maxWidth = 1200,
    maxHeight = 1200,
    quality = 0.85
  ): Promise<{ base64: string; mimeType: string }> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        try {
          let { width, height } = img;
          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width = Math.round(width * ratio);
            height = Math.round(height * ratio);
          }
          const canvas = document.createElement('canvas');
          canvas.width = Math.max(width, 250);
          canvas.height = Math.max(height, 250);
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            return resolve({ base64: dataUrl, mimeType });
          }

          if (mimeType === 'image/svg+xml' || dataUrl.startsWith('data:image/svg+xml') || dataUrl.includes('<svg')) {
            ctx.fillStyle = '#2D3748';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            const optimized = canvas.toDataURL('image/png');
            return resolve({ base64: optimized, mimeType: 'image/png' });
          }

          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const exportMime = mimeType === 'image/png' ? 'image/png' : 'image/jpeg';
          const optimized = canvas.toDataURL(exportMime, quality);
          resolve({ base64: optimized, mimeType: exportMime });
        } catch {
          resolve({ base64: dataUrl, mimeType });
        }
      };
      img.onerror = () => resolve({ base64: dataUrl, mimeType });
      img.src = dataUrl;
    });
  };

  const handleRunDiagnosis = async () => {
    if (images.length === 0) {
      setErrorMessage('Please upload or select at least one photo first.');
      return;
    }

    setIsDiagnosing(true);
    setErrorMessage(null);
    setActiveReport(null);

    try {
      const compressedImages = await Promise.all(
        images.map(async (img) => {
          const { base64, mimeType } = await compressAndOptimizeImage(img.base64, img.mimeType);
          return { base64, mimeType };
        })
      );

      const res = await fetch('/api/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          images: compressedImages,
          crop: currentFarm.crop,
          symptoms,
          language,
          farmContext: {
            location: currentFarm.location,
            stateRegion: currentFarm.stateRegion,
            soilType: currentFarm.soilType,
            irrigationType: currentFarm.irrigationType,
            growthStage: currentFarm.growthStage
          }
        }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => null);
        throw new Error(errJson?.error || 'AI vision diagnosis is temporarily unavailable. Please try again.');
      }

      const data = await res.json();
      const newResult: DiagnosisResult = {
        id: `diag-${Date.now()}`,
        isReliable: data.isReliable !== false,
        category: data.category || 'Disease',
        subcategory: data.subcategory,
        condition: data.condition || data.disease || 'Unable to determine reliably',
        subtype: data.subtype,
        disease: data.disease || data.condition || 'Unable to determine reliably',
        scientificName: data.scientificName || undefined,
        scientificNameStatus: data.scientificNameStatus,
        cropConsistency: data.cropConsistency,
        affectedStructures: data.affectedStructures,
        imageQuality: data.imageQuality,
        visualEvidenceArray: data.visualEvidenceArray,
        candidateDiagnoses: data.candidateDiagnoses,
        verification: data.verification,
        recheck: data.recheck,
        confidenceDetails: data.confidenceDetails,
        problem: data.problem,
        likelyCause: data.likelyCause,
        immediateActionsList: data.immediateActionsList,
        managementList: data.managementList,
        preventionList: data.preventionList,
        monitoringList: data.monitoringList,
        additionalImagesRequired: data.additionalImagesRequired,
        recommendedAdditionalImages: data.recommendedAdditionalImages,
        secondaryFindings: data.secondaryFindings,

        confidence: data.confidence || 'Moderate',
        confidenceExplanation: data.confidenceExplanation || undefined,
        visibleSymptoms: data.visibleSymptoms || 'No diagnostic characteristics documented.',
        causes: data.causes || 'Agronomic or environmental factor.',
        immediateActions: data.immediateActions || 'Maintain observation and consult local agronomist.',
        preventionPractices: data.preventionPractices || 'Implement standard regenerative soil and crop hygiene.',
        disclaimer: data.disclaimer,
        imagePreview: images[0]?.base64,
        crop: currentFarm.crop,
        timestamp: 'Just now',
        isDemo: false,
        source: 'Google Gemini Live AI',
      };

      setActiveReport(newResult);
      onAddDiagnosis(newResult);
      setErrorMessage(null);
    } catch (err: any) {
      console.error(err);
      setActiveReport(null);
      setErrorMessage(err.message || 'AI vision service error. Please try again.');
    } finally {
      setIsDiagnosing(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="w-full max-w-4xl mx-auto px-3 sm:px-6 py-6 sm:py-10 space-y-6">
        {/* Banner / Header */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-8 shadow-sm text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-xs font-semibold">
              <Lock className="w-3.5 h-3.5" />
              <span>Registered Users Only</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100 flex items-center justify-center sm:justify-start gap-3">
              <Stethoscope className="w-7 h-7 text-emerald-600 dark:text-emerald-500" />
              <span>Crop Doctor AI Diagnostic Engine</span>
            </h1>
            <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
              Crop Doctor uses Gemini Vision AI to diagnose crop diseases, pest infestations, and physiological abnormalities directly from leaf photos.
            </p>
          </div>
          {onOpenAuth && (
            <button
              type="button"
              onClick={onOpenAuth}
              className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all shrink-0 cursor-pointer flex items-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              <span>Login to Use Crop Doctor</span>
            </button>
          )}
        </div>

        {/* Capabilities Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 space-y-2 text-left">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Camera className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm">Live Camera & Gallery Upload</h3>
            <p className="text-xs text-stone-600 dark:text-stone-400">Take instant leaf photos using your camera or upload up to 5 photos per diagnosis.</p>
          </div>

          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 space-y-2 text-left">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm">Gemini Multimodal AI</h3>
            <p className="text-xs text-stone-600 dark:text-stone-400">Receive scientific disease classification, confidence ratings, and organic treatment plans.</p>
          </div>

          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 space-y-2 text-left">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm">Personalized Farm Records</h3>
            <p className="text-xs text-stone-600 dark:text-stone-400">Store disease histories directly linked to your specific Farm Profile in Firestore.</p>
          </div>
        </div>

        {/* Access Restriction Notice */}
        <div className="bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 text-center space-y-4">
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 max-w-lg mx-auto leading-relaxed">
            Crop Doctor is available for registered users. Log in or create your farm account to access AI-powered crop health analysis.
          </p>
          {onOpenAuth && (
            <button
              type="button"
              onClick={onOpenAuth}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:hover:white text-stone-100 dark:text-stone-900 text-xs font-semibold transition-all cursor-pointer shadow-sm"
            >
              <LogIn className="w-4 h-4" />
              <span>Login / Register Now</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-5 sm:space-y-6 min-w-0 box-border">
      {/* Header */}
      <div className="bg-white dark:bg-[#0c1810] rounded-2xl border border-stone-200/80 dark:border-stone-800/80 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 flex items-center justify-center shrink-0">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-heading text-2xl font-bold text-stone-900 dark:text-stone-100">
              {t.cropDoctorTitle}
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-0.5">
              {t.cropDoctorSubtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-3.5 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-semibold border border-stone-200 dark:border-stone-700">
            {t.targetCropLabel}: <strong className="text-emerald-700 dark:text-emerald-400">{localizeCrop(selectedCrop, language)}</strong>
          </span>
        </div>
      </div>

      {/* Top Section: Left [ AI Chat ] + Right [ Image Upload / Diagnosed Specimen ] */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-start w-full">
        {/* Left Column (lg:col-span-7): KhetiNexus AI Crop Doctor Interactive Chat */}
        <div className="lg:col-span-7 space-y-4 min-w-0 w-full">
          <CropDoctorChat
            report={activeReport}
            farmProfile={currentFarm}
            language={language}
            onLanguageChange={onLanguageChange}
            imagesCount={images.length || 1}
            externalQuery={externalChatQuery}
            onClearExternalQuery={() => setExternalChatQuery(null)}
            onLoadingChange={setIsChatLoading}
          />
        </div>

        {/* Right Column (lg:col-span-5): Image Upload Card or Diagnosed Specimen Card */}
        <div className="lg:col-span-5 space-y-4 min-w-0 w-full">
          {activeReport ? (
            /* Active Diagnosed Specimen Card */
            <div className="bg-white dark:bg-[#0c1810] rounded-2xl border border-stone-200/80 dark:border-stone-800/80 p-4 sm:p-5 shadow-xs space-y-3.5 transition-colors">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 flex items-center justify-center shrink-0">
                    <Camera className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100">
                      Diagnosed Specimen
                    </h4>
                    <p className="text-[11px] text-stone-500 dark:text-stone-400">
                      {images.length} photo{images.length > 1 ? 's' : ''} • {selectedCrop || currentFarm.crop || 'Crop'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setActiveReport(null);
                    setErrorMessage(null);
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
                  aria-label="New Diagnosis"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>New Case</span>
                </button>
              </div>

              {/* Thumbnails grid */}
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {images.map((img, idx) => (
                  <div
                    key={img.id}
                    className="relative rounded-xl overflow-hidden border border-stone-200 dark:border-stone-700 aspect-square bg-stone-100 dark:bg-stone-900 shadow-2xs group"
                  >
                    <img
                      src={img.base64}
                      alt={`Diagnosed photo ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-1 left-1 px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-stone-900/80 text-white">
                      #{idx + 1}
                    </span>
                  </div>
                ))}
              </div>

              {/* Supporting Evidence Uploader: Camera & Upload File */}
              {images.length < 5 && (
                <div className="pt-2.5 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold text-stone-500 dark:text-stone-400 whitespace-nowrap">Add Evidence:</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={handleTriggerCamera}
                      disabled={images.length >= 5 || isCameraLoading}
                      className="px-2.5 py-1.5 rounded-lg bg-stone-50 hover:bg-emerald-50 dark:bg-stone-900 dark:hover:bg-emerald-950/50 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 hover:text-emerald-800 dark:hover:text-emerald-300 text-[11px] font-semibold transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50"
                    >
                      <Camera className="w-3 h-3 text-emerald-600 shrink-0" />
                      <span>Camera</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setCameraError(null);
                        setErrorMessage(null);
                        fileInputRef.current?.click();
                      }}
                      disabled={images.length >= 5}
                      className="px-2.5 py-1.5 rounded-lg bg-stone-50 hover:bg-emerald-50 dark:bg-stone-900 dark:hover:bg-emerald-950/50 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 hover:text-emerald-800 dark:hover:text-emerald-300 text-[11px] font-semibold transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50"
                    >
                      <Plus className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Upload File</span>
                    </button>
                  </div>
                </div>
              )}

              <div className="p-2.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/40 text-emerald-900 dark:text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-medium text-[11px]">Analysis active. See clinical report and treatment protocol below.</span>
              </div>
            </div>
          ) : (
            /* Upload Specimen Box */
            <div className="bg-white dark:bg-[#0c1810] rounded-2xl border border-stone-200/80 dark:border-stone-800/80 p-4 sm:p-5 shadow-xs space-y-4 transition-colors">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
                  {t.uploadLeafImage}
                </label>
                <span className="text-[10px] text-stone-500 font-medium">Up to 5 images</span>
              </div>

              {/* Hidden file inputs */}
              <input
                type="file"
                multiple
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                aria-label="Upload Images File Input"
              />
              <input
                type="file"
                ref={cameraInputRef}
                accept="image/*"
                capture="environment"
                onChange={handleCameraFileChange}
                className="hidden"
                aria-label="Take Photo Camera Input"
              />

              {/* Dual Primary Action Buttons: Take Photo & Upload Images */}
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={handleTriggerCamera}
                  disabled={images.length >= 5 || isCameraLoading}
                  className="w-full min-h-[42px] px-3 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  aria-label="Take Photo with device camera"
                >
                  {isCameraLoading ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin shrink-0" />
                  ) : (
                    <Camera className="w-3.5 h-3.5 shrink-0" />
                  )}
                  <span>Take Photo</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setCameraError(null);
                    setErrorMessage(null);
                    if (images.length >= 5) {
                      setErrorMessage('Maximum 5 images allowed per diagnostic case.');
                      return;
                    }
                    fileInputRef.current?.click();
                  }}
                  disabled={images.length >= 5}
                  className="w-full min-h-[42px] px-3 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-900 dark:text-stone-100 font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-stone-300 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  aria-label="Upload Images from device gallery"
                >
                  <ImageIcon className="w-3.5 h-3.5 shrink-0 text-stone-600 dark:text-stone-400" />
                  <span>Upload Files</span>
                </button>
              </div>

              {/* Camera error message alert */}
              {cameraError && (
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold">{cameraError}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCameraError(null)}
                    className="p-1 text-amber-700 dark:text-amber-400 hover:text-amber-900 rounded cursor-pointer"
                    aria-label="Dismiss error"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Drag & Drop Zone / Thumbnails Grid */}
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-2xl p-3.5 sm:p-4 text-center transition-all ${
                  images.length > 0
                    ? 'border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/20'
                    : 'border-stone-300 dark:border-stone-700 hover:border-emerald-600 bg-stone-50/70 dark:bg-stone-900/50'
                }`}
              >
                {images.length > 0 ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-2">
                      {images.map((img, idx) => (
                        <div
                          key={img.id}
                          className="relative rounded-xl overflow-hidden border border-stone-200 dark:border-stone-700 bg-stone-900/5 aspect-square flex items-center justify-center group shadow-xs"
                        >
                          <img
                            src={img.base64}
                            alt={`Selected crop specimen photo ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-1 right-1 flex items-center gap-1">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveImage(img.id);
                              }}
                              className="p-1 rounded-md bg-stone-900/80 hover:bg-rose-700 text-white transition-colors cursor-pointer shadow-xs"
                              title="Remove photo"
                              aria-label={`Remove photo ${idx + 1}`}
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                          <span className="absolute bottom-1 left-1 px-1 py-0.2 rounded text-[9px] font-mono font-bold bg-stone-900/70 text-white">
                            #{idx + 1}
                          </span>
                        </div>
                      ))}

                      {/* Add Photo Button when < 5 images */}
                      {images.length < 5 && (
                        <div className="relative aspect-square">
                          <button
                            type="button"
                            onClick={() => setShowAddPhotoOptions((prev) => !prev)}
                            className="w-full h-full rounded-xl border-2 border-dashed border-emerald-500/80 dark:border-emerald-700/80 bg-emerald-50/50 dark:bg-emerald-950/30 hover:bg-emerald-100/60 dark:hover:bg-emerald-900/50 flex flex-col items-center justify-center cursor-pointer transition-colors p-1.5 text-center"
                            aria-label="Add another photo to diagnostic case"
                          >
                            <div className="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center mb-0.5 shadow-xs">
                              <Plus className="w-3.5 h-3.5" />
                            </div>
                            <span className="text-[10px] font-bold text-emerald-900 dark:text-emerald-200">
                              Add More
                            </span>
                          </button>

                          {/* Add Photo Choice Popup Menu */}
                          {showAddPhotoOptions && (
                            <div className="absolute bottom-full left-0 mb-2 w-40 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-700 shadow-lg p-1.5 z-20 space-y-1">
                              <button
                                type="button"
                                onClick={() => {
                                  setShowAddPhotoOptions(false);
                                  handleTriggerCamera();
                                }}
                                className="w-full px-2 py-1.5 text-left text-xs font-semibold text-stone-800 dark:text-stone-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 rounded-lg flex items-center gap-1.5 cursor-pointer"
                              >
                                <Camera className="w-3 h-3 text-emerald-600" />
                                <span>Take Photo</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setShowAddPhotoOptions(false);
                                  fileInputRef.current?.click();
                                }}
                                className="w-full px-2 py-1.5 text-left text-xs font-semibold text-stone-800 dark:text-stone-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 rounded-lg flex items-center gap-1.5 cursor-pointer"
                              >
                                <ImageIcon className="w-3 h-3 text-emerald-600" />
                                <span>Upload Images</span>
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Bar at bottom of thumbnail area */}
                    <div className="flex justify-between items-center px-1 pt-1 border-t border-stone-200/60 dark:border-stone-800">
                      <p className="text-[11px] text-stone-600 dark:text-stone-400 font-semibold">
                        {images.length}/5 photos selected
                      </p>
                      <button
                        type="button"
                        onClick={handleClearImage}
                        className="inline-flex items-center gap-1 text-[11px] text-rose-600 dark:text-rose-400 font-semibold hover:text-rose-700 underline cursor-pointer"
                        aria-label="Clear all selected images"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Clear All</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 py-2">
                    <div className="flex justify-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 flex items-center justify-center">
                        <Camera className="w-4 h-4" />
                      </div>
                      <div className="w-8 h-8 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 flex items-center justify-center">
                        <Upload className="w-4 h-4" />
                      </div>
                    </div>
                    <p className="text-xs font-bold text-stone-800 dark:text-stone-200">
                      Take photo or drop 1–5 leaf/crop images here
                    </p>
                    <p className="text-[10px] text-stone-500 dark:text-stone-400">
                      Multi-angle photos (top, underside, stem) improve diagnostic accuracy.
                    </p>
                  </div>
                )}
              </div>

              {/* Crop Selector & Symptoms */}
              <div className="space-y-2.5 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">{t.cropSpeciesLabel}</label>
                  <input
                    type="text"
                    value={selectedCrop}
                    onChange={(e) => setSelectedCrop(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 text-xs text-stone-900 dark:text-stone-100 bg-white dark:bg-stone-900 focus:border-emerald-600 outline-none"
                    placeholder={t.cropSpeciesPlaceholder}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    {t.symptomsLabel}
                  </label>
                  <textarea
                    rows={2}
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    placeholder={t.symptomsPlaceholder}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 text-xs text-stone-900 dark:text-stone-100 bg-white dark:bg-stone-900 focus:border-emerald-600 outline-none"
                  />
                </div>

                {errorMessage && (
                  <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-800 dark:text-rose-300 text-xs flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <button
                  id="run-ai-diagnosis-btn"
                  disabled={images.length === 0 || isDiagnosing}
                  onClick={handleRunDiagnosis}
                  className="w-full py-2.5 rounded-xl bg-rose-700 hover:bg-rose-800 disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer min-h-[42px]"
                >
                  {isDiagnosing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>{t.diagnosingCrop}</span>
                    </>
                  ) : (
                    <>
                      <Stethoscope className="w-4 h-4" />
                      <span>{t.diagnoseBtn}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Live WebRTC Camera Stream Modal */}
      {isCameraModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col">
            {/* Modal Header */}
            <div className="p-4 bg-stone-900/90 border-b border-stone-800 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold uppercase tracking-wider">Crop Doctor Viewfinder</span>
              </div>
              <button
                type="button"
                onClick={handleCloseCameraModal}
                className="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
                aria-label="Close camera"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Stream Container */}
            <div className="relative aspect-[4/3] bg-black flex items-center justify-center overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 border-2 border-emerald-500/30 rounded-lg pointer-events-none m-4 border-dashed" />
            </div>

            {/* Camera Controls Footer */}
            <div className="p-4 bg-stone-900 border-t border-stone-800 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={handleCloseCameraModal}
                className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-white text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleCaptureCameraPhoto}
                className="px-6 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg cursor-pointer ring-4 ring-emerald-950"
                aria-label="Capture photo"
              >
                <span className="w-3 h-3 rounded-full bg-white animate-pulse" />
                <span>Capture Photo</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  handleCloseCameraModal();
                  fileInputRef.current?.click();
                }}
                className="px-3 py-2 rounded-xl text-stone-400 hover:text-white text-xs font-semibold cursor-pointer underline"
              >
                Use Files
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Section: Side-by-Side [ Report ] (Left) and [ Solution ] (Right) when report exists, or Educational Highlights */}
      {activeReport ? (
        <div className="w-full space-y-4 pt-2">
          <div className="flex items-center gap-2 px-1">
            <Stethoscope className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wider">
              Diagnostic Pathology & Management
            </h3>
          </div>
          <PathologicalAssessmentCard
            report={activeReport}
            farmProfile={currentFarm}
            language={language}
            selectedCrop={selectedCrop}
            onAskChatbot={(query) => {
              setExternalChatQuery(query);
            }}
            onRetakePhotos={() => {
              setActiveReport(null);
            }}
          />
        </div>
      ) : (
        /* Pre-Diagnosis Educational Framework Cards */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="bg-white dark:bg-[#0c1810] rounded-2xl border border-stone-200/80 dark:border-stone-800/80 p-4 sm:p-5 shadow-xs space-y-2 transition-colors">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 flex items-center justify-center">
              <Camera className="w-4 h-4" />
            </div>
            <h4 className="font-heading font-bold text-stone-900 dark:text-stone-100 text-sm">
              1. Multi-Angle Specimen Intake
            </h4>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              Capture or upload up to 5 clear photos including leaf tops, undersides, lesions, and stem nodes.
            </p>
          </div>

          <div className="bg-white dark:bg-[#0c1810] rounded-2xl border border-stone-200/80 dark:border-stone-800/80 p-4 sm:p-5 shadow-xs space-y-2 transition-colors">
            <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h4 className="font-heading font-bold text-stone-900 dark:text-stone-100 text-sm">
              2. 6-Point Botanical Verification
            </h4>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              Gemini Vision analyzes morphological signatures against ICAR & FAO plant protection compendia to eliminate false positives.
            </p>
          </div>

          <div className="bg-white dark:bg-[#0c1810] rounded-2xl border border-stone-200/80 dark:border-stone-800/80 p-4 sm:p-5 shadow-xs space-y-2 transition-colors">
            <div className="w-9 h-9 rounded-xl bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 flex items-center justify-center">
              <Stethoscope className="w-4 h-4" />
            </div>
            <h4 className="font-heading font-bold text-stone-900 dark:text-stone-100 text-sm">
              3. Actionable IPM & Soil Protocol
            </h4>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              Receive immediate field intervention steps alongside long-term biological prevention and soil health stewardship.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
