
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Calculator, TrendingUp, AlertCircle } from 'lucide-react';

export const PositionSizeCalculator: React.FC = () => {
  const [entryPrice, setEntryPrice] = useState<number>(0);
  const [stopLoss, setStopLoss] = useState<number>(0);
  const [targetPrice, setTargetPrice] = useState<number>(0);
  const [riskPercent, setRiskPercent] = useState<number>(2);
  const [portfolioValue, setPortfolioValue] = useState<number>(100000);
  const [calculation, setCalculation] = useState<any>(null);

  const calculatePosition = () => {
    if (!entryPrice || !stopLoss || !riskPercent || !portfolioValue) return;

    const riskAmount = Math.abs(entryPrice - stopLoss);
    const riskPercentDecimal = riskPercent / 100;
    const portfolioRiskAmount = portfolioValue * riskPercentDecimal;
    
    const positionSize = portfolioRiskAmount / riskAmount;
    const positionValue = positionSize * entryPrice;
    const positionPercent = (positionValue / portfolioValue) * 100;
    
    let rewardAmount = 0;
    let riskRewardRatio = 0;
    
    if (targetPrice) {
      rewardAmount = Math.abs(targetPrice - entryPrice);
      riskRewardRatio = rewardAmount / riskAmount;
    }

    setCalculation({
      positionSize: positionSize,
      positionValue: positionValue,
      positionPercent: positionPercent,
      riskAmount: portfolioRiskAmount,
      rewardAmount: rewardAmount * positionSize,
      riskRewardRatio: riskRewardRatio,
      maxLoss: portfolioRiskAmount,
      potentialProfit: targetPrice ? rewardAmount * positionSize : 0
    });
  };

  const getRiskColor = (percent: number) => {
    if (percent > 5) return 'text-red-600';
    if (percent > 3) return 'text-orange-600';
    if (percent > 1) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-blue-500" />
            Position Size Calculator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Input Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="portfolio-value">Portfolio Value ($)</Label>
              <Input
                id="portfolio-value"
                type="number"
                value={portfolioValue}
                onChange={(e) => setPortfolioValue(Number(e.target.value))}
                placeholder="100000"
              />
            </div>

            <div>
              <Label htmlFor="risk-percent">Risk Per Trade (%)</Label>
              <Input
                id="risk-percent"
                type="number"
                step="0.1"
                value={riskPercent}
                onChange={(e) => setRiskPercent(Number(e.target.value))}
                placeholder="2"
              />
            </div>

            <div>
              <Label htmlFor="entry-price">Entry Price ($)</Label>
              <Input
                id="entry-price"
                type="number"
                step="0.01"
                value={entryPrice}
                onChange={(e) => setEntryPrice(Number(e.target.value))}
                placeholder="50.00"
              />
            </div>

            <div>
              <Label htmlFor="stop-loss">Stop Loss ($)</Label>
              <Input
                id="stop-loss"
                type="number"
                step="0.01"
                value={stopLoss}
                onChange={(e) => setStopLoss(Number(e.target.value))}
                placeholder="48.00"
              />
            </div>

            <div>
              <Label htmlFor="target-price">Target Price ($) - Optional</Label>
              <Input
                id="target-price"
                type="number"
                step="0.01"
                value={targetPrice}
                onChange={(e) => setTargetPrice(Number(e.target.value))}
                placeholder="55.00"
              />
            </div>
          </div>

          <Button onClick={calculatePosition} className="w-full">
            <Calculator className="h-4 w-4 mr-2" />
            Calculate Position Size
          </Button>

          {/* Results */}
          {calculation && (
            <Card className="bg-gray-50">
              <CardHeader>
                <CardTitle className="text-lg">Calculation Results</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {calculation.positionSize.toFixed(2)}
                    </div>
                    <div className="text-sm text-muted-foreground">Shares/Units</div>
                  </div>

                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      ${calculation.positionValue.toFixed(0)}
                    </div>
                    <div className="text-sm text-muted-foreground">Position Value</div>
                  </div>

                  <div className="text-center">
                    <div className={`text-2xl font-bold ${getRiskColor(calculation.positionPercent)}`}>
                      {calculation.positionPercent.toFixed(1)}%
                    </div>
                    <div className="text-sm text-muted-foreground">Portfolio Allocation</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 bg-red-50 rounded-lg">
                    <div className="text-sm text-muted-foreground">Max Loss</div>
                    <div className="text-lg font-bold text-red-600">
                      ${calculation.maxLoss.toFixed(0)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {riskPercent}% of portfolio
                    </div>
                  </div>

                  {targetPrice > 0 && (
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="text-sm text-muted-foreground">Potential Profit</div>
                      <div className="text-lg font-bold text-green-600">
                        ${calculation.potentialProfit.toFixed(0)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        R/R: {calculation.riskRewardRatio.toFixed(2)}:1
                      </div>
                    </div>
                  )}
                </div>

                {/* Risk Warnings */}
                {calculation.positionPercent > 10 && (
                  <div className="flex items-center gap-2 p-3 bg-red-100 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                    <span className="text-sm text-red-800">
                      Warning: Position size exceeds 10% of portfolio. Consider reducing risk.
                    </span>
                  </div>
                )}

                {calculation.riskRewardRatio > 0 && calculation.riskRewardRatio < 1.5 && (
                  <div className="flex items-center gap-2 p-3 bg-yellow-100 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-yellow-600" />
                    <span className="text-sm text-yellow-800">
                      Risk/Reward ratio is below 1.5:1. Consider better target or entry.
                    </span>
                  </div>
                )}

                {calculation.riskRewardRatio >= 2 && (
                  <div className="flex items-center gap-2 p-3 bg-green-100 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    <span className="text-sm text-green-800">
                      Excellent risk/reward ratio of {calculation.riskRewardRatio.toFixed(2)}:1
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
