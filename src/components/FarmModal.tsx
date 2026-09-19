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
import { getIndiaStates, getIndiaDistricts, resolveIndianGeographicContext } from '../data/indiaGeographicHierarchy';

interface FarmModalProps {
  currentLanguage: Language;
}

export const FarmModal: React.FC<FarmModalProps> = ({ currentLanguage }) => {
  const t = getTranslation(currentLanguage);
  const { activeCountry, countryAdapter } = useCountry();
  const {
    farmModalOpen,
    setFarmModalOpen,
    editingFarm,
    setEditingFarm,
    addFarm,
    editFarm,
  } = useAuth();

  const [farmName, setFarmName] = useState('');
  const [country, setCountry] = useState('India');
  const [stateRegion, setStateRegion] = useState('');
  const [locationName, setLocationName] = useState('');
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [area, setArea] = useState<number>(5);
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

  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const [geocoding, setGeocoding] = useState(false);
  const [geoMsg, setGeoMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [locationMetadata, setLocationMetadata] = useState<LocationMetadata | undefined>(undefined);

  useEffect(() => {
    if (editingFarm) {
      setFarmName(editingFarm.farmName || '');
      setCountry(editingFarm.country || 'India');
      setStateRegion(editingFarm.stateRegion || '');
      setLocationName(editingFarm.locationName || '');
      setLatitude(editingFarm.latitude ?? null);
      setLongitude(editingFarm.longitude ?? null);
      setArea(editingFarm.area || 5);
      setAreaUnit(editingFarm.areaUnit || 'acres');
      setCrop(editingFarm.crop || 'Wheat');
      setCropVariety(editingFarm.cropVariety || '');
      setCropStage(editingFarm.cropStage || 'Vegetative');
      setSoilType(editingFarm.soilType || 'Alluvial');
      setIrrigationType(editingFarm.irrigationType || 'Drip Irrigation');
      setLocationMetadata(editingFarm.locationMetadata);
    } else {
      setFarmName('');
      setCountry(activeCountry);
      setStateRegion('');
      setLocationName('');
      setLatitude(null);
      setLongitude(null);
      setArea(5);
      setAreaUnit('acres');
      setCrop('Wheat');
      setCropVariety('PBW-343');
      setCropStage('Vegetative');
      setSoilType('Alluvial');
      setIrrigationType('Drip Irrigation');
      setLocationMetadata(undefined);
    }
    setGeoMsg(null);
    setFormError(null);
  }, [editingFarm, farmModalOpen]);

  if (!farmModalOpen) return null;

  const handleClose = () => {
    setFarmModalOpen(false);
    setEditingFarm(null);
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setGeoMsg({ type: 'error', text: t.locationDenied || 'Geolocation is not supported by your browser.' });
      return;
    }
    setLocating(true);
    setGeoMsg({ type: 'success', text: 'Locating...' });
    
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
                 text: `Your GPS location appears to be outside the selected country (${countryAdapter.countryName}). Please change country.`
               });
               setLocating(false);
               return;
             }
             
             const address = data.address || {};
             const village = address.village || address.hamlet || address.isolated_dwelling || '';
             const locality = address.suburb || address.neighbourhood || address.residential || address.city_district || '';
             const district = address.district || address.city_district || address.city || address.town || address.county || '';
             const state = address.state || address.region || address.province || '';
             const countryName = address.country || '';
             const postalCode = address.postcode || '';
             const formattedAddress = data.display_name || '';

             const region = state || '';
             const components = [village || locality, district, state].filter(Boolean);
             const displayLocation = components.join(', ') || formattedAddress;
             
             if (region) setStateRegion(region);
             if (displayLocation) setLocationName(displayLocation);

             setLocationMetadata({
               latitude: lat,
               longitude: lng,
               accuracy: acc,
               village,
               locality,
               district,
               state,
               country: countryName,
               postalCode,
               formattedAddress,
               source: 'gps',
               capturedAt: new Date().toISOString(),
             });
             
             setGeoMsg({
               type: 'success',
               text: `GPS Location Acquired (Accuracy: ±${acc}m)`
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
               text: `GPS Acquired (Accuracy: ±${acc}m). Could not reverse-geocode.`
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
             text: `GPS Acquired (Accuracy: ±${acc}m) - Reverse geocoding failed.`
           });
        }
        
        setLocating(false);
      },
      (err) => {
        setLocating(false);
        if (err.code === 1) {
          setGeoMsg({ type: 'error', text: 'Location permission was denied. Please allow location access and try again.' });
        } else {
          setGeoMsg({ type: 'error', text: 'Unable to determine your current location. Please check device/browser location settings.' });
        }
      },
      { timeout: 10000, enableHighAccuracy: true, maximumAge: 0 }
    );
  };

  const handleGeocodeLocation = async () => {
    const locQuery = [locationName, stateRegion, country || activeCountry || 'India'].filter(Boolean).join(', ');
    if (!locQuery.trim()) {
      setGeoMsg({ type: 'error', text: 'Please enter a location or district first.' });
      return;
    }
    setGeocoding(true);
    setGeoMsg({ type: 'success', text: 'Resolving coordinates...' });
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locQuery)}&limit=1`
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const lat = parseFloat(parseFloat(data[0].lat).toFixed(6));
        const lon = parseFloat(parseFloat(data[0].lon).toFixed(6));
        setLatitude(lat);
        setLongitude(lon);
        setLocationMetadata({
          latitude: lat,
          longitude: lon,
          accuracy: 500,
          village: '',
          locality: '',
          district: locationName,
          state: stateRegion,
          country: country || activeCountry || 'India',
          postalCode: '',
          formattedAddress: data[0].display_name || locationName,
          source: 'geocoded' as any,
          capturedAt: new Date().toISOString(),
        });
        setGeoMsg({
          type: 'success',
          text: `Geocoded: ${lat}°, ${lon}° (${data[0].display_name?.split(',').slice(0, 2).join(',')})`,
        });
      } else {
        setGeoMsg({
          type: 'error',
          text: `Could not auto-geocode "${locQuery}". Please enter latitude and longitude manually below.`,
        });
      }
    } catch (err: any) {
      setGeoMsg({
        type: 'error',
        text: `Geocoding failed: ${err.message}. Please enter coordinates manually.`,
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
    if (!locationName.trim()) {
      setFormError('Please specify the location or district.');
      return;
    }

    let finalLat = typeof latitude === 'number' && !isNaN(latitude) ? latitude : null;
    let finalLon = typeof longitude === 'number' && !isNaN(longitude) ? longitude : null;

    // Auto-geocoding fallback if missing
    if (finalLat === null || finalLon === null) {
      try {
        const locQuery = [locationName, stateRegion, country || activeCountry || 'India'].filter(Boolean).join(', ');
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
      address: locationName.trim(),
      village: locationMetadata?.village || '',
      mandal: locationMetadata?.locality || '',
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
      village: locationMetadata?.village || '',
      locality: locationMetadata?.locality || '',
      district: locationName.trim(),
      state: stateRegion.trim(),
      country: country || '',
      postalCode: locationMetadata?.postalCode || '',
      formattedAddress: locationName.trim(),
      source: locationMetadata?.source || (hasValidCoords ? 'geocoded' : 'manual'),
      capturedAt: new Date().toISOString(),
    };

    setLoading(true);
    try {
      if (editingFarm) {
        await editFarm(editingFarm.id, {
          farmName: farmName.trim(),
          country,
          stateRegion: stateRegion.trim(),
          state: stateRegion.trim(),
          district: locationName.trim(),
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
          locationMetadata: finalLocationMetadata,
        });
      } else {
        await addFarm({
          farmName: farmName.trim(),
          country,
          stateRegion: stateRegion.trim(),
          state: stateRegion.trim(),
          district: locationName.trim(),
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          {formError && (
            <div
              id="farm-form-error"
              className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 rounded-xl flex items-start gap-2.5 text-red-700 dark:text-red-300 text-xs"
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{formError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Farm Name */}
            <div className="md:col-span-2">
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
                placeholder={t.farmNamePlaceholder}
                className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

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
                State / Region / Province
              </label>
              {countryAdapter.regions && countryAdapter.regions.length > 0 ? (
                <select
                  value={stateRegion}
                  onChange={(e) => {
                    setStateRegion(e.target.value);
                    const selectedRegion = countryAdapter.regions.find(r => r.name === e.target.value);
                    if (selectedRegion && selectedRegion.districts.length > 0) {
                      setLocationName(selectedRegion.districts[0]);
                    } else {
                      setLocationName('');
                    }
                  }}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">Select Region</option>
                  {countryAdapter.regions.map((r) => (
                    <option key={r.name} value={r.name}>{r.name}</option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={stateRegion}
                  onChange={(e) => setStateRegion(e.target.value)}
                  placeholder="e.g. State, Province..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              )}
            </div>

            {/* Location / District & GPS & Geocoding */}
            <div className="md:col-span-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300">
                  {t.locationNameLabel || 'District / Locality'} *
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    id="farm-modal-geocode-btn"
                    onClick={handleGeocodeLocation}
                    disabled={geocoding}
                    className="inline-flex items-center gap-1.5 text-[11px] px-2 py-1 bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-md font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
                  >
                    {geocoding ? <Loader2 className="w-3 h-3 animate-spin" /> : <MapPin className="w-3.5 h-3.5 text-emerald-600" />}
                    <span>{geocoding ? 'Geocoding...' : 'Geocode'}</span>
                  </button>

                  <button
                    type="button"
                    id="use-my-location-btn"
                    onClick={handleGetLocation}
                    disabled={locating}
                    className="inline-flex items-center gap-1.5 text-[11px] px-2 py-1 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-md font-medium text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 transition-colors"
                  >
                    {locating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Compass className="w-3.5 h-3.5" />}
                    <span>Use Live GPS</span>
                  </button>
                </div>
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-stone-400 pointer-events-none" />
                
                {countryAdapter.regions && countryAdapter.regions.find(r => r.name === stateRegion)?.districts ? (
                  <select
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="">Select District</option>
                    {countryAdapter.regions.find(r => r.name === stateRegion)?.districts.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    required
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                    placeholder="Search / Enter District or City"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                )}
              </div>

              {/* Coordinates Section */}
              <div className="mt-2.5 p-2.5 rounded-xl bg-stone-50 dark:bg-stone-900/40 border border-stone-200 dark:border-stone-800">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-medium text-stone-600 dark:text-stone-400 flex items-center gap-1">
                    <Compass className="w-3 h-3 text-emerald-600" />
                    Coordinates (Weather & Satellite Telemetry)
                  </span>
                  {latitude != null && longitude != null && !isNaN(latitude) && !isNaN(longitude) ? (
                    <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400">
                      Set: {latitude.toFixed(4)}, {longitude.toFixed(4)}
                    </span>
                  ) : (
                    <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400">
                      Required for satellite
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] text-stone-500 dark:text-stone-400 mb-0.5">Latitude (-90° to 90°)</label>
                    <input
                      type="number"
                      step="0.000001"
                      min="-90"
                      max="90"
                      value={latitude !== null && latitude !== undefined ? latitude : ''}
                      onChange={(e) => setLatitude(e.target.value === '' ? null : parseFloat(e.target.value))}
                      placeholder="e.g. 19.6641"
                      className="w-full px-2 py-1 text-xs rounded border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-stone-500 dark:text-stone-400 mb-0.5">Longitude (-180° to 180°)</label>
                    <input
                      type="number"
                      step="0.000001"
                      min="-180"
                      max="180"
                      value={longitude !== null && longitude !== undefined ? longitude : ''}
                      onChange={(e) => setLongitude(e.target.value === '' ? null : parseFloat(e.target.value))}
                      placeholder="e.g. 78.5320"
                      className="w-full px-2 py-1 text-xs rounded border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                    />
                  </div>
                </div>
              </div>

              {geoMsg && (
                <div className={`mt-1.5 text-[11px] flex flex-col gap-1 ${geoMsg.type === 'success' ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                  <div className="flex items-center gap-1.5">
                    {geoMsg.type === 'success' ? <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> : <AlertCircle className="w-3.5 h-3.5 shrink-0" />}
                    <span>{geoMsg.text}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Farm Area & Unit */}
            <div>
              <label
                htmlFor="farm-area-input"
                className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1"
              >
                {t.areaLabel}
              </label>
              <div className="flex gap-2">
                <input
                  id="farm-area-input"
                  type="number"
                  step="0.1"
                  min="0.1"
                  required
                  value={area}
                  onChange={(e) => setArea(parseFloat(e.target.value) || 1)}
                  className="flex-1 px-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <select
                  id="farm-area-unit-select"
                  value={areaUnit}
                  onChange={(e) => setAreaUnit(e.target.value as 'acres' | 'hectares')}
                  className="px-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="acres">Acres</option>
                  <option value="hectares">Hectares</option>
                </select>
              </div>
            </div>

            {/* Crop */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                {t.cropLabel || 'Crop'} *
              </label>
              {countryAdapter.cropCatalog && countryAdapter.cropCatalog.length > 0 ? (
                <select
                  required
                  value={crop}
                  onChange={(e) => setCrop(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="">Select Crop</option>
                  {countryAdapter.cropCatalog.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              ) : (
                <input
                  type="text"
                  required
                  value={crop}
                  onChange={(e) => setCrop(e.target.value)}
                  placeholder="e.g. Wheat, Rice, Soybean, Cotton"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              )}
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

            {/* Crop Stage */}
            <div>
              <label
                htmlFor="farm-stage-select"
                className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1"
              >
                {t.growthStageLabel}
              </label>
              <select
                id="farm-stage-select"
                value={cropStage}
                onChange={(e) => setCropStage(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Germination">Germination</option>
                <option value="Vegetative">Vegetative</option>
                <option value="Flowering">Flowering</option>
                <option value="Grain filling">Grain filling</option>
                <option value="Maturity">Maturity</option>
              </select>
            </div>

            {/* Soil Type */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                {t.soilTypeLabel || 'Soil Type'}
              </label>
              <div className="relative">
                <Layers className="absolute left-3 top-2.5 w-4 h-4 text-stone-400 pointer-events-none" />
                {countryAdapter.soilTypes && countryAdapter.soilTypes.length > 0 ? (
                  <select
                    value={soilType}
                    onChange={(e) => setSoilType(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {countryAdapter.soilTypes.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={soilType}
                    onChange={(e) => setSoilType(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                )}
              </div>
            </div>
            {/* Irrigation Type */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                {t.irrigationTypeLabel || 'Irrigation Type'}
              </label>
              <div className="relative">
                <Droplets className="absolute left-3 top-2.5 w-4 h-4 text-stone-400 pointer-events-none" />
                {countryAdapter.irrigationTypes && countryAdapter.irrigationTypes.length > 0 ? (
                  <select
                    value={irrigationType}
                    onChange={(e) => setIrrigationType(e.target.value as any)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {countryAdapter.irrigationTypes.map(i => <option key={i} value={i}>{i}</option>)}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={irrigationType}
                    onChange={(e) => setIrrigationType(e.target.value as any)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                )}
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
              <span>{t.saveFarmBtn}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
