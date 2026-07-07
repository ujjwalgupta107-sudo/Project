import type { Case } from '../../types';

export const mockCases: Case[] = [
  {
    id: 'KAV-2026-0101',
    riskScore: 94,
    riskLevel: 'CRITICAL',
    scamType: 'DIGITAL_ARREST',
    status: 'INVESTIGATING',
    createdAt: '2026-07-05T10:16:00Z',
    location: { lat: 28.6139, lng: 77.2090, city: 'Delhi' },
    evidenceCount: 4,
    entityIds: ['e-1', 'e-2', 'e-3'],
    clusterId: 'FC-019'
  },
  {
    id: 'KAV-2026-0114',
    riskScore: 88,
    riskLevel: 'HIGH',
    scamType: 'DIGITAL_ARREST',
    status: 'OPEN',
    createdAt: '2026-07-04T14:22:00Z',
    location: { lat: 19.0760, lng: 72.8777, city: 'Mumbai' },
    evidenceCount: 2,
    entityIds: ['e-2', 'e-4'],
    clusterId: 'FC-019'
  },
  {
    id: 'KAV-2026-0132',
    riskScore: 75,
    riskLevel: 'HIGH',
    scamType: 'OTP_THEFT',
    status: 'OPEN',
    createdAt: '2026-07-03T09:15:00Z',
    location: { lat: 12.9716, lng: 77.5946, city: 'Bengaluru' },
    evidenceCount: 1,
    entityIds: ['e-5'],
  },
  {
    id: 'KAV-2026-0147',
    riskScore: 45,
    riskLevel: 'MEDIUM',
    scamType: 'INVESTMENT',
    status: 'CLOSED',
    createdAt: '2026-07-01T16:45:00Z',
    location: { lat: 22.5726, lng: 88.3639, city: 'Kolkata' },
    evidenceCount: 3,
    entityIds: ['e-6', 'e-7'],
    clusterId: 'FC-004'
  }
];

export const caseService = {
  async getCases(): Promise<Case[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockCases), 600);
    });
  },

  async getCase(id: string): Promise<Case | undefined> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockCases.find(c => c.id === id));
      }, 500);
    });
  }
};
