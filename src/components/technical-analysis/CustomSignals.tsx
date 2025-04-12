
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { TradeSignal } from '@/types/asset';
import { formatPrice } from '@/lib/utils';

export interface CustomSignalsProps {
  assetId: string;
  formatPrice: (price: number) => string;
}

// Extend TradeSignal type with the missing properties in a different file if needed

// Mock signal generation
const generateMockSignals = (assetId: string): TradeSignal[] => {
  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;
  
  return [
    {
      id: '1',
      assetId,
      type: 'buy',
      price: 50000,
      timestamp: now - 2 * day,
      strength: 'strong',
      strategy: 'Breakout',
      timeframe: '1d',
      targetPrice: 55000,
      stopLoss: 48000,
      riskRewardRatio: 2.5,
      createdAt: now - 2 * day,
      // Additional properties used in UI
      symbolName: 'BTC',
      confidence: 85,
      indicator: 'פריצת התנגדות',
      description: 'פריצת התנגדות ארוכת טווח עם נפח גבוה'
    },
    {
      id: '2',
      assetId,
      type: 'sell',
      price: 52000,
      timestamp: now - day,
      strength: 'medium',
      strategy: 'RSI Divergence',
      timeframe: '4h',
      targetPrice: 49000,
      stopLoss: 53000,
      riskRewardRatio: 3.0,
      createdAt: now - day,
      // Additional properties
      symbolName: 'BTC',
      confidence: 70,
      indicator: 'דיברגנס RSI',
      description: 'דיברגנס שלילי ב-RSI וירידה בנפח המסחר'
    },
    {
      id: '3',
      assetId,
      type: 'buy',
      price: 49000,
      timestamp: now - 12 * 60 * 60 * 1000,
      strength: 'weak',
      strategy: 'Support Bounce',
      timeframe: '1h',
      targetPrice: 50500,
      stopLoss: 48500,
      riskRewardRatio: 1.5,
      createdAt: now - 12 * 60 * 60 * 1000,
      // Additional properties
      symbolName: 'BTC',
      confidence: 65,
      indicator: 'התמיכה בממוצע נע',
      description: 'ניתור מרמת תמיכה של ממוצע נע 200'
    }
  ];
};

const CustomSignals: React.FC<CustomSignalsProps> = ({ assetId, formatPrice }) => {
  const [activeTab, setActiveTab] = useState('current');
  const signals = generateMockSignals(assetId);
  
  // Group signals
  const currentSignals = signals.filter(signal => 
    (signal.type === 'buy' && signal.price <= 51000) || 
    (signal.type === 'sell' && signal.price >= 51000)
  );
  const pastSignals = signals.filter(signal => signal.timestamp < Date.now() - 24 * 60 * 60 * 1000);
  
  // Format date
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('he-IL', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-right">איתותי מסחר ספציפיים לנכס</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="current" className="flex-1">איתותים נוכחיים</TabsTrigger>
            <TabsTrigger value="past" className="flex-1">איתותי עבר</TabsTrigger>
          </TabsList>
          
          <TabsContent value="current" className="space-y-4">
            {currentSignals.length === 0 ? (
              <div className="text-center p-6 border rounded-md">
                <Clock className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-muted-foreground">אין איתותים פעילים כרגע</p>
              </div>
            ) : (
              currentSignals.map(signal => (
                <div key={signal.id} className="border rounded-md p-4">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant={signal.type === 'buy' ? 'default' : 'destructive'}>
                      {signal.type === 'buy' ? 'קנייה' : 'מכירה'}
                    </Badge>
                    <div className="text-right">
                      <h3 className="font-medium">{signal.symbolName} / {signal.strategy}</h3>
                      <p className="text-sm text-muted-foreground">{formatDate(signal.timestamp)}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">מחיר כניסה</p>
                      <p className="font-medium">{formatPrice(signal.price)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">ביטחון</p>
                      <p className="font-medium">{signal.confidence}%</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">סטופ לוס</p>
                      <p className="font-medium">{formatPrice(signal.stopLoss || 0)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">יעד מחיר</p>
                      <p className="font-medium">{formatPrice(signal.targetPrice || 0)}</p>
                    </div>
                  </div>
                  
                  <div className="text-right mb-2">
                    <p className="text-sm font-medium">אינדיקטור: {signal.indicator}</p>
                    <p className="text-sm text-muted-foreground">{signal.description}</p>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button variant="outline" size="sm">הוסף ליומן המסחר</Button>
                  </div>
                </div>
              ))
            )}
          </TabsContent>
          
          <TabsContent value="past" className="space-y-4">
            {pastSignals.length === 0 ? (
              <div className="text-center p-6 border rounded-md">
                <AlertCircle className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-muted-foreground">אין היסטוריית איתותים לנכס זה</p>
              </div>
            ) : (
              pastSignals.map(signal => (
                <div key={signal.id} className="border rounded-md p-4">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline">
                      {signal.type === 'buy' ? 'קנייה' : 'מכירה'}
                    </Badge>
                    <div className="text-right">
                      <h3 className="font-medium">{signal.symbolName} / {signal.strategy}</h3>
                      <p className="text-sm text-muted-foreground">{formatDate(signal.timestamp)}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">מחיר כניסה</p>
                      <p className="font-medium">{formatPrice(signal.price)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">תוצאה</p>
                      <p className="font-medium flex items-center">
                        <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                        הצלחה
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CustomSignals;
