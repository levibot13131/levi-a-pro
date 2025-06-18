
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calculator, TrendingUp, Shield } from 'lucide-react';

interface PositionCalculation {
  positionSize: number;
  dollarAmount: number;
  stopLossPrice: number;
  takeProfitPrice: number;
  riskRewardRatio: number;
  maxLossAmount: number;
}

export const PositionSizeCalculator = () => {
  const [accountBalance, setAccountBalance] = useState<number>(10000);
  const [riskPercentage, setRiskPercentage] = useState<number>(2);
  const [entryPrice, setEntryPrice] = useState<number>(0);
  const [stopLossDistance, setStopLossDistance] = useState<number>(3);
  const [takeProfitDistance, setTakeProfitDistance] = useState<number>(6);
  const [leverage, setLeverage] = useState<number>(1);
  const [calculation, setCalculation] = useState<PositionCalculation | null>(null);

  const calculatePosition = () => {
    if (entryPrice <= 0 || stopLossDistance <= 0) return;

    const riskAmount = (accountBalance * riskPercentage) / 100;
    const stopLossPrice = entryPrice * (1 - stopLossDistance / 100);
    const takeProfitPrice = entryPrice * (1 + takeProfitDistance / 100);
    const priceRisk = entryPrice - stopLossPrice;
    
    // Position size calculation with leverage
    const positionSize = (riskAmount / priceRisk) * leverage;
    const dollarAmount = positionSize * entryPrice;
    const riskRewardRatio = takeProfitDistance / stopLossDistance;
    const maxLossAmount = riskAmount;

    setCalculation({
      positionSize,
      dollarAmount,
      stopLossPrice,
      takeProfitPrice,
      riskRewardRatio,
      maxLossAmount
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          מחשבון גודל פוזיציה - השיטה האישית
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="balance">יתרת חשבון ($)</Label>
            <Input
              id="balance"
              type="number"
              value={accountBalance}
              onChange={(e) => setAccountBalance(Number(e.target.value))}
            />
          </div>
          <div>
            <Label htmlFor="risk">אחוז סיכון (%)</Label>
            <Input
              id="risk"
              type="number"
              value={riskPercentage}
              onChange={(e) => setRiskPercentage(Number(e.target.value))}
              max={5}
              min={0.5}
              step={0.1}
            />
          </div>
          <div>
            <Label htmlFor="entry">מחיר כניסה ($)</Label>
            <Input
              id="entry"
              type="number"
              value={entryPrice}
              onChange={(e) => setEntryPrice(Number(e.target.value))}
              step={0.01}
            />
          </div>
          <div>
            <Label htmlFor="leverage">מינוף</Label>
            <Input
              id="leverage"
              type="number"
              value={leverage}
              onChange={(e) => setLeverage(Number(e.target.value))}
              min={1}
              max={10}
            />
          </div>
          <div>
            <Label htmlFor="stopLoss">סטופ לוס (%)</Label>
            <Input
              id="stopLoss"
              type="number"
              value={stopLossDistance}
              onChange={(e) => setStopLossDistance(Number(e.target.value))}
              min={0.5}
              max={10}
              step={0.1}
            />
          </div>
          <div>
            <Label htmlFor="takeProfit">טייק פרופיט (%)</Label>
            <Input
              id="takeProfit"
              type="number"
              value={takeProfitDistance}
              onChange={(e) => setTakeProfitDistance(Number(e.target.value))}
              min={1}
              max={20}
              step={0.1}
            />
          </div>
        </div>

        <Button onClick={calculatePosition} className="w-full">
          חשב פוזיציה
        </Button>

        {calculation && (
          <div className="mt-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4 bg-green-50">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="font-semibold">גודל פוזיציה</span>
                </div>
                <p className="text-2xl font-bold text-green-600">
                  {calculation.positionSize.toFixed(4)} יחידות
                </p>
                <p className="text-sm text-gray-600">
                  ${calculation.dollarAmount.toFixed(2)}
                </p>
              </Card>

              <Card className="p-4 bg-red-50">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-4 w-4 text-red-600" />
                  <span className="font-semibold">סיכון מקסימלי</span>
                </div>
                <p className="text-2xl font-bold text-red-600">
                  ${calculation.maxLossAmount.toFixed(2)}
                </p>
                <p className="text-sm text-gray-600">
                  סטופ לוס: ${calculation.stopLossPrice.toFixed(2)}
                </p>
              </Card>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>טייק פרופיט</Label>
                <p className="text-lg font-semibold text-green-600">
                  ${calculation.takeProfitPrice.toFixed(2)}
                </p>
              </div>
              <div>
                <Label>יחס סיכון/רווח</Label>
                <p className="text-lg font-semibold">
                  1:{calculation.riskRewardRatio.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
