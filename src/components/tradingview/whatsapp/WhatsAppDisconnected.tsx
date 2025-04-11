
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from 'lucide-react';

interface WhatsAppDisconnectedProps {
  onConnect: (phoneNumber: string) => void;
}

const WhatsAppDisconnected: React.FC<WhatsAppDisconnectedProps> = ({ onConnect }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConnect = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      return;
    }
    
    setIsSubmitting(true);
    await onConnect(phoneNumber);
    setIsSubmitting(false);
    setPhoneNumber("");
  };
  
  return (
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
  );
};

export default WhatsAppDisconnected;
