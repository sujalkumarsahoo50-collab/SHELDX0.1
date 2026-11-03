import React from 'react';
import { Shield, Lock, Play, Activity, User, LogOut, Sparkles } from 'lucide-react';
import { useSecurity, NavTab } from '../context/SecurityContext';

export const Navbar: React.FC = () => {
  const { activeTab, setActiveTab, user, dashboardData, setIsAuthModalOpen, logout } = useSecurity();

  const safetyScore = dashboardData?.digitalSafetyScore ?? 84;
  const threatLevel = dashboardData?.overallThreatLevel ?? 'LOW';

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
    if (score >= 60) return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
    return 'text-rose-400 border-rose-500/30 bg-rose-500/10';
  };

  return (
    <header className="sticky top-0 z-40 w-full h-16 glass-panel border-b border-slate-800/80 px-4 lg:px-8 backdrop-blur-md flex items-center">
      <div className="max-w-7xl w-full mx-auto flex items-center justify-between">
        
        {/* Brand Logo */}
        <div 
          onClick={() => setActiveTab('landing')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <Shield className="w-5 h-5 text-white stroke-[2.5]" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyan-300 bg-clip-text text-transparent">
                ShieldX
              </span>
              <span className="px-1.5 py-0.5 text-[10px] font-mono font-semibold uppercase tracking-wider bg-cyan-950 text-cyan-400 border border-cyan-800/50 rounded">
                AI Agent
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">Privacy-First Digital Threat Agent</p>
          </div>
        </div>

        {/* Center Live Safety Status (Visible if logged in or viewing app) */}
        <div className="hidden md:flex items-center gap-3 bg-slate-900/80 border border-slate-800 rounded-full px-4 py-1.5">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span className="text-xs text-slate-400 font-medium">Digital Safety:</span>
            <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full border ${getScoreColor(safetyScore)}`}>
              {safetyScore}/100
            </span>
          </div>
          <div className="w-px h-3 bg-slate-800" />
          <div className="flex items-center gap-1.5 text-xs font-mono">
            <span className="text-slate-500">Threat Level:</span>
            <span className={`font-bold ${
              threatLevel === 'CRITICAL' ? 'text-rose-400' :
              threatLevel === 'HIGH' ? 'text-amber-400' : 'text-emerald-400'
            }`}>
              {threatLevel}
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          {/* Quick Demo Mode Launch */}
          <button
            onClick={() => setActiveTab('demo')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              activeTab === 'demo'
                ? 'bg-cyan-500 text-slate-950 font-semibold shadow-lg shadow-cyan-500/25'
                : 'bg-cyan-950/60 text-cyan-300 border border-cyan-700/50 hover:bg-cyan-900/60'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Demo Scenarios</span>
          </button>

          {/* Analyze Event Button */}
          <button
            onClick={() => setActiveTab('analyze')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg hover:from-blue-500 hover:to-cyan-500 shadow-md shadow-cyan-900/30 transition-all"
          >
            <Shield className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Analyze Threat</span>
          </button>

          {/* Privacy Center Shortcut */}
          <button
            onClick={() => setActiveTab('privacy')}
            title="Privacy Center"
            className="p-2 text-slate-400 hover:text-cyan-400 bg-slate-900/60 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors"
          >
            <Lock className="w-4 h-4" />
          </button>

          {/* Auth State */}
          {user ? (
            <div className="flex items-center gap-2 ml-1 pl-2 border-l border-slate-800">
              <div 
                onClick={() => setActiveTab('dashboard')}
                className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 cursor-pointer"
              >
                <div className="w-6 h-6 rounded-full bg-cyan-900/60 text-cyan-300 flex items-center justify-center text-xs font-bold">
                  {user.name.charAt(0)}
                </div>
                <span className="text-xs font-medium text-slate-300 hidden lg:inline max-w-[100px] truncate">
                  {user.name}
                </span>
              </div>
              <button
                onClick={logout}
                title="Sign Out"
                className="p-1.5 text-slate-400 hover:text-rose-400 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors"
            >
              <User className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}
        </div>

      </div>
    </header>
  );
};
