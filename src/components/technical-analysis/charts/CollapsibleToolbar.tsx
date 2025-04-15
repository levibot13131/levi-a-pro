
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ChartToolbar from './ChartToolbar';

interface CollapsibleToolbarProps {
  showVolume: boolean;
  setShowVolume: (value: boolean) => void;
  showPatterns: boolean;
  setShowPatterns: (value: boolean) => void;
  showSignals: boolean;
  setShowSignals: (value: boolean) => void;
}

const CollapsibleToolbar: React.FC<CollapsibleToolbarProps> = (props) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };
  
  return (
    <div className="relative">
      <div 
        className={`transition-all duration-300 overflow-hidden bg-muted/30 p-2 rounded-md ${
          isCollapsed ? 'w-12 h-12' : 'w-full'
        }`}
      >
        {isCollapsed ? (
          <Button 
            variant="outline" 
            size="icon"
            onClick={toggleCollapse}
            className="w-8 h-8"
            title="פתח סרגל כלים"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        ) : (
          <div className="flex justify-between items-center">
            <ChartToolbar {...props} />
            <Button 
              variant="outline" 
              size="icon"
              onClick={toggleCollapse}
              className="w-8 h-8 ml-2"
              title="סגור סרגל כלים"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollapsibleToolbar;
