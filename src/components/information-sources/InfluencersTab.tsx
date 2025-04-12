
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MarketInfluencer } from '@/types/marketInformation';  // שינוי הייבוא למיקום הנכון
import { Button } from '@/components/ui/button';
import { ExternalLink, User, Users } from 'lucide-react';
import { toggleInfluencerFollow } from '@/services/marketInformation';

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
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {influencers.map(influencer => (
        <Card key={influencer.id}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-12 w-12 rounded-full overflow-hidden bg-primary/10">
                {influencer.avatarUrl ? (
                  <img src={influencer.avatarUrl} alt={influencer.name} className="h-full w-full object-cover" />
                ) : (
                  <User className="h-6 w-6 m-3 text-primary" />
                )}
              </div>
              <div>
                <h3 className="font-bold text-lg">{influencer.name}</h3>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Users className="h-3.5 w-3.5 mr-1" />
                  <span>{influencer.followers.toLocaleString()} עוקבים</span>
                </div>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground mb-4">{influencer.description}</p>
            
            <div className="flex flex-wrap gap-1 mb-4">
              {influencer.topics.map(topic => (
                <span 
                  key={topic} 
                  className="text-xs bg-muted px-2 py-0.5 rounded"
                >
                  {topic}
                </span>
              ))}
            </div>
            
            <div className="flex justify-between gap-2">
              <Button
                variant={influencer.isFollowed ? "default" : "outline"}
                size="sm"
                className="flex-1"
                onClick={() => {
                  toggleInfluencerFollow(influencer.id);
                  onFocus(influencer.id);
                }}
              >
                <Users className="h-4 w-4 mr-2" />
                {influencer.isFollowed ? 'מפסיק לעקוב' : 'עוקב'}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => window.open(`https://${influencer.platform}/${influencer.name.toLowerCase().replace(/\s/g, '')}`, '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                לפרופיל
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
