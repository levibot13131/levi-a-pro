
import React from 'react';
import { useRealTimeConnection } from '@/hooks/use-real-time-connection';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, RefreshCw, Signal, Globe, Radio } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export function RealTimeStatus() {
  const { 
    proxyConnected, 
    apiConnected, 
    webSocketsConnected, 
    lastChecked, 
    isChecking,
    checkConnections 
  } = useRealTimeConnection();

  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => checkConnections()}
            disabled={isChecking}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isChecking ? 'animate-spin' : ''}`} />
            בדוק חיבור
          </Button>
          <CardTitle className="text-lg">סטטוס חיבור בזמן אמת</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          <StatusItem 
            title="פרוקסי"
            icon={<Globe className="h-5 w-5" />}
            status={proxyConnected}
          />
          <StatusItem 
            title="חיבור API"
            icon={<Signal className="h-5 w-5" />}
            status={apiConnected}
          />
          <StatusItem 
            title="חיבור WebSocket"
            icon={<Radio className="h-5 w-5" />}
            status={webSocketsConnected}
          />
        </div>
        
        {lastChecked > 0 && (
          <div className="text-xs text-muted-foreground text-right mt-2">
            נבדק לאחרונה: {formatDistanceToNow(lastChecked)} ago
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface StatusItemProps {
  title: string;
  icon: React.ReactNode;
  status: boolean;
}

function StatusItem({ title, icon, status }: StatusItemProps) {
  return (
    <div className="flex justify-between items-center p-2 rounded border">
      {status ? (
        <CheckCircle className="h-5 w-5 text-green-500" />
      ) : (
        <XCircle className="h-5 w-5 text-red-500" />
      )}
      <div className="flex items-center">
        <span className="mr-2 font-medium">{title}</span>
        {icon}
      </div>
    </div>
  );
}
