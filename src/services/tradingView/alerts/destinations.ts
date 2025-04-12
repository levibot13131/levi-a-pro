
import { AlertDestination } from './types';

const DESTINATIONS_STORAGE_KEY = 'levi-bot-alert-destinations';

// Initial default destinations
const defaultDestinations: AlertDestination[] = [
  {
    id: 'telegram-default',
    name: 'טלגרם',
    type: 'telegram',
    active: false,
    config: {
      botToken: '',
      chatId: ''
    }
  },
  {
    id: 'webhook-default',
    name: 'Webhook',
    type: 'webhook',
    active: true,
    endpoint: 'https://api.example.com/tradingview-webhook',
    headers: { 'Content-Type': 'application/json' },
    config: {
      method: 'POST',
      format: 'json'
    }
  },
  {
    id: 'whatsapp-default',
    name: 'וואטסאפ',
    type: 'whatsapp',
    active: false,
    config: {
      phone: '',
      template: 'Signal: {{type}} {{symbol}} at {{price}}'
    }
  }
];

// Get alert destinations
export const getAlertDestinations = (): AlertDestination[] => {
  try {
    const stored = localStorage.getItem(DESTINATIONS_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    return defaultDestinations;
  } catch (error) {
    console.error('Error loading alert destinations:', error);
    return defaultDestinations;
  }
};

// Save alert destinations
export const saveAlertDestinations = (destinations: AlertDestination[]): void => {
  try {
    localStorage.setItem(DESTINATIONS_STORAGE_KEY, JSON.stringify(destinations));
  } catch (error) {
    console.error('Error saving alert destinations:', error);
  }
};

// Add a new alert destination
export const addAlertDestination = (destination: Omit<AlertDestination, 'id'>): AlertDestination => {
  const destinations = getAlertDestinations();
  const newDestination: AlertDestination = {
    ...destination,
    id: `destination-${Date.now()}-${Math.floor(Math.random() * 1000)}`
  };
  
  destinations.push(newDestination);
  saveAlertDestinations(destinations);
  
  return newDestination;
};

// Update an existing alert destination
export const updateAlertDestination = (id: string, updates: Partial<AlertDestination>): boolean => {
  const destinations = getAlertDestinations();
  const index = destinations.findIndex(d => d.id === id);
  
  if (index !== -1) {
    destinations[index] = { ...destinations[index], ...updates };
    saveAlertDestinations(destinations);
    return true;
  }
  
  return false;
};

// Delete an alert destination
export const deleteAlertDestination = (id: string): boolean => {
  const destinations = getAlertDestinations();
  const newDestinations = destinations.filter(d => d.id !== id);
  
  if (newDestinations.length !== destinations.length) {
    saveAlertDestinations(newDestinations);
    return true;
  }
  
  return false;
};

// Enable or disable a destination
export const toggleDestinationStatus = (id: string, active: boolean): boolean => {
  return updateAlertDestination(id, { active });
};
