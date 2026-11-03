export type EventType = 'message' | 'email' | 'url' | 'login' | 'suspicious_request';

export type ThreatCategory = 
  | 'phishing'
  | 'impersonation'
  | 'scam'
  | 'social_engineering'
  | 'suspicious_url'
  | 'account_takeover'
  | 'credential_harvesting'
  | 'unusual_login'
  | 'fake_support'
  | 'payment_fraud'
  | 'urgency_manipulation'
  | 'coordinated_attack';

export type ThreatSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface SecurityEvent {
  id: string;
  userId: string;
  type: EventType;
  timestamp: string; // ISO string
  rawContent?: string;
  title: string;
  details: {
    sender?: string;
    recipient?: string;
    url?: string;
    subject?: string;
    messageText?: string;
    location?: string;
    device?: string;
    ipAddress?: string;
    ipReputation?: string;
    status?: 'success' | 'failed' | 'flagged';
    previousLocation?: string;
    previousDevice?: string;
    requestAmount?: string;
    urgencyLevel?: 'low' | 'medium' | 'high';
  };
  riskScore: number;
  threatType: ThreatCategory;
  chainId?: string;
  status: 'active' | 'mitigated' | 'dismissed';
}

export interface AttackNode {
  id: string;
  eventId?: string;
  type: string;
  label: string;
  subtitle?: string;
  riskScore: number;
  timestamp: string;
  details: Record<string, any>;
  isSuspicious: boolean;
}

export interface AttackEdge {
  id: string;
  source: string;
  target: string;
  relation: string;
  isThreatPath: boolean;
}

export interface AttackChain {
  id: string;
  title: string;
  riskScore: number;
  severity: ThreatSeverity;
  threatTypes: ThreatCategory[];
  eventIds: string[];
  nodes: AttackNode[];
  edges: AttackEdge[];
  summary: string;
  createdAt: string;
  updatedAt: string;
}

export interface RiskFactorBreakdown {
  senderAnomaly: { score: number; weight: number; contribution: number; detail: string };
  urlRisk: { score: number; weight: number; contribution: number; detail: string };
  impersonation: { score: number; weight: number; contribution: number; detail: string };
  urgencyLanguage: { score: number; weight: number; contribution: number; detail: string };
  credentialPaymentRequest: { score: number; weight: number; contribution: number; detail: string };
  loginAnomaly: { score: number; weight: number; contribution: number; detail: string };
  eventCorrelation: { score: number; weight: number; contribution: number; detail: string };
}

export interface RecommendedAction {
  id: string;
  title: string;
  action: string;
  priority: 'critical' | 'high' | 'medium';
  category: string;
  completed: boolean;
}

export interface AnalysisResult {
  id: string;
  timestamp: string;
  riskScore: number;
  severity: ThreatSeverity;
  threatType: ThreatCategory;
  confidence: number; // 0-1 e.g. 0.94
  indicators: Array<{
    code: string;
    label: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
  }>;
  explanation: {
    summary: string;
    keyPoints: string[];
    technicalContext: string;
  };
  breakdown: RiskFactorBreakdown;
  attackChain?: AttackChain;
  recommendedActions: RecommendedAction[];
}

export interface PrivacySettings {
  dataMinimization: boolean;
  anonymizeEvents: boolean;
  noRawMessageStorage: boolean;
  localPreprocessing: boolean;
  retentionDays: number;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  action: string;
  category: 'analysis' | 'privacy' | 'user' | 'system';
  details: string;
  anonymizedId: string;
}

export interface UserFeedback {
  id: string;
  analysisId: string;
  rating: 'correct' | 'false_positive' | 'missed_threat';
  comment?: string;
  timestamp: string;
}
