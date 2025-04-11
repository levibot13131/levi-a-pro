
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useWhatsappIntegration } from '@/hooks/use-whatsapp-integration';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Smartphone, Check, X, Send, AlertTriangle, Link, Clipboard } from 'lucide-react';
import { toast } from 'sonner';

const WhatsappIntegrationPanel: React.FC = () => {
  const {
    isConnected,
    webhookUrl,
    isConfiguring,
    configureWhatsapp,
    disconnectWhatsapp,
    sendTestMessage
  } = useWhatsappIntegration();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newWebhookUrl, setNewWebhookUrl] = useState(webhookUrl);
  
  const handleOpenDialog = () => {
    setNewWebhookUrl(webhookUrl);
    setIsDialogOpen(true);
  };
  
  const handleSaveWebhook = async () => {
    const success = await configureWhatsapp(newWebhookUrl);
    if (success) {
      setIsDialogOpen(false);
    }
  };
  
  const copyInstructions = () => {
    const instructions = `
לשליחת הודעות וואטסאפ דרך CallMeBot:

1. שמור את המספר +34 644 66 01 68 אצלך בטלפון כקשר בשם "WhatsApp API".
2. שלח הודעת WhatsApp למספר זה: 'I allow callmebot to send me messages'.
3. המתן לקבלת API KEY בתשובה.
4. העתק את ה-URL הבא לשדה Webhook URL, והחלף את {phone} עם מספר הטלפון שלך (עם קידומת מדינה, למשל 972501234567) ואת {APIKEY} עם המפתח שקיבלת:
https://api.callmebot.com/whatsapp.php?phone={phone}&apikey={APIKEY}&text=
`.trim();

    navigator.clipboard.writeText(instructions);
    toast.success('ההוראות הועתקו ללוח');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-right flex items-center justify-between">
          <Button
            variant={isConnected ? "outline" : "default"}
            size="sm"
            onClick={isConnected ? disconnectWhatsapp : handleOpenDialog}
            className="gap-1"
          >
            {isConnected ? (
              <>
                <X className="h-4 w-4" />
                נתק
              </>
            ) : (
              <>
                <Link className="h-4 w-4" />
                חבר
              </>
            )}
          </Button>
          <div className="flex items-center gap-2">
            <span>חיבור WhatsApp</span>
            <Smartphone className="h-5 w-5" />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isConnected ? (
          <div className="space-y-4">
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-md">
              <div className="flex justify-between items-center mb-3">
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 flex gap-1">
                  <Check className="h-4 w-4" />
                  מחובר
                </Badge>
                <h3 className="font-bold">WhatsApp מחובר</h3>
              </div>
              
              <div className="space-y-3">
                <div className="text-sm">
                  <span className="text-muted-foreground">מקבל התראות ב:</span>
                  <span className="font-semibold mr-1">וואטסאפ</span>
                </div>
                
                <div className="bg-white dark:bg-gray-800 p-2 rounded border text-xs dir-ltr overflow-hidden">
                  <div className="flex items-center gap-2">
                    <span className="truncate flex-1">{webhookUrl}</span>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => {
                        navigator.clipboard.writeText(webhookUrl);
                        toast.success('הועתק ללוח');
                      }}
                    >
                      <Clipboard className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end mt-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1"
                  onClick={sendTestMessage}
                >
                  <Send className="h-4 w-4" />
                  שלח הודעת בדיקה
                </Button>
              </div>
            </div>
            
            <div className="p-4 border rounded-md text-right">
              <h3 className="font-medium mb-2">סוגי התראות שישלחו</h3>
              <div className="space-y-1 text-sm">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="bg-green-100 text-green-800">פעיל</Badge>
                  <div>איתותי קנייה חזקים</div>
                </div>
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="bg-green-100 text-green-800">פעיל</Badge>
                  <div>איתותי מכירה חזקים</div>
                </div>
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="bg-green-100 text-green-800">פעיל</Badge>
                  <div>התראות פריצת רמות מרכזיות</div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-md text-right">
            <div className="flex justify-between items-center mb-3">
              <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 flex gap-1">
                <AlertTriangle className="h-4 w-4" />
                לא מחובר
              </Badge>
              <h3 className="font-bold">יש לחבר את WhatsApp</h3>
            </div>
            
            <p className="text-sm mb-4">
              חיבור WhatsApp יאפשר לך לקבל התראות וסיגנלים ישירות לטלפון שלך באמצעות וואטסאפ.
            </p>
            
            <div className="flex justify-between">
              <Button
                variant="outline"
                size="sm"
                className="gap-1"
                onClick={copyInstructions}
              >
                <Clipboard className="h-4 w-4" />
                העתק הוראות
              </Button>
              
              <Button 
                onClick={handleOpenDialog}
                className="gap-1"
              >
                <Link className="h-4 w-4" />
                חבר וואטסאפ
              </Button>
            </div>
          </div>
        )}
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-right">הגדרת חיבור WhatsApp</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 my-4 text-right">
              <div>
                <Label htmlFor="whatsapp-webhook" className="text-right block mb-2">כתובת Webhook</Label>
                <Input
                  id="whatsapp-webhook"
                  value={newWebhookUrl}
                  onChange={e => setNewWebhookUrl(e.target.value)}
                  dir="ltr"
                  placeholder="https://api.callmebot.com/whatsapp.php?phone=972501234567&apikey=123456&text="
                />
                <p className="text-sm text-muted-foreground mt-1">
                  השתמש בשירות כמו CallMeBot לקבלת Webhook לוואטסאפ
                </p>
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md text-sm">
                <h4 className="font-medium mb-1">כיצד לקבל Webhook?</h4>
                <ol className="list-decimal list-inside space-y-1">
                  <li>שמור את מספר CallMeBot בטלפון (+34 644 66 01 68)</li>
                  <li>שלח הודעת וואטסאפ: "I allow callmebot to send me messages"</li>
                  <li>המתן לקבלת API key</li>
                  <li>הכנס את ה-URL עם מספר הטלפון והמפתח שקיבלת</li>
                </ol>
                <Button 
                  variant="ghost"
                  size="sm"
                  className="mt-2 gap-1 text-xs"
                  onClick={copyInstructions}
                >
                  <Clipboard className="h-3 w-3" />
                  העתק הוראות מפורטות
                </Button>
              </div>
            </div>
            <DialogFooter className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={() => setIsDialogOpen(false)}
              >
                ביטול
              </Button>
              <Button 
                onClick={handleSaveWebhook}
                disabled={isConfiguring || !newWebhookUrl.includes('callmebot')}
              >
                {isConfiguring ? 'מחבר...' : 'שמור וחבר'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default WhatsappIntegrationPanel;
