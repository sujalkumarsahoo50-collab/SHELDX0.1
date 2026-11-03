import { SecurityEvent, AttackChain, PrivacySettings, AuditLogEntry, UserFeedback } from './types.js';

class SecurityStore {
  private events: SecurityEvent[] = [];
  private chains: AttackChain[] = [];
  private feedback: UserFeedback[] = [];
  private privacySettings: PrivacySettings = {
    dataMinimization: true,
    anonymizeEvents: true,
    noRawMessageStorage: true,
    localPreprocessing: true,
    retentionDays: 30,
  };
  private auditLogs: AuditLogEntry[] = [];

  constructor() {
    this.seedDefaultData();
  }

  public seedDefaultData() {
    const now = new Date();
    
    // Seed 5 interconnected events representing a realistic coordinated attack
    const t0 = new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(); // 2 hours ago
    const t1 = new Date(now.getTime() - 1.5 * 60 * 60 * 1000).toISOString();
    const t2 = new Date(now.getTime() - 1 * 60 * 60 * 1000).toISOString();
    const t3 = new Date(now.getTime() - 45 * 60 * 1000).toISOString();
    const t4 = new Date(now.getTime() - 20 * 60 * 1000).toISOString();

    const seededEvents: SecurityEvent[] = [
      {
        id: 'evt-101',
        userId: 'user-demo',
        type: 'email',
        timestamp: t0,
        title: 'Urgent Security Alert: Unusual Activity Detected',
        rawContent: 'From: security-alert@verify-secure-bank.com. Your online banking account has been temporarily locked due to 3 failed attempts. Click here immediately to verify identity.',
        details: {
          sender: 'security-alert@verify-secure-bank.com',
          subject: 'Urgent: Verify Your Account',
          urgencyLevel: 'high',
          url: 'http://verify-secure-bank.com-login-portal.xyz/auth/verify',
        },
        riskScore: 82,
        threatType: 'phishing',
        chainId: 'chain-demo-01',
        status: 'active'
      },
      {
        id: 'evt-102',
        userId: 'user-demo',
        type: 'url',
        timestamp: t1,
        title: 'Suspicious Domain Redirection',
        details: {
          url: 'http://verify-secure-bank.com-login-portal.xyz/auth/verify',
          sender: 'verify-secure-bank.com-login-portal.xyz',
        },
        riskScore: 89,
        threatType: 'suspicious_url',
        chainId: 'chain-demo-01',
        status: 'active'
      },
      {
        id: 'evt-103',
        userId: 'user-demo',
        type: 'message',
        timestamp: t2,
        title: '2FA Verification Code Request SMS',
        rawContent: 'SMS from +1-888-555-0199: Your 2FA code is 849201. ShieldX Bank agent will call you shortly to confirm.',
        details: {
          sender: '+1-888-555-0199',
          urgencyLevel: 'high',
          messageText: 'Your 2FA code is 849201. Bank agent will call you to confirm.'
        },
        riskScore: 78,
        threatType: 'social_engineering',
        chainId: 'chain-demo-01',
        status: 'active'
      },
      {
        id: 'evt-104',
        userId: 'user-demo',
        type: 'login',
        timestamp: t3,
        title: 'Unusual Login Attempt Detected',
        details: {
          location: 'Lagos, Nigeria',
          device: 'Firefox 118 on Linux x86_64',
          ipAddress: '197.210.64.12',
          ipReputation: 'High Risk (Known Tor/VPN Proxy)',
          status: 'failed',
          previousLocation: 'Seattle, WA, USA',
          previousDevice: 'Chrome 122 on macOS'
        },
        riskScore: 92,
        threatType: 'unusual_login',
        chainId: 'chain-demo-01',
        status: 'active'
      },
      {
        id: 'evt-105',
        userId: 'user-demo',
        type: 'login',
        timestamp: t4,
        title: 'Successful Login from Unfamiliar Device',
        details: {
          location: 'Lagos, Nigeria',
          device: 'Firefox 118 on Linux x86_64',
          ipAddress: '197.210.64.12',
          ipReputation: 'High Risk',
          status: 'success',
          previousLocation: 'Seattle, WA, USA',
          previousDevice: 'Chrome 122 on macOS'
        },
        riskScore: 96,
        threatType: 'account_takeover',
        chainId: 'chain-demo-01',
        status: 'active'
      }
    ];

    const flagshipChain: AttackChain = {
      id: 'chain-demo-01',
      title: 'Coordinated Phishing & Account Takeover Campaign',
      riskScore: 94,
      severity: 'CRITICAL',
      threatTypes: ['phishing', 'impersonation', 'suspicious_url', 'social_engineering', 'unusual_login', 'account_takeover'],
      eventIds: ['evt-101', 'evt-102', 'evt-103', 'evt-104', 'evt-105'],
      summary: 'A multi-stage attack starting with spoofed bank email containing typosquatted login link, followed by social engineering SMS and immediate high-risk login anomaly from an unfamiliar international location.',
      createdAt: t0,
      updatedAt: t4,
      nodes: [
        {
          id: 'node-user',
          type: 'Target User',
          label: 'Victim Account',
          subtitle: 'Target: user-demo@shieldx-demo.org',
          riskScore: 0,
          timestamp: t0,
          details: { role: 'Primary Target' },
          isSuspicious: false
        },
        {
          id: 'node-evt-101',
          eventId: 'evt-101',
          type: 'Email Message',
          label: 'Phishing Email',
          subtitle: 'From: security-alert@verify-secure-bank.com',
          riskScore: 82,
          timestamp: t0,
          details: { sender: 'security-alert@verify-secure-bank.com', subject: 'Urgent Account Lockout' },
          isSuspicious: true
        },
        {
          id: 'node-evt-102',
          eventId: 'evt-102',
          type: 'Deceptive URL',
          label: 'Fake Banking Portal',
          subtitle: 'verify-secure-bank.com-login-portal.xyz',
          riskScore: 89,
          timestamp: t1,
          details: { domain: 'verify-secure-bank.com-login-portal.xyz', TLD: '.xyz (Typosquatted)' },
          isSuspicious: true
        },
        {
          id: 'node-evt-103',
          eventId: 'evt-103',
          type: 'SMS Message',
          label: '2FA Intercept SMS',
          subtitle: 'From +1-888-555-0199',
          riskScore: 78,
          timestamp: t2,
          details: { text: 'Fake bank support requesting OTP' },
          isSuspicious: true
        },
        {
          id: 'node-evt-104',
          eventId: 'evt-104',
          type: 'Login Event',
          label: 'Failed Brute Force Login',
          subtitle: 'Lagos, Nigeria (Linux/Firefox)',
          riskScore: 92,
          timestamp: t3,
          details: { location: 'Lagos, Nigeria', ip: '197.210.64.12' },
          isSuspicious: true
        },
        {
          id: 'node-evt-105',
          eventId: 'evt-105',
          type: 'Account Compromise',
          label: 'Unusual Successful Session',
          subtitle: 'Lagos, Nigeria (Session Hijack)',
          riskScore: 96,
          timestamp: t4,
          details: { location: 'Lagos, Nigeria', status: 'Session active' },
          isSuspicious: true
        }
      ],
      edges: [
        { id: 'edge-1', source: 'node-evt-101', target: 'node-user', relation: 'Targeted', isThreatPath: true },
        { id: 'edge-2', source: 'node-evt-101', target: 'node-evt-102', relation: 'Embeds Malicious URL', isThreatPath: true },
        { id: 'edge-3', source: 'node-evt-102', target: 'node-evt-103', relation: 'Harvested Phone Number', isThreatPath: true },
        { id: 'edge-4', source: 'node-evt-103', target: 'node-evt-104', relation: 'Stole Credential / 2FA Token', isThreatPath: true },
        { id: 'edge-5', source: 'node-evt-104', target: 'node-evt-105', relation: 'Escalated to Active Session', isThreatPath: true }
      ]
    };

    this.events = seededEvents;
    this.chains = [flagshipChain];

    // Seed audit logs
    this.auditLogs = [
      {
        id: 'aud-001',
        timestamp: t0,
        action: 'Event Ingestion & Local Preprocessing',
        category: 'privacy',
        details: 'Raw email content anonymized. PII stripped before threat calculation.',
        anonymizedId: 'anon-hash-881a'
      },
      {
        id: 'aud-002',
        timestamp: t1,
        action: 'Threat Correlation Engine Triggered',
        category: 'analysis',
        details: 'Correlated domain verify-secure-bank.com-login-portal.xyz with active email event.',
        anonymizedId: 'anon-hash-992b'
      },
      {
        id: 'aud-003',
        timestamp: t4,
        action: 'Attack Chain Synthesized',
        category: 'analysis',
        details: 'High-risk attack chain generated with risk score 94/100.',
        anonymizedId: 'anon-hash-331c'
      }
    ];
  }

  // Event getters & setters
  public getEvents(): SecurityEvent[] {
    return this.events;
  }

  public addEvent(event: SecurityEvent): SecurityEvent {
    this.events.unshift(event);
    this.addAuditLog('Event Analyzed', 'analysis', `Analyzed event type ${event.type} with risk score ${event.riskScore}/100.`);
    return event;
  }

  public getChains(): AttackChain[] {
    return this.chains;
  }

  public addChain(chain: AttackChain): AttackChain {
    this.chains.unshift(chain);
    return chain;
  }

  public getChainById(id: string): AttackChain | undefined {
    return this.chains.find(c => c.id === id);
  }

  public getPrivacySettings(): PrivacySettings {
    return this.privacySettings;
  }

  public updatePrivacySettings(settings: Partial<PrivacySettings>): PrivacySettings {
    this.privacySettings = { ...this.privacySettings, ...settings };
    this.addAuditLog('Privacy Settings Updated', 'privacy', `Updated privacy policies.`);
    return this.privacySettings;
  }

  public getAuditLogs(): AuditLogEntry[] {
    return this.auditLogs;
  }

  public addAuditLog(action: string, category: 'analysis' | 'privacy' | 'user' | 'system', details: string) {
    const entry: AuditLogEntry = {
      id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      action,
      category,
      details,
      anonymizedId: `anon-${Math.random().toString(36).substring(2, 9)}`
    };
    this.auditLogs.unshift(entry);
  }

  public purgeUserData() {
    this.events = [];
    this.chains = [];
    this.feedback = [];
    this.addAuditLog('Data Purged', 'privacy', 'User initiated zero-footprint data deletion. All local events and threat chains wiped.');
    return { success: true, message: 'All user security data successfully purged.' };
  }

  public addFeedback(fb: UserFeedback) {
    this.feedback.unshift(fb);
    this.addAuditLog('Feedback Submitted', 'user', `Submitted feedback rating ${fb.rating} for analysis ${fb.analysisId}`);
    return fb;
  }

  public getFeedback() {
    return this.feedback;
  }
}

export const store = new SecurityStore();
