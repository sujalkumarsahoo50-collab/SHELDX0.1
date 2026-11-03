export interface NormalizedEventInput {
  type: string;
  rawText?: string;
  sender?: string;
  url?: string;
  subject?: string;
  location?: string;
  device?: string;
  ipAddress?: string;
  urgency?: string;
  amount?: string;
}

export function normalizeInput(input: NormalizedEventInput) {
  const cleanSender = input.sender?.trim().toLowerCase() || '';
  let cleanUrl = input.url?.trim() || '';
  
  // Extract URL from raw text if missing
  if (!cleanUrl && input.rawText) {
    const urlMatch = input.rawText.match(/(https?:\/\/[^\s]+)/gi);
    if (urlMatch && urlMatch[0]) {
      cleanUrl = urlMatch[0];
    }
  }

  // Normalize URL schema
  let domain = '';
  let tld = '';
  if (cleanUrl) {
    try {
      if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
        cleanUrl = 'https://' + cleanUrl;
      }
      const parsed = new URL(cleanUrl);
      domain = parsed.hostname.toLowerCase();
      const parts = domain.split('.');
      tld = parts.length > 1 ? parts[parts.length - 1] : '';
    } catch {
      domain = cleanUrl.toLowerCase();
    }
  }

  // Anonymize/Sanitize raw text for data minimization
  const sanitizedText = (input.rawText || '')
    .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[REDACTED_EMAIL]')
    .replace(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, '[REDACTED_PHONE]')
    .replace(/\b\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}\b/g, '[REDACTED_CARD]');

  return {
    type: input.type,
    sender: cleanSender,
    url: cleanUrl,
    domain,
    tld,
    subject: input.subject?.trim() || '',
    sanitizedText,
    originalText: input.rawText || '',
    location: input.location?.trim() || '',
    device: input.device?.trim() || '',
    ipAddress: input.ipAddress?.trim() || '',
    urgency: input.urgency || 'low',
    amount: input.amount || '',
  };
}
