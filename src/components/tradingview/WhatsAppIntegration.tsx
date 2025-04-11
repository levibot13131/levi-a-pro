import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { MessageSquare, CheckCircle, AlertTriangle, Trash, Send } from 'lucide-react';
import { toast } from 'sonner';
import { 
  getAlertDestinations, 
  updateAlertDestination,
  deleteAlertDestination,
  addAlertDestination
} from '@/services/tradingView/tradingViewAlertService';

const WhatsAppIntegration: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // טעינת הגדרות וואטסאפ מהמערכת
  const destinations = getAlertDestinations();
  const whatsappDestination = destinations.find(d => d.type === 'whatsapp');
  
  const handleConnect = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      toast.error("אנא הזן מספר טלפון תקין", {
        description: "מספר הטלפון צריך להיות תקין עם קידומת"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // סימולציה של תהליך התחברות
    setTimeout(() => {
      if (whatsappDestination) {
        // עדכון יעד קיים
        updateAlertDestination('whatsapp', {
          name: `וואטסאפ - ${phoneNumber}`,
          active: true
        });
      } else {
        // הוספת יעד חדש
        addAlertDestination({
          name: `וואטסאפ - ${phoneNumber}`,
          type: 'whatsapp',
          active: true
        });
      }
      
      toast.success("חשבון וואטסאפ חובר בהצלחה", {
        description: "איתותים ישלחו לוואטסאפ שלך באופן אוטומטי"
      });
      
      setIsSubmitting(false);
      setPhoneNumber("");
    }, 1500);
  };
  
  const toggleWhatsAppActive = (active: boolean) => {
    if (whatsappDestination) {
      updateAlertDestination('whatsapp', { active });
      
      toast.success(active 
        ? "התראות וואטסאפ הופעלו" 
        : "התראות וואטסאפ הושבתו"
      );
    }
  };
  
  const disconnectWhatsApp = () => {
    if (whatsappDestination) {
      deleteAlertDestination(whatsappDestination.id);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <Badge 
            variant={whatsappDestination?.active ? "default" : "outline"}
            className={whatsappDestination?.active 
              ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400" 
              : ""
            }
          >
            {whatsappDestination?.active ? (
              <CheckCircle className="h-3 w-3 mr-1" />
            ) : (
              <AlertTriangle className="h-3 w-3 mr-1" />
            )}
            {whatsappDestination?.active ? "מחובר" : "לא מחובר"}
          </Badge>
          <div className="flex flex-col items-end">
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5 text-green-600" />
              אינטגרציית וואטסאפ
            </CardTitle>
            <CardDescription className="text-right">
              קבל התראות בזמן אמת ישירות לוואטסאפ שלך
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {whatsappDestination ? (
          <div className="space-y-4">
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-md">
              <h3 className="font-semibold text-right mb-2">
                וואטסאפ מחובר
              </h3>
              <p className="text-sm text-right">
                {whatsappDestination.name}
              </p>
              <div className="flex items-center justify-between mt-3">
                <Button 
                  variant="destructive" 
                  size="sm"
                  className="gap-1"
                  onClick={disconnectWhatsApp}
                >
                  <Trash className="h-4 w-4" />
                  נתק חשבון
                </Button>
                
                <div className="flex items-center gap-2">
                  <Switch 
                    id="whatsapp-active" 
                    checked={whatsappDestination.active} 
                    onCheckedChange={toggleWhatsAppActive}
                  />
                  <Label htmlFor="whatsapp-active">
                    {whatsappDestination.active ? "פעיל" : "מושבת"}
                  </Label>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <h3 className="font-semibold mb-2">התראות שישלחו לוואטסאפ</h3>
              <ul className="text-sm space-y-1 list-disc list-inside">
                <li>איתותי קנייה ומכירה חזקים</li>
                <li>התראות חריגות וחדשות חשובות</li>
                <li>עדכוני מחיר משמעותיים</li>
                <li>דוחות ניתוח שבועיים</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md text-right">
              <h3 className="font-semibold mb-2">
                חבר את חשבון הוואטסאפ שלך
              </h3>
              <p className="text-sm mb-4">
                הזן את מספר הטלפון שלך כולל קידומת מדינה (לדוגמה: 972501234567)
              </p>
              
              <div className="flex gap-2">
                <Button 
                  onClick={handleConnect}
                  disabled={isSubmitting || !phoneNumber}
                >
                  {isSubmitting ? (
                    <>טוען...</>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      חבר וואטסאפ
                    </>
                  )}
                </Button>
                <Input
                  dir="ltr"
                  placeholder="972501234567"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="text-right"
                />
              </div>
            </div>
            
            <div className="text-right">
              <h3 className="font-semibold mb-2">יתרונות חיבור וואטסאפ</h3>
              <ul className="text-sm space-y-1 list-disc list-inside">
                <li>קבלת איתותים בזמן אמת</li>
                <li>התראות על שינויי מחיר משמעותיים</li>
                <li>עדכונים על חדשות חשובות בשוק</li>
                <li>דוחות ביצועים שבועיים</li>
              </ul>
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="text-xs text-muted-foreground">
        <p className="text-right w-full">
          שים לב: המערכת לא שומרת את פרטי הוואטסאפ שלך בשרת חיצוני. הנתונים נשמרים רק בדפדפן שלך.
        </p>  
      </CardFooter>
    </Card>
  );
};

export default WhatsAppIntegration;
