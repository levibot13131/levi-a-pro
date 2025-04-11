import { Asset } from '@/types/asset';
import { toast } from 'sonner';

// Map of market types to their asset lists
const marketAssets: Record<string, Asset[]> = {
  crypto: [],
  stocks: [],
  forex: [],
  commodities: []
};

// Mock initial data
const generateMockAssets = (market: string, count: number = 50): Asset[] => {
  const assets: Asset[] = [];
  const basePrice = market === 'crypto' ? 3000 : market === 'stocks' ? 150 : market === 'forex' ? 1 : 1800;
  
  // Prefixes for different markets
  const prefixes: Record<string, string[]> = {
    crypto: ['BTC', 'ETH', 'SOL', 'ADA', 'XRP', 'DOT', 'AVAX', 'MATIC', 'LINK', 'UNI'],
    stocks: ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'META', 'TSLA', 'NVDA', 'JPM', 'V', 'WMT'],
    forex: ['EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'NZD', 'SEK', 'NOK', 'DKK'],
    commodities: ['GOLD', 'SILVER', 'OIL', 'GAS', 'COPPER', 'WHEAT', 'CORN', 'COFFEE', 'SUGAR', 'COTTON']
  };
  
  const marketPrefix = prefixes[market] || prefixes.crypto;
  
  for (let i = 0; i < count; i++) {
    // Cycle through prefixes and add numbers for additional assets
    const prefix = marketPrefix[i % marketPrefix.length];
    const suffix = i >= marketPrefix.length ? `-${Math.floor(i / marketPrefix.length)}` : '';
    
    const price = basePrice * (0.5 + Math.random() * 1.5);
    const change24h = (Math.random() * 10) - 5; // -5% to +5%
    
    assets.push({
      id: `${market}-${prefix}${suffix}`,
      name: `${prefix}${suffix}`,
      symbol: `${prefix}${suffix}`,
      price,
      marketCap: price * (1_000_000 + Math.random() * 10_000_000),
      volume24h: price * (500_000 + Math.random() * 2_000_000),
      change24h,
      type: market as 'crypto' | 'stocks' | 'forex' | 'commodities',
      imageUrl: `/assets/${market}/${prefix.toLowerCase()}.png`
    });
  }
  
  return assets;
};

// Initialize with mock data
export const initializeAssets = () => {
  Object.keys(marketAssets).forEach(market => {
    marketAssets[market] = generateMockAssets(market);
  });
  
  console.log('Initialized asset data for all markets');
  startRealTimeUpdates();
};

// Update assets in real-time (simulated)
let updateInterval: ReturnType<typeof setInterval> | null = null;

export const startRealTimeUpdates = () => {
  if (updateInterval) return;
  
  updateInterval = setInterval(() => {
    Object.keys(marketAssets).forEach(market => {
      marketAssets[market].forEach(asset => {
        // Simulate price movement
        const priceChange = asset.price * (Math.random() * 0.02 - 0.01); // -1% to +1%
        asset.price += priceChange;
        
        // Update 24h change based on random movement
        asset.change24h += (Math.random() * 0.4) - 0.2; // Small adjustment to trend
        
        // Keep change24h in reasonable bounds
        if (asset.change24h > 15) asset.change24h = 15;
        if (asset.change24h < -15) asset.change24h = -15;
        
        // Update volume
        asset.volume24h += asset.volume24h * (Math.random() * 0.1 - 0.05);
      });
    });
    
    // Occasionally trigger significant price movement for random assets
    if (Math.random() > 0.9) {
      const market = Object.keys(marketAssets)[Math.floor(Math.random() * Object.keys(marketAssets).length)];
      const assetIndex = Math.floor(Math.random() * marketAssets[market].length);
      const asset = marketAssets[market][assetIndex];
      
      const significantMove = asset.price * (Math.random() * 0.15 - 0.05); // -5% to +15%
      asset.price += significantMove;
      asset.change24h += (significantMove / asset.price) * 100;
      
      if (Math.abs(significantMove / asset.price) > 0.05) {
        toast.info(`תנועת מחיר משמעותית ב-${asset.name}`, {
          description: `${significantMove > 0 ? '+' : ''}${(significantMove / asset.price * 100).toFixed(2)}% בדקות האחרונות`
        });
      }
    }
  }, 3000);
  
  console.log('Started real-time asset updates');
};

export const stopRealTimeUpdates = () => {
  if (updateInterval) {
    clearInterval(updateInterval);
    updateInterval = null;
    console.log('Stopped real-time asset updates');
  }
};

// Get assets for a specific market
export const getMarketAssets = (market: string): Asset[] => {
  return marketAssets[market] || [];
};

// Get all assets across all markets
export const getAllAssets = (): Asset[] => {
  return Object.values(marketAssets).flat();
};

// Get a specific asset by ID
export const getAssetById = (id: string): Asset | undefined => {
  return getAllAssets().find(asset => asset.id === id);
};

// Get trending assets (those with highest absolute change)
export const getTrendingAssets = (count: number = 10): Asset[] => {
  return getAllAssets()
    .sort((a, b) => Math.abs(b.change24h) - Math.abs(a.change24h))
    .slice(0, count);
};

// Search assets by name or symbol
export const searchAssets = (query: string): Asset[] => {
  const lowerQuery = query.toLowerCase();
  return getAllAssets().filter(asset => 
    asset.name.toLowerCase().includes(lowerQuery) || 
    asset.symbol.toLowerCase().includes(lowerQuery)
  );
};
