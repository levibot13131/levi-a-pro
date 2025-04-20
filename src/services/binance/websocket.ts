
import { toast } from 'sonner';
import { getBinanceCredentials } from './credentials';
import { BinanceSocketConfig, BinanceStreamMessage } from './types';
import { getProxyConfig, isProxyConfigured, getApiBaseUrl } from '@/services/proxy/proxyConfig';
import { isRealTimeMode } from './marketData';

// Store active websocket connections
const activeConnections: Map<string, WebSocket> = new Map();

// Callbacks for message handling
const messageCallbacks: Map<string, Set<(data: BinanceStreamMessage) => void>> = new Map();

/**
 * Create a WebSocket connection to Binance
 */
export const createBinanceWebSocket = (config: BinanceSocketConfig): (() => void) => {
  const { symbol, interval = '1m', onMessage, onError } = config;
  
  // Check if we're in development/demo mode
  const demoMode = !isRealTimeMode();
  if (demoMode) {
    console.log('WebSocket in demo mode - will simulate data');
    // Setup simulation interval instead of real connection
    const intervalId = simulateWebSocketMessages(symbol, onMessage);
    return () => clearInterval(intervalId);
  }
  
  try {
    // Check credentials
    const credentials = getBinanceCredentials();
    if (!credentials?.isConnected) {
      console.warn('No valid Binance credentials, will attempt to connect anyway');
    }
    
    // Create the WebSocket connection
    const streamName = interval ? `${symbol.toLowerCase()}@kline_${interval}` : `${symbol.toLowerCase()}@ticker`;
    
    // Determine the WebSocket URL based on proxy configuration
    let wsEndpoint = '';
    const proxyConfig = getProxyConfig();
    
    // Always use the proxy for WebSockets unless explicitly disabled
    let proxyBase = proxyConfig.baseUrl || 'https://tuition-colony-climb-gently.trycloudflare.com';
    
    // Ensure protocol is correct for WebSockets
    proxyBase = proxyBase.replace('https://', 'wss://').replace('http://', 'ws://');
    if (!proxyBase.startsWith('wss://') && !proxyBase.startsWith('ws://')) {
      proxyBase = 'wss://' + proxyBase;
    }
    
    // Remove trailing slash if present
    if (proxyBase.endsWith('/')) {
      proxyBase = proxyBase.slice(0, -1);
    }
    
    wsEndpoint = `${proxyBase}/binance/ws/${streamName}`;
    console.log(`Using proxy for Binance WebSocket: ${wsEndpoint}`);
    
    // Check if connection already exists
    let ws = activeConnections.get(streamName);
    
    if (!ws || ws.readyState === WebSocket.CLOSED) {
      try {
        console.log(`Creating new WebSocket connection to: ${wsEndpoint}`);
        ws = new WebSocket(wsEndpoint);
        
        ws.onopen = () => {
          console.log(`WebSocket connected: ${streamName}`);
          toast.success('התחברות לנתוני בינאנס בזמן אמת');
          
          // Notify about WebSocket status change
          window.dispatchEvent(new CustomEvent('websocket-status-change', {
            detail: { connected: true }
          }));
        };
        
        ws.onmessage = (event) => {
          try {
            const rawData = JSON.parse(event.data);
            console.log(`WebSocket data received for ${streamName}:`, rawData);
            
            const streamMessage = parseWebSocketMessage(rawData, symbol);
            
            // Call all registered callbacks for this symbol
            const callbacks = messageCallbacks.get(symbol) || new Set();
            callbacks.forEach(callback => callback(streamMessage));
            
            // Call the specific callback for this connection if provided
            if (onMessage) {
              onMessage(streamMessage);
            }
          } catch (err) {
            console.error('Error processing WebSocket message:', err);
          }
        };
        
        ws.onerror = (error) => {
          console.error(`WebSocket error: ${streamName}`, error);
          if (onError) onError(error);
          toast.error('שגיאה בחיבור לנתוני בינאנס בזמן אמת');
          
          // Notify about WebSocket status change
          window.dispatchEvent(new CustomEvent('websocket-status-change', {
            detail: { connected: false }
          }));
          
          // Try to reconnect on error after a delay
          setTimeout(() => {
            if (ws && ws.readyState === WebSocket.CLOSED) {
              console.log(`Attempting to reconnect WebSocket: ${streamName}`);
              activeConnections.delete(streamName);
              createBinanceWebSocket(config);
            }
          }, 5000);
        };
        
        ws.onclose = () => {
          console.log(`WebSocket closed: ${streamName}`);
          activeConnections.delete(streamName);
          
          // Notify about WebSocket status change
          window.dispatchEvent(new CustomEvent('websocket-status-change', {
            detail: { connected: false }
          }));
          
          // Try to reconnect on close after a delay
          setTimeout(() => {
            console.log(`Attempting to reconnect closed WebSocket: ${streamName}`);
            createBinanceWebSocket(config);
          }, 5000);
        };
        
        // Store the connection
        activeConnections.set(streamName, ws);
      } catch (wsError) {
        console.error('Error creating WebSocket connection:', wsError);
        if (onError) onError(wsError);
        
        // Notify about WebSocket status change
        window.dispatchEvent(new CustomEvent('websocket-status-change', {
          detail: { connected: false }
        }));
        
        // Fall back to simulation if WebSocket fails
        console.log('Falling back to simulated data due to WebSocket error');
        const intervalId = simulateWebSocketMessages(symbol, onMessage);
        return () => clearInterval(intervalId);
      }
    } else {
      console.log(`Reusing existing WebSocket connection for ${streamName}`);
    }
    
    // Register the callback if provided
    if (onMessage) {
      if (!messageCallbacks.has(symbol)) {
        messageCallbacks.set(symbol, new Set());
      }
      messageCallbacks.get(symbol)?.add(onMessage);
    }
    
    // Return cleanup function
    return () => {
      // Remove the specific callback
      if (onMessage) {
        const callbacks = messageCallbacks.get(symbol);
        if (callbacks) {
          callbacks.delete(onMessage);
          if (callbacks.size === 0) {
            messageCallbacks.delete(symbol);
          }
        }
      }
      
      // If no more callbacks for this symbol, close the connection
      if (!messageCallbacks.has(symbol) || messageCallbacks.get(symbol)?.size === 0) {
        const connection = activeConnections.get(streamName);
        if (connection && connection.readyState === WebSocket.OPEN) {
          connection.close();
          activeConnections.delete(streamName);
        }
      }
    };
  } catch (error) {
    console.error('Error creating WebSocket:', error);
    onError?.(error);
    
    // Notify about WebSocket status change
    window.dispatchEvent(new CustomEvent('websocket-status-change', {
      detail: { connected: false }
    }));
    
    return () => {}; // Return empty cleanup function
  }
};

/**
 * Parse WebSocket message into a standardized format
 */
function parseWebSocketMessage(data: any, symbol: string): BinanceStreamMessage {
  // Handle ticker data
  if (data.e === '24hrTicker') {
    return {
      data: {
        symbol: data.s,
        price: parseFloat(data.c),
        change: parseFloat(data.p),
        changePercent: parseFloat(data.P),
        high24h: parseFloat(data.h),
        low24h: parseFloat(data.l),
        volume24h: parseFloat(data.v),
        quoteVolume: parseFloat(data.q),
      },
      type: 'ticker',
      symbol: data.s,
      time: data.E
    };
  }
  
  // Handle kline data
  if (data.e === 'kline') {
    const kline = data.k;
    return {
      data: {
        symbol: data.s,
        interval: kline.i,
        openTime: kline.t,
        closeTime: kline.T,
        open: parseFloat(kline.o),
        high: parseFloat(kline.h),
        low: parseFloat(kline.l),
        close: parseFloat(kline.c),
        volume: parseFloat(kline.v),
        trades: kline.n,
        isFinal: kline.x
      },
      type: 'kline',
      symbol: data.s,
      time: data.E
    };
  }
  
  // Default unknown message type
  return {
    data,
    type: 'unknown',
    symbol,
    time: Date.now()
  };
}

/**
 * Simulate WebSocket messages for development/demo mode
 */
function simulateWebSocketMessages(
  symbol: string, 
  callback?: (data: BinanceStreamMessage) => void
): NodeJS.Timeout {
  // Create fake data based on symbol
  const basePrice = symbol.includes('BTC') ? 42000 : 
                   symbol.includes('ETH') ? 2500 : 
                   symbol.includes('SOL') ? 120 : 
                   symbol.includes('BNB') ? 350 : 50;
  
  console.log(`Starting simulated data for ${symbol} with base price ${basePrice}`);
  
  return setInterval(() => {
    const time = Date.now();
    const randomChange = (Math.random() * 0.01 - 0.005) * basePrice; // -0.5% to +0.5%
    const currentPrice = basePrice + randomChange;
    
    const message: BinanceStreamMessage = {
      data: {
        symbol,
        price: currentPrice,
        change: randomChange,
        changePercent: (randomChange / basePrice) * 100,
        high24h: basePrice * 1.02,
        low24h: basePrice * 0.98,
        volume24h: Math.random() * 1000000,
        quoteVolume: Math.random() * 50000000,
      },
      type: 'ticker',
      symbol,
      time
    };
    
    if (callback) {
      callback(message);
    }
    
    // Also trigger any registered callbacks
    const callbacks = messageCallbacks.get(symbol) || new Set();
    callbacks.forEach(cb => cb(message));
  }, 2000); // Simulate a message every 2 seconds
}

/**
 * Subscribe to market data for multiple symbols
 */
export const subscribeToMarketData = (
  symbols: string[], 
  onData: (data: BinanceStreamMessage) => void,
  onError?: (error: any) => void
): (() => void) => {
  const cleanupFunctions: Array<() => void> = [];
  
  for (const symbol of symbols) {
    const cleanup = createBinanceWebSocket({
      symbol,
      onMessage: onData,
      onError
    });
    
    cleanupFunctions.push(cleanup);
  }
  
  // Return combined cleanup function
  return () => {
    cleanupFunctions.forEach(cleanup => cleanup());
  };
};

/**
 * Close all active WebSocket connections
 */
export const closeAllConnections = (): void => {
  activeConnections.forEach((ws, key) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.close();
    }
  });
  
  activeConnections.clear();
  messageCallbacks.clear();
};

/**
 * Reset and reconnect all active WebSocket connections
 * Useful when proxy settings change
 */
export const reconnectAllWebSockets = (): void => {
  // Store the current connections and callbacks
  const existingConnections = new Map(activeConnections);
  const existingCallbacks = new Map(messageCallbacks);
  
  console.log(`Reconnecting ${existingConnections.size} WebSocket connections...`);
  
  // Close all existing connections
  closeAllConnections();
  
  // Re-establish connections with the same callbacks
  existingCallbacks.forEach((callbacks, symbol) => {
    callbacks.forEach(callback => {
      createBinanceWebSocket({
        symbol,
        onMessage: callback,
        onError: (error) => console.error(`Reconnection error for ${symbol}:`, error)
      });
    });
  });
  
  console.log(`Reconnected ${existingConnections.size} WebSocket connections`);
  
  // Notify user
  if (existingConnections.size > 0) {
    toast.success(`${existingConnections.size} WebSocket connections reconnected`);
    
    // Dispatch event with WebSocket reconnect status
    window.dispatchEvent(new CustomEvent('websocket-status-change', {
      detail: { connected: true }
    }));
  }
};
