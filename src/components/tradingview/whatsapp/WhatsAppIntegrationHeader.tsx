
import React from 'react';
import { CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertTriangle, Send } from 'lucide-react';

interface WhatsAppIntegrationHeaderProps {
  isConnected: boolean;
}

const WhatsAppIntegrationHeader: React.FC<WhatsAppIntegrationHeaderProps> = ({ isConnected }) => {
  return (
    <div className="flex justify-between items-center">
      <Badge 
        variant={isConnected ? "default" : "outline"}
        className={isConnected 
          ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400" 
          : ""
        }
      >
        {isConnected ? (
          <CheckCircle className="h-3 w-3 mr-1" />
        ) : (
          <AlertTriangle className="h-3 w-3 mr-1" />
        )}
        {isConnected ? "מחובר" : "לא מחובר"}
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
  );
};

export default WhatsAppIntegrationHeader;
