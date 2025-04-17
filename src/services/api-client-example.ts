
import axios from 'axios';
import { getProxyUrl, buildProxyPassthroughUrl } from './proxy/proxyConfig';

// Example API client using the proxy
export const apiClient = {
  // 1. Direct endpoint approach - use with dedicated proxy endpoints
  async getBinanceData(endpoint: string, params?: Record<string, any>) {
    const url = getProxyUrl(`/binance${endpoint}`);
    const response = await axios.get(url, { params });
    return response.data;
  },
  
  // 2. Pass-through approach - use with generic proxy endpoint
  async getExternalData(targetUrl: string) {
    const url = buildProxyPassthroughUrl(targetUrl);
    const response = await axios.get(url);
    return response.data;
  },
  
  // 3. Authenticated request example
  async getAuthenticatedData(endpoint: string, apiKey: string) {
    const url = getProxyUrl(endpoint);
    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'X-API-KEY': apiKey
      }
    });
    return response.data;
  }
};
