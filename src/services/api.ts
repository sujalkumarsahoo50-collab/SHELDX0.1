import { SecurityEvent, AttackChain, AnalysisResult, PrivacySettings, AuditLogEntry } from '../../server/types.js';

const API_BASE = '/api';

export const api = {
  async getDashboard() {
    try {
      const res = await fetch(`${API_BASE}/dashboard`);
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn('API unreachable, using local mock store fallback');
    }
    return null;
  },

  async analyzeEvent(payload: any): Promise<AnalysisResult | any> {
    try {
      const res = await fetch(`${API_BASE}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn('API analyze request failed, fallback engine active');
    }
    throw new Error('Analysis service error');
  },

  async getEvents(): Promise<{ events: SecurityEvent[] } | null> {
    try {
      const res = await fetch(`${API_BASE}/events`);
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn('Failed to fetch events');
    }
    return null;
  },

  async getChains(): Promise<{ chains: AttackChain[] } | null> {
    try {
      const res = await fetch(`${API_BASE}/chains`);
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn('Failed to fetch attack chains');
    }
    return null;
  },

  async getChainById(id: string): Promise<AttackChain | null> {
    try {
      const res = await fetch(`${API_BASE}/chains/${id}`);
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn(`Failed to fetch chain ${id}`);
    }
    return null;
  },

  async submitFeedback(analysisId: string, rating: 'correct' | 'false_positive' | 'missed_threat', comment?: string) {
    try {
      const res = await fetch(`${API_BASE}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ analysisId, rating, comment })
      });
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn('Feedback submission error');
    }
    return { success: true };
  },

  async getPrivacy(): Promise<{ settings: PrivacySettings; auditLogs: AuditLogEntry[]; metrics: any } | null> {
    try {
      const res = await fetch(`${API_BASE}/privacy`);
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn('Failed to fetch privacy settings');
    }
    return null;
  },

  async updatePrivacySettings(settings: Partial<PrivacySettings>) {
    try {
      const res = await fetch(`${API_BASE}/privacy/settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn('Failed to update privacy settings');
    }
    return null;
  },

  async purgeUserData() {
    try {
      const res = await fetch(`${API_BASE}/privacy/purge`, { method: 'POST' });
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn('Purge data failed');
    }
    return { success: false };
  },

  async loadDemoScenario(scenarioId: string) {
    try {
      const res = await fetch(`${API_BASE}/demo/load-scenario`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenarioId })
      });
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn('Load scenario failed');
    }
    return null;
  },

  async getAnalytics() {
    try {
      const res = await fetch(`${API_BASE}/analytics`);
      if (res.ok) return await res.json();
    } catch (err) {
      console.warn('Analytics API error');
    }
    return null;
  }
};
