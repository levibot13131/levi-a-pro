
import React from 'react';
import { AlertCircle } from 'lucide-react';

const WebhookGuide: React.FC = () => {
  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-lg text-right flex items-center gap-2">
        <AlertCircle className="h-5 w-5 text-amber-500" />
        מדריך חיבור מהיר ל-TradingView
      </h3>
      
      <ol className="list-decimal list-inside rtl space-y-2 text-right">
        <li>היכנס לחשבון TradingView שלך</li>
        <li>פתח גרף של הנכס שברצונך לקבל התראות עליו</li>
        <li>לחץ על כפתור ההתראות (Alerts) בתפריט העליון</li>
        <li>צור התראה חדשה והגדר את התנאים לפיהם תרצה לקבל התראות</li>
        <li>תחת הגדרות ההתראה, מצא את האפשרות "Webhook URL"</li>
        <li>העתק את כתובת ה-Webhook מהשדה למטה והכנס אותו בשדה ה-URL בטריידינגויו</li>
        <li>
          בשדה "Message" הזן את פורמט ה-JSON הבא:
          <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-2 mt-1 rounded-md overflow-x-auto text-left rtl:text-right">
            {`{
  "symbol": "{{ticker}}",
  "action": "buy", // או "sell" או "info"
  "message": "{{strategy.order.alert_message}}",
  "details": "מחיר: {{close}}",
  "source": "TradingView Alert"
}`}
          </pre>
        </li>
        <li>שמור את ההתראה</li>
      </ol>
      
      <p className="text-sm text-muted-foreground text-right">
        כשההתראה תופעל בטריידינגויו, האיתות יופיע כאן באופן אוטומטי.
      </p>
    </div>
  );
};

export default WebhookGuide;
