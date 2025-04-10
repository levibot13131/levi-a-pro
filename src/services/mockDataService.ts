import { Asset, AssetHistoricalData, PricePoint, VolumePoint, TimeframeType } from "@/types/asset";

// נתונים סטטיים לדוגמה
const MOCK_ASSETS: Asset[] = [
  {
    id: "bitcoin",
    symbol: "BTC",
    name: "Bitcoin",
    type: "crypto",
    price: 67250.42,
    change24h: 2.35,
    volume24h: 24500000000,
    marketCap: 1280000000000,
    imageUrl: "https://cryptologos.cc/logos/bitcoin-btc-logo.png"
  },
  {
    id: "ethereum",
    symbol: "ETH",
    name: "Ethereum",
    type: "crypto",
    price: 3325.18,
    change24h: -1.24,
    volume24h: 12800000000,
    marketCap: 398000000000,
    imageUrl: "https://cryptologos.cc/logos/ethereum-eth-logo.png"
  },
  {
    id: "apple",
    symbol: "AAPL",
    name: "Apple Inc.",
    type: "stock",
    price: 175.52,
    change24h: 0.87,
    volume24h: 65700000,
    marketCap: 2750000000000,
    imageUrl: "https://companieslogo.com/img/orig/AAPL-bf1a4314.png"
  },
  {
    id: "microsoft",
    symbol: "MSFT",
    name: "Microsoft Corporation",
    type: "stock",
    price: 406.32,
    change24h: 1.12,
    volume24h: 34500000,
    marketCap: 3020000000000,
    imageUrl: "https://companieslogo.com/img/orig/MSFT-a203b22d.png"
  },
  {
    id: "eurusd",
    symbol: "EUR/USD",
    name: "Euro / US Dollar",
    type: "forex",
    price: 1.0762,
    change24h: -0.25,
    volume24h: 98500000000,
    marketCap: 0,
    imageUrl: "https://www.investopedia.com/thmb/cILSK5rWO3iqQbdNiMxKJOe7Zf4=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/EUR-USD_2019-69b39ed9619646d5b08fd7a2ee1a1c91.jpg"
  }
];

// יצירת נתונים היסטוריים מדומים
const generateHistoricalData = (basePrice: number, days: number): PricePoint[] => {
  const data: PricePoint[] = [];
  const now = Date.now();
  const dayInMs = 86400000;
  
  for (let i = days; i >= 0; i--) {
    const timestamp = now - (i * dayInMs);
    // נוסיף תנודתיות רנדומלית של עד 5%
    const volatility = (Math.random() - 0.5) * 0.05;
    const dayFactor = 1 + volatility;
    const price = basePrice * Math.pow(dayFactor, days - i);
    
    data.push({
      timestamp,
      price: parseFloat(price.toFixed(2))
    });
  }
  
  return data;
};

// יצירת נתוני נפח מדומים
const generateVolumeData = (baseVolume: number, days: number): VolumePoint[] => {
  const data: VolumePoint[] = [];
  const now = Date.now();
  const dayInMs = 86400000;
  
  for (let i = days; i >= 0; i--) {
    const timestamp = now - (i * dayInMs);
    // נוסיף תנודתיות רנדומלית של עד 30%
    const volatility = (Math.random() - 0.5) * 0.6;
    const dayFactor = 1 + volatility;
    const volume = baseVolume * Math.pow(dayFactor, Math.random() * 0.5);
    
    data.push({
      timestamp,
      volume: Math.round(volume)
    });
  }
  
  return data;
};

// פונקציות שירות לקבלת נתונים
export const getAssets = async (): Promise<Asset[]> => {
  // מדמה תקשורת עם שרת
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_ASSETS), 500);
  });
};

export const getAssetById = async (id: string): Promise<Asset | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const asset = MOCK_ASSETS.find(asset => asset.id === id);
      resolve(asset);
    }, 300);
  });
};

export const getAssetHistory = async (
  assetId: string,
  timeframe: TimeframeType
): Promise<AssetHistoricalData> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const asset = MOCK_ASSETS.find(a => a.id === assetId);
      
      if (!asset) {
        throw new Error(`Asset with ID ${assetId} not found`);
      }
      
      let days = 30;
      switch (timeframe) {
        case '1d': days = 1; break;
        case '1w': days = 7; break;
        case '5m': days = 1; break;
        case '15m': days = 2; break;
        case '1h': days = 5; break;
        case '4h': days = 15; break;
        case '1m': days = 30; break;
        case '3m': days = 90; break;
        case '1y': days = 365; break;
        case '30m': days = 3; break;
        case '1M': days = 30; break;
        case 'all': days = 1095; break; // ~3 years
      }
      
      const data = generateHistoricalData(asset.price, days);
      const volumeData = generateVolumeData(asset.volume24h / 24, days); // Daily average volume
      
      resolve({
        assetId,
        timeframe,
        data,
        volumeData
      });
    }, 700);
  });
};
