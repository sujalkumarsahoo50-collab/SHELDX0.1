import { RiskFactorBreakdown, ThreatSeverity } from '../types.js';

export interface CustomRiskWeights {
  senderAnomalyWeight?: number;
  urlRiskWeight?: number;
  impersonationWeight?: number;
  urgencyWeight?: number;
  credPaymentWeight?: number;
  loginAnomalyWeight?: number;
  correlationWeight?: number;
}

const DEFAULT_WEIGHTS = {
  senderAnomaly: 0.15,
  urlRisk: 0.20,
  impersonation: 0.15,
  urgencyLanguage: 0.10,
  credentialPaymentRequest: 0.15,
  loginAnomaly: 0.15,
  eventCorrelation: 0.10,
};

export function calculateRiskScore(
  features: {
    senderAnomaly: { score: number; detail: string };
    urlRisk: { score: number; detail: string };
    impersonation: { score: number; detail: string };
    urgencyLanguage: { score: number; detail: string };
    credentialPaymentRequest: { score: number; detail: string };
    loginAnomaly: { score: number; detail: string };
  },
  correlationScore: { score: number; detail: string },
  customWeights?: CustomRiskWeights
): { score: number; severity: ThreatSeverity; breakdown: RiskFactorBreakdown } {
  const w = {
    sender: customWeights?.senderAnomalyWeight ?? DEFAULT_WEIGHTS.senderAnomaly,
    url: customWeights?.urlRiskWeight ?? DEFAULT_WEIGHTS.urlRisk,
    imp: customWeights?.impersonationWeight ?? DEFAULT_WEIGHTS.impersonation,
    urg: customWeights?.urgencyWeight ?? DEFAULT_WEIGHTS.urgencyLanguage,
    cred: customWeights?.credPaymentWeight ?? DEFAULT_WEIGHTS.credentialPaymentRequest,
    log: customWeights?.loginAnomalyWeight ?? DEFAULT_WEIGHTS.loginAnomaly,
    corr: customWeights?.correlationWeight ?? DEFAULT_WEIGHTS.eventCorrelation,
  };

  const senderContrib = features.senderAnomaly.score * w.sender;
  const urlContrib = features.urlRisk.score * w.url;
  const impContrib = features.impersonation.score * w.imp;
  const urgContrib = features.urgencyLanguage.score * w.urg;
  const credContrib = features.credentialPaymentRequest.score * w.cred;
  const logContrib = features.loginAnomaly.score * w.log;
  const corrContrib = correlationScore.score * w.corr;

  const rawScore = senderContrib + urlContrib + impContrib + urgContrib + credContrib + logContrib + corrContrib;
  const finalScore = Math.min(100, Math.max(0, Math.round(rawScore)));

  let severity: ThreatSeverity = 'LOW';
  if (finalScore >= 80) severity = 'CRITICAL';
  else if (finalScore >= 60) severity = 'HIGH';
  else if (finalScore >= 35) severity = 'MEDIUM';

  const breakdown: RiskFactorBreakdown = {
    senderAnomaly: {
      score: features.senderAnomaly.score,
      weight: w.sender,
      contribution: Math.round(senderContrib),
      detail: features.senderAnomaly.detail,
    },
    urlRisk: {
      score: features.urlRisk.score,
      weight: w.url,
      contribution: Math.round(urlContrib),
      detail: features.urlRisk.detail,
    },
    impersonation: {
      score: features.impersonation.score,
      weight: w.imp,
      contribution: Math.round(impContrib),
      detail: features.impersonation.detail,
    },
    urgencyLanguage: {
      score: features.urgencyLanguage.score,
      weight: w.urg,
      contribution: Math.round(urgContrib),
      detail: features.urgencyLanguage.detail,
    },
    credentialPaymentRequest: {
      score: features.credentialPaymentRequest.score,
      weight: w.cred,
      contribution: Math.round(credContrib),
      detail: features.credentialPaymentRequest.detail,
    },
    loginAnomaly: {
      score: features.loginAnomaly.score,
      weight: w.log,
      contribution: Math.round(logContrib),
      detail: features.loginAnomaly.detail,
    },
    eventCorrelation: {
      score: correlationScore.score,
      weight: w.corr,
      contribution: Math.round(corrContrib),
      detail: correlationScore.detail,
    },
  };

  return { score: finalScore, severity, breakdown };
}
