
import React from 'react';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

interface PlaceholderTabProps {
  icon: LucideIcon;
  text: string;
  buttonText: string;
}

const PlaceholderTab: React.FC<PlaceholderTabProps> = ({ 
  icon: IconComponent, 
  text, 
  buttonText 
}) => {
  return (
    <div className="text-center py-6">
      <IconComponent className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
      <p>{text}</p>
      <Button className="mt-2" variant="outline">
        {buttonText}
      </Button>
    </div>
  );
};

export default PlaceholderTab;
