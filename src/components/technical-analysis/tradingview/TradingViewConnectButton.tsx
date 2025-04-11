
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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [credentials, setCredentials] = useState<any>(null);

  // בדיקת סטטוס חיבור
  useEffect(() => {
    const connected = isTradingViewConnected();
    setIsConnected(connected);
    if (connected) {
      setCredentials(getTradingViewCredentials());
    }
    
    if (onConnectChange) {
      onConnectChange(connected);
    }
  }, [onConnectChange]);

  const handleConnectSuccess = () => {
    setIsConnected(true);
    setCredentials(getTradingViewCredentials());
    
    if (onConnectChange) {
      onConnectChange(true);
    }
  };

  const handleDisconnect = () => {
    disconnectTradingView();
    setIsConnected(false);
    setCredentials(null);
    setIsConfirmDialogOpen(false);
    
    if (onConnectChange) {
      onConnectChange(false);
    }
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
          {credentials?.username ? `מחובר כ-${credentials.username}` : 'מחובר ל-TradingView'}
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
              האם אתה בטוח שברצונך להתנתק מחשבון TradingView?
              {credentials?.username && ` (${credentials.username})`}
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
