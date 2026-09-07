import React, { useState, useRef } from 'react';
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
} from 'lucide-react';
import { DiagnosisResult, FarmProfile, Language } from '../types';
import { getTranslation } from '../i18n/translations';
import { SAMPLE_LEAF_IMAGES } from '../data/mockData';

interface CropDoctorViewProps {
  currentFarm: FarmProfile;
  diagnoses: DiagnosisResult[];
  onAddDiagnosis: (res: DiagnosisResult) => void;
  language: Language;
}

export const CropDoctorView: React.FC<CropDoctorViewProps> = ({
  currentFarm,
  diagnoses,
  onAddDiagnosis,
  language,
}) => {
  const [selectedCrop, setSelectedCrop] = useState(currentFarm.crop);
  const [symptoms, setSymptoms] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(SAMPLE_LEAF_IMAGES[0].svgData);
  const [imageMimeType, setImageMimeType] = useState('image/svg+xml');
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeReport, setActiveReport] = useState<DiagnosisResult | null>(diagnoses[0] || null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const t = getTranslation(language);

  // File selection / drag drop handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please upload a valid image file (JPG, PNG, WebP).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage('Image size is too large (max 10MB). Please choose a smaller photo.');
      return;
    }

    setErrorMessage(null);
    setImageMimeType(file.type);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setImageMimeType(file.type);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
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
    if (!imagePreview) {
      setErrorMessage('Please upload or select a leaf photo first.');
      return;
    }

    setIsDiagnosing(true);
    setErrorMessage(null);

    try {
      const { base64: sendImage, mimeType: sendMime } = await compressAndOptimizeImage(
        imagePreview,
        imageMimeType
      );

      const res = await fetch('/api/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: sendImage,
          mimeType: sendMime,
          crop: selectedCrop,
          symptoms,
          language,
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
        disease: data.disease || 'Unable to determine reliably from this image.',
        confidence: data.confidence || 'Moderate',
        visibleSymptoms: data.visibleSymptoms || 'No prominent lesions detected.',
        causes: data.causes || 'Environmental or pathological condition.',
        immediateActions: data.immediateActions || 'Maintain observation.',
        preventionPractices: data.preventionPractices || 'Apply standard organic hygiene.',
        disclaimer: data.disclaimer,
        imagePreview,
        crop: selectedCrop,
        timestamp: 'Just now',
        isDemo: data.isDemo,
        source: data.source,
      };

      setActiveReport(newResult);
      onAddDiagnosis(newResult);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'AI vision service error. Please try again.');
    } finally {
      setIsDiagnosing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-800 flex items-center justify-center">
              <Stethoscope className="w-4 h-4" />
            </div>
            <h1 className="font-heading text-2xl font-bold text-stone-900">{t.navCropDoctor}</h1>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Gemini Vision AI plant pathology. Upload leaf imagery to detect early fungal, bacterial, or pest damage with high diagnostic honesty.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-stone-100 text-stone-700 font-medium">
            Active Crop: <strong>{selectedCrop}</strong>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Image Upload & Form */}
        <div className="lg:col-span-5 space-y-5">
          {/* Upload Box */}
          <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-4">
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
              {t.uploadLeafImage}
            </label>

            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer ${
                imagePreview
                  ? 'border-emerald-500 bg-emerald-50/20'
                  : 'border-stone-300 hover:border-emerald-600 bg-stone-50/70 hover:bg-stone-50'
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              {imagePreview ? (
                <div className="space-y-3">
                  <div className="max-h-56 mx-auto rounded-xl overflow-hidden border border-stone-200 bg-stone-900/5 flex items-center justify-center">
                    <img
                      src={imagePreview}
                      alt="Uploaded plant specimen"
                      className="max-h-52 object-contain"
                    />
                  </div>
                  <p className="text-xs text-stone-500">
                    Click or drag new image to replace photo
                  </p>
                </div>
              ) : (
                <div className="space-y-2 py-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 mx-auto flex items-center justify-center">
                    <Upload className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-bold text-stone-800">{t.dragDropText}</p>
                  <p className="text-[11px] text-stone-500">Supports JPG, PNG, WEBP (Max 10MB)</p>
                </div>
              )}
            </div>

            {/* Quick Test Sample Leaf Presets for Judges/Reviewers */}
            <div className="space-y-2 pt-2 border-t border-stone-100">
              <span className="text-[11px] font-bold text-stone-600 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-600" />
                <span>{t.testSampleLeaves}</span>
              </span>
              <div className="grid grid-cols-2 gap-2">
                {SAMPLE_LEAF_IMAGES.map((sample) => (
                  <button
                    key={sample.id}
                    type="button"
                    onClick={() => {
                      setImagePreview(sample.svgData);
                      setImageMimeType('image/svg+xml');
                      setSelectedCrop(sample.crop);
                      setSymptoms(sample.symptoms);
                    }}
                    className="p-2 rounded-xl border border-stone-200 hover:border-emerald-600 bg-stone-50 hover:bg-white text-left text-[11px] transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 border border-stone-200">
                      <img src={sample.svgData} alt={sample.label} className="w-full h-full object-cover" />
                    </div>
                    <div className="truncate">
                      <strong className="block text-stone-900 truncate">{sample.label}</strong>
                      <span className="text-stone-500 text-[10px]">{sample.crop}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Crop Selector & Symptoms */}
            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Crop Species</label>
                <input
                  type="text"
                  value={selectedCrop}
                  onChange={(e) => setSelectedCrop(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs text-stone-900 bg-white"
                  placeholder="e.g. Wheat, Tomato, Soybean"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {t.symptomsLabel}
                </label>
                <textarea
                  rows={2}
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder={t.symptomsPlaceholder}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs text-stone-900 bg-white"
                />
              </div>

              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <button
                id="run-ai-diagnosis-btn"
                disabled={isDiagnosing}
                onClick={handleRunDiagnosis}
                className="w-full py-3 rounded-xl bg-rose-700 hover:bg-rose-800 disabled:opacity-50 text-white font-bold text-sm shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
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
        </div>

        {/* Right Column: AI Diagnosis Results Display */}
        <div className="lg:col-span-7 space-y-6">
          {activeReport ? (
            <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
              {/* Diagnosis Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-stone-100 gap-3">
                <div>
                  <span className="text-[11px] uppercase font-bold tracking-wider text-stone-500 block mb-1">
                    Pathological Report • {activeReport.crop || selectedCrop}
                  </span>
                  <h2 className="font-heading text-xl sm:text-2xl font-bold text-stone-900">
                    {activeReport.disease}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      activeReport.confidence === 'High'
                        ? 'bg-emerald-100 text-emerald-800'
                        : activeReport.confidence === 'Moderate'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {t.confidenceLevel}: {activeReport.confidence}
                  </span>
                </div>
              </div>

              {/* Unreliable Image Warning if detected */}
              {!activeReport.isReliable && (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold">Image Ambiguity Notice</h4>
                    <p className="mt-0.5">
                      The image resolution, lighting, or visible surface did not allow a reliable determination. KhetiNexus AI strictly refuses to invent unverified diseases to protect crops from unnecessary chemical applications.
                    </p>
                  </div>
                </div>
              )}

              {/* Diagnostic Breakdown Cards */}
              <div className="space-y-4">
                {/* Visible Symptoms */}
                <div className="p-4 rounded-xl bg-stone-50 border border-stone-100">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{t.visibleSigns}</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-800 leading-relaxed">
                    {activeReport.visibleSymptoms}
                  </p>
                </div>

                {/* Likely Causes */}
                <div className="p-4 rounded-xl bg-stone-50 border border-stone-100">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5 flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-amber-600" />
                    <span>{t.causes}</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-800 leading-relaxed">
                    {activeReport.causes}
                  </p>
                </div>

                {/* Immediate Remediation Action */}
                <div className="p-4 rounded-xl bg-rose-50/70 border border-rose-200/80">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-rose-900 mb-1.5 flex items-center gap-2">
                    <Stethoscope className="w-4 h-4 text-rose-700" />
                    <span>{t.immediateAction}</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-rose-950 font-medium leading-relaxed">
                    {activeReport.immediateActions}
                  </p>
                </div>

                {/* Long-Term Regenerative Prevention */}
                <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200/80">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-900 mb-1.5 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                    <span>{t.prevention}</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-emerald-950 leading-relaxed">
                    {activeReport.preventionPractices}
                  </p>
                </div>
              </div>

              {/* Mandatory AI Pathology Disclaimer */}
              <div className="pt-4 border-t border-stone-100 text-[11px] text-stone-500 leading-relaxed">
                <strong>Mandatory Pathological Disclaimer:</strong>{' '}
                {activeReport.disclaimer ||
                  'Diagnosis is AI-assisted and based on external visual characteristics. It should always be confirmed by a certified local agricultural extension expert or laboratory testing before applying commercial pesticides or drastic crop interventions.'}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-dashed border-stone-300 p-12 text-center text-stone-400 space-y-3">
              <Stethoscope className="w-12 h-12 mx-auto text-stone-300" />
              <h3 className="font-heading text-lg font-bold text-stone-700">No Specimen Analyzed Yet</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Upload a leaf image or select one of the test specimens on the left to activate Gemini Vision analysis.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
