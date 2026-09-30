import React, { useState, useEffect } from 'react';
import {
  Globe2,
  Lock,
  CheckCircle2,
  Info,
  ShieldCheck,
  Radio,
  MapPin,
  Sprout,
} from 'lucide-react';
import { FarmProfile, Language } from '../types';
import {
  getLocalizedAgriNNodes,
  getLocalizedSharedModules,
  localizeCountry,
  localizeCrop,
} from '../i18n/dataTranslations';
import { getAgriNUIStrings } from '../i18n/agrinTranslations';
import { useCountry } from '../context/CountryContext';
import { DataProvenanceBadge } from './DataProvenanceBadge';

interface AgriNNetworkViewProps {
  language: Language;
  currentFarm?: FarmProfile;
}

export const AgriNNetworkView: React.FC<AgriNNetworkViewProps> = ({ language, currentFarm }) => {
  const { countryAdapter } = useCountry();
  const ui = getAgriNUIStrings(language);
  const nodes = getLocalizedAgriNNodes(language);
  const modules = getLocalizedSharedModules(language);

  const activeCountryCode = (countryAdapter?.countryCode || 'IN').toUpperCase();

  const orderedNodes = React.useMemo(() => {
    const activeNode = nodes.find(
      (n: any) => (n.countryCode || '').toUpperCase() === activeCountryCode
    );
    const otherNodes = nodes.filter(
      (n: any) => (n.countryCode || '').toUpperCase() !== activeCountryCode
    );
    return activeNode ? [activeNode, ...otherNodes] : nodes;
  }, [nodes, activeCountryCode]);

  const [selectedNodeId, setSelectedNodeId] = useState<string>('node-in');
  const [expandedNodeIds, setExpandedNodeIds] = useState<Record<string, boolean>>({});
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'failed'>('checking');

  useEffect(() => {
    let isMounted = true;
    const performPing = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s timeout

        const res = await fetch('/api/health', { signal: controller.signal });
        clearTimeout(timeoutId);

        if (isMounted) {
          if (res.ok) {
            setConnectionStatus('connected');
          } else {
            setConnectionStatus('failed');
          }
        }
      } catch {
        if (isMounted) {
          setConnectionStatus('failed');
        }
      }
    };
    performPing();
    return () => {
      isMounted = false;
    };
  }, []);

  const selectedNode = orderedNodes.find((n: any) => n.id === selectedNodeId) || orderedNodes[0];

  const toggleContributions = (nodeId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setExpandedNodeIds((prev) => ({
      ...prev,
      [nodeId]: !prev[nodeId],
    }));
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-6 sm:space-y-8 min-w-0">
      {/* Header */}
      <div className="bg-white dark:bg-[#0c1810] rounded-2xl border border-stone-200/80 dark:border-stone-800/80 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 flex items-center justify-center">
              <Globe2 className="w-4 h-4" />
            </div>
            <h1 className="font-heading text-2xl font-bold text-stone-900 dark:text-stone-100">{ui.networkExchangeTitle}</h1>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
            {ui.bricsSovereignHeading}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {connectionStatus === 'checking' && (
            <span className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-xs font-bold flex items-center gap-1.5 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span>{ui.checkingStatus}</span>
            </span>
          )}
          {connectionStatus === 'connected' && (
            <span className="px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>✓ {ui.onlineVerifiedStatus}</span>
            </span>
          )}
          {connectionStatus === 'failed' && (
            <span className="px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800 text-xs font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              <span>⚠ {ui.adapterOfflineStatus}</span>
            </span>
          )}
          <span className="px-3 py-1.5 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-800/50 text-xs font-bold">
            11 {ui.memberNodesLabel}
          </span>
        </div>
      </div>

      {/* Active Farm Context & Provenance Bar */}
      {currentFarm && (
        <div className="bg-emerald-950/90 dark:bg-[#06120a] rounded-2xl p-4 text-white border border-emerald-800/80 shadow-xs flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-800/80 text-emerald-200 flex items-center justify-center shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-extrabold tracking-wider text-emerald-400">
                Active Farm Context
              </div>
              <div className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                <span>{currentFarm.name || 'My Farm'}</span>
                <span className="text-emerald-400">•</span>
                <span className="font-normal text-emerald-200">{currentFarm.location || `${currentFarm.stateRegion || ''}, ${currentFarm.country || ''}`}</span>
                {currentFarm.crop && (
                  <>
                    <span className="text-emerald-400">•</span>
                    <span className="inline-flex items-center gap-1 font-medium text-emerald-300">
                      <Sprout className="w-3 h-3" />
                      {localizeCrop(currentFarm.crop, language)}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <DataProvenanceBadge type="india_gov" customText="Sovereign Data Exchange" size="xs" />
            <DataProvenanceBadge type="isro_bhuvan" customText="Bhuvan Geospatial" size="xs" />
            <DataProvenanceBadge type="faostat" customText="FAOSTAT Benchmarks" size="xs" />
          </div>
        </div>
      )}

      {connectionStatus === 'failed' && (
        <div className="bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800/80 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 text-xs sm:text-sm text-rose-950 dark:text-rose-200 leading-relaxed">
          <Info className="w-5 h-5 text-rose-700 dark:text-rose-400 shrink-0 mt-0.5" />
          <div>
            <strong className="block text-rose-950 dark:text-rose-200 font-bold mb-0.5">
              {ui.adapterOfflineStatus}:
            </strong>
            {ui.strictPrivacyDesc}
          </div>
        </div>
      )}

      {/* Primary Privacy Notice */}
      <div className="bg-emerald-900 dark:bg-emerald-950 text-white rounded-2xl p-4 sm:p-5 shadow-xs border border-emerald-800 flex items-start gap-3.5">
        <ShieldCheck className="w-6 h-6 text-emerald-300 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h2 className="text-xs uppercase font-bold tracking-wider text-emerald-300">
            {ui.strictPrivacyTitle}
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
            {ui.strictPrivacyDesc}
          </p>
        </div>
      </div>

      {/* Privacy-Preserving Sovereign Architecture Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-stone-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-md border border-emerald-800/50 space-y-4">
        <div className="flex items-center gap-2 text-emerald-300 text-xs uppercase font-bold tracking-wider">
          <Lock className="w-4 h-4" />
          <span>{ui.sovereigntyTitle}</span>
        </div>

        <h2 className="font-heading text-xl sm:text-2xl font-bold text-white max-w-3xl">
          {ui.sovereigntyHeading}
        </h2>

        <p className="text-xs sm:text-sm text-emerald-100/90 max-w-4xl leading-relaxed">
          {ui.sovereigntyDesc}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-3 rounded-xl bg-white/10 border border-white/10 text-xs">
            <strong className="block text-white mb-1">{ui.principle1Title}</strong>
            <span className="text-emerald-200">{ui.principle1Desc}</span>
          </div>
          <div className="p-3 rounded-xl bg-white/10 border border-white/10 text-xs">
            <strong className="block text-white mb-1">{ui.principle2Title}</strong>
            <span className="text-emerald-200">{ui.principle2Desc}</span>
          </div>
          <div className="p-3 rounded-xl bg-white/10 border border-white/10 text-xs">
            <strong className="block text-white mb-1">{ui.principle3Title}</strong>
            <span className="text-emerald-200">{ui.principle3Desc}</span>
          </div>
        </div>
      </div>

      {/* BRICS 11 Participating Nodes Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-lg font-bold text-stone-900 dark:text-stone-100">
            {ui.bricsHubsHeading} ({orderedNodes.length} {ui.memberNodesLabel})
          </h3>
          <span className="text-xs text-stone-500 dark:text-stone-400 font-medium">
            {ui.truthfulTelemetry}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {orderedNodes.map((node: any) => {
            const isSelected = selectedNode.id === node.id;
            const isExpanded = !!expandedNodeIds[node.id];
            
            let displayStatus = node.status;
            let displayColorClass = 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800';
            
            if (connectionStatus === 'checking') {
              displayStatus = ui.pingingStatus;
              displayColorClass = 'bg-amber-50 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 animate-pulse';
            } else if (connectionStatus === 'failed') {
              displayStatus = ui.offlineStatus;
              displayColorClass = 'bg-rose-50 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800';
            } else {
              const isConnected = node.statusType === 'connected' || node.status === 'Connected' || node.status === 'Active' || node.status === 'সংযুক্ত' || node.status === 'कनेक्टेड';
              if (!isConnected) {
                displayColorClass = 'bg-amber-50 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800';
              }
            }

            return (
              <div
                key={node.countryCode || node.id}
                onClick={() => setSelectedNodeId(node.id)}
                className={`rounded-2xl p-4.5 border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-emerald-600 dark:border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/40 shadow-xs'
                    : 'border-stone-200/80 dark:border-stone-800/80 bg-white dark:bg-[#0c1810] hover:border-emerald-400 dark:hover:border-emerald-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{node.flag}</span>
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${displayColorClass}`}>
                      {displayStatus}
                    </span>
                  </div>
                  <h4 className="font-heading text-sm font-bold text-stone-900 dark:text-stone-100">
                    {localizeCountry(node.country, language)}
                  </h4>
                  <p className="text-[11px] text-stone-500 dark:text-stone-400 font-medium truncate mt-0.5">
                    {node.institution}
                  </p>
                  <p className="text-xs text-stone-600 dark:text-stone-400 mt-2 line-clamp-2 leading-snug">
                    {node.focusArea}
                  </p>

                  {/* Expanded Contributions Section */}
                  {isExpanded && (
                    <div className="mt-3 pt-3 border-t border-emerald-200/80 dark:border-emerald-800/80 space-y-2 animate-fadeIn">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 block">
                        {ui.activeContributions}:
                      </span>
                      {node.contributions && node.contributions.length > 0 ? (
                        <div className="space-y-1.5">
                          {node.contributions.map((c: string, idx: number) => (
                            <div key={idx} className="flex items-start gap-1.5 text-[11px] text-stone-700 dark:text-stone-300 leading-tight">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                              <span>{c}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-[11px] text-stone-500 italic">{ui.noContributionsText}</div>
                      )}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={(e) => toggleContributions(node.id, e)}
                  className="mt-3 pt-2 border-t border-stone-100 dark:border-stone-800 w-full flex items-center justify-between text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold hover:text-emerald-800 dark:hover:text-emerald-300 transition-colors cursor-pointer"
                  aria-expanded={isExpanded}
                >
                  <span className="flex items-center gap-1.5">
                    <span>{isExpanded ? '▼' : '▶'}</span>
                    <span>{isExpanded ? ui.hideContributions : ui.viewContributions}</span>
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Node Details & Shared Knowledge Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Node Spotlight */}
        <div className="lg:col-span-5 bg-white dark:bg-[#0c1810] rounded-2xl border border-stone-200/80 dark:border-stone-800/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-stone-100 dark:border-stone-800">
            <span className="text-3xl">{selectedNode.flag}</span>
            <div>
              <h4 className="font-heading text-lg font-bold text-stone-900 dark:text-stone-100">
                {localizeCountry(selectedNode.country, language)} {ui.nodeLabel}
              </h4>
              <span className="text-xs text-stone-500 dark:text-stone-400">{selectedNode.institution}</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between bg-stone-50 dark:bg-stone-900/60 p-2.5 rounded-xl text-xs">
              <span className="text-stone-500 dark:text-stone-400">{ui.nodeStatusLabel}:</span>
              <span className={`font-bold flex items-center gap-1 ${
                connectionStatus === 'checking' ? 'text-amber-700 dark:text-amber-400' :
                connectionStatus === 'failed' ? 'text-rose-700 dark:text-rose-400' :
                'text-emerald-700 dark:text-emerald-400'
              }`}>
                <Radio className={`w-3.5 h-3.5 ${connectionStatus === 'checking' ? 'animate-spin text-amber-500' : 'animate-pulse'}`} />
                {connectionStatus === 'checking' ? ui.pingingRouter :
                 connectionStatus === 'failed' ? ui.offlineStatus :
                 (selectedNode as any).status || ui.onlineVerifiedStatus}
              </span>
            </div>

            {(selectedNode as any).provider && (
              <div className="flex items-center justify-between bg-stone-50 dark:bg-stone-900/60 p-2.5 rounded-xl text-xs">
                <span className="text-stone-500 dark:text-stone-400">{ui.providerRegistryLabel}:</span>
                <span className="font-medium text-stone-800 dark:text-stone-200">
                  {(selectedNode as any).provider}
                </span>
              </div>
            )}

            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                {ui.agronomicSpecialization}
              </span>
              <p className="text-xs sm:text-sm text-stone-800 dark:text-stone-200 mt-0.5">
                {selectedNode.focusArea}
              </p>
            </div>

            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                {ui.activeContributions}
              </span>
              <div className="space-y-1.5 mt-1.5">
                {selectedNode.contributions.map((c: string, i: number) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 p-2 rounded-lg bg-stone-50 dark:bg-stone-900/40 border border-stone-100 dark:border-stone-800 text-xs text-stone-700 dark:text-stone-300"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>{c}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 4 Shared Knowledge Modules */}
        <div className="lg:col-span-7 bg-white dark:bg-[#0c1810] rounded-2xl border border-stone-200/80 dark:border-stone-800/80 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
            <h4 className="font-heading text-base font-bold text-stone-900 dark:text-stone-100">
              {ui.sharedModulesTitle}
            </h4>
            <span className="text-xs text-stone-400">{ui.interoperablePillars}</span>
          </div>

          <div className="space-y-3">
            {modules.map((mod) => (
              <div
                key={mod.id}
                className="p-4 rounded-xl border border-stone-200/80 dark:border-stone-800/80 bg-stone-50/80 dark:bg-stone-900/40 hover:bg-emerald-50/20 transition-all space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-900 dark:text-emerald-300">
                    {mod.title}
                  </span>
                  <span className="text-[11px] px-2 py-0.5 rounded-md bg-stone-200/70 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-medium">
                    {ui.leaderLabel}: {localizeCountry(mod.leadCountry, language)}
                  </span>
                </div>
                <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                  {mod.description}
                </p>
                <div className="pt-1 flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400">
                  <span>{ui.impactLabel}: <strong className="text-stone-800 dark:text-stone-200">{mod.beneficiaryImpact}</strong></span>
                  <span className="text-emerald-700 dark:text-emerald-400 font-semibold">{mod.recordsCount}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sovereign Notice Disclaimer */}
      <div className="rounded-2xl bg-stone-100 dark:bg-stone-900/60 border border-stone-200/80 dark:border-stone-800 p-5 text-stone-600 dark:text-stone-400 text-xs leading-relaxed flex items-start gap-3">
        <Info className="w-5 h-5 text-stone-500 shrink-0 mt-0.5" />
        <div>
          <strong className="block text-stone-800 dark:text-stone-200 mb-0.5">{ui.academicDisclaimerTitle}</strong>
          {ui.academicDisclaimerText}
        </div>
      </div>
    </div>
  );
};
