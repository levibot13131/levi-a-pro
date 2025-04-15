
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MessageCircle, ThumbsUp, RefreshCw } from 'lucide-react';

interface Tweet {
  id: string;
  username: string;
  text: string;
  createdAt: string;
  likes: number;
  retweets: number;
  sentiment: 'positive' | 'negative' | 'neutral';
  profileImageUrl: string;
}

interface TwitterMentionsTableProps {
  tweets: Tweet[];
}

const TwitterMentionsTable: React.FC<TwitterMentionsTableProps> = ({ tweets }) => {
  // לוקליזציה של זמנים
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('he-IL', {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit',
      }).format(date);
    } catch (error) {
      return dateString;
    }
  };
  
  // הגדרת צבע לסנטימנט
  const getSentimentBadge = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return <Badge className="bg-green-100 text-green-800">חיובי</Badge>;
      case 'negative':
        return <Badge className="bg-red-100 text-red-800">שלילי</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">ניטרלי</Badge>;
    }
  };
  
  return (
    <div className="space-y-4">
      {tweets.map((tweet) => (
        <div key={tweet.id} className="p-4 border rounded-md">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center">
              {getSentimentBadge(tweet.sentiment)}
            </div>
            <div className="flex items-center">
              <div className="text-right mr-3">
                <div className="font-medium">@{tweet.username}</div>
                <div className="text-xs text-muted-foreground">{formatDate(tweet.createdAt)}</div>
              </div>
              <div className="h-10 w-10 rounded-full overflow-hidden">
                <img src={tweet.profileImageUrl} alt={tweet.username} />
              </div>
            </div>
          </div>
          
          <p className="text-right mb-3">{tweet.text}</p>
          
          <div className="flex justify-between items-center mt-2">
            <Button variant="ghost" size="sm">
              <RefreshCw className="h-4 w-4 ml-2" />
              {tweet.retweets}
            </Button>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center">
                <span className="text-sm text-muted-foreground">{tweet.likes}</span>
                <ThumbsUp className="h-4 w-4 mr-1 text-muted-foreground" />
              </div>
              
              <Button variant="ghost" size="sm">
                <MessageCircle className="h-4 w-4 ml-1" />
                הגב
              </Button>
            </div>
          </div>
        </div>
      ))}
      
      {tweets.length === 0 && (
        <div className="text-center py-6">
          <MessageCircle className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
          <p>אין אזכורים זמינים</p>
        </div>
      )}
    </div>
  );
};

export default TwitterMentionsTable;
