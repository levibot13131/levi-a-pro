
/**
 * Start real-time market data
 */
export const startRealTimeMarketData = (symbols: string[]) => {
  console.log('Starting real-time market data for symbols:', symbols);
  
  const isProduction = window.location.hostname.includes('lovable.app');
  
  if (isProduction) {
    console.log('In production environment, using simulated data updates');
    const interval = setInterval(() => {
      console.log('Simulated market data update for:', symbols);
    }, 15000);
    
    return {
      stop: () => {
        clearInterval(interval);
        console.log('Stopped simulated real-time market data updates');
      }
    };
  }
  
  const interval = setInterval(() => {
    console.log('Updating market data for symbols:', symbols);
  }, 15000);
  
  return {
    stop: () => {
      clearInterval(interval);
      console.log('Stopped real-time market data updates');
    }
  };
};

/**
 * Get fundamental data
 */
export const getFundamentalData = (symbol: string) => {
  return {
    symbol,
    name: symbol.replace('USDT', ''),
    marketCap: Math.random() * 1000000000,
    volume24h: Math.random() * 100000000,
    circulatingSupply: Math.random() * 100000000,
    allTimeHigh: Math.random() * 100000,
    launchDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000)
  };
};
