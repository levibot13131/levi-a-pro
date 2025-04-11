
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MessageSquare } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const TelegramGuide: React.FC = () => {
  return (
    <Card>
      <CardContent className="space-y-4 text-right">
        <div className="flex items-center justify-between mb-4">
          <MessageSquare className="h-5 w-5 text-blue-500" />
          <h3 className="text-lg font-bold">מדריך מפורט להתחברות לטלגרם</h3>
        </div>
        
        <Alert className="bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-900/50 dark:text-blue-400">
          <AlertTitle className="mb-2">יצירת בוט טלגרם</AlertTitle>
          <AlertDescription>
            <ol className="list-decimal list-inside space-y-1">
              <li>פתח את הטלגרם וחפש את "BotFather" (@BotFather)</li>
              <li>שלח לו את הפקודה "/newbot"</li>
              <li>מלא אחר ההוראות כדי לתת שם לבוט שלך</li>
              <li>לאחר השלמת התהליך, תקבל הודעה עם ה-API Token של הבוט שלך (לדוגמה: 1234567890:ABCDefGhIJKlmNoPQRsTUVwxyZ)</li>
              <li>שמור את ה-API Token במקום בטוח, תצטרך אותו בהמשך</li>
            </ol>
          </AlertDescription>
        </Alert>
        
        <Alert className="bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-900/50 dark:text-blue-400">
          <AlertTitle className="mb-2">מציאת Chat ID</AlertTitle>
          <AlertDescription>
            <ol className="list-decimal list-inside space-y-1">
              <li>אם זה עבור צ'אט פרטי:
                <ul className="list-disc list-inside mr-6 mt-1">
                  <li>פנה לבוט @userinfobot בטלגרם</li>
                  <li>שלח לו הודעה כלשהי</li>
                  <li>הוא יחזיר לך את ה-ID שלך, לדוגמה: 123456789</li>
                </ul>
              </li>
              <li>אם זה עבור קבוצה:
                <ul className="list-disc list-inside mr-6 mt-1">
                  <li>הוסף את הבוט שיצרת לקבוצה</li>
                  <li>שלח הודעה כלשהי בקבוצה</li>
                  <li>פתח בדפדפן: https://api.telegram.org/bot[YOUR_API_TOKEN]/getUpdates</li>
                  <li>חפש את ה-chat.id שמתחיל ב"-" (לדוגמה: -1001234567890)</li>
                </ul>
              </li>
            </ol>
          </AlertDescription>
        </Alert>
        
        <Alert className="bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-900/50 dark:text-blue-400">
          <AlertTitle className="mb-2">הגדרת האינטגרציה</AlertTitle>
          <AlertDescription>
            <ol className="list-decimal list-inside space-y-1">
              <li>הזן את ה-Bot Token שקיבלת מ-BotFather בשדה הראשון</li>
              <li>הזן את ה-Chat ID שלך בשדה השני</li>
              <li>לחץ על "חבר לטלגרם" כדי להפעיל את האינטגרציה</li>
              <li>לחץ על "שלח הודעת בדיקה" כדי לוודא שהכל עובד כראוי</li>
              <li>ההתראות יישלחו אוטומטית לטלגרם כאשר מתקבלים איתותים</li>
            </ol>
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};

export default TelegramGuide;
