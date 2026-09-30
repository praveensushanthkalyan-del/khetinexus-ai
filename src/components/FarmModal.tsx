import React, { useState, useEffect } from 'react';
import {
  X,
  MapPin,
  Sprout,
  Compass,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Globe,
  Layers,
  Droplets,
  Satellite,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCountry } from '../context/CountryContext';
import { Language, UserFarm, LocationMetadata, FarmLocation } from '../types';
import { getTranslation } from '../i18n/translations';
import {
  localizeCrop,
  localizeGrowthStage,
  localizeSoilType,
  localizeIrrigation,
  localizeState,
  localizeDistrict,
  localizeSubDistrict,
  localizeFarmUnit,
  localizeFarmingType,
  formatFarmValue,
  getFarmProfileUILabels,
  normalizeLang,
} from '../i18n/dataTranslations';
import {
  CROPS_LIST,
  GROWTH_STAGES,
  SOIL_TYPES,
  IRRIGATION_TYPES,
} from './FarmProfileView';
import { getIndiaStates, getIndiaDistricts, getIndiaSubDistricts, getAuthoritativeDistrictCoordinates, resolveIndianGeographicContext } from '../data/indiaGeographicHierarchy';

interface FarmModalProps {
  currentLanguage: Language;
}

export const FarmModal: React.FC<FarmModalProps> = ({ currentLanguage }) => {
  const t = getTranslation(currentLanguage);
  const fpLabels = getFarmProfileUILabels(currentLanguage);
  const { activeCountry, countryAdapter } = useCountry();

  const getLocalizedGeoMsg = (key: string, args?: Record<string, string | number>) => {
    const clean = (currentLanguage || 'en').split('-')[0].toLowerCase();
    const map: Record<string, Record<string, string>> = {
      te: {
        locating: 'గుర్తిస్తోంది...',
        permissionDenied: 'స్థాన అనుమతి నిరాకరించబడింది. దయచేసి అనుమతించి మళ్లీ ప్రయత్నించండి.',
        unableDetermine: 'మీ ప్రస్తుత స్థానాన్ని గుర్తించలేకపోయాము. పరికర స్థాన సెట్టింగ్‌లను తనిఖీ చేయండి.',
        notDetermined: 'జీపీఎస్ పొందింది, కానీ చిరునామాను గుర్తించలేకపోయాము. మీరు మానవీయంగా నమోదు చేయవచ్చు. ({lat}°, {lng}°)',
        reverseFailed: 'జీపీఎస్ పొందింది, కానీ రివర్స్-జీయోకోడింగ్ విఫలమైంది. మీరు మానవీయంగా నమోదు చేయవచ్చు. ({lat}°, {lng}°)',
        selectStateDist: 'దయచేసి మొదట రాష్ట్రం మరియు జిల్లాను ఎంచుకోండి.',
        resolvingCoords: 'చిరునామా కోఆర్డినేట్లను గుర్తిస్తోంది...',
        geocoded: 'జియోకోడ్ చేయబడింది: {lat}°, {lng}° ({details})',
        resolvedDist: 'జిల్లా కోఆర్డినేట్లు గుర్తించబడ్డాయి: {lat}°, {lng}° ({dist}, {st})',
        couldNotResolve: '"{locQuery}" కోసం కోఆర్డినేట్లను గుర్తించలేకపోయాము. దయచేసి సరైన జిల్లాను ఎంచుకోండి.',
        latError: 'అక్షాంశం -90 మరియు 90 డిగ్రీల మధ్య ఉండాలి.',
        lngError: 'రేఖాంశం -180 మరియు 180 డిగ్రీల మధ్య ఉండాలి.',
        gpsAcquired: 'జీపీఎస్ స్థానం పొందబడింది: {details}',
        outsideCountry: 'మీ జీపీఎస్ స్థానం ఎంచుకున్న దేశం వెలుపల ఉన్నట్లుంది ({countryName}). దయచేసి దేశాన్ని మార్చండి.',
        notDeterminedShort: 'జీపీఎస్ పొందింది: {lat}°, {lng}° (ఖచ్చితత్వం: ±{acc}మీ). పూర్తి చేయడానికి రాష్ట్రం మరియు జిల్లాను ఎంచుకోండి.',
        gpsOffline: 'జీపీఎస్ పొందబడింది ({lat}°, {lng}°). రివర్స్ జియోకోడింగ్ ఆఫ్‌లైన్.',
        resolveAuth: 'అధికారిక కోఆర్డినేట్లను గుర్తిస్తోంది...',
        gpsAcquiredAcc: 'జీపీఎస్ స్థానం పొందబడింది: {details} (ఖచ్చితత్వం: ±{acc}మీ)',
        enterNameError: 'దయచేసి పంట పేరు నమోదు చేయండి లేదా ఎంచుకోండి.'
      },
      hi: {
        locating: 'ढूंढ रहा है...',
        permissionDenied: 'स्थान अनुमति अस्वीकार कर दी गई थी। कृपया अनुमति दें और पुनः प्रयास करें।',
        unableDetermine: 'आपके वर्तमान स्थान का निर्धारण करने में असमर्थ। कृपया डिवाइस स्थान सेटिंग्स जांचें।',
        notDetermined: 'जीपीएस प्राप्त हुआ, लेकिन पता निर्धारित नहीं किया जा सका। आप मैन्युअल रूप से दर्ज कर सकते हैं। ({lat}°, {lng}°)',
        reverseFailed: 'जीपीएस प्राप्त हुआ, लेकिन रिवर्स-जियोकोडिंग विफल रही। आप मैन्युअल रूप से दर्ज कर सकते हैं। ({lat}°, {lng}°)',
        selectStateDist: 'कृपया पहले राज्य और जिला चुनें।',
        resolvingCoords: 'स्थान के लिए निर्देशांक हल किए जा रहे हैं...',
        geocoded: 'जियोकोडेड: {lat}°, {lng}° ({details})',
        resolvedDist: 'जिला निर्देशांक हल किए गए: {lat}°, {lng}° ({dist}, {st})',
        couldNotResolve: '"{locQuery}" के लिए निर्देशांक हल नहीं किए जा सके। कृपया एक मान्य जिला चुनें।',
        latError: 'अक्षांश -90 और 90 डिग्री के बीच होना चाहिए।',
        lngError: 'रेखांश -180 और 180 डिग्री के बीच होना चाहिए।',
        gpsAcquired: 'जीपीएस स्थान प्राप्त हुआ: {details}',
        outsideCountry: 'ऐसा प्रतीत होता है कि आपका जीपीएस स्थान चयनित देश ({countryName}) से बाहर है। कृपया देश बदलें।',
        notDeterminedShort: 'जीपीएस प्राप्त हुआ: {lat}°, {lng}° (सटीकता: ±{acc}मी)। पूरा करने के लिए राज्य और जिला चुनें।',
        gpsOffline: 'जीपीएस प्राप्त हुआ ({lat}°, {lng}°)। रिवर्स जियोकोडिंग ऑफ़लाइन है।',
        resolveAuth: 'आधिकारिक निर्देशांक प्राप्त किए जा रहे हैं...',
        gpsAcquiredAcc: 'जीपीएस स्थान प्राप्त हुआ: {details} (सटीकता: ±{acc}मी)',
        enterNameError: 'कृपया फसल का नाम दर्ज करें या चुनें।'
      },
      ta: {
        locating: 'இருப்பிடத்தைக் கண்டறிகிறது...',
        permissionDenied: 'இருப்பிட அனுமதி மறுக்கப்பட்டது. தயவுசெய்து அனுமதித்து மீண்டும் முயற்சிக்கவும்.',
        unableDetermine: 'உங்கள் தற்போதைய இருப்பிடத்தைக் கண்டறிய முடியவில்லை. சாதன அமைப்புகளைச் சரிபார்க்கவும்.',
        notDetermined: 'ஜிபிஎஸ் பெறப்பட்டது, ஆனால் முகவரியைக் கண்டறிய முடியவில்லை. நீங்கள் கைமுறையாக உள்ளிடலாம். ({lat}°, {lng}°)',
        reverseFailed: 'ஜிபிஎஸ் பெறப்பட்டது, ஆனால் ரிவர்ஸ்-ஜியோகோடிங் தோல்வியடைந்தது. நீங்கள் கைமுறையாக உள்ளிடலாம். ({lat}°, {lng}°)',
        selectStateDist: 'தயவுசெய்து முதலில் மாநிலம் மற்றும் மாவட்டத்தைத் தேர்ந்தெடுக்கவும்.',
        resolvingCoords: 'முகவரியின் ஒருங்கிணைப்புகளைக் கண்டறிகிறது...',
        geocoded: 'ஜியோகோடிங் செய்யப்பட்டது: {lat}°, {lng}° ({details})',
        resolvedDist: 'மாவட்ட ஒருங்கிணைப்புகள் கண்டறியப்பட்டன: {lat}°, {lng}° ({dist}, {st})',
        couldNotResolve: '"{locQuery}" க்கான ஒருங்கிணைப்புகளைக் கண்டறிய முடியவில்லை. தயவுசெய்து சரியான மாவட்டத்தைத் தேர்ந்தெடுக்கவும்.',
        latError: 'அட்சரேகை -90 முதல் 90 டிகிரி வரை இருக்க வேண்டும்.',
        lngError: 'தீர்க்கரேகை -180 முதல் 180 டிகிரி வரை இருக்க வேண்டும்.',
        gpsAcquired: 'ஜிபிஎஸ் இருப்பிடம் பெறப்பட்டது: {details}',
        outsideCountry: 'உங்கள் ஜிபிஎஸ் இருப்பிடம் தேர்ந்தெடுக்கப்பட்ட நாட்டிற்கு வெளியே ({countryName}) உள்ளது போல் தெரிகிறது. தயவுசெய்து நாட்டை மாற்றவும்.',
        notDeterminedShort: 'ஜிபிஎஸ் பெறப்பட்டது: {lat}°, {lng}° (துல்லியம்: ±{acc}மீ). பூர்த்தி செய்ய மாநிலம் மற்றும் மாவட்டத்தைத் தேர்ந்தெடுக்கவும்.',
        gpsOffline: 'ஜிபிஎஸ் பெறப்பட்டது ({lat}°, {lng}°). தலைகீழ் ஜியோகோடிங் ஆஃப்லைன்.',
        resolveAuth: 'அதிகாரப்பூர்வ ஒருங்கிணைப்புகளைக் கண்டறிகிறது...',
        gpsAcquiredAcc: 'ஜிபிஎஸ் இருப்பிடம் பெறப்பட்டது: {details} (துல்லியம்: ±{acc}மீ)',
        enterNameError: 'தயவுசெய்து பயிர் பெயரை உள்ளிடவும் அல்லது தேர்ந்தெடுக்கவும்.'
      },
      kn: {
        locating: 'ಗುರುತಿಸಲಾಗುತ್ತಿದೆ...',
        permissionDenied: 'ಸ್ಥಳದ ಅನುಮತಿ ನಿರಾಕರಿಸಲಾಗಿದೆ. ದಯವಿಟ್ಟು ಅನುಮತಿಸಿ ಮತ್ತು ಮತ್ತೊಮ್ಮೆ ಪ್ರಯತ್ನಿಸಿ.',
        unableDetermine: 'ನಿಮ್ಮ ಪ್ರಸ್ತುತ ಸ್ಥಳವನ್ನು ನಿರ್ಧರಿಸಲು ಸಾಧ್ಯವಾಗುತ್ತಿಲ್ಲ. ಸಾಧನದ ಸ್ಥಳ ಸೆಟ್ಟಿಂಗ್‌ಗಳನ್ನು ಪರಿಶೀಲಿಸಿ.',
        notDetermined: 'ಜಿಪಿಎಸ್ ಪಡೆದಿದೆ, ಆದರೆ ವಿಳಾಸವನ್ನು ನಿರ್ಧರಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ನೀವು ಹಸ್ತಚಾಲಿತವಾಗಿ ನಮೂದಿಸಬಹುದು. ({lat}°, {lng}°)',
        reverseFailed: 'ಜಿಪಿಎಸ್ ಪಡೆದಿದೆ, ಆದರೆ ರಿವರ್ಸ್-ಜಿಯೋಕೋಡಿಂಗ್ ವಿಫಲವಾಗಿದೆ. ನೀವು ಹಸ್ತಚಾಲಿತವಾಗಿ ನಮೂದಿಸಬಹುದು. ({lat}°, {lng}°)',
        selectStateDist: 'ದಯವಿಟ್ಟು ಮೊದಲು ರಾಜ್ಯ ಮತ್ತು ಜಿಲ್ಲೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ.',
        resolvingCoords: 'ಸ್ಥಳದ ನಿರ್ದೇಶಾಂಕಗಳನ್ನು ಪರಿಹರಿಸಲಾಗುತ್ತಿದೆ...',
        geocoded: 'ಜಿಯೋಕೋಡ್ ಮಾಡಲಾಗಿದೆ: {lat}°, {lng}° ({details})',
        resolvedDist: 'ಜಿಲ್ಲಾ ನಿರ್ದೇಶಾಂಕಗಳನ್ನು ಪರಿಹರಿಸಲಾಗಿದೆ: {lat}°, {lng}° ({dist}, {st})',
        couldNotResolve: '"{locQuery}" ಗಾಗಿ ನಿರ್ದೇಶಾಂಕಗಳನ್ನು ಪರಿಹರಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಮಾನ್ಯ ಜಿಲ್ಲೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ.',
        latError: 'ಅಕ್ಷಾಂಶವು -90 ಮತ್ತು 90 ಡಿಗ್ರಿಗಳ ನಡುವೆ ಇರಬೇಕು.',
        lngError: 'ರೇಖಾಂಶವು -180 ಮತ್ತು 180 ಡಿಗ್ರಿಗಳ ನಡುವೆ ಇರಬೇಕು.',
        gpsAcquired: 'ಜಿಪಿಎಸ್ ಸ್ಥಳವನ್ನು ಪಡೆಯಲಾಗಿದೆ: {details}',
        outsideCountry: 'ನಿಮ್ಮ ಜಿಪಿಎಸ್ ಸ್ಥಳವು ಆಯ್ಕೆಮಾಡಿದ ದೇಶದ ಹೊರಗೆ ({countryName}) ಇರುವಂತೆ ತೋರುತ್ತಿದೆ. ದಯವಿಟ್ಟು ದೇಶವನ್ನು ಬದಲಾಯಿಸಿ.',
        notDeterminedShort: 'ಜಿಪಿಎಸ್ ಪಡೆಯಲಾಗಿದೆ: {lat}°, {lng}° (ನಿಖರತೆ: ±{acc}ಮೀ). ಪೂರ್ಣಗೊಳಿಸಲು ರಾಜ್ಯ ಮತ್ತು ಜಿಲ್ಲೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ.',
        gpsOffline: 'ಜಿಪಿಎಸ್ ಪಡೆಯಲಾಗಿದೆ ({lat}°, {lng}°). ರಿವರ್ಸ್ ಜಿಯೋಕೋಡಿಂಗ್ ಆಫ್‌ಲೈನ್ ಆಗಿದೆ.',
        resolveAuth: 'ಅಧಿಕೃತ ನಿರ್ದೇಶಾಂಕಗಳನ್ನು ಪರಿಹರಿಸಲಾಗುತ್ತಿದೆ...',
        gpsAcquiredAcc: 'ಜಿಪಿಎಸ್ ಸ್ಥಳವನ್ನು ಪಡೆಯಲಾಗಿದೆ: {details} (ನಿಖರತೆ: ±{acc}ಮೀ)',
        enterNameError: 'ದಯವಿಟ್ಟು ಬೆಳೆ ಹೆಸರನ್ನು ನಮೂದಿಸಿ ಅಥವಾ ಆಯ್ಕೆಮಾಡಿ.'
      }
    };

    const strings = map[clean] || {
      locating: 'Locating...',
      permissionDenied: 'Location permission was denied. Please allow location access and try again.',
      unableDetermine: 'Unable to determine your current location. Please check device/browser location settings.',
      notDetermined: 'GPS acquired, but the address could not be determined. You can enter the location manually. ({lat}°, {lng}°)',
      reverseFailed: 'GPS acquired, but reverse-geocoding failed. You can enter the location manually. ({lat}°, {lng}°)',
      selectStateDist: 'Please select a State and District first.',
      resolvingCoords: 'Resolving coordinates for location...',
      geocoded: 'Geocoded: {lat}°, {lng}° ({details})',
      resolvedDist: 'District Coordinates Resolved: {lat}°, {lng}° ({dist}, {st})',
      couldNotResolve: 'Could not resolve coordinates for "{locQuery}". Please select a valid District.',
      latError: 'Latitude must be between -90 and 90 degrees.',
      lngError: 'Longitude must be between -180 and 180 degrees.',
      gpsAcquired: 'GPS Location Acquired: {details}',
      outsideCountry: 'Your GPS location appears to be outside the selected country ({countryName}). Please change country.',
      notDeterminedShort: 'GPS Acquired: {lat}°, {lng}° (Accuracy: ±{acc}m). Select State & District to complete.',
      gpsOffline: 'GPS Acquired ({lat}°, {lng}°). Reverse geocoding offline.',
      resolveAuth: 'Resolving authoritative coordinates...',
      gpsAcquiredAcc: 'GPS Location Acquired: {details} (Accuracy: ±{acc}m)',
      enterNameError: 'Please enter or select crop name.'
    };

    let val = strings[key] || key;
    if (args) {
      Object.entries(args).forEach(([k, v]) => {
        val = val.replace(`{${k}}`, String(v));
      });
    }
    return val;
  };
  const {
    farmModalOpen,
    setFarmModalOpen,
    editingFarm,
    setEditingFarm,
    addFarm,
    editFarm,
    farmerName,
  } = useAuth();

  const [farmName, setFarmName] = useState('Wheat Farm');
  const [farmerNameInput, setFarmerNameInput] = useState('');
  const [country, setCountry] = useState('India');
  const [stateRegion, setStateRegion] = useState('');
  const [locationName, setLocationName] = useState('');
  const [subDistrict, setSubDistrict] = useState('');
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [area, setArea] = useState<number>(5);
  const [areaInput, setAreaInput] = useState<string>('5');
  const [areaUnit, setAreaUnit] = useState<'acres' | 'hectares'>('acres');
  const [crop, setCrop] = useState('Wheat');
  const [cropVariety, setCropVariety] = useState('');
  const [cropStage, setCropStage] = useState<
    'Germination' | 'Vegetative' | 'Flowering' | 'Grain filling' | 'Maturity'
  >('Vegetative');
  const [soilType, setSoilType] = useState('Alluvial');
  const [irrigationType, setIrrigationType] = useState<
    'Drip Irrigation' | 'Canal' | 'Sprinkler' | 'Rainfed' | 'Borewell / Tube well'
  >('Drip Irrigation');
  const [farmingType, setFarmingType] = useState('Organic');

  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const [geocoding, setGeocoding] = useState(false);
  const [geoMsg, setGeoMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [locationMetadata, setLocationMetadata] = useState<LocationMetadata | undefined>(undefined);

  useEffect(() => {
    if (editingFarm) {
      const type = editingFarm.farmingType || 'Organic';
      const c = editingFarm.crop || 'Wheat';
      setFarmingType(type);
      setCrop(c);
      setFarmName(editingFarm.farmName || `${c} Farm`);
      setFarmerNameInput(editingFarm.farmerName || farmerName || '');
      setCountry(editingFarm.country || 'India');
      setStateRegion(editingFarm.stateRegion || editingFarm.state || '');
      setLocationName(editingFarm.district || editingFarm.locationName || '');
      setSubDistrict(editingFarm.subDistrict || editingFarm.locationMetadata?.village || editingFarm.locationMetadata?.locality || '');
      setLatitude(editingFarm.latitude ?? null);
      setLongitude(editingFarm.longitude ?? null);
      setArea(editingFarm.area || 5);
      setAreaInput(String(editingFarm.area || 5));
      setAreaUnit(editingFarm.areaUnit || 'acres');
      setCropVariety(editingFarm.cropVariety || '');
      setCropStage(editingFarm.cropStage || 'Vegetative');
      setSoilType(editingFarm.soilType || 'Alluvial');
      setIrrigationType(editingFarm.irrigationType || 'Drip Irrigation');
      setLocationMetadata(editingFarm.locationMetadata);
    } else {
      setFarmingType('Organic');
      setCrop('Wheat');
      setFarmName('Wheat Farm');
      setFarmerNameInput(farmerName || '');
      setCountry(activeCountry);
      setStateRegion('');
      setLocationName('');
      setSubDistrict('');
      setLatitude(null);
      setLongitude(null);
      setArea(5);
      setAreaInput('5');
      setAreaUnit('acres');
      setCropVariety('PBW-343');
      setCropStage('Vegetative');
      setSoilType('Alluvial');
      setIrrigationType('Drip Irrigation');
      setLocationMetadata(undefined);
    }
    setGeoMsg(null);
    setFormError(null);
  }, [editingFarm, farmModalOpen, farmerName, activeCountry]);

  const handleCropChange = (newCrop: string) => {
    const isDefault =
      !farmName.trim() ||
      ['Wheat Farm', 'Rice Farm', 'Rice (Paddy) Farm', 'Cotton Farm', 'Sugarcane Farm', 'Maize (Corn) Farm', 'Soybean Farm', 'Organic Farm', 'Conventional Farm', 'Regenerative Farm', 'Natural Farm', 'Hydroponic Farm', 'Farm', 'My Farm', 'New Farm'].includes(
        farmName.trim()
      ) ||
      farmName.trim() === `${crop || 'Wheat'} Farm` ||
      farmName.trim() === `${farmingType || 'Organic'} Farm`;
    setCrop(newCrop);
    if (isDefault && newCrop) {
      setFarmName(`${newCrop} Farm`);
    }
  };

  const handleFarmingTypeChange = (newType: string) => {
    const isDefaultName =
      !farmName.trim() ||
      ['Organic Farm', 'Conventional Farm', 'Regenerative Farm', 'Natural Farm', 'Hydroponic Farm', 'Farm', 'My Farm', 'New Farm'].includes(
        farmName.trim()
      ) ||
      farmName.trim() === `${farmingType} Farm`;
    setFarmingType(newType);
    if (isDefaultName) {
      setFarmName(`${newType} Farm`);
    }
  };

  if (!farmModalOpen) return null;

  const handleClose = () => {
    setFarmModalOpen(false);
    setEditingFarm(null);
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setGeoMsg({ type: 'error', text: getLocalizedGeoMsg('unableDetermine') });
      return;
    }
    setLocating(true);
    setGeoMsg({ type: 'success', text: getLocalizedGeoMsg('locating') });
    
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = parseFloat(pos.coords.latitude.toFixed(6));
        const lng = parseFloat(pos.coords.longitude.toFixed(6));
        const acc = Math.round(pos.coords.accuracy);
        setLatitude(lat);
        setLongitude(lng);
        
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=14&addressdetails=1`);
          const data = await res.json();
          
          if (data && data.address) {
             const addrCountryCode = data.address.country_code ? data.address.country_code.toUpperCase() : '';
             
             if (addrCountryCode && addrCountryCode !== countryAdapter.countryCode) {
               setGeoMsg({
                 type: 'error',
                 text: getLocalizedGeoMsg('outsideCountry', { countryName: countryAdapter.countryName })
               });
               setLocating(false);
               return;
             }
             
             const address = data.address || {};
             const village = address.village || address.hamlet || address.suburb || address.neighbourhood || address.locality || '';
             const district = address.district || address.state_district || address.county || address.city || address.town || '';
             const state = address.state || address.region || address.province || '';
             const countryName = address.country || '';
             const postalCode = address.postcode || '';
             const formattedAddress = data.display_name || '';

             // Match State in available Indian states
             const indianStates = getIndiaStates();
             const matchedState = indianStates.find(s => s.toLowerCase() === state.toLowerCase()) ||
                                  indianStates.find(s => state.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(state.toLowerCase())) ||
                                  state;

             if (matchedState) setStateRegion(matchedState);

             // Match District in available districts for the state
             const districtList = getIndiaDistricts(matchedState);
             const matchedDistrict = districtList.find(d => d.toLowerCase() === district.toLowerCase()) ||
                                     districtList.find(d => district.toLowerCase().includes(d.toLowerCase()) || d.toLowerCase().includes(district.toLowerCase())) ||
                                     district;

             if (matchedDistrict) setLocationName(matchedDistrict);
             if (village) setSubDistrict(village);

             setLocationMetadata({
               latitude: lat,
               longitude: lng,
               accuracy: acc,
               village,
               locality: village,
               district: matchedDistrict || district,
               state: matchedState || state,
               country: countryName || countryAdapter.countryName,
               postalCode,
               formattedAddress,
               source: 'gps',
               capturedAt: new Date().toISOString(),
             });
             
             setGeoMsg({
               type: 'success',
               text: getLocalizedGeoMsg('gpsAcquiredAcc', { details: `${matchedState || state}, ${matchedDistrict || district}${village ? `, ${village}` : ''}`, acc })
             });
          } else {
             setLocationMetadata({
               latitude: lat,
               longitude: lng,
               accuracy: acc,
               village: '',
               locality: '',
               district: '',
               state: '',
               country: '',
               postalCode: '',
               formattedAddress: '',
               source: 'gps',
               capturedAt: new Date().toISOString(),
             });
             setGeoMsg({
               type: 'success',
               text: getLocalizedGeoMsg('notDeterminedShort', { lat, lng, acc })
             });
          }
        } catch (err) {
           setLocationMetadata({
             latitude: lat,
             longitude: lng,
             accuracy: acc,
             village: '',
             locality: '',
             district: '',
             state: '',
             country: '',
             postalCode: '',
             formattedAddress: '',
             source: 'gps',
             capturedAt: new Date().toISOString(),
           });
           setGeoMsg({
             type: 'success',
             text: getLocalizedGeoMsg('gpsOffline', { lat, lng })
           });
        }
        
        setLocating(false);
      },
      (err) => {
        setLocating(false);
        if (err.code === 1) {
          setGeoMsg({ type: 'error', text: getLocalizedGeoMsg('permissionDenied') });
        } else {
          setGeoMsg({ type: 'error', text: getLocalizedGeoMsg('unableDetermine') });
        }
      },
      { timeout: 10000, enableHighAccuracy: true, maximumAge: 0 }
    );
  };

  const handleGeocodeLocation = async (overrideState?: string, overrideDist?: string, overrideSub?: string) => {
    const st = overrideState !== undefined ? overrideState : stateRegion;
    const dt = overrideDist !== undefined ? overrideDist : locationName;
    const sd = overrideSub !== undefined ? overrideSub : subDistrict;

    const locQuery = [sd, dt, st, country || activeCountry || 'India'].filter(Boolean).join(', ');
    if (!locQuery.trim()) {
      setGeoMsg({ type: 'error', text: getLocalizedGeoMsg('selectStateDist') });
      return;
    }
    setGeocoding(true);
    setGeoMsg({ type: 'success', text: getLocalizedGeoMsg('resolveAuth') });
    try {
      let lat: number | null = null;
      let lon: number | null = null;
      let displayName: string = '';

      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locQuery)}&limit=1`,
          { headers: { 'Accept-Language': 'en' } }
        );
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            lat = parseFloat(parseFloat(data[0].lat).toFixed(6));
            lon = parseFloat(parseFloat(data[0].lon).toFixed(6));
            displayName = data[0].display_name || '';
          }
        }
      } catch (e) {
        console.warn('Nominatim lookup in modal fallback:', e);
      }

      if (lat === null || lon === null) {
        const authCoords = getAuthoritativeDistrictCoordinates(st, dt);
        if (authCoords) {
          lat = authCoords.latitude;
          lon = authCoords.longitude;
          displayName = `${dt}, ${st}`;
        }
      }

      if (lat !== null && lon !== null) {
        setLatitude(lat);
        setLongitude(lon);
        setLocationMetadata({
          latitude: lat,
          longitude: lon,
          accuracy: 500,
          village: sd,
          locality: sd,
          district: dt,
          state: st,
          country: country || activeCountry || 'India',
          postalCode: '',
          formattedAddress: displayName || `${dt}, ${st}`,
          source: 'geocoded' as any,
          capturedAt: new Date().toISOString(),
        });
        setGeoMsg({
          type: 'success',
          text: `Resolved: ${lat.toFixed(4)}°, ${lon.toFixed(4)}° (${dt})`,
        });
      } else {
        setGeoMsg({
          type: 'error',
          text: `Could not resolve coordinates for "${dt || locQuery}". Please select a valid District.`,
        });
      }
    } catch (err: any) {
      setGeoMsg({
        type: 'error',
        text: `Geocoding failed: ${err.message}. Please try again or use Live GPS.`,
      });
    } finally {
      setGeocoding(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!farmName.trim()) {
      setFormError('Please enter a name for your farm.');
      return;
    }
    if (!stateRegion.trim()) {
      setFormError('Please select or enter the State / Region.');
      return;
    }
    if (!locationName.trim()) {
      setFormError('Please select or enter the District.');
      return;
    }

    let finalLat = typeof latitude === 'number' && !isNaN(latitude) ? latitude : null;
    let finalLon = typeof longitude === 'number' && !isNaN(longitude) ? longitude : null;

    // Auto-geocoding fallback if missing internal coordinates
    if (finalLat === null || finalLon === null) {
      try {
        const locQuery = [subDistrict, locationName, stateRegion, country || activeCountry || 'India'].filter(Boolean).join(', ');
        if (locQuery.trim()) {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locQuery)}&limit=1`
          );
          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data) && data.length > 0) {
              finalLat = parseFloat(parseFloat(data[0].lat).toFixed(6));
              finalLon = parseFloat(parseFloat(data[0].lon).toFixed(6));
              setLatitude(finalLat);
              setLongitude(finalLon);
            }
          }
        }
      } catch (err) {
        console.warn('Auto-geocoding attempt in FarmModal:', err);
      }
    }

    if (finalLat !== null && (finalLat < -90 || finalLat > 90)) {
      setFormError('Latitude must be between -90 and 90 degrees.');
      return;
    }
    if (finalLon !== null && (finalLon < -180 || finalLon > 180)) {
      setFormError('Longitude must be between -180 and 180 degrees.');
      return;
    }

    const hasValidCoords = finalLat !== null && finalLon !== null && !isNaN(finalLat) && !isNaN(finalLon);

    const farmLoc: FarmLocation = {
      address: [subDistrict, locationName, stateRegion].filter(Boolean).join(', ') || locationName.trim(),
      village: subDistrict.trim() || locationMetadata?.village || '',
      mandal: subDistrict.trim() || locationMetadata?.locality || '',
      district: locationName.trim(),
      state: stateRegion.trim(),
      country: country || activeCountry || 'IN',
      latitude: finalLat,
      longitude: finalLon,
      accuracyMeters: locationMetadata?.accuracy,
      source: (locationMetadata?.source?.toUpperCase() as any) || (hasValidCoords ? 'GEOCODED' : 'USER_SELECTED'),
      capturedAt: locationMetadata?.capturedAt || new Date().toISOString(),
    };

    const finalLocationMetadata = {
      latitude: finalLat || 0,
      longitude: finalLon || 0,
      accuracy: locationMetadata?.accuracy || 0,
      village: subDistrict.trim() || locationMetadata?.village || '',
      locality: subDistrict.trim() || locationMetadata?.locality || '',
      district: locationName.trim(),
      state: stateRegion.trim(),
      country: country || '',
      postalCode: locationMetadata?.postalCode || '',
      formattedAddress: [subDistrict, locationName, stateRegion].filter(Boolean).join(', ') || locationName.trim(),
      source: locationMetadata?.source || (hasValidCoords ? 'geocoded' : 'manual'),
      capturedAt: new Date().toISOString(),
    };

    setLoading(true);
    try {
      const finalFarmName = farmName.trim() || `${farmingType} Farm`;
      const finalFarmerName = farmerNameInput.trim() || farmerName || 'Farmer';

      if (editingFarm) {
        await editFarm(editingFarm.id, {
          farmName: finalFarmName,
          farmerName: finalFarmerName,
          country,
          stateRegion: stateRegion.trim(),
          state: stateRegion.trim(),
          district: locationName.trim(),
          subDistrict: subDistrict.trim(),
          locationName: locationName.trim(),
          location: farmLoc,
          latitude: finalLat,
          longitude: finalLon,
          area: Number(area),
          areaUnit,
          crop: crop.trim(),
          cropVariety: cropVariety.trim(),
          cropStage,
          soilType,
          irrigationType,
          farmingType,
          locationMetadata: finalLocationMetadata,
        });
      } else {
        await addFarm({
          farmName: finalFarmName,
          farmerName: finalFarmerName,
          country,
          stateRegion: stateRegion.trim(),
          state: stateRegion.trim(),
          district: locationName.trim(),
          subDistrict: subDistrict.trim(),
          locationName: locationName.trim(),
          location: farmLoc,
          latitude: finalLat,
          longitude: finalLon,
          area: Number(area),
          areaUnit,
          crop: crop.trim(),
          cropVariety: cropVariety.trim(),
          cropStage,
          soilType,
          irrigationType,
          farmingType,
          locationMetadata: finalLocationMetadata,
        });
      }
      handleClose();
    } catch (err: any) {
      setFormError(err.message || 'Failed to save farm to Firestore.');
    } finally {
      setLoading(false);
    }
  };

  const availableCrops = Array.from(new Set([...(countryAdapter.cropCatalog || []), ...CROPS_LIST]));
  const availableSoilTypes = Array.from(new Set([...(countryAdapter.soilTypes || []), ...SOIL_TYPES]));
  const availableIrrigationTypes = Array.from(new Set([...(countryAdapter.irrigationTypes || []), ...IRRIGATION_TYPES]));

  return (
    <div
      id="farm-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div
        id="farm-modal-card"
        className="relative w-full max-w-xl my-auto bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="bg-emerald-700 dark:bg-emerald-800 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center">
              <Sprout className="w-5 h-5 text-emerald-100" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">
                {editingFarm ? t.editFarm : t.addFarm}
              </h3>
              <p className="text-xs text-emerald-100/80">
                Firestore Multi-Farm Management
              </p>
            </div>
          </div>
          <button
            id="close-farm-modal-btn"
            onClick={handleClose}
            className="p-1.5 rounded-lg hover:bg-white/20 transition-colors text-white/90"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {formError && (
            <div
              id="farm-form-error"
              className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 rounded-xl flex items-start gap-2.5 text-red-700 dark:text-red-300 text-xs"
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{formError}</span>
            </div>
          )}

          {/* Section 1: Farm Identity & Farmer Profile */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 pb-2 border-b border-stone-200/80 dark:border-stone-800/80">
              1. {fpLabels.farmIdentificationHeader || 'Farm Identity & Farmer Profile'}
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Farmer Name (Defaulted from Login Page / Auth) */}
              <div>
                <label
                  htmlFor="farm-farmer-name-input"
                  className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1"
                >
                  {t.farmerName || 'Farmer Name'} *
                </label>
                <input
                  id="farm-farmer-name-input"
                  type="text"
                  required
                  value={farmerNameInput}
                  onChange={(e) => setFarmerNameInput(e.target.value)}
                  placeholder={t.namePlaceholder || 'Farmer Name'}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Farm Name (Defaults to Crop Type) */}
              <div>
                <label
                  htmlFor="farm-name-input"
                  className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1"
                >
                  {t.farmNameLabel} *
                </label>
                <input
                  id="farm-name-input"
                  type="text"
                  required
                  value={farmName}
                  onChange={(e) => setFarmName(e.target.value)}
                  placeholder={t.farmNamePlaceholder || `${crop || 'Wheat'} Farm`}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Farm Area & Unit */}
              <div className="md:col-span-2">
                <label
                  htmlFor="farm-area-input"
                  className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1"
                >
                  {t.areaLabel} *
                </label>
                <div className="flex gap-2 max-w-md">
                  <input
                    id="farm-area-input"
                    type="text"
                    inputMode="decimal"
                    required
                    value={areaInput}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === '' || /^\d*\.?\d*$/.test(val)) {
                        setAreaInput(val);
                        const parsed = parseFloat(val);
                        if (!isNaN(parsed) && parsed > 0) {
                          setArea(parsed);
                        }
                      }
                    }}
                    onBlur={() => {
                      const parsed = parseFloat(areaInput);
                      if (!areaInput.trim() || isNaN(parsed) || parsed <= 0) {
                        const fallback = area || 5;
                        setAreaInput(String(fallback));
                        setArea(fallback);
                      } else {
                        setAreaInput(String(parsed));
                        setArea(parsed);
                      }
                    }}
                    placeholder="e.g. 5"
                    className="w-24 px-2.5 py-2 text-xs sm:text-sm font-normal text-center rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <select
                    id="farm-area-unit-select"
                    value={areaUnit}
                    onChange={(e) => setAreaUnit(e.target.value as 'acres' | 'hectares')}
                    className="flex-1 min-w-0 px-3 py-2 text-xs sm:text-sm font-normal rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                  >
                    <option value="acres">{formatFarmValue('acres', currentLanguage, localizeFarmUnit)}</option>
                    <option value="hectares">{formatFarmValue('hectares', currentLanguage, localizeFarmUnit)}</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Geographic Location & Spatial Coordinates */}
          <div className="space-y-3.5 pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 pb-2 border-b border-stone-200/80 dark:border-stone-800/80">
              2. {fpLabels.districtLabel ? `2. ${t.location || 'Location'} & Spatial Mapping` : '2. Geographic Location & Spatial Coordinates'}
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Country (Read-Only) */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  {t.countryLabel || 'Country'}
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-2.5 w-4 h-4 text-stone-400 pointer-events-none" />
                  <input
                    type="text"
                    readOnly
                    value={`${countryAdapter.countryName} (${countryAdapter.countryCode})`}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-100 dark:bg-stone-800/50 text-stone-900 dark:text-stone-100 cursor-not-allowed opacity-80"
                  />
                </div>
              </div>

              {/* State / Region / Province */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  {fpLabels.stateRegionLabel || t.stateRegion || 'State / Region / Province'} *
                </label>
                {getIndiaStates().length > 0 ? (
                  <select
                    value={stateRegion}
                    onChange={(e) => {
                      const newSelectedState = e.target.value;
                      setStateRegion(newSelectedState);
                      setLocationName('');
                      setSubDistrict('');
                      setLatitude(null);
                      setLongitude(null);
                      setLocationMetadata(undefined);
                      setGeoMsg(null);
                    }}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="">{fpLabels.selectStateRegion || 'Select State / Region'}</option>
                    {getIndiaStates().map((st) => (
                      <option key={st} value={st}>
                        {formatFarmValue(st, currentLanguage, localizeState)}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={stateRegion}
                    onChange={(e) => {
                      const newSt = e.target.value;
                      setStateRegion(newSt);
                      setLocationName('');
                      setSubDistrict('');
                      setLatitude(null);
                      setLongitude(null);
                      setLocationMetadata(undefined);
                      setGeoMsg(null);
                    }}
                    placeholder="e.g. State, Province..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                )}
              </div>

              {/* Location / District & GPS & Geocoding */}
              <div className="md:col-span-2">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300">
                    {fpLabels.districtLabel || 'District'} *
                  </label>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      id="farm-modal-geocode-btn"
                      onClick={() => handleGeocodeLocation()}
                      disabled={geocoding}
                      className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors cursor-pointer"
                    >
                      {geocoding ? <Loader2 className="w-3 h-3 animate-spin" /> : <MapPin className="w-3 h-3 text-emerald-600" />}
                      <span>{geocoding ? (fpLabels.geocoding || 'Geocoding...') : (fpLabels.geocodeBtn || 'Geocode')}</span>
                    </button>

                    <button
                      type="button"
                      id="use-my-location-btn"
                      onClick={handleGetLocation}
                      disabled={locating}
                      className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded font-medium text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 transition-colors cursor-pointer"
                    >
                      {locating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Compass className="w-3 h-3" />}
                      <span>{locating ? (fpLabels.locating || 'Locating...') : (fpLabels.useLiveGps || 'Use Live GPS')}</span>
                    </button>
                  </div>
                </div>
                <div className="relative">
                  {stateRegion && getIndiaDistricts(stateRegion).length > 0 ? (
                    <select
                      value={locationName}
                      onChange={(e) => {
                        const newDist = e.target.value;
                        setLocationName(newDist);
                        setSubDistrict('');
                        setLatitude(null);
                        setLongitude(null);
                        setLocationMetadata(undefined);
                        if (newDist) {
                          handleGeocodeLocation(stateRegion, newDist, '');
                        } else {
                          setGeoMsg(null);
                        }
                      }}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="">{fpLabels.selectDistrict || 'Select District'}</option>
                      {getIndiaDistricts(stateRegion).map((d) => (
                        <option key={d} value={d}>
                          {formatFarmValue(d, currentLanguage, localizeDistrict)}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      required
                      value={locationName}
                      onChange={(e) => {
                        const newDist = e.target.value;
                        setLocationName(newDist);
                      }}
                      onBlur={() => {
                        if (locationName && locationName.trim().length > 1) {
                          handleGeocodeLocation(stateRegion, locationName, subDistrict);
                        }
                      }}
                      placeholder={stateRegion ? (fpLabels.enterDistrictPlaceholder || 'Enter District') : (fpLabels.selectStateFirst || 'Select State first')}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  )}
                </div>
              </div>

              {/* Region / Village / Local Area */}
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  {fpLabels.villageLabel || 'Region / Village / Local Area'}
                </label>
                {(() => {
                  const subDistricts = stateRegion && locationName ? getIndiaSubDistricts(stateRegion, locationName) : [];
                  if (subDistricts.length > 0) {
                    return (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <select
                          value={subDistrict}
                          onChange={(e) => setSubDistrict(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        >
                          <option value="">{fpLabels.selectSubDistrict || 'Select Local Area / Sub-District'}</option>
                          {subDistricts.map((sd) => (
                            <option key={sd} value={sd}>
                              {formatFarmValue(sd, currentLanguage, localizeSubDistrict)}
                            </option>
                          ))}
                        </select>
                        <input
                          type="text"
                          value={subDistrict}
                          onChange={(e) => setSubDistrict(e.target.value)}
                          placeholder={fpLabels.customVillagePlaceholder || 'Or enter custom village / local area'}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                    );
                  }
                  return (
                    <input
                      type="text"
                      value={subDistrict}
                      onChange={(e) => setSubDistrict(e.target.value)}
                      placeholder={fpLabels.villagePlaceholder || 'e.g. Village, Mandal, Locality, or Tehsil'}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  );
                })()}
              </div>

              {/* Coordinate Geo message */}
              {geoMsg && (
                <div className={`md:col-span-2 text-[11px] flex flex-col gap-1 ${geoMsg.type === 'success' ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                  <div className="flex items-center gap-1.5">
                    {geoMsg.type === 'success' ? <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> : <AlertCircle className="w-3.5 h-3.5 shrink-0" />}
                    <span>{geoMsg.text}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Section 3: Crop, Soil & Agronomic Classification (Merged) */}
          <div className="space-y-3.5 pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 pb-2 border-b border-stone-200/80 dark:border-stone-800/80">
              3. {fpLabels.agronomicClassificationHeader || 'Crop, Soil & Agronomic Classification'}
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Crop */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  {t.cropLabel || 'Crop'} *
                </label>
                <select
                  required
                  value={crop}
                  onChange={(e) => handleCropChange(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                >
                  <option value="">{fpLabels.selectCrop || 'Select Crop'}</option>
                  {availableCrops.map((c) => {
                    const localized = localizeCrop(c, currentLanguage);
                    const label = localized || c;
                    return (
                      <option key={c} value={c}>
                        {label}
                      </option>
                    );
                  })}
                </select>
              </div>
              
              {/* Crop Variety */}
              <div>
                <label
                  htmlFor="farm-variety-input"
                  className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1"
                >
                  {t.cropVarietyLabel}
                </label>
                <input
                  id="farm-variety-input"
                  type="text"
                  value={cropVariety}
                  onChange={(e) => setCropVariety(e.target.value)}
                  placeholder={t.cropVarietyPlaceholder}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Farming Type (Moved to Section 3) */}
              <div>
                <label
                  htmlFor="farm-type-select"
                  className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1"
                >
                  {formatFarmValue('Farming Type', currentLanguage, (v, l) => {
                    const norm = normalizeLang(l);
                    if (norm === 'te') return 'వ్యవసాయ పద్ధతి';
                    if (norm === 'hi') return 'खेती का प्रकार';
                    if (norm === 'ta') return 'விவசாய வகை';
                    if (norm === 'kn') return 'ಕೃಷಿ ವಿಧಾನ';
                    if (norm === 'mr') return 'शेतीचा प्रकार';
                    if (norm === 'bn') return 'চাষের ধরণ';
                    if (norm === 'gu') return 'ખેતીનો પ્રકાર';
                    if (norm === 'pa') return 'ਖੇਤੀ ਦੀ ਕਿਸਮ';
                    if (norm === 'ml') return 'കൃഷി രീതി';
                    if (norm === 'or') return 'କୃଷି ପ୍ରକାର';
                    return v;
                  })} *
                </label>
                <select
                  id="farm-type-select"
                  value={farmingType}
                  onChange={(e) => handleFarmingTypeChange(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                >
                  {['Organic', 'Conventional', 'Regenerative', 'Hydroponic', 'Natural'].map((type) => (
                    <option key={type} value={type}>
                      {localizeFarmingType(type, currentLanguage)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Soil Type */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  {t.soilTypeLabel || 'Soil Type'} *
                </label>
                <div className="relative">
                  <Layers className="absolute left-3 top-2.5 w-4 h-4 text-stone-400 pointer-events-none" />
                  <select
                    value={soilType}
                    onChange={(e) => setSoilType(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                  >
                    <option value="">{fpLabels.selectSoilType || 'Select Soil Type'}</option>
                    {availableSoilTypes.map((s) => (
                      <option key={s} value={s}>
                        {formatFarmValue(s, currentLanguage, localizeSoilType)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Crop Stage */}
              <div>
                <label
                  htmlFor="farm-stage-select"
                  className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1"
                >
                  {t.growthStageLabel} *
                </label>
                <select
                  id="farm-stage-select"
                  value={cropStage}
                  onChange={(e) => setCropStage(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                >
                  {GROWTH_STAGES.map((st) => (
                    <option key={st} value={st}>
                      {formatFarmValue(st, currentLanguage, localizeGrowthStage)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Irrigation Type */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  {t.irrigationTypeLabel || 'Irrigation Type'} *
                </label>
                <div className="relative">
                  <Droplets className="absolute left-3 top-2.5 w-4 h-4 text-stone-400 pointer-events-none" />
                  <select
                    value={irrigationType}
                    onChange={(e) => setIrrigationType(e.target.value as any)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                  >
                    <option value="">{fpLabels.selectIrrigationType || 'Select Irrigation Type'}</option>
                    {availableIrrigationTypes.map((i) => (
                      <option key={i} value={i}>
                        {formatFarmValue(i, currentLanguage, localizeIrrigation)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-stone-200 dark:border-stone-800">
            <button
              type="button"
              id="cancel-farm-btn"
              onClick={handleClose}
              className="px-4 py-2 text-xs font-medium rounded-xl text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              id="save-farm-submit-btn"
              disabled={loading}
              className="px-5 py-2 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white transition-all shadow flex items-center gap-2"
            >
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>{loading ? (fpLabels.savingFarmBtn || 'Saving Farm...') : (fpLabels.saveFarmBtn || 'Save Farm')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
