
// קובץ לניהול פרטי התחברות של Binance
export interface BinanceCredentials {
  apiKey: string;
  apiSecret: string;
  isConnected: boolean;
  lastConnected?: number;
}

const BINANCE_CREDS_KEY = 'levi_bot_binance_credentials';

// קבלת פרטי התחברות לבינאנס
export const getBinanceCredentials = (): BinanceCredentials | null => {
  try {
    const savedCreds = localStorage.getItem(BINANCE_CREDS_KEY);
    if (savedCreds) {
      return JSON.parse(savedCreds);
    }
  } catch (error) {
    console.error('Error parsing Binance credentials:', error);
  }
  return null;
};

// שמירת פרטי התחברות לבינאנס
export const saveBinanceCredentials = (credentials: BinanceCredentials): void => {
  try {
    localStorage.setItem(BINANCE_CREDS_KEY, JSON.stringify(credentials));
    console.log('Binance credentials saved');
  } catch (error) {
    console.error('Error saving Binance credentials:', error);
  }
};

// בדיקה האם מחובר לבינאנס
export const isBinanceConnected = (): boolean => {
  const creds = getBinanceCredentials();
  return !!creds?.isConnected;
};

// ניתוק מבינאנס
export const disconnectBinance = (): void => {
  try {
    localStorage.removeItem(BINANCE_CREDS_KEY);
    console.log('Disconnected from Binance');
  } catch (error) {
    console.error('Error disconnecting from Binance:', error);
  }
};

// Adding the function alias for backward compatibility
export const clearBinanceCredentials = disconnectBinance;

