
import { 
  connectToExternalSource as legacyConnectToExternalSource, 
  disconnectFromExternalSource as legacyDisconnectFromExternalSource, 
  fetchDataFromExternalSource 
} from './legacy/externalsService';
import { toast } from 'sonner';

interface ExternalSource {
  id: string;
  name: string;
  url: string;
  connected: boolean;
}

// Mock data for external sources
const externalSources: ExternalSource[] = [
  {
    id: "1",
    name: "TradingView",
    url: "https://www.tradingview.com",
    connected: false
  },
  {
    id: "2",
    name: "CoinMarketCap",
    url: "https://coinmarketcap.com",
    connected: false
  },
  {
    id: "3",
    name: "CoinGecko",
    url: "https://www.coingecko.com",
    connected: false
  }
];

// Get all external sources
export const getExternalSources = async (): Promise<ExternalSource[]> => {
  return [...externalSources];
};

// Connect to an external source
export const connectToExternalSource = async (sourceId: string): Promise<boolean> => {
  try {
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

// Update assets from connected sources
export const updateAssetsFromConnectedSources = async (): Promise<number> => {
  try {
    let updatedCount = 0;
    const connectedSources = externalSources.filter(source => source.connected);
    
    for (const source of connectedSources) {
      const data = await fetchDataFromExternalSource(source.id);
      if (data) {
        updatedCount++;
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
