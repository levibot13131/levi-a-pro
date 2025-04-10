
import React from 'react';
import MainNavigation from '@/components/MainNavigation';
import BacktestingSystem from '@/components/backtesting/BacktestingSystem';
import { Toaster } from '@/components/ui/toaster';

const Backtesting: React.FC = () => {
  return (
    <>
      <MainNavigation />
      <BacktestingSystem />
      <Toaster />
    </>
  );
};

export default Backtesting;
