
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';
import { Settings, Zap, Shield, Clock, Layers } from 'lucide-react';

const LeviBotSettings = () => {
  const [advancedMode, setAdvancedMode] = React.useState(true);
  const [autoTrading, setAutoTrading] = React.useState(false);
  const [maxLeverage, setMaxLeverage] = React.useState(5);
  const [signalFilter, setSignalFilter] = React.useState(3);
  const [volatilityFilter, setVolatilityFilter] = React.useState(75);
  
  const handleSaveSettings = () => {
    // שמירת ההגדרות ב-localStorage
    const settings = {
      advancedMode,
      autoTrading,
      maxLeverage,
      signalFilter,
      volatilityFilter,
      lastUpdated: new Date().toISOString()
    };
    
    localStorage.setItem('levi_bot_settings', JSON.stringify(settings));
    
    toast.success('הגדרות Levi Bot נשמרו בהצלחה', {
      description: 'השינויים ייכנסו לתוקף מיידית'
    });
  };
  
  const handleResetSettings = () => {
    // איפוס הגדרות
    setAdvancedMode(true);
    setAutoTrading(false);
    setMaxLeverage(5);
    setSignalFilter(3);
    setVolatilityFilter(75);
    
    localStorage.removeItem('levi_bot_settings');
    
    toast.info('הגדרות Levi Bot אופסו', {
      description: 'כל ההגדרות חזרו לברירות המחדל'
    });
  };
  
  // טעינת הגדרות בעת טעינת הקומפוננטה
  React.useEffect(() => {
    const savedSettings = localStorage.getItem('levi_bot_settings');
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        setAdvancedMode(settings.advancedMode ?? true);
        setAutoTrading(settings.autoTrading ?? false);
        setMaxLeverage(settings.maxLeverage ?? 5);
        setSignalFilter(settings.signalFilter ?? 3);
        setVolatilityFilter(settings.volatilityFilter ?? 75);
      } catch (error) {
        console.error('Error loading Levi Bot settings:', error);
      }
    }
  }, []);
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-2xl font-bold">הגדרות Levi Bot</CardTitle>
        <Settings className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">מצב מתקדם</Label>
              <p className="text-sm text-muted-foreground">
                הפעלת אלגוריתמים מתקדמים לניתוח מגמות
              </p>
            </div>
            <Switch 
              checked={advancedMode}
              onCheckedChange={setAdvancedMode}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">
                <Zap className="h-4 w-4 inline mr-1" />
                מסחר אוטומטי
              </Label>
              <p className="text-sm text-muted-foreground">
                ביצוע עסקאות אוטומטיות לפי האיתותים
              </p>
            </div>
            <Switch 
              checked={autoTrading}
              onCheckedChange={setAutoTrading}
            />
          </div>
        </div>
        
        <div className="space-y-3">
          <div>
            <div className="flex justify-between">
              <Label className="text-base">
                <Layers className="h-4 w-4 inline mr-1" />
                מינוף מקסימלי
              </Label>
              <span className="text-sm font-medium">{maxLeverage}x</span>
            </div>
            <Slider
              value={[maxLeverage]}
              min={1}
              max={20}
              step={1}
              onValueChange={(value) => setMaxLeverage(value[0])}
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-1">
              הגבלת מינוף מקסימלי להגנה על ההון
            </p>
          </div>
          
          <div>
            <div className="flex justify-between">
              <Label className="text-base">
                <Shield className="h-4 w-4 inline mr-1" />
                סף איתותים
              </Label>
              <span className="text-sm font-medium">{signalFilter}</span>
            </div>
            <Slider
              value={[signalFilter]}
              min={1}
              max={5}
              step={1}
              onValueChange={(value) => setSignalFilter(value[0])}
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-1">
              מספר המינימלי של איתותים זהים הנדרשים לביצוע עסקה
            </p>
          </div>
          
          <div>
            <div className="flex justify-between">
              <Label className="text-base">
                <Clock className="h-4 w-4 inline mr-1" />
                סף תנודתיות
              </Label>
              <span className="text-sm font-medium">{volatilityFilter}%</span>
            </div>
            <Slider
              value={[volatilityFilter]}
              min={0}
              max={100}
              step={5}
              onValueChange={(value) => setVolatilityFilter(value[0])}
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-1">
              רמת הרגישות לתנודתיות השוק (גבוה יותר = פחות רגישות)
            </p>
          </div>
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={handleResetSettings}>
            איפוס
          </Button>
          <Button onClick={handleSaveSettings}>
            שמור הגדרות
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LeviBotSettings;
