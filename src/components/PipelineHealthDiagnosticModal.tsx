import React, { useState, useEffect } from 'react';
import {
  Activity,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  X,
  ShieldCheck,
  Tag,
  Clock,
  MapPin,
  Layers,
  Database,
} from 'lucide-react';
import { FarmProfile } from '../types';
import { useAuth } from '../context/AuthContext';
import {
  runEndToEndHealthCheck,
  SystemHealthReport,
  DiagnosticItemResult,
  DataProvenance,
} from '../data/providers/healthCheckDiagnostic';

interface PipelineHealthDiagnosticModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentFarm: FarmProfile;
}

export const PipelineHealthDiagnosticModal: React.FC<PipelineHealthDiagnosticModalProps> = ({
  isOpen,
  onClose,
  currentFarm,
}) => {
  const { user } = useAuth();
  const [report, setReport] = useState<SystemHealthReport | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleRunCheck = async () => {
    setLoading(true);
    try {
      const result = await runEndToEndHealthCheck(currentFarm, user?.uid);
      setReport(result);
    } catch (err) {
      console.error('Health check failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      handleRunCheck();
    }
  }, [isOpen, currentFarm]);

  if (!isOpen) return null;

  const renderProvenanceBadge = (prov: DataProvenance) => {
    switch (prov) {
      case 'USER_PROVIDED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
            <Tag className="w-3 h-3 text-blue-600" />
            USER_PROVIDED
          </span>
        );
      case 'DERIVED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-purple-100 dark:bg-purple-950/80 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
            <Layers className="w-3 h-3 text-purple-600" />
            DERIVED
          </span>
        );
      case 'PROVIDER_VERIFIED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <ShieldCheck className="w-3 h-3 text-emerald-600" />
            PROVIDER_VERIFIED
          </span>
        );
      case 'CACHED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
            <Clock className="w-3 h-3 text-amber-600" />
            CACHED
          </span>
        );
      case 'UNAVAILABLE':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-300 dark:border-stone-700">
            <AlertTriangle className="w-3 h-3 text-stone-500" />
            UNAVAILABLE
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/80 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white dark:bg-stone-900 rounded-3xl max-w-5xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-stone-900 text-white flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Activity className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-bold">End-to-End Data Pipeline Diagnostic Test Suite</h2>
              <p className="text-xs text-stone-300">
                Active Farm: <strong>{currentFarm.name}</strong> ({currentFarm.country || 'India'} → {currentFarm.state || currentFarm.stateRegion || 'State'} → {currentFarm.district || currentFarm.location || 'District'})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Action & Status Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-stone-100 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700">
            <div>
              <div className="text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                Overall System Status
              </div>
              <div className="flex items-center gap-3 mt-1 flex-wrap">
                {report?.overallStatus === 'HEALTHY' ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    SYSTEM HEALTHY (ALL PIPELINES PASSING)
                  </span>
                ) : report?.overallStatus === 'DEGRADED' ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                    <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    SYSTEM DEGRADED (PARTIAL SERVICE)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 dark:bg-red-950/80 text-red-800 dark:text-red-300 border border-red-300 dark:border-red-700">
                    <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                    SYSTEM FAILED (CRITICAL PIPELINE FAILURES)
                  </span>
                )}
                <span className="text-xs text-stone-500 dark:text-stone-400 font-mono">
                  Latency: <strong>{report?.totalLatencyMs || 0} ms</strong>
                </span>
                <span className="text-xs text-stone-500 dark:text-stone-400">
                  Passed: <strong>{report?.passCount || 0}</strong> / Failed: <strong>{report?.failCount || 0}</strong>
                </span>
              </div>
            </div>

            <button
              onClick={handleRunCheck}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>{loading ? 'Executing Pipeline Diagnostics...' : 'Re-Run All Pipeline Tests'}</span>
            </button>
          </div>

          {/* Summary Matrix Cards */}
          {report?.matrix && (
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 text-center">
              <div className={`p-2.5 rounded-xl border text-xs font-bold ${report.matrix.farmProfileEngine === 'PASS' ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300' : 'bg-red-50 border-red-200 dark:bg-red-950/40 text-red-800 dark:text-red-300'}`}>
                <div className="text-[10px] text-stone-500 dark:text-stone-400 font-normal">Farm Context</div>
                <div>{report.matrix.farmProfileEngine}</div>
              </div>
              <div className={`p-2.5 rounded-xl border text-xs font-bold ${report.matrix.geographicHierarchy === 'PASS' ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300' : 'bg-red-50 border-red-200 dark:bg-red-950/40 text-red-800 dark:text-red-300'}`}>
                <div className="text-[10px] text-stone-500 dark:text-stone-400 font-normal">Geography</div>
                <div>{report.matrix.geographicHierarchy}</div>
              </div>
              <div className={`p-2.5 rounded-xl border text-xs font-bold ${report.matrix.weather === 'PASS' ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300' : 'bg-red-50 border-red-200 dark:bg-red-950/40 text-red-800 dark:text-red-300'}`}>
                <div className="text-[10px] text-stone-500 dark:text-stone-400 font-normal">Weather</div>
                <div>{report.matrix.weather}</div>
              </div>
              <div className={`p-2.5 rounded-xl border text-xs font-bold ${report.matrix.soil === 'PASS' ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300' : 'bg-red-50 border-red-200 dark:bg-red-950/40 text-red-800 dark:text-red-300'}`}>
                <div className="text-[10px] text-stone-500 dark:text-stone-400 font-normal">Soil Health</div>
                <div>{report.matrix.soil}</div>
              </div>
              <div className={`p-2.5 rounded-xl border text-xs font-bold ${report.matrix.satelliteGeospatial === 'PASS' ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300' : 'bg-red-50 border-red-200 dark:bg-red-950/40 text-red-800 dark:text-red-300'}`}>
                <div className="text-[10px] text-stone-500 dark:text-stone-400 font-normal">Satellite / EO</div>
                <div>{report.matrix.satelliteGeospatial}</div>
              </div>
              <div className={`p-2.5 rounded-xl border text-xs font-bold ${report.matrix.gemini === 'PASS' ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300' : 'bg-red-50 border-red-200 dark:bg-red-950/40 text-red-800 dark:text-red-300'}`}>
                <div className="text-[10px] text-stone-500 dark:text-stone-400 font-normal">Gemini AI</div>
                <div>{report.matrix.gemini}</div>
              </div>
              <div className={`p-2.5 rounded-xl border text-xs font-bold ${report.matrix.userIsolation === 'PASS' ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300' : 'bg-red-50 border-red-200 dark:bg-red-950/40 text-red-800 dark:text-red-300'}`}>
                <div className="text-[10px] text-stone-500 dark:text-stone-400 font-normal">UID Isolation</div>
                <div>{report.matrix.userIsolation}</div>
              </div>
            </div>
          )}

          {/* Diagnostic Items Detailed Table */}
          <div className="overflow-x-auto rounded-2xl border border-stone-200 dark:border-stone-800">
            <table className="w-full text-left text-xs text-stone-700 dark:text-stone-300">
              <thead className="bg-stone-100 dark:bg-stone-800/80 text-stone-600 dark:text-stone-300 uppercase tracking-wider font-bold">
                <tr>
                  <th className="p-3">Pipeline Component</th>
                  <th className="p-3">Provider / Dataset</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Latency</th>
                  <th className="p-3">Data Provenance</th>
                  <th className="p-3">Geographic Scope</th>
                  <th className="p-3">Validation Result</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 dark:divide-stone-800 bg-white dark:bg-stone-900">
                {report?.items.map((item: DiagnosticItemResult, idx: number) => (
                  <tr key={idx} className="hover:bg-stone-50 dark:hover:bg-stone-800/40">
                    <td className="p-3 font-bold text-stone-900 dark:text-white">
                      {item.component}
                    </td>
                    <td className="p-3">
                      <div className="font-medium text-stone-800 dark:text-stone-200">
                        {item.provider}
                      </div>
                      <div className="text-[10px] text-stone-500 dark:text-stone-400">
                        {item.datasetName}
                      </div>
                    </td>
                    <td className="p-3">
                      {item.status === 'PASS' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          PASS
                        </span>
                      )}
                      {item.status === 'UNAVAILABLE' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold text-[11px]">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                          UNAVAILABLE
                        </span>
                      )}
                      {item.status === 'WARN' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold text-[11px]">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                          WARN
                        </span>
                      )}
                      {item.status === 'FAIL' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-300 font-bold text-[11px]">
                          <XCircle className="w-3.5 h-3.5 text-red-600" />
                          FAIL
                        </span>
                      )}
                    </td>
                    <td className="p-3 font-mono text-[11px]">
                      {item.latencyDisplay}
                    </td>
                    <td className="p-3">
                      {renderProvenanceBadge(item.provenance)}
                    </td>
                    <td className="p-3 text-stone-600 dark:text-stone-400">
                      {item.geographicScope}
                    </td>
                    <td className="p-3">
                      <div className="text-stone-800 dark:text-stone-200">
                        {item.validationResult}
                      </div>
                      {item.errorMessage && (
                        <div className="text-red-600 dark:text-red-400 font-mono text-[10px] mt-0.5 font-semibold">
                          Error: {item.errorMessage}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Architectural Notes */}
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-200 text-xs space-y-1">
            <div className="flex items-center gap-2 font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Production Security & Provenance Validation
            </div>
            <p className="text-emerald-800 dark:text-emerald-300 leading-relaxed">
              Every diagnostic test traces the Active Farm Context from the authenticated user's Firebase UID. Geographic hierarchy is dynamically normalized across Indian administrative divisions without silent demo fallbacks or literal string <code className="bg-emerald-100 dark:bg-emerald-900/60 px-1 py-0.5 rounded font-mono">undefined</code> outputs.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-100 dark:bg-stone-800 border-t border-stone-200 dark:border-stone-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-xs font-bold hover:bg-stone-800 transition-colors cursor-pointer"
          >
            Close Diagnostics
          </button>
        </div>
      </div>
    </div>
  );
};
