
import { useState, useEffect } from 'react';
import { useTradingViewConnection } from './use-tradingview-connection';
import { useBinanceConnection } from './use-binance-connection';
import { toast } from 'sonner';

export type ConnectionStatus = 'connected' | 'partial' | 'disconnected';
export type DataSourceType = 'tradingview' | 'binance' | 'webhook' | 'internal';

export interface DataSource {
  type: DataSourceType;
  name: string;
  status: 'active' | 'inactive';
  lastUpdated?: Date;
}

export interface SystemStatusData {
  connectionStatus: ConnectionStatus;
  dataSources: DataSource[];
  isRealTime: boolean;
  lastUpdated: Date | null;
  activeFeatures: string[];
}

export function useSystemStatus() {
  const { isConnected: isTradingViewConnected } = useTradingViewConnection();
  const { isConnected: isBinanceConnected } = useBinanceConnection();
  const [status, setStatus] = useState<SystemStatusData>({
    connectionStatus: 'disconnected',
    dataSources: [],
    isRealTime: false,
    lastUpdated: null,
    activeFeatures: []
  });
  
  // בדיקת המערכת והגדרת הסטטוס
  useEffect(() => {
    const checkSystemStatus = () => {
      // בנייה של מקורות המידע
      const dataSources: DataSource[] = [
        {
          type: 'tradingview',
          name: 'TradingView',
          status: isTradingViewConnected ? 'active' : 'inactive',
          lastUpdated: isTradingViewConnected ? new Date() : undefined
        },
        {
          type: 'binance',
          name: 'Binance',
          status: isBinanceConnected ? 'active' : 'inactive',
          lastUpdated: isBinanceConnected ? new Date() : undefined
        },
        {
          type: 'webhook',
          name: 'Webhook Alerts',
          status: isTradingViewConnected ? 'active' : 'inactive'
        },
        {
          type: 'internal',
          name: 'Internal Data',
          status: 'active', // תמיד פעיל
          lastUpdated: new Date()
        }
      ];
      
      // קביעת סטטוס חיבור כללי
      let connectionStatus: ConnectionStatus = 'disconnected';
      if (isTradingViewConnected && isBinanceConnected) {
        connectionStatus = 'connected';
      } else if (isTradingViewConnected || isBinanceConnected) {
        connectionStatus = 'partial';
      }
      
      // קביעת האם המערכת בזמן אמת
      const isRealTime = isTradingViewConnected || isBinanceConnected;
      
      // קביעת פיצ'רים פעילים
      const activeFeatures: string[] = ['מעקב נכסים', 'חדשות שוק'];
      
      if (isTradingViewConnected) {
        activeFeatures.push('איתותים טכניים', 'גרפים מתקדמים', 'התראות');
      }
      
      if (isBinanceConnected) {
        activeFeatures.push('מסחר אוטומטי', 'ספר הזמנות', 'ניתוח נוזלות');
      }
      
      setStatus({
        connectionStatus,
        dataSources,
        isRealTime,
        lastUpdated: new Date(),
        activeFeatures
      });
    };
    
    // בדיקה ראשונית
    checkSystemStatus();
    
    // בדיקה תקופתית
    const interval = setInterval(checkSystemStatus, 60000); // בדיקה כל דקה
    
    return () => clearInterval(interval);
  }, [isTradingViewConnected, isBinanceConnected]);
  
  // הפעלה של המערכת בזמן אמת
  const enableRealTimeMode = () => {
    if (!isTradingViewConnected && !isBinanceConnected) {
      toast.warning('לא ניתן להפעיל מצב זמן אמת', {
        description: 'יש להתחבר תחילה ל-TradingView או Binance'
      });
      return false;
    }
    
    toast.success('מצב זמן אמת הופעל', {
      description: 'המערכת תעדכן נתונים בזמן אמת'
    });
    return true;
  };
  
  return {
    ...status,
    enableRealTimeMode
  };
}
