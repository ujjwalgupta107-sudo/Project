import { apiClient, DATA_MODE } from './client';

export const geoService = {
  async getGeoData() {
    if (DATA_MODE === 'demo') {
      return [];
    }
    return apiClient.get<any>('/api/v1/geo/hotspots');
  }
};
