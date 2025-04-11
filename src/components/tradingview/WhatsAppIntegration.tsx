
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageSquare, Link, Check, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { updateAlertDestination, getAlertDestinations } from '@/services/tradingView/alerts/destinations';
import { sendAlert, createSampleAlert } from '@/services/tradingView/tradingViewAlertService';
import { toast } from 'sonner';

const WhatsAppIntegration: React.FC = () => {
  // Get WhatsApp settings from stored destinations
  const destinations = getAlertDestinations();
  const whatsappSettings = destinations.find(d => d.type === 'whatsapp');

  const [webhookUrl, setWebhookUrl] = useState(whatsappSettings?.name || '');
  const [isConnected, setIsConnected] = useState(whatsappSettings?.active || false);
  const [isConfiguring, setIsConfiguring] = useState(false);

  const handleConnect = async () => {
    if (!webhookUrl.trim()) {
      toast.error('אנא הזן כתובת Webhook תקינה');
      return;
    }
    
    setIsConfiguring(true);
    
    try {
      // Update WhatsApp destination
      updateAlertDestination('whatsapp', {
        name: webhookUrl,
        active: true
      });
      
      setIsConnected(true);
      
      toast.success('וואטסאפ חובר בהצלחה', {
        description: 'התראות ישלחו לוואטסאפ שלך'
      });
    } catch (error) {
      console.error('Error configuring WhatsApp:', error);
      toast.error('שגיאה בהגדרת וואטסאפ');
    } finally {
      setIsConfiguring(false);
    }
  };

  const disconnectWhatsApp = () => {
    try {
      updateAlertDestination('whatsapp', {
        active: false
      });
      
      setIsConnected(false);
      
      toast.info('וואטסאפ נותק');
    } catch (error) {
      console.error('Error disconnecting WhatsApp:', error);
      toast.error('שגיאה בניתוק וואטסאפ');
    }
  };

  const sendTestMessage = async () => {
    if (!isConnected) {
      toast.error('וואטסאפ לא מחובר. אנא חבר תחילה.');
      return;
    }
    
    try {
      // Send a test alert
      const sampleAlert = createSampleAlert('info');
      sampleAlert.message = "זוהי הודעת בדיקה מהמערכת";
      sampleAlert.details = "בדיקת חיבור לוואטסאפ";
      
      // Ensure indicators is an array
      sampleAlert.indicators = Array.isArray(sampleAlert.indicators) 
        ? sampleAlert.indicators 
        : [sampleAlert.indicators.toString()];
      
      const sent = await sendAlert(sampleAlert);
      
      if (sent) {
        toast.success('הודעת בדיקה נשלחה לוואטסאפ');
      } else {
        toast.error('שליחת הודעת הבדיקה נכשלה');
      }
    } catch (error) {
      console.error('Error sending test message:', error);
      toast.error('שגיאה בשליחת הודעת בדיקה');
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <span>התחברות לוואטסאפ</span>
          <MessageSquare className="h-5 w-5 text-green-500" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isConnected ? (
          <div className="space-y-4">
            <Alert variant="default" className="bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-900/50">
              <Check className="h-4 w-4" />
              <AlertTitle>מחובר לוואטסאפ</AlertTitle>
              <AlertDescription>
                התראות יישלחו אוטומטית לוואטסאפ
              </AlertDescription>
            </Alert>
            
            <div className="flex flex-col gap-2">
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={sendTestMessage}
              >
                שלח הודעת בדיקה
              </Button>
              
              <Button 
                variant="destructive" 
                className="w-full" 
                onClick={disconnectWhatsApp}
              >
                נתק וואטסאפ
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <Alert className="bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-900/50 dark:text-blue-400">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>לא מחובר לוואטסאפ</AlertTitle>
              <AlertDescription>
                חבר את וואטסאפ שלך כדי לקבל התראות
              </AlertDescription>
            </Alert>
            
            <div className="space-y-3">
              <div>
                <label htmlFor="webhook-url" className="text-sm font-medium block mb-1 text-right">
                  Webhook URL
                </label>
                <Input
                  id="webhook-url"
                  placeholder="https://hooks.pipedream.com/your-unique-webhook-id"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  dir="ltr"
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground mt-1 text-right">
                  הזן את כתובת ה-Webhook של Pipedream שלך
                </p>
              </div>
              
              <Button 
                className="w-full" 
                onClick={handleConnect} 
                disabled={isConfiguring || !webhookUrl.trim()}
              >
                {isConfiguring ? 'מתחבר...' : 'חבר לוואטסאפ'}
              </Button>
              
              <div className="text-center mt-4">
                <Button 
                  variant="link" 
                  className="text-xs gap-1"
                  asChild
                >
                  <a 
                    href="https://pipedream.com/apps/whatsapp" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <Link className="h-3 w-3" />
                    למדריך התחברות ל-Pipedream
                  </a>
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WhatsAppIntegration;
