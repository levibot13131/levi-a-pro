
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Container } from '@/components/ui/container';
import { formatCurrency } from '@/lib/utils';

const Portfolio = () => {
  // מידע משימוש על התיק ופעילויות המסחר
  const portfolioData = {
    totalValue: 10000,
    unrealizedProfit: 1250,
    todaysChange: 125,
    assets: [
      { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', amount: 0.05, value: 3000, change24h: 2.5 },
      { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', amount: 1.2, value: 2400, change24h: -1.2 },
      { id: 'solana', name: 'Solana', symbol: 'SOL', amount: 25, value: 2500, change24h: 5.7 },
      { id: 'cardano', name: 'Cardano', symbol: 'ADA', amount: 5000, value: 2100, change24h: 0.8 },
    ]
  };

  return (
    <Container className="py-6">
      <h1 className="text-3xl font-bold tracking-tight mb-6 text-right">Levi Bot - תיק השקעות</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-right">סך ערך תיק</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(portfolioData.totalValue)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-right">רווח לא ממומש</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(portfolioData.unrealizedProfit)}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-right">שינוי יומי</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${portfolioData.todaysChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {portfolioData.todaysChange >= 0 ? '+' : ''}{formatCurrency(portfolioData.todaysChange)}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-right">נכסים</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{portfolioData.assets.length}</div>
          </CardContent>
        </Card>
      </div>
      
      <div className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-right">הנכסים שלי</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-right">
                    <th className="pb-2 text-muted-foreground">נכס</th>
                    <th className="pb-2 text-muted-foreground">כמות</th>
                    <th className="pb-2 text-muted-foreground">ערך</th>
                    <th className="pb-2 text-muted-foreground">שינוי 24ש</th>
                  </tr>
                </thead>
                <tbody>
                  {portfolioData.assets.map((asset) => (
                    <tr key={asset.id} className="border-b text-right">
                      <td className="py-4 font-medium">
                        {asset.name} ({asset.symbol})
                      </td>
                      <td className="py-4">{asset.amount}</td>
                      <td className="py-4">{formatCurrency(asset.value)}</td>
                      <td className={`py-4 ${asset.change24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {asset.change24h >= 0 ? '+' : ''}{asset.change24h}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-right">פעילות אחרונה</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-b pb-2">
                <div className="font-medium">קניית BTC</div>
                <div className="text-sm text-muted-foreground">לפני 2 ימים</div>
                <div className="flex justify-between mt-1">
                  <span className="font-medium text-green-600">+0.015 BTC</span>
                  <span>-$1,200</span>
                </div>
              </div>
              
              <div className="border-b pb-2">
                <div className="font-medium">מכירת ETH</div>
                <div className="text-sm text-muted-foreground">לפני 5 ימים</div>
                <div className="flex justify-between mt-1">
                  <span className="font-medium text-red-600">-0.5 ETH</span>
                  <span>+$950</span>
                </div>
              </div>
              
              <div className="border-b pb-2">
                <div className="font-medium">קניית SOL</div>
                <div className="text-sm text-muted-foreground">לפני שבוע</div>
                <div className="flex justify-between mt-1">
                  <span className="font-medium text-green-600">+10 SOL</span>
                  <span>-$870</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-right">הזדמנויות מסחר</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-b pb-2">
                <div className="font-medium">Bitcoin (BTC)</div>
                <div className="text-sm text-muted-foreground">אות הקנייה מאלגוריתם Levi Bot</div>
                <div className="mt-1 flex items-center">
                  <span className="text-green-600 font-medium">קנייה • </span>
                  <span className="text-sm ml-1">חוזק איתות: גבוה</span>
                </div>
              </div>
              
              <div className="border-b pb-2">
                <div className="font-medium">Solana (SOL)</div>
                <div className="text-sm text-muted-foreground">אות הקנייה מאלגוריתם Levi Bot</div>
                <div className="mt-1 flex items-center">
                  <span className="text-green-600 font-medium">קנייה • </span>
                  <span className="text-sm ml-1">חוזק איתות: בינוני</span>
                </div>
              </div>
              
              <div className="border-b pb-2">
                <div className="font-medium">Litecoin (LTC)</div>
                <div className="text-sm text-muted-foreground">אות המכירה מאלגוריתם Levi Bot</div>
                <div className="mt-1 flex items-center">
                  <span className="text-red-600 font-medium">מכירה • </span>
                  <span className="text-sm ml-1">חוזק איתות: גבוה</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
};

export default Portfolio;
