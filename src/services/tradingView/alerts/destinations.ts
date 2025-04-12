
import { AlertDestination } from './types';

// רשימת יעדי ההתראות המוגדרים במערכת
const ALERT_DESTINATIONS: AlertDestination[] = [
  {
    id: 'telegram-1',
    type: 'telegram',
    name: 'Personal Telegram',
    active: true,
    config: {
      chatId: '123456789',
      token: 'sample-token-123'
    }
  },
  {
    id: 'telegram-2',
    type: 'telegram',
    name: 'Trading Group',
    active: false,
    config: {
      chatId: '-100123456789',
      token: 'sample-token-123'
    }
  },
  {
    id: 'webhook-1',
    type: 'webhook',
    name: 'Trading Bot Webhook',
    active: true,
    endpoint: 'https://example.com/webhook/trading-alerts',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': 'sample-api-key-123'
    }
  },
  {
    id: 'email-1',
    type: 'email',
    name: 'Personal Email',
    active: false,
    config: {
      email: 'sample@example.com'
    }
  }
];

/**
 * Get all alert destinations
 */
export function getAlertDestinations(): AlertDestination[] {
  return ALERT_DESTINATIONS;
}

/**
 * Get alert destination by ID
 */
export function getAlertDestinationById(id: string): AlertDestination | undefined {
  return ALERT_DESTINATIONS.find(dest => dest.id === id);
}

/**
 * Toggle destination active status
 */
export function toggleDestinationActive(id: string, active: boolean): boolean {
  const destination = ALERT_DESTINATIONS.find(dest => dest.id === id);
  if (destination) {
    destination.active = active;
    return true;
  }
  return false;
}

/**
 * Add new destination
 */
export function addAlertDestination(destination: AlertDestination): AlertDestination {
  // In a real app, we'd validate the destination here
  ALERT_DESTINATIONS.push(destination);
  return destination;
}

/**
 * Update destination
 */
export function updateAlertDestination(id: string, updates: Partial<AlertDestination>): AlertDestination | null {
  const index = ALERT_DESTINATIONS.findIndex(dest => dest.id === id);
  if (index >= 0) {
    ALERT_DESTINATIONS[index] = { ...ALERT_DESTINATIONS[index], ...updates };
    return ALERT_DESTINATIONS[index];
  }
  return null;
}

/**
 * Delete destination
 */
export function deleteAlertDestination(id: string): boolean {
  const index = ALERT_DESTINATIONS.findIndex(dest => dest.id === id);
  if (index >= 0) {
    ALERT_DESTINATIONS.splice(index, 1);
    return true;
  }
  return false;
}

/**
 * Get active destinations
 */
export function getActiveDestinations(): AlertDestination[] {
  return ALERT_DESTINATIONS.filter(dest => dest.active);
}
