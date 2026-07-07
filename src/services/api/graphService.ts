import { apiClient, DATA_MODE } from './client';

export const graphService = {
  async getGraph() {
    if (DATA_MODE === 'demo') {
      return { nodes: [], links: [] };
    }
    return apiClient.get<any>('/api/v1/intelligence/graph');
  }
};
