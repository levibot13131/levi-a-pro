
import React, { useState, useEffect } from 'react';
import { Container } from '@/components/ui/container';
import { useAuth } from '@/contexts/AuthContext';
import RequireAuth from '@/components/auth/RequireAuth';
import { isTwitterConnected, disconnectFromTwitter } from '@/services/twitter/twitterService';
import { useAppSettings } from '@/hooks/use-app-settings';
import TwitterDisconnectedView from '@/components/twitter/TwitterDisconnectedView';
import TwitterConnectedView from '@/components/twitter/TwitterConnectedView';
import { Twitter } from 'lucide-react';

const TwitterIntegration = () => {
  const [isConnected, setIsConnected] = useState(false);
  const { isAdmin } = useAuth();
  const { demoMode } = useAppSettings((state: any) => ({
    demoMode: state.demoMode
  }));
  
  useEffect(() => {
    checkConnection();
  }, []);
  
  const checkConnection = () => {
    const connected = isTwitterConnected();
    setIsConnected(connected);
  };
  
  const handleDisconnect = () => {
    disconnectFromTwitter();
    setIsConnected(false);
  };

  const handleConnect = () => {
    checkConnection();
  };

  return (
    <RequireAuth>
      <Container className="py-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
          <div className="flex items-center gap-2">
            <Twitter className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">אינטגרציית Twitter</h1>
          </div>
          <p className="text-muted-foreground">ניתוח סנטימנט וניטור השוק בטוויטר</p>
        </div>

        {!isConnected && !demoMode ? (
          <TwitterDisconnectedView onConnect={handleConnect} />
        ) : (
          <TwitterConnectedView 
            isConnected={isConnected} 
            onDisconnect={handleDisconnect} 
          />
        )}
      </Container>
    </RequireAuth>
  );
};

export default TwitterIntegration;
