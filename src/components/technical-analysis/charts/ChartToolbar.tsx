
import React from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, Eye, EyeOff } from 'lucide-react';

interface ChartToolbarProps {
  showVolume: boolean;
  setShowVolume: (value: boolean) => void;
  showPatterns: boolean;
  setShowPatterns: (value: boolean) => void;
  showSignals: boolean;
  setShowSignals: (value: boolean) => void;
}

const ChartToolbar: React.FC<ChartToolbarProps> = ({
  showVolume,
  setShowVolume,
  showPatterns,
  setShowPatterns,
  showSignals,
  setShowSignals
}) => {
  return (
    <div className="flex gap-2">
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => setShowVolume(!showVolume)}
      >
        <Volume2 className="h-4 w-4 mr-2" />
        {showVolume ? 'הסתר נפח' : 'הצג נפח'}
      </Button>
      
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => setShowPatterns(!showPatterns)}
      >
        {showPatterns ? (
          <EyeOff className="h-4 w-4 mr-2" />
        ) : (
          <Eye className="h-4 w-4 mr-2" />
        )}
        {showPatterns ? 'הסתר תבניות' : 'הצג תבניות'}
      </Button>
      
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => setShowSignals(!showSignals)}
      >
        {showSignals ? (
          <EyeOff className="h-4 w-4 mr-2" />
        ) : (
          <Eye className="h-4 w-4 mr-2" />
        )}
        {showSignals ? 'הסתר סיגנלים' : 'הצג סיגנלים'}
      </Button>
    </div>
  );
};

export default ChartToolbar;
