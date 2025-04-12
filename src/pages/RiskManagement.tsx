
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getTradingPerformanceStats, getTrendTradingStats } from '@/services/customTradingStrategyService';
import StrategyAlert from '@/components/risk-management/StrategyAlert';
import RiskManagementTabs from '@/components/risk-management/RiskManagementTabs';

const RiskManagement = () => {
  const { data: performanceStats } = useQuery({
    queryKey: ['tradingPerformanceStats'],
    queryFn: () => getTradingPerformanceStats(),
  });
  
  const { data: trendStats } = useQuery({
    queryKey: ['trendTradingStats'],
    queryFn: () => getTrendTradingStats(),
  });
  
  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <h1 className="text-3xl font-bold mb-6 text-right">ניהול סיכונים</h1>
      
      <StrategyAlert />
      
      <RiskManagementTabs 
        performanceStats={performanceStats} 
        trendStats={trendStats} 
      />
    </div>
  );
};

export default RiskManagement;
