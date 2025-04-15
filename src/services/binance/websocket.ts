
import { toast } from 'sonner';
import { getBinanceCredentials } from './credentials';
import { BinanceSocketConfig, BinanceStreamMessage } from './types';
import { getProxyConfig } from '@/services/proxy/proxyConfig';
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
      console.error('No valid Binance credentials');
      onError?.({ message: 'No valid Binance credentials' });
      return () => {}; // Return empty cleanup function
    }
    
    // Get proxy configuration if needed
    const proxyConfig = getProxyConfig();
    const useProxy = !!proxyConfig?.enabled;
    
    // Create the WebSocket connection
    const streamName = interval ? `${symbol.toLowerCase()}@kline_${interval}` : `${symbol.toLowerCase()}@ticker`;
    const wsEndpoint = useProxy 
      ? `${proxyConfig?.url}/binance/ws/${streamName}`
      : `wss://stream.binance.com:9443/ws/${streamName}`;
    
    console.log(`Connecting to Binance WebSocket: ${wsEndpoint}`);
    
    // Check if connection already exists
    let ws = activeConnections.get(streamName);
    
    if (!ws || ws.readyState === WebSocket.CLOSED) {
      ws = new WebSocket(wsEndpoint);
      
      ws.onopen = () => {
        console.log(`WebSocket connected: ${streamName}`);
        toast.success('התחברות לנתוני בינאנס בזמן אמת');
      };
      
      ws.onmessage = (event) => {
        try {
          const rawData = JSON.parse(event.data);
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
      };
      
      ws.onclose = () => {
        console.log(`WebSocket closed: ${streamName}`);
        activeConnections.delete(streamName);
      };
      
      // Store the connection
      activeConnections.set(streamName, ws);
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
