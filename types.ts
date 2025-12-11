
export interface CivicIssueAnalysis {
  issueType: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  severityScore: number;
  description: string;
  evidenceSummary: string;
  deepAnalysis: string;
  recommendedAction: string;
  citizenActions: string;
  authorityActions: string;
  complaintLetter: string;
  sessionInsights: string;
  department: string;
  estimatedPriority: string;
}

export interface GeoLocation {
  latitude: number;
  longitude: number;
}
