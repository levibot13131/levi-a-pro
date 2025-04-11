
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import TradingViewConnectButton from '@/components/technical-analysis/tradingview/TradingViewConnectButton';

interface TradingViewBannerProps {
  isConnected: boolean;
}

const TradingViewBanner: React.FC<TradingViewBannerProps> = ({ isConnected }) => {
  if (isConnected) return null;
  
  return (
    <Card className="mb-6 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
      <CardContent className="p-4 flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0 text-right md:flex-1">
          <h3 className="font-semibold text-lg">חיבור לחשבון TradingView</h3>
          <p className="text-sm text-muted-foreground">חבר את חשבון ה-TradingView שלך כדי לקבל איתותים בזמן אמת</p>
        </div>
        <div>
          <TradingViewConnectButton />
        </div>
      </CardContent>
    </Card>
  );
};

export default TradingViewBanner;
