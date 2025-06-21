
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { BookOpen, TrendingUp, TrendingDown, Target, AlertCircle } from 'lucide-react';
import { TradingSignal } from '@/types/trading';
import { tradingEngine } from '@/services/trading/tradingEngine';

interface TradeNote {
  id: string;
  signalId: string;
  symbol: string;
  strategy: string;
  outcome: 'win' | 'loss' | 'pending';
  profitLoss: number;
  notes: string;
  lessonsLearned: string;
  timestamp: number;
}

interface PerformanceStats {
  totalTrades: number;
  winRate: number;
  avgProfit: number;
  avgLoss: number;
  profitFactor: number;
  bestTrade: number;
  worstTrade: number;
  strategyPerformance: { [key: string]: { wins: number; losses: number; profit: number } };
}

const TradeJournal: React.FC = () => {
  const [signals, setSignals] = useState<TradingSignal[]>([]);
  const [tradeNotes, setTradeNotes] = useState<TradeNote[]>([]);
  const [selectedSignal, setSelectedSignal] = useState<TradingSignal | null>(null);
  const [newNote, setNewNote] = useState('');
  const [lessonsLearned, setLessonsLearned] = useState('');
  const [performanceStats, setPerformanceStats] = useState<PerformanceStats | null>(null);

  useEffect(() => {
    loadTradeData();
    const interval = setInterval(loadTradeData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadTradeData = () => {
    const allSignals = tradingEngine.getAllSignals();
    setSignals(allSignals);
    calculatePerformanceStats(allSignals);
  };

  const calculatePerformanceStats = (allSignals: TradingSignal[]) => {
    const completedTrades = allSignals.filter(s => s.status === 'completed');
    
    if (completedTrades.length === 0) {
      setPerformanceStats(null);
      return;
    }

    const wins = completedTrades.filter(t => (t.profitPercent || 0) > 0);
    const losses = completedTrades.filter(t => (t.profitPercent || 0) < 0);
    
    const totalProfit = wins.reduce((sum, t) => sum + (t.profitPercent || 0), 0);
    const totalLoss = Math.abs(losses.reduce((sum, t) => sum + (t.profitPercent || 0), 0));
    
    const strategyPerformance: { [key: string]: { wins: number; losses: number; profit: number } } = {};
    
    completedTrades.forEach(trade => {
      if (!strategyPerformance[trade.strategy]) {
        strategyPerformance[trade.strategy] = { wins: 0, losses: 0, profit: 0 };
      }
      
      const profit = trade.profitPercent || 0;
      if (profit > 0) {
        strategyPerformance[trade.strategy].wins++;
      } else {
        strategyPerformance[trade.strategy].losses++;
      }
      strategyPerformance[trade.strategy].profit += profit;
    });

    const stats: PerformanceStats = {
      totalTrades: completedTrades.length,
      winRate: (wins.length / completedTrades.length) * 100,
      avgProfit: wins.length > 0 ? totalProfit / wins.length : 0,
      avgLoss: losses.length > 0 ? totalLoss / losses.length : 0,
      profitFactor: totalLoss > 0 ? totalProfit / totalLoss : totalProfit,
      bestTrade: Math.max(...completedTrades.map(t => t.profitPercent || 0)),
      worstTrade: Math.min(...completedTrades.map(t => t.profitPercent || 0)),
      strategyPerformance
    };

    setPerformanceStats(stats);
  };

  const addTradeNote = () => {
    if (!selectedSignal || !newNote.trim()) {
      toast.error('יש לבחור איתות ולהוסיף הערה');
      return;
    }

    const note: TradeNote = {
      id: `note-${Date.now()}`,
      signalId: selectedSignal.id,
      symbol: selectedSignal.symbol,
      strategy: selectedSignal.strategy,
      outcome: selectedSignal.status === 'completed' 
        ? (selectedSignal.profitPercent || 0) > 0 ? 'win' : 'loss'
        : 'pending',
      profitLoss: selectedSignal.profitPercent || 0,
      notes: newNote,
      lessonsLearned,
      timestamp: Date.now()
    };

    setTradeNotes(prev => [...prev, note]);
    setNewNote('');
    setLessonsLearned('');
    setSelectedSignal(null);
    toast.success('הערה נוספה ליומן');
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('he-IL');
  };

  const getOutcomeColor = (outcome: string) => {
    switch (outcome) {
      case 'win': return 'text-green-600';
      case 'loss': return 'text-red-600';
      default: return 'text-yellow-600';
    }
  };

  const getOutcomeIcon = (outcome: string) => {
    switch (outcome) {
      case 'win': return <TrendingUp className="h-4 w-4" />;
      case 'loss': return <TrendingDown className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            יומן מסחר
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="journal" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="journal">יומן</TabsTrigger>
              <TabsTrigger value="performance">ביצועים</TabsTrigger>
              <TabsTrigger value="add-note">הוסף הערה</TabsTrigger>
            </TabsList>

            <TabsContent value="journal" className="space-y-4">
              <div className="space-y-4">
                {tradeNotes.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>לא נוספו הערות ליומן עדיין</p>
                  </div>
                ) : (
                  tradeNotes.map(note => (
                    <Card key={note.id} className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline">{note.symbol}</Badge>
                            <Badge variant="secondary">{note.strategy}</Badge>
                            <div className={`flex items-center gap-1 ${getOutcomeColor(note.outcome)}`}>
                              {getOutcomeIcon(note.outcome)}
                              <span className="text-sm font-medium">
                                {note.outcome === 'win' ? 'רווח' : note.outcome === 'loss' ? 'הפסד' : 'ממתין'}
                              </span>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(note.timestamp)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className={`font-bold ${note.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {note.profitLoss >= 0 ? '+' : ''}{note.profitLoss.toFixed(2)}%
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div>
                          <p className="text-sm font-medium mb-1">הערות:</p>
                          <p className="text-sm text-muted-foreground">{note.notes}</p>
                        </div>
                        {note.lessonsLearned && (
                          <div>
                            <p className="text-sm font-medium mb-1">לקחים:</p>
                            <p className="text-sm text-muted-foreground">{note.lessonsLearned}</p>
                          </div>
                        )}
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="performance" className="space-y-4">
              {performanceStats ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card className="p-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">
                        {performanceStats.winRate.toFixed(1)}%
                      </p>
                      <p className="text-sm text-muted-foreground">שיעור הצלחה</p>
                    </div>
                  </Card>
                  
                  <Card className="p-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold">
                        {performanceStats.totalTrades}
                      </p>
                      <p className="text-sm text-muted-foreground">סך עסקאות</p>
                    </div>
                  </Card>
                  
                  <Card className="p-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">
                        {performanceStats.profitFactor.toFixed(2)}
                      </p>
                      <p className="text-sm text-muted-foreground">יחס רווח</p>
                    </div>
                  </Card>
                  
                  <Card className="p-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">
                        +{performanceStats.avgProfit.toFixed(2)}%
                      </p>
                      <p className="text-sm text-muted-foreground">רווח ממוצע</p>
                    </div>
                  </Card>
                  
                  <Card className="p-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-red-600">
                        -{performanceStats.avgLoss.toFixed(2)}%
                      </p>
                      <p className="text-sm text-muted-foreground">הפסד ממוצע</p>
                    </div>
                  </Card>
                  
                  <Card className="p-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">
                        +{performanceStats.bestTrade.toFixed(2)}%
                      </p>
                      <p className="text-sm text-muted-foreground">עסקה הטובה ביותר</p>
                    </div>
                  </Card>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>אין נתוני ביצועים זמינים עדיין</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="add-note" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">בחר איתות:</label>
                  <select 
                    className="w-full p-2 border rounded-md"
                    value={selectedSignal?.id || ''}
                    onChange={(e) => {
                      const signal = signals.find(s => s.id === e.target.value);
                      setSelectedSignal(signal || null);
                    }}
                  >
                    <option value="">-- בחר איתות --</option>
                    {signals.map(signal => (
                      <option key={signal.id} value={signal.id}>
                        {signal.symbol} - {signal.strategy} ({formatDate(signal.timestamp)})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">הערות על העסקה:</label>
                  <Textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="הוסף הערות על ביצוע העסקה, תנאי השוק, רגשות..."
                    rows={3}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">לקחים שנלמדו:</label>
                  <Textarea
                    value={lessonsLearned}
                    onChange={(e) => setLessonsLearned(e.target.value)}
                    placeholder="מה למדת מהעסקה הזו? איך תשפר בפעם הבאה?"
                    rows={3}
                  />
                </div>

                <Button onClick={addTradeNote} className="w-full">
                  הוסף ליומן
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default TradeJournal;
