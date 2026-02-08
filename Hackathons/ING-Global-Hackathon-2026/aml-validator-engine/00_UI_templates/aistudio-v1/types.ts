export interface Transaction {
  id: string;
  date: string;
  amount: number;
  currency: string;
  sender: string;
  receiver: string;
  type: 'WIRE' | 'ACH' | 'SWIFT' | 'CRYPTO';
  status: 'COMPLETED' | 'PENDING' | 'FLAGGED';
  riskScore: number; // 0-100
}

export interface CaseData {
  id: string;
  entityName: string;
  riskLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  slaDeadline: string; // ISO date string
  riskScore: number;
  topRiskDrivers: { name: string; value: number }[];
  transactions: Transaction[];
  summary?: string;
}

export interface CaseSummary {
  id: string;
  entityName: string;
  riskLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'OPEN' | 'IN_REVIEW' | 'CLOSED';
  dateOpened: string;
  analyst: string;
  type: 'AML' | 'KYC' | 'FRAUD';
}

export interface Node {
  id: string;
  group: number;
  val: number; // size
  label: string;
  risk: number; // 0-1
}

export interface Link {
  source: string;
  target: string;
  value: number; // thickness
}

export interface GraphData {
  nodes: Node[];
  links: Link[];
}

export interface GeminiMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  sources?: { title: string; uri: string }[];
}