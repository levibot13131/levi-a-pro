
import React from 'react';
import { Button } from '../ui/button';
import { 
  ZoomIn, 
  ZoomOut, 
  RefreshCw, 
  Monitor, 
  CandlestickChart, 
  BarChart, 
  LineChart, 
  Volume2,
  Eye,
  EyeOff,
  Calendar
} from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface ChartToolbarProps {
  onRefresh: () => void;
  onTimeframeChange: (timeframe: string) => void;
  onChartTypeChange: (type: 'candle' | 'line' | 'bar') => void;
  isRefreshing: boolean;
  selectedTimeframe: string;
  chartType: 'candle' | 'line' | 'bar';
  showVolume: boolean;
  setShowVolume: (show: boolean) => void;
  showIndicators: boolean;
  setShowIndicators: (show: boolean) => void;
}

const ChartToolbar: React.FC<ChartToolbarProps> = ({
  onRefresh,
  onTimeframeChange,
  onChartTypeChange,
  isRefreshing,
  selectedTimeframe,
  chartType,
  showVolume,
  setShowVolume,
  showIndicators,
  setShowIndicators
}) => {
  return (
    <div className="flex flex-wrap justify-between gap-2 mb-4 p-2 bg-background/70 backdrop-blur-sm rounded-md border border-border/50 w-full">
      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isRefreshing}
          className="flex items-center"
        >
          <RefreshCw className={`h-4 w-4 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
          רענן
        </Button>
        
        <Select
          value={selectedTimeframe}
          onValueChange={onTimeframeChange}
        >
          <SelectTrigger className="h-9 w-[110px]">
            <Calendar className="h-4 w-4 mr-1" />
            <SelectValue placeholder="טווח זמן" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1m">1 דקה</SelectItem>
            <SelectItem value="5m">5 דקות</SelectItem>
            <SelectItem value="15m">15 דקות</SelectItem>
            <SelectItem value="30m">30 דקות</SelectItem>
            <SelectItem value="1h">שעה</SelectItem>
            <SelectItem value="4h">4 שעות</SelectItem>
            <SelectItem value="1D">יום</SelectItem>
            <SelectItem value="1W">שבוע</SelectItem>
            <SelectItem value="1M">חודש</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex gap-1 border rounded-md p-0.5 bg-background">
          <Button
            variant={chartType === 'candle' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onChartTypeChange('candle')}
            className="w-10 h-9 p-0"
            title="גרף נרות"
          >
            <CandlestickChart className="h-4 w-4" />
          </Button>
          <Button
            variant={chartType === 'line' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onChartTypeChange('line')}
            className="w-10 h-9 p-0"
            title="גרף קו"
          >
            <LineChart className="h-4 w-4" />
          </Button>
          <Button
            variant={chartType === 'bar' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onChartTypeChange('bar')}
            className="w-10 h-9 p-0"
            title="גרף עמודות"
          >
            <BarChart className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex gap-1 border rounded-md p-0.5 bg-background">
          <Button
            variant={showVolume ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setShowVolume(!showVolume)}
            className="w-10 h-9 p-0"
            title={showVolume ? 'הסתר נפח' : 'הצג נפח'}
          >
            <Volume2 className="h-4 w-4" />
          </Button>
          <Button
            variant={showIndicators ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setShowIndicators(!showIndicators)}
            className="w-10 h-9 p-0"
            title={showIndicators ? 'הסתר אינדיקטורים' : 'הצג אינדיקטורים'}
          >
            {showIndicators ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
        
        <div className="flex gap-1 border rounded-md p-0.5 bg-background">
          <Button variant="ghost" size="sm" className="w-10 h-9 p-0" title="הגדל">
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="w-10 h-9 p-0" title="הקטן">
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="w-10 h-9 p-0" title="מסך מלא">
            <Monitor className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChartToolbar;
