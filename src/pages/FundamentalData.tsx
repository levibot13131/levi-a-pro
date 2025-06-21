
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RefreshCw, TrendingUp, TrendingDown, AlertCircle, Activity } from 'lucide-react';
import LiveNewsFeed from '@/components/news/LiveNewsFeed';
import { newsAggregationService } from '@/services/news/newsAggregationService';
import { autonomousOperationService } from '@/services/autonomous/autonomousOperationService';

const FundamentalData: React.FC = () => {
  const [systemHealth, setSystemHealth] = useState(autonomousOperationService.getSystemHealth());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Start autonomous operation if not already running
    if (!autonomousOperationService.isSystemOperational()) {
      autonomousOperationService.startAutonomousOperation();
    }

    // Listen for system health updates
    const handleHealthUpdate = (event: CustomEvent) => {
      setSystemHealth(event.detail);
    };

    window.addEventListener('system-health-update', handleHealthUpdate as EventListener);

    // Update system health every 10 seconds
    const interval = setInterval(() => {
      setSystemHealth(autonomousOperationService.getSystemHealth());
    }, 10000);

    return () => {
      clearInterval(interval);
      window.removeEventListener('system-health-update', handleHealthUpdate as EventListener);
    };
  }, []);

  const handleRefreshAll = async () => {
    setIsLoading(true);
    
    // Force refresh all services
    if (newsAggregationService.isServiceRunning()) {
      newsAggregationService.stop();
      await new Promise(resolve => setTimeout(resolve, 1000));
      await newsAggregationService.start();
    }
    
    setIsLoading(false);
  };

  const formatUptime = (uptime: number) => {
    const hours = Math.floor(uptime / (1000 * 60 * 60));
    const minutes = Math.floor((uptime % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="space-y-6">
      {/* System Status Header */}
      <Card className="border-2 border-blue-500">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="h-6 w-6 text-blue-500" />
              LeviPro Fundamental Analysis System
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefreshAll}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh All
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className={`text-2xl font-bold ${systemHealth.isOperational ? 'text-green-600' : 'text-red-600'}`}>
                {systemHealth.isOperational ? 'OPERATIONAL' : 'OFFLINE'}
              </div>
              <div className="text-sm text-muted-foreground">System Status</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {formatUptime(systemHealth.uptime)}
              </div>
              <div className="text-sm text-muted-foreground">Uptime</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {systemHealth.performanceMetrics.signalsGenerated}
              </div>
              <div className="text-sm text-muted-foreground">Signals Generated</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {(systemHealth.performanceMetrics.successRate * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground">Success Rate</div>
            </div>
          </div>
          
          <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-2">
            {Object.entries(systemHealth.components).map(([component, status]) => (
              <Badge
                key={component}
                variant={status ? "default" : "secondary"}
                className="justify-center"
              >
                {component.replace(/([A-Z])/g, ' $1').toLowerCase()}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Market Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              <TrendingUp className="h-6 w-6 mx-auto mb-2" />
              BULLISH
            </div>
            <div className="text-sm text-muted-foreground">Overall Market Sentiment</div>
            <div className="text-xs text-muted-foreground mt-1">Based on 15 factors</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">
              <AlertCircle className="h-6 w-6 mx-auto mb-2" />
              MEDIUM
            </div>
            <div className="text-sm text-muted-foreground">Market Risk Level</div>
            <div className="text-xs text-muted-foreground mt-1">Volatility expected</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              85
            </div>
            <div className="text-sm text-muted-foreground">Fear & Greed Index</div>
            <div className="text-xs text-muted-foreground mt-1">Extreme Greed</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="news" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="news">Live News & Analysis</TabsTrigger>
          <TabsTrigger value="metrics">Key Metrics</TabsTrigger>
          <TabsTrigger value="events">Economic Events</TabsTrigger>
        </TabsList>
        
        <TabsContent value="news" className="space-y-4">
          <LiveNewsFeed />
        </TabsContent>
        
        <TabsContent value="metrics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Bitcoin Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Network Hash Rate</span>
                  <span className="font-semibold">450 EH/s</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Active Addresses (24h)</span>
                  <span className="font-semibold">850,000</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Transaction Volume</span>
                  <span className="font-semibold">$12.5B</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Exchange Inflow/Outflow</span>
                  <span className="font-semibold text-green-600">-2,500 BTC</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Ethereum Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Gas Price (Gwei)</span>
                  <span className="font-semibold">25</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Total Value Locked</span>
                  <span className="font-semibold">$25.8B</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Staked ETH</span>
                  <span className="font-semibold">28.5M ETH</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Network Utilization</span>
                  <span className="font-semibold">75%</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Economic Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-l-4 border-red-500 pl-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold">Fed Interest Rate Decision</h4>
                      <p className="text-sm text-muted-foreground">Expected to impact crypto markets significantly</p>
                    </div>
                    <Badge variant="destructive">HIGH IMPACT</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Tomorrow, 2:00 PM EST</p>
                </div>
                
                <div className="border-l-4 border-yellow-500 pl-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold">CPI Inflation Data Release</h4>
                      <p className="text-sm text-muted-foreground">Monthly inflation report from Bureau of Labor Statistics</p>
                    </div>
                    <Badge variant="secondary">MEDIUM IMPACT</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Next Week, Thursday 8:30 AM EST</p>
                </div>
                
                <div className="border-l-4 border-blue-500 pl-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold">Bitcoin ETF Options Launch</h4>
                      <p className="text-sm text-muted-foreground">Options trading begins for major Bitcoin ETFs</p>
                    </div>
                    <Badge variant="outline">MEDIUM IMPACT</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Next Month</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FundamentalData;
