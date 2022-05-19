import axios, { AxiosRequestConfig, AxiosRequestHeaders } from 'axios';
import { ENDPOINT_GOOGLE_MAPS } from '../settings';

class ApiService {
  private client = axios;

  public async googleGeocoding(config: AxiosRequestConfig) {
      const result = await this.createRequest(ENDPOINT_GOOGLE_MAPS, {}, config);
      return result.data;
  }

  private async createRequest(baseURL: string, headers: AxiosRequestHeaders, config: AxiosRequestConfig) {
    return this.client({ ...config, baseURL, headers: { ...headers, ...(config.headers || {}) } });
  }
}

const apiService = new ApiService();
export default apiService;
