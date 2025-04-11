
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChartHorizontal, Filter, Scan } from 'lucide-react';
import { RsiChart } from './';
import { IndicatorCard } from './';
import { ConclusionPanel } from './';
import { MultiTimeframeAnalysis } from './';
import { AutoScanResults } from './';

interface IndicatorTabsProps {
  analysisData: any;
  selectedAsset: any;
  autoScanEnabled: boolean;
}

const IndicatorTabs = ({ 
  analysisData, 
  selectedAsset,
  autoScanEnabled
}: IndicatorTabsProps) => {
  const [activeScanTab, setActiveScanTab] = useState<string>("indicators");
  
  // Get multi-timeframe data
  const getMultiTimeframeAnalysis = () => {
    // In a real app, this would be from an API
    return [
      {
        timeframe: '1w',
        signal: 'buy',
        strength: 8,
        keyIndicators: ['מומנטום חיובי', 'תמיכה במחזור חדש', 'אקומולציה מוסדית']
      },
      {
        timeframe: '1d',
        signal: 'buy',
        strength: 7,
        keyIndicators: ['RSI מתכנס', 'פריצת התנגדות', 'תבנית דגל']
      },
      {
        timeframe: '4h',
        signal: 'neutral',
        strength: 5,
        keyIndicators: ['התבססות בטווח', 'ממתין לפריצה', 'נפח ממוצע']
      },
      {
        timeframe: '1h',
        signal: 'buy',
        strength: 6,
        keyIndicators: ['אתות קנייה MACD', 'תמיכה בולינגר', 'מומנטום קצר']
      },
      {
        timeframe: '15m',
        signal: 'sell',
        strength: 4,
        keyIndicators: ['קנייתר יתר RSI', 'התנגדות קצרת טווח', 'היחלשות מומנטום']
      }
    ];
  };

  // Get auto scan results
  const getAutoScanResults = () => {
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
  const getFinalSignal = () => {
    // In a real app, this calculation would be more complex
    const multiTimeframe = getMultiTimeframeAnalysis();
    
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

  const multiTimeframeData = getMultiTimeframeAnalysis();
  const autoScanResults = getAutoScanResults();
  const finalSignal = getFinalSignal();

  return (
    <Tabs defaultValue="indicators" value={activeScanTab} onValueChange={setActiveScanTab}>
      <TabsList className="grid grid-cols-3 mb-4">
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
        <MultiTimeframeAnalysis 
          multiTimeframeData={multiTimeframeData}
          finalSignal={finalSignal}
        />
      </TabsContent>

      <TabsContent value="autoScan">
        <AutoScanResults 
          autoScanResults={autoScanResults}
          autoScanEnabled={autoScanEnabled}
        />
      </TabsContent>
    </Tabs>
  );
};

export default IndicatorTabs;
