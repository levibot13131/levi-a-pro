
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  BookOpen, 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  DollarSign,
  Calendar,
  Filter,
  Download,
  Target,
  Shield
} from 'lucide-react';
import { toast } from 'sonner';

interface JournalEntry {
  id: string;
  type: 'signal' | 'manual';
  symbol: string;
  action: 'BUY' | 'SELL';
  entryPrice: number;
  exitPrice?: number;
  stopLoss: number;
  targetPrice?: number;
  quantity: number;
  confidence: number;
  reasoning: string;
  timestamp: number;
  exitTimestamp?: number;
  status: 'open' | 'win' | 'loss' | 'break-even';
  pnl?: number;
  pnlPercentage?: number;
  strategy: string;
  timeframe: string;
}

interface PerformanceStats {
  totalTrades: number;
  winRate: number;
  avgRiskReward: number;
  totalPnL: number;
  totalPnLPercentage: number;
  avgConfidence: number;
  bestTrade: number;
  worstTrade: number;
}

const TradingJournalDashboard: React.FC = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<JournalEntry[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [filterSymbol, setFilterSymbol] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterDateFrom, setFilterDateFrom] = useState<string>('');
  const [filterDateTo, setFilterDateTo] = useState<string>('');

  // Form state for manual entry
  const [formData, setFormData] = useState({
    symbol: 'BTCUSDT',
    action: 'BUY' as 'BUY' | 'SELL',
    entryPrice: '',
    stopLoss: '',
    targetPrice: '',
    quantity: '',
    reasoning: '',
    strategy: 'Manual Entry',
    timeframe: '1h'
  });

  useEffect(() => {
    loadJournalEntries();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [entries, filterSymbol, filterStatus, filterDateFrom, filterDateTo]);

  const loadJournalEntries = () => {
    // Load from localStorage and signal history
    const savedEntries = localStorage.getItem('tradingJournal');
    const parsed = savedEntries ? JSON.parse(savedEntries) : [];
    
    // Add mock signal entries for demonstration
    const mockSignalEntries: JournalEntry[] = [
      {
        id: '1',
        type: 'signal',
        symbol: 'BTCUSDT',
        action: 'BUY',
        entryPrice: 101500,
        exitPrice: 103500,
        stopLoss: 99000,
        targetPrice: 105000,
        quantity: 0.1,
        confidence: 85,
        reasoning: 'Multi-timeframe confluence + volume spike',
        timestamp: Date.now() - 86400000,
        exitTimestamp: Date.now() - 43200000,
        status: 'win',
        pnl: 200,
        pnlPercentage: 1.97,
        strategy: 'Multi-Timeframe + Sentiment',
        timeframe: '15m-4h'
      },
      {
        id: '2',
        type: 'signal',
        symbol: 'ETHUSDT',
        action: 'SELL',
        entryPrice: 2400,
        stopLoss: 2450,
        targetPrice: 2300,
        quantity: 1,
        confidence: 78,
        reasoning: 'Resistance level rejection + bearish sentiment',
        timestamp: Date.now() - 3600000,
        status: 'open',
        strategy: 'Support/Resistance',
        timeframe: '1h'
      }
    ];

    const allEntries = [...parsed, ...mockSignalEntries];
    setEntries(allEntries);
  };

  const applyFilters = () => {
    let filtered = [...entries];

    if (filterSymbol !== 'all') {
      filtered = filtered.filter(entry => entry.symbol === filterSymbol);
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(entry => entry.status === filterStatus);
    }

    if (filterDateFrom) {
      const fromDate = new Date(filterDateFrom).getTime();
      filtered = filtered.filter(entry => entry.timestamp >= fromDate);
    }

    if (filterDateTo) {
      const toDate = new Date(filterDateTo).getTime() + 86400000; // Add one day
      filtered = filtered.filter(entry => entry.timestamp <= toDate);
    }

    setFilteredEntries(filtered);
  };

  const calculateStats = (): PerformanceStats => {
    const closedTrades = entries.filter(e => e.status !== 'open');
    const winningTrades = closedTrades.filter(e => e.status === 'win');
    
    const totalPnL = closedTrades.reduce((sum, trade) => sum + (trade.pnl || 0), 0);
    const winRate = closedTrades.length > 0 ? (winningTrades.length / closedTrades.length) * 100 : 0;
    
    const avgConfidence = entries.length > 0 ? 
      entries.reduce((sum, e) => sum + e.confidence, 0) / entries.length : 0;

    const pnlValues = closedTrades.map(t => t.pnl || 0);
    const bestTrade = pnlValues.length > 0 ? Math.max(...pnlValues) : 0;
    const worstTrade = pnlValues.length > 0 ? Math.min(...pnlValues) : 0;

    return {
      totalTrades: entries.length,
      winRate,
      avgRiskReward: 2.1, // Would calculate from actual trades
      totalPnL,
      totalPnLPercentage: 5.8, // Would calculate from actual account size
      avgConfidence,
      bestTrade,
      worstTrade
    };
  };

  const handleAddManualEntry = () => {
    if (!formData.symbol || !formData.entryPrice || !formData.stopLoss) {
      toast.error('Please fill in required fields');
      return;
    }

    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      type: 'manual',
      symbol: formData.symbol,
      action: formData.action,
      entryPrice: parseFloat(formData.entryPrice),
      stopLoss: parseFloat(formData.stopLoss),
      targetPrice: formData.targetPrice ? parseFloat(formData.targetPrice) : undefined,
      quantity: parseFloat(formData.quantity) || 1,
      confidence: 75, // Default for manual entries
      reasoning: formData.reasoning || 'Manual entry',
      timestamp: Date.now(),
      status: 'open',
      strategy: formData.strategy,
      timeframe: formData.timeframe
    };

    const updatedEntries = [...entries, newEntry];
    setEntries(updatedEntries);
    localStorage.setItem('tradingJournal', JSON.stringify(updatedEntries.filter(e => e.type === 'manual')));
    
    // Reset form
    setFormData({
      symbol: 'BTCUSDT',
      action: 'BUY',
      entryPrice: '',
      stopLoss: '',
      targetPrice: '',
      quantity: '',
      reasoning: '',
      strategy: 'Manual Entry',
      timeframe: '1h'
    });
    
    setShowAddForm(false);
    toast.success('Trade added to journal');
  };

  const exportToCSV = () => {
    const headers = ['Date', 'Symbol', 'Action', 'Entry Price', 'Exit Price', 'Stop Loss', 'Target', 'Quantity', 'Status', 'PnL', 'PnL %', 'Confidence', 'Strategy', 'Reasoning'];
    
    const csvData = filteredEntries.map(entry => [
      new Date(entry.timestamp).toLocaleDateString(),
      entry.symbol,
      entry.action,
      entry.entryPrice,
      entry.exitPrice || '',
      entry.stopLoss,
      entry.targetPrice || '',
      entry.quantity,
      entry.status,
      entry.pnl || '',
      entry.pnlPercentage || '',
      entry.confidence,
      entry.strategy,
      entry.reasoning
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `trading_journal_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success('Journal exported to CSV');
  };

  const stats = calculateStats();
  const uniqueSymbols = [...new Set(entries.map(e => e.symbol))];

  return (
    <div className="space-y-6">
      {/* Performance Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Trades</p>
                <p className="text-2xl font-bold">{stats.totalTrades}</p>
              </div>
              <BookOpen className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Win Rate</p>
                <p className="text-2xl font-bold text-green-500">{stats.winRate.toFixed(1)}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total PnL</p>
                <p className={`text-2xl font-bold ${stats.totalPnL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  ${stats.totalPnL.toFixed(2)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Confidence</p>
                <p className="text-2xl font-bold">{stats.avgConfidence.toFixed(0)}%</p>
              </div>
              <Target className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="entries" className="space-y-4">
        <TabsList>
          <TabsTrigger value="entries">Trade Entries</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="add">Add Trade</TabsTrigger>
        </TabsList>

        <TabsContent value="entries" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filters
                </div>
                <Button variant="outline" onClick={exportToCSV}>
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Select value={filterSymbol} onValueChange={setFilterSymbol}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Symbols" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Symbols</SelectItem>
                    {uniqueSymbols.map(symbol => (
                      <SelectItem key={symbol} value={symbol}>{symbol}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="win">Win</SelectItem>
                    <SelectItem value="loss">Loss</SelectItem>
                    <SelectItem value="break-even">Break Even</SelectItem>
                  </SelectContent>
                </Select>

                <Input
                  type="date"
                  placeholder="From Date"
                  value={filterDateFrom}
                  onChange={(e) => setFilterDateFrom(e.target.value)}
                />

                <Input
                  type="date"
                  placeholder="To Date"
                  value={filterDateTo}
                  onChange={(e) => setFilterDateTo(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Entries List */}
          <div className="space-y-4">
            {filteredEntries.map(entry => (
              <Card key={entry.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant={entry.type === 'signal' ? 'default' : 'secondary'}>
                          {entry.type === 'signal' ? '🤖 Signal' : '✋ Manual'}
                        </Badge>
                        <Badge variant={entry.action === 'BUY' ? 'default' : 'destructive'}>
                          {entry.action}
                        </Badge>
                        <Badge variant={
                          entry.status === 'win' ? 'default' : 
                          entry.status === 'loss' ? 'destructive' : 
                          'secondary'
                        }>
                          {entry.status.toUpperCase()}
                        </Badge>
                      </div>
                      
                      <h3 className="font-semibold text-lg">{entry.symbol}</h3>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Entry: </span>
                          ${entry.entryPrice.toLocaleString()}
                        </div>
                        {entry.exitPrice && (
                          <div>
                            <span className="text-muted-foreground">Exit: </span>
                            ${entry.exitPrice.toLocaleString()}
                          </div>
                        )}
                        <div>
                          <span className="text-muted-foreground">Stop: </span>
                          ${entry.stopLoss.toLocaleString()}
                        </div>
                        {entry.targetPrice && (
                          <div>
                            <span className="text-muted-foreground">Target: </span>
                            ${entry.targetPrice.toLocaleString()}
                          </div>
                        )}
                      </div>
                      
                      <p className="text-sm text-muted-foreground">{entry.reasoning}</p>
                    </div>
                    
                    <div className="text-right space-y-1">
                      <div className="text-sm text-muted-foreground">
                        {new Date(entry.timestamp).toLocaleDateString()}
                      </div>
                      <div className="text-sm font-medium">
                        Confidence: {entry.confidence}%
                      </div>
                      {entry.pnl !== undefined && (
                        <div className={`font-bold ${entry.pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {entry.pnl >= 0 ? '+' : ''}${entry.pnl.toFixed(2)}
                          {entry.pnlPercentage && ` (${entry.pnlPercentage >= 0 ? '+' : ''}${entry.pnlPercentage.toFixed(2)}%)`}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Best Trade:</span>
                  <span className="text-green-500 font-bold">+${stats.bestTrade.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Worst Trade:</span>
                  <span className="text-red-500 font-bold">${stats.worstTrade.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Avg R/R Ratio:</span>
                  <span className="font-bold">{stats.avgRiskReward.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Return:</span>
                  <span className={`font-bold ${stats.totalPnLPercentage >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {stats.totalPnLPercentage >= 0 ? '+' : ''}{stats.totalPnLPercentage.toFixed(2)}%
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Trade Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Winning Trades</span>
                      <span>{stats.winRate.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${stats.winRate}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>Signal vs Manual</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>🤖 Signal Trades: {entries.filter(e => e.type === 'signal').length}</span>
                        <span>✋ Manual Trades: {entries.filter(e => e.type === 'manual').length}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="add">
          <Card>
            <CardHeader>
              <CardTitle>Add Manual Trade</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Symbol</label>
                  <Input
                    value={formData.symbol}
                    onChange={(e) => setFormData({...formData, symbol: e.target.value.toUpperCase()})}
                    placeholder="BTCUSDT"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Action</label>
                  <Select value={formData.action} onValueChange={(value: 'BUY' | 'SELL') => setFormData({...formData, action: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BUY">BUY</SelectItem>
                      <SelectItem value="SELL">SELL</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Entry Price *</label>
                  <Input
                    type="number"
                    value={formData.entryPrice}
                    onChange={(e) => setFormData({...formData, entryPrice: e.target.value})}
                    placeholder="50000"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Stop Loss *</label>
                  <Input
                    type="number"
                    value={formData.stopLoss}
                    onChange={(e) => setFormData({...formData, stopLoss: e.target.value})}
                    placeholder="48000"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Target Price</label>
                  <Input
                    type="number"
                    value={formData.targetPrice}
                    onChange={(e) => setFormData({...formData, targetPrice: e.target.value})}
                    placeholder="55000"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Quantity</label>
                  <Input
                    type="number"
                    step="0.001"
                    value={formData.quantity}
                    onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                    placeholder="0.1"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Strategy</label>
                  <Input
                    value={formData.strategy}
                    onChange={(e) => setFormData({...formData, strategy: e.target.value})}
                    placeholder="Manual Entry"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Timeframe</label>
                  <Select value={formData.timeframe} onValueChange={(value) => setFormData({...formData, timeframe: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5m">5m</SelectItem>
                      <SelectItem value="15m">15m</SelectItem>
                      <SelectItem value="1h">1h</SelectItem>
                      <SelectItem value="4h">4h</SelectItem>
                      <SelectItem value="1d">1d</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Reasoning</label>
                <Textarea
                  value={formData.reasoning}
                  onChange={(e) => setFormData({...formData, reasoning: e.target.value})}
                  placeholder="Explain your trade setup and reasoning..."
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleAddManualEntry}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Trade
                </Button>
                <Button variant="outline" onClick={() => setFormData({
                  symbol: 'BTCUSDT',
                  action: 'BUY',
                  entryPrice: '',
                  stopLoss: '',
                  targetPrice: '',
                  quantity: '',
                  reasoning: '',
                  strategy: 'Manual Entry',
                  timeframe: '1h'
                })}>
                  Clear Form
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TradingJournalDashboard;
