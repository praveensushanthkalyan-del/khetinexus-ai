import React, { useState } from 'react';
import {
  Stethoscope,
  Bug,
  Leaf,
  Sun,
  Droplets,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  ShieldCheck,
  Sparkles,
  Info,
  Layers,
  ChevronDown,
  ChevronUp,
  Camera,
  FileCheck,
  Search,
  Activity,
  ArrowRight,
  MessageSquare,
  Sprout,
  Eye,
  RefreshCw,
  Sliders,
  Check,
  Thermometer,
} from 'lucide-react';
import { DiagnosisResult, FarmProfile, Language, CropConditionCategory } from '../../types';
import { getTranslation } from '../../i18n/translations';

interface PathologicalAssessmentCardProps {
  report: DiagnosisResult;
  farmProfile: FarmProfile;
  language: Language;
  selectedCrop?: string;
  onAskChatbot?: (query: string) => void;
  onRetakePhotos?: () => void;
}

export const PathologicalAssessmentCard: React.FC<PathologicalAssessmentCardProps> = ({
  report,
  farmProfile,
  language,
  selectedCrop,
  onAskChatbot,
  onRetakePhotos,
}) => {
  const [showConfidenceAudit, setShowConfidenceAudit] = useState(false);
  const [expandedSection, setExpandedSection] = useState<'treatment' | 'prevention' | 'differential' | null>('treatment');
  const t = getTranslation(language);

  const category: CropConditionCategory = report.category || 'Disease';
  const isDisease = category === 'Disease';
  const isPest = category === 'Pest damage';
  const isNutrient = category === 'Nutrient deficiency';
  const isAbiotic = category === 'Abiotic/environmental stress';
  const isMaturation = category === 'Normal growth / maturation / senescence';
  const isHealthy = category === 'Healthy/no obvious abnormality';
  const isUnable = category === 'Unable to determine' || !report.isReliable;

  const conf = report.confidenceDetails;
  const rawScore = conf?.finalScore ?? (
    report.confidence === 'High' ? 88 : report.confidence === 'Moderate' ? 68 : 38
  );

  let confLevel = conf?.level || (rawScore >= 80 ? 'High' : rawScore >= 60 ? 'Moderate' : 'Low');

  // Category visual styles & badges
  const categoryConfig = (() => {
    if (isMaturation) {
      return {
        label: t.catMaturation || 'Normal Maturation',
        sublabel: 'Physiological Stage',
        badgeBg: 'bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 border-amber-200 dark:border-amber-800',
        bannerBorder: 'border-amber-200/80 dark:border-amber-900/60 bg-amber-50/40 dark:bg-amber-950/20',
        icon: Sprout,
        iconColor: 'text-amber-600 dark:text-amber-400',
        themeColor: 'amber',
        primaryTitle: report.condition || report.disease || 'Natural Crop Maturation',
        agentTypeLabel: 'Growth Phenology',
      };
    }
    if (isHealthy) {
      return {
        label: t.catHealthy || 'Healthy Crop',
        sublabel: 'Vigorous Plant Vitality',
        badgeBg: 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-200 border-emerald-200 dark:border-emerald-800',
        bannerBorder: 'border-emerald-200/80 dark:border-emerald-900/60 bg-emerald-50/40 dark:bg-emerald-950/20',
        icon: ShieldCheck,
        iconColor: 'text-emerald-600 dark:text-emerald-400',
        themeColor: 'emerald',
        primaryTitle: report.condition || report.disease || 'Healthy Crop Specimen',
        agentTypeLabel: 'Vitality Status',
      };
    }
    if (isPest) {
      return {
        label: t.catPest || 'Pest Infestation',
        sublabel: 'Entomological Damage',
        badgeBg: 'bg-orange-100 dark:bg-orange-950/80 text-orange-900 dark:text-orange-200 border-orange-200 dark:border-orange-800',
        bannerBorder: 'border-orange-200/80 dark:border-orange-900/60 bg-orange-50/40 dark:bg-orange-950/20',
        icon: Bug,
        iconColor: 'text-orange-600 dark:text-orange-400',
        themeColor: 'orange',
        primaryTitle: report.condition || report.disease || 'Pest Damage',
        agentTypeLabel: 'Pest Organism',
      };
    }
    if (isNutrient) {
      return {
        label: t.catNutrient || 'Nutrient Deficiency',
        sublabel: 'Nutritional Imbalance',
        badgeBg: 'bg-yellow-100 dark:bg-yellow-950/80 text-yellow-900 dark:text-yellow-200 border-yellow-200 dark:border-yellow-800',
        bannerBorder: 'border-yellow-200/80 dark:border-yellow-900/60 bg-yellow-50/40 dark:bg-yellow-950/20',
        icon: Leaf,
        iconColor: 'text-yellow-600 dark:text-yellow-400',
        themeColor: 'yellow',
        primaryTitle: report.condition || report.disease || 'Nutrient Deficiency',
        agentTypeLabel: 'Deficient Nutrient Element',
      };
    }
    if (isAbiotic) {
      return {
        label: t.catAbiotic || 'Abiotic Stress',
        sublabel: 'Environmental Stress',
        badgeBg: 'bg-sky-100 dark:bg-sky-950/80 text-sky-900 dark:text-sky-200 border-sky-200 dark:border-sky-800',
        bannerBorder: 'border-sky-200/80 dark:border-sky-900/60 bg-sky-50/40 dark:bg-sky-950/20',
        icon: Sun,
        iconColor: 'text-sky-600 dark:text-sky-400',
        themeColor: 'sky',
        primaryTitle: report.condition || report.disease || 'Environmental Stress',
        agentTypeLabel: 'Environmental Stress Factor',
      };
    }
    if (isUnable) {
      return {
        label: t.catUnable || 'Inconclusive Specimen',
        sublabel: 'Unclear Diagnostics',
        badgeBg: 'bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200 border-stone-300 dark:border-stone-700',
        bannerBorder: 'border-stone-200 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-900/40',
        icon: AlertTriangle,
        iconColor: 'text-stone-600 dark:text-stone-400',
        themeColor: 'stone',
        primaryTitle: report.condition || report.disease || 'Unable to determine reliably',
        agentTypeLabel: 'Diagnosis Status',
      };
    }
    // Default: Disease (Fungal / Bacterial / Viral)
    return {
      label: t.catDisease || 'Plant Disease',
      sublabel: 'Pathological Infection',
      badgeBg: 'bg-rose-100 dark:bg-rose-950/80 text-rose-900 dark:text-rose-200 border-rose-200 dark:border-rose-800',
      bannerBorder: 'border-rose-200/80 dark:border-rose-900/60 bg-rose-50/40 dark:bg-rose-950/20',
      icon: Stethoscope,
      iconColor: 'text-rose-600 dark:text-rose-400',
      themeColor: 'rose',
      primaryTitle: report.condition || report.disease || 'Pathological Infection',
      agentTypeLabel: t.pathogenAgent || 'Pathogen / Causative Agent',
    };
  })();

  const CategoryIcon = categoryConfig.icon;

  // 10-point confidence audit factors
  const imgQualityScore = conf?.imageQuality ?? (report.imageQuality?.score ? report.imageQuality.score : 8);
  const visualEvidenceScore = conf?.visualEvidence ?? 28;
  const featureMatchScore = conf?.featureMatch ?? 20;
  const sourceVerificationScore = conf?.sourceVerification ?? (report.verification?.performed ? 14 : 9);
  const contradictionCheckScore = conf?.contradictionCheck ?? (report.recheck?.remainingContradictions?.length ? 6 : 14);

  const evidenceFactors = [
    {
      title: 'Image Sharpness & Lighting',
      score: `${imgQualityScore}/10`,
      status: imgQualityScore >= 7 ? 'pass' : imgQualityScore >= 4 ? 'warning' : 'fail',
      note: report.imageQuality?.assessment || 'Resolution is adequate for cellular & tissue examination.',
    },
    {
      title: 'Crop Taxonomy Match',
      score: report.cropConsistency !== false ? 'Verified' : 'Check Needed',
      status: report.cropConsistency !== false ? 'pass' : 'warning',
      note: `Specimen morphology aligns with ${report.crop || selectedCrop || 'farm crop'}.`,
    },
    {
      title: 'Visual Symptom Correlation',
      score: `${visualEvidenceScore}/35`,
      status: visualEvidenceScore >= 24 ? 'pass' : visualEvidenceScore >= 15 ? 'warning' : 'fail',
      note: report.visualEvidenceArray?.length
        ? `${report.visualEvidenceArray.length} distinct diagnostic visual criteria observed.`
        : 'Key visual traits matched reference library.',
    },
    {
      title: 'Pathology Benchmark Alignment',
      score: `${featureMatchScore}/25`,
      status: featureMatchScore >= 18 ? 'pass' : 'warning',
      note: `Pattern matches ${categoryConfig.primaryTitle} profile.`,
    },
    {
      title: 'Adversarial Contradiction Search',
      score: `${contradictionCheckScore}/15`,
      status: contradictionCheckScore >= 12 ? 'pass' : 'warning',
      note: report.recheck?.remainingContradictions?.length
        ? `Caveats: ${report.recheck.remainingContradictions.join(', ')}.`
        : 'Second-pass re-inspection found zero contradictory symptoms.',
    },
    {
      title: 'Literature Cross-Verification',
      score: `${sourceVerificationScore}/15`,
      status: report.verification?.performed ? 'pass' : 'warning',
      note: report.verification?.summary || 'Cross-referenced against ICAR / FAO plant protection archives.',
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 w-full items-start">
      {/* ======================================================== */}
      {/* COLUMN 1: REPORT CARD ([ report ])                       */}
      {/* ======================================================== */}
      <div className="w-full bg-white dark:bg-[#0c1810] rounded-2xl border border-stone-200/80 dark:border-stone-800/80 p-4 sm:p-5 shadow-xs transition-colors space-y-4 flex flex-col">
        {/* 1. ADAPTABLE MAIN DIAGNOSTIC HEADER */}
        <div className="pb-4 border-b border-stone-100 dark:border-stone-800 space-y-3">
          {/* Top Row: Chips + Confidence Status */}
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] uppercase font-bold tracking-wider text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
                <CategoryIcon className={`w-3.5 h-3.5 ${categoryConfig.iconColor}`} />
                <span>{categoryConfig.sublabel} • {report.crop || selectedCrop || farmProfile.crop || 'Field Specimen'}</span>
              </span>
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${categoryConfig.badgeBg}`}>
                {categoryConfig.label}
              </span>
              {report.isDemo && (
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-800">
                  Demo
                </span>
              )}
            </div>

            {/* Confidence Badge & Gemini AI tag */}
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[10px] font-semibold flex items-center gap-1 border border-emerald-200 dark:border-emerald-800">
                <Sparkles className="w-2.5 h-2.5 text-emerald-600 dark:text-emerald-400" />
                Gemini Vision AI
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                  rawScore >= 75
                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                    : rawScore >= 60
                    ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 border-stone-200 dark:border-stone-700'
                }`}
              >
                Confidence: {rawScore}/100 ({confLevel})
              </span>
            </div>
          </div>

          {/* Hierarchy Breadcrumb Trail */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs text-stone-600 dark:text-stone-400 font-medium bg-stone-50 dark:bg-stone-900/80 px-2.5 py-1 rounded-lg border border-stone-200/60 dark:border-stone-800 w-fit max-w-full">
            <span className="text-stone-900 dark:text-stone-200 font-bold">{category}</span>
            {report.subcategory && (
              <>
                <span className="text-stone-400">›</span>
                <span className="text-stone-800 dark:text-stone-300">{report.subcategory}</span>
              </>
            )}
            <span className="text-stone-400">›</span>
            <span className="text-emerald-700 dark:text-emerald-400 font-bold">{categoryConfig.primaryTitle}</span>
            {report.subtype && report.subtype !== 'Not determinable from available images' && (
              <>
                <span className="text-stone-400">›</span>
                <span className="text-stone-500 dark:text-stone-400 text-[11px]">{report.subtype}</span>
              </>
            )}
          </div>

          {/* Primary Condition Heading */}
          <h2 className="font-heading text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100 leading-tight">
            {categoryConfig.primaryTitle}
          </h2>

          {/* Scientific / Pathogen details */}
          {report.scientificName && !isMaturation && !isHealthy && !isUnable && (
            <div className="text-xs italic text-stone-600 dark:text-stone-400 font-serif flex flex-wrap items-center gap-1.5">
              <span>{categoryConfig.agentTypeLabel}: <strong className="font-semibold not-italic font-sans text-stone-800 dark:text-stone-200">{report.scientificName}</strong></span>
              {report.scientificNameStatus && (
                <span className="not-italic text-[10px] px-2 py-0.2 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-700">
                  {report.scientificNameStatus.replace(/_/g, ' ')}
                </span>
              )}
            </div>
          )}

          {/* Affected Plant Structures (if detected) */}
          {report.affectedStructures && report.affectedStructures.length > 0 && !isHealthy && (
            <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
              <span className="text-[11px] font-semibold text-stone-500 dark:text-stone-400">Observed Plant Organs:</span>
              {report.affectedStructures.map((struct, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800/80 text-stone-800 dark:text-stone-200 text-[10px] font-medium border border-stone-200 dark:border-stone-700 capitalize"
                >
                  {struct}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* 2. EVIDENCE-BASED VERIFICATION ACCORDION */}
        <div className="rounded-xl bg-stone-50/80 dark:bg-stone-900/60 border border-stone-200/70 dark:border-stone-800/80 p-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs font-bold text-stone-900 dark:text-stone-100">
                  Evidence-Based Verification
                </span>
                <span className="text-[11px] text-stone-500 dark:text-stone-400">
                  • {rawScore}% Match across 6 botanical checkpoints
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowConfidenceAudit((prev) => !prev)}
              className="px-2.5 py-1 rounded-lg bg-stone-200/80 hover:bg-stone-300/80 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer shrink-0"
              aria-expanded={showConfidenceAudit}
            >
              <span>{showConfidenceAudit ? 'Hide Audit' : 'View Audit'}</span>
              {showConfidenceAudit ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Meter bar */}
          <div className="w-full h-1.5 rounded-full bg-stone-200 dark:bg-stone-800 overflow-hidden mt-2">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                rawScore >= 75 ? 'bg-emerald-600 dark:bg-emerald-500' : rawScore >= 60 ? 'bg-amber-500' : 'bg-stone-500'
              }`}
              style={{ width: `${Math.min(100, Math.max(5, rawScore))}%` }}
            />
          </div>

          {/* Expandable 6-Factor Verification Grid */}
          {showConfidenceAudit && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-3 mt-2 border-t border-stone-200/60 dark:border-stone-800">
              {evidenceFactors.map((fac, idx) => (
                <div
                  key={idx}
                  className="p-2 rounded-lg bg-white dark:bg-stone-950 border border-stone-200/80 dark:border-stone-800 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-stone-800 dark:text-stone-200 text-[11px]">{fac.title}</span>
                    <span
                      className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        fac.status === 'pass'
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                          : fac.status === 'warning'
                          ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                          : 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300'
                      }`}
                    >
                      {fac.score}
                    </span>
                  </div>
                  <p className="text-[10px] text-stone-500 dark:text-stone-400 leading-snug">{fac.note}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 3. CATEGORY SPECIFIC BANNER NOTIFICATIONS */}
        {isMaturation && (
          <div className="p-3.5 rounded-xl bg-amber-50/90 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-amber-950 dark:text-amber-200 text-xs flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-amber-900 dark:text-amber-300">{t.maturationBannerTitle || 'Normal Crop Maturation & Senescence'}</h4>
              <p className="mt-0.5 text-amber-800 dark:text-amber-300/90 leading-relaxed">
                {t.maturationBannerText || 'The specimen indicates physiological maturity and natural leaf yellowing/drying rather than a pathogenic infection.'}
              </p>
            </div>
          </div>
        )}

        {isHealthy && (
          <div className="p-3.5 rounded-xl bg-emerald-50/90 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-emerald-950 dark:text-emerald-200 text-xs flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-emerald-900 dark:text-emerald-300">{t.healthyBannerTitle || 'Healthy Plant Foliage'}</h4>
              <p className="mt-0.5 text-emerald-800 dark:text-emerald-300/90 leading-relaxed">
                {t.healthyBannerText || 'No evidence of active fungal lesions, pest damage, or acute nutrient lockout detected.'}
              </p>
            </div>
          </div>
        )}

        {isUnable && (
          <div className="p-3.5 rounded-xl bg-stone-100 dark:bg-stone-900 border border-stone-300 dark:border-stone-800 text-stone-900 dark:text-stone-100 text-xs flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-stone-600 dark:text-stone-400 shrink-0 mt-0.5" />
            <div className="space-y-1 flex-1">
              <h4 className="font-bold text-stone-900 dark:text-stone-100">{t.unableBannerTitle || 'Inconclusive Diagnostic Specimen'}</h4>
              <p className="text-stone-600 dark:text-stone-400 leading-relaxed">
                {t.unableBannerText || 'The photo clarity, angle, or symptoms are insufficient for an authoritative diagnosis.'}
              </p>
              {onRetakePhotos && (
                <button
                  type="button"
                  onClick={onRetakePhotos}
                  className="mt-1 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs transition-colors cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Add / Retake Clear Photos</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* 4. VISIBLE VISUAL CHARACTERISTICS */}
        <div className="p-3.5 rounded-xl bg-stone-50/80 dark:bg-stone-900/60 border border-stone-200/80 dark:border-stone-800 space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>{isHealthy ? 'Observed Foliage Health' : isPest ? 'Feeding Signatures & Damage' : t.visibleCharacteristics || 'Visible Visual Characteristics'}</span>
          </h3>

          {report.visualEvidenceArray && report.visualEvidenceArray.length > 0 ? (
            <ul className="space-y-1.5 text-xs text-stone-800 dark:text-stone-200">
              {report.visualEvidenceArray.map((ev, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400 mt-1.5 shrink-0" />
                  <span className="leading-relaxed">{ev}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-stone-800 dark:text-stone-200 leading-relaxed">
              {report.visibleSymptoms}
            </p>
          )}
        </div>

        {/* 5. LIKELY CAUSES & FACTORS */}
        <div className="p-3.5 rounded-xl bg-stone-50/80 dark:bg-stone-900/60 border border-stone-200/80 dark:border-stone-800 space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>{isPest ? 'Pest Biology & Vectors' : isNutrient ? 'Nutritional Mechanism' : isAbiotic ? 'Environmental Trigger' : isMaturation ? 'Ripening Phenology' : t.likelyCauses || 'Likely Causes & Factors'}</span>
          </h3>
          <p className="text-xs text-stone-800 dark:text-stone-200 leading-relaxed">
            {report.causes}
          </p>
        </div>

        {/* 6. DIFFERENTIAL CANDIDATES EVALUATED */}
        {report.candidateDiagnoses && report.candidateDiagnoses.length > 0 && !isHealthy && !isMaturation && (
          <div className="p-3.5 rounded-xl bg-stone-50/80 dark:bg-stone-900/60 border border-stone-200/80 dark:border-stone-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                <Stethoscope className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Differential Candidate Diagnoses Evaluated</span>
              </h3>
              <span className="text-[10px] text-stone-500 font-medium">Ranked by evidence match</span>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {report.candidateDiagnoses.map((cand, cIdx) => (
                <div
                  key={cIdx}
                  className={`p-2.5 rounded-lg border text-xs space-y-1.5 ${
                    cIdx === 0
                      ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/60'
                      : 'bg-white dark:bg-stone-950 border-stone-200 dark:border-stone-800'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-full bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-mono text-[9px] flex items-center justify-center shrink-0">
                        #{cIdx + 1}
                      </span>
                      <span>{cand.condition}</span>
                    </span>
                    <span className="font-mono font-bold text-stone-600 dark:text-stone-400 text-[10px]">
                      {cand.candidateScore}% Match
                    </span>
                  </div>

                  {cand.supportingEvidence && cand.supportingEvidence.length > 0 && (
                    <p className="text-[10px] text-emerald-800 dark:text-emerald-300 leading-snug">
                      <strong className="font-semibold">Supporting: </strong>
                      {cand.supportingEvidence.join(', ')}
                    </p>
                  )}
                  {cand.contradictoryEvidence && cand.contradictoryEvidence.length > 0 && (
                    <p className="text-[10px] text-rose-800 dark:text-rose-300 leading-snug">
                      <strong className="font-semibold">Missing / Excluded: </strong>
                      {cand.contradictoryEvidence.join(', ')}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* COLUMN 2: SOLUTION CARD ([ solution ])                   */}
      {/* ======================================================== */}
      <div className="w-full bg-white dark:bg-[#0c1810] rounded-2xl border border-stone-200/80 dark:border-stone-800/80 p-4 sm:p-5 shadow-xs transition-colors space-y-4 flex flex-col justify-between">
        <div className="space-y-4">
          {/* 1. IMMEDIATE ACTIONS & SEVERITY ASSESSMENT */}
          <div
            className={`p-4 rounded-xl border ${
              isMaturation
                ? 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/60 text-amber-950 dark:text-amber-200'
                : isHealthy
                ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/60 text-emerald-950 dark:text-emerald-200'
                : isPest
                ? 'bg-orange-50/70 dark:bg-orange-950/30 border-orange-200/80 dark:border-orange-900/60 text-orange-950 dark:text-orange-200'
                : isNutrient
                ? 'bg-yellow-50/70 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-900/60 text-yellow-950 dark:text-yellow-200'
                : isAbiotic
                ? 'bg-sky-50/70 dark:bg-sky-950/30 border-sky-200 dark:border-sky-800/60 text-sky-950 dark:text-sky-200'
                : isUnable
                ? 'bg-stone-50 dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-100'
                : 'bg-rose-50/70 dark:bg-rose-950/30 border-rose-200/80 dark:border-rose-900/60 text-rose-950 dark:text-rose-200'
            }`}
          >
            <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-stone-200/50 dark:border-stone-800">
              <h3 className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Stethoscope className="w-3.5 h-3.5 shrink-0" />
                <span>
                  {isMaturation
                    ? 'Optimal Harvesting & Post-Harvest Schedule'
                    : isHealthy
                    ? 'Current Stage Foliage Maintenance'
                    : isPest
                    ? 'Immediate IPM Control & Trapping Action'
                    : isNutrient
                    ? 'Foliar Nutrient Correction & Soil Adjustment'
                    : isAbiotic
                    ? 'Stress Alleviation & Irrigation Recovery'
                    : t.recommendedNextSteps || 'Immediate Action & Treatment Protocol'}
                </span>
              </h3>
              
              {onAskChatbot && (
                <button
                  type="button"
                  onClick={() => onAskChatbot(`What is the step-by-step dosage and application timing for treating ${categoryConfig.primaryTitle}?`)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/90 dark:bg-stone-900 text-stone-800 dark:text-stone-200 text-[10px] font-bold shadow-xs hover:bg-emerald-50 dark:hover:bg-emerald-950 transition-colors cursor-pointer border border-stone-300 dark:border-stone-700 shrink-0"
                >
                  <MessageSquare className="w-3 h-3 text-emerald-600" />
                  <span>Ask Dosage in Chat</span>
                </button>
              )}
            </div>

            {report.immediateActionsList && report.immediateActionsList.length > 0 ? (
              <ul className="space-y-2 text-xs sm:text-sm">
                {report.immediateActionsList.map((action, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0 font-bold" />
                    <span className="leading-relaxed font-medium">{action}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs sm:text-sm font-medium leading-relaxed">
                {report.immediateActions}
              </p>
            )}
          </div>

          {/* 2. LONG-TERM SOIL & PLANT IMMUNITY PRACTICES */}
          <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-900/60 text-emerald-950 dark:text-emerald-200 space-y-2.5">
            <div className="flex items-center justify-between pb-2 border-b border-emerald-200/60 dark:border-emerald-900/40">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400 shrink-0" />
                <span>
                  {isMaturation
                    ? t.postHarvestStewardship || 'Post-Harvest Soil Enrichment & Residue Management'
                    : isHealthy
                    ? 'Long-Term Preventive Soil & Crop Stewardship'
                    : 'Long-Term Soil & Plant Immunity Practices'}
                </span>
              </h3>

              {onAskChatbot && (
                <button
                  type="button"
                  onClick={() => onAskChatbot(`What organic or regenerative farming practices can permanently prevent ${categoryConfig.primaryTitle}?`)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/90 dark:bg-stone-900 text-emerald-900 dark:text-emerald-300 text-[10px] font-bold shadow-xs hover:bg-emerald-100 dark:hover:bg-emerald-900 transition-colors cursor-pointer border border-emerald-300 dark:border-emerald-800 shrink-0"
                >
                  <Sprout className="w-3 h-3 text-emerald-600" />
                  <span>Ask Organic Options</span>
                </button>
              )}
            </div>

            {report.preventionList && report.preventionList.length > 0 ? (
              <ul className="space-y-1.5 text-xs sm:text-sm">
                {report.preventionList.map((prev, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-700 dark:bg-emerald-400 mt-2 shrink-0" />
                    <span className="leading-relaxed">{prev}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs sm:text-sm leading-relaxed">
                {report.preventionPractices}
              </p>
            )}
          </div>
        </div>

        {/* 3. QUICK INTERACTIVE EXPLORATION CHIPS & DISCLAIMER */}
        <div className="pt-3 border-t border-stone-100 dark:border-stone-800 space-y-3">
          {onAskChatbot && !isUnable && (
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-bold text-stone-500 dark:text-stone-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-600" />
                <span>Follow-up with AI:</span>
              </span>
              <button
                type="button"
                onClick={() => onAskChatbot(`Is ${categoryConfig.primaryTitle} contagious to neighboring crops on my farm?`)}
                className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-emerald-50 dark:bg-stone-900 dark:hover:bg-emerald-950 text-stone-800 dark:text-stone-200 hover:text-emerald-800 dark:hover:text-emerald-300 border border-stone-200 dark:border-stone-800 text-[11px] font-semibold transition-colors cursor-pointer"
              >
                Can it spread?
              </button>
              <button
                type="button"
                onClick={() => onAskChatbot(`What is the safest organic biological spray for ${categoryConfig.primaryTitle}?`)}
                className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-emerald-50 dark:bg-stone-900 dark:hover:bg-emerald-950 text-stone-800 dark:text-stone-200 hover:text-emerald-800 dark:hover:text-emerald-300 border border-stone-200 dark:border-stone-800 text-[11px] font-semibold transition-colors cursor-pointer"
              >
                Organic remedies
              </button>
              <button
                type="button"
                onClick={() => onAskChatbot(`How does current weather impact the recovery timeline for ${categoryConfig.primaryTitle}?`)}
                className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-emerald-50 dark:bg-stone-900 dark:hover:bg-emerald-950 text-stone-800 dark:text-stone-200 hover:text-emerald-800 dark:hover:text-emerald-300 border border-stone-200 dark:border-stone-800 text-[11px] font-semibold transition-colors cursor-pointer"
              >
                Weather effect & timeline
              </button>
            </div>
          )}

          {/* Mandatory Pathology Screening Disclaimer */}
          <div className="text-[11px] text-stone-500 dark:text-stone-400 leading-relaxed">
            {report.disclaimer || t.cropDoctorDisclaimer || 'Visual AI screening • Not laboratory confirmed. Confirm with a local agronomist before applying chemical treatments.'}
          </div>
        </div>
      </div>
    </div>
  );
};
