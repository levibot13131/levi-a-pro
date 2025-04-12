
import React from 'react';
import BacktestingSystem from '@/components/backtesting/BacktestingSystem';
import { Toaster } from '@/components/ui/toaster';

const Backtesting: React.FC = () => {
  return (
    <>
      <BacktestingSystem />
      <Toaster />
    </>
  );
};

export default Backtesting;
