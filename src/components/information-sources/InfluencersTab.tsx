
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MarketInfluencer } from '@/types/marketInformation';
import { Button } from '@/components/ui/button';
import { User, Users, Star, StarOff } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toggleInfluencerFollow } from '@/services/marketInformation/influencersService';

interface InfluencersTabProps {
  influencers: MarketInfluencer[];
  focusedInfluencerIds: Set<string>;
  onFocus: (id: string) => void;
}

const InfluencersTab: React.FC<InfluencersTabProps> = ({
  influencers,
  focusedInfluencerIds,
  onFocus
}) => {
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {influencers.map(influencer => (
        <Card key={influencer.id} className="overflow-hidden">
          <div className="aspect-[3/1] bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/10 relative">
            {influencer.avatarUrl ? (
              <img 
                src={influencer.avatarUrl} 
                alt={influencer.name} 
                className="h-16 w-16 rounded-full absolute bottom-0 right-4 transform translate-y-1/2 border-4 border-white dark:border-gray-800 object-cover"
              />
            ) : (
              <div className="h-16 w-16 rounded-full absolute bottom-0 right-4 transform translate-y-1/2 border-4 border-white dark:border-gray-800 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <User className="h-8 w-8 text-gray-500 dark:text-gray-400" />
              </div>
            )}
          </div>
          
          <CardContent className="pt-10">
            <div className="flex justify-between items-start mb-3">
              <div className="flex flex-col items-end">
                <h3 className="font-bold text-lg">{influencer.name}</h3>
                <span className="text-sm text-muted-foreground">{influencer.platform}</span>
              </div>
              
              <div className="flex items-center text-sm">
                <Users className="h-4 w-4 ml-1 text-blue-500" />
                <span>{formatNumber(influencer.followers)}</span>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground mb-4">{influencer.description}</p>
            
            <div className="flex flex-wrap gap-2 mb-5 justify-end">
              {influencer.topics && influencer.topics.map((topic, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {topic}
                </Badge>
              ))}
            </div>
            
            <div className="flex justify-between">
              <Button
                variant={influencer.isFollowed ? "default" : "outline"}
                size="sm"
                className="w-full"
                onClick={() => {
                  toggleInfluencerFollow(influencer.id);
                  onFocus(influencer.id);
                }}
              >
                {influencer.isFollowed ? (
                  <>
                    <StarOff className="h-4 w-4 ml-2" />
                    הפסק לעקוב
                  </>
                ) : (
                  <>
                    <Star className="h-4 w-4 ml-2" />
                    עקוב
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
      
      {influencers.length === 0 && (
        <div className="col-span-full text-center py-12">
          <p className="text-muted-foreground">לא נמצאו משפיענים התואמים את החיפוש</p>
        </div>
      )}
    </div>
  );
};

export default InfluencersTab;
