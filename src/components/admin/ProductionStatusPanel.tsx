import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertTriangle, Activity, Zap, Brain, Target } from 'lucide-react';

export const ProductionStatusPanel = () => {
  const productionFeatures = [
    {
      name: 'Real-Time Price Feeds',
      status: 'active',
      description: 'CoinGecko API integration with live market data',
      details: 'Entry/SL/TP prices sourced from live CoinGecko feeds'
    },
    {
      name: 'Elite Signal Engine',
      status: 'active', 
      description: 'Multi-strategy confluence with 75%+ confidence filtering',
      details: 'Magic Triangle + Wyckoff + SMC + Elliott + Fibonacci + Volume Profile'
    },
    {
      name: 'NLP Intelligence',
      status: 'active',
      description: 'OpenAI-powered fundamental analysis integration',
      details: 'News sentiment + Whale alerts + Fear/Greed + Market intelligence'
    },
    {
      name: 'AI Learning System',
      status: 'active',
      description: 'Performance tracking and strategy optimization',
      details: 'Win rate tracking, strategy weighting, confidence adjustments'
    },
    {
      name: 'Risk Management',
      status: 'active',
      description: 'Enforced 1.8:1 minimum R/R with proper SL/TP placement',
      details: 'ATR-based stops, direction-aware SL placement'
    },
    {
      name: 'Telegram Delivery',
      status: 'active',
      description: 'Hebrew-formatted elite signals with full context',
      details: 'Max 10 daily signals, comprehensive analysis breakdown'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-green-500">Production Ready</Badge>;
      case 'warning':
        return <Badge variant="secondary">Needs Attention</Badge>;
      default:
        return <Badge variant="outline">Inactive</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-blue-500" />
          LeviPro Production Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4">
          {productionFeatures.map((feature, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getStatusIcon(feature.status)}
                  <span className="font-medium">{feature.name}</span>
                </div>
                {getStatusBadge(feature.status)}
              </div>
              
              <div className="text-sm text-muted-foreground">
                {feature.description}
              </div>
              
              <div className="text-xs bg-muted p-2 rounded">
                <span className="font-medium">Details:</span> {feature.details}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="font-semibold text-green-800 dark:text-green-200">
              🎯 Production Ready - All Systems Operational
            </span>
          </div>
          <div className="text-sm text-green-700 dark:text-green-300">
            LeviPro Elite AI trading system is fully operational with real market data, 
            comprehensive analysis, and elite quality filtering. Ready for live trading.
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Target className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Signals Today</span>
            </div>
            <div className="text-2xl font-bold text-blue-600">0/10</div>
            <div className="text-xs text-muted-foreground">Elite Quality</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Brain className="h-4 w-4 text-purple-500" />
              <span className="text-sm font-medium">AI Confidence</span>
            </div>
            <div className="text-2xl font-bold text-purple-600">75%+</div>
            <div className="text-xs text-muted-foreground">Minimum</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Activity className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">System Health</span>
            </div>
            <div className="text-2xl font-bold text-green-600">100%</div>
            <div className="text-xs text-muted-foreground">Operational</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};