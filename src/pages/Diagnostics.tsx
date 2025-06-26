
import React from 'react';
import { SignalEngineDebugPanel } from '@/components/diagnostics/SignalEngineDebugPanel';
import { RejectionAnalysisPanel } from '@/components/admin/RejectionAnalysisPanel';

const Diagnostics = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="space-y-6">
        <SignalEngineDebugPanel />
        <RejectionAnalysisPanel />
      </div>
    </div>
  );
};

export default Diagnostics;
