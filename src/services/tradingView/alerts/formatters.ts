
import { TradingViewAlert } from './types';

/**
 * Get strategy-specific information with appropriate emoji
 */
export const getStrategyInfo = (alert: TradingViewAlert): { emoji: string; text: string } => {
  if (!alert.strategy) {
    return { emoji: '📊', text: '' };
  }
  
  const strategy = alert.strategy.toLowerCase();
  
  if (strategy.includes('wyckoff')) {
    return {
      emoji: '🧠',
      text: 'וייקוף - זיהוי מבני מחיר של צבירה/חלוקה'
    };
  } else if (strategy.includes('magic') || strategy.includes('triangle')) {
    return {
      emoji: '🔺',
      text: 'משולש הקסם - זיהוי נקודות מפנה לפי דפוסי מחיר'
    };
  } else if (strategy.includes('quarters')) {
    return {
      emoji: '🔄',
      text: 'שיטת הרבעים - זיהוי תיקונים ורמות פיבונאצ׳י'
    };
  } else {
    return {
      emoji: '📊',
      text: alert.strategy
    };
  }
};

/**
 * Format alert message with detailed technical analysis
 */
export const formatAlertMessage = (alert: TradingViewAlert): string => {
  console.log('Formatting alert message:', JSON.stringify(alert, null, 2));
  
  // Choose appropriate emojis based on action and strategy
  const actionEmoji = alert.action === 'buy' ? '🟢' : alert.action === 'sell' ? '🔴' : 'ℹ️';
  const actionText = alert.action === 'buy' ? 'קנייה' : alert.action === 'sell' ? 'מכירה' : 'מידע';
  
  // Get strategy-specific emoji and text
  const strategyInfo = getStrategyInfo(alert);
  
  // Format price with commas and fixed decimal places
  const formattedPrice = typeof alert.price === 'number' 
    ? alert.price.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })
    : String(alert.price);
  
  // Format timestamp
  const dateOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  };
  
  const formattedDate = new Date(alert.timestamp).toLocaleString('he-IL', dateOptions);
  
  // Build the main message with markdown formatting for Telegram
  let message = `${actionEmoji} *${actionText}: ${alert.symbol}*\n`
    + `💰 מחיר: $${formattedPrice}\n`
    + `📊 טווח זמן: ${alert.timeframe}\n`;
    
  // Add strategy specific information with proper emoji
  if (strategyInfo.text) {
    message += `${strategyInfo.emoji} *אסטרטגיה:* ${strategyInfo.text}\n`;
  }
  
  // Add indicators information
  if (alert.indicators && alert.indicators.length > 0) {
    message += `📈 אינדיקטורים: ${alert.indicators.join(', ')}\n`;
  }
  
  // Add the alert message with formatting if it's not already included
  message += `📝 *הודעה:* ${alert.message}\n`;
  
  // Add details if available (with proper formatting)
  if (alert.details) {
    message += `🔍 *פרטים:* ${alert.details}\n`;
  }
  
  // Add chart URL if available (as markdown link)
  if (alert.chartUrl) {
    message += `📊 [לצפייה בגרף](${alert.chartUrl})\n`;
  }
  
  // Add timestamp in readable format
  message += `⏱️ זמן: ${formattedDate}`;
  
  console.log('Formatted alert message:', message);
  return message;
};
