export type SupportedCountry = 'India' | 'Brazil' | 'Russia' | 'China' | 'South Africa';

export interface FarmProfile {
  id: string;
  name: string;
  country: string;
  stateRegion: string;
  location: string;
  farmSize: number;
  farmUnit: 'hectares' | 'acres';
  crop: string;
  growthStage: 'Germination' | 'Vegetative' | 'Flowering' | 'Grain filling' | 'Maturity';
  soilType: string;
  irrigationType: 'Drip Irrigation' | 'Canal' | 'Sprinkler' | 'Rainfed' | 'Borewell / Tube well';
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

export interface DiagnosisResult {
  id?: string;
  isReliable: boolean;
  disease: string;
  confidence: string;
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
  soilType: string;
  ph: number;
  nitrogen: 'Low' | 'Medium' | 'Optimal' | 'High';
  phosphorus: 'Low' | 'Medium' | 'Optimal' | 'High';
  potassium: 'Low' | 'Medium' | 'Optimal' | 'High';
  soilMoisture: number; // percentage
  organicMatter: number; // percentage
  summary?: string;
  deficiencies?: string[];
  regenerativeRecommendations?: string[];
  organicMatterSuggestions?: string;
  cropSpecificAdvice?: string;
  isDemo?: boolean;
  source?: string;
}

export interface ForecastDay {
  day: string;
  temp: string;
  condition: string;
  rainProb: string;
}

export interface WeatherData {
  location: string;
  country: string;
  temperature: string;
  tempValue?: number;
  humidity: string;
  rainfall: string;
  wind: string;
  condition: string;
  conditionCode?: string;
  forecast: ForecastDay[];
  isDemo: boolean;
  notice: string;
}

export type Language = 'en' | 'hi';

export type ActiveTab =
  | 'landing'
  | 'dashboard'
  | 'farm-profile'
  | 'ai-advisor'
  | 'crop-doctor'
  | 'weather'
  | 'soil-health'
  | 'regenerative'
  | 'agrin-network';
