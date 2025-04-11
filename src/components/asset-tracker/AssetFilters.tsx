
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

interface AssetFiltersProps {
  priorityFilter: string;
  setPriorityFilter: (value: string) => void;
  signalFilter: string;
  setSignalFilter: (value: string) => void;
}

const AssetFilters: React.FC<AssetFiltersProps> = ({
  priorityFilter,
  setPriorityFilter,
  signalFilter,
  setSignalFilter
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-2 justify-end">
      <div className="flex items-center gap-2">
        <label className="text-sm text-muted-foreground">סינון עדיפות:</label>
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="כל העדיפויות" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">כל העדיפויות</SelectItem>
            <SelectItem value="high">גבוהה</SelectItem>
            <SelectItem value="medium">בינונית</SelectItem>
            <SelectItem value="low">נמוכה</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex items-center gap-2">
        <label className="text-sm text-muted-foreground">סינון איתותים:</label>
        <Select value={signalFilter} onValueChange={setSignalFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="כל האיתותים" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">כל האיתותים</SelectItem>
            <SelectItem value="buy">קנייה (טכני)</SelectItem>
            <SelectItem value="sell">מכירה (טכני)</SelectItem>
            <SelectItem value="bullish">חיובי (סנטימנט)</SelectItem>
            <SelectItem value="bearish">שלילי (סנטימנט)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default AssetFilters;
