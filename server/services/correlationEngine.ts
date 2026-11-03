import { SecurityEvent, AttackChain, AttackNode, AttackEdge, ThreatCategory, ThreatSeverity } from '../types.js';
import { store } from '../store.js';

export function correlateEvents(newEvent: SecurityEvent): { correlationScore: number; detail: string; attackChain?: AttackChain } {
  const existingEvents = store.getEvents();
  const relatedEvents = existingEvents.filter(e => e.id !== newEvent.id);

  if (relatedEvents.length === 0) {
    return {
      correlationScore: 0,
      detail: 'First event recorded in context. No prior correlated threats.'
    };
  }

  // Find related events by shared brand, shared sender, shared URL domain, or proximity in time
  const matches: SecurityEvent[] = [];
  const newDomain = newEvent.details.url || '';
  const newSender = newEvent.details.sender || '';

  for (const ev of relatedEvents) {
    let isRelated = false;
    if (newDomain && ev.details.url && (newDomain.includes(ev.details.url) || ev.details.url.includes(newDomain))) {
      isRelated = true;
    }
    if (newSender && ev.details.sender && (newSender === ev.details.sender || newSender.includes(ev.details.sender))) {
      isRelated = true;
    }
    // Correlation between email/SMS and subsequent login anomaly within 3 hours
    if ((ev.type === 'email' || ev.type === 'message' || ev.type === 'url') && newEvent.type === 'login') {
      const tEv = new Date(ev.timestamp).getTime();
      const tNew = new Date(newEvent.timestamp).getTime();
      if (Math.abs(tNew - tEv) < 3 * 3600 * 1000) {
        isRelated = true;
      }
    }
    if ((newEvent.type === 'email' || newEvent.type === 'message' || newEvent.type === 'url') && ev.type === 'login') {
      const tEv = new Date(ev.timestamp).getTime();
      const tNew = new Date(newEvent.timestamp).getTime();
      if (Math.abs(tNew - tEv) < 3 * 3600 * 1000) {
        isRelated = true;
      }
    }

    if (isRelated) {
      matches.push(ev);
    }
  }

  if (matches.length === 0) {
    return {
      correlationScore: 20,
      detail: 'Analyzed against historical events. No direct correlation matched.'
    };
  }

  // Calculate correlation boost score
  const correlationScore = Math.min(100, 50 + matches.length * 20);
  const detail = `Correlated with ${matches.length} prior security event(s) across message, link, and authentication signals.`;

  // Build or update an Attack Chain
  const allChainEvents = [newEvent, ...matches].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  const chainId = matches[0]?.chainId || `chain-${Date.now()}`;
  newEvent.chainId = chainId;

  // Synthesize nodes & edges
  const nodes: AttackNode[] = [
    {
      id: 'node-target',
      type: 'User Session',
      label: 'Protected Identity',
      subtitle: 'Target User',
      riskScore: 0,
      timestamp: newEvent.timestamp,
      details: { status: 'Monitored' },
      isSuspicious: false,
    }
  ];

  const edges: AttackEdge[] = [];
  let maxRisk = newEvent.riskScore;
  const threatCategories = new Set<ThreatCategory>([newEvent.threatType]);

  allChainEvents.forEach((ev, idx) => {
    maxRisk = Math.max(maxRisk, ev.riskScore);
    threatCategories.add(ev.threatType);

    const nodeId = `node-${ev.id}`;
    nodes.push({
      id: nodeId,
      eventId: ev.id,
      type: ev.type.toUpperCase(),
      label: ev.title,
      subtitle: ev.details.sender || ev.details.url || ev.details.location || ev.type,
      riskScore: ev.riskScore,
      timestamp: ev.timestamp,
      details: ev.details,
      isSuspicious: ev.riskScore >= 50
    });

    if (idx === 0) {
      edges.push({
        id: `edge-target-${ev.id}`,
        source: nodeId,
        target: 'node-target',
        relation: 'Initiated Vector',
        isThreatPath: true
      });
    } else {
      const prevNodeId = `node-${allChainEvents[idx - 1].id}`;
      edges.push({
        id: `edge-${allChainEvents[idx - 1].id}-${ev.id}`,
        source: prevNodeId,
        target: nodeId,
        relation: getEdgeRelation(allChainEvents[idx - 1].type, ev.type),
        isThreatPath: true
      });
    }
  });

  let severity: ThreatSeverity = 'LOW';
  if (maxRisk >= 80) severity = 'CRITICAL';
  else if (maxRisk >= 60) severity = 'HIGH';
  else if (maxRisk >= 35) severity = 'MEDIUM';

  const attackChain: AttackChain = {
    id: chainId,
    title: `Coordinated ${Array.from(threatCategories).slice(0, 3).join(' + ')} Campaign`,
    riskScore: maxRisk,
    severity,
    threatTypes: Array.from(threatCategories),
    eventIds: allChainEvents.map(e => e.id),
    nodes,
    edges,
    summary: `Identified coordinated multi-stage threat linking ${allChainEvents.length} distinct security signals over time.`,
    createdAt: allChainEvents[0].timestamp,
    updatedAt: allChainEvents[allChainEvents.length - 1].timestamp,
  };

  store.addChain(attackChain);

  return { correlationScore, detail, attackChain };
}

function getEdgeRelation(typeA: string, typeB: string): string {
  if ((typeA === 'email' || typeA === 'message') && typeB === 'url') return 'Contains Deceptive URL';
  if (typeA === 'url' && typeB === 'login') return 'Triggers Fake Auth Portal';
  if (typeA === 'login' && typeB === 'login') return 'Escalates to Session Compromise';
  return 'Sequential Event Link';
}
