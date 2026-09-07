import React, { useState } from 'react';
import {
  Globe2,
  Share2,
  ShieldCheck,
  Cpu,
  Lock,
  ArrowRight,
  Database,
  Sprout,
  CheckCircle2,
  ExternalLink,
  Info,
} from 'lucide-react';
import { Language } from '../types';
import { getTranslation } from '../i18n/translations';
import { AGRIN_NODES, SHARED_KNOWLEDGE_MODULES } from '../data/mockData';

interface AgriNNetworkViewProps {
  language: Language;
}

export const AgriNNetworkView: React.FC<AgriNNetworkViewProps> = ({ language }) => {
  const [selectedNode, setSelectedNode] = useState(AGRIN_NODES[0]);
  const [selectedModule, setSelectedModule] = useState(SHARED_KNOWLEDGE_MODULES[0]);
  const t = getTranslation(language);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center">
              <Globe2 className="w-4 h-4" />
            </div>
            <h1 className="font-heading text-2xl font-bold text-stone-900">{t.navAgriN}</h1>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            {t.agrinSubtitle} A federated, privacy-preserving digital framework across BRICS agricultural knowledge centers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-purple-50 text-purple-900 border border-purple-200 text-xs font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
            <span>Conceptual Hackathon Architecture</span>
          </span>
        </div>
      </div>

      {/* Privacy-Preserving Sovereign Architecture Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-950 to-stone-900 text-white rounded-3xl p-6 sm:p-8 shadow-md border border-purple-800/50 space-y-4">
        <div className="flex items-center gap-2 text-purple-300 text-xs uppercase font-bold tracking-wider">
          <Lock className="w-4 h-4" />
          <span>Data Sovereignty & Federated Intelligence</span>
        </div>

        <h2 className="font-heading text-xl sm:text-2xl font-bold text-white max-w-3xl">
          Sharing Agronomic Insights Without Compromising Sovereign Farmer Data
        </h2>

        <p className="text-xs sm:text-sm text-purple-100/90 max-w-4xl leading-relaxed">
          The AgriN vision ensures individual farmer identities, land ownership deeds, and specific geo-coordinates remain strictly localized within national borders.
          Instead of centralizing private telemetry, edge AI models compute aggregated agronomic learnings (e.g., biological pest control efficacy, bio-char formulations, drought adaptations) and broadcast anonymized, open science protocols across the network.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-3 rounded-xl bg-white/10 border border-white/10 text-xs">
            <strong className="block text-white mb-1">1. Localized Sovereign Storage</strong>
            <span className="text-purple-200">Data never leaves farmer devices without cryptographic consensus.</span>
          </div>
          <div className="p-3 rounded-xl bg-white/10 border border-white/10 text-xs">
            <strong className="block text-white mb-1">2. Federated Learning Models</strong>
            <span className="text-purple-200">Model parameters update collaboratively without raw data sharing.</span>
          </div>
          <div className="p-3 rounded-xl bg-white/10 border border-white/10 text-xs">
            <strong className="block text-white mb-1">3. Open Agronomic Commons</strong>
            <span className="text-purple-200">Verified biological remedies published under interoperable licenses.</span>
          </div>
        </div>
      </div>

      {/* BRICS Participating Nodes Cards */}
      <div className="space-y-4">
        <h3 className="font-heading text-lg font-bold text-stone-900">
          BRICS Agricultural Intelligence Hubs
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {AGRIN_NODES.map((node) => {
            const isSelected = selectedNode.id === node.id;
            return (
              <div
                key={node.id}
                onClick={() => setSelectedNode(node)}
                className={`rounded-2xl p-5 border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-purple-600 bg-purple-50/40 shadow-sm'
                    : 'border-stone-200 bg-white hover:border-purple-400'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{node.flag}</span>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {node.status}
                    </span>
                  </div>
                  <h4 className="font-heading text-base font-bold text-stone-900">
                    {node.country}
                  </h4>
                  <p className="text-[11px] text-stone-500 font-medium truncate mt-0.5">
                    {node.institution}
                  </p>
                  <p className="text-xs text-stone-600 mt-2 leading-tight">
                    {node.focusArea}
                  </p>
                </div>

                <div className="mt-4 pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-purple-700 font-semibold">
                  <span>View Contributions</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Node Details & Shared Knowledge Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Node Spotlight */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-stone-100">
            <span className="text-3xl">{selectedNode.flag}</span>
            <div>
              <h4 className="font-heading text-lg font-bold text-stone-900">
                {selectedNode.country} Node
              </h4>
              <span className="text-xs text-stone-500">{selectedNode.institution}</span>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                Agronomic Specialization
              </span>
              <p className="text-xs sm:text-sm text-stone-800 mt-0.5">
                {selectedNode.focusArea}
              </p>
            </div>

            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                Active Knowledge Contributions
              </span>
              <div className="space-y-1.5 mt-1.5">
                {selectedNode.contributions.map((c, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 p-2 rounded-lg bg-stone-50 border border-stone-100 text-xs text-stone-700"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                    <span>{c}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 4 Shared Knowledge Modules Required by Prompt */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <h4 className="font-heading text-base font-bold text-stone-900">
              Shared Multilateral Knowledge Modules
            </h4>
            <span className="text-xs text-stone-400">4 Interoperable Pillars</span>
          </div>

          <div className="space-y-3">
            {SHARED_KNOWLEDGE_MODULES.map((mod) => (
              <div
                key={mod.id}
                className="p-4 rounded-xl border border-stone-200 bg-stone-50 hover:bg-purple-50/20 transition-all space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-purple-900">
                    {mod.title}
                  </span>
                  <span className="text-[11px] px-2 py-0.5 rounded-md bg-stone-200/70 text-stone-700 font-medium">
                    Leader: {mod.leadCountry}
                  </span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {mod.description}
                </p>
                <div className="pt-1 flex items-center justify-between text-[11px] text-stone-500">
                  <span>Impact: <strong className="text-stone-800">{mod.beneficiaryImpact}</strong></span>
                  <span className="text-purple-700 font-semibold">{mod.recordsCount}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sovereign Notice Disclaimer */}
      <div className="rounded-2xl bg-stone-100 border border-stone-200 p-5 text-stone-600 text-xs leading-relaxed flex items-start gap-3">
        <Info className="w-5 h-5 text-stone-500 shrink-0 mt-0.5" />
        <div>
          <strong className="block text-stone-800 mb-0.5">Academic & Hackathon Conceptual Disclaimer</strong>
          The AgriN Network representation is an educational, conceptual demonstration for the AgriN / Regenerative Agricultural Intelligence hackathon challenge.
          It models how federated AI interoperability could function across BRICS agricultural entities, and does not claim official operational integration with government ministries.
        </div>
      </div>
    </div>
  );
};
