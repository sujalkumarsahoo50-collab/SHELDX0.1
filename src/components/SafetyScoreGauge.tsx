import React from 'react';

interface SafetyScoreGaugeProps {
  score: number; // 0 to 100
  size?: number;
}

export const SafetyScoreGauge: React.FC<SafetyScoreGaugeProps> = ({ score, size = 180 }) => {
  const normalizedScore = Math.max(0, Math.min(100, score));
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  
  // Arc calculation (270 degree arc)
  const arcLength = circumference * 0.75;
  const strokeDashoffset = arcLength - (arcLength * normalizedScore) / 100;

  const getColor = (s: number) => {
    if (s >= 80) return { stroke: '#10b981', text: 'text-emerald-400', label: 'OPTIMAL SAFETY' };
    if (s >= 60) return { stroke: '#f59e0b', text: 'text-amber-400', label: 'MODERATE RISK' };
    return { stroke: '#f43f5e', text: 'text-rose-400', label: 'ELEVATED THREAT' };
  };

  const status = getColor(normalizedScore);

  return (
    <div className="flex flex-col items-center justify-center relative">
      <svg
        width={size}
        height={size}
        className="transform -rotate-135 drop-shadow-[0_0_15px_rgba(6,182,212,0.2)]"
      >
        {/* Background Arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#1e293b"
          strokeWidth={strokeWidth}
          strokeDasharray={`${arcLength} ${circumference}`}
          strokeLinecap="round"
        />

        {/* Value Arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={status.stroke}
          strokeWidth={strokeWidth}
          strokeDasharray={`${arcLength} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>

      {/* Center Label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center pt-2">
        <span className={`text-4xl font-extrabold font-mono tracking-tight ${status.text}`}>
          {normalizedScore}
        </span>
        <span className="text-[10px] text-slate-400 font-mono tracking-widest uppercase mt-0.5">
          / 100
        </span>
        <span className={`text-[10px] font-bold font-mono uppercase tracking-wider mt-1 px-2 py-0.5 rounded-full border border-slate-800 bg-slate-900 ${status.text}`}>
          {status.label}
        </span>
      </div>
    </div>
  );
};
