import React, { useState } from 'react';
import { useSecurity } from '../context/SecurityContext';
import { Sparkles, Play, ShieldAlert, CheckCircle2, ArrowRight, Layers, Lock, AlertTriangle, Link as LinkIcon, Smartphone, Mail } from 'lucide-react';

export const DemoModePage: React.FC = () => {
  const { loadScenario, isAnalyzing } = useSecurity();
  const [selectedScenario, setSelectedScenario] = useState<string>('scenario-5');
  const [activeStep, setActiveStep] = useState<number>(0);

  const scenarios = [
    {
      id: 'scenario-5',
      title: 'Scenario 5: Coordinated Multi-Event Attack (Flagship Demo)',
      tag: 'FLAGSHIP DEMO',
      badgeColor: 'bg-cyan-500 text-slate-950 font-bold',
      description: 'Correlates a spoofed bank email containing typosquatted domain link, follow-up 2FA SMS intercept, and unusual international login attempt into 1 coordinated attack graph.',
      eventCount: 4,
      vectorIcons: [<Mail key="1" className="w-4 h-4 text-cyan-400" />, <LinkIcon key="2" className="w-4 h-4 text-amber-400" />, <Smartphone key="3" className="w-4 h-4 text-purple-400" />, <AlertTriangle key="4" className="w-4 h-4 text-rose-400" />]
    },
    {
      id: 'scenario-1',
      title: 'Scenario 1: Fake Bank & Security Lockout Alert',
      tag: 'Phishing',
      badgeColor: 'bg-rose-500/20 text-rose-400 border border-rose-500/40',
      description: 'Urgent email claiming credit card account lockout with typosquatted verification link.',
      eventCount: 1,
      vectorIcons: [<Mail key="1" className="w-4 h-4 text-rose-400" />]
    },
    {
      id: 'scenario-2',
      title: 'Scenario 2: Tech Support Impersonation Scam',
      tag: 'Impersonation',
      badgeColor: 'bg-amber-500/20 text-amber-400 border border-amber-500/40',
      description: 'Fake Microsoft helpdesk SMS instructing user to call unverified 1-800 number or install remote desktop tools.',
      eventCount: 1,
      vectorIcons: [<Smartphone key="1" className="w-4 h-4 text-amber-400" />]
    },
    {
      id: 'scenario-3',
      title: 'Scenario 3: Delivery Parcel Fee Payment SMS',
      tag: 'Scam',
      badgeColor: 'bg-purple-500/20 text-purple-400 border border-purple-500/40',
      description: 'USPS redelivery fee SMS containing deceptive .click link asking for credit card verification.',
      eventCount: 1,
      vectorIcons: [<LinkIcon key="1" className="w-4 h-4 text-purple-400" />]
    },
    {
      id: 'scenario-4',
      title: 'Scenario 4: Account Takeover Sequence',
      tag: 'Account Takeover',
      badgeColor: 'bg-rose-500/20 text-rose-400 border border-rose-500/40',
      description: 'Repeated brute force authentication attempts originating from suspicious proxy IP in Moscow, Russia.',
      eventCount: 2,
      vectorIcons: [<AlertTriangle key="1" className="w-4 h-4 text-rose-400" />]
    }
  ];

  const pipelineSteps = [
    '1. Load Scenarios Telemetry',
    '2. Feature Extraction',
    '3. Deterministic Rule Signals',
    '4. AI Contextual Inference',
    '5. Multi-Signal Graph Correlation',
    '6. Compute Composite Risk Score',
    '7. Synthesize Safe Recommendations'
  ];

  const handleRunDemo = async (scenarioId: string) => {
    setSelectedScenario(scenarioId);
    setActiveStep(1);
    const interval = setInterval(() => {
      setActiveStep(prev => (prev < 7 ? prev + 1 : prev));
    }, 400);

    await loadScenario(scenarioId);
    clearInterval(interval);
    setActiveStep(7);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      
      {/* Top Header */}
      <div className="border-b border-slate-800 pb-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-bold text-slate-100">Hackathon Demo Mode Launcher</h2>
          </div>
          <p className="text-xs text-slate-400">Preloaded synthetic scenarios demonstrating attack chain correlation end-to-end</p>
        </div>
      </div>

      {/* Visual Pipeline Flow Step Progress */}
      <div className="glass-panel rounded-2xl border border-slate-800 p-6 space-y-4">
        <h3 className="text-xs font-mono uppercase text-cyan-400 font-bold">Detection Pipeline Execution Sequence</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-7 gap-2">
          {pipelineSteps.map((step, idx) => {
            const stepNum = idx + 1;
            const isDone = activeStep >= stepNum;
            const isCurrent = activeStep === stepNum;

            return (
              <div
                key={idx}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  isCurrent
                    ? 'bg-cyan-950 border-cyan-400 text-cyan-300 font-bold scale-105 shadow-md shadow-cyan-950'
                    : isDone
                    ? 'bg-slate-900 border-slate-800 text-slate-300 opacity-90'
                    : 'bg-slate-950/60 border-slate-900 text-slate-600'
                }`}
              >
                <div className="flex items-center justify-center gap-1 mb-1">
                  {isDone ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <span className="w-3.5 h-3.5 rounded-full border border-slate-700 text-[9px] font-mono flex items-center justify-center">
                      {stepNum}
                    </span>
                  )}
                </div>
                <p className="text-[10px] leading-tight font-mono truncate">{step.split(' ')[1]}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Scenarios Grid */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-100 font-mono uppercase">Select Scenario to Execute</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {scenarios.map((scen) => (
            <div
              key={scen.id}
              className={`glass-panel rounded-2xl border p-6 flex flex-col justify-between transition-all ${
                selectedScenario === scen.id
                  ? 'bg-slate-900/90 border-cyan-500 shadow-xl shadow-cyan-950'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className={`px-2.5 py-0.5 text-[10px] font-mono rounded-full ${scen.badgeColor}`}>
                    {scen.tag}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {scen.vectorIcons}
                  </div>
                </div>

                <h4 className="text-sm font-bold text-slate-100">{scen.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{scen.description}</p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 font-mono">{scen.eventCount} Connected Event(s)</span>
                
                <button
                  onClick={() => handleRunDemo(scen.id)}
                  disabled={isAnalyzing}
                  className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-xl shadow transition-all"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Execute Scenario</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
