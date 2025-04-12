import { WebhookSignal } from '@/types/webhookSignal';
import { v4 as uuidv4 } from 'uuid';
import { AlertDestination } from '@/types/webhookSignal';
import { getAlertDestinations } from './tradingView/tradingViewAlertService';

const WEBHOOK_SIGNALS_KEY = 'webhookSignals';

// Function to store a webhook signal in local storage
export const storeWebhookSignal = (signal: WebhookSignal) => {
  signal.id = uuidv4(); // Assign a unique ID to the signal
  const storedSignals = getStoredWebhookSignals();
  storedSignals.push(signal);
  localStorage.setItem(WEBHOOK_SIGNALS_KEY, JSON.stringify(storedSignals));
  
  // Notify subscribers about the new signal
  notifySubscribers();
};

// Function to retrieve stored webhook signals from local storage
export const getStoredWebhookSignals = (): WebhookSignal[] => {
  const storedSignals = localStorage.getItem(WEBHOOK_SIGNALS_KEY);
  return storedSignals ? JSON.parse(storedSignals) : [];
};

// Function to clear all stored webhook signals from local storage
export const clearStoredWebhookSignals = () => {
  localStorage.removeItem(WEBHOOK_SIGNALS_KEY);
};

// Simulate a webhook signal and store it
export const simulateWebhookSignal = async (type: 'buy' | 'sell' | 'info'): Promise<boolean> => {
  try {
    const destinations = getAlertDestinations();
    
    // Ensure destinations are processed correctly
    const processedDestinations = destinations.map(destination => ({
      ...destination,
      isActive: !!destination.active
    }));

    const signal: WebhookSignal = {
      symbol: 'BTCUSD',
      message: `Simulated ${type} signal`,
      indicators: ['RSI', 'MACD'],
      timeframe: '1h',
      timestamp: Date.now(),
      price: 50000,
      action: type,
      strength: 0.8,
      details: 'This is a simulated signal for testing purposes.'
    };
    
    storeWebhookSignal(signal);
    return true;
  } catch (error) {
    console.error('Error simulating webhook signal:', error);
    return false;
  }
};

// Mock function to test the webhook integration
export const testWebhookIntegration = async (): Promise<boolean> => {
  try {
    // Simulate processing a webhook signal
    const signal: WebhookSignal = {
      symbol: 'ETHUSD',
      message: 'Test webhook signal',
      indicators: ['EMA', 'SMA'],
      timeframe: '4h',
      timestamp: Date.now(),
      price: 3500,
      action: 'info',
      strength: 0.7,
      details: 'This is a test signal to verify the webhook integration.'
    };
    
    storeWebhookSignal(signal);
    return true;
  } catch (error) {
    console.error('Error testing webhook integration:', error);
    return false;
  }
};

// ------------------------------------------------------------------------------------------------------
// Subscription management (basic implementation)
// ------------------------------------------------------------------------------------------------------

let subscribers: (() => void)[] = [];

// Function to subscribe to webhook signal updates
export const subscribeToWebhookSignals = (callback: () => void): () => void => {
  subscribers.push(callback);
  return () => {
    subscribers = subscribers.filter(sub => sub !== callback);
  };
};

// Function to notify all subscribers about new webhook signals
const notifySubscribers = () => {
  subscribers.forEach(callback => callback());
};
