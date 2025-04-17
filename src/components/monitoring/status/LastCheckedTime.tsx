
import React from 'react';

interface LastCheckedTimeProps {
  lastChecked?: number;
}

export const LastCheckedTime: React.FC<LastCheckedTimeProps> = ({ 
  lastChecked 
}) => {
  return (
    <div className="text-sm text-muted-foreground text-right">
      Last checked: {lastChecked 
        ? new Date(lastChecked).toLocaleString() 
        : 'Never'
      }
    </div>
  );
};
