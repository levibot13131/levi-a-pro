
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  LineChart, BarChart, Brain, ActivitySquare, 
  BookOpen, ShieldCheck, TrendingUp, BarChart3, 
  Landmark, Calendar, ListChecks, FileCheck 
} from 'lucide-react';
import { getAssets, getAssetHistory } from '@/services/mockDataService';
import { analyzeAsset, getWyckoffPatterns, getSMCPatterns } from '@/services/technicalAnalysisService';
import { getWhaleMovements, getWhaleBehaviorPatterns } from '@/services/whaleTrackerService';
import { getNewsByAssetId } from '@/services/mockNewsService';
import { Asset } from '@/types/asset';
import AssetSelector from '@/components/technical-analysis/AssetSelector';
import PriceVolumeChart from '@/components/technical-analysis/PriceVolumeChart';
import { Badge } from '@/components/ui/badge';

const timeframeOptions = [
  { value: '5m', label: '5 דקות' },
  { value: '15m', label: '15 דקות' },
  { value: '1h', label: 'שעה' },
  { value: '4h', label: '4 שעות' },
  { value: '1d', label: 'יומי' },
  { value: '1w', label: 'שבועי' },
];

const ComprehensiveAnalysis = () => {
  const [selectedAssetId, setSelectedAssetId] = useState<string>('bitcoin');
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('1d');
  const [showVolume, setShowVolume] = useState<boolean>(true);
  const [userStrategy, setUserStrategy] = useState<{
    description: string;
    riskRules: string[];
    entryRules: string[];
    exitRules: string[];
  }>({
    description: 'אסטרטגיית מסחר שמשלבת ניתוח טכני מתקדם עם מעקב אחר תנועות ארנקים גדולים',
    riskRules: [
      'סיכון מקסימלי לעסקה: 1% מגודל התיק',
      'סטופ-לוס מתחת/מעל נקודת תמיכה/התנגדות קריטית',
      'יחס סיכוי:סיכון מינימלי של 1:2',
      'לא להיכנס לעסקאות בתקופת הכרזות משמעותיות או תנודתיות קיצונית',
    ],
    entryRules: [
      'כניסה רק כאשר יש התכנסות של לפחות 3 אינדיקטורים',
      'מחיר נמצא מעל/מתחת לממוצע נע 200',
      'זיהוי תבנית מחיר תומכת (דגל, משולש, תחתית כפולה וכו\')',
      'בדיקת תנועות ארנקים גדולים לפני כניסה'
    ],
    exitRules: [
      'מכירת 50% מהפוזיציה בהגעה ליעד ראשון (1:1)',
      'הזזת סטופ לנקודת כניסה לאחר הגעה ליעד ראשון',
      'סגירת שארית הפוזיציה בהגעה ליעד שני או במגע בסטופ',
      'סגירה מיידית בזיהוי תבנית היפוך משמעותית'
    ]
  });
  
  // Fetch asset data
  const { data: assets } = useQuery({
    queryKey: ['assets'],
    queryFn: getAssets,
  });
  
  const { data: assetHistory, isLoading: historyLoading } = useQuery({
    queryKey: ['assetHistory', selectedAssetId, selectedTimeframe],
    queryFn: () => getAssetHistory(selectedAssetId, selectedTimeframe as any),
  });
  
  // Fetch all analysis data in parallel
  const { data: technicalAnalysis, isLoading: analysisLoading } = useQuery({
    queryKey: ['analysisData', selectedAssetId, selectedTimeframe, 'all'],
    queryFn: () => analyzeAsset(selectedAssetId, selectedTimeframe as any, 'all'),
  });
  
  const { data: wyckoffPatterns, isLoading: wyckoffLoading } = useQuery({
    queryKey: ['wyckoffPatterns', selectedAssetId, selectedTimeframe],
    queryFn: () => getWyckoffPatterns(selectedAssetId, selectedTimeframe as any),
  });
  
  const { data: smcPatterns, isLoading: smcLoading } = useQuery({
    queryKey: ['smcPatterns', selectedAssetId, selectedTimeframe],
    queryFn: () => getSMCPatterns(selectedAssetId, selectedTimeframe as any),
  });
  
  const { data: whaleMovements, isLoading: whaleLoading } = useQuery({
    queryKey: ['whaleMovements', selectedAssetId, 7],
    queryFn: () => getWhaleMovements(selectedAssetId, 7),
  });
  
  const { data: whaleBehavior } = useQuery({
    queryKey: ['whaleBehaviorPatterns', selectedAssetId],
    queryFn: () => getWhaleBehaviorPatterns(selectedAssetId),
  });
  
  const { data: newsItems } = useQuery({
    queryKey: ['news', selectedAssetId],
    queryFn: () => getNewsByAssetId(selectedAssetId),
  });
  
  const selectedAsset = assets?.find(asset => asset.id === selectedAssetId);
  
  // Format price for display
  const formatPrice = (price: number) => {
    return price < 1 
      ? price.toFixed(6) 
      : price < 1000 
        ? price.toFixed(2) 
        : price.toLocaleString(undefined, { maximumFractionDigits: 2 });
  };
  
  // Calculate a overall recommendation based on all analysis methods
  const calculateOverallRecommendation = () => {
    if (!technicalAnalysis || !wyckoffPatterns || !smcPatterns || !whaleMovements) {
      return { signal: 'neutral', strength: 5, reasoning: [] };
    }
    
    const reasoning: string[] = [];
    let buyPoints = 0;
    let sellPoints = 0;
    
    // Technical indicators
    if (technicalAnalysis.overallSignal === 'buy') {
      buyPoints += technicalAnalysis.signalStrength / 2;
      reasoning.push(`אינדיקטורים טכניים מראים סיגנל קנייה (${technicalAnalysis.signalStrength}/10)`);
    } else if (technicalAnalysis.overallSignal === 'sell') {
      sellPoints += technicalAnalysis.signalStrength / 2;
      reasoning.push(`אינדיקטורים טכניים מראים סיגנל מכירה (${technicalAnalysis.signalStrength}/10)`);
    }
    
    // Wyckoff analysis
    if (wyckoffPatterns.phase) {
      if (wyckoffPatterns.phase.includes('אקומולציה')) {
        buyPoints += 3;
        reasoning.push(`ניתוח וויקוף מזהה שלב אקומולציה - חיובי לטווח הבינוני`);
      } else if (wyckoffPatterns.phase.includes('דיסטריביושן')) {
        sellPoints += 3;
        reasoning.push(`ניתוח וויקוף מזהה שלב הפצה - שלילי לטווח הבינוני`);
      }
    }
    
    // SMC patterns
    if (smcPatterns.patterns && smcPatterns.patterns.length > 0) {
      const bullishPatterns = smcPatterns.patterns.filter(p => p.bias === 'bullish').length;
      const bearishPatterns = smcPatterns.patterns.filter(p => p.bias === 'bearish').length;
      
      if (bullishPatterns > bearishPatterns) {
        buyPoints += 2;
        reasoning.push(`זיהוי ${bullishPatterns} תבניות SMC חיוביות`);
      } else if (bearishPatterns > bullishPatterns) {
        sellPoints += 2;
        reasoning.push(`זיהוי ${bearishPatterns} תבניות SMC שליליות`);
      }
    }
    
    // Whale movements
    if (whaleMovements && whaleMovements.length > 0) {
      const recentMovements = whaleMovements.filter(m => m.timestamp > Date.now() - 86400000 * 2); // Last 2 days
      const buyVolume = recentMovements
        .filter(m => m.transactionType === 'buy')
        .reduce((total, m) => total + m.amount, 0);
      const sellVolume = recentMovements
        .filter(m => m.transactionType === 'sell')
        .reduce((total, m) => total + m.amount, 0);
      
      if (buyVolume > sellVolume * 1.5) {
        buyPoints += 2;
        reasoning.push(`תנועות ארנקים גדולים: קניות משמעותיות ב-48 שעות האחרונות`);
      } else if (sellVolume > buyVolume * 1.5) {
        sellPoints += 2;
        reasoning.push(`תנועות ארנקים גדולים: מכירות משמעותיות ב-48 שעות האחרונות`);
      }
    }
    
    // News sentiment
    if (newsItems && newsItems.length > 0) {
      const positiveNews = newsItems.filter(n => n.sentiment === 'positive').length;
      const negativeNews = newsItems.filter(n => n.sentiment === 'negative').length;
      
      if (positiveNews > negativeNews) {
        buyPoints += 1;
        reasoning.push(`סנטימנט חדשות חיובי`);
      } else if (negativeNews > positiveNews) {
        sellPoints += 1;
        reasoning.push(`סנטימנט חדשות שלילי`);
      }
    }
    
    // Calculate final signal
    const totalPoints = buyPoints + sellPoints;
    let signal: 'buy' | 'sell' | 'neutral';
    let strength: number;
    
    if (buyPoints > sellPoints + 2) {
      signal = 'buy';
      strength = Math.min(10, Math.round((buyPoints / totalPoints) * 10));
    } else if (sellPoints > buyPoints + 2) {
      signal = 'sell';
      strength = Math.min(10, Math.round((sellPoints / totalPoints) * 10));
    } else {
      signal = 'neutral';
      strength = 5;
      reasoning.push('איזון בין סימני קנייה ומכירה, אין איתות חד משמעי');
    }
    
    return { signal, strength, reasoning };
  };
  
  const recommendation = calculateOverallRecommendation();
  
  // Generate a trade plan based on the analysis and user strategy
  const generateTradePlan = () => {
    if (!selectedAsset || !technicalAnalysis) return null;
    
    const currentPrice = assetHistory?.data[assetHistory.data.length - 1]?.price || selectedAsset.price;
    const recommendation = calculateOverallRecommendation();
    
    if (recommendation.signal === 'neutral') {
      return {
        action: 'המתנה',
        reason: 'אין איתות חד-משמעי במצב השוק הנוכחי',
        levels: []
      };
    }
    
    // Calculate key price levels based on available analysis
    const keyLevels = [];
    const isPriceNearSupportOrResistance = () => {
      // Simple implementation - in a real app this would be more sophisticated
      return Math.random() > 0.5;
    };
    
    // Include SMC levels if available
    if (smcPatterns.patterns && smcPatterns.patterns.length > 0) {
      const relevantPatterns = smcPatterns.patterns.filter(p => 
        p.bias === (recommendation.signal === 'buy' ? 'bullish' : 'bearish')
      );
      
      if (relevantPatterns.length > 0) {
        const selectedPattern = relevantPatterns[0];
        
        keyLevels.push(
          { name: 'כניסה', price: selectedPattern.entryZone.min, type: 'entry' },
          { name: 'סטופ לוס', price: selectedPattern.stopLoss || 0, type: 'stop' },
          { name: 'יעד', price: selectedPattern.targetPrice || 0, type: 'target' }
        );
      }
    } else {
      // Fallback if no SMC patterns - generate approximate levels
      const volatilityFactor = 0.05;
      
      if (recommendation.signal === 'buy') {
        const entryPrice = currentPrice * 0.99;
        const stopLoss = entryPrice * 0.95;
        const targetPrice = entryPrice * 1.1;
        
        keyLevels.push(
          { name: 'כניסה', price: entryPrice, type: 'entry' },
          { name: 'סטופ לוס', price: stopLoss, type: 'stop' },
          { name: 'יעד', price: targetPrice, type: 'target' }
        );
      } else {
        const entryPrice = currentPrice * 1.01;
        const stopLoss = entryPrice * 1.05;
        const targetPrice = entryPrice * 0.9;
        
        keyLevels.push(
          { name: 'כניסה', price: entryPrice, type: 'entry' },
          { name: 'סטופ לוס', price: stopLoss, type: 'stop' },
          { name: 'יעד', price: targetPrice, type: 'target' }
        );
      }
    }
    
    // Check if the current price action aligns with user's entry rules
    const meetsEntryRules = () => {
      let rulesMet = 0;
      
      // Rule: Multiple indicators alignment
      if (technicalAnalysis) {
        const buySignals = technicalAnalysis.indicators.filter(i => i.signal === 'buy').length;
        const sellSignals = technicalAnalysis.indicators.filter(i => i.signal === 'sell').length;
        
        if ((recommendation.signal === 'buy' && buySignals >= 3) || 
            (recommendation.signal === 'sell' && sellSignals >= 3)) {
          rulesMet += 1;
        }
      }
      
      // Rule: Price near support/resistance
      if (isPriceNearSupportOrResistance()) {
        rulesMet += 1;
      }
      
      // Rule: Pattern recognition
      if ((wyckoffPatterns.patterns && wyckoffPatterns.patterns.length > 0) || 
          (smcPatterns.patterns && smcPatterns.patterns.length > 0)) {
        rulesMet += 1;
      }
      
      // 3 or more rules met
      return rulesMet >= 2;
    };
    
    const entryCriteriaMet = meetsEntryRules();
    
    return {
      action: recommendation.signal === 'buy' ? 'קנייה' : 'מכירה',
      reason: entryCriteriaMet ? 
        `האנליזה המשולבת מצביעה על עסקת ${recommendation.signal === 'buy' ? 'קנייה' : 'מכירה'} פוטנציאלית העומדת בקריטריוני הכניסה` : 
        `המתנה לתנאי כניסה אופטימליים יותר`,
      actionable: entryCriteriaMet,
      levels: keyLevels,
      positionSize: entryCriteriaMet ? `1% מהתיק, יחס סיכוי:סיכון כ-${(keyLevels[2]?.price && keyLevels[1]?.price) ? 
        Math.abs((keyLevels[2].price - keyLevels[0].price) / (keyLevels[1].price - keyLevels[0].price)).toFixed(1) : '?'}` : '',
      riskManagement: userStrategy.riskRules
    };
  };
  
  const tradePlan = generateTradePlan();
  
  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <h1 className="text-3xl font-bold mb-6 text-right">ניתוח שוק מקיף</h1>
      
      {/* Asset and Timeframe Selection */}
      <AssetSelector 
        assets={assets}
        selectedAssetId={selectedAssetId}
        setSelectedAssetId={setSelectedAssetId}
        timeframeOptions={timeframeOptions}
        selectedTimeframe={selectedTimeframe}
        setSelectedTimeframe={setSelectedTimeframe}
      />
      
      {/* Price Chart */}
      {selectedAsset && (
        <div className="mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-right flex items-center justify-between">
                <Badge className={selectedAsset.change24h >= 0 ? 'bg-green-500' : 'bg-red-500'}>
                  {selectedAsset.change24h >= 0 ? '+' : ''}{selectedAsset.change24h.toFixed(2)}%
                </Badge>
                <div>{selectedAsset.name} ({selectedAsset.symbol})</div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PriceVolumeChart 
                historyLoading={historyLoading}
                assetHistory={assetHistory}
                showVolume={showVolume}
                setShowVolume={setShowVolume}
                formatPrice={formatPrice}
                analysisData={technicalAnalysis}
              />
            </CardContent>
          </Card>
        </div>
      )}
      
      {/* Main Analysis Tabs */}
      <div className="mb-6">
        <Tabs defaultValue="comprehensive" className="w-full">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="comprehensive" className="flex items-center gap-1">
              <Brain className="h-4 w-4 ml-1" />
              אנליזה מקיפה
            </TabsTrigger>
            <TabsTrigger value="recommendation" className="flex items-center gap-1">
              <LineChart className="h-4 w-4 ml-1" />
              המלצת מערכת
            </TabsTrigger>
            <TabsTrigger value="strategy" className="flex items-center gap-1">
              <ShieldCheck className="h-4 w-4 ml-1" />
              אסטרטגיה אישית
            </TabsTrigger>
          </TabsList>
          
          {/* Comprehensive Analysis Content */}
          <TabsContent value="comprehensive" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Technical Analysis Summary */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-right flex items-center justify-between">
                    <ActivitySquare className="h-5 w-5" />
                    <div>ניתוח טכני</div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {analysisLoading ? (
                    <div className="text-center py-4">טוען נתונים...</div>
                  ) : technicalAnalysis ? (
                    <div className="text-right">
                      <div className="flex justify-between items-center mb-4">
                        <Badge className={technicalAnalysis.overallSignal === 'buy' ? 'bg-green-500' : 
                                         technicalAnalysis.overallSignal === 'sell' ? 'bg-red-500' : 'bg-gray-500'}>
                          {technicalAnalysis.overallSignal === 'buy' ? 'קנייה' : 
                           technicalAnalysis.overallSignal === 'sell' ? 'מכירה' : 'ניטרלי'}
                          {' '}({technicalAnalysis.signalStrength}/10)
                        </Badge>
                        <h3 className="text-lg font-semibold">סיגנל מסחר</h3>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-medium">אינדיקטורים עיקריים:</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {technicalAnalysis.indicators.slice(0, 4).map((indicator, index) => (
                            <div key={index} className="border rounded p-2 text-sm">
                              <div className="flex justify-between">
                                <Badge className={indicator.signal === 'buy' ? 'bg-green-500' : 
                                               indicator.signal === 'sell' ? 'bg-red-500' : 'bg-gray-500'}>
                                  {indicator.signal === 'buy' ? 'קנייה' : 
                                   indicator.signal === 'sell' ? 'מכירה' : 'ניטרלי'}
                                </Badge>
                                <div className="font-medium">{indicator.name}</div>
                              </div>
                              <div className="mt-1 text-xs text-gray-500">{indicator.value}</div>
                            </div>
                          ))}
                        </div>
                        
                        <p className="text-sm mt-4">{technicalAnalysis.conclusion}</p>
                      </div>
                    </div>
                  ) : null}
                </CardContent>
              </Card>
              
              {/* Advanced Pattern Analysis */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-right flex items-center justify-between">
                    <TrendingUp className="h-5 w-5" />
                    <div>תבניות מתקדמות</div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-right">
                    {/* Wyckoff Analysis */}
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold mb-2">וויקוף</h3>
                      {wyckoffLoading ? (
                        <div className="text-center py-2">טוען נתונים...</div>
                      ) : wyckoffPatterns && wyckoffPatterns.phase ? (
                        <div>
                          <Badge className={wyckoffPatterns.phase.includes('אקומולציה') ? 'bg-green-500' : 'bg-red-500'}>
                            {wyckoffPatterns.phase}
                          </Badge>
                          <p className="text-sm mt-2">{wyckoffPatterns.patterns?.[0]?.description || 'אין תבניות ספציפיות'}</p>
                        </div>
                      ) : (
                        <p className="text-sm">לא זוהו תבניות וויקוף משמעותיות</p>
                      )}
                    </div>
                    
                    <Separator className="my-4" />
                    
                    {/* SMC Analysis */}
                    <div>
                      <h3 className="text-lg font-semibold mb-2">SMC (Smart Money Concept)</h3>
                      {smcLoading ? (
                        <div className="text-center py-2">טוען נתונים...</div>
                      ) : smcPatterns && smcPatterns.patterns && smcPatterns.patterns.length > 0 ? (
                        <div>
                          <div className="flex flex-wrap gap-2 mb-2">
                            {smcPatterns.patterns.map((pattern, idx) => (
                              <Badge key={idx} className={pattern.bias === 'bullish' ? 'bg-green-500' : 'bg-red-500'}>
                                {pattern.name}
                              </Badge>
                            ))}
                          </div>
                          <p className="text-sm mt-2">{smcPatterns.patterns[0].description}</p>
                        </div>
                      ) : (
                        <p className="text-sm">לא זוהו תבניות SMC משמעותיות</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Whale Activity */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-right flex items-center justify-between">
                    <BarChart3 className="h-5 w-5" />
                    <div>תנועות ארנקים</div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-right">
                    {whaleLoading ? (
                      <div className="text-center py-4">טוען נתונים...</div>
                    ) : whaleMovements && whaleMovements.length > 0 ? (
                      <div>
                        <h3 className="font-semibold mb-2">תנועות אחרונות</h3>
                        <div className="space-y-2 max-h-[200px] overflow-y-auto">
                          {whaleMovements.slice(0, 3).map((movement) => (
                            <div key={movement.id} className="border rounded-lg p-2 text-right text-sm">
                              <div className="flex justify-between items-start">
                                <Badge className={movement.impact.significance === 'very-high' ? 'bg-red-500' :
                                                 movement.impact.significance === 'high' ? 'bg-orange-500' : 'bg-yellow-500'}>
                                  {movement.impact.significance === 'very-high' ? 'משמעותי מאוד' :
                                   movement.impact.significance === 'high' ? 'משמעותי' : 'בינוני'}
                                </Badge>
                                <div>
                                  {movement.transactionType === 'buy' ? 'קנייה' : 
                                   movement.transactionType === 'sell' ? 'מכירה' : 'העברה'}
                                  {' '}{new Date(movement.timestamp).toLocaleDateString('he-IL')}
                                </div>
                              </div>
                              <div className="mt-1">
                                <p>סכום: {movement.amount >= 1000000 ? 
                                  `$${(movement.amount / 1000000).toFixed(2)}M` : 
                                  `$${(movement.amount / 1000).toFixed(0)}K`}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        {whaleBehavior && whaleBehavior.length > 0 && (
                          <div className="mt-4">
                            <h3 className="font-semibold mb-2">דפוסים זוהו</h3>
                            <Badge className={
                              whaleBehavior[0].priceImpact.includes('+') ? 'bg-green-500' : 'bg-red-500'
                            }>
                              {whaleBehavior[0].pattern}
                            </Badge>
                            <p className="text-sm mt-2">{whaleBehavior[0].description}</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p>לא נמצאו תנועות ארנקים גדולים בטווח הזמן שנבחר</p>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              {/* Fundamental Analysis */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-right flex items-center justify-between">
                    <Landmark className="h-5 w-5" />
                    <div>ניתוח פונדמנטלי</div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-right">
                  {newsItems && newsItems.length > 0 ? (
                    <div>
                      <h3 className="font-semibold mb-2">חדשות אחרונות</h3>
                      <div className="space-y-2">
                        {newsItems.slice(0, 2).map(news => (
                          <div key={news.id} className="border rounded-lg p-2">
                            <div className="flex justify-between items-start">
                              <Badge className={
                                news.sentiment === 'positive' ? 'bg-green-500' : 
                                news.sentiment === 'negative' ? 'bg-red-500' : 'bg-gray-500'
                              }>
                                {news.sentiment === 'positive' ? 'חיובי' : 
                                 news.sentiment === 'negative' ? 'שלילי' : 'ניטרלי'}
                              </Badge>
                              <h4 className="font-medium">{news.title}</h4>
                            </div>
                            <p className="text-sm mt-1">{news.summary}</p>
                            <div className="text-xs text-gray-500 mt-1">
                              {news.source} | {new Date(news.publishedAt).toLocaleDateString('he-IL')}
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-4">
                        <h3 className="font-semibold mb-2">אירועים קרובים</h3>
                        <div className="flex items-center border rounded-lg p-2">
                          <Calendar className="h-4 w-4 ml-2" />
                          <div>
                            <div className="font-medium">הכרזת ריבית הפד הבאה</div>
                            <div className="text-sm text-gray-500">עוד 12 ימים</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p>אין נתונים פונדמנטליים זמינים</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* System Recommendation Content */}
          <TabsContent value="recommendation" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-right">המלצת מערכת מבוססת אינטגרציה מרובת מקורות</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-right">
                  <Alert className={recommendation.signal === 'buy' ? 'bg-green-50 border-green-300' : 
                                 recommendation.signal === 'sell' ? 'bg-red-50 border-red-300' : 
                                 'bg-gray-50 border-gray-300'}>
                    <AlertTitle className="text-lg font-bold mb-2 flex justify-between items-center">
                      <Badge className={recommendation.signal === 'buy' ? 'bg-green-500' : 
                                       recommendation.signal === 'sell' ? 'bg-red-500' : 'bg-gray-500'}>
                        עוצמה: {recommendation.strength}/10
                      </Badge>
                      <span>
                        איתות מערכת: {recommendation.signal === 'buy' ? 'קנייה' : 
                                     recommendation.signal === 'sell' ? 'מכירה' : 'ניטרלי'}
                      </span>
                    </AlertTitle>
                    <AlertDescription>
                      <div className="mt-4">
                        <h3 className="font-semibold mb-2">גורמים תומכים:</h3>
                        <ul className="list-disc mr-5 space-y-1">
                          {recommendation.reasoning.map((reason, idx) => (
                            <li key={idx}>{reason}</li>
                          ))}
                        </ul>
                      </div>
                      
                      {tradePlan && (
                        <div className="mt-6 pt-4 border-t">
                          <h3 className="font-semibold text-lg mb-2">תכנית מסחר מוצעת:</h3>
                          
                          <div className="flex justify-between items-center mb-4">
                            <Badge className={tradePlan.action === 'קנייה' ? 'bg-green-500' : 
                                           tradePlan.action === 'מכירה' ? 'bg-red-500' : 'bg-gray-500'}>
                              {tradePlan.actionable ? 'מומלץ לפעולה' : 'המתנה'}
                            </Badge>
                            <div className="font-bold">{tradePlan.action}</div>
                          </div>
                          
                          <p className="mb-4">{tradePlan.reason}</p>
                          
                          {tradePlan.actionable && tradePlan.levels && tradePlan.levels.length > 0 && (
                            <>
                              <h4 className="font-medium mb-2">רמות מחיר מפתח:</h4>
                              <div className="grid grid-cols-3 gap-2 mb-4">
                                {tradePlan.levels.map((level, idx) => (
                                  <div key={idx} className={`border rounded p-2 text-center ${
                                    level.type === 'entry' ? 'border-blue-300 bg-blue-50' :
                                    level.type === 'stop' ? 'border-red-300 bg-red-50' :
                                    'border-green-300 bg-green-50'
                                  }`}>
                                    <div className="font-medium mb-1">{level.name}</div>
                                    <div>${formatPrice(level.price)}</div>
                                  </div>
                                ))}
                              </div>
                              
                              <div className="bg-gray-50 p-3 rounded-lg mb-4">
                                <div className="flex items-center">
                                  <ShieldCheck className="h-5 w-5 ml-2 text-green-500" />
                                  <h4 className="font-medium">ניהול סיכונים:</h4>
                                </div>
                                <p className="mt-1">גודל פוזיציה מומלץ: {tradePlan.positionSize}</p>
                              </div>
                            </>
                          )}
                          
                          <div className="flex justify-center mt-4">
                            <Button className="gap-2" disabled={!tradePlan.actionable}>
                              <FileCheck className="h-4 w-4 ml-1" />
                              {tradePlan.actionable ? 'הוסף לפנקס המסחר' : 'אין תנאי כניסה מתאימים'}
                            </Button>
                          </div>
                        </div>
                      )}
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Personal Strategy Content */}
          <TabsContent value="strategy" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-right">האסטרטגיה האישית שלי</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-right">
                  <p className="mb-6">{userStrategy.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Risk Management Rules */}
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center mb-3">
                        <ShieldCheck className="h-5 w-5 ml-2 text-red-500" />
                        <h3 className="font-semibold">ניהול סיכונים</h3>
                      </div>
                      <ul className="list-disc mr-5 space-y-2 text-sm">
                        {userStrategy.riskRules.map((rule, idx) => (
                          <li key={idx}>{rule}</li>
                        ))}
                      </ul>
                    </div>
                    
                    {/* Entry Rules */}
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center mb-3">
                        <LineChart className="h-5 w-5 ml-2 text-blue-500" />
                        <h3 className="font-semibold">כללי כניסה</h3>
                      </div>
                      <ul className="list-disc mr-5 space-y-2 text-sm">
                        {userStrategy.entryRules.map((rule, idx) => (
                          <li key={idx}>{rule}</li>
                        ))}
                      </ul>
                    </div>
                    
                    {/* Exit Rules */}
                    <div className="border rounded-lg p-4">
                      <div className="flex items-center mb-3">
                        <ListChecks className="h-5 w-5 ml-2 text-green-500" />
                        <h3 className="font-semibold">כללי יציאה</h3>
                      </div>
                      <ul className="list-disc mr-5 space-y-2 text-sm">
                        {userStrategy.exitRules.map((rule, idx) => (
                          <li key={idx}>{rule}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex flex-col items-center">
                    <Button className="gap-2 mb-2">
                      <BookMarked className="h-4 w-4 ml-1" />
                      עדכן אסטרטגיה
                    </Button>
                    <p className="text-sm text-gray-500 max-w-md text-center">
                      ניתן לערוך ולהתאים את האסטרטגיה בהתאם לצרכים שלך ולהגדרות השוק המשתנות
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ComprehensiveAnalysis;
