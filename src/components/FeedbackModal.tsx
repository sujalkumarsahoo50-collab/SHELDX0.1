import React, { useState } from 'react';
import { ThumbsUp, AlertCircle, HelpCircle, Check, X } from 'lucide-react';
import { useSecurity } from '../context/SecurityContext';
import { api } from '../services/api';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  analysisId: string;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose, analysisId }) => {
  const { showNotification } = useSecurity();
  const [rating, setRating] = useState<'correct' | 'false_positive' | 'missed_threat'>('correct');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await api.submitFeedback(analysisId, rating, comment);
    setIsSubmitting(false);
    showNotification('success', 'Feedback recorded into continuous learning pipeline.');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="glass-panel rounded-2xl border border-slate-800 w-full max-w-md p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <h3 className="text-sm font-bold text-slate-100">Rate Analysis Accuracy</h3>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-200">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setRating('correct')}
              className={`p-3 rounded-xl border text-center flex flex-col items-center gap-1.5 transition-all ${
                rating === 'correct'
                  ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
              }`}
            >
              <ThumbsUp className="w-4 h-4" />
              <span className="text-[11px] font-bold">Correct</span>
            </button>

            <button
              type="button"
              onClick={() => setRating('false_positive')}
              className={`p-3 rounded-xl border text-center flex flex-col items-center gap-1.5 transition-all ${
                rating === 'false_positive'
                  ? 'bg-amber-500/10 border-amber-500 text-amber-400'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
              }`}
            >
              <AlertCircle className="w-4 h-4" />
              <span className="text-[11px] font-bold">False Positive</span>
            </button>

            <button
              type="button"
              onClick={() => setRating('missed_threat')}
              className={`p-3 rounded-xl border text-center flex flex-col items-center gap-1.5 transition-all ${
                rating === 'missed_threat'
                  ? 'bg-rose-500/10 border-rose-500 text-rose-400'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span className="text-[11px] font-bold">Missed Threat</span>
            </button>
          </div>

          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">Additional Context (Optional)</label>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Why was this analysis accurate or inaccurate?"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-1.5 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg shadow"
            >
              {isSubmitting ? 'Saving...' : 'Submit Feedback'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
