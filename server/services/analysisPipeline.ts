import { SecurityEvent, AnalysisResult } from '../types.js';
import { normalizeInput, NormalizedEventInput } from './normalization.js';
import { extractFeatures } from './featureExtractor.js';
import { calculateRiskScore, CustomRiskWeights } from './riskScorer.js';
import { runAIEngine } from './aiEngine.js';
import { correlateEvents } from './correlationEngine.js';
import { generateSafeRecommendations } from './safeResponseEngine.js';
import { store } from '../store.js';

export async function processEventAnalysis(
  rawInput: NormalizedEventInput,
  customWeights?: CustomRiskWeights
): Promise<AnalysisResult> {
  // 1. Normalization & Data Minimization
  const normalized = normalizeInput(rawInput);

  // 2. Feature Extraction
  const features = extractFeatures(normalized);

  // 3. Initial Rule-Based Risk Signal Math
  const ruleRiskResult = calculateRiskScore(features, { score: 0, detail: '' }, customWeights);

  // 4. AI Engine Inference (Gemini or Local Fallback)
  const aiOutput = await runAIEngine({
    type: normalized.type,
    sender: normalized.sender,
    url: normalized.url,
    subject: normalized.subject,
    content: normalized.originalText,
    location: normalized.location,
    device: normalized.device,
    ipAddress: normalized.ipAddress,
    ruleRiskScore: ruleRiskResult.score,
    extractedFeatures: features
  });

  // Create temporary event for correlation
  const tempEvent: SecurityEvent = {
    id: `evt-${Date.now()}`,
    userId: 'user-demo',
    type: normalized.type as any,
    timestamp: new Date().toISOString(),
    rawContent: store.getPrivacySettings().noRawMessageStorage ? undefined : normalized.originalText,
    title: getEventTitle(normalized),
    details: {
      sender: normalized.sender,
      url: normalized.url,
      subject: normalized.subject,
      messageText: normalized.sanitizedText,
      location: normalized.location,
      device: normalized.device,
      ipAddress: normalized.ipAddress,
      ipReputation: features.loginAnomaly.score > 40 ? 'High Risk' : 'Low Risk',
      status: features.loginAnomaly.score > 70 ? 'failed' : 'success',
      urgencyLevel: features.urgencyLanguage.score > 50 ? 'high' : 'low'
    },
    riskScore: aiOutput.riskScore,
    threatType: aiOutput.threatType,
    status: 'active'
  };

  // 5. Correlation Engine (Connects into Attack Chain)
  const correlationResult = correlateEvents(tempEvent);

  // 6. Recalculate Final Risk Score including correlation boost
  const finalRiskResult = calculateRiskScore(
    features,
    { score: correlationResult.correlationScore, detail: correlationResult.detail },
    customWeights
  );

  // Finalize event score
  tempEvent.riskScore = finalRiskResult.score;

  // Store in database
  store.addEvent(tempEvent);

  // 7. Defensive Safe Response Actions
  const recommendedActions = generateSafeRecommendations(aiOutput.threatType, finalRiskResult.score);

  // Assemble complete Analysis Result
  const analysisResult: AnalysisResult = {
    id: tempEvent.id,
    timestamp: tempEvent.timestamp,
    riskScore: finalRiskResult.score,
    severity: finalRiskResult.severity,
    threatType: aiOutput.threatType,
    confidence: aiOutput.confidence,
    indicators: aiOutput.indicators,
    explanation: {
      summary: aiOutput.explanationSummary,
      keyPoints: aiOutput.explanationPoints,
      technicalContext: `Feature weights evaluated: Sender Anomaly (${features.senderAnomaly.score}), URL Risk (${features.urlRisk.score}), Impersonation (${features.impersonation.score}), Urgency (${features.urgencyLanguage.score}), Correlation Boost (${correlationResult.correlationScore}).`
    },
    breakdown: finalRiskResult.breakdown,
    attackChain: correlationResult.attackChain,
    recommendedActions
  };

  return analysisResult;
}

function getEventTitle(normalized: ReturnType<typeof normalizeInput>): string {
  if (normalized.subject) return `Email: ${normalized.subject}`;
  if (normalized.url) return `URL Analysis: ${normalized.domain || normalized.url}`;
  if (normalized.type === 'login') return `Login Event (${normalized.location || 'Unknown Location'})`;
  if (normalized.type === 'message') return `SMS/Message Alert (${normalized.sender || 'Unknown Sender'})`;
  return `Suspicious Request Analysis`;
}
