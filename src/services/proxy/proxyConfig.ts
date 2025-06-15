
// Proxy configuration service for handling external API requests

export interface ProxyConfig {
  isEnabled: boolean;
  baseUrl: string;
}

// Default proxy configuration
const DEFAULT_PROXY: ProxyConfig = {
  isEnabled: true,
  baseUrl: 'https://api.binance.com' // Fallback to direct API
};

let currentProxyConfig: ProxyConfig = { ...DEFAULT_PROXY };

// Event listeners for proxy config changes
const configListeners: Set<(config: ProxyConfig) => void> = new Set();

/**
 * Get current proxy configuration
 */
export const getProxyConfig = (): ProxyConfig => {
  return { ...currentProxyConfig };
};

/**
 * Set proxy configuration
 */
export const setProxyConfig = (config: Partial<ProxyConfig>): void => {
  currentProxyConfig = {
    ...currentProxyConfig,
    ...config
  };
  
  // Dispatch event for listeners
  window.dispatchEvent(new CustomEvent('proxy-config-changed', {
    detail: currentProxyConfig
  }));
  
  // Notify registered listeners
  configListeners.forEach(listener => listener(currentProxyConfig));
  
  console.log('Proxy configuration updated:', currentProxyConfig);
};

/**
 * Clear proxy configuration
 */
export const clearProxyConfig = (): void => {
  currentProxyConfig = { ...DEFAULT_PROXY };
  currentProxyConfig.isEnabled = false;
  currentProxyConfig.baseUrl = '';
  
  // Dispatch event for listeners
  window.dispatchEvent(new CustomEvent('proxy-config-changed', {
    detail: currentProxyConfig
  }));
  
  // Notify registered listeners
  configListeners.forEach(listener => listener(currentProxyConfig));
  
  console.log('Proxy configuration cleared');
};

/**
 * Initialize proxy settings from environment or defaults
 */
export const initializeProxySettings = (): void => {
  // Try to detect if we're in a development environment
  const isDevelopment = typeof window !== 'undefined' && (
    window.location.hostname === 'localhost' || 
    window.location.hostname.includes('127.0.0.1') ||
    window.location.hostname.includes('lovableproject.com')
  );
  
  if (isDevelopment) {
    // In development, we might have different proxy needs
    setProxyConfig({
      isEnabled: true,
      baseUrl: 'https://api.binance.com'
    });
  }
  
  console.log('Proxy settings initialized for environment:', isDevelopment ? 'development' : 'production');
};

/**
 * Listen to proxy configuration changes
 */
export const listenToProxyChanges = (callback: (config: ProxyConfig) => void): (() => void) => {
  configListeners.add(callback);
  
  // Return unsubscribe function
  return () => {
    configListeners.delete(callback);
  };
};

/**
 * Check if proxy is configured and enabled
 */
export const isProxyConfigured = (): boolean => {
  return currentProxyConfig.isEnabled && !!currentProxyConfig.baseUrl;
};

/**
 * Get API base URL (with or without proxy)
 */
export const getApiBaseUrl = (): string => {
  if (isProxyConfigured()) {
    return currentProxyConfig.baseUrl;
  }
  return 'https://api.binance.com';
};

/**
 * Get proxy URL for a given endpoint
 */
export const getProxyUrl = (endpoint: string): string => {
  const baseUrl = getApiBaseUrl();
  
  // Remove leading slash if present
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  
  // Handle Binance-specific endpoints
  if (cleanEndpoint.startsWith('binance/')) {
    if (isProxyConfigured()) {
      return `${baseUrl}/${cleanEndpoint}`;
    } else {
      // Direct Binance API call
      const binanceEndpoint = cleanEndpoint.replace('binance/', '');
      return `https://api.binance.com/${binanceEndpoint}`;
    }
  }
  
  return `${baseUrl}/${cleanEndpoint}`;
};

/**
 * Build proxy pass-through URL for external APIs
 */
export const buildProxyPassthroughUrl = (targetUrl: string): string => {
  if (!isProxyConfigured()) {
    return targetUrl; // Return original URL if no proxy
  }
  
  const baseUrl = getApiBaseUrl();
  const encodedUrl = encodeURIComponent(targetUrl);
  
  return `${baseUrl}/proxy?url=${encodedUrl}`;
};

/**
 * Test proxy connection
 */
export const testProxyConnection = async (): Promise<boolean> => {
  try {
    if (!isProxyConfigured()) {
      console.log('No proxy configured, testing direct connection');
      return true;
    }
    
    const testUrl = getProxyUrl('/binance/api/v3/ping');
    const response = await fetch(testUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    return response.ok;
  } catch (error) {
    console.error('Proxy connection test failed:', error);
    return false;
  }
};

// Initialize with environment-based configuration if available
if (typeof window !== 'undefined') {
  initializeProxySettings();
}
