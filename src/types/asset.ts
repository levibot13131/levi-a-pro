
export type AssetType = 'crypto' | 'stock' | 'forex';

export interface Asset {
  id: string;
  symbol: string;
  name: string;
  type: AssetType;
  price: number;
  change24h: number; // באחוזים
  volume24h: number;
  marketCap?: number; // רלוונטי בעיקר לקריפטו ומניות
  imageUrl?: string;
}

export interface PricePoint {
  timestamp: number; // UNIX timestamp
  price: number;
}

export interface AssetHistoricalData {
  assetId: string;
  timeframe: '1d' | '1w' | '1m' | '3m' | '1y' | 'all';
  data: PricePoint[];
}
