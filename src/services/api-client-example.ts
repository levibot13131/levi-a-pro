
import axios from 'axios';
import { getProxyUrl, buildProxyPassthroughUrl, isProxyConfigured } from './proxy/proxyConfig';

// Create an axios instance for API requests
const apiInstance = axios.create({
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Add a request interceptor to handle API keys and other headers
apiInstance.interceptors.request.use((config) => {
  // Add any common headers or authentication here
  console.log(`Sending request to: ${config.url}`);
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Example API client using the proxy
export const apiClient = {
  // 1. Direct endpoint approach - use with dedicated proxy endpoints
  async getBinanceData(endpoint: string, params?: Record<string, any>, apiKey?: string) {
    const url = getProxyUrl(`/binance${endpoint}`);
    const headers: Record<string, string> = {};
    
    // Add API key to headers if provided
    if (apiKey) {
      headers['X-MBX-APIKEY'] = apiKey;
    }
    
    console.log(`Making Binance request to: ${url}`);
    
    try {
      const response = await apiInstance.get(url, { 
        params,
        headers
      });
      
      return response.data;
    } catch (error) {
      console.error(`Binance API error (${endpoint}):`, error);
      throw error;
    }
  },
  
  // 2. Pass-through approach - use with generic proxy endpoint
  async getExternalData(targetUrl: string) {
    const url = buildProxyPassthroughUrl(targetUrl);
    console.log(`Fetching external data via proxy: ${url}`);
    
    try {
      const response = await apiInstance.get(url);
      return response.data;
    } catch (error) {
      console.error(`External API error (${targetUrl}):`, error);
      throw error;
    }
  },
  
  // 3. Authenticated request example
  async getAuthenticatedData(endpoint: string, apiKey: string) {
    const url = getProxyUrl(endpoint);
    console.log(`Making authenticated request to: ${url}`);
    
    try {
      const response = await apiInstance.get(url, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'X-API-KEY': apiKey
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Authenticated API error (${endpoint}):`, error);
      throw error;
    }
  },
  
  // 4. Flexible request method for any external API
  async request(method: 'GET' | 'POST' | 'PUT' | 'DELETE', url: string, options?: {
    params?: Record<string, any>,
    data?: any,
    headers?: Record<string, string>,
    useProxy?: boolean
  }) {
    const opts = options || {};
    let requestUrl = url;
    
    // Use proxy if specified or if globally enabled
    if (opts.useProxy !== false && isProxyConfigured()) {
      requestUrl = url.startsWith('http') 
        ? buildProxyPassthroughUrl(url) 
        : getProxyUrl(url);
      
      console.log(`Using proxy for request to: ${url} => ${requestUrl}`);
    } else {
      console.log(`Direct request to: ${url} (proxy bypassed)`);
    }
    
    try {
      const response = await apiInstance.request({
        method,
        url: requestUrl,
        params: opts.params,
        data: opts.data,
        headers: opts.headers
      });
      
      return response.data;
    } catch (error) {
      console.error(`API ${method} request failed:`, error);
      throw error;
    }
  }
};

// Export the axios instance for direct use
export { apiInstance };
