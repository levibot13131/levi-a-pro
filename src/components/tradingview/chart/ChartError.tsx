
import React from 'react';

interface ChartErrorProps {
  error: string | null;
}

const ChartError: React.FC<ChartErrorProps> = ({ error }) => {
  return (
    <div className="h-[300px] flex items-center justify-center rounded-lg bg-muted/20">
      <p className="text-red-500">{error}</p>
    </div>
  );
};

export default ChartError;
