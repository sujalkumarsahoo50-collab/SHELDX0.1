import React, { useState } from 'react';
import { useSecurity } from '../context/SecurityContext';
import { AttackChainGraph } from '../components/AttackChainGraph';
import { Network, Filter, Search, ShieldAlert } from 'lucide-react';

export const AttackGraphPage: React.FC = () => {
  const { chains } = useSecurity();
  const [selectedChainId, setSelectedChainId] = useState<string>(chains[0]?.id || '');

  const selectedChain = chains.find(c => c.id === selectedChainId) || chains[0];

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100">Digital Risk Graph & Attack Chains</h2>
          <p className="text-xs text-slate-400">Visualizing cross-signal telemetry & threat causal paths</p>
        </div>

        {/* Chain selector dropdown */}
        {chains.length > 1 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-mono">Select Campaign:</span>
            <select
              value={selectedChainId}
              onChange={(e) => setSelectedChainId(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-cyan-300 font-mono focus:outline-none focus:border-cyan-500"
            >
              {chains.map(c => (
                <option key={c.id} value={c.id}>
                  {c.title} (Risk {c.riskScore}/100)
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {selectedChain ? (
        <AttackChainGraph chain={selectedChain} />
      ) : (
        <div className="glass-panel rounded-2xl border border-slate-800 p-12 text-center text-slate-400">
          <Network className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-300">No Active Attack Chains Synthesized</p>
          <p className="text-xs text-slate-500 mt-1">Submit multiple events in the Event Analyzer or launch a Demo Scenario to generate graph telemetry.</p>
        </div>
      )}
    </div>
  );
};
