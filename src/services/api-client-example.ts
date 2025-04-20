import axios from 'axios';
import { getProxyUrl, buildProxyPassthroughUrl, isProxyConfigured, getApiBaseUrl } from './proxy/proxyConfig';

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
  
  // Log full request details in development
  if (process.env.NODE_ENV === 'development') {
    console.log('Full request config:', {
      url: config.url,
      method: config.method,
      headers: config.headers,
      params: config.params
    });
  }
  
  return config;
}, (error) => {
  console.error('Request interceptor error:', error);
  return Promise.reject(error);
});

// Add a response interceptor for better error handling
apiInstance.interceptors.response.use((response) => {
  return response;
}, (error) => {
  if (error.response) {
    console.error(`API error response (${error.config?.url}):`, {
      status: error.response.status,
      data: error.response.data,
      headers: error.response.headers
    });
  } else if (error.request) {
    console.error(`API no response (${error.config?.url}):`, error.request);
  } else {
    console.error(`API request error:`, error.message);
  }
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
    
    // Always use proxy if not explicitly disabled
    const useProxy = opts.useProxy !== false;
    
    if (useProxy) {
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
  },
  
  // 5. Test connection to any endpoint
  async testConnection(url: string): Promise<boolean> {
    try {
      // Create AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const response = await axios.get(url, { 
        signal: controller.signal,
        headers: { 'Accept': 'application/json' }
      });
      
      clearTimeout(timeoutId);
      return response.status === 200;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  },
  
  // 6. Test the proxy connection directly
  async testProxyConnection(): Promise<boolean> {
    const baseUrl = getApiBaseUrl();
    try {
      // Try ping endpoint
      const pingUrl = `${baseUrl}/ping`;
      console.log(`Testing proxy ping: ${pingUrl}`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const response = await axios.get(pingUrl, { 
        signal: controller.signal,
        headers: { 'Accept': 'application/json' }
      });
      
      clearTimeout(timeoutId);
      
      console.log(`Proxy ping response:`, response.status, response.data);
      return response.status === 200;
    } catch (error) {
      console.error('Proxy ping test failed:', error);
      
      // Try root endpoint as fallback
      try {
        const rootUrl = getApiBaseUrl();
        console.log(`Testing proxy root: ${rootUrl}`);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        
        const rootResponse = await axios.get(rootUrl, { 
          signal: controller.signal 
        });
        
        clearTimeout(timeoutId);
        
        console.log(`Proxy root response:`, rootResponse.status);
        return rootResponse.status === 200;
      } catch (rootError) {
        console.error('Proxy root test also failed:', rootError);
        return false;
      }
    }
  }
};

// Export the axios instance for direct use
export { apiInstance };
