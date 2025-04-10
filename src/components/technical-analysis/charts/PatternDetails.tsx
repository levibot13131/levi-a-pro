
import React from 'react';
import { Button } from '@/components/ui/button';

interface PatternDetailsProps {
  selectedPattern: any;
  onClose: () => void;
  formatPrice: (price: number) => string;
}

const PatternDetails: React.FC<PatternDetailsProps> = ({
  selectedPattern,
  onClose,
  formatPrice
}) => {
  if (!selectedPattern) return null;

  return (
    <div className="absolute top-0 right-0 p-3 bg-background/90 backdrop-blur-sm border rounded-md shadow-md z-10 w-64 max-h-64 overflow-y-auto">
      <div className="flex justify-between items-start mb-2">
        <Button variant="ghost" size="sm" onClick={onClose} className="h-6 w-6 p-0">
          ✕
        </Button>
        <h3 className="font-bold text-right">{selectedPattern.name}</h3>
      </div>
      <p className="text-sm text-right mb-2">{selectedPattern.description}</p>
      {selectedPattern.probability && (
        <div className="flex justify-between text-xs">
          <span className="font-medium">{selectedPattern.probability}%</span>
          <span>סבירות להתממשות:</span>
        </div>
      )}
      {selectedPattern.keyLevels && (
        <div className="mt-2">
          <h4 className="text-right text-sm font-medium mb-1">רמות מפתח:</h4>
          <ul className="text-right text-xs space-y-1">
            {selectedPattern.keyLevels.map((level: any, i: number) => (
              <li key={i} className="flex justify-between">
                <span>{formatPrice(level.price)}</span>
                <span>{level.name}:</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PatternDetails;
