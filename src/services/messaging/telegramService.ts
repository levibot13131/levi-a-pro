
import { toast } from 'sonner';
import axios from 'axios';
import { TradeSignal } from '@/types/asset';

// Constants for Telegram API
const TELEGRAM_API_URL = 'https://api.telegram.org/bot';
const TELEGRAM_BOT_TOKEN_KEY = 'telegram_bot_token';
const TELEGRAM_CHAT_ID_KEY = 'telegram_chat_id';

/**
 * Get Telegram bot token from localStorage
 */
export const getTelegramBotToken = (): string | null => {
  return localStorage.getItem(TELEGRAM_BOT_TOKEN_KEY);
};

/**
 * Set Telegram bot token in localStorage
 */
export const setTelegramBotToken = (token: string): void => {
  localStorage.setItem(TELEGRAM_BOT_TOKEN_KEY, token);
};

/**
 * Get Telegram chat ID from localStorage
 */
export const getTelegramChatId = (): string | null => {
  return localStorage.getItem(TELEGRAM_CHAT_ID_KEY);
};

/**
 * Set Telegram chat ID in localStorage
 */
export const setTelegramChatId = (chatId: string): void => {
  localStorage.setItem(TELEGRAM_CHAT_ID_KEY, chatId);
};

/**
 * Save Telegram credentials
 */
export const saveTelegramCredentials = (botToken: string, chatId: string): void => {
  setTelegramBotToken(botToken);
  setTelegramChatId(chatId);
  toast.success('פרטי Telegram נשמרו בהצלחה');
};

/**
 * Check if Telegram is configured
 */
export const isTelegramConfigured = (): boolean => {
  const botToken = getTelegramBotToken();
  const chatId = getTelegramChatId();
  return !!botToken && !!chatId;
};

/**
 * Clear Telegram credentials
 */
export const clearTelegramCredentials = (): void => {
  localStorage.removeItem(TELEGRAM_BOT_TOKEN_KEY);
  localStorage.removeItem(TELEGRAM_CHAT_ID_KEY);
  toast.success('פרטי Telegram נמחקו');
};

/**
 * Test Telegram connection by sending a test message
 */
export const testTelegramConnection = async (): Promise<boolean> => {
  const botToken = getTelegramBotToken();
  const chatId = getTelegramChatId();
  
  if (!botToken || !chatId) {
    toast.error('פרטי Telegram חסרים');
    return false;
  }
  
  try {
    const message = 'זוהי הודעת בדיקה מהמערכת 🤖 - ' + new Date().toLocaleTimeString('he-IL');
    const response = await sendTelegramMessage(message);
    
    if (response) {
      toast.success('הודעת בדיקה נשלחה בהצלחה ל-Telegram');
      return true;
    } else {
      toast.error('שליחת הודעת בדיקה נכשלה');
      return false;
    }
  } catch (error) {
    console.error('Error testing Telegram connection:', error);
    toast.error('שגיאה בבדיקת חיבור ל-Telegram');
    return false;
  }
};

/**
 * Send a message to Telegram
 */
export const sendTelegramMessage = async (message: string): Promise<boolean> => {
  const botToken = getTelegramBotToken();
  const chatId = getTelegramChatId();
  
  if (!botToken || !chatId) {
    console.error('Telegram credentials not configured');
    return false;
  }
  
  try {
    const response = await axios.post(`${TELEGRAM_API_URL}${botToken}/sendMessage`, {
      chat_id: chatId,
      text: message,
      parse_mode: 'HTML'
    });
    
    return response.data.ok === true;
  } catch (error) {
    console.error('Error sending Telegram message:', error);
    return false;
  }
};

/**
 * Send a formatted trade signal to Telegram
 */
export const sendSignalToTelegram = async (signal: TradeSignal): Promise<boolean> => {
  try {
    const symbolName = signal.symbolName || signal.assetId;
    const actionEmoji = signal.type === 'buy' ? '🟢 קנייה' : '🔴 מכירה';
    
    const message = `
<b>${actionEmoji}: ${symbolName}</b>

🏷️ <b>מחיר:</b> ${signal.price.toFixed(2)} USD
📊 <b>אסטרטגיה:</b> ${signal.strategy}
⏱️ <b>טווח זמן:</b> ${signal.timeframe}
🎯 <b>יעד מחיר:</b> ${signal.targetPrice.toFixed(2)} USD
🛑 <b>סטופ לוס:</b> ${signal.stopLoss.toFixed(2)} USD
⚖️ <b>יחס סיכוי/סיכון:</b> ${signal.riskRewardRatio}
🔍 <b>רמת ביטחון:</b> ${signal.confidence}%

📝 <b>תיאור:</b>
${signal.description || 'אין תיאור'}

⏰ <b>זמן הוצאת האיתות:</b> ${new Date(signal.timestamp).toLocaleString('he-IL')}
`;
    
    return await sendTelegramMessage(message);
  } catch (error) {
    console.error('Error sending signal to Telegram:', error);
    return false;
  }
};

/**
 * Send market analysis to Telegram
 */
export const sendMarketAnalysisToTelegram = async (
  assetName: string,
  price: number,
  analysis: string,
  recommendation: string
): Promise<boolean> => {
  try {
    const message = `
<b>📊 ניתוח שוק: ${assetName}</b>

💰 <b>מחיר נוכחי:</b> ${price.toFixed(2)} USD

🔍 <b>ניתוח:</b>
${analysis}

🧠 <b>המלצה:</b>
${recommendation}

⏰ <b>זמן הניתוח:</b> ${new Date().toLocaleString('he-IL')}
`;
    
    return await sendTelegramMessage(message);
  } catch (error) {
    console.error('Error sending market analysis to Telegram:', error);
    return false;
  }
};
