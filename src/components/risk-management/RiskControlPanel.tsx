
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { riskManagementEngine } from '@/services/risk/riskManagementEngine';
import { Shield, AlertTriangle, DollarSign, TrendingDown } from 'lucide-react';

export const RiskControlPanel: React.FC = () => {
  const [riskMetrics, setRiskMetrics] = useState(riskManagementEngine.getRiskMetrics());
  const [riskLimits, setRiskLimits] = useState(riskManagementEngine.getRiskLimits());
  const [portfolioValue, setPortfolioValue] = useState(riskMetrics.portfolioValue);

  useEffect(() => {
    const interval = setInterval(() => {
      setRiskMetrics(riskManagementEngine.getRiskMetrics());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleUpdatePortfolio = () => {
    riskManagementEngine.updatePortfolioValue(portfolioValue);
    setRiskMetrics(riskManagementEngine.getRiskMetrics());
  };

  const handleResetDailyRisk = () => {
    riskManagementEngine.resetDailyRisk();
    setRiskMetrics(riskManagementEngine.getRiskMetrics());
  };

  const getRiskColor = (current: number, max: number, isPercent = true) => {
    const ratio = current / max;
    if (ratio >= 0.8) return 'text-red-600';
    if (ratio >= 0.6) return 'text-orange-600';
    if (ratio >= 0.4) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-500" />
            Risk Management Control Panel
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Current Risk Status */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className={`text-2xl font-bold ${getRiskColor(riskMetrics.currentDailyRisk, (riskLimits.maxDailyRisk / 100) * riskMetrics.portfolioValue)}`}>
                  ${riskMetrics.currentDailyRisk.toFixed(0)}
                </div>
                <div className="text-sm text-muted-foreground">Daily Risk Used</div>
                <Progress 
                  value={(riskMetrics.currentDailyRisk / ((riskLimits.maxDailyRisk / 100) * riskMetrics.portfolioValue)) * 100} 
                  className="h-2 mt-2" 
                />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <div className={`text-2xl font-bold ${getRiskColor(riskMetrics.activePositions, riskLimits.maxConcurrentPositions)}`}>
                  {riskMetrics.activePositions}
                </div>
                <div className="text-sm text-muted-foreground">Active Positions</div>
                <Progress 
                  value={(riskMetrics.activePositions / riskLimits.maxConcurrentPositions) * 100} 
                  className="h-2 mt-2" 
                />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <div className={`text-2xl font-bold ${getRiskColor(riskMetrics.currentDrawdown, (riskLimits.maxDrawdown / 100) * riskMetrics.portfolioValue)}`}>
                  ${riskMetrics.currentDrawdown.toFixed(0)}
                </div>
                <div className="text-sm text-muted-foreground">Current Drawdown</div>
                <Progress 
                  value={(riskMetrics.currentDrawdown / ((riskLimits.maxDrawdown / 100) * riskMetrics.portfolioValue)) * 100} 
                  className="h-2 mt-2" 
                />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">
                  ${riskMetrics.portfolioValue.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Portfolio Value</div>
              </CardContent>
            </Card>
          </div>

          {/* Risk Limits */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Risk Limits Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Max Daily Risk (%)</Label>
                  <div className="text-lg font-semibold">{riskLimits.maxDailyRisk}%</div>
                  <div className="text-sm text-muted-foreground">
                    ${((riskLimits.maxDailyRisk / 100) * riskMetrics.portfolioValue).toFixed(0)} limit
                  </div>
                </div>
                
                <div>
                  <Label>Max Position Size (%)</Label>
                  <div className="text-lg font-semibold">{riskLimits.maxPositionSize}%</div>
                  <div className="text-sm text-muted-foreground">
                    ${((riskLimits.maxPositionSize / 100) * riskMetrics.portfolioValue).toFixed(0)} per trade
                  </div>
                </div>
                
                <div>
                  <Label>Max Concurrent Positions</Label>
                  <div className="text-lg font-semibold">{riskLimits.maxConcurrentPositions}</div>
                  <div className="text-sm text-muted-foreground">positions limit</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Portfolio Management */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Portfolio Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Label htmlFor="portfolio-value">Portfolio Value ($)</Label>
                  <Input
                    id="portfolio-value"
                    type="number"
                    value={portfolioValue}
                    onChange={(e) => setPortfolioValue(Number(e.target.value))}
                    placeholder="Enter portfolio value"
                  />
                </div>
                <Button onClick={handleUpdatePortfolio} className="mt-6">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Update
                </Button>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleResetDailyRisk} variant="outline">
                  <TrendingDown className="h-4 w-4 mr-2" />
                  Reset Daily Risk
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Risk Warnings */}
          {(riskMetrics.currentDailyRisk / ((riskLimits.maxDailyRisk / 100) * riskMetrics.portfolioValue)) > 0.8 && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <span className="font-medium text-red-800">High Risk Warning</span>
                </div>
                <p className="text-sm text-red-700 mt-1">
                  Daily risk usage is above 80%. Consider reducing position sizes or pausing new trades.
                </p>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
