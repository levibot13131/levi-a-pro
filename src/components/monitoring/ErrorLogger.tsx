
import React, { useEffect } from 'react';
import { useConnectionLogger } from '@/hooks/use-connection-logger';

interface ErrorLoggerProps {
  service: 'tradingview' | 'binance' | 'twitter' | 'general';
  children: React.ReactNode;
}

/**
 * Component that wraps content and logs errors that occur within it
 * to the ConnectionLogger service
 */
const ErrorLogger: React.FC<ErrorLoggerProps> = ({ service, children }) => {
  const { logEvent } = useConnectionLogger();
  
  // Set up global error handler for this component
  useEffect(() => {
    const errorHandler = (event: ErrorEvent) => {
      // Log the error to our connection logger
      logEvent({
        service,
        event: 'error',
        details: `${event.message} at ${event.filename}:${event.lineno}`
      });
      
      // Don't prevent default so browser console still shows the error
    };
    
    // Add error listener
    window.addEventListener('error', errorHandler);
    
    // Add unhandled promise rejection listener
    const rejectionHandler = (event: PromiseRejectionEvent) => {
      logEvent({
        service,
        event: 'error',
        details: `Unhandled Promise Rejection: ${event.reason}`
      });
    };
    window.addEventListener('unhandledrejection', rejectionHandler);
    
    return () => {
      // Clean up listeners
      window.removeEventListener('error', errorHandler);
      window.removeEventListener('unhandledrejection', rejectionHandler);
    };
  }, [service, logEvent]);
  
  return <>{children}</>;
};

export default ErrorLogger;
