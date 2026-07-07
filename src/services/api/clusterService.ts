import { apiClient, DATA_MODE } from './client';

export const clusterService = {
  async getClusters() {
    if (DATA_MODE === 'demo') {
      return [];
    }
    return apiClient.get<any>('/api/v1/clusters/');
  },
  
  async getClusterDetail(clusterId: string) {
    if (DATA_MODE === 'demo') {
      return null;
    }
    return apiClient.get<any>(`/api/v1/clusters/${clusterId}`);
  }
};
