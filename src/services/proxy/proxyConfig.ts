
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

/**
 * LeviPro Cloud Configuration - No Proxy Required
 * Direct API connections for cloud deployment
 */
export interface ProxyConfig {
  baseUrl: string;
  isEnabled: boolean;
}

/**
 * Get the current configuration - Cloud optimized
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
  
  // Cloud deployment - direct API connections
  return {
    baseUrl: '', // Empty for direct connections
    isEnabled: false // Disabled for cloud deployment
  };
};

/**
 * Set the configuration - Cloud optimized
 */
export const setProxyConfig = (config: ProxyConfig): void => {
  try {
    localStorage.setItem(PROXY_URL_KEY, JSON.stringify(config));
    
    if (config.isEnabled && config.baseUrl) {
      console.log('🌐 External server configured:', config.baseUrl);
      toast.success('🌐 שרת חיצוני הוגדר', {
        description: `כתובת: ${config.baseUrl}`
      });
    } else {
      console.log('☁️ Using direct cloud API connections');
      toast.info('☁️ מתחבר ישירות דרך ענן');
    }
    
    window.dispatchEvent(new CustomEvent('proxy-config-changed', {
      detail: config
    }));
  } catch (error) {
    console.error('Error saving proxy config:', error);
    toast.error('שגיאה בשמירת הגדרות שרת');
  }
};

/**
 * Get the base URL for API requests - Cloud optimized
 */
export const getApiBaseUrl = (): string => {
  const config = getProxyConfig();
  
  // For LeviPro cloud deployment, prefer direct connections
  if (config.isEnabled && config.baseUrl && config.baseUrl.trim().length > 0) {
    let url = config.baseUrl.trim();
    if (url.endsWith('/')) {
      url = url.slice(0, -1);
    }
    
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    
    console.log('🌐 Using configured server URL:', url);
    return url;
  }
  
  // Direct cloud API connections
  console.log('☁️ Using direct cloud API connections');
  return '';
};

/**
 * Clear configuration
 */
export const clearProxyConfig = (): void => {
  localStorage.removeItem(PROXY_URL_KEY);
  toast.info('☁️ חזרה לחיבורים ישירים בענן');
  
  window.dispatchEvent(new CustomEvent('proxy-config-changed', {
    detail: { baseUrl: '', isEnabled: false }
  }));
};

/**
 * Test connection - Cloud optimized
 */
export const testProxyConnection = async (): Promise<boolean> => {
  const config = getProxyConfig();
  
  if (!config.isEnabled) {
    // For direct cloud connections, test a simple external API
    try {
      console.log('🧪 Testing direct cloud API connection...');
      const response = await fetch('https://api.binance.com/api/v3/ping', {
        signal: AbortSignal.timeout(5000)
      });
      
      const success = response.ok;
      if (success) {
        console.log('✅ Direct cloud API connection successful');
      } else {
        console.log('❌ Direct cloud API connection failed');
      }
      return success;
    } catch (error) {
      console.log('❌ Direct cloud API connection error:', error);
      return false;
    }
  }

  if (!config.baseUrl) {
    return false;
  }

  try {
    console.log(`🧪 Testing external server connection to ${config.baseUrl}`);
    
    const tests = [
      fetch(`${config.baseUrl}/ping`, { 
        method: 'GET',
        signal: AbortSignal.timeout(5000)
      }).then(r => r.ok),
      
      fetch(config.baseUrl, { 
        method: 'HEAD',
        signal: AbortSignal.timeout(5000)
      }).then(r => r.ok),
      
      fetch(config.baseUrl, { 
        method: 'GET',
        signal: AbortSignal.timeout(5000)
      }).then(r => r.ok)
    ];

    try {
      const result = await promiseAny(tests);
      console.log('✅ External server connection successful');
      return result;
    } catch (error) {
      console.log('❌ All external server connection tests failed');
      return false;
    }
  } catch (error) {
    console.error('❌ Error testing external server connection:', error);
    return false;
  }
};

/**
 * Initialize for cloud deployment
 */
export const initializeProxySettings = (): void => {
  const config = getProxyConfig();
  
  console.log('☁️ Initializing LeviPro cloud configuration:', {
    cloudMode: !config.isEnabled,
    hasExternalServer: config.isEnabled && !!config.baseUrl
  });
  
  testProxyConnection()
    .then(success => {
      if (success) {
        toast.success('✅ חיבור API פעיל', {
          description: config.isEnabled ? 'שרת חיצוני' : 'חיבורים ישירים בענן'
        });
      } else {
        console.warn('⚠️ API connection issues detected');
      }
    })
    .catch(err => {
      console.error('Error during connection test:', err);
    });
};

/**
 * Cloud health monitoring
 */
export const setupProxyHealthCheck = (intervalMs = 60000): () => void => {
  console.log('☁️ Setting up cloud API health monitoring');
  
  const intervalId = setInterval(async () => {
    const isConnected = await testProxyConnection();
    
    window.dispatchEvent(new CustomEvent('proxy-status-update', {
      detail: { isConnected, cloudMode: !getProxyConfig().isEnabled }
    }));
    
    if (!isConnected) {
      console.warn('⚠️ API health check failed');
    }
  }, intervalMs);
  
  return () => clearInterval(intervalId);
};

// Auto-initialize for cloud deployment
if (typeof window !== 'undefined') {
  initializeProxySettings();
}
