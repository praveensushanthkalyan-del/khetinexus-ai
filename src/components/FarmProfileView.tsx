import React, { useState, useEffect, useRef } from 'react';
import {
  UserCheck,
  MapPin,
  Sprout,
  Save,
  RotateCcw,
  CheckCircle2,
  Globe2,
  Layers,
  Droplets,
  HelpCircle,
  Compass,
  Loader2,
  AlertCircle,
  Plus,
  Edit2,
  Trash2,
  Cloud,
  Check,
  Languages,
} from 'lucide-react';
import { FarmProfile, Language, UserFarm, FarmLocation } from '../types';
import { getTranslation } from '../i18n/translations';
import {
  localizeCountry,
  localizeCrop,
  localizeGrowthStage,
  localizeSoilType,
  localizeIrrigation,
  localizeState,
  localizeDistrict,
  localizeSubDistrict,
  localizeFarmUnit,
  localizeFarmName,
  localizeFarmingType,
  formatFarmValue,
  formatFarmLocation,
  normalizeLang,
  isTextInLanguageScript,
  translatePlaceName,
  getFarmProfileUILabels,
} from '../i18n/dataTranslations';
import { useAuth } from '../context/AuthContext';
import { useCountry } from '../context/CountryContext';
import { getIndiaStates, getIndiaDistricts, getIndiaSubDistricts, getAuthoritativeDistrictCoordinates } from '../data/indiaGeographicHierarchy';

interface FarmProfileViewProps {
  currentFarm: FarmProfile;
  onSaveProfile: (updated: FarmProfile) => void;
  language: Language;
}

const SUPPORTED_COUNTRIES = [
  { name: 'India', flag: '🇮🇳', defaultRegion: 'Punjab' },
  { name: 'Brazil', flag: '🇧🇷', defaultRegion: 'Mato Grosso' },
  { name: 'Russia', flag: '🇷🇺', defaultRegion: 'Krasnodar Krai' },
  { name: 'China', flag: '🇨🇳', defaultRegion: 'Heilongjiang' },
  { name: 'South Africa', flag: '🇿🇦', defaultRegion: 'Free State' },
  { name: 'Egypt', flag: '🇪🇬', defaultRegion: 'Nile Delta' },
  { name: 'Ethiopia', flag: '🇪🇹', defaultRegion: 'Oromia' },
  { name: 'UAE', flag: '🇦🇪', defaultRegion: 'Al Ain' },
];

export const CROPS_LIST = [
  'Rice',
  'Wheat',
  'Soybean',
  'Cotton',
  'Sugarcane',
  'Maize (Corn)',
  'Barley',
  'Chickpeas / Gram',
  'Millet (Bajra / Ragi)',
  'Tomato',
  'Potato',
  'Sunflower',
  'Mustard',
  'Groundnut',
];

export const GROWTH_STAGES: FarmProfile['growthStage'][] = [
  'Germination',
  'Vegetative',
  'Flowering',
  'Grain filling',
  'Maturity',
];

export const SOIL_TYPES = [
  'Alluvial Loam',
  'Alluvial',
  'Black Cotton Soil (Vertisol)',
  'Black (Regur)',
  'Chernozem (Black Earth)',
  'Red',
  'Cerrado Oxisol (Red Clay)',
  'Sandy Loam',
  'Clayey Soil',
  'Laterite Soil',
  'Laterite',
  'Silt Loam',
  'Desert',
  'Mountain',
];

export const IRRIGATION_TYPES: FarmProfile['irrigationType'][] = [
  'Drip Irrigation',
  'Canal',
  'Sprinkler',
  'Rainfed',
  'Borewell / Tube well',
];

export const FarmProfileView: React.FC<FarmProfileViewProps> = ({
  currentFarm,
  onSaveProfile,
  language,
}) => {
  const [formData, setFormData] = useState<FarmProfile>({ ...currentFarm });
  const [farmSizeInput, setFarmSizeInput] = useState<string>(
    currentFarm?.farmSize !== undefined ? String(currentFarm.farmSize) : '1'
  );
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [locating, setLocating] = useState(false);
  const [geocoding, setGeocoding] = useState(false);
  const [geoMsg, setGeoMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const t = getTranslation(language);
  const fpLabels = getFarmProfileUILabels(language);

  const getLocalizedGeoMsg = (key: string, args?: Record<string, string | number>) => {
    const clean = (language || 'en').split('-')[0].toLowerCase();
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
      },
      ta: {
        locating: 'இருப்பிடத்தைக் கண்டறிகிறது...',
        permissionDenied: 'இருப்பிட அனுமதி மறுக்கப்பட்டது. தயவுசெய்து அனுமதித்து மீண்டும் முயற்சிக்கவும்.',
        unableDetermine: 'உங்கள் தற்போதைய இருப்பிடத்தைக் கண்டறிய முடியவில்லை. சாதன அமைப்புகளைச் சரிபார்க்கவும்.',
        notDetermined: 'ஜிபிஎஸ் பெறப்பட்டது, ஆனால் முகவரியைக் கண்டறிய முடியவில்லை. நீங்கள் கைமுறையாக உள்ளிடலாம். ({lat}°, {lng}°)',
        reverseFailed: 'ஜிபிஎஸ் பெறப்பட்டது, ஆனால் ரிவர்း-ஜியோகோடிங் தோல்வியடைந்தது. நீங்கள் கைமுறையாக உள்ளிடலாம். ({lat}°, {lng}°)',
        selectStateDist: 'தயவுசெய்து முதலில் மாநிலம் மற்றும் மாவட்டத்தைத் தேர்ந்தெடுக்கவும்.',
        resolvingCoords: 'முகவரியின் ஒருங்கிணைப்புகளைக் கண்டறிகிறது...',
        geocoded: 'ஜியோகோடிங் செய்யப்பட்டது: {lat}°, {lng}° ({details})',
        resolvedDist: 'மாவட்ட ஒருங்கிணைப்புகள் கண்டறியப்பட்டன: {lat}°, {lng}° ({dist}, {st})',
        couldNotResolve: '"{locQuery}" க்கான ஒருங்கிணைப்புகளைக் கண்டறிய முடியவில்லை. தயவுசெய்து சரியான மாவட்டத்தைத் தேர்ந்தெடுக்கவும்.',
        latError: 'அட்சரேகை -90 முதல் 90 டிகிரி வரை இருக்க வேண்டும்.',
        lngError: 'தீர்க்கரேகை -180 முதல் 180 டிகிரி வரை இருக்க வேண்டும்.',
        gpsAcquired: 'ஜிபிஎஸ் இருப்பிடம் பெறப்பட்டது: {details}',
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
    };

    let val = strings[key] || key;
    if (args) {
      Object.entries(args).forEach(([k, v]) => {
        val = val.replace(`{${k}}`, String(v));
      });
    }
    return val;
  };

  const { activeCountry } = useCountry();
  const [deletingFarm, setDeletingFarm] = useState<UserFarm | null>(null);
  const [isPendingDelete, setIsPendingDelete] = useState(false);

  const {
    user,
    userProfile,
    farmerName,
    updateFarmerName,
    farms,
    loadingFarms,
    activeFarm,
    selectActiveFarm,
    removeFarm,
    setFarmModalOpen,
    setEditingFarm,
    editFarm,
    addFarm,
    setAuthModalOpen,
    setAuthModalMode,
  } = useAuth();

  const [farmerNameInput, setFarmerNameInput] = useState<string>(() => {
    return currentFarm?.farmerName || farmerName || '';
  });

  const [isGpsAcquired, setIsGpsAcquired] = useState(false);
  const lastLoadedFarmIdRef = useRef<string | null>(null);

  useEffect(() => {
    const isDifferentFarm = currentFarm?.id !== lastLoadedFarmIdRef.current;
    if (isDifferentFarm) {
      setFormData({ ...currentFarm });
      setFarmSizeInput(currentFarm?.farmSize !== undefined ? String(currentFarm.farmSize) : '1');
      setFarmerNameInput(currentFarm?.farmerName || farmerName || '');
      lastLoadedFarmIdRef.current = currentFarm?.id || null;
      setIsGpsAcquired(false);
    } else {
      if (isGpsAcquired) {
        console.warn('Old activeFarm location attempts to overwrite a newer GPS location! Overwrite prevented.', {
          currentGps: { lat: formData.latitude, lng: formData.longitude, location: formData.location },
          staleIncoming: { lat: currentFarm?.latitude, lng: currentFarm?.longitude, location: currentFarm?.location }
        });
      } else if (!locating && !isSaving) {
        setFormData({ ...currentFarm });
        setFarmSizeInput(currentFarm?.farmSize !== undefined ? String(currentFarm.farmSize) : '1');
        setFarmerNameInput(currentFarm?.farmerName || farmerName || '');
      }
    }
  }, [currentFarm, farmerName]);

  const handleCropChange = (newCrop: string) => {
    const isDefault =
      !formData.name?.trim() ||
      ['Wheat Farm', 'Rice Farm', 'Rice (Paddy) Farm', 'Cotton Farm', 'Sugarcane Farm', 'Maize (Corn) Farm', 'Soybean Farm', 'Organic Farm', 'Conventional Farm', 'Regenerative Farm', 'Natural Farm', 'Hydroponic Farm', 'Farm', 'My Farm', 'New Farm'].includes(
        formData.name.trim()
      ) ||
      formData.name.trim() === `${formData.crop || 'Wheat'} Farm` ||
      formData.name.trim() === `${formData.farmingType || 'Organic'} Farm`;
    setFormData((prev) => ({
      ...prev,
      crop: newCrop,
      currentCrop: newCrop,
      name: isDefault ? `${newCrop} Farm` : prev.name,
    }));
  };

  const handleFarmingTypeChange = (newType: string) => {
    const isDefault =
      !formData.name?.trim() ||
      ['Organic Farm', 'Conventional Farm', 'Regenerative Farm', 'Natural Farm', 'Hydroponic Farm', 'Farm', 'My Farm', 'New Farm'].includes(
        formData.name.trim()
      ) ||
      formData.name.trim() === `${formData.farmingType || 'Organic'} Farm`;
    setFormData((prev) => ({
      ...prev,
      farmingType: newType,
      name: isDefault ? `${newType} Farm` : prev.name,
    }));
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setGeoMsg({
        type: 'error',
        text: t.locationDenied || 'Geolocation is not supported by your browser.',
      });
      return;
    }

    setLocating(true);
    setGeoMsg({ type: 'success', text: getLocalizedGeoMsg('locating') });

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = parseFloat(pos.coords.latitude.toFixed(6));
        const lng = parseFloat(pos.coords.longitude.toFixed(6));
        const accuracy = Math.round(pos.coords.accuracy);

        console.log('GPS acquired:', { latitude: lat, longitude: lng, accuracy });

        setFormData((prev) => ({
          ...prev,
          latitude: lat,
          longitude: lng,
        }));
        setIsGpsAcquired(true);

        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=14&addressdetails=1`);
          const data = await res.json();

          if (data && data.address) {
            const address = data.address || {};
            const village = address.village || address.hamlet || address.suburb || address.neighbourhood || address.locality || '';
            const district = address.district || address.state_district || address.county || address.city || address.town || '';
            const state = address.state || address.region || address.province || '';
            const country = address.country || '';
            const postalCode = address.postcode || '';

            const indianStates = getIndiaStates();
            const matchedState = indianStates.find(s => s.toLowerCase() === state.toLowerCase()) ||
                                 indianStates.find(s => state.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(state.toLowerCase())) ||
                                 state;

            const districtList = getIndiaDistricts(matchedState);
            const matchedDistrict = districtList.find(d => d.toLowerCase() === district.toLowerCase()) ||
                                    districtList.find(d => district.toLowerCase().includes(d.toLowerCase()) || d.toLowerCase().includes(district.toLowerCase())) ||
                                    district;

            const components = [village, matchedDistrict || district, matchedState || state].filter(Boolean);
            const displayLocation = components.join(', ') || data.display_name || '';

            setFormData((prev) => ({
              ...prev,
              stateRegion: matchedState || prev.stateRegion,
              district: matchedDistrict || prev.district,
              subDistrict: village || prev.subDistrict,
              location: displayLocation,
              locationMetadata: {
                latitude: lat,
                longitude: lng,
                accuracy,
                village,
                locality: village,
                district: matchedDistrict || district,
                state: matchedState || state,
                country: country || prev.country || 'India',
                postalCode,
                formattedAddress: displayLocation,
                source: 'gps',
                capturedAt: new Date().toISOString(),
              },
            }));

            setGeoMsg({
              type: 'success',
              text: getLocalizedGeoMsg('gpsAcquired', { details: `${matchedState || state}, ${matchedDistrict || district}${village ? `, ${village}` : ''}` }),
            });
          } else {
            console.warn('Reverse geocoding succeeded but returned empty address components.');
            setFormData((prev) => ({
              ...prev,
              locationMetadata: {
                latitude: lat,
                longitude: lng,
                accuracy,
                village: '',
                locality: '',
                district: '',
                state: '',
                country: '',
                postalCode: '',
                formattedAddress: '',
                source: 'gps',
                capturedAt: new Date().toISOString(),
              },
            }));
            setGeoMsg({
              type: 'success',
              text: getLocalizedGeoMsg('notDetermined', { lat, lng }),
            });
          }
        } catch (err) {
          console.error('Reverse geocoding API error:', err);
          setFormData((prev) => ({
            ...prev,
            locationMetadata: {
              latitude: lat,
              longitude: lng,
              accuracy,
              village: '',
              locality: '',
              district: '',
              state: '',
              country: '',
              postalCode: '',
              formattedAddress: '',
              source: 'gps',
              capturedAt: new Date().toISOString(),
            },
          }));
          setGeoMsg({
            type: 'success',
            text: getLocalizedGeoMsg('reverseFailed', { lat, lng }),
          });
        } finally {
          setLocating(false);
        }
      },
      (err) => {
        setLocating(false);
        console.warn('Geolocation error:', err.message);
        if (err.code === 1) {
          setGeoMsg({
            type: 'error',
            text: getLocalizedGeoMsg('permissionDenied'),
          });
        } else {
          setGeoMsg({
            type: 'error',
            text: getLocalizedGeoMsg('unableDetermine'),
          });
        }
      },
      { timeout: 10000, enableHighAccuracy: true, maximumAge: 0 }
    );
  };

  const resolveGeocode = async (override?: {
    state?: string;
    district?: string;
    subDistrict?: string;
    location?: string;
  }) => {
    const st = override?.state !== undefined ? override.state : formData.stateRegion;
    const dist = override?.district !== undefined ? override.district : formData.district;
    const subDist = override?.subDistrict !== undefined ? override.subDistrict : formData.subDistrict;
    const loc = override?.location !== undefined ? override.location : formData.location;
    const cntry = formData.country || activeCountry || 'India';

    if (!st && !dist && !loc) {
      setGeoMsg({ type: 'error', text: getLocalizedGeoMsg('selectStateDist') });
      return;
    }

    setGeocoding(true);
    setGeoMsg({ type: 'success', text: getLocalizedGeoMsg('resolvingCoords') });

    const locQuery = [loc, subDist, dist, st, cntry].filter(Boolean).join(', ');

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locQuery)}&limit=1`
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      if (Array.isArray(data) && data.length > 0) {
        const lat = parseFloat(parseFloat(data[0].lat).toFixed(6));
        const lon = parseFloat(parseFloat(data[0].lon).toFixed(6));
        setFormData((prev) => ({
          ...prev,
          stateRegion: st || prev.stateRegion,
          district: dist || prev.district,
          subDistrict: subDist || prev.subDistrict,
          location: loc || prev.location,
          latitude: lat,
          longitude: lon,
          coordinates: { lat, lng: lon },
          locationMetadata: {
            latitude: lat,
            longitude: lon,
            accuracy: 500,
            village: loc || subDist || '',
            locality: subDist || loc || '',
            district: dist || prev.district || '',
            state: st || prev.stateRegion || '',
            country: cntry,
            postalCode: '',
            formattedAddress: data[0].display_name || [loc, subDist, dist, st, cntry].filter(Boolean).join(', '),
            source: 'geocoded' as any,
            capturedAt: new Date().toISOString(),
          },
        }));
        setGeoMsg({
          type: 'success',
          text: getLocalizedGeoMsg('geocoded', { lat, lng: lon, details: [loc, subDist, dist, st].filter(Boolean).slice(0, 2).join(', ') }),
        });
        return;
      }
    } catch (err: any) {
      console.warn('Nominatim geocode query failed, trying district registry:', err?.message);
    } finally {
      setGeocoding(false);
    }

    // Fallback: Use official district coordinates from registry
    if (st && dist) {
      const authCoords = getAuthoritativeDistrictCoordinates(st, dist);
      if (authCoords) {
        const lat = parseFloat(authCoords.latitude.toFixed(6));
        const lon = parseFloat(authCoords.longitude.toFixed(6));
        setFormData((prev) => ({
          ...prev,
          stateRegion: st || prev.stateRegion,
          district: dist || prev.district,
          subDistrict: subDist || prev.subDistrict,
          location: loc || prev.location,
          latitude: lat,
          longitude: lon,
          coordinates: { lat, lng: lon },
          locationMetadata: {
            latitude: lat,
            longitude: lon,
            accuracy: 1000,
            village: loc || '',
            locality: subDist || '',
            district: dist,
            state: st,
            country: cntry,
            postalCode: '',
            formattedAddress: [loc, subDist, dist, st, cntry].filter(Boolean).join(', '),
            source: 'geocoded' as any,
            capturedAt: new Date().toISOString(),
          },
        }));
        setGeoMsg({
          type: 'success',
          text: getLocalizedGeoMsg('resolvedDist', { lat, lng: lon, dist, st }),
        });
        return;
      }
    }

    setGeoMsg({
      type: 'error',
      text: getLocalizedGeoMsg('couldNotResolve', { locQuery }),
    });
  };

  const handleGeocodeLocation = async () => {
    setIsGpsAcquired(false);
    await resolveGeocode();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveError(null);

    let finalLat = typeof formData.latitude === 'number' && !isNaN(formData.latitude) ? formData.latitude : null;
    let finalLon = typeof formData.longitude === 'number' && !isNaN(formData.longitude) ? formData.longitude : null;

    // If coordinates are missing, attempt auto-geocoding resolution before saving
    if (finalLat === null || finalLon === null) {
      try {
        const locQuery = [formData.location, formData.district, formData.stateRegion, formData.country || activeCountry || 'India']
          .filter(Boolean)
          .join(', ');
        if (locQuery.trim()) {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locQuery)}&limit=1`
          );
          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data) && data.length > 0) {
              finalLat = parseFloat(parseFloat(data[0].lat).toFixed(6));
              finalLon = parseFloat(parseFloat(data[0].lon).toFixed(6));
            }
          }
        }
      } catch (err) {
        console.warn('Auto-geocoding attempt during save:', err);
      }
    }

    // Validate coordinate ranges
    if (finalLat !== null && (finalLat < -90 || finalLat > 90)) {
      setSaveError(getLocalizedGeoMsg('latError'));
      setIsSaving(false);
      return;
    }
    if (finalLon !== null && (finalLon < -180 || finalLon > 180)) {
      setSaveError(getLocalizedGeoMsg('lngError'));
      setIsSaving(false);
      return;
    }

    const hasValidCoords = finalLat !== null && finalLon !== null && !isNaN(finalLat) && !isNaN(finalLon);

    const farmLoc: FarmLocation = {
      address: formData.location || '',
      village: formData.locationMetadata?.village || '',
      mandal: formData.locationMetadata?.locality || formData.subDistrict || '',
      district: formData.district || formData.locationMetadata?.district || formData.location || '',
      state: formData.state || formData.stateRegion || formData.locationMetadata?.state || '',
      country: formData.country || activeCountry || 'IN',
      latitude: finalLat,
      longitude: finalLon,
      accuracyMeters: formData.locationMetadata?.accuracy,
      source: (formData.locationMetadata?.source?.toUpperCase() as any) || (hasValidCoords ? 'GEOCODED' : 'USER_SELECTED'),
      capturedAt: formData.locationMetadata?.capturedAt || new Date().toISOString(),
    };

    const finalLocationMetadata = {
      latitude: finalLat ?? 0,
      longitude: finalLon ?? 0,
      accuracy: formData.locationMetadata?.accuracy || 0,
      village: formData.locationMetadata?.village || '',
      locality: formData.locationMetadata?.locality || '',
      district: formData.district || formData.locationMetadata?.district || '',
      state: formData.stateRegion || '',
      country: formData.country || '',
      postalCode: formData.locationMetadata?.postalCode || '',
      formattedAddress: formData.location || '',
      source: formData.locationMetadata?.source || (hasValidCoords ? 'geocoded' : 'manual'),
      capturedAt: new Date().toISOString(),
    };

    const parsedSize = parseFloat(farmSizeInput);
    const validFarmSize = !isNaN(parsedSize) && parsedSize > 0 ? parsedSize : (formData.farmSize || 1);
    const finalFarmerName = farmerNameInput.trim() || farmerName || 'Farmer';
    const finalFarmName = formData.name?.trim() || `${formData.crop || 'Wheat'} Farm`;

    if (farmerNameInput.trim()) {
      try {
        await updateFarmerName(farmerNameInput.trim());
      } catch (e) {}
    }

    const finalFormData: FarmProfile = {
      ...formData,
      name: finalFarmName,
      farmName: finalFarmName,
      farmerName: finalFarmerName,
      farmSize: validFarmSize,
      farmSizeUnit: formData.farmUnit || formData.farmSizeUnit || 'acres',
      country: formData.country || 'India',
      state: farmLoc.state || formData.state || '',
      district: farmLoc.district || formData.district || '',
      subDistrict: farmLoc.mandal || formData.subDistrict || '',
      villageArea: formData.location || formData.villageArea || '',
      latitude: finalLat,
      longitude: finalLon,
      primaryCrop: formData.crop || formData.primaryCrop || 'Wheat',
      cropVariety: formData.cropVariety || '',
      farmingType: formData.farmingType || 'Organic',
      dominantSoilType: formData.soilType || formData.dominantSoilType || 'Alluvial',
      cropGrowthStage: formData.growthStage || formData.cropGrowthStage || 'Vegetative',
      irrigationSystem: formData.irrigationType || formData.irrigationSystem || 'Drip Irrigation',
      coordinates: hasValidCoords ? { lat: finalLat!, lng: finalLon! } : undefined,
      locationObj: farmLoc,
      locationMetadata: finalLocationMetadata,
    };

    if (user) {
      try {
        if (activeFarm) {
          await editFarm(activeFarm.id, {
            farmName: finalFormData.farmName,
            farmerName: finalFarmerName,
            country: finalFormData.country,
            stateRegion: finalFormData.stateRegion,
            state: farmLoc.state,
            district: farmLoc.district,
            subDistrict: farmLoc.mandal,
            locationName: finalFormData.location,
            location: farmLoc,
            latitude: finalLat,
            longitude: finalLon,
            area: finalFormData.farmSize,
            areaUnit: (finalFormData.farmUnit || finalFormData.farmSizeUnit || 'acres') as any,
            crop: finalFormData.crop || finalFormData.primaryCrop || 'Wheat',
            cropVariety: finalFormData.cropVariety,
            cropStage: (finalFormData.growthStage || finalFormData.cropGrowthStage || 'Vegetative') as any,
            soilType: finalFormData.soilType || finalFormData.dominantSoilType || 'Alluvial',
            irrigationType: (finalFormData.irrigationType || finalFormData.irrigationSystem || 'Drip Irrigation') as any,
            farmingType: finalFormData.farmingType,
            locationMetadata: finalLocationMetadata,
          });
        } else {
          await addFarm({
            farmName: finalFormData.farmName || `${finalFormData.farmingType || 'Organic'} Farm`,
            farmerName: finalFarmerName,
            country: finalFormData.country,
            stateRegion: finalFormData.stateRegion,
            state: farmLoc.state,
            district: farmLoc.district,
            subDistrict: farmLoc.mandal,
            locationName: finalFormData.location,
            location: farmLoc,
            latitude: finalLat,
            longitude: finalLon,
            area: finalFormData.farmSize,
            areaUnit: (finalFormData.farmUnit || finalFormData.farmSizeUnit || 'acres') as any,
            crop: finalFormData.crop || finalFormData.primaryCrop || 'Wheat',
            cropVariety: finalFormData.cropVariety,
            cropStage: (finalFormData.growthStage || finalFormData.cropGrowthStage || 'Vegetative') as any,
            soilType: finalFormData.soilType || finalFormData.dominantSoilType || 'Alluvial',
            irrigationType: (finalFormData.irrigationType || finalFormData.irrigationSystem || 'Drip Irrigation') as any,
            farmingType: finalFormData.farmingType,
            locationMetadata: finalLocationMetadata,
          });
        }
        setIsGpsAcquired(false);
        onSaveProfile(finalFormData);
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      } catch (err: any) {
        console.error('Failed to sync updated farm to Firestore:', err);
        setSaveError(err.message || 'Unable to save Farm Profile. Please try again.');
      }
    } else {
      onSaveProfile(finalFormData);
      setIsGpsAcquired(false);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }

    setIsSaving(false);
  };

  const handleLoadPreset = (preset: FarmProfile) => {
    setFormData({ ...preset });
    onSaveProfile({ ...preset });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  if (user && loadingFarms) {
    return (
      <div className="w-full max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-12 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600 dark:text-emerald-400" />
        <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">
          {t.loading || 'Loading...'}
        </span>
      </div>
    );
  }

  const hasNoFarms = user && farms.length === 0;

  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-6 sm:space-y-8 min-w-0">
      {/* GUEST PREVIEW DEMO FARM INDICATOR */}
      {!user && (
        <div className="bg-emerald-950/90 dark:bg-emerald-950/95 border border-emerald-800/80 rounded-2xl p-4 sm:p-5 text-emerald-100 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-800/80 flex items-center justify-center shrink-0">
              <Compass className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-800 text-emerald-200">
                  Guest Preview — Demo Farm
                </span>
                <span className="text-xs font-bold text-emerald-300">
                  KhetiNexus Demo Farm • Warangal, Telangana
                </span>
              </div>
              <p className="text-xs text-emerald-200/90 mt-0.5">
                Demo profile. Editing updates local React session state only and will not be saved to Firestore.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="bg-white dark:bg-[#0c1810] rounded-2xl border border-stone-200/80 dark:border-stone-800/80 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 flex items-center justify-center shrink-0">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-heading text-2xl font-bold text-stone-900 dark:text-stone-100">
              {t.profileTitle}
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-0.5">
              {t.profileSubtitle}
            </p>
          </div>
        </div>

        {saveError && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-100 dark:bg-red-950/60 text-red-800 dark:text-red-300 text-xs font-semibold animate-fade-in border border-red-200 dark:border-red-800">
            <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
            <span>{saveError}</span>
          </div>
        )}
        {savedSuccess && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-semibold animate-fade-in border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{t.profileSavedSuccess || t.profileSavedAlert}</span>
          </div>
        )}
      </div>

      {hasNoFarms ? (
        <div id="empty-farm-profile-container" className="bg-white dark:bg-[#0c1810] rounded-2xl border border-stone-200/80 dark:border-stone-800/80 p-8 sm:p-12 text-center space-y-6 transition-colors shadow-xs flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 flex items-center justify-center shrink-0">
            <Sprout className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="max-w-md mx-auto space-y-2">
            <h2 className="font-heading text-lg sm:text-xl font-bold text-stone-900 dark:text-stone-100">
              {t.noFarmsYet || 'No Farm Added'}
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 leading-relaxed">
              {t.addFarmPrompt || 'Add your farm profile to start receiving personalized agricultural recommendations.'}
            </p>
          </div>
          <button
            type="button"
            id="empty-profile-add-farm-btn"
            onClick={() => {
              setEditingFarm(null);
              setFarmModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer min-h-[46px]"
          >
            <Plus className="w-4 h-4" />
            <span>{fpLabels.addFarm || t.addFarm || 'Add Farm'}</span>
          </button>
        </div>
      ) : (
        <>
          {/* Active Farm Context Telemetry Ribbon */}
      <div className="bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-500/20 dark:border-emerald-500/30 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-3.5 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Sprout className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-stone-900 dark:text-stone-100 text-sm sm:text-base">
                {formatFarmValue(formData.name || 'Active Farm', language, localizeFarmName)}
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-600/10 text-emerald-800 dark:text-emerald-300 border border-emerald-600/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                {fpLabels.activeSourceOfTruth}
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-stone-600 dark:text-stone-300 font-medium px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700">
                <UserCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                <span>{farmerNameInput || formData.farmerName || farmerName || 'Farmer'}</span>
              </span>
            </div>
            <div className="flex items-center gap-2 sm:gap-2.5 text-xs text-stone-600 dark:text-stone-400 mt-1 flex-wrap">
              <span className="flex items-center gap-1 font-medium text-stone-700 dark:text-stone-300">
                <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                {formatFarmLocation(formData.location || formData.district, formData.stateRegion || formData.country, language)}
              </span>
              <span>•</span>
              <span className="font-medium text-emerald-800 dark:text-emerald-300">
                {formatFarmValue(formData.crop, language, localizeCrop)} ({formatFarmValue(formData.growthStage, language, localizeGrowthStage)})
              </span>
              <span>•</span>
              <span>
                {formData.farmSize} {formatFarmValue(formData.farmUnit, language, localizeFarmUnit)}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-[11px] font-medium text-stone-600 dark:text-stone-400 bg-white/80 dark:bg-stone-900/80 px-3 py-1.5 rounded-xl border border-stone-200/80 dark:border-stone-800/80 self-start md:self-auto shrink-0 shadow-2xs">
          <Check className="w-3.5 h-3.5 text-emerald-600" />
          <span>{fpLabels.synchronizedTelemetry}</span>
        </div>
      </div>

      {/* Cloud Farm Registry (Firestore) */}
      <div className="bg-white dark:bg-[#0c1810] rounded-2xl border border-stone-200/80 dark:border-stone-800/80 p-5 sm:p-6 shadow-xs space-y-4 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 flex items-center justify-center shrink-0">
              <Cloud className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-heading text-base font-bold text-stone-900 dark:text-stone-100">
                  {t.myFarms}
                </h2>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300">
                  {fpLabels.cloudFirestoreRegistry}
                </span>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                {user ? fpLabels.userFarmsDesc : fpLabels.loginToPersonalize}
              </p>
            </div>
          </div>

          <div>
            {user ? (
              <button
                type="button"
                id="add-new-farm-btn"
                onClick={() => {
                  setEditingFarm(null);
                  setFarmModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer min-h-[40px]"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{fpLabels.addFarm}</span>
              </button>
            ) : (
              <button
                type="button"
                id="profile-login-btn"
                onClick={() => {
                  setAuthModalMode('login');
                  setAuthModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer min-h-[40px]"
              >
                <span>{t.login}</span>
              </button>
            )}
          </div>
        </div>

        {user && farms.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-2">
            {farms.map((f) => {
              const isActive = activeFarm?.id === f.id;
              return (
                <div
                  key={f.id}
                  id={`farm-card-${f.id}`}
                  onClick={() => selectActiveFarm(f.id)}
                  className={`p-4 sm:p-4.5 rounded-2xl border text-left cursor-pointer transition-all duration-200 flex flex-col justify-between min-h-[145px] ${
                    isActive
                      ? 'bg-emerald-50/85 dark:bg-emerald-950/40 border-emerald-500 shadow-xs ring-1 ring-emerald-500/30'
                      : 'bg-stone-50/80 dark:bg-stone-900/60 hover:bg-stone-100 dark:hover:bg-stone-800 border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2.5">
                      <span className="font-bold text-sm sm:text-base text-stone-900 dark:text-stone-100 break-words leading-snug">
                        {formatFarmValue(f.farmName, language, localizeFarmName)}
                      </span>
                      {isActive && (
                        <span className="shrink-0 text-[10px] sm:text-xs font-bold px-2 py-0.5 bg-emerald-600 text-white rounded-md tracking-wide shadow-2xs">
                          {t.activeFarm}
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-stone-500 dark:text-stone-400 space-y-2">
                      <div className="flex items-center justify-between gap-1 text-[11px] text-stone-500 dark:text-stone-400">
                        <span className="flex items-center gap-1 font-medium text-emerald-850 dark:text-emerald-300">
                          <UserCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                          <span>{f.farmerName || farmerName || 'Farmer'}</span>
                        </span>
                        <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300">
                          {localizeFarmingType(f.farmingType || 'Organic', language)}
                        </span>
                      </div>
                      <div className="flex items-start gap-1.5 text-stone-600 dark:text-stone-300">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                        <span className="break-words leading-relaxed text-xs sm:text-[13px] font-medium">
                          {formatFarmLocation(f.locationName || f.district, f.stateRegion || f.state, language)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap pt-1">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-emerald-100/90 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-200 font-bold text-xs sm:text-sm border border-emerald-300/60 dark:border-emerald-800/60 shadow-2xs">
                          {formatFarmValue(f.crop, language, localizeCrop)}
                        </span>
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-stone-100/90 dark:bg-stone-800/90 text-stone-800 dark:text-stone-200 font-bold text-xs sm:text-sm border border-stone-300/60 dark:border-stone-700/60 shadow-2xs">
                          {f.area} {formatFarmValue(f.areaUnit, language, localizeFarmUnit)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-stone-200/80 dark:border-stone-800/80 flex items-center justify-end gap-1.5">
                    <button
                      type="button"
                      id={`edit-farm-card-btn-${f.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingFarm(f);
                        setFarmModalOpen(true);
                      }}
                      className="p-1.5 rounded-lg hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-400 transition-colors cursor-pointer"
                      title={t.editFarm}
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      id={`delete-farm-card-btn-${f.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeletingFarm(f);
                      }}
                      className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-950 text-red-600 dark:text-red-400 transition-colors cursor-pointer"
                      title={t.deleteFarm}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Main Farm Profile Form with Distinct Classification Cards */}
      <form id="farm-profile-form" onSubmit={handleSubmit} className="w-full space-y-5 sm:space-y-6">
        
        {/* Classification 1: Farm Identity & Farmer Profile */}
        <div className="bg-white dark:bg-[#0c1810] rounded-2xl border border-stone-200/90 dark:border-stone-800/90 p-5 sm:p-7 shadow-xs space-y-4 sm:space-y-5 transition-colors">
          <div className="flex items-center justify-between pb-3 border-b border-stone-200/80 dark:border-stone-800/80">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 flex items-center justify-center text-xs font-bold shrink-0">
                1
              </span>
              <div>
                <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 leading-tight">
                  {fpLabels.farmIdentificationHeader || 'Farm Identity & Farmer Profile'}
                </h3>
                <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                  Farmer details and operational farm size
                </p>
              </div>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60 hidden sm:inline-block">
              Identity
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {/* Farmer Name (Connected to Login Profile) */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                {t.farmerName || 'Farmer Name'} *
              </label>
              <input
                type="text"
                id="input-farmer-name"
                required
                value={farmerNameInput}
                onChange={(e) => setFarmerNameInput(e.target.value)}
                className="w-full px-3.5 py-2.5 sm:py-3 rounded-xl border border-stone-300 dark:border-stone-700 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 outline-none text-xs sm:text-sm text-stone-900 dark:text-stone-100 bg-white dark:bg-stone-900 min-h-[44px] sm:min-h-[46px] transition-all shadow-2xs"
                placeholder={t.namePlaceholder || 'e.g. Ramesh Kumar / Praveen'}
              />
            </div>

            {/* Farm Name (Defaults to Crop Type) */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                {t.farmNameLabel || 'Farm Name'} *
              </label>
              <input
                type="text"
                id="input-farm-name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 sm:py-3 rounded-xl border border-stone-300 dark:border-stone-700 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 outline-none text-xs sm:text-sm text-stone-900 dark:text-stone-100 bg-white dark:bg-stone-900 min-h-[44px] sm:min-h-[46px] transition-all shadow-2xs"
                placeholder={t.farmNamePlaceholder || `${formData.crop || 'Wheat'} Farm`}
              />
              {language !== 'en' && formData.name.trim() !== '' && (
                <div className="mt-1.5 text-xs text-emerald-700 dark:text-emerald-400 font-medium">
                  {localizeFarmName(formData.name, language)}
                </div>
              )}
            </div>

            {/* Farm Area & Unit */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                {t.farmSize} *
              </label>
              <div className="flex items-center gap-2 sm:gap-2.5 max-w-md">
                <input
                  type="text"
                  inputMode="decimal"
                  id="input-farm-size"
                  required
                  value={farmSizeInput}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === '' || /^\d*\.?\d*$/.test(val)) {
                      setFarmSizeInput(val);
                      const parsed = parseFloat(val);
                      if (!isNaN(parsed) && parsed > 0) {
                        setFormData((prev) => ({ ...prev, farmSize: parsed }));
                      }
                    }
                  }}
                  onBlur={() => {
                    const parsed = parseFloat(farmSizeInput);
                    if (!farmSizeInput.trim() || isNaN(parsed) || parsed <= 0) {
                      const fallback = formData.farmSize || 1;
                      setFarmSizeInput(String(fallback));
                      setFormData((prev) => ({ ...prev, farmSize: fallback }));
                    } else {
                      setFarmSizeInput(String(parsed));
                      setFormData((prev) => ({ ...prev, farmSize: parsed }));
                    }
                  }}
                  placeholder="e.g. 2.5"
                  className="w-24 shrink-0 px-2.5 sm:px-3 py-2.5 sm:py-3 rounded-xl border border-stone-300 dark:border-stone-700 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 outline-none text-xs sm:text-sm text-stone-900 dark:text-stone-100 bg-white dark:bg-stone-900 h-[46px] min-h-[46px] font-normal text-center transition-all shadow-2xs"
                />
                <select
                  value={formData.farmUnit}
                  onChange={(e) => setFormData({ ...formData, farmUnit: e.target.value as any })}
                  className="flex-1 min-w-0 px-3.5 py-2.5 sm:py-3 rounded-xl border border-stone-300 dark:border-stone-700 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 outline-none text-sm sm:text-base font-normal text-stone-900 dark:text-stone-100 bg-white dark:bg-stone-900 h-[46px] min-h-[46px] cursor-pointer transition-all shadow-2xs"
                >
                  <option value="acres">{formatFarmValue('acres', language, localizeFarmUnit)}</option>
                  <option value="hectares">{formatFarmValue('hectares', language, localizeFarmUnit)}</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Classification 2: Geographic Location & Spatial Coordinates */}
        <div className="bg-white dark:bg-[#0c1810] rounded-2xl border border-stone-200/90 dark:border-stone-800/90 p-5 sm:p-7 shadow-xs space-y-4 sm:space-y-5 transition-colors">
          <div className="flex items-center justify-between pb-3 border-b border-stone-200/80 dark:border-stone-800/80">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 flex items-center justify-center text-xs font-bold shrink-0">
                2
              </span>
              <div>
                <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 leading-tight">
                  {fpLabels.districtLabel ? `2. ${t.location || 'Location'} & Spatial Mapping` : '2. Geographic Location & Spatial Coordinates'}
                </h3>
                <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                  Administrative state/district hierarchy, village, and satellite telemetry mapping
                </p>
              </div>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60 hidden sm:inline-block">
              Location
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {/* Country */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                {t.country} *
              </label>
              <input
                type="text"
                readOnly
                value={formatFarmValue(activeCountry, language, localizeCountry)}
                className="w-full px-3.5 py-2.5 sm:py-3 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-100/90 dark:bg-stone-800/60 text-stone-800 dark:text-stone-200 cursor-not-allowed opacity-90 text-xs sm:text-sm min-h-[44px] sm:min-h-[46px] font-medium transition-all"
              />
            </div>

            {/* State / Region */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                {t.stateRegion} *
              </label>
              {getIndiaStates().length > 0 ? (
                <select
                  id="input-state-region"
                  required
                  value={formData.stateRegion}
                  onChange={(e) => {
                    const newSt = e.target.value;
                    setIsGpsAcquired(false);
                    setGeoMsg(null);
                    setFormData({
                      ...formData,
                      stateRegion: newSt,
                      district: '',
                      subDistrict: '',
                      location: '',
                      latitude: null,
                      longitude: null,
                      coordinates: undefined,
                      locationMetadata: undefined,
                    });
                  }}
                  className="w-full px-3.5 py-2.5 sm:py-3 rounded-xl border border-stone-300 dark:border-stone-700 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 outline-none text-xs sm:text-sm text-stone-900 dark:text-stone-100 bg-white dark:bg-stone-900 min-h-[44px] sm:min-h-[46px] cursor-pointer transition-all shadow-2xs"
                >
                  <option value="">
                    {formatFarmValue('Select State / Region', language, (v, l) => {
                      const norm = normalizeLang(l);
                      const map: Record<string, string> = {
                        te: 'రాష్ట్రాన్ని ఎంచుకోండి',
                        hi: 'राज्य चुनें',
                        ta: 'மாநிலத்தைத் தேர்ந்தெடுக்கவும்',
                        kn: 'ರಾಜ್ಯವನ್ನು ಆಯ್ಕೆಮಾಡಿ',
                        mr: 'राज्य निवडा',
                        bn: 'রাজ্য নির্বাচন করুন',
                        gu: 'રાજ્ય પસંદ કરો',
                        pa: 'ਰਾਜ ਚੁਣੋ',
                        ml: 'സംസ്ഥാനം തിരഞ്ഞെടുക്കുക',
                        or: 'ରାଜ୍ୟ ଚୟନ କରନ୍ତୁ',
                        as: 'ৰাজ্য বাছক',
                        ur: 'ریاست منتخب کریں',
                      };
                      return map[norm] || `${t.select || 'Select'} ${t.stateRegion}`;
                    })}
                  </option>
                  {getIndiaStates().map((st) => (
                    <option key={st} value={st}>
                      {formatFarmValue(st, language, localizeState)}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  id="input-state-region"
                  required
                  value={formData.stateRegion}
                  onChange={(e) => {
                    const newSt = e.target.value;
                    setIsGpsAcquired(false);
                    setGeoMsg(null);
                    setFormData({
                      ...formData,
                      stateRegion: newSt,
                      district: '',
                      subDistrict: '',
                      location: '',
                      latitude: null,
                      longitude: null,
                      coordinates: undefined,
                      locationMetadata: undefined,
                    });
                  }}
                  className="w-full px-3.5 py-2.5 sm:py-3 rounded-xl border border-stone-300 dark:border-stone-700 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 outline-none text-xs sm:text-sm text-stone-900 dark:text-stone-100 bg-white dark:bg-stone-900 min-h-[44px] sm:min-h-[46px] transition-all shadow-2xs"
                  placeholder={`e.g. ${t.stateRegion}...`}
                />
              )}
            </div>

            {/* Farm Location Sub-Section (District, Mandal, Village, GPS) */}
            {(() => {
              const subDistricts = formData.stateRegion && formData.district ? getIndiaSubDistricts(formData.stateRegion, formData.district) : [];
              const enteredVillage = formData.location || '';
              const isTypedInLocal = isTextInLanguageScript(enteredVillage, language);
              const rawTranslation = !isTypedInLocal && enteredVillage.trim() && normalizeLang(language) !== 'en'
                ? (translatePlaceName(enteredVillage, language) || localizeSubDistrict(enteredVillage, language) || localizeDistrict(enteredVillage, language))
                : '';
              const villageTranslation = rawTranslation && rawTranslation !== enteredVillage ? rawTranslation : '';

              const getLocalizedOrBilingualLabel = (english: string, localizedTerm?: string) => {
                if (!localizedTerm || normalizeLang(language) === 'en') {
                  return english;
                }
                return localizedTerm;
              };

              const locationHeader = getLocalizedOrBilingualLabel('Detailed Field Location', fpLabels.districtLabel ? `${t.farmProfile || 'Farm'} ${t.location || 'Location'}` : undefined);
              const districtLabel = getLocalizedOrBilingualLabel('District', fpLabels.districtLabel);
              const subDistrictLabel = getLocalizedOrBilingualLabel('Sub-District / Mandal / Tehsil', fpLabels.subDistrictLabel);
              const villageLabel = getLocalizedOrBilingualLabel('Village / Town / Area', fpLabels.villageLabel);

              const selectDistrictPlaceholder = formatFarmValue('Select District', language, (v, l) => {
                const norm = normalizeLang(l);
                const map: Record<string, string> = {
                  te: 'జిల్లాను ఎంచుకోండి',
                  hi: 'ज़िला चुनें',
                  ta: 'மாவட்டத்தைத் தேர்ந்தெடுக்கவும்',
                  kn: 'ಜಿಲ್ಲೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ',
                  mr: 'जिल्हा निवडा',
                  bn: 'জেলা নির্বাচন করুন',
                  gu: 'જિલ્લો પસંદ કરો',
                  pa: 'ਜ਼ਿਲ੍ਹਾ ਚੁਣੋ',
                  ml: 'ജില്ല തിരഞ്ഞെടുക്കുക',
                  or: 'ଜିଲ୍ଲା ଚୟନ କରନ୍ତୁ',
                  as: 'জিলা বাছক',
                  ur: 'ضلع منتخب کریں',
                };
                return map[norm] || `${t.select || 'Select'} District`;
              });

              return (
                <div className="md:col-span-2 rounded-2xl border border-stone-200/80 dark:border-stone-800/80 bg-stone-50/70 dark:bg-stone-900/40 p-4 sm:p-5 space-y-4 shadow-2xs">
                  {/* Location Header with GPS & Geocode Actions */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-stone-200/60 dark:border-stone-800/60">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span className="text-xs sm:text-sm font-semibold text-stone-800 dark:text-stone-200">
                        {locationHeader}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <button
                        type="button"
                        id="profile-geocode-btn"
                        onClick={handleGeocodeLocation}
                        disabled={geocoding}
                        className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg bg-white dark:bg-stone-800 border border-stone-300/80 dark:border-stone-700/80 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors cursor-pointer shadow-2xs font-normal"
                      >
                        {geocoding ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <MapPin className="w-3.5 h-3.5 text-emerald-600" />}
                        <span>{geocoding ? fpLabels.geocoding : fpLabels.geocodeBtn}</span>
                      </button>

                      <button
                        type="button"
                        id="profile-use-my-location-btn"
                        onClick={handleGetLocation}
                        disabled={locating}
                        className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300/80 dark:border-emerald-800/80 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors cursor-pointer shadow-2xs font-normal"
                      >
                        {locating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Compass className="w-3.5 h-3.5" />}
                        <span>{locating ? fpLabels.locating : fpLabels.useLiveGps}</span>
                      </button>
                    </div>
                  </div>

                  {/* Location Form Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
                    {/* District */}
                    <div>
                      <label htmlFor="input-farm-district" className="block text-xs font-normal text-stone-700 dark:text-stone-300 mb-1.5">
                        {districtLabel} *
                      </label>
                      {formData.stateRegion && getIndiaDistricts(formData.stateRegion).length > 0 ? (
                        <select
                          id="input-farm-district"
                          value={formData.district || ''}
                          onChange={(e) => {
                            const newDist = e.target.value;
                            setIsGpsAcquired(false);
                            if (!newDist) {
                              setGeoMsg(null);
                              setFormData((prev) => ({
                                ...prev,
                                district: '',
                                subDistrict: '',
                                location: '',
                                latitude: null,
                                longitude: null,
                                coordinates: undefined,
                                locationMetadata: undefined,
                              }));
                              return;
                            }
                            setFormData((prev) => ({
                              ...prev,
                              district: newDist,
                              subDistrict: '',
                              location: '',
                              latitude: null,
                              longitude: null,
                              coordinates: undefined,
                              locationMetadata: undefined,
                            }));
                            resolveGeocode({
                              state: formData.stateRegion,
                              district: newDist,
                              subDistrict: '',
                              location: '',
                            });
                          }}
                          className="w-full h-11 min-h-[44px] px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 outline-none text-xs sm:text-sm font-normal text-stone-900 dark:text-stone-100 bg-white dark:bg-stone-900 cursor-pointer transition-all shadow-2xs"
                        >
                          <option value="">{selectDistrictPlaceholder}</option>
                          {getIndiaDistricts(formData.stateRegion).map((d) => (
                            <option key={d} value={d}>
                              {formatFarmValue(d, language, localizeDistrict)}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type="text"
                          id="input-farm-district"
                          value={formData.district || ''}
                          onChange={(e) => {
                            const newDist = e.target.value;
                            setIsGpsAcquired(false);
                            setFormData((prev) => ({
                              ...prev,
                              district: newDist,
                            }));
                          }}
                          onBlur={() => {
                            if (formData.district && formData.district.trim().length > 1) {
                              resolveGeocode({
                                state: formData.stateRegion,
                                district: formData.district,
                                subDistrict: formData.subDistrict,
                                location: formData.location,
                              });
                            }
                          }}
                          className="w-full h-11 min-h-[44px] px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 outline-none text-xs sm:text-sm font-normal text-stone-900 dark:text-stone-100 bg-white dark:bg-stone-900 transition-all shadow-2xs"
                          placeholder={formData.stateRegion ? `${t.enter || 'Enter'} ${districtLabel}` : `${t.select || 'Select'} ${t.stateRegion} ${t.first || 'first'}`}
                        />
                      )}
                    </div>

                    {/* Sub-District / Mandal / Tehsil */}
                    {subDistricts.length > 0 && (
                      <div>
                        <label className="block text-xs font-normal text-stone-700 dark:text-stone-300 mb-1.5">
                          {subDistrictLabel}
                        </label>
                        <select
                          value={formData.subDistrict || ''}
                          onChange={(e) => {
                            const newSubDist = e.target.value;
                            setIsGpsAcquired(false);
                            setFormData((prev) => ({
                              ...prev,
                              subDistrict: newSubDist,
                            }));
                            if (newSubDist) {
                              resolveGeocode({
                                state: formData.stateRegion,
                                district: formData.district,
                                subDistrict: newSubDist,
                                location: formData.location,
                              });
                            }
                          }}
                          className="w-full h-11 min-h-[44px] px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 outline-none text-xs sm:text-sm font-normal text-stone-900 dark:text-stone-100 bg-white dark:bg-stone-900 cursor-pointer transition-all shadow-2xs"
                        >
                          <option value="" className="text-stone-500 font-normal">
                            {formatFarmValue('Select Sub-District / Mandal / Tehsil', language, (val, l) => {
                              const norm = normalizeLang(l);
                              const map: Record<string, string> = {
                                te: 'ఉప-జిల్లా / మండలం / తహసీల్ ఎంచుకోండి',
                                hi: 'उप-ज़िला / मंडल / तहसील चुनें',
                                ta: 'துணை மாவட்டம் / வட்டம் தேர்ந்தெடுக்கவும்',
                                kn: 'ಉಪ-ಜಿಲ್ಲೆ / ತಾಲೂಕು ಆಯ್ಕೆಮಾಡಿ',
                                mr: 'उप-जिल्हा / तालुका निवडा',
                                bn: 'উপ-জেলা / তহশিল নির্বাচন করুন',
                                gu: 'પેટા-જિલ્લો / તાલુકો પસંદ કરો',
                                pa: 'ਉਪ-ਜ਼ਿਲ੍ਹਾ / ਤਹਿਸੀਲ ਚੁਣੋ',
                                ml: 'ഉപജില്ല / താലൂക്ക് തിരഞ്ഞെടുക്കുക',
                                or: 'ଉପ-ଜିଲ୍ଲା / ତହସିଲ ଚୟନ କରନ୍ତୁ',
                              };
                              return map[norm] || val;
                            })}
                          </option>
                          {subDistricts.map((sd) => {
                            const trans = localizeSubDistrict(sd, language);
                            return (
                              <option key={sd} value={sd} className="py-2 text-stone-900 dark:text-stone-100 font-normal">
                                {trans && trans !== sd ? trans : sd}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    )}

                    {/* Village / Town / Area */}
                    <div className={subDistricts.length > 0 ? 'md:col-span-2' : 'md:col-span-1'}>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <label className="block text-xs font-normal text-stone-700 dark:text-stone-300">
                          {villageLabel}
                        </label>
                        {villageTranslation && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 text-[11px] font-normal text-emerald-800 dark:text-emerald-300">
                            <span className="text-stone-500 dark:text-stone-400 font-normal">
                              {formatFarmValue('Translation', language, (v, l) => normalizeLang(l) === 'te' ? 'అనువాదం' : v)}:
                            </span>
                            <span>{villageTranslation}</span>
                          </span>
                        )}
                      </div>

                      <div className="relative flex items-center">
                        <input
                          type="text"
                          id="input-farm-location"
                          value={formData.location || ''}
                          onChange={(e) => {
                            const newLoc = e.target.value;
                            setIsGpsAcquired(false);
                            setFormData((prev) => ({
                              ...prev,
                              location: newLoc,
                            }));
                          }}
                          onBlur={() => {
                            if (formData.location && formData.location.trim().length > 1) {
                              resolveGeocode({
                                state: formData.stateRegion,
                                district: formData.district,
                                subDistrict: formData.subDistrict,
                                location: formData.location,
                              });
                            }
                          }}
                          placeholder={
                            normalizeLang(language) === 'en'
                              ? 'Enter village, town, or locality name'
                              : `Enter village, town, or locality (${(() => {
                                  const norm = normalizeLang(language);
                                  const map: Record<string, string> = {
                                    te: 'గ్రామం / పట్టణం పేరు నమోదు చేయండి',
                                    hi: 'गाँव / कस्बा का नाम दर्ज करें',
                                    ta: 'கிராமம் / நகரம் பெயரை உள்ளிடவும்',
                                    kn: 'ಗ್ರಾಮ / ಪಟ್ಟಣದ ಹೆಸರನ್ನು ನಮೂದಿಸಿ',
                                    mr: 'गाव / शहराचे नाव प्रविष्ट करा',
                                    bn: 'গ্রাম / শহরের নাম লিখুন',
                                    gu: 'ગામ / નગરનું નામ દાખલ કરો',
                                    pa: 'ਪਿੰਡ / ਕਸਬੇ ਦਾ ਨਾਮ ਦਰਜ ਕਰੋ',
                                    ml: 'ഗ്രാമം / പട്ടണത്തിന്റെ പേര് നൽകുക',
                                    or: 'ଗ୍ରାମ / ସହରର ନାମ ଲେଖନ୍ତୁ',
                                  };
                                  return map[norm] || 'గ్రామం / ప్రాంతం';
                                })()})`
                          }
                          className={`w-full h-11 min-h-[44px] pl-3.5 ${
                            villageTranslation ? 'pr-32 sm:pr-40' : 'pr-3.5'
                          } py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 outline-none text-xs sm:text-sm font-normal text-stone-900 dark:text-stone-100 bg-white dark:bg-stone-900 transition-all shadow-2xs placeholder:text-stone-400 dark:placeholder:text-stone-500`}
                        />
                        {villageTranslation && (
                          <button
                            type="button"
                            onClick={() => {
                              setFormData((prev) => ({ ...prev, location: villageTranslation }));
                              resolveGeocode({
                                state: formData.stateRegion,
                                district: formData.district,
                                subDistrict: formData.subDistrict,
                                location: villageTranslation,
                              });
                            }}
                            title={formatFarmValue('Click to use translated name', language, (v, l) => normalizeLang(l) === 'te' ? 'అనువాదాన్ని ఉపయోగించడానికి క్లిక్ చేయండి' : v)}
                            className="absolute right-2 sm:right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/90 dark:hover:bg-emerald-900 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200 text-xs font-normal shadow-2xs transition-all cursor-pointer group"
                          >
                            <Languages className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 group-hover:scale-110 transition-transform" />
                            <span className="font-normal">{villageTranslation}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Geocode / Location Feedback message */}
                  {geoMsg && (
                    <div
                      className={`text-xs flex items-center gap-1.5 pt-1 ${
                        geoMsg.type === 'success' ? 'text-emerald-700 dark:text-emerald-400' : 'text-amber-700 dark:text-amber-400'
                      }`}
                    >
                      {geoMsg.type === 'success' ? (
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      ) : (
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      )}
                      <span>{geoMsg.text}</span>
                    </div>
                  )}

                  {/* Compact Secondary Location & Status Indicator */}
                  {geocoding ? (
                    <div className="pt-2.5 border-t border-stone-200/60 dark:border-stone-800/60 flex items-center gap-2 text-xs text-stone-600 dark:text-stone-300">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>{fpLabels.geocoding}</span>
                    </div>
                  ) : formData.latitude && formData.longitude && formData.district ? (
                    <div className="pt-2.5 border-t border-stone-200/60 dark:border-stone-800/60 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-1.5 text-stone-500 dark:text-stone-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                        <span className="font-normal">{fpLabels.locationResolved}:</span>
                        <span className="font-mono text-stone-700 dark:text-stone-300">
                          {formData.latitude.toFixed(4)}° N, {formData.longitude.toFixed(4)}° E
                        </span>
                      </div>
                      <div className="inline-flex items-center gap-1 text-[11px] font-normal text-emerald-700 dark:text-emerald-400">
                        <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span>{fpLabels.earthEngineReady}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="pt-2.5 border-t border-stone-200/60 dark:border-stone-800/60 flex items-center gap-2 text-xs text-amber-700 dark:text-amber-400">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{fpLabels.selectDistrictToResolve}</span>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        </div>

        {/* Classification 3: Crop, Soil & Agronomic Classification (Merged) */}
        <div className="bg-white dark:bg-[#0c1810] rounded-2xl border border-stone-200/90 dark:border-stone-800/90 p-5 sm:p-7 shadow-xs space-y-4 sm:space-y-5 transition-colors">
          <div className="flex items-center justify-between pb-3 border-b border-stone-200/80 dark:border-stone-800/80">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 flex items-center justify-center text-xs font-bold shrink-0">
                3
              </span>
              <div>
                <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 leading-tight">
                  3. Crop, Soil & Agronomic Classification
                </h3>
                <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5">
                  Crop variety, farming method, growth stage, soil taxonomy, and irrigation infrastructure
                </p>
              </div>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60 hidden sm:inline-block">
              Agronomy & Soil
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {/* Primary Crop */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                {t.cropName} *
              </label>
              <select
                id="select-crop"
                value={formData.crop}
                onChange={(e) => handleCropChange(e.target.value)}
                className="w-full h-[46px] min-h-[46px] px-3.5 py-2.5 sm:py-3 rounded-xl border border-stone-300 dark:border-stone-700 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 outline-none text-xs sm:text-sm text-stone-900 dark:text-stone-100 bg-white dark:bg-stone-900 font-medium cursor-pointer transition-all shadow-2xs"
              >
                {CROPS_LIST.map((crop) => {
                  const localized = localizeCrop(crop, language);
                  return (
                    <option key={crop} value={crop}>
                      {localized}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Crop Variety */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                {fpLabels.cropVarietyLabel}
              </label>
              <input
                type="text"
                id="input-crop-variety"
                value={formData.cropVariety || ''}
                onChange={(e) => setFormData({ ...formData, cropVariety: e.target.value })}
                placeholder={fpLabels.cropVarietyPlaceholder}
                className="w-full h-[46px] min-h-[46px] px-3.5 py-2.5 sm:py-3 rounded-xl border border-stone-300 dark:border-stone-700 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 outline-none text-xs sm:text-sm text-stone-900 dark:text-stone-100 bg-white dark:bg-stone-900 transition-all shadow-2xs"
              />
            </div>

            {/* Farming Type (Moved here into Agronomy Classification) */}
            <div>
              <label htmlFor="select-farming-type" className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                {formatFarmValue('Farming Type', language, (v, l) => {
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
                id="select-farming-type"
                value={formData.farmingType || 'Organic'}
                onChange={(e) => handleFarmingTypeChange(e.target.value)}
                className="w-full h-[46px] min-h-[46px] px-3.5 py-2.5 sm:py-3 rounded-xl border border-stone-300 dark:border-stone-700 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 outline-none text-xs sm:text-sm font-medium text-stone-900 dark:text-stone-100 bg-white dark:bg-stone-900 cursor-pointer transition-all shadow-2xs"
              >
                {['Organic', 'Conventional', 'Regenerative', 'Hydroponic', 'Natural'].map((type) => (
                  <option key={type} value={type}>
                    {localizeFarmingType(type, language)}
                  </option>
                ))}
              </select>
            </div>

            {/* Soil Type */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                {t.soilType} ({fpLabels.soilTypeLabelShort}) *
              </label>
              <select
                id="select-soil-type"
                value={formData.soilType}
                onChange={(e) => setFormData({ ...formData, soilType: e.target.value })}
                className="w-full h-[46px] min-h-[46px] px-3.5 py-2.5 sm:py-3 rounded-xl border border-stone-300 dark:border-stone-700 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 outline-none text-xs sm:text-sm text-stone-900 dark:text-stone-100 bg-white dark:bg-stone-900 cursor-pointer transition-all shadow-2xs font-medium"
              >
                {SOIL_TYPES.map((soil) => (
                  <option key={soil} value={soil}>
                    {formatFarmValue(soil, language, localizeSoilType)}
                  </option>
                ))}
              </select>
            </div>

            {/* Growth Stage */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-2">
                {t.growthStage} *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-2.5">
                {GROWTH_STAGES.map((st) => {
                  const isSelected = formData.growthStage === st;
                  return (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setFormData({ ...formData, growthStage: st })}
                      className={`py-2.5 sm:py-3 px-2 sm:px-3 rounded-xl border text-xs sm:text-sm font-semibold transition-all duration-150 cursor-pointer min-h-[44px] sm:min-h-[46px] flex items-center justify-center text-center break-words leading-snug shadow-2xs active:scale-[0.98] ${
                        isSelected
                          ? 'bg-emerald-600 text-white border-emerald-600 dark:bg-emerald-600 dark:border-emerald-500 dark:text-white shadow-xs ring-2 ring-emerald-500/30'
                          : 'bg-stone-50/90 dark:bg-stone-900/90 border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 hover:border-stone-300 dark:hover:border-stone-700'
                      }`}
                    >
                      {formatFarmValue(st, language, localizeGrowthStage)}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Irrigation Type */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-2">
                {t.irrigationType} *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-2.5">
                {IRRIGATION_TYPES.map((irr) => {
                  const isSelected = formData.irrigationType === irr;
                  return (
                    <button
                      key={irr}
                      type="button"
                      onClick={() => setFormData({ ...formData, irrigationType: irr })}
                      className={`py-2.5 sm:py-3 px-2 sm:px-3 rounded-xl border text-xs sm:text-sm font-semibold transition-all duration-150 cursor-pointer min-h-[46px] sm:min-h-[48px] flex items-center justify-center text-center break-words leading-snug shadow-2xs active:scale-[0.98] ${
                        isSelected
                          ? 'bg-emerald-600 text-white border-emerald-600 dark:bg-emerald-600 dark:border-emerald-500 dark:text-white shadow-xs ring-2 ring-emerald-500/30'
                          : 'bg-stone-50/90 dark:bg-stone-900/90 border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 hover:border-stone-300 dark:hover:border-stone-700'
                      }`}
                    >
                      {formatFarmValue(irr, language, localizeIrrigation)}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Submit & Reset actions */}
        <div className="bg-white dark:bg-[#0c1810] rounded-2xl border border-stone-200/90 dark:border-stone-800/90 p-4 sm:p-5 shadow-xs flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 transition-colors">
          <button
            type="button"
            onClick={() => setFormData({ ...currentFarm })}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-medium text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800/80 transition-all cursor-pointer min-h-[44px]"
          >
            <RotateCcw className="w-3.5 h-3.5 shrink-0" />
            <span className="whitespace-nowrap">{fpLabels.resetToSaved}</span>
          </button>

          <button
            type="submit"
            id="save-farm-profile-btn"
            disabled={isSaving}
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 sm:py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs sm:text-sm font-semibold shadow-xs hover:shadow transition-all cursor-pointer min-h-[44px] sm:min-h-[46px] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                <span>{t.savingProfile || 'Saving...'}</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4 shrink-0" />
                <span>{t.saveProfile}</span>
              </>
            )}
          </button>
        </div>
      </form>
        </>
      )}

      {deletingFarm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#0c1810] rounded-2xl border border-stone-200 dark:border-stone-800 p-6 max-w-md w-full shadow-xl space-y-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="space-y-2">
              <h3 className="font-heading text-lg font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
                <Trash2 className="w-5 h-5" />
                {fpLabels.deleteFarmModalTitle}
              </h3>
              <p className="text-sm text-stone-600 dark:text-stone-400">
                {fpLabels.deleteFarmModalDesc}
              </p>
            </div>

            <div className="bg-stone-50 dark:bg-stone-900/40 p-4 rounded-xl border border-stone-200/60 dark:border-stone-800/80 space-y-2.5">
              <div className="flex justify-between text-xs">
                <span className="text-stone-500 dark:text-stone-400 font-semibold">{t.farmLabel || 'Farm:'}</span>
                <span className="text-stone-900 dark:text-stone-100 font-bold">{formatFarmValue(deletingFarm.farmName, language, localizeFarmName)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-stone-500 dark:text-stone-400 font-semibold">{t.farmLocation || 'Location:'}</span>
                <span className="text-stone-900 dark:text-stone-100 font-bold">{formatFarmLocation(deletingFarm.locationName || deletingFarm.district, deletingFarm.stateRegion || deletingFarm.state, language)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-stone-500 dark:text-stone-400 font-semibold">{t.cropName || 'Crop:'}</span>
                <span className="text-stone-900 dark:text-stone-100 font-bold capitalize">{formatFarmValue(deletingFarm.crop, language, localizeCrop)}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingFarm(null)}
                className="px-4 py-2 text-xs font-semibold rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 cursor-pointer"
              >
                {fpLabels.cancelBtn}
              </button>
              <button
                type="button"
                id="confirm-delete-farm-btn"
                disabled={isPendingDelete}
                onClick={async () => {
                  setIsPendingDelete(true);
                  try {
                    await removeFarm(deletingFarm.id);
                    setDeletingFarm(null);
                  } catch (err) {
                    console.error("Deletion failed:", err);
                    alert("Unable to delete this farm. Please try again.");
                  } finally {
                    setIsPendingDelete(false);
                  }
                }}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-red-600 hover:bg-red-700 text-white focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
              >
                {isPendingDelete ? fpLabels.deletingFarm : fpLabels.deleteFarm}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
