
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Settings, Shield, AlertTriangle, Play, Pause } from 'lucide-react';
import { riskManagementEngine } from '@/services/risk/riskManagementEngine';
import { toast } from 'sonner';

export const RiskControlPanel: React.FC = () => {
  const [config, setConfig] = useState(riskManagementEngine.getRiskConfiguration());
  const [exposure, setExposure] = useState(riskManagementEngine.getCurrentExposure());
  const [dailyStats, setDailyStats] = useState(riskManagementEngine.getDailyStats());

  useEffect(() => {
    const interval = setInterval(() => {
      setExposure(riskManagementEngine.getCurrentExposure());
      setDailyStats(riskManagementEngine.getDailyStats());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleConfigUpdate = (field: string, value: any) => {
    const newConfig = { ...config, [field]: value };
    setConfig(newConfig);
    riskManagementEngine.updateRiskConfiguration({ [field]: value });
    toast.success(`Risk setting updated: ${field}`);
  };

  const handleEmergencyPause = () => {
    if (config.emergencyPause) {
      riskManagementEngine.resetEmergencyPause();
      setConfig({ ...config, emergencyPause: false });
      toast.success('Emergency pause lifted');
    } else {
      handleConfigUpdate('emergencyPause', true);
      toast.warning('Emergency pause activated');
    }
  };

  return (
    <div className="space-y-6">
      {/* Risk Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Risk Management Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="accountCapital">Account Capital ($)</Label>
              <Input
                id="accountCapital"
                type="number"
                value={config.accountCapital}
                onChange={(e) => handleConfigUpdate('accountCapital', Number(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="maxDailyLoss">Max Daily Loss (%)</Label>
              <Input
                id="maxDailyLoss"
                type="number"
                value={config.maxDailyLossPercent}
                onChange={(e) => handleConfigUpdate('maxDailyLossPercent', Number(e.target.value))}
                max={10}
                min={1}
                step={0.5}
              />
            </div>
            <div>
              <Label htmlFor="maxRiskPerTrade">Max Risk Per Trade (%)</Label>
              <Input
                id="maxRiskPerTrade"
                type="number"
                value={config.maxRiskPerTradePercent}
                onChange={(e) => handleConfigUpdate('maxRiskPerTradePercent', Number(e.target.value))}
                max={5}
                min={0.5}
                step={0.1}
              />
            </div>
            <div>
              <Label htmlFor="maxPositions">Max Simultaneous Positions</Label>
              <Input
                id="maxPositions"
                type="number"
                value={config.maxSimultaneousPositions}
                onChange={(e) => handleConfigUpdate('maxSimultaneousPositions', Number(e.target.value))}
                max={20}
                min={1}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Switch
                id="enableRiskFiltering"
                checked={config.enableRiskFiltering}
                onCheckedChange={(checked) => handleConfigUpdate('enableRiskFiltering', checked)}
              />
              <Label htmlFor="enableRiskFiltering">Enable Risk Filtering</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Exposure Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Current Risk Exposure
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {dailyStats.dailyLoss.toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground">Daily Loss</div>
              <div className="text-xs text-gray-500">
                Limit: {config.maxDailyLossPercent}%
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {dailyStats.activePositions}
              </div>
              <div className="text-sm text-muted-foreground">Active Positions</div>
              <div className="text-xs text-gray-500">
                Limit: {config.maxSimultaneousPositions}
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {dailyStats.dailyTrades}
              </div>
              <div className="text-sm text-muted-foreground">Daily Trades</div>
            </div>
            
            <div className="text-center">
              <Badge variant={dailyStats.isWithinLimits ? "default" : "destructive"}>
                {dailyStats.isWithinLimits ? 'Within Limits' : 'Exceeded'}
              </Badge>
              <div className="text-sm text-muted-foreground">Status</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Emergency Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Emergency Controls
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold">Emergency Pause</h4>
              <p className="text-sm text-muted-foreground">
                Immediately stop all signal generation and trading
              </p>
            </div>
            <Button
              onClick={handleEmergencyPause}
              variant={config.emergencyPause ? "default" : "destructive"}
              className="flex items-center gap-2"
            >
              {config.emergencyPause ? (
                <>
                  <Play className="h-4 w-4" />
                  Resume Trading
                </>
              ) : (
                <>
                  <Pause className="h-4 w-4" />
                  Emergency Pause
                </>
              )}
            </Button>
          </div>
          
          {config.emergencyPause && (
            <div className="mt-4 p-3 bg-red-50 rounded border border-red-200">
              <p className="text-sm text-red-800">
                🚨 Emergency pause is active. All signal generation is suspended.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
