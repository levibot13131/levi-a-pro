
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RefreshCw, TrendingUp, Activity, Target, BarChart3 } from 'lucide-react';
import EnhancedTradingChart from '@/components/charts/EnhancedTradingChart';
import { multiTimeframeEngine } from '@/services/analysis/multiTimeframeEngine';
import { autonomousOperationService } from '@/services/autonomous/autonomousOperationService';

const TechnicalAnalysis: React.FC = () => {
  const [selectedSymbol, setSelectedSymbol] = useState('BTCUSDT');
  const [multiTimeframeSignals, setMultiTimeframeSignals] = useState(multiTimeframeEngine.getRecentSignals());
  const [systemHealth, setSystemHealth] = useState(autonomousOperationService.getSystemHealth());
  const [isLoading, setIsLoading] = useState(false);

  const symbols = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'BNBUSDT', 'ADAUSDT', 'XRPUSDT'];

  useEffect(() => {
    // Start autonomous operation if not running
    if (!autonomousOperationService.isSystemOperational()) {
      autonomousOperationService.startAutonomousOperation();
    }

    // Listen for high-probability setups
    const handleHighProbabilitySetup = (event: CustomEvent) => {
      setMultiTimeframeSignals(prev => [event.detail, ...prev.slice(0, 19)]);
    };

    // Listen for system health updates
    const handleHealthUpdate = (event: CustomEvent) => {
      setSystemHealth(event.detail);
    };

    window.addEventListener('high-probability-setup', handleHighProbabilitySetup as EventListener);
    window.addEventListener('system-health-update', handleHealthUpdate as EventListener);

    // Update signals every 30 seconds
    const interval = setInterval(() => {
      setMultiTimeframeSignals(multiTimeframeEngine.getRecentSignals());
      setSystemHealth(autonomousOperationService.getSystemHealth());
    }, 30000);

    return () => {
      clearInterval(interval);
      window.removeEventListener('high-probability-setup', handleHighProbabilitySetup as EventListener);
      window.removeEventListener('system-health-update', handleHealthUpdate as EventListener);
    };
  }, []);

  const handleRefresh = async () => {
    setIsLoading(true);
    setMultiTimeframeSignals(multiTimeframeEngine.getRecentSignals());
    setIsLoading(false);
  };

  const highProbabilitySetups = multiTimeframeSignals.filter(s => s.highProbabilitySetup);

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <Card className="border-2 border-green-500">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-6 w-6 text-green-500" />
              Technical Analysis Engine
            </div>
            <div className="flex items-center gap-4">
              <Select value={selectedSymbol} onValueChange={setSelectedSymbol}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {symbols.map(symbol => (
                    <SelectItem key={symbol} value={symbol}>{symbol}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className={`text-2xl font-bold ${systemHealth.components.multiTimeframe ? 'text-green-600' : 'text-red-600'}`}>
                {systemHealth.components.multiTimeframe ? 'ACTIVE' : 'OFFLINE'}
              </div>
              <div className="text-sm text-muted-foreground">Analysis Engine</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {multiTimeframeSignals.length}
              </div>
              <div className="text-sm text-muted-foreground">Total Signals</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {highProbabilitySetups.length}
              </div>
              <div className="text-sm text-muted-foreground">High Probability</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {multiTimeframeSignals.length > 0 ? 
                  (multiTimeframeSignals.filter(s => s.confluence >= 70).length / multiTimeframeSignals.length * 100).toFixed(0) : 0}%
              </div>
              <div className="text-sm text-muted-foreground">Avg Confluence</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* High Probability Setups Alert */}
      {highProbabilitySetups.length > 0 && (
        <Card className="border-2 border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-700 dark:text-yellow-300">
              <Target className="h-5 w-5" />
              🎯 High Probability Setups Detected ({highProbabilitySetups.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {highProbabilitySetups.slice(0, 3).map((setup, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-3 border">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-lg">{setup.symbol}</span>
                      <Badge variant="default" className="bg-green-600">
                        {setup.confluence.toFixed(0)}% Confluence
                      </Badge>
                      <Badge variant={setup.overallDirection === 'bullish' ? 'default' : 'destructive'}>
                        {setup.overallDirection.toUpperCase()}
                      </Badge>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      R/R: {setup.riskReward.toFixed(2)}:1
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Entry:</span>
                      <div className="font-medium">${setup.entryPrice.toFixed(2)}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Stop:</span>
                      <div className="font-medium">${setup.stopLoss.toFixed(2)}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Target:</span>
                      <div className="font-medium">${setup.targets[0].toFixed(2)}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content */}
      <Tabs defaultValue="charts" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="charts">Live Charts</TabsTrigger>
          <TabsTrigger value="signals">Multi-Timeframe Signals</TabsTrigger>
          <TabsTrigger value="analysis">Technical Indicators</TabsTrigger>
        </TabsList>
        
        <TabsContent value="charts" className="space-y-4">
          <EnhancedTradingChart symbol={selectedSymbol} height={500} />
        </TabsContent>
        
        <TabsContent value="signals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Multi-Timeframe Analysis Results</CardTitle>
            </CardHeader>
            <CardContent>
              {multiTimeframeSignals.length > 0 ? (
                <div className="space-y-4">
                  {multiTimeframeSignals.slice(0, 10).map((signal, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-lg">{signal.symbol}</span>
                          <Badge variant={signal.overallDirection === 'bullish' ? 'default' : 'destructive'}>
                            <TrendingUp className="h-3 w-3 mr-1" />
                            {signal.overallDirection.toUpperCase()}
                          </Badge>
                          <Badge variant="outline">
                            {signal.confluence.toFixed(0)}% confluence
                          </Badge>
                          {signal.highProbabilitySetup && (
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                              HIGH PROBABILITY
                            </Badge>
                          )}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {new Date(signal.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Entry Price:</span>
                          <div className="font-medium">${signal.entryPrice.toFixed(2)}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Stop Loss:</span>
                          <div className="font-medium">${signal.stopLoss.toFixed(2)}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Risk/Reward:</span>
                          <div className="font-medium">{signal.riskReward.toFixed(2)}:1</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Timeframes:</span>
                          <div className="font-medium">{signal.timeframes.length} analyzed</div>
                        </div>
                      </div>
                      
                      <div className="mt-3">
                        <span className="text-xs text-muted-foreground">
                          Aligned timeframes: {signal.timeframes.filter(tf => tf.trend === signal.overallDirection).length}/{signal.timeframes.length}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Activity className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">Multi-timeframe analysis is running. Signals will appear here.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analysis" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Key Technical Levels - {selectedSymbol}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Strong Resistance</span>
                  <span className="font-semibold text-red-600">$68,500</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Minor Resistance</span>
                  <span className="font-semibold text-orange-600">$67,200</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Current Price</span>
                  <span className="font-semibold">$66,750</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Minor Support</span>
                  <span className="font-semibold text-green-600">$65,800</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Strong Support</span>
                  <span className="font-semibold text-green-700">$64,200</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Technical Indicators Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>RSI (14)</span>
                  <Badge variant="secondary">58.2 - Neutral</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>MACD</span>
                  <Badge variant="default">Bullish Crossover</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Moving Averages</span>
                  <Badge variant="default">Bullish Alignment</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Volume Trend</span>
                  <Badge variant="secondary">Above Average</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Overall Signal</span>
                  <Badge variant="default" className="bg-green-600">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    BULLISH
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TechnicalAnalysis;
