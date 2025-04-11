
import React from 'react';
import { Asset } from '@/types/asset';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { AlertCircle, Globe } from 'lucide-react';

interface AssetActionLinksProps {
  asset: Asset;
}

const AssetActionLinks = ({ asset }: AssetActionLinksProps) => {
  return (
    <div className="flex justify-between mt-3 text-sm">
      <div className="flex items-center gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Badge variant="outline" className="cursor-pointer flex gap-1 items-center">
                <Globe className="h-3.5 w-3.5" />
                <span>אתר רשמי</span>
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-sm">פתיחת אתר רשמי של הנכס</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Badge variant="outline" className="cursor-pointer flex gap-1 items-center">
                <AlertCircle className="h-3.5 w-3.5" />
                <span>הגדר התראה</span>
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-sm">הגדרת התראות מחיר לנכס זה</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <Badge 
        variant="outline" 
        className={
          asset.change24h > 5 
            ? 'bg-green-100 text-green-800 border-green-200' 
            : asset.change24h < -5 
              ? 'bg-red-100 text-red-800 border-red-200'
              : ''
        }
      >
        {asset.change24h > 5 
          ? 'מומנטום חזק'
          : asset.change24h < -5
            ? 'ירידה משמעותית'
            : 'יציבות יחסית'
        }
      </Badge>
    </div>
  );
};

export default AssetActionLinks;
