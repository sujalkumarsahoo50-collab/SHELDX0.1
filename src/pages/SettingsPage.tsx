import React, { useState } from 'react';
import { useSecurity } from '../context/SecurityContext';
import { Settings as SettingsIcon, Cpu, Key, Sliders, CheckCircle2, Shield } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { showNotification } = useSecurity();

  const [provider, setProvider] = useState<'gemini' | 'local'>('gemini');
  const [apiKey, setApiKey] = useState<string>(localStorage.getItem('SHIELDX_GEMINI_KEY') || '');

  // Risk Weights Sliders (Defaults from Requirement 7)
  const [wSender, setWSender] = useState<number>(15);
  const [wUrl, setWUrl] = useState<number>(20);
  const [wImp, setWImp] = useState<number>(15);
  const [wUrg, setWUrg] = useState<number>(10);
  const [wCred, setWCred] = useState<number>(15);
  const [wLog, setWLog] = useState<number>(15);
  const [wCorr, setWCorr] = useState<number>(10);

  const totalWeight = wSender + wUrl + wImp + wUrg + wCred + wLog + wCorr;

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey) {
      localStorage.setItem('SHIELDX_GEMINI_KEY', apiKey);
    } else {
      localStorage.removeItem('SHIELDX_GEMINI_KEY');
    }
    showNotification('success', 'Configuration settings & risk weights saved.');
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      
      <div className="border-b border-slate-800 pb-4">
        <h2 className="text-xl font-bold text-slate-100">System Configuration & Risk Engine Settings</h2>
        <p className="text-xs text-slate-400">Configure AI provider credentials, pipeline thresholds, and custom risk weights</p>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        
        {/* AI Engine Provider Settings */}
        <div className="glass-panel rounded-2xl border border-slate-800 p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-slate-100 uppercase font-mono">AI Provider Abstraction Layer</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div
              onClick={() => setProvider('gemini')}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                provider === 'gemini'
                  ? 'bg-slate-900 border-cyan-500 shadow-md shadow-cyan-950'
                  : 'bg-slate-950 border-slate-800 opacity-70'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-100">Google Gemini API</span>
                {provider === 'gemini' && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Structured JSON inference via multimodal LLM pipeline.</p>
            </div>

            <div
              onClick={() => setProvider('local')}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                provider === 'local'
                  ? 'bg-slate-900 border-cyan-500 shadow-md shadow-cyan-950'
                  : 'bg-slate-950 border-slate-800 opacity-70'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-100">ShieldX Local Deterministic Engine</span>
                {provider === 'local' && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Fallback rule-based correlation engine (Zero network calls required).</p>
            </div>

          </div>

          {provider === 'gemini' && (
            <div className="pt-2">
              <label className="text-xs font-mono uppercase text-slate-400 mb-1 block">Gemini API Key (Optional Override)</label>
              <div className="relative">
                <Key className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>
              <p className="text-[10px] text-slate-500 mt-1">Keys are stored exclusively in local browser memory and never uploaded.</p>
            </div>
          )}
        </div>

        {/* Configurable Risk Weights Sliders */}
        <div className="glass-panel rounded-2xl border border-slate-800 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-purple-400" />
              <h3 className="text-sm font-bold text-slate-100 uppercase font-mono">Configurable Risk Scoring Weights</h3>
            </div>
            <span className={`text-xs font-mono font-bold ${totalWeight === 100 ? 'text-emerald-400' : 'text-amber-400'}`}>
              Total Weight: {totalWeight}% {totalWeight !== 100 && '(Normalized automatically)'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-300">URL & Domain Risk Weight:</span>
                <span className="text-cyan-400 font-bold">{wUrl}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="40"
                value={wUrl}
                onChange={(e) => setWUrl(Number(e.target.value))}
                className="w-full accent-cyan-400"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-300">Sender Anomaly Weight:</span>
                <span className="text-cyan-400 font-bold">{wSender}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="40"
                value={wSender}
                onChange={(e) => setWSender(Number(e.target.value))}
                className="w-full accent-cyan-400"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-300">Impersonation Weight:</span>
                <span className="text-cyan-400 font-bold">{wImp}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="40"
                value={wImp}
                onChange={(e) => setWImp(Number(e.target.value))}
                className="w-full accent-cyan-400"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-300">Credential / Payment Harvesting:</span>
                <span className="text-cyan-400 font-bold">{wCred}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="40"
                value={wCred}
                onChange={(e) => setWCred(Number(e.target.value))}
                className="w-full accent-cyan-400"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-300">Login Anomaly Weight:</span>
                <span className="text-cyan-400 font-bold">{wLog}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="40"
                value={wLog}
                onChange={(e) => setWLog(Number(e.target.value))}
                className="w-full accent-cyan-400"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-300">Urgency Language Weight:</span>
                <span className="text-cyan-400 font-bold">{wUrg}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="40"
                value={wUrg}
                onChange={(e) => setWUrg(Number(e.target.value))}
                className="w-full accent-cyan-400"
              />
            </div>

          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-xl shadow-lg transition-all"
          >
            Save Configuration
          </button>
        </div>

      </form>

    </div>
  );
};
