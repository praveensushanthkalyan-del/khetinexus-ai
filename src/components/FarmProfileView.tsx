import React, { useState } from 'react';
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
} from 'lucide-react';
import { FarmProfile, Language } from '../types';
import { getTranslation } from '../i18n/translations';
import { BRICS_FARM_PRESETS } from '../data/mockData';

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
  // Designed so additional countries can be added dynamically
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
  const t = getTranslation(language);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleLoadPreset = (preset: FarmProfile) => {
    setFormData({ ...preset });
    onSaveProfile({ ...preset });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
            <h1 className="font-heading text-2xl font-bold text-stone-900">{t.navFarmProfile}</h1>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Configure your farm location, soil type, and crop status to personalize all AI advisories and climate models.
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-semibold animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Profile Saved!</span>
          </div>
        )}
      </div>

      {/* 1-Click BRICS Preset Selector */}
      <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-5 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-900">
            <Globe2 className="w-4 h-4 text-emerald-700" />
            <span>Load Standard BRICS Farm Archetype (1-Click Switch)</span>
          </div>
          <span className="text-[11px] text-emerald-700 font-medium">Interoperable Profiles</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          {BRICS_FARM_PRESETS.map((preset) => {
            const isCurrent = formData.id === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleLoadPreset(preset)}
                className={`p-2.5 rounded-xl text-left border transition-all ${
                  isCurrent
                    ? 'bg-emerald-700 text-white border-emerald-800 shadow-sm'
                    : 'bg-white hover:bg-emerald-100/60 text-stone-800 border-emerald-200'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold">{preset.country}</span>
                  <span>
                    {preset.country === 'India'
                      ? '🇮🇳'
                      : preset.country === 'Brazil'
                      ? '🇧🇷'
                      : preset.country === 'Russia'
                      ? '🇷🇺'
                      : preset.country === 'China'
                      ? '🇨🇳'
                      : '🇿🇦'}
                  </span>
                </div>
                <div className={`text-[11px] truncate ${isCurrent ? 'text-emerald-100' : 'text-stone-500'}`}>
                  {preset.name}
                </div>
                <div className={`text-[11px] font-semibold truncate ${isCurrent ? 'text-white' : 'text-emerald-800'}`}>
                  {preset.crop}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Farm Profile Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Farmer Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
              {t.farmerName} *
            </label>
            <input
              type="text"
              id="input-farmer-name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none text-sm text-stone-900 bg-white"
              placeholder="e.g. Gurpreet Singh"
            />
          </div>

          {/* Country */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
              {t.country} *
            </label>
            <select
              id="select-country"
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none text-sm text-stone-900 bg-white"
            >
              {SUPPORTED_COUNTRIES.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.flag} {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* State / Region */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
              {t.stateRegion} *
            </label>
            <input
              type="text"
              id="input-state-region"
              required
              value={formData.stateRegion}
              onChange={(e) => setFormData({ ...formData, stateRegion: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none text-sm text-stone-900 bg-white"
              placeholder="e.g. Punjab, Mato Grosso, Krasnodar..."
            />
          </div>

          {/* Village / Location */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
              {t.farmLocation} *
            </label>
            <input
              type="text"
              id="input-farm-location"
              required
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none text-sm text-stone-900 bg-white"
              placeholder="e.g. Ludhiana District"
            />
          </div>

          {/* Farm Size & Unit */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
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
                className="w-2/3 px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none text-sm text-stone-900 bg-white"
              />
              <select
                value={formData.farmUnit}
                onChange={(e) => setFormData({ ...formData, farmUnit: e.target.value as any })}
                className="w-1/3 px-2 py-2.5 rounded-xl border border-stone-300 focus:border-emerald-600 outline-none text-sm text-stone-900 bg-white"
              >
                <option value="hectares">Hectares</option>
                <option value="acres">Acres</option>
              </select>
            </div>
          </div>

          {/* Primary Crop */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
              {t.cropName} *
            </label>
            <select
              id="select-crop"
              value={formData.crop}
              onChange={(e) => setFormData({ ...formData, crop: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none text-sm text-stone-900 bg-white font-medium"
            >
              {CROPS_LIST.map((crop) => (
                <option key={crop} value={crop}>
                  {crop}
                </option>
              ))}
            </select>
          </div>

          {/* Growth Stage */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
              {t.growthStage} *
            </label>
            <select
              id="select-growth-stage"
              value={formData.growthStage}
              onChange={(e) => setFormData({ ...formData, growthStage: e.target.value as any })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none text-sm text-stone-900 bg-white"
            >
              {GROWTH_STAGES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          {/* Soil Type */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
              {t.soilType} *
            </label>
            <select
              id="select-soil-type"
              value={formData.soilType}
              onChange={(e) => setFormData({ ...formData, soilType: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none text-sm text-stone-900 bg-white"
            >
              {SOIL_TYPES.map((soil) => (
                <option key={soil} value={soil}>
                  {soil}
                </option>
              ))}
            </select>
          </div>

          {/* Irrigation Type */}
          <div className="md:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
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
                    className={`py-2 px-2.5 rounded-xl border text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-emerald-100/90 border-emerald-600 text-emerald-950 shadow-2xs'
                        : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    {irr}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Submit & Reset actions */}
        <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setFormData({ ...currentFarm })}
            className="flex items-center gap-1 text-xs text-stone-500 hover:text-stone-800"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to saved</span>
          </button>

          <button
            type="submit"
            id="save-farm-profile-btn"
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-xs transition-colors cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{t.saveProfile}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
