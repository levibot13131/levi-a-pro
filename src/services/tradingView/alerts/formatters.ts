
import { TradingViewAlert, AlertDestination } from './types';

/**
 * Format alert message based on destination type and configuration
 */
export function formatAlertMessage(alert: TradingViewAlert, destination?: AlertDestination): string {
  // Default message format
  let message = `📊 ${alert.symbol}: ${alert.action.toUpperCase()} @ $${alert.price.toFixed(2)}`;
  
  // Add timeframe if available
  if (alert.timeframe) {
    message += ` (${alert.timeframe})`;
  }
  
  // Add alert message if available
  if (alert.message) {
    message += `\n${alert.message}`;
  }
  
  // Add indicators if available
  if (alert.indicators && alert.indicators.length > 0) {
    message += `\nIndications: ${alert.indicators.join(', ')}`;
  }
  
  // Add details if available
  if (alert.details) {
    message += `\n${alert.details}`;
  }
  
  // Add chart URL if available
  if (alert.chartUrl) {
    message += `\n🔗 Chart: ${alert.chartUrl}`;
  }
  
  return message;
}
