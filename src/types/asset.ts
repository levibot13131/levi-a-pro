export interface Asset {
  id: string;
  name: string;
  symbol: string;
  price: number;
  marketCap: number;
  volume24h: number;
  change24h: number;
}

export interface AssetHistoricalData {
  assetId: string;
  timeframe: '5m' | '15m' | '1h' | '4h' | '1d' | '1w';
  data: {
    timestamp: number;
    price: number;
  }[];
  volumeData?: VolumePoint[];
}

export interface VolumePoint {
  timestamp: number;
  volume: number;
  abnormal?: boolean; // Add abnormal property
}

export interface ChartArea {
  startTimestamp: number;
  endTimestamp: number;
  minPrice: number;
  maxPrice: number;
}
