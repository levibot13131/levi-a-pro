
import React from 'react';
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Trash } from 'lucide-react';

interface WhatsAppConnectedProps {
  destination: {
    name: string;
    active: boolean;
  };
  onDisconnect: () => void;
  onToggleActive: (active: boolean) => void;
}

const WhatsAppConnected: React.FC<WhatsAppConnectedProps> = ({ 
  destination, 
  onDisconnect, 
  onToggleActive 
}) => {
  return (
    <div className="space-y-4">
      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-md">
        <h3 className="font-semibold text-right mb-2">
          וואטסאפ מחובר
        </h3>
        <p className="text-sm text-right">
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
