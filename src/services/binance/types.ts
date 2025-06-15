
// Types for Binance WebSocket and market data

export interface BinanceSocketConfig {
  symbol: string;
  interval?: string;
  onMessage: (data: BinanceStreamMessage) => void;
  onError?: (error: any) => void;
}

export interface BinanceStreamMessage {
  symbol: string;
  type: 'ticker' | 'kline' | 'trade';
  data: {
    price: number;
    change: number;
    high24h: number;
    low24h: number;
    volume24h: number;
  };
}

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

export interface KlineData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  closeTime: number;
  quoteAssetVolume: number;
  trades: number;
  takerBuyBaseAssetVolume: number;
  takerBuyQuoteAssetVolume: number;
}

export interface TickerData {
  symbol: string;
  priceChange: string;
  priceChangePercent: string;
  weightedAvgPrice: string;
  prevClosePrice: string;
  lastPrice: string;
  lastQty: string;
  bidPrice: string;
  bidQty: string;
  askPrice: string;
  askQty: string;
  openPrice: string;
  highPrice: string;
  lowPrice: string;
  volume: string;
  quoteVolume: string;
  openTime: number;
  closeTime: number;
  firstId: number;
  lastId: number;
  count: number;
}
