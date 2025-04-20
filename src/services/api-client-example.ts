
import axios from 'axios';
import { getProxyUrl, buildProxyPassthroughUrl, isProxyConfigured, getApiBaseUrl } from './proxy/proxyConfig';
import { toast } from 'sonner';

// Create an axios instance for API requests
const apiInstance = axios.create({
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Retry configuration
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

// Add a request interceptor to handle API keys and other headers
apiInstance.interceptors.request.use((config) => {
  // Add retry count to config if not present
  if (config.headers && typeof config.headers['x-retry-count'] === 'undefined') {
    config.headers['x-retry-count'] = 0;
  }
  
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

// Add a response interceptor for better error handling and retry logic
apiInstance.interceptors.response.use((response) => {
  return response;
}, async (error) => {
  const config = error.config;
  
  // Skip retry for specific error codes or if we already retried too many times
  if (!config || 
      !config.headers || 
      config.headers['x-retry-count'] >= MAX_RETRIES ||
      (error.response && error.response.status === 401) || // Don't retry auth errors
      (error.response && error.response.status === 403)) { // Don't retry forbidden errors
    
    // Log error details
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
  }
  
  // Increment retry count
  const retryCount = config.headers['x-retry-count'] + 1;
  config.headers['x-retry-count'] = retryCount;
  
  console.log(`Retrying request to ${config.url} (attempt ${retryCount}/${MAX_RETRIES})`);
  
  // Wait before retrying
  await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * retryCount));
  
  // Return the retry request
  return apiInstance(config);
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
    useProxy?: boolean,
    retries?: number
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
      const customHeaders = {
        ...opts.headers,
        'x-retry-count': 0
      };
      
      if (opts.retries) {
        customHeaders['x-max-retries'] = opts.retries.toString();
      }
      
      const response = await apiInstance.request({
        method,
        url: requestUrl,
        params: opts.params,
        data: opts.data,
        headers: customHeaders
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
  
  // 6. Test the proxy connection directly with retries
  async testProxyConnection(): Promise<boolean> {
    const baseUrl = getApiBaseUrl();
    let success = false;
    let attemptCount = 0;
    const maxAttempts = 3;
    
    while (!success && attemptCount < maxAttempts) {
      attemptCount++;
      
      try {
        // Try ping endpoint first
        const pingUrl = `${baseUrl}/ping`;
        console.log(`Testing proxy ping (attempt ${attemptCount}): ${pingUrl}`);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 7000);
        
        try {
          const response = await axios.get(pingUrl, { 
            signal: controller.signal,
            headers: { 'Accept': 'application/json' }
          });
          
          clearTimeout(timeoutId);
          
          console.log(`Proxy ping response:`, response.status, response.data);
          if (response.status === 200) {
            return true;
          }
        } catch (pingError) {
          console.warn('Ping test failed, trying root endpoint...');
          clearTimeout(timeoutId);
        }
        
        // Try root endpoint as fallback
        const rootUrl = getApiBaseUrl();
        console.log(`Testing proxy root: ${rootUrl}`);
        
        const rootController = new AbortController();
        const rootTimeoutId = setTimeout(() => rootController.abort(), 7000);
        
        try {
          const rootResponse = await axios.get(rootUrl, { 
            signal: rootController.signal 
          });
          
          clearTimeout(rootTimeoutId);
          
          console.log(`Proxy root response:`, rootResponse.status);
          if (rootResponse.status === 200) {
            return true;
          }
        } catch (rootError) {
          console.warn('Root test failed, trying HEAD request...');
          clearTimeout(rootTimeoutId);
        }
        
        // Try HEAD request as last resort
        const headController = new AbortController();
        const headTimeoutId = setTimeout(() => headController.abort(), 7000);
        
        try {
          const headResponse = await axios.head(rootUrl, { 
            signal: headController.signal 
          });
          
          clearTimeout(headTimeoutId);
          
          console.log(`Proxy HEAD response:`, headResponse.status);
          if (headResponse.status === 200 || headResponse.status === 204) {
            return true;
          }
        } catch (headError) {
          console.warn('HEAD test failed');
          clearTimeout(headTimeoutId);
          
          // If this is the last attempt, show a warning
          if (attemptCount === maxAttempts) {
            toast.warning('פרוקסי לא מגיב באופן תקין', {
              description: 'ייתכן וחלק מהפונקציות לא יעבדו כראוי'
            });
          }
        }
      } catch (error) {
        console.error(`Proxy test attempt ${attemptCount} failed:`, error);
      }
      
      // Wait before retrying
      if (!success && attemptCount < maxAttempts) {
        console.log(`Waiting before retry ${attemptCount + 1}...`);
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    
    return false;
  }
};

// Export the axios instance for direct use
export { apiInstance };
