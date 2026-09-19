import React, { useState, useRef, useEffect } from 'react';
import {
  Sprout,
  ChevronDown,
  Plus,
  Edit2,
  Trash2,
  Check,
  Building2,
  MapPin,
  Lock,
  Compass,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Language, UserFarm } from '../types';
import { getTranslation } from '../i18n/translations';
import { localizeCountry, localizeCrop } from '../i18n/dataTranslations';

interface FarmSwitcherProps {
  currentLanguage: Language;
  variant?: 'nav' | 'inline' | 'sidebar';
  forceClose?: boolean;
}

export const FarmSwitcher: React.FC<FarmSwitcherProps> = ({
  currentLanguage,
  variant = 'nav',
  forceClose = false,
}) => {
  const t = getTranslation(currentLanguage);
  const {
    user,
    farms,
    activeFarm,
    activeFarmProfile,
    selectActiveFarm,
    removeFarm,
    setFarmModalOpen,
    setEditingFarm,
    setAuthModalOpen,
    setAuthModalMode,
  } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [deletingFarm, setDeletingFarm] = useState<UserFarm | null>(null);
  const [isPendingDelete, setIsPendingDelete] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Force close when external trigger occurs (e.g., mobile navigation drawer opens)
  useEffect(() => {
    if (forceClose) {
      setIsOpen(false);
    }
  }, [forceClose]);

  // Close dropdown on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleSelect = (farmId: string) => {
    selectActiveFarm(farmId);
    setIsOpen(false);
  };

  const handleEdit = (e: React.MouseEvent, farm: UserFarm) => {
    e.stopPropagation();
    setEditingFarm(farm);
    setFarmModalOpen(true);
    setIsOpen(false);
  };

  const handleDelete = (e: React.MouseEvent, farm: UserFarm) => {
    e.stopPropagation();
    setDeletingFarm(farm);
    setIsOpen(false);
  };

  const handleAddNew = () => {
    if (!user) {
      setAuthModalMode('login');
      setAuthModalOpen(true);
      return;
    }
    setEditingFarm(null);
    setFarmModalOpen(true);
    setIsOpen(false);
  };

  const displayName = activeFarm ? activeFarm.farmName : activeFarmProfile.name;
  const displayLocation = activeFarm ? activeFarm.locationName : activeFarmProfile.location;
  const displayCrop = activeFarm ? activeFarm.crop : activeFarmProfile.crop;

  return (
    <div className="relative inline-block text-left w-full" ref={dropdownRef}>
      {variant === 'sidebar' ? (
        <button
          type="button"
          id="sidebar-farm-switcher-toggle-btn"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-haspopup="true"
          aria-label="Select active farm"
          className="w-full text-left p-2 rounded-xl bg-emerald-950/60 dark:bg-stone-800/60 border border-emerald-900/60 dark:border-stone-700/60 space-y-1 cursor-pointer hover:border-emerald-500 transition-colors overflow-hidden text-stone-200 group"
          title="Click to switch farm or manage farms"
        >
          <div className="flex items-center justify-between text-[11px] leading-tight">
            <span className="text-stone-400 font-medium truncate">{t.farmLabel || 'Active Farm'}</span>
            <div className="flex items-center gap-1 shrink-0">
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-900 text-emerald-200 border border-emerald-700/60 shrink-0 leading-none">
                {localizeCountry(activeFarm ? activeFarm.country : activeFarmProfile.country, currentLanguage)}
              </span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-emerald-400 shrink-0 transition-transform ${
                  isOpen ? 'rotate-180' : ''
                }`}
              />
            </div>
          </div>
          <div className="font-bold text-xs text-stone-100 truncate leading-tight">{displayName}</div>
          <div className="text-[10px] text-stone-400 truncate flex items-center gap-1 leading-tight">
            <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
            <span className="truncate">{displayLocation}</span>
            <span>•</span>
            <span className="text-emerald-300 font-medium truncate">{localizeCrop(displayCrop, currentLanguage)}</span>
          </div>
        </button>
      ) : (
        <button
          type="button"
          id="farm-switcher-toggle-btn"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full sm:w-auto flex items-center justify-between gap-2 rounded-xl transition-all cursor-pointer ${
            variant === 'nav'
              ? 'px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/80 hover:bg-emerald-100 dark:hover:bg-emerald-900/80 border border-emerald-200 dark:border-emerald-800 text-stone-900 dark:text-emerald-100 text-xs font-semibold'
              : 'px-3 sm:px-4 py-2 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-stone-100 text-xs shadow-2xs'
          }`}
        >
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-5 h-5 rounded-md bg-emerald-600/20 dark:bg-emerald-600/30 flex items-center justify-center shrink-0">
              <Sprout className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-300" />
            </div>
            <div className="text-left min-w-0 max-w-[140px] sm:max-w-[180px] truncate">
              <div className="font-semibold leading-tight truncate text-stone-900 dark:text-stone-100">{displayName}</div>
              <div className="text-[10px] text-stone-500 dark:text-emerald-400/70 truncate flex items-center gap-1">
                <span className="truncate">{localizeCrop(displayCrop, currentLanguage)}</span>
                <span>•</span>
                <span className="truncate">{displayLocation}</span>
              </div>
            </div>
          </div>
          <ChevronDown
            className={`w-3.5 h-3.5 opacity-70 shrink-0 transition-transform ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </button>
      )}

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          id="farm-switcher-dropdown"
          className={`absolute ${
            variant === 'sidebar'
              ? 'bottom-full mb-2 left-0 w-full rounded-2xl bg-[#08150c] dark:bg-stone-900 shadow-2xl border border-emerald-800/80 dark:border-stone-800 z-50 overflow-hidden animate-fade-in text-stone-100'
              : 'left-0 sm:right-0 sm:left-auto mt-2 w-[280px] max-w-[calc(100%-0.5rem)] sm:w-80 rounded-2xl bg-white dark:bg-stone-900 shadow-2xl border border-stone-200 dark:border-stone-800 z-50 overflow-hidden animate-fade-in'
          }`}
        >
          {/* Header */}
          <div className="px-4 py-3 bg-emerald-950/80 dark:bg-stone-800/60 border-b border-emerald-900 dark:border-stone-800 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold text-stone-100">
                {t.myFarms}
              </span>
            </div>
            {user ? (
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-900/80 text-emerald-200 border border-emerald-700/60">
                {farms.length} {farms.length === 1 ? 'Farm' : 'Farms'}
              </span>
            ) : (
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-amber-900/80 text-amber-200 border border-amber-700/60">
                {t.guestFarmer}
              </span>
            )}
          </div>

          {/* Farms List */}
          <div className="max-h-64 overflow-y-auto divide-y divide-emerald-950/60 dark:divide-stone-800/60 p-1">
            {!user ? (
              <div className="p-4 text-center space-y-2">
                <p className="text-xs text-stone-300">
                  {t.loginToPersonalize}
                </p>
                <button
                  type="button"
                  id="farm-dropdown-login-btn"
                  onClick={() => {
                    setIsOpen(false);
                    setAuthModalMode('login');
                    setAuthModalOpen(true);
                  }}
                  className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  {t.signInBtn}
                </button>
              </div>
            ) : farms.length === 0 ? (
              <div className="p-4 text-center space-y-2">
                <p className="text-xs text-stone-300">
                  {t.noFarmsYet}
                </p>
                <button
                  type="button"
                  id="create-first-farm-btn"
                  onClick={handleAddNew}
                  className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{t.createFirstFarm}</span>
                </button>
              </div>
            ) : (
              farms.map((f) => {
                const isActive = activeFarm?.id === f.id;
                return (
                  <div
                    key={f.id}
                    id={`farm-item-${f.id}`}
                    onClick={() => handleSelect(f.id)}
                    className={`group w-full p-2.5 rounded-xl flex items-center justify-between text-left cursor-pointer transition-colors ${
                      isActive
                        ? 'bg-emerald-900/60 border border-emerald-600 text-white font-semibold'
                        : 'hover:bg-emerald-950/60 text-stone-200'
                    }`}
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0 pr-2">
                      {isActive ? (
                        <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <div className="w-4 h-4 shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-stone-100 truncate">
                            {f.farmName}
                          </span>
                          {isActive && (
                            <span className="text-[10px] font-semibold px-1.5 py-0.2 bg-emerald-600 text-white rounded shrink-0">
                              {t.activeFarm}
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-stone-400 truncate flex items-center gap-1 mt-0.5">
                          <span>{localizeCrop(f.crop, currentLanguage)}</span>
                          <span>•</span>
                          <span>{f.locationName}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        id={`edit-farm-btn-${f.id}`}
                        onClick={(e) => handleEdit(e, f)}
                        className="p-1 text-stone-400 hover:text-emerald-400 rounded hover:bg-emerald-900/50 transition-colors"
                        title={t.editFarm}
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        id={`delete-farm-btn-${f.id}`}
                        onClick={(e) => handleDelete(e, f)}
                        className="p-1 text-stone-400 hover:text-red-400 rounded hover:bg-emerald-900/50 transition-colors"
                        title={t.deleteFarm}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Action Footer */}
          {user && (
            <div className="p-2 bg-emerald-950/80 dark:bg-stone-800/60 border-t border-emerald-900 dark:border-stone-800">
              <button
                type="button"
                id="add-new-farm-dropdown-btn"
                onClick={handleAddNew}
                className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t.addNewFarm}</span>
              </button>
            </div>
          )}
        </div>
      )}

      {deletingFarm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#0c1810] rounded-2xl border border-stone-200 dark:border-stone-800 p-6 max-w-md w-full shadow-xl space-y-6 animate-in fade-in zoom-in-95 duration-150 text-left">
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
                <span className="text-stone-900 dark:text-stone-100 font-bold capitalize">{localizeCrop(deletingFarm.crop, currentLanguage)}</span>
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
                id="confirm-delete-farm-switcher-btn"
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
