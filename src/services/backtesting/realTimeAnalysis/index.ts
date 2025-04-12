
import { PricePoint, TradeSignal } from '@/types/asset';
import { generateSignalsFromHistory } from '@/services/backtesting/signals';
import { sendAlert } from '@/services/tradingView/tradingViewAlertService';
import { getAlertDestinations } from '@/services/tradingView/tradingViewAlertService';
import { toast } from 'sonner';
import { BacktestSettings } from '../types';
import { TradingViewAlert, createTradingViewAlert } from '@/services/tradingView/alerts/types';

// Signal storage
let storedSignals: any[] = [];

// Run status
let isRunning = false;
let analysisIntervalId: number | null = null;
let checkingAssets: string[] = [];

/**
 * Start real-time analysis
 */
export const startRealTimeAnalysis = (
  assetIds: string[],
  settings: Partial<BacktestSettings>
): { stop: () => void } => {
  if (isRunning) {
    console.log('Real-time analysis already running');
    return { stop: stopRealTimeAnalysis };
  }

  if (!assetIds || assetIds.length === 0) {
    console.error('No assets specified for real-time analysis');
    return { stop: () => {} };
  }

  checkingAssets = [...assetIds];
  isRunning = true;
  console.log('Starting real-time analysis for assets:', checkingAssets);

  // Default settings
  const defaultSettings = {
    strategy: settings.strategy || 'A.A',
    timeframe: settings.timeframe || '1d'
  };

  // Function to fetch price data (simulating external API)
  const fetchPriceData = async (assetId: string): Promise<PricePoint[]> => {
    // In a real implementation, we would connect to a real API
    // For now, generating random data for demonstration
    const now = Date.now();
    const priceData: PricePoint[] = [];
    
    let basePrice = 0;
    switch (assetId.toLowerCase()) {
      case 'bitcoin':
        basePrice = 68000 + (Math.random() * 2000);
        break;
      case 'ethereum':
        basePrice = 3300 + (Math.random() * 200);
        break;
      default:
        basePrice = 100 + (Math.random() * 20);
    }
    
    // Generate recent price data
    for (let i = 30; i >= 0; i--) {
      const timestamp = now - (i * 60 * 60 * 1000); // 1 hour per point
      const random = Math.random() * 0.05 - 0.025; // ±2.5% fluctuation
      const price = basePrice * (1 + random);
      
      priceData.push({
        timestamp,
        price,
        volume: basePrice * 1000 * (0.8 + Math.random() * 0.4) // Random volume
      });
    }
    
    return priceData;
  };

  // Analysis function
  const runAnalysis = async () => {
    if (!isRunning) return;
    
    for (const assetId of checkingAssets) {
      try {
        // Fetch price data
        const priceData = await fetchPriceData(assetId);
        
        // Generate signals
        const signals = generateSignalsFromHistory(priceData, assetId);
        
        // Check for new signals
        const newSignals = signals.filter(signal => {
          const isNew = !storedSignals.some(
            stored => stored.id === signal.id || 
            (stored.timestamp === signal.timestamp && stored.type === signal.type)
          );
          return isNew && signal.timestamp > Date.now() - 24 * 60 * 60 * 1000; // Last 24 hours
        });
        
        // Add new signals to stored signals
        storedSignals = [...storedSignals, ...newSignals];
        
        // Prune old signals (older than 7 days)
        const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
        storedSignals = storedSignals.filter(signal => signal.timestamp > sevenDaysAgo);
        
        // Process new signals
        if (newSignals.length > 0) {
          console.log(`Found ${newSignals.length} new signals for ${assetId}`);
          
          // Send alerts for high priority signals
          const highPrioritySignals = newSignals.filter(signal => signal.strength === 'strong');
          
          for (const signal of highPrioritySignals) {
            // Convert to TradingView alert format
            const alert = createTradingViewAlert({
              symbol: assetId,
              message: `${signal.strategy}: ${signal.type.toUpperCase()} signal at ${signal.price}`,
              timeframe: signal.timeframe,
              timestamp: signal.timestamp,
              price: signal.price,
              action: signal.type as 'buy' | 'sell',
              details: signal.notes || '',
              strategy: signal.strategy,
              type: 'indicator',
              source: 'backtesting',
              priority: 'medium'
            });
            
            // Send the alert
            const alertSent = await sendAlert(alert);
            if (alertSent) {
              toast.success(`Alert sent for ${assetId}`);
            }
          }
        }
      } catch (error) {
        console.error(`Error analyzing ${assetId}:`, error);
      }
    }
  };

  // Run initial analysis
  runAnalysis();
  
  // Set up interval for ongoing analysis
  analysisIntervalId = window.setInterval(runAnalysis, 60 * 1000); // Run every minute
  
  // Return stop function
  return {
    stop: stopRealTimeAnalysis
  };
};

/**
 * Stop real-time analysis
 */
export const stopRealTimeAnalysis = () => {
  if (!isRunning) return;
  
  isRunning = false;
  checkingAssets = [];
  
  if (analysisIntervalId !== null) {
    clearInterval(analysisIntervalId);
    analysisIntervalId = null;
  }
  
  console.log('Real-time analysis stopped');
};

/**
 * Check if real-time analysis is active
 */
export const isRealTimeAnalysisActive = () => isRunning;

/**
 * Get all current signals
 */
export const getCurrentSignals = () => [...storedSignals];
