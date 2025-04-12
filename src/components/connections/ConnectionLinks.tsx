
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ExternalLink, Wallet, Link2 } from 'lucide-react';
import { useBinanceConnection } from '@/hooks/use-binance-connection';
import { useTradingViewConnection } from '@/hooks/use-tradingview-connection';
import { isTwitterConnected } from '@/services/twitter/twitterService';

const ConnectionLinks: React.FC = () => {
  const { isConnected: isBinanceConnected } = useBinanceConnection();
  const { isConnected: isTradingViewConnected } = useTradingViewConnection();
  const isTwitterConn = isTwitterConnected();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-right">חיבורים חיצוניים</CardTitle>
        <CardDescription className="text-right">
          התחבר למערכות חיצוניות לקבלת נתונים בזמן אמת
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className={isBinanceConnected ? "border-green-500" : "border-gray-200"}>
            <CardHeader className="py-3">
              <CardTitle className="text-sm text-center">Binance</CardTitle>
            </CardHeader>
            <CardContent className="text-center py-2">
              <Wallet className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="text-xs mb-3">
                {isBinanceConnected ? (
                  <span className="text-green-500 font-medium">מחובר ✓</span>
                ) : (
                  <span className="text-gray-500">לא מחובר</span>
                )}
              </div>
              <Button asChild size="sm" variant={isBinanceConnected ? "outline" : "default"}>
                <Link to="/binance-integration">
                  {isBinanceConnected ? "ניהול חיבור" : "התחבר עכשיו"}
                </Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card className={isTradingViewConnected ? "border-green-500" : "border-gray-200"}>
            <CardHeader className="py-3">
              <CardTitle className="text-sm text-center">TradingView</CardTitle>
            </CardHeader>
            <CardContent className="text-center py-2">
              <ExternalLink className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="text-xs mb-3">
                {isTradingViewConnected ? (
                  <span className="text-green-500 font-medium">מחובר ✓</span>
                ) : (
                  <span className="text-gray-500">לא מחובר</span>
                )}
              </div>
              <Button asChild size="sm" variant={isTradingViewConnected ? "outline" : "default"}>
                <Link to="/tradingview-integration">
                  {isTradingViewConnected ? "ניהול חיבור" : "התחבר עכשיו"}
                </Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card className={isTwitterConn ? "border-green-500" : "border-gray-200"}>
            <CardHeader className="py-3">
              <CardTitle className="text-sm text-center">Twitter/X</CardTitle>
            </CardHeader>
            <CardContent className="text-center py-2">
              <Link2 className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="text-xs mb-3">
                {isTwitterConn ? (
                  <span className="text-green-500 font-medium">מחובר ✓</span>
                ) : (
                  <span className="text-gray-500">לא מחובר</span>
                )}
              </div>
              <Button asChild size="sm" variant={isTwitterConn ? "outline" : "default"}>
                <Link to="/crypto-sentiment">
                  {isTwitterConn ? "ניהול חיבור" : "התחבר עכשיו"}
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConnectionLinks;
