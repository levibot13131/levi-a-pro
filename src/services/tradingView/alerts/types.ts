
import { v4 as uuidv4 } from 'uuid';

// Local storage key for alert destinations
export const LOCAL_STORAGE_KEY = 'tradingview-alert-destinations';

// Alert action type (buy, sell, info)
export type AlertAction = 'buy' | 'sell' | 'info';

// TradingView alert data structure
export interface TradingViewAlert {
  symbol: string;
  message: string;
  indicators: string[];
  timeframe: string;
  timestamp: number;
  price: number;
  action: AlertAction;
  details?: string;
  strength?: number;
  strategy?: string;
  chartUrl?: string;
}

// Alert destination type
export type AlertDestinationType = 'telegram' | 'whatsapp' | 'email' | 'sms';

// Alert destination structure
export interface AlertDestination {
  id: string;
  name: string;
  type: AlertDestinationType;
  active: boolean;
}

// Create a new alert destination
export const createAlertDestination = (
  name: string,
  type: AlertDestinationType,
  active: boolean = false
): AlertDestination => ({
  id: uuidv4(),
  name,
  type,
  active
});

// Get destination type name
export const getDestinationTypeName = (type: AlertDestinationType): string => {
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

// Create a new TradingView alert
export const createTradingViewAlert = (
  symbol: string,
  action: AlertAction,
  price: number,
  timeframe: string = '1d',
  message: string = '',
  indicators: string[] = [],
  details?: string,
  strategy?: string,
  chartUrl?: string
): TradingViewAlert => ({
  symbol,
  message,
  indicators,
  timeframe,
  timestamp: Date.now(),
  price,
  action,
  details,
  strategy,
  chartUrl
});
