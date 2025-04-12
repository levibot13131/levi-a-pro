import { AssetHistoricalData } from '@/types/asset';

// When creating the mockAssetHistory, ensure it has all required properties:
export const generateMockAssetHistory = (assetId: string, timeframe: string = '1d'): AssetHistoricalData => {
  const now = Date.now();
  const dataPoints = [];
  
  // Generate some mock data points
  for (let i = 0; i < 100; i++) {
    const timestamp = now - (i * 60 * 60 * 1000); // 1 hour interval
    const price = 100 + Math.random() * 10; // Random price
    const volume = Math.random() * 1000; // Random volume
    
    dataPoints.push({
      timestamp,
      price,
      volume
    });
  }

  const pricePoints = dataPoints.map(item => [item.timestamp, item.price]);
  const volumePoints = dataPoints.map(item => [item.timestamp, item.volume || 0]);
  
  return {
    id: assetId,
    name: `Mock ${assetId}`,
    symbol: assetId.toUpperCase(),
    timeframe: timeframe,
    data: dataPoints,
    prices: pricePoints,
    market_caps: pricePoints.map(p => [p[0], 1000000000]),
    total_volumes: volumePoints,
    firstDate: dataPoints[0].timestamp,
    lastDate: dataPoints[dataPoints.length - 1].timestamp
  };
};
