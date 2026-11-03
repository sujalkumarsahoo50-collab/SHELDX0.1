import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { store } from './store.js';
import { processEventAnalysis } from './services/analysisPipeline.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.resolve(__dirname, '../dist');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Healthcheck
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'ShieldX Defensive AI Agent API',
    timestamp: new Date().toISOString(),
    aiProvider: process.env.GEMINI_API_KEY ? 'Google Gemini API' : 'ShieldX Local Rule Engine (Fallback Active)'
  });
});

// Dashboard Overview Endpoint
app.get('/api/dashboard', (req, res) => {
  const events = store.getEvents();
  const chains = store.getChains();

  const totalEvents = events.length;
  const highRiskEvents = events.filter(e => e.riskScore >= 70);
  const activeThreats = chains.filter(c => c.severity === 'HIGH' || c.severity === 'CRITICAL').length || highRiskEvents.length;
  
  const suspiciousLinksCount = events.filter(e => e.type === 'url' || e.details.url).length;
  const loginAnomaliesCount = events.filter(e => e.type === 'login' && e.riskScore >= 60).length;

  // Calculate overall Digital Safety Score (0-100)
  // Higher risk events lower the safety score
  const avgRisk = events.length > 0 ? events.reduce((acc, e) => acc + e.riskScore, 0) / events.length : 0;
  const digitalSafetyScore = Math.max(15, Math.round(100 - avgRisk * 0.75));

  let overallThreatLevel = 'LOW';
  if (digitalSafetyScore < 50) overallThreatLevel = 'CRITICAL';
  else if (digitalSafetyScore < 70) overallThreatLevel = 'HIGH';
  else if (digitalSafetyScore < 85) overallThreatLevel = 'MEDIUM';

  // Generate 7-day risk trend data
  const riskTrend = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dayStr = d.toLocaleDateString('en-US', { weekday: 'short' });
    const dayEvents = events.filter(e => new Date(e.timestamp).toDateString() === d.toDateString());
    const dayRisk = dayEvents.length > 0 ? Math.round(dayEvents.reduce((a, b) => a + b.riskScore, 0) / dayEvents.length) : Math.max(10, 80 - digitalSafetyScore + (i % 3) * 5);
    return { day: dayStr, riskScore: dayRisk, eventCount: dayEvents.length };
  });

  res.json({
    digitalSafetyScore,
    overallThreatLevel,
    activeThreats,
    suspiciousLinksCount,
    loginAnomaliesCount,
    totalEvents,
    recentEvents: events.slice(0, 10),
    activeChains: chains,
    riskTrend
  });
});

// Single or Batch Event Analysis Endpoint
app.post('/api/analyze', async (req, res) => {
  try {
    const { events, type, rawText, sender, url, subject, location, device, ipAddress, urgency, amount, customWeights } = req.body;

    if (Array.isArray(events) && events.length > 0) {
      // Coordinated Multi-event Batch Analysis
      const results = [];
      for (const ev of events) {
        const resSingle = await processEventAnalysis(ev, customWeights);
        results.push(resSingle);
      }
      return res.json({
        isMultiEvent: true,
        summary: `Processed batch of ${events.length} security signals. Correlated into unified attack chain graph.`,
        latestResult: results[results.length - 1],
        allResults: results,
        attackChain: results[results.length - 1].attackChain
      });
    }

    // Single Event Analysis
    const result = await processEventAnalysis({
      type: type || 'message',
      rawText,
      sender,
      url,
      subject,
      location,
      device,
      ipAddress,
      urgency,
      amount
    }, customWeights);

    res.json(result);
  } catch (err: any) {
    console.error('[ShieldX Analysis Error]', err);
    res.status(500).json({
      error: 'Failed to process security event analysis',
      message: err.message || 'Internal analysis pipeline error'
    });
  }
});

// Security Events Listing
app.get('/api/events', (req, res) => {
  res.json({ events: store.getEvents() });
});

// Attack Chains Listing
app.get('/api/chains', (req, res) => {
  res.json({ chains: store.getChains() });
});

// Single Chain Details
app.get('/api/chains/:id', (req, res) => {
  const chain = store.getChainById(req.params.id);
  if (!chain) {
    return res.status(404).json({ error: 'Attack chain not found' });
  }
  res.json(chain);
});

// Feedback Loop Endpoint
app.post('/api/feedback', (req, res) => {
  const { analysisId, rating, comment } = req.body;
  if (!analysisId || !rating) {
    return res.status(400).json({ error: 'analysisId and rating are required' });
  }
  const feedback = store.addFeedback({
    id: `fb-${Date.now()}`,
    analysisId,
    rating,
    comment,
    timestamp: new Date().toISOString()
  });
  res.json({ success: true, feedback });
});

// Privacy Center Endpoints
app.get('/api/privacy', (req, res) => {
  res.json({
    settings: store.getPrivacySettings(),
    auditLogs: store.getAuditLogs(),
    metrics: {
      dataCollected: 'Anonymized Event Identifiers, Signal Signatures',
      dataProcessed: 'Local Normalized Tokens, Domain Entropy, Risk Weights',
      dataStored: store.getPrivacySettings().noRawMessageStorage ? 'Zero Raw Message Payload (Metasignal Only)' : 'Encrypted Metasignal Metadata',
      dataRetentionDays: store.getPrivacySettings().retentionDays
    }
  });
});

app.post('/api/privacy/settings', (req, res) => {
  const updated = store.updatePrivacySettings(req.body);
  res.json({ success: true, settings: updated });
});

app.post('/api/privacy/purge', (req, res) => {
  const result = store.purgeUserData();
  res.json(result);
});

// Demo Mode Scenarios Launcher
app.post('/api/demo/load-scenario', async (req, res) => {
  const { scenarioId } = req.body;

  let demoEvents = [];

  switch (scenarioId) {
    case 'scenario-1': // Fake bank security alert
      demoEvents = [{
        type: 'email',
        sender: 'no-reply@security-alert-chase-bank.xyz',
        subject: 'URGENT: Suspicious Debit Attempt - Account Lockout Pending',
        rawText: 'We detected an unauthorized \$499.00 charge on your account. If this was not you, verify your identity within 15 minutes at http://chase-bank-verify-portal.xyz/auth or your account will be suspended.',
        url: 'http://chase-bank-verify-portal.xyz/auth'
      }];
      break;

    case 'scenario-2': // Fake customer support impersonation
      demoEvents = [{
        type: 'message',
        sender: '+1-800-555-9012',
        rawText: 'Microsoft Tech Support: We detected malware transmitting your saved passwords. Call 1-800-555-9012 immediately or open http://support-microsoft-helpdesk.top to allow technician access.',
        url: 'http://support-microsoft-helpdesk.top'
      }];
      break;

    case 'scenario-3': // Suspicious delivery parcel scam
      demoEvents = [{
        type: 'message',
        sender: 'USPS-Parcel-Update',
        rawText: 'USPS Notice: Your package could not be delivered due to incomplete address. Please pay \$1.99 redelivery fee at http://usps-redelivery-address-confirm.click within 12 hours.',
        url: 'http://usps-redelivery-address-confirm.click'
      }];
      break;

    case 'scenario-4': // Account takeover sequence
      demoEvents = [
        {
          type: 'login',
          location: 'Moscow, Russia',
          device: 'Headless Chrome / Python Script',
          ipAddress: '185.220.101.4',
          urgency: 'high'
        },
        {
          type: 'login',
          location: 'Moscow, Russia',
          device: 'Headless Chrome / Python Script',
          ipAddress: '185.220.101.4',
          urgency: 'high'
        }
      ];
      break;

    case 'scenario-5': // Flagship Coordinated Multi-Event Attack
    default:
      demoEvents = [
        {
          type: 'email',
          sender: 'security-alert@verify-secure-bank.com',
          subject: 'Urgent Account Lockout Prevention',
          rawText: 'Your account was flagged for policy violation. Verify immediately.',
          url: 'http://verify-secure-bank.com-login-portal.xyz/auth/verify'
        },
        {
          type: 'url',
          url: 'http://verify-secure-bank.com-login-portal.xyz/auth/verify'
        },
        {
          type: 'message',
          sender: '+1-888-555-0199',
          rawText: 'Your 2FA OTP code is 984021. ShieldX Bank agent will call you to confirm.'
        },
        {
          type: 'login',
          location: 'Lagos, Nigeria',
          device: 'Firefox 118 on Linux x86_64',
          ipAddress: '197.210.64.12',
          urgency: 'high'
        }
      ];
      break;
  }

  // Run analysis for scenario events
  const results = [];
  for (const ev of demoEvents) {
    const resSingle = await processEventAnalysis(ev as any);
    results.push(resSingle);
  }

  res.json({
    scenarioId,
    title: getScenarioTitle(scenarioId),
    summary: `Successfully loaded and executed ${demoEvents.length} multi-stage security events into ShieldX correlation engine.`,
    analysis: results[results.length - 1],
    attackChain: results[results.length - 1].attackChain
  });
});

function getScenarioTitle(id: string): string {
  switch (id) {
    case 'scenario-1': return 'Fake Bank & Security Alert Phishing';
    case 'scenario-2': return 'Tech Support Impersonation Scam';
    case 'scenario-3': return 'Delivery Parcel Fee Payment SMS Scam';
    case 'scenario-4': return 'Automated Brute-Force Account Takeover';
    case 'scenario-5': return 'Coordinated Multi-Vector Phishing & Account Takeover Campaign';
    default: return 'Custom Attack Scenario';
  }
}

// Analytics Endpoint
app.get('/api/analytics', (req, res) => {
  const events = store.getEvents();
  const feedback = store.getFeedback();
  const chains = store.getChains();

  const threatCategories: Record<string, number> = {};
  events.forEach(e => {
    threatCategories[e.threatType] = (threatCategories[e.threatType] || 0) + 1;
  });

  const feedbackCounts = {
    correct: feedback.filter(f => f.rating === 'correct').length,
    falsePositive: feedback.filter(f => f.rating === 'false_positive').length,
    missedThreat: feedback.filter(f => f.rating === 'missed_threat').length,
  };

  res.json({
    totalEvents: events.length,
    totalAttackChains: chains.length,
    avgRiskScore: events.length > 0 ? Math.round(events.reduce((a, b) => a + b.riskScore, 0) / events.length) : 0,
    threatCategories,
    feedbackCounts
  });
});

// Serve frontend build if dist folder exists (unifying frontend & backend)
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  // SPA fallback for Express 5
  app.use((req, res, next) => {
    if (req.method !== 'GET' || req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`🛡️ ShieldX Defensive AI Backend running on http://localhost:${PORT}`);
});
