
// Define types used across Binance service modules

export interface PriceData {
  symbol: string;
  price: number;
  change: number;
  high24h: number;
  low24h: number;
  volume: number;
  lastUpdate: number;
}

export interface MarketDataEntry {
  symbol: string;
  price: number;
  change24h: number;
  high24h: number;
  low24h: number;
  volume24h: number;
  lastUpdated: number;
}

export interface WebSocketMessage {
  e: string; // Event type
  E: number; // Event time
  s: string; // Symbol
  p: string; // Price change
  P: string; // Price change percent
  w: string; // Weighted average price
  c: string; // Last price
  Q: string; // Last quantity
  o: string; // Open price
  h: string; // High price
  l: string; // Low price
  v: string; // Total traded base asset volume
  q: string; // Total traded quote asset volume
  O: number; // Statistics open time
  C: number; // Statistics close time
  F: number; // First trade ID
  L: number; // Last trade ID
  n: number; // Total number of trades
}

export interface BinanceSocketConfig {
  symbol: string;
  interval?: string;
  onMessage?: (data: any) => void;
  onError?: (error: any) => void;
}

export interface BinanceStreamMessage {
  data: any;
  type: 'ticker' | 'kline' | 'depth' | 'trade' | 'unknown';
  symbol: string;
  time: number;
}
