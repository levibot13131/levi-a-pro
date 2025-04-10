
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, BellRing, Check, X, Link, Settings, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';

const AlertSettings = () => {
  const [telegramWebhook, setTelegramWebhook] = useState('');
  const [whatsappWebhook, setWhatsappWebhook] = useState('');
  const [telegramConfigOpen, setTelegramConfigOpen] = useState(false);
  const [whatsappConfigOpen, setWhatsappConfigOpen] = useState(false);
  const [tradingViewWebhook, setTradingViewWebhook] = useState('');
  const [tvConfigOpen, setTvConfigOpen] = useState(false);

  const [telegramConnected, setTelegramConnected] = useState(false);
  const [whatsappConnected, setWhatsappConnected] = useState(false);
  const [tradingViewConnected, setTradingViewConnected] = useState(false);
  
  // הגדרות אינדיקטורים לאיתור תבניות
  const [patternSettings, setPatternSettings] = useState({
    enableRsi: true,
    enableMacd: true,
    enableVolume: true,
    enableWyckoff: true,
    enableSmc: true,
    alertOnStrongSignalsOnly: false
  });

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

  const saveTradingViewSettings = () => {
    // כאן נשמור את ה-webhook שיקבל נתונים מטריידינגויו
    const webhookUrl = `${window.location.origin}/api/tradingview-webhook`;
    
    setTradingViewWebhook(webhookUrl);
    setTradingViewConnected(true);
    
    // העתקת הכתובת ללוח
    navigator.clipboard.writeText(webhookUrl).then(() => {
      toast.success("כתובת ה-Webhook הועתקה ללוח", {
        description: "השתמש בכתובת זו בהגדרות ההתראות של TradingView"
      });
    });
    
    setTvConfigOpen(false);
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

  const handlePatternSettingChange = (setting: keyof typeof patternSettings) => {
    setPatternSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-right">הגדרות התראות וחיבורים חיצוניים</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="channels" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="channels">ערוצי התראות</TabsTrigger>
            <TabsTrigger value="tradingview">חיבור TradingView</TabsTrigger>
            <TabsTrigger value="patterns">הגדרת תבניות</TabsTrigger>
          </TabsList>
          
          <TabsContent value="channels" className="space-y-4 text-right">
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
                  <label htmlFor="market_news" className="flex-1 text-right mr-2">חדשות שוק רלוונטיות</label>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="tradingview" className="space-y-4 text-right">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-md text-right">
              <h3 className="font-medium mb-2 flex items-center gap-2">
                <Link className="h-5 w-5 text-blue-600" />
                חיבור מערכת TradingView
              </h3>
              <p className="mb-4">חבר את המערכת לחשבון TradingView שלך כדי לקבל התראות וסיגנלים בזמן אמת.</p>
              
              <div className="flex items-center justify-between p-2 border rounded-md bg-white">
                <div className="flex items-center gap-2">
                  <Dialog open={tvConfigOpen} onOpenChange={setTvConfigOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">הגדר חיבור</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle className="text-right">חיבור TradingView</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 my-4 text-right">
                        <div className="space-y-2">
                          <h4 className="font-medium">הוראות חיבור:</h4>
                          <ol className="list-decimal list-inside space-y-2">
                            <li>כנס לחשבון TradingView שלך</li>
                            <li>פתח גרף של הנכס שאתה רוצה לעקוב אחריו</li>
                            <li>צור התראה חדשה (Create Alert)</li>
                            <li>בחר את התנאים להתראה</li>
                            <li>תחת 'Webhook URL', הכנס את כתובת ה-webhook שלהלן</li>
                            <li>לחץ על 'שמור'</li>
                          </ol>
                        </div>
                        
                        {tradingViewConnected && (
                          <div className="p-3 bg-gray-100 rounded-md mt-4 dir-ltr">
                            <Label className="text-right block mb-2">Webhook URL (לחץ להעתקה):</Label>
                            <p 
                              className="text-sm bg-white p-2 rounded border cursor-pointer" 
                              onClick={() => {
                                navigator.clipboard.writeText(tradingViewWebhook);
                                toast.info("הועתק ללוח");
                              }}
                            >
                              {tradingViewWebhook}
                            </p>
                          </div>
                        )}
                      </div>
                      <DialogFooter>
                        <Button 
                          variant="outline" 
                          onClick={() => setTvConfigOpen(false)}
                        >
                          ביטול
                        </Button>
                        <Button onClick={saveTradingViewSettings}>
                          קבל URL עבור TradingView
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  
                  {tradingViewConnected ? (
                    <Badge className="bg-green-100 text-green-800">
                      <Check className="mr-1 h-3 w-3" /> מחובר
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-gray-500">
                      <X className="mr-1 h-3 w-3" /> לא מוגדר
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span>TradingView</span>
                  <TrendingUp className="h-4 w-4" />
                </div>
              </div>
              
              {tradingViewConnected && (
                <div className="mt-4">
                  <h4 className="font-medium mb-2">מומלץ להוסיף להתראות TradingView:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>פריצת ממוצעים נעים (EMA 50, 200)</li>
                    <li>חציית RSI מעל/מתחת ל-30/70</li>
                    <li>תבנית נר יפני (Doji, Engulfing, etc)</li>
                    <li>פריצת תבניות מחיר (משולשים, דגלים)</li>
                    <li>שינוי מגמה על פי MACD</li>
                  </ul>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="patterns" className="space-y-4 text-right">
            <div>
              <h3 className="font-medium mb-3">הגדרת זיהוי תבניות</h3>
              <p className="text-sm text-muted-foreground mb-4">
                הגדר אילו אינדיקטורים ותבניות המערכת תחפש ותשלח לך התראות לגביהם.
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Switch 
                      id="rsi" 
                      checked={patternSettings.enableRsi}
                      onCheckedChange={() => handlePatternSettingChange('enableRsi')}
                    />
                  </div>
                  <div className="flex-1 text-right">
                    <Label htmlFor="rsi" className="mr-2">RSI (קנייתיתר/מכירתיתר)</Label>
                    <p className="text-xs text-muted-foreground">זיהוי רמות קיצון של מתנד RSI</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Switch 
                      id="macd" 
                      checked={patternSettings.enableMacd}
                      onCheckedChange={() => handlePatternSettingChange('enableMacd')}
                    />
                  </div>
                  <div className="flex-1 text-right">
                    <Label htmlFor="macd" className="mr-2">MACD (חציות)</Label>
                    <p className="text-xs text-muted-foreground">זיהוי חציות של MACD ושינויי מגמה</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Switch 
                      id="volume" 
                      checked={patternSettings.enableVolume}
                      onCheckedChange={() => handlePatternSettingChange('enableVolume')}
                    />
                  </div>
                  <div className="flex-1 text-right">
                    <Label htmlFor="volume" className="mr-2">נפח מסחר</Label>
                    <p className="text-xs text-muted-foreground">זיהוי שינויים משמעותיים בנפח המסחר</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Switch 
                      id="wyckoff" 
                      checked={patternSettings.enableWyckoff}
                      onCheckedChange={() => handlePatternSettingChange('enableWyckoff')}
                    />
                  </div>
                  <div className="flex-1 text-right">
                    <Label htmlFor="wyckoff" className="mr-2">תבניות Wyckoff</Label>
                    <p className="text-xs text-muted-foreground">זיהוי שלבים ותבניות במתודולוגיית Wyckoff</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Switch 
                      id="smc" 
                      checked={patternSettings.enableSmc}
                      onCheckedChange={() => handlePatternSettingChange('enableSmc')}
                    />
                  </div>
                  <div className="flex-1 text-right">
                    <Label htmlFor="smc" className="mr-2">תבניות SMC</Label>
                    <p className="text-xs text-muted-foreground">זיהוי Order Blocks ותבניות Smart Money Concept</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-6">
                  <div className="flex items-center">
                    <Switch 
                      id="strongSignals" 
                      checked={patternSettings.alertOnStrongSignalsOnly}
                      onCheckedChange={() => handlePatternSettingChange('alertOnStrongSignalsOnly')}
                    />
                  </div>
                  <div className="flex-1 text-right">
                    <Label htmlFor="strongSignals" className="mr-2 font-medium text-primary">שלח רק סיגנלים חזקים</Label>
                    <p className="text-xs text-muted-foreground">סנן וקבל רק סיגנלים עם אמינות גבוהה</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex gap-2 mt-6">
          <Button className="w-full" onClick={saveAllSettings}>
            <BellRing className="h-4 w-4 mr-2" />
            שמור הגדרות
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AlertSettings;
