
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Webhook } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface WhatsAppDisconnectedProps {
  webhookUrl: string;
  isConfiguring: boolean;
  onConnect: () => void;
  onWebhookUrlChange: (url: string) => void;
}

const WhatsAppDisconnected: React.FC<WhatsAppDisconnectedProps> = ({ 
  webhookUrl, 
  isConfiguring, 
  onConnect, 
  onWebhookUrlChange 
}) => {
  return (
    <div className="space-y-4">
      <Alert className="bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-900/50 dark:text-blue-400">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>לא מחובר לוואטסאפ</AlertTitle>
        <AlertDescription>
          חבר את וואטסאפ שלך כדי לקבל התראות
        </AlertDescription>
      </Alert>
      
      <div className="space-y-3">
        <div>
          <label htmlFor="webhook-url" className="text-sm font-medium block mb-1 text-right">
            Webhook URL
          </label>
          <Input
            id="webhook-url"
            placeholder="https://hooks.pipedream.com/your-unique-webhook-id"
            value={webhookUrl}
            onChange={(e) => onWebhookUrlChange(e.target.value)}
            dir="ltr"
            className="font-mono text-sm"
          />
          <p className="text-xs text-muted-foreground mt-1 text-right">
            הזן את כתובת ה-Webhook של Pipedream שלך
          </p>
        </div>
        
        <Button 
          className="w-full" 
          onClick={onConnect} 
          disabled={isConfiguring || !webhookUrl.trim()}
        >
          {isConfiguring ? 'מתחבר...' : 'חבר לוואטסאפ'}
        </Button>
        
        <div className="text-center mt-4">
          <Button 
            variant="link" 
            className="text-xs gap-1"
            asChild
          >
            <a 
              href="https://pipedream.com/apps/whatsapp" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Webhook className="h-3 w-3" />
              למדריך התחברות ל-Pipedream
            </a>
          </Button>
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
