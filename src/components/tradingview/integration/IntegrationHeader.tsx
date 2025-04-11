
import React from 'react';
import { Button } from '@/components/ui/button';
import { Zap } from 'lucide-react';
import { toast } from 'sonner';
import { sendAlert, createSampleAlert } from '@/services/tradingView/tradingViewAlertService';
import { testAllIntegrations } from '@/services/tradingView/testIntegrations';
import SyncControls from './SyncControls';

interface IntegrationHeaderProps {
  isConnected: boolean;
  isSyncing: boolean;
  activeTab: string;
  handleManualRefresh: () => Promise<void>;
}

const IntegrationHeader: React.FC<IntegrationHeaderProps> = ({
  isConnected,
  isSyncing,
  activeTab,
  handleManualRefresh
}) => {
  const sendTestAlert = () => {
    const sampleAlert = createSampleAlert('info');
    sampleAlert.message = "זוהי הודעת בדיקה מהמערכת";
    sampleAlert.details = "בדיקת חיבור ושליחת הודעות";
    
    sendAlert(sampleAlert);
    
    toast.success("הודעת בדיקה נשלחה", {
      description: "ההודעה נשלחה לכל היעדים המוגדרים"
    });
  };
  
  const verifyAllIntegrations = async () => {
    toast.info("בודק את כל החיבורים...");
    await testAllIntegrations();
  };

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
      <h1 className="text-3xl font-bold text-right">אינטגרציה עם TradingView</h1>
      
      <div className="flex gap-2">
        {isConnected && (
          <SyncControls 
            activeTab={activeTab}
            isSyncing={isSyncing}
            handleManualRefresh={handleManualRefresh}
          />
        )}
        
        <Button variant="outline" onClick={sendTestAlert}>
          שלח התראת בדיקה
        </Button>
        
        <Button variant="outline" className="gap-1" onClick={verifyAllIntegrations}>
          <Zap className="h-4 w-4" />
          בדוק חיבורים
        </Button>
      </div>
    </div>
  );
};

export default IntegrationHeader;
