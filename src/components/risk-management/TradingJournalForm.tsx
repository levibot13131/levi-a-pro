
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from "sonner";

interface TradingJournalFormProps {
  onSubmit: (formData: TradingJournalFormData) => void;
  onCancel: () => void;
}

export interface TradingJournalFormData {
  date: string;
  assetId: string;
  direction: 'long' | 'short';
  entryPrice: string;
  stopLoss: string;
  targetPrice: string;
  positionSize: string;
  notes: string;
  strategy: string;
}

const TradingJournalForm = ({ onSubmit, onCancel }: TradingJournalFormProps) => {
  const [formData, setFormData] = useState<TradingJournalFormData>({
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
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.assetId || !formData.entryPrice || !formData.stopLoss) {
      toast.error("נא למלא את כל השדות הנדרשים");
      return;
    }
    
    onSubmit(formData);
  };
  
  return (
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
              onClick={onCancel}
            >
              ביטול
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default TradingJournalForm;
