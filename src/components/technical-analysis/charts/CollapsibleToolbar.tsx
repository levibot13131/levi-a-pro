
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  ArrowUpDown, 
  BarChart2, 
  ChevronDown, 
  ChevronUp, 
  LineChart, 
  Volume2, 
  ToggleLeft, 
  ToggleRight 
} from 'lucide-react';
import { useAppSettings } from '@/hooks/use-app-settings';

interface CollapsibleToolbarProps {
  showVolume: boolean;
  setShowVolume: (show: boolean) => void;
  showPatterns?: boolean;
  setShowPatterns?: (show: boolean) => void;
  showSignals?: boolean;
  setShowSignals?: (show: boolean) => void;
}

const CollapsibleToolbar: React.FC<CollapsibleToolbarProps> = ({
  showVolume,
  setShowVolume,
  showPatterns = false,
  setShowPatterns,
  showSignals = false,
  setShowSignals
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [chartType, setChartType] = useState<'candle' | 'line' | 'bar'>('line');
  const { demoMode, toggleDemoMode } = useAppSettings();
  
  return (
    <div className="relative mb-2">
      <div className="flex justify-between items-center">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1"
        >
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          {isExpanded ? 'הסתר כלים' : 'הראה כלים'}
        </Button>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            onClick={toggleDemoMode}
            className="flex items-center gap-1.5 text-xs"
            size="sm"
          >
            {demoMode ? (
              <>
                <ToggleLeft className="h-4 w-4 text-amber-500" />
                <span>מצב דמו</span>
              </>
            ) : (
              <>
                <ToggleRight className="h-4 w-4 text-green-500" />
                <span>מצב אמיתי</span>
              </>
            )}
          </Button>
          
          <div className="flex items-center">
            <Label htmlFor="show-volume" className="ml-2 text-sm">
              נפח
            </Label>
            <Switch 
              id="show-volume" 
              checked={showVolume} 
              onCheckedChange={setShowVolume} 
            />
          </div>
        </div>
      </div>
      
      {isExpanded && (
        <Card className="p-3 mt-2 flex flex-wrap justify-end gap-4">
          <div className="flex items-center gap-2">
            <Label className="text-sm">סוג גרף:</Label>
            <div className="flex border rounded-md overflow-hidden">
              <Button 
                variant={chartType === 'candle' ? 'default' : 'ghost'} 
                size="sm" 
                className="px-2 py-1 h-8"
                onClick={() => setChartType('candle')}
              >
                <ArrowUpDown className="h-4 w-4" />
              </Button>
              <Button 
                variant={chartType === 'line' ? 'default' : 'ghost'} 
                size="sm" 
                className="px-2 py-1 h-8"
                onClick={() => setChartType('line')}
              >
                <LineChart className="h-4 w-4" />
              </Button>
              <Button 
                variant={chartType === 'bar' ? 'default' : 'ghost'} 
                size="sm" 
                className="px-2 py-1 h-8"
                onClick={() => setChartType('bar')}
              >
                <BarChart2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Switch 
                id="show-volume-expanded" 
                checked={showVolume} 
                onCheckedChange={setShowVolume} 
              />
              <Label htmlFor="show-volume-expanded" className="text-sm flex items-center">
                <Volume2 className="h-3 w-3 ml-1" />
                הצג נפח
              </Label>
            </div>
            
            {setShowPatterns && (
              <div className="flex items-center gap-2">
                <Switch 
                  id="show-patterns" 
                  checked={showPatterns} 
                  onCheckedChange={setShowPatterns} 
                />
                <Label htmlFor="show-patterns" className="text-sm flex items-center">
                  <LineChart className="h-3 w-3 ml-1" />
                  הצג תבניות
                </Label>
              </div>
            )}
            
            {setShowSignals && (
              <div className="flex items-center gap-2">
                <Switch 
                  id="show-signals" 
                  checked={showSignals} 
                  onCheckedChange={setShowSignals} 
                />
                <Label htmlFor="show-signals" className="text-sm flex items-center">
                  <ArrowUpDown className="h-3 w-3 ml-1" />
                  הצג איתותים
                </Label>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

export default CollapsibleToolbar;
