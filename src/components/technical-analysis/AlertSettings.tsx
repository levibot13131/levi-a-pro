import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, BellRing, Check, X } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

const AlertSettings = () => {
  const [telegramWebhook, setTelegramWebhook] = useState('');
  const [whatsappWebhook, setWhatsappWebhook] = useState('');
  const [telegramConfigOpen, setTelegramConfigOpen] = useState(false);
  const [whatsappConfigOpen, setWhatsappConfigOpen] = useState(false);

  const [telegramConnected, setTelegramConnected] = useState(false);
  const [whatsappConnected, setWhatsappConnected] = useState(false);

  const saveTelegramSettings = () => {
    if (!telegramWebhook.trim()) {
      toast.error("נא להזין webhook לטלגרם");
      return;
    }
    
    toast.success("הגדרות הטלגרם נשמרו בהצלחה", {
      description: "התראות ישלחו לקבוצה שהגדרת"
    });
    
    setTelegramConnected(true);
    setTelegramConfigOpen(false);
  };

  const saveWhatsappSettings = () => {
    if (!whatsappWebhook.trim()) {
      toast.error("נא להזין webhook לוואטסאפ");
      return;
    }
    
    toast.success("הגדרות הוואטסאפ נשמרו בהצלחה", {
      description: "התראות ישלחו לקבוצה שהגדרת"
    });
    
    setWhatsappConnected(true);
    setWhatsappConfigOpen(false);
  };

  const saveAllSettings = () => {
    toast.success("הגדרות ההתראות נשמרו בהצלחה", {
      description: "ההגדרות יופעלו מיידית",
    });
  };

  const sendTestAlert = (channel: 'telegram' | 'whatsapp') => {
    toast.info(`התראת בדיקה נשלחה ל${channel === 'telegram' ? 'טלגרם' : 'וואטסאפ'}`, {
      description: "אם ההגדרות נכונות, תקבל את ההודעה בקבוצה"
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-right">הגדרות התראות</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 text-right">
          <div>
            <h3 className="font-medium mb-2">ערוצי התראות</h3>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between p-2 border rounded-md">
                <div className="flex items-center gap-2">
                  <Dialog open={telegramConfigOpen} onOpenChange={setTelegramConfigOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">הגדר</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle className="text-right">הגדרות טלגרם</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 my-4 text-right">
                        <div>
                          <Label htmlFor="telegram-webhook" className="text-right block mb-2">כתובת Webhook</Label>
                          <Input
                            id="telegram-webhook"
                            value={telegramWebhook}
                            onChange={e => setTelegramWebhook(e.target.value)}
                            dir="ltr"
                            placeholder="https://api.telegram.org/bot{token}/sendMessage?chat_id={chatId}"
                          />
                          <p className="text-sm text-muted-foreground mt-1">
                            השג את ה-webhook מ-Telegram Bot לקבוצה שאליה תרצה לשלוח הודעות
                          </p>
                        </div>
                      </div>
                      <DialogFooter className="flex justify-between">
                        <Button 
                          variant="outline" 
                          onClick={() => setTelegramConfigOpen(false)}
                        >
                          ביטול
                        </Button>
                        {telegramConnected && (
                          <Button 
                            variant="outline" 
                            onClick={() => sendTestAlert('telegram')}
                          >
                            שלח התראת בדיקה
                          </Button>
                        )}
                        <Button onClick={saveTelegramSettings}>שמור הגדרות</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  
                  {telegramConnected ? (
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                      <Check className="mr-1 h-3 w-3" /> מחובר
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-gray-500">
                      <X className="mr-1 h-3 w-3" /> לא מחובר
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span>Telegram</span>
                  <Send className="h-4 w-4" />
                </div>
              </div>
              
              <div className="flex items-center justify-between p-2 border rounded-md">
                <div className="flex items-center gap-2">
                  <Dialog open={whatsappConfigOpen} onOpenChange={setWhatsappConfigOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">הגדר</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle className="text-right">הגדרות וואטסאפ</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 my-4 text-right">
                        <div>
                          <Label htmlFor="whatsapp-webhook" className="text-right block mb-2">כתובת Webhook</Label>
                          <Input
                            id="whatsapp-webhook"
                            value={whatsappWebhook}
                            onChange={e => setWhatsappWebhook(e.target.value)}
                            dir="ltr"
                            placeholder="https://api.callmebot.com/whatsapp.php?phone={phone}&text="
                          />
                          <p className="text-sm text-muted-foreground mt-1">
                            השג את ה-webhook עבור WhatsApp מספק שירות כמו CallMeBot
                          </p>
                        </div>
                      </div>
                      <DialogFooter className="flex justify-between">
                        <Button 
                          variant="outline" 
                          onClick={() => setWhatsappConfigOpen(false)}
                        >
                          ביטול
                        </Button>
                        {whatsappConnected && (
                          <Button 
                            variant="outline" 
                            onClick={() => sendTestAlert('whatsapp')}
                          >
                            שלח התראת בדיקה
                          </Button>
                        )}
                        <Button onClick={saveWhatsappSettings}>שמור הגדרות</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  
                  {whatsappConnected ? (
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                      <Check className="mr-1 h-3 w-3" /> מחובר
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-gray-500">
                      <X className="mr-1 h-3 w-3" /> לא מחובר
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span>WhatsApp</span>
                  <Send className="h-4 w-4" />
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">סוגי התראות</h3>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <input type="checkbox" id="price_alerts" className="h-4 w-4" defaultChecked />
                <label htmlFor="price_alerts" className="flex-1 text-right mr-2">התראות מחיר</label>
              </div>
              <div className="flex items-center justify-between">
                <input type="checkbox" id="technical_signals" className="h-4 w-4" defaultChecked />
                <label htmlFor="technical_signals" className="flex-1 text-right mr-2">איתותים טכניים</label>
              </div>
              <div className="flex items-center justify-between">
                <input type="checkbox" id="pattern_alerts" className="h-4 w-4" defaultChecked />
                <label htmlFor="pattern_alerts" className="flex-1 text-right mr-2">זיהוי תבניות</label>
              </div>
              <div className="flex items-center justify-between">
                <input type="checkbox" id="market_news" className="h-4 w-4" defaultChecked />
                <label htmlFor="market_news" className="flex-1 text-right mr-2">חדשות שו�� רלוונטיות</label>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button className="w-full" onClick={saveAllSettings}>
              <BellRing className="h-4 w-4 mr-2" />
              שמור הגדרות
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AlertSettings;
