
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Settings, TrendingUp, Target, BarChart3 } from 'lucide-react';
import { strategyEngine } from '@/services/trading/strategyEngine';
import { TradingStrategy, PersonalTradingStrategy } from '@/types/trading';

const StrategyManager = () => {
  const [strategies, setStrategies] = useState<TradingStrategy[]>([]);
  const [personalStrategy, setPersonalStrategy] = useState<PersonalTradingStrategy | null>(null);

  useEffect(() => {
    loadStrategies();
  }, []);

  const loadStrategies = () => {
    const allStrategies = strategyEngine.getActiveStrategies();
    setStrategies(allStrategies);
    
    const personal = allStrategies.find(s => s.type === 'personal') as PersonalTradingStrategy;
    if (personal) {
      setPersonalStrategy(personal);
    }
  };

  const updatePersonalStrategy = (updates: Partial<PersonalTradingStrategy['parameters']>) => {
    if (!personalStrategy) return;

    const updatedStrategy: PersonalTradingStrategy = {
      ...personalStrategy,
      parameters: {
        ...personalStrategy.parameters,
        ...updates
      },
      updatedAt: Date.now()
    };

    strategyEngine.updateStrategy(updatedStrategy);
    setPersonalStrategy(updatedStrategy);
    toast.success('האסטרטגיה האישית עודכנה');
  };

  const toggleStrategy = (strategyId: string, isActive: boolean) => {
    const strategy = strategies.find(s => s.id === strategyId);
    if (!strategy) return;

    const updatedStrategy = {
      ...strategy,
      isActive,
      updatedAt: Date.now()
    };

    strategyEngine.updateStrategy(updatedStrategy);
    loadStrategies();
    
    toast.success(`אסטרטגיה ${strategy.name} ${isActive ? 'הופעלה' : 'הושבתה'}`);
  };

  const getStrategyStatusColor = (strategy: TradingStrategy) => {
    if (!strategy.isActive) return 'text-gray-500';
    if (strategy.successRate > 0.7) return 'text-green-600';
    if (strategy.successRate > 0.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getWeightColor = (weight: number) => {
    if (weight > 0.8) return 'bg-green-500';
    if (weight > 0.6) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      {/* Personal Strategy Configuration */}
      {personalStrategy && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              האסטרטגיה האישית שלי
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>סף RSI ({personalStrategy.parameters.rsiThreshold})</Label>
                  <Slider
                    value={[personalStrategy.parameters.rsiThreshold]}
                    onValueChange={([value]) => updatePersonalStrategy({ rsiThreshold: value })}
                    max={100}
                    min={0}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label>יעד רווח ({personalStrategy.parameters.profitTargetPercent}%)</Label>
                  <Slider
                    value={[personalStrategy.parameters.profitTargetPercent]}
                    onValueChange={([value]) => updatePersonalStrategy({ profitTargetPercent: value })}
                    max={10}
                    min={0.5}
                    step={0.1}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label>סטופ לוס ({personalStrategy.parameters.stopLossPercent}%)</Label>
                  <Slider
                    value={[personalStrategy.parameters.stopLossPercent]}
                    onValueChange={([value]) => updatePersonalStrategy({ stopLossPercent: value })}
                    max={5}
                    min={0.5}
                    step={0.1}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>סיכון מקסימלי לעסקה ({personalStrategy.parameters.maxRiskPercent}%)</Label>
                  <Slider
                    value={[personalStrategy.parameters.maxRiskPercent]}
                    onValueChange={([value]) => updatePersonalStrategy({ maxRiskPercent: value })}
                    max={5}
                    min={0.5}
                    step={0.1}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label>יחס סיכון/תשואה (1:{personalStrategy.parameters.riskRewardRatio})</Label>
                  <Slider
                    value={[personalStrategy.parameters.riskRewardRatio]}
                    onValueChange={([value]) => updatePersonalStrategy({ riskRewardRatio: value })}
                    max={5}
                    min={1}
                    step={0.1}
                    className="w-full"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label>דרישת עלייה בנפח</Label>
                  <Switch
                    checked={personalStrategy.parameters.volumeIncreaseRequired}
                    onCheckedChange={(checked) => updatePersonalStrategy({ volumeIncreaseRequired: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label>דרישת שבירת התנגדות</Label>
                  <Switch
                    checked={personalStrategy.parameters.resistanceBreakRequired}
                    onCheckedChange={(checked) => updatePersonalStrategy({ resistanceBreakRequired: checked })}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">ביצועי האסטרטגיה</p>
                <p className="text-sm text-muted-foreground">
                  {personalStrategy.totalSignals} איתותים, {(personalStrategy.successRate * 100).toFixed(1)}% הצלחה
                </p>
              </div>
              <Badge variant={personalStrategy.successRate > 0.6 ? "default" : "secondary"}>
                משקל: {(personalStrategy.weight * 100).toFixed(0)}%
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Strategies Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            כל האסטרטגיות
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {strategies.map((strategy) => (
              <div key={strategy.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-medium">{strategy.name}</h3>
                    <Badge variant="outline" className={getStrategyStatusColor(strategy)}>
                      {strategy.type}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>איתותים: {strategy.totalSignals}</span>
                    <span>הצלחה: {(strategy.successRate * 100).toFixed(1)}%</span>
                    <span className="flex items-center gap-1">
                      משקל: 
                      <div className={`w-2 h-2 rounded-full ${getWeightColor(strategy.weight)}`} />
                      {(strategy.weight * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right text-sm">
                    <div className={`font-medium ${getStrategyStatusColor(strategy)}`}>
                      {strategy.profitableSignals}/{strategy.totalSignals}
                    </div>
                    <div className="text-muted-foreground">רווחיים</div>
                  </div>
                  
                  <Switch
                    checked={strategy.isActive}
                    onCheckedChange={(checked) => toggleStrategy(strategy.id, checked)}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StrategyManager;
