
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Link2, UserCheck2, LogOut } from 'lucide-react';
import TradingViewConnectForm from './TradingViewConnectForm';
import { isTradingViewConnected, getTradingViewCredentials, disconnectTradingView } from '@/services/tradingView/tradingViewAuthService';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

interface TradingViewConnectButtonProps {
  onConnectChange?: (isConnected: boolean) => void;
}

const TradingViewConnectButton: React.FC<TradingViewConnectButtonProps> = ({ 
  onConnectChange 
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [credentials, setCredentials] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

  // Check connection status on mount
  useEffect(() => {
    const connected = isTradingViewConnected();
    setIsConnected(connected);
    
    if (connected) {
      setCredentials(getTradingViewCredentials());
    }
    
    // Listen for storage changes (for when credentials are updated in another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'tradingview_auth_credentials') {
        const connected = isTradingViewConnected();
        setIsConnected(connected);
        setCredentials(connected ? getTradingViewCredentials() : null);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
  
  // Notify parent of connection changes
  useEffect(() => {
    if (onConnectChange) {
      onConnectChange(isConnected);
    }
  }, [isConnected, onConnectChange]);

  const handleConnectSuccess = () => {
    const connected = isTradingViewConnected();
    setIsConnected(connected);
    setCredentials(connected ? getTradingViewCredentials() : null);
  };

  const handleDisconnect = () => {
    disconnectTradingView();
    setIsConnected(false);
    setCredentials(null);
    setIsConfirmDialogOpen(false);
  };

  return (
    <>
      {isConnected ? (
        <Button
          variant="outline"
          className="gap-2"
          onClick={() => setIsConfirmDialogOpen(true)}
        >
          <UserCheck2 className="h-4 w-4" />
          מחובר ל-TradingView
        </Button>
      ) : (
        <Button 
          className="gap-2"
          onClick={() => setIsDialogOpen(true)}
        >
          <Link2 className="h-4 w-4" />
          התחבר ל-TradingView
        </Button>
      )}

      <TradingViewConnectForm 
        isOpen={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
        onConnectSuccess={handleConnectSuccess}
      />

      <AlertDialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-right">ניתוק מ-TradingView</AlertDialogTitle>
            <AlertDialogDescription className="text-right">
              האם אתה בטוח שברצונך להתנתק מחשבון ה-TradingView שלך?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row-reverse justify-start gap-2">
            <AlertDialogCancel>ביטול</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDisconnect}
              className="bg-destructive hover:bg-destructive/90 flex gap-2"
            >
              <LogOut className="h-4 w-4" />
              ניתוק
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default TradingViewConnectButton;
