
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BookOpen, Plus, Filter, ArrowUpDown } from 'lucide-react';
import { addTradingJournalEntry, TradingJournalEntry } from '@/services/customTradingStrategyService';
import { toast } from "sonner";
import { TradeJournalEntry } from '@/types/asset';

interface TradingJournalProps {
  initialEntries?: TradingJournalEntry[];
}

const TradingJournal = ({ initialEntries = [] }: TradingJournalProps) => {
  const [entries, setEntries] = useState<TradingJournalEntry[]>(initialEntries);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    assetId: '',
    direction: 'long',
    entryPrice: '',
    stopLoss: '',
    targetPrice: '',
    positionSize: '',
    notes: '',
    strategy: 'KSM'
  });
  
  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.assetId || !formData.entryPrice || !formData.stopLoss) {
      toast.error("נא למלא את כל השדות הנדרשים");
      return;
    }
    
    try {
      const entryPrice = parseFloat(formData.entryPrice);
      const stopLoss = parseFloat(formData.stopLoss);
      const positionSize = parseFloat(formData.positionSize);
      
      // Calculate risk amount
      const riskPerUnit = Math.abs(entryPrice - stopLoss);
      const riskAmount = riskPerUnit * positionSize;
      
      // Mock account size for risk percentage calculation
      const mockAccountSize = 100000;
      const risk = (riskAmount / mockAccountSize) * 100;
      
      const newEntry = await addTradingJournalEntry({
        id: '',
        date: formData.date,
        assetId: formData.assetId,
        assetName: formData.assetId, // Using assetId as name for simplicity
        direction: formData.direction as 'long' | 'short',
        entryPrice,
        stopLoss,
        targetPrice: formData.targetPrice ? parseFloat(formData.targetPrice) : undefined,
        positionSize,
        risk,
        notes: formData.notes,
        strategy: formData.strategy,
        tags: []
      });
      
      setEntries(prev => [newEntry, ...prev]);
      setShowForm(false);
      setFormData({
        date: new Date().toISOString().split('T')[0],
        assetId: '',
        direction: 'long',
        entryPrice: '',
        stopLoss: '',
        targetPrice: '',
        positionSize: '',
        notes: '',
        strategy: 'KSM'
      });
      
    } catch (err: any) {
      toast.error("שגיאה בהוספת העסקה ליומן", {
        description: err.message
      });
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-right flex items-center justify-between">
          <BookOpen className="h-5 w-5" />
          <div>יומן מסחר</div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!showForm ? (
          <div className="flex justify-end mb-4">
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 ml-2" />
              הוסף עסקה חדשה
            </Button>
          </div>
        ) : (
          <Card className="mb-6 border">
            <CardHeader className="py-2">
              <CardTitle className="text-right text-base">עסקה חדשה</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4 text-right">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">תאריך</label>
                    <Input
                      type="date"
                      value={formData.date}
                      onChange={(e) => handleChange('date', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">נכס</label>
                    <Input
                      placeholder="למשל: BTC/USD"
                      value={formData.assetId}
                      onChange={(e) => handleChange('assetId', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">כיוון</label>
                    <Select
                      value={formData.direction}
                      onValueChange={(value) => handleChange('direction', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="long">קנייה (לונג)</SelectItem>
                        <SelectItem value="short">מכירה (שורט)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">גודל פוזיציה</label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="כמות"
                      value={formData.positionSize}
                      onChange={(e) => handleChange('positionSize', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">מחיר כניסה</label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="מחיר כניסה"
                      value={formData.entryPrice}
                      onChange={(e) => handleChange('entryPrice', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">סטופ לוס</label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="מחיר סטופ"
                      value={formData.stopLoss}
                      onChange={(e) => handleChange('stopLoss', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">יעד (אופציונלי)</label>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="מחיר יעד"
                      value={formData.targetPrice}
                      onChange={(e) => handleChange('targetPrice', e.target.value)}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1 block">הערות</label>
                  <Textarea
                    placeholder="הערות לעסקה, התבנית שזוהתה, וכו'"
                    value={formData.notes}
                    onChange={(e) => handleChange('notes', e.target.value)}
                    rows={3}
                  />
                </div>
                
                <div className="flex justify-center space-x-2 rtl:space-x-reverse">
                  <Button type="submit" className="w-1/3">
                    שמור עסקה
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-1/3"
                    onClick={() => setShowForm(false)}
                  >
                    ביטול
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
        
        {entries.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>אין עסקאות ביומן המסחר. הוסף את העסקה הראשונה שלך!</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex space-x-2 rtl:space-x-reverse">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 ml-1" />
                  סנן
                </Button>
                <Button variant="outline" size="sm">
                  <ArrowUpDown className="h-4 w-4 ml-1" />
                  מיין
                </Button>
              </div>
              <div className="text-sm text-muted-foreground">
                סה"כ {entries.length} עסקאות ביומן
              </div>
            </div>
            
            <div className="space-y-4 max-h-[500px] overflow-y-auto">
              {entries.map((entry) => (
                <Card key={entry.id} className="border shadow-sm">
                  <CardHeader className="py-2">
                    <CardTitle className="flex justify-between items-center">
                      <Badge className={
                        entry.outcome === 'win' ? 'bg-green-500' : 
                        entry.outcome === 'loss' ? 'bg-red-500' : 
                        'bg-gray-500'
                      }>
                        {entry.outcome === 'win' ? 'רווח' : 
                         entry.outcome === 'loss' ? 'הפסד' : 
                         'פתוח'}
                      </Badge>
                      <div className="flex items-center">
                        <span className="font-medium">{entry.assetName}</span>
                        <Badge className="mx-2" variant="outline">
                          {entry.direction === 'long' ? 'לונג' : 'שורט'}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {new Date(entry.date).toLocaleDateString('he-IL')}
                        </span>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="py-2">
                    <div className="grid grid-cols-3 gap-2 text-right mb-2">
                      <div>
                        <div className="text-xs text-muted-foreground">כניסה</div>
                        <div className="font-medium">{entry.entryPrice}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">סטופ</div>
                        <div className="font-medium">{entry.stopLoss}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">יעד</div>
                        <div className="font-medium">{entry.targetPrice || '-'}</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-right">
                      <div>
                        <div className="text-xs text-muted-foreground">גודל פוזיציה</div>
                        <div className="font-medium">{entry.positionSize}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">סיכון</div>
                        <div className="font-medium">
                          {entry.risk.toFixed(2)}% 
                          ({(entry.risk * 1000).toLocaleString()} ש"ח)
                        </div>
                      </div>
                    </div>
                    
                    {entry.notes && (
                      <div className="mt-2 border-t pt-2">
                        <div className="text-xs text-muted-foreground">הערות:</div>
                        <p className="text-sm mt-1">{entry.notes}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button variant="outline" className="w-1/2" disabled={entries.length === 0}>
          ייצוא היומן ל-CSV
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TradingJournal;
