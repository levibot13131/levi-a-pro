
import { toast } from 'sonner';
import { initializeTrackedAssets } from './initialization';
import { syncTrackedAssets } from './realTimeSync';
import { analyzeSentimentForTrackedAssets } from './sentimentAnalysis';

// Tracking intervals
let trackingInterval: ReturnType<typeof setInterval> | null = null;
let sentimentInterval: ReturnType<typeof setInterval> | null = null;

// Start real-time tracking system
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
