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
  'Andhra Pradesh': {
    name: 'Andhra Pradesh',
    code: 'AP',
    type: 'State',
    capital: 'Amaravati',
    agroClimaticRegion: 'East Coast Plains and Hills Region (Zone XI)',
    latitude: 15.9129,
    longitude: 79.7400,
    districts: {
      'Guntur': { name: 'Guntur', subDistricts: ['Guntur East', 'Guntur West', 'Tenali', 'Mangalagiri', 'Ponnur'], agroClimaticZone: 'Krishna Agro-Climatic Zone', latitude: 16.3067, longitude: 80.4365 },
      'Krishna': { name: 'Krishna', subDistricts: ['Vijayawada', 'Gudivada', 'Machilipatnam', 'Nuzvid', 'Jaggayyapeta'], agroClimaticZone: 'Krishna Delta Zone', latitude: 16.5062, longitude: 80.6480 },
      'East Godavari': { name: 'East Godavari', subDistricts: ['Rajahmundry', 'Kakinada', 'Amalapuram', 'Peddapuram'], agroClimaticZone: 'Godavari Delta Agro-Climatic Zone', latitude: 17.0005, longitude: 81.8040 },
      'West Godavari': { name: 'West Godavari', subDistricts: ['Eluru', 'Tadepalligudem', 'Bhimavaram', 'Narsapuram'], agroClimaticZone: 'Godavari Delta Zone', latitude: 16.7107, longitude: 81.0952 },
      'Ananthapuramu': { name: 'Ananthapuramu', subDistricts: ['Anantapur', 'Dharmavaram', 'Penukonda', 'Gooty', 'Kadiri'], agroClimaticZone: 'Scarce Rainfall Zone of Rayalaseema', latitude: 14.6819, longitude: 77.6006 },
      'Chittoor': { name: 'Chittoor', subDistricts: ['Chittoor', 'Madanapalle', 'Palamaner', 'Nagari', 'Kuppam'], agroClimaticZone: 'Southern Zone of Andhra Pradesh', latitude: 13.2172, longitude: 79.1003 },
      'Kurnool': { name: 'Kurnool', subDistricts: ['Kurnool', 'Nandyal', 'Adoni', 'Yemmiganur', 'Dhone'], agroClimaticZone: 'Scarce Rainfall Zone of Rayalaseema', latitude: 15.8281, longitude: 78.0373 },
      'Prakasam': { name: 'Prakasam', subDistricts: ['Ongole', 'Kandukur', 'Markapur', 'Giddalur'], agroClimaticZone: 'Southern Coastal Zone', latitude: 15.5057, longitude: 80.0499 },
      'Srikakulam': { name: 'Srikakulam', subDistricts: ['Srikakulam', 'Tekkali', 'Palakonda', 'Sompeta'], agroClimaticZone: 'North Coastal Zone', latitude: 18.2969, longitude: 83.8968 },
      'Visakhapatnam': { name: 'Visakhapatnam', subDistricts: ['Visakhapatnam Urban', 'Anakapalle', 'Bheemunipatnam', 'Narsipatnam'], agroClimaticZone: 'North Coastal Zone', latitude: 17.6868, longitude: 83.2185 },
      'Vizianagaram': { name: 'Vizianagaram', subDistricts: ['Vizianagaram', 'Bobbali', 'Parvathipuram', 'Salur'], agroClimaticZone: 'North Coastal Zone', latitude: 18.1066, longitude: 83.3955 },
      'YSR Kadapa': { name: 'YSR Kadapa', subDistricts: ['Kadapa', 'Proddatur', 'Rayachoti', 'Jammalamadugu', 'Pulivendula'], agroClimaticZone: 'Southern Zone of Rayalaseema', latitude: 14.4673, longitude: 78.8242 },
      'Sri Potti Sriramulu Nellore': { name: 'Sri Potti Sriramulu Nellore', subDistricts: ['Nellore', 'Kavali', 'Gudur', 'Atmakur'], agroClimaticZone: 'Southern Coastal Zone', latitude: 14.4426, longitude: 79.9865 },
      'Tirupati': { name: 'Tirupati', subDistricts: ['Tirupati Urban', 'Tirupati Rural', 'Srikalahasti', 'Sullurpeta', 'Venkatagiri'], agroClimaticZone: 'Southern Zone of AP', latitude: 13.6288, longitude: 79.4192 },
    },
  },
  'Arunachal Pradesh': {
    name: 'Arunachal Pradesh',
    code: 'AR',
    type: 'State',
    capital: 'Itanagar',
    agroClimaticRegion: 'Eastern Himalayan Region (Zone II)',
    latitude: 28.2180,
    longitude: 94.7278,
    districts: {
      'Papum Pare': { name: 'Papum Pare', subDistricts: ['Itanagar', 'Naharlagun', 'Yachuli', 'Doimukh'], agroClimaticZone: 'Foot Hill Sub-Tropical Zone', latitude: 27.1004, longitude: 93.6166 },
      'East Siang': { name: 'East Siang', subDistricts: ['Pasighat', 'Ruksin', 'Mebo', 'Sille-Oyan'], agroClimaticZone: 'Mid Hill Sub-Humid Zone', latitude: 28.0660, longitude: 95.3262 },
      'West Kameng': { name: 'West Kameng', subDistricts: ['Bomdila', 'Dirang', 'Rupa', 'Bhalukpong'], agroClimaticZone: 'High Hill Temperate Zone', latitude: 27.2642, longitude: 92.4159 },
      'Lower Subansiri': { name: 'Lower Subansiri', subDistricts: ['Ziro', 'Yachuli', 'Pistana'], agroClimaticZone: 'Mid Hill Temperate Zone', latitude: 27.5445, longitude: 93.8322 },
      'Lohit': { name: 'Lohit', subDistricts: ['Tezu', 'Sunpura', 'Wakro'], agroClimaticZone: 'Foot Hill Sub-Tropical Zone', latitude: 27.9234, longitude: 96.1667 },
      'Changlang': { name: 'Changlang', subDistricts: ['Changlang', 'Miao', 'Jairampur', 'Bordumsa'], agroClimaticZone: 'Sub-Humid Lowland Zone', latitude: 27.1322, longitude: 95.7330 },
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
      'Kamrup': { name: 'Kamrup', subDistricts: ['Guwahati', 'Rangia', 'North Guwahati', 'Palasbari', 'Hajo'], agroClimaticZone: 'Lower Brahmaputra Valley Zone', latitude: 26.1445, longitude: 91.7362 },
      'Nagaon': { name: 'Nagaon', subDistricts: ['Nagaon', 'Kaliabor', 'Raha', 'Hojai', 'Samaguri'], agroClimaticZone: 'Central Brahmaputra Valley Zone', latitude: 26.3460, longitude: 92.6840 },
      'Sonitpur': { name: 'Sonitpur', subDistricts: ['Tezpur', 'Dhekiajuli', 'Biswanath', 'Gohpur'], agroClimaticZone: 'North Bank Plain Zone', latitude: 26.6338, longitude: 92.7926 },
      'Cachar': { name: 'Cachar', subDistricts: ['Silchar', 'Lakhipur', 'Sonai', 'Katigorah'], agroClimaticZone: 'Barak Valley Zone', latitude: 24.8333, longitude: 92.7789 },
      'Dibrugarh': { name: 'Dibrugarh', subDistricts: ['Dibrugarh', 'Tingkhong', 'Naharkatia', 'Chabua'], agroClimaticZone: 'Upper Brahmaputra Valley Zone', latitude: 27.4728, longitude: 94.9120 },
      'Jorhat': { name: 'Jorhat', subDistricts: ['Jorhat', 'Titabor', 'Majuli', 'Teok'], agroClimaticZone: 'Upper Brahmaputra Valley Zone', latitude: 26.7509, longitude: 94.2037 },
      'Barpeta': { name: 'Barpeta', subDistricts: ['Barpeta', 'Howly', 'Kalgachia', 'Sorbhog'], agroClimaticZone: 'Lower Brahmaputra Valley Zone', latitude: 26.3220, longitude: 91.0040 },
      'Dhubri': { name: 'Dhubri', subDistricts: ['Dhubri', 'Gauripur', 'Bilasipara', 'Chapar'], agroClimaticZone: 'Lower Brahmaputra Valley Zone', latitude: 26.0207, longitude: 89.9782 },
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
      'Patna': { name: 'Patna', subDistricts: ['Patna Sadar', 'Danapur', 'Barh', 'Masaurhi', 'Palianganj', 'Bihta'], agroClimaticZone: 'South Bihar Alluvial Plain (Zone III A)', latitude: 25.5941, longitude: 85.1376 },
      'Nalanda': { name: 'Nalanda', subDistricts: ['Biharsharif', 'Rajgir', 'Hilsa', 'Asthawan'], agroClimaticZone: 'South Bihar Alluvial Plain (Zone III A)', latitude: 25.1982, longitude: 85.5149 },
      'Gaya': { name: 'Gaya', subDistricts: ['Gaya Town', 'Tekari', 'Sherghati', 'Bodhgaya', 'Manpur'], agroClimaticZone: 'South Bihar Alluvial Plain (Zone III B)', latitude: 24.7914, longitude: 85.0002 },
      'Bhagalpur': { name: 'Bhagalpur', subDistricts: ['Bhagalpur Sadar', 'Naugachhia', 'Kahalgaon', 'Sultanganj'], agroClimaticZone: 'South Bihar Alluvial Plain (Zone III B)', latitude: 25.2425, longitude: 86.9842 },
      'Muzaffarpur': { name: 'Muzaffarpur', subDistricts: ['Muzaffarpur East', 'Muzaffarpur West', 'Kanti', 'Motipur', 'Sakra'], agroClimaticZone: 'North West Alluvial Plain (Zone I)', latitude: 26.1209, longitude: 85.3647 },
      'Darbhanga': { name: 'Darbhanga', subDistricts: ['Darbhanga Sadar', 'Benipur', 'Biraul', 'Hayaghat'], agroClimaticZone: 'North East Alluvial Plain (Zone II)', latitude: 26.1542, longitude: 85.8918 },
      'Rohtas': { name: 'Rohtas', subDistricts: ['Sasaram', 'Dehri', 'Bikramganj', 'Nokha'], agroClimaticZone: 'South Bihar Alluvial Plain (Zone III A)', latitude: 24.9503, longitude: 84.0163 },
      'Saran': { name: 'Saran', subDistricts: ['Chhapra', 'Marhaura', 'Sonepur', 'Revelganj'], agroClimaticZone: 'North West Alluvial Plain (Zone I)', latitude: 25.7801, longitude: 84.7470 },
      'Purnia': { name: 'Purnia', subDistricts: ['Purnia Sadar', 'Banmankhi', 'Dhamdaha', 'Baisi'], agroClimaticZone: 'North East Alluvial Plain (Zone II)', latitude: 25.7771, longitude: 87.4753 },
      'East Champaran': { name: 'East Champaran', subDistricts: ['Motihari', 'Raxaul', 'Areraj', 'Chakia', 'Dhaka'], agroClimaticZone: 'North West Alluvial Plain (Zone I)', latitude: 26.6469, longitude: 84.9089 },
    },
  },
  'Chhattisgarh': {
    name: 'Chhattisgarh',
    code: 'CG',
    type: 'State',
    capital: 'Raipur',
    agroClimaticRegion: 'Eastern Plateau and Hills Region (Zone VII)',
    latitude: 21.2787,
    longitude: 81.8661,
    districts: {
      'Raipur': { name: 'Raipur', subDistricts: ['Raipur', 'Abhanpur', 'Arang', 'Tilda Neora'], agroClimaticZone: 'Chhattisgarh Plains Zone', latitude: 21.2514, longitude: 81.6296 },
      'Durg': { name: 'Durg', subDistricts: ['Durg', 'Bhilai', 'Patan', 'Dhamdha'], agroClimaticZone: 'Chhattisgarh Plains Zone', latitude: 21.1904, longitude: 81.2849 },
      'Bilaspur': { name: 'Bilaspur', subDistricts: ['Bilaspur', 'Kota', 'Takhatpur', 'Bilha'], agroClimaticZone: 'Chhattisgarh Plains Zone', latitude: 22.0797, longitude: 82.1409 },
      'Rajnandgaon': { name: 'Rajnandgaon', subDistricts: ['Rajnandgaon', 'Dongargarh', 'Khairagarh', 'Ambagarh'], agroClimaticZone: 'Chhattisgarh Plains Zone', latitude: 21.1002, longitude: 81.0298 },
      'Bastar': { name: 'Bastar', subDistricts: ['Jagdalpur', 'Bastanar', 'Bakawand', 'Lohandiguda'], agroClimaticZone: 'Bastar Plateau Zone', latitude: 19.0743, longitude: 82.0084 },
      'Surguja': { name: 'Surguja', subDistricts: ['Ambikapur', 'Sitapur', 'Lundra', 'Batauli'], agroClimaticZone: 'Northern Hills Zone of Chhattisgarh', latitude: 23.1200, longitude: 83.1979 },
      'Dhamtari': { name: 'Dhamtari', subDistricts: ['Dhamtari', 'Kurud', 'Nagri', 'Magarlod'], agroClimaticZone: 'Chhattisgarh Plains Zone', latitude: 20.7072, longitude: 81.5497 },
    },
  },
  'Goa': {
    name: 'Goa',
    code: 'GA',
    type: 'State',
    capital: 'Panaji',
    agroClimaticRegion: 'West Coast Plains and Ghats Region (Zone XII)',
    latitude: 15.2993,
    longitude: 74.1240,
    districts: {
      'North Goa': { name: 'North Goa', subDistricts: ['Tiswadi (Panaji)', 'Bardez (Mapusa)', 'Pernem', 'Bicholim', 'Ponda', 'Sanquelim'], agroClimaticZone: 'Coastal Eco-Zone', latitude: 15.5522, longitude: 73.8282 },
      'South Goa': { name: 'South Goa', subDistricts: ['Salcete (Margao)', 'Mormugao (Vasco)', 'Quepem', 'Sanguem', 'Canacona', 'Dharbandora'], agroClimaticZone: 'Western Ghat Foothills Zone', latitude: 15.2736, longitude: 73.9582 },
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
      'Rajkot': { name: 'Rajkot', subDistricts: ['Rajkot', 'Gondal', 'Jetpur', 'Dhoraji', 'Jasdan', 'Morbi'], agroClimaticZone: 'North Saurashtra Agro-Climatic Zone', latitude: 22.3039, longitude: 70.8022 },
      'Anand': { name: 'Anand', subDistricts: ['Anand', 'Borsad', 'Petlad', 'Khambhat', 'Umreth', 'Tarapur'], agroClimaticZone: 'Middle Gujarat Agro-Climatic Zone', latitude: 22.5645, longitude: 72.9289 },
      'Junagadh': { name: 'Junagadh', subDistricts: ['Junagadh', 'Keshod', 'Manavadar', 'Malia', 'Vanthali', 'Visavadar'], agroClimaticZone: 'South Saurashtra Agro-Climatic Zone', latitude: 21.5222, longitude: 70.4579 },
      'Ahmedabad': { name: 'Ahmedabad', subDistricts: ['Daskroi', 'Sanand', 'Bavla', 'Dholka', 'Viramgam'], agroClimaticZone: 'North Gujarat Zone', latitude: 23.0225, longitude: 72.5714 },
      'Surat': { name: 'Surat', subDistricts: ['Chorasi', 'Olpad', 'Kamrej', 'Bardoli', 'Mandvi'], agroClimaticZone: 'South Gujarat Heavy Rainfall Zone', latitude: 21.1702, longitude: 72.8311 },
      'Vadodara': { name: 'Vadodara', subDistricts: ['Vadodara', 'Padra', 'Dabhoi', 'Karjan', 'Savli'], agroClimaticZone: 'Middle Gujarat Zone', latitude: 22.3072, longitude: 73.1812 },
      'Mehsana': { name: 'Mehsana', subDistricts: ['Mehsana', 'Kadi', 'Visnagar', 'Unjha', 'Becharaji'], agroClimaticZone: 'North Gujarat Agro-Climatic Zone', latitude: 23.5979, longitude: 72.3693 },
      'Banaskantha': { name: 'Banaskantha', subDistricts: ['Palanpur', 'Deesa', 'Tharad', 'Dhanera', 'Kankrej'], agroClimaticZone: 'North West Arid Zone of Gujarat', latitude: 24.1724, longitude: 72.4346 },
      'Kutch': { name: 'Kutch', subDistricts: ['Bhuj', 'Anjar', 'Gandhidham', 'Mandvi', 'Nakhatrana', 'Rapar'], agroClimaticZone: 'Arid Zone of Kutch', latitude: 23.2420, longitude: 69.6669 },
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
      'Karnal': { name: 'Karnal', subDistricts: ['Karnal', 'Gharaunda', 'Indri', 'Assandh', 'Nilokheri'], agroClimaticZone: 'Eastern Zone of Haryana', latitude: 29.6857, longitude: 76.9905 },
      'Hisar': { name: 'Hisar', subDistricts: ['Hisar', 'Hansi', 'Adampur', 'Barwala', 'Uklana'], agroClimaticZone: 'Western Zone of Haryana', latitude: 29.1492, longitude: 75.7217 },
      'Ambala': { name: 'Ambala', subDistricts: ['Ambala City', 'Ambala Cantt', 'Naraingarh', 'Barara'], agroClimaticZone: 'North Eastern Zone of Haryana', latitude: 30.3782, longitude: 76.7767 },
      'Rohtak': { name: 'Rohtak', subDistricts: ['Rohtak', 'Meham', 'Sampla', 'Kalanaur'], agroClimaticZone: 'Central Zone of Haryana', latitude: 28.8955, longitude: 76.6066 },
      'Panipat': { name: 'Panipat', subDistricts: ['Panipat', 'Samalkha', 'Israna', 'Madlauda'], agroClimaticZone: 'Eastern Plain Zone', latitude: 29.3909, longitude: 76.9635 },
      'Sonipat': { name: 'Sonipat', subDistricts: ['Sonipat', 'Ganaur', 'Gohana', 'Kharkhoda'], agroClimaticZone: 'Eastern Plain Zone', latitude: 28.9931, longitude: 77.0151 },
      'Sirsa': { name: 'Sirsa', subDistricts: ['Sirsa', 'Dabwali', 'Rania', 'Ellenabad'], agroClimaticZone: 'Western Arid Zone', latitude: 29.5332, longitude: 75.0210 },
      'Gurugram': { name: 'Gurugram', subDistricts: ['Gurugram', 'Sohna', 'Pataudi', 'Farrukhnagar'], agroClimaticZone: 'South Western Zone', latitude: 28.4595, longitude: 77.0266 },
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
      'Kangra': { name: 'Kangra', subDistricts: ['Dharamshala', 'Kangra', 'Palampur', 'Nurpur', 'Dehra Gopipur', 'Baijnath'], agroClimaticZone: 'Sub-Mountain and Low Hills Sub-Tropical Zone', latitude: 32.0998, longitude: 76.2691 },
      'Mandi': { name: 'Mandi', subDistricts: ['Mandi', 'Sunder Nagar', 'Sarkaghat', 'Joginder Nagar', 'Karsog'], agroClimaticZone: 'Mid Hills Sub-Humid Zone', latitude: 31.5892, longitude: 76.9182 },
      'Shimla': { name: 'Shimla', subDistricts: ['Shimla Urban', 'Shimla Rural', 'Rampur', 'Rohru', 'Theog', 'Jubbal'], agroClimaticZone: 'High Hills Temperate Wet Zone', latitude: 31.1048, longitude: 77.1734 },
      'Solan': { name: 'Solan', subDistricts: ['Solan', 'Nalagarh', 'Kasauli', 'Arki', 'Kandaghat'], agroClimaticZone: 'Mid Hills Sub-Humid Zone', latitude: 30.9084, longitude: 77.0999 },
      'Una': { name: 'Una', subDistricts: ['Una', 'Amb', 'Bangana', 'Haroli'], agroClimaticZone: 'Sub-Mountain and Low Hills Sub-Tropical Zone', latitude: 31.4685, longitude: 76.2708 },
      'Kullu': { name: 'Kullu', subDistricts: ['Kullu', 'Manali', 'Banjar', 'Anni'], agroClimaticZone: 'High Hills Temperate Wet Zone', latitude: 31.9579, longitude: 77.1095 },
    },
  },
  'Jharkhand': {
    name: 'Jharkhand',
    code: 'JH',
    type: 'State',
    capital: 'Ranchi',
    agroClimaticRegion: 'Eastern Plateau and Hills Region (Zone VII)',
    latitude: 23.6102,
    longitude: 85.2799,
    districts: {
      'Ranchi': { name: 'Ranchi', subDistricts: ['Ranchi Sadar', 'Kanke', 'Ormanjhi', 'Namkum', 'Mandhar'], agroClimaticZone: 'Central & North Eastern Plateau (Zone IV)', latitude: 23.3441, longitude: 85.3096 },
      'East Singhbhum': { name: 'East Singhbhum (Jamshedpur)', subDistricts: ['Jamshedpur', 'Ghatshila', 'Baharagora', 'Potka'], agroClimaticZone: 'South Eastern Plateau Zone', latitude: 22.8046, longitude: 86.2029 },
      'Dhanbad': { name: 'Dhanbad', subDistricts: ['Dhanbad', 'Jharia', 'Baghmara', 'Nirsa', 'Govindpur'], agroClimaticZone: 'Central & North Eastern Plateau', latitude: 23.7957, longitude: 86.4304 },
      'Hazaribagh': { name: 'Hazaribagh', subDistricts: ['Hazaribagh', 'Barhi', 'Barkagaon', 'Chorparan'], agroClimaticZone: 'Central Plateau Zone', latitude: 23.9925, longitude: 85.3637 },
      'Dumka': { name: 'Dumka', subDistricts: ['Dumka', 'Jama', 'Jarmundi', 'Masalia', 'Raneshwar'], agroClimaticZone: 'Santhal Parganas Agro-Climatic Zone', latitude: 24.2676, longitude: 87.2489 },
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
      'Mandya': { name: 'Mandya', subDistricts: ['Mandya', 'Maddur', 'Malavalli', 'Srirangapatna', 'Pandavapura', 'KR Pet', 'Nagamangala'], agroClimaticZone: 'Southern Dry Zone of Karnataka', latitude: 12.5218, longitude: 76.8951 },
      'Belagavi': { name: 'Belagavi', subDistricts: ['Belagavi', 'Chikodi', 'Gokak', 'Bailhongal', 'Athani', 'Khanapur', 'Hukkeri'], agroClimaticZone: 'Northern Transition Zone', latitude: 15.8497, longitude: 74.4977 },
      'Dharwad': { name: 'Dharwad', subDistricts: ['Dharwad', 'Hubballi', 'Kalghatgi', 'Navalgund', 'Kundgol'], agroClimaticZone: 'Northern Transition Zone', latitude: 15.4589, longitude: 75.0078 },
      'Shimoga': { name: 'Shivamogga (Shimoga)', subDistricts: ['Shivamogga', 'Bhadravathi', 'Sagar', 'Shikaripura', 'Soraba', 'Thirthahalli', 'Hosanagara'], agroClimaticZone: 'Southern Transition / Malnad Zone', latitude: 13.9299, longitude: 75.5681 },
      'Bengaluru Rural': { name: 'Bengaluru Rural', subDistricts: ['Devanahalli', 'Doddaballapura', 'Hosakote', 'Nelamangala'], agroClimaticZone: 'Eastern Dry Zone', latitude: 13.2257, longitude: 77.5750 },
      'Mysuru': { name: 'Mysuru', subDistricts: ['Mysuru', 'Nanjangud', 'Hunsur', 'T .Narsipur', 'KR Nagara', 'Periyapatna'], agroClimaticZone: 'Southern Dry Zone', latitude: 12.2958, longitude: 76.6394 },
      'Tumakuru': { name: 'Tumakuru', subDistricts: ['Tumakuru', 'Gubbi', 'Sira', 'Tiptur', 'Kunigal', 'Madhugiri'], agroClimaticZone: 'Central Dry Zone', latitude: 13.3379, longitude: 77.1006 },
      'Hassan': { name: 'Hassan', subDistricts: ['Hassan', 'Arsikere', 'Channarayapatna', 'Holenarasipura', 'Sakleshpur', 'Belur'], agroClimaticZone: 'Southern Transition Zone', latitude: 13.0033, longitude: 76.1004 },
      'Ballari': { name: 'Ballari', subDistricts: ['Ballari', 'Sandur', 'Siruguppa', 'Kampli'], agroClimaticZone: 'North Eastern Dry Zone', latitude: 15.1394, longitude: 76.9214 },
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
      'Palakkad': { name: 'Palakkad', subDistricts: ['Palakkad', 'Chittur', 'Alathur', 'Ottapalam', 'Mannarkkad', 'Pattambi'], agroClimaticZone: 'Palakkad Plains Zone', latitude: 10.7867, longitude: 76.6548 },
      'Alappuzha': { name: 'Alappuzha', subDistricts: ['Ambalappuzha', 'Cherthala', 'Kuttanad', 'Karthikappally', 'Mavelikkara', 'Chengannur'], agroClimaticZone: 'Kuttanad Wet Alluvial Zone', latitude: 9.4981, longitude: 76.3388 },
      'Wayanad': { name: 'Wayanad', subDistricts: ['Vythiri (Kalpetta)', 'Sulthan Bathery', 'Mananthavady'], agroClimaticZone: 'High Altitude Zone of Wayanad', latitude: 11.6854, longitude: 76.1320 },
      'Thrissur': { name: 'Thrissur', subDistricts: ['Thrissur', 'Mukundapuram', 'Chalakudy', 'Kodungallur', 'Chavakkad', 'Thalapilly'], agroClimaticZone: 'Central Zone of Kerala', latitude: 10.5276, longitude: 76.2144 },
      'Ernakulam': { name: 'Ernakulam', subDistricts: ['Kochi', 'K Kanayannur', 'Aluva', 'Paravur', 'Kothamangalam', 'Muvattupuzha'], agroClimaticZone: 'Central Zone of Kerala', latitude: 9.9816, longitude: 76.2999 },
      'Idukki': { name: 'Idukki', subDistricts: ['Thodupuzha', 'Devikulam (Munnar)', 'Udumbanchola', 'Peerumade'], agroClimaticZone: 'High Range Zone', latitude: 9.8500, longitude: 76.9667 },
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
      'Indore': { name: 'Indore', subDistricts: ['Indore', 'Mhow', 'Depalpur', 'Sanwer'], agroClimaticZone: 'Malwa Plateau Agro-Climatic Zone', latitude: 22.7196, longitude: 75.8577 },
      'Ujjain': { name: 'Ujjain', subDistricts: ['Ujjain', 'Nagda', 'Khachrod', 'Badnagar', 'Tarana', 'Mahidpur'], agroClimaticZone: 'Malwa Plateau Agro-Climatic Zone', latitude: 23.1765, longitude: 75.7885 },
      'Hoshangabad': { name: 'Narmadapuram (Hoshangabad)', subDistricts: ['Hoshangabad', 'Itarsi', 'Pipariya', 'Seoni Malwa', 'Sohagpur'], agroClimaticZone: 'Central Narmada Valley Agro-Climatic Zone', latitude: 22.7533, longitude: 77.7240 },
      'Bhopal': { name: 'Bhopal', subDistricts: ['Huzur', 'Berasia'], agroClimaticZone: 'Vindhya Plateau Zone', latitude: 23.2599, longitude: 77.4126 },
      'Jabalpur': { name: 'Jabalpur', subDistricts: ['Jabalpur', 'Patan', 'Sihora', 'Panagar', 'Kundam'], agroClimaticZone: 'Kymore Plateau and Satpura Hill Zone', latitude: 23.1815, longitude: 79.9864 },
      'Gwalior': { name: 'Gwalior', subDistricts: ['Gwalior', 'Dabra', 'Bhitarwar'], agroClimaticZone: 'Gird Region', latitude: 26.2183, longitude: 78.1828 },
      'Sagar': { name: 'Sagar', subDistricts: ['Sagar', 'Bina', 'Khurai', 'Banda', 'Rahatgarh'], agroClimaticZone: 'Bundelkhand Zone', latitude: 23.8388, longitude: 78.7378 },
      'Ratlam': { name: 'Ratlam', subDistricts: ['Ratlam', 'Jaora', 'Sailana', 'Alot', 'Piploda'], agroClimaticZone: 'Malwa Plateau Zone', latitude: 23.3315, longitude: 75.0367 },
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
      'Nashik': { name: 'Nashik', subDistricts: ['Nashik', 'Niphad', 'Sinnar', 'Malegaon', 'Igatpuri', 'Yeola', 'Kalwan', 'Chandwad', 'Dindori'], agroClimaticZone: 'Western Maharashtra Plain Zone (Scarcity Zone)', latitude: 19.9975, longitude: 73.7898 },
      'Pune': { name: 'Pune', subDistricts: ['Haveli', 'Baramati', 'Indapur', 'Shirur', 'Junner', 'Khed', 'Maval', 'Purandhar', 'Daund'], agroClimaticZone: 'Western Ghat Zone / Scarcity Zone', latitude: 18.5204, longitude: 73.8567 },
      'Nagpur': { name: 'Nagpur', subDistricts: ['Nagpur Urban', 'Nagpur Rural', 'Katol', 'Saoner', 'Umred', 'Ramtek', 'Hingna', 'Narkhed'], agroClimaticZone: 'Central Vidarbha Zone', latitude: 21.1458, longitude: 79.0882 },
      'Ahmednagar': { name: 'Ahmednagar', subDistricts: ['Nagar', 'Rahuri', 'Shrirampur', 'Kopargaon', 'Sangamner', 'Shevgaon', 'Akole', 'Nevasa', 'Parner'], agroClimaticZone: 'Scarcity Zone of Maharashtra', latitude: 19.0952, longitude: 74.7496 },
      'Solapur': { name: 'Solapur', subDistricts: ['Solapur North', 'Solapur South', 'Pandharpur', 'Barshi', 'Sangole', 'Malshiras', 'Akkalkot', 'Mohol', 'Karmala'], agroClimaticZone: 'Scarcity Zone of Maharashtra', latitude: 17.6599, longitude: 75.9064 },
      'Kolhapur': { name: 'Kolhapur', subDistricts: ['Karveer', 'Hatkanangle', 'Shirol', 'Kagal', 'Radhanagari', 'Gadhinglaj', 'Panhala'], agroClimaticZone: 'Sub-Montane Zone of Maharashtra', latitude: 16.7050, longitude: 74.2433 },
      'Aurangabad': { name: 'Chhatrapati Sambhajinagar (Aurangabad)', subDistricts: ['Aurangabad', 'Paithan', 'Gangapur', 'Vaijapur', 'Kannad', 'Sillod'], agroClimaticZone: 'Central Maharashtra Zone', latitude: 19.8762, longitude: 75.3433 },
      'Jalgaon': { name: 'Jalgaon', subDistricts: ['Jalgaon', 'Bhusawal', 'Chalisgaon', 'Jamner', 'Raver', 'Yawal', 'Amalner'], agroClimaticZone: 'Khandesh Agro-Climatic Zone', latitude: 21.0077, longitude: 75.5626 },
      'Satara': { name: 'Satara', subDistricts: ['Satara', 'Karad', 'Phaltan', 'Wai', 'Koregaon', 'Mahabaleshwar', 'Patan'], agroClimaticZone: 'Western Plain Zone', latitude: 17.6805, longitude: 74.0183 },
      'Sangli': { name: 'Sangli', subDistricts: ['Miraj', 'Walwa (Islampur)', 'Tasgaon', 'Jath', 'Khanapur (Vita)', 'Shirala'], agroClimaticZone: 'Southern Plain Zone', latitude: 16.8524, longitude: 74.5815 },
    },
  },
  'Manipur': {
    name: 'Manipur',
    code: 'MN',
    type: 'State',
    capital: 'Imphal',
    agroClimaticRegion: 'Eastern Himalayan Region (Zone II)',
    latitude: 24.6637,
    longitude: 93.9063,
    districts: {
      'Imphal West': { name: 'Imphal West', subDistricts: ['Lamphelpat', 'Patsoi', 'Lamsang', 'Wangoi'], agroClimaticZone: 'Sub-Tropical Sub-Humid Valley Zone', latitude: 24.8170, longitude: 93.9368 },
      'Imphal East': { name: 'Imphal East', subDistricts: ['Porompat', 'Keirao Bitra', 'Sawombung'], agroClimaticZone: 'Sub-Tropical Valley Zone', latitude: 24.8000, longitude: 93.9800 },
      'Bishnupur': { name: 'Bishnupur', subDistricts: ['Bishnupur', 'Moirang', 'Nambol'], agroClimaticZone: 'Valley Agricultural Zone', latitude: 24.6333, longitude: 93.7667 },
      'Thoubal': { name: 'Thoubal', subDistricts: ['Thoubal', 'Lilong', 'Heirok'], agroClimaticZone: 'Valley Agricultural Zone', latitude: 24.6333, longitude: 93.9999 },
      'Churachandpur': { name: 'Churachandpur', subDistricts: ['Churachandpur', 'Singngat', 'Thanlon'], agroClimaticZone: 'Temperately Cold Hill Zone', latitude: 24.3333, longitude: 93.6833 },
    },
  },
  'Meghalaya': {
    name: 'Meghalaya',
    code: 'ML',
    type: 'State',
    capital: 'Shillong',
    agroClimaticRegion: 'Eastern Himalayan Region (Zone II)',
    latitude: 25.4670,
    longitude: 91.3662,
    districts: {
      'East Khasi Hills': { name: 'East Khasi Hills', subDistricts: ['Mylliem (Shillong)', 'Mawkynrew', 'Mawsynram', 'Sohra (Cherrapunji)', 'Pynursla'], agroClimaticZone: 'High Altitude Temperate Zone', latitude: 25.5700, longitude: 91.8800 },
      'Ri-Bhoi': { name: 'Ri-Bhoi', subDistricts: ['Nongpoh', 'Umsning', 'Jirang'], agroClimaticZone: 'Mid Altitude Sub-Tropical Zone', latitude: 25.9000, longitude: 91.8800 },
      'West Garo Hills': { name: 'West Garo Hills', subDistricts: ['Tura', 'Rongram', 'Dadenggre', 'Selsella'], agroClimaticZone: 'Low Altitude Sub-Tropical Zone', latitude: 25.5167, longitude: 90.2000 },
    },
  },
  'Mizoram': {
    name: 'Mizoram',
    code: 'MZ',
    type: 'State',
    capital: 'Aizawl',
    agroClimaticRegion: 'Eastern Himalayan Region (Zone II)',
    latitude: 23.1645,
    longitude: 92.9376,
    districts: {
      'Aizawl': { name: 'Aizawl', subDistricts: ['Aizawl East', 'Aizawl West', 'Tlangnuam', 'Thingsulthliah'], agroClimaticZone: 'Temperate Hill Eco-System', latitude: 23.7271, longitude: 92.7176 },
      'Lunglei': { name: 'Lunglei', subDistricts: ['Lunglei', 'Hnahthial', 'Bunghmun'], agroClimaticZone: 'Sub-Tropical Hill Zone', latitude: 22.8880, longitude: 92.7330 },
      'Champhai': { name: 'Champhai', subDistricts: ['Champhai', 'Khawzawl', 'Ngopa'], agroClimaticZone: 'Highland Temperate Zone', latitude: 23.4560, longitude: 93.3280 },
    },
  },
  'Nagaland': {
    name: 'Nagaland',
    code: 'NL',
    type: 'State',
    capital: 'Kohima',
    agroClimaticRegion: 'Eastern Himalayan Region (Zone II)',
    latitude: 26.1584,
    longitude: 94.5624,
    districts: {
      'Kohima': { name: 'Kohima', subDistricts: ['Kohima', 'Chiephobozou', 'Tseminyu', 'Sechu Zubza'], agroClimaticZone: 'High Hill Temperate Zone', latitude: 25.6701, longitude: 94.1077 },
      'Dimapur': { name: 'Dimapur', subDistricts: ['Dimapur Sadar', 'Chumukedima', 'Medziphema'], agroClimaticZone: 'Foot Hill Sub-Tropical Zone', latitude: 25.9060, longitude: 93.7270 },
      'Mokokchung': { name: 'Mokokchung', subDistricts: ['Mokokchung', 'Mangkolemba', 'Tuli', 'Changtongya'], agroClimaticZone: 'Mid Hill Sub-Tropical Zone', latitude: 26.3200, longitude: 94.5200 },
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
      'Cuttack': { name: 'Cuttack', subDistricts: ['Cuttack Sadar', 'Athagarh', 'Banki', 'Choudwar', 'Narsinghpur'], agroClimaticZone: 'East and South Eastern Coastal Plain Zone', latitude: 20.4625, longitude: 85.8828 },
      'Khordha': { name: 'Khordha (Bhubaneswar)', subDistricts: ['Bhubaneswar', 'Khordha', 'Jatni', 'Banapur', 'Begunia'], agroClimaticZone: 'East Coastal Plain Zone', latitude: 20.1824, longitude: 85.6180 },
      'Ganjam': { name: 'Ganjam', subDistricts: ['Berhampur', 'Chhatrapur', 'Bhanjanagar', 'Aska', 'Hinlicut'], agroClimaticZone: 'North Eastern Ghat Zone', latitude: 19.3149, longitude: 85.0322 },
      'Sambalpur': { name: 'Sambalpur', subDistricts: ['Sambalpur', 'Rairakhol', 'Kuchinda', 'Rengali'], agroClimaticZone: 'West Central Table Land Zone', latitude: 21.4669, longitude: 83.9812 },
      'Bargarh': { name: 'Bargarh', subDistricts: ['Bargarh', 'Padampur', 'Attabira', 'Sohela', 'Barpali'], agroClimaticZone: 'Hirakud Command Area Irrigated Zone', latitude: 21.3323, longitude: 83.6231 },
      'Balasore': { name: 'Balasore', subDistricts: ['Balasore', 'Jaleswar', 'Soro', 'Bhadrak', 'Basta'], agroClimaticZone: 'North Eastern Coastal Plain Zone', latitude: 21.4942, longitude: 86.9336 },
      'Koraput': { name: 'Koraput', subDistricts: ['Koraput', 'Jeypore', 'Sunabeda', 'Kotpad'], agroClimaticZone: 'Eastern Ghat High Altitude Zone', latitude: 18.8135, longitude: 82.7123 },
    },
  },
  'Punjab': {
    name: 'Punjab',
    code: 'PB',
    type: 'State',
    capital: 'Chandigarh',
    agroClimaticRegion: 'Trans-Gangetic Plains Region (Zone VI)',
    latitude: 31.1471,
    longitude: 75.3412,
    districts: {
      'Ludhiana': { name: 'Ludhiana', subDistricts: ['Ludhiana East', 'Ludhiana West', 'Jagraon', 'Khanna', 'Samrala', 'Payal', 'Raikot'], agroClimaticZone: 'Central Plain Zone of Punjab', latitude: 30.9010, longitude: 75.8573 },
      'Amritsar': { name: 'Amritsar', subDistricts: ['Amritsar-I', 'Amritsar-II', 'Ajnala', 'Baba Bakala'], agroClimaticZone: 'Sub-Mountain Undulating Zone', latitude: 31.6340, longitude: 74.8723 },
      'Patiala': { name: 'Patiala', subDistricts: ['Patiala', 'Nabha', 'Rajpura', 'Samana', 'Patran'], agroClimaticZone: 'Central Plain Zone of Punjab', latitude: 30.3398, longitude: 76.3869 },
      'Jalandhar': { name: 'Jalandhar', subDistricts: ['Jalandhar-I', 'Jalandhar-II', 'Nakodar', 'Phillaur', 'Shahkot'], agroClimaticZone: 'Central Plain Zone of Punjab', latitude: 31.3260, longitude: 75.5762 },
      'Bathinda': { name: 'Bathinda', subDistricts: ['Bathinda', 'Rampura Phul', 'Talwandi Sabo', 'Maur'], agroClimaticZone: 'Western Plain Zone of Punjab', latitude: 30.2110, longitude: 74.9455 },
      'Sangrur': { name: 'Sangrur', subDistricts: ['Sangrur', 'Sunam', 'Dhuri', 'Lehra', 'Moonak'], agroClimaticZone: 'Central Plain Zone of Punjab', latitude: 30.2458, longitude: 75.8421 },
      'Firozpur': { name: 'Firozpur', subDistricts: ['Firozpur', 'Zira', 'Guru Har Sahai'], agroClimaticZone: 'Western Plain Zone', latitude: 30.9237, longitude: 74.6120 },
      'Fazilka': { name: 'Fazilka', subDistricts: ['Fazilka', 'Abohar', 'Jalalabad'], agroClimaticZone: 'Western Arid/Semi-Arid Zone', latitude: 30.4037, longitude: 74.0253 },
      'Gurdaspur': { name: 'Gurdaspur', subDistricts: ['Gurdaspur', 'Batala', 'Dera Baba Nanak'], agroClimaticZone: 'Sub-Mountain Zone', latitude: 32.0419, longitude: 75.4053 },
      'Hoshiarpur': { name: 'Hoshiarpur', subDistricts: ['Hoshiarpur', 'Dasuya', 'Mukerian', 'Garhshankar'], agroClimaticZone: 'Sub-Mountain Undulating Zone', latitude: 31.5143, longitude: 75.9115 },
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
      'Ganganagar': { name: 'Sri Ganganagar', subDistricts: ['Sri Ganganagar', 'Suratgarh', 'Anupgarh', 'Raisinghnagar', 'Padampur', 'Sadulshahar'], agroClimaticZone: 'Irrigated North Western Plain Zone', latitude: 29.9038, longitude: 73.8772 },
      'Kota': { name: 'Kota', subDistricts: ['Kota', 'Digod', 'Sangod', 'Ramganj Mandi'], agroClimaticZone: 'Humid South Eastern Plain Zone', latitude: 25.2138, longitude: 75.8648 },
      'Jaipur': { name: 'Jaipur', subDistricts: ['Amber', 'Sanganer', 'Chaksu', 'Chomu', 'Kotputli', 'Phulera', 'Shahpura'], agroClimaticZone: 'Semi-Arid Eastern Plain Zone', latitude: 26.9124, longitude: 75.7873 },
      'Jodhpur': { name: 'Jodhpur', subDistricts: ['Jodhpur', 'Luni', 'Osian', 'Phalodi', 'Piparcity', 'Shergarh'], agroClimaticZone: 'Arid Western Plain Zone', latitude: 26.2389, longitude: 73.0243 },
      'Udaipur': { name: 'Udaipur', subDistricts: ['Girwa (Udaipur)', 'Mavli', 'Salumbar', 'Vallabhnagar', 'Jhadol', 'Kherwara'], agroClimaticZone: 'Sub-Humid Southern Plain Zone', latitude: 24.5854, longitude: 73.7125 },
      'Bikaner': { name: 'Bikaner', subDistricts: ['Bikaner', 'Nokha', 'Lunkaransar', 'Khajuwala', 'Kolayat'], agroClimaticZone: 'Hyper Arid Partial Irrigated Zone', latitude: 28.0229, longitude: 73.3119 },
      'Ajmer': { name: 'Ajmer', subDistricts: ['Ajmer', 'Beawar', 'Kishangarh', 'Kekri', 'Nasirabad'], agroClimaticZone: 'Semi-Arid Eastern Plain Zone', latitude: 26.4499, longitude: 74.6399 },
      'Alwar': { name: 'Alwar', subDistricts: ['Alwar', 'B Behror', 'Bhanugarh', 'Kishangarh Bas', 'Tijara'], agroClimaticZone: 'Flood Prone Eastern Plain Zone', latitude: 27.5530, longitude: 76.6346 },
    },
  },
  'Sikkim': {
    name: 'Sikkim',
    code: 'SK',
    type: 'State',
    capital: 'Gangtok',
    agroClimaticRegion: 'Eastern Himalayan Region (Zone II)',
    latitude: 27.5330,
    longitude: 88.5122,
    districts: {
      'Gangtok': { name: 'Gangtok (East Sikkim)', subDistricts: ['Gangtok', 'Pakyong', 'Rongli', 'Rhenock'], agroClimaticZone: 'Organic High Altitude Zone', latitude: 27.3389, longitude: 88.6065 },
      'Namchi': { name: 'Namchi (South Sikkim)', subDistricts: ['Namchi', 'Jorethang', 'Ravangla'], agroClimaticZone: 'Mid Altitude Temperate Zone', latitude: 27.1667, longitude: 88.3500 },
      'Gyalshing': { name: 'Gyalshing (West Sikkim)', subDistricts: ['Gyalshing', 'Soreng', 'Naya Bazar'], agroClimaticZone: 'High Hill Temperate Organic Zone', latitude: 27.2833, longitude: 88.2333 },
      'Mangan': { name: 'Mangan (North Sikkim)', subDistricts: ['Mangan', 'Chungthang', 'Lachen', 'Lachung'], agroClimaticZone: 'Alpine Eco-Zone', latitude: 27.5167, longitude: 88.5333 },
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
      'Thanjavur': { name: 'Thanjavur', subDistricts: ['Thanjavur', 'Kumbakonam', 'Papanasam', 'Pattukkottai', 'Orathanadu', 'Thiruvaiyaru'], agroClimaticZone: 'Cauvery Delta Agro-Climatic Zone', latitude: 10.7870, longitude: 79.1378 },
      'Coimbatore': { name: 'Coimbatore', subDistricts: ['Coimbatore North', 'Coimbatore South', 'Pollachi', 'Mettupalayam', 'Sulur'], agroClimaticZone: 'Western Agro-Climatic Zone of TN', latitude: 11.0168, longitude: 76.9558 },
      'Madurai': { name: 'Madurai', subDistricts: ['Madurai North', 'Madurai South', 'Melur', 'Usilampatti', 'Tirumangalam', 'Vadipatti'], agroClimaticZone: 'Southern Agro-Climatic Zone of TN', latitude: 9.9252, longitude: 78.1198 },
      'Salem': { name: 'Salem', subDistricts: ['Salem', 'Attur', 'Mettur', 'Omalur', 'Sankari', 'Yercaud'], agroClimaticZone: 'North Western Zone of TN', latitude: 11.6643, longitude: 78.1460 },
      'Tiruchirappalli': { name: 'Tiruchirappalli (Trichy)', subDistricts: ['Trichy Town', 'Lalgudi', 'Musiri', 'Thuraiyur', 'Manapparai'], agroClimaticZone: 'Cauvery Delta / Central Zone', latitude: 10.7905, longitude: 78.7047 },
      'Erode': { name: 'Erode', subDistricts: ['Erode', 'Gobichettipalayam', 'Bhavani', 'Perundurai', 'Sathyamangalam'], agroClimaticZone: 'Western Zone', latitude: 11.3410, longitude: 77.7172 },
      'Vellore': { name: 'Vellore', subDistricts: ['Vellore', 'Katpadi', 'Gudiyatham', 'Anaicut'], agroClimaticZone: 'North Eastern Zone', latitude: 12.9165, longitude: 79.1325 },
      'Tirunelveli': { name: 'Tirunelveli', subDistricts: ['Tirunelveli', 'Palayamkottai', 'Ambasamudram', 'Nanguneri'], agroClimaticZone: 'Southern Zone', latitude: 8.7139, longitude: 77.7567 },
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
      'Adilabad': { name: 'Adilabad', subDistricts: ['Adilabad Rural', 'Adilabad Urban', 'Jainad', 'Bela', 'Utnoor', 'Bazarhatnoor'], agroClimaticZone: 'Northern Telangana Zone (Zone X)', latitude: 19.6641, longitude: 78.5320 },
      'Warangal': { name: 'Warangal', subDistricts: ['Warangal', 'Khila Warangal', 'Geesugonda', 'Atmakur', 'Sangem', 'Narsampet'], agroClimaticZone: 'Central Telangana Zone', latitude: 17.9689, longitude: 79.5941 },
      'Karimnagar': { name: 'Karimnagar', subDistricts: ['Karimnagar', 'Choppadandi', 'Manakondur', 'Huzurabad', 'Thimmapur', 'Gangadhara'], agroClimaticZone: 'Northern Telangana Zone', latitude: 18.4386, longitude: 79.1288 },
      'Nizamabad': { name: 'Nizamabad', subDistricts: ['Nizamabad North', 'Nizamabad South', 'Bodhan', 'Armoor', 'Balkonda', 'Dichpally'], agroClimaticZone: 'Northern Telangana Zone', latitude: 18.6725, longitude: 78.0941 },
      'Khammam': { name: 'Khammam', subDistricts: ['Khammam Urban', 'Khammam Rural', 'Wyra', 'Sathupalli', 'Madhira', 'Penuballi'], agroClimaticZone: 'Central Telangana Zone', latitude: 17.2473, longitude: 80.1514 },
      'Nalgonda': { name: 'Nalgonda', subDistricts: ['Nalgonda', 'Miryalaguda', 'Devarakonda', 'Nagarjuna Sagar', 'Nakrekal', 'Chandur'], agroClimaticZone: 'Southern Telangana Zone', latitude: 17.0577, longitude: 79.2684 },
      'Mahabubnagar': { name: 'Mahabubnagar', subDistricts: ['Mahabubnagar', 'Jadcherla', 'Bhutpur', 'Devarkadra'], agroClimaticZone: 'Southern Telangana Zone', latitude: 16.7488, longitude: 78.0035 },
      'Sangareddy': { name: 'Sangareddy', subDistricts: ['Sangareddy', 'Patancheru', 'Zaheerabad', 'Narayankhed', 'Andole'], agroClimaticZone: 'Central Telangana Zone', latitude: 17.6193, longitude: 78.0817 },
      'Siddipet': { name: 'Siddipet', subDistricts: ['Siddipet Urban', 'Siddipet Rural', 'Gajwel', 'Dubbak', 'Husnabad'], agroClimaticZone: 'Central Telangana Zone', latitude: 18.1018, longitude: 78.8520 },
      'Rangareddy': { name: 'Rangareddy', subDistricts: ['Shamshabad', 'Ibrahimpatnam', 'Rajendranagar', 'Hayathnagar', 'Maheshwaram'], agroClimaticZone: 'Southern Telangana Zone', latitude: 17.3297, longitude: 78.5822 },
    },
  },
  'Tripura': {
    name: 'Tripura',
    code: 'TR',
    type: 'State',
    capital: 'Agartala',
    agroClimaticRegion: 'Eastern Himalayan Region (Zone II)',
    latitude: 23.9408,
    longitude: 91.9882,
    districts: {
      'West Tripura': { name: 'West Tripura (Agartala)', subDistricts: ['Sadar (Agartala)', 'Jirania', 'Mohanpur', 'Hezamara'], agroClimaticZone: 'Sub-Tropical Humid Zone', latitude: 23.8315, longitude: 91.2868 },
      'South Tripura': { name: 'South Tripura', subDistricts: ['Belonia', 'Sabroom', 'Santirbazar'], agroClimaticZone: 'Sub-Tropical Undulating Zone', latitude: 23.2500, longitude: 91.4500 },
      'North Tripura': { name: 'North Tripura', subDistricts: ['Dharmanagar', 'Kanchanpur', 'Panisagar'], agroClimaticZone: 'Hill Slope Sub-Tropical Zone', latitude: 24.3333, longitude: 92.1667 },
      'Gomati': { name: 'Gomati', subDistricts: ['Udaipur', 'Amarpur', 'Karbook'], agroClimaticZone: 'Central Plain Zone of Tripura', latitude: 23.5333, longitude: 91.4833 },
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
      'Varanasi': { name: 'Varanasi', subDistricts: ['Varanasi Sadar', 'Pindra', 'Raja Talab'], agroClimaticZone: 'Eastern Plain Zone of UP', latitude: 25.3176, longitude: 82.9739 },
      'Gorakhpur': { name: 'Gorakhpur', subDistricts: ['Sadar', 'Bansgaon', 'Campierganj', 'Chauri Chaura', 'Khajni', 'Sahjanwa'], agroClimaticZone: 'North Eastern Plain Zone of UP', latitude: 26.7606, longitude: 83.3732 },
      'Agra': { name: 'Agra', subDistricts: ['Agra', 'Etmadpur', 'Fatehabad', 'Kheragarh', 'Kirao', 'Bah'], agroClimaticZone: 'Western Plain Zone of UP', latitude: 27.1767, longitude: 78.0081 },
      'Kanpur Nagar': { name: 'Kanpur Nagar', subDistricts: ['Kanpur Sadar', 'Bilhau', 'Ghatampur'], agroClimaticZone: 'Central Plain Zone of UP', latitude: 26.4499, longitude: 80.3319 },
      'Lucknow': { name: 'Lucknow', subDistricts: ['Lucknow Sadar', 'Malihabad', 'Mohanlalganj', 'Bakshi Ka Talab'], agroClimaticZone: 'Central Plain Zone', latitude: 26.8467, longitude: 80.9462 },
      'Meerut': { name: 'Meerut', subDistricts: ['Meerut Sadar', 'Mawana', 'Sardhana'], agroClimaticZone: 'Western Plain Zone', latitude: 28.9845, longitude: 77.7064 },
      'Prayagraj': { name: 'Prayagraj (Allahabad)', subDistricts: ['Sadar', 'Phulpur', 'Handia', 'Karchhana', 'Bara', 'Meja', 'Soraon'], agroClimaticZone: 'Central Gangetic Plain Zone', latitude: 25.4358, longitude: 81.8463 },
      'Bareilly': { name: 'Bareilly', subDistricts: ['Bareilly Sadar', 'Aonla', 'Baheri', 'Faridpur', 'Nawabganj'], agroClimaticZone: 'Western Plain Zone (Rohilkhand)', latitude: 28.3670, longitude: 79.4304 },
      'Ayodhya': { name: 'Ayodhya (Faizabad)', subDistricts: ['Ayodhya Sadar', 'Rudauli', 'Bikapur', 'Milkipur', 'Sohawal'], agroClimaticZone: 'Eastern Plain Zone', latitude: 26.7922, longitude: 82.1998 },
      'Lakhimpur Kheri': { name: 'Lakhimpur Kheri', subDistricts: ['Lakhimpur', 'Gola Gokarannath', 'Mohammadi', 'Nighasan', 'Palia'], agroClimaticZone: 'North Eastern Plain Tarai Zone', latitude: 27.9479, longitude: 80.7786 },
    },
  },
  'Uttarakhand': {
    name: 'Uttarakhand',
    code: 'UK',
    type: 'State',
    capital: 'Dehradun',
    agroClimaticRegion: 'Western Himalayan Region (Zone I)',
    latitude: 30.0668,
    longitude: 79.0193,
    districts: {
      'Dehradun': { name: 'Dehradun', subDistricts: ['Dehradun Sadar', 'Rishikesh', 'Vikasnagar', 'Kalsi', 'Chakrata'], agroClimaticZone: 'Sub-Tropical Tarai / Doon Valley Zone', latitude: 30.3165, longitude: 78.0322 },
      'Udham Singh Nagar': { name: 'Udham Singh Nagar (Pantnagar)', subDistricts: ['Rudrapur', 'Kashipur', 'Kichha', 'Khatima', 'Sitarganj', 'Bajpur'], agroClimaticZone: 'Tarai Agricultural Belt', latitude: 28.9800, longitude: 79.5200 },
      'Haridwar': { name: 'Haridwar', subDistricts: ['Haridwar', 'Roorkee', 'Laksar', 'Bhagwanpur'], agroClimaticZone: 'Plain Gangetic Alluvial Belt', latitude: 29.9457, longitude: 78.1642 },
      'Nainital': { name: 'Nainital', subDistricts: ['Nainital', 'Haldwani', 'Ramnagar', 'Lalkuan', 'Bhowali'], agroClimaticZone: 'Mid Hill & Foot Hill Zone', latitude: 29.3803, longitude: 79.4636 },
      'Almora': { name: 'Almora', subDistricts: ['Almora', 'Ranikhet', 'Dwarahat', 'Bhikiyasain', 'Chaukhutia'], agroClimaticZone: 'Mid Hill Temperate Zone', latitude: 29.5971, longitude: 79.6591 },
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
      'Purba Bardhaman': { name: 'Purba Bardhaman', subDistricts: ['Bardhaman Sadar North', 'Bardhaman Sadar South', 'Kalna', 'Katwa'], agroClimaticZone: 'Alluvial Zone of West Bengal', latitude: 23.2324, longitude: 87.8615 },
      'Hooghly': { name: 'Hooghly', subDistricts: ['Chinsurah', 'Chandannagar', 'Srirampore', 'Arambagh', 'Singur'], agroClimaticZone: 'Gangetic Alluvial Zone', latitude: 22.9030, longitude: 88.3899 },
      'Nadia': { name: 'Nadia', subDistricts: ['Krishnanagar', 'Kalyani', 'Ranaghat', 'Tehatta'], agroClimaticZone: 'New Alluvial Zone', latitude: 23.4013, longitude: 88.4976 },
      'Murshidabad': { name: 'Murshidabad', subDistricts: ['Baharampur', 'Jangipur', 'Kandi', 'Lalbagh', 'Domkal'], agroClimaticZone: 'Gangetic Alluvial Zone', latitude: 24.0988, longitude: 88.2679 },
      'North 24 Parganas': { name: 'North 24 Parganas', subDistricts: ['Barasat', 'Basirhat', 'Barrackpore', 'Bongaon'], agroClimaticZone: 'Coastal Saline / Alluvial Zone', latitude: 22.7228, longitude: 88.4804 },
      'South 24 Parganas': { name: 'South 24 Parganas', subDistricts: ['Alipore', 'Baruipur', 'Canning', 'Diamond Harbour', 'Kakdwip'], agroClimaticZone: 'Coastal Saline Zone (Sundarbans)', latitude: 22.1462, longitude: 88.4354 },
      'Malda': { name: 'Malda', subDistricts: ['English Bazar (Malda)', 'Chanchal', 'Gazole', 'Kaliachak'], agroClimaticZone: 'Old Alluvial Zone', latitude: 25.0108, longitude: 88.1411 },
      'Jalpaiguri': { name: 'Jalpaiguri', subDistricts: ['Jalpaiguri', 'Malbazar', 'Dhupguri'], agroClimaticZone: 'Terai Zone', latitude: 26.5417, longitude: 88.7178 },
      'Darjeeling': { name: 'Darjeeling', subDistricts: ['Darjeeling Sadar', 'Kurseong', 'Mirik', 'Siliguri'], agroClimaticZone: 'Hilly Zone of North Bengal', latitude: 27.0410, longitude: 88.2663 },
    },
  },
  // UNION TERRITORIES (8)
  'Andaman and Nicobar Islands': {
    name: 'Andaman and Nicobar Islands',
    code: 'AN',
    type: 'Union Territory',
    capital: 'Port Blair',
    agroClimaticRegion: 'Island Region (Zone XV)',
    latitude: 11.6233,
    longitude: 92.7265,
    districts: {
      'South Andaman': { name: 'South Andaman (Port Blair)', subDistricts: ['Port Blair', 'Ferrargunj', 'Little Andaman'], agroClimaticZone: 'Humid Tropical Island Zone', latitude: 11.6233, longitude: 92.7265 },
      'North and Middle Andaman': { name: 'North and Middle Andaman', subDistricts: ['Mayabunder', 'Diglipur', 'Rangat'], agroClimaticZone: 'Tropical Island Agro-Zone', latitude: 12.9230, longitude: 92.9270 },
      'Nicobar': { name: 'Nicobar', subDistricts: ['Car Nicobar', 'Nancowry', 'Great Nicobar'], agroClimaticZone: 'Equatorial Island Zone', latitude: 7.0000, longitude: 93.8000 },
    },
  },
  'Chandigarh': {
    name: 'Chandigarh',
    code: 'CH',
    type: 'Union Territory',
    capital: 'Chandigarh',
    agroClimaticRegion: 'Trans-Gangetic Plains Region (Zone VI)',
    latitude: 30.7333,
    longitude: 76.7794,
    districts: {
      'Chandigarh': { name: 'Chandigarh', subDistricts: ['Chandigarh Urban', 'Manimajra'], agroClimaticZone: 'Sub-Mountain Plain Zone', latitude: 30.7333, longitude: 76.7794 },
    },
  },
  'Dadra and Nagar Haveli and Daman and Diu': {
    name: 'Dadra and Nagar Haveli and Daman and Diu',
    code: 'DN',
    type: 'Union Territory',
    capital: 'Daman',
    agroClimaticRegion: 'Gujarat Plains and Hills Region (Zone XIII)',
    latitude: 20.3974,
    longitude: 72.8328,
    districts: {
      'Dadra and Nagar Haveli': { name: 'Dadra and Nagar Haveli (Silvassa)', subDistricts: ['Silvassa', 'Khanvel'], agroClimaticZone: 'Coastal Western Plain Zone', latitude: 20.2766, longitude: 73.0083 },
      'Daman': { name: 'Daman', subDistricts: ['Daman', 'Moti Daman', 'Nani Daman'], agroClimaticZone: 'Coastal Zone', latitude: 20.3974, longitude: 72.8328 },
      'Diu': { name: 'Diu', subDistricts: ['Diu Town', 'Ghoghla'], agroClimaticZone: 'Saurashtra Coast Zone', latitude: 20.7144, longitude: 70.9822 },
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
      'North West Delhi': { name: 'North West Delhi', subDistricts: ['Kanjhawala', 'Rohini', 'Saraswati Vihar'], agroClimaticZone: 'Delhi Semi-Arid Agricultural Belt', latitude: 28.7300, longitude: 77.0500 },
      'South West Delhi': { name: 'South West Delhi', subDistricts: ['Dwarka', 'Najafgarh', 'Vasant Vihar'], agroClimaticZone: 'Peri-Urban Agriculture Zone', latitude: 28.5700, longitude: 76.9800 },
      'North Delhi': { name: 'North Delhi', subDistricts: ['Alipur', 'Narela', 'Model Town'], agroClimaticZone: 'Yamuna Floodplain Zone', latitude: 28.7500, longitude: 77.1300 },
      'South Delhi': { name: 'South Delhi', subDistricts: ['Saket', 'Hauz Khas', 'Mehrauli'], agroClimaticZone: 'Peri-Urban Eco-Zone', latitude: 28.5200, longitude: 77.2100 },
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
      'Srinagar': { name: 'Srinagar', subDistricts: ['Srinagar North', 'Srinagar South', 'Khanyar'], agroClimaticZone: 'Temperate Kashmir Valley Zone', latitude: 34.0837, longitude: 74.7973 },
      'Jammu': { name: 'Jammu', subDistricts: ['Jammu', 'RS Pura', 'Akhnoor', 'Bishnah'], agroClimaticZone: 'Sub-Tropical Plain Zone of Jammu', latitude: 32.7266, longitude: 74.8570 },
      'Anantnag': { name: 'Anantnag', subDistricts: ['Anantnag', 'Bijbehara', 'Pahalgam', 'Dooru'], agroClimaticZone: 'Highland Temperate Valley Zone', latitude: 33.7311, longitude: 75.1488 },
      'Baramulla': { name: 'Baramulla', subDistricts: ['Baramulla', 'Sopore', 'Pattan', 'Uri'], agroClimaticZone: 'Temperate Valley Zone', latitude: 34.2000, longitude: 74.3500 },
      'Pulwama': { name: 'Pulwama', subDistricts: ['Pulwama', 'Tral', 'Pampore', 'Awantipora'], agroClimaticZone: 'Valley Apple and Saffron Belt', latitude: 33.8712, longitude: 74.8970 },
      'Kathua': { name: 'Kathua', subDistricts: ['Kathua', 'Hiranagar', 'Basohli', 'Billawar'], agroClimaticZone: 'Sub-Tropical Kandi Zone', latitude: 32.3716, longitude: 75.5186 },
    },
  },
  'Ladakh': {
    name: 'Ladakh',
    code: 'LA',
    type: 'Union Territory',
    capital: 'Leh / Kargil',
    agroClimaticRegion: 'Western Himalayan Cold Arid Region (Zone I)',
    latitude: 34.1526,
    longitude: 77.5771,
    districts: {
      'Leh': { name: 'Leh', subDistricts: ['Leh Town', 'Nubra Valley', 'Khaltsi', 'Nyoma', 'Durbuk', 'Kharu'], agroClimaticZone: 'Cold Arid Highland Agro-Zone', latitude: 34.1526, longitude: 77.5771 },
      'Kargil': { name: 'Kargil', subDistricts: ['Kargil Town', 'Zanskar', 'Sankoo', 'Drass', 'Shakar Chiktan'], agroClimaticZone: 'High Altitude Cold Arid Zone', latitude: 34.5539, longitude: 76.1342 },
    },
  },
  'Lakshadweep': {
    name: 'Lakshadweep',
    code: 'LD',
    type: 'Union Territory',
    capital: 'Kavaratti',
    agroClimaticRegion: 'Island Region (Zone XV)',
    latitude: 10.5667,
    longitude: 72.6417,
    districts: {
      'Lakshadweep': { name: 'Lakshadweep (Kavaratti)', subDistricts: ['Kavaratti', 'Agatti', 'Amini', 'Andrott', 'Minicoy', 'Kalpeni', 'Kadmat'], agroClimaticZone: 'Tropical Coral Reef Eco-Zone', latitude: 10.5667, longitude: 72.6417 },
    },
  },
  'Puducherry': {
    name: 'Puducherry',
    code: 'PY',
    type: 'Union Territory',
    capital: 'Puducherry',
    agroClimaticRegion: 'East Coast Plains and Hills Region (Zone XI)',
    latitude: 11.9416,
    longitude: 79.8083,
    districts: {
      'Puducherry': { name: 'Puducherry', subDistricts: ['Puducherry Town', 'Ozhukarai', 'Villianur', 'Bahour'], agroClimaticZone: 'Coastal Alluvial Plain Zone', latitude: 11.9416, longitude: 79.8083 },
      'Karaikal': { name: 'Karaikal', subDistricts: ['Karaikal Town', 'Thirunallar', 'Kottucherry', 'Nedungadu'], agroClimaticZone: 'Cauvery Delta Coastal Zone', latitude: 10.9254, longitude: 79.8380 },
      'Mahe': { name: 'Mahe', subDistricts: ['Mahe Town'], agroClimaticZone: 'West Coast Coastal Zone', latitude: 11.7002, longitude: 75.5347 },
      'Yanam': { name: 'Yanam', subDistricts: ['Yanam Town'], agroClimaticZone: 'Godavari Delta Coastal Zone', latitude: 16.7328, longitude: 82.2173 },
    },
  },
};

// Present-day complete official district registry (2025/2026) for all 28 States & 8 Union Territories
export const ALL_INDIA_PRESENT_DISTRICTS: Record<string, string[]> = {
  'Andhra Pradesh': [
    'Alluri Sitharama Raju', 'Anakapalli', 'Ananthapuramu', 'Annamayya', 'Bapatla',
    'Chittoor', 'Dr. B.R. Ambedkar Konaseema', 'East Godavari', 'Eluru', 'Guntur',
    'Kakinada', 'Krishna', 'Kurnool', 'Nandyal', 'NTR', 'Palnadu',
    'Parvathipuram Manyam', 'Prakasam', 'Sri Potti Sriramulu Nellore', 'Sri Sathya Sai',
    'Srikakulam', 'Tirupati', 'Visakhapatnam', 'Vizianagaram', 'West Godavari', 'YSR Kadapa'
  ],
  'Arunachal Pradesh': [
    'Anjaw', 'Changlang', 'Dibang Valley', 'East Kameng', 'East Siang', 'Itanagar Capital Complex',
    'Kamle', 'Kra Daadi', 'Kurung Kumey', 'Lepa Rada', 'Lohit', 'Longding',
    'Lower Dibang Valley', 'Lower Siang', 'Lower Subansiri', 'Namsai', 'Pakke Kessang',
    'Papum Pare', 'Shi Yomi', 'Siang', 'Tawang', 'Tirap', 'Upper Siang',
    'Upper Subansiri', 'West Kameng', 'West Siang'
  ],
  'Assam': [
    'Baksa', 'Barpeta', 'Biswanath', 'Bongaigaon', 'Cachar', 'Charaideo', 'Chirang',
    'Darrang', 'Dhemaji', 'Dhubri', 'Dibrugarh', 'Dima Hasao', 'Goalpara', 'Golaghat',
    'Hailakandi', 'Hojai', 'Jorhat', 'Kamrup', 'Kamrup Metropolitan', 'Karbi Anglong',
    'Karimganj', 'Kokrajhar', 'Lakhimpur', 'Majuli', 'Morigaon', 'Nagaon', 'Nalbari',
    'Sivasagar', 'Sonitpur', 'South Salmara-Mankachar', 'Tinsukia', 'Udalguri', 'West Karbi Anglong'
  ],
  'Bihar': [
    'Araria', 'Arwal', 'Aurangabad', 'Banka', 'Begusarai', 'Bhagalpur', 'Bhojpur',
    'Buxar', 'Darbhanga', 'East Champaran', 'Gaya', 'Gopalganj', 'Jamui', 'Jehanabad',
    'Kaimur', 'Katihar', 'Khagaria', 'Kishanganj', 'Lakhisarai', 'Madhepura', 'Madhubani',
    'Munger', 'Muzaffarpur', 'Nalanda', 'Nawada', 'Patna', 'Purnia', 'Rohtas',
    'Saharsa', 'Samastipur', 'Saran', 'Sheikhpura', 'Sheohar', 'Sitamarhi', 'Siwan',
    'Supaul', 'Vaishali', 'West Champaran'
  ],
  'Chhattisgarh': [
    'Balod', 'Baloda Bazar', 'Balrampur', 'Bemetara', 'Bijapur', 'Bilaspur', 'Dantewada',
    'Dhamtari', 'Durg', 'Gariaband', 'Gaurela-Pendra-Marwahi', 'Janjgir-Champa', 'Jashpur',
    'Kabirdham', 'Kanker', 'Khairagarh-Chhuikhadan-Gandai', 'Kondagaon', 'Korba', 'Koriya',
    'Mahasamund', 'Manendragarh-Chirmiri-Bharatpur', 'Mohla-Manpur-Ambagarh Chowki',
    'Mungeli', 'Narayanpur', 'Raigarh', 'Raipur', 'Rajnandgaon', 'Sarangarh-Bilaigarh',
    'Sakti', 'Sukma', 'Surajpur', 'Surguja'
  ],
  'Goa': [
    'North Goa', 'South Goa'
  ],
  'Gujarat': [
    'Ahmedabad', 'Amreli', 'Anand', 'Aravalli', 'Banaskantha', 'Bharuch', 'Bhavnagar',
    'Botad', 'Chhota Udaipur', 'Dahod', 'Dang', 'Devbhumi Dwarka', 'Gandhinagar',
    'Gir Somnath', 'Jamnagar', 'Junagadh', 'Kheda', 'Kutch', 'Mahisagar', 'Mehsana',
    'Morbi', 'Narmada', 'Navsari', 'Panchmahal', 'Patan', 'Porbandar', 'Rajkot',
    'Sabarkantha', 'Surat', 'Surendranagar', 'Tapi', 'Vadodara', 'Valsad'
  ],
  'Haryana': [
    'Ambala', 'Bhiwani', 'Charkhi Dadri', 'Faridabad', 'Fatehabad', 'Gurugram',
    'Hisar', 'Jhajjar', 'Jind', 'Kaithal', 'Karnal', 'Kurukshetra', 'Mahendragarh',
    'Nuh', 'Palwal', 'Panchkula', 'Panipat', 'Rewari', 'Rohtak', 'Sirsa', 'Sonipat', 'Yamunanagar'
  ],
  'Himachal Pradesh': [
    'Bilaspur', 'Chamba', 'Hamirpur', 'Kangra', 'Kinnaur', 'Kullu', 'Lahaul and Spiti',
    'Mandi', 'Shimla', 'Sirmaur', 'Solan', 'Una'
  ],
  'Jharkhand': [
    'Bokaro', 'Chatra', 'Deoghar', 'Dhanbad', 'Dumka', 'East Singhbhum', 'Garhwa',
    'Giridih', 'Godda', 'Gumla', 'Hazaribagh', 'Jamtara', 'Khunti', 'Koderma',
    'Latehar', 'Lohardaga', 'Pakur', 'Palamu', 'Ramgarh', 'Ranchi', 'Sahibganj',
    'Seraikela Kharsawan', 'Simdega', 'West Singhbhum'
  ],
  'Karnataka': [
    'Bagalkot', 'Ballari', 'Belagavi', 'Bengaluru Rural', 'Bengaluru Urban', 'Bidar',
    'Chamarajanagar', 'Chikkaballapura', 'Chikkamagaluru', 'Chitradurga', 'Dakshina Kannada',
    'Davanagere', 'Dharwad', 'Gadag', 'Hassan', 'Haveri', 'Kalaburagi', 'Kodagu', 'Kolar',
    'Koppal', 'Mandya', 'Mysuru', 'Raichur', 'Ramanagara', 'Shivamogga', 'Tumakuru',
    'Udupi', 'Uttara Kannada', 'Vijayanagara', 'Vijayapura', 'Yadgir'
  ],
  'Kerala': [
    'Alappuzha', 'Ernakulam', 'Idukki', 'Kannur', 'Kasaragod', 'Kollam', 'Kottayam',
    'Kozhikode', 'Malappuram', 'Palakkad', 'Pathanamthitta', 'Thiruvananthapuram',
    'Thrissur', 'Wayanad'
  ],
  'Madhya Pradesh': [
    'Agar Malwa', 'Alirajpur', 'Anuppur', 'Ashoknagar', 'Balaghat', 'Barwani', 'Betul',
    'Bhind', 'Bhopal', 'Burhanpur', 'Chhatarpur', 'Chhindwara', 'Damoh', 'Datia', 'Dewas',
    'Dhar', 'Dindori', 'Guna', 'Gwalior', 'Harda', 'Narmadapuram', 'Indore', 'Jabalpur',
    'Jhabua', 'Katni', 'Khandwa', 'Khargone', 'Maihar', 'Mandla', 'Mandsaur', 'Mauganj',
    'Morena', 'Narsinghpur', 'Neemuch', 'Niwari', 'Pandhurna', 'Panna', 'Raisen', 'Rajgarh',
    'Ratlam', 'Rewa', 'Sagar', 'Satna', 'Sehore', 'Seoni', 'Shahdol', 'Shajapur', 'Sheopur',
    'Shivpuri', 'Sidhi', 'Singrauli', 'Tikamgarh', 'Ujjain', 'Umaria', 'Vidisha'
  ],
  'Maharashtra': [
    'Ahilyanagar', 'Akola', 'Amravati', 'Chhatrapati Sambhajinagar', 'Bhandara', 'Beed',
    'Buldhana', 'Chandrapur', 'Dhule', 'Gadchiroli', 'Gondia', 'Hingoli', 'Jalgaon',
    'Jalna', 'Kolhapur', 'Latur', 'Mumbai City', 'Mumbai Suburban', 'Nagpur', 'Nanded',
    'Nandurbar', 'Nashik', 'Dharashiv', 'Palghar', 'Parbhani', 'Pune', 'Raigad', 'Ratnagiri',
    'Sangli', 'Satara', 'Sindhudurg', 'Solapur', 'Thane', 'Wardha', 'Washim', 'Yavatmal'
  ],
  'Manipur': [
    'Bishnupur', 'Chandel', 'Churachandpur', 'Imphal East', 'Imphal West', 'Jiribam',
    'Kakching', 'Kamjong', 'Kangpokpi', 'Noney', 'Pherzawl', 'Senapati', 'Tamenglong',
    'Tengnoupal', 'Thoubal', 'Ukhrul'
  ],
  'Meghalaya': [
    'East Garo Hills', 'East Jaintia Hills', 'East Khasi Hills', 'Eastern West Khasi Hills',
    'North Garo Hills', 'Ri Bhoi', 'South Garo Hills', 'South West Garo Hills',
    'South West Khasi Hills', 'West Garo Hills', 'West Jaintia Hills', 'West Khasi Hills'
  ],
  'Mizoram': [
    'Aizawl', 'Champhai', 'Hnahthial', 'Khawzawl', 'Kolasib', 'Lawngtlai', 'Lunglei',
    'Mamit', 'Saiha', 'Saitual', 'Serchhip'
  ],
  'Nagaland': [
    'Chümoukedima', 'Dimapur', 'Kiphire', 'Kohima', 'Longleng', 'Mokokchung', 'Mon',
    'Niuland', 'Noklak', 'Peren', 'Phek', 'Shamator', 'Tseminyu', 'Tuensang', 'Wokha', 'Zunheboto'
  ],
  'Odisha': [
    'Angul', 'Balangir', 'Balasore', 'Bargarh', 'Bhadrak', 'Boudh', 'Cuttack', 'Deogarh',
    'Dhenkanal', 'Gajapati', 'Ganjam', 'Jagatsinghpur', 'Jajpur', 'Jharsuguda', 'Kalahandi',
    'Kandhamal', 'Kendrapara', 'Kendujhar', 'Khordha', 'Koraput', 'Malkangiri', 'Mayurbhanj',
    'Nabarangpur', 'Nayagarh', 'Nuapada', 'Puri', 'Rayagada', 'Sambalpur', 'Subarnapur', 'Sundargarh'
  ],
  'Punjab': [
    'Amritsar', 'Barnala', 'Bathinda', 'Faridkot', 'Fatehgarh Sahib', 'Fazilka', 'Firozpur',
    'Gurdaspur', 'Hoshiarpur', 'Jalandhar', 'Kapurthala', 'Ludhiana', 'Malerkotla', 'Mansa',
    'Moga', 'Pathankot', 'Patiala', 'Rupnagar', 'Sahibzada Ajit Singh Nagar', 'Sangrur',
    'Shahid Bhagat Singh Nagar', 'Sri Muktsar Sahib', 'Tarn Taran'
  ],
  'Rajasthan': [
    'Ajmer', 'Alwar', 'Anupgarh', 'Balotra', 'Banswara', 'Baran', 'Barmer', 'Beawar',
    'Bharatpur', 'Bhilwara', 'Bikaner', 'Bundi', 'Chittorgarh', 'Churu', 'Dausa', 'Deeg',
    'Dholpur', 'Didwana-Kuchaman', 'Dungarpur', 'Sri Ganganagar', 'Gangapur City', 'Hanumangarh',
    'Jaipur', 'Jaipur Rural', 'Jaisalmer', 'Jalore', 'Jhalawar', 'Jhunjhunu', 'Jodhpur',
    'Jodhpur Rural', 'Kekri', 'Kota', 'Kotputli-Behror', 'Khairthal-Tijara', 'Nagaur',
    'Neem Ka Thana', 'Pali', 'Phalodi', 'Pratapgarh', 'Rajsamand', 'Salumbar', 'Sanchore',
    'Sawai Madhopur', 'Shahpura', 'Sikar', 'Sirohi', 'Tonk', 'Udaipur'
  ],
  'Sikkim': [
    'Gangtok', 'Gyalshing', 'Mangan', 'Namchi', 'Pakyong', 'Soreng'
  ],
  'Tamil Nadu': [
    'Ariyalur', 'Chengalpattu', 'Chennai', 'Coimbatore', 'Cuddalore', 'Dharmapuri',
    'Dindigul', 'Erode', 'Kallakurichi', 'Kanchipuram', 'Kanyakumari', 'Karur', 'Krishnagiri',
    'Madurai', 'Mayiladuthurai', 'Nagapattinam', 'Namakkal', 'Nilgiris', 'Perambalur',
    'Pudukkottai', 'Ramanathapuram', 'Ranipet', 'Salem', 'Sivaganga', 'Tenkasi', 'Thanjavur',
    'Theni', 'Thoothukudi', 'Tiruchirappalli', 'Tirunelveli', 'Tirupathur', 'Tiruppur',
    'Tiruvallur', 'Tiruvannamalai', 'Tiruvarur', 'Vellore', 'Viluppuram', 'Virudhunagar'
  ],
  'Telangana': [
    'Adilabad', 'Bhadradri Kothagudem', 'Hanumakonda', 'Hyderabad', 'Jagtial', 'Jangaon',
    'Jayashankar Bhupalpally', 'Jogulamba Gadwal', 'Kamareddy', 'Karimnagar', 'Khammam',
    'Kumuram Bheem Asifabad', 'Mahabubabad', 'Mahabubnagar', 'Mancherial', 'Medak',
    'Medchal-Malkajgiri', 'Mulugu', 'Nagarkurnool', 'Nalgonda', 'Narayanpet', 'Nirmal',
    'Nizamabad', 'Peddapalli', 'Rajanna Sircilla', 'Rangareddy', 'Sangareddy', 'Siddipet',
    'Suryapet', 'Vikarabad', 'Wanaparthy', 'Warangal', 'Yadadri Bhuvanagiri'
  ],
  'Tripura': [
    'Dhalai', 'Gomati', 'Khowai', 'North Tripura', 'Sepahijala', 'South Tripura', 'Unakoti', 'West Tripura'
  ],
  'Uttar Pradesh': [
    'Agra', 'Aligarh', 'Ambedkar Nagar', 'Amethi', 'Amroha', 'Auraiya', 'Ayodhya',
    'Azamgarh', 'Baghpat', 'Bahraich', 'Ballia', 'Balrampur', 'Banda', 'Barabanki',
    'Bareilly', 'Basti', 'Bhadohi', 'Bijnor', 'Budaun', 'Bulandshahr', 'Chandauli',
    'Chitrakoot', 'Deoria', 'Etah', 'Etawah', 'Farrukhabad', 'Fatehpur', 'Firozabad',
    'Gautam Buddha Nagar', 'Ghaziabad', 'Ghazipur', 'Gonda', 'Gorakhpur', 'Hamirpur',
    'Hapur', 'Hardoi', 'Hathras', 'Jalaun', 'Jaunpur', 'Jhansi', 'Kannauj', 'Kanpur Dehat',
    'Kanpur Nagar', 'Kasganj', 'Kaushambi', 'Lakhimpur Kheri', 'Lalitpur', 'Lucknow',
    'Maharajganj', 'Mahoba', 'Mainpuri', 'Mathura', 'Mau', 'Meerut', 'Mirzapur',
    'Moradabad', 'Muzaffarnagar', 'Pilibhit', 'Pratapgarh', 'Prayagraj', 'Raebareli',
    'Rampur', 'Saharanpur', 'Sambhal', 'Sant Kabir Nagar', 'Shahjahanpur', 'Shamli',
    'Shravasti', 'Siddharthnagar', 'Sitapur', 'Sonbhadra', 'Sultanpur', 'Unnao', 'Varanasi'
  ],
  'Uttarakhand': [
    'Almora', 'Bageshwar', 'Chamoli', 'Champawat', 'Dehradun', 'Haridwar', 'Nainital',
    'Pauri Garhwal', 'Pithoragarh', 'Rudraprayag', 'Tehri Garhwal', 'Udham Singh Nagar', 'Uttarkashi'
  ],
  'West Bengal': [
    'Alipurduar', 'Bankura', 'Paschim Bardhaman', 'Purba Bardhaman', 'Birbhum', 'Cooch Behar',
    'Darjeeling', 'Uttar Dinajpur', 'Dakshin Dinajpur', 'Hooghly', 'Howrah', 'Jalpaiguri',
    'Jhargram', 'Kalimpong', 'Kolkata', 'Malda', 'Murshidabad', 'Nadia', 'North 24 Parganas',
    'Paschim Medinipur', 'Purba Medinipur', 'Purulia', 'South 24 Parganas'
  ],
  'Andaman and Nicobar Islands': [
    'Nicobar', 'North and Middle Andaman', 'South Andaman'
  ],
  'Chandigarh': [
    'Chandigarh'
  ],
  'Dadra and Nagar Haveli and Daman and Diu': [
    'Dadra and Nagar Haveli', 'Daman', 'Diu'
  ],
  'Delhi (NCT)': [
    'Central Delhi', 'East Delhi', 'New Delhi', 'North Delhi', 'North East Delhi',
    'North West Delhi', 'Shahdara', 'South Delhi', 'South East Delhi', 'South West Delhi', 'West Delhi'
  ],
  'Jammu and Kashmir': [
    'Anantnag', 'Bandipora', 'Baramulla', 'Budgam', 'Doda', 'Ganderbal', 'Jammu',
    'Kathua', 'Kishtwar', 'Kulgam', 'Kupwara', 'Poonch', 'Pulwama', 'Rajouri',
    'Ramban', 'Reasi', 'Samba', 'Shopian', 'Srinagar', 'Udhampur'
  ],
  'Ladakh': [
    'Kargil', 'Leh'
  ],
  'Lakshadweep': [
    'Lakshadweep'
  ],
  'Puducherry': [
    'Karaikal', 'Mahe', 'Puducherry', 'Yanam'
  ]
};

// Enrich INDIA_GEOGRAPHIC_HIERARCHY with any missing districts from ALL_INDIA_PRESENT_DISTRICTS
Object.entries(ALL_INDIA_PRESENT_DISTRICTS).forEach(([stName, dList]) => {
  const stInfo = INDIA_GEOGRAPHIC_HIERARCHY[stName];
  if (stInfo) {
    dList.forEach(dist => {
      if (!stInfo.districts[dist]) {
        // Find if there's a close key already
        const existingKey = Object.keys(stInfo.districts).find(
          k => k.toLowerCase() === dist.toLowerCase() ||
               k.toLowerCase().includes(dist.toLowerCase()) ||
               dist.toLowerCase().includes(k.toLowerCase())
        );
        if (!existingKey) {
          stInfo.districts[dist] = {
            name: dist,
            subDistricts: [`${dist} North`, `${dist} South`, `${dist} Central`],
            agroClimaticZone: stInfo.agroClimaticRegion,
            latitude: stInfo.latitude,
            longitude: stInfo.longitude,
          };
        }
      }
    });
  }
});

// Generic list of Indian States and Union Territories for dropdowns
export function getIndiaStates(): string[] {
  return Object.keys(INDIA_GEOGRAPHIC_HIERARCHY).sort();
}

// Get districts for a specific Indian State / Union Territory
export function getIndiaDistricts(stateName: string): string[] {
  if (!stateName) return [];
  const stateInfo = INDIA_GEOGRAPHIC_HIERARCHY[stateName];
  if (stateInfo) return Object.keys(stateInfo.districts).sort();

  const clean = stateName.toLowerCase().replace(/\b(state|union territory|ut)\b/gi, '').trim();
  const matchedKey = Object.keys(INDIA_GEOGRAPHIC_HIERARCHY).find(
    k => k.toLowerCase() === clean ||
         k.toLowerCase().replace(/\b(state|union territory|ut)\b/gi, '').trim() === clean ||
         k.toLowerCase().includes(clean) ||
         clean.includes(k.toLowerCase())
  );

  if (matchedKey && INDIA_GEOGRAPHIC_HIERARCHY[matchedKey]) {
    return Object.keys(INDIA_GEOGRAPHIC_HIERARCHY[matchedKey].districts).sort();
  }

  return [];
}

// Get sub-districts for state & district
export function getIndiaSubDistricts(stateName: string, districtName: string): string[] {
  if (!stateName) return [];
  let stateInfo = INDIA_GEOGRAPHIC_HIERARCHY[stateName];
  if (!stateInfo) {
    const clean = stateName.toLowerCase().replace(/\b(state|union territory|ut)\b/gi, '').trim();
    const matchedKey = Object.keys(INDIA_GEOGRAPHIC_HIERARCHY).find(
      k => k.toLowerCase() === clean ||
           k.toLowerCase().replace(/\b(state|union territory|ut)\b/gi, '').trim() === clean ||
           k.toLowerCase().includes(clean) ||
           clean.includes(k.toLowerCase())
    );
    if (matchedKey) stateInfo = INDIA_GEOGRAPHIC_HIERARCHY[matchedKey];
  }
  if (!stateInfo) return [];

  const districtInfo = stateInfo.districts[districtName] ||
    Object.values(stateInfo.districts).find(d => d.name.toLowerCase() === districtName.toLowerCase());

  if (!districtInfo) return [];
  return districtInfo.subDistricts;
}

// Get authoritative coordinates for an Indian district from official registry
export function getAuthoritativeDistrictCoordinates(
  stateName: string,
  districtName: string
): { latitude: number; longitude: number } | null {
  if (!stateName || !districtName) return null;
  let stateInfo = INDIA_GEOGRAPHIC_HIERARCHY[stateName];
  if (!stateInfo) {
    const clean = stateName.toLowerCase().replace(/\b(state|union territory|ut)\b/gi, '').trim();
    const matchedKey = Object.keys(INDIA_GEOGRAPHIC_HIERARCHY).find(
      k => k.toLowerCase() === clean ||
           k.toLowerCase().replace(/\b(state|union territory|ut)\b/gi, '').trim() === clean ||
           k.toLowerCase().includes(clean) ||
           clean.includes(k.toLowerCase())
    );
    if (matchedKey) stateInfo = INDIA_GEOGRAPHIC_HIERARCHY[matchedKey];
  }
  if (!stateInfo) return null;

  const districtInfo = stateInfo.districts[districtName] ||
    Object.values(stateInfo.districts).find(d => d.name.toLowerCase() === districtName.toLowerCase());

  if (districtInfo && typeof districtInfo.latitude === 'number' && typeof districtInfo.longitude === 'number') {
    return {
      latitude: districtInfo.latitude,
      longitude: districtInfo.longitude,
    };
  }
  return null;
}

// Resolve geographic hierarchy from coordinates or text location
export function resolveIndianGeographicContext(
  country: string,
  stateRegion?: string,
  locationName?: string,
  latitude?: number | null,
  longitude?: number | null
): IndianGeographicContext {
  const isIndia = !country || country.toLowerCase() === 'india' || country.toLowerCase() === 'in';

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

  // 1. Match State by exact or partial string matching (stripping 'State' / 'UT' suffix and case-insensitive)
  const normStateInput = cleanState.toLowerCase().replace(/\b(state|union territory|ut)\b/gi, '').trim();
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
    matchedStateKey = stateKeys.find((s) => cleanLoc.toLowerCase().includes(s.toLowerCase()));

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

  // If still not matched, check nearest state by lat/lng coordinates
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
