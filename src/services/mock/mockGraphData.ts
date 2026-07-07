export const mockGraphElements = [
  // Nodes: Cases
  { data: { id: 'case-101', label: 'Case 101', type: 'case', risk: 94, cluster: 'FC-019' } },
  { data: { id: 'case-114', label: 'Case 114', type: 'case', risk: 88, cluster: 'FC-019' } },
  { data: { id: 'case-132', label: 'Case 132', type: 'case', risk: 75, cluster: 'FC-004' } },
  { data: { id: 'case-147', label: 'Case 147', type: 'case', risk: 45, cluster: 'FC-004' } },
  { data: { id: 'case-150', label: 'Case 150', type: 'case', risk: 90, cluster: 'FC-019' } },
  
  // Nodes: Entities
  { data: { id: 'phone-1', label: '+91 •••• 3210', type: 'phone', risk: 85, cluster: 'FC-019' } },
  { data: { id: 'phone-2', label: '+91 •••• 8841', type: 'phone', risk: 60, cluster: 'FC-004' } },
  { data: { id: 'upi-1', label: 'suspicious@upi', type: 'upi', risk: 95, cluster: 'FC-019' } },
  { data: { id: 'bank-1', label: 'Acct •••• 5678', type: 'bank', risk: 70, cluster: 'FC-004' } },
  { data: { id: 'domain-1', label: 'secure-verification.net', type: 'domain', risk: 90, cluster: 'FC-019' } },
  { data: { id: 'loc-1', label: 'Delhi', type: 'location', risk: 50, cluster: 'FC-019' } },
  
  // Edges: Relationships
  { data: { source: 'case-101', target: 'phone-1', label: 'used_by' } },
  { data: { source: 'case-114', target: 'phone-1', label: 'used_by' } },
  { data: { source: 'case-150', target: 'phone-1', label: 'used_by' } },
  
  { data: { source: 'case-101', target: 'upi-1', label: 'payment_to' } },
  { data: { source: 'case-114', target: 'upi-1', label: 'payment_to' } },
  
  { data: { source: 'phone-1', target: 'domain-1', label: 'registered' } },
  { data: { source: 'upi-1', target: 'loc-1', label: 'accessed_from' } },
  
  { data: { source: 'case-132', target: 'phone-2', label: 'used_by' } },
  { data: { source: 'case-147', target: 'phone-2', label: 'used_by' } },
  { data: { source: 'case-147', target: 'bank-1', label: 'payment_to' } },
  
  // Bridge entity connecting two clusters
  { data: { source: 'phone-2', target: 'domain-1', label: 'shared_infra' } },
];
