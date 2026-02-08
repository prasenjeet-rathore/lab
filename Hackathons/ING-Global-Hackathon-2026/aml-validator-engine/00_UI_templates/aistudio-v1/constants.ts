import { CaseData, GraphData, Transaction, CaseSummary } from "./types";

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 'TXN-9821', date: '2023-10-24 14:20', amount: 150000.00, currency: 'USD', sender: 'Global Ventures Ltd', receiver: 'Shell Corp A', type: 'SWIFT', status: 'FLAGGED', riskScore: 92 },
  { id: 'TXN-9822', date: '2023-10-24 14:25', amount: 45000.00, currency: 'USD', sender: 'Global Ventures Ltd', receiver: 'Offshore Holdings', type: 'WIRE', status: 'COMPLETED', riskScore: 78 },
  { id: 'TXN-9823', date: '2023-10-25 09:10', amount: 12500.00, currency: 'EUR', sender: 'Global Ventures Ltd', receiver: 'Tech Soft Solutions', type: 'ACH', status: 'COMPLETED', riskScore: 45 },
  { id: 'TXN-9824', date: '2023-10-25 11:00', amount: 200000.00, currency: 'USD', sender: 'Unknown Entity', receiver: 'Global Ventures Ltd', type: 'WIRE', status: 'FLAGGED', riskScore: 95 },
  { id: 'TXN-9825', date: '2023-10-26 16:45', amount: 9900.00, currency: 'USD', sender: 'Global Ventures Ltd', receiver: 'Individual A', type: 'ACH', status: 'COMPLETED', riskScore: 60 },
  { id: 'TXN-9826', date: '2023-10-26 16:46', amount: 9900.00, currency: 'USD', sender: 'Global Ventures Ltd', receiver: 'Individual B', type: 'ACH', status: 'COMPLETED', riskScore: 60 },
];

export const MOCK_CASE: CaseData = {
  id: 'AML-2023-8842',
  entityName: 'Global Ventures Ltd',
  riskLevel: 'HIGH',
  slaDeadline: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(), // 4 hours from now
  riskScore: 94,
  topRiskDrivers: [
    { name: 'Transaction Velocity', value: 85 },
    { name: 'Structuring (Smurfing)', value: 72 },
    { name: 'High-Risk Jurisdiction', value: 65 },
    { name: 'New Beneficiaries', value: 45 },
    { name: 'Round Amounts', value: 30 },
  ],
  transactions: MOCK_TRANSACTIONS,
};

export const MOCK_GRAPH_DATA: GraphData = {
  nodes: [
    { id: 'Global Ventures Ltd', group: 1, val: 20, label: 'Global Ventures', risk: 0.9 },
    { id: 'Shell Corp A', group: 2, val: 10, label: 'Shell Corp A', risk: 0.8 },
    { id: 'Offshore Holdings', group: 2, val: 10, label: 'Offshore Holdings', risk: 0.7 },
    { id: 'Tech Soft Solutions', group: 3, val: 5, label: 'Tech Soft', risk: 0.2 },
    { id: 'Unknown Entity', group: 4, val: 15, label: 'Unknown', risk: 0.95 },
    { id: 'Individual A', group: 5, val: 5, label: 'Ind. A', risk: 0.4 },
    { id: 'Individual B', group: 5, val: 5, label: 'Ind. B', risk: 0.4 },
  ],
  links: [
    { source: 'Global Ventures Ltd', target: 'Shell Corp A', value: 5 },
    { source: 'Global Ventures Ltd', target: 'Offshore Holdings', value: 3 },
    { source: 'Global Ventures Ltd', target: 'Tech Soft Solutions', value: 1 },
    { source: 'Unknown Entity', target: 'Global Ventures Ltd', value: 8 },
    { source: 'Global Ventures Ltd', target: 'Individual A', value: 1 },
    { source: 'Global Ventures Ltd', target: 'Individual B', value: 1 },
  ]
};

export const MOCK_CASES_LIST: CaseSummary[] = [
  { id: 'AML-2023-8842', entityName: 'Global Ventures Ltd', riskLevel: 'HIGH', status: 'IN_REVIEW', dateOpened: '2023-10-24', analyst: 'Sarah Jenkins', type: 'AML' },
  { id: 'AML-2023-8843', entityName: 'Nexus Holdings', riskLevel: 'MEDIUM', status: 'OPEN', dateOpened: '2023-10-25', analyst: 'Unassigned', type: 'AML' },
  { id: 'KYC-2023-1002', entityName: 'John Doe', riskLevel: 'LOW', status: 'CLOSED', dateOpened: '2023-10-20', analyst: 'Mike Ross', type: 'KYC' },
  { id: 'FRD-2023-5591', entityName: 'FastPay Systems', riskLevel: 'HIGH', status: 'IN_REVIEW', dateOpened: '2023-10-26', analyst: 'Sarah Jenkins', type: 'FRAUD' },
  { id: 'AML-2023-8845', entityName: 'Offshore Trust A', riskLevel: 'HIGH', status: 'OPEN', dateOpened: '2023-10-27', analyst: 'Unassigned', type: 'AML' },
  { id: 'KYC-2023-1005', entityName: 'Alice Smith', riskLevel: 'LOW', status: 'CLOSED', dateOpened: '2023-10-18', analyst: 'Mike Ross', type: 'KYC' },
  { id: 'AML-2023-8849', entityName: 'Shell Partners LLP', riskLevel: 'HIGH', status: 'OPEN', dateOpened: '2023-10-28', analyst: 'Unassigned', type: 'AML' },
  { id: 'FRD-2023-5602', entityName: 'Crypto King', riskLevel: 'MEDIUM', status: 'IN_REVIEW', dateOpened: '2023-10-28', analyst: 'David Kim', type: 'FRAUD' },
];