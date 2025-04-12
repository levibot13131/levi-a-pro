
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useWhatsAppIntegration } from '@/hooks/use-whatsapp-integration';
import { Phone, QrCode, Send, Check, Loader2 } from 'lucide-react';

const WhatsappIntegrationPanel: React.FC = () => {
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [stage, setStage] = useState<'connect' | 'verify'>('connect');
  
  const { 
    isConnected, 
    phoneNumber,
    isPending,
    qrCode,
    connectWhatsApp,
    verifyConnection,
    disconnectWhatsApp 
  } = useWhatsAppIntegration();
  
  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;
    
    const result = await connectWhatsApp(phone);
    if (result.success) {
      setStage('verify');
    }
  };
  
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) return;
    
    const result = await verifyConnection(code);
    if (result.success) {
      setCode('');
      setPhone('');
      setStage('connect');
    }
  };
  
  if (isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-right">חיבור וואטסאפ</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <Phone className="h-8 w-8 text-green-600" />
          </div>
          
          <h3 className="text-xl font-semibold mb-2">וואטסאפ מחובר</h3>
          <p className="text-muted-foreground mb-6">
            אתה מחובר למספר {phoneNumber}
          </p>
          
          <div className="space-y-2 w-full">
            <div className="p-3 bg-muted rounded-md">
              <div className="flex justify-between mb-1">
                <Check className="h-4 w-4 text-green-500" />
                <h4 className="font-medium text-right">התראות סיגנלים</h4>
              </div>
              <p className="text-sm text-muted-foreground text-right">
                התראות על סיגנלי קנייה ומכירה חדשים.
              </p>
            </div>
            
            <div className="p-3 bg-muted rounded-md">
              <div className="flex justify-between mb-1">
                <Check className="h-4 w-4 text-green-500" />
                <h4 className="font-medium text-right">עדכוני שוק</h4>
              </div>
              <p className="text-sm text-muted-foreground text-right">
                עדכונים יומיים על מצב השוק והנכסים המעוקבים.
              </p>
            </div>
          </div>
          
          <Button 
            variant="destructive" 
            className="mt-8 w-full"
            onClick={() => disconnectWhatsApp()}
          >
            נתק וואטסאפ
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-right">חיבור וואטסאפ</CardTitle>
      </CardHeader>
      <CardContent>
        {stage === 'connect' ? (
          <form onSubmit={handleConnect} className="space-y-4">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">קבל התראות לוואטסאפ</h3>
              <p className="text-sm text-muted-foreground mt-1">
                חבר את וואטסאפ לקבלת התראות על סיגנלים ועדכוני שוק
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-right block">מספר טלפון</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+972501234567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="text-left"
              />
              <p className="text-xs text-muted-foreground text-right">
                הכנס מספר טלפון כולל קידומת מדינה
              </p>
            </div>
            
            <Button 
              type="submit" 
              className="w-full"
              disabled={isPending || !phone}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  מתחבר...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  שלח קוד אימות
                </>
              )}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleVerify} className="space-y-4">
            <div className="text-center mb-6">
              {qrCode ? (
                <div className="mb-4">
                  <QrCode className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <img 
                    src={qrCode} 
                    alt="WhatsApp QR Code" 
                    className="mx-auto h-48 w-48 object-cover rounded-md"
                  />
                  <p className="text-sm mt-2">סרוק את הקוד לאימות או הכנס את הקוד למטה</p>
                </div>
              ) : (
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <QrCode className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
              <h3 className="text-lg font-medium">הזן קוד אימות</h3>
              <p className="text-sm text-muted-foreground mt-1">
                שלחנו קוד אימות למספר {phone}
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="code" className="text-right block">קוד אימות</Label>
              <Input
                id="code"
                type="text"
                placeholder="123456"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="text-center text-2xl tracking-widest"
                maxLength={6}
              />
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setStage('connect')}
                type="button"
              >
                חזור
              </Button>
              <Button 
                type="submit" 
                className="flex-1"
                disabled={isPending || code.length < 6}
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    מאמת...
                  </>
                ) : (
                  'אמת קוד'
                )}
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
};

export default WhatsappIntegrationPanel;
