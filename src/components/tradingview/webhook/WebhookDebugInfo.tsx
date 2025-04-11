
import React from 'react';
import { Button } from "@/components/ui/button";
import { Terminal } from 'lucide-react';

interface WebhookDebugInfoProps {
  showDebugInfo: boolean;
  setShowDebugInfo: (show: boolean) => void;
  destinations: any[];
}

const WebhookDebugInfo: React.FC<WebhookDebugInfoProps> = ({ 
  showDebugInfo, 
  setShowDebugInfo, 
  destinations 
}) => {
  const hasTelegram = destinations.some(d => d.type === 'telegram' && d.active);
  const hasWhatsApp = destinations.some(d => d.type === 'whatsapp' && d.active);
  
  return (
    <>
      <div className="mt-4 flex justify-end">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setShowDebugInfo(!showDebugInfo)}
          className="gap-1"
        >
          <Terminal className="h-3 w-3" />
          {showDebugInfo ? 'הסתר מידע טכני' : 'הצג מידע טכני'}
        </Button>
      </div>
      
      {showDebugInfo && (
        <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-md border text-xs font-mono">
          <h4 className="font-medium mb-1">מידע טכני:</h4>
          <div>
            <p>יעדים פעילים: {destinations.filter(d => d.active).length}</p>
            <p>טלגרם: {hasTelegram ? 'מוגדר ✓' : 'לא מוגדר ✗'}</p>
            <p>וואטסאפ: {hasWhatsApp ? 'מוגדר ✓' : 'לא מוגדר ✗'}</p>
            <p>סך יעדים: {destinations.length}</p>
            <p>פתח את קונסול הדפדפן (F12) לצפייה בלוגים מפורטים</p>
          </div>
        </div>
      )}
    </>
  );
};

export default WebhookDebugInfo;
