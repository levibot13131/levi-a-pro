import { toast } from 'sonner';
import { getBinanceCredentials } from './credentials';
import { BinanceSocketConfig, BinanceStreamMessage } from './types';
import { getProxyConfig, isProxyConfigured, getApiBaseUrl } from '@/services/proxy/proxyConfig';
import { isRealTimeMode } from './marketData';

// Store active websocket connections
const activeConnections: Map<string, WebSocket> = new Map();

// Callbacks for message handling
const messageCallbacks: Map<string, Set<(data: BinanceStreamMessage) => void>> = new Map();

// Reconnection attempts tracking
const reconnectionAttempts: Map<string, number> = new Map();
const MAX_RECONNECT_ATTEMPTS = 5;
const RECONNECT_DELAY_MS = 3000;

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
      // Reset reconnection attempts on new connection
      reconnectionAttempts.set(streamName, 0);
      
      try {
        console.log(`Creating new WebSocket connection to: ${wsEndpoint}`);
        ws = new WebSocket(wsEndpoint);
        
        // Set a timeout to detect if connection is stalled
        const connectionTimeout = setTimeout(() => {
          if (ws && ws.readyState === WebSocket.CONNECTING) {
            console.warn(`WebSocket connection timed out: ${streamName}`);
            ws.close();
            
            // Notify about WebSocket status change
            window.dispatchEvent(new CustomEvent('websocket-status-change', {
              detail: { connected: false }
            }));
            
            // Try reconnecting
            handleReconnection(streamName, config);
          }
        }, 10000); // 10 seconds timeout
        
        ws.onopen = () => {
          clearTimeout(connectionTimeout);
          console.log(`WebSocket connected: ${streamName}`);
          toast.success('התחברות לנתוני בינאנס בזמן אמת');
          
          // Reset reconnection attempts on successful connection
          reconnectionAttempts.set(streamName, 0);
          
          // Notify about WebSocket status change
          window.dispatchEvent(new CustomEvent('websocket-status-change', {
            detail: { connected: true }
          }));
          
          // Setup ping-pong to keep connection alive
          const pingInterval = setInterval(() => {
            if (ws && ws.readyState === WebSocket.OPEN) {
              try {
                // Send ping frame to keep connection alive
                ws.send(JSON.stringify({ type: 'ping' }));
              } catch (err) {
                console.warn('Error sending ping:', err);
              }
            } else {
              clearInterval(pingInterval);
            }
          }, 30000); // Send ping every 30 seconds
          
          // Store the interval for cleanup
          (ws as any).pingInterval = pingInterval;
        };
        
        ws.onmessage = (event) => {
          try {
            const rawData = JSON.parse(event.data);
            console.log(`WebSocket data received for ${streamName}:`, rawData);
            
            // Handle pong responses
            if (rawData.type === 'pong') {
              console.log('Received pong from server');
              return;
            }
            
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
          clearTimeout(connectionTimeout);
          console.error(`WebSocket error: ${streamName}`, error);
          if (onError) onError(error);
          
          // Notify about WebSocket status change
          window.dispatchEvent(new CustomEvent('websocket-status-change', {
            detail: { connected: false }
          }));
          
          // Try to reconnect on error
          handleReconnection(streamName, config);
        };
        
        ws.onclose = () => {
          clearTimeout(connectionTimeout);
          console.log(`WebSocket closed: ${streamName}`);
          activeConnections.delete(streamName);
          
          // Clear ping interval if exists
          if ((ws as any).pingInterval) {
            clearInterval((ws as any).pingInterval);
          }
          
          // Notify about WebSocket status change
          window.dispatchEvent(new CustomEvent('websocket-status-change', {
            detail: { connected: false }
          }));
          
          // Try to reconnect on close
          handleReconnection(streamName, config);
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
        
        // Try to reconnect
        handleReconnection(streamName, config);
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
          // Clear ping interval if exists
          if ((connection as any).pingInterval) {
            clearInterval((connection as any).pingInterval);
          }
          
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
 * Handle WebSocket reconnection with exponential backoff
 */
function handleReconnection(streamName: string, config: BinanceSocketConfig) {
  const attempts = reconnectionAttempts.get(streamName) || 0;
  
  if (attempts < MAX_RECONNECT_ATTEMPTS) {
    const backoffDelay = RECONNECT_DELAY_MS * Math.pow(1.5, attempts);
    reconnectionAttempts.set(streamName, attempts + 1);
    
    console.log(`Attempting reconnection ${attempts + 1}/${MAX_RECONNECT_ATTEMPTS} for ${streamName} in ${backoffDelay}ms`);
    
    setTimeout(() => {
      console.log(`Reconnecting WebSocket: ${streamName}`);
      activeConnections.delete(streamName);
      createBinanceWebSocket(config);
    }, backoffDelay);
  } else {
    console.error(`Max reconnection attempts (${MAX_RECONNECT_ATTEMPTS}) reached for ${streamName}`);
    toast.error('חיבור לנתוני בינאנס בזמן אמת נכשל', {
      description: 'מספר ניסיונות החיבור המרבי הושג, נדרשת הפעלה מחדש ידנית'
    });
    
    // Fall back to simulation mode
    console.log('Falling back to simulated data due to max reconnection attempts reached');
    const intervalId = simulateWebSocketMessages(config.symbol, config.onMessage);
    
    // Store a special connection object so we don't try to reconnect again
    const fallbackConnection = {
      readyState: WebSocket.OPEN,
      close: () => {
        clearInterval(intervalId);
        activeConnections.delete(streamName);
      }
    } as unknown as WebSocket;
    
    activeConnections.set(streamName, fallbackConnection);
  }
}

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
  
  // Reset reconnection attempts
  reconnectionAttempts.clear();
  
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

/**
 * Close all active WebSocket connections
 */
export const closeAllConnections = (): void => {
  activeConnections.forEach((ws, key) => {
    // Clear ping interval if exists
    if ((ws as any).pingInterval) {
      clearInterval((ws as any).pingInterval);
    }
    
    if (ws.readyState === WebSocket.OPEN) {
      ws.close();
    }
  });
  
  activeConnections.clear();
  messageCallbacks.clear();
};

/**
 * Export parseWebSocketMessage to be used by other modules
 */
export { parseWebSocketMessage };
