
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { TradingViewAlert } from '@/services/tradingView/alerts/types';

// Constants
export const WHATSAPP_PHONE_REGEX = /^\+?[0-9]{10,15}$/;

interface WhatsAppConfig {
  enabled: boolean;
  phoneNumber: string;
  notifyOnBuy: boolean;
  notifyOnSell: boolean;
  notifyOnInfo: boolean;
  lastUpdated: number;
}

interface WhatsAppStats {
  totalSent: number;
  lastSent: number | null;
  errorCount: number;
}

// Default configuration
const DEFAULT_CONFIG: WhatsAppConfig = {
  enabled: false,
  phoneNumber: '',
  notifyOnBuy: true,
  notifyOnSell: true,
  notifyOnInfo: false,
  lastUpdated: 0
};

// Default stats
const DEFAULT_STATS: WhatsAppStats = {
  totalSent: 0,
  lastSent: null,
  errorCount: 0
};

// Storage keys
const WHATSAPP_CONFIG_KEY = 'whatsapp_config';
const WHATSAPP_STATS_KEY = 'whatsapp_stats';

// Load config from localStorage
const loadConfig = (): WhatsAppConfig => {
  try {
    const storedConfig = localStorage.getItem(WHATSAPP_CONFIG_KEY);
    return storedConfig ? JSON.parse(storedConfig) : DEFAULT_CONFIG;
  } catch (error) {
    console.error('Error loading WhatsApp config:', error);
    return DEFAULT_CONFIG;
  }
};

// Load stats from localStorage
const loadStats = (): WhatsAppStats => {
  try {
    const storedStats = localStorage.getItem(WHATSAPP_STATS_KEY);
    return storedStats ? JSON.parse(storedStats) : DEFAULT_STATS;
  } catch (error) {
    console.error('Error loading WhatsApp stats:', error);
    return DEFAULT_STATS;
  }
};

// Save config to localStorage
const saveConfig = (config: WhatsAppConfig): void => {
  try {
    localStorage.setItem(WHATSAPP_CONFIG_KEY, JSON.stringify({
      ...config,
      lastUpdated: Date.now()
    }));
  } catch (error) {
    console.error('Error saving WhatsApp config:', error);
  }
};

// Save stats to localStorage
const saveStats = (stats: WhatsAppStats): void => {
  try {
    localStorage.setItem(WHATSAPP_STATS_KEY, JSON.stringify(stats));
  } catch (error) {
    console.error('Error saving WhatsApp stats:', error);
  }
};

export const useWhatsAppIntegration = () => {
  const [config, setConfig] = useState<WhatsAppConfig>(loadConfig);
  const [stats, setStats] = useState<WhatsAppStats>(loadStats);
  const [isConfiguring, setIsConfiguring] = useState<boolean>(false);
  const [phoneNumber, setPhoneNumber] = useState<string>(config.phoneNumber);

  // Update internal state when localStorage changes
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === WHATSAPP_CONFIG_KEY) {
        setConfig(loadConfig());
      } else if (e.key === WHATSAPP_STATS_KEY) {
        setStats(loadStats());
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Enable WhatsApp integration
  const enableWhatsApp = (phoneNum: string) => {
    if (!WHATSAPP_PHONE_REGEX.test(phoneNum)) {
      toast.error('מספר טלפון לא תקין', {
        description: 'אנא הזן מספר טלפון תקין כולל קידומת מדינה'
      });
      return false;
    }

    const newConfig = {
      ...config,
      enabled: true,
      phoneNumber: phoneNum
    };
    
    saveConfig(newConfig);
    setConfig(newConfig);
    toast.success('שירות WhatsApp הופעל', {
      description: `התראות יישלחו למספר ${phoneNum}`
    });
    return true;
  };

  // Disable WhatsApp integration
  const disableWhatsApp = () => {
    const newConfig = {
      ...config,
      enabled: false
    };
    
    saveConfig(newConfig);
    setConfig(newConfig);
    toast.info('שירות WhatsApp כובה');
    return true;
  };

  // Update notification settings
  const updateNotificationSettings = (settings: {
    notifyOnBuy?: boolean;
    notifyOnSell?: boolean;
    notifyOnInfo?: boolean;
  }) => {
    const newConfig = {
      ...config,
      ...settings
    };
    
    saveConfig(newConfig);
    setConfig(newConfig);
    toast.success('הגדרות התראות WhatsApp עודכנו');
    return true;
  };

  // Send WhatsApp message
  const sendWhatsAppMessage = async (message: string): Promise<boolean> => {
    if (!config.enabled || !config.phoneNumber) {
      console.error('WhatsApp integration not enabled or no phone number configured');
      return false;
    }

    try {
      // In a real app, we would call an API to send the message
      // Here we simulate a successful send
      console.log(`Sending WhatsApp message to ${config.phoneNumber}: ${message}`);
      
      // Update stats
      const newStats = {
        ...stats,
        totalSent: stats.totalSent + 1,
        lastSent: Date.now()
      };
      
      saveStats(newStats);
      setStats(newStats);
      
      return true;
    } catch (error) {
      console.error('Error sending WhatsApp message:', error);
      
      // Update error count
      const newStats = {
        ...stats,
        errorCount: stats.errorCount + 1
      };
      
      saveStats(newStats);
      setStats(newStats);
      
      return false;
    }
  };

  // Process an alert and send WhatsApp message if needed
  const processAlert = async (alert: TradingViewAlert): Promise<boolean> => {
    if (!config.enabled) return false;
    
    // Check if we should process this alert type
    if (
      (alert.type === 'buy' && !config.notifyOnBuy) ||
      (alert.type === 'sell' && !config.notifyOnSell) ||
      (alert.type === 'info' && !config.notifyOnInfo)
    ) {
      return false;
    }
    
    // Format the message
    const message = formatAlertMessage(alert);
    
    // Send the message
    return await sendWhatsAppMessage(message);
  };

  // Format an alert as a WhatsApp message
  const formatAlertMessage = (alert: TradingViewAlert): string => {
    const emoji = alert.type === 'buy' ? '🟢' : 
                 alert.type === 'sell' ? '🔴' : '🔵';
    
    let message = `${emoji} *איתות ${alert.type === 'buy' ? 'קנייה' : alert.type === 'sell' ? 'מכירה' : 'מידע'}*\n\n`;
    message += `*סימול:* ${alert.symbol}\n`;
    message += `*מחיר:* $${alert.price.toLocaleString()}\n`;
    message += `*טווח זמן:* ${alert.timeframe}\n`;
    
    if (alert.indicators && alert.indicators.length > 0) {
      message += `*אינדיקטורים:* ${alert.indicators.join(', ')}\n`;
    }
    
    if (alert.details) {
      message += `\n${alert.details}\n`;
    }
    
    message += `\n📊 *זמן:* ${new Date(alert.timestamp).toLocaleString('he-IL')}`;
    
    return message;
  };

  // Get test phone number link for WhatsApp
  const getWhatsAppTestLink = (): string => {
    return `https://wa.me/${config.phoneNumber.replace(/\+/g, '')}`;
  };

  return {
    isEnabled: config.enabled,
    phoneNumber: config.phoneNumber,
    notifyOnBuy: config.notifyOnBuy,
    notifyOnSell: config.notifyOnSell,
    notifyOnInfo: config.notifyOnInfo,
    stats,
    isConfiguring,
    setIsConfiguring,
    phoneNumberInput: phoneNumber,
    setPhoneNumberInput: setPhoneNumber,
    enableWhatsApp,
    disableWhatsApp,
    updateNotificationSettings,
    sendWhatsAppMessage,
    processAlert,
    getWhatsAppTestLink
  };
};
