import React, { useState, useEffect } from 'react';
import {
  FlaskConical,
  Sprout,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Sparkles,
  Layers,
  ArrowRight,
  TrendingUp,
  FileSpreadsheet,
  Check,
  PlusCircle,
  MapPin,
  Satellite,
  Droplets,
  Activity,
  ShieldCheck,
  Info,
  ChevronRight,
  BarChart3,
  ThermometerSun,
  Zap,
  Leaf,
  SlidersHorizontal,
} from 'lucide-react';
import { SoilReport, FarmProfile, Language } from '../types';
import { getTranslation } from '../i18n/translations';
import { localizeCrop, localizeSoilType } from '../i18n/dataTranslations';
import {
  fetchUnifiedSoilIntelligence,
  SoilHealthObservation,
} from '../data/providers/soil/soilProvider';
import {
  resolveRegionalSoilProfile,
  RegionalSoilProfile,
} from '../data/regionalSoilDatasets';
import {
  soilNutrientReferenceConfig,
  interpretNutrient,
  calculateStatusFromValue,
  getCropSpecificTarget
} from '../data/soilNutrientReferenceConfig';

interface SoilHealthViewProps {
  currentFarm: FarmProfile;
  soilReport: SoilReport;
  onUpdateSoilReport: (rep: SoilReport) => void;
  onNavigateToProfile?: () => void;
  language: Language;
}

export const SoilHealthView: React.FC<SoilHealthViewProps> = ({
  currentFarm,
  soilReport,
  onUpdateSoilReport,
  onNavigateToProfile,
  language,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'lab_form' | 'satellite'>('overview');
  
  // Lab form local states
  const [ph, setPh] = useState<number | null>(soilReport.ph ?? null);
  const [nitrogen, setNitrogen] = useState<'Low' | 'Medium' | 'Optimal' | 'High' | null>(soilReport.nitrogen ?? null);
  const [nitrogenKgHa, setNitrogenKgHa] = useState<number | null>(soilReport.nitrogenKgHa ?? null);
  const [phosphorus, setPhosphorus] = useState<'Low' | 'Medium' | 'Optimal' | 'High' | null>(soilReport.phosphorus ?? null);
  const [phosphorusKgHa, setPhosphorusKgHa] = useState<number | null>(soilReport.phosphorusKgHa ?? null);
  const [potassium, setPotassium] = useState<'Low' | 'Medium' | 'Optimal' | 'High' | null>(soilReport.potassium ?? null);
  const [potassiumKgHa, setPotassiumKgHa] = useState<number | null>(soilReport.potassiumKgHa ?? null);
  const [soilMoisture, setSoilMoisture] = useState<number | null>(soilReport.soilMoisture ?? null);
  const [organicMatter, setOrganicMatter] = useState<number | null>(soilReport.organicMatter ?? null);

  // Unified soil intelligence state
  const [soilObservation, setSoilObservation] = useState<SoilHealthObservation | null>(null);
  const [loadingObservation, setLoadingObservation] = useState<boolean>(true);
  const [loadingAnalysis, setLoadingAnalysis] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  const t = getTranslation(language);

  const getOptionLabel = (nutrient: 'N' | 'P' | 'K', status: 'Low' | 'Medium' | 'Optimal' | 'High') => {
    const config = soilNutrientReferenceConfig[nutrient];
    if (status === 'Optimal') {
      const target = getCropSpecificTarget(nutrient, currentFarm.crop, currentFarm.state || currentFarm.stateRegion);
      return target ? `Optimal (${currentFarm.crop} target: ${target.label})` : `Optimal (Crop-specific target)`;
    }
    const range = status === 'Low' ? config.lowRange.label : status === 'Medium' ? config.mediumRange.label : config.highRange.label;
    return `${status} (${range})`;
  };

  const handleNumericNChange = (valStr: string) => {
    if (valStr === '') {
      setNitrogenKgHa(null);
    } else {
      const num = parseFloat(valStr);
      setNitrogenKgHa(isNaN(num) ? null : num);
      if (!isNaN(num)) {
        const calculated = calculateStatusFromValue('N', num, currentFarm.crop, currentFarm.state || currentFarm.stateRegion);
        setNitrogen(calculated);
      }
    }
  };

  const handleNumericPChange = (valStr: string) => {
    if (valStr === '') {
      setPhosphorusKgHa(null);
    } else {
      const num = parseFloat(valStr);
      setPhosphorusKgHa(isNaN(num) ? null : num);
      if (!isNaN(num)) {
        const calculated = calculateStatusFromValue('P', num, currentFarm.crop, currentFarm.state || currentFarm.stateRegion);
        setPhosphorus(calculated);
      }
    }
  };

  const handleNumericKChange = (valStr: string) => {
    if (valStr === '') {
      setPotassiumKgHa(null);
    } else {
      const num = parseFloat(valStr);
      setPotassiumKgHa(isNaN(num) ? null : num);
      if (!isNaN(num)) {
        const calculated = calculateStatusFromValue('K', num, currentFarm.crop, currentFarm.state || currentFarm.stateRegion);
        setPotassium(calculated);
      }
    }
  };

  // Synchronize local edit fields when active farm soilReport changes
  useEffect(() => {
    setPh(soilReport.ph ?? null);
    setNitrogen(soilReport.nitrogen ?? null);
    setNitrogenKgHa(soilReport.nitrogenKgHa ?? null);
    setPhosphorus(soilReport.phosphorus ?? null);
    setPhosphorusKgHa(soilReport.phosphorusKgHa ?? null);
    setPotassium(soilReport.potassium ?? null);
    setPotassiumKgHa(soilReport.potassiumKgHa ?? null);
    setSoilMoisture(soilReport.soilMoisture ?? null);
    setOrganicMatter(soilReport.organicMatter ?? null);
    setErrorMessage(null);
  }, [soilReport]);

  // Load unified soil intelligence based on active farm's location
  useEffect(() => {
    let isMounted = true;
    async function loadSoilData() {
      setLoadingObservation(true);
      try {
        const obs = await fetchUnifiedSoilIntelligence(currentFarm, {
          userLabReport: soilReport,
          forceRefresh: false,
        });
        if (isMounted) {
          setSoilObservation(obs);
        }
      } catch (err) {
        console.error('Failed to load soil intelligence:', err);
      } finally {
        if (isMounted) {
          setLoadingObservation(false);
        }
      }
    }

    loadSoilData();
    return () => {
      isMounted = false;
    };
  }, [currentFarm.id, currentFarm.state, currentFarm.district, currentFarm.country, soilReport]);

  const regionalProfile: RegionalSoilProfile = resolveRegionalSoilProfile(
    currentFarm.state || currentFarm.stateRegion,
    currentFarm.district || currentFarm.location,
    currentFarm.country
  );

  const hasLabMeasurements =
    ph !== null ||
    nitrogen !== null ||
    nitrogenKgHa !== null ||
    phosphorus !== null ||
    phosphorusKgHa !== null ||
    potassium !== null ||
    potassiumKgHa !== null ||
    soilMoisture !== null ||
    organicMatter !== null;

  const handleRefreshObservation = async () => {
    setLoadingObservation(true);
    try {
      const obs = await fetchUnifiedSoilIntelligence(currentFarm, {
        userLabReport: soilReport,
        forceRefresh: true,
      });
      setSoilObservation(obs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingObservation(false);
    }
  };
  
  const handleSaveOnly = async () => {
    setErrorMessage(null);
    setSaveSuccess(false);
    setLoadingAnalysis(true);

    const updatedReport: SoilReport = {
      ...soilReport,
      soilType: currentFarm.soilType || regionalProfile.primarySoilType,
      ph,
      nitrogen,
      nitrogenKgHa,
      phosphorus,
      phosphorusKgHa,
      potassium,
      potassiumKgHa,
      soilMoisture,
      organicMatter,
      source: hasLabMeasurements ? 'Farm Lab Soil Test (Manual Entry)' : 'ICAR-NRSC Area Soil Baseline',
      createdAt: new Date().toISOString(),
    };

    try {
      await onUpdateSoilReport(updatedReport);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to save soil measurements to database.');
    } finally {
      setLoadingAnalysis(false);
    }
  };

  const handleAnalyzeSoil = async () => {
    setLoadingAnalysis(true);
    setErrorMessage(null);
    setSaveSuccess(false);

    // Immediately save input values first to guarantee immediate persistence!
    const preSaveReport: SoilReport = {
      ...soilReport,
      soilType: currentFarm.soilType || regionalProfile.primarySoilType,
      ph,
      nitrogen,
      nitrogenKgHa,
      phosphorus,
      phosphorusKgHa,
      potassium,
      potassiumKgHa,
      soilMoisture,
      organicMatter,
      source: hasLabMeasurements ? 'Farm Lab Soil Test (Saved & Pending AI Analysis)' : 'ICAR-NRSC Area Soil Baseline',
      createdAt: new Date().toISOString(),
    };
    
    try {
      await onUpdateSoilReport(preSaveReport);

      const res = await fetch('/api/soil-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          soilType: currentFarm.soilType || regionalProfile.primarySoilType,
          soilOrder: regionalProfile.soilOrder,
          texture: regionalProfile.texture,
          ph: ph !== null ? ph : regionalProfile.ph.value,
          nitrogen: nitrogen || regionalProfile.nitrogen.value,
          nitrogenKgHa: nitrogenKgHa !== null ? nitrogenKgHa : regionalProfile.nitrogenKgHa?.value,
          phosphorus: phosphorus || regionalProfile.phosphorus.value,
          phosphorusKgHa: phosphorusKgHa !== null ? phosphorusKgHa : regionalProfile.phosphorusKgHa?.value,
          potassium: potassium || regionalProfile.potassium.value,
          potassiumKgHa: potassiumKgHa !== null ? potassiumKgHa : regionalProfile.potassiumKgHa?.value,
          soilMoisture: soilMoisture !== null ? `${soilMoisture}%` : `${soilObservation?.satelliteTelemetry.volumetricSoilMoisturePercent || 30}%`,
          organicMatter: organicMatter !== null ? `${organicMatter}%` : `${regionalProfile.organicMatterPercent.value}%`,
          electricalConductivity: regionalProfile.electricalConductivityDsM.value,
          cationExchangeCapacity: regionalProfile.cationExchangeCapacity.value,
          crop: currentFarm.crop,
          country: currentFarm.country || 'India',
          state: currentFarm.state || currentFarm.stateRegion || regionalProfile.state,
          district: currentFarm.district || currentFarm.location || regionalProfile.district,
          agroClimaticZone: regionalProfile.agroClimaticZone,
          provenance: hasLabMeasurements ? 'MEASURED' : 'REGIONAL_BASELINE',
          language,
        }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => null);
        throw new Error(errJson?.error || 'Soil analysis service temporarily offline. Your laboratory measurements have been successfully saved!');
      }

      const data = await res.json();
      const updatedReport: SoilReport = {
        soilType: currentFarm.soilType || regionalProfile.primarySoilType,
        ph,
        nitrogen,
        nitrogenKgHa,
        phosphorus,
        phosphorusKgHa,
        potassium,
        potassiumKgHa,
        soilMoisture,
        organicMatter,
        summary: data.summary,
        deficiencies: data.deficiencies,
        regenerativeRecommendations: data.regenerativeRecommendations,
        organicMatterSuggestions: data.organicMatterSuggestions,
        cropSpecificAdvice: data.cropSpecificAdvice,
        isDemo: data.isDemo ?? false,
        source: hasLabMeasurements
          ? 'Farm Lab Soil Test (Calibrated with ICAR Baseline)'
          : 'ICAR-NRSC Area Soil Baseline',
        createdAt: new Date().toISOString(),
      };

      await onUpdateSoilReport(updatedReport);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 5000);
    } catch (err: any) {
      console.warn(err);
      setErrorMessage(err.message || 'Soil analysis service is currently offline. Your measurements have been saved successfully.');
    } finally {
      setLoadingAnalysis(false);
    }
  };

  const getPhRating = (val: number | null) => {
    if (val === null) return { label: t.notProvided || 'Not provided', color: 'text-stone-500 bg-stone-100 dark:bg-stone-800' };
    if (val < 6.0) return { label: t.phAcidic || 'Acidic', color: 'text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60' };
    if (val > 7.5) return { label: t.phAlkaline || 'Alkaline', color: 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60' };
    return { label: t.phOptimal || 'Optimal', color: 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60' };
  };

  const getRatingBadgeClass = (rating: string) => {
    switch (rating.toLowerCase()) {
      case 'low':
      case 'acidic':
      case 'saline':
        return 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      case 'medium':
      case 'moderate':
        return 'bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      case 'optimal':
      case 'high':
      case 'neutral':
      case 'non-saline':
      case 'well drained':
        return 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      default:
        return 'bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700';
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-6 sm:space-y-8 min-w-0">
      {/* 1. Header & Active Farm Location Context Bar */}
      <div className="bg-white dark:bg-[#0c1810] rounded-2xl border border-stone-200/80 dark:border-stone-800/80 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 flex items-center justify-center shrink-0">
            <FlaskConical className="w-6 h-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-heading text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100">
                {t.soilTitle || 'Soil Health Intelligence'}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {currentFarm.district || 'District'}, {currentFarm.state || 'State'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-0.5">
              Area-based ICAR & NRSC survey baselines combined with farm-specific soil test telemetry
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-center">
          <button
            type="button"
            onClick={handleRefreshObservation}
            disabled={loadingObservation}
            className="px-3 py-1.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-900 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Refresh Soil Pipeline"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingObservation ? 'animate-spin' : ''}`} />
            <span>{loadingObservation ? 'Syncing...' : 'Refresh Pipeline'}</span>
          </button>
        </div>
      </div>

      {/* 2. Geographic & Agro-Climatic Intelligence Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-white dark:bg-[#0c1810] border border-stone-200/80 dark:border-stone-800/80 shadow-xs">
          <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 mb-1">
            <span className="font-medium">Active Farm</span>
            <Sprout className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="text-sm font-bold text-stone-900 dark:text-stone-100 truncate">
            {currentFarm.name || 'Active Farm'}
          </div>
          <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5 flex items-center gap-1">
            <span>Crop:</span>
            <strong className="text-emerald-700 dark:text-emerald-400">{localizeCrop(currentFarm.crop, language)}</strong>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#0c1810] border border-stone-200/80 dark:border-stone-800/80 shadow-xs">
          <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 mb-1">
            <span className="font-medium">Agro-Climatic Zone</span>
            <MapPin className="w-3.5 h-3.5 text-blue-600" />
          </div>
          <div className="text-sm font-bold text-stone-900 dark:text-stone-100 truncate" title={regionalProfile.agroClimaticZone}>
            {regionalProfile.agroClimaticZone}
          </div>
          <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
            ICAR-NBSS&LUP Regional Classification
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#0c1810] border border-stone-200/80 dark:border-stone-800/80 shadow-xs">
          <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 mb-1">
            <span className="font-medium">Primary Soil Order</span>
            <Layers className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <div className="text-sm font-bold text-stone-900 dark:text-stone-100 truncate">
            {regionalProfile.soilOrder}
          </div>
          <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5 truncate">
            {regionalProfile.texture} ({localizeSoilType(currentFarm.soilType || regionalProfile.primarySoilType, language)})
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-[#0c1810] border border-stone-200/80 dark:border-stone-800/80 shadow-xs">
          <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 mb-1">
            <span className="font-medium">Data Provenance</span>
            <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
          </div>
          <div className="flex items-center gap-1.5">
            {hasLabMeasurements ? (
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                Lab Verified Card
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-50 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-800 flex items-center gap-1">
                <Info className="w-3 h-3 text-blue-600" />
                ICAR Area Baseline
              </span>
            )}
          </div>
          <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-1 truncate">
            {hasLabMeasurements ? 'Custom user soil sample' : `Survey: ${regionalProfile.datasetName}`}
          </div>
        </div>
      </div>

      {/* 3. Navigation Tabs */}
      <div className="flex border-b border-stone-200 dark:border-stone-800 gap-2 sm:gap-4 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('overview')}
          className={`pb-3 px-2 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'overview'
              ? 'border-emerald-700 text-emerald-800 dark:text-emerald-400 dark:border-emerald-500'
              : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-300'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Area Soil Intelligence & Benchmarks</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('lab_form')}
          className={`pb-3 px-2 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'lab_form'
              ? 'border-emerald-700 text-emerald-800 dark:text-emerald-400 dark:border-emerald-500'
              : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-300'
          }`}
        >
          <FlaskConical className="w-4 h-4" />
          <span>Farm Soil Test (Soil Health Card)</span>
          {hasLabMeasurements && (
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('satellite')}
          className={`pb-3 px-2 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'satellite'
              ? 'border-emerald-700 text-emerald-800 dark:text-emerald-400 dark:border-emerald-500'
              : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-300'
          }`}
        >
          <Satellite className="w-4 h-4" />
          <span>Satellite Topsoil Physics (NASA SMAP)</span>
        </button>
      </div>

      {/* 4. Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* N-P-K & Macro-nutrients Grid with Spatial Level & Provenance */}
          <div className="bg-white dark:bg-[#0c1810] rounded-2xl border border-stone-200/80 dark:border-stone-800/80 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800 gap-2">
              <div>
                <h2 className="font-heading text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                  <span>Area-Based Macronutrients & Soil Chemistry</span>
                </h2>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Benchmarked for {currentFarm.district || 'District'}, {currentFarm.state || 'State'} (Scale 1:50,000)
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-stone-500 dark:text-stone-400">Spatial Resolution:</span>
                <strong className="text-stone-800 dark:text-stone-200">
                  {hasLabMeasurements ? 'Farm-Level Sample' : `${currentFarm.district || 'District'} Agro-Zone`}
                </strong>
              </div>
            </div>

            {/* Nutrients Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Nitrogen Card */}
              {(() => {
                const activeNRating = soilReport.nitrogen || regionalProfile.nitrogen.value;
                const activeNValueLabel = soilReport.nitrogenKgHa != null 
                  ? `${soilReport.nitrogenKgHa} kg/ha` 
                  : (regionalProfile.nitrogenKgHa ? `${regionalProfile.nitrogenKgHa.value} kg/ha` : activeNRating);
                const interpretation = interpretNutrient('N', activeNRating, currentFarm.crop, currentFarm.state || currentFarm.stateRegion);
                const hasCustomVal = soilReport.nitrogenKgHa != null;
                const sourceText = hasCustomVal || soilReport.nitrogen != null
                  ? 'Farm laboratory report'
                  : (regionalProfile.nitrogen.provenanceLabel || 'Indian soil-test reference');

                return (
                  <div className="p-4 rounded-xl bg-white dark:bg-stone-900/60 border border-stone-200/80 dark:border-stone-800 space-y-2 shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">Nitrogen (N)</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getRatingBadgeClass(activeNRating)}`}>
                        {activeNRating}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xl font-bold text-stone-900 dark:text-stone-100">
                        {activeNValueLabel}
                      </span>
                      <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 mt-0.5">
                        {interpretation.rangeLabel}
                      </span>
                    </div>
                    <div className="text-[11px] text-stone-500 dark:text-stone-400 flex flex-col gap-0.5 pt-1 border-t border-stone-200/50 dark:border-stone-800">
                      <span>Typical: {regionalProfile.nitrogen.typicalRange}</span>
                      <span className="text-[10px] text-stone-400 dark:text-stone-500">
                        Source: {sourceText}
                      </span>
                    </div>
                  </div>
                );
              })()}

              {/* Phosphorus Card */}
              {(() => {
                const activePRating = soilReport.phosphorus || regionalProfile.phosphorus.value;
                const activePValueLabel = soilReport.phosphorusKgHa != null 
                  ? `${soilReport.phosphorusKgHa} kg/ha` 
                  : (regionalProfile.phosphorusKgHa ? `${regionalProfile.phosphorusKgHa.value} kg/ha` : activePRating);
                const interpretation = interpretNutrient('P', activePRating, currentFarm.crop, currentFarm.state || currentFarm.stateRegion);
                const hasCustomVal = soilReport.phosphorusKgHa != null;
                const sourceText = hasCustomVal || soilReport.phosphorus != null
                  ? 'Farm laboratory report'
                  : (regionalProfile.phosphorus.provenanceLabel || 'Indian soil-test reference');

                return (
                  <div className="p-4 rounded-xl bg-white dark:bg-stone-900/60 border border-stone-200/80 dark:border-stone-800 space-y-2 shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">Phosphorus (P)</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getRatingBadgeClass(activePRating)}`}>
                        {activePRating}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xl font-bold text-stone-900 dark:text-stone-100">
                        {activePValueLabel}
                      </span>
                      <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 mt-0.5">
                        {interpretation.rangeLabel}
                      </span>
                    </div>
                    <div className="text-[11px] text-stone-500 dark:text-stone-400 flex flex-col gap-0.5 pt-1 border-t border-stone-200/50 dark:border-stone-800">
                      <span>Typical: {regionalProfile.phosphorus.typicalRange}</span>
                      <span className="text-[10px] text-stone-400 dark:text-stone-500">
                        Source: {sourceText}
                      </span>
                    </div>
                  </div>
                );
              })()}

              {/* Potassium Card */}
              {(() => {
                const activeKRating = soilReport.potassium || regionalProfile.potassium.value;
                const activeKValueLabel = soilReport.potassiumKgHa != null 
                  ? `${soilReport.potassiumKgHa} kg/ha` 
                  : (regionalProfile.potassiumKgHa ? `${regionalProfile.potassiumKgHa.value} kg/ha` : activeKRating);
                const interpretation = interpretNutrient('K', activeKRating, currentFarm.crop, currentFarm.state || currentFarm.stateRegion);
                const hasCustomVal = soilReport.potassiumKgHa != null;
                const sourceText = hasCustomVal || soilReport.potassium != null
                  ? 'Farm laboratory report'
                  : (regionalProfile.potassium.provenanceLabel || 'Indian soil-test reference');

                return (
                  <div className="p-4 rounded-xl bg-white dark:bg-stone-900/60 border border-stone-200/80 dark:border-stone-800 space-y-2 shadow-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">Potassium (K)</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getRatingBadgeClass(activeKRating)}`}>
                        {activeKRating}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xl font-bold text-stone-900 dark:text-stone-100">
                        {activeKValueLabel}
                      </span>
                      <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 mt-0.5">
                        {interpretation.rangeLabel}
                      </span>
                    </div>
                    <div className="text-[11px] text-stone-500 dark:text-stone-400 flex flex-col gap-0.5 pt-1 border-t border-stone-200/50 dark:border-stone-800">
                      <span>Typical: {regionalProfile.potassium.typicalRange}</span>
                      <span className="text-[10px] text-stone-400 dark:text-stone-500">
                        Source: {sourceText}
                      </span>
                    </div>
                  </div>
                );
              })()}

              {/* pH & Organic Carbon Card */}
              <div className="p-4 rounded-xl bg-stone-50/70 dark:bg-stone-900/60 border border-stone-200/80 dark:border-stone-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">Soil pH & SOM</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getRatingBadgeClass(regionalProfile.ph.rating)}`}>
                    pH: {soilReport.ph !== null && soilReport.ph !== undefined ? soilReport.ph.toFixed(1) : regionalProfile.ph.value.toFixed(1)}
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold text-stone-900 dark:text-stone-100">
                    {soilReport.organicMatter !== null && soilReport.organicMatter !== undefined ? `${soilReport.organicMatter.toFixed(1)}% SOM` : `${regionalProfile.organicMatterPercent.value}% SOM`}
                  </span>
                </div>
                <div className="text-[11px] text-stone-500 dark:text-stone-400 flex flex-col gap-0.5 pt-1 border-t border-stone-200/50 dark:border-stone-800">
                  <span>Target Organic Carbon: &ge; {regionalProfile.organicMatterTargetPercent}%</span>
                  <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-medium">
                    {hasLabMeasurements && soilReport.ph ? 'Source: Lab Report' : `Source: ${regionalProfile.ph.provenanceLabel}`}
                  </span>
                </div>
              </div>
            </div>

            {/* Additional Physical & Electrochemical Parameters */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3 rounded-lg bg-white dark:bg-stone-900 border border-stone-200/60 dark:border-stone-800 text-center">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500">Drainage</span>
                <span className="text-xs font-bold text-stone-800 dark:text-stone-200">{regionalProfile.drainageClass}</span>
              </div>
              <div className="p-3 rounded-lg bg-white dark:bg-stone-900 border border-stone-200/60 dark:border-stone-800 text-center">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500">Water Retention</span>
                <span className="text-xs font-bold text-stone-800 dark:text-stone-200">{regionalProfile.waterHoldingCapacity}</span>
              </div>
              <div className="p-3 rounded-lg bg-white dark:bg-stone-900 border border-stone-200/60 dark:border-stone-800 text-center">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500">Salinity (EC)</span>
                <span className="text-xs font-bold text-stone-800 dark:text-stone-200">{regionalProfile.electricalConductivityDsM.value} dS/m ({regionalProfile.electricalConductivityDsM.rating})</span>
              </div>
              <div className="p-3 rounded-lg bg-white dark:bg-stone-900 border border-stone-200/60 dark:border-stone-800 text-center">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500">CEC (Buffer Power)</span>
                <span className="text-xs font-bold text-stone-800 dark:text-stone-200">{regionalProfile.cationExchangeCapacity.value} meq/100g</span>
              </div>
            </div>
          </div>

          {/* Regional Constraints, Sensitivities & AI Diagnostic Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: AI Diagnostic Summary & Recommendations (7 Cols) */}
            <div className="lg:col-span-7 bg-white dark:bg-[#0c1810] rounded-2xl border border-stone-200/80 dark:border-stone-800/80 p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                  <h3 className="font-heading text-base font-bold text-stone-900 dark:text-stone-100">
                    Regenerative Soil Assessment & Guidance
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={handleAnalyzeSoil}
                  disabled={loadingAnalysis}
                  className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className={`w-3 h-3 ${loadingAnalysis ? 'animate-spin' : ''}`} />
                  <span>Re-evaluate</span>
                </button>
              </div>

              <div className="p-4 rounded-xl bg-stone-50/80 dark:bg-stone-900/60 border border-stone-200/60 dark:border-stone-800 text-xs sm:text-sm text-stone-800 dark:text-stone-200 leading-relaxed font-medium">
                {soilReport.summary || `Authentic regional soil baseline active for ${currentFarm.district || 'District'}, ${currentFarm.state || 'State'}. Showing agroecological management practices for ${currentFarm.crop || 'crops'}.`}
              </div>

              {/* Regenerative Restorations List */}
              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
                  Recommended Biological Practices
                </h4>
                <div className="space-y-2">
                  {((soilReport.regenerativeRecommendations && soilReport.regenerativeRecommendations.length > 0)
                    ? soilReport.regenerativeRecommendations
                    : regionalProfile.regenerativeFocus
                  ).map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 text-xs text-stone-800 dark:text-stone-200"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Crop Synergy Advice */}
              {soilReport.cropSpecificAdvice && (
                <div className="p-3.5 rounded-xl bg-sky-50/80 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-900/60 text-xs text-sky-950 dark:text-sky-200">
                  <strong className="block mb-1 text-sky-900 dark:text-sky-300">
                    Crop Synergy ({localizeCrop(currentFarm.crop, language)}):
                  </strong>
                  {soilReport.cropSpecificAdvice}
                </div>
              )}
            </div>

            {/* Right: Regional Constraints & Micronutrient Sensitivities (5 Cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white dark:bg-[#0c1810] rounded-2xl border border-stone-200/80 dark:border-stone-800/80 p-5 sm:p-6 shadow-xs space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-stone-100 dark:border-stone-800">
                  <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <h3 className="font-heading text-sm font-bold text-stone-900 dark:text-stone-100">
                    Regional Deficiencies & Sensitivities
                  </h3>
                </div>

                <div className="space-y-2">
                  <span className="block text-[11px] font-semibold text-stone-600 dark:text-stone-400">
                    Known Area Micronutrient Vulnerabilities ({currentFarm.state}):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {regionalProfile.microNutrientSensitivities.map((micro, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
                      >
                        {micro}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-stone-100 dark:border-stone-800">
                  <span className="block text-[11px] font-semibold text-stone-600 dark:text-stone-400">
                    Regional Ecological Factors:
                  </span>
                  <div className="space-y-1.5">
                    {regionalProfile.regionalDeficiencies.map((def, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2 text-xs text-stone-700 dark:text-stone-300 p-2 rounded-lg bg-stone-50 dark:bg-stone-900"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                        <span>{def}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Lab Card Callout if user has not yet entered lab report */}
              {!hasLabMeasurements && (
                <div className="bg-emerald-50/80 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800/80 p-5 shadow-xs space-y-3">
                  <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-300 font-bold text-xs sm:text-sm">
                    <FileSpreadsheet className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0" />
                    <span>Have a Soil Health Card or Lab Report?</span>
                  </div>
                  <p className="text-xs text-emerald-800 dark:text-emerald-300/90 leading-relaxed">
                    Add your exact laboratory NPK, pH, and organic matter measurements to calibrate regional models for your specific farm parcel.
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveTab('lab_form')}
                    className="w-full py-2 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>Enter Soil Health Card</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 5. Tab: Farm Soil Test (Soil Health Card) Form */}
      {activeTab === 'lab_form' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
          {/* Left: Interactive Input Form (6 Cols) */}
          <div className="lg:col-span-6 bg-white dark:bg-[#0c1810] rounded-2xl border border-stone-200/80 dark:border-stone-800/80 p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
              <div>
                <h2 className="font-heading text-base font-bold text-stone-900 dark:text-stone-100">
                  {t.soilTestTitle || 'Soil Health Card & Lab Test Report'}
                </h2>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Saved securely to your private farm profile
                </p>
              </div>
              <span className="text-[11px] text-stone-500 dark:text-stone-400 font-medium">
                {currentFarm.name || 'Active Farm'}
              </span>
            </div>

            {/* pH Input & Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2">
                  <input
                    id="ph-tested-checkbox"
                    type="checkbox"
                    checked={ph !== null}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setPh(6.5);
                      } else {
                        setPh(null);
                      }
                    }}
                    className="w-4 h-4 rounded text-emerald-600 border-stone-300 dark:border-stone-700 focus:ring-emerald-500 accent-emerald-700 cursor-pointer"
                  />
                  <label htmlFor="ph-tested-checkbox" className="font-semibold text-stone-700 dark:text-stone-300 cursor-pointer select-none flex items-center gap-1.5">
                    {t.soilPh || 'Soil pH'}
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${getPhRating(ph).color}`}>
                    {ph !== null ? `${ph.toFixed(1)} — ${getPhRating(ph).label}` : 'Using Area Baseline'}
                  </span>
                </div>
              </div>
              {ph !== null ? (
                <div className="flex items-center gap-3">
                  <input
                    id="soil-ph-slider"
                    type="range"
                    min="4.5"
                    max="9.0"
                    step="0.1"
                    value={ph ?? 6.5}
                    onChange={(e) => setPh(parseFloat(e.target.value))}
                    className="w-full accent-emerald-700 cursor-pointer"
                  />
                  <input
                    id="soil-ph-number"
                    type="number"
                    min="3.0"
                    max="10.0"
                    step="0.1"
                    placeholder="pH"
                    value={ph !== null ? ph : ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      setPh(val === '' ? null : parseFloat(val));
                    }}
                    className="w-16 px-2 py-1 text-xs border border-stone-300 dark:border-stone-700 rounded-lg text-center font-bold text-stone-900 dark:text-stone-100 bg-white dark:bg-stone-900 focus:ring-1 focus:ring-emerald-600 outline-none"
                  />
                </div>
              ) : (
                <div className="py-2 px-3 rounded-lg bg-stone-50 dark:bg-stone-900/40 border border-stone-200/50 dark:border-stone-800/50 text-xs text-stone-500 dark:text-stone-400 flex items-center justify-between">
                  <span>Using ICAR Area Baseline: <strong>{regionalProfile.ph.value.toFixed(1)}</strong></span>
                  <span className="text-[10px] text-stone-400">Tick box to enter lab result</span>
                </div>
              )}
              <div className="flex justify-between text-[10px] text-stone-400 dark:text-stone-500">
                <span>4.5 (Acidic)</span>
                <span>Regional Baseline: {regionalProfile.ph.value.toFixed(1)}</span>
                <span>9.0 (Alkaline)</span>
              </div>
            </div>

            {/* N-P-K Selectors */}
            <div className="space-y-3 pt-2 border-t border-stone-100 dark:border-stone-800">
              <span className="block text-xs font-semibold text-stone-700 dark:text-stone-300">{t.macronutrients || 'Macronutrients (N-P-K)'}</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Nitrogen */}
                <div className="space-y-2 p-3 rounded-xl border border-stone-100 dark:border-stone-800 bg-stone-50/40 dark:bg-stone-900/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <input
                        id="n-tested-checkbox"
                        type="checkbox"
                        checked={nitrogen !== null}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNitrogen('Optimal');
                            setNitrogenKgHa(null);
                          } else {
                            setNitrogen(null);
                            setNitrogenKgHa(null);
                          }
                        }}
                        className="w-3.5 h-3.5 rounded text-emerald-600 border-stone-300 dark:border-stone-700 focus:ring-emerald-500 accent-emerald-700 cursor-pointer"
                      />
                      <label htmlFor="n-tested-checkbox" className="text-xs font-bold text-stone-700 dark:text-stone-300 cursor-pointer select-none">
                        Nitrogen (N)
                      </label>
                    </div>
                  </div>
                  {nitrogen !== null ? (
                    <div className="space-y-2 animate-fadeIn">
                      <div className="grid grid-cols-1 gap-1">
                        <label htmlFor="soil-nitrogen-select" className="text-[9px] font-bold text-stone-500 dark:text-stone-400">Rating Status</label>
                        <select
                          id="soil-nitrogen-select"
                          value={nitrogen}
                          onChange={(e) => setNitrogen((e.target.value as any) || 'Optimal')}
                          className="w-full p-1.5 text-xs border border-stone-300 dark:border-stone-700 rounded-lg bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 font-semibold focus:ring-2 focus:ring-emerald-600 outline-none cursor-pointer"
                        >
                          <option value="Low">{getOptionLabel('N', 'Low')}</option>
                          <option value="Medium">{getOptionLabel('N', 'Medium')}</option>
                          <option value="Optimal">{getOptionLabel('N', 'Optimal')}</option>
                          <option value="High">{getOptionLabel('N', 'High')}</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-1 gap-1">
                        <label className="text-[9px] font-bold text-stone-500 dark:text-stone-400">Value (kg/ha)</label>
                        <input
                          type="number"
                          placeholder="e.g. 320"
                          value={nitrogenKgHa !== null ? nitrogenKgHa : ''}
                          onChange={(e) => handleNumericNChange(e.target.value)}
                          className="w-full p-1.5 text-xs border border-stone-300 dark:border-stone-700 rounded-lg bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 font-bold focus:ring-2 focus:ring-emerald-600 outline-none"
                        />
                      </div>

                      <div className="mt-1 p-2 rounded bg-stone-100/60 dark:bg-stone-800/40 border border-stone-200/40 dark:border-stone-700/40 space-y-1">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="text-stone-500 dark:text-stone-400">Target:</span>
                          <span className="font-bold text-emerald-700 dark:text-emerald-400 text-right truncate">
                            {interpretNutrient('N', nitrogen, currentFarm.crop, currentFarm.state || currentFarm.stateRegion).rangeLabel}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[9px] text-stone-400 dark:text-stone-500">
                          <span>Source:</span>
                          <span className="font-medium text-right truncate max-w-[110px]">
                            {interpretNutrient('N', nitrogen, currentFarm.crop, currentFarm.state || currentFarm.stateRegion).sourceLabel}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-[10px] text-stone-500 dark:text-stone-400 py-1 font-medium animate-fadeIn">
                      Baseline: <strong>{regionalProfile.nitrogen.value}</strong>
                    </div>
                  )}
                </div>

                {/* Phosphorus */}
                <div className="space-y-2 p-3 rounded-xl border border-stone-100 dark:border-stone-800 bg-stone-50/40 dark:bg-stone-900/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <input
                        id="p-tested-checkbox"
                        type="checkbox"
                        checked={phosphorus !== null}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setPhosphorus('Optimal');
                            setPhosphorusKgHa(null);
                          } else {
                            setPhosphorus(null);
                            setPhosphorusKgHa(null);
                          }
                        }}
                        className="w-3.5 h-3.5 rounded text-emerald-600 border-stone-300 dark:border-stone-700 focus:ring-emerald-500 accent-emerald-700 cursor-pointer"
                      />
                      <label htmlFor="p-tested-checkbox" className="text-xs font-bold text-stone-700 dark:text-stone-300 cursor-pointer select-none">
                        Phosphorus (P)
                      </label>
                    </div>
                  </div>
                  {phosphorus !== null ? (
                    <div className="space-y-2 animate-fadeIn">
                      <div className="grid grid-cols-1 gap-1">
                        <label htmlFor="soil-phosphorus-select" className="text-[9px] font-bold text-stone-500 dark:text-stone-400">Rating Status</label>
                        <select
                          id="soil-phosphorus-select"
                          value={phosphorus}
                          onChange={(e) => setPhosphorus((e.target.value as any) || 'Optimal')}
                          className="w-full p-1.5 text-xs border border-stone-300 dark:border-stone-700 rounded-lg bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 font-semibold focus:ring-2 focus:ring-emerald-600 outline-none cursor-pointer"
                        >
                          <option value="Low">{getOptionLabel('P', 'Low')}</option>
                          <option value="Medium">{getOptionLabel('P', 'Medium')}</option>
                          <option value="Optimal">{getOptionLabel('P', 'Optimal')}</option>
                          <option value="High">{getOptionLabel('P', 'High')}</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-1 gap-1">
                        <label className="text-[9px] font-bold text-stone-500 dark:text-stone-400">Value (kg/ha)</label>
                        <input
                          type="number"
                          placeholder="e.g. 18"
                          value={phosphorusKgHa !== null ? phosphorusKgHa : ''}
                          onChange={(e) => handleNumericPChange(e.target.value)}
                          className="w-full p-1.5 text-xs border border-stone-300 dark:border-stone-700 rounded-lg bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 font-bold focus:ring-2 focus:ring-emerald-600 outline-none"
                        />
                      </div>

                      <div className="mt-1 p-2 rounded bg-stone-100/60 dark:bg-stone-800/40 border border-stone-200/40 dark:border-stone-700/40 space-y-1">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="text-stone-500 dark:text-stone-400">Target:</span>
                          <span className="font-bold text-emerald-700 dark:text-emerald-400 text-right truncate">
                            {interpretNutrient('P', phosphorus, currentFarm.crop, currentFarm.state || currentFarm.stateRegion).rangeLabel}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[9px] text-stone-400 dark:text-stone-500">
                          <span>Source:</span>
                          <span className="font-medium text-right truncate max-w-[110px]">
                            {interpretNutrient('P', phosphorus, currentFarm.crop, currentFarm.state || currentFarm.stateRegion).sourceLabel}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-[10px] text-stone-500 dark:text-stone-400 py-1 font-medium animate-fadeIn">
                      Baseline: <strong>{regionalProfile.phosphorus.value}</strong>
                    </div>
                  )}
                </div>

                {/* Potassium */}
                <div className="space-y-2 p-3 rounded-xl border border-stone-100 dark:border-stone-800 bg-stone-50/40 dark:bg-stone-900/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <input
                        id="k-tested-checkbox"
                        type="checkbox"
                        checked={potassium !== null}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setPotassium('Optimal');
                            setPotassiumKgHa(null);
                          } else {
                            setPotassium(null);
                            setPotassiumKgHa(null);
                          }
                        }}
                        className="w-3.5 h-3.5 rounded text-emerald-600 border-stone-300 dark:border-stone-700 focus:ring-emerald-500 accent-emerald-700 cursor-pointer"
                      />
                      <label htmlFor="k-tested-checkbox" className="text-xs font-bold text-stone-700 dark:text-stone-300 cursor-pointer select-none">
                        Potassium (K)
                      </label>
                    </div>
                  </div>
                  {potassium !== null ? (
                    <div className="space-y-2 animate-fadeIn">
                      <div className="grid grid-cols-1 gap-1">
                        <label htmlFor="soil-potassium-select" className="text-[9px] font-bold text-stone-500 dark:text-stone-400">Rating Status</label>
                        <select
                          id="soil-potassium-select"
                          value={potassium}
                          onChange={(e) => setPotassium((e.target.value as any) || 'Optimal')}
                          className="w-full p-1.5 text-xs border border-stone-300 dark:border-stone-700 rounded-lg bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 font-semibold focus:ring-2 focus:ring-emerald-600 outline-none cursor-pointer"
                        >
                          <option value="Low">{getOptionLabel('K', 'Low')}</option>
                          <option value="Medium">{getOptionLabel('K', 'Medium')}</option>
                          <option value="Optimal">{getOptionLabel('K', 'Optimal')}</option>
                          <option value="High">{getOptionLabel('K', 'High')}</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-1 gap-1">
                        <label className="text-[9px] font-bold text-stone-500 dark:text-stone-400">Value (kg/ha)</label>
                        <input
                          type="number"
                          placeholder="e.g. 260"
                          value={potassiumKgHa !== null ? potassiumKgHa : ''}
                          onChange={(e) => handleNumericKChange(e.target.value)}
                          className="w-full p-1.5 text-xs border border-stone-300 dark:border-stone-700 rounded-lg bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 font-bold focus:ring-2 focus:ring-emerald-600 outline-none"
                        />
                      </div>

                      <div className="mt-1 p-2 rounded bg-stone-100/60 dark:bg-stone-800/40 border border-stone-200/40 dark:border-stone-700/40 space-y-1">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="text-stone-500 dark:text-stone-400">Target:</span>
                          <span className="font-bold text-emerald-700 dark:text-emerald-400 text-right truncate">
                            {interpretNutrient('K', potassium, currentFarm.crop, currentFarm.state || currentFarm.stateRegion).rangeLabel}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[9px] text-stone-400 dark:text-stone-500">
                          <span>Source:</span>
                          <span className="font-medium text-right truncate max-w-[110px]">
                            {interpretNutrient('K', potassium, currentFarm.crop, currentFarm.state || currentFarm.stateRegion).sourceLabel}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-[10px] text-stone-500 dark:text-stone-400 py-1 font-medium animate-fadeIn">
                      Baseline: <strong>{regionalProfile.potassium.value}</strong>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Organic Matter (SOM) */}
            <div className="space-y-1.5 pt-2 border-t border-stone-100 dark:border-stone-800">
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2">
                  <input
                    id="som-tested-checkbox"
                    type="checkbox"
                    checked={organicMatter !== null}
                    onChange={(e) => setOrganicMatter(e.target.checked ? 2.5 : null)}
                    className="w-4 h-4 rounded text-emerald-600 border-stone-300 dark:border-stone-700 focus:ring-emerald-500 accent-emerald-700 cursor-pointer"
                  />
                  <label htmlFor="som-tested-checkbox" className="font-semibold text-stone-700 dark:text-stone-300 cursor-pointer select-none flex items-center gap-1.5">
                    {t.organicMatter || 'Soil Organic Matter (SOM)'}
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-stone-800 dark:text-stone-200">
                    {organicMatter !== null ? `${organicMatter.toFixed(1)}%` : 'Using Area Baseline'}
                  </span>
                </div>
              </div>
              {organicMatter !== null ? (
                <div className="flex items-center gap-3">
                  <input
                    id="soil-som-slider"
                    type="range"
                    min="0.5"
                    max="8.0"
                    step="0.1"
                    value={organicMatter ?? 2.0}
                    onChange={(e) => setOrganicMatter(parseFloat(e.target.value))}
                    className="w-full accent-emerald-700 cursor-pointer"
                  />
                  <input
                    id="soil-som-number"
                    type="number"
                    min="0"
                    max="20"
                    step="0.1"
                    placeholder="%"
                    value={organicMatter !== null ? organicMatter : ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      setOrganicMatter(val === '' ? null : parseFloat(val));
                    }}
                    className="w-16 px-2 py-1 text-xs border border-stone-300 dark:border-stone-700 rounded-lg text-center font-bold text-stone-900 dark:text-stone-100 bg-white dark:bg-stone-900 focus:ring-1 focus:ring-emerald-600 outline-none"
                  />
                </div>
              ) : (
                <div className="py-2 px-3 rounded-lg bg-stone-50 dark:bg-stone-900/40 border border-stone-200/50 dark:border-stone-800/50 text-xs text-stone-500 dark:text-stone-400 flex items-center justify-between animate-fadeIn">
                  <span>Using ICAR Area Baseline: <strong>{regionalProfile.organicMatterPercent.value}%</strong></span>
                  <span className="text-[10px] text-stone-400">Tick box to enter lab result</span>
                </div>
              )}
            </div>

            {/* Soil Moisture */}
            <div className="space-y-1.5 pt-2 border-t border-stone-100 dark:border-stone-800">
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2">
                  <input
                    id="moisture-tested-checkbox"
                    type="checkbox"
                    checked={soilMoisture !== null}
                    onChange={(e) => setSoilMoisture(e.target.checked ? 45 : null)}
                    className="w-4 h-4 rounded text-sky-600 border-stone-300 dark:border-stone-700 focus:ring-sky-500 accent-sky-700 cursor-pointer"
                  />
                  <label htmlFor="moisture-tested-checkbox" className="font-semibold text-stone-700 dark:text-stone-300 cursor-pointer select-none flex items-center gap-1.5">
                    {t.soilMoisture || 'Soil Moisture'}
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-stone-800 dark:text-stone-200">
                    {soilMoisture !== null ? `${soilMoisture}%` : 'Using NASA Microwave Telemetry'}
                  </span>
                </div>
              </div>
              {soilMoisture !== null ? (
                <div className="flex items-center gap-3">
                  <input
                    id="soil-moisture-slider"
                    type="range"
                    min="10"
                    max="90"
                    step="1"
                    value={soilMoisture ?? 45}
                    onChange={(e) => setSoilMoisture(parseInt(e.target.value))}
                    className="w-full accent-sky-700 cursor-pointer"
                  />
                  <input
                    id="soil-moisture-number"
                    type="number"
                    min="0"
                    max="100"
                    placeholder="%"
                    value={soilMoisture !== null ? soilMoisture : ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      setSoilMoisture(val === '' ? null : parseInt(val));
                    }}
                    className="w-16 px-2 py-1 text-xs border border-stone-300 dark:border-stone-700 rounded-lg text-center font-bold text-stone-900 dark:text-stone-100 bg-white dark:bg-stone-900 focus:ring-1 focus:ring-emerald-600 outline-none"
                  />
                </div>
              ) : (
                <div className="py-2 px-3 rounded-lg bg-stone-50 dark:bg-stone-900/40 border border-stone-200/50 dark:border-stone-800/50 text-xs text-stone-500 dark:text-stone-400 flex items-center justify-between animate-fadeIn">
                  <span>Using NASA SMAP Baseline: <strong>{soilObservation?.satelliteTelemetry.volumetricSoilMoisturePercent || 28}%</strong></span>
                  <span className="text-[10px] text-stone-400">Tick box to override with custom sensor</span>
                </div>
              )}
            </div>

            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-800 dark:text-rose-300 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            {saveSuccess && (
              <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
                <Check className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                <span>{t.soilRecordSaved || 'Soil test and regenerative diagnosis updated successfully!'}</span>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={handleSaveOnly}
                disabled={loadingAnalysis}
                className="flex-1 py-3 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 border border-stone-300 dark:border-stone-700 disabled:opacity-50 text-stone-800 dark:text-stone-200 font-bold text-xs sm:text-sm shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer min-h-[44px]"
              >
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Save Measurements</span>
              </button>

              <button
                type="button"
                id="analyze-soil-btn"
                disabled={loadingAnalysis}
                onClick={handleAnalyzeSoil}
                className="flex-1 py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer min-h-[44px]"
              >
                {loadingAnalysis ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin shrink-0" />
                    <span>{t.analyzingSoil || 'Analyzing...'}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 shrink-0" />
                    <span>Save & Run AI Diagnostic</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right: Benchmarking Comparison (Lab vs Regional Baseline) (6 Cols) */}
          <div className="lg:col-span-6 bg-white dark:bg-[#0c1810] rounded-2xl border border-stone-200/80 dark:border-stone-800/80 p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
              <h3 className="font-heading text-base font-bold text-stone-900 dark:text-stone-100">
                Benchmarking (Your Lab vs ICAR Area Baseline)
              </h3>
              <span className="text-xs text-stone-500 dark:text-stone-400">
                {currentFarm.district || 'District'}, {currentFarm.state || 'State'}
              </span>
            </div>

            <div className="space-y-4">
              {/* pH Comparison */}
              <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200/60 dark:border-stone-800 space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-stone-700 dark:text-stone-300">Soil pH</span>
                  <span className="text-stone-500">Benchmark: {regionalProfile.ph.value.toFixed(1)}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-stone-900 dark:text-stone-100">
                    Your Value: {ph !== null ? ph.toFixed(1) : 'Not tested'}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getPhRating(ph).color}`}>
                    {ph !== null ? getPhRating(ph).label : 'Using Baseline'}
                  </span>
                </div>
              </div>

              {/* SOM Comparison */}
              <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200/60 dark:border-stone-800 space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-stone-700 dark:text-stone-300">Soil Organic Matter (SOM)</span>
                  <span className="text-stone-500">Benchmark: {regionalProfile.organicMatterPercent.value}%</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-stone-900 dark:text-stone-100">
                    Your Value: {organicMatter !== null ? `${organicMatter.toFixed(1)}%` : 'Not tested'}
                  </span>
                  <span className="text-[11px] text-stone-500">
                    Target: &ge; {regionalProfile.organicMatterTargetPercent}%
                  </span>
                </div>
              </div>

              {/* Nitrogen Comparison */}
              <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200/60 dark:border-stone-800 space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-stone-700 dark:text-stone-300">Nitrogen Status</span>
                  <span className="text-stone-500">Benchmark: {regionalProfile.nitrogen.value} ({regionalProfile.nitrogen.typicalRange})</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-stone-900 dark:text-stone-100">
                    Your Value: {nitrogen || 'Using Regional Baseline'}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getRatingBadgeClass(nitrogen || regionalProfile.nitrogen.value)}`}>
                    {nitrogen || regionalProfile.nitrogen.value}
                  </span>
                </div>
              </div>

              {/* Phosphorus Comparison */}
              <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200/60 dark:border-stone-800 space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-stone-700 dark:text-stone-300">Phosphorus Status</span>
                  <span className="text-stone-500">Benchmark: {regionalProfile.phosphorus.value} ({regionalProfile.phosphorus.typicalRange})</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-stone-900 dark:text-stone-100">
                    Your Value: {phosphorus || 'Using Regional Baseline'}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getRatingBadgeClass(phosphorus || regionalProfile.phosphorus.value)}`}>
                    {phosphorus || regionalProfile.phosphorus.value}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. Tab: Satellite Remote Sensing & Physical Telemetry (NASA SMAP) */}
      {activeTab === 'satellite' && (
        <div className="bg-white dark:bg-[#0c1810] rounded-2xl border border-stone-200/80 dark:border-stone-800/80 p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800 gap-2">
            <div className="flex items-center gap-2">
              <Satellite className="w-5 h-5 text-sky-600 dark:text-sky-400" />
              <div>
                <h3 className="font-heading text-base font-bold text-stone-900 dark:text-stone-100">
                  Remote Sensing & Topsoil Physics (NASA-USDA SMAP & Sentinel-2)
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Physical surface telemetry for coordinates: {currentFarm.latitude?.toFixed(4) || '30.9010'}° N, {currentFarm.longitude?.toFixed(4) || '75.8570'}° E
                </p>
              </div>
            </div>

            <span className="px-2.5 py-1 rounded-full bg-sky-50 dark:bg-sky-950/80 border border-sky-200 dark:border-sky-800 text-sky-800 dark:text-sky-300 text-xs font-semibold">
              Live Microwave Telemetry
            </span>
          </div>

          {/* Explicit scientific distinction callout */}
          <div className="p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 text-xs text-blue-950 dark:text-blue-200 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong>Scientific Remote Sensing Note:</strong> Spaceborne satellites (SMAP, Sentinel-2) directly measure L-band microwave dielectric properties (volumetric moisture) and multispectral optical reflectance. They do <em>not</em> directly measure chemical nitrogen (N), phosphorus (P), or potassium (K). Chemical nutrients are sourced from ICAR soil surveys and laboratory assays.
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200/70 dark:border-stone-800 space-y-1.5">
              <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">Topsoil Volumetric Moisture</span>
              <div className="text-2xl font-bold text-sky-700 dark:text-sky-400">
                {soilObservation?.satelliteTelemetry.volumetricSoilMoisturePercent ?? 28}%
              </div>
              <p className="text-[11px] text-stone-500 dark:text-stone-400">
                Depth Layer: 0–5 cm root zone
              </p>
            </div>

            <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200/70 dark:border-stone-800 space-y-1.5">
              <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">Surface Soil Skin Temperature</span>
              <div className="text-2xl font-bold text-amber-700 dark:text-amber-400">
                {soilObservation?.satelliteTelemetry.surfaceSoilTempCelsius ?? 26.5}°C
              </div>
              <p className="text-[11px] text-stone-500 dark:text-stone-400">
                Thermal infrared radiometric estimation
              </p>
            </div>

            <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200/70 dark:border-stone-800 space-y-1.5">
              <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">Canopy Water Stress</span>
              <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">
                {soilObservation?.satelliteTelemetry.canopyWaterStress ?? 'Low'}
              </div>
              <p className="text-[11px] text-stone-500 dark:text-stone-400">
                NDWI & Evapotranspiration index
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
