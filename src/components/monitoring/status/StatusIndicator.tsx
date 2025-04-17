
import React from 'react';

interface StatusIndicatorProps {
  label: string;
  isActive: boolean;
  isLoading: boolean;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({ 
  label, 
  isActive, 
  isLoading 
}) => {
  return (
    <div className="flex flex-col items-center p-2 rounded-md bg-muted/20">
      <span className="text-xs text-muted-foreground mb-1">{label}</span>
      {isLoading ? (
        <div className="h-3 w-3 rounded-full bg-gray-300 animate-pulse"></div>
      ) : (
        <div className={`h-3 w-3 rounded-full ${isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
      )}
    </div>
  );
};
