
import React, { ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface EmptyStateProps {
  icon?: ReactNode;
  message: string;
  className?: string;
  children?: ReactNode; // Added children prop
}

const EmptyState: React.FC<EmptyStateProps> = ({ 
  icon = <AlertTriangle className="h-10 w-10 text-yellow-500" />,
  message,
  className = '',
  children
}) => {
  return (
    <div className={`text-center p-10 ${className}`}>
      <div className="mx-auto mb-4">
        {icon}
      </div>
      <p>{message}</p>
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
};

export default EmptyState;
