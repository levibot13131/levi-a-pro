
import React, { useState, useEffect } from 'react';
import { Container } from '@/components/ui/container';
import { useBinanceConnection } from '@/hooks/use-binance-connection';
import BinanceConnectButton from '@/components/binance/BinanceConnectButton';
import { useAuth } from '@/contexts/AuthContext';
import RequireAuth from '@/components/auth/RequireAuth';
import { useBinanceData } from '@/hooks/use-binance-data';
import { toast } from 'sonner';
import BinanceDisconnectedView from '@/components/binance/BinanceDisconnectedView';
import BinanceConnectedView from '@/components/binance/BinanceConnectedView';

const BinanceIntegration = () => {
  const { isConnected, refreshConnection } = useBinanceConnection();
  const { isAdmin } = useAuth();
  
  const commonSymbols = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT', 'DOGEUSDT', 'ADAUSDT'];
  const { startRealTimeUpdates, refreshData } = useBinanceData(commonSymbols);
  
  useEffect(() => {
    if (isConnected) {
      startRealTimeUpdates();
      
      const handleRefreshRequest = () => {
        console.log('Received binance refresh request');
        refreshData();
      };
      
      window.addEventListener('binance-refresh-request', handleRefreshRequest);
      
      return () => {
        window.removeEventListener('binance-refresh-request', handleRefreshRequest);
      };
    }
  }, [isConnected, startRealTimeUpdates, refreshData]);
  
  useEffect(() => {
    const checkConnection = () => {
      if (isConnected) {
        startRealTimeUpdates();
        toast.success('חיבור לבינאנס פעיל', {
          description: 'נתונים בזמן אמת יוצגו כעת'
        });
      }
    };
    
    checkConnection();
  }, [isConnected, startRealTimeUpdates]);

  const handleStatusChange = () => {
    if (isConnected) {
      startRealTimeUpdates();
    }
  };

  const handleActiveTabChange = (tab: string) => {
    // This function can be used to perform actions when the active tab changes
    console.log(`Active tab changed to: ${tab}`);
  };

  return (
    <RequireAuth>
      <Container className="py-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">אינטגרציית Binance</h1>
            <p className="text-muted-foreground">חיבור וניהול חשבון בינאנס דרך המערכת</p>
          </div>
          <div className="mt-4 md:mt-0">
            <BinanceConnectButton />
          </div>
        </div>

        {!isConnected ? (
          <BinanceDisconnectedView />
        ) : (
          <BinanceConnectedView 
            isAdmin={isAdmin} 
            onActiveTabChange={handleActiveTabChange}
            onStatusChange={handleStatusChange}
          />
        )}
      </Container>
    </RequireAuth>
  );
};

export default BinanceIntegration;
