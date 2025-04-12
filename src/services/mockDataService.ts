
import { Asset, PricePoint, AssetHistoricalData, TimeframeType } from '@/types/asset';

// Mock assets
const mockAssets: Asset[] = [
  {
    id: 'bitcoin',
    symbol: 'BTC',
    name: 'Bitcoin',
    type: 'crypto',
    price: 67850.42,
    change24h: 2.14,
    marketCap: 1322045000000,
    volume24h: 42567000000,
    supply: {
      circulating: 19318750,
      total: 21000000,
      max: 21000000
    },
    rank: 1,
    icon: '/assets/btc.png',
    description: 'Bitcoin is a decentralized digital currency, without a central bank or single administrator.',
    website: 'https://bitcoin.org',
    whitepaper: 'https://bitcoin.org/bitcoin.pdf',
    socials: {
      twitter: 'https://twitter.com/bitcoin',
      telegram: 'https://t.me/bitcoin',
      reddit: 'https://reddit.com/r/bitcoin'
    },
    tags: ['cryptocurrency', 'store-of-value', 'pow']
  },
  {
    id: 'ethereum',
    symbol: 'ETH',
    name: 'Ethereum',
    type: 'crypto',
    price: 3456.78,
    change24h: -1.23,
    marketCap: 415674000000,
    volume24h: 18795000000,
    supply: {
      circulating: 120250000,
      total: 120250000
    },
    rank: 2,
    icon: '/assets/eth.png',
    description: 'Ethereum is a decentralized, open-source blockchain with smart contract functionality.',
    website: 'https://ethereum.org',
    whitepaper: 'https://ethereum.org/whitepaper',
    socials: {
      twitter: 'https://twitter.com/ethereum',
      reddit: 'https://reddit.com/r/ethereum',
      github: 'https://github.com/ethereum'
    },
    tags: ['smart-contracts', 'defi', 'nft']
  },
  {
    id: 'solana',
    symbol: 'SOL',
    name: 'Solana',
    type: 'crypto',
    price: 157.89,
    change24h: 5.67,
    marketCap: 68975000000,
    volume24h: 3421000000,
    supply: {
      circulating: 436982000,
      total: 536982000
    },
    rank: 5,
    icon: '/assets/sol.png',
    description: 'Solana is a high-performance blockchain supporting builders around the world.',
    website: 'https://solana.com',
    tags: ['layer-1', 'smart-contracts', 'high-performance']
  },
  {
    id: 'aapl',
    symbol: 'AAPL',
    name: 'Apple Inc.',
    type: 'stocks',
    price: 185.92,
    change24h: 0.86,
    marketCap: 2987000000000,
    volume24h: 4672000000,
    rank: 1,
    description: 'Apple Inc. designs, manufactures and markets smartphones, personal computers, tablets, wearables and accessories.',
    tags: ['technology', 'consumer-electronics', 'blue-chip']
  },
  {
    id: 'amzn',
    symbol: 'AMZN',
    name: 'Amazon.com Inc.',
    type: 'stocks',
    price: 178.35,
    change24h: -0.94,
    marketCap: 1845000000000,
    volume24h: 3285000000,
    rank: 3,
    description: 'Amazon.com, Inc. is an American multinational technology company focusing on e-commerce, cloud computing, online advertising, digital streaming, and artificial intelligence.',
    tags: ['technology', 'e-commerce', 'cloud-services']
  }
];

// Get all assets
export const getAssets = async (): Promise<Asset[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockAssets;
};

// Get asset by ID
export const getAssetById = async (id: string): Promise<Asset | null> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  const asset = mockAssets.find(a => a.id === id);
  return asset || null;
};

// Get asset historical data
export const getAssetHistory = async (
  assetId: string,
  timeframe: TimeframeType = '1d',
  days: number = 30
): Promise<AssetHistoricalData | null> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const asset = mockAssets.find(a => a.id === assetId);
  if (!asset) return null;
  
  const now = Date.now();
  const pricePoints = [];
  let price = asset.price;
  
  // Generate historical price data
  for (let i = days; i >= 0; i--) {
    // Get timestamp based on timeframe
    let timestamp = 0;
    switch (timeframe) {
      case '1h':
        timestamp = now - (i * 60 * 60 * 1000);
        break;
      case '4h':
        timestamp = now - (i * 4 * 60 * 60 * 1000);
        break;
      case '1d':
        timestamp = now - (i * 24 * 60 * 60 * 1000);
        break;
      case '1w':
        timestamp = now - (i * 7 * 24 * 60 * 60 * 1000);
        break;
      case '1m':
        timestamp = now - (i * 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        timestamp = now - (i * 24 * 60 * 60 * 1000);
    }
    
    // Generate price with some volatility
    // Higher volatility for crypto, lower for stocks
    const volatility = asset.type === 'crypto' ? 0.03 : 0.01;
    const change = (Math.random() - 0.5) * 2 * volatility;
    price = price * (1 + change);
    
    // Push data point
    pricePoints.push([
      timestamp,
      price,
      // Only include volume for some timeframes
      ['1d', '1h'].includes(timeframe) ? (asset.volume24h || 0) * (0.8 + Math.random() * 0.4) / days : 0
    ]);
  }
  
  return {
    id: asset.id,
    symbol: asset.symbol,
    name: asset.name,
    timeframe,
    prices: pricePoints,
    market_caps: pricePoints.map(p => [p[0], (asset.marketCap || 0) * (0.9 + Math.random() * 0.2)]),
    total_volumes: pricePoints.map(p => [p[0], p[2]]),
    data: pricePoints.map(p => ({
      timestamp: p[0],
      price: p[1],
      volume: p[2]
    })),
    firstDate: pricePoints[0][0],
    lastDate: pricePoints[pricePoints.length - 1][0]
  };
};
