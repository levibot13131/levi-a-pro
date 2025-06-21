
import React from 'react';
import TradingJournalDashboard from '@/components/journal/TradingJournalDashboard';

const Journal = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">📒 Trading Journal</h1>
        <p className="text-muted-foreground mt-2">
          Complete trading log with signal tracking, manual entries, and performance analytics
        </p>
      </div>
      
      <TradingJournalDashboard />
    </div>
  );
};

export default Journal;
