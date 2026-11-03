import React, { useState } from 'react';
import { useSecurity } from '../context/SecurityContext';
import { AttackChainGraph } from '../components/AttackChainGraph';
import { SafeActionChecklist } from '../components/SafeActionChecklist';
import { RiskBreakdownModal } from '../components/RiskBreakdownModal';
import { FeedbackModal } from '../components/FeedbackModal';
import { 
  ShieldAlert, 
  Search, 
  Mail, 
  Smartphone, 
  Link as LinkIcon, 
  AlertTriangle, 
  HelpCircle, 
  Calculator, 
  ThumbsUp, 
  RotateCcw,
  Sparkles,
  Layers,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { EventType } from '../../server/types.js';

export const AnalyzeEventPage: React.FC = () => {
  const { analyzeInput, activeAnalysis, isAnalyzing, setActiveTab } = useSecurity();

  const [activeInputTab, setActiveInputTab] = useState<EventType | 'multi'>('message');

  // Input States
  const [messageText, setMessageText] = useState('');
  const [senderPhone, setSenderPhone] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailSender, setEmailSender] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [targetUrl, setTargetUrl] = useState('');
  const [location, setLocation] = useState('Lagos, Nigeria');
  const [device, setDevice] = useState('Firefox 118 on Linux x86_64');
  const [ipAddress, setIpAddress] = useState('197.210.64.12');
  const [requestDetails, setRequestDetails] = useState('');

  // Modals state
  const [isBreakdownOpen, setIsBreakdownOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  // Prefill Helpers
  const prefillSample = (type: string) => {
    if (type === 'phishing_email') {
      setActiveInputTab('email');
      setEmailSender('security-alert@verify-secure-bank.com');
      setEmailSubject('Urgent Account Lockout: Verify Credentials Immediately');
      setEmailBody('Your online bank account has been restricted due to suspicious activity. Verify identity within 15 mins at http://verify-secure-bank.com-login-portal.xyz/auth/verify or face permanent suspension.');
    } else if (type === 'sms_scam') {
      setActiveInputTab('message');
      setSenderPhone('+1-888-555-0199');
      setMessageText('USPS Parcel Notice: Package delivery failed due to incomplete address. Pay \$1.99 redelivery fee at http://usps-redelivery-address-confirm.click within 12 hours.');
    } else if (type === 'suspicious_url') {
      setActiveInputTab('url');
      setTargetUrl('http://paypal-security-verification-portal.xyz/auth/login');
    } else if (type === 'login_anomaly') {
      setActiveInputTab('login');
      setLocation('Moscow, Russia');
      setDevice('Headless Chrome / Python Automated Bot');
      setIpAddress('185.220.101.4');
    }
  };

  const handleRunAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();

    if (activeInputTab === 'multi') {
      const batchEvents = [
        {
          type: 'email',
          sender: emailSender || 'security-alert@verify-secure-bank.com',
          subject: emailSubject || 'Urgent Account Lockout',
          rawText: emailBody || 'Verify identity immediately.',
          url: targetUrl || 'http://verify-secure-bank.com-login-portal.xyz/auth/verify'
        },
        {
          type: 'url',
          url: targetUrl || 'http://verify-secure-bank.com-login-portal.xyz/auth/verify'
        },
        {
          type: 'message',
          sender: senderPhone || '+1-888-555-0199',
          rawText: messageText || 'Your 2FA OTP is 984021. Bank agent will call you to confirm.'
        },
        {
          type: 'login',
          location,
          device,
          ipAddress
        }
      ];
      await analyzeInput({ events: batchEvents });
      return;
    }

    let payload: any = { type: activeInputTab };
    if (activeInputTab === 'message') {
      payload.sender = senderPhone;
      payload.rawText = messageText;
    } else if (activeInputTab === 'email') {
      payload.sender = emailSender;
      payload.subject = emailSubject;
      payload.rawText = emailBody;
    } else if (activeInputTab === 'url') {
      payload.url = targetUrl;
    } else if (activeInputTab === 'login') {
      payload.location = location;
      payload.device = device;
      payload.ipAddress = ipAddress;
    } else if (activeInputTab === 'suspicious_request') {
      payload.rawText = requestDetails;
    }

    await analyzeInput(payload);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100">Analyze Security Event</h2>
          <p className="text-xs text-slate-400">Run modular feature extraction & correlation engine</p>
        </div>

        {/* Quick Sample Prefills */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <span className="text-slate-500">Quick Samples:</span>
          <button
            onClick={() => prefillSample('phishing_email')}
            className="px-2.5 py-1 rounded bg-slate-900 text-cyan-400 border border-slate-800 hover:border-cyan-500"
          >
            Bank Email
          </button>
          <button
            onClick={() => prefillSample('sms_scam')}
            className="px-2.5 py-1 rounded bg-slate-900 text-amber-400 border border-slate-800 hover:border-amber-500"
          >
            USPS SMS
          </button>
          <button
            onClick={() => prefillSample('suspicious_url')}
            className="px-2.5 py-1 rounded bg-slate-900 text-purple-400 border border-slate-800 hover:border-purple-500"
          >
            Phish URL
          </button>
          <button
            onClick={() => prefillSample('login_anomaly')}
            className="px-2.5 py-1 rounded bg-slate-900 text-rose-400 border border-slate-800 hover:border-rose-500"
          >
            Login Anomaly
          </button>
        </div>
      </div>

      {/* Input Selection Tabs */}
      <div className="glass-panel rounded-2xl border border-slate-800 p-6 space-y-6">
        
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-4">
          {[
            { id: 'message', label: 'Message', icon: <Smartphone className="w-4 h-4" /> },
            { id: 'email', label: 'Email', icon: <Mail className="w-4 h-4" /> },
            { id: 'url', label: 'URL', icon: <LinkIcon className="w-4 h-4" /> },
            { id: 'login', label: 'Login Event', icon: <AlertTriangle className="w-4 h-4" /> },
            { id: 'suspicious_request', label: 'Suspicious Request', icon: <HelpCircle className="w-4 h-4" /> },
            { id: 'multi', label: 'Coordinated Multi-Event', icon: <Layers className="w-4 h-4 text-cyan-400" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveInputTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeInputTab === tab.id
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                  : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Form Inputs based on active tab */}
        <form onSubmit={handleRunAnalysis} className="space-y-4">
          
          {activeInputTab === 'message' && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-mono uppercase text-slate-400 mb-1 block">Sender Address / Phone</label>
                <input
                  type="text"
                  value={senderPhone}
                  onChange={(e) => setSenderPhone(e.target.value)}
                  placeholder="e.g. +1-888-555-0199 or support-verify@chat-sec.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>
              <div>
                <label className="text-xs font-mono uppercase text-slate-400 mb-1 block">SMS / Chat Message Text</label>
                <textarea
                  rows={4}
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Paste suspicious SMS or chat message content..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          )}

          {activeInputTab === 'email' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-mono uppercase text-slate-400 mb-1 block">Sender Email Address</label>
                  <input
                    type="email"
                    value={emailSender}
                    onChange={(e) => setEmailSender(e.target.value)}
                    placeholder="security-alert@verify-secure-bank.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono uppercase text-slate-400 mb-1 block">Subject Line</label>
                  <input
                    type="text"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    placeholder="Urgent: Account Lockout Warning"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-mono uppercase text-slate-400 mb-1 block">Email Body Content</label>
                <textarea
                  rows={4}
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  placeholder="Paste full email body or raw header snippet..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          )}

          {activeInputTab === 'url' && (
            <div>
              <label className="text-xs font-mono uppercase text-slate-400 mb-1 block">Target Destination URL</label>
              <input
                type="url"
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                placeholder="http://verify-secure-bank.com-login-portal.xyz/auth/verify"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>
          )}

          {activeInputTab === 'login' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-mono uppercase text-slate-400 mb-1 block">Login Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Lagos, Nigeria"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>
              <div>
                <label className="text-xs font-mono uppercase text-slate-400 mb-1 block">Device Fingerprint</label>
                <input
                  type="text"
                  value={device}
                  onChange={(e) => setDevice(e.target.value)}
                  placeholder="Firefox 118 on Linux"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>
              <div>
                <label className="text-xs font-mono uppercase text-slate-400 mb-1 block">IP Address Telemetry</label>
                <input
                  type="text"
                  value={ipAddress}
                  onChange={(e) => setIpAddress(e.target.value)}
                  placeholder="197.210.64.12"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>
            </div>
          )}

          {activeInputTab === 'suspicious_request' && (
            <div>
              <label className="text-xs font-mono uppercase text-slate-400 mb-1 block">Request Details</label>
              <textarea
                rows={4}
                value={requestDetails}
                onChange={(e) => setRequestDetails(e.target.value)}
                placeholder="Describe request (e.g. gift card purchase request, wire transfer urgency, password reset prompt)..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
              />
            </div>
          )}

          {activeInputTab === 'multi' && (
            <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-800/50 space-y-2 text-xs">
              <p className="font-semibold text-cyan-300">Coordinated Attack Vector Batch Input</p>
              <p className="text-slate-300">
                Will analyze interconnected SMS, Bank Email, Typosquatted Domain, and Login Anomaly together into one attack chain graph.
              </p>
            </div>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
            <span className="text-[11px] text-slate-500 flex items-center gap-1 font-mono">
              <Lock className="w-3.5 h-3.5 text-emerald-400" /> Local Anonymization & Data Minimization Active
            </span>

            <button
              type="submit"
              disabled={isAnalyzing}
              className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-400 hover:from-cyan-300 hover:to-blue-300 rounded-xl shadow-lg transition-all"
            >
              {isAnalyzing ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Processing AI Correlation...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Analyze Security Threat</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>

      {/* ANALYSIS RESULT REPORT SECTION */}
      {activeAnalysis && (
        <div className="space-y-8 animate-fade-in border-t border-slate-800 pt-6">
          
          {/* Result Banner Header */}
          <div className="glass-panel rounded-2xl border border-slate-800 p-6 flex flex-wrap items-center justify-between gap-6 bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/40">
            <div>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 text-xs font-mono font-bold rounded-full border ${
                  activeAnalysis.riskScore >= 75 ? 'bg-rose-500/20 text-rose-400 border-rose-500/40' :
                  activeAnalysis.riskScore >= 45 ? 'bg-amber-500/20 text-amber-400 border-amber-500/40' :
                  'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                }`}>
                  {activeAnalysis.severity} RISK ({activeAnalysis.riskScore}/100)
                </span>
                <span className="text-xs font-mono text-cyan-400 font-semibold">
                  Confidence: {Math.round(activeAnalysis.confidence * 100)}%
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-100 capitalize mt-2">
                Threat Classification: {activeAnalysis.threatType.replace('_', ' ')}
              </h3>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl">
                {activeAnalysis.explanation.summary}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsBreakdownOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-mono font-semibold text-cyan-300 bg-slate-900 border border-slate-800 hover:border-cyan-500 rounded-xl transition-all"
              >
                <Calculator className="w-4 h-4" />
                <span>Score Breakdown</span>
              </button>
              <button
                onClick={() => setIsFeedbackOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-mono font-semibold text-slate-300 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl transition-all"
              >
                <ThumbsUp className="w-4 h-4" />
                <span>Rate Detection</span>
              </button>
            </div>
          </div>

          {/* Explainable AI Reasoning */}
          <div className="glass-panel rounded-2xl border border-slate-800 p-6 space-y-4">
            <h4 className="text-sm font-bold text-slate-100 uppercase font-mono text-cyan-400">WHY THIS WAS FLAGGED</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeAnalysis.explanation.keyPoints.map((pt, idx) => (
                <div key={idx} className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-cyan-950 text-cyan-400 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <p className="text-xs text-slate-200 leading-relaxed">{pt}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Attack Chain Graph */}
          {activeAnalysis.attackChain && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>Correlated Attack Chain Graph</span>
              </h4>
              <AttackChainGraph chain={activeAnalysis.attackChain} />
            </div>
          )}

          {/* Safe Response Action Checklist */}
          <SafeActionChecklist actions={activeAnalysis.recommendedActions} />

        </div>
      )}

      {/* Modals */}
      {activeAnalysis?.breakdown && (
        <RiskBreakdownModal
          isOpen={isBreakdownOpen}
          onClose={() => setIsBreakdownOpen(false)}
          breakdown={activeAnalysis.breakdown}
          finalScore={activeAnalysis.riskScore}
        />
      )}

      {activeAnalysis && (
        <FeedbackModal
          isOpen={isFeedbackOpen}
          onClose={() => setIsFeedbackOpen(false)}
          analysisId={activeAnalysis.id}
        />
      )}

    </div>
  );
};
