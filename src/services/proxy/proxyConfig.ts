
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
    localStorage.setItem(PROXY_URL_KEY, JSON.stringify(config));
    if (config.isEnabled) {
      toast.success('הגדרות פרוקסי נשמרו בהצלחה');
    } else {
      toast.info('פרוקסי מושבת');
    }
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
  return config.isEnabled && config.baseUrl ? config.baseUrl : '';
};

/**
 * Clear proxy configuration
 */
export const clearProxyConfig = (): void => {
  localStorage.removeItem(PROXY_URL_KEY);
  toast.info('הגדרות פרוקסי נמחקו');
};

