
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { LineChart } from 'lucide-react';

export interface TradingViewConnectButtonProps {
  size?: 'default' | 'sm' | 'lg' | 'icon';
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  onConnectSuccess?: () => void;
}

const TradingViewConnectButton: React.FC<TradingViewConnectButtonProps> = ({
  size = 'sm',
  variant = 'outline',
  onConnectSuccess
}) => {
  const [isConnecting, setIsConnecting] = useState(false);
  
  const handleConnect = () => {
    setIsConnecting(true);
    
    // Simulate connection
    setTimeout(() => {
      setIsConnecting(false);
      if (onConnectSuccess) {
        onConnectSuccess();
      }
    }, 1500);
  };
  
  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleConnect}
      disabled={isConnecting}
      className="gap-2"
    >
      <LineChart className="h-4 w-4" />
      {isConnecting ? 'מתחבר...' : 'חיבור ל-TradingView'}
    </Button>
  );
};

export default TradingViewConnectButton;
