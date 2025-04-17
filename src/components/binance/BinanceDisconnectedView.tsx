
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import BinanceConnectButton from '@/components/binance/BinanceConnectButton';
import BinanceFeatureCards from '@/components/binance/BinanceFeatureCards';

const BinanceDisconnectedView: React.FC = () => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-right">התחבר לחשבון ה-Binance שלך</CardTitle>
        <CardDescription className="text-right">
          חבר את המערכת לחשבון הבינאנס שלך כדי לקבל נתונים בזמן אמת ולבצע פעולות מסחר
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <BinanceFeatureCards />
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            המפתחות נשמרים מקומית במכשיר שלך בלבד ולא נשלחים לשרת.
          </p>
          <BinanceConnectButton />
        </div>
      </CardContent>
    </Card>
  );
};

export default BinanceDisconnectedView;
