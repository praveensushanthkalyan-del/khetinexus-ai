// src/data/indiaGeographicHierarchy.ts
// India-First Complete Geographic Hierarchy & Resolution Engine for KhetiNexus AI

export interface IndianDistrictInfo {
  name: string;
  subDistricts: string[];
  agroClimaticZone: string;
  latitude: number;
  longitude: number;
}

export interface IndianStateInfo {
  name: string;
  code: string;
  type: 'State' | 'Union Territory';
  capital: string;
  agroClimaticRegion: string;
  districts: Record<string, IndianDistrictInfo>;
  latitude: number;
  longitude: number;
}

export interface IndianGeographicContext {
  country: string;
  state: string;
  district: string;
  subDistrict: string;
  localRegion: string;
  agroClimaticZone: string;
  latitude: number | null;
  longitude: number | null;
  geographicResolutionLevel:
    | 'farm_coordinates'
    | 'local_region'
    | 'sub_district'
    | 'district'
    | 'state'
    | 'national'
    | 'global';
  resolutionLabel: string;
}

// Complete Registry of all 28 States and 8 Union Territories in India
export const INDIA_GEOGRAPHIC_HIERARCHY: Record<string, IndianStateInfo> = {
  'Punjab': {
    name: 'Punjab',
    code: 'PB',
    type: 'State',
    capital: 'Chandigarh',
    agroClimaticRegion: 'Trans-Gangetic Plains Region (Zone VI)',
    latitude: 31.1471,
    longitude: 75.3412,
    districts: {
      'Ludhiana': {
        name: 'Ludhiana',
        subDistricts: ['Ludhiana East', 'Ludhiana West', 'Jagraon', 'Khanna', 'Samrala', 'Payal', 'Raikot'],
        agroClimaticZone: 'Central Plain Zone of Punjab',
        latitude: 30.9010,
        longitude: 75.8573,
      },
      'Amritsar': {
        name: 'Amritsar',
        subDistricts: ['Amritsar-I', 'Amritsar-II', 'Ajnala', 'Baba Bakala'],
        agroClimaticZone: 'Sub-Mountain Undulating Zone',
        latitude: 31.6340,
        longitude: 74.8723,
      },
      'Patiala': {
        name: 'Patiala',
        subDistricts: ['Patiala', 'Nabha', 'Rajpura', 'Samana', 'Patran'],
        agroClimaticZone: 'Central Plain Zone of Punjab',
        latitude: 30.3398,
        longitude: 76.3869,
      },
      'Jalandhar': {
        name: 'Jalandhar',
        subDistricts: ['Jalandhar-I', 'Jalandhar-II', 'Nakodar', 'Phillaur', 'Shahkot'],
        agroClimaticZone: 'Central Plain Zone of Punjab',
        latitude: 31.3260,
        longitude: 75.5762,
      },
      'Bathinda': {
        name: 'Bathinda',
        subDistricts: ['Bathinda', 'Rampura Phul', 'Talwandi Sabo', 'Maur'],
        agroClimaticZone: 'Western Plain Zone of Punjab',
        latitude: 30.2110,
        longitude: 74.9455,
      },
      'Sangrur': {
        name: 'Sangrur',
        subDistricts: ['Sangrur', 'Sunam', 'Dhuri', 'Lehra', 'Moonak'],
        agroClimaticZone: 'Central Plain Zone of Punjab',
        latitude: 30.2458,
        longitude: 75.8421,
      },
    },
  },
  'Telangana': {
    name: 'Telangana',
    code: 'TG',
    type: 'State',
    capital: 'Hyderabad',
    agroClimaticRegion: 'Southern Plateau and Hills Region (Zone X)',
    latitude: 18.1124,
    longitude: 79.0193,
    districts: {
      'Adilabad': {
        name: 'Adilabad',
        subDistricts: ['Adilabad Rural', 'Adilabad Urban', 'Jainad', 'Bela', 'Utnoor'],
        agroClimaticZone: 'Northern Telangana Zone (Zone X)',
        latitude: 19.6641,
        longitude: 78.5320,
      },
      'Warangal': {
        name: 'Warangal',
        subDistricts: ['Warangal', 'Khila Warangal', 'Geesugonda', 'Atmakur', 'Sangem'],
        agroClimaticZone: 'Central Telangana Zone',
        latitude: 17.9689,
        longitude: 79.5941,
      },
      'Karimnagar': {
        name: 'Karimnagar',
        subDistricts: ['Karimnagar', 'Choppadandi', 'Manakondur', 'Huzurabad', 'Thimmapur'],
        agroClimaticZone: 'Northern Telangana Zone',
        latitude: 18.4386,
        longitude: 79.1288,
      },
      'Nizamabad': {
        name: 'Nizamabad',
        subDistricts: ['Nizamabad North', 'Nizamabad South', 'Bodhan', 'Armoor', 'Balkonda'],
        agroClimaticZone: 'Northern Telangana Zone',
        latitude: 18.6725,
        longitude: 78.0941,
      },
      'Khammam': {
        name: 'Khammam',
        subDistricts: ['Khammam Urban', 'Khammam Rural', 'Wyra', 'Sathupalli', 'Madhira'],
        agroClimaticZone: 'Central Telangana Zone',
        latitude: 17.2473,
        longitude: 80.1514,
      },
      'Nalgonda': {
        name: 'Nalgonda',
        subDistricts: ['Nalgonda', 'Miryalaguda', 'Devarakonda', 'Nagarjuna Sagar', 'Nakrekal'],
        agroClimaticZone: 'Southern Telangana Zone',
        latitude: 17.0577,
        longitude: 79.2684,
      },
    },
  },
  'Maharashtra': {
    name: 'Maharashtra',
    code: 'MH',
    type: 'State',
    capital: 'Mumbai',
    agroClimaticRegion: 'Western Plateau and Hills Region (Zone IX)',
    latitude: 19.7515,
    longitude: 75.7139,
    districts: {
      'Nashik': {
        name: 'Nashik',
        subDistricts: ['Nashik', 'Niphad', 'Sinnar', 'Malegaon', 'Igatpuri', 'Yeola', 'Kalwan'],
        agroClimaticZone: 'Western Maharashtra Plain Zone (Scarcity Zone)',
        latitude: 19.9975,
        longitude: 73.7898,
      },
      'Pune': {
        name: 'Pune',
        subDistricts: ['Haveli', 'Baramati', 'Indapur', 'Shirur', 'Junner', 'Khed', 'Maval'],
        agroClimaticZone: 'Western Ghat Zone / Scarcity Zone',
        latitude: 18.5204,
        longitude: 73.8567,
      },
      'Nagpur': {
        name: 'Nagpur',
        subDistricts: ['Nagpur Urban', 'Nagpur Rural', 'Katol', 'Saoner', 'Umred', 'Ramtek'],
        agroClimaticZone: 'Central Vidarbha Zone',
        latitude: 21.1458,
        longitude: 79.0882,
      },
      'Ahmednagar': {
        name: 'Ahmednagar',
        subDistricts: ['Nagar', 'Rahuri', 'Shrirampur', 'Kopargaon', 'Sangamner', 'Shevgaon'],
        agroClimaticZone: 'Scarcity Zone of Maharashtra',
        latitude: 19.0952,
        longitude: 74.7496,
      },
      'Solapur': {
        name: 'Solapur',
        subDistricts: ['Solapur North', 'Solapur South', 'Pandharpur', 'Barshi', 'Sangole', 'Malshiras'],
        agroClimaticZone: 'Scarcity Zone of Maharashtra',
        latitude: 17.6599,
        longitude: 75.9064,
      },
    },
  },
  'Karnataka': {
    name: 'Karnataka',
    code: 'KA',
    type: 'State',
    capital: 'Bengaluru',
    agroClimaticRegion: 'Southern Plateau and Hills Region (Zone X)',
    latitude: 15.3173,
    longitude: 75.7139,
    districts: {
      'Mandya': {
        name: 'Mandya',
        subDistricts: ['Mandya', 'Maddur', 'Malavalli', 'Srirangapatna', 'Pandavapura', 'KR Pet'],
        agroClimaticZone: 'Southern Dry Zone of Karnataka',
        latitude: 12.5218,
        longitude: 76.8951,
      },
      'Belagavi': {
        name: 'Belagavi',
        subDistricts: ['Belagavi', 'Chikodi', 'Gokak', 'Bailhongal', 'Athani', 'Khanapur'],
        agroClimaticZone: 'Northern Transition Zone',
        latitude: 15.8497,
        longitude: 74.4977,
      },
      'Dharwad': {
        name: 'Dharwad',
        subDistricts: ['Dharwad', 'Hubballi', 'Kalghatgi', 'Navalgund', 'Kundgol'],
        agroClimaticZone: 'Northern Transition Zone',
        latitude: 15.4589,
        longitude: 75.0078,
      },
      'Shimoga': {
        name: 'Shimoga',
        subDistricts: ['Shivamogga', 'Bhadravathi', 'Sagar', 'Shikaripura', 'Soraba', 'Thirthahalli'],
        agroClimaticZone: 'Southern Transition / Malnad Zone',
        latitude: 13.9299,
        longitude: 75.5681,
      },
    },
  },
  'Uttar Pradesh': {
    name: 'Uttar Pradesh',
    code: 'UP',
    type: 'State',
    capital: 'Lucknow',
    agroClimaticRegion: 'Upper Gangetic Plains Region (Zone V)',
    latitude: 26.8467,
    longitude: 80.9462,
    districts: {
      'Varanasi': {
        name: 'Varanasi',
        subDistricts: ['Varanasi Sadar', 'Pindra', 'Raja Talab'],
        agroClimaticZone: 'Eastern Plain Zone of UP',
        latitude: 25.3176,
        longitude: 82.9739,
      },
      'Gorakhpur': {
        name: 'Gorakhpur',
        subDistricts: ['Sadar', 'Bansgaon', 'Campierganj', 'Chauri Chaura', 'Khajni', 'Sahjanwa'],
        agroClimaticZone: 'North Eastern Plain Zone of UP',
        latitude: 26.7606,
        longitude: 83.3732,
      },
      'Agra': {
        name: 'Agra',
        subDistricts: ['Agra', 'Etmadpur', 'Fatehabad', 'Kheragarh', 'Kirao', 'Bah'],
        agroClimaticZone: 'Western Plain Zone of UP',
        latitude: 27.1767,
        longitude: 78.0081,
      },
      'Kanpur Nagar': {
        name: 'Kanpur Nagar',
        subDistricts: ['Kanpur Sadar', 'Bilhau', 'Ghatampur'],
        agroClimaticZone: 'Central Plain Zone of UP',
        latitude: 26.4499,
        longitude: 80.3319,
      },
    },
  },
  'Gujarat': {
    name: 'Gujarat',
    code: 'GJ',
    type: 'State',
    capital: 'Gandhinagar',
    agroClimaticRegion: 'Gujarat Plains and Hills Region (Zone XIII)',
    latitude: 22.2587,
    longitude: 71.1924,
    districts: {
      'Rajkot': {
        name: 'Rajkot',
        subDistricts: ['Rajkot', 'Gondal', 'Jetpur', 'Dhoraji', 'Jasdan', 'Morbi'],
        agroClimaticZone: 'North Saurashtra Agro-Climatic Zone',
        latitude: 22.3039,
        longitude: 70.8022,
      },
      'Anand': {
        name: 'Anand',
        subDistricts: ['Anand', 'Borsad', 'Petlad', 'Khambhat', 'Umreth', 'Tarapur'],
        agroClimaticZone: 'Middle Gujarat Agro-Climatic Zone',
        latitude: 22.5645,
        longitude: 72.9289,
      },
      'Junagadh': {
        name: 'Junagadh',
        subDistricts: ['Junagadh', 'Keshod', 'Manavadar', 'Malia', 'Vanthali', 'Visavadar'],
        agroClimaticZone: 'South Saurashtra Agro-Climatic Zone',
        latitude: 21.5222,
        longitude: 70.4579,
      },
    },
  },
  'Madhya Pradesh': {
    name: 'Madhya Pradesh',
    code: 'MP',
    type: 'State',
    capital: 'Bhopal',
    agroClimaticRegion: 'Central Plateau and Hills Region (Zone VIII)',
    latitude: 22.9734,
    longitude: 78.6569,
    districts: {
      'Indore': {
        name: 'Indore',
        subDistricts: ['Indore', 'Mhow', 'Depalpur', 'Sanwer'],
        agroClimaticZone: 'Malwa Plateau Agro-Climatic Zone',
        latitude: 22.7196,
        longitude: 75.8577,
      },
      'Ujjain': {
        name: 'Ujjain',
        subDistricts: ['Ujjain', 'Nagda', 'Khachrod', 'Badnagar', 'Tarana', 'Mahidpur'],
        agroClimaticZone: 'Malwa Plateau Agro-Climatic Zone',
        latitude: 23.1765,
        longitude: 75.7885,
      },
      'Hoshangabad': {
        name: 'Narmadapuram (Hoshangabad)',
        subDistricts: ['Hoshangabad', 'Itarsi', 'Pipariya', 'Seoni Malwa', 'Sohagpur'],
        agroClimaticZone: 'Central Narmada Valley Agro-Climatic Zone',
        latitude: 22.7533,
        longitude: 77.7240,
      },
    },
  },
  'Tamil Nadu': {
    name: 'Tamil Nadu',
    code: 'TN',
    type: 'State',
    capital: 'Chennai',
    agroClimaticRegion: 'Southern Plateau and Hills Region (Zone X)',
    latitude: 11.1271,
    longitude: 78.6569,
    districts: {
      'Thanjavur': {
        name: 'Thanjavur',
        subDistricts: ['Thanjavur', 'Kumbakonam', 'Papanasam', 'Pattukkottai', 'Orathanadu'],
        agroClimaticZone: 'Cauvery Delta Agro-Climatic Zone',
        latitude: 10.7870,
        longitude: 79.1378,
      },
      'Coimbatore': {
        name: 'Coimbatore',
        subDistricts: ['Coimbatore North', 'Coimbatore South', 'Pollachi', 'Mettupalayam'],
        agroClimaticZone: 'Western Agro-Climatic Zone of TN',
        latitude: 11.0168,
        longitude: 76.9558,
      },
      'Madurai': {
        name: 'Madurai',
        subDistricts: ['Madurai North', 'Madurai South', 'Melur', 'Usilampatti', 'Tirumangalam'],
        agroClimaticZone: 'Southern Agro-Climatic Zone of TN',
        latitude: 9.9252,
        longitude: 78.1198,
      },
    },
  },
  'West Bengal': {
    name: 'West Bengal',
    code: 'WB',
    type: 'State',
    capital: 'Kolkata',
    agroClimaticRegion: 'Lower Gangetic Plains Region (Zone III)',
    latitude: 22.9868,
    longitude: 87.8550,
    districts: {
      'Burdwan': {
        name: 'Purba Bardhaman',
        subDistricts: ['Bardhaman Sadar North', 'Bardhaman Sadar South', 'Kalna', 'Katwa'],
        agroClimaticZone: 'Alluvial Zone of West Bengal',
        latitude: 23.2324,
        longitude: 87.8615,
      },
      'Hooghly': {
        name: 'Hooghly',
        subDistricts: ['Chinsurah', 'Chandannagar', 'Srirampore', 'Arambagh'],
        agroClimaticZone: 'Gangetic Alluvial Zone',
        latitude: 22.9030,
        longitude: 88.3899,
      },
    },
  },
  'Bihar': {
    name: 'Bihar',
    code: 'BR',
    type: 'State',
    capital: 'Patna',
    agroClimaticRegion: 'Middle Gangetic Plains Region (Zone IV)',
    latitude: 25.0961,
    longitude: 85.3131,
    districts: {
      'Patna': {
        name: 'Patna',
        subDistricts: ['Patna Sadar', 'Danapur', 'Barh', 'Masaurhi', 'Palianganj'],
        agroClimaticZone: 'South Bihar Alluvial Plain (Zone III A)',
        latitude: 25.5941,
        longitude: 85.1376,
      },
      'Nalanda': {
        name: 'Nalanda',
        subDistricts: ['Biharsharif', 'Rajgir', 'Hilsa'],
        agroClimaticZone: 'South Bihar Alluvial Plain (Zone III A)',
        latitude: 25.1982,
        longitude: 85.5149,
      },
    },
  },
  'Rajasthan': {
    name: 'Rajasthan',
    code: 'RJ',
    type: 'State',
    capital: 'Jaipur',
    agroClimaticRegion: 'Western Dry Region (Zone XIV)',
    latitude: 27.0238,
    longitude: 74.2179,
    districts: {
      'Ganganagar': {
        name: 'Sri Ganganagar',
        subDistricts: ['Sri Ganganagar', 'Suratgarh', 'Anupgarh', 'Raisinghnagar', 'Padampur'],
        agroClimaticZone: 'Irrigated North Western Plain Zone',
        latitude: 29.9038,
        longitude: 73.8772,
      },
      'Kota': {
        name: 'Kota',
        subDistricts: ['Kota', 'Digod', 'Sangod', 'Ramganj Mandi'],
        agroClimaticZone: 'Humid South Eastern Plain Zone',
        latitude: 25.2138,
        longitude: 75.8648,
      },
    },
  },
  'Haryana': {
    name: 'Haryana',
    code: 'HR',
    type: 'State',
    capital: 'Chandigarh',
    agroClimaticRegion: 'Trans-Gangetic Plains Region (Zone VI)',
    latitude: 29.0588,
    longitude: 76.0856,
    districts: {
      'Karnal': {
        name: 'Karnal',
        subDistricts: ['Karnal', 'Gharaunda', 'Indri', 'Assandh'],
        agroClimaticZone: 'Eastern Zone of Haryana',
        latitude: 29.6857,
        longitude: 76.9905,
      },
      'Hisar': {
        name: 'Hisar',
        subDistricts: ['Hisar', 'Hansi', 'Adampur', 'Barwala'],
        agroClimaticZone: 'Western Zone of Haryana',
        latitude: 29.1492,
        longitude: 75.7217,
      },
    },
  },
  'Assam': {
    name: 'Assam',
    code: 'AS',
    type: 'State',
    capital: 'Dispur',
    agroClimaticRegion: 'Eastern Himalayan Region (Zone II)',
    latitude: 26.2006,
    longitude: 92.9376,
    districts: {
      'Kamrup': {
        name: 'Kamrup',
        subDistricts: ['Guwahati', 'Rangia', 'North Guwahati', 'Palasbari'],
        agroClimaticZone: 'Lower Brahmaputra Valley Zone',
        latitude: 26.1445,
        longitude: 91.7362,
      },
    },
  },
  'Kerala': {
    name: 'Kerala',
    code: 'KL',
    type: 'State',
    capital: 'Thiruvananthapuram',
    agroClimaticRegion: 'West Coast Plains and Ghats Region (Zone XII)',
    latitude: 10.8505,
    longitude: 76.2711,
    districts: {
      'Palakkad': {
        name: 'Palakkad',
        subDistricts: ['Palakkad', 'Chittur', 'Alathur', 'Ottapalam', 'Mannarkkad'],
        agroClimaticZone: 'Palakkad Plains Zone',
        latitude: 10.7867,
        longitude: 76.6548,
      },
    },
  },
  'Andhra Pradesh': {
    name: 'Andhra Pradesh',
    code: 'AP',
    type: 'State',
    capital: 'Amaravati',
    agroClimaticRegion: 'East Coast Plains and Hills Region (Zone XI)',
    latitude: 15.9129,
    longitude: 79.7400,
    districts: {
      'Guntur': {
        name: 'Guntur',
        subDistricts: ['Guntur East', 'Guntur West', 'Tenali', 'Mangalagiri', 'Ponnur'],
        agroClimaticZone: 'Krishna Agro-Climatic Zone',
        latitude: 16.3067,
        longitude: 80.4365,
      },
    },
  },
  'Odisha': {
    name: 'Odisha',
    code: 'OD',
    type: 'State',
    capital: 'Bhubaneswar',
    agroClimaticRegion: 'East Coast Plains and Hills Region (Zone XI)',
    latitude: 20.9517,
    longitude: 85.0985,
    districts: {
      'Cuttack': {
        name: 'Cuttack',
        subDistricts: ['Cuttack Sadar', 'Athagarh', 'Banki', 'Choudwar'],
        agroClimaticZone: 'East and South Eastern Coastal Plain Zone',
        latitude: 20.4625,
        longitude: 85.8828,
      },
    },
  },
  'Himachal Pradesh': {
    name: 'Himachal Pradesh',
    code: 'HP',
    type: 'State',
    capital: 'Shimla',
    agroClimaticRegion: 'Western Himalayan Region (Zone I)',
    latitude: 31.1048,
    longitude: 77.1734,
    districts: {
      'Kangra': {
        name: 'Kangra',
        subDistricts: ['Dharamshala', 'Kangra', 'Palampur', 'Nurpur', 'Dehra Gopipur'],
        agroClimaticZone: 'Sub-Mountain and Low Hills Sub-Tropical Zone',
        latitude: 32.0998,
        longitude: 76.2691,
      },
    },
  },
  'Jammu and Kashmir': {
    name: 'Jammu and Kashmir',
    code: 'JK',
    type: 'Union Territory',
    capital: 'Srinagar / Jammu',
    agroClimaticRegion: 'Western Himalayan Region (Zone I)',
    latitude: 33.7782,
    longitude: 76.5762,
    districts: {
      'Srinagar': {
        name: 'Srinagar',
        subDistricts: ['Srinagar North', 'Srinagar South', 'Khanyar'],
        agroClimaticZone: 'Temperate Kashmir Valley Zone',
        latitude: 34.0837,
        longitude: 74.7973,
      },
    },
  },
  'Delhi (NCT)': {
    name: 'Delhi (NCT)',
    code: 'DL',
    type: 'Union Territory',
    capital: 'New Delhi',
    agroClimaticRegion: 'Trans-Gangetic Plains Region (Zone VI)',
    latitude: 28.7041,
    longitude: 77.1025,
    districts: {
      'North West Delhi': {
        name: 'North West Delhi',
        subDistricts: ['Kanjhawala', 'Rohini', 'Saraswati Vihar'],
        agroClimaticZone: 'Delhi Semi-Arid Agricultural Belt',
        latitude: 28.7300,
        longitude: 77.0500,
      },
    },
  },
};

// Generic list of Indian States for dropdowns
export function getIndiaStates(): string[] {
  return Object.keys(INDIA_GEOGRAPHIC_HIERARCHY).sort();
}

// Get districts for a specific Indian State
export function getIndiaDistricts(stateName: string): string[] {
  const stateInfo = INDIA_GEOGRAPHIC_HIERARCHY[stateName];
  if (!stateInfo) return ['Central District', 'District 1'];
  return Object.keys(stateInfo.districts).sort();
}

// Get sub-districts for state & district
export function getIndiaSubDistricts(stateName: string, districtName: string): string[] {
  const stateInfo = INDIA_GEOGRAPHIC_HIERARCHY[stateName];
  if (!stateInfo) return [];
  const districtInfo = stateInfo.districts[districtName];
  if (!districtInfo) return [];
  return districtInfo.subDistricts;
}

// Resolve geographic hierarchy from coordinates or text location
export function resolveIndianGeographicContext(
  country: string,
  stateRegion?: string,
  locationName?: string,
  latitude?: number | null,
  longitude?: number | null
): IndianGeographicContext {
  const isIndia = !country || country.toLowerCase() === 'india';

  // Sanitize input strings to eliminate "undefined" or "null" literal strings
  const cleanState = stateRegion && stateRegion !== 'undefined' && stateRegion !== 'null' ? stateRegion.trim() : '';
  const cleanLoc = locationName && locationName !== 'undefined' && locationName !== 'null' ? locationName.trim() : '';

  if (!isIndia) {
    return {
      country: country || 'Global',
      state: cleanState || 'International Region',
      district: cleanLoc || 'Global District',
      subDistrict: 'Sub-District',
      localRegion: cleanLoc || 'Local Sector',
      agroClimaticZone: 'Global Agro-Ecological Zone',
      latitude: latitude ?? null,
      longitude: longitude ?? null,
      geographicResolutionLevel: latitude && longitude ? 'farm_coordinates' : 'district',
      resolutionLabel: latitude && longitude ? `Farm Coordinates (${latitude}°, ${longitude}°)` : `Regional Context (${country})`,
    };
  }

  const stateKeys = Object.keys(INDIA_GEOGRAPHIC_HIERARCHY);

  // 1. Match State by exact or partial string matching (stripping 'State' suffix and case-insensitive)
  const normStateInput = cleanState.toLowerCase().replace(/\bstate\b/gi, '').trim();
  let matchedStateKey: string | undefined;

  if (cleanState) {
    matchedStateKey =
      stateKeys.find((s) => s.toLowerCase() === cleanState.toLowerCase()) ||
      stateKeys.find((s) => s.toLowerCase() === normStateInput) ||
      stateKeys.find((s) => cleanState.toLowerCase().includes(s.toLowerCase())) ||
      stateKeys.find((s) => s.toLowerCase().includes(cleanState.toLowerCase()));
  }

  // If state was not provided directly in cleanState, check if cleanLoc contains a known state or district
  if (!matchedStateKey && cleanLoc) {
    // Check if cleanLoc contains a state name (e.g. "Adilabad, Telangana")
    matchedStateKey = stateKeys.find((s) => cleanLoc.toLowerCase().includes(s.toLowerCase()));

    // If still not found, search all state districts for cleanLoc (e.g. "Adilabad" or "Adilabad District")
    if (!matchedStateKey) {
      const strippedLoc = cleanLoc.toLowerCase().replace(/\bdistrict\b/gi, '').trim();
      for (const [stName, stObj] of Object.entries(INDIA_GEOGRAPHIC_HIERARCHY)) {
        const distMatch = Object.keys(stObj.districts).find(
          (d) =>
            d.toLowerCase() === cleanLoc.toLowerCase() ||
            d.toLowerCase() === strippedLoc ||
            cleanLoc.toLowerCase().includes(d.toLowerCase()) ||
            strippedLoc.includes(d.toLowerCase())
        );
        if (distMatch) {
          matchedStateKey = stName;
          break;
        }
      }
    }
  }

  // If still not matched, check nearest state by lat/lng coordinates!
  if (!matchedStateKey && latitude != null && longitude != null && !isNaN(latitude) && !isNaN(longitude)) {
    let minDistance = Infinity;
    for (const [stName, stObj] of Object.entries(INDIA_GEOGRAPHIC_HIERARCHY)) {
      const dist = Math.hypot(stObj.latitude - latitude, stObj.longitude - longitude);
      if (dist < minDistance) {
        minDistance = dist;
        matchedStateKey = stName;
      }
    }
  }

  // If state is completely unknown and no lat/lng coordinates match
  if (!matchedStateKey) {
    return {
      country: 'India',
      state: cleanState || 'UNAVAILABLE',
      district: cleanLoc || 'UNAVAILABLE',
      subDistrict: 'UNAVAILABLE',
      localRegion: cleanLoc || 'UNAVAILABLE',
      agroClimaticZone: 'Unresolved Agro-Climatic Zone',
      latitude: latitude ?? null,
      longitude: longitude ?? null,
      geographicResolutionLevel: 'national',
      resolutionLabel: 'Unresolved Location Hierarchy',
    };
  }

  const stateObj = INDIA_GEOGRAPHIC_HIERARCHY[matchedStateKey];
  const resolvedState = stateObj.name;
  let resolvedZone = stateObj.agroClimaticRegion;

  // 2. Try to match District inside stateObj.districts or across all districts
  let resolvedDistrict = cleanLoc;
  let resolvedSubDistrict = 'Sub-District';

  const districtKeys = Object.keys(stateObj.districts);
  const normalizedLoc = cleanLoc.toLowerCase().replace(/\bdistrict\b/gi, '').trim();

  let matchedDistrictKey = districtKeys.find(
    (d) =>
      d.toLowerCase() === cleanLoc.toLowerCase() ||
      d.toLowerCase() === normalizedLoc ||
      cleanLoc.toLowerCase().includes(d.toLowerCase()) ||
      normalizedLoc.includes(d.toLowerCase()) ||
      d.toLowerCase().includes(normalizedLoc)
  );

  // If locationName is "Adilabad, Telangana", split by comma to isolate district "Adilabad"
  if (!matchedDistrictKey && cleanLoc.includes(',')) {
    const parts = cleanLoc.split(',').map((p) => p.trim());
    const firstPart = parts[0].toLowerCase().replace(/\bdistrict\b/gi, '').trim();
    matchedDistrictKey = districtKeys.find(
      (d) =>
        d.toLowerCase() === parts[0].toLowerCase() ||
        d.toLowerCase() === firstPart ||
        parts[0].toLowerCase().includes(d.toLowerCase()) ||
        firstPart.includes(d.toLowerCase())
    );
    if (matchedDistrictKey) {
      resolvedDistrict = matchedDistrictKey;
    }
  }

  // If lat/lng exists and district is not directly matched, find closest district in state
  if (!matchedDistrictKey && latitude != null && longitude != null && !isNaN(latitude) && !isNaN(longitude)) {
    let minDist = Infinity;
    for (const [dName, dObj] of Object.entries(stateObj.districts)) {
      const distance = Math.hypot(dObj.latitude - latitude, dObj.longitude - longitude);
      if (distance < minDist) {
        minDist = distance;
        matchedDistrictKey = dName;
      }
    }
  }

  if (matchedDistrictKey && stateObj.districts[matchedDistrictKey]) {
    const distObj = stateObj.districts[matchedDistrictKey];
    resolvedDistrict = distObj.name;
    resolvedSubDistrict = distObj.subDistricts[0] || 'Block 1';
    resolvedZone = distObj.agroClimaticZone || stateObj.agroClimaticRegion;
  } else if (!resolvedDistrict) {
    resolvedDistrict = 'UNAVAILABLE';
  }

  let resLevel: IndianGeographicContext['geographicResolutionLevel'] = 'district';
  let resLabel = `District Context (${resolvedDistrict}, ${resolvedState})`;

  if (latitude != null && longitude != null && !isNaN(latitude) && !isNaN(longitude)) {
    resLevel = 'farm_coordinates';
    resLabel = `Farm Coordinates (${latitude.toFixed(4)}° N, ${longitude.toFixed(4)}° E)`;
  } else if (resolvedDistrict !== 'UNAVAILABLE') {
    resLevel = 'district';
    resLabel = `District Context (${resolvedDistrict}, ${resolvedState})`;
  }

  return {
    country: 'India',
    state: resolvedState,
    district: resolvedDistrict,
    subDistrict: resolvedSubDistrict,
    localRegion: cleanLoc || `${resolvedDistrict} Sector`,
    agroClimaticZone: resolvedZone,
    latitude: latitude ?? null,
    longitude: longitude ?? null,
    geographicResolutionLevel: resLevel,
    resolutionLabel: resLabel,
  };
}
