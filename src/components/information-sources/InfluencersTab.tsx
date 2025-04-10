
import React from 'react';
import { MarketInfluencer } from '@/types/marketInformation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Check, ExternalLink, Linkedin, Newspaper, Twitter, Users, Youtube } from 'lucide-react';

interface InfluencersTabProps {
  influencers: MarketInfluencer[] | undefined;
  influencerFilter: string;
  setInfluencerFilter: (value: string) => void;
  handleToggleInfluencer: (influencerId: string, following: boolean) => void;
  isLoading: boolean;
}

const InfluencersTab: React.FC<InfluencersTabProps> = ({
  influencers,
  influencerFilter,
  setInfluencerFilter,
  handleToggleInfluencer,
  isLoading
}) => {
  return (
    <>
      <div className="flex justify-end mb-4">
        <Select value={influencerFilter} onValueChange={setInfluencerFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="כל הדמויות" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">כל הדמויות</SelectItem>
            <SelectItem value="following">במעקב בלבד</SelectItem>
            <SelectItem value="specialty">לפי תחום מומחיות</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : influencers && influencers.length > 0 ? (
        <div className="space-y-6">
          {influencers.map(influencer => {
            // Determine sentiment color
            const sentimentColor = 
              influencer.sentiment === 'bullish' ? 'text-green-600' : 
              influencer.sentiment === 'bearish' ? 'text-red-600' : 
              influencer.sentiment === 'variable' ? 'text-purple-600' : 'text-blue-600';
            
            return (
              <Card key={influencer.id} className={influencer.followStatus === 'following' ? "border-primary" : ""}>
                <CardHeader className="flex flex-row items-start justify-between pb-2">
                  <div className="text-right">
                    <CardTitle className="text-xl">{influencer.name}</CardTitle>
                    <CardDescription className="mt-1">{influencer.description}</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    {influencer.followStatus === 'following' && <Check className="h-5 w-5 text-green-500" />}
                  </div>
                </CardHeader>
                <CardContent className="text-right">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {influencer.specialty.map((spec, index) => (
                      <Badge key={index} variant="secondary">{spec}</Badge>
                    ))}
                  </div>
                  
                  <div className="flex flex-col gap-3 mb-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">אמינות:</span>
                      <span className="text-sm font-medium">{influencer.reliability}/10</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">גישה כללית:</span>
                      <span className={`text-sm font-medium ${sentimentColor}`}>
                        {influencer.sentiment === 'bullish' ? 'חיובית' : 
                         influencer.sentiment === 'bearish' ? 'שלילית' :
                         influencer.sentiment === 'variable' ? 'משתנה' : 'ניטרלית'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm font-medium">פלטפורמות:</p>
                    <div className="flex flex-wrap gap-3">
                      {influencer.platforms.map((platform, idx) => (
                        <Button key={idx} variant="outline" size="sm" asChild>
                          <a href={platform.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                            {platform.type === 'twitter' && <Twitter className="h-4 w-4" />}
                            {platform.type === 'youtube' && <Youtube className="h-4 w-4" />}
                            {platform.type === 'linkedin' && <Linkedin className="h-4 w-4" />}
                            {platform.type === 'blog' && <Newspaper className="h-4 w-4" />}
                            {platform.type === 'other' && <ExternalLink className="h-4 w-4" />}
                            {platform.followers > 0 ? 
                              `${platform.followers.toLocaleString()} עוקבים` : 
                              platform.type === 'other' ? 'אתר רשמי' : platform.type}
                          </a>
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end pt-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{influencer.followStatus === 'following' ? "במעקב" : "הוסף למעקב"}</span>
                    <Switch 
                      checked={influencer.followStatus === 'following'} 
                      onCheckedChange={(checked) => handleToggleInfluencer(influencer.id, checked)}
                    />
                  </div>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-1">לא נמצאו דמויות מפתח</p>
            <p className="text-muted-foreground">נסה לשנות את החיפוש או הפילטר שלך</p>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default InfluencersTab;
