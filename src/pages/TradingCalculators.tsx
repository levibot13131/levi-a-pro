
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, Calculator, DollarSign, Target, Shield, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

const TradingCalculators: React.FC = () => {
  // Position Size Calculator State
  const [positionCalc, setPositionCalc] = useState({
    accountSize: 10000,
    riskPercent: 2,
    entryPrice: 0,
    stopLoss: 0,
    positionSize: 0,
    riskAmount: 0
  });

  // Risk/Reward Calculator State
  const [rrCalc, setRRCalc] = useState({
    entryPrice: 0,
    stopLoss: 0,
    takeProfit: 0,
    riskAmount: 0,
    rewardAmount: 0,
    ratio: 0
  });

  // Leverage Calculator State
  const [leverageCalc, setLeverageCalc] = useState({
    accountBalance: 1000,
    positionSize: 10000,
    leverage: 1,
    margin: 0,
    liquidationPrice: 0
  });

  // Daily Loss Calculator State
  const [lossCalc, setLossCalc] = useState({
    dailyStartBalance: 10000,
    currentBalance: 10000,
    maxDailyLoss: 5,
    currentLoss: 0,
    remainingRisk: 0,
    stopTrading: false
  });

  const calculatePositionSize = () => {
    const riskAmount = (positionCalc.accountSize * positionCalc.riskPercent) / 100;
    const priceDistance = Math.abs(positionCalc.entryPrice - positionCalc.stopLoss);
    
    if (priceDistance === 0) {
      toast.error('מחיר כניסה וסטופ לוס לא יכולים להיות זהים');
      return;
    }
    
    const positionSize = riskAmount / priceDistance;
    
    setPositionCalc(prev => ({
      ...prev,
      positionSize: Number(positionSize.toFixed(8)),
      riskAmount: Number(riskAmount.toFixed(2))
    }));
    
    toast.success('גודל פוזיציה חושב בהצלחה');
  };

  const calculateRiskReward = () => {
    const risk = Math.abs(rrCalc.entryPrice - rrCalc.stopLoss);
    const reward = Math.abs(rrCalc.takeProfit - rrCalc.entryPrice);
    
    if (risk === 0) {
      toast.error('סיכון לא יכול להיות אפס');
      return;
    }
    
    const ratio = reward / risk;
    
    setRRCalc(prev => ({
      ...prev,
      riskAmount: Number(risk.toFixed(2)),
      rewardAmount: Number(reward.toFixed(2)),
      ratio: Number(ratio.toFixed(2))
    }));
    
    if (ratio < 1.5) {
      toast.warning('יחס R/R נמוך מ-1.5 - שקול להתאים את היעדים');
    } else {
      toast.success(`יחס R/R מצוין: 1:${ratio.toFixed(2)}`);
    }
  };

  const calculateLeverage = () => {
    const leverage = leverageCalc.positionSize / leverageCalc.accountBalance;
    const margin = leverageCalc.positionSize / leverage;
    
    // Simplified liquidation price calculation (assumes 100% margin requirement)
    const liquidationPrice = leverageCalc.positionSize > leverageCalc.accountBalance 
      ? leverageCalc.accountBalance * 0.8 
      : 0;
    
    setLeverageCalc(prev => ({
      ...prev,
      leverage: Number(leverage.toFixed(2)),
      margin: Number(margin.toFixed(2)),
      liquidationPrice: Number(liquidationPrice.toFixed(2))
    }));
    
    if (leverage > 10) {
      toast.error('⚠️ מינוף גבוה מאוד - סיכון ליקווידציה גבוה!');
    } else if (leverage > 5) {
      toast.warning('⚠️ מינוף גבוה - נהל בזהירות');
    } else {
      toast.success('רמת מינוף סבירה');
    }
  };

  const calculateDailyLoss = () => {
    const currentLoss = ((lossCalc.dailyStartBalance - lossCalc.currentBalance) / lossCalc.dailyStartBalance) * 100;
    const remainingRisk = lossCalc.maxDailyLoss - currentLoss;
    const stopTrading = currentLoss >= lossCalc.maxDailyLoss;
    
    setLossCalc(prev => ({
      ...prev,
      currentLoss: Number(currentLoss.toFixed(2)),
      remainingRisk: Number(remainingRisk.toFixed(2)),
      stopTrading
    }));
    
    if (stopTrading) {
      toast.error('🛑 הגעת למגבלת ההפסד היומית - הפסק מסחר');
    } else if (remainingRisk < 1) {
      toast.warning('⚠️ קרוב למגבלת ההפסד היומית');
    } else {
      toast.success('רמת סיכון יומית תקינה');
    }
  };

  return (
    <div className="container mx-auto py-6 px-4 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">מחשבוני מסחר</h1>
        <p className="text-muted-foreground">
          כלים מתקדמים לחישוב סיכון, גודל פוזיציה ונהול קפיטל
        </p>
      </div>

      <Tabs defaultValue="position" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="position">גודל פוזיציה</TabsTrigger>
          <TabsTrigger value="riskreward">R/R</TabsTrigger>
          <TabsTrigger value="leverage">מינוף</TabsTrigger>
          <TabsTrigger value="dailyloss">הפסד יומי</TabsTrigger>
        </TabsList>

        {/* Position Size Calculator */}
        <TabsContent value="position">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                מחשבון גודל פוזיציה
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="accountSize">גודל חשבון ($)</Label>
                  <Input
                    id="accountSize"
                    type="number"
                    value={positionCalc.accountSize}
                    onChange={(e) => setPositionCalc(prev => ({
                      ...prev,
                      accountSize: Number(e.target.value)
                    }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="riskPercent">אחוז סיכון (%)</Label>
                  <Input
                    id="riskPercent"
                    type="number"
                    step="0.1"
                    value={positionCalc.riskPercent}
                    onChange={(e) => setPositionCalc(prev => ({
                      ...prev,
                      riskPercent: Number(e.target.value)
                    }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="entryPrice">מחיר כניסה</Label>
                  <Input
                    id="entryPrice"
                    type="number"
                    step="0.01"
                    value={positionCalc.entryPrice}
                    onChange={(e) => setPositionCalc(prev => ({
                      ...prev,
                      entryPrice: Number(e.target.value)
                    }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="stopLoss">סטופ לוס</Label>
                  <Input
                    id="stopLoss"
                    type="number"
                    step="0.01"
                    value={positionCalc.stopLoss}
                    onChange={(e) => setPositionCalc(prev => ({
                      ...prev,
                      stopLoss: Number(e.target.value)
                    }))}
                  />
                </div>
              </div>
              
              <Button onClick={calculatePositionSize} className="w-full">
                חשב גודל פוזיציה
              </Button>
              
              {positionCalc.positionSize > 0 && (
                <div className="bg-muted p-4 rounded-lg space-y-2">
                  <h3 className="font-semibold">תוצאות:</h3>
                  <p><strong>גודל פוזיציה:</strong> {positionCalc.positionSize.toLocaleString()} יחידות</p>
                  <p><strong>סכום סיכון:</strong> ${positionCalc.riskAmount.toLocaleString()}</p>
                  <p><strong>מרחק לסטופ:</strong> {Math.abs(positionCalc.entryPrice - positionCalc.stopLoss).toFixed(2)}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Risk/Reward Calculator */}
        <TabsContent value="riskreward">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                מחשבון יחס סיכון/רווח (R/R)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rrEntryPrice">מחיר כניסה</Label>
                  <Input
                    id="rrEntryPrice"
                    type="number"
                    step="0.01"
                    value={rrCalc.entryPrice}
                    onChange={(e) => setRRCalc(prev => ({
                      ...prev,
                      entryPrice: Number(e.target.value)
                    }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="rrStopLoss">סטופ לוס</Label>
                  <Input
                    id="rrStopLoss"
                    type="number"
                    step="0.01"
                    value={rrCalc.stopLoss}
                    onChange={(e) => setRRCalc(prev => ({
                      ...prev,
                      stopLoss: Number(e.target.value)
                    }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="takeProfit">טייק פרופיט</Label>
                  <Input
                    id="takeProfit"
                    type="number"
                    step="0.01"
                    value={rrCalc.takeProfit}
                    onChange={(e) => setRRCalc(prev => ({
                      ...prev,
                      takeProfit: Number(e.target.value)
                    }))}
                  />
                </div>
              </div>
              
              <Button onClick={calculateRiskReward} className="w-full">
                חשב יחס R/R
              </Button>
              
              {rrCalc.ratio > 0 && (
                <div className={`p-4 rounded-lg space-y-2 ${
                  rrCalc.ratio >= 2 ? 'bg-green-100' : 
                  rrCalc.ratio >= 1.5 ? 'bg-yellow-100' : 'bg-red-100'
                }`}>
                  <h3 className="font-semibold">תוצאות:</h3>
                  <p><strong>סיכון:</strong> {rrCalc.riskAmount.toFixed(2)} נקודות</p>
                  <p><strong>רווח פוטנציאלי:</strong> {rrCalc.rewardAmount.toFixed(2)} נקודות</p>
                  <p><strong>יחס R/R:</strong> 1:{rrCalc.ratio}</p>
                  <p className="text-sm">
                    {rrCalc.ratio >= 2 ? '✅ יחס מצוין' : 
                     rrCalc.ratio >= 1.5 ? '⚠️ יחס סביר' : '❌ יחס נמוך'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Leverage Calculator */}
        <TabsContent value="leverage">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                מחשבון מינוף ומרווח
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="accountBalance">יתרת חשבון ($)</Label>
                  <Input
                    id="accountBalance"
                    type="number"
                    value={leverageCalc.accountBalance}
                    onChange={(e) => setLeverageCalc(prev => ({
                      ...prev,
                      accountBalance: Number(e.target.value)
                    }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="positionSize">גודל פוזיציה ($)</Label>
                  <Input
                    id="positionSize"
                    type="number"
                    value={leverageCalc.positionSize}
                    onChange={(e) => setLeverageCalc(prev => ({
                      ...prev,
                      positionSize: Number(e.target.value)
                    }))}
                  />
                </div>
              </div>
              
              <Button onClick={calculateLeverage} className="w-full">
                חשב מינוף
              </Button>
              
              {leverageCalc.leverage > 0 && (
                <div className={`p-4 rounded-lg space-y-2 ${
                  leverageCalc.leverage > 10 ? 'bg-red-100' :
                  leverageCalc.leverage > 5 ? 'bg-yellow-100' : 'bg-green-100'
                }`}>
                  <h3 className="font-semibold">תוצאות:</h3>
                  <p><strong>מינוף:</strong> {leverageCalc.leverage}:1</p>
                  <p><strong>מרווח נדרש:</strong> ${leverageCalc.margin.toLocaleString()}</p>
                  <p><strong>רמת סיכון:</strong> {
                    leverageCalc.leverage > 10 ? '🔴 גבוה מאוד' :
                    leverageCalc.leverage > 5 ? '🟡 בינוני' : '🟢 נמוך'
                  }</p>
                  {leverageCalc.leverage > 5 && (
                    <div className="flex items-center gap-2 text-sm text-orange-600">
                      <AlertTriangle className="h-4 w-4" />
                      זהירות: מינוף גבוה מגדיל את הסיכון לליקווידציה
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Daily Loss Calculator */}
        <TabsContent value="dailyloss">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                מחשבון הפסד יומי
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dailyStartBalance">יתרה בתחילת היום ($)</Label>
                  <Input
                    id="dailyStartBalance"
                    type="number"
                    value={lossCalc.dailyStartBalance}
                    onChange={(e) => setLossCalc(prev => ({
                      ...prev,
                      dailyStartBalance: Number(e.target.value)
                    }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="currentBalance">יתרה נוכחית ($)</Label>
                  <Input
                    id="currentBalance"
                    type="number"
                    value={lossCalc.currentBalance}
                    onChange={(e) => setLossCalc(prev => ({
                      ...prev,
                      currentBalance: Number(e.target.value)
                    }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="maxDailyLoss">מגבלת הפסד יומי (%)</Label>
                  <Input
                    id="maxDailyLoss"
                    type="number"
                    step="0.1"
                    value={lossCalc.maxDailyLoss}
                    onChange={(e) => setLossCalc(prev => ({
                      ...prev,
                      maxDailyLoss: Number(e.target.value)
                    }))}
                  />
                </div>
              </div>
              
              <Button onClick={calculateDailyLoss} className="w-full">
                בדוק סטטוס הפסד יומי
              </Button>
              
              {lossCalc.currentLoss !== 0 && (
                <div className={`p-4 rounded-lg space-y-2 ${
                  lossCalc.stopTrading ? 'bg-red-100' :
                  lossCalc.remainingRisk < 1 ? 'bg-yellow-100' : 'bg-green-100'
                }`}>
                  <h3 className="font-semibold">מצב נוכחי:</h3>
                  <p><strong>הפסד יומי:</strong> {lossCalc.currentLoss.toFixed(2)}%</p>
                  <p><strong>יתרת סיכון:</strong> {lossCalc.remainingRisk.toFixed(2)}%</p>
                  <p><strong>סטטוס:</strong> {
                    lossCalc.stopTrading ? '🛑 הפסק מסחר' :
                    lossCalc.remainingRisk < 1 ? '⚠️ זהירות' : '✅ תקין'
                  }</p>
                  
                  {lossCalc.stopTrading && (
                    <div className="bg-red-200 p-2 rounded text-sm">
                      <strong>הגעת למגבלת ההפסד היומית!</strong><br/>
                      מומלץ להפסיק את המסחר להיום ולחזור מחר עם ראש צלול.
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TradingCalculators;
