
// Local storage key for real-time mode setting
const REAL_TIME_MODE_KEY = 'binance_real_time_mode';

// Check if real-time mode is enabled
export const isRealTimeMode = (): boolean => {
  const storedValue = localStorage.getItem(REAL_TIME_MODE_KEY);
  return storedValue === 'true';
};

// Set real-time mode
export const setRealTimeMode = (enabled: boolean): void => {
  localStorage.setItem(REAL_TIME_MODE_KEY, enabled.toString());
  // Dispatch an event to notify the app about the mode change
  window.dispatchEvent(new CustomEvent('binance-mode-change', { 
    detail: { isRealTime: enabled } 
  }));
};

// Initialize real-time market data service
export const startRealTimeMarketData = (symbols: string[]) => {
  console.log('Starting real-time market data for symbols:', symbols);
  
  const isRealTime = isRealTimeMode();
  console.log(`Running in ${isRealTime ? 'REAL' : 'DEMO'} mode`);
  
  // Current market data
  let marketData: Record<string, any> = {};
  
  // Update interval reference
  let updateInterval: ReturnType<typeof setInterval> | null = null;
  
  // Start the update interval
  const startUpdates = () => {
    // Clear any existing interval
    if (updateInterval) {
      clearInterval(updateInterval);
    }
    
    // Set update frequency based on mode
    const updateFrequency = isRealTime ? 5000 : 10000; // Real: 5s, Demo: 10s
    
    updateInterval = setInterval(() => {
      updateMarketData();
    }, updateFrequency);
    
    // Immediate first update
    updateMarketData();
  };
  
  // Update market data for all symbols
  const updateMarketData = () => {
    try {
      // In a real implementation, this would fetch data from Binance API
      symbols.forEach(symbol => {
        if (isRealTime) {
          // REAL MODE: Use more realistic data and patterns
          const now = Date.now();
          const basePrice = getBasePrice(symbol);
          const noise = Math.sin(now / 10000) * 0.02 * basePrice;
          const trend = (Math.sin(now / 100000) * 0.1 + 0.03) * basePrice;
          
          // More realistic price movement with trend and noise
          const newPrice = basePrice + trend + noise;
          
          // Calculate percentage change
          const prevPrice = marketData[symbol]?.price || basePrice;
          const priceChangePercent = ((newPrice - prevPrice) / prevPrice) * 100;
          
          marketData[symbol] = {
            symbol,
            price: newPrice,
            priceChangePercent: marketData[symbol]?.priceChangePercent || 0,
            priceChange24h: marketData[symbol]?.priceChange24h || (basePrice * 0.01),
            volume: 10000000 + Math.random() * 5000000,
            high24h: Math.max(newPrice * 1.05, marketData[symbol]?.high24h || 0),
            low24h: Math.min(newPrice * 0.95, marketData[symbol]?.low24h || Number.MAX_VALUE),
            lastUpdateTime: Date.now()
          };
        } else {
          // DEMO MODE: Use simple random data
          const basePrice = getBasePrice(symbol);
          const randomChange = (Math.random() - 0.5) * 0.02 * basePrice; // -1% to +1%
          
          marketData[symbol] = {
            symbol,
            price: basePrice + randomChange,
            priceChangePercent: (Math.random() - 0.5) * 5, // -2.5% to +2.5%
            priceChange24h: basePrice * (Math.random() - 0.5) * 0.05,
            volume: 1000000 + Math.random() * 1000000,
            high24h: basePrice * (1 + Math.random() * 0.05),
            low24h: basePrice * (1 - Math.random() * 0.05),
            lastUpdateTime: Date.now()
          };
        }
      });
      
      // Dispatch an update event
      window.dispatchEvent(new CustomEvent('binance-data-update', { 
        detail: { data: marketData } 
      }));
      
    } catch (error) {
      console.error('Error updating market data:', error);
    }
  };
  
  // Get base price for a symbol
  const getBasePrice = (symbol: string): number => {
    if (symbol.includes('BTC')) return 50000;
    if (symbol.includes('ETH')) return 3000;
    if (symbol.includes('SOL')) return 120;
    if (symbol.includes('BNB')) return 500;
    if (symbol.includes('ADA')) return 0.5;
    if (symbol.includes('XRP')) return 0.6;
    if (symbol.includes('DOGE')) return 0.08;
    return 100; // Default price
  };
  
  // Generate fundamental data for a symbol
  export const getFundamentalData = (symbol: string) => {
    const basePrice = getBasePrice(symbol);
    const marketCap = basePrice * (symbol.includes('BTC') ? 21000000 : 
                                  symbol.includes('ETH') ? 120000000 : 
                                  1000000000);
    
    return {
      marketCap,
      circulatingSupply: symbol.includes('BTC') ? 19000000 : 
                        symbol.includes('ETH') ? 120000000 : 
                        1000000000,
      totalSupply: symbol.includes('BTC') ? 21000000 : 
                  symbol.includes('ETH') ? 120000000 : 
                  2000000000,
      maxSupply: symbol.includes('BTC') ? 21000000 : null,
      launchDate: new Date(symbol.includes('BTC') ? '2009-01-03' : 
                          symbol.includes('ETH') ? '2015-07-30' : 
                          '2020-01-01'),
      allTimeHigh: basePrice * 1.5
    };
  };
  
  // Start updates
  startUpdates();
  
  // Listen for mode changes
  const handleModeChange = (event: Event) => {
    const customEvent = event as CustomEvent;
    console.log('Market data service received mode change:', customEvent.detail);
    
    // Update internal flag and restart updates
    startUpdates();
  };
  
  window.addEventListener('binance-mode-change', handleModeChange);
  
  // Return control API
  return {
    stop: () => {
      if (updateInterval) {
        clearInterval(updateInterval);
        updateInterval = null;
      }
      window.removeEventListener('binance-mode-change', handleModeChange);
    },
    getData: () => marketData,
    update: updateMarketData
  };
};

// Listen for Binance data updates
export const listenToBinanceUpdates = (callback: (data: Record<string, any>) => void): (() => void) => {
  const handleUpdate = (event: Event) => {
    const customEvent = event as CustomEvent;
    callback(customEvent.detail.data);
  };
  
  window.addEventListener('binance-data-update', handleUpdate);
  
  return () => {
    window.removeEventListener('binance-data-update', handleUpdate);
  };
};

// Get fundamental data for a symbol
export const getFundamentalData = (symbol: string) => {
  const basePrice = symbol.includes('BTC') ? 50000 :
                   symbol.includes('ETH') ? 3000 :
                   symbol.includes('SOL') ? 120 :
                   symbol.includes('BNB') ? 500 :
                   symbol.includes('ADA') ? 0.5 :
                   symbol.includes('XRP') ? 0.6 :
                   symbol.includes('DOGE') ? 0.08 :
                   100;
  
  const marketCap = basePrice * (symbol.includes('BTC') ? 21000000 : 
                                symbol.includes('ETH') ? 120000000 : 
                                1000000000);
  
  return {
    marketCap,
    circulatingSupply: symbol.includes('BTC') ? 19000000 : 
                       symbol.includes('ETH') ? 120000000 : 
                       1000000000,
    totalSupply: symbol.includes('BTC') ? 21000000 : 
                symbol.includes('ETH') ? 120000000 : 
                2000000000,
    maxSupply: symbol.includes('BTC') ? 21000000 : null,
    launchDate: new Date(symbol.includes('BTC') ? '2009-01-03' : 
                        symbol.includes('ETH') ? '2015-07-30' : 
                        '2020-01-01'),
    allTimeHigh: basePrice * 1.5
  };
};
