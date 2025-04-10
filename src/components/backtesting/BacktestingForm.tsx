
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { DatePicker } from '@/components/ui/date-picker';
import { Switch } from '@/components/ui/switch';
import { BacktestSettings } from '@/services/backtesting/types';
import { getAssets } from '@/services/mockDataService';
import { Asset } from '@/types/asset';

interface BacktestingFormProps {
  onRunBacktest: (settings: BacktestSettings) => void;
  isLoading: boolean;
}

const BacktestingForm: React.FC<BacktestingFormProps> = ({ onRunBacktest, isLoading }) => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loadingAssets, setLoadingAssets] = useState(false);
  const [settings, setSettings] = useState<BacktestSettings>({
    initialCapital: 10000,
    riskPerTrade: 2,
    strategy: 'KSEM',
    entryType: 'market',
    stopLossType: 'fixed',
    takeProfitType: 'fixed',
    riskRewardRatio: 2,
    timeframe: '1d',
    startDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    trailingStop: false,
    maxOpenTrades: 3,
    assetIds: ['bitcoin']
  });

  // Fetch assets when component mounts
  useEffect(() => {
    const fetchAssets = async () => {
      setLoadingAssets(true);
      try {
        const assetsList = await getAssets();
        setAssets(assetsList);
      } catch (error) {
        console.error("Error fetching assets:", error);
      } finally {
        setLoadingAssets(false);
      }
    };
    
    fetchAssets();
  }, []);

  // Handle form field changes
  const handleChange = (field: keyof BacktestSettings, value: any) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  // Handle asset selection
  const handleAssetChange = (assetId: string) => {
    setSettings(prev => ({
      ...prev,
      assetIds: [assetId] // For now, only support single asset selection
    }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRunBacktest(settings);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="assetId" className="block text-right mb-1">נכס</Label>
            <Select
              disabled={loadingAssets || isLoading}
              value={settings.assetIds[0]}
              onValueChange={handleAssetChange}
            >
              <SelectTrigger id="assetId">
                <SelectValue placeholder="בחר נכס" />
              </SelectTrigger>
              <SelectContent>
                {loadingAssets ? (
                  <SelectItem value="loading" disabled>טוען נכסים...</SelectItem>
                ) : (
                  assets.map(asset => (
                    <SelectItem key={asset.id} value={asset.id}>
                      {asset.name} ({asset.symbol})
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="timeframe" className="block text-right mb-1">מסגרת זמן</Label>
            <Select
              disabled={isLoading}
              value={settings.timeframe}
              onValueChange={(value) => handleChange('timeframe', value)}
            >
              <SelectTrigger id="timeframe">
                <SelectValue placeholder="בחר מסגרת זמן" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1m">דקה</SelectItem>
                <SelectItem value="5m">5 דקות</SelectItem>
                <SelectItem value="15m">15 דקות</SelectItem>
                <SelectItem value="30m">30 דקות</SelectItem>
                <SelectItem value="1h">שעה</SelectItem>
                <SelectItem value="4h">4 שעות</SelectItem>
                <SelectItem value="1d">יומי</SelectItem>
                <SelectItem value="1w">שבועי</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="strategy" className="block text-right mb-1">אסטרטגיה</Label>
            <Select
              disabled={isLoading}
              value={settings.strategy}
              onValueChange={(value) => handleChange('strategy', value as BacktestSettings['strategy'])}
            >
              <SelectTrigger id="strategy">
                <SelectValue placeholder="בחר אסטרטגיה" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="KSEM">Key Structure Entry Method</SelectItem>
                <SelectItem value="SMC">Smart Money Concept</SelectItem>
                <SelectItem value="Wyckoff">Wyckoff Method</SelectItem>
                <SelectItem value="Custom">מותאם אישית</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="initialCapital" className="block text-right mb-1">הון התחלתי</Label>
            <Input
              id="initialCapital"
              type="number"
              disabled={isLoading}
              value={settings.initialCapital}
              onChange={(e) => handleChange('initialCapital', Number(e.target.value))}
              min="1000"
              step="1000"
              className="text-left"
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="w-16 text-center bg-gray-100 rounded py-1 text-sm">
                {settings.riskPerTrade}%
              </div>
              <Label htmlFor="riskPerTrade" className="text-right">סיכון לעסקה (%)</Label>
            </div>
            <Slider
              id="riskPerTrade"
              disabled={isLoading}
              value={[settings.riskPerTrade]}
              onValueChange={(value) => handleChange('riskPerTrade', value[0])}
              min={0.5}
              max={10}
              step={0.5}
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="startDate" className="block text-right mb-1">תאריך התחלה</Label>
            <Input
              id="startDate"
              type="date"
              disabled={isLoading}
              value={settings.startDate}
              onChange={(e) => handleChange('startDate', e.target.value)}
              max={settings.endDate}
              className="text-left"
            />
          </div>
          
          <div>
            <Label htmlFor="endDate" className="block text-right mb-1">תאריך סיום</Label>
            <Input
              id="endDate"
              type="date"
              disabled={isLoading}
              value={settings.endDate}
              onChange={(e) => handleChange('endDate', e.target.value)}
              min={settings.startDate}
              max={new Date().toISOString().split('T')[0]}
              className="text-left"
            />
          </div>
          
          <div>
            <Label htmlFor="entryType" className="block text-right mb-1">סוג כניסה</Label>
            <Select
              disabled={isLoading}
              value={settings.entryType}
              onValueChange={(value) => handleChange('entryType', value as 'market' | 'limit')}
            >
              <SelectTrigger id="entryType">
                <SelectValue placeholder="בחר סוג כניסה" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="market">כניסת שוק</SelectItem>
                <SelectItem value="limit">כניסת לימיט</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="w-16 text-center bg-gray-100 rounded py-1 text-sm">
                1:{settings.riskRewardRatio}
              </div>
              <Label htmlFor="riskRewardRatio" className="text-right">יחס סיכוי/סיכון</Label>
            </div>
            <Slider
              id="riskRewardRatio"
              disabled={isLoading}
              value={[settings.riskRewardRatio]}
              onValueChange={(value) => handleChange('riskRewardRatio', value[0])}
              min={1}
              max={5}
              step={0.5}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Switch
              id="trailingStop"
              disabled={isLoading}
              checked={settings.trailingStop}
              onCheckedChange={(checked) => handleChange('trailingStop', checked)}
            />
            <Label htmlFor="trailingStop" className="cursor-pointer">סטופ נגרר</Label>
          </div>
          
          <div>
            <Label htmlFor="maxOpenTrades" className="block text-right mb-1">מקסימום עסקאות פתוחות</Label>
            <Input
              id="maxOpenTrades"
              type="number"
              disabled={isLoading}
              value={settings.maxOpenTrades}
              onChange={(e) => handleChange('maxOpenTrades', Number(e.target.value))}
              min="1"
              max="10"
              className="text-left"
            />
          </div>
        </div>
      </div>
      
      <div className="flex justify-center pt-4">
        <Button 
          type="submit"
          disabled={isLoading}
          className="px-8"
        >
          {isLoading ? 'מריץ בדיקה...' : 'הרץ בדיקה היסטורית'}
        </Button>
      </div>
    </form>
  );
};

export default BacktestingForm;
