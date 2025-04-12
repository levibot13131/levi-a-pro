import { Asset } from '@/types/asset';
import { toast } from 'sonner';

// Map of market types to their asset lists
const marketAssets: Record<string, Asset[]> = {
  crypto: [],
  stocks: [],
  forex: [],
  commodities: []
};

// Realistic market characteristics
const marketCharacteristics = {
  crypto: {
    topAssetPrice: 83000, // BTC price
    priceRange: { min: 0.01, max: 83000 },
    volatility: { base: 0.02, random: 0.03 }, // Higher volatility for crypto
    volumeMultiplier: { base: 1000000, random: 5000000 },
    marketCapMultiplier: { min: 500000, max: 10000000000 }
  },
  stocks: {
    topAssetPrice: 180, // Average top stock price
    priceRange: { min: 5, max: 3500 },
    volatility: { base: 0.01, random: 0.015 },
    volumeMultiplier: { base: 500000, random: 2000000 },
    marketCapMultiplier: { min: 10000000, max: 3000000000 }
  },
  forex: {
    topAssetPrice: 1.2, // Average forex pair value
    priceRange: { min: 0.5, max: 200 },
    volatility: { base: 0.005, random: 0.007 }, // Lower volatility for forex
    volumeMultiplier: { base: 5000000, random: 20000000 },
    marketCapMultiplier: { min: 0, max: 0 } // Forex doesn't really have market cap
  },
  commodities: {
    topAssetPrice: 2000, // Gold price approximation
    priceRange: { min: 10, max: 2000 },
    volatility: { base: 0.008, random: 0.012 },
    volumeMultiplier: { base: 200000, random: 1000000 },
    marketCapMultiplier: { min: 500000, max: 500000000 }
  }
};

// Asset importance tiers (affects price and volume)
const assetTiers = {
  tier1: { priceMultiplier: 1.0, volumeMultiplier: 5.0, marketCapMultiplier: 10.0 },  // Top assets like BTC, AAPL
  tier2: { priceMultiplier: 0.5, volumeMultiplier: 2.0, marketCapMultiplier: 3.0 },   // Medium importance
  tier3: { priceMultiplier: 0.2, volumeMultiplier: 1.0, marketCapMultiplier: 1.0 }    // Less important assets
};

// Market prefixes with asset tiers
const marketPrefixes: Record<string, Array<{symbol: string, tier: keyof typeof assetTiers}>> = {
  crypto: [
    {symbol: 'BTC', tier: 'tier1'}, {symbol: 'ETH', tier: 'tier1'}, 
    {symbol: 'SOL', tier: 'tier2'}, {symbol: 'ADA', tier: 'tier2'}, 
    {symbol: 'XRP', tier: 'tier2'}, {symbol: 'DOT', tier: 'tier3'}, 
    {symbol: 'AVAX', tier: 'tier3'}, {symbol: 'MATIC', tier: 'tier3'}, 
    {symbol: 'LINK', tier: 'tier3'}, {symbol: 'UNI', tier: 'tier3'}
  ],
  stocks: [
    {symbol: 'AAPL', tier: 'tier1'}, {symbol: 'MSFT', tier: 'tier1'}, 
    {symbol: 'GOOGL', tier: 'tier1'}, {symbol: 'AMZN', tier: 'tier1'}, 
    {symbol: 'META', tier: 'tier2'}, {symbol: 'TSLA', tier: 'tier2'}, 
    {symbol: 'NVDA', tier: 'tier2'}, {symbol: 'JPM', tier: 'tier3'}, 
    {symbol: 'V', tier: 'tier3'}, {symbol: 'WMT', tier: 'tier3'}
  ],
  forex: [
    {symbol: 'EUR', tier: 'tier1'}, {symbol: 'GBP', tier: 'tier1'}, 
    {symbol: 'JPY', tier: 'tier1'}, {symbol: 'AUD', tier: 'tier2'}, 
    {symbol: 'CAD', tier: 'tier2'}, {symbol: 'CHF', tier: 'tier2'}, 
    {symbol: 'NZD', tier: 'tier3'}, {symbol: 'SEK', tier: 'tier3'}, 
    {symbol: 'NOK', tier: 'tier3'}, {symbol: 'DKK', tier: 'tier3'}
  ],
  commodities: [
    {symbol: 'GOLD', tier: 'tier1'}, {symbol: 'SILVER', tier: 'tier2'}, 
    {symbol: 'OIL', tier: 'tier1'}, {symbol: 'GAS', tier: 'tier2'}, 
    {symbol: 'COPPER', tier: 'tier2'}, {symbol: 'WHEAT', tier: 'tier3'}, 
    {symbol: 'CORN', tier: 'tier3'}, {symbol: 'COFFEE', tier: 'tier3'}, 
    {symbol: 'SUGAR', tier: 'tier3'}, {symbol: 'COTTON', tier: 'tier3'}
  ]
};

// Generate mock assets with more realistic data
const generateMockAssets = (market: string, count: number = 50): Asset[] => {
  const assets: Asset[] = [];
  const marketData = marketCharacteristics[market as keyof typeof marketCharacteristics] || marketCharacteristics.crypto;
  const prefixList = marketPrefixes[market] || marketPrefixes.crypto;
  
  // Generate top assets first with their tiers
  prefixList.forEach((asset, index) => {
    if (index >= count) return;
    
    const { symbol, tier } = asset;
    const tierData = assetTiers[tier];
    
    // Calculate price based on tier and market
    let price: number;
    if (symbol === 'BTC' && market === 'crypto') {
      price = marketData.topAssetPrice; // BTC gets exact price
    } else if (symbol === 'ETH' && market === 'crypto') {
      price = marketData.topAssetPrice * 0.05; // ETH is about 5% of BTC
    } else if (symbol === 'GOLD' && market === 'commodities') {
      price = marketData.topAssetPrice; // Gold gets its exact price
    } else {
      // Other assets get scaled prices based on their tier
      const maxPrice = marketData.priceRange.max * tierData.priceMultiplier;
      const minPrice = marketData.priceRange.min;
      price = minPrice + (Math.random() * (maxPrice - minPrice));
    }
    
    // More realistic changes - top tier assets have less dramatic movements
    const volatilityFactor = tier === 'tier1' ? 0.7 : tier === 'tier2' ? 1.0 : 1.3;
    const change24h = ((Math.random() * 2 - 1) * marketData.volatility.base * volatilityFactor * 10);
    
    // Volume based on price and tier
    const volumeBase = price * (marketData.volumeMultiplier.base * tierData.volumeMultiplier);
    const volumeRandom = price * (Math.random() * marketData.volumeMultiplier.random * tierData.volumeMultiplier);
    const volume24h = volumeBase + volumeRandom;
    
    // Market cap calculation (except for forex)
    let marketCap: number;
    if (market === 'forex') {
      marketCap = 0; // Forex doesn't have market cap
    } else {
      const marketCapBase = price * marketData.marketCapMultiplier.min * tierData.marketCapMultiplier;
      const marketCapRandom = price * Math.random() * (marketData.marketCapMultiplier.max - marketData.marketCapMultiplier.min) * tierData.marketCapMultiplier;
      marketCap = marketCapBase + marketCapRandom;
    }
    
    // Create the asset
    assets.push({
      id: `${market}-${symbol}`,
      name: getFullName(symbol, market),
      symbol,
      price,
      marketCap,
      volume24h,
      change24h,
      type: market as 'crypto' | 'stocks' | 'forex' | 'commodities',
      imageUrl: `/assets/${market}/${symbol.toLowerCase()}.png`
    });
  });
  
  // Fill remaining assets with generated ones if needed
  if (assets.length < count) {
    const remainingCount = count - assets.length;
    
    for (let i = 0; i < remainingCount; i++) {
      const tier: keyof typeof assetTiers = i < remainingCount * 0.3 ? 'tier2' : 'tier3';
      const tierData = assetTiers[tier];
      
      // Create a suffix for additional assets
      const baseSymbol = prefixList[i % prefixList.length].symbol;
      const suffix = Math.floor(i / prefixList.length) + 1;
      const symbol = `${baseSymbol}${suffix}`;
      
      // Calculate price with more variation for additional assets
      const maxPrice = marketData.priceRange.max * tierData.priceMultiplier * 0.5;
      const minPrice = marketData.priceRange.min;
      const price = minPrice + (Math.random() * (maxPrice - minPrice));
      
      // More realistic changes for additional assets
      const change24h = ((Math.random() * 2 - 1) * marketData.volatility.base * 1.5 * 10);
      
      // Volume and market cap calculations
      const volume24h = price * (marketData.volumeMultiplier.base * tierData.volumeMultiplier * 0.5 + 
                             Math.random() * marketData.volumeMultiplier.random * tierData.volumeMultiplier * 0.5);
      
      let marketCap: number;
      if (market === 'forex') {
        marketCap = 0;
      } else {
        marketCap = price * (marketData.marketCapMultiplier.min * tierData.marketCapMultiplier * 0.3 + 
                         Math.random() * (marketData.marketCapMultiplier.max - marketData.marketCapMultiplier.min) * tierData.marketCapMultiplier * 0.3);
      }
      
      // Create the additional asset
      assets.push({
        id: `${market}-${symbol}`,
        name: getFullName(symbol, market),
        symbol,
        price,
        marketCap,
        volume24h,
        change24h,
        type: market as 'crypto' | 'stocks' | 'forex' | 'commodities',
        imageUrl: `/assets/${market}/${baseSymbol.toLowerCase()}.png`
      });
    }
  }
  
  return assets;
};

// Get full name for an asset symbol
const getFullName = (symbol: string, market: string): string => {
  const nameMap: Record<string, Record<string, string>> = {
    crypto: {
      'BTC': 'Bitcoin',
      'ETH': 'Ethereum',
      'SOL': 'Solana',
      'ADA': 'Cardano',
      'XRP': 'XRP',
      'DOT': 'Polkadot',
      'AVAX': 'Avalanche',
      'MATIC': 'Polygon',
      'LINK': 'Chainlink',
      'UNI': 'Uniswap'
    },
    stocks: {
      'AAPL': 'Apple Inc.',
      'MSFT': 'Microsoft Corp.',
      'GOOGL': 'Alphabet Inc.',
      'AMZN': 'Amazon.com Inc.',
      'META': 'Meta Platforms Inc.',
      'TSLA': 'Tesla Inc.',
      'NVDA': 'NVIDIA Corp.',
      'JPM': 'JPMorgan Chase & Co.',
      'V': 'Visa Inc.',
      'WMT': 'Walmart Inc.'
    },
    forex: {
      'EUR': 'Euro/USD',
      'GBP': 'British Pound/USD',
      'JPY': 'Japanese Yen/USD',
      'AUD': 'Australian Dollar/USD',
      'CAD': 'Canadian Dollar/USD',
      'CHF': 'Swiss Franc/USD',
      'NZD': 'New Zealand Dollar/USD',
      'SEK': 'Swedish Krona/USD',
      'NOK': 'Norwegian Krone/USD',
      'DKK': 'Danish Krone/USD'
    },
    commodities: {
      'GOLD': 'Gold',
      'SILVER': 'Silver',
      'OIL': 'Crude Oil',
      'GAS': 'Natural Gas',
      'COPPER': 'Copper',
      'WHEAT': 'Wheat',
      'CORN': 'Corn',
      'COFFEE': 'Coffee',
      'SUGAR': 'Sugar',
      'COTTON': 'Cotton'
    }
  };
  
  // Extract base symbol if it has a number suffix
  const match = symbol.match(/^([A-Z]+)(\d+)?$/);
  const baseSymbol = match ? match[1] : symbol;
  const suffix = match && match[2] ? ` ${match[2]}` : '';
  
  // Get name from map or fallback to symbol
  const baseName = nameMap[market]?.[baseSymbol] || baseSymbol;
  return baseName + suffix;
};

// Initialize with mock data
export const initializeAssets = () => {
  Object.keys(marketAssets).forEach(market => {
    marketAssets[market] = generateMockAssets(market);
  });
  
  console.log('Initialized asset data for all markets');
  startRealTimeUpdates();
};

// Update assets in real-time with more realistic market behavior
let updateInterval: ReturnType<typeof setInterval> | null = null;

export const startRealTimeUpdates = () => {
  if (updateInterval) return;
  
  updateInterval = setInterval(() => {
    Object.keys(marketAssets).forEach(market => {
      const marketData = marketCharacteristics[market as keyof typeof marketCharacteristics] || marketCharacteristics.crypto;
      
      marketAssets[market].forEach(asset => {
        // Get asset tier information
        const assetInfo = marketPrefixes[market]?.find(a => a.symbol === asset.symbol.replace(/\d+$/, ''));
        const tier = assetInfo?.tier || 'tier3';
        const tierData = assetTiers[tier];
        
        // Base volatility adjusted by tier (top-tier assets move less)
        const tierVolatilityFactor = tier === 'tier1' ? 0.7 : tier === 'tier2' ? 1.0 : 1.3;
        
        // Apply more realistic price movement
        // Base volatility from market + random component + adjustments
        const baseMovement = marketData.volatility.base;
        const randomComponent = (Math.random() * 2 - 1) * marketData.volatility.random;
        
        // Time-based factor: sometimes market moves more, sometimes less
        const timeEffect = Math.sin(Date.now() / 10000000) * 0.005;
        
        // Trend continuation: prices tend to continue in the same direction
        const trendContinuation = asset.change24h > 0 ? 0.002 : -0.002;
        
        // Combine all factors for final price change
        const priceChange = asset.price * (
          baseMovement * tierVolatilityFactor + 
          randomComponent + 
          timeEffect + 
          trendContinuation * Math.random()
        );
        
        asset.price += priceChange;
        if (asset.price < 0) asset.price = 0.01; // Prevent negative prices
        
        // Update 24h change based on movement
        const changeEffect = (priceChange / asset.price) * 100;
        asset.change24h = asset.change24h * 0.95 + changeEffect; // Blend old and new changes
        
        // Keep change24h in reasonable bounds based on asset type and tier
        const maxChange = tier === 'tier1' ? 15 : tier === 'tier2' ? 20 : 25;
        if (asset.change24h > maxChange) asset.change24h = maxChange;
        if (asset.change24h < -maxChange) asset.change24h = -maxChange;
        
        // Update volume with time-dependent oscillation
        const volumeFactor = 1 + Math.sin(Date.now() / 5000000) * 0.2; // Volume oscillates over time
        const randomVolume = (Math.random() * 0.2 - 0.1); // Random fluctuation -10% to +10%
        asset.volume24h = asset.volume24h * (1 + randomVolume) * volumeFactor;
        
        // Update market cap based on new price (except forex)
        if (market !== 'forex') {
          asset.marketCap = asset.marketCap * (1 + (priceChange / asset.price));
        }
      });
    });
    
    // Occasionally trigger significant price movement for random assets
    if (Math.random() > 0.9) {
      const market = Object.keys(marketAssets)[Math.floor(Math.random() * Object.keys(marketAssets).length)];
      const assetIndex = Math.floor(Math.random() * marketAssets[market].length);
      const asset = marketAssets[market][assetIndex];
      
      // Determine if it's a positive or negative move (slightly biased towards positive)
      const isPositive = Math.random() > 0.45;
      
      // Calculate significant move - between 3% and 15%
      const movePercentage = (isPositive ? 1 : -1) * (3 + Math.random() * 12);
      const significantMove = asset.price * (movePercentage / 100);
      
      // Apply the move
      asset.price += significantMove;
      asset.change24h += movePercentage;
      
      // Cap the change to reasonable bounds
      if (asset.change24h > 30) asset.change24h = 30;
      if (asset.change24h < -30) asset.change24h = -30;
      
      // Notify the user about significant price movement
      if (Math.abs(movePercentage) > 5) {
        toast.info(`תנועת מחיר משמעותית ב-${asset.name}`, {
          description: `${movePercentage > 0 ? '+' : ''}${movePercentage.toFixed(2)}% בדקות האחרונות`
        });
      }
    }
  }, 3000);
  
  console.log('Started real-time asset updates with enhanced market behavior');
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
