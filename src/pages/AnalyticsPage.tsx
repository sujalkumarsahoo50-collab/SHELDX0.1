import React, { useEffect, useState } from 'react';
import { useSecurity } from '../context/SecurityContext';
import { api } from '../services/api';
import { BarChart3, PieChart, ShieldAlert, CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const { events, chains } = useSecurity();
  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    api.getAnalytics().then(res => {
      if (res) setAnalytics(res);
    });
  }, []);

  const totalEvents = events.length;
  const avgRisk = events.length > 0 ? Math.round(events.reduce((a, b) => a + b.riskScore, 0) / events.length) : 0;
  const highRiskCount = events.filter(e => e.riskScore >= 70).length;

  const categories = analytics?.threatCategories || {
    phishing: 2,
    suspicious_url: 1,
    social_engineering: 1,
    account_takeover: 1
  };

  const feedbackCounts = analytics?.feedbackCounts || { correct: 8, falsePositive: 1, missedThreat: 0 };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      
      <div className="border-b border-slate-800 pb-4">
        <h2 className="text-xl font-bold text-slate-100">Analytics & Feedback Intelligence</h2>
        <p className="text-xs text-slate-400">Aggregated threat metrics, category distribution, & accuracy loop</p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">TOTAL EVENTS ANALYZED</span>
          <div className="text-3xl font-extrabold font-mono text-cyan-400">{totalEvents}</div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">CORRELATED ATTACK CHAINS</span>
          <div className="text-3xl font-extrabold font-mono text-purple-400">{chains.length}</div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">AVERAGE RISK SCORE</span>
          <div className="text-3xl font-extrabold font-mono text-amber-400">{avgRisk}<span className="text-xs text-slate-500">/100</span></div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">CRITICAL THREAT EVENTS</span>
          <div className="text-3xl font-extrabold font-mono text-rose-400">{highRiskCount}</div>
        </div>
      </div>

      {/* Charts / Distribution Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Category Breakdown */}
        <div className="glass-panel rounded-2xl border border-slate-800 p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <PieChart className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-slate-100">Threat Category Distribution</h3>
          </div>

          <div className="space-y-3">
            {Object.entries(categories).map(([cat, count]: [string, any]) => {
              const pct = Math.round((count / (totalEvents || 1)) * 100);
              return (
                <div key={cat} className="space-y-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-300 capitalize">{cat.replace('_', ' ')}</span>
                    <span className="text-cyan-400 font-bold">{count} ({pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full" style={{ width: `${Math.max(10, pct)}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* User Feedback Loop Stats */}
        <div className="glass-panel rounded-2xl border border-slate-800 p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <BarChart3 className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-slate-100">Feedback Loop & Accuracy Calibration</h3>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center pt-2">
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
              <div className="text-xl font-bold font-mono text-emerald-400">{feedbackCounts.correct}</div>
              <span className="text-[10px] font-mono text-slate-400">Correct Detections</span>
            </div>

            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
              <AlertCircle className="w-5 h-5 text-amber-400 mx-auto mb-1" />
              <div className="text-xl font-bold font-mono text-amber-400">{feedbackCounts.falsePositive}</div>
              <span className="text-[10px] font-mono text-slate-400">False Positives</span>
            </div>

            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30">
              <HelpCircle className="w-5 h-5 text-rose-400 mx-auto mb-1" />
              <div className="text-xl font-bold font-mono text-rose-400">{feedbackCounts.missedThreat}</div>
              <span className="text-[10px] font-mono text-slate-400">Missed Threats</span>
            </div>
          </div>

          <p className="text-xs text-slate-400 italic pt-2 leading-relaxed">
            User feedback ratings automatically re-calibrate risk score factor weights over time.
          </p>
        </div>

      </div>

    </div>
  );
};
