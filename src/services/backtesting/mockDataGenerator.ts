
import { AssetHistoricalData, TimeframeType } from '@/types/asset';
import { getAssetById } from '@/services/realTimeAssetService';

/**
 * Generate mock historical data for backtesting
 */
export async function generateHistoricalData(
  assetId: string, 
  timeframe: TimeframeType
): Promise<AssetHistoricalData> {
  const now = Date.now();
  const data: { timestamp: number; price: number; volume?: number }[] = [];
  
  // Get number of data points based on timeframe
  const dataPoints = getDataPointsForTimeframe(timeframe);
  
  // Get time interval in milliseconds
  const interval = getIntervalForTimeframe(timeframe);
  
  // Attempt to get actual asset data for initial price
  let basePrice = 100; // Default price if we can't get real data
  
  try {
    const asset = await getAssetById(assetId);
    if (asset) {
      basePrice = asset.price;
    }
  } catch (error) {
    console.error('Error getting asset price:', error);
    // Fall back to default price
  }
  
  // Generate price data with some randomness but following a trend
  let price = basePrice;
  let trend = 0.0001; // Small upward trend
  
  // For different asset types, have different volatility
  let volatility = 0.01; // Default volatility
  
  try {
    const asset = await getAssetById(assetId);
    if (asset) {
      // Adjust volatility based on asset type
      switch (asset.type.toLowerCase()) {
        case 'crypto':
          volatility = 0.03; // Higher volatility for crypto
          break;
        case 'stocks':
          volatility = 0.015; // Medium volatility for stocks
          break;
        case 'forex':
          volatility = 0.005; // Lower volatility for forex
          break;
        case 'commodities':
          volatility = 0.01; // Medium-low volatility for commodities
          break;
      }
    }
  } catch (error) {
    console.error('Error determining asset type for volatility:', error);
    // Fall back to default volatility
  }
  
  // Occasionally flip the trend to create more realistic price movements
  const trendFlipProbability = 0.05;
  
  for (let i = 0; i < dataPoints; i++) {
    const timestamp = now - (dataPoints - i) * interval;
    
    // Random component
    const randomFactor = (Math.random() - 0.5) * 2 * volatility;
    
    // Maybe flip the trend
    if (Math.random() < trendFlipProbability) {
      trend = -trend;
    }
    
    // Calculate new price
    price = price * (1 + trend + randomFactor);
    
    // Generate volume - more volume during price movements
    const volumeBase = await getBaseVolume(assetId) || 1000000;
    const volume = volumeBase * (1 + Math.abs(randomFactor) * 10);
    
    data.push({
      timestamp,
      price,
      volume
    });
  }
  
  return {
    id: assetId,
    name: await getAssetName(assetId) || 'Unknown Asset',
    symbol: assetId.toUpperCase(),
    timeframe,
    data,
    firstDate: data[0].timestamp,
    lastDate: data[data.length - 1].timestamp
  };
}

// Helper function to get appropriate number of data points for a timeframe
function getDataPointsForTimeframe(timeframe: TimeframeType): number {
  switch (timeframe) {
    case '1m':
      return 24 * 60; // 1 day of 1-minute data
    case '5m':
      return 24 * 12 * 3; // 3 days of 5-minute data
    case '15m':
      return 24 * 4 * 7; // 1 week of 15-minute data
    case '30m':
      return 24 * 2 * 14; // 2 weeks of 30-minute data
    case '1h':
      return 24 * 30; // 1 month of hourly data
    case '4h':
      return 6 * 90; // 3 months of 4-hour data
    case '1d':
      return 365; // 1 year of daily data
    case '1w':
      return 52 * 2; // 2 years of weekly data
    case '1y':
      return 10; // 10 years of yearly data
    case '3m':
      return 4 * 5; // 5 years of quarterly data
    default:
      return 100; // Default to 100 data points
  }
}

// Helper function to get time interval in milliseconds
function getIntervalForTimeframe(timeframe: TimeframeType): number {
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const week = 7 * day;
  
  switch (timeframe) {
    case '1m':
      return minute;
    case '5m':
      return 5 * minute;
    case '15m':
      return 15 * minute;
    case '30m':
      return 30 * minute;
    case '1h':
      return hour;
    case '4h':
      return 4 * hour;
    case '1d':
      return day;
    case '1w':
      return week;
    case '1y':
      return 365 * day;
    case '3m':
      return 3 * 30 * day;
    default:
      return day;
  }
}

// Helper function to get base volume for an asset
async function getBaseVolume(assetId: string): Promise<number | null> {
  try {
    const asset = await getAssetById(assetId);
    return asset.volume24h || null;
  } catch (error) {
    console.error('Error getting asset volume:', error);
    return null;
  }
}

// Helper function to get asset name
async function getAssetName(assetId: string): Promise<string | null> {
  try {
    const asset = await getAssetById(assetId);
    return asset.name || null;
  } catch (error) {
    console.error('Error getting asset name:', error);
    return null;
  }
}

// Generate mock balance history for a user
export function generateMockBalanceHistory(days: number = 90): { date: number; balance: number }[] {
  const now = Date.now();
  const dayInMs = 24 * 60 * 60 * 1000;
  const result = [];
  
  let balance = 10000; // Starting balance
  
  for (let i = 0; i < days; i++) {
    const date = now - (days - i) * dayInMs;
    
    // Random daily change between -2% and +3%
    const dailyChange = (Math.random() * 5 - 2) / 100;
    balance = balance * (1 + dailyChange);
    
    result.push({
      date,
      balance: Number(balance.toFixed(2))
    });
  }
  
  return result;
}
