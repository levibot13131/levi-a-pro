
import React from 'react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { toast } from 'sonner';
import { 
  getAlertDestinations, 
  updateAlertDestination,
  deleteAlertDestination,
  addAlertDestination
} from '@/services/tradingView/tradingViewAlertService';
import WhatsAppIntegrationHeader from './whatsapp/WhatsAppIntegrationHeader';
import WhatsAppConnected from './whatsapp/WhatsAppConnected';
import WhatsAppDisconnected from './whatsapp/WhatsAppDisconnected';

const WhatsAppIntegration: React.FC = () => {
  // טעינת הגדרות וואטסאפ מהמערכת
  const destinations = getAlertDestinations();
  const whatsappDestination = destinations.find(d => d.type === 'whatsapp');
  
  const handleConnect = async (phoneNumber: string) => {
    if (!phoneNumber || phoneNumber.length < 10) {
      toast.error("אנא הזן מספר טלפון תקין", {
        description: "מספר הטלפון צריך להיות תקין עם קידומת"
      });
      return;
    }
    
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
        <WhatsAppIntegrationHeader isConnected={!!whatsappDestination?.active} />
      </CardHeader>
      
      <CardContent>
        {whatsappDestination ? (
          <WhatsAppConnected 
            destination={whatsappDestination}
            onDisconnect={disconnectWhatsApp}
            onToggleActive={toggleWhatsAppActive}
          />
        ) : (
          <WhatsAppDisconnected
            onConnect={handleConnect}
          />
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
