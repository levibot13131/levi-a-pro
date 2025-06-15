import { toast } from 'sonner';

// Custom implementation for Promise.any functionality
const promiseAny = function<T>(promises: Promise<T>[]): Promise<T> {
  return new Promise((resolve, reject) => {
    let errors: any[] = [];
    let settled = 0;

    if (promises.length === 0) {
      reject(new Error('No promises were provided'));
      return;
    }

    promises.forEach((promise, index) => {
      Promise.resolve(promise)
        .then(result => {
          resolve(result);
        })
        .catch(error => {
          errors[index] = error;
          settled++;

          if (settled === promises.length) {
            reject(new Error('All promises were rejected: ' + errors.map(e => String(e)).join(', ')));
          }
        });
    });
  });
};

const PROXY_URL_KEY = 'levi_bot_proxy_url';
const DEFAULT_EXTERNAL_SERVER = 'https://api.binance.com'; // Direct API connection

/**
 * Default proxy configuration
 */
export interface ProxyConfig {
  baseUrl: string;
  isEnabled: boolean;
}

/**
 * Get the current proxy configuration
 */
export const getProxyConfig = (): ProxyConfig => {
  try {
    const savedConfig = localStorage.getItem(PROXY_URL_KEY);
    if (savedConfig) {
      return JSON.parse(savedConfig);
    }
  } catch (error) {
    console.error('Error parsing proxy config:', error);
  }
  
  // Use direct API connection by default
  return {
    baseUrl: DEFAULT_EXTERNAL_SERVER,
    isEnabled: false // Disabled by default for direct connection
  };
};

/**
 * Set the proxy configuration
 */
export const setProxyConfig = (config: ProxyConfig): void => {
  try {
    let finalUrl = config.baseUrl.trim();

    if (finalUrl && !finalUrl.startsWith('http')) {
      finalUrl = `https://${finalUrl}`;
    }

    if (finalUrl && finalUrl.endsWith('/')) {
      finalUrl = finalUrl.slice(0, -1);
    }
    
    const cleanConfig = {
      ...config,
      baseUrl: finalUrl
    };
    
    localStorage.setItem(PROXY_URL_KEY, JSON.stringify(cleanConfig));
    
    if (config.isEnabled) {
      console.log('External server enabled with URL:', cleanConfig.baseUrl);
      toast.success('שרת חיצוני הופעל', {
        description: `כתובת: ${cleanConfig.baseUrl}`
      });
    } else {
      console.log('Using direct API connections');
      toast.info('מתחבר ישירות ל-API');
    }
    
    window.dispatchEvent(new CustomEvent('proxy-config-changed', {
      detail: cleanConfig
    }));
  } catch (error) {
    console.error('Error saving proxy config:', error);
    toast.error('שגיאה בשמירת הגדרות שרת');
  }
};

/**
 * Get the base URL for API requests
 */
export const getApiBaseUrl = (): string => {
  const config = getProxyConfig();
  
  if (config.isEnabled && config.baseUrl && config.baseUrl.trim().length > 0) {
    let url = config.baseUrl.trim();
    if (url.endsWith('/')) {
      url = url.slice(0, -1);
    }
    
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    
    console.log('Using external server URL:', url);
    return url;
  }
  
  // Return direct API base for external connections
  console.log('Using direct API connection');
  return '';
};

/**
 * Clear proxy configuration
 */
export const clearProxyConfig = (): void => {
  localStorage.removeItem(PROXY_URL_KEY);
  toast.info('הגדרות שרת נמחקו');
  
  window.dispatchEvent(new CustomEvent('proxy-config-changed', {
    detail: { baseUrl: DEFAULT_EXTERNAL_SERVER, isEnabled: false }
  }));
};

/**
 * האזנה לשינויים בהגדרות הפרוקסי
 */
export const listenToProxyChanges = (callback: (config: ProxyConfig) => void): () => void => {
  const handleChange = (event: Event) => {
    const customEvent = event as CustomEvent<ProxyConfig>;
    const newConfig = customEvent.detail || getProxyConfig();
    callback(newConfig);
  };
  
  window.addEventListener('proxy-config-changed', handleChange);
  
  return () => {
    window.removeEventListener('proxy-config-changed', handleChange);
  };
};

/**
 * בדיקה האם הפרוקסי פעיל ומוגדר
 */
export const isProxyConfigured = (): boolean => {
  const config = getProxyConfig();
  return config.isEnabled && !!config.baseUrl && config.baseUrl.trim().length > 0;
};

/**
 * קבלת סטטוס הקונפיגורציה של הפרוקסי
 */
export const getProxyStatus = (): { isEnabled: boolean; hasUrl: boolean } => {
  const config = getProxyConfig();
  return {
    isEnabled: config.isEnabled,
    hasUrl: !!config.baseUrl?.trim()
  };
};

/**
 * Get the full URL for an API endpoint
 * @param endpoint The API endpoint path (e.g., '/binance/ticker')
 * @returns The full URL with the proxy base URL
 */
export const getProxyUrl = (endpoint: string): string => {
  const baseUrl = getApiBaseUrl();
  
  if (!baseUrl) {
    // Return the endpoint for direct API calls
    return endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  }
  
  if (endpoint && !endpoint.startsWith('/')) {
    endpoint = '/' + endpoint;
  }
  
  return `${baseUrl}${endpoint}`;
};

/**
 * Build a full URL for direct proxy pass-through
 * For use with /proxy?url= pattern
 */
export const buildProxyPassthroughUrl = (targetUrl: string): string => {
  const baseUrl = getApiBaseUrl();
  
  if (!baseUrl) {
    return targetUrl; // Return original URL if no proxy is configured
  }
  
  // Encode the target URL to ensure it's properly transmitted
  const encodedUrl = encodeURIComponent(targetUrl);
  
  return `${baseUrl}/proxy?url=${encodedUrl}`;
};

/**
 * Check if the proxy configuration is valid and the server is responding
 */
export const testProxyConnection = async (): Promise<boolean> => {
  const config = getProxyConfig();
  
  if (!config.isEnabled) {
    // For direct connections, test a simple API call
    try {
      const response = await fetch('https://api.binance.com/api/v3/ping', {
        signal: AbortSignal.timeout(5000)
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  if (!config.baseUrl) {
    return false;
  }

  try {
    console.log(`Testing external server connection to ${config.baseUrl}`);
    
    const pingTest = fetch(`${config.baseUrl}/ping`, { 
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(5000)
    }).then(response => response.ok);
    
    const headTest = fetch(config.baseUrl, { 
      method: 'HEAD',
      signal: AbortSignal.timeout(5000)
    }).then(response => response.ok);
    
    const getTest = fetch(config.baseUrl, { 
      method: 'GET',
      signal: AbortSignal.timeout(5000)
    }).then(response => response.ok);
    
    const optionsTest = fetch(config.baseUrl, { 
      method: 'OPTIONS',
      signal: AbortSignal.timeout(5000)
    }).then(response => response.ok);

    try {
      const result = await promiseAny([pingTest, headTest, getTest, optionsTest]);
      return result;
    } catch (error) {
      console.log('All external server test methods failed');
      return false;
    }
  } catch (error) {
    console.error('Error testing external server connection:', error);
    return false;
  }
};

/**
 * Initialize proxy settings from environment or saved config
 */
export const initializeProxySettings = (): void => {
  const savedConfig = getProxyConfig();
  
  console.log('Initializing with configuration:', savedConfig);
  
  testProxyConnection()
    .then(success => {
      console.log(`Initial connection test: ${success ? 'SUCCESS' : 'FAILED'}`);
      if (success) {
        toast.success('חיבור לשרת אומת', {
          description: 'שירותים חיצוניים מחוברים'
        });
      } else {
        toast.warning('בעיה בחיבור לשרת', {
          description: 'בדוק הגדרות חיבור'
        });
      }
    })
    .catch(err => {
      console.error('Error during initial connection test:', err);
    });
};

/**
 * Setup a periodic health check for the proxy
 */
export const setupProxyHealthCheck = (intervalMs = 60000): () => void => {
  console.log(`Setting up connection health check every ${intervalMs}ms`);
  
  const intervalId = setInterval(async () => {
    const isConnected = await testProxyConnection();
    
    window.dispatchEvent(new CustomEvent('proxy-status-update', {
      detail: { isConnected }
    }));
    
    if (!isConnected) {
      console.warn('Connection health check failed');
      if (localStorage.getItem('proxy_was_working') === 'true') {
        toast.error('חיבור לשרת אבד', {
          description: 'בדוק רשת והגדרות חיבור'
        });
      }
      localStorage.setItem('proxy_was_working', 'false');
    } else {
      console.log('Connection health check passed');
      localStorage.setItem('proxy_was_working', 'true');
    }
  }, intervalMs);
  
  return () => clearInterval(intervalId);
};
