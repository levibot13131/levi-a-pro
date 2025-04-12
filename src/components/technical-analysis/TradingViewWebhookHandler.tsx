
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import WebhookTester from '../tradingview/webhook/WebhookTester';

const TradingViewWebhookHandler: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-right">הגדרת Webhook לקבלת התראות</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-right">
            <p className="text-sm text-muted-foreground mb-4">
              כדי לקבל התראות מ-TradingView, הגדר את כתובת ה-Webhook הבאה בהגדרות ההתראות של TradingView:
            </p>
            
            <div className="bg-muted p-3 rounded-md relative mb-2">
              <code dir="ltr" className="text-xs font-mono break-all">
                {window.location.origin}/api/tradingview/webhook
              </code>
              <button
                className="absolute top-2 right-2 text-xs p-1 bg-primary text-primary-foreground rounded"
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}/api/tradingview/webhook`);
                }}
              >
                העתק
              </button>
            </div>
            
            <p className="text-xs text-muted-foreground">
              המערכת תעבד את ההתראות באופן אוטומטי ותשלח אותן ליעדים שהגדרת.
            </p>
          </div>
        </CardContent>
      </Card>
      
      <WebhookTester />
    </div>
  );
};

export default TradingViewWebhookHandler;
