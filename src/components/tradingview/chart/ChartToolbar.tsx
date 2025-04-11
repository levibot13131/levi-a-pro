
import React from 'react';
import { Button } from '../../ui/button';
import { 
  ZoomIn, 
  ZoomOut, 
  RefreshCw, 
  Maximize, 
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
} from "../../ui/select";

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
    <div className="w-full bg-card/80 backdrop-blur-sm border border-border/40 rounded-md p-2 mb-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        {/* Left side controls (in RTL this appears on right) */}
        <div className="flex items-center gap-2">
          <Select
            value={selectedTimeframe}
            onValueChange={onTimeframeChange}
          >
            <SelectTrigger className="h-8 w-[110px]">
              <Calendar className="h-4 w-4 ml-1" />
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
          
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="h-8"
          >
            <RefreshCw className={`h-4 w-4 ml-1 ${isRefreshing ? 'animate-spin' : ''}`} />
            רענן
          </Button>
        </div>
        
        {/* Right side controls (in RTL this appears on left) */}
        <div className="flex items-center gap-2">
          {/* Chart type selector */}
          <div className="flex rounded-md border overflow-hidden">
            <Button
              variant={chartType === 'candle' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onChartTypeChange('candle')}
              className="h-8 px-2 rounded-none"
              title="גרף נרות"
            >
              <CandlestickChart className="h-4 w-4" />
            </Button>
            <Button
              variant={chartType === 'line' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onChartTypeChange('line')}
              className="h-8 px-2 rounded-none"
              title="גרף קו"
            >
              <LineChart className="h-4 w-4" />
            </Button>
            <Button
              variant={chartType === 'bar' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onChartTypeChange('bar')}
              className="h-8 px-2 rounded-none"
              title="גרף עמודות"
            >
              <BarChart className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Volume and indicators toggles */}
          <div className="flex rounded-md border overflow-hidden">
            <Button
              variant={showVolume ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setShowVolume(!showVolume)}
              className="h-8 px-2 rounded-none"
              title={showVolume ? 'הסתר נפח' : 'הצג נפח'}
            >
              <Volume2 className="h-4 w-4" />
            </Button>
            <Button
              variant={showIndicators ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setShowIndicators(!showIndicators)}
              className="h-8 px-2 rounded-none"
              title={showIndicators ? 'הסתר אינדיקטורים' : 'הצג אינדיקטורים'}
            >
              {showIndicators ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
          
          {/* Zoom controls */}
          <div className="flex rounded-md border overflow-hidden">
            <Button variant="ghost" size="sm" className="h-8 px-2 rounded-none" title="הגדל">
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 px-2 rounded-none" title="הקטן">
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 px-2 rounded-none" title="מסך מלא">
              <Maximize className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartToolbar;
