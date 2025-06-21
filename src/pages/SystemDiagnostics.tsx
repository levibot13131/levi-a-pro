
import React from 'react';
import SystemDiagnostic from '@/components/diagnostics/SystemDiagnostic';

const SystemDiagnostics: React.FC = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">System Diagnostics</h1>
        <p className="text-muted-foreground mt-2">
          Comprehensive health check and validation of all LeviPro components
        </p>
      </div>
      
      <SystemDiagnostic />
    </div>
  );
};

export default SystemDiagnostics;
