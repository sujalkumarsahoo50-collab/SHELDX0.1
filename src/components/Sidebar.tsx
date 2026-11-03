import React from 'react';
import { 
  LayoutDashboard, 
  Search, 
  Network, 
  Clock, 
  ShieldCheck, 
  Sparkles, 
  BarChart3, 
  Settings,
  HelpCircle
} from 'lucide-react';
import { useSecurity, NavTab } from '../context/SecurityContext';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, chains } = useSecurity();

  const activeChainCount = chains.filter(c => c.severity === 'HIGH' || c.severity === 'CRITICAL').length;

  const navItems: Array<{ id: NavTab; label: string; icon: React.ReactNode; badge?: number | string }> = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'analyze', label: 'Analyze Event', icon: <Search className="w-4 h-4" /> },
    { 
      id: 'graph', 
      label: 'Attack Graph', 
      icon: <Network className="w-4 h-4" />, 
      badge: activeChainCount > 0 ? activeChainCount : undefined 
    },
    { id: 'timeline', label: 'Security Timeline', icon: <Clock className="w-4 h-4" /> },
    { id: 'privacy', label: 'Privacy Center', icon: <ShieldCheck className="w-4 h-4" /> },
    { id: 'demo', label: 'Demo Scenarios', icon: <Sparkles className="w-4 h-4" />, badge: '5' },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <aside className="w-64 shrink-0 hidden md:block glass-panel border-r border-slate-800/80 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto p-4 custom-scrollbar self-start">
      <div className="space-y-6">
        <div>
          <p className="px-3 text-[10px] font-mono font-semibold uppercase tracking-wider text-slate-500 mb-2">
            Navigation
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-950/80 to-slate-900 text-cyan-300 border border-cyan-700/50 shadow-sm shadow-cyan-950/50 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={isActive ? 'text-cyan-400' : 'text-slate-500'}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded-full ${
                      isActive ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Cyber Threat Guarantee Card */}
        <div className="p-3.5 rounded-xl bg-gradient-to-br from-slate-900 to-cyan-950/40 border border-slate-800/80 text-left">
          <div className="flex items-center gap-2 mb-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-semibold text-slate-200">Defensive Shield</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            ShieldX strictly analyzes threat telemetry & advises safe recovery steps. Zero payload generation.
          </p>
        </div>

        <div className="pt-4 border-t border-slate-800/60 text-[11px] text-slate-500 flex items-center justify-between px-2">
          <span>ShieldX Agent v1.0</span>
          <span className="flex items-center gap-1 text-emerald-400 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Protected
          </span>
        </div>
      </div>
    </aside>
  );
};
