
import React from 'react';
import MainNavigation from '@/components/MainNavigation';
import BacktestingSystem from '@/components/backtesting/BacktestingSystem';

const Backtesting: React.FC = () => {
  return (
    <>
      <MainNavigation />
      <BacktestingSystem />
    </>
  );
};

export default Backtesting;
