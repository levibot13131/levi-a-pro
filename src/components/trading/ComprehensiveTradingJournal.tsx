
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Plus, TrendingUp, TrendingDown, Filter, Download } from 'lucide-react';
import { toast } from 'sonner';

interface JournalEntry {
  id: string;
  timestamp: number;
  symbol: string;
  direction: 'long' | 'short';
  entryPrice: number;
  exitPrice?: number;
  positionSize: number;
  stopLoss: number;
  takeProfit?: number;
  outcome?: 'profit' | 'loss' | 'breakeven' | 'open';
  profitPercent?: number;
  confidenceScore: number;
  strategy: string;
  notes: string;
  tags: string[];
  screenshots?: string[];
  isSignalBased: boolean;
  signalId?: string;
}

const ComprehensiveTradingJournal: React.FC = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [filter, setFilter] = useState<'all' | 'open' | 'closed' | 'profitable' | 'losses'>('all');
  const [formData, setFormData] = useState({
    symbol: '',
    direction: 'long' as 'long' | 'short',
    entryPrice: '',
    positionSize: '',
    stopLoss: '',
    takeProfit: '',
    confidenceScore: '7',
    strategy: '',
    notes: '',
    tags: ''
  });

  useEffect(() => {
    // Load existing entries from localStorage
    const saved = localStorage.getItem('levipro_trading_journal');
    if (saved) {
      setEntries(JSON.parse(saved));
    }

    // Listen for new signals to auto-add to journal
    const handleSignalSent = (event: CustomEvent) => {
      const { signal } = event.detail;
      addSignalToJournal(signal);
    };

    window.addEventListener('enhanced-signal-sent', handleSignalSent as EventListener);
    return () => window.removeEventListener('enhanced-signal-sent', handleSignalSent as EventListener);
  }, []);

  const addSignalToJournal = (signal: any) => {
    const newEntry: JournalEntry = {
      id: `signal-${Date.now()}`,
      timestamp: Date.now(),
      symbol: signal.symbol,
      direction: signal.action === 'buy' ? 'long' : 'short',
      entryPrice: signal.price,
      positionSize: signal.riskData?.recommendedPositionSize || 1,
      stopLoss: signal.stopLoss,
      takeProfit: signal.targetPrice,
      outcome: 'open',
      confidenceScore: signal.confidence * 10,
      strategy: signal.strategy,
      notes: `Auto-generated from ${signal.strategy} signal`,
      tags: ['signal-based', signal.qualityRating?.toLowerCase() || 'standard'],
      isSignalBased: true,
      signalId: signal.id
    };

    setEntries(prev => {
      const updated = [newEntry, ...prev];
      localStorage.setItem('levipro_trading_journal', JSON.stringify(updated));
      return updated;
    });

    toast.success('📝 Signal added to trading journal');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newEntry: JournalEntry = {
      id: `manual-${Date.now()}`,
      timestamp: Date.now(),
      symbol: formData.symbol.toUpperCase(),
      direction: formData.direction,
      entryPrice: parseFloat(formData.entryPrice),
      positionSize: parseFloat(formData.positionSize),
      stopLoss: parseFloat(formData.stopLoss),
      takeProfit: formData.takeProfit ? parseFloat(formData.takeProfit) : undefined,
      outcome: 'open',
      confidenceScore: parseInt(formData.confidenceScore),
      strategy: formData.strategy,
      notes: formData.notes,
      tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
      isSignalBased: false
    };

    setEntries(prev => {
      const updated = [newEntry, ...prev];
      localStorage.setItem('levipro_trading_journal', JSON.stringify(updated));
      return updated;
    });

    // Reset form
    setFormData({
      symbol: '',
      direction: 'long',
      entryPrice: '',
      positionSize: '',
      stopLoss: '',
      takeProfit: '',
      confidenceScore: '7',
      strategy: '',
      notes: '',
      tags: ''
    });

    setShowAddForm(false);
    toast.success('📝 Trade added to journal');
  };

  const updateEntry = (id: string, updates: Partial<JournalEntry>) => {
    setEntries(prev => {
      const updated = prev.map(entry => 
        entry.id === id ? { ...entry, ...updates } : entry
      );
      localStorage.setItem('levipro_trading_journal', JSON.stringify(updated));
      return updated;
    });
  };

  const closePosition = (id: string, exitPrice: number, outcome: 'profit' | 'loss' | 'breakeven') => {
    const entry = entries.find(e => e.id === id);
    if (!entry) return;

    const profitPercent = ((exitPrice - entry.entryPrice) / entry.entryPrice) * 100;
    const adjustedProfitPercent = entry.direction === 'short' ? -profitPercent : profitPercent;

    updateEntry(id, {
      exitPrice,
      outcome,
      profitPercent: adjustedProfitPercent
    });

    toast.success(`📊 Position closed: ${adjustedProfitPercent.toFixed(2)}%`);
  };

  const filteredEntries = entries.filter(entry => {
    switch (filter) {
      case 'open': return entry.outcome === 'open';
      case 'closed': return entry.outcome !== 'open';
      case 'profitable': return entry.outcome === 'profit';
      case 'losses': return entry.outcome === 'loss';
      default: return true;
    }
  });

  const stats = {
    total: entries.length,
    open: entries.filter(e => e.outcome === 'open').length,
    profitable: entries.filter(e => e.outcome === 'profit').length,
    losses: entries.filter(e => e.outcome === 'loss').length,
    winRate: entries.length > 0 ? (entries.filter(e => e.outcome === 'profit').length / entries.filter(e => e.outcome !== 'open').length * 100) || 0 : 0
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-muted-foreground">Total Trades</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{stats.open}</div>
            <div className="text-sm text-muted-foreground">Open Positions</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.profitable}</div>
            <div className="text-sm text-muted-foreground">Profitable</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{stats.losses}</div>
            <div className="text-sm text-muted-foreground">Losses</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{stats.winRate.toFixed(1)}%</div>
            <div className="text-sm text-muted-foreground">Win Rate</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Journal */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Trading Journal
            </div>
            <div className="flex gap-2">
              <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Trades</SelectItem>
                  <SelectItem value="open">Open Positions</SelectItem>
                  <SelectItem value="closed">Closed Trades</SelectItem>
                  <SelectItem value="profitable">Profitable</SelectItem>
                  <SelectItem value="losses">Losses</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={() => setShowAddForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Trade
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {showAddForm && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Add New Trade</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Symbol</Label>
                    <Input
                      value={formData.symbol}
                      onChange={(e) => setFormData({...formData, symbol: e.target.value})}
                      placeholder="BTCUSDT"
                      required
                    />
                  </div>
                  <div>
                    <Label>Direction</Label>
                    <Select value={formData.direction} onValueChange={(value: any) => setFormData({...formData, direction: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="long">Long</SelectItem>
                        <SelectItem value="short">Short</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Entry Price</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.entryPrice}
                      onChange={(e) => setFormData({...formData, entryPrice: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label>Position Size (%)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={formData.positionSize}
                      onChange={(e) => setFormData({...formData, positionSize: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label>Stop Loss</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.stopLoss}
                      onChange={(e) => setFormData({...formData, stopLoss: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label>Take Profit</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.takeProfit}
                      onChange={(e) => setFormData({...formData, takeProfit: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>Confidence (1-10)</Label>
                    <Input
                      type="number"
                      min="1"
                      max="10"
                      value={formData.confidenceScore}
                      onChange={(e) => setFormData({...formData, confidenceScore: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>Strategy</Label>
                    <Input
                      value={formData.strategy}
                      onChange={(e) => setFormData({...formData, strategy: e.target.value})}
                      placeholder="Personal Method"
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <Label>Notes</Label>
                    <Textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
                      placeholder="Trade reasoning and observations..."
                    />
                  </div>
                  <div className="col-span-2">
                    <Label>Tags (comma separated)</Label>
                    <Input
                      value={formData.tags}
                      onChange={(e) => setFormData({...formData, tags: e.target.value})}
                      placeholder="breakout, momentum, news-driven"
                    />
                  </div>
                  <div className="col-span-2 flex gap-2">
                    <Button type="submit">Add Trade</Button>
                    <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          <div className="space-y-4">
            {filteredEntries.map((entry) => (
              <Card key={entry.id} className="border-l-4 border-l-blue-500">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <Badge variant={entry.direction === 'long' ? 'default' : 'secondary'}>
                        {entry.direction.toUpperCase()}
                      </Badge>
                      <span className="font-semibold">{entry.symbol}</span>
                      <Badge variant="outline">{entry.strategy}</Badge>
                      {entry.isSignalBased && <Badge variant="secondary">Signal-Based</Badge>}
                    </div>
                    <div className="flex items-center gap-2">
                      {entry.outcome === 'open' ? (
                        <Badge variant="outline" className="bg-orange-50">Open</Badge>
                      ) : entry.outcome === 'profit' ? (
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          +{entry.profitPercent?.toFixed(2)}%
                        </Badge>
                      ) : entry.outcome === 'loss' ? (
                        <Badge variant="destructive" className="bg-red-100 text-red-800">
                          <TrendingDown className="h-3 w-3 mr-1" />
                          {entry.profitPercent?.toFixed(2)}%
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Breakeven</Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Entry:</span>
                      <div className="font-medium">${entry.entryPrice.toFixed(2)}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Size:</span>
                      <div className="font-medium">{entry.positionSize}%</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Stop Loss:</span>
                      <div className="font-medium">${entry.stopLoss.toFixed(2)}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Confidence:</span>
                      <div className="font-medium">{entry.confidenceScore}/10</div>
                    </div>
                  </div>

                  {entry.notes && (
                    <div className="mt-2 text-sm text-muted-foreground">
                      {entry.notes}
                    </div>
                  )}

                  {entry.tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {entry.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {entry.outcome === 'open' && (
                    <div className="mt-3 flex gap-2">
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="Exit price"
                        className="w-32"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            const exitPrice = parseFloat((e.target as HTMLInputElement).value);
                            if (exitPrice) {
                              const profitPercent = ((exitPrice - entry.entryPrice) / entry.entryPrice) * 100;
                              const adjustedProfitPercent = entry.direction === 'short' ? -profitPercent : profitPercent;
                              const outcome = adjustedProfitPercent > 0 ? 'profit' : adjustedProfitPercent < 0 ? 'loss' : 'breakeven';
                              closePosition(entry.id, exitPrice, outcome);
                            }
                          }
                        }}
                      />
                      <Button size="sm" variant="outline">
                        Close Position
                      </Button>
                    </div>
                  )}

                  <div className="mt-2 text-xs text-muted-foreground">
                    {new Date(entry.timestamp).toLocaleString()}
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredEntries.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No trades found for the selected filter.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComprehensiveTradingJournal;
