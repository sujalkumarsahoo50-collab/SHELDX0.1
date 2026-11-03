import React from 'react';
import { Shield, Sparkles, ArrowRight, Lock, Eye, Zap, Layers, Network, Activity, CheckCircle2 } from 'lucide-react';
import { useSecurity } from '../context/SecurityContext';

export const LandingPage: React.FC = () => {
  const { setActiveTab } = useSecurity();

  return (
    <div className="space-y-16 pb-12 animate-fade-in">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-8 rounded-3xl bg-radial-gradient border border-slate-800/80 p-8 lg:p-12 text-center">
        
        {/* Glow Radar Effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto space-y-6 relative z-10">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-700/60 text-cyan-300 text-xs font-mono font-medium shadow-lg">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
            <span>ShieldX Coordinated Threat Intelligence</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyan-300 bg-clip-text text-transparent leading-tight">
            Understand the Attack Before It Becomes a Breach.
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            ShieldX connects messages, links, identity signals, and login events to detect coordinated digital threats and explain the safest next action.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={() => setActiveTab('analyze')}
              className="flex items-center gap-2.5 px-6 py-3.5 text-sm font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-400 hover:from-cyan-300 hover:to-blue-300 rounded-xl shadow-xl shadow-cyan-500/25 transition-all scale-105 hover:scale-108"
            >
              <Shield className="w-4 h-4 fill-current" />
              <span>Analyze a Threat</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveTab('demo')}
              className="flex items-center gap-2 px-6 py-3.5 text-sm font-bold text-cyan-300 bg-slate-900 hover:bg-slate-800 border border-cyan-800/80 rounded-xl transition-all shadow-lg"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Try Demo Scenarios</span>
            </button>
          </div>

          {/* Visual Flow Diagram Preview (Message -> Link -> Identity -> Login -> AI Analysis) */}
          <div className="pt-8">
            <p className="text-xs font-mono uppercase text-slate-500 mb-4">Multi-Signal Event Correlation Pipeline</p>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 max-w-3xl mx-auto">
              
              <div className="glass-panel p-3 rounded-xl border border-slate-800 text-center space-y-1">
                <span className="text-[10px] font-mono text-cyan-400 block font-bold">1. MESSAGE</span>
                <span className="text-xs font-semibold text-slate-200">SMS / Email</span>
              </div>

              <div className="glass-panel p-3 rounded-xl border border-slate-800 text-center space-y-1">
                <span className="text-[10px] font-mono text-amber-400 block font-bold">2. LINK</span>
                <span className="text-xs font-semibold text-slate-200">Deceptive URL</span>
              </div>

              <div className="glass-panel p-3 rounded-xl border border-slate-800 text-center space-y-1">
                <span className="text-[10px] font-mono text-purple-400 block font-bold">3. IDENTITY</span>
                <span className="text-xs font-semibold text-slate-200">Impersonation</span>
              </div>

              <div className="glass-panel p-3 rounded-xl border border-slate-800 text-center space-y-1">
                <span className="text-[10px] font-mono text-rose-400 block font-bold">4. LOGIN</span>
                <span className="text-xs font-semibold text-slate-200">Session Anomaly</span>
              </div>

              <div className="col-span-2 sm:col-span-1 glass-panel p-3 rounded-xl border border-cyan-500/40 bg-cyan-950/40 text-center space-y-1 shadow-md shadow-cyan-900/30">
                <span className="text-[10px] font-mono text-emerald-400 block font-bold">5. AI RISK</span>
                <span className="text-xs font-bold text-white">Attack Chain</span>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* Core Problem vs ShieldX Solution Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* The Problem */}
        <div className="glass-panel rounded-2xl border border-slate-800 p-6 space-y-4">
          <div className="inline-flex p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/30">
            <Eye className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-100">The Problem: Isolated Security Checks Miss Coordinated Scams</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Existing security products analyze one signal at a time — evaluating a link or an email address in isolation. Cybercriminals exploit this blindspot by orchestrating multi-stage attacks across SMS, spoofed domains, and credential harvesting.
          </p>
          <ul className="space-y-2 text-xs text-slate-400">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
              <span>Isolated links appear harmless until linked to urgent SMS triggers.</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
              <span>Login attempts look normal without cross-referencing phishing clicks.</span>
            </li>
          </ul>
        </div>

        {/* ShieldX Solution */}
        <div className="glass-panel rounded-2xl border border-cyan-900/60 p-6 space-y-4 bg-gradient-to-br from-slate-900 to-cyan-950/30">
          <div className="inline-flex p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            <Network className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-100">The Core USP: Attack Chain Correlation & Explainable Defense</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            ShieldX correlates isolated events into a visual **Digital Risk Graph**, computing transparent risk scores and delivering practical, defensive safe recovery checklists.
          </p>
          <ul className="space-y-2 text-xs text-cyan-300 font-medium">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Connects email, URL, identity, and login anomalies into 1 graph.</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Transparent 0-100 score breakdown explaining WHY flagged.</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>100% Privacy-First zero raw message retention architecture.</span>
            </li>
          </ul>
        </div>

      </section>

      {/* Flagship Scenarios Quick Access Banner */}
      <section className="glass-panel rounded-2xl border border-slate-800 p-8 text-center space-y-4">
        <h3 className="text-xl font-extrabold text-slate-100">Ready to Test ShieldX Live?</h3>
        <p className="text-xs text-slate-400 max-w-xl mx-auto">
          Explore the preloaded multi-stage threat scenarios designed for instant hackathon evaluation.
        </p>
        <button
          onClick={() => setActiveTab('demo')}
          className="inline-flex items-center gap-2 px-6 py-3 text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-xl shadow-lg transition-all"
        >
          <Sparkles className="w-4 h-4" />
          <span>Launch Demo Scenarios</span>
        </button>
      </section>

    </div>
  );
};
