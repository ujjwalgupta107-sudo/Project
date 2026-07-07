export type RiskLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type ScamType = 'DIGITAL_ARREST' | 'OTP_THEFT' | 'UPI_FRAUD' | 'INVESTMENT' | 'COURIER' | 'JOB' | 'LOAN' | 'PHISHING';
export type EntityType = 'PHONE' | 'UPI' | 'BANK_ACCOUNT' | 'DOMAIN' | 'DEVICE' | 'ORGANIZATION' | 'LOCATION';
export type CaseStatus = 'OPEN' | 'INVESTIGATING' | 'CLOSED' | 'FLAGGED';

export interface GeoLocation {
  lat: number;
  lng: number;
  city: string;
}

export interface Case {
  id: string;
  riskScore: number;
  riskLevel: RiskLevel;
  scamType: ScamType;
  status: CaseStatus;
  createdAt: string;
  location?: GeoLocation;
  evidenceCount: number;
  entityIds: string[];
  clusterId?: string;
}

export interface Entity {
  id: string;
  type: EntityType;
  value: string;
  maskedValue?: string;
  riskScore: number;
  firstSeen: string;
  lastSeen: string;
  connectedCaseIds: string[];
  clusterId?: string;
}

export interface AnalysisResult {
  id: string;
  riskScore: number;
  riskLevel: RiskLevel;
  predictedType: ScamType;
  confidence: number;
  redFlags: string[];
  extractedEntities: Entity[];
  recommendedActions: string[];
}
