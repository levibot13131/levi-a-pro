
import React from 'react';
import { Button } from '../ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
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
    <TooltipProvider>
      <div className="w-full bg-card/80 backdrop-blur-sm border border-border/40 rounded-md p-2 mb-3">
        <div className="flex flex-wrap justify-between items-center gap-2">
          {/* Right-side controls */}
          <div className="flex items-center gap-2 order-1 md:order-2">
            {/* Chart type selector */}
            <div className="flex rounded-md border overflow-hidden">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={chartType === 'candle' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => onChartTypeChange('candle')}
                    className="h-8 px-2 rounded-none"
                  >
                    <CandlestickChart className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>גרף נרות</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={chartType === 'line' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => onChartTypeChange('line')}
                    className="h-8 px-2 rounded-none"
                  >
                    <LineChart className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>גרף קו</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={chartType === 'bar' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => onChartTypeChange('bar')}
                    className="h-8 px-2 rounded-none"
                  >
                    <BarChart className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>גרף עמודות</p>
                </TooltipContent>
              </Tooltip>
            </div>
            
            {/* Volume and indicators toggles */}
            <div className="flex rounded-md border overflow-hidden">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={showVolume ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setShowVolume(!showVolume)}
                    className="h-8 px-2 rounded-none"
                  >
                    <Volume2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>{showVolume ? 'הסתר נפח' : 'הצג נפח'}</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={showIndicators ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setShowIndicators(!showIndicators)}
                    className="h-8 px-2 rounded-none"
                  >
                    {showIndicators ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>{showIndicators ? 'הסתר אינדיקטורים' : 'הצג אינדיקטורים'}</p>
                </TooltipContent>
              </Tooltip>
            </div>
            
            {/* Zoom controls */}
            <div className="flex rounded-md border overflow-hidden">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 px-2 rounded-none">
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>הגדל</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 px-2 rounded-none">
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>הקטן</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 px-2 rounded-none">
                    <Maximize className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>מסך מלא</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
          
          {/* Left-side controls */}
          <div className="flex items-center gap-2 order-2 md:order-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onRefresh}
                  disabled={isRefreshing}
                  className="h-8"
                >
                  <RefreshCw className={`h-4 w-4 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
                  רענן
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>רענן נתונים</p>
              </TooltipContent>
            </Tooltip>
            
            <Select
              value={selectedTimeframe}
              onValueChange={onTimeframeChange}
            >
              <SelectTrigger className="h-8 w-[110px]">
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
        </div>
      </div>
    </TooltipProvider>
  );
};

export default ChartToolbar;
