
import React from 'react';
import { Container } from '@/components/ui/container';
import MarketOverview from '@/components/dashboard/MarketOverview';
import AssetSummary from '@/components/dashboard/AssetSummary';
import TradingViewWidgets from '@/components/dashboard/TradingViewWidgets';
import NewsWidget from '@/components/dashboard/NewsWidget';
import RealTimeStatus from '@/components/dashboard/RealTimeStatus';

const Dashboard: React.FC = () => {
  return (
    <Container className="py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <MarketOverview />
        </div>
        <div>
          <RealTimeStatus />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-1">
          <AssetSummary />
        </div>
        <div className="lg:col-span-2">
          <TradingViewWidgets />
        </div>
      </div>
      
      <div>
        <NewsWidget />
      </div>
    </Container>
  );
};

export default Dashboard;
