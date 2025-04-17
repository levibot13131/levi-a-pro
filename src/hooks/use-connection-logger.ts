import { useEffect, useRef, useCallback } from 'react';
import { toast } from 'sonner';

interface ConnectionEvent {
  service: 'tradingview' | 'binance' | 'twitter' | 'general';
  event: 'connected' | 'disconnected' | 'error' | 'syncing' | 'synced';
  timestamp: number;
  details?: string;
}

interface ConnectionLog {
  events: ConnectionEvent[];
  errors: ConnectionEvent[];
  lastConnected: Record<string, number | null>;
}

// Maximum number of events to store
const MAX_LOG_ENTRIES = 100;
const MAX_ERROR_ENTRIES = 50;

// Storage key for persistence between sessions
const STORAGE_KEY = 'connection_logs';

/**
 * Hook for logging and monitoring connection events across services
 */
export function useConnectionLogger() {
  // Use ref to avoid recreating functions on every render
  const logRef = useRef<ConnectionLog>({
    events: [],
    errors: [],
    lastConnected: {
      tradingview: null,
      binance: null,
      twitter: null
    }
  });
  
  // Initialize from localStorage if available
  useEffect(() => {
    try {
      const storedLogs = localStorage.getItem(STORAGE_KEY);
      if (storedLogs) {
        logRef.current = JSON.parse(storedLogs);
      }
    } catch (err) {
      console.error('Failed to load connection logs:', err);
      // If loading fails, keep using the default empty log
    }
  }, []);
  
  // Save to localStorage when logs change
  const saveLogs = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(logRef.current));
    } catch (err) {
      console.error('Failed to save connection logs:', err);
    }
  }, []);
  
  // Log a new connection event
  const logEvent = useCallback((event: Omit<ConnectionEvent, 'timestamp'>) => {
    const fullEvent: ConnectionEvent = {
      ...event,
      timestamp: Date.now()
    };
    
    // Add to events list
    logRef.current.events = [
      fullEvent,
      ...logRef.current.events
    ].slice(0, MAX_LOG_ENTRIES);
    
    // If it's an error, add to errors list too
    if (event.event === 'error') {
      logRef.current.errors = [
        fullEvent,
        ...logRef.current.errors
      ].slice(0, MAX_ERROR_ENTRIES);
      
      // Show toast for errors
      toast.error(`${event.service} error`, {
        description: event.details || 'Connection error occurred'
      });
    }
    
    // Update last connected timestamp
    if (event.event === 'connected') {
      logRef.current.lastConnected[event.service] = fullEvent.timestamp;
    }
    
    // Save to localStorage
    saveLogs();
    
    // Log to console for debugging
    console.debug(`[${event.service}] ${event.event}`, event.details || '');
    
    return fullEvent;
  }, [saveLogs]);
  
  // Get the current log state
  const getLogs = useCallback(() => {
    return { ...logRef.current };
  }, []);
  
  // Clear all logs
  const clearLogs = useCallback(() => {
    logRef.current = {
      events: [],
      errors: [],
      lastConnected: {
        tradingview: null,
        binance: null,
        twitter: null
      }
    };
    saveLogs();
  }, [saveLogs]);
  
  // Get status summaries
  const getConnectionSummary = useCallback(() => {
    const now = Date.now();
    const lastDay = now - 86400000; // 24 hours ago
    
    // Count events in the last 24 hours
    const recentEvents = logRef.current.events.filter(e => e.timestamp > lastDay);
    
    // Count by service and type
    const summary = {
      tradingview: {
        connected: recentEvents.filter(e => e.service === 'tradingview' && e.event === 'connected').length,
        disconnected: recentEvents.filter(e => e.service === 'tradingview' && e.event === 'disconnected').length,
        errors: recentEvents.filter(e => e.service === 'tradingview' && e.event === 'error').length,
        lastConnected: logRef.current.lastConnected.tradingview
      },
      binance: {
        connected: recentEvents.filter(e => e.service === 'binance' && e.event === 'connected').length,
        disconnected: recentEvents.filter(e => e.service === 'binance' && e.event === 'disconnected').length,
        errors: recentEvents.filter(e => e.service === 'binance' && e.event === 'error').length,
        lastConnected: logRef.current.lastConnected.binance
      },
      twitter: {
        connected: recentEvents.filter(e => e.service === 'twitter' && e.event === 'connected').length,
        disconnected: recentEvents.filter(e => e.service === 'twitter' && e.event === 'disconnected').length,
        errors: recentEvents.filter(e => e.service === 'twitter' && e.event === 'error').length,
        lastConnected: logRef.current.lastConnected.twitter
      }
    };
    
    return summary;
  }, []);
  
  return {
    logEvent,
    getLogs,
    clearLogs,
    getConnectionSummary
  };
}
