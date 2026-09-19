import React from 'react';
import { X, ShieldCheck, Database, KeyRound, Lock, Server } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Language } from '../types';
import { getTranslation } from '../i18n/translations';

interface PrivacyModalProps {
  currentLanguage: Language;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ currentLanguage }) => {
  const t = getTranslation(currentLanguage);
  const { privacyModalOpen, setPrivacyModalOpen, user } = useAuth();

  if (!privacyModalOpen) return null;

  return (
    <div
      id="privacy-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) setPrivacyModalOpen(false);
      }}
    >
      <div
        id="privacy-modal-card"
        className="relative w-full max-w-lg my-auto bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden max-h-[90vh] flex flex-col"
      >
        <div className="bg-emerald-700 dark:bg-emerald-800 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-emerald-100" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">
                {t.privacyDataTitle}
              </h3>
              <p className="text-xs text-emerald-100/80">AgriN Sovereign Architecture</p>
            </div>
          </div>
          <button
            id="close-privacy-modal-btn"
            onClick={() => setPrivacyModalOpen(false)}
            className="p-1.5 rounded-lg hover:bg-white/20 transition-colors text-white/90"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs text-stone-700 dark:text-stone-300 overflow-y-auto">
          <p className="font-medium text-stone-900 dark:text-stone-100">
            {t.privacyDataDesc}
          </p>

          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-800 flex items-start gap-3">
              <Database className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-stone-900 dark:text-stone-100">
                  Google Cloud Firestore Protection
                </h4>
                <p className="text-stone-600 dark:text-stone-400 mt-0.5">
                  {t.privacyPoint1}
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-800 flex items-start gap-3">
              <KeyRound className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-stone-900 dark:text-stone-100">
                  Enterprise Identity & Auth
                </h4>
                <p className="text-stone-600 dark:text-stone-400 mt-0.5">
                  {t.privacyPoint2}
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-800 flex items-start gap-3">
              <Lock className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-stone-900 dark:text-stone-100">
                  Strict Sovereign Data Boundaries
                </h4>
                <p className="text-stone-600 dark:text-stone-400 mt-0.5">
                  {t.privacyPoint3}
                </p>
              </div>
            </div>
          </div>

          {user && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-stone-600 dark:text-stone-400 text-[11px] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>
                  Active UID: <code className="text-emerald-700 dark:text-emerald-300 font-mono">{user.uid}</code>
                </span>
              </div>
              <span className="font-semibold text-emerald-700 dark:text-emerald-300">
                Region: asia-south1
              </span>
            </div>
          )}

          <div className="pt-2 flex justify-end">
            <button
              type="button"
              id="close-privacy-btn"
              onClick={() => setPrivacyModalOpen(false)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-xs shadow transition-colors"
            >
              {t.close}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
