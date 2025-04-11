
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { ExternalLink, RefreshCw, Link2, Link2Off } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  getExternalSources,
  connectToExternalSource,
  disconnectExternalSource,
  updateAssetsFromConnectedSources
} from '@/services/marketInformation/externalSourcesService';

interface ExternalSource {
  id: string;
  name: string;
  url: string;
  connected: boolean;
}

const ExternalSources: React.FC<{ onUpdate?: () => void }> = ({ onUpdate }) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const { data: sources = [], isLoading, refetch } = useQuery({
    queryKey: ['externalSources'],
    queryFn: getExternalSources,
  });

  const handleConnect = async (sourceId: string) => {
    const success = await connectToExternalSource(sourceId);
    if (success) {
      refetch();
      if (onUpdate) onUpdate();
    }
  };

  const handleDisconnect = async (sourceId: string) => {
    const success = await disconnectExternalSource(sourceId);
    if (success) {
      refetch();
      if (onUpdate) onUpdate();
    }
  };

  const handleUpdateAll = async () => {
    setIsUpdating(true);
    try {
      const updatedCount = await updateAssetsFromConnectedSources();
      if (updatedCount > 0 && onUpdate) {
        onUpdate();
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const connectedCount = sources.filter(s => s.connected).length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-right flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={handleUpdateAll}
            disabled={isUpdating || connectedCount === 0}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isUpdating ? 'animate-spin' : ''}`} />
            עדכן נתונים
          </Button>
          <div>מקורות חיצוניים</div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : (
          <div className="space-y-3">
            {sources.map((source: ExternalSource) => (
              <div key={source.id} className="flex justify-between items-center border p-3 rounded-md">
                <Button
                  variant={source.connected ? "destructive" : "default"}
                  size="sm"
                  onClick={() => source.connected ? handleDisconnect(source.id) : handleConnect(source.id)}
                >
                  {source.connected ? (
                    <>
                      <Link2Off className="h-4 w-4 mr-2" />
                      נתק
                    </>
                  ) : (
                    <>
                      <Link2 className="h-4 w-4 mr-2" />
                      חבר
                    </>
                  )}
                </Button>
                <div className="flex items-center">
                  <span className="font-medium mr-2">{source.name}</span>
                  {source.connected && (
                    <Badge variant="outline" className="bg-green-100 text-green-800">מחובר</Badge>
                  )}
                </div>
              </div>
            ))}

            {sources.length === 0 && (
              <div className="text-center py-6">
                <ExternalLink className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p>אין מקורות חיצוניים זמינים</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ExternalSources;
