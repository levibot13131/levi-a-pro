
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calculator, TrendingUp, AlertTriangle, DollarSign } from 'lucide-react';

const TradingCalculators: React.FC = () => {
  // Position Size Calculator State
  const [accountBalance, setAccountBalance] = useState<number>(10000);
  const [riskPercent, setRiskPercent] = useState<number>(2);
  const [entryPrice, setEntryPrice] = useState<number>(50000);
  const [stopLoss, setStopLoss] = useState<number>(48000);

  // Risk/Reward Calculator State
  const [rrEntryPrice, setRrEntryPrice] = useState<number>(50000);
  const [rrStopLoss, setRrStopLoss] = useState<number>(48000);
  const [rrTakeProfit, setRrTakeProfit] = useState<number>(56000);

  // Leverage Calculator State
  const [leverageBalance, setLeverageBalance] = useState<number>(1000);
  const [leverageAmount, setLeverageAmount] = useState<number>(5);
  const [leveragePrice, setLeveragePrice] = useState<number>(50000);

  // Daily Loss Tracker State
  const [dailyLossLimit, setDailyLossLimit] = useState<number>(5);
  const [currentLoss, setCurrentLoss] = useState<number>(2.3);

  // Position Size Calculation
  const calculatePositionSize = () => {
    const riskAmount = accountBalance * (riskPercent / 100);
    const priceRisk = Math.abs(entryPrice - stopLoss);
    const positionSize = riskAmount / priceRisk;
    return {
      riskAmount,
      priceRisk,
      positionSize: positionSize.toFixed(6),
      positionValue: (positionSize * entryPrice).toFixed(2)
    };
  };

  // Risk/Reward Calculation
  const calculateRiskReward = () => {
    const risk = Math.abs(rrEntryPrice - rrStopLoss);
    const reward = Math.abs(rrTakeProfit - rrEntryPrice);
    const ratio = reward / risk;
    const riskPercent = (risk / rrEntryPrice) * 100;
    const rewardPercent = (reward / rrEntryPrice) * 100;
    
    return {
      risk: risk.toFixed(2),
      reward: reward.toFixed(2),
      ratio: ratio.toFixed(2),
      riskPercent: riskPercent.toFixed(2),
      rewardPercent: rewardPercent.toFixed (2)
    };
  };

  // Leverage Impact Calculation
  const calculateLeverageImpact = () => {
    const totalExposure = leverageBalance * leverageAmount;
    const liquidationBuffer = totalExposure * 0.05; // 5% buffer
    const liquidationPrice = leveragePrice * (1 - (1 / leverageAmount) + 0.05);
    
    return {
      totalExposure: totalExposure.toFixed(2),
      liquidationPrice: liquidationPrice.toFixed(2),
      liquidationBuffer: liquidationBuffer.toFixed(2),
      marginUsed: leverageBalance.toFixed(2)
    };
  };

  const positionData = calculatePositionSize();
  const rrData = calculateRiskReward();
  const leverageData = calculateLeverageImpact();

  return (
    <div className="container mx-auto py-6 px-4 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">מחשבוני מסחר</h1>
          <p className="text-muted-foreground">
            כלים מתקדמים לחישוב סיכון, גודל פוזיציה ומינוף
          </p>
        </div>
        <Calculator className="h-12 w-12 text-primary" />
      </div>

      <Tabs defaultValue="position-size" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="position-size">גודל פוזיציה</TabsTrigger>
          <TabsTrigger value="risk-reward">סיכון/רווח</TabsTrigger>
          <TabsTrigger value="leverage">מינוף</TabsTrigger>
          <TabsTrigger value="daily-loss">מעקב הפסדים</TabsTrigger>
        </TabsList>

        <TabsContent value="position-size" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                מחשבון גודל פוזיציה
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="balance">יתרת חשבון ($)</Label>
                  <Input
                    id="balance"
                    type="number"
                    value={accountBalance}
                    onChange={(e) => setAccountBalance(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="risk">אחוז סיכון (%)</Label>
                  <Input
                    id="risk"
                    type="number"
                    step="0.1"
                    value={riskPercent}
                    onChange={(e) => setRiskPercent(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="entry">מחיר כניסה ($)</Label>
                  <Input
                    id="entry"
                    type="number"
                    value={entryPrice}
                    onChange={(e) => setEntryPrice(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sl">סטופ לוס ($)</Label>
                  <Input
                    id="sl"
                    type="number"
                    value={stopLoss}
                    onChange={(e) => setStopLoss(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="mt-6 p-4 bg-muted rounded-lg">
                <h3 className="font-semibold mb-3">תוצאות החישוב:</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">סכום סיכון</p>
                    <p className="text-lg font-bold">${positionData.riskAmount.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">גודל פוזיציה</p>
                    <p className="text-lg font-bold">{positionData.positionSize}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">סיכון מחיר</p>
                    <p className="text-lg font-bold">${positionData.priceRisk.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">ערך פוזיציה</p>
                    <p className="text-lg font-bold">${positionData.positionValue}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risk-reward" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                מחשבון סיכון/רווח
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rr-entry">מחיר כניסה ($)</Label>
                  <Input
                    id="rr-entry"
                    type="number"
                    value={rrEntryPrice}
                    onChange={(e) => setRrEntryPrice(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rr-sl">סטופ לוס ($)</Label>
                  <Input
                    id="rr-sl"
                    type="number"
                    value={rrStopLoss}
                    onChange={(e) => setRrStopLoss(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rr-tp">טייק פרופיט ($)</Label>
                  <Input
                    id="rr-tp"
                    type="number"
                    value={rrTakeProfit}
                    onChange={(e) => setRrTakeProfit(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="mt-6 p-4 bg-muted rounded-lg">
                <h3 className="font-semibold mb-3">יחס סיכון/רווח:</h3>
                <div className="flex items-center justify-center mb-4">
                  <Badge 
                    variant={Number(rrData.ratio) >= 2 ? "default" : "destructive"}
                    className="text-2xl py-2 px-4"
                  >
                    1:{rrData.ratio}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">סיכון</p>
                    <p className="text-lg font-bold text-red-600">${rrData.risk} ({rrData.riskPercent}%)</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">רווח</p>
                    <p className="text-lg font-bold text-green-600">${rrData.reward} ({rrData.rewardPercent}%)</p>
                  </div>
                </div>
                {Number(rrData.ratio) < 2 && (
                  <div className="mt-3 flex items-center gap-2 text-amber-600">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="text-sm">יחס נמוך - מומלץ מעל 1:2</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leverage" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                מחשבון מינוף
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="lev-balance">הון זמין ($)</Label>
                  <Input
                    id="lev-balance"
                    type="number"
                    value={leverageBalance}
                    onChange={(e) => setLeverageBalance(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lev-amount">מינוף (X)</Label>
                  <Input
                    id="lev-amount"
                    type="number"
                    value={leverageAmount}
                    onChange={(e) => setLeverageAmount(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lev-price">מחיר נוכחי ($)</Label>
                  <Input
                    id="lev-price"
                    type="number"
                    value={leveragePrice}
                    onChange={(e) => setLeveragePrice(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="mt-6 p-4 bg-muted rounded-lg">
                <h3 className="font-semibold mb-3">השפעת המינוף:</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">חשיפה כוללת</p>
                    <p className="text-lg font-bold">${leverageData.totalExposure}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">מחיר חיסול</p>
                    <p className="text-lg font-bold text-red-600">${leverageData.liquidationPrice}</p>
                  </div>
                </div>
                {leverageAmount > 3 && (
                  <div className="mt-3 flex items-center gap-2 text-red-600">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="text-sm">מינוף גבוה - סיכון חיסול מוגבר</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="daily-loss" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                מעקב הפסדים יומי
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="loss-limit">מגבלת הפסד יומי (%)</Label>
                  <Input
                    id="loss-limit"
                    type="number"
                    step="0.1"
                    value={dailyLossLimit}
                    onChange={(e) => setDailyLossLimit(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="current-loss">הפסד נוכחי (%)</Label>
                  <Input
                    id="current-loss"
                    type="number"
                    step="0.1"
                    value={currentLoss}
                    onChange={(e) => setCurrentLoss(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">התקדמות הפסד יומי</span>
                  <span className="text-sm text-muted-foreground">
                    {currentLoss.toFixed(1)}% מתוך {dailyLossLimit}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full transition-all ${
                      currentLoss >= dailyLossLimit ? 'bg-red-500' : 
                      currentLoss >= dailyLossLimit * 0.8 ? 'bg-amber-500' : 
                      'bg-green-500'
                    }`}
                    style={{ width: `${Math.min((currentLoss / dailyLossLimit) * 100, 100)}%` }}
                  />
                </div>
                <div className="mt-3 text-center">
                  {currentLoss >= dailyLossLimit ? (
                    <Badge variant="destructive">הגעת למגבלת ההפסד היומי</Badge>
                  ) : currentLoss >= dailyLossLimit * 0.8 ? (
                    <Badge variant="default" className="bg-amber-500">התקרבת למגבלת ההפסד</Badge>
                  ) : (
                    <Badge variant="default" className="bg-green-600">במצב בטוח</Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TradingCalculators;
