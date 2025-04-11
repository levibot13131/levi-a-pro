
import React from 'react';
import { Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WebhookUrlDisplayProps {
  webhookUrl: string;
  onCopy: () => void;
}

const WebhookUrlDisplay: React.FC<WebhookUrlDisplayProps> = ({ webhookUrl, onCopy }) => {
  return (
    <div className="mb-4 bg-blue-50 p-3 rounded-md">
      <div className="flex justify-between items-start">
        <Button 
          size="sm" 
          variant="ghost" 
          className="h-6 p-0 px-2" 
          onClick={onCopy}
        >
          <Copy className="h-4 w-4" />
        </Button>
        <div className="text-right">
          <span className="font-medium text-sm">כתובת ה-Webhook שלך:</span>
          <code dir="ltr" className="ml-2 bg-blue-100 p-1 rounded text-xs">{webhookUrl}</code>
        </div>
      </div>
    </div>
  );
};

export default WebhookUrlDisplay;
