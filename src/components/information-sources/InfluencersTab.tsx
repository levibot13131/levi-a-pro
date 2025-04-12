
import React from 'react';
import { MarketInfluencer } from '@/pages/InformationSources';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Check, Twitter, Youtube, MessageCircle, Star, ExternalLink } from 'lucide-react';

interface InfluencersTabProps {
  influencers: MarketInfluencer[];
  followedInfluencerIds: Set<string>;
  onFollow: (id: string) => void;
}

const InfluencersTab: React.FC<InfluencersTabProps> = ({
  influencers,
  followedInfluencerIds,
  onFollow
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {influencers.map(influencer => (
        <Card key={influencer.id}>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between mb-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={influencer.avatarUrl} />
                <AvatarFallback>{influencer.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="text-right">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-lg">{influencer.name}</h3>
                  {influencer.isVerified && (
                    <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground">@{influencer.username}</p>
                <div className="flex items-center gap-1 mt-1">
                  {influencer.platform === 'twitter' && <Twitter className="h-4 w-4 text-blue-400" />}
                  {influencer.platform === 'youtube' && <Youtube className="h-4 w-4 text-red-500" />}
                  {influencer.platform === 'telegram' && <MessageCircle className="h-4 w-4 text-blue-500" />}
                  <span className="text-xs text-muted-foreground">
                    {influencer.followers.toLocaleString()} followers
                  </span>
                </div>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground mb-4">{influencer.bio}</p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {influencer.expertise.map(tag => (
                <span key={tag} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
            
            <div className="flex justify-between gap-2">
              <Button
                variant={followedInfluencerIds.has(influencer.id) ? "default" : "outline"}
                size="sm"
                className="flex-1"
                onClick={() => onFollow(influencer.id)}
              >
                {followedInfluencerIds.has(influencer.id) ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    עוקב
                  </>
                ) : (
                  'עקוב'
                )}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => window.open(influencer.profileUrl, '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                פתח פרופיל
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
