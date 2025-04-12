
import { toast } from 'sonner';
import { getAlertDestinations } from './alerts/destinations';
import { sendAlert } from './alerts/sender';
import { TradingViewAlert, createTradingViewAlert, AlertDestination } from './alerts/types';

// Store for tracked alerts
const alerts: TradingViewAlert[] = [];

/**
 * Add a new alert to tracking
 */
export function addAlert(alert: TradingViewAlert): boolean {
  try {
    alerts.push(alert);
    saveAlertsToStorage();
    return true;
  } catch (error) {
    console.error('Error adding alert:', error);
    return false;
  }
}

/**
 * Remove alert from tracking
 */
export function removeAlert(alertId: string): boolean {
  try {
    const index = alerts.findIndex(a => a.symbol === alertId);
    if (index !== -1) {
      alerts.splice(index, 1);
      saveAlertsToStorage();
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error removing alert:', error);
    return false;
  }
}

/**
 * Create a TradingView alert from a webhook
 */
export function createAlertFromWebhook(data: any): TradingViewAlert {
  return createTradingViewAlert({
    symbol: data.symbol,
    message: data.message || `Alert for ${data.symbol}`,
    indicators: Array.isArray(data.indicators) ? data.indicators : data.indicators ? [data.indicators] : [],
    timeframe: data.timeframe || '1d',
    timestamp: data.time ? Number(data.time) : Date.now(),
    price: data.price ? Number(data.price) : 0,
    action: data.action || 'info',
    details: data.details || '',
    strategy: data.strategy || '',
    type: data.action === 'buy' ? 'price' : data.action === 'sell' ? 'price' : 'custom',
    source: data.source || 'tradingview',
    priority: data.priority || 'medium'
  });
}

/**
 * Get all tracked alerts
 */
export function getAlerts(): TradingViewAlert[] {
  return [...alerts];
}

/**
 * Send the alert to configured destinations
 */
export async function processAndSendAlert(alert: TradingViewAlert): Promise<boolean> {
  try {
    const destinations = await getAlertDestinations();
    const activeDestinations = destinations.filter(d => d.active);
    
    if (activeDestinations.length === 0) {
      toast.warning('No active alert destinations configured');
      return false;
    }
    
    const results = await Promise.all(
      activeDestinations.map(destination => sendAlert(alert, destination))
    );
    
    const successCount = results.filter(success => success).length;
    
    if (successCount > 0) {
      toast.success(`Alert sent to ${successCount} destination${successCount !== 1 ? 's' : ''}`);
      return true;
    } else {
      toast.error('Failed to send alert to any destination');
      return false;
    }
  } catch (error) {
    console.error('Error processing alert:', error);
    toast.error('Error sending alert');
    return false;
  }
}

/**
 * Save alerts to local storage
 */
function saveAlertsToStorage(): void {
  try {
    localStorage.setItem('tradingview_alerts', JSON.stringify(alerts));
  } catch (error) {
    console.error('Error saving alerts to storage:', error);
  }
}

/**
 * Load alerts from local storage
 */
function loadAlertsFromStorage(): void {
  try {
    const storedAlerts = localStorage.getItem('tradingview_alerts');
    if (storedAlerts) {
      const parsedAlerts = JSON.parse(storedAlerts) as TradingViewAlert[];
      alerts.length = 0;
      alerts.push(...parsedAlerts);
    }
  } catch (error) {
    console.error('Error loading alerts from storage:', error);
  }
}

// Initialize alerts from storage
loadAlertsFromStorage();
