export type SupportedCountry =
  | 'India'
  | 'Brazil'
  | 'Russia'
  | 'China'
  | 'South Africa'
  | 'Egypt'
  | 'Ethiopia'
  | 'Indonesia'
  | 'Iran'
  | 'Saudi Arabia'
  | 'United Arab Emirates';

export interface LocationMetadata {
  latitude: number;
  longitude: number;
  accuracy: number;
  village: string;
  locality: string;
  district: string;
  state: string;
  country: string;
  postalCode: string;
  formattedAddress: string;
  source: 'gps' | 'manual' | 'geocoded';
  capturedAt: string;
}

export interface FarmLocation {
  address: string;
  village?: string;
  mandal?: string;
  district?: string;
  state?: string;
  country?: string;
  latitude: number | null;
  longitude: number | null;
  accuracyMeters?: number;
  source: 'GPS' | 'USER_SELECTED' | 'GEOCODED';
  capturedAt?: string;
}

export interface FarmProfile {
  id: string;
  name: string;
  country: string;
  stateRegion: string;
  location: string;
  locationObj?: FarmLocation;
  farmSize: number;
  farmUnit: 'hectares' | 'acres';
  crop: string;
  growthStage: 'Germination' | 'Vegetative' | 'Flowering' | 'Grain filling' | 'Maturity';
  soilType: string;
  irrigationType: 'Drip Irrigation' | 'Canal' | 'Sprinkler' | 'Rainfed' | 'Borewell / Tube well';
  latitude?: number | null;
  longitude?: number | null;
  cropVariety?: string;
  state?: string;
  district?: string;
  subDistrict?: string;
  currentCrop?: string;
  areaAcres?: number;
  farmingType?: string;
  coordinates?: { lat: number; lng: number };
  createdAt?: string;
  updatedAt?: string;
  adoptedPillars?: string[];
  regenerativeFarming?: {
    adoptedPillars: string[];
    updatedAt: string;
  };
  locationMetadata?: LocationMetadata;
}

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  photoURL?: string | null;
  preferredLanguage: Language;
  createdAt: string;
  updatedAt: string;
}

export interface UserFarm {
  id: string;
  farmName: string;
  locationName: string;
  location?: FarmLocation;
  country: string;
  stateRegion?: string;
  state?: string;
  district?: string;
  subDistrict?: string;
  latitude?: number | null;
  longitude?: number | null;
  area: number;
  areaUnit: 'hectares' | 'acres';
  crop: string;
  cropVariety?: string;
  cropStage: 'Germination' | 'Vegetative' | 'Flowering' | 'Grain filling' | 'Maturity';
  soilType: string;
  irrigationType: 'Drip Irrigation' | 'Canal' | 'Sprinkler' | 'Rainfed' | 'Borewell / Tube well';
  createdAt?: string;
  updatedAt?: string;
  adoptedPillars?: string[];
  regenerativeFarming?: {
    adoptedPillars: string[];
    updatedAt: string;
  };
  locationMetadata?: LocationMetadata;
}

export function userFarmToFarmProfile(farm: UserFarm): FarmProfile {
  const lat = farm.latitude ?? farm.location?.latitude ?? farm.locationMetadata?.latitude ?? null;
  const lon = farm.longitude ?? farm.location?.longitude ?? farm.locationMetadata?.longitude ?? null;
  const hasValidCoords = typeof lat === 'number' && typeof lon === 'number' && !isNaN(lat) && !isNaN(lon);

  const locObj: FarmLocation = farm.location || {
    address: farm.locationName || '',
    village: farm.locationMetadata?.village || '',
    mandal: farm.locationMetadata?.locality || '',
    district: farm.district || farm.locationMetadata?.district || '',
    state: farm.state || farm.locationMetadata?.state || farm.stateRegion || '',
    country: farm.country || 'India',
    latitude: hasValidCoords ? lat : null,
    longitude: hasValidCoords ? lon : null,
    accuracyMeters: farm.locationMetadata?.accuracy,
    source: (farm.locationMetadata?.source?.toUpperCase() as any) || (hasValidCoords ? 'GEOCODED' : 'USER_SELECTED'),
    capturedAt: farm.locationMetadata?.capturedAt || farm.updatedAt,
  };

  return {
    id: farm.id,
    name: farm.farmName,
    country: farm.country || 'India',
    stateRegion: farm.stateRegion || farm.state || locObj.state || farm.locationName,
    location: locObj.address || farm.locationName,
    locationObj: locObj,
    farmSize: farm.area,
    farmUnit: farm.areaUnit,
    crop: farm.crop,
    currentCrop: farm.crop,
    growthStage: farm.cropStage,
    soilType: farm.soilType,
    irrigationType: farm.irrigationType,
    latitude: hasValidCoords ? lat : null,
    longitude: hasValidCoords ? lon : null,
    coordinates: hasValidCoords ? { lat: lat!, lng: lon! } : undefined,
    cropVariety: farm.cropVariety,
    state: farm.state || farm.stateRegion || locObj.state || '',
    district: farm.district || locObj.district || farm.locationName || '',
    subDistrict: farm.subDistrict || locObj.mandal || locObj.village || '',
    createdAt: farm.createdAt,
    updatedAt: farm.updatedAt,
    adoptedPillars: farm.adoptedPillars || farm.regenerativeFarming?.adoptedPillars,
    regenerativeFarming: farm.regenerativeFarming,
    locationMetadata: farm.locationMetadata,
  };
}

export function farmProfileToUserFarm(profile: FarmProfile): UserFarm {
  return {
    id: profile.id,
    farmName: profile.name,
    locationName: profile.location,
    location: profile.locationObj,
    country: profile.country,
    stateRegion: profile.stateRegion,
    state: profile.state || profile.stateRegion,
    district: profile.district,
    subDistrict: profile.subDistrict,
    area: profile.farmSize,
    areaUnit: profile.farmUnit,
    crop: profile.crop,
    cropStage: profile.growthStage,
    soilType: profile.soilType,
    irrigationType: profile.irrigationType,
    latitude: profile.latitude,
    longitude: profile.longitude,
    cropVariety: profile.cropVariety,
    createdAt: profile.createdAt,
    updatedAt: profile.updatedAt,
    adoptedPillars: profile.adoptedPillars,
    regenerativeFarming: profile.regenerativeFarming,
    locationMetadata: profile.locationMetadata,
  };
}

export interface SavedAdvisoryRecord {
  id: string;
  farmId?: string;
  farmName?: string;
  countryCode?: string;
  crop: string;
  language: Language;
  summary: string;
  todayAction: string;
  waterManagement: string;
  soilHealth: string;
  cropProtection: string;
  regenerativePractice: string;
  next7Days: string;
  createdAt: string;
}

export interface SavedSoilRecord {
  id: string;
  farmId?: string;
  countryCode?: string;
  analysisType?: string;
  soilType?: string;
  ph?: number | null;
  organicMatter?: number | null;
  nitrogen?: 'Low' | 'Medium' | 'Optimal' | 'High' | null;
  nitrogenKgHa?: number | null;
  phosphorus?: 'Low' | 'Medium' | 'Optimal' | 'High' | null;
  phosphorusKgHa?: number | null;
  potassium?: 'Low' | 'Medium' | 'Optimal' | 'High' | null;
  potassiumKgHa?: number | null;
  soilMoisture?: number | null;
  summary?: string;
  deficiencies?: string[];
  regenerativeRecommendations?: string[];
  organicMatterSuggestions?: string;
  cropSpecificAdvice?: string;
  source?: string;
  language?: Language;
  createdAt: string;
}

export interface SavedDiagnosisRecord {
  id: string;
  farmId?: string;
  countryCode?: string;
  category?: string;
  disease: string;
  scientificName?: string;
  confidence?: string;
  confidenceExplanation?: string;
  visibleSymptoms?: string;
  causes?: string;
  immediateActions?: string;
  preventionPractices?: string;
  createdAt: string;
}

export interface AdvisoryResult {
  id?: string;
  summary: string;
  todayAction: string;
  waterManagement: string;
  soilHealth: string;
  cropProtection: string;
  regenerativePractice: string;
  next7Days: string;
  disclaimer: string;
  timestamp: string;
  isDemo?: boolean;
  source?: string;
}

export type CropConditionCategory =
  | 'Disease'
  | 'Pest damage'
  | 'Nutrient deficiency'
  | 'Abiotic/environmental stress'
  | 'Normal growth / maturation / senescence'
  | 'Healthy/no obvious abnormality'
  | 'Unable to determine';

export interface ConfidenceFactor {
  name: string;
  score: number;
  maxScore: number;
  weight: string;
  status: 'pass' | 'warning' | 'fail';
  description: string;
}

export interface EvidenceBasedConfidence {
  score: number; // 0-100
  level: 'Very High' | 'High' | 'Moderate' | 'Low' | 'Very Low';
  reasons: string[];
  factors: ConfidenceFactor[];
}

export interface CropDoctorChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  observedPoints?: string[];
  inferredPoints?: string[];
  verifiedPoints?: string[];
  unknownPoints?: string[];
  technicalDetails?: string;
  suggestedActions?: string[];
  sources?: Array<{ title: string; source: string; sourceType: string }>;
  isInitialExplanation?: boolean;
}

export interface CandidateDiagnosis {
  condition: string;
  hierarchy: string[];
  supportingEvidence: string[];
  missingExpectedEvidence: string[];
  contradictoryEvidence: string[];
  sourceVerification: string[];
  candidateScore: number;
}

export interface DiagnosticConfidenceDetails {
  visualEvidence: number;      // max 35
  featureMatch: number;        // max 25
  sourceVerification: number;  // max 15
  contradictionCheck: number;  // max 15
  imageQuality: number;       // max 10
  rawScore: number;
  confidenceCeiling: number;
  finalScore: number;
  level: 'Very High' | 'High' | 'Moderate' | 'Low' | 'Very Low' | 'Insufficient';
  reasons?: string[];
  factors?: ConfidenceFactor[];
}

export interface ImageQualityAssessment {
  score: number;
  assessment: string;
  usable: boolean;
}

export interface VerificationDetails {
  performed: boolean;
  summary: string;
  sources: string[];
}

export interface RecheckDetails {
  performed: boolean;
  result: string;
  remainingContradictions: string[];
}

export interface DiagnosisResult {
  id?: string;
  isReliable: boolean;
  category?: CropConditionCategory;
  subcategory?: string;
  condition?: string;
  subtype?: string;
  disease: string;
  scientificName?: string;
  scientificNameStatus?: 'likely_associated' | 'laboratory_confirmed' | 'not_applicable';
  cropConsistency?: boolean;
  affectedStructures?: string[];
  imageQuality?: ImageQualityAssessment;
  visualEvidenceArray?: string[];
  candidateDiagnoses?: CandidateDiagnosis[];
  verification?: VerificationDetails;
  recheck?: RecheckDetails;
  confidenceDetails?: DiagnosticConfidenceDetails;
  problem?: string;
  likelyCause?: string;
  immediateActionsList?: string[];
  managementList?: string[];
  preventionList?: string[];
  monitoringList?: string[];
  additionalImagesRequired?: boolean;
  recommendedAdditionalImages?: string[];
  secondaryFindings?: string[];

  // Backward compatibility string fields
  confidence: string;
  confidenceExplanation?: string;
  visibleSymptoms: string;
  causes: string;
  immediateActions: string;
  preventionPractices: string;
  disclaimer: string;
  imagePreview?: string;
  crop?: string;
  timestamp: string;
  isDemo?: boolean;
  source?: string;
}

export interface SoilReport {
  id?: string;
  soilType: string;
  ph?: number | null;
  nitrogen?: 'Low' | 'Medium' | 'Optimal' | 'High' | null;
  nitrogenKgHa?: number | null;
  phosphorus?: 'Low' | 'Medium' | 'Optimal' | 'High' | null;
  phosphorusKgHa?: number | null;
  potassium?: 'Low' | 'Medium' | 'Optimal' | 'High' | null;
  potassiumKgHa?: number | null;
  soilMoisture?: number | null; // percentage
  organicMatter?: number | null; // percentage
  electricalConductivity?: number | null; // dS/m
  cationExchangeCapacity?: number | null; // meq/100g
  summary?: string;
  deficiencies?: string[];
  regenerativeRecommendations?: string[];
  organicMatterSuggestions?: string;
  cropSpecificAdvice?: string;
  isDemo?: boolean;
  source?: string;
  date?: string;
  createdAt?: string;
}

export const EMPTY_SOIL_REPORT: SoilReport = {
  soilType: '',
  ph: null,
  nitrogen: null,
  nitrogenKgHa: null,
  phosphorus: null,
  phosphorusKgHa: null,
  potassium: null,
  potassiumKgHa: null,
  soilMoisture: null,
  organicMatter: null,
  summary: '',
  deficiencies: [],
  regenerativeRecommendations: [],
  organicMatterSuggestions: '',
  cropSpecificAdvice: '',
  isDemo: false,
  source: 'User Soil Test',
};

export interface ForecastDay {
  day: string;
  date?: string;
  temp: string;
  tempMax?: number;
  tempMin?: number;
  condition: string;
  conditionCode?: string;
  rainProb: string;
  rainfallMm?: number;
  windSpeedKmh?: number;
}

export interface HourlyForecastPoint {
  time: string;
  isoTimestamp?: string;
  localTime?: string;
  displayTime12?: string;
  displayTime24?: string;
  hour?: number;
  isoTime?: string;
  temp: number;
  apparentTemp?: number;
  dewPoint?: number;
  humidity: number;
  rainfallMm: number;
  rainProb: number;
  windSpeedKmh: number;
  windDirection?: number;
  cloudCover?: number;
  condition: string;
  conditionCode: string;
  evapotranspiration?: number;
  sprayingStatus?: 'Optimal' | 'Marginal' | 'Unfavorable';
  timeOfDay?: 'Morning' | 'Afternoon' | 'Evening' | 'Night';
  isNow?: boolean;
}

export interface DailyForecastPoint {
  day: string;
  date: string;
  tempMax: number;
  tempMin: number;
  temp: string;
  rainfallMm: number;
  rainProb: string;
  windSpeedKmh: number;
  condition: string;
  conditionCode: string;
}

export interface WeatherData {
  location: string;
  country: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
  utcOffsetSeconds?: number;
  currentLocalTime?: string;
  currentLocalHour?: number;
  temperature: string;
  tempValue?: number;
  humidity: string;
  humidityValue?: number;
  rainfall: string;
  rainfallMm?: number;
  wind: string;
  windSpeedKmh?: number;
  condition: string;
  conditionCode?: string;
  forecast: ForecastDay[];
  hourlyForecast?: HourlyForecastPoint[];
  dailyForecast?: DailyForecastPoint[];
  isDemo: boolean;
  notice: string;
  status?: 'ACTIVE' | 'UNAVAILABLE' | 'STALE' | 'ERROR';
  statusMessage?: string;
  fetchedAt?: string;
  observationDate?: string;
  provider?: string;
  datasetName?: string;
  freshness?: 'LIVE' | 'NEAR_REAL_TIME' | 'LATEST_AVAILABLE' | 'HISTORICAL' | 'UNAVAILABLE';
}

export type Language = string;

export type ActiveTab =
  | 'landing'
  | 'dashboard'
  | 'farm-profile'
  | 'ai-advisor'
  | 'crop-doctor'
  | 'weather'
  | 'soil-health'
  | 'regenerative'
  | 'agrin-network'
  | 'geospatial-intel'
  | 'data-sources';
