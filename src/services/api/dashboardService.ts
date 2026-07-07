import { apiClient, DATA_MODE } from './client';

export const dashboardService = {
  async getMetrics() {
    if (DATA_MODE === 'demo') {
      return {
        active_high_risk_cases: 142,
        reports_today: 847,
        suspicious_entities_tracked: 3240,
        emerging_clusters: 18,
        average_risk_score: 72.5
      };
    }
    return apiClient.get<any>('/api/v1/dashboard/metrics');
  },
  
  async getCharts() {
    if (DATA_MODE === 'demo') {
      return {
        reports_over_time: [
          { date: 'Mon', count: 400 },
          { date: 'Tue', count: 300 },
          { date: 'Wed', count: 550 },
          { date: 'Thu', count: 450 },
          { date: 'Fri', count: 600 },
          { date: 'Sat', count: 800 },
          { date: 'Sun', count: 750 },
        ],
        scam_type_distribution: [
          { type: 'Digital Arrest', count: 35 },
          { type: 'OTP Theft', count: 25 },
          { type: 'UPI Fraud', count: 20 },
          { type: 'Investment', count: 15 },
          { type: 'Other', count: 5 },
        ]
      };
    }
    return apiClient.get<any>('/api/v1/dashboard/charts');
  }
};
