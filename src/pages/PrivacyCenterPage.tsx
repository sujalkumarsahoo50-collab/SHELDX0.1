import React from 'react';
import { useSecurity } from '../context/SecurityContext';
import { Lock, Trash2, ShieldCheck, EyeOff, Cpu, Database, CheckCircle2, History } from 'lucide-react';

export const PrivacyCenterPage: React.FC = () => {
  const { privacySettings, updatePrivacy, auditLogs, purgeData } = useSecurity();

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      
      {/* Page Header */}
      <div className="border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100">Privacy Center & Data Transparency</h2>
            <p className="text-xs text-slate-400">Zero-trust telemetry processing & user data sovereignty</p>
          </div>
        </div>
      </div>

      {/* Transparency Grid (Collected / Processed / Stored / Deleted) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-cyan-400">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-xs font-mono font-bold uppercase">DATA COLLECTED</span>
          </div>
          <p className="text-xs font-semibold text-slate-200">Anonymized Event Signatures Only</p>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Domain hashes, sender headers, timestamp deltas, and coarse location coordinates.
          </p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-purple-400">
            <Cpu className="w-4 h-4" />
            <span className="text-xs font-mono font-bold uppercase">DATA PROCESSED</span>
          </div>
          <p className="text-xs font-semibold text-slate-200">Local Feature Tokens</p>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Entropy metrics, typosquatting scores, and urgency keyword counts processed in memory.
          </p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-amber-400">
            <Database className="w-4 h-4" />
            <span className="text-xs font-mono font-bold uppercase">DATA STORED</span>
          </div>
          <p className="text-xs font-semibold text-slate-200">
            {privacySettings.noRawMessageStorage ? 'Zero Raw Message Content' : 'Encrypted Metadata'}
          </p>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Raw email and SMS payloads are stripped immediately after rule extraction.
          </p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-rose-400">
            <Trash2 className="w-4 h-4" />
            <span className="text-xs font-mono font-bold uppercase">DATA DELETED</span>
          </div>
          <p className="text-xs font-semibold text-slate-200">Automatic Purge Policy</p>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            All transient telemetry automatically expires after {privacySettings.retentionDays} days or upon manual purge.
          </p>
        </div>

      </div>

      {/* Privacy Controls & Purge Action */}
      <div className="glass-panel rounded-2xl border border-slate-800 p-6 space-y-6">
        
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-slate-100 font-mono uppercase">User Privacy Preferences</h3>
          <span className="text-xs text-emerald-400 flex items-center gap-1 font-mono">
            <CheckCircle2 className="w-4 h-4" /> Active Protection
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <div>
              <p className="text-xs font-bold text-slate-200">Data Minimization Engine</p>
              <p className="text-[11px] text-slate-400">Redact email addresses, phone numbers, and payment details prior to analysis.</p>
            </div>
            <input
              type="checkbox"
              checked={privacySettings.dataMinimization}
              onChange={(e) => updatePrivacy({ dataMinimization: e.target.checked })}
              className="w-4 h-4 accent-cyan-400 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <div>
              <p className="text-xs font-bold text-slate-200">No Raw Message Retention</p>
              <p className="text-[11px] text-slate-400">Discard original text payloads immediately after feature extraction.</p>
            </div>
            <input
              type="checkbox"
              checked={privacySettings.noRawMessageStorage}
              onChange={(e) => updatePrivacy({ noRawMessageStorage: e.target.checked })}
              className="w-4 h-4 accent-cyan-400 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <div>
              <p className="text-xs font-bold text-slate-200">Anonymized Event Identifiers</p>
              <p className="text-[11px] text-slate-400">Generate cryptographic pseudonyms for session events.</p>
            </div>
            <input
              type="checkbox"
              checked={privacySettings.anonymizeEvents}
              onChange={(e) => updatePrivacy({ anonymizeEvents: e.target.checked })}
              className="w-4 h-4 accent-cyan-400 cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/80 border border-slate-800">
            <div>
              <p className="text-xs font-bold text-slate-200">Local Preprocessing Preference</p>
              <p className="text-[11px] text-slate-400">Execute deterministic regex rules locally before LLM API calls.</p>
            </div>
            <input
              type="checkbox"
              checked={privacySettings.localPreprocessing}
              onChange={(e) => updatePrivacy({ localPreprocessing: e.target.checked })}
              className="w-4 h-4 accent-cyan-400 cursor-pointer"
            />
          </div>

        </div>

        {/* Delete My Data Action */}
        <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h4 className="text-xs font-bold text-rose-400">Right to be Forgotten</h4>
            <p className="text-[11px] text-slate-400">Instantly purge all security events, attack graph nodes, and local logs.</p>
          </div>

          <button
            onClick={purgeData}
            className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-xl shadow-lg shadow-rose-950 transition-all"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete My Security Data</span>
          </button>
        </div>

      </div>

      {/* Privacy Audit Log Viewer */}
      <div className="glass-panel rounded-2xl border border-slate-800 p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-slate-100">Privacy Audit Trail</h3>
          </div>
          <span className="text-xs font-mono text-slate-400">{auditLogs.length} System Records</span>
        </div>

        <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
          {auditLogs.map((log) => (
            <div key={log.id} className="bg-slate-900/70 p-3 rounded-xl border border-slate-800/80 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-slate-200">{log.action}</span>
                <p className="text-[11px] text-slate-400">{log.details}</p>
              </div>
              <div className="text-right shrink-0">
                <span className="text-[10px] font-mono text-cyan-400">{log.anonymizedId}</span>
                <p className="text-[9px] font-mono text-slate-500">
                  {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
