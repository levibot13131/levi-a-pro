
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BookOpen, 
  Plus, 
  Download, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Target,
  Calendar,
  Filter
} from 'lucide-react';
import { toast } from 'sonner';

interface JournalEntry {
  id: string;
  timestamp: number;
  symbol: string;
  action: 'BUY' | 'SELL';
  entryPrice: number;
  exitPrice?: number;
  targetPrice: number;
  stopLoss: number;
  quantity: number;
  confidence: number;
  riskReward: number;
  reasoning: string;
  status: 'OPEN' | 'WIN' | 'LOSS' | 'BREAKEVEN';
  pnl?: number;
  pnlPercent?: number;
  strategy: string;
  isManual: boolean;
}

const TradingJournalDashboard: React.FC = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<JournalEntry[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [filters, setFilters] = useState({
    symbol: '',
    status: '',
    strategy: '',
    dateFrom: '',
    dateTo: ''
  });

  // Mock data for demonstration
  useEffect(() => {
    const mockEntries: JournalEntry[] = [
      {
        id: '1',
        timestamp: Date.now() - 86400000,
        symbol: 'BTCUSDT',
        action: 'BUY',
        entryPrice: 98500,
        exitPrice: 101200,
        targetPrice: 101000,
        stopLoss: 96000,
        quantity: 0.1,
        confidence: 85,
        riskReward: 2.1,
        reasoning: 'Multi-timeframe bullish confluence + positive sentiment',
        status: 'WIN',
        pnl: 270,
        pnlPercent: 2.74,
        strategy: 'Multi-Timeframe + Sentiment',
        isManual: false
      },
      {
        id: '2',
        timestamp: Date.now() - 43200000,
        symbol: 'ETHUSDT',
        action: 'SELL',
        entryPrice: 3850,
        exitPrice: 3780,
        targetPrice: 3750,
        stopLoss: 3920,
        quantity: 2.5,
        confidence: 78,
        riskReward: 1.8,
        reasoning: 'Resistance rejection + high volume',
        status: 'WIN',
        pnl: 175,
        pnlPercent: 1.82,
        strategy: 'Support/Resistance',
        isManual: true
      },
      {
        id: '3',
        timestamp: Date.now() - 21600000,
        symbol: 'SOLUSDT',
        action: 'BUY',
        entryPrice: 245,
        targetPrice: 260,
        stopLoss: 235,
        quantity: 40,
        confidence: 82,
        riskReward: 1.5,
        reasoning: 'Breakout pattern with volume confirmation',
        status: 'OPEN',
        strategy: 'Breakout',
        isManual: false
      }
    ];
    
    setEntries(mockEntries);
    setFilteredEntries(mockEntries);
  }, []);

  // Calculate statistics
  const stats = React.useMemo(() => {
    const closedTrades = entries.filter(e => e.status !== 'OPEN');
    const wins = closedTrades.filter(e => e.status === 'WIN');
    const losses = closedTrades.filter(e => e.status === 'LOSS');
    
    const totalPnL = closedTrades.reduce((sum, trade) => sum + (trade.pnl || 0), 0);
    const winRate = closedTrades.length > 0 ? (wins.length / closedTrades.length) * 100 : 0;
    const avgWin = wins.length > 0 ? wins.reduce((sum, trade) => sum + (trade.pnl || 0), 0) / wins.length : 0;
    const avgLoss = losses.length > 0 ? Math.abs(losses.reduce((sum, trade) => sum + (trade.pnl || 0), 0) / losses.length) : 0;
    const profitFactor = avgLoss > 0 ? avgWin / avgLoss : 0;

    return {
      totalTrades: entries.length,
      openTrades: entries.filter(e => e.status === 'OPEN').length,
      closedTrades: closedTrades.length,
      wins: wins.length,
      losses: losses.length,
      winRate,
      totalPnL,
      avgWin,
      avgLoss,
      profitFactor
    };
  }, [entries]);

  const applyFilters = () => {
    let filtered = entries;

    if (filters.symbol) {
      filtered = filtered.filter(e => e.symbol.toLowerCase().includes(filters.symbol.toLowerCase()));
    }
    if (filters.status) {
      filtered = filtered.filter(e => e.status === filters.status);
    }
    if (filters.strategy) {
      filtered = filtered.filter(e => e.strategy.toLowerCase().includes(filters.strategy.toLowerCase()));
    }
    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom).getTime();
      filtered = filtered.filter(e => e.timestamp >= fromDate);
    }
    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo).getTime();
      filtered = filtered.filter(e => e.timestamp <= toDate);
    }

    setFilteredEntries(filtered);
  };

  useEffect(() => {
    applyFilters();
  }, [filters, entries]);

  const exportToCSV = () => {
    const headers = ['Date', 'Symbol', 'Action', 'Entry Price', 'Exit Price', 'Target', 'Stop Loss', 'Quantity', 'Confidence', 'R/R', 'Status', 'PnL', 'PnL%', 'Strategy', 'Reasoning'];
    
    const csvData = filteredEntries.map(entry => [
      new Date(entry.timestamp).toLocaleDateString(),
      entry.symbol,
      entry.action,
      entry.entryPrice,
      entry.exitPrice || '',
      entry.targetPrice,
      entry.stopLoss,
      entry.quantity,
      entry.confidence,
      entry.riskReward,
      entry.status,
      entry.pnl || '',
      entry.pnlPercent || '',
      entry.strategy,
      entry.reasoning
    ]);

    const csvContent = [headers, ...csvData].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `trading-journal-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success('📊 Trading journal exported to CSV');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'WIN':
        return <Badge className="bg-green-100 text-green-800">WIN</Badge>;
      case 'LOSS':
        return <Badge className="bg-red-100 text-red-800">LOSS</Badge>;
      case 'OPEN':
        return <Badge className="bg-blue-100 text-blue-800">OPEN</Badge>;
      case 'BREAKEVEN':
        return <Badge className="bg-gray-100 text-gray-800">BREAKEVEN</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.totalTrades}</div>
            <div className="text-sm text-muted-foreground">Total Trades</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.winRate.toFixed(1)}%</div>
            <div className="text-sm text-muted-foreground">Win Rate</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className={`text-2xl font-bold ${stats.totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${stats.totalPnL.toFixed(2)}
            </div>
            <div className="text-sm text-muted-foreground">Total P&L</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{stats.profitFactor.toFixed(2)}</div>
            <div className="text-sm text-muted-foreground">Profit Factor</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Journal */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Trading Journal
            </CardTitle>
            <div className="flex gap-2">
              <Button onClick={exportToCSV} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
              <Button onClick={() => setShowAddForm(true)} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Trade
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="trades" className="w-full">
            <TabsList>
              <TabsTrigger value="trades">All Trades</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="filters">Filters</TabsTrigger>
            </TabsList>
            
            <TabsContent value="trades" className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Date</th>
                      <th className="text-left p-2">Symbol</th>
                      <th className="text-left p-2">Action</th>
                      <th className="text-left p-2">Entry</th>
                      <th className="text-left p-2">Exit</th>
                      <th className="text-left p-2">Confidence</th>
                      <th className="text-left p-2">R/R</th>
                      <th className="text-left p-2">Status</th>
                      <th className="text-left p-2">P&L</th>
                      <th className="text-left p-2">Strategy</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEntries.map(entry => (
                      <tr key={entry.id} className="border-b hover:bg-gray-50">
                        <td className="p-2 text-sm">
                          {new Date(entry.timestamp).toLocaleDateString()}
                        </td>
                        <td className="p-2 font-medium">{entry.symbol}</td>
                        <td className="p-2">
                          <Badge variant={entry.action === 'BUY' ? 'default' : 'destructive'}>
                            {entry.action}
                          </Badge>
                        </td>
                        <td className="p-2">${entry.entryPrice.toLocaleString()}</td>
                        <td className="p-2">
                          {entry.exitPrice ? `$${entry.exitPrice.toLocaleString()}` : '-'}
                        </td>
                        <td className="p-2">{entry.confidence}%</td>
                        <td className="p-2">{entry.riskReward.toFixed(1)}</td>
                        <td className="p-2">{getStatusBadge(entry.status)}</td>
                        <td className="p-2">
                          {entry.pnl !== undefined ? (
                            <span className={entry.pnl >= 0 ? 'text-green-600' : 'text-red-600'}>
                              ${entry.pnl.toFixed(2)}
                            </span>
                          ) : '-'}
                        </td>
                        <td className="p-2 text-sm">{entry.strategy}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
            
            <TabsContent value="analytics" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Performance Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Wins:</span>
                        <span className="text-green-600 font-semibold">{stats.wins}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Losses:</span>
                        <span className="text-red-600 font-semibold">{stats.losses}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Average Win:</span>
                        <span className="text-green-600">${stats.avgWin.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Average Loss:</span>
                        <span className="text-red-600">$${stats.avgLoss.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Open Trades:</span>
                        <span className="text-blue-600">{stats.openTrades}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Strategy Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-4">
                      <p className="text-muted-foreground">Strategy breakdown chart would go here</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="filters" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <Input
                  placeholder="Symbol (BTC, ETH...)"
                  value={filters.symbol}
                  onChange={(e) => setFilters(prev => ({ ...prev, symbol: e.target.value }))}
                />
                
                <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All</SelectItem>
                    <SelectItem value="OPEN">Open</SelectItem>
                    <SelectItem value="WIN">Win</SelectItem>
                    <SelectItem value="LOSS">Loss</SelectItem>
                    <SelectItem value="BREAKEVEN">Breakeven</SelectItem>
                  </SelectContent>
                </Select>
                
                <Input
                  placeholder="Strategy"
                  value={filters.strategy}
                  onChange={(e) => setFilters(prev => ({ ...prev, strategy: e.target.value }))}
                />
                
                <Input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
                />
                
                <Input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
                />
              </div>
              
              <div className="text-sm text-muted-foreground">
                Showing {filteredEntries.length} of {entries.length} trades
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default TradingJournalDashboard;
