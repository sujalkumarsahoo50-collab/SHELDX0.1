import React from 'react';
import { SecurityEvent } from '../../server/types.js';
import { Clock, ShieldAlert, AlertTriangle, Link as LinkIcon, Mail, Smartphone, ArrowRight, ShieldCheck } from 'lucide-react';

interface SecurityTimelineViewProps {
  events: SecurityEvent[];
}

export const SecurityTimelineView: React.FC<SecurityTimelineViewProps> = ({ events }) => {
  const sortedEvents = [...events].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'email': return <Mail className="w-4 h-4 text-cyan-400" />;
      case 'message': return <Smartphone className="w-4 h-4 text-purple-400" />;
      case 'url': return <LinkIcon className="w-4 h-4 text-amber-400" />;
      case 'login': return <AlertTriangle className="w-4 h-4 text-rose-400" />;
      default: return <ShieldAlert className="w-4 h-4 text-blue-400" />;
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 80) return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
    if (score >= 60) return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
  };

  return (
    <div className="glass-panel rounded-2xl border border-slate-800 p-6 w-full">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-cyan-400" />
          <h3 className="text-base font-bold text-slate-100">Security Event Timeline</h3>
        </div>
        <span className="text-xs font-mono text-slate-400">
          {events.length} Telemetry Events Recorded
        </span>
      </div>

      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
        {sortedEvents.map((ev, index) => {
          const isHighRisk = ev.riskScore >= 70;
          return (
            <div key={ev.id} className="relative group">
              {/* Timeline Point Marker */}
              <div className={`absolute -left-[31px] top-1.5 w-4 h-4 rounded-full border-2 bg-slate-950 flex items-center justify-center transition-all ${
                isHighRisk ? 'border-rose-500 shadow-md shadow-rose-950' : 'border-cyan-500'
              }`}>
                <div className={`w-1.5 h-1.5 rounded-full ${isHighRisk ? 'bg-rose-400' : 'bg-cyan-400'}`} />
              </div>

              {/* Event Content Card */}
              <div className="glass-panel rounded-xl border border-slate-800/90 p-4 hover:border-slate-700 transition-all">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                      {getEventIcon(ev.type)}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-100">{ev.title}</h4>
                      <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                        {new Date(ev.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })} • {ev.type.toUpperCase()}
                      </p>
                    </div>
                  </div>

                  <span className={`px-2.5 py-0.5 text-xs font-mono font-bold rounded-full border ${getRiskColor(ev.riskScore)}`}>
                    Risk {ev.riskScore}/100
                  </span>
                </div>

                {/* Event Details Summary */}
                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2 text-xs bg-slate-950/60 p-2.5 rounded-lg border border-slate-900">
                  {ev.details.sender && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">Sender:</span>
                      <span className="font-mono text-slate-300 truncate max-w-[180px]">{ev.details.sender}</span>
                    </div>
                  )}
                  {ev.details.url && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">Target Domain:</span>
                      <span className="font-mono text-cyan-400 truncate max-w-[180px]">{ev.details.url}</span>
                    </div>
                  )}
                  {ev.details.location && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">Location:</span>
                      <span className="font-mono text-slate-300">{ev.details.location}</span>
                    </div>
                  )}
                  {ev.details.device && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">Fingerprint:</span>
                      <span className="font-mono text-slate-300 truncate max-w-[180px]">{ev.details.device}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
