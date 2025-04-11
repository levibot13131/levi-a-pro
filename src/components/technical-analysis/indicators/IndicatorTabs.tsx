
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChartHorizontal, Filter, Scan, RefreshCw } from 'lucide-react';
import { RsiChart } from './';
import { IndicatorCard } from './';
import { ConclusionPanel } from './';
import { MultiTimeframeAnalysis } from './';
import { AutoScanResults } from './';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface IndicatorTabsProps {
  analysisData: any;
  selectedAsset: any;
  autoScanEnabled: boolean;
}

// Define types for the MultiTimeframeAnalysis component
interface TimeframeData {
  timeframe: string;
  signal: 'buy' | 'sell' | 'neutral';
  strength: number;
  keyIndicators: string[];
  details?: string;
  lastUpdated?: number;
}

interface FinalSignalData {
  signal: 'buy' | 'sell' | 'neutral';
  strength: number;
  confidence: number;
  description: string;
}

// Define types for the AutoScanResults component
interface ScanResult {
  symbol: string;
  name: string;
  timeframe: string;
  sentiment: 'buy' | 'sell' | 'neutral';
  strength: number;
  reason: string;
}

const IndicatorTabs = ({ 
  analysisData, 
  selectedAsset,
  autoScanEnabled
}: IndicatorTabsProps) => {
  const [activeScanTab, setActiveScanTab] = useState<string>("indicators");
  const [multiTimeframeData, setMultiTimeframeData] = useState<TimeframeData[]>([]);
  const [autoScanResults, setAutoScanResults] = useState<ScanResult[]>([]);
  const [finalSignal, setFinalSignal] = useState<FinalSignalData>({
    signal: 'neutral',
    strength: 5,
    confidence: 50,
    description: "ממתין לניתוח נתונים..."
  });
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<number>(Date.now());
  
  // Get multi-timeframe data
  const getMultiTimeframeAnalysis = (): TimeframeData[] => {
    // In a real app, this would be from an API
    return [
      {
        timeframe: '1w',
        signal: 'buy',
        strength: 8,
        keyIndicators: ['מומנטום חיובי', 'תמיכה במחזור חדש', 'אקומולציה מוסדית'],
        details: 'המחיר נמצא מעל ממוצע נע 50 שבועי ו-200 שבועי. תנועת המחיר מראה מומנטום חיובי עם עליה בנפח המסחר.',
        lastUpdated: Date.now()
      },
      {
        timeframe: '1d',
        signal: 'buy',
        strength: 7,
        keyIndicators: ['RSI מתכנס', 'פריצת התנגדות', 'תבנית דגל'],
        details: 'RSI (יומי) עלה מעל 60, מצביע על מומנטום חיובי. פריצת התנגדות משמעותית ב-$45,200 עם נפח גבוה.',
        lastUpdated: Date.now() - 3600000 // שעה אחת לפני
      },
      {
        timeframe: '4h',
        signal: 'neutral',
        strength: 5,
        keyIndicators: ['התבססות בטווח', 'ממתין לפריצה', 'נפח ממוצע'],
        details: 'המחיר מתבסס בטווח צר בין $44,800-$45,300. נפח מסחר נמוך יחסית מצביע על התכנסות לפני תנועה משמעותית.',
        lastUpdated: Date.now() - 1800000 // חצי שעה לפני
      },
      {
        timeframe: '1h',
        signal: 'buy',
        strength: 6,
        keyIndicators: ['אתות קנייה MACD', 'תמיכה בולינגר', 'מומנטום קצר'],
        details: 'MACD חצה את קו האפס כלפי מעלה. המחיר נתמך על ידי רצועת בולינגר התחתונה ב-$44,700.',
        lastUpdated: Date.now() - 600000 // 10 דקות לפני
      },
      {
        timeframe: '15m',
        signal: 'sell',
        strength: 4,
        keyIndicators: ['קנייתר יתר RSI', 'התנגדות קצרת טווח', 'היחלשות מומנטום'],
        details: 'RSI בטווח קצר (15 דקות) מראה סימני קניית יתר (מעל 70). התנגדות קצרת טווח ב-$45,350. תיקון טכני קצר צפוי.',
        lastUpdated: Date.now() - 120000 // 2 דקות לפני
      }
    ];
  };

  // Get auto scan results
  const getAutoScanResults = (): ScanResult[] => {
    // In a real app, this would be from an API
    return [
      { 
        symbol: 'BTC', 
        name: 'Bitcoin', 
        timeframe: '1w',
        sentiment: 'buy',
        strength: 8,
        reason: 'פריצת התנגדות ארוכת טווח, מומנטום חיובי, תמיכה במחזור החדש'
      },
      { 
        symbol: 'ETH', 
        name: 'Ethereum',
        timeframe: '1w',
        sentiment: 'neutral',
        strength: 5,
        reason: 'התבססות מעל אזור תמיכה, אך ממתין לאישור מגמה חיובית'
      },
      { 
        symbol: 'SOL', 
        name: 'Solana',
        timeframe: '1w',
        sentiment: 'buy',
        strength: 7,
        reason: 'עלייה בנפח מסחר, חציית ממוצעים נעים חיובית, תבנית הגביע בהשלמה'
      },
      { 
        symbol: 'LINK', 
        name: 'Chainlink',
        timeframe: '1w', 
        sentiment: 'buy',
        strength: 6,
        reason: 'סיום פאזת אקומולציה, יציאה ממבנה דגל, תבניות מחיר חיוביות'
      },
      { 
        symbol: 'AVAX', 
        name: 'Avalanche',
        timeframe: '1w',
        sentiment: 'sell',
        strength: 7,
        reason: 'שבירת תמיכה משמעותית, נפח מסחר בירידה, מגמה שלילית בממוצעים'
      }
    ];
  };

  // Calculate final signal
  const calculateFinalSignal = (multiTimeframe: TimeframeData[]): FinalSignalData => {
    // Weights by timeframe (longer timeframes have higher weights)
    const weights = {
      '1w': 0.3,
      '1d': 0.25,
      '4h': 0.2,
      '1h': 0.15,
      '15m': 0.1
    };
    
    let buySignalStrength = 0;
    let sellSignalStrength = 0;
    
    // Calculate weighted signal strength
    multiTimeframe.forEach(tf => {
      const weight = weights[tf.timeframe as keyof typeof weights] || 0.1;
      
      if (tf.signal === 'buy') {
        buySignalStrength += tf.strength * weight;
      } else if (tf.signal === 'sell') {
        sellSignalStrength += tf.strength * weight;
      }
    });
    
    // Determine final signal
    const signalDiff = buySignalStrength - sellSignalStrength;
    
    if (signalDiff > 2) {
      return {
        signal: 'buy',
        strength: Math.min(10, Math.round(buySignalStrength)),
        confidence: Math.min(100, Math.round((buySignalStrength / (buySignalStrength + sellSignalStrength)) * 100)),
        description: "ניתוח כל טווחי הזמן מצביע על מגמה חיובית חזקה. רוב האינדיקטורים והתבניות מהטווח הארוך לקצר תומכים בעלייה."
      };
    } else if (signalDiff < -2) {
      return {
        signal: 'sell',
        strength: Math.min(10, Math.round(sellSignalStrength)),
        confidence: Math.min(100, Math.round((sellSignalStrength / (buySignalStrength + sellSignalStrength)) * 100)),
        description: "ניתוח כל טווחי הזמן מצביע על מגמה שלילית. רוב האינדיקטורים והתבניות מראים חולשה לאורך מספר טווחי זמן."
      };
    } else {
      return {
        signal: 'neutral',
        strength: 5,
        confidence: 50,
        description: "ניתוח טווחי הזמן מראה סיגנלים מעורבים. יש פער בין המגמות בטווח הארוך והקצר. מומלץ להמתין לאיתות ברור יותר."
      };
    }
  };

  // Fetch data on initial load and when tab changes
  useEffect(() => {
    const fetchData = () => {
      setIsLoading(true);
      
      // Simulate API delay
      setTimeout(() => {
        const newMultiTimeframeData = getMultiTimeframeAnalysis();
        setMultiTimeframeData(newMultiTimeframeData);
        setAutoScanResults(getAutoScanResults());
        setFinalSignal(calculateFinalSignal(newMultiTimeframeData));
        setLastUpdated(Date.now());
        setIsLoading(false);
      }, 1000);
    };
    
    fetchData();
    
    // Set an interval to refresh data
    const intervalId = setInterval(() => {
      if (autoScanEnabled) {
        fetchData();
      }
    }, 60000); // refresh every minute if auto scan enabled
    
    return () => clearInterval(intervalId);
  }, [activeScanTab, autoScanEnabled]);

  const refreshData = () => {
    toast.info("מעדכן נתונים...");
    setIsLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      const newMultiTimeframeData = getMultiTimeframeAnalysis();
      setMultiTimeframeData(newMultiTimeframeData);
      setAutoScanResults(getAutoScanResults());
      setFinalSignal(calculateFinalSignal(newMultiTimeframeData));
      setLastUpdated(Date.now());
      setIsLoading(false);
      toast.success("הנתונים עודכנו בהצלחה");
    }, 1500);
  };

  const getLastUpdatedText = () => {
    const timeDiff = Date.now() - lastUpdated;
    if (timeDiff < 60000) {
      return "לפני פחות מדקה";
    } else if (timeDiff < 3600000) {
      return `לפני ${Math.floor(timeDiff / 60000)} דקות`;
    } else {
      return `לפני ${Math.floor(timeDiff / 3600000)} שעות`;
    }
  };

  return (
    <Tabs defaultValue="indicators" value={activeScanTab} onValueChange={setActiveScanTab}>
      <div className="flex justify-between items-center mb-4">
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="indicators" className="flex items-center gap-1">
            <BarChartHorizontal className="h-4 w-4" />
            אינדיקטורים
          </TabsTrigger>
          <TabsTrigger value="multiTimeframe" className="flex items-center gap-1">
            <Filter className="h-4 w-4" />
            רב-טווחי
          </TabsTrigger>
          <TabsTrigger value="autoScan" className="flex items-center gap-1">
            <Scan className="h-4 w-4" />
            סריקה שבועית
          </TabsTrigger>
        </TabsList>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={refreshData}
            disabled={isLoading}
            className="flex items-center gap-1"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            רענן
          </Button>
          <span className="text-xs text-muted-foreground">עודכן: {getLastUpdatedText()}</span>
        </div>
      </div>

      <TabsContent value="indicators">
        <div>
          {/* RSI Chart Component */}
          <RsiChart 
            rsiData={analysisData.rsiData} 
            rsiInterpretation={analysisData.rsiInterpretation} 
          />
          
          {/* Indicator Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {analysisData.indicators.map((indicator: any, idx: number) => (
              <IndicatorCard key={idx} indicator={indicator} />
            ))}
          </div>
          
          {/* Conclusion Panel */}
          <ConclusionPanel 
            conclusion={analysisData.conclusion}
            overallSignal={analysisData.overallSignal}
            signalStrength={analysisData.signalStrength}
            selectedAsset={selectedAsset}
          />
        </div>
      </TabsContent>

      <TabsContent value="multiTimeframe">
        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <MultiTimeframeAnalysis 
            multiTimeframeData={multiTimeframeData}
            finalSignal={finalSignal}
          />
        )}
      </TabsContent>

      <TabsContent value="autoScan">
        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <AutoScanResults 
            autoScanResults={autoScanResults}
            autoScanEnabled={autoScanEnabled}
          />
        )}
      </TabsContent>
    </Tabs>
  );
};

export default IndicatorTabs;
