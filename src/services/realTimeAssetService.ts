
import { Asset, AssetType, TimeframeType } from '@/types/asset';
import { toast } from 'sonner';

let assets: Asset[] = [];
let trendingAssets: Asset[] = [];
let isInitialized = false;

/**
 * Initialize asset data
 */
export const initializeAssets = async () => {
  if (isInitialized) return;
  
  try {
    // In a real app, we would fetch this from an API
    // For demo purposes, we'll use mock data
    assets = await fetchMockAssets();
    trendingAssets = generateTrendingAssets();
    isInitialized = true;
  } catch (error) {
    console.error('Failed to initialize asset data:', error);
    toast.error('שגיאה בטעינת נתוני נכסים', {
      description: 'לא ניתן לטעון את נתוני הנכסים'
    });
  }
};

/**
 * Get all assets regardless of type
 */
export const getAllAssets = async (): Promise<Asset[]> => {
  if (!isInitialized) {
    await initializeAssets();
  }
  
  return assets;
};

/**
 * Get all assets (synchronous version)
 */
export const getAllAssetsSync = (): Asset[] => {
  if (!isInitialized) {
    // Initialize assets synchronously if not already done
    // This is not ideal, but necessary for some use cases
    console.warn('Accessing assets before initialization. Call initializeAssets() first for better performance.');
    return [];
  }
  
  return assets;
};

/**
 * Get all assets
 */
export const getMarketAssets = async (type?: AssetType): Promise<Asset[]> => {
  if (!isInitialized) {
    await initializeAssets();
  }
  
  if (type) {
    return assets.filter(asset => asset.type === type);
  }
  
  return assets;
};

/**
 * Get trending assets
 */
export const getTrendingAssets = async (): Promise<Asset[]> => {
  if (!isInitialized) {
    await initializeAssets();
  }
  
  return trendingAssets;
};

/**
 * Get asset by id
 */
export const getAssetById = async (id: string): Promise<Asset | null> => {
  if (!isInitialized) {
    await initializeAssets();
  }
  
  const asset = assets.find(asset => asset.id === id);
  return asset || null;
};

/**
 * Get historical price data for an asset
 */
export const getHistoricalPriceData = async (
  assetId: string, 
  timeframe: TimeframeType = '1d',
  limit: number = 100
): Promise<{ timestamp: number; price: number; volume?: number }[]> => {
  // In a real app, we would fetch this from an API
  // For demo purposes, we'll generate mock data
  
  const asset = await getAssetById(assetId);
  if (!asset) return [];
  
  const now = Date.now();
  const data: { timestamp: number; price: number; volume?: number }[] = [];
  
  let timeInterval = 24 * 60 * 60 * 1000; // 1 day in milliseconds
  switch(timeframe) {
    case '1h': timeInterval = 60 * 60 * 1000; break;
    case '4h': timeInterval = 4 * 60 * 60 * 1000; break;
    case '1w': timeInterval = 7 * 24 * 60 * 60 * 1000; break;
    case '1m': timeInterval = 30 * 24 * 60 * 60 * 1000; break;
  }
  
  let currentPrice = asset.price;
  let volatility = 0.02; // 2% daily volatility
  
  // Generate mock data points
  for (let i = limit - 1; i >= 0; i--) {
    const timestamp = now - (i * timeInterval);
    const randomChange = (Math.random() - 0.5) * 2 * volatility;
    currentPrice = currentPrice * (1 + randomChange);
    
    // Generate mock volume
    const volume = currentPrice * (100000 + Math.random() * 900000);
    
    data.push({
      timestamp,
      price: currentPrice,
      volume
    });
  }
  
  return data;
};

/**
 * Fetch mock assets
 */
const fetchMockAssets = async (): Promise<Asset[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return [
    {
      id: 'bitcoin',
      symbol: 'BTC',
      name: 'Bitcoin',
      type: 'crypto',
      price: 50000 + (Math.random() * 3000),
      change24h: (Math.random() * 10) - 5,
      marketCap: 950000000000,
      volume24h: 45000000000,
      rank: 1,
      icon: '/icons/btc.svg',
      imageUrl: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
      description: 'Bitcoin is a decentralized digital currency that can be transferred on the peer-to-peer bitcoin network.'
    },
    {
      id: 'ethereum',
      symbol: 'ETH',
      name: 'Ethereum',
      type: 'crypto',
      price: 3000 + (Math.random() * 200),
      change24h: (Math.random() * 10) - 5,
      marketCap: 350000000000,
      volume24h: 20000000000,
      rank: 2,
      icon: '/icons/eth.svg',
      imageUrl: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
      description: 'Ethereum is a decentralized, open-source blockchain with smart contract functionality.'
    },
    {
      id: 'ripple',
      symbol: 'XRP',
      name: 'Ripple',
      type: 'crypto',
      price: 0.5 + (Math.random() * 0.1),
      change24h: (Math.random() * 10) - 5,
      marketCap: 25000000000,
      volume24h: 2000000000,
      rank: 5,
      icon: '/icons/xrp.svg',
      imageUrl: 'https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png',
      description: 'Ripple is a real-time gross settlement system, currency exchange and remittance network.'
    },
    {
      id: 'apple',
      symbol: 'AAPL',
      name: 'Apple Inc.',
      type: 'stocks',
      price: 180 + (Math.random() * 10),
      change24h: (Math.random() * 4) - 2,
      marketCap: 3000000000000,
      volume24h: 15000000000,
      rank: 1,
      icon: '/icons/aapl.svg',
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg',
      description: 'Apple Inc. is an American multinational technology company that designs, develops, and sells consumer electronics, computer software, and online services.'
    },
    {
      id: 'tesla',
      symbol: 'TSLA',
      name: 'Tesla, Inc.',
      type: 'stocks',
      price: 220 + (Math.random() * 15),
      change24h: (Math.random() * 6) - 3,
      marketCap: 700000000000,
      volume24h: 25000000000,
      rank: 6,
      icon: '/icons/tsla.svg',
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e8/Tesla_logo.png',
      description: 'Tesla, Inc. is an American electric vehicle and clean energy company.'
    }
  ];
};

/**
 * Generate trending assets
 */
const generateTrendingAssets = (): Asset[] => {
  // In a real app, this would be based on some metrics
  // For demo purposes, we'll just take a few random assets
  return assets
    .sort(() => Math.random() - 0.5)
    .slice(0, Math.min(assets.length, 3));
};
