
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Twitter } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tweet } from '@/services/twitter/twitterService';

interface InfluencersTabProps {
  searchQuery: string;
  tweets: Tweet[];
}

const InfluencersTab: React.FC<InfluencersTabProps> = ({ searchQuery, tweets }) => {
  const influencers = [
    {
      name: 'Vitalik Buterin',
      handle: '@VitalikButerin',
      bio: 'מייסד אית׳ריום, כותב ומפתח בלוקצ׳יין',
      followers: '5.7M',
      verified: true,
      imageUrl: 'https://randomuser.me/api/portraits/men/12.jpg',
      focus: ['Ethereum', 'L2', 'DeFi'],
      sentiment: 'neutral' as const,
    },
    {
      name: 'Elon Musk',
      handle: '@elonmusk',
      bio: 'CEO של טסלה וSpaceX, תומך בדוג׳קוין וביטקוין',
      followers: '152M',
      verified: true,
      imageUrl: 'https://randomuser.me/api/portraits/men/11.jpg',
      focus: ['Bitcoin', 'Dogecoin'],
      sentiment: 'positive' as const,
    },
    {
      name: 'CZ Binance',
      handle: '@cz_binance',
      bio: 'מייסד ומנכ״ל בורסת הקריפטו Binance',
      followers: '8.5M',
      verified: true,
      imageUrl: 'https://randomuser.me/api/portraits/men/13.jpg',
      focus: ['Binance', 'BNB', 'Exchanges'],
      sentiment: 'positive' as const,
    },
    {
      name: 'Michael Saylor',
      handle: '@saylor',
      bio: 'מנכ״ל MicroStrategy, אסטרטג ביטקוין',
      followers: '3.1M',
      verified: true,
      imageUrl: 'https://randomuser.me/api/portraits/men/17.jpg',
      focus: ['Bitcoin', 'Institutional'],
      sentiment: 'positive' as const,
    },
    {
      name: 'Peter Schiff',
      handle: '@PeterSchiff',
      bio: 'כלכלן, אוהב זהב, ביקורתי כלפי ביטקוין',
      followers: '921K',
      verified: false,
      imageUrl: 'https://randomuser.me/api/portraits/men/14.jpg',
      focus: ['Gold', 'Bitcoin', 'Economics'],
      sentiment: 'negative' as const,
    },
  ];

  const filteredInfluencers = searchQuery
    ? influencers.filter(influencer => 
        influencer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        influencer.handle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        influencer.bio.includes(searchQuery) ||
        influencer.focus.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : influencers;

  return (
    <div className="space-y-4">
      {filteredInfluencers.length === 0 ? (
        <div className="text-center py-8">
          <p>לא נמצאו תוצאות עבור "{searchQuery}"</p>
        </div>
      ) : (
        filteredInfluencers.map((influencer, index) => (
          <div key={index} className="p-4 border rounded-lg space-y-3">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={influencer.imageUrl} alt={influencer.name} />
                  <AvatarFallback>{influencer.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{influencer.name}</h3>
                    {influencer.verified && (
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-100">
                        מאומת
                      </Badge>
                    )}
                    <Badge
                      className={
                        influencer.sentiment === 'positive' ? 'bg-green-100 text-green-800 hover:bg-green-200' :
                        influencer.sentiment === 'negative' ? 'bg-red-100 text-red-800 hover:bg-red-200' :
                        'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }
                    >
                      {influencer.sentiment === 'positive' ? 'חיובי' : 
                       influencer.sentiment === 'negative' ? 'שלילי' : 'ניטרלי'}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">{influencer.handle} • {influencer.followers} עוקבים</div>
                </div>
              </div>
              <Button variant="outline" size="sm" asChild>
                <a href={`https://twitter.com/${influencer.handle.substring(1)}`} target="_blank" rel="noopener noreferrer">
                  <Twitter className="h-4 w-4 mr-2" />
                  עקוב
                </a>
              </Button>
            </div>
            
            <p className="text-sm">{influencer.bio}</p>
            
            <div className="flex flex-wrap gap-2">
              {influencer.focus.map((tag, idx) => (
                <Badge key={idx} variant="outline">{tag}</Badge>
              ))}
            </div>
            
            {/* Most recent tweet from this influencer, if available */}
            {tweets.some(tweet => tweet.username.toLowerCase() === influencer.handle.substring(1).toLowerCase()) && (
              <div className="mt-3 pt-3 border-t">
                <div className="text-sm font-medium mb-1">ציוץ אחרון:</div>
                {tweets.filter(tweet => tweet.username.toLowerCase() === influencer.handle.substring(1).toLowerCase())
                  .slice(0, 1)
                  .map(tweet => (
                    <div key={tweet.id} className="text-sm bg-muted/50 p-2 rounded">
                      {tweet.text}
                    </div>
                  ))
                }
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default InfluencersTab;
