import React, { useState, useEffect } from 'react';
import { X, MapPin, Camera, Mic, ShieldAlert, CheckCircle2, AlertCircle } from 'lucide-react';
import { usePermissions } from '../context/PermissionContext';

export const AccessRequestModal: React.FC = () => {
  const {
    locationPermission,
    cameraPermission,
    microphonePermission,
    accessModalOpen,
    setAccessModalOpen,
    permissionError,
    setPermissionError,
    requestMicrophonePermission,
    requestCameraPermission,
    requestLocationPermission,
  } = usePermissions();

  const [locationEnabled, setLocationEnabled] = useState(false);
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [microphoneEnabled, setMicrophoneEnabled] = useState(false);
  const [isApplying, setIsApplying] = useState(false);

  useEffect(() => {
    if (accessModalOpen) {
      setLocationEnabled(locationPermission === 'granted');
      setCameraEnabled(cameraPermission === 'granted');
      setMicrophoneEnabled(microphonePermission === 'granted');
      setPermissionError(null);
    }
  }, [accessModalOpen, locationPermission, cameraPermission, microphonePermission, setPermissionError]);

  if (!accessModalOpen) return null;

  const handleApply = async () => {
    setIsApplying(true);
    setPermissionError(null);

    let allOk = true;

    // Request Microphone if enabled & not granted
    if (microphoneEnabled && microphonePermission !== 'granted') {
      const success = await requestMicrophonePermission();
      if (!success) allOk = false;
    }

    // Request Camera if enabled & not granted
    if (cameraEnabled && cameraPermission !== 'granted') {
      const success = await requestCameraPermission();
      if (!success) allOk = false;
    }

    // Request Location if enabled & not granted
    if (locationEnabled && locationPermission !== 'granted') {
      const success = await requestLocationPermission();
      if (!success) allOk = false;
    }

    setIsApplying(false);

    // If permissions requested were granted, close dialog
    if (allOk || (!microphoneEnabled && !cameraEnabled && !locationEnabled)) {
      setAccessModalOpen(false);
    }
  };

  return (
    <div
      id="access-request-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) setAccessModalOpen(false);
      }}
    >
      <div
        id="access-request-modal-card"
        className="relative w-full max-w-md bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-100 dark:border-stone-800 flex items-center justify-between bg-stone-50/80 dark:bg-stone-800/50">
          <h3 className="font-bold text-base text-stone-900 dark:text-stone-100 tracking-tight">
            Access request
          </h3>
          <button
            type="button"
            id="close-access-request-btn"
            onClick={() => setAccessModalOpen(false)}
            className="p-1.5 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 rounded-lg transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed font-medium">
            The app requests access to the following permissions:
          </p>

          {/* Permission Items */}
          <div className="space-y-3.5">
            {/* 1. Geographic Location */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200/80 dark:border-stone-800">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-700 dark:text-emerald-400 shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold text-xs text-stone-900 dark:text-stone-100 block">
                    Geographic location
                  </span>
                  <span className="text-[11px] text-stone-500 dark:text-stone-400 block">
                    {locationPermission === 'granted' ? 'Access Granted' : 'GPS coordinates & weather telemetry'}
                  </span>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  id="toggle-location-permission"
                  checked={locationEnabled}
                  onChange={(e) => setLocationEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-stone-300 peer-focus:outline-none rounded-full peer dark:bg-stone-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:after:border-stone-600 peer-checked:bg-emerald-600"></div>
              </label>
            </div>

            {/* 2. Camera */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200/80 dark:border-stone-800">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-700 dark:text-emerald-400 shrink-0">
                  <Camera className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold text-xs text-stone-900 dark:text-stone-100 block">
                    Camera
                  </span>
                  <span className="text-[11px] text-stone-500 dark:text-stone-400 block">
                    {cameraPermission === 'granted' ? 'Access Granted' : 'Leaf diagnosis & photo analysis'}
                  </span>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  id="toggle-camera-permission"
                  checked={cameraEnabled}
                  onChange={(e) => setCameraEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-stone-300 peer-focus:outline-none rounded-full peer dark:bg-stone-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:after:border-stone-600 peer-checked:bg-emerald-600"></div>
              </label>
            </div>

            {/* 3. Microphone */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200/80 dark:border-stone-800">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-700 dark:text-emerald-400 shrink-0">
                  <Mic className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-semibold text-xs text-stone-900 dark:text-stone-100 block">
                    Microphone
                  </span>
                  <span className="text-[11px] text-stone-500 dark:text-stone-400 block">
                    {microphonePermission === 'granted' ? 'Access Granted' : 'Voice typing in Crop Doctor chat'}
                  </span>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  id="toggle-microphone-permission"
                  checked={microphoneEnabled}
                  onChange={(e) => setMicrophoneEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-stone-300 peer-focus:outline-none rounded-full peer dark:bg-stone-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:after:border-stone-600 peer-checked:bg-emerald-600"></div>
              </label>
            </div>
          </div>

          {/* Error display */}
          {permissionError && (
            <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs flex items-start gap-2.5 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <p className="leading-tight font-medium">{permissionError}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-stone-100 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/30 flex justify-end">
          <button
            type="button"
            id="apply-permissions-btn"
            onClick={handleApply}
            disabled={isApplying}
            className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer disabled:opacity-50"
          >
            {isApplying ? 'Applying...' : 'Apply'}
          </button>
        </div>
      </div>
    </div>
  );
};
