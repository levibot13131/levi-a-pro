
import React from 'react';

interface ErrorMessageProps {
  error: Error | null;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ 
  error 
}) => {
  if (!error) return null;
  
  return (
    <div className="text-sm text-red-500 mt-2">
      Error: {error.message}
    </div>
  );
};
