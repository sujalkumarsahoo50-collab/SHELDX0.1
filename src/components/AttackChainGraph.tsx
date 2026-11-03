import React, { useState } from 'react';
import { AttackChain, AttackNode } from '../../server/types.js';
import { ShieldAlert, AlertTriangle, Link as LinkIcon, Smartphone, Mail, User, Info, CheckCircle2, ChevronRight } from 'lucide-react';

interface AttackChainGraphProps {
  chain: AttackChain;
}

export const AttackChainGraph: React.FC<AttackChainGraphProps> = ({ chain }) => {
  const [selectedNode, setSelectedNode] = useState<AttackNode | null>(chain.nodes[0] || null);

  const getNodeIcon = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes('email')) return <Mail className="w-4 h-4 text-cyan-400" />;
    if (t.includes('url') || t.includes('link')) return <LinkIcon className="w-4 h-4 text-amber-400" />;
    if (t.includes('sms') || t.includes('message')) return <Smartphone className="w-4 h-4 text-purple-400" />;
    if (t.includes('login') || t.includes('auth')) return <AlertTriangle className="w-4 h-4 text-rose-400" />;
    return <User className="w-4 h-4 text-blue-400" />;
  };

  const getRiskBadge = (score: number) => {
    if (score >= 80) return 'bg-rose-500/20 text-rose-400 border-rose-500/40';
    if (score >= 60) return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
    if (score >= 35) return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40';
    return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full">
      {/* Visual Canvas Area */}
      <div className="flex-1 glass-panel rounded-2xl border border-slate-800 p-6 relative min-h-[420px] flex flex-col justify-between overflow-hidden bg-cyber-grid">
        
        {/* Graph Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-400" />
              <h3 className="text-base font-bold text-slate-100">{chain.title}</h3>
              <span className={`px-2.5 py-0.5 text-xs font-mono font-bold rounded-full border ${getRiskBadge(chain.riskScore)}`}>
                Risk {chain.riskScore}/100
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">{chain.summary}</p>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-slate-400">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> High Risk Node
            </span>
            <span className="flex items-center gap-1.5 text-slate-400">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" /> Vector Node
            </span>
          </div>
        </div>

        {/* Nodes and Flow Connectors */}
        <div className="py-8 px-2 flex flex-col md:flex-row items-center justify-around gap-6 overflow-x-auto my-auto">
          {chain.nodes.map((node, index) => {
            const isSelected = selectedNode?.id === node.id;
            return (
              <React.Fragment key={node.id}>
                {/* Node Box */}
                <div
                  onClick={() => setSelectedNode(node)}
                  className={`group cursor-pointer relative flex flex-col items-center p-4 rounded-xl border transition-all duration-300 min-w-[150px] max-w-[180px] text-center ${
                    isSelected
                      ? 'bg-slate-900 border-cyan-400 shadow-lg shadow-cyan-500/20 scale-105'
                      : node.isSuspicious
                      ? 'bg-slate-900/90 border-rose-500/50 hover:border-rose-400 hover:shadow-md hover:shadow-rose-950'
                      : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {/* Risk Badge Pill */}
                  {node.riskScore > 0 && (
                    <span className={`absolute -top-2.5 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${getRiskBadge(node.riskScore)}`}>
                      {node.riskScore}
                    </span>
                  )}

                  <div className={`p-2.5 rounded-lg mb-2.5 ${
                    node.isSuspicious ? 'bg-rose-500/10 text-rose-400' : 'bg-slate-800 text-cyan-400'
                  }`}>
                    {getNodeIcon(node.type)}
                  </div>

                  <span className="text-xs font-bold text-slate-200 truncate w-full">{node.label}</span>
                  <span className="text-[10px] text-slate-400 truncate w-full mt-0.5">{node.subtitle || node.type}</span>

                  <span className="text-[9px] font-mono text-slate-500 mt-2">
                    {new Date(node.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                {/* Connecting Arrow */}
                {index < chain.nodes.length - 1 && (
                  <div className="hidden md:flex flex-col items-center justify-center text-slate-600">
                    <ChevronRight className="w-5 h-5 text-cyan-500/70 animate-pulse" />
                    <span className="text-[9px] font-mono text-cyan-400/80 -mt-1 uppercase tracking-tighter">
                      {chain.edges[index]?.relation || 'Correlated'}
                    </span>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-800/80 pt-3">
          <span>Click any node in the attack chain to inspect detailed telemetry features</span>
          <span className="font-mono text-cyan-400">{chain.eventIds.length} Linked Signals</span>
        </div>
      </div>

      {/* Selected Node Details Side Panel */}
      {selectedNode && (
        <div className="w-full lg:w-80 glass-panel rounded-2xl border border-slate-800 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-cyan-400" />
                <h4 className="text-sm font-bold text-slate-200">Node Telemetry</h4>
              </div>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${getRiskBadge(selectedNode.riskScore)}`}>
                Score: {selectedNode.riskScore}/100
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-mono uppercase text-slate-500">Event Title</label>
                <p className="text-xs font-semibold text-slate-100">{selectedNode.label}</p>
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-slate-500">Classification</label>
                <p className="text-xs font-medium text-cyan-300">{selectedNode.type}</p>
              </div>

              <div>
                <label className="text-[10px] font-mono uppercase text-slate-500">Timestamp</label>
                <p className="text-xs font-mono text-slate-300">{new Date(selectedNode.timestamp).toLocaleString()}</p>
              </div>

              <div className="border-t border-slate-800 pt-3">
                <label className="text-[10px] font-mono uppercase text-slate-500 mb-2 block">Extracted Details</label>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {Object.entries(selectedNode.details || {}).map(([key, val]) => (
                    <div key={key} className="bg-slate-900/80 p-2 rounded border border-slate-800 text-[11px] flex justify-between gap-2">
                      <span className="text-slate-400 capitalize">{key}:</span>
                      <span className="font-mono text-slate-200 text-right truncate max-w-[140px]">{String(val)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">Signal Status:</span>
            <span className="flex items-center gap-1 text-emerald-400 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" /> Correlated
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
