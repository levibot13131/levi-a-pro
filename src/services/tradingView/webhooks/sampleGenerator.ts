
export const createSampleAlert = (type: 'buy' | 'sell' | 'info' = 'info') => {
  // Generate sample webhook data
  const data = generateSampleWebhookData(type);
  console.log(`Creating sample ${type} alert from webhook data`);
  
  // Create an alert based on the sample data (will be processed by the webhook parser)
  return {
    symbol: data.symbol,
    message: data.message || '',
    action: type,
    indicators: Array.isArray(data.indicators) 
      ? data.indicators 
      : data.indicators 
        ? [data.indicators.toString()] 
        : [],
    timeframe: data.timeframe || '1d',
    timestamp: Date.now(),
    price: parseFloat(data.price?.toString() || '0'),
    details: data.details || '',
    strategy: data.strategy || '',
    chartUrl: data.chartUrl || ''
  };
};
