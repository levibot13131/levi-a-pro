
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calculator, Shield, AlertTriangle, TrendingUp } from 'lucide-react';
import { riskManagementEngine } from '@/services/risk/riskManagementEngine';

export const PositionSizeCalculator: React.FC = () => {
  const [accountCapital, setAccountCapital] = useState<number>(10000);
  const [riskPercentage, setRiskPercentage] = useState<number>(1.5);
  const [entryPrice, setEntryPrice] = useState<number>(0);
  const [stopLossPrice, setStopLossPrice] = useState<number>(0);
  const [calculation, setCalculation] = useState<any>(null);

  const calculatePosition = () => {
    if (entryPrice <= 0 || stopLossPrice <= 0) return;

    // Update risk engine with current capital
    riskManagementEngine.updateRiskConfiguration({ 
      accountCapital,
      maxRiskPerTradePercent: riskPercentage 
    });

    // Create mock signal for calculation
    const mockSignal = {
      price: entryPrice,
      stopLoss: stopLossPrice,
      symbol: 'CALCULATION',
      action: entryPrice > stopLossPrice ? 'sell' : 'buy'
    };

    const positionCalc = riskManagementEngine.calculatePositionSize(mockSignal);
    const riskSummary = riskManagementEngine.generateRiskSummaryForSignal(mockSignal);
    
    setCalculation({
      ...positionCalc,
      riskSummary,
      stopLossDistance: Math.abs(entryPrice - stopLossPrice),
      stopLossPercent: (Math.abs(entryPrice - stopLossPrice) / entryPrice) * 100
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            LeviPro Position Size Calculator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="capital">Account Capital ($)</Label>
              <Input
                id="capital"
                type="number"
                value={accountCapital}
                onChange={(e) => setAccountCapital(Number(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="risk">Max Risk Per Trade (%)</Label>
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
              <Label htmlFor="entry">Entry Price ($)</Label>
              <Input
                id="entry"
                type="number"
                value={entryPrice}
                onChange={(e) => setEntryPrice(Number(e.target.value))}
                step={0.01}
              />
            </div>
            <div>
              <Label htmlFor="stopLoss">Stop Loss Price ($)</Label>
              <Input
                id="stopLoss"
                type="number"
                value={stopLossPrice}
                onChange={(e) => setStopLossPrice(Number(e.target.value))}
                step={0.01}
              />
            </div>
          </div>

          <Button onClick={calculatePosition} className="w-full">
            <Calculator className="h-4 w-4 mr-2" />
            Calculate Position Size
          </Button>

          {calculation && (
            <div className="mt-6 space-y-4">
              {/* Position Size Results */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-4 bg-blue-50">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-blue-600" />
                    <span className="font-semibold">Position Size</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-600">
                    ${calculation.recommendedPositionSize.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-600">
                    {calculation.exposurePercent.toFixed(2)}% of capital
                  </p>
                </Card>

                <Card className="p-4 bg-red-50">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-4 w-4 text-red-600" />
                    <span className="font-semibold">Risk Amount</span>
                  </div>
                  <p className="text-2xl font-bold text-red-600">
                    ${calculation.riskAmount.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-600">
                    {calculation.stopLossPercent.toFixed(2)}% SL distance
                  </p>
                </Card>

                <Card className="p-4 bg-green-50">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-4 w-4 text-green-600" />
                    <span className="font-semibold">Risk Status</span>
                  </div>
                  <Badge variant={calculation.withinLimits ? "default" : "destructive"}>
                    {calculation.withinLimits ? 'Within Limits ✅' : 'Risk Exceeded ⚠️'}
                  </Badge>
                  {calculation.riskWarnings.length > 0 && (
                    <div className="mt-2">
                      {calculation.riskWarnings.map((warning: string, index: number) => (
                        <p key={index} className="text-xs text-red-600 flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          {warning}
                        </p>
                      ))}
                    </div>
                  )}
                </Card>
              </div>

              {/* Risk Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Risk Analysis Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="text-xs whitespace-pre-wrap font-mono bg-gray-50 p-3 rounded">
                    {calculation.riskSummary}
                  </pre>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
