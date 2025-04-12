import React from 'react';
import { FinancialDataSource } from '@/types/marketInformation';

export interface SourcesTabProps {
  sources: FinancialDataSource[];
  focusedSourceIds: Set<string>;
  onFocus: (sourceId: string) => void;
}

const SourcesTab: React.FC<SourcesTabProps> = ({ 
  sources, 
  focusedSourceIds, 
  onFocus 
}) => {
  return (
    <div>
      {/* Implementation details */}
      <p>Sources tab implementation</p>
    </div>
  );
};

export default SourcesTab;
