
import React from 'react';

const ChartNoData: React.FC = () => {
  return (
    <div className="h-[300px] flex items-center justify-center rounded-lg bg-muted/20">
      <p className="text-muted-foreground">אין נתונים זמינים</p>
    </div>
  );
};

export default ChartNoData;
