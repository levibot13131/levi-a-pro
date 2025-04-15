
/**
 * Start real-time market data
 */
export const startRealTimeMarketData = (symbols: string[]) => {
  console.log('Starting real-time market data for symbols:', symbols);
  
  const isProduction = window.location.hostname.includes('lovable.app');
  const isDevelopment = !isProduction;
  
  // קביעת תדירות עדכון (5 שניות במצב פיתוח, 15 שניות במצב הפעלה)
  const updateInterval = isDevelopment ? 5000 : 15000;
  
  console.log(`Setting up market data updates every ${updateInterval/1000} seconds (${isDevelopment ? 'development' : 'production'} mode)`);
  
  // יצירת אובייקט מוק עם נתוני מחיר ראשוניים
  const mockData = {};
  symbols.forEach(symbol => {
    // יצירת מחיר התחלתי מקרי לכל סימבול
    const basePrice = symbol.includes('BTC') ? 50000 : 
                     symbol.includes('ETH') ? 3000 : 
                     symbol.includes('SOL') ? 100 : 
                     Math.random() * 1000;
    
    mockData[symbol] = {
      symbol,
      price: basePrice,
      lastPrice: basePrice,
      volume: Math.random() * 1000000,
      high24h: basePrice * (1 + Math.random() * 0.05),
      low24h: basePrice * (1 - Math.random() * 0.05),
      priceChangePercent: 0,
      lastUpdateTime: Date.now()
    };
  });
  
  // הפעלת אינטרוול לעדכון נתוני מחיר
  const interval = setInterval(() => {
    symbols.forEach(symbol => {
      if (mockData[symbol]) {
        // שמירת המחיר הקודם
        mockData[symbol].lastPrice = mockData[symbol].price;
        
        // חישוב מחיר חדש - שינוי אקראי של עד 1%
        const changePercent = (Math.random() * 2 - 1) * 0.01;
        const newPrice = mockData[symbol].price * (1 + changePercent);
        
        // עדכון המחיר והנתונים הנלווים
        mockData[symbol].price = newPrice;
        mockData[symbol].priceChangePercent = 
          ((newPrice - mockData[symbol].lastPrice) / mockData[symbol].lastPrice) * 100;
        mockData[symbol].volume += Math.random() * 10000;
        mockData[symbol].lastUpdateTime = Date.now();
        
        // עדכון מחיר גבוה/נמוך ב-24 שעות אם צריך
        if (newPrice > mockData[symbol].high24h) {
          mockData[symbol].high24h = newPrice;
        }
        if (newPrice < mockData[symbol].low24h) {
          mockData[symbol].low24h = newPrice;
        }
      }
    });
    
    // הדפסת עדכון במקום מוסתר יותר
    console.log(`Updated market data for ${symbols.length} symbols at ${new Date().toLocaleTimeString()}`);
    
    // שליחת אירוע של עדכון נתוני מחיר
    window.dispatchEvent(new CustomEvent('binance-price-update', {
      detail: { ...mockData }
    }));
  }, updateInterval);
  
  return {
    stop: () => {
      clearInterval(interval);
      console.log('Stopped real-time market data updates');
    },
    getData: () => ({ ...mockData })
  };
};

/**
 * Get fundamental data
 */
export const getFundamentalData = (symbol: string) => {
  const baseMarketCap = symbol.includes('BTC') ? 1000000000000 : 
                       symbol.includes('ETH') ? 300000000000 : 
                       symbol.includes('SOL') ? 50000000000 : 
                       Math.random() * 10000000000;
  
  const baseVolume = baseMarketCap * (Math.random() * 0.1);
  
  const baseSupply = baseMarketCap / (
    symbol.includes('BTC') ? 50000 : 
    symbol.includes('ETH') ? 3000 : 
    symbol.includes('SOL') ? 100 : 
    Math.random() * 1000
  );
  
  return {
    symbol,
    name: symbol.replace('USDT', ''),
    marketCap: baseMarketCap,
    volume24h: baseVolume,
    circulatingSupply: baseSupply,
    totalSupply: baseSupply * (1 + Math.random() * 0.2),
    maxSupply: symbol.includes('BTC') ? 21000000 : baseSupply * (1.5 + Math.random()),
    allTimeHigh: symbol.includes('BTC') ? 69000 : 
                symbol.includes('ETH') ? 4800 : 
                symbol.includes('SOL') ? 260 : 
                Math.random() * 10000,
    launchDate: new Date(Date.now() - Math.random() * 5 * 365 * 24 * 60 * 60 * 1000)
  };
};

/**
 * האזנה לעדכוני מחירים מבינאנס
 */
export const listenToBinanceUpdates = (callback: (data: any) => void): () => void => {
  const handleUpdate = (event: Event) => {
    const customEvent = event as CustomEvent<any>;
    const data = customEvent.detail;
    callback(data);
  };
  
  window.addEventListener('binance-price-update', handleUpdate);
  
  return () => {
    window.removeEventListener('binance-price-update', handleUpdate);
  };
};
