import { apiClient, DATA_MODE } from './client';

export const entityService = {
  async getEntities() {
    if (DATA_MODE === 'demo') {
      return [];
    }
    return apiClient.get<any[]>('/api/v1/intelligence/entities');
  }
};
