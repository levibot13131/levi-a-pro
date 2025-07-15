import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Target, Shield, Brain, Zap } from 'lucide-react';

interface ProductionSignal {
  id: string;
  symbol: string;
  action: 'BUY' | 'SELL';
  entry_price: number;
  target_price: number;
  stop_loss: number;
  confidence: number;
  risk_reward_ratio: number;
  strategy: string;
  confluences: string[];
  fundamental_boost: number;
  learning_score: number;
  timestamp: number;
  market_conditions: {
    atr: number;
    trend_alignment: number;
    volume_confirmation: number;
  };
}

interface Props {
  signal: ProductionSignal;
  showDetails?: boolean;
}

export const ProductionSignalDisplay: React.FC<Props> = ({ signal, showDetails = true }) => {
  const isLong = signal.action === 'BUY';
  const ActionIcon = isLong ? TrendingUp : TrendingDown;
  
  const profitDistance = Math.abs(signal.target_price - signal.entry_price);
  const lossDistance = Math.abs(signal.entry_price - signal.stop_loss);
  const actualRR = profitDistance / lossDistance;

  return (
    <Card className="border-l-4" style={{ borderLeftColor: isLong ? 'rgb(34, 197, 94)' : 'rgb(239, 68, 68)' }}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <ActionIcon className={`h-5 w-5 ${isLong ? 'text-green-500' : 'text-red-500'}`} />
            <span>{signal.symbol}</span>
            <Badge variant={isLong ? 'default' : 'destructive'}>
              {signal.action}
            </Badge>
          </CardTitle>
          <div className="flex items-center gap-2">
            <Brain className="h-4 w-4 text-blue-500" />
            <span className="text-sm font-medium">{signal.confidence.toFixed(0)}%</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Price Levels */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-xs text-muted-foreground">Entry</div>
            <div className="font-semibold text-lg">${signal.entry_price.toFixed(2)}</div>
            <div className="text-xs text-green-600">LIVE PRICE</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground">Target</div>
            <div className="font-semibold text-lg text-green-600">${signal.target_price.toFixed(2)}</div>
            <div className="text-xs">+{((signal.target_price / signal.entry_price - 1) * 100).toFixed(1)}%</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground">Stop Loss</div>
            <div className="font-semibold text-lg text-red-600">${signal.stop_loss.toFixed(2)}</div>
            <div className="text-xs">-{((signal.entry_price / signal.stop_loss - 1) * 100).toFixed(1)}%</div>
          </div>
        </div>

        {/* Risk/Reward Ratio */}
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-blue-500" />
          <span className="text-sm">Risk/Reward:</span>
          <Badge variant="secondary" className="font-mono">
            {actualRR.toFixed(2)}:1
          </Badge>
          {actualRR >= 1.8 && <Badge variant="default" className="text-xs">Elite</Badge>}
        </div>

        {/* Confidence Meter */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1">
              <Zap className="h-3 w-3" />
              Elite Confidence
            </span>
            <span className="font-medium">{signal.confidence.toFixed(1)}%</span>
          </div>
          <Progress value={signal.confidence} className="h-2" />
          {signal.confidence >= 75 && (
            <Badge variant="default" className="text-xs">
              Elite Quality ⭐
            </Badge>
          )}
        </div>

        {/* Strategy Information */}
        <div className="space-y-2">
          <div className="text-sm font-medium">Strategy Mix:</div>
          <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
            {signal.strategy}
          </div>
        </div>

        {showDetails && (
          <>
            {/* Confluences */}
            <div className="space-y-2">
              <div className="text-sm font-medium flex items-center gap-1">
                <Target className="h-3 w-3" />
                Key Confluences ({signal.confluences.length})
              </div>
              <div className="space-y-1">
                {signal.confluences.slice(0, 3).map((confluence, index) => (
                  <div key={index} className="text-xs bg-blue-50 dark:bg-blue-950 p-2 rounded">
                    • {confluence}
                  </div>
                ))}
              </div>
            </div>

            {/* Market Conditions */}
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="text-center">
                <div className="text-muted-foreground">Trend Align</div>
                <div className="font-medium">{(signal.market_conditions.trend_alignment * 100).toFixed(0)}%</div>
              </div>
              <div className="text-center">
                <div className="text-muted-foreground">Volume</div>
                <div className="font-medium">{(signal.market_conditions.volume_confirmation * 100).toFixed(0)}%</div>
              </div>
              <div className="text-center">
                <div className="text-muted-foreground">ATR</div>
                <div className="font-medium">{(signal.market_conditions.atr * 100).toFixed(1)}%</div>
              </div>
            </div>

            {/* Additional Metrics */}
            <div className="flex justify-between items-center text-xs text-muted-foreground">
              <span>Fundamental Boost: +{signal.fundamental_boost.toFixed(1)}%</span>
              <span>AI Learning: +{signal.learning_score.toFixed(1)}</span>
              <span>{new Date(signal.timestamp).toLocaleString('he-IL')}</span>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};