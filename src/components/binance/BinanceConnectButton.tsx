
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Link2, UserCheck2, LogOut } from 'lucide-react';
import BinanceConnectForm from './BinanceConnectForm';
import { useBinanceConnection } from '@/hooks/use-binance-connection';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

interface BinanceConnectButtonProps {
  onConnectChange?: (isConnected: boolean) => void;
}

const BinanceConnectButton: React.FC<BinanceConnectButtonProps> = ({ 
  onConnectChange 
}) => {
  const { isConnected, credentials, disconnect, refreshConnection } = useBinanceConnection();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

  // Notify parent of connection changes
  useEffect(() => {
    if (onConnectChange) {
      onConnectChange(isConnected);
    }
  }, [isConnected, onConnectChange]);

  const handleConnectSuccess = () => {
    refreshConnection();
  };

  const handleDisconnect = () => {
    disconnect();
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
          מחובר ל-Binance
        </Button>
      ) : (
        <Button 
          className="gap-2"
          onClick={() => setIsDialogOpen(true)}
        >
          <Link2 className="h-4 w-4" />
          התחבר ל-Binance
        </Button>
      )}

      <BinanceConnectForm 
        isOpen={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
        onConnectSuccess={handleConnectSuccess}
      />

      <AlertDialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-right">ניתוק מ-Binance</AlertDialogTitle>
            <AlertDialogDescription className="text-right">
              האם אתה בטוח שברצונך להתנתק מחשבון ה-Binance שלך?
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

export default BinanceConnectButton;
