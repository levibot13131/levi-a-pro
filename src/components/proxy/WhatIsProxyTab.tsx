
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info } from 'lucide-react';

const WhatIsProxyTab = () => {
  return (
    <div className="text-base space-y-4">
      <h3 className="text-lg font-bold mb-2">מה זה שרת פרוקסי?</h3>
      <p className="mb-3">
        שרת פרוקסי הוא שרת ביניים שמשמש כמתווך בין המחשב שלך לאינטרנט. 
        הוא מאפשר לך לגלוש באינטרנט דרך כתובת IP אחרת, ובכך להסתיר את כתובת ה-IP האמיתית שלך.
      </p>
      
      <div className="bg-muted p-4 rounded-md my-4">
        <h4 className="font-semibold mb-2">יתרונות שימוש בפרוקסי:</h4>
        <ul className="space-y-2 list-disc pr-5">
          <li>הסתרת כתובת ה-IP האמיתית שלך</li>
          <li>גישה לתוכן שחסום גיאוגרפית</li>
          <li>עקיפת חסימות של אתרים על ידי ספקי אינטרנט</li>
          <li>שיפור האבטחה ברשתות ציבוריות</li>
          <li>אפשרות גישה למקורות מידע מסחריים המוגבלים למיקומים מסוימים</li>
        </ul>
      </div>
      
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>מידע חשוב</AlertTitle>
        <AlertDescription>
          שרת פרוקסי לא מספק הצפנה מלאה של התעבורה שלך, בניגוד ל-VPN. אם אתה צריך אבטחה מלאה, שקול להשתמש ב-VPN.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default WhatIsProxyTab;
