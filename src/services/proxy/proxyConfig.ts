
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
    // וידוא שה-URL נקי
    const cleanConfig = {
      ...config,
      baseUrl: config.baseUrl.trim()
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
    
    // שליחת אירוע שינוי קונפיגורציה
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
  console.log('Current proxy config:', config); // הוספנו לוג לדיבאג
  
  // בדיקה מחמירה יותר שהפרוקסי מוגדר
  if (config.isEnabled && config.baseUrl && config.baseUrl.trim().length > 0) {
    // וידוא שהכתובת לא מסתיימת ב-/
    let url = config.baseUrl.trim();
    if (url.endsWith('/')) {
      url = url.slice(0, -1);
    }
    
    // וידוא שיש פרוטוקול
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    
    console.log('Using proxy URL:', url); // הוספנו לוג לדיבאג
    return url;
  }
  
  console.log('Proxy not configured or disabled'); // הוספנו לוג לדיבאג
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
