
import { toast } from 'sonner';
import { getAllAssets } from '@/services/realTimeAssetService';
import { getTradingViewCredentials } from '@/services/tradingView/tradingViewAuthService';
import { simulateWebhookSignal } from '@/services/tradingViewWebhookService';
import { getTrackedAssets, saveTrackedAssets } from './storage';

// Synchronize tracked assets with real-time data
export const syncTrackedAssets = () => {
  const trackedAssets = getTrackedAssets();
  const allAssets = getAllAssets();
  let updated = false;
  
  trackedAssets.forEach((trackedAsset, index) => {
    // Find real-time asset data
    const realTimeAsset = allAssets.find(a => a.id === trackedAsset.id);
    if (realTimeAsset) {
      // Check for significant price change
      const priceDiff = Math.abs((realTimeAsset.price - trackedAsset.price) / trackedAsset.price);
      const significantChange = priceDiff > 0.03; // 3% threshold
      
      if (significantChange && trackedAsset.alertsEnabled) {
        // Send notification for significant change
        const direction = realTimeAsset.price > trackedAsset.price ? 'עלייה' : 'ירידה';
        const changePercent = (priceDiff * 100).toFixed(2);
        
        // Create notification
        toast.info(
          `${direction} משמעותית ב-${trackedAsset.name}`, 
          { 
            description: `שינוי של ${changePercent}% במחיר`,
            duration: 10000
          }
        );
        
        // If TradingView is connected, send webhook signal
        const tvCredentials = getTradingViewCredentials();
        if (tvCredentials?.isConnected) {
          simulateWebhookSignal(
            realTimeAsset.price > trackedAsset.price ? 'buy' : 'sell'
          );
        }
      }
      
      // Update tracked asset with real-time data
      trackedAssets[index] = {
        ...trackedAsset,
        price: realTimeAsset.price,
        change24h: realTimeAsset.change24h,
        lastUpdated: Date.now()
      };
      
      updated = true;
    }
  });
  
  if (updated) {
    // Save updates to localStorage
    saveTrackedAssets(trackedAssets);
  }
  
  return trackedAssets;
};
