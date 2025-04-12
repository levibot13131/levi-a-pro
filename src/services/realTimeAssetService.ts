
import { Asset, AssetHistoricalData, TimeframeType } from '@/types/asset';
import { getAssets as getMockAssets } from '@/services/mockDataService';

// Get asset by ID
export const getAsset = async (assetId: string): Promise<Asset> => {
  // In a real implementation, this would fetch from an API
  const assets = await getMockAssets();
  const asset = assets.find(a => a.id === assetId);
  
  if (!asset) {
    throw new Error(`Asset not found: ${assetId}`);
  }
  
  return asset;
};

// Synchronous version of getAsset (for places that can't use async)
export const getAssetById = (assetId: string): Asset | null => {
  // Use the synchronous assets as a fallback
  const assets = getAllAssetsSync();
  return assets.find(a => a.id === assetId) || null;
};

// Get assets by type
export const getAssetsByType = async (type: string): Promise<Asset[]> => {
  const assets = await getMockAssets();
  return assets.filter(a => a.type === type);
};

// Get all assets
export const getAllAssets = async (): Promise<Asset[]> => {
  return await getMockAssets();
};

// Synchronous version for initializations
export const getAllAssetsSync = (): Asset[] => {
  // This is a mock implementation, in a real app you'd use cached data
  return [
    {
      id: 'bitcoin',
      name: 'Bitcoin',
      symbol: 'BTC',
      type: 'crypto',
      price: 42300.50,
      change24h: 2.5,
      marketCap: 812000000000,
      volume24h: 28500000000,
      rank: 1
    },
    {
      id: 'ethereum',
      name: 'Ethereum',
      symbol: 'ETH',
      type: 'crypto',
      price: 2320.75,
      change24h: 3.2,
      marketCap: 278000000000,
      volume24h: 15700000000,
      rank: 2
    },
    {
      id: 'binance-coin',
      name: 'Binance Coin',
      symbol: 'BNB',
      type: 'crypto',
      price: 320.45,
      change24h: 0.8,
      marketCap: 53000000000,
      volume24h: 1650000000,
      rank: 3
    },
    {
      id: 'apple',
      name: 'Apple Inc.',
      symbol: 'AAPL',
      type: 'stocks',
      price: 175.36,
      change24h: 0.89,
      marketCap: 2850000000000,
      volume24h: 63000000,
      rank: 1
    },
    {
      id: 'microsoft',
      name: 'Microsoft',
      symbol: 'MSFT',
      type: 'stocks',
      price: 320.78,
      change24h: 1.21,
      marketCap: 2450000000000,
      volume24h: 29000000,
      rank: 2
    }
  ];
};

// Get historical prices
export const getAssetHistory = async (
  assetId: string,
  timeframe: TimeframeType = '1d',
  limit: number = 100
): Promise<AssetHistoricalData> => {
  // Generate mock data
  const now = Date.now();
  const asset = await getAsset(assetId);
  
  // Determine time interval in milliseconds based on timeframe
  let interval: number;
  switch (timeframe) {
    case '1m': interval = 60 * 1000; break;
    case '5m': interval = 5 * 60 * 1000; break;
    case '15m': interval = 15 * 60 * 1000; break;
    case '1h': interval = 60 * 60 * 1000; break;
    case '4h': interval = 4 * 60 * 60 * 1000; break;
    case '1d': interval = 24 * 60 * 60 * 1000; break;
    case '1w': interval = 7 * 24 * 60 * 60 * 1000; break;
    default: interval = 24 * 60 * 60 * 1000;
  }
  
  // Generate price data points
  const data = [];
  let price = asset.price;
  let lastChange = 0;
  
  for (let i = 0; i < limit; i++) {
    const timestamp = now - ((limit - i) * interval);
    
    // Generate some random walk price movements
    const volatility = asset.price * 0.005; // 0.5% volatility
    const change = (Math.random() - 0.5) * volatility;
    
    // Add some trend
    const trend = (Math.random() > 0.5) ? 0.0002 : -0.0002;
    
    // Make changes somewhat continuous
    lastChange = (lastChange + change + trend) / 2;
    price = price + lastChange;
    
    // Add some random volume
    const volume = asset.volume24h ? (asset.volume24h / 24) * (0.7 + Math.random() * 0.6) : undefined;
    
    data.push({
      timestamp,
      price: Math.max(0, price), // Make sure price never goes negative
      volume
    });
  }
  
  return {
    id: asset.id,
    symbol: asset.symbol,
    name: asset.name,
    timeframe,
    data,
    firstDate: data[0].timestamp,
    lastDate: data[data.length - 1].timestamp
  };
};

// Subscribe to real-time updates (mock implementation)
export const subscribeToAssetUpdates = (
  assetId: string,
  callback: (asset: Asset) => void
): { unsubscribe: () => void } => {
  let isActive = true;
  
  // Simulate real-time updates
  const interval = setInterval(async () => {
    if (!isActive) return;
    
    try {
      const asset = await getAsset(assetId);
      
      // Generate a small random price change
      const volatility = asset.price * 0.001; // 0.1% volatility
      const change = (Math.random() - 0.5) * volatility;
      const newPrice = asset.price + change;
      
      // Update the asset with new price
      const updatedAsset: Asset = {
        ...asset,
        price: newPrice,
        change24h: asset.change24h + (Math.random() - 0.5) * 0.1
      };
      
      callback(updatedAsset);
    } catch (error) {
      console.error("Error fetching asset updates:", error);
    }
  }, 5000); // Update every 5 seconds
  
  return {
    unsubscribe: () => {
      isActive = false;
      clearInterval(interval);
    }
  };
};
