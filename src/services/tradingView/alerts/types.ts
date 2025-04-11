
import { v4 as uuidv4 } from 'uuid';

export type AlertDestination = {
  id: string;
  name: string;
  type: 'telegram' | 'whatsapp' | 'email' | 'sms';
  active: boolean;
};

export type TradingViewAlert = {
  symbol: string;
  message: string;
  indicators: string[];
  timeframe: string;
  timestamp: number;
  price: number;
  action: 'buy' | 'sell' | 'info';
  strength?: number;
  details?: string;
};

export const LOCAL_STORAGE_KEY = 'tradingview_alert_destinations';

// Helper to get destination type name
export const getDestinationTypeName = (type: AlertDestination['type']): string => {
  switch (type) {
    case 'telegram':
      return 'טלגרם';
    case 'whatsapp':
      return 'וואטסאפ';
    case 'email':
      return 'אימייל';
    case 'sms':
      return 'SMS';
    default:
      return type;
  }
};
