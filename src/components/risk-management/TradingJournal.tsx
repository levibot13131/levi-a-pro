
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Plus } from 'lucide-react';
import { addTradingJournalEntry } from '@/services/customTradingStrategyService';
import { toast } from "sonner";
import { TradeJournalEntry } from '@/types/journal';
import TradingJournalForm from './TradingJournalForm';
import TradingJournalEntryList from './TradingJournalEntryList';

interface TradingJournalProps {
  initialEntries?: TradeJournalEntry[];
}

// Rename to resolve the conflict with imported TradingJournalFormData
interface JournalFormData {
  assetId: string;
  date: string;
  direction: string;
  entryPrice: string;
  stopLoss: string;
  targetPrice?: string;
  positionSize: string;
  notes?: string;
  strategy: string;
  tags?: string[];
}

const TradingJournal = ({ initialEntries = [] }: TradingJournalProps) => {
  const [entries, setEntries] = useState<TradeJournalEntry[]>(initialEntries);
  const [showForm, setShowForm] = useState(false);
  
  const handleAddEntry = async (formData: JournalFormData) => {
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
      
      const newEntry: TradeJournalEntry = {
        id: '',
        date: formData.date,
        assetId: formData.assetId,
        assetName: formData.assetId, // Using assetId as name for simplicity
        direction: formData.direction as 'long' | 'short',
        entryPrice,
        entryDate: formData.date, // Changed to string per the updated interface
        stopLoss,
        targetPrice: formData.targetPrice ? parseFloat(formData.targetPrice) : undefined,
        positionSize,
        risk,
        notes: formData.notes,
        strategy: formData.strategy || 'ידני', // Make sure strategy is always set
        tags: formData.tags || [],
        outcome: 'open' as const,
        type: 'buy', // Added required field
        quantity: positionSize / entryPrice // Added required field
      };
      
      const savedEntry = await addTradingJournalEntry(newEntry);
      setEntries(prev => [savedEntry, ...prev]);
      setShowForm(false);
      
      toast.success("העסקה נוספה בהצלחה ליומן המסחר");
      
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
          <TradingJournalForm 
            onSubmit={handleAddEntry} 
            onCancel={() => setShowForm(false)} 
          />
        )}
        
        <TradingJournalEntryList entries={entries as any} />
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
