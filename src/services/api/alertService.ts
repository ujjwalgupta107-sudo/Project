import { apiClient, DATA_MODE } from './client';

export const alertService = {
  async getAlerts() {
    if (DATA_MODE === 'demo') {
      return [
        { id: '1', title: 'New High-Risk Digital Arrest Pattern', severity: 'CRITICAL', created_at: new Date().toISOString() },
        { id: '2', title: 'Payment Endpoint Reused', severity: 'HIGH', created_at: new Date(Date.now() - 3600000).toISOString() },
      ];
    }
    return apiClient.get<any>('/api/v1/alerts/');
  }
};
