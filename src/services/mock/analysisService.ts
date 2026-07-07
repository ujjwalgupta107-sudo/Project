import type { AnalysisResult } from '../../types';

export const mockAnalysisResults: Record<string, AnalysisResult> = {
  'mock-digital-arrest-1': {
    id: 'mock-digital-arrest-1',
    riskScore: 94,
    riskLevel: 'CRITICAL',
    predictedType: 'DIGITAL_ARREST',
    confidence: 96,
    redFlags: [
      'Authority Impersonation (CBI claimed)',
      'Isolation Tactic (Victim instructed not to disconnect or tell family)',
      'Fear and Urgency (Threatening language used)',
      'Financial Demand (₹50,000 requested for verification)'
    ],
    extractedEntities: [
      {
        id: 'e-1',
        type: 'ORGANIZATION',
        value: 'CBI',
        riskScore: 10,
        firstSeen: '2025-01-10T00:00:00Z',
        lastSeen: '2026-07-05T00:00:00Z',
        connectedCaseIds: []
      },
      {
        id: 'e-2',
        type: 'UPI',
        value: 'suspicious@upi',
        riskScore: 95,
        firstSeen: '2026-06-15T00:00:00Z',
        lastSeen: '2026-07-05T00:00:00Z',
        connectedCaseIds: ['case-101', 'case-205']
      },
      {
        id: 'e-3',
        type: 'PHONE',
        value: '+91 98765 43210',
        maskedValue: '+91 •••• 3210',
        riskScore: 88,
        firstSeen: '2026-07-01T00:00:00Z',
        lastSeen: '2026-07-05T00:00:00Z',
        connectedCaseIds: ['case-101']
      }
    ],
    recommendedActions: [
      'Stop communication immediately.',
      'Do not transfer any money.',
      'Do not share OTP, PIN, passwords, or credentials.',
      'Preserve screenshots and call details.',
      'Use official reporting channels.'
    ]
  },
  'mock-safe-message': {
    id: 'mock-safe-message',
    riskScore: 12,
    riskLevel: 'LOW',
    predictedType: 'PHISHING',
    confidence: 30,
    redFlags: [
      'Unknown sender'
    ],
    extractedEntities: [],
    recommendedActions: [
      'No immediate action required, but remain cautious with unknown senders.'
    ]
  }
};

export const analysisService = {
  async analyzeText(text: string): Promise<AnalysisResult> {
    // Simulate network delay and analysis time (approx 3-5 seconds in real life, but 2 seconds for demo)
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simple logic for the demo: if it contains "CBI" or "Aadhaar" or "50,000", it's the digital arrest mock
        if (text.toLowerCase().includes('cbi') || text.toLowerCase().includes('aadhaar') || text.includes('50,000')) {
          resolve(mockAnalysisResults['mock-digital-arrest-1']);
        } else {
          resolve(mockAnalysisResults['mock-safe-message']);
        }
      }, 2500);
    });
  }
};
