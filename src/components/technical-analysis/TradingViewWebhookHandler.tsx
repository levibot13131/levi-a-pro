
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useWebhookSignals } from '@/hooks/use-webhook-signals';
import WebhookGuide from './webhook/WebhookGuide';
import WebhookUrlDisplay from './webhook/WebhookUrlDisplay';
import SignalsList from './webhook/SignalsList';

const TradingViewWebhookHandler: React.FC = () => {
  const { signals, isConnected, webhookUrl, copyWebhookUrl } = useWebhookSignals();
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <Badge className={isConnected ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
          {isConnected ? "מחובר" : "מנותק"}
        </Badge>
        <div>
          <CardTitle className="text-right">איתותים מטריידינגויו</CardTitle>
          <CardDescription className="text-right">
            מקבל איתותים אוטומטיים מהגדרות ההתראות שלך
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <WebhookUrlDisplay webhookUrl={webhookUrl} onCopy={copyWebhookUrl} />
        <WebhookGuide />
        <SignalsList signals={signals} />
      </CardContent>
    </Card>
  );
};

export default TradingViewWebhookHandler;
