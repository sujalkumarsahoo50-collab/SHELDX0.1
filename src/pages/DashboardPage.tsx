import React from 'react';
import { SafetyScoreGauge } from '../components/SafetyScoreGauge';
import { AttackChainGraph } from '../components/AttackChainGraph';
import { SecurityTimelineView } from '../components/SecurityTimelineView';
import { SafeActionChecklist } from '../components/SafeActionChecklist';
import { useSecurity } from '../context/SecurityContext';
import { ShieldAlert, AlertTriangle, Link as LinkIcon, Lock, Activity, TrendingUp, Clock, ChevronRight, PlusCircle } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { dashboardData, events, chains, setActiveTab } = useSecurity();

  const digitalSafetyScore = dashboardData?.digitalSafetyScore ?? 78;
  const activeThreats = dashboardData?.activeThreats ?? 2;
  const suspiciousLinks = dashboardData?.suspiciousLinksCount ?? 4;
  const loginAnomalies = dashboardData?.loginAnomaliesCount ?? 1;
  const recentEvents = events.slice(0, 5);
  const featuredChain = chains[0];

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100">Security Operations Dashboard</h2>
          <p className="text-xs text-slate-400">Real-time threat monitoring & event correlation agent</p>
        </div>

        <button
          onClick={() => setActiveTab('analyze')}
          className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-xl shadow-lg transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Submit Event for AI Analysis</span>
        </button>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Card 1: Digital Safety Score */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase text-slate-400 block font-bold">DIGITAL SAFETY</span>
            <div className="text-3xl font-extrabold font-mono text-cyan-400 mt-1">
              {digitalSafetyScore}<span className="text-xs text-slate-500 font-normal">/100</span>
            </div>
            <span className="text-[10px] text-emerald-400 flex items-center gap-1 mt-1 font-mono">
              <TrendingUp className="w-3 h-3" /> Optimal Protection
            </span>
          </div>
          <SafetyScoreGauge score={digitalSafetyScore} size={70} />
        </div>

        {/* Card 2: Active Threats */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">ACTIVE THREATS</span>
            <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/30">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold font-mono text-rose-400">{activeThreats}</div>
            <p className="text-[11px] text-slate-400 mt-0.5">Requiring active remediation</p>
          </div>
        </div>

        {/* Card 3: Suspicious Links */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">SUSPICIOUS LINKS</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <LinkIcon className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold font-mono text-amber-400">{suspiciousLinks}</div>
            <p className="text-[11px] text-slate-400 mt-0.5">Flagged domain redirections</p>
          </div>
        </div>

        {/* Card 4: Login Anomalies */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">LOGIN ANOMALIES</span>
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/30">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold font-mono text-purple-400">{loginAnomalies}</div>
            <p className="text-[11px] text-slate-400 mt-0.5">Unfamiliar location/device</p>
          </div>
        </div>

      </div>

      {/* Featured Attack Chain Preview Section */}
      {featuredChain && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>Correlated Attack Chain Preview</span>
            </h3>
            <button
              onClick={() => setActiveTab('graph')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-mono flex items-center gap-1"
            >
              <span>Full Interactive Graph</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <AttackChainGraph chain={featuredChain} />
        </div>
      )}

      {/* Grid Row: Recent Security Events Feed & Safe Action Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Security Events Table Card */}
        <div className="glass-panel rounded-2xl border border-slate-800 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-slate-100">Recent Security Events</h3>
              </div>
              <button
                onClick={() => setActiveTab('timeline')}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-mono"
              >
                View Timeline
              </button>
            </div>

            <div className="space-y-3">
              {recentEvents.map((ev) => (
                <div
                  key={ev.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center gap-3 truncate">
                    <span className="text-xs font-mono text-slate-400 shrink-0">
                      {new Date(ev.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <div className="truncate">
                      <p className="text-xs font-semibold text-slate-200 truncate">{ev.title}</p>
                      <p className="text-[10px] text-slate-500 font-mono truncate">
                        {ev.details.sender || ev.details.url || ev.details.location || ev.type}
                      </p>
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded-full border shrink-0 ${
                    ev.riskScore >= 75 ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' :
                    ev.riskScore >= 45 ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
                    'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  }`}>
                    {ev.riskScore}/100
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Safe Actions Card */}
        <SafeActionChecklist actions={featuredChain?.nodes?.[0] ? [
          { id: 'rec-1', title: 'Do Not Click Suspicious Links', action: 'Avoid clicking links in urgent bank alert messages.', priority: 'critical', category: 'Immediate Defense', completed: false },
          { id: 'rec-2', title: 'Verify Identity Independently', action: 'Use official institution website or app.', priority: 'high', category: 'Identity Verification', completed: false },
          { id: 'rec-3', title: 'Terminate Remote Sessions', action: 'Log out active sessions from unknown IP locations.', priority: 'critical', category: 'Session Control', completed: false }
        ] : []} />

      </div>

    </div>
  );
};
