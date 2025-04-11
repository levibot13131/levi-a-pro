
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, MessageCircle, Link, Check, X, Send } from 'lucide-react';
import { useWhatsappIntegration } from '@/hooks/use-whatsapp-integration';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

const WhatsAppIntegration: React.FC = () => {
  const [webhookUrl, setWebhookUrl] = useState('');
  const { 
    isConnected,
    isConfiguring,
    configureWhatsapp,
    disconnectWhatsapp,
    sendTestMessage
  } = useWhatsappIntegration();

  const handleConnect = async () => {
    await configureWhatsapp(webhookUrl);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-right flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-green-500" />
          התראות לוואטסאפ
        </CardTitle>
        {isConnected && (
          <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/20">
            מחובר
          </Badge>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {isConnected ? (
          <>
            <Alert className="bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-900/30">
              <Check className="h-4 w-4 text-green-500" />
              <AlertTitle>וואטסאפ מחובר בהצלחה</AlertTitle>
              <AlertDescription>
                ההתראות ישלחו אוטומטית לוואטסאפ שלך
              </AlertDescription>
            </Alert>
            
            <div className="space-y-2">
              <Button 
                variant="outline" 
                onClick={sendTestMessage}
                className="w-full gap-2"
              >
                <Send className="h-4 w-4" />
                שלח הודעת בדיקה
              </Button>
              
              <Button 
                variant="destructive" 
                onClick={disconnectWhatsapp}
                className="w-full gap-2"
              >
                <X className="h-4 w-4" />
                נתק וואטסאפ
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="space-y-2 text-right">
              <label htmlFor="webhook-url" className="text-sm font-medium">
                הזן את כתובת ה-Webhook של WhatsApp:
              </label>
              <Input
                id="webhook-url"
                placeholder="https://api.example.com/webhook/whatsapp"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                className="text-left dir-ltr"
              />
              <p className="text-xs text-muted-foreground">
                קבל webhook URL מספק שירות ההודעות שלך ל-WhatsApp
              </p>
            </div>
            
            <Button 
              onClick={handleConnect} 
              disabled={isConfiguring || !webhookUrl}
              className="w-full"
            >
              {isConfiguring ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  מחבר...
                </>
              ) : (
                <>
                  <Link className="mr-2 h-4 w-4" />
                  חבר לוואטסאפ
                </>
              )}
            </Button>
            
            <Separator />
            
            <div className="space-y-2 text-right">
              <h3 className="text-sm font-medium">איך לקבל webhook URL?</h3>
              <p className="text-xs text-muted-foreground">
                1. ניתן להשתמש בשירותים כמו Twilio, MessageBird או שירותים דומים לשליחת הודעות WhatsApp
              </p>
              <p className="text-xs text-muted-foreground">
                2. הירשם לאחד מהשירותים וקבל ממנו כתובת webhook
              </p>
              <p className="text-xs text-muted-foreground">
                3. העתק את ה-URL שקיבלת והדבק אותו כאן
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default WhatsAppIntegration;
