import React, { useState } from 'react';
import { Download, Smartphone, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  variant?: 'navbar' | 'sidebar' | 'banner';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ variant = 'navbar' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running as an installed PWA, hide the button
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    if (variant === 'sidebar') {
      return (
        <button
          type="button"
          onClick={install}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold text-emerald-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Install App</span>
        </button>
      );
    }

    return (
      <button
        type="button"
        onClick={install}
        className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-2.5 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-emerald-700 transition-colors cursor-pointer"
        title="Install KhetiNexus App"
      >
        <Download className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Install App</span>
      </button>
    );
  }

  // iOS Safari flow (beforeinstallprompt is not supported by WebKit)
  if (isIOS) {
    return (
      <>
        {variant === 'sidebar' ? (
          <button
            type="button"
            onClick={() => setShowIOSGuide(true)}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold text-stone-300 bg-stone-800/80 hover:bg-stone-700 rounded-xl transition-colors cursor-pointer border border-stone-700"
          >
            <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
            <span>Install on iOS</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setShowIOSGuide(true)}
            className="flex items-center gap-1.5 rounded-lg border border-emerald-300/40 bg-emerald-950/30 px-2.5 py-1.5 text-xs font-medium text-emerald-200 hover:bg-emerald-900/40 transition cursor-pointer"
            title="Install on iOS"
          >
            <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Install iOS</span>
          </button>
        )}

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl dark:bg-stone-900 border border-stone-200 dark:border-stone-800 relative">
              <button
                onClick={() => setShowIOSGuide(false)}
                className="absolute top-4 right-4 p-1 rounded-lg text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
                <Smartphone className="w-5 h-5" />
              </div>

              <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                Install KhetiNexus on iOS
              </h3>
              <div className="mt-2.5 text-xs text-stone-600 dark:text-stone-300 space-y-2">
                <p>1. Tap the <strong>Share</strong> button in Safari's bottom toolbar.</p>
                <p>2. Scroll down and tap <strong>Add to Home Screen</strong>.</p>
                <p>3. Tap <strong>Add</strong> at the top right.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                className="mt-4 w-full rounded-xl bg-emerald-600 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition"
              >
                Got It
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
