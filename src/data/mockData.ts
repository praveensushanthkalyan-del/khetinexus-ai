import { FarmProfile, AdvisoryResult, DiagnosisResult, SoilReport, WeatherData } from '../types';

export const BRICS_FARM_PRESETS: FarmProfile[] = [
  {
    id: 'farm-india-01',
    name: 'Gurpreet Singh',
    country: 'India',
    stateRegion: 'Punjab',
    location: 'Ludhiana District',
    farmSize: 2.5,
    farmUnit: 'hectares',
    crop: 'Wheat',
    growthStage: 'Vegetative',
    soilType: 'Alluvial Loam',
    irrigationType: 'Borewell / Tube well',
  },
  {
    id: 'farm-brazil-02',
    name: 'Mateo Silva',
    country: 'Brazil',
    stateRegion: 'Mato Grosso',
    location: 'Sorriso Municipality',
    farmSize: 12.0,
    farmUnit: 'hectares',
    crop: 'Soybean',
    growthStage: 'Flowering',
    soilType: 'Cerrado Oxisol (Red Clay)',
    irrigationType: 'Rainfed',
  },
  {
    id: 'farm-russia-03',
    name: 'Alexei Ivanov',
    country: 'Russia',
    stateRegion: 'Krasnodar Krai',
    location: 'Kuban Basin',
    farmSize: 8.0,
    farmUnit: 'hectares',
    crop: 'Barley',
    growthStage: 'Grain filling',
    soilType: 'Chernozem (Black Soil)',
    irrigationType: 'Sprinkler',
  },
  {
    id: 'farm-china-04',
    name: 'Zhang Wei',
    country: 'China',
    stateRegion: 'Heilongjiang',
    location: 'Songhua River Basin',
    farmSize: 4.5,
    farmUnit: 'hectares',
    crop: 'Rice',
    growthStage: 'Vegetative',
    soilType: 'Mollisol (Black Earth)',
    irrigationType: 'Canal',
  },
  {
    id: 'farm-sa-05',
    name: 'Thabo Ndlovu',
    country: 'South Africa',
    stateRegion: 'Free State',
    location: 'Bloemfontein Plains',
    farmSize: 6.0,
    farmUnit: 'hectares',
    crop: 'Maize (Corn)',
    growthStage: 'Flowering',
    soilType: 'Sandy Loam',
    irrigationType: 'Drip Irrigation',
  },
];

export const INITIAL_ADVISORY: AdvisoryResult = {
  id: 'adv-001',
  summary:
    'Optimal conditions for vegetative development. Slight evaporative stress expected by afternoon; recommended surface mulching and micro-nutrient foliar spray.',
  todayAction:
    'Scout field rows for early powdery mildew or yellow rust spots. Apply 200L/ha fermented compost extract (Jeevamrut/bio-tea) in late afternoon.',
  waterManagement:
    'Deliver 18mm equivalent via drip/furrow in early morning (05:30 - 08:30). Avoid pooling near stems to prevent fungal rot.',
  soilHealth:
    'Maintain protective crop residue cover. Earthworm casting count is increasing in undisturbed quadrants.',
  cropProtection:
    'Place 5 pheromone/sticky traps per hectare for stem borer and aphid monitoring. Avoid prophylactic chemical sprays.',
  regenerativePractice:
    'Intercrop with quick-growing cowpea or clover to fix atmospheric nitrogen and provide living root exudates.',
  next7Days:
    'Day 1: Micro-irrigation check. Day 3: Foliar bio-stimulant. Day 5: Weed suppression via hand hoeing. Day 7: Pre-flowering canopy inspection.',
  disclaimer:
    'AI-generated agricultural advisory based on simulated agro-climatic datasets. Verify with district Krishi Vigyan Kendra (KVK) or local extension agronomist before high-investment input deployment.',
  timestamp: new Date().toLocaleDateString(),
  isDemo: true,
  source: 'KhetiNexus Intelligent Agronomy Core (Gemini 3.8 ready)',
};

export const INITIAL_DIAGNOSES: DiagnosisResult[] = [];

// 8 Core Regenerative Agriculture Practices
export const REGENERATIVE_PRACTICES = [
  {
    id: 'crop-rotation',
    title: 'Crop Rotation & Diversification',
    iconName: 'RotateCw',
    tag: 'Soil Vitality',
    description:
      'Alternating deep-rooted tap crops with shallow fibrous rooters and legumes disrupts pest and disease life cycles, restores nutrient strata, and breaks weed monocultures.',
    benefits: ['Breaks weed and pest cycles', 'Natural nitrogen balance', 'Improves soil structure'],
    implementation:
      'Design a 3-4 season rotation alternating cereals (wheat/maize) with pulses (chickpeas/lentils) and brassicas.',
  },
  {
    id: 'cover-crops',
    title: 'Multi-Species Cover Crops',
    iconName: 'Layers',
    tag: 'Erosion & Biology',
    description:
      'Keeping living roots in the soil 365 days a year feeds the soil food web with liquid carbon exudates while physically shielding topsoil from torrential rain and wind erosion.',
    benefits: ['Suppresses 80%+ weeds', 'Prevents erosion', 'Increases active mycorrhizae'],
    implementation:
      'Sow multi-species mixes (e.g., cowpea, millet, radish) during fallow periods between main cash crops.',
  },
  {
    id: 'compost-organic',
    title: 'Compost & Bio-Inoculants',
    iconName: 'Sprout',
    tag: 'Microbial Life',
    description:
      'Replacing high-salinity synthetic fertilizers with microbially active vermicompost, biochar, and aerated compost tea inoculates billions of beneficial bacteria and fungi.',
    benefits: ['Buffers soil pH', 'Increases water infiltration', 'Slow-release organic fertility'],
    implementation:
      'Apply 2-3 tons of cured compost per hectare before sowing, supplemented with foliar fermented bio-stimulants.',
  },
  {
    id: 'reduced-tillage',
    title: 'Reduced / Zero Tillage',
    iconName: 'ShieldAlert',
    tag: 'Carbon Sequestration',
    description:
      'Mechanical tilling oxidizes organic carbon into atmospheric CO2 and tears fragile fungal hyphae. Low/zero-till preserves soil architecture, macro-pores, and worm tunnels.',
    benefits: ['Saves fuel and labor', 'Retains soil moisture', 'Locks carbon in the ground'],
    implementation:
      'Transition to strip-till or direct seed drilling through rolling-crimped cover crop residues.',
  },
  {
    id: 'water-conservation',
    title: 'Precision Water Conservation',
    iconName: 'Droplets',
    tag: 'Climate Resilience',
    description:
      'Adopting subsurface drip, sensor-guided scheduling, swales, and rainwater harvesting bunds prevents salinization and slashes irrigation water consumption by up to 50%.',
    benefits: ['Conserves groundwater', 'Prevents root asphyxiation', 'Mitigates drought shock'],
    implementation:
      'Install gravity-fed or low-pressure drip lines coupled with simple tensiometer soil moisture probes.',
  },
  {
    id: 'soil-moisture',
    title: 'Living Mulch & Moisture Mantle',
    iconName: 'Sun',
    tag: 'Evaporation Shield',
    description:
      'Covering bare ground with 7-10 cm of crop residue or living groundcover cuts soil surface temperatures by 10-15°C and cuts evaporation by up to 40%.',
    benefits: ['Protects soil microbiome from heat', 'Conserves moisture', 'Creates worm habitat'],
    implementation:
      'Never burn crop stubble; spread chopped straw, leaves, or bagasse evenly over inter-row beds.',
  },
  {
    id: 'biodiversity',
    title: 'Agro-Biodiversity & Hedgerows',
    iconName: 'Bug',
    tag: 'Ecosystem Balance',
    description:
      'Planting flowering perimeter hedgerows, pollinator strips, and agroforestry shelterbelts creates permanent refuges for predatory wasps, ladybugs, birds, and pollinators.',
    benefits: ['Natural pest predation', 'Windbreak protection', 'Supplemental honey & timber'],
    implementation:
      'Dedicate 5-8% of farm boundary zones to native flowering shrubs, marigolds, and nitrogen-fixing trees.',
  },
  {
    id: 'ipm',
    title: 'Integrated Ecological Pest Management',
    iconName: 'ShieldCheck',
    tag: 'Non-Chemical Control',
    description:
      'Using biological control agents (Trichoderma, Bacillus thuringiensis, neem oil), pheromone disruption, and trap cropping instead of toxic synthetic organophosphates.',
    benefits: ['Zero toxic runoff', 'Preserves honeybees', 'Prevents chemical resistance'],
    implementation:
      'Install trap crops (e.g. castor/marigold on borders) and release beneficial parasitoid cards at early pest sighting.',
  },
];

// BRICS AgriN Network Conceptual Nodes
export const AGRIN_NODES = [
  {
    id: 'node-in',
    countryCode: 'IN',
    country: 'India',
    flag: '🇮🇳',
    institution: 'ICAR & AgriN India Node',
    status: 'Connected',
    statusType: 'connected',
    focusArea: 'Smallholder drought resilience, millets, bio-stimulants, low-cost micro-irrigation',
    agroClimatic: 'Tropical monsoon, semi-arid Deccan, fertile Indo-Gangetic alluvium',
    provider: 'ICAR / Bhuvan / IMD',
    dataFreshness: 'LIVE',
    contributions: [
      'Semi-arid pulses bio-resilience genetics',
      'Jeevamrut & fermented bio-fertilizer protocols',
      'Community monsoon onset early warning models',
    ],
  },
  {
    id: 'node-br',
    countryCode: 'BR',
    country: 'Brazil',
    flag: '🇧🇷',
    institution: 'Embrapa & AgriN South America Node',
    status: 'Connected',
    statusType: 'connected',
    focusArea: 'No-till tropical grain systems, biological nitrogen fixation in soybeans, ILPF',
    agroClimatic: 'Tropical savanna (Cerrado), humid subtropical, Amazonian transition zones',
    provider: 'Embrapa / INMET',
    dataFreshness: 'LIVE',
    contributions: [
      'Zero-tillage tropical soil organic matter models',
      'Bradyrhizobium biological fixation benchmarks',
      'Canopy NDVI biomass satellite calibrations',
    ],
  },
  {
    id: 'node-ru',
    countryCode: 'RU',
    country: 'Russia',
    flag: '🇷🇺',
    institution: 'Russian Academy of Sciences & AgriN Eurasia Node',
    status: 'Connected',
    statusType: 'connected',
    focusArea: 'High-latitude organic wheat & barley cultivation, Chernozem carbon preservation',
    agroClimatic: 'Humid continental, sub-boreal, fertile black soil steppe',
    provider: 'RAS / Roshydromet',
    dataFreshness: 'LIVE',
    contributions: [
      'Chernozem deep carbon sequestration baselines',
      'Frost-tolerant winter cereal cultivars',
      'Low-temperature mycorrhizal fungal strains',
    ],
  },
  {
    id: 'node-cn',
    countryCode: 'CN',
    country: 'China',
    flag: '🇨🇳',
    institution: 'Chinese Academy of Agricultural Sciences (CAAS)',
    status: 'Connected',
    statusType: 'connected',
    focusArea: 'Precision paddy agro-ecology, terraced water stewardship, digital soil sensors',
    agroClimatic: 'Temperate to subtropical monsoon, diverse microclimates',
    provider: 'CAAS / CMA',
    dataFreshness: 'LIVE',
    contributions: [
      'Alternate Wetting & Drying (AWD) paddy methane reduction data',
      'IoT soil moisture telemetry protocols',
      'Precision bio-control drone application algorithms',
    ],
  },
  {
    id: 'node-za',
    countryCode: 'ZA',
    country: 'South Africa',
    flag: '🇿🇦',
    institution: 'Agricultural Research Council (ARC)',
    status: 'Connected',
    statusType: 'connected',
    focusArea: 'Arid & semi-arid conservation agriculture, drought-tolerant grains (sorghum/millet)',
    agroClimatic: 'Mediterranean southwest, semi-arid central plateau',
    provider: 'ARC / SAWS',
    dataFreshness: 'LIVE',
    contributions: [
      'Sorghum drought response genetic markers',
      'Holistic regenerative grazing soil carbon metrics',
      'Solar-powered low-pressure drip irrigation frameworks',
    ],
  },
  {
    id: 'node-sa',
    countryCode: 'SA',
    country: 'Saudi Arabia',
    flag: '🇸🇦',
    institution: 'Ministry of Environment, Water and Agriculture (MEWA)',
    status: 'Connected',
    statusType: 'connected',
    focusArea: 'Hyper-arid climate farming, desert soil rejuvenation, saline water precision drip',
    agroClimatic: 'Hyper-arid desert, oasis microclimates',
    provider: 'MEWA / KACST',
    dataFreshness: 'LIVE',
    contributions: [
      'Desert sand soil biochar amendment protocols',
      'Salinity-tolerant date palm & forage cultivation',
      'Solar desalination irrigation benchmarks',
    ],
  },
  {
    id: 'node-eg',
    countryCode: 'EG',
    country: 'Egypt',
    flag: '🇪🇬',
    institution: 'Agricultural Research Center (ARC Egypt)',
    status: 'Configured',
    statusType: 'configured',
    focusArea: 'Nile delta water efficiency, cotton & wheat yield optimization under heat',
    agroClimatic: 'Arid Mediterranean coast, Nile delta fertile valley',
    provider: 'ARC Egypt / EMA',
    dataFreshness: 'NEAR_REAL_TIME',
    contributions: [
      'Nile basin canal water distribution management',
      'Heat-tolerant long-staple cotton agronomy',
      'Saline soil leaching and reclamation practices',
    ],
  },
  {
    id: 'node-et',
    countryCode: 'ET',
    country: 'Ethiopia',
    flag: '🇪🇹',
    institution: 'Ethiopian Institute of Agricultural Research (EIAR)',
    status: 'Configured',
    statusType: 'configured',
    focusArea: 'Highland agro-forestry, Tef drought escape cultivars, soil erosion terrace control',
    agroClimatic: 'Sub-tropical highland, Rift Valley semi-arid',
    provider: 'EIAR / NMA Ethiopia',
    dataFreshness: 'NEAR_REAL_TIME',
    contributions: [
      'Indigenous Tef grain drought escape breeding',
      'Highland vertisol drainage and erosion control',
      'Shade-grown coffee agro-forestry biodiversity',
    ],
  },
  {
    id: 'node-id',
    countryCode: 'ID',
    country: 'Indonesia',
    flag: '🇮🇩',
    institution: 'National Research and Innovation Agency (BRIN)',
    status: 'Configured',
    statusType: 'configured',
    focusArea: 'Tropical rainforest agro-forestry, peatland fire prevention & soil water tables',
    agroClimatic: 'Equatorial tropical rainforest, humid volcanic islands',
    provider: 'BRIN / BMKG',
    dataFreshness: 'NEAR_REAL_TIME',
    contributions: [
      'Peatland water table management and carbon preservation',
      'Volcanic soil nutrient cycling and organic matter',
      'Intercropped palm oil agro-biodiversity guidelines',
    ],
  },
  {
    id: 'node-ir',
    countryCode: 'IR',
    country: 'Iran',
    flag: '🇮🇷',
    institution: 'Agricultural Research, Education and Extension Organization (AREEO)',
    status: 'Configured',
    statusType: 'configured',
    focusArea: 'Qanat groundwater management, dryland wheat, saffron & pistachio climate resilience',
    agroClimatic: 'Arid to semi-arid plateau, Caspian humid coastal strip',
    provider: 'AREEO / IRIMO',
    dataFreshness: 'NEAR_REAL_TIME',
    contributions: [
      'Traditional sub-surface Qanat water harvesting optimization',
      'Cold dryland wheat drought escape cultivars',
      'Saline soil pistachio rootstock selection',
    ],
  },
  {
    id: 'node-ae',
    countryCode: 'AE',
    country: 'United Arab Emirates',
    flag: '🇦🇪',
    institution: 'Abu Dhabi Agriculture and Food Safety Authority (ADAFSA)',
    status: 'Configured',
    statusType: 'configured',
    focusArea: 'Protected greenhouse hydroponics, vertical desert farming, brackish water recycling',
    agroClimatic: 'Hyper-arid desert coastal, controlled environment agriculture',
    provider: 'ADAFSA / NCM',
    dataFreshness: 'NEAR_REAL_TIME',
    contributions: [
      'Closed-loop hydroponic water recycling efficiency',
      'Controlled environment agriculture thermal cooling',
      'Halophyte forage crop cultivation in saline soils',
    ],
  },
];

export const SHARED_KNOWLEDGE_MODULES = [
  {
    id: 'mod-1',
    title: 'Climate-Resilient Crop Practices',
    leadCountry: 'India & South Africa',
    description:
      'Standardized agro-ecological protocols for drought escape, millet intercropping, and thermal canopy cooling without chemical retardants.',
    beneficiaryImpact: '4.2M smallholder hectares',
    recordsCount: '1,420 Verified Field Studies',
  },
  {
    id: 'mod-2',
    title: 'Bio-Fertilizer & Inoculant Formulations',
    leadCountry: 'Brazil & India',
    description:
      'Open-source biological nitrogen fixation recipes, mycorrhizal spore multiplication, and compost tea aeration benchmarks.',
    beneficiaryImpact: '35% reduction in synthetic NPK',
    recordsCount: '890 Bio-Formulations',
  },
  {
    id: 'mod-3',
    title: 'Integrated Ecological Pest Management (IPM)',
    leadCountry: 'China & Brazil',
    description:
      'Cross-border pest migration tracking (e.g. Fall Armyworm), parasitoid wasp release timings, and neem-based antifeedant data.',
    beneficiaryImpact: '92% reduction in synthetic spray drift',
    recordsCount: '2,650 Pest Pathology Profiles',
  },
  {
    id: 'mod-4',
    title: 'Living Soil Restoration & Carbon Measurement',
    leadCountry: 'Russia & South Africa',
    description:
      'Standardized soil organic carbon (SOC) estimation protocols, cover crop termination guidelines, and humus protection standards.',
    beneficiaryImpact: '+0.8% organic matter over 3 seasons',
    recordsCount: '3,100 Soil Profile Benchmarks',
  },
];

export const INITIAL_WEATHER_DATA: WeatherData = {
  location: 'Ludhiana District',
  country: 'India',
  temperature: '28°C',
  tempValue: 28,
  humidity: '62%',
  rainfall: '12 mm',
  wind: '14 km/h NW',
  condition: 'Partly Cloudy',
  notice: 'Live agricultural weather telemetric data',
  isDemo: true,
  forecast: [
    { day: 'Today', temp: '28°C', condition: 'Partly Cloudy', rainProb: '15%' },
    { day: 'Tomorrow', temp: '29°C', condition: 'Sunny', rainProb: '5%' },
    { day: 'Day 3', temp: '27°C', condition: 'Moderate Rain', rainProb: '65%' },
    { day: 'Day 4', temp: '26°C', condition: 'Light Shower', rainProb: '40%' },
    { day: 'Day 5', temp: '28°C', condition: 'Clear Sky', rainProb: '10%' },
  ],
};

