import React, { useState } from 'react';
import { RecommendedAction } from '../../server/types.js';
import { ShieldCheck, CheckSquare, Square, Copy, Check, ExternalLink } from 'lucide-react';
import { useSecurity } from '../context/SecurityContext';

interface SafeActionChecklistProps {
  actions: RecommendedAction[];
}

export const SafeActionChecklist: React.FC<SafeActionChecklistProps> = ({ actions }) => {
  const { showNotification } = useSecurity();
  const [completedState, setCompletedState] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const toggleAction = (id: string) => {
    setCompletedState(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showNotification('success', 'Recommendation copied to clipboard.');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getPriorityBadge = (p: 'critical' | 'high' | 'medium') => {
    if (p === 'critical') return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
    if (p === 'high') return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
  };

  return (
    <div className="glass-panel rounded-2xl border border-slate-800 p-6 w-full space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <h3 className="text-base font-bold text-slate-100">Recommended Safe Next Actions</h3>
        </div>
        <span className="text-xs text-slate-400 font-mono">
          Defensive Protocols Only
        </span>
      </div>

      <div className="space-y-3">
        {actions.map((act) => {
          const isDone = !!completedState[act.id];
          return (
            <div
              key={act.id}
              className={`p-4 rounded-xl border transition-all ${
                isDone
                  ? 'bg-slate-900/40 border-slate-800/60 opacity-60'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start gap-3">
                <button
                  onClick={() => toggleAction(act.id)}
                  className="mt-0.5 text-slate-400 hover:text-emerald-400 transition-colors"
                >
                  {isDone ? (
                    <CheckSquare className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <Square className="w-5 h-5" />
                  )}
                </button>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className={`text-xs font-bold ${isDone ? 'line-through text-slate-500' : 'text-slate-100'}`}>
                      {act.title}
                    </h4>
                    <span className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded-full border uppercase ${getPriorityBadge(act.priority)}`}>
                      {act.priority}
                    </span>
                  </div>

                  <p className={`text-xs leading-relaxed ${isDone ? 'line-through text-slate-600' : 'text-slate-300'}`}>
                    {act.action}
                  </p>

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      onClick={() => copyText(`${act.title}: ${act.action}`, act.id)}
                      className="flex items-center gap-1 text-[11px] font-mono text-slate-400 hover:text-cyan-400 transition-colors"
                    >
                      {copiedId === act.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy Step</span>
                        </>
                      )}
                    </button>
                    <span className="text-slate-700">•</span>
                    <span className="text-[10px] font-mono text-slate-500 uppercase">{act.category}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
