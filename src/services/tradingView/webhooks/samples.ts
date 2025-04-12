
import { WebhookData } from './types';
import { createTradingViewAlert } from '../alerts/types';

/**
 * Generate a sample webhook data object for testing
 */
export function createSampleWebhookData(type: 'buy' | 'sell' | 'info' = 'info'): WebhookData {
  const timestamp = Date.now();
  
  const baseData: WebhookData = {
    symbol: 'BTC/USDT',
    message: `Sample ${type} signal generated for testing`,
    price: 50000,
    time: timestamp,
    timeframe: '1h'
  };
  
  if (type === 'buy') {
    return {
      ...baseData,
      action: 'buy',
      signal: 'BUY',
      details: 'This is a sample BUY signal for testing purposes'
    };
  } else if (type === 'sell') {
    return {
      ...baseData,
      action: 'sell',
      signal: 'SELL',
      details: 'This is a sample SELL signal for testing purposes'
    };
  } else {
    return {
      ...baseData,
      action: 'info',
      details: 'This is a sample INFO alert for testing purposes'
    };
  }
}

/**
 * Generate a sample webhook payload (stringified JSON) for testing
 */
export function createSampleWebhookPayload(type: 'buy' | 'sell' | 'info' = 'info'): string {
  const data = createSampleWebhookData(type);
  return JSON.stringify(data);
}

/**
 * Create a sample webhook request body
 */
export function createSampleWebhookBody(type: 'buy' | 'sell' | 'info' = 'info'): any {
  const data = createSampleWebhookData(type);
  return data;
}
