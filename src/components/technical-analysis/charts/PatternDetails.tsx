
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, ArrowUp, ArrowDown, Info, Target } from 'lucide-react';

interface PatternDetailsProps {
  selectedPattern: any;
  onClose: () => void;
  formatPrice: (price: number) => string;
}

const PatternDetails: React.FC<PatternDetailsProps> = ({
  selectedPattern,
  onClose,
  formatPrice
}) => {
  if (!selectedPattern) return null;

  // הסברים מפורטים יותר לתבניות נפוצות
  const getDetailedExplanation = (pattern: any) => {
    // בדיקה אם יש כבר הסבר מפורט
    if (pattern.detailedExplanation) return pattern.detailedExplanation;
    
    // אחרת מייצרים הסבר לפי סוג התבנית
    const patternName = pattern.name.toLowerCase();
    
    if (patternName.includes('order block') || patternName.includes('אורדר בלוק')) {
      return `אורדר בלוק היא נקודה במחיר שממנה התחילה תנועה משמעותית. זהו אזור בו "כסף חכם" ביצע עסקאות גדולות. כאשר המחיר חוזר לבדוק אזור זה, זו הזדמנות כניסה עם יחס סיכון/רווח טוב.

מה לעשות: כאשר המחיר מגיע לאזור זה, חפש אישור נוסף (נרות היפוך, דחייה מהרמה) לפני כניסה לפוזיציה. סטופ לוס יוצב מתחת/מעל האזור.`;
    }
    
    if (patternName.includes('fair value gap') || patternName.includes('פער')) {
      return `פער שווי הוגן (FVG) הוא פער במחיר שנוצר בגלל תנועה מהירה מאוד. השוק "מחפש" לסגור פערים אלו, ולכן כאשר המחיר חוזר לאזור הפער, יש סיכוי גבוה שימשיך בכיוון המקורי לאחר מכן.

מה לעשות: חפש נקודת כניסה כאשר המחיר מגיע לאמצע הפער. סטופ לוס יוצב מעבר לגבול הפער.`;
    }
    
    if (patternName.includes('ראש וכתפיים') || patternName.includes('head and shoulders')) {
      return `תבנית ראש וכתפיים היא תבנית היפוך קלאסית, המורכבת משלושה שיאים כאשר האמצעי (הראש) גבוה יותר מהשניים האחרים (הכתפיים). פריצה מתחת לקו הצוואר מאשרת את התבנית ומעידה על היפוך מגמה.

מה לעשות: אם המחיר שובר את קו הצוואר, שקול כניסה לפוזיציית מכירה. יעד המחיר הוא בדרך כלל המרחק מהראש לקו הצוואר.`;
    }
    
    if (patternName.includes('משולש') || patternName.includes('triangle')) {
      return `תבנית משולש היא תבנית המשכית הנוצרת כאשר המחיר נע בתוך טווח מתכנס. קיימים משולשים עולים, יורדים וסימטריים. פריצה מהמשולש בדרך כלל מובילה להמשך המגמה הקודמת.

מה לעשות: חפש כניסה בכיוון הפריצה מהמשולש. יעד המחיר הוא בדרך כלל הבסיס של המשולש.`;
    }
    
    if (pattern.phase && pattern.phase.includes('אקומולציה')) {
      return `שלב האקומולציה בתיאוריית וויקוף מתאר תקופה שבה "כסף חכם" צובר מניות/מטבעות בזמן שהשוק נע בטווח צר. זהו שלב שמופיע לאחר ירידה משמעותית ולפני עלייה חדשה.

מה לעשות: חפש סימנים של צבירה (עלייה בנפח בתחתית הטווח) ושקול פוזיציית קנייה לטווח בינוני-ארוך.`;
    }
    
    if (pattern.phase && pattern.phase.includes('דיסטריביושן')) {
      return `שלב ההפצה בתיאוריית וויקוף מתאר תקופה שבה "כסף חכם" מוכר את האחזקות שלו בזמן שהשוק עדיין נראה חזק. זהו שלב שמופיע לאחר עלייה משמעותית ולפני ירידה חדשה.

מה לעשות: חפש סימנים של חולשה (ירידה בנפח בשיאים) ושקול יציאה מפוזיציות ארוכות או כניסה לפוזיציית מכירה.`;
    }
    
    // תבניות נרות יפניים
    if (patternName.includes('דוג׳י') || patternName.includes('doji')) {
      return `נר דוג׳י מופיע כאשר מחירי הפתיחה והסגירה כמעט זהים. זהו סימן להיסוס בשוק ופעמים רבות מסמן נקודת היפוך פוטנציאלית, במיוחד לאחר מגמה חזקה.

מה לעשות: חפש אישור נוסף (נר המשך בכיוון ההיפוך) לפני כניסה לפוזיציה.`;
    }
    
    if (patternName.includes('בליעה') || patternName.includes('engulfing')) {
      return `תבנית בליעה מורכבת משני נרות כאשר הנר השני "בולע" את הנר הראשון (גוף הנר השני גדול יותר וכולל את כל טווח גוף הנר הראשון). זהו סימן חזק להיפוך מגמה.

מה לעשות: שקול כניסה לפוזיציה בכיוון הנר הבולע, עם סטופ לוס מתחת/מעל לקצה הפתיל של הנר הבולע.`;
    }
    
    // ברירת מחדל
    return pattern.description || 'אין הסבר מפורט זמין לתבנית זו.';
  };

  const getActionSteps = (pattern: any) => {
    // אם יש כבר צעדי פעולה מוגדרים
    if (pattern.actionSteps) return pattern.actionSteps;
    
    // ברירת מחדל לפי סוג התבנית
    const isBullish = pattern.type?.includes('bullish') || pattern.type?.includes('buy') || 
                      (pattern.bias && pattern.bias === 'bullish');
    
    if (isBullish) {
      return [
        "חפש נר אישור (נר ירוק חזק) לאחר זיהוי התבנית",
        "בדוק שנפח המסחר תומך במהלך (עלייה בנפח)",
        "כניסה כשהמחיר פורץ מעל נקודת ההתנגדות האחרונה",
        "סטופ לוס מתחת לתחתית התבנית או מתחת לתמיכה הקרובה",
        "יעד רווח לפי יחס סיכוי/סיכון של לפחות 1:2"
      ];
    } else {
      return [
        "חפש נר אישור (נר אדום חזק) לאחר זיהוי התבנית",
        "בדוק שנפח המסחר תומך במהלך (עלייה בנפח)",
        "כניסה כשהמחיר שובר מתחת לנקודת התמיכה האחרונה",
        "סטופ לוס מעל לשיא התבנית או מעל להתנגדות הקרובה",
        "יעד רווח לפי יחס סיכוי/סיכון של לפחות 1:2"
      ];
    }
  };

  return (
    <Card className="absolute top-0 right-0 w-auto min-w-72 max-w-sm z-10 shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <Button variant="ghost" size="icon" onClick={onClose} className="h-6 w-6 p-0">
            ✕
          </Button>
          <div className="flex flex-col items-end">
            <CardTitle className="text-right text-lg">{selectedPattern.name}</CardTitle>
            <Badge 
              className={
                selectedPattern.type?.includes('bullish') || selectedPattern.type?.includes('buy')
                  ? 'bg-green-100 text-green-800 mt-1' 
                  : selectedPattern.type?.includes('bearish') || selectedPattern.type?.includes('sell')
                    ? 'bg-red-100 text-red-800 mt-1'
                    : 'bg-blue-100 text-blue-800 mt-1'
              }
            >
              {selectedPattern.type?.includes('bullish') || selectedPattern.type?.includes('buy')
                ? 'מגמה עולה' 
                : selectedPattern.type?.includes('bearish') || selectedPattern.type?.includes('sell')
                  ? 'מגמה יורדת'
                  : 'מגמה ניטרלית'
              }
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="text-right">
        <div className="space-y-3">
          <div className="space-y-1">
            <div className="font-medium flex items-center justify-end gap-1">
              <Info className="h-4 w-4" />
              <span>הסבר התבנית:</span>
            </div>
            <p className="text-sm">{getDetailedExplanation(selectedPattern)}</p>
          </div>
          
          {selectedPattern.probability && (
            <div className="flex justify-between items-center text-sm bg-blue-50 p-2 rounded-md">
              <div className="font-medium">{selectedPattern.probability}%</div>
              <div>סבירות להתממשות:</div>
            </div>
          )}
          
          {selectedPattern.keyLevels && (
            <div className="space-y-1">
              <div className="font-medium flex items-center justify-end gap-1">
                <Target className="h-4 w-4" />
                <span>רמות מפתח:</span>
              </div>
              <ul className="text-sm space-y-1 bg-gray-50 p-2 rounded-md">
                {selectedPattern.keyLevels.map((level: any, i: number) => (
                  <li key={i} className="flex justify-between">
                    <span>{formatPrice(level.price)}</span>
                    <span>{level.name}:</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="space-y-1">
            <div className="font-medium flex items-center justify-end gap-1">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              <span>מה לעשות:</span>
            </div>
            <ul className="text-sm list-inside space-y-1 bg-yellow-50 p-2 rounded-md">
              {getActionSteps(selectedPattern).map((step, i) => (
                <li key={i} className="flex justify-end gap-2">
                  <span className="text-right">{step}</span>
                  <span className="font-bold">{i+1}.</span>
                </li>
              ))}
            </ul>
          </div>
          
          {(selectedPattern.targetPrice || selectedPattern.stopLoss) && (
            <div className="grid grid-cols-2 gap-2 bg-gray-50 p-2 rounded-md">
              {selectedPattern.targetPrice && (
                <div className="text-right">
                  <div className="text-xs text-gray-600">יעד מחיר</div>
                  <div className="font-medium text-green-600">
                    {formatPrice(selectedPattern.targetPrice)}
                  </div>
                </div>
              )}
              {selectedPattern.stopLoss && (
                <div className="text-right">
                  <div className="text-xs text-gray-600">סטופ לוס</div>
                  <div className="font-medium text-red-600">
                    {formatPrice(selectedPattern.stopLoss)}
                  </div>
                </div>
              )}
            </div>
          )}
          
          {selectedPattern.riskRewardRatio && (
            <div className="text-right bg-blue-50 p-2 rounded-md">
              <div className="text-xs text-gray-600">יחס סיכוי/סיכון</div>
              <div className="font-medium">1:{selectedPattern.riskRewardRatio}</div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PatternDetails;
