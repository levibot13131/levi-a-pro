
import { toast } from "sonner";
import { TrackedAsset } from '@/services/assetTracking/types';
import { getTrackedAssets, saveTrackedAssets } from '@/services/assetTracking/storage';

// List of supported external sources
const EXTERNAL_SOURCES = [
  { id: 'tradingview', name: 'TradingView', url: 'https://www.tradingview.com', connected: false },
  { id: 'investing', name: 'Investing.com', url: 'https://www.investing.com', connected: false },
  { id: 'yahoo', name: 'Yahoo Finance', url: 'https://finance.yahoo.com', connected: false },
  { id: 'binance', name: 'Binance', url: 'https://www.binance.com', connected: false },
  { id: 'cryptopanic', name: 'CryptoPanic', url: 'https://cryptopanic.com', connected: false },
  { id: 'twitter', name: 'Twitter', url: 'https://twitter.com', connected: false }
];

// Get all available external sources
export const getExternalSources = async () => {
  return [...EXTERNAL_SOURCES];
};

// Connect to an external source
export const connectToExternalSource = async (sourceId: string): Promise<boolean> => {
  // In a real implementation, this would handle authentication and API connection
  const sourceIndex = EXTERNAL_SOURCES.findIndex(s => s.id === sourceId);
  if (sourceIndex === -1) return false;
  
  // Simulate connection process
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Update connection status
  EXTERNAL_SOURCES[sourceIndex].connected = true;
  
  toast.success(`התחברת בהצלחה ל-${EXTERNAL_SOURCES[sourceIndex].name}`);
  return true;
};

// Disconnect from an external source
export const disconnectExternalSource = async (sourceId: string): Promise<boolean> => {
  const sourceIndex = EXTERNAL_SOURCES.findIndex(s => s.id === sourceId);
  if (sourceIndex === -1) return false;
  
  // Simulate disconnection process
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Update connection status
  EXTERNAL_SOURCES[sourceIndex].connected = false;
  
  toast.success(`התנתקת בהצלחה מ-${EXTERNAL_SOURCES[sourceIndex].name}`);
  return true;
};

// Update asset data from all connected sources
export const updateAssetsFromConnectedSources = async (): Promise<number> => {
  const connectedSources = EXTERNAL_SOURCES.filter(s => s.connected);
  if (connectedSources.length === 0) {
    toast.error('אין מקורות חיצוניים מחוברים');
    return 0;
  }
  
  // Simulate updating assets from connected sources
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // In a real implementation, we would fetch data from all connected sources
  // and update the tracked assets accordingly
  const assets = getTrackedAssets();
  let updatedCount = 0;
  
  // Mock update for technical and sentiment signals
  const updatedAssets = assets.map(asset => {
    // Only update some assets to simulate real-world behavior
    if (Math.random() > 0.7) {
      updatedCount++;
      
      // Generate random technical signal
      const signals = ['buy', 'sell', 'neutral'];
      const technicalSignal = signals[Math.floor(Math.random() * signals.length)] as 'buy' | 'sell' | 'neutral';
      
      // Generate random sentiment signal
      const sentiments = ['bullish', 'bearish', 'neutral'];
      const sentimentSignal = sentiments[Math.floor(Math.random() * sentiments.length)] as 'bullish' | 'bearish' | 'neutral';
      
      return {
        ...asset,
        technicalSignal,
        sentimentSignal,
        lastUpdated: Date.now()
      };
    }
    
    return asset;
  });
  
  if (updatedCount > 0) {
    saveTrackedAssets(updatedAssets);
    toast.success(`עודכנו ${updatedCount} נכסים ממקורות חיצוניים`);
  } else {
    toast.info('לא נמצאו עדכונים חדשים');
  }
  
  return updatedCount;
};
