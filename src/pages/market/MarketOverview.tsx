
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TradingViewChart from '@/components/tradingview/TradingViewChart';

const MarketOverview: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-right">סקירת שוק</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TradingViewChart symbol="BTCUSD" timeframe="1D" />
          <TradingViewChart symbol="ETHUSD" timeframe="1D" />
        </div>
      </CardContent>
    </Card>
  );
};

export default MarketOverview;
