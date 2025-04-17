
import React from 'react';
import { Clock, AlertCircle } from 'lucide-react';

interface EmptySignalStateProps {
  type: 'current' | 'past';
}

const EmptySignalState: React.FC<EmptySignalStateProps> = ({ type }) => {
  if (type === 'current') {
    return (
      <div className="text-center p-6 border rounded-md">
        <Clock className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
        <p className="text-muted-foreground">אין איתותים פעילים כרגע</p>
      </div>
    );
  }
  
  return (
    <div className="text-center p-6 border rounded-md">
      <AlertCircle className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
      <p className="text-muted-foreground">אין היסטוריית איתותים לנכס זה</p>
    </div>
  );
};

export default EmptySignalState;
