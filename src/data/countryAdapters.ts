// src/data/countryAdapters.ts
// BRICS 11-Member Country Adapter Architecture for KhetiNexus AI

import { SupportedCountry } from '../types';

export interface CountryAdapterConfig {
  countryCode: string;
  countryName: SupportedCountry;
  flag: string;
  defaultLanguage: string;
  supportedLanguages: Array<{ code: string; name: string; nativeName: string; shortCode: string }>;
  currency: { code: string; symbol: string; name: string };
  units: {
    areaUnit: 'hectares' | 'acres';
    tempUnit: string;
    rainfallUnit: string;
    windUnit: string;
  };
  regions: Array<{
    name: string;
    districts: string[];
    agroZone: string;
  }>;
  cropCatalog: string[];
  soilTypes: string[];
  irrigationTypes: string[];
  weatherProvider: {
    name: string;
    description: string;
  };
  satelliteProvider: {
    providerName: string;
    agency: string;
    layers: string[];
    provenance: string;
    notice: string;
  };
  agriculturalReferences: string[];
}

export const BRICS_COUNTRIES_LIST: Array<{
  name: SupportedCountry;
  code: string;
  flag: string;
  nativeName: string;
  region: string;
}> = [
  { name: 'Brazil', code: 'BR', flag: '🇧🇷', nativeName: 'Brasil', region: 'South America' },
  { name: 'Russia', code: 'RU', flag: '🇷🇺', nativeName: 'Россия', region: 'Eurasia' },
  { name: 'India', code: 'IN', flag: '🇮🇳', nativeName: 'भारत', region: 'South Asia' },
  { name: 'China', code: 'CN', flag: '🇨🇳', nativeName: '中国', region: 'East Asia' },
  { name: 'South Africa', code: 'ZA', flag: '🇿🇦', nativeName: 'South Africa', region: 'Southern Africa' },
  { name: 'Egypt', code: 'EG', flag: '🇪🇬', nativeName: 'مصر', region: 'North Africa / Middle East' },
  { name: 'Ethiopia', code: 'ET', flag: '🇪🇹', nativeName: 'ኢትዮጵያ', region: 'East Africa' },
  { name: 'Indonesia', code: 'ID', flag: '🇮🇩', nativeName: 'Indonesia', region: 'Southeast Asia' },
  { name: 'Iran', code: 'IR', flag: '🇮🇷', nativeName: 'ایران', region: 'Middle East' },
  { name: 'Saudi Arabia', code: 'SA', flag: '🇸🇦', nativeName: 'العربية السعودية', region: 'Middle East' },
  { name: 'United Arab Emirates', code: 'AE', flag: '🇦🇪', nativeName: 'الإمارات العربية المتحدة', region: 'Middle East' },
];

export const CountryAdapters: Record<SupportedCountry, CountryAdapterConfig> = {
  India: {
    countryCode: 'IN',
    countryName: 'India',
    flag: '🇮🇳',
    defaultLanguage: 'en-IN',
    supportedLanguages: [
      { code: 'en-IN', name: 'English', nativeName: 'English', shortCode: 'EN' },
      { code: 'hi-IN', name: 'Hindi', nativeName: 'हिन्दी', shortCode: 'HI' },
      { code: 'te-IN', name: 'Telugu', nativeName: 'తెలుగు', shortCode: 'TE' },
      { code: 'ta-IN', name: 'Tamil', nativeName: 'தமிழ்', shortCode: 'TA' },
      { code: 'kn-IN', name: 'Kannada', nativeName: 'ಕನ್ನಡ', shortCode: 'KN' },
      { code: 'ml-IN', name: 'Malayalam', nativeName: 'മലയാളം', shortCode: 'ML' },
      { code: 'mr-IN', name: 'Marathi', nativeName: 'मराठी', shortCode: 'MR' },
      { code: 'gu-IN', name: 'Gujarati', nativeName: 'ગુજરાતી', shortCode: 'GU' },
      { code: 'bn-IN', name: 'Bengali', nativeName: 'বাংলা', shortCode: 'BN' },
      { code: 'pa-IN', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', shortCode: 'PA' },
      { code: 'or-IN', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', shortCode: 'OR' },
      { code: 'as-IN', name: 'Assamese', nativeName: 'অসমীয়া', shortCode: 'AS' },
      { code: 'ur-IN', name: 'Urdu', nativeName: 'اردو', shortCode: 'UR' },
      { code: 'brx-IN', name: 'Bodo', nativeName: 'बर\'', shortCode: 'BRX' },
      { code: 'doi-IN', name: 'Dogri', nativeName: 'डोगरी', shortCode: 'DOI' },
      { code: 'ks-IN', name: 'Kashmiri', nativeName: 'कॉशुर / كأشُر', shortCode: 'KS' },
      { code: 'kok-IN', name: 'Konkani', nativeName: 'कोंकणी', shortCode: 'KOK' },
      { code: 'mai-IN', name: 'Maithili', nativeName: 'मैथिली', shortCode: 'MAI' },
      { code: 'mni-IN', name: 'Manipuri', nativeName: 'মৈতৈলোন্', shortCode: 'MNI' },
      { code: 'ne-IN', name: 'Nepali', nativeName: 'नेपाली', shortCode: 'NE' },
      { code: 'sa-IN', name: 'Sanskrit', nativeName: 'संस्कृतम्', shortCode: 'SA' },
      { code: 'sat-IN', name: 'Santali', nativeName: 'ᱥᱟᱱᱛᱟᱲᱤ', shortCode: 'SAT' },
      { code: 'sd-IN', name: 'Sindhi', nativeName: 'सिन्धी / سنڌي', shortCode: 'SD' },
    ],
    currency: { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
    units: { areaUnit: 'acres', tempUnit: '°C', rainfallUnit: 'mm', windUnit: 'km/h' },
    regions: [
      { name: 'Telangana', districts: ['Adilabad', 'Hyderabad', 'Karimnagar', 'Nizamabad', 'Warangal'], agroZone: 'Southern Plateau Zone' },
      { name: 'Punjab', districts: ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala'], agroZone: 'Trans-Gangetic Plains' },
      { name: 'Maharashtra', districts: ['Pune', 'Nagpur', 'Nashik', 'Kolhapur'], agroZone: 'Western Plateau Zone' },
      { name: 'Uttar Pradesh', districts: ['Lucknow', 'Varanasi', 'Meerut', 'Gorakhpur'], agroZone: 'Upper Gangetic Plains' },
    ],
    cropCatalog: ['Rice', 'Wheat', 'Soybean', 'Cotton', 'Sugarcane', 'Maize', 'Mustard', 'Chickpea', 'Groundnut', 'Potato'],
    soilTypes: ['Alluvial', 'Black (Regur)', 'Red', 'Laterite', 'Desert', 'Mountain'],
    irrigationTypes: ['Canal', 'Borewell / Tube well', 'Drip Irrigation', 'Sprinkler', 'Rainfed'],
    weatherProvider: { name: 'IMD / Open-Meteo', description: 'Indian Meteorological Department telemetry and high-res grid' },
    satelliteProvider: {
      providerName: 'ISRO / NRSC / Bhuvan',
      agency: 'Indian Space Research Organisation',
      layers: ['Bhuvan LULC 250k', 'Bhuvan Agro-Climatic Atlas', 'NRSC Land Degradation Map'],
      provenance: 'ISRO / NRSC Bhuvan Satellite Archive',
      notice: 'ISRO Bhuvan Open Data Layer active',
    },
    agriculturalReferences: ['ICAR', 'IARI', 'State Agricultural Universities'],
  },
  Brazil: {
    countryCode: 'BR',
    countryName: 'Brazil',
    flag: '🇧🇷',
    defaultLanguage: 'pt-BR',
    supportedLanguages: [
      { code: 'pt-BR', name: 'Portuguese', nativeName: 'Português', shortCode: 'PT' },
      { code: 'en', name: 'English', nativeName: 'English', shortCode: 'EN' },
    ],
    currency: { code: 'BRL', symbol: 'R$', name: 'Brazilian Real' },
    units: { areaUnit: 'hectares', tempUnit: '°C', rainfallUnit: 'mm', windUnit: 'km/h' },
    regions: [
      { name: 'Mato Grosso', districts: ['Sorriso', 'Rondonópolis', 'Lucas do Rio Verde', 'Sinop'], agroZone: 'Cerrado Biome Agricultural Belt' },
      { name: 'São Paulo', districts: ['Ribeirão Preto', 'Campinas', 'Piracicaba', 'Presidente Prudente'], agroZone: 'Southeast Plateau Agribusiness' },
      { name: 'Paraná', districts: ['Londrina', 'Cascavel', 'Maringá', 'Ponta Grossa'], agroZone: 'Southern Grain Belt' },
      { name: 'Rio Grande do Sul', districts: ['Passo Fundo', 'Santa Maria', 'Pelotas', 'Cruz Alta'], agroZone: 'Pampa Agro-Ecological Region' },
    ],
    cropCatalog: ['Soybeans', 'Corn', 'Sugarcane', 'Coffee', 'Cotton', 'Oranges', 'Cassava', 'Beans'],
    soilTypes: ['Latosols (Oxisols)', 'Argisols', 'Quartzarenic Neosols', 'Gleisols'],
    irrigationTypes: ['Drip Irrigation', 'Center Pivot', 'Sprinkler', 'Rainfed'],
    weatherProvider: { name: 'INMET / Open-Meteo Brazil', description: 'Instituto Nacional de Meteorologia telemetry' },
    satelliteProvider: {
      providerName: 'INPE / MapBiomas Brazil',
      agency: 'National Institute for Space Research',
      layers: ['MapBiomas Land Cover v8', 'INPE PRODES Deforestation Alert', 'MODIS NDVI Time Series'],
      provenance: 'INPE / MapBiomas Brazil National Satellite Archive',
      notice: 'MapBiomas Brazil satellite coverage active',
    },
    agriculturalReferences: ['EMBRAPA', 'MAPA', 'ESALQ/USP'],
  },
  Russia: {
    countryCode: 'RU',
    countryName: 'Russia',
    flag: '🇷🇺',
    defaultLanguage: 'ru-RU',
    supportedLanguages: [
      { code: 'ru-RU', name: 'Russian', nativeName: 'Русский', shortCode: 'RU' },
      { code: 'en', name: 'English', nativeName: 'English', shortCode: 'EN' },
    ],
    currency: { code: 'RUB', symbol: '₽', name: 'Russian Ruble' },
    units: { areaUnit: 'hectares', tempUnit: '°C', rainfallUnit: 'mm', windUnit: 'km/h' },
    regions: [
      { name: 'Krasnodar Krai', districts: ['Krasnodar', 'Armavir', 'Yeysk', 'Timashovsk'], agroZone: 'Kuban Chernozem Agricultural Region' },
      { name: 'Rostov Oblast', districts: ['Rostov-on-Don', 'Taganrog', 'Salsk', 'Millerovo'], agroZone: 'Southern Steppe Grain Belt' },
      { name: 'Voronezh Oblast', districts: ['Voronezh', 'Borisoglebsk', 'Rossosh', 'Liskinsky'], agroZone: 'Central Chernozem Region' },
      { name: 'Altai Krai', districts: ['Barnaul', 'Biysk', 'Rubtsovsk', 'Aleysk'], agroZone: 'Siberian Grain and Wheat Belt' },
    ],
    cropCatalog: ['Wheat', 'Barley', 'Sunflower', 'Corn', 'Soybeans', 'Sugar Beet', 'Potatoes', 'Oats'],
    soilTypes: ['Chernozem (Black Earth)', 'Chestnut soils', 'Podzolic soils', 'Gray forest soils'],
    irrigationTypes: ['Sprinkler', 'Canal', 'Rainfed', 'Borewell'],
    weatherProvider: { name: 'Roshydromet / Open-Meteo', description: 'Russian Federal Service for Hydrometeorology' },
    satelliteProvider: {
      providerName: 'Roskosmos / VEGA',
      agency: 'State Space Corporation Roskosmos',
      layers: ['Roskosmos Agricultural Land Monitoring', 'VEGA Satellite Vegetation Telemetry', 'Kanopus-V High-Res Imagery'],
      provenance: 'Roskosmos / VEGA Russian Earth Observation',
      notice: 'VEGA Agricultural Remote Sensing active',
    },
    agriculturalReferences: ['Russian Academy of Sciences (RAS)', 'V.V. Dokuchaev Soil Science Institute'],
  },
  China: {
    countryCode: 'CN',
    countryName: 'China',
    flag: '🇨🇳',
    defaultLanguage: 'zh-CN',
    supportedLanguages: [
      { code: 'zh-CN', name: 'Chinese', nativeName: '简体中文', shortCode: 'ZH' },
      { code: 'en', name: 'English', nativeName: 'English', shortCode: 'EN' },
    ],
    currency: { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
    units: { areaUnit: 'hectares', tempUnit: '°C', rainfallUnit: 'mm', windUnit: 'km/h' },
    regions: [
      { name: 'Heilongjiang', districts: ['Harbin', 'Qiqihar', 'Suihua', 'Mudanjiang'], agroZone: 'Northeast Black Soil Granary' },
      { name: 'Henan', districts: ['Zhengzhou', 'Luoyang', 'Nanyang', 'Xuchang'], agroZone: 'Central Plains Wheat Belt' },
      { name: 'Shandong', districts: ['Jinan', 'Weifang', 'Linyi', 'Yantai'], agroZone: 'North China Plain Agricultural Zone' },
      { name: 'Sichuan', districts: ['Chengdu', 'Mianyang', 'Nanchong', 'Luzhou'], agroZone: 'Southwest Basin Paddy Agricultural Region' },
    ],
    cropCatalog: ['Rice', 'Wheat', 'Corn', 'Soybeans', 'Cotton', 'Rapeseed', 'Peanuts', 'Potatoes'],
    soilTypes: ['Black soils (Mollisols)', 'Red soils (Ultisols)', 'Alluvial soils', 'Paddy soils'],
    irrigationTypes: ['Canal', 'Drip Irrigation', 'Sprinkler', 'Paddy Flooding', 'Rainfed'],
    weatherProvider: { name: 'CMA / Open-Meteo', description: 'China Meteorological Administration telemetry' },
    satelliteProvider: {
      providerName: 'CASEarth / Gaofen',
      agency: 'Chinese Academy of Sciences / CNSA',
      layers: ['Gaofen High-Res Agricultural Index', 'CASEarth Global Cropland Grid', 'FY-4 Meteorological Satellite Index'],
      provenance: 'CASEarth / Gaofen China Satellite Data',
      notice: 'Gaofen Satellite Monitoring active',
    },
    agriculturalReferences: ['CAAS (Chinese Academy of Agricultural Sciences)', 'Ministry of Agriculture and Rural Affairs'],
  },
  'South Africa': {
    countryCode: 'ZA',
    countryName: 'South Africa',
    flag: '🇿🇦',
    defaultLanguage: 'en-ZA',
    supportedLanguages: [
      { code: 'en-ZA', name: 'English', nativeName: 'English', shortCode: 'EN' },
      { code: 'af-ZA', name: 'Afrikaans', nativeName: 'Afrikaans', shortCode: 'AF' },
    ],
    currency: { code: 'ZAR', symbol: 'R', name: 'South African Rand' },
    units: { areaUnit: 'hectares', tempUnit: '°C', rainfallUnit: 'mm', windUnit: 'km/h' },
    regions: [
      { name: 'Free State', districts: ['Bloemfontein', 'Welkom', 'Kroonstad', 'Bethlehem'], agroZone: 'Highveld Maize Agro-Climatic Belt' },
      { name: 'Mpumalanga', districts: ['Nelspruit', 'Secunda', 'Middelburg', 'Witrivier'], agroZone: 'Eastern Highveld Agricultural Region' },
      { name: 'North West', districts: ['Potchefstroom', 'Klerksdorp', 'Rustenburg', 'Lichtenburg'], agroZone: 'Western Grain and Livestock Region' },
      { name: 'Western Cape', districts: ['Stellenbosch', 'Paarl', 'Worcester', 'Malmesbury'], agroZone: 'Winter Rainfall Viticulture & Fruit Belt' },
    ],
    cropCatalog: ['Maize', 'Wheat', 'Sugarcane', 'Soybeans', 'Citrus', 'Grapes', 'Sunflower', 'Potatoes'],
    soilTypes: ['Plinthic soils', 'Vertisols', 'Podzols', 'Luvisols', 'Sandy loam'],
    irrigationTypes: ['Center Pivot', 'Drip Irrigation', 'Sprinkler', 'Rainfed'],
    weatherProvider: { name: 'SAWS / Open-Meteo', description: 'South African Weather Service telemetrics' },
    satelliteProvider: {
      providerName: 'SANSA',
      agency: 'South African National Space Agency',
      layers: ['SANSA Crop Census Layer', 'NCBI Soil Water Telemetry', 'Landsat/Sentinel African Regional Grid'],
      provenance: 'SANSA South Africa Earth Observation',
      notice: 'SANSA Agricultural Satellite Monitoring active',
    },
    agriculturalReferences: ['ARC (Agricultural Research Council)', 'Department of Agriculture, Land Reform and Rural Development'],
  },
  Egypt: {
    countryCode: 'EG',
    countryName: 'Egypt',
    flag: '🇪🇬',
    defaultLanguage: 'ar-EG',
    supportedLanguages: [
      { code: 'ar-EG', name: 'Arabic', nativeName: 'العربية', shortCode: 'AR' },
      { code: 'en', name: 'English', nativeName: 'English', shortCode: 'EN' },
    ],
    currency: { code: 'EGP', symbol: 'E£', name: 'Egyptian Pound' },
    units: { areaUnit: 'hectares', tempUnit: '°C', rainfallUnit: 'mm', windUnit: 'km/h' },
    regions: [
      { name: 'Beheira', districts: ['Damanhour', 'Kafr El Dawar', 'Housh Eissa', 'Abu Homos'], agroZone: 'Nile Delta Northern Agriculture Zone' },
      { name: 'Sharkia', districts: ['Zagazig', 'Belbeis', 'Minya El Qamh', 'Faqus'], agroZone: 'Eastern Nile Delta Agricultural Hub' },
      { name: 'Dakahlia', districts: ['Mansoura', 'Talkha', 'Mit Ghamr', 'Aga'], agroZone: 'Central Nile Delta Valley' },
      { name: 'Giza', districts: ['Giza', 'Al Badrashein', 'Oaseem', 'Atfih'], agroZone: 'Giza & Western Desert Reclamation Belt' },
    ],
    cropCatalog: ['Wheat', 'Cotton', 'Rice', 'Maize', 'Clover (Berseem)', 'Tomatoes', 'Potatoes', 'Citrus', 'Sugarcane'],
    soilTypes: ['Alluvial clay (Nile valley/delta)', 'Calcareous soils', 'Sandy desert soils'],
    irrigationTypes: ['Canal (Nile)', 'Drip Irrigation', 'Sprinkler', 'Surface Irrigation'],
    weatherProvider: { name: 'EMA / Open-Meteo', description: 'Egyptian Meteorological Authority telemetry' },
    satelliteProvider: {
      providerName: 'NARSS',
      agency: 'National Authority for Remote Sensing and Space Sciences',
      layers: ['NARSS Delta Crop Monitoring', 'Nile Valley Vegetation Index', 'Desert Reclamation Land Cover'],
      provenance: 'NARSS Egypt Earth Observation',
      notice: 'NARSS Satellite Agricultural Monitoring active',
    },
    agriculturalReferences: ['ARC Egypt', 'Desert Research Center (DRC)'],
  },
  Ethiopia: {
    countryCode: 'ET',
    countryName: 'Ethiopia',
    flag: '🇪🇹',
    defaultLanguage: 'am-ET',
    supportedLanguages: [
      { code: 'am-ET', name: 'Amharic', nativeName: 'አማርኛ', shortCode: 'AM' },
      { code: 'en', name: 'English', nativeName: 'English', shortCode: 'EN' },
    ],
    currency: { code: 'ETB', symbol: 'Br', name: 'Ethiopian Birr' },
    units: { areaUnit: 'hectares', tempUnit: '°C', rainfallUnit: 'mm', windUnit: 'km/h' },
    regions: [
      { name: 'Oromia', districts: ['Adama', 'Jimma', 'Bishoftu', 'Nekemte'], agroZone: 'Central Highlands & Rift Valley Agricultural Zone' },
      { name: 'Amhara', districts: ['Bahir Dar', 'Gondar', 'Debre Markos', 'Dessie'], agroZone: 'Highland Cereals & Teff Belt' },
      { name: 'SNNPR', districts: ['Hawassa', 'Arba Minch', 'Dilla', 'Hossana'], agroZone: 'Southern Enset & Coffee Agro-Ecological Zone' },
      { name: 'Sidama', districts: ['Awasa', 'Yirgalem', 'Aleta Wendo'], agroZone: 'Highland Coffee Production Belt' },
    ],
    cropCatalog: ['Teff', 'Coffee', 'Maize', 'Sorghum', 'Wheat', 'Barley', 'Sesame', 'Enset'],
    soilTypes: ['Nitisols', 'Vertisols', 'Cambisols', 'Lithosols'],
    irrigationTypes: ['Rainfed', 'River Diversion', 'Smallholder Irrigation', 'Micro-Irrigation'],
    weatherProvider: { name: 'NMSA / Open-Meteo', description: 'National Meteorological Agency of Ethiopia' },
    satelliteProvider: {
      providerName: 'EDRMC / ASTU Earth Observation',
      agency: 'Ethiopian Space Science and Technology Institute (ESSTI)',
      layers: ['ESSTI Highland Vegetation Index', 'Rift Valley Water Body Telemetry', 'Crop Yield Estimation Grid'],
      provenance: 'ESSTI / EDRMC Ethiopian Space Agency',
      notice: 'Ethiopian Earth Observation Telemetry active',
    },
    agriculturalReferences: ['EIAR (Ethiopian Institute of Agricultural Research)', 'Ministry of Agriculture Ethiopia'],
  },
  Indonesia: {
    countryCode: 'ID',
    countryName: 'Indonesia',
    flag: '🇮🇩',
    defaultLanguage: 'id-ID',
    supportedLanguages: [
      { code: 'id-ID', name: 'Indonesian', nativeName: 'Bahasa Indonesia', shortCode: 'ID' },
      { code: 'en', name: 'English', nativeName: 'English', shortCode: 'EN' },
    ],
    currency: { code: 'IDR', symbol: 'Rp', name: 'Indonesian Rupiah' },
    units: { areaUnit: 'hectares', tempUnit: '°C', rainfallUnit: 'mm', windUnit: 'km/h' },
    regions: [
      { name: 'East Java', districts: ['Malang', 'Jember', 'Kediri', 'Banyuwangi'], agroZone: 'Java Volcanic Agricultural Region' },
      { name: 'Central Java', districts: ['Semarang', 'Surakarta', 'Magelang', 'Pati'], agroZone: 'Central Java Rice & Plantation Belt' },
      { name: 'West Java', districts: ['Bandung', 'Bogor', 'Cirebon', 'Sukabumi'], agroZone: 'Parahyangan Highland Agro-Climatic Zone' },
      { name: 'North Sumatra', districts: ['Medan', 'Deli Serdang', 'Pematangsiantar', 'Binjai'], agroZone: 'Sumatra Estate Palm & Rubber Belt' },
    ],
    cropCatalog: ['Rice (Paddy)', 'Palm Oil', 'Rubber', 'Cassava', 'Corn', 'Cocoa', 'Coffee', 'Soybeans'],
    soilTypes: ['Andisols', 'Ultisols', 'Inceptisols', 'Oxisols', 'Alluvial soils'],
    irrigationTypes: ['Technical Irrigation (Subak/Siran)', 'Rainfed', 'Pump Irrigation'],
    weatherProvider: { name: 'BMKG / Open-Meteo', description: 'Badan Meteorologi, Klimatologi, dan Geofisika telemetry' },
    satelliteProvider: {
      providerName: 'LAPAN / BRIN',
      agency: 'National Research and Innovation Agency (BRIN)',
      layers: ['BRIN National Paddy Rice Monitoring', 'LAPAN Land Cover & Deforestation Index', 'Sentinel-2 Tropical Agriculture Grid'],
      provenance: 'BRIN / LAPAN Indonesia Earth Observation',
      notice: 'BRIN Indonesia Satellite Monitoring active',
    },
    agriculturalReferences: ['IAARD (Indonesian Agency for Agricultural Research and Development)', 'Ministry of Agriculture RI'],
  },
  Iran: {
    countryCode: 'IR',
    countryName: 'Iran',
    flag: '🇮🇷',
    defaultLanguage: 'fa-IR',
    supportedLanguages: [
      { code: 'fa-IR', name: 'Persian', nativeName: 'فارسی', shortCode: 'FA' },
      { code: 'en', name: 'English', nativeName: 'English', shortCode: 'EN' },
    ],
    currency: { code: 'IRR', symbol: '﷼', name: 'Iranian Rial' },
    units: { areaUnit: 'hectares', tempUnit: '°C', rainfallUnit: 'mm', windUnit: 'km/h' },
    regions: [
      { name: 'Khuzestan', districts: ['Ahvaz', 'Dezful', 'Shushtar', 'Abadan'], agroZone: 'Khuzestan Plain Subtropical Agriculture' },
      { name: 'Fars', districts: ['Shiraz', 'Marvdasht', 'Fasa', 'Jahrom'], agroZone: 'Zagros Mountain & Plateau Basin' },
      { name: 'Khorasan Razavi', districts: ['Mashhad', 'Neyshabur', 'Sabzevar', 'Torbat-e Heydarieh'], agroZone: 'Northeastern Dryland & Saffron Belt' },
      { name: 'Mazandaran', districts: ['Sari', 'Babol', 'Amol', 'Tonekabon'], agroZone: 'Caspian Sea Coastal Rice & Citrus Belt' },
    ],
    cropCatalog: ['Wheat', 'Barley', 'Rice', 'Pistachios', 'Dates', 'Grapes', 'Cotton', 'Saffron', 'Citrus'],
    soilTypes: ['Aridisols', 'Entisols', 'Inceptisols', 'Vertisols'],
    irrigationTypes: ['Qanat System', 'Drip Irrigation', 'Furrow Irrigation', 'Deep Well'],
    weatherProvider: { name: 'IRIMO / Open-Meteo', description: 'Islamic Republic of Iran Meteorological Organization' },
    satelliteProvider: {
      providerName: 'AREEO / ISCP',
      agency: 'Agricultural Research, Education and Extension Organization',
      layers: ['ISCP National Crop Inventory', 'Arid Land Soil Moisture Grid', 'Zarrin Satellite Remote Sensing'],
      provenance: 'AREEO Iran Agricultural Remote Sensing',
      notice: 'AREEO Iran Agricultural Monitoring active',
    },
    agriculturalReferences: ['AREEO Iran', 'University of Tehran Faculty of Agriculture'],
  },
  'Saudi Arabia': {
    countryCode: 'SA',
    countryName: 'Saudi Arabia',
    flag: '🇸🇦',
    defaultLanguage: 'ar-SA',
    supportedLanguages: [
      { code: 'ar-SA', name: 'Arabic', nativeName: 'العربية', shortCode: 'AR' },
      { code: 'en', name: 'English', nativeName: 'English', shortCode: 'EN' },
    ],
    currency: { code: 'SAR', symbol: 'SR', name: 'Saudi Riyal' },
    units: { areaUnit: 'hectares', tempUnit: '°C', rainfallUnit: 'mm', windUnit: 'km/h' },
    regions: [
      { name: 'Riyadh', districts: ['Riyadh', 'Al-Kharj', 'Wadi Al-Dawasir', 'Al-Majmaah'], agroZone: 'Central Plateau Oasis & Pivot Agriculture' },
      { name: 'Al-Qassim', districts: ['Buraidah', 'Unaizah', 'Al-Rass', 'Al-Bukairiyah'], agroZone: 'Qassim Date Palm & Greenhouse Agricultural Hub' },
      { name: 'Eastern Province', districts: ['Al-Ahsa', 'Dammam', 'Qatif', 'Al-Hofuf'], agroZone: 'Al-Ahsa Oasis Subsurface Irrigation Zone' },
      { name: 'Tabuk', districts: ['Tabuk', 'Duba', 'Al-Wajh', 'Haql'], agroZone: 'Northwestern Horticultural Development Belt' },
    ],
    cropCatalog: ['Dates', 'Wheat', 'Barley', 'Alfalfa', 'Tomatoes', 'Potatoes', 'Cucumbers', 'Melons', 'Citrus'],
    soilTypes: ['Aridisols', 'Entisols', 'Calcareous desert soils', 'Sandy soils'],
    irrigationTypes: ['Center Pivot Irrigation', 'Drip Irrigation', 'Desalinated Water Irrigation', 'Oasis Spate'],
    weatherProvider: { name: 'NCM / Open-Meteo', description: 'National Center for Meteorology Saudi Arabia' },
    satelliteProvider: {
      providerName: 'MEWA / KACST',
      agency: 'Ministry of Environment, Water and Agriculture / KACST',
      layers: ['KACST Agricultural Pivot Monitor', 'Greenhouse Thermal Imaging Grid', 'Desert Aquifer Telemetry'],
      provenance: 'MEWA / KACST Saudi Space Agency Earth Observation',
      notice: 'KACST Satellite Agricultural Monitoring active',
    },
    agriculturalReferences: ['KACST', 'National Agriculture Research Center (NARC) Saudi Arabia'],
  },
  'United Arab Emirates': {
    countryCode: 'AE',
    countryName: 'United Arab Emirates',
    flag: '🇦🇪',
    defaultLanguage: 'ar-AE',
    supportedLanguages: [
      { code: 'ar-AE', name: 'Arabic', nativeName: 'العربية', shortCode: 'AR' },
      { code: 'en', name: 'English', nativeName: 'English', shortCode: 'EN' },
    ],
    currency: { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham' },
    units: { areaUnit: 'hectares', tempUnit: '°C', rainfallUnit: 'mm', windUnit: 'km/h' },
    regions: [
      { name: 'Abu Dhabi', districts: ['Abu Dhabi', 'Al Ain', 'Al Dhafra', 'Madinat Zayed'], agroZone: 'Eastern Oasis & Desert Agriculture Zone' },
      { name: 'Dubai', districts: ['Dubai', 'Hatta', 'Al Awir'], agroZone: 'Dubai AgTech & Controlled Environment Hub' },
      { name: 'Sharjah', districts: ['Sharjah', 'Dhaid', 'Khor Fakkan', 'Kalba'], agroZone: 'Al Dhaid Agricultural Valley' },
      { name: 'Ras Al Khaimah', districts: ['Ras Al Khaimah', 'Digdaga', 'Sha’am'], agroZone: 'Northern Mountain Foothill Agriculture' },
    ],
    cropCatalog: ['Dates', 'Alfalfa', 'Tomatoes', 'Cucumbers', 'Eggplants', 'Peppers', 'Mangoes', 'Citrus'],
    soilTypes: ['Sandy desert soils', 'Solonchaks', 'Regosols', 'Calcareous soils'],
    irrigationTypes: ['Smart Drip Irrigation', 'Controlled Hydroponics', 'Recycled Water Irrigation'],
    weatherProvider: { name: 'NCM UAE / Open-Meteo', description: 'National Center of Meteorology UAE telemetry' },
    satelliteProvider: {
      providerName: 'ADAFSA / MBRSC',
      agency: 'Mohammed Bin Rashid Space Centre (MBRSC)',
      layers: ['KhalifaSat High-Resolution Ag Grid', 'ADAFSA Smart Farm Monitoring', 'Soil Salinity Remote Sensing'],
      provenance: 'MBRSC / ADAFSA UAE Earth Observation',
      notice: 'MBRSC KhalifaSat Agriculture Index active',
    },
    agriculturalReferences: ['ADAFSA (Abu Dhabi Agriculture and Food Safety Authority)', 'ICBA (International Center for Biosaline Agriculture)'],
  },
};

export function getCountryAdapter(country: string = 'India'): CountryAdapterConfig {
  const clean = country.trim();
  if (CountryAdapters[clean as SupportedCountry]) {
    return CountryAdapters[clean as SupportedCountry];
  }
  return CountryAdapters['India'];
}
