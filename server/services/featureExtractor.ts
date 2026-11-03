import { normalizeInput } from './normalization.js';

const KNOWN_BRANDS = [
  'chase', 'wellsfargo', 'bankofamerica', 'paypal', 'stripe',
  'apple', 'google', 'microsoft', 'amazon', 'netflix', 'meta',
  'dhl', 'fedex', 'usps', 'ups', 'coinbase', 'binance', 'shieldx'
];

const SUSPICIOUS_TLDS = ['xyz', 'top', 'click', 'site', 'zip', 'work', 'gq', 'tk', 'ml', 'cf', 'online', 'info', 'live', 'support'];

const URGENCY_KEYWORDS = [
  'urgent', 'immediately', 'action required', 'account locked', 'suspended',
  '24 hours', 'confirm now', 'unauthorized access', 'security alert', 'verify identity',
  'penalty', 'final warning', 'wire transfer', 'otp', 'passcode', 'login now'
];

const CREDENTIAL_PAYMENT_PATTERNS = [
  'password', 'ssn', 'social security', 'credit card', 'cvv', 'pin',
  'gift card', 'crypto', 'bitcoin', 'usdt', 'bank account', 'routing number',
  'billing details', 'payment failed', 'update payment'
];

export function extractFeatures(normalized: ReturnType<typeof normalizeInput>) {
  const fullContent = `${normalized.subject} ${normalized.originalText} ${normalized.url}`.toLowerCase();

  // 1. Sender Anomaly Analysis
  let senderAnomalyScore = 0;
  let senderAnomalyDetails = 'Sender appears normal.';
  if (normalized.sender) {
    const isFreeDomain = /@(gmail|yahoo|hotmail|outlook|icloud)\.com$/i.test(normalized.sender);
    const hasBrandInName = KNOWN_BRANDS.some(b => normalized.sender.includes(b));
    if (hasBrandInName && isFreeDomain) {
      senderAnomalyScore = 95;
      senderAnomalyDetails = `Sender claims brand identity in username but uses free provider domain (${normalized.sender}).`;
    } else if (/\d{4,}/.test(normalized.sender) || /noreply-verify/i.test(normalized.sender)) {
      senderAnomalyScore = 75;
      senderAnomalyDetails = `Sender domain or prefix exhibits synthetic random characters.`;
    } else if (normalized.sender.includes('-security') || normalized.sender.includes('support-team')) {
      senderAnomalyScore = 80;
      senderAnomalyDetails = `Sender domain uses misleading security/support keywords.`;
    }
  }

  // 2. URL & Domain Risk
  let urlRiskScore = 0;
  let urlRiskDetails = 'URL shows no high-risk domain characteristics.';
  if (normalized.url) {
    if (SUSPICIOUS_TLDS.includes(normalized.tld)) {
      urlRiskScore += 45;
      urlRiskDetails = `High-risk TLD (.${normalized.tld}) commonly abused in phishing.`;
    }
    
    // Check brand typosquatting / domain mismatch
    const matchingBrand = KNOWN_BRANDS.find(b => normalized.domain.includes(b));
    if (matchingBrand) {
      const isOfficial = normalized.domain.endsWith(`.${matchingBrand}.com`) || normalized.domain === `${matchingBrand}.com`;
      if (!isOfficial) {
        urlRiskScore += 50;
        urlRiskDetails = `Domain "${normalized.domain}" typosquats target brand "${matchingBrand}".`;
      }
    }

    if (normalized.domain.includes('-') && normalized.domain.includes('login')) {
      urlRiskScore += 35;
      urlRiskDetails += ` Domain uses concatenated dash structures like "-login-portal".`;
    }

    if (normalized.domain.length > 35) {
      urlRiskScore += 20;
    }
  }
  urlRiskScore = Math.min(urlRiskScore, 100);

  // 3. Impersonation Indicators
  let impersonationScore = 0;
  let impersonationDetails = 'No brand impersonation detected.';
  const detectedBrand = KNOWN_BRANDS.find(b => fullContent.includes(b));
  if (detectedBrand) {
    impersonationScore = 60;
    impersonationDetails = `Message mentions or impersonates recognized service provider (${detectedBrand.toUpperCase()}).`;
    if (urlRiskScore > 40 || senderAnomalyScore > 40) {
      impersonationScore = 90;
      impersonationDetails = `Confirmed fake brand support channel attempting impersonation of ${detectedBrand.toUpperCase()}.`;
    }
  }

  // 4. Urgency & Social Engineering Language
  let urgencyScore = 0;
  const matchedUrgentWords = URGENCY_KEYWORDS.filter(w => fullContent.includes(w));
  if (matchedUrgentWords.length > 0) {
    urgencyScore = Math.min(matchedUrgentWords.length * 25, 100);
  }
  const urgencyDetails = matchedUrgentWords.length > 0
    ? `Creates artificial urgency with terms: ${matchedUrgentWords.slice(0, 3).join(', ')}.`
    : 'Language tone is standard.';

  // 5. Credential & Payment Harvesting Requests
  let credPaymentScore = 0;
  const matchedCredWords = CREDENTIAL_PAYMENT_PATTERNS.filter(w => fullContent.includes(w));
  if (matchedCredWords.length > 0) {
    credPaymentScore = Math.min(matchedCredWords.length * 30, 100);
  }
  const credPaymentDetails = matchedCredWords.length > 0
    ? `Requests sensitive credential or payment verification: ${matchedCredWords.slice(0, 3).join(', ')}.`
    : 'No direct credential harvesting terms found.';

  // 6. Login Anomaly Analysis (Location / Device / IP Reputation)
  let loginAnomalyScore = 0;
  let loginAnomalyDetails = 'Standard user login context.';
  if (normalized.type === 'login') {
    const loc = normalized.location.toLowerCase();
    const dev = normalized.device.toLowerCase();
    const ipRep = (normalized.ipAddress || '').toLowerCase();

    let anomalyFactors = [];
    if (loc && (loc.includes('nigeria') || loc.includes('russia') || loc.includes('china') || loc.includes('vpn') || loc.includes('tor'))) {
      loginAnomalyScore += 50;
      anomalyFactors.push(`Unusual international login location (${normalized.location})`);
    }
    if (dev.includes('linux') || dev.includes('unknown') || dev.includes('headless')) {
      loginAnomalyScore += 30;
      anomalyFactors.push(`Unrecognized operating system / device fingerprint (${normalized.device})`);
    }
    if (ipRep.includes('high risk') || ipRep.includes('proxy') || ipRep.includes('tor')) {
      loginAnomalyScore += 40;
      anomalyFactors.push(`IP address flagged for proxy/botnet reputation`);
    }

    loginAnomalyScore = Math.min(loginAnomalyScore, 100);
    if (loginAnomalyScore > 0) {
      loginAnomalyDetails = anomalyFactors.join('; ');
    }
  }

  return {
    senderAnomaly: { score: senderAnomalyScore, detail: senderAnomalyDetails },
    urlRisk: { score: urlRiskScore, detail: urlRiskDetails },
    impersonation: { score: impersonationScore, detail: impersonationDetails },
    urgencyLanguage: { score: urgencyScore, detail: urgencyDetails },
    credentialPaymentRequest: { score: credPaymentScore, detail: credPaymentDetails },
    loginAnomaly: { score: loginAnomalyScore, detail: loginAnomalyDetails },
    detectedBrand,
    matchedUrgentWords,
    matchedCredWords
  };
}
