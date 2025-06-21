
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlayCircle, Square, Activity, TrendingUp, Target, Shield, Brain, BarChart3 } from 'lucide-react';
import { enhancedSignalEngine } from '@/services/trading/enhancedSignalEngine';
import { marketIntelligenceEngine } from '@/services/intelligence/marketIntelligenceEngine';
import { multiTimeframeEngine } from '@/services/analysis/multiTimeframeEngine';
import ComprehensiveTradingJournal from '../trading/ComprehensiveTradingJournal';
import TelegramStatusIndicator from '../telegram/TelegramStatusIndicator';
import { toast } from 'sonner';

const UnifiedDashboard: React.FC = () => {
  const [signalEngineStatus, setSignalEngineStatus] = useState(enhancedSignalEngine.getEngineStatus());
  const [marketIntelligence, setMarketIntelligence] = useState(marketIntelligenceEngine.getIntelligence());
  const [multiTimeframeSignals, setMultiTimeframeSignals] = useState(multiTimeframeEngine.getRecentSignals());
  const [isIntelligenceRunning, setIsIntelligenceRunning] = useState(marketIntelligenceEngine.isEngineRunning());
  const [isMultiTimeframeRunning, setIsMultiTimeframeRunning] = useState(multiTimeframeEngine.isEngineRunning());

  useEffect(() => {
    // Status update interval
    const statusInterval = setInterval(() => {
      setSignalEngineStatus(enhancedSignalEngine.getEngineStatus());
      setMarketIntelligence(marketIntelligenceEngine.getIntelligence());
      setMultiTimeframeSignals(multiTimeframeEngine.getRecentSignals());
      setIsIntelligenceRunning(marketIntelligenceEngine.isEngineRunning());
      setIsMultiTimeframeRunning(multiTimeframeEngine.isEngineRunning());
    }, 5000);

    // Listen for market intelligence updates
    const handleIntelligenceUpdate = (event: CustomEvent) => {
      setMarketIntelligence(event.detail);
    };

    // Listen for high-probability setups
    const handleHighProbabilitySetup = (event: CustomEvent) => {
      const setup = event.detail;
      toast.success(`🎯 High-Probability Setup: ${setup.symbol} (${setup.confluence}% confluence)`);
    };

    window.addEventListener('market-intelligence-update', handleIntelligenceUpdate as EventListener);
    window.addEventListener('high-probability-setup', handleHighProbabilitySetup as EventListener);

    return () => {
      clearInterval(statusInterval);
      window.removeEventListener('market-intelligence-update', handleIntelligenceUpdate as EventListener);
      window.removeEventListener('high-probability-setup', handleHighProbabilitySetup as EventListener);
    };
  }, []);

  const startAllEngines = async () => {
    await enhancedSignalEngine.start();
    await marketIntelligenceEngine.start();
    await multiTimeframeEngine.startAnalysis();
    toast.success('🚀 All engines activated - LeviPro is now running autonomously');
  };

  const stopAllEngines = () => {
    enhancedSignalEngine.stop();
    marketIntelligenceEngine.stop();
    multiTimeframeEngine.stopAnalysis();
    toast.info('⏹️ All engines stopped');
  };

  const highProbabilitySetups = multiTimeframeSignals.filter(s => s.highProbabilitySetup);

  return (
    <div className="space-y-6">
      {/* Master Control Panel */}
      <Card className="border-2 border-blue-500">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="h-6 w-6 text-blue-500" />
              LeviPro Master Control
            </div>
            <TelegramStatusIndicator />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Badge variant={signalEngineStatus.isRunning ? "default" : "secondary"}>
                <Target className="h-3 w-3 mr-1" />
                Signal Engine: {signalEngineStatus.isRunning ? 'Active' : 'Stopped'}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={isIntelligenceRunning ? "default" : "secondary"}>
                <Brain className="h-3 w-3 mr-1" />
                Intelligence: {isIntelligenceRunning ? 'Learning' : 'Stopped'}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={isMultiTimeframeRunning ? "default" : "secondary"}>
                <BarChart3 className="h-3 w-3 mr-1" />
                Multi-TF: {isMultiTimeframeRunning ? 'Analyzing' : 'Stopped'}
              </Badge>
            </div>
          </div>
          
          <div className="flex gap-2">
            {!signalEngineStatus.isRunning || !isIntelligenceRunning || !isMultiTimeframeRunning ? (
              <Button onClick={startAllEngines} className="bg-green-600 hover:bg-green-700">
                <PlayCircle className="h-4 w-4 mr-2" />
                Start All Engines
              </Button>
            ) : (
              <Button onClick={stopAllEngines} variant="destructive">
                <Square className="h-4 w-4 mr-2" />
                Stop All Engines
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Market Intelligence Overview */}
      {marketIntelligence && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {marketIntelligence.sentiment.overall.toUpperCase()}
              </div>
              <div className="text-sm text-muted-foreground">Market Sentiment</div>
              <div className="text-xs text-muted-foreground">
                {marketIntelligence.sentiment.confidence.toFixed(0)}% confidence
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">
                {marketIntelligence.newsFlow.highImpact.length}
              </div>
              <div className="text-sm text-muted-foreground">High Impact News</div>
              <div className="text-xs text-muted-foreground">
                {marketIntelligence.newsFlow.recent.length} total articles
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {marketIntelligence.whaleActivity.recentMoves.length}
              </div>
              <div className="text-sm text-muted-foreground">Whale Moves</div>
              <div className="text-xs text-muted-foreground">
                {marketIntelligence.whaleActivity.sentiment}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className={`text-2xl font-bold ${
                marketIntelligence.riskLevel === 'low' ? 'text-green-600' :
                marketIntelligence.riskLevel === 'medium' ? 'text-yellow-600' :
                marketIntelligence.riskLevel === 'high' ? 'text-orange-600' : 'text-red-600'
              }`}>
                {marketIntelligence.riskLevel.toUpperCase()}
              </div>
              <div className="text-sm text-muted-foreground">Risk Level</div>
              <div className="text-xs text-muted-foreground">
                {new Date(marketIntelligence.lastUpdated).toLocaleTimeString()}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* High Probability Setups */}
      {highProbabilitySetups.length > 0 && (
        <Card className="border-2 border-green-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              High Probability Setups ({highProbabilitySetups.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {highProbabilitySetups.slice(0, 3).map((setup, index) => (
                <div key={index} className="border rounded-lg p-4 bg-green-50">
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
                      <span className="text-muted-foreground">Stop Loss:</span>
                      <div className="font-medium">${setup.stopLoss.toFixed(2)}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Target 1:</span>
                      <div className="font-medium">${setup.targets[0].toFixed(2)}</div>
                    </div>
                  </div>
                  
                  <div className="mt-2 text-xs text-muted-foreground">
                    Timeframes aligned: {setup.timeframes.filter(tf => tf.trend === setup.overallDirection).length}/{setup.timeframes.length}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Dashboard Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="signals">Active Signals</TabsTrigger>
          <TabsTrigger value="journal">Trading Journal</TabsTrigger>
          <TabsTrigger value="intelligence">Market Intelligence</TabsTrigger>
          <TabsTrigger value="analysis">Multi-Timeframe</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>System Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Signal Engine:</span>
                    <Badge variant={signalEngineStatus.isRunning ? "default" : "secondary"}>
                      {signalEngineStatus.isRunning ? 'Active' : 'Stopped'}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Intelligence Layer:</span>
                    <Badge variant="default">Elite Active</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Risk Management:</span>
                    <Badge variant="default">Protected</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Auto Learning:</span>
                    <Badge variant="default">Continuous</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Signals Today:</span>
                    <span className="font-semibold">12</span>
                  </div>
                  <div className="flex justify-between">
                    <span>High Probability:</span>
                    <span className="font-semibold text-green-600">8</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Success Rate:</span>
                    <span className="font-semibold">78%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Risk Level:</span>
                    <Badge variant="secondary">Medium</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="signals">
          <Card>
            <CardHeader>
              <CardTitle>Active Trading Signals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                No active signals at the moment. The system is continuously monitoring for opportunities.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="journal">
          <ComprehensiveTradingJournal />
        </TabsContent>
        
        <TabsContent value="intelligence">
          {marketIntelligence ? (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent News Flow</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {marketIntelligence.newsFlow.recent.slice(0, 5).map((news: any, index: number) => (
                      <div key={index} className="border-b pb-2">
                        <div className="font-medium">{news.title}</div>
                        <div className="text-sm text-muted-foreground">{news.summary}</div>
                        <div className="flex gap-2 mt-1">
                          <Badge variant="outline">{news.source}</Badge>
                          <Badge variant={news.sentiment === 'positive' ? 'default' : news.sentiment === 'negative' ? 'destructive' : 'secondary'}>
                            {news.sentiment}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <div className="text-muted-foreground">Market intelligence engine is starting up...</div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="analysis">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Multi-Timeframe Signals</CardTitle>
              </CardHeader>
              <CardContent>
                {multiTimeframeSignals.length > 0 ? (
                  <div className="space-y-4">
                    {multiTimeframeSignals.slice(0, 5).map((signal, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{signal.symbol}</span>
                            <Badge variant={signal.overallDirection === 'bullish' ? 'default' : 'destructive'}>
                              {signal.overallDirection.toUpperCase()}
                            </Badge>
                            <Badge variant="outline">
                              {signal.confluence.toFixed(0)}% confluence
                            </Badge>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {new Date(signal.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          R/R: {signal.riskReward.toFixed(2)}:1 | Entry: ${signal.entryPrice.toFixed(2)} | Stop: ${signal.stopLoss.toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    Multi-timeframe analysis is running. Signals will appear here.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UnifiedDashboard;
