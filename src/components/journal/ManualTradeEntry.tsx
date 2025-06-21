
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Camera, TrendingUp, TrendingDown } from 'lucide-react';
import { toast } from 'sonner';

export interface ManualTradeData {
  id: string;
  symbol: string;
  direction: 'long' | 'short';
  entryPrice: number;
  exitPrice?: number;
  stopLoss: number;
  takeProfit?: number;
  positionSize: number;
  entryTime: string;
  exitTime?: string;
  pnl?: number;
  pnlPercentage?: number;
  confidence: number;
  strategy: string;
  notes: string;
  screenshot?: string;
  status: 'open' | 'closed' | 'stopped';
  riskReward: number;
}

interface ManualTradeEntryProps {
  onAddTrade: (trade: ManualTradeData) => void;
}

const ManualTradeEntry: React.FC<ManualTradeEntryProps> = ({ onAddTrade }) => {
  const [formData, setFormData] = useState({
    symbol: '',
    direction: 'long' as 'long' | 'short',
    entryPrice: '',
    exitPrice: '',
    stopLoss: '',
    takeProfit: '',
    positionSize: '',
    confidence: '75',
    strategy: '',
    notes: '',
    status: 'open' as 'open' | 'closed' | 'stopped'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.symbol || !formData.entryPrice || !formData.stopLoss || !formData.positionSize) {
      toast.error('Please fill in all required fields');
      return;
    }

    const entryPrice = parseFloat(formData.entryPrice);
    const stopLoss = parseFloat(formData.stopLoss);
    const exitPrice = formData.exitPrice ? parseFloat(formData.exitPrice) : undefined;
    const takeProfit = formData.takeProfit ? parseFloat(formData.takeProfit) : undefined;
    const positionSize = parseFloat(formData.positionSize);
    
    // Calculate P&L if exit price is provided
    let pnl = 0;
    let pnlPercentage = 0;
    
    if (exitPrice) {
      if (formData.direction === 'long') {
        pnl = (exitPrice - entryPrice) * positionSize;
        pnlPercentage = ((exitPrice - entryPrice) / entryPrice) * 100;
      } else {
        pnl = (entryPrice - exitPrice) * positionSize;
        pnlPercentage = ((entryPrice - exitPrice) / entryPrice) * 100;
      }
    }
    
    // Calculate risk-reward ratio
    const riskAmount = Math.abs(entryPrice - stopLoss) * positionSize;
    const rewardAmount = takeProfit ? Math.abs(takeProfit - entryPrice) * positionSize : riskAmount * 2;
    const riskReward = rewardAmount / riskAmount;

    const newTrade: ManualTradeData = {
      id: `manual_${Date.now()}`,
      symbol: formData.symbol.toUpperCase(),
      direction: formData.direction,
      entryPrice,
      exitPrice,
      stopLoss,
      takeProfit,
      positionSize,
      entryTime: new Date().toISOString(),
      exitTime: exitPrice ? new Date().toISOString() : undefined,
      pnl: exitPrice ? pnl : undefined,
      pnlPercentage: exitPrice ? pnlPercentage : undefined,
      confidence: parseInt(formData.confidence),
      strategy: formData.strategy || 'Manual Entry',
      notes: formData.notes,
      status: formData.status,
      riskReward
    };

    onAddTrade(newTrade);
    
    // Reset form
    setFormData({
      symbol: '',
      direction: 'long',
      entryPrice: '',
      exitPrice: '',
      stopLoss: '',
      takeProfit: '',
      positionSize: '',
      confidence: '75',
      strategy: '',
      notes: '',
      status: 'open'
    });

    toast.success('Trade entry added successfully!');
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Manual Trade Entry
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Symbol *</label>
              <Input
                placeholder="e.g., BTCUSDT"
                value={formData.symbol}
                onChange={(e) => handleChange('symbol', e.target.value.toUpperCase())}
                required
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Direction *</label>
              <Select value={formData.direction} onValueChange={(value) => handleChange('direction', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="long">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      Long (Buy)
                    </div>
                  </SelectItem>
                  <SelectItem value="short">
                    <div className="flex items-center gap-2">
                      <TrendingDown className="h-4 w-4 text-red-500" />
                      Short (Sell)
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Entry Price *</label>
              <Input
                type="number"
                step="0.01"
                placeholder="Entry price"
                value={formData.entryPrice}
                onChange={(e) => handleChange('entryPrice', e.target.value)}
                required
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Stop Loss *</label>
              <Input
                type="number"
                step="0.01"
                placeholder="Stop loss price"
                value={formData.stopLoss}
                onChange={(e) => handleChange('stopLoss', e.target.value)}
                required
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Take Profit</label>
              <Input
                type="number"
                step="0.01"
                placeholder="Take profit price"
                value={formData.takeProfit}
                onChange={(e) => handleChange('takeProfit', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Position Size *</label>
              <Input
                type="number"
                step="0.01"
                placeholder="Position size"
                value={formData.positionSize}
                onChange={(e) => handleChange('positionSize', e.target.value)}
                required
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Exit Price</label>
              <Input
                type="number"
                step="0.01"
                placeholder="Exit price (if closed)"
                value={formData.exitPrice}
                onChange={(e) => handleChange('exitPrice', e.target.value)}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Status</label>
              <Select value={formData.status} onValueChange={(value) => handleChange('status', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="open">
                    <Badge variant="secondary">Open</Badge>
                  </SelectItem>
                  <SelectItem value="closed">
                    <Badge variant="default">Closed</Badge>
                  </SelectItem>
                  <SelectItem value="stopped">
                    <Badge variant="destructive">Stopped Out</Badge>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Confidence Level</label>
              <Select value={formData.confidence} onValueChange={(value) => handleChange('confidence', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="90">90% - Very High</SelectItem>
                  <SelectItem value="80">80% - High</SelectItem>
                  <SelectItem value="75">75% - Medium-High</SelectItem>
                  <SelectItem value="60">60% - Medium</SelectItem>
                  <SelectItem value="50">50% - Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Strategy</label>
              <Input
                placeholder="e.g., Breakout, Support/Resistance"
                value={formData.strategy}
                onChange={(e) => handleChange('strategy', e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Notes & Analysis</label>
            <Textarea
              placeholder="Trade reasoning, market conditions, lessons learned..."
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex items-center gap-4">
            <Button type="submit" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Trade Entry
            </Button>
            
            <Button type="button" variant="outline" className="flex items-center gap-2">
              <Camera className="h-4 w-4" />
              Add Screenshot
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ManualTradeEntry;
