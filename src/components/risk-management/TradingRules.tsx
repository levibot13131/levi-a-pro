
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface TradingRulesProps {
  showDetails?: boolean;
}

const TradingRules: React.FC<TradingRulesProps> = ({ showDetails = false }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-right">כללי מסחר Levi Bot</CardTitle>
      </CardHeader>
      <CardContent className="text-right">
        <div className="space-y-4">
          <div className="flex items-start space-x-2 rtl:space-x-reverse">
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
            <div>
              <h3 className="font-semibold text-lg">סיכון מרבי: 1% לעסקה</h3>
              {showDetails && (
                <p className="text-muted-foreground text-sm">
                  לעולם אל תסכן יותר מ-1% מהתיק שלך בעסקה בודדת. זהו הכלל החשוב ביותר בניהול סיכונים.
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-start space-x-2 rtl:space-x-reverse">
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
            <div>
              <h3 className="font-semibold text-lg">יחס סיכוי-סיכון: לפחות 1:2</h3>
              {showDetails && (
                <p className="text-muted-foreground text-sm">
                  בחר רק עסקאות עם יחס סיכוי-סיכון של לפחות 1:2, כלומר הרווח הפוטנציאלי הוא לפחות כפול מהסיכון שלך.
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-start space-x-2 rtl:space-x-reverse">
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
            <div>
              <h3 className="font-semibold text-lg">תמיד השתמש בסטופ לוס</h3>
              {showDetails && (
                <p className="text-muted-foreground text-sm">
                  הגדר סטופ לוס לכל עסקה לפני הכניסה אליה, ולעולם אל תזיז את הסטופ לוס כדי להגדיל את ההפסד שלך.
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-start space-x-2 rtl:space-x-reverse">
            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
            <div>
              <h3 className="font-semibold text-lg">הימנע מלהיכנס בחדשות</h3>
              {showDetails && (
                <p className="text-muted-foreground text-sm">
                  אל תיכנס לעסקאות לפני אירועי חדשות גדולים, כגון הכרזות על ריבית או דו"חות תעסוקה.
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-start space-x-2 rtl:space-x-reverse">
            <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
            <div>
              <h3 className="font-semibold text-lg">נהל יומן מסחר</h3>
              {showDetails && (
                <p className="text-muted-foreground text-sm">
                  תעד כל עסקה ביומן המסחר שלך, כולל הסיבות לכניסה, אסטרטגיה, רגשות והלקחים שלמדת.
                </p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TradingRules;
