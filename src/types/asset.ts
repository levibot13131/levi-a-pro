
export interface PricePoint {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  price?: number; // Optional fallback for close price
}

export interface Asset {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap?: number;
}

export interface MarketDataPoint {
  timestamp: number;
  price: number;
  volume: number;
  high: number;
  low: number;
  open: number;
  close: number;
}
