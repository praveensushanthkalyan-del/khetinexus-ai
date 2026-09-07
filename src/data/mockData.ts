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

export const INITIAL_DIAGNOSES: DiagnosisResult[] = [
  {
    id: 'diag-001',
    isReliable: true,
    crop: 'Wheat',
    disease: 'Yellow Rust (Puccinia striiformis)',
    confidence: 'High',
    visibleSymptoms:
      'Parallel linear rows of yellow-orange pustules (uredinia) on upper leaf surfaces.',
    causes:
      'High relative humidity (>80%) combined with moderate daytime temperatures (12-18°C) and persistent dew.',
    immediateActions:
      'Isolate infected patch immediately. Apply certified Trichoderma harzianum or bio-sulfur wettable powder before spore dispersion.',
    preventionPractices:
      'Plant rust-resistant certified seed varieties, practice diverse crop rotations, and balance soil nitrogen to avoid succulent tissues.',
    disclaimer:
      'AI-assisted diagnosis based on visual pattern analysis. Confirm with laboratory plant tissue testing before extensive chemical intervention.',
    timestamp: 'Yesterday',
    isDemo: true,
    source: 'KhetiNexus Vision Intelligence',
  },
];

export const INITIAL_SOIL_REPORT: SoilReport = {
  soilType: 'Alluvial Loam',
  ph: 6.8,
  nitrogen: 'Medium',
  phosphorus: 'Optimal',
  potassium: 'Optimal',
  soilMoisture: 48,
  organicMatter: 1.85,
  summary:
    'Well-balanced soil with favorable neutral pH (6.8). Organic matter is moderately low (1.85%), suggesting significant opportunity for regenerative carbon sequestration.',
  deficiencies: [
    'Available Nitrogen is slightly sub-optimal for peak vegetative push.',
    'Surface organic carbon needs enhancement to withstand high summer evaporative loss.',
  ],
  regenerativeRecommendations: [
    'Introduce multi-species cover crops (sunn hemp, mustard, hairy vetch) during inter-season fallow.',
    'Incorporate aged farmyard manure (FYM) or vermicompost at 4-5 metric tons per hectare.',
    'Adopt minimum tillage to prevent disruption of arbuscular mycorrhizal fungal networks.',
  ],
  organicMatterSuggestions:
    'Leave 30% of post-harvest crop stubble on field as mulch. Bio-inoculate with cellulose-decomposing fungi to turn residue into fertile humus.',
  cropSpecificAdvice:
    'Wheat responds favorably to mycorrhizal colonization; minimize synthetic phosphatic fertilizer to foster symbiotic phosphorus uptake.',
  isDemo: true,
  source: 'Soil Health AI Diagnostic Core',
};

export const INITIAL_WEATHER_DATA: WeatherData = {
  temperature: '28°C',
  humidity: '56%',
  rainfall: '0 mm (last 24h)',
  wind: '11 km/h NW',
  condition: 'Partly Cloudy',
  forecast: [
    { day: 'Today', temp: '28°C / 18°C', condition: 'Partly Cloudy', rainProb: '10%' },
    { day: 'Tomorrow', temp: '29°C / 19°C', condition: 'Sunny', rainProb: '5%' },
    { day: 'Day 3', temp: '27°C / 17°C', condition: 'Scattered Showers', rainProb: '65%' },
    { day: 'Day 4', temp: '26°C / 16°C', condition: 'Overcast', rainProb: '40%' },
    { day: 'Day 5', temp: '28°C / 17°C', condition: 'Sunny', rainProb: '10%' },
  ],
  location: 'Ludhiana District, Punjab',
  country: 'India',
  isDemo: true,
  notice: 'Simulated agro-meteorological telemetry (OpenWeather API connectable)',
};

// Reusable SVG data URLs for instant interactive demo testing of Crop Doctor
export const SAMPLE_LEAF_IMAGES = [
  {
    id: 'leaf-1',
    crop: 'Wheat',
    label: 'Wheat - Rust / Spotting',
    symptoms: 'Yellow stripes and brown speckling on foliage',
    svgData: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="%232D3748"/><path d="M100,260 Q180,180 200,40 Q220,180 300,260 Q200,280 100,260 Z" fill="%2348BB78"/><path d="M198,40 L198,275" stroke="%23276749" stroke-width="4"/><circle cx="170" cy="120" r="10" fill="%23ECC94B"/><circle cx="180" cy="135" r="8" fill="%23D69E2E"/><circle cx="220" cy="160" r="12" fill="%23DD6B20"/><circle cx="210" cy="180" r="9" fill="%23C05621"/><circle cx="190" cy="210" r="14" fill="%23ECC94B"/><circle cx="160" cy="190" r="7" fill="%23DD6B20"/><text x="200" y="290" text-anchor="middle" fill="%23E2E8F0" font-family="sans-serif" font-size="12">Wheat Rust Sample (Click to Test)</text></svg>`,
  },
  {
    id: 'leaf-2',
    crop: 'Tomato',
    label: 'Tomato - Early Blight',
    symptoms: 'Concentric dark target rings on lower leaves',
    svgData: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="%231A202C"/><path d="M80,220 C100,100 200,60 320,160 C260,250 160,260 80,220 Z" fill="%2338A169"/><circle cx="180" cy="150" r="28" fill="%23744210"/><circle cx="180" cy="150" r="18" fill="%23975A16"/><circle cx="180" cy="150" r="8" fill="%23D69E2E"/><circle cx="250" cy="180" r="20" fill="%23744210"/><circle cx="250" cy="180" r="12" fill="%23D69E2E"/><text x="200" y="285" text-anchor="middle" fill="%23E2E8F0" font-family="sans-serif" font-size="12">Tomato Early Blight Sample (Click to Test)</text></svg>`,
  },
  {
    id: 'leaf-3',
    crop: 'Corn',
    label: 'Corn - Healthy Leaf',
    symptoms: 'Vibrant green, uniform texture, no spots',
    svgData: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="%23171923"/><path d="M50,250 C120,80 250,50 350,220 C240,240 140,260 50,250 Z" fill="%232F855A"/><path d="M60,245 C150,110 250,90 340,215" stroke="%2368D391" stroke-width="3" fill="none"/><text x="200" y="285" text-anchor="middle" fill="%239AE6B4" font-family="sans-serif" font-size="12">Healthy Corn Leaf (Click to Test)</text></svg>`,
  },
  {
    id: 'leaf-4',
    crop: 'Soybean',
    label: 'Soybean - Pest Chewing',
    symptoms: 'Irregular holes and margin necrosis',
    svgData: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="%231A202C"/><path d="M120,240 C100,120 220,70 300,180 C240,270 160,270 120,240 Z" fill="%2348BB78"/><circle cx="170" cy="160" r="16" fill="%231A202C"/><circle cx="230" cy="190" r="22" fill="%231A202C"/><circle cx="210" cy="130" r="12" fill="%231A202C"/><path d="M290,170 C280,180 285,195 295,200 Z" fill="%23C53030"/><text x="200" y="285" text-anchor="middle" fill="%23E2E8F0" font-family="sans-serif" font-size="12">Soybean Caterpillar Damage (Click to Test)</text></svg>`,
  },
];

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
    country: 'India',
    flag: '🇮🇳',
    institution: 'ICAR & AgriN India Knowledge Center',
    status: 'Active',
    focusArea: 'Smallholder drought resilience, millets, bio-stimulants, low-cost micro-irrigation',
    agroClimatic: 'Tropical monsoon, semi-arid Deccan, fertile Indo-Gangetic alluvium',
    contributions: [
      'Semi-arid pulses bio-resilience genetics',
      'Jeevamrut & fermented bio-fertilizer protocols',
      'Community monsoon onset early warning models',
    ],
  },
  {
    id: 'node-br',
    country: 'Brazil',
    flag: '🇧🇷',
    institution: 'Embrapa & AgriN South America Ecosystem',
    status: 'Active',
    focusArea: 'No-till tropical grain systems, biological nitrogen fixation in soybeans, integrated crop-livestock-forestry (ILPF)',
    agroClimatic: 'Tropical savanna (Cerrado), humid subtropical, Amazonian transition zones',
    contributions: [
      'Zero-tillage tropical soil organic matter models',
      'Bradyrhizobium biological fixation benchmarks',
      'Canopy NDVI biomass satellite calibrations',
    ],
  },
  {
    id: 'node-ru',
    country: 'Russia',
    flag: '🇷🇺',
    institution: 'Russian Academy of Sciences & AgriN Eurasia',
    status: 'Active',
    focusArea: 'High-latitude organic wheat & barley cultivation, cold-hardy cover cropping, Chernozem carbon preservation',
    agroClimatic: 'Humid continental, sub-boreal, fertile black soil steppe',
    contributions: [
      'Chernozem deep carbon sequestration baselines',
      'Frost-tolerant winter cereal cultivars',
      'Low-temperature mycorrhizal fungal strains',
    ],
  },
  {
    id: 'node-cn',
    country: 'China',
    flag: '🇨🇳',
    institution: 'Chinese Academy of Agricultural Sciences (CAAS)',
    status: 'Active',
    focusArea: 'Precision paddy agro-ecology, terraced water stewardship, digital soil sensor networks',
    agroClimatic: 'Temperate to subtropical monsoon, diverse microclimates',
    contributions: [
      'Alternate Wetting & Drying (AWD) paddy methane reduction data',
      'IoT soil moisture telemetry protocols',
      'Precision bio-control drone application algorithms',
    ],
  },
  {
    id: 'node-za',
    country: 'South Africa',
    flag: '🇿🇦',
    institution: 'Agricultural Research Council (ARC)',
    status: 'Active',
    focusArea: 'Arid & semi-arid conservation agriculture, drought-tolerant indigenous grains (sorghum/millet)',
    agroClimatic: 'Mediterranean southwest, semi-arid central plateau',
    contributions: [
      'Sorghum drought response genetic markers',
      'Holistic regenerative grazing soil carbon metrics',
      'Solar-powered low-pressure drip irrigation frameworks',
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

