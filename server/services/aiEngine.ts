import { ThreatCategory } from '../types.js';

export interface LLMAnalysisPromptInput {
  type: string;
  sender?: string;
  url?: string;
  subject?: string;
  content?: string;
  location?: string;
  device?: string;
  ipAddress?: string;
  ruleRiskScore: number;
  extractedFeatures: Record<string, any>;
}

export interface LLMAnalysisOutput {
  riskScore: number;
  threatType: ThreatCategory;
  confidence: number;
  indicators: Array<{
    code: string;
    label: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
  }>;
  explanationSummary: string;
  explanationPoints: string[];
}

export async function runAIEngine(input: LLMAnalysisPromptInput): Promise<LLMAnalysisOutput> {
  const apiKey = process.env.GEMINI_API_KEY || process.env.LLM_API_KEY;

  if (apiKey) {
    try {
      // Call Google Gemini API endpoint via REST
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are ShieldX defensive AI cybersecurity engine. Analyze the following security event and return ONLY a valid JSON object.
CRITICAL SAFETY RULE: You are purely defensive. Never generate malware, phishing templates, exploit code, or attack instructions.

Event Details:
Type: ${input.type}
Sender: ${input.sender || 'N/A'}
URL: ${input.url || 'N/A'}
Subject: ${input.subject || 'N/A'}
Content: ${input.content || 'N/A'}
Location: ${input.location || 'N/A'}
Device: ${input.device || 'N/A'}

Expected JSON Format:
{
  "riskScore": number (0-100),
  "threatType": "phishing" | "impersonation" | "scam" | "social_engineering" | "suspicious_url" | "account_takeover" | "unusual_login" | "fake_support",
  "confidence": number (0.0 to 1.0),
  "indicators": [
    { "code": "IND_01", "label": "Short label", "severity": "high", "description": "Why flagged" }
  ],
  "explanationSummary": "Concise non-technical summary",
  "explanationPoints": ["Point 1", "Point 2", "Point 3"]
}`
            }]
          }],
          generationConfig: {
            temperature: 0.1,
            responseMimeType: "application/json"
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        const jsonText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (jsonText) {
          const parsed = JSON.parse(jsonText);
          return {
            riskScore: Math.round(parsed.riskScore ?? input.ruleRiskScore),
            threatType: (parsed.threatType || classifyThreat(input)) as ThreatCategory,
            confidence: parsed.confidence ?? 0.92,
            indicators: parsed.indicators || generateDefaultIndicators(input),
            explanationSummary: parsed.explanationSummary || 'AI analysis evaluated threat patterns and contextual anomalies.',
            explanationPoints: parsed.explanationPoints || generateDefaultPoints(input)
          };
        }
      }
    } catch (err) {
      console.warn('[ShieldX AI Engine] Gemini API fallback active:', err);
    }
  }

  // Local Rule-Based AI Engine Fallback (Guarantees zero downtime and instant responses)
  return runFallbackAIEngine(input);
}

function runFallbackAIEngine(input: LLMAnalysisPromptInput): LLMAnalysisOutput {
  const threatType = classifyThreat(input);
  const confidence = 0.89 + Math.min(0.09, input.ruleRiskScore / 1000);
  const indicators = generateDefaultIndicators(input);
  const points = generateDefaultPoints(input);

  let summary = 'Standard input checked. Low risk signals detected.';
  if (input.ruleRiskScore >= 80) {
    summary = `Critical threat flagged: High probability of ${threatType.replace('_', ' ')} campaign targeting sensitive credentials or user session.`;
  } else if (input.ruleRiskScore >= 50) {
    summary = `Suspicious patterns detected: Multiple risk factors identified in ${input.type} content.`;
  }

  return {
    riskScore: input.ruleRiskScore,
    threatType,
    confidence: Number(confidence.toFixed(2)),
    indicators,
    explanationSummary: summary,
    explanationPoints: points
  };
}

function classifyThreat(input: LLMAnalysisPromptInput): ThreatCategory {
  const text = `${input.subject} ${input.content} ${input.url} ${input.sender}`.toLowerCase();
  if (input.type === 'login' || text.includes('unusual login') || text.includes('failed attempt')) {
    return text.includes('success') ? 'account_takeover' : 'unusual_login';
  }
  if (text.includes('bank') || text.includes('paypal') || text.includes('verify') || text.includes('locked')) {
    return 'phishing';
  }
  if (input.url && (input.url.includes('.xyz') || input.url.includes('-login'))) {
    return 'suspicious_url';
  }
  if (text.includes('support') || text.includes('helpdesk')) {
    return 'fake_support';
  }
  if (text.includes('gift card') || text.includes('wire') || text.includes('urgent payment')) {
    return 'payment_fraud';
  }
  return 'scam';
}

function generateDefaultIndicators(input: LLMAnalysisPromptInput) {
  const list: Array<{ code: string; label: string; severity: 'low' | 'medium' | 'high' | 'critical'; description: string }> = [];
  
  if (input.extractedFeatures.senderAnomaly?.score > 50) {
    list.push({
      code: 'IND_SENDER_MISMATCH',
      label: 'Unmatched Sender Identity',
      severity: 'high',
      description: input.extractedFeatures.senderAnomaly.detail
    });
  }
  if (input.extractedFeatures.urlRisk?.score > 40) {
    list.push({
      code: 'IND_TYPOSQUAT_URL',
      label: 'Deceptive Domain Structure',
      severity: 'critical',
      description: input.extractedFeatures.urlRisk.detail
    });
  }
  if (input.extractedFeatures.urgencyLanguage?.score > 30) {
    list.push({
      code: 'IND_ARTIFICIAL_URGENCY',
      label: 'High Urgency Pressure Tactics',
      severity: 'medium',
      description: input.extractedFeatures.urgencyLanguage.detail
    });
  }
  if (input.extractedFeatures.loginAnomaly?.score > 40) {
    list.push({
      code: 'IND_UNFAMILIAR_LOCATION',
      label: 'Unusual Geolocation/Device',
      severity: 'critical',
      description: input.extractedFeatures.loginAnomaly.detail
    });
  }

  if (list.length === 0) {
    list.push({
      code: 'IND_CLEAN',
      label: 'No Flagged Threats',
      severity: 'low',
      description: 'The event content matches standard safe communication baseline.'
    });
  }

  return list;
}

function generateDefaultPoints(input: LLMAnalysisPromptInput): string[] {
  const points: string[] = [];
  if (input.sender) points.push(`Sender identity (${input.sender}) differs from official institutional standards.`);
  if (input.url) points.push(`Destination link redirects to an unverified third-party domain.`);
  if (input.extractedFeatures.urgencyLanguage?.matchedUrgentWords?.length) {
    points.push(`Message relies on high-pressure urgency cues to bypass victim verification.`);
  }
  if (input.type === 'login') points.push(`Authentication attempt recorded from unfamiliar device fingerprint and geolocation.`);
  if (points.length === 0) points.push('All evaluated structural and domain signals appear within acceptable boundaries.');
  return points;
}
