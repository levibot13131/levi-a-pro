
/**
 * Production Fallbacks Service
 * 
 * This service provides simulated responses for external APIs when running in
 * the Lovable preview/production environment where direct API connections may not be available.
 */

import { toast } from 'sonner';

// Check if the app is running in Lovable preview/production environment
export const isProduction = (): boolean => {
  return window.location.hostname.includes('lovable.app');
};

// Simulated Telegram message sending
export const sendTelegramMessage = async (botToken: string, chatId: string, message: string): Promise<boolean> => {
  if (!isProduction()) {
    // In development, try to actually send the message
    try {
      const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'HTML',
        }),
      });
      
      const data = await response.json();
      return data.ok;
    } catch (error) {
      console.error('Error sending Telegram message:', error);
      return false;
    }
  } else {
    // In production, simulate a successful message
    console.log('SIMULATED TELEGRAM MESSAGE:', message);
    toast.success('התראה נשלחה בהצלחה (סימולציה)', {
      description: 'המערכת במצב הדגמה, ההודעה לא נשלחה בפועל לטלגרם'
    });
    return true;
  }
};

// Simulated WhatsApp message sending
export const sendWhatsAppMessage = async (phoneNumber: string, message: string): Promise<boolean> => {
  if (isProduction()) {
    console.log('SIMULATED WHATSAPP MESSAGE TO', phoneNumber, ':', message);
    toast.success('הודעת WhatsApp נשלחה בהצלחה (סימולציה)', {
      description: 'המערכת במצב הדגמה, ההודעה לא נשלחה בפועל'
    });
    return true;
  }
  
  // In development, would connect to actual WhatsApp API
  return false;
};

// Simulated Binance API connection status
export const checkBinanceConnection = (): boolean => {
  if (isProduction()) {
    return true; // Always pretend to be connected in production
  }
  
  // In development, would check actual connection status
  return false;
};

// Show production environment warning if needed
export const showProductionWarningIfNeeded = (): void => {
  if (isProduction()) {
    console.warn('Running in Lovable preview/production environment - external APIs are simulated');
    setTimeout(() => {
      toast.info('המערכת פועלת במצב הדגמה', {
        description: 'חיבורים חיצוניים ל-Binance, Telegram ועוד מדומים בסביבה זו',
        duration: 10000,
      });
    }, 2000);
  }
};
