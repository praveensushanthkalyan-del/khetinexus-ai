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
} from 'lucide-react';
import { FarmProfile, Language, UserFarm, FarmLocation } from '../types';
import { getTranslation } from '../i18n/translations';
import {
  localizeCountry,
  localizeCrop,
  localizeGrowthStage,
  localizeSoilType,
  localizeIrrigation,
} from '../i18n/dataTranslations';
import { useAuth } from '../context/AuthContext';
import { useCountry } from '../context/CountryContext';

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

const CROPS_LIST = [
  'Wheat',
  'Soybean',
  'Rice',
  'Maize (Corn)',
  'Barley',
  'Cotton',
  'Chickpeas / Gram',
  'Millet (Bajra / Ragi)',
  'Tomato',
  'Potato',
  'Sugarcane',
  'Sunflower',
];

const GROWTH_STAGES: FarmProfile['growthStage'][] = [
  'Germination',
  'Vegetative',
  'Flowering',
  'Grain filling',
  'Maturity',
];

const SOIL_TYPES = [
  'Alluvial Loam',
  'Chernozem (Black Earth)',
  'Cerrado Oxisol (Red Clay)',
  'Sandy Loam',
  'Clayey Soil',
  'Laterite Soil',
  'Silt Loam',
  'Black Cotton Soil (Vertisol)',
];

const IRRIGATION_TYPES: FarmProfile['irrigationType'][] = [
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
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [locating, setLocating] = useState(false);
  const [geocoding, setGeocoding] = useState(false);
  const [geoMsg, setGeoMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const t = getTranslation(language);
  const { activeCountry } = useCountry();
  const [deletingFarm, setDeletingFarm] = useState<UserFarm | null>(null);
  const [isPendingDelete, setIsPendingDelete] = useState(false);

  const {
    user,
    farms,
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

  const [isGpsAcquired, setIsGpsAcquired] = useState(false);
  const lastLoadedFarmIdRef = useRef<string | null>(null);

  useEffect(() => {
    const isDifferentFarm = currentFarm?.id !== lastLoadedFarmIdRef.current;
    if (isDifferentFarm) {
      setFormData({ ...currentFarm });
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
      }
    }
  }, [currentFarm]);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setGeoMsg({
        type: 'error',
        text: t.locationDenied || 'Geolocation is not supported by your browser.',
      });
      return;
    }

    setLocating(true);
    setGeoMsg({ type: 'success', text: 'Locating...' });

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
            const village = address.village || address.hamlet || address.isolated_dwelling || '';
            const locality = address.suburb || address.neighbourhood || address.residential || address.city_district || '';
            const district = address.district || address.city_district || address.city || address.town || address.county || '';
            const state = address.state || address.region || address.province || '';
            const country = address.country || '';
            const postalCode = address.postcode || '';
            const formattedAddress = data.display_name || '';

            console.log('Reverse geocoding result:', { formattedAddress, village, locality, district, state, country });

            const components = [village || locality, district, state].filter(Boolean);
            const displayLocation = components.join(', ') || formattedAddress;

            console.log('Final Farm Profile location:', { latitude: lat, longitude: lng, displayLocation });

            setFormData((prev) => ({
              ...prev,
              location: displayLocation,
              stateRegion: state || prev.stateRegion,
              locationMetadata: {
                latitude: lat,
                longitude: lng,
                accuracy,
                village,
                locality,
                district,
                state,
                country,
                postalCode,
                formattedAddress,
                source: 'gps',
                capturedAt: new Date().toISOString(),
              },
            }));

            setGeoMsg({
              type: 'success',
              text: `${t.locationAcquired || 'GPS Acquired'}: ${lat}°, ${lng}° (±${accuracy}m)`,
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
              text: `GPS acquired, but the address could not be determined. You can enter the location manually. (${lat}°, ${lng}°)`,
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
            text: `GPS acquired, but reverse-geocoding failed. You can enter the location manually. (${lat}°, ${lng}°)`,
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
            text: 'Location permission was denied. Please allow location access and try again.',
          });
        } else {
          setGeoMsg({
            type: 'error',
            text: 'Unable to determine your current location. Please check device/browser location settings.',
          });
        }
      },
      { timeout: 10000, enableHighAccuracy: true, maximumAge: 0 }
    );
  };

  const handleGeocodeLocation = async () => {
    const locQuery = [formData.location, formData.district, formData.stateRegion, formData.country || activeCountry || 'India']
      .filter(Boolean)
      .join(', ');

    if (!locQuery.trim()) {
      setGeoMsg({ type: 'error', text: 'Please enter a location, district, or state first.' });
      return;
    }

    setGeocoding(true);
    setGeoMsg({ type: 'success', text: 'Resolving coordinates for location...' });

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
          latitude: lat,
          longitude: lon,
          locationMetadata: {
            latitude: lat,
            longitude: lon,
            accuracy: 500,
            village: '',
            locality: '',
            district: prev.district || '',
            state: prev.stateRegion || '',
            country: prev.country || activeCountry || 'India',
            postalCode: '',
            formattedAddress: data[0].display_name || prev.location,
            source: 'geocoded' as any,
            capturedAt: new Date().toISOString(),
          },
        }));
        setGeoMsg({
          type: 'success',
          text: `Geocoded: ${lat}°, ${lon}° (${data[0].display_name?.split(',').slice(0, 2).join(',')})`,
        });
      } else {
        setGeoMsg({
          type: 'error',
          text: `Could not auto-geocode "${locQuery}". You can enter latitude and longitude manually below.`,
        });
      }
    } catch (err: any) {
      setGeoMsg({
        type: 'error',
        text: `Geocoding request failed: ${err.message}. You can enter coordinates manually.`,
      });
    } finally {
      setGeocoding(false);
    }
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
      setSaveError('Latitude must be between -90 and 90 degrees.');
      setIsSaving(false);
      return;
    }
    if (finalLon !== null && (finalLon < -180 || finalLon > 180)) {
      setSaveError('Longitude must be between -180 and 180 degrees.');
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

    const finalFormData: FarmProfile = {
      ...formData,
      latitude: finalLat,
      longitude: finalLon,
      coordinates: hasValidCoords ? { lat: finalLat!, lng: finalLon! } : undefined,
      locationObj: farmLoc,
      locationMetadata: finalLocationMetadata,
    };

    if (user) {
      try {
        if (activeFarm) {
          await editFarm(activeFarm.id, {
            farmName: finalFormData.name,
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
            areaUnit: finalFormData.farmUnit,
            crop: finalFormData.crop,
            cropVariety: finalFormData.cropVariety,
            cropStage: finalFormData.growthStage,
            soilType: finalFormData.soilType,
            irrigationType: finalFormData.irrigationType,
            locationMetadata: finalLocationMetadata,
          });
        } else {
          await addFarm({
            farmName: finalFormData.name || 'My Farm',
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
            areaUnit: finalFormData.farmUnit,
            crop: finalFormData.crop,
            cropVariety: finalFormData.cropVariety,
            cropStage: finalFormData.growthStage,
            soilType: finalFormData.soilType,
            irrigationType: finalFormData.irrigationType,
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

  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-6 sm:space-y-8 min-w-0">
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
                  Cloud Firestore
                </span>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                {user ? t.userFarmsDesc : t.loginToPersonalize}
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
                <span>{t.addFarm}</span>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
            {farms.map((f) => {
              const isActive = activeFarm?.id === f.id;
              return (
                <div
                  key={f.id}
                  id={`farm-card-${f.id}`}
                  onClick={() => selectActiveFarm(f.id)}
                  className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                    isActive
                      ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-500 shadow-xs ring-1 ring-emerald-500/30'
                      : 'bg-stone-50/80 dark:bg-stone-900/60 hover:bg-stone-100 dark:hover:bg-stone-800 border-stone-200 dark:border-stone-800'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <span className="font-bold text-xs text-stone-900 dark:text-stone-100 truncate">
                      {f.farmName}
                    </span>
                    {isActive && (
                      <span className="shrink-0 text-[10px] font-semibold px-1.5 py-0.5 bg-emerald-600 text-white rounded">
                        {t.activeFarm}
                      </span>
                    )}
                  </div>

                  <div className="text-[11px] text-stone-500 dark:text-stone-400 space-y-0.5">
                    <div className="flex items-center gap-1 truncate">
                      <MapPin className="w-3 h-3 text-stone-400 shrink-0" />
                      <span className="truncate">{f.locationName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-emerald-800 dark:text-emerald-300">{f.crop}</span>
                      <span>•</span>
                      <span>
                        {f.area} {f.areaUnit}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-stone-200 dark:border-stone-800 flex items-center justify-end gap-1.5">
                    <button
                      type="button"
                      id={`edit-farm-card-btn-${f.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingFarm(f);
                        setFarmModalOpen(true);
                      }}
                      className="p-1 rounded hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-400 text-xs cursor-pointer"
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
                      className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-950 text-red-600 dark:text-red-400 text-xs cursor-pointer"
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

      {/* Main Farm Profile Form */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-[#0c1810] rounded-2xl border border-stone-200/80 dark:border-stone-800/80 p-6 sm:p-8 shadow-xs space-y-6 transition-colors">
        {/* Section 1: Farm Identification */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 pb-2 border-b border-stone-100 dark:border-stone-800">
            1. Farm Identification & Context
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                {t.farmerName} *
              </label>
              <input
                type="text"
                id="input-farmer-name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none text-sm text-stone-900 dark:text-stone-100 bg-white dark:bg-stone-900 min-h-[44px]"
                placeholder="e.g. Farmer Name"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                {t.country} *
              </label>
              <input
                type="text"
                readOnly
                value={activeCountry}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-100 dark:bg-stone-800/50 text-stone-900 dark:text-stone-100 cursor-not-allowed opacity-80 min-h-[44px]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                {t.stateRegion} *
              </label>
              <input
                type="text"
                id="input-state-region"
                required
                value={formData.stateRegion}
                onChange={(e) => setFormData({ ...formData, stateRegion: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none text-sm text-stone-900 dark:text-stone-100 bg-white dark:bg-stone-900 min-h-[44px]"
                placeholder="e.g. Punjab, Mato Grosso, Krasnodar..."
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                {t.farmSize} *
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  id="input-farm-size"
                  required
                  value={formData.farmSize}
                  onChange={(e) => setFormData({ ...formData, farmSize: parseFloat(e.target.value) || 1 })}
                  className="w-2/3 px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none text-sm text-stone-900 dark:text-stone-100 bg-white dark:bg-stone-900 min-h-[44px]"
                />
                <select
                  value={formData.farmUnit}
                  onChange={(e) => setFormData({ ...formData, farmUnit: e.target.value as any })}
                  className="w-1/3 px-2 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 focus:border-emerald-600 outline-none text-sm text-stone-900 dark:text-stone-100 bg-white dark:bg-stone-900 min-h-[44px]"
                >
                  <option value="hectares">{t.hectares}</option>
                  <option value="acres">{t.acres}</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                District / County
              </label>
              <input
                type="text"
                id="input-farm-district"
                value={formData.district || ''}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none text-sm text-stone-900 dark:text-stone-100 bg-white dark:bg-stone-900 min-h-[44px]"
                placeholder="e.g. Adilabad, Ludhiana..."
              />
            </div>

            <div className="md:col-span-2">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300">
                  {t.farmLocation} *
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    id="profile-geocode-btn"
                    onClick={handleGeocodeLocation}
                    disabled={geocoding}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors cursor-pointer"
                  >
                    {geocoding ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    )}
                    <span>{geocoding ? 'Geocoding...' : 'Geocode Location'}</span>
                  </button>

                  <button
                    type="button"
                    id="profile-use-my-location-btn"
                    onClick={handleGetLocation}
                    disabled={locating}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors cursor-pointer"
                  >
                    {locating ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Compass className="w-3.5 h-3.5" />
                    )}
                    <span>{locating ? t.locating : t.useMyLocationBtn}</span>
                  </button>
                </div>
              </div>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-stone-400" />
                <input
                  type="text"
                  id="input-farm-location"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none text-sm text-stone-900 dark:text-stone-100 bg-white dark:bg-stone-900 min-h-[44px]"
                  placeholder="e.g. Adilabad District"
                />
              </div>

              {/* Geographic Coordinates (Latitude & Longitude) */}
              <div className="mt-3 p-3.5 rounded-xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-emerald-600" />
                    Canonical Coordinates (Required for Weather & Earth Engine Satellite Telemetry)
                  </span>
                  {formData.latitude != null && formData.longitude != null && !isNaN(formData.latitude) && !isNaN(formData.longitude) ? (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                      Coordinates Set
                    </span>
                  ) : (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                      Coordinates Missing
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-stone-600 dark:text-stone-400 mb-1">
                      Latitude (-90° to 90°)
                    </label>
                    <input
                      type="number"
                      step="0.000001"
                      min="-90"
                      max="90"
                      id="input-farm-latitude"
                      value={formData.latitude !== null && formData.latitude !== undefined ? formData.latitude : ''}
                      onChange={(e) => {
                        const val = e.target.value === '' ? null : parseFloat(e.target.value);
                        setFormData({ ...formData, latitude: val });
                      }}
                      placeholder="e.g. 19.6641"
                      className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 text-xs text-stone-900 dark:text-stone-100 bg-white dark:bg-stone-800 focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-stone-600 dark:text-stone-400 mb-1">
                      Longitude (-180° to 180°)
                    </label>
                    <input
                      type="number"
                      step="0.000001"
                      min="-180"
                      max="180"
                      id="input-farm-longitude"
                      value={formData.longitude !== null && formData.longitude !== undefined ? formData.longitude : ''}
                      onChange={(e) => {
                        const val = e.target.value === '' ? null : parseFloat(e.target.value);
                        setFormData({ ...formData, longitude: val });
                      }}
                      placeholder="e.g. 78.5320"
                      className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 text-xs text-stone-900 dark:text-stone-100 bg-white dark:bg-stone-800 focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                </div>
              </div>

              {geoMsg && (
                <div
                  className={`mt-2 text-xs flex items-center gap-1.5 ${
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
            </div>
          </div>
        </div>

        {/* Section 2: Crop & Soil Agronomic Profile */}
        <div className="space-y-4 pt-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 pb-2 border-b border-stone-100 dark:border-stone-800">
            2. Crop & Soil Classification
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                {t.cropName} *
              </label>
              <select
                id="select-crop"
                value={formData.crop}
                onChange={(e) => setFormData({ ...formData, crop: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none text-sm text-stone-900 dark:text-stone-100 bg-white dark:bg-stone-900 font-medium min-h-[44px]"
              >
                {CROPS_LIST.map((crop) => (
                  <option key={crop} value={crop}>
                    {localizeCrop(crop, language)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                {t.growthStage} *
              </label>
              <select
                id="select-growth-stage"
                value={formData.growthStage}
                onChange={(e) => setFormData({ ...formData, growthStage: e.target.value as any })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none text-sm text-stone-900 dark:text-stone-100 bg-white dark:bg-stone-900 min-h-[44px]"
              >
                {GROWTH_STAGES.map((st) => (
                  <option key={st} value={st}>
                    {localizeGrowthStage(st, language)}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                {t.soilType} ({t.soilTypeLabelShort || 'Classification'}) *
              </label>
              <select
                id="select-soil-type"
                value={formData.soilType}
                onChange={(e) => setFormData({ ...formData, soilType: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none text-sm text-stone-900 dark:text-stone-100 bg-white dark:bg-stone-900 min-h-[44px]"
              >
                {SOIL_TYPES.map((soil) => (
                  <option key={soil} value={soil}>
                    {localizeSoilType(soil, language)}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-1">
                * Note: Soil Type represents the physical soil category of your farm. Detailed nutrient and pH levels are managed separately under Soil Health.
              </p>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                {t.irrigationType} *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {IRRIGATION_TYPES.map((irr) => {
                  const isSelected = formData.irrigationType === irr;
                  return (
                    <button
                      key={irr}
                      type="button"
                      onClick={() => setFormData({ ...formData, irrigationType: irr })}
                      className={`py-2.5 px-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-100/90 dark:bg-emerald-950/90 border-emerald-600 dark:border-emerald-500 text-emerald-950 dark:text-emerald-200 shadow-2xs'
                          : 'bg-stone-50 dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                      }`}
                    >
                      {localizeIrrigation(irr, language)}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Submit & Reset actions */}
        <div className="pt-4 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setFormData({ ...currentFarm })}
            className="flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t.resetToSaved}</span>
          </button>

          <button
            type="submit"
            id="save-farm-profile-btn"
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-xs transition-colors cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed min-h-[44px]"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>{isSaving ? t.savingProfile || 'Saving...' : t.saveProfile}</span>
          </button>
        </div>
      </form>

      {deletingFarm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#0c1810] rounded-2xl border border-stone-200 dark:border-stone-800 p-6 max-w-md w-full shadow-xl space-y-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="space-y-2">
              <h3 className="font-heading text-lg font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
                <Trash2 className="w-5 h-5" />
                Delete farm?
              </h3>
              <p className="text-sm text-stone-600 dark:text-stone-400">
                This action will permanently remove this farm and its farm-specific data.
              </p>
            </div>

            <div className="bg-stone-50 dark:bg-stone-900/40 p-4 rounded-xl border border-stone-200/60 dark:border-stone-800/80 space-y-2.5">
              <div className="flex justify-between text-xs">
                <span className="text-stone-500 dark:text-stone-400 font-semibold">Farm:</span>
                <span className="text-stone-900 dark:text-stone-100 font-bold">{deletingFarm.farmName}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-stone-500 dark:text-stone-400 font-semibold">Location:</span>
                <span className="text-stone-900 dark:text-stone-100 font-bold">{deletingFarm.locationName}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-stone-500 dark:text-stone-400 font-semibold">Crop:</span>
                <span className="text-stone-900 dark:text-stone-100 font-bold capitalize">{localizeCrop(deletingFarm.crop, language)}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingFarm(null)}
                className="px-4 py-2 text-xs font-semibold rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 cursor-pointer"
              >
                Cancel
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
                {isPendingDelete ? 'Deleting...' : 'Delete Farm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
