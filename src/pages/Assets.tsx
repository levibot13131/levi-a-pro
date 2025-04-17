
import React, { useState } from 'react';
import { Container } from '@/components/ui/container';
import RequireAuth from '@/components/auth/RequireAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import TradingViewChart from '@/components/tradingview/TradingViewChart';
import { useTradingViewConnection } from '@/hooks/use-tradingview-connection';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Info, LineChart, Settings } from 'lucide-react';

const DEFAULT_ASSETS = ['BTCUSD', 'ETHUSD', 'XRPUSD'];

const Assets = () => {
  const [selectedAssets] = useState<string[]>(DEFAULT_ASSETS);
  const { isConnected } = useTradingViewConnection();

  return (
    <RequireAuth>
      <Container className="py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">נכסים</h1>
            <p className="text-muted-foreground">רשימת הנכסים שלך והסטטוס העדכני שלהם</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link to="/tradingview-integration">
                <Settings className="h-4 w-4 mr-2" />
                הגדרות
              </Link>
            </Button>
            <Button asChild>
              <Link to="/asset-tracker">
                <LineChart className="h-4 w-4 mr-2" />
                מעקב נכסים
              </Link>
            </Button>
          </div>
        </div>

        {!isConnected && (
          <Card className="mb-6 border-yellow-200 bg-yellow-50 dark:bg-yellow-950 dark:border-yellow-800">
            <CardHeader>
              <div className="flex items-center">
                <Info className="h-5 w-5 text-yellow-600 dark:text-yellow-400 ml-2" />
                <CardTitle className="text-right text-lg text-yellow-700 dark:text-yellow-300">חיבור TradingView</CardTitle>
              </div>
              <CardDescription className="text-yellow-600 dark:text-yellow-400 text-right">
                לקבלת נתוני מסחר בזמן אמת, אנא התחבר לחשבון TradingView שלך
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link to="/tradingview-integration">התחבר ל-TradingView</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {selectedAssets.map(asset => (
            <TradingViewChart 
              key={asset} 
              symbol={asset} 
              height={300}
            />
          ))}
        </div>
      </Container>
    </RequireAuth>
  );
};

export default Assets;
