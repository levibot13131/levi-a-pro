
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Twitter, ArrowUpRight, Share2 } from 'lucide-react';

const TopInfluencers = () => {
  const influencers = [
    {
      name: 'קריפטו ישראלי',
      handle: '@IsraeliCrypto',
      followers: '125K',
      impact: 'גבוהה',
      imageUrl: 'https://api.dicebear.com/6.x/micah/svg?seed=1'
    },
    {
      name: 'Bitcoin Trader',
      handle: '@BTCTrader_IL',
      followers: '87K',
      impact: 'בינונית',
      imageUrl: 'https://api.dicebear.com/6.x/micah/svg?seed=2'
    },
    {
      name: 'Blockchain Hub',
      handle: '@BlockchainHubIL',
      followers: '56K',
      impact: 'גבוהה',
      imageUrl: 'https://api.dicebear.com/6.x/micah/svg?seed=3'
    },
    {
      name: 'אורי לוינשטיין',
      handle: '@UriCrypto',
      followers: '43K',
      impact: 'בינונית',
      imageUrl: 'https://api.dicebear.com/6.x/micah/svg?seed=4'
    }
  ];
  
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-right">משפיענים מובילים</CardTitle>
        <CardDescription className="text-right">
          המשפיענים המובילים בקהילת הקריפטו
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {influencers.map((influencer, index) => (
            <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted cursor-pointer transition-colors">
              <div className="flex items-center gap-1">
                <Twitter className="h-4 w-4 text-blue-500" />
                <ArrowUpRight className="h-3 w-3 text-muted-foreground" />
              </div>
              <div className="flex items-center gap-3 text-right">
                <div>
                  <p className="font-medium text-sm">{influencer.name}</p>
                  <p className="text-xs text-muted-foreground">{influencer.handle}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-xs">{influencer.followers} עוקבים</span>
                    <span className="text-xs px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                      {influencer.impact}
                    </span>
                  </div>
                </div>
                <Avatar className="h-10 w-10">
                  <AvatarImage src={influencer.imageUrl} />
                  <AvatarFallback>{influencer.name[0]}</AvatarFallback>
                </Avatar>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TopInfluencers;
