import { ThreatCategory } from '../types.js';

export interface RecommendedAction {
  id: string;
  title: string;
  action: string;
  priority: 'critical' | 'high' | 'medium';
  category: string;
  completed: boolean;
}

export function generateSafeRecommendations(threatType: ThreatCategory, riskScore: number): RecommendedAction[] {
  const actions: RecommendedAction[] = [];

  if (riskScore >= 75 || threatType === 'phishing' || threatType === 'suspicious_url') {
    actions.push({
      id: 'rec-01',
      title: 'Do Not Interact With Link',
      action: 'Avoid clicking any link or downloading attachments from this message.',
      priority: 'critical',
      category: 'Immediate Defense',
      completed: false
    });
    actions.push({
      id: 'rec-02',
      title: 'Verify Via Official Direct Channels',
      action: 'Navigate directly to the organization’s official website or app in a fresh browser tab.',
      priority: 'high',
      category: 'Identity Verification',
      completed: false
    });
  }

  if (threatType === 'account_takeover' || threatType === 'unusual_login' || riskScore >= 80) {
    actions.push({
      id: 'rec-03',
      title: 'Terminate All Active Sessions',
      action: 'Log out of all existing account sessions and review logged-in device history immediately.',
      priority: 'critical',
      category: 'Account Isolation',
      completed: false
    });
    actions.push({
      id: 'rec-04',
      title: 'Rotate Account Password & Enable 2FA',
      action: 'Update your password using a strong unique passkey and enforce Hardware/TOTP Multi-Factor Authentication.',
      priority: 'critical',
      category: 'Credential Hardening',
      completed: false
    });
  }

  if (threatType === 'impersonation' || threatType === 'social_engineering' || threatType === 'fake_support') {
    actions.push({
      id: 'rec-05',
      title: 'Independent Support Confirmation',
      action: 'Do not dial phone numbers or reply to email addresses provided in the suspicious message.',
      priority: 'high',
      category: 'Communication Safety',
      completed: false
    });
    actions.push({
      id: 'rec-06',
      title: 'Report Impersonation Incident',
      action: 'Report the spoofed sender address to the official security operations team of the impersonated entity.',
      priority: 'medium',
      category: 'Incident Reporting',
      completed: false
    });
  }

  if (threatType === 'payment_fraud' || threatType === 'scam') {
    actions.push({
      id: 'rec-07',
      title: 'Freeze Pending Financial Transactions',
      action: 'Contact your financial institution immediately to place a temporary hold on affected accounts.',
      priority: 'critical',
      category: 'Financial Shield',
      completed: false
    });
  }

  // Baseline fallback defensive actions
  if (actions.length === 0) {
    actions.push({
      id: 'rec-def-1',
      title: 'Maintain Standard Digital Hygiene',
      action: 'Ensure your operating system and web browser security patches are up to date.',
      priority: 'medium',
      category: 'General Safety',
      completed: false
    });
    actions.push({
      id: 'rec-def-2',
      title: 'Review Privacy & Security Settings',
      action: 'Check ShieldX Privacy Center to verify your data retention settings.',
      priority: 'medium',
      category: 'Privacy',
      completed: false
    });
  }

  return actions;
}
