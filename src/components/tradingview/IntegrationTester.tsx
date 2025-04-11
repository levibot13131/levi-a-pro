
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle, RefreshCw, Zap } from 'lucide-react';
import { testAllIntegrations, initializeRealTimeUpdates } from '@/services/tradingView/testIntegrations';
import { Badge } from '@/components/ui/badge';

interface IntegrationStatus {
  telegram: boolean | null;
  whatsapp: boolean | null;
  realtime: boolean | null;
}

const IntegrationTester: React.FC = () => {
  const [isTesting, setIsTesting] = useState(false);
  const [status, setStatus] = useState<IntegrationStatus>({
    telegram: null,
    whatsapp: null,
    realtime: null
  });
  
  const handleTestAll = async () => {
    setIsTesting(true);
    setStatus({
      telegram: null,
      whatsapp: null,
      realtime: null
    });
    
    try {
      // Test all integrations
      const results = await testAllIntegrations();
      
      // Initialize real-time updates
      const realtimeStatus = initializeRealTimeUpdates();
      
      // Update status
      setStatus({
        telegram: results.telegramStatus,
        whatsapp: results.whatsappStatus,
        realtime: realtimeStatus
      });
    } catch (error) {
      console.error('Error testing integrations:', error);
    } finally {
      setIsTesting(false);
    }
  };
  
  const renderStatusBadge = (isActive: boolean | null) => {
    if (isActive === null) return (
      <Badge variant="outline" className="bg-gray-100 text-gray-500">
        לא נבדק
      </Badge>
    );
    
    return isActive ? (
      <Badge className="bg-green-100 text-green-800 flex gap-1 items-center">
        <CheckCircle className="h-3 w-3" />
        פעיל
      </Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800 flex gap-1 items-center">
        <AlertCircle className="h-3 w-3" />
        לא פעיל
      </Badge>
    );
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex justify-between items-center">
          <span>בדיקת אינטגרציות</span>
          <Zap className="h-5 w-5 text-yellow-500" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md flex flex-col items-center">
              <div className="text-sm font-medium mb-2">טלגרם</div>
              {renderStatusBadge(status.telegram)}
            </div>
            
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-md flex flex-col items-center">
              <div className="text-sm font-medium mb-2">וואטסאפ</div>
              {renderStatusBadge(status.whatsapp)}
            </div>
            
            <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-md flex flex-col items-center">
              <div className="text-sm font-medium mb-2">עדכון בזמן אמת</div>
              {renderStatusBadge(status.realtime)}
            </div>
          </div>
          
          <Button 
            onClick={handleTestAll} 
            disabled={isTesting}
            className="w-full"
          >
            {isTesting ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                בודק אינטגרציות...
              </>
            ) : (
              <>
                <Zap className="mr-2 h-4 w-4" />
                בדוק את כל החיבורים
              </>
            )}
          </Button>
          
          <div className="text-xs text-center text-muted-foreground">
            בדיקה זו תנסה לשלוח הודעת בדיקה לכל היעדים המוגדרים ותבדוק את החיבורים בזמן אמת
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default IntegrationTester;
