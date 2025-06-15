
import { toast } from 'sonner';
import { getBinanceCredentials } from './credentials';
import { BinanceSocketConfig, BinanceStreamMessage } from './types';
import { isRealTimeMode } from './marketData';

// Store active websocket connections
const activeConnections: Map<string, WebSocket> = new Map();

// Callbacks for message handling
const messageCallbacks: Map<string, Set<(data: BinanceStreamMessage) => void>> = new Map();

// Reconnection attempts tracking
const reconnectionAttempts: Map<string, number> = new Map();
const MAX_RECONNECT_ATTEMPTS = 3;
const RECONNECT_DELAY_MS = 5000;

/**
 * Simulate WebSocket messages for demo mode
 */
const simulateWebSocketMessages = (symbol: string, onMessage: (data: BinanceStreamMessage) => void): number => {
  const basePrice = symbol.includes('BTC') ? 43000 : 
                   symbol.includes('ETH') ? 2600 : 
                   symbol.includes('SOL') ? 125 : 
                   symbol.includes('DOGE') ? 0.08 : 
                   symbol.includes('ADA') ? 0.5 : 100;
  
  console.log(`Starting simulated data for ${symbol} with base price ${basePrice}`);
  
  const intervalId = window.setInterval(() => {
    const variation = (Math.random() - 0.5) * 0.02; // ±1%
    const price = basePrice * (1 + variation);
    const change24h = variation * 100;
    
    const mockMessage: BinanceStreamMessage = {
      symbol,
      type: 'ticker',
      data: {
        price,
        change: change24h,
        high24h: price * 1.05,
        low24h: price * 0.95,
        volume24h: Math.random() * 1000000 + 500000
      }
    };
    
    onMessage(mockMessage);
  }, 2000);
  
  return intervalId;
};

/**
 * Parse WebSocket message from Binance
 */
const parseWebSocketMessage = (data: any, symbol: string): BinanceStreamMessage => {
  if (data.stream && data.data) {
    if (data.stream.includes('@ticker')) {
      return {
        symbol,
        type: 'ticker',
        data: {
          price: parseFloat(data.data.c),
          change: parseFloat(data.data.P),
          high24h: parseFloat(data.data.h),
          low24h: parseFloat(data.data.l),
          volume24h: parseFloat(data.data.v)
        }
      };
    }
  }
  
  return {
    symbol,
    type: 'ticker',
    data: {
      price: data.price || 0,
      change: data.change || 0,
      high24h: data.high24h || 0,
      low24h: data.low24h || 0,
      volume24h: data.volume24h || 0
    }
  };
};

/**
 * Handle reconnection logic
 */
const handleReconnection = (streamName: string, config: BinanceSocketConfig) => {
  const attempts = reconnectionAttempts.get(streamName) || 0;
  
  if (attempts >= MAX_RECONNECT_ATTEMPTS) {
    console.error(`Max reconnection attempts (${MAX_RECONNECT_ATTEMPTS}) reached for ${streamName}`);
    console.log('Falling back to simulated data due to max reconnection attempts reached');
    
    const { symbol, onMessage } = config;
    if (onMessage) {
      simulateWebSocketMessages(symbol, onMessage);
    }
    return;
  }
  
  reconnectionAttempts.set(streamName, attempts + 1);
  const delay = RECONNECT_DELAY_MS * Math.pow(1.5, attempts);
  
  console.log(`Attempting reconnection ${attempts + 1}/${MAX_RECONNECT_ATTEMPTS} for ${streamName} in ${delay}ms`);
  
  const timeoutId = window.setTimeout(() => {
    console.log(`Reconnecting WebSocket: ${streamName}`);
    createBinanceWebSocket(config);
  }, delay);
  
  return timeoutId;
};

/**
 * Create a WebSocket connection to Binance - CLOUD NATIVE VERSION
 */
export const createBinanceWebSocket = (config: BinanceSocketConfig): (() => void) => {
  const { symbol, interval = '1m', onMessage, onError } = config;
  
  // Check if we're in demo mode
  const demoMode = !isRealTimeMode();
  if (demoMode) {
    console.log('WebSocket in demo mode - will simulate data');
    const intervalId = simulateWebSocketMessages(symbol, onMessage);
    return () => clearInterval(intervalId);
  }
  
  try {
    const credentials = getBinanceCredentials();
    if (!credentials?.isConnected) {
      console.warn('No valid Binance credentials, using simulated data');
      const intervalId = simulateWebSocketMessages(symbol, onMessage);
      return () => clearInterval(intervalId);
    }
    
    const streamName = interval ? `${symbol.toLowerCase()}@kline_${interval}` : `${symbol.toLowerCase()}@ticker`;
    
    // Direct Binance WebSocket connection - NO PROXY
    const wsEndpoint = `wss://stream.binance.com:9443/ws/${streamName}`;
    
    let ws = activeConnections.get(streamName);
    
    if (!ws || ws.readyState === WebSocket.CLOSED) {
      try {
        console.log(`Creating direct WebSocket connection to Binance: ${wsEndpoint}`);
        ws = new WebSocket(wsEndpoint);
        
        const connectionTimeout = window.setTimeout(() => {
          if (ws && ws.readyState === WebSocket.CONNECTING) {
            console.warn(`WebSocket connection timed out: ${streamName}`);
            ws.close();
            // Fall back to simulated data on timeout
            const intervalId = simulateWebSocketMessages(symbol, onMessage);
            return () => clearInterval(intervalId);
          }
        }, 10000);
        
        ws.onopen = () => {
          clearTimeout(connectionTimeout);
          console.log(`WebSocket connected to Binance: ${streamName}`);
          
          // Reset reconnection attempts on successful connection
          reconnectionAttempts.set(streamName, 0);
          
          window.dispatchEvent(new CustomEvent('websocket-status-change', {
            detail: { connected: true }
          }));
        };
        
        ws.onmessage = (event) => {
          try {
            const rawData = JSON.parse(event.data);
            
            if (rawData.type === 'pong') {
              return;
            }
            
            const streamMessage = parseWebSocketMessage(rawData, symbol);
            
            const callbacks = messageCallbacks.get(symbol) || new Set();
            callbacks.forEach(callback => callback(streamMessage));
            
            if (onMessage) {
              onMessage(streamMessage);
            }
          } catch (err) {
            console.error('Error processing WebSocket message:', err);
          }
        };
        
        ws.onerror = (error) => {
          console.error(`WebSocket error: ${streamName}`, error);
          if (onError) {
            onError(error);
          }
          // Fall back to simulated data on error
          const intervalId = simulateWebSocketMessages(symbol, onMessage);
          return () => clearInterval(intervalId);
        };
        
        ws.onclose = () => {
          console.log(`WebSocket closed: ${streamName}`);
          activeConnections.delete(streamName);
          // Fall back to simulated data on close
          const intervalId = simulateWebSocketMessages(symbol, onMessage);
          return () => clearInterval(intervalId);
        };
        
        activeConnections.set(streamName, ws);
        
      } catch (wsError) {
        console.error('Error creating WebSocket:', wsError);
        // Fall back to simulated data
        const intervalId = simulateWebSocketMessages(symbol, onMessage);
        return () => clearInterval(intervalId);
      }
    }
    
    // Add callback for this symbol
    if (!messageCallbacks.has(symbol)) {
      messageCallbacks.set(symbol, new Set());
    }
    const callbacks = messageCallbacks.get(symbol)!;
    if (onMessage) {
      callbacks.add(onMessage);
    }
    
    // Return cleanup function
    return () => {
      if (onMessage) {
        callbacks.delete(onMessage);
        if (callbacks.size === 0) {
          messageCallbacks.delete(symbol);
          const ws = activeConnections.get(streamName);
          if (ws) {
            ws.close();
            activeConnections.delete(streamName);
          }
        }
      }
    };
    
  } catch (error) {
    console.error('Error in createBinanceWebSocket:', error);
    // Always fall back to simulated data on any error
    const intervalId = simulateWebSocketMessages(symbol, onMessage);
    return () => clearInterval(intervalId);
  }
};

/**
 * Subscribe to market data for multiple symbols
 */
export const subscribeToMarketData = (
  symbols: string[],
  onMessage: (data: BinanceStreamMessage) => void,
  onError?: (error: any) => void
): (() => void) => {
  const cleanupFunctions: (() => void)[] = [];
  
  symbols.forEach(symbol => {
    const cleanup = createBinanceWebSocket({
      symbol,
      onMessage,
      onError
    });
    cleanupFunctions.push(cleanup);
  });
  
  // Return a function that cleans up all subscriptions
  return () => {
    cleanupFunctions.forEach(cleanup => cleanup());
  };
};

/**
 * Close all active connections
 */
export const closeAllConnections = (): void => {
  activeConnections.forEach((ws, streamName) => {
    if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
      ws.close();
    }
  });
  activeConnections.clear();
  messageCallbacks.clear();
  reconnectionAttempts.clear();
  
  console.log('All WebSocket connections closed');
};
