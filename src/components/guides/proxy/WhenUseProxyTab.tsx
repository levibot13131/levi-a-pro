
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const WhenUseProxyTab = () => {
  return (
    <div className="text-base space-y-4">
      <h3 className="text-lg font-bold mb-2">מתי כדאי להשתמש בשרת פרוקסי?</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-md">למסחר באלגוטריידינג</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p>
              כאשר משתמשים בבוטים אוטומטיים למסחר, פרוקסי יכול לעזור לעקוף מגבלות של API ולהפחית את הסיכוי לחסימה.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-md">לגישה למידע מוגבל</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p>
              מחקר שוק ואיסוף נתונים ממקורות שונים שעשויים להיות מוגבלים גיאוגרפית.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-md">שימוש בבורסות קריפטו</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p>
              גישה לבורסות קריפטו שאינן זמינות באזור שלך או עקיפת מגבלות גיאוגרפיות.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-md">הגנה על פרטיות</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p>
              שמירה על פרטיותך בעת ביצוע מחקר שוק או פעילות מסחרית רגישה.
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>אזהרה</AlertTitle>
        <AlertDescription>
          השימוש בפרוקסי עלול להיות מנוגד לתנאי השימוש של שירותים מסוימים. וודא שאתה פועל בהתאם לחוקים ולתנאי השימוש הרלוונטיים.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default WhenUseProxyTab;
