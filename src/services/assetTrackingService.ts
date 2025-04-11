
import { toast } from 'sonner';
import { getAllAssets, getAssetById } from '@/services/realTimeAssetService';
import { getTradingViewCredentials } from '@/services/tradingView/tradingViewAuthService';
import { simulateWebhookSignal } from '@/services/tradingViewWebhookService';
import { analyzeSentiment } from '@/services/backtesting/patterns/sentimentAnalyzer';

export interface TrackedAsset {
  id: string;
  name: string;
  symbol: string;
  type: 'crypto' | 'stocks' | 'forex' | 'commodities';
  price: number;
  change24h: number;
  priority: 'high' | 'medium' | 'low';
  alertsEnabled: boolean;
  lastUpdated: number;
  technicalSignal?: 'buy' | 'sell' | 'neutral';
  sentimentSignal?: 'bullish' | 'bearish' | 'neutral';
  notes?: string;
  isPinned?: boolean;
}

// Storage key for tracked assets
const TRACKED_ASSETS_KEY = 'tracked_assets_list';
const MAX_ASSETS_PER_MARKET = 50;

// Initial markets to track
const MARKETS = ['crypto', 'stocks', 'forex', 'commodities'];

// Get tracked assets from localStorage
export const getTrackedAssets = (): TrackedAsset[] => {
  const storedAssets = localStorage.getItem(TRACKED_ASSETS_KEY);
  if (storedAssets) {
    return JSON.parse(storedAssets);
  }
  return [];
};

// Initialize tracked assets with defaults for each market
export const initializeTrackedAssets = () => {
  let trackedAssets = getTrackedAssets();
  
  // If we already have tracked assets, don't override
  if (trackedAssets.length > 0) {
    return trackedAssets;
  }
  
  // Otherwise initialize with top assets from each market
  trackedAssets = [];
  
  const allAssets = getAllAssets();
  
  // Group by market
  const assetsByMarket: Record<string, any[]> = {};
  allAssets.forEach(asset => {
    if (!assetsByMarket[asset.type]) {
      assetsByMarket[asset.type] = [];
    }
    assetsByMarket[asset.type].push(asset);
  });
  
  // Take top 50 from each market
  MARKETS.forEach(market => {
    const marketAssets = assetsByMarket[market] || [];
    const topAssets = marketAssets
      .sort((a, b) => b.marketCap - a.marketCap)
      .slice(0, MAX_ASSETS_PER_MARKET);
      
    topAssets.forEach(asset => {
      trackedAssets.push({
        id: asset.id,
        name: asset.name,
        symbol: asset.symbol,
        type: asset.type,
        price: asset.price,
        change24h: asset.change24h,
        priority: 'medium',
        alertsEnabled: true,
        lastUpdated: Date.now(),
        isPinned: false
      });
    });
  });
  
  // Save to localStorage
  saveTrackedAssets(trackedAssets);
  
  return trackedAssets;
};

// Save tracked assets to localStorage
export const saveTrackedAssets = (assets: TrackedAsset[]) => {
  localStorage.setItem(TRACKED_ASSETS_KEY, JSON.stringify(assets));
};

// Add a new asset to track
export const addTrackedAsset = (assetId: string): boolean => {
  const trackedAssets = getTrackedAssets();
  
  // Check if asset is already tracked
  if (trackedAssets.find(a => a.id === assetId)) {
    return false;
  }
  
  // Get asset details
  const asset = getAssetById(assetId);
  if (!asset) {
    return false;
  }
  
  // Add to tracked assets
  trackedAssets.push({
    id: asset.id,
    name: asset.name,
    symbol: asset.symbol,
    type: asset.type,
    price: asset.price,
    change24h: asset.change24h,
    priority: 'medium',
    alertsEnabled: true,
    lastUpdated: Date.now()
  });
  
  // Save to localStorage
  saveTrackedAssets(trackedAssets);
  
  // Show toast notification
  toast.success(`התחלת לעקוב אחרי ${asset.name}`, {
    description: 'הנכס התווסף לרשימת המעקב שלך'
  });
  
  return true;
};

// Remove asset from tracking
export const removeTrackedAsset = (assetId: string): boolean => {
  let trackedAssets = getTrackedAssets();
  
  // Check if asset is tracked
  if (!trackedAssets.find(a => a.id === assetId)) {
    return false;
  }
  
  // Remove from tracked assets
  trackedAssets = trackedAssets.filter(a => a.id !== assetId);
  
  // Save to localStorage
  saveTrackedAssets(trackedAssets);
  
  // Show toast notification
  toast.info('הנכס הוסר מרשימת המעקב שלך');
  
  return true;
};

// Update tracked asset properties
export const updateTrackedAsset = (assetId: string, updates: Partial<TrackedAsset>): boolean => {
  const trackedAssets = getTrackedAssets();
  
  // Find asset index
  const assetIndex = trackedAssets.findIndex(a => a.id === assetId);
  if (assetIndex === -1) {
    return false;
  }
  
  // Update asset
  trackedAssets[assetIndex] = {
    ...trackedAssets[assetIndex],
    ...updates,
    lastUpdated: Date.now()
  };
  
  // Save to localStorage
  saveTrackedAssets(trackedAssets);
  
  return true;
};

// Pin/unpin asset to top of list
export const toggleAssetPin = (assetId: string): boolean => {
  const trackedAssets = getTrackedAssets();
  
  // Find asset
  const assetIndex = trackedAssets.findIndex(a => a.id === assetId);
  if (assetIndex === -1) {
    return false;
  }
  
  // Toggle pin status
  trackedAssets[assetIndex].isPinned = !trackedAssets[assetIndex].isPinned;
  
  // Save to localStorage
  saveTrackedAssets(trackedAssets);
  
  return true;
};

// Set priority for asset
export const setAssetPriority = (assetId: string, priority: 'high' | 'medium' | 'low'): boolean => {
  return updateTrackedAsset(assetId, { priority });
};

// Toggle alerts for asset
export const toggleAssetAlerts = (assetId: string): boolean => {
  const trackedAssets = getTrackedAssets();
  
  // Find asset
  const assetIndex = trackedAssets.findIndex(a => a.id === assetId);
  if (assetIndex === -1) {
    return false;
  }
  
  // Toggle alerts
  trackedAssets[assetIndex].alertsEnabled = !trackedAssets[assetIndex].alertsEnabled;
  
  // Save to localStorage
  saveTrackedAssets(trackedAssets);
  
  return true;
};

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

// Analyze sentiment for tracked assets
export const analyzeSentimentForTrackedAssets = async () => {
  const trackedAssets = getTrackedAssets();
  const highPriorityAssets = trackedAssets.filter(asset => asset.priority === 'high');
  
  // Analyze only high priority assets to avoid overloading
  for (const asset of highPriorityAssets) {
    try {
      const sentimentResult = await analyzeSentiment(asset.id);
      
      // Update asset with sentiment data
      updateTrackedAsset(asset.id, {
        sentimentSignal: sentimentResult.overallSentiment,
        notes: `סנטימנט: ${sentimentResult.sentimentScore.toFixed(1)}/100. מקורות: ${sentimentResult.topBullishSources.join(', ')}`
      });
      
      // If sentiment is very strong, create an alert
      if (Math.abs(sentimentResult.sentimentScore) > 60 && asset.alertsEnabled) {
        const direction = sentimentResult.overallSentiment === 'bullish' ? 'חיובי' : 'שלילי';
        
        toast.info(
          `סנטימנט ${direction} חזק ל-${asset.name}`, 
          { 
            description: `ציון סנטימנט: ${sentimentResult.sentimentScore.toFixed(1)}`,
            duration: 10000
          }
        );
      }
    } catch (error) {
      console.error(`Error analyzing sentiment for ${asset.name}:`, error);
    }
  }
};

// Get filtered tracked assets
export const getFilteredTrackedAssets = (
  market?: string,
  priorityFilter?: 'high' | 'medium' | 'low',
  signalFilter?: 'buy' | 'sell' | 'neutral' | 'bullish' | 'bearish'
): TrackedAsset[] => {
  let assets = getTrackedAssets();
  
  // Sort: pinned first, then by priority, then by name
  assets.sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    const aPriority = priorityOrder[a.priority] || 1;
    const bPriority = priorityOrder[b.priority] || 1;
    
    if (aPriority !== bPriority) {
      return aPriority - bPriority;
    }
    
    return a.name.localeCompare(b.name);
  });
  
  // Apply market filter
  if (market && market !== 'all') {
    assets = assets.filter(asset => asset.type === market);
  }
  
  // Apply priority filter
  if (priorityFilter) {
    assets = assets.filter(asset => asset.priority === priorityFilter);
  }
  
  // Apply signal filter
  if (signalFilter) {
    if (['buy', 'sell', 'neutral'].includes(signalFilter)) {
      assets = assets.filter(asset => asset.technicalSignal === signalFilter);
    } else {
      assets = assets.filter(asset => asset.sentimentSignal === signalFilter);
    }
  }
  
  return assets;
};

// Start real-time tracking system
let trackingInterval: ReturnType<typeof setInterval> | null = null;
let sentimentInterval: ReturnType<typeof setInterval> | null = null;

export const startAssetTracking = () => {
  // Initialize if not already done
  initializeTrackedAssets();
  
  // Set up real-time tracking interval
  if (!trackingInterval) {
    trackingInterval = setInterval(() => {
      syncTrackedAssets();
    }, 5000);
  }
  
  // Set up sentiment analysis interval (less frequent)
  if (!sentimentInterval) {
    sentimentInterval = setInterval(() => {
      analyzeSentimentForTrackedAssets();
    }, 60000 * 5); // Every 5 minutes
  }
  
  toast.success('מערכת מעקב נכסים הופעלה בהצלחה');
};

// Stop asset tracking
export const stopAssetTracking = () => {
  if (trackingInterval) {
    clearInterval(trackingInterval);
    trackingInterval = null;
  }
  
  if (sentimentInterval) {
    clearInterval(sentimentInterval);
    sentimentInterval = null;
  }
  
  toast.info('מערכת מעקב נכסים הופסקה');
};

// Check if tracking is active
export const isTrackingActive = (): boolean => {
  return trackingInterval !== null;
};

// For simulating WhatsApp integration (would be replaced with actual API in production)
export const simulateWhatsAppNotification = (message: string) => {
  toast.success('התראה נשלחה לוואטסאפ', {
    description: message,
    duration: 5000
  });
  
  console.log('WhatsApp notification:', message);
};
