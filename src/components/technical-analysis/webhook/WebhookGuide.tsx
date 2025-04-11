
import React from 'react';
import { Lightbulb, ExternalLink } from 'lucide-react';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from '@/components/ui/button';

const WebhookGuide: React.FC = () => {
  return (
    <Accordion type="single" collapsible className="mb-4">
      <AccordionItem value="guide">
        <AccordionTrigger className="text-right">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-yellow-500" />
            <span>מדריך להגדרת התראות בטריידינגויו</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="text-right">
          <div className="space-y-3 text-sm">
            <p className="font-medium">כדי להגדיר התראות בטריידינגויו שישלחו לכאן:</p>
            <ol className="list-decimal list-inside space-y-2">
              <li>היכנס לחשבון TradingView שלך</li>
              <li>פתח את הגרף של הנכס הרצוי</li>
              <li>לחץ על כפתור "התראות" (Alerts) בתפריט העליון</li>
              <li>הגדר תנאי להתראה (לדוגמה: מחיר מעל/מתחת לרמה מסוימת)</li>
              <li>תחת "התראה-פעולות" בחר "Webhook"</li>
              <li>העתק את כתובת ה-Webhook מלמעלה והדבק</li>
              <li>תחת "הודעה", הכנס מבנה JSON כמו בדוגמה למטה</li>
              <li>לחץ "שמור"</li>
            </ol>
            
            <div className="bg-gray-800 text-gray-100 p-2 rounded-md mt-2">
              <p className="mb-1 text-xs">דוגמה למבנה JSON להודעה:</p>
              <pre dir="ltr" className="text-xs overflow-x-auto whitespace-pre">
{`{
  "symbol": "{{ticker}}",
  "price": {{close}},
  "action": "buy",
  "message": "פריצה מעל ממוצע נע 200",
  "timestamp": "{{timenow}}"
}`}
              </pre>
            </div>
            
            <p className="font-medium mt-3">התראות מומלצות להגדרה:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>פריצה/שבירה של ממוצעים נעים (50, 200)</li>
              <li>כניסה/יציאה של RSI מאזורי קנייתיתר/מכירתיתר</li>
              <li>חציית MACD את קו האיתות</li>
              <li>פריצה/שבירה של רמות מחיר חשובות</li>
              <li>תבניות נרות ספציפיות</li>
            </ul>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full mt-2 text-xs"
              onClick={() => window.open('https://www.tradingview.com/support/solutions/43000529348-webhooks/', '_blank')}
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              למדריך המלא של טריידינגויו
            </Button>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default WebhookGuide;
