
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

const WebhookUrlDisplay: React.FC = () => {
  const [copied, setCopied] = useState(false);
  
  // In a real app, this would be a unique URL for the user's account
  // For demonstration, we're using a mock URL
  const webhookUrl = `https://example.com/api/webhook/${Math.random().toString(36).substring(2, 10)}`;
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(webhookUrl).then(() => {
      setCopied(true);
      toast.success('הלינק הועתק ללוח');
      setTimeout(() => setCopied(false), 2000);
    });
  };
  
  return (
    <div className="flex w-full max-w-sm items-center space-x-2 space-x-reverse rtl:space-x-reverse">
      <Button 
        type="submit" 
        size="sm"
        onClick={copyToClipboard}
        className={copied ? "bg-green-600 hover:bg-green-700" : ""}
      >
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      </Button>
      <Input 
        readOnly 
        value={webhookUrl} 
        className="text-xs font-mono dir-ltr text-left" 
      />
    </div>
  );
};

export default WebhookUrlDisplay;
