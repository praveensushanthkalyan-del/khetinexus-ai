// src/data/soilNutrientReferenceConfig.ts
// Centralized NPK Soil Nutrient Reference and Crop-Specific Target Configuration for India

export interface NutrientRange {
  min: number;
  max: number;
  label: string;
}

export interface CropTarget {
  min: number;
  max: number;
  label: string;
  source: string;
  sourceDate: string;
}

export interface NutrientConfig {
  nutrient: 'N' | 'P' | 'K';
  name: string;
  unit: string;
  testMethod: string;
  lowRange: NutrientRange;
  mediumRange: NutrientRange;
  highRange: NutrientRange;
  optimalTargets: Record<string, Record<string, CropTarget>>; // crop -> region/state -> target
  genericSource: string;
  genericSourceDate: string;
}

export const soilNutrientReferenceConfig: Record<'N' | 'P' | 'K', NutrientConfig> = {
  N: {
    nutrient: 'N',
    name: 'Available Nitrogen (N)',
    unit: 'kg/ha',
    testMethod: 'Alkaline Permanganate Method',
    lowRange: { min: 0, max: 279.9, label: '<280 kg/ha' },
    mediumRange: { min: 280, max: 560, label: '280–560 kg/ha' },
    highRange: { min: 560.1, max: 99999, label: '>560 kg/ha' },
    optimalTargets: {
      Soybean: {
        'Telangana': {
          min: 280,
          max: 450,
          label: '280–450 kg/ha',
          source: 'Adilabad Soybean Regional Study (PJTSAU)',
          sourceDate: '2024',
        },
        'Adilabad': {
          min: 280,
          max: 450,
          label: '280–450 kg/ha',
          source: 'Adilabad Soybean Regional Study (PJTSAU)',
          sourceDate: '2024',
        }
      }
    },
    genericSource: 'Indian Soil-Test Reference (ICAR)',
    genericSourceDate: '2023',
  },
  P: {
    nutrient: 'P',
    name: 'Available Phosphorus (P)',
    unit: 'kg/ha',
    testMethod: "Olsen's Method / Bray's Method",
    lowRange: { min: 0, max: 9.9, label: '<10 kg/ha' },
    mediumRange: { min: 10, max: 25, label: '10–25 kg/ha' },
    highRange: { min: 25.1, max: 99999, label: '>25 kg/ha' },
    optimalTargets: {
      Soybean: {
        'Telangana': {
          min: 15,
          max: 30,
          label: '15–30 kg/ha',
          source: 'Adilabad Soybean Regional Study (PJTSAU)',
          sourceDate: '2024',
        },
        'Adilabad': {
          min: 15,
          max: 30,
          label: '15–30 kg/ha',
          source: 'Adilabad Soybean Regional Study (PJTSAU)',
          sourceDate: '2024',
        }
      }
    },
    genericSource: 'Indian Soil-Test Reference (ICAR)',
    genericSourceDate: '2023',
  },
  K: {
    nutrient: 'K',
    name: 'Available Potassium (K)',
    unit: 'kg/ha',
    testMethod: 'Neutral Normal Ammonium Acetate Method',
    lowRange: { min: 0, max: 119.9, label: '<120 kg/ha' },
    mediumRange: { min: 120, max: 280, label: '120–280 kg/ha' },
    highRange: { min: 280.1, max: 99999, label: '>280 kg/ha' },
    optimalTargets: {
      Soybean: {
        'Telangana': {
          min: 150,
          max: 240,
          label: '150–240 kg/ha',
          source: 'Adilabad Soybean Regional Study (PJTSAU)',
          sourceDate: '2024',
        },
        'Adilabad': {
          min: 150,
          max: 240,
          label: '150–240 kg/ha',
          source: 'Adilabad Soybean Regional Study (PJTSAU)',
          sourceDate: '2024',
        }
      }
    },
    genericSource: 'Indian Soil-Test Reference (ICAR)',
    genericSourceDate: '2023',
  },
};

/**
 * Resolves crop-specific target if exists for the given crop and state/region
 */
export function getCropSpecificTarget(
  nutrient: 'N' | 'P' | 'K',
  crop?: string,
  region?: string
): CropTarget | null {
  if (!crop) return null;
  const config = soilNutrientReferenceConfig[nutrient];
  const cropTargets = config.optimalTargets[crop];
  if (!cropTargets) return null;

  // Try exact region or fallback to Telangana if region contains it
  const cleanRegion = (region || '').trim();
  if (cleanRegion) {
    const matchedKey = Object.keys(cropTargets).find(
      (k) => k.toLowerCase() === cleanRegion.toLowerCase() ||
             cleanRegion.toLowerCase().includes(k.toLowerCase()) ||
             k.toLowerCase().includes(cleanRegion.toLowerCase())
    );
    if (matchedKey && cropTargets[matchedKey]) {
      return cropTargets[matchedKey];
    }
  }

  // Fallback to Telangana if region looks like Telangana/Adilabad
  if (cleanRegion.toLowerCase().includes('telangana') || cleanRegion.toLowerCase().includes('adilabad')) {
    if (cropTargets['Telangana']) return cropTargets['Telangana'];
    if (cropTargets['Adilabad']) return cropTargets['Adilabad'];
  }

  return null;
}

/**
 * Calculates NPK fertility status dynamically based on numeric value, crop target and reference ranges
 */
export function calculateStatusFromValue(
  nutrient: 'N' | 'P' | 'K',
  value: number,
  crop?: string,
  region?: string
): 'Low' | 'Medium' | 'Optimal' | 'High' {
  // Check if a crop-specific optimal target exists and if value fits in it
  const cropTarget = getCropSpecificTarget(nutrient, crop, region);
  if (cropTarget && value >= cropTarget.min && value <= cropTarget.max) {
    return 'Optimal';
  }

  const config = soilNutrientReferenceConfig[nutrient];
  if (value < config.mediumRange.min) {
    return 'Low';
  } else if (value <= config.mediumRange.max) {
    return 'Medium';
  } else {
    return 'High';
  }
}

/**
 * Formats display string for NPK status and corresponding range
 */
export interface InterpretationResult {
  status: 'Low' | 'Medium' | 'Optimal' | 'High';
  rangeLabel: string;
  sourceLabel: string;
  isCropSpecific: boolean;
}

export function interpretNutrient(
  nutrient: 'N' | 'P' | 'K',
  status: 'Low' | 'Medium' | 'Optimal' | 'High',
  crop?: string,
  region?: string
): InterpretationResult {
  const config = soilNutrientReferenceConfig[nutrient];
  
  if (status === 'Optimal') {
    const target = getCropSpecificTarget(nutrient, crop, region);
    if (target) {
      return {
        status: 'Optimal',
        rangeLabel: `${crop} target: ${target.label}`,
        sourceLabel: target.source,
        isCropSpecific: true,
      };
    } else {
      return {
        status: 'Optimal',
        rangeLabel: 'Crop-specific target unavailable',
        sourceLabel: config.genericSource,
        isCropSpecific: false,
      };
    }
  }

  let rangeLabel = '';
  if (status === 'Low') {
    rangeLabel = config.lowRange.label;
  } else if (status === 'Medium') {
    rangeLabel = config.mediumRange.label;
  } else {
    rangeLabel = config.highRange.label;
  }

  return {
    status,
    rangeLabel,
    sourceLabel: config.genericSource,
    isCropSpecific: false,
  };
}
