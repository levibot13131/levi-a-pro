
import { 
  connectToExternalSource as legacyConnectToExternalSource, 
  disconnectFromExternalSource as legacyDisconnectFromExternalSource, 
  fetchDataFromExternalSource 
} from './legacy/externalsService';
import { toast } from 'sonner';
import axios from 'axios';

interface ExternalSource {
  id: string;
  name: string;
  url: string;
  connected: boolean;
  requiresApiKey: boolean;
  description?: string;
}

// Mock data for external sources
const externalSources: ExternalSource[] = [
  {
    id: "1",
    name: "TradingView",
    url: "https://www.tradingview.com",
    connected: false,
    requiresApiKey: true,
    description: "גרפים וניתוח טכני מתקדם"
  },
  {
    id: "2",
    name: "CoinMarketCap",
    url: "https://coinmarketcap.com",
    connected: false,
    requiresApiKey: true,
    description: "נתוני שוק וסנטימנט"
  },
  {
    id: "3",
    name: "CoinGecko",
    url: "https://www.coingecko.com",
    connected: false,
    requiresApiKey: false,
    description: "נתוני קריפטו בזמן אמת ללא צורך ב-API key"
  },
  {
    id: "4",
    name: "Twitter",
    url: "https://twitter.com",
    connected: false,
    requiresApiKey: true,
    description: "ציוצים והתעדכנויות ממשפיעני קריפטו"
  }
];

// Cache for CoinGecko data
let coinGeckoCache = {
  data: null,
  timestamp: 0
};

// Get all external sources
export const getExternalSources = async (): Promise<ExternalSource[]> => {
  // Update connection status based on localStorage
  externalSources.forEach(source => {
    if (source.name === "CoinGecko") {
      // CoinGecko is always available since it doesn't need an API key
      source.connected = true;
    } else if (source.name === "CoinMarketCap") {
      source.connected = !!localStorage.getItem('coinmarketcap_api_key');
    } else if (source.name === "Twitter") {
      source.connected = !!localStorage.getItem('twitter_api_keys');
    }
  });
  
  return [...externalSources];
};

// Connect to an external source
export const connectToExternalSource = async (sourceId: string): Promise<boolean> => {
  try {
    // Handle CoinGecko specially since it doesn't need API key
    const source = externalSources.find(s => s.id === sourceId);
    if (source?.name === "CoinGecko") {
      // Test connection by making a simple API call
      const testResponse = await fetchCoinGeckoData(["bitcoin", "ethereum"]);
      if (testResponse) {
        const index = externalSources.findIndex(s => s.id === sourceId);
        if (index !== -1) {
          externalSources[index].connected = true;
        }
        toast.success("התחברת בהצלחה ל-CoinGecko");
        return true;
      }
      toast.error("ההתחברות ל-CoinGecko נכשלה");
      return false;
    }
    
    // For other sources, use the legacy connect method
    const result = await legacyConnectToExternalSource(sourceId);
    if (result) {
      const index = externalSources.findIndex(source => source.id === sourceId);
      if (index !== -1) {
        externalSources[index].connected = true;
      }
      toast.success("התחברת בהצלחה למקור חיצוני");
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error connecting to external source:", error);
    toast.error("שגיאה בהתחברות למקור חיצוני");
    return false;
  }
};

// Disconnect from an external source
export const disconnectExternalSource = async (sourceId: string): Promise<boolean> => {
  try {
    // Handle CoinGecko specially
    const source = externalSources.find(s => s.id === sourceId);
    if (source?.name === "CoinGecko") {
      // Since CoinGecko doesn't require authentication, we can't really disconnect
      // But we can mark it as disconnected in our UI
      const index = externalSources.findIndex(s => s.id === sourceId);
      if (index !== -1) {
        externalSources[index].connected = false;
      }
      toast.success("התנתקת בהצלחה מ-CoinGecko");
      return true;
    }
    
    // For other sources, use the legacy disconnect method
    const result = await legacyDisconnectFromExternalSource(sourceId);
    if (result) {
      const index = externalSources.findIndex(source => source.id === sourceId);
      if (index !== -1) {
        externalSources[index].connected = false;
      }
      toast.success("התנתקת בהצלחה ממקור חיצוני");
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error disconnecting from external source:", error);
    toast.error("שגיאה בהתנתקות ממקור חיצוני");
    return false;
  }
};

// Fetch data from CoinGecko API
export const fetchCoinGeckoData = async (coins: string[] = ["bitcoin", "ethereum"], currencies: string[] = ["usd", "ils"]): Promise<any> => {
  try {
    // Check if we have cached data that's less than 30 seconds old
    const now = Date.now();
    if (coinGeckoCache.data && (now - coinGeckoCache.timestamp < 30000)) {
      console.log("Using cached CoinGecko data");
      return coinGeckoCache.data;
    }
    
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${coins.join(',')}&vs_currencies=${currencies.join(',')}`;
    console.log("Fetching CoinGecko data:", url);
    
    const response = await axios.get(url);
    const data = response.data;
    
    // Update cache
    coinGeckoCache = {
      data,
      timestamp: now
    };
    
    return data;
  } catch (error) {
    console.error("Error fetching data from CoinGecko:", error);
    return null;
  }
};

// Update assets from connected sources
export const updateAssetsFromConnectedSources = async (): Promise<number> => {
  try {
    let updatedCount = 0;
    const connectedSources = externalSources.filter(source => source.connected);
    
    for (const source of connectedSources) {
      if (source.name === "CoinGecko") {
        // For CoinGecko, use our custom fetch method
        const data = await fetchCoinGeckoData();
        if (data) {
          updatedCount++;
          console.log("Updated data from CoinGecko:", data);
        }
      } else {
        // For other sources, use the legacy fetch method
        const data = await fetchDataFromExternalSource(source.id);
        if (data) {
          updatedCount++;
        }
      }
    }
    
    if (updatedCount > 0) {
      toast.success(`עודכנו נתונים מ-${updatedCount} מקורות`);
    } else {
      toast.info("לא נמצאו עדכונים חדשים");
    }
    
    return updatedCount;
  } catch (error) {
    console.error("Error updating assets from connected sources:", error);
    toast.error("שגיאה בעדכון נתונים ממקורות חיצוניים");
    return 0;
  }
};

// Get real-time prices for specific coins
export const getRealTimePrices = async (coins: string[] = ["bitcoin", "ethereum"]): Promise<any> => {
  try {
    return await fetchCoinGeckoData(coins);
  } catch (error) {
    console.error("Error getting real-time prices:", error);
    return null;
  }
};
