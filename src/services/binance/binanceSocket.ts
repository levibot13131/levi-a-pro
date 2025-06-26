
import { toast } from 'sonner';

export interface OHLCVData {
  symbol: string;
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  change24h: number;
  ath: number;
  atr: number;
  spread: number;
}

export interface BinanceKline {
  t: number; // Open time
  T: number; // Close time
  s: string; // Symbol
  i: string; // Interval
  o: string; // Open price
  c: string; // Close price
  h: string; // High price
  l: string; // Low price
  v: string; // Base asset volume
  n: number; // Number of trades
  x: boolean; // Is kline closed
  q: string; // Quote asset volume
  V: string; // Taker buy base asset volume
  Q: string; // Taker buy quote asset volume
}

class BinanceSocketManager {
  private connections = new Map<string, WebSocket>();
  private callbacks = new Map<string, Set<(data: OHLCVData) => void>>();
  private reconnectAttempts = new Map<string, number>();
  private restFallbackIntervals = new Map<string, NodeJS.Timeout>();
  
  private readonly MAX_RECONNECT_ATTEMPTS = 3;
  private readonly RECONNECT_DELAY = 5000;
  private readonly REST_FALLBACK_INTERVAL = 5000;

  subscribe(symbol: string, interval: string, callback: (data: OHLCVData) => void): () => void {
    const streamName = `${symbol.toLowerCase()}@kline_${interval}`;
    
    if (!this.callbacks.has(streamName)) {
      this.callbacks.set(streamName, new Set());
    }
    
    this.callbacks.get(streamName)!.add(callback);
    
    // Start WebSocket connection if not exists
    if (!this.connections.has(streamName)) {
      this.createWebSocketConnection(streamName, symbol, interval);
    }
    
    console.log(`📊 Subscribed to ${streamName}`);
    
    // Return cleanup function
    return () => {
      const callbacks = this.callbacks.get(streamName);
      if (callbacks) {
        callbacks.delete(callback);
        if (callbacks.size === 0) {
          this.cleanup(streamName);
        }
      }
    };
  }

  private createWebSocketConnection(streamName: string, symbol: string, interval: string) {
    try {
      const wsUrl = `wss://stream.binance.com:9443/ws/${streamName}`;
      const ws = new WebSocket(wsUrl);
      
      ws.onopen = () => {
        console.log(`✅ WebSocket connected: ${streamName}`);
        this.reconnectAttempts.set(streamName, 0);
        this.clearRestFallback(streamName);
      };
      
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.k) {
            const kline: BinanceKline = data.k;
            const ohlcv = this.parseKlineToOHLCV(kline);
            this.notifyCallbacks(streamName, ohlcv);
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };
      
      ws.onerror = (error) => {
        console.error(`❌ WebSocket error: ${streamName}`, error);
        this.handleConnectionError(streamName, symbol, interval);
      };
      
      ws.onclose = () => {
        console.log(`🔌 WebSocket closed: ${streamName}`);
        this.connections.delete(streamName);
        this.handleReconnection(streamName, symbol, interval);
      };
      
      this.connections.set(streamName, ws);
      
    } catch (error) {
      console.error(`Failed to create WebSocket connection: ${streamName}`, error);
      this.startRestFallback(streamName, symbol, interval);
    }
  }

  private handleReconnection(streamName: string, symbol: string, interval: string) {
    const attempts = this.reconnectAttempts.get(streamName) || 0;
    
    if (attempts < this.MAX_RECONNECT_ATTEMPTS) {
      this.reconnectAttempts.set(streamName, attempts + 1);
      
      setTimeout(() => {
        console.log(`🔄 Reconnecting ${streamName} (attempt ${attempts + 1})`);
        this.createWebSocketConnection(streamName, symbol, interval);
      }, this.RECONNECT_DELAY * Math.pow(1.5, attempts));
      
    } else {
      console.log(`⚠️ Max reconnection attempts reached for ${streamName}, switching to REST fallback`);
      this.startRestFallback(streamName, symbol, interval);
    }
  }

  private handleConnectionError(streamName: string, symbol: string, interval: string) {
    console.log(`⚠️ Connection error for ${streamName}, starting REST fallback`);
    this.startRestFallback(streamName, symbol, interval);
  }

  private startRestFallback(streamName: string, symbol: string, interval: string) {
    if (this.restFallbackIntervals.has(streamName)) {
      return; // Already running
    }
    
    console.log(`🔄 Starting REST fallback for ${streamName}`);
    
    const fallbackInterval = setInterval(async () => {
      try {
        const ohlcv = await this.fetchRestData(symbol, interval);
        this.notifyCallbacks(streamName, ohlcv);
      } catch (error) {
        console.error(`REST fallback error for ${streamName}:`, error);
      }
    }, this.REST_FALLBACK_INTERVAL);
    
    this.restFallbackIntervals.set(streamName, fallbackInterval);
  }

  private clearRestFallback(streamName: string) {
    const interval = this.restFallbackIntervals.get(streamName);
    if (interval) {
      clearInterval(interval);
      this.restFallbackIntervals.delete(streamName);
      console.log(`✅ Cleared REST fallback for ${streamName}`);
    }
  }

  private async fetchRestData(symbol: string, interval: string): Promise<OHLCVData> {
    const response = await fetch(
      `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=1`
    );
    
    if (!response.ok) {
      throw new Error(`REST API error: ${response.status}`);
    }
    
    const data = await response.json();
    const kline = data[0];
    
    return {
      symbol,
      timestamp: kline[0],
      open: parseFloat(kline[1]),
      high: parseFloat(kline[2]),
      low: parseFloat(kline[3]),
      close: parseFloat(kline[4]),
      volume: parseFloat(kline[5]),
      change24h: 0, // Would need separate API call
      ath: 0,
      atr: 0,
      spread: 0
    };
  }

  private parseKlineToOHLCV(kline: BinanceKline): OHLCVData {
    const open = parseFloat(kline.o);
    const close = parseFloat(kline.c);
    const high = parseFloat(kline.h);
    const low = parseFloat(kline.l);
    
    return {
      symbol: kline.s,
      timestamp: kline.t,
      open,
      high,
      low,
      close,
      volume: parseFloat(kline.v),
      change24h: ((close - open) / open) * 100,
      ath: high,
      atr: high - low,
      spread: 0.01 // Approximate
    };
  }

  private notifyCallbacks(streamName: string, data: OHLCVData) {
    const callbacks = this.callbacks.get(streamName);
    if (callbacks) {
      callbacks.forEach(callback => callback(data));
    }
  }

  private cleanup(streamName: string) {
    // Close WebSocket
    const ws = this.connections.get(streamName);
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.close();
    }
    this.connections.delete(streamName);
    
    // Clear REST fallback
    this.clearRestFallback(streamName);
    
    // Clear callbacks
    this.callbacks.delete(streamName);
    this.reconnectAttempts.delete(streamName);
    
    console.log(`🧹 Cleaned up ${streamName}`);
  }

  getConnectionStatus(): { [streamName: string]: 'connected' | 'fallback' | 'disconnected' } {
    const status: { [streamName: string]: 'connected' | 'fallback' | 'disconnected' } = {};
    
    this.callbacks.forEach((_, streamName) => {
      const ws = this.connections.get(streamName);
      const hasRestFallback = this.restFallbackIntervals.has(streamName);
      
      if (ws && ws.readyState === WebSocket.OPEN) {
        status[streamName] = 'connected';
      } else if (hasRestFallback) {
        status[streamName] = 'fallback';
      } else {
        status[streamName] = 'disconnected';
      }
    });
    
    return status;
  }
}

export const binanceSocket = new BinanceSocketManager();
