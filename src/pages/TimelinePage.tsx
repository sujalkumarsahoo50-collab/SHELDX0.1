import React from 'react';
import { useSecurity } from '../context/SecurityContext';
import { SecurityTimelineView } from '../components/SecurityTimelineView';

export const TimelinePage: React.FC = () => {
  const { events } = useSecurity();

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="border-b border-slate-800 pb-4">
        <h2 className="text-xl font-bold text-slate-100">Security Event Timeline</h2>
        <p className="text-xs text-slate-400">Chronological telemetry audit of all recorded security events</p>
      </div>

      <SecurityTimelineView events={events} />
    </div>
  );
};
