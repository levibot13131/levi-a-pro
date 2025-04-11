
import React from 'react';
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Trash, Send } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2 } from "lucide-react";

interface WhatsAppConnectedProps {
  destination: {
    name: string;
    active: boolean;
  };
  onDisconnect: () => void;
  onToggleActive: (active: boolean) => void;
  onSendTest: () => Promise<boolean>;
}

const WhatsAppConnected: React.FC<WhatsAppConnectedProps> = ({ 
  destination, 
  onDisconnect, 
  onToggleActive,
  onSendTest 
}) => {
  const [isSending, setIsSending] = React.useState(false);
  
  const handleSendTest = async () => {
    setIsSending(true);
    try {
      await onSendTest();
    } finally {
      setIsSending(false);
    }
  };
  
  return (
    <div className="space-y-4">
      <Alert variant="default" className="bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-900/50">
        <CheckCircle2 className="h-4 w-4" />
        <AlertTitle>מחובר לוואטסאפ</AlertTitle>
        <AlertDescription>
          התראות יישלחו אוטומטית לוואטסאפ
        </AlertDescription>
      </Alert>
      
      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-md">
        <h3 className="font-semibold text-right mb-2">
          וואטסאפ מחובר
        </h3>
        <p className="text-sm text-right font-mono break-all">
          {destination.name}
        </p>
        <div className="flex items-center justify-between mt-3">
          <Button 
            variant="destructive" 
            size="sm"
            className="gap-1"
            onClick={onDisconnect}
          >
            <Trash className="h-4 w-4" />
            נתק חשבון
          </Button>
          
          <div className="flex items-center gap-2">
            <Switch 
              id="whatsapp-active" 
              checked={destination.active} 
              onCheckedChange={onToggleActive}
            />
            <Label htmlFor="whatsapp-active">
              {destination.active ? "פעיל" : "מושבת"}
            </Label>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col gap-2">
        <Button 
          variant="outline" 
          className="w-full" 
          onClick={handleSendTest}
          disabled={isSending}
        >
          {isSending ? (
            "שולח הודעת בדיקה..."
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              שלח הודעת בדיקה
            </>
          )}
        </Button>
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
  );
};

export default WhatsAppConnected;
