
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileCheck, ShieldCheck } from 'lucide-react';

interface RecommendationTabProps {
  recommendation: {
    signal: 'buy' | 'sell' | 'neutral';
    strength: number;
    reasoning: string[];
  };
  tradePlan: any;
  formatPrice: (price: number) => string;
}

const RecommendationTab: React.FC<RecommendationTabProps> = ({ recommendation, tradePlan, formatPrice }) => {
  // Fallback defaults if recommendation or tradePlan are null/undefined
  const safeRecommendation = recommendation || { signal: 'neutral', strength: 0, reasoning: [] };
  const safeTradePlan = tradePlan || { action: 'המתנה', reason: 'אין מספיק נתונים לבניית תוכנית מסחר', actionable: false };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-right">המלצת מערכת מבוססת אינטגרציה מרובת מקורות</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-right">
          <Alert className={safeRecommendation.signal === 'buy' ? 'bg-green-50 border-green-300' : 
                         safeRecommendation.signal === 'sell' ? 'bg-red-50 border-red-300' : 
                         'bg-gray-50 border-gray-300'}>
            <AlertTitle className="text-lg font-bold mb-2 flex justify-between items-center">
              <Badge 
                variant={safeRecommendation.signal === 'buy' ? 'default' : 
                       safeRecommendation.signal === 'sell' ? 'destructive' : 'outline'}
                className={safeRecommendation.signal === 'buy' ? 'bg-green-500' : 
                         safeRecommendation.signal === 'sell' ? 'bg-red-500' : 'bg-gray-500'}
              >
                עוצמה: {safeRecommendation.strength}/10
              </Badge>
              <span>
                איתות מערכת: {safeRecommendation.signal === 'buy' ? 'קנייה' : 
                             safeRecommendation.signal === 'sell' ? 'מכירה' : 'ניטרלי'}
              </span>
            </AlertTitle>
            <AlertDescription>
              <div className="mt-4">
                <h3 className="font-semibold mb-2">גורמים תומכים:</h3>
                <ul className="list-disc mr-5 space-y-1">
                  {safeRecommendation.reasoning && safeRecommendation.reasoning.length > 0 ? 
                    safeRecommendation.reasoning.map((reason, idx) => (
                      <li key={idx}>{reason}</li>
                    )) : 
                    <li>אין מספיק נתונים לניתוח מעמיק</li>
                  }
                </ul>
              </div>
              
              {safeTradePlan && (
                <div className="mt-6 pt-4 border-t">
                  <h3 className="font-semibold text-lg mb-2">תכנית מסחר מוצעת:</h3>
                  
                  <div className="flex justify-between items-center mb-4">
                    <Badge 
                      variant={safeTradePlan.action === 'קנייה' ? 'default' : 
                             safeTradePlan.action === 'מכירה' ? 'destructive' : 'outline'}
                      className={safeTradePlan.action === 'קנייה' ? 'bg-green-500' : 
                               safeTradePlan.action === 'מכירה' ? 'bg-red-500' : 'bg-gray-500'}
                    >
                      {safeTradePlan.actionable ? 'מומלץ לפעולה' : 'המתנה'}
                    </Badge>
                    <div className="font-bold">{safeTradePlan.action}</div>
                  </div>
                  
                  <p className="mb-4">{safeTradePlan.reason}</p>
                  
                  {safeTradePlan.actionable && safeTradePlan.levels && safeTradePlan.levels.length > 0 && (
                    <>
                      <h4 className="font-medium mb-2">רמות מחיר מפתח:</h4>
                      <div className="grid grid-cols-3 gap-2 mb-4">
                        {safeTradePlan.levels.map((level: any, idx: number) => (
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
                        <p className="mt-1">גודל פוזיציה מומלץ: {safeTradePlan.positionSize}</p>
                      </div>
                    </>
                  )}
                  
                  <div className="flex justify-center mt-4">
                    <Button className="gap-2" disabled={!safeTradePlan.actionable}>
                      <FileCheck className="h-4 w-4 ml-1" />
                      {safeTradePlan.actionable ? 'הוסף לפנקס המסחר' : 'אין תנאי כניסה מתאימים'}
                    </Button>
                  </div>
                </div>
              )}
            </AlertDescription>
          </Alert>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecommendationTab;
