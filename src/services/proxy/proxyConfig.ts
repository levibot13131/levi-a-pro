import { toast } from 'sonner';

const PROXY_URL_KEY = 'levi_bot_proxy_url';

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
  
  // Check for environment variable as fallback
  const envProxyUrl = import.meta.env.VITE_PROXY_URL || 'https://tuition-colony-climb-gently.trycloudflare.com';
  
  // If no saved config but we have an env URL, create a default enabled config
  if (envProxyUrl) {
    return {
      baseUrl: envProxyUrl,
      isEnabled: true
    };
  }
  
  return {
    baseUrl: '',
    isEnabled: false
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
  console.log('Current proxy config:', config);
  
  // בדיקה מחמירה יותר שהפרוקסי מוגדר
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
  
  console.log('Proxy not configured or disabled');
  return '';
};

/**
 * Clear proxy configuration
 */
export const clearProxyConfig = (): void => {
  localStorage.removeItem(PROXY_URL_KEY);
  toast.info('הגדרות פרוקסי נמחקו');
  
  // שליחת אירוע ניקוי קונפיגורציה
  window.dispatchEvent(new CustomEvent('proxy-config-changed', {
    detail: { baseUrl: '', isEnabled: false }
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
    // Test the ping endpoint
    const response = await fetch(`${config.baseUrl}/ping`, { 
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      mode: 'cors'
    });

    if (response.ok) {
      console.log('Proxy connection successful');
      return true;
    }
    
    // If ping fails, try a basic OPTIONS request
    const optionsResponse = await fetch(config.baseUrl, { 
      method: 'OPTIONS',
      mode: 'cors'
    });
    
    return optionsResponse.ok;
  } catch (error) {
    console.error('Error testing proxy connection:', error);
    return false;
  }
};

/**
 * Initialize proxy settings from environment or saved config
 */
export const initializeProxySettings = (): void => {
  const envProxyUrl = import.meta.env.VITE_PROXY_URL || 'https://tuition-colony-climb-gently.trycloudflare.com';
  const savedConfig = getProxyConfig();
  
  // If no saved config but we have an env URL, set it up
  if (!savedConfig.baseUrl && envProxyUrl) {
    setProxyConfig({
      baseUrl: envProxyUrl,
      isEnabled: true
    });
    console.log('Proxy initialized from environment:', envProxyUrl);
  } else if (savedConfig.baseUrl) {
    console.log('Using saved proxy configuration:', savedConfig.baseUrl);
  }
};
