import React, { useState } from 'react';
import {
  AlertTriangle,
  Flame,
  CloudRain,
  Wind,
  Snowflake,
  X,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  ShieldAlert,
  Droplets,
  Sparkles,
} from 'lucide-react';
import { ExtremeWeatherAlert } from '../lib/weatherAlerts';
import { ActiveTab, Language } from '../types';
import { getTranslation } from '../i18n/translations';

interface WeatherAlertBannerProps {
  alerts: ExtremeWeatherAlert[];
  onNavigateTab: (tab: ActiveTab) => void;
  language: Language;
}

export const WeatherAlertBanner: React.FC<WeatherAlertBannerProps> = ({
  alerts,
  onNavigateTab,
  language,
}) => {
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(
    alerts.length > 0 ? alerts[0].id : null
  );
  const t = getTranslation(language);

  const activeAlerts = alerts.filter((a) => !dismissedIds.includes(a.id));

  if (activeAlerts.length === 0) return null;

  const handleDismiss = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDismissedIds((prev) => [...prev, id]);
  };

  const getAlertIcon = (type: ExtremeWeatherAlert['type']) => {
    switch (type) {
      case 'heatwave':
        return <Flame className="w-5 h-5 text-amber-400 animate-pulse shrink-0" />;
      case 'heavy_rain':
      case 'storm':
        return <CloudRain className="w-5 h-5 text-cyan-400 animate-bounce shrink-0" />;
      case 'severe_wind':
        return <Wind className="w-5 h-5 text-teal-400 shrink-0" />;
      case 'frost':
        return <Snowflake className="w-5 h-5 text-sky-300 shrink-0" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />;
    }
  };

  const getAlertTheme = (type: ExtremeWeatherAlert['type']) => {
    switch (type) {
      case 'heatwave':
        return {
          bg: 'bg-gradient-to-r from-amber-950/90 via-orange-950/90 to-amber-900/90 dark:from-amber-950/95 dark:to-orange-950/95',
          border: 'border-amber-500/60 dark:border-amber-500/70',
          badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          metricText: 'text-amber-300',
          glow: 'shadow-lg shadow-amber-950/40',
        };
      case 'heavy_rain':
      case 'storm':
        return {
          bg: 'bg-gradient-to-r from-cyan-950/90 via-blue-950/90 to-sky-900/90 dark:from-cyan-950/95 dark:to-blue-950/95',
          border: 'border-cyan-500/60 dark:border-cyan-500/70',
          badgeBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
          metricText: 'text-cyan-300',
          glow: 'shadow-lg shadow-cyan-950/40',
        };
      case 'severe_wind':
        return {
          bg: 'bg-gradient-to-r from-teal-950/90 via-emerald-950/90 to-teal-900/90',
          border: 'border-teal-500/60',
          badgeBg: 'bg-teal-500/20 text-teal-300 border-teal-500/40',
          metricText: 'text-teal-300',
          glow: 'shadow-lg shadow-teal-950/40',
        };
      case 'frost':
        return {
          bg: 'bg-gradient-to-r from-sky-950/90 via-slate-950/90 to-blue-950/90',
          border: 'border-sky-400/60',
          badgeBg: 'bg-sky-500/20 text-sky-200 border-sky-400/40',
          metricText: 'text-sky-200',
          glow: 'shadow-lg shadow-sky-950/40',
        };
      default:
        return {
          bg: 'bg-gradient-to-r from-rose-950/90 via-red-950/90 to-rose-900/90',
          border: 'border-rose-500/60',
          badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
          metricText: 'text-rose-300',
          glow: 'shadow-lg shadow-rose-950/40',
        };
    }
  };

  return (
    <div className="w-full space-y-3 font-sans animate-in fade-in slide-in-from-top-4 duration-300">
      {activeAlerts.map((alert) => {
        const theme = getAlertTheme(alert.type);
        const isExpanded = expandedId === alert.id;

        return (
          <div
            key={alert.id}
            className={`rounded-2xl border ${theme.border} ${theme.bg} ${theme.glow} text-stone-100 p-4 sm:p-5 transition-all duration-200 relative overflow-hidden backdrop-blur-md`}
          >
            {/* Top Accent Line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-80" />

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 min-w-0">
              {/* Header Info */}
              <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
                <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 shrink-0">
                  {getAlertIcon(alert.type)}
                </div>

                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wider uppercase border ${theme.badgeBg}`}
                    >
                      <ShieldAlert className="w-3 h-3" />
                      <span>{t.criticalTelemetryAlert || 'CRITICAL TELEMETRY ALERT'}</span>
                    </span>

                    <span className="text-xs font-mono font-extrabold px-2 py-0.5 rounded bg-black/40 text-stone-200 border border-white/10">
                      {alert.metric}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-white tracking-tight leading-tight truncate font-heading">
                    {alert.title}
                  </h3>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/10">
                <button
                  type="button"
                  onClick={() => onNavigateTab('weather')}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{t.openWeatherBtn || 'Weather Radar'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => onNavigateTab('ai-advisor')}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{t.aiCropProtection || 'AI Crop Protection'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setExpandedId(isExpanded ? null : alert.id)}
                  className="p-1.5 rounded-lg bg-black/30 hover:bg-black/50 text-stone-300 hover:text-white transition-colors cursor-pointer"
                  title="Toggle details"
                >
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={(e) => handleDismiss(alert.id, e)}
                  className="p-1.5 rounded-lg bg-black/30 hover:bg-black/50 text-stone-400 hover:text-white transition-colors cursor-pointer"
                  title="Dismiss alert"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Description & Actionable Advisory Details */}
            {isExpanded && (
              <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in duration-200">
                <div className="space-y-1.5 p-3 rounded-xl bg-black/30 border border-white/10 text-xs">
                  <div className="font-extrabold text-amber-300 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>{t.observedFieldImpact || 'Observed Field Impact'}</span>
                  </div>
                  <p className="text-stone-200 leading-relaxed">{alert.description}</p>
                  <p className="text-stone-300 font-semibold pt-1 border-t border-white/5">
                    {alert.cropImpactAdvice}
                  </p>
                </div>

                <div className="space-y-1.5 p-3 rounded-xl bg-black/30 border border-white/10 text-xs">
                  <div className="font-extrabold text-emerald-300 flex items-center gap-1.5">
                    <Droplets className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{t.recommendedAgronomicAction || 'Recommended Agronomic Action'}</span>
                  </div>
                  <p className="text-stone-200 leading-relaxed">{alert.actionableAdvice}</p>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
