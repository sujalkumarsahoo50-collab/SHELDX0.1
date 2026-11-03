import React from 'react';
import { RiskFactorBreakdown } from '../../server/types.js';
import { Calculator, X, HelpCircle, CheckCircle } from 'lucide-react';

interface RiskBreakdownModalProps {
  isOpen: boolean;
  onClose: () => void;
  breakdown: RiskFactorBreakdown;
  finalScore: number;
}

export const RiskBreakdownModal: React.FC<RiskBreakdownModalProps> = ({
  isOpen,
  onClose,
  breakdown,
  finalScore
}) => {
  if (!isOpen || !breakdown) return null;

  const factors = [
    { name: 'URL & Domain Risk', data: breakdown.urlRisk },
    { name: 'Sender Anomaly', data: breakdown.senderAnomaly },
    { name: 'Impersonation Indicators', data: breakdown.impersonation },
    { name: 'Credential / Payment Harvesting', data: breakdown.credentialPaymentRequest },
    { name: 'Login & Location Anomaly', data: breakdown.loginAnomaly },
    { name: 'Urgency & Pressure Language', data: breakdown.urgencyLanguage },
    { name: 'Multi-Signal Correlation Boost', data: breakdown.eventCorrelation },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="glass-panel rounded-2xl border border-slate-800 w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-cyan-950/80 text-cyan-400 border border-cyan-800/50">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">Transparent Risk Score Formula</h3>
              <p className="text-xs text-slate-400">Explainable weighted score decomposition</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Final Formula Summary */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 mb-6 flex items-center justify-between">
          <div>
            <span className="text-xs font-mono text-slate-400 uppercase">Composite Risk Score</span>
            <div className="text-2xl font-bold font-mono text-cyan-400 mt-0.5">
              {finalScore} <span className="text-xs text-slate-500 font-normal">/ 100</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[11px] text-slate-400 font-mono">Weighted Sum = 100%</span>
            <p className="text-xs text-slate-300">Normalized across 7 risk vectors</p>
          </div>
        </div>

        {/* Factor Breakdown List */}
        <div className="space-y-3">
          {factors.map((item, idx) => {
            if (!item.data) return null;
            const percentageWeight = Math.round(item.data.weight * 100);
            return (
              <div key={idx} className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-200">{item.name}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-800 text-cyan-400 rounded-full">
                      Weight: {percentageWeight}%
                    </span>
                  </div>
                  <div className="text-xs font-mono font-bold text-slate-300">
                    Contribution: +{item.data.contribution} pts
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-cyan-500 to-rose-500 h-full rounded-full"
                    style={{ width: `${item.data.score}%` }}
                  />
                </div>

                <p className="text-[11px] text-slate-400 italic">
                  "{item.data.detail}"
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg shadow"
          >
            Close Breakdown
          </button>
        </div>

      </div>
    </div>
  );
};
