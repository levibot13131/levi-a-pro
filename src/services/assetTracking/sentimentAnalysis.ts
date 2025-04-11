
import { toast } from 'sonner';
import { analyzeSentiment } from '@/services/backtesting/patterns/sentimentAnalyzer';
import { getTrackedAssets } from './storage';
import { updateTrackedAsset } from './assetManagement';

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
