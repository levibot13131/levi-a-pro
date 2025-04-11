
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TimeframeSelectorProps {
  timeframe: string;
  setTimeframe: (value: string) => void;
}

const TimeframeSelector: React.FC<TimeframeSelectorProps> = ({ timeframe, setTimeframe }) => {
  return (
    <Select value={timeframe} onValueChange={setTimeframe}>
      <SelectTrigger className="w-[150px]">
        <SelectValue placeholder="בחר טווח זמן" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="1h">שעתי</SelectItem>
        <SelectItem value="4h">4 שעות</SelectItem>
        <SelectItem value="1d">יומי</SelectItem>
        <SelectItem value="1w">שבועי</SelectItem>
        <SelectItem value="1M">חודשי</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default TimeframeSelector;
