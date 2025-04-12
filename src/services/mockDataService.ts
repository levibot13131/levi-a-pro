
import { Asset, AssetHistoricalData, AssetType, PricePoint, TimeframeType } from '@/types/asset';

// Mock assets data
const mockAssets: Asset[] = [
  {
    id: 'bitcoin',
    name: 'Bitcoin',
    symbol: 'BTC',
    price: 68423.12,
    change24h: 2.35,
    type: 'crypto',
    icon: '₿',
    marketCap: 1342587450000,
    volume24h: 42587450000,
  },
  {
    id: 'ethereum',
    name: 'Ethereum',
    symbol: 'ETH',
    price: 3342.87,
    change24h: -0.75,
    type: 'crypto',
    icon: 'Ξ',
    marketCap: 401235780000,
    volume24h: 15789632400,
  },
  {
    id: 'solana',
    name: 'Solana',
    symbol: 'SOL',
    price: 143.21,
    change24h: 5.23,
    type: 'crypto',
    icon: '◎',
    marketCap: 65432789000,
    volume24h: 3287496500,
  },
  {
    id: 'aapl',
    name: 'Apple Inc.',
    symbol: 'AAPL',
    price: 187.43,
    change24h: 0.34,
    type: 'stock',
    icon: '🍎',
    marketCap: 2987654320000,
    volume24h: 4578923400,
  },
  {
    id: 'amzn',
    name: 'Amazon.com, Inc.',
    symbol: 'AMZN',
    price: 178.23,
    change24h: -1.05,
    type: 'stock',
    icon: '📦',
    marketCap: 1876543210000,
    volume24h: 3897654320,
  }
];

// Get all assets
export const getAssets = async (): Promise<Asset[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockAssets;
};

// Get asset by ID
export const getAssetById = async (id: string): Promise<Asset | undefined> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockAssets.find(asset => asset.id === id);
};

// Generate mock historical data
export const getAssetHistory = async (
  assetId: string,
  timeframe: TimeframeType = '1d',
  days: number = 30
): Promise<AssetHistoricalData> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Get base asset price
  const asset = mockAssets.find(a => a.id === assetId);
  if (!asset) {
    throw new Error(`Asset with ID ${assetId} not found`);
  }
  
  const basePrice = asset.price;
  
  // Generate price points
  const now = Date.now();
  const data: PricePoint[] = [];
  
  // Timeframe in milliseconds
  let timeStep: number;
  switch (timeframe) {
    case '5m': timeStep = 5 * 60 * 1000; days = 1; break;
    case '15m': timeStep = 15 * 60 * 1000; days = 3; break;
    case '1h': timeStep = 60 * 60 * 1000; days = 7; break;
    case '4h': timeStep = 4 * 60 * 60 * 1000; days = 14; break;
    case '1d': timeStep = 24 * 60 * 60 * 1000; break;
    case '1w': timeStep = 7 * 24 * 60 * 60 * 1000; days = 52; break;
    default: timeStep = 24 * 60 * 60 * 1000;
  }
  
  // Number of points based on timeframe and days
  const points = Math.floor((days * 24 * 60 * 60 * 1000) / timeStep);
  
  // Generate sine wave with random noise
  for (let i = 0; i < points; i++) {
    const timestamp = now - ((points - i) * timeStep);
    
    // Base trend: Sine wave with 1.5 cycles over the period
    const trend = Math.sin((i / points) * Math.PI * 1.5) * 0.2;
    
    // Random walk component
    const volatility = asset.id === 'bitcoin' ? 0.03 : asset.id === 'solana' ? 0.05 : 0.02;
    let randomWalk = 0;
    for (let j = 0; j <= i; j++) {
      randomWalk += (Math.random() * 2 - 1) * volatility / Math.sqrt(points);
    }
    
    // Combine components
    const priceModifier = 1 + trend + randomWalk;
    const price = basePrice * priceModifier;
    
    // Random volume
    const volume = Math.random() * basePrice * 10000 * (1 + Math.sin((i / points) * Math.PI * 3) * 0.5);
    
    data.push({
      timestamp,
      price,
      volume
    });
  }
  
  return {
    assetId,
    timeframe,
    data
  };
};

// Function to find assets by type
export const getAssetsByType = async (type: AssetType): Promise<Asset[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockAssets.filter(asset => asset.type === type);
};

// Search assets by name or symbol
export const searchAssets = async (query: string): Promise<Asset[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  if (!query) return [];
  
  const searchTerm = query.toLowerCase();
  return mockAssets.filter(
    asset => 
      asset.name.toLowerCase().includes(searchTerm) || 
      asset.symbol.toLowerCase().includes(searchTerm)
  );
};
