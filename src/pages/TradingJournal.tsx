import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  DollarSign,
  Target,
  Shield,
  Plus,
  Filter
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import Navbar from '@/components/layout/Navbar';

interface JournalEntry {
  id: string;
  signal_id: string;
  symbol: string;
  action: 'BUY' | 'SELL';
  entry_price: number;
  target_price: number;
  stop_loss: number;
  exit_price?: number;
  outcome?: 'profit' | 'loss' | 'breakeven';
  confidence: number;
  notes: string;
  created_at: string;
  closed_at?: string;
  profit_loss_percentage?: number;
}

const TradingJournal: React.FC = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [newNote, setNewNote] = useState('');
  const [selectedEntry, setSelectedEntry] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'profit' | 'loss' | 'open'>('all');

  useEffect(() => {
    loadJournalEntries();
  }, []);

  const loadJournalEntries = async () => {
    try {
      const { data, error } = await supabase
        .from('signal_history')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      const formattedEntries: JournalEntry[] = data.map(signal => ({
        id: signal.id,
        signal_id: signal.signal_id,
        symbol: signal.symbol,
        action: signal.action as 'BUY' | 'SELL',
        entry_price: signal.entry_price,
        target_price: signal.target_price,
        stop_loss: signal.stop_loss,
        exit_price: signal.exit_price,
        outcome: signal.outcome as 'profit' | 'loss' | 'breakeven',
        confidence: signal.confidence,
        notes: signal.reasoning || '',
        created_at: signal.created_at,
        closed_at: signal.closed_at,
        profit_loss_percentage: signal.actual_profit_loss
      }));

      setEntries(formattedEntries);
    } catch (error) {
      console.error('Error loading journal entries:', error);
      toast.error('שגיאה בטעינת היומן');
    }
  };

  const addNote = async (entryId: string) => {
    if (!newNote.trim()) return;

    try {
      const { error } = await supabase
        .from('signal_history')
        .update({ 
          reasoning: newNote 
        })
        .eq('id', entryId);

      if (error) throw error;

      setEntries(prev => 
        prev.map(entry => 
          entry.id === entryId 
            ? { ...entry, notes: newNote }
            : entry
        )
      );

      setNewNote('');
      setSelectedEntry(null);
      toast.success('הערה נוספה בהצלחה');
    } catch (error) {
      console.error('Error adding note:', error);
      toast.error('שגיאה בהוספת הערה');
    }
  };

  const filteredEntries = entries.filter(entry => {
    if (filter === 'all') return true;
    if (filter === 'open') return !entry.closed_at;
    return entry.outcome === filter;
  });

  const stats = {
    total: entries.length,
    profitable: entries.filter(e => e.outcome === 'profit').length,
    losses: entries.filter(e => e.outcome === 'loss').length,
    winRate: entries.length > 0 ? (entries.filter(e => e.outcome === 'profit').length / entries.filter(e => e.closed_at).length * 100) : 0,
    avgProfit: entries.filter(e => e.profit_loss_percentage).reduce((acc, e) => acc + (e.profit_loss_percentage || 0), 0) / Math.max(1, entries.filter(e => e.profit_loss_percentage).length)
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar />
      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">יומן מסחר LeviPro</h1>
            <p className="text-gray-600">מעקב מפורט אחר כל האיתותים והתוצאות</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                <div className="text-sm text-gray-600">סה"כ איתותים</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{stats.profitable}</div>
                <div className="text-sm text-gray-600">איתותים רווחיים</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">{stats.winRate.toFixed(1)}%</div>
                <div className="text-sm text-gray-600">אחוז הצלחה</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <div className={`text-2xl font-bold ${stats.avgProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {stats.avgProfit.toFixed(2)}%
                </div>
                <div className="text-sm text-gray-600">רווח ממוצע</div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex gap-2 flex-wrap">
                <Button 
                  variant={filter === 'all' ? 'default' : 'outline'}
                  onClick={() => setFilter('all')}
                  size="sm"
                >
                  <Filter className="w-4 h-4 mr-1" />
                  הכל
                </Button>
                <Button 
                  variant={filter === 'open' ? 'default' : 'outline'}
                  onClick={() => setFilter('open')}
                  size="sm"
                >
                  <Clock className="w-4 h-4 mr-1" />
                  פתוחים
                </Button>
                <Button 
                  variant={filter === 'profit' ? 'default' : 'outline'}
                  onClick={() => setFilter('profit')}
                  size="sm"
                >
                  <TrendingUp className="w-4 h-4 mr-1" />
                  רווחיים
                </Button>
                <Button 
                  variant={filter === 'loss' ? 'default' : 'outline'}
                  onClick={() => setFilter('loss')}
                  size="sm"
                >
                  <TrendingDown className="w-4 h-4 mr-1" />
                  הפסדיים
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Journal Entries */}
          <div className="space-y-4">
            {filteredEntries.map((entry) => (
              <Card key={entry.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <Badge variant={entry.action === 'BUY' ? 'default' : 'destructive'}>
                        {entry.action}
                      </Badge>
                      <div className="font-bold text-lg">{entry.symbol}</div>
                      {entry.outcome && (
                        <Badge variant={entry.outcome === 'profit' ? 'default' : entry.outcome === 'loss' ? 'destructive' : 'secondary'}>
                          {entry.outcome === 'profit' ? 'רווח' : entry.outcome === 'loss' ? 'הפסד' : 'ללא רווח'}
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(entry.created_at).toLocaleString('he-IL')}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <div className="text-gray-500">מחיר כניסה</div>
                      <div className="font-semibold">${entry.entry_price.toFixed(2)}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">יעד</div>
                      <div className="font-semibold text-green-600">${entry.target_price.toFixed(2)}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">סטופ לוס</div>
                      <div className="font-semibold text-red-600">${entry.stop_loss.toFixed(2)}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">ביטחון</div>
                      <div className="font-semibold">{entry.confidence}%</div>
                    </div>
                  </div>

                  {entry.exit_price && (
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-gray-500">מחיר יציאה</div>
                        <div className="font-semibold">${entry.exit_price.toFixed(2)}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">רווח/הפסד</div>
                        <div className={`font-semibold ${(entry.profit_loss_percentage || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {entry.profit_loss_percentage?.toFixed(2)}%
                        </div>
                      </div>
                    </div>
                  )}

                  {entry.notes && (
                    <div className="bg-gray-50 p-3 rounded text-sm">
                      <div className="text-gray-500 mb-1">הערות:</div>
                      <div>{entry.notes}</div>
                    </div>
                  )}

                  {selectedEntry === entry.id ? (
                    <div className="space-y-2">
                      <Textarea
                        placeholder="הוסף הערה..."
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        className="text-right"
                      />
                      <div className="flex gap-2">
                        <Button onClick={() => addNote(entry.id)} size="sm">
                          שמור
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => setSelectedEntry(null)} 
                          size="sm"
                        >
                          ביטול
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedEntry(entry.id)}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      הוסף הערה
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredEntries.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <BookOpen className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">אין רשומות</h3>
                <p className="text-gray-500">טרם נוצרו איתותים במערכת</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default TradingJournal;