import { toast } from 'sonner';

const PROXY_URL_KEY = 'levi_bot_proxy_url';
const DEFAULT_PROXY_URL = 'https://tuition-colony-climb-gently.trycloudflare.com';

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
  
  // Always use the Cloudflare URL as fallback
  return {
    baseUrl: DEFAULT_PROXY_URL,
    isEnabled: true
  };
};

/**
 * Set the proxy configuration
 */
export const setProxyConfig = (config: ProxyConfig): void => {
  try {
    // Clean the URL
    let finalUrl = config.baseUrl.trim();

    // Ensure protocol
    if (finalUrl && !finalUrl.startsWith('http')) {
      finalUrl = `https://${finalUrl}`;
    }

    // Remove trailing slash
    if (finalUrl && finalUrl.endsWith('/')) {
      finalUrl = finalUrl.slice(0, -1);
    }
    
    const cleanConfig = {
      ...config,
      baseUrl: finalUrl
    };
    
    localStorage.setItem(PROXY_URL_KEY, JSON.stringify(cleanConfig));
    
    if (config.isEnabled) {
      console.log('Proxy enabled with URL:', cleanConfig.baseUrl);
      toast.success('הפרוקסי הופעל', {
        description: `כתובת: ${cleanConfig.baseUrl}`
      });
    } else {
      console.log('Proxy disabled');
      toast.info('הפרוקסי הושבת');
    }
    
    // Dispatch configuration change event
    window.dispatchEvent(new CustomEvent('proxy-config-changed', {
      detail: cleanConfig
    }));
  } catch (error) {
    console.error('Error saving proxy config:', error);
    toast.error('שגיאה בשמירת הגדרות פרוקסי');
  }
};

/**
 * Get the base URL for API requests
 */
export const getApiBaseUrl = (): string => {
  const config = getProxyConfig();
  
  // הבדיקה מחמירה יותר שהפרוקסי מוגדר
  if (config.isEnabled && config.baseUrl && config.baseUrl.trim().length > 0) {
    // וידוא שהכתובת נקייה
    let url = config.baseUrl.trim();
    if (url.endsWith('/')) {
      url = url.slice(0, -1);
    }
    
    // וידוא שיש פרוטוקול
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    
    console.log('Using proxy URL:', url);
    return url;
  }
  
  // אם אין פרוקסי, נחזיר את ברירת המחדל
  console.log('No custom proxy configured, using default:', DEFAULT_PROXY_URL);
  return DEFAULT_PROXY_URL;
};

/**
 * Clear proxy configuration
 */
export const clearProxyConfig = (): void => {
  localStorage.removeItem(PROXY_URL_KEY);
  toast.info('הגדרות פרוקסי נמחקו');
  
  // שליחת אירוע ניקוי קונפיגורציה
  window.dispatchEvent(new CustomEvent('proxy-config-changed', {
    detail: { baseUrl: DEFAULT_PROXY_URL, isEnabled: true }
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
    return endpoint; // Return original endpoint if no proxy is configured
  }
  
  // Ensure endpoint starts with a slash if not empty
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
  if (!config.isEnabled || !config.baseUrl) {
    return false;
  }

  try {
    console.log(`Testing proxy connection to ${config.baseUrl}`);
    
    // Use multiple methods to test proxy connection with Promise.any
    const testMethods = [
      // Method 1: Try ping endpoint
      fetch(`${config.baseUrl}/ping`, { 
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        mode: 'cors',
        signal: AbortSignal.timeout(5000) // 5 second timeout
      }).then(response => {
        console.log('Ping test response:', response.status);
        return response.ok;
      }),
      
      // Method 2: Try a simple HEAD request
      fetch(config.baseUrl, { 
        method: 'HEAD',
        mode: 'cors',
        signal: AbortSignal.timeout(5000) // 5 second timeout
      }).then(response => {
        console.log('HEAD test response:', response.status);
        return response.ok;
      }),
      
      // Method 3: Try a simple GET request
      fetch(config.baseUrl, { 
        method: 'GET',
        mode: 'cors',
        signal: AbortSignal.timeout(5000) // 5 second timeout
      }).then(response => {
        console.log('GET test response:', response.status);
        return response.ok;
      }),
      
      // Method 4: Try OPTIONS request
      fetch(config.baseUrl, { 
        method: 'OPTIONS',
        mode: 'cors',
        signal: AbortSignal.timeout(5000) // 5 second timeout
      }).then(response => {
        console.log('OPTIONS test response:', response.status);
        return response.ok;
      })
    ];
    
    // Wait for the first successful method or all to fail
    try {
      const result = await Promise.any(testMethods);
      return result;
    } catch (error) {
      console.log('All proxy test methods failed');
      return false;
    }
  } catch (error) {
    console.error('Error testing proxy connection:', error);
    return false;
  }
};

/**
 * Initialize proxy settings from environment or saved config
 */
export const initializeProxySettings = (): void => {
  const savedConfig = getProxyConfig();
  
  // Always set the Cloudflare URL as default if nothing is saved
  if (!savedConfig.baseUrl) {
    setProxyConfig({
      baseUrl: DEFAULT_PROXY_URL,
      isEnabled: true
    });
    console.log('Proxy initialized with default Cloudflare URL:', DEFAULT_PROXY_URL);
  } else {
    console.log('Using saved proxy configuration:', savedConfig);
  }
  
  // Test the connection on initialization
  testProxyConnection()
    .then(success => {
      console.log(`Initial proxy test: ${success ? 'SUCCESS' : 'FAILED'}`);
      if (success) {
        toast.success('Proxy connection verified', {
          description: 'External services are now connected'
        });
      } else {
        // Try once more with default URL if custom URL fails
        if (savedConfig.baseUrl !== DEFAULT_PROXY_URL) {
          console.log('Custom proxy failed, trying default Cloudflare URL');
          setProxyConfig({
            baseUrl: DEFAULT_PROXY_URL,
            isEnabled: true
          });
          
          // Test the default proxy
          setTimeout(() => {
            testProxyConnection()
              .then(defaultSuccess => {
                console.log(`Default proxy test: ${defaultSuccess ? 'SUCCESS' : 'FAILED'}`);
                if (defaultSuccess) {
                  toast.success('Default proxy connection verified', {
                    description: 'Using default Cloudflare proxy for external services'
                  });
                } else {
                  toast.error('Error connecting to proxy', {
                    description: 'All proxy connection attempts failed'
                  });
                }
              });
          }, 1000);
        }
      }
    })
    .catch(err => {
      console.error('Error during initial proxy test:', err);
    });
};

/**
 * Setup a periodic health check for the proxy
 */
export const setupProxyHealthCheck = (intervalMs = 60000): () => void => {
  console.log(`Setting up proxy health check every ${intervalMs}ms`);
  
  const intervalId = setInterval(async () => {
    const isConnected = await testProxyConnection();
    
    // Dispatch status event
    window.dispatchEvent(new CustomEvent('proxy-status-update', {
      detail: { isConnected }
    }));
    
    if (!isConnected) {
      console.warn('Proxy health check failed, connection may be down');
      // Only show toast if proxy was previously working (avoid spam)
      if (localStorage.getItem('proxy_was_working') === 'true') {
        toast.error('Proxy connection lost', {
          description: 'Check network and proxy settings'
        });
      }
      localStorage.setItem('proxy_was_working', 'false');
    } else {
      console.log('Proxy health check passed');
      localStorage.setItem('proxy_was_working', 'true');
    }
  }, intervalMs);
  
  // Return cleanup function
  return () => clearInterval(intervalId);
};
