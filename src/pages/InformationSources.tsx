
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  getInformationSources, 
  getMarketInfluencers, 
  getUpcomingMarketEvents,
  toggleSourceFocus,
  toggleInfluencerFollow,
  setEventReminder,
  FinancialDataSource,
  MarketInfluencer,
  MarketEvent
} from '@/services/marketInformationService';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Globe, 
  Users, 
  Calendar, 
  Star, 
  Filter, 
  Newspaper, 
  Database, 
  TrendingUp,
  Twitter,
  Youtube,
  Linkedin,
  ExternalLink,
  Search,
  Bell,
  Check
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

const InformationSources = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sourceCategory, setSourceCategory] = useState<string>('all');
  const [influencerFilter, setInfluencerFilter] = useState<string>('all');
  const [eventFilter, setEventFilter] = useState<string>('all');
  
  // Fetch data
  const { data: sources, isLoading: sourcesLoading, refetch: refetchSources } = useQuery({
    queryKey: ['informationSources'],
    queryFn: getInformationSources,
  });
  
  const { data: influencers, isLoading: influencersLoading, refetch: refetchInfluencers } = useQuery({
    queryKey: ['marketInfluencers'],
    queryFn: getMarketInfluencers,
  });
  
  const { data: events, isLoading: eventsLoading, refetch: refetchEvents } = useQuery({
    queryKey: ['marketEvents'],
    queryFn: () => getUpcomingMarketEvents(90),
  });
  
  // Filter functions
  const filteredSources = sources?.filter(source => {
    const matchesSearch = source.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        source.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = sourceCategory === 'all' || source.category === sourceCategory;
    return matchesSearch && matchesCategory;
  });
  
  const filteredInfluencers = influencers?.filter(influencer => {
    const matchesSearch = influencer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        influencer.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = influencerFilter === 'all' || 
                        (influencerFilter === 'following' && influencer.followStatus === 'following') ||
                        (influencerFilter === 'specialty' && influencer.specialty.some(s => s.toLowerCase().includes(searchTerm.toLowerCase())));
    return matchesSearch && matchesFilter;
  });
  
  const filteredEvents = events?.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = eventFilter === 'all' || 
                        (eventFilter === 'reminder' && event.reminder) ||
                        (eventFilter === 'critical' && event.importance === 'critical');
    return matchesSearch && matchesFilter;
  });
  
  // Helper functions
  const handleToggleSource = async (sourceId: string, focused: boolean) => {
    await toggleSourceFocus(sourceId, focused);
    refetchSources();
  };
  
  const handleToggleInfluencer = async (influencerId: string, following: boolean) => {
    await toggleInfluencerFollow(influencerId, following);
    refetchInfluencers();
  };
  
  const handleToggleEventReminder = async (eventId: string, reminder: boolean) => {
    await setEventReminder(eventId, reminder);
    refetchEvents();
  };
  
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('he-IL', options);
  };
  
  // Category badges
  const getCategoryBadge = (category: FinancialDataSource['category']) => {
    switch(category) {
      case 'news':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">חדשות</Badge>;
      case 'data':
        return <Badge variant="outline" className="bg-green-100 text-green-800">נתונים</Badge>;
      case 'analysis':
        return <Badge variant="outline" className="bg-purple-100 text-purple-800">ניתוח</Badge>;
      case 'social':
        return <Badge variant="outline" className="bg-amber-100 text-amber-800">רשתות חברתיות</Badge>;
      default:
        return null;
    }
  };
  
  // Event importance badges
  const getImportanceBadge = (importance: MarketEvent['importance']) => {
    switch(importance) {
      case 'critical':
        return <Badge className="bg-red-100 text-red-800">קריטי</Badge>;
      case 'high':
        return <Badge className="bg-orange-100 text-orange-800">גבוה</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800">בינוני</Badge>;
      case 'low':
        return <Badge className="bg-gray-100 text-gray-800">נמוך</Badge>;
      default:
        return null;
    }
  };
  
  // Event category icon
  const getEventCategoryIcon = (category: MarketEvent['category']) => {
    switch(category) {
      case 'economic':
        return <TrendingUp className="h-5 w-5 text-green-600" />;
      case 'earnings':
        return <Database className="h-5 w-5 text-blue-600" />;
      case 'political':
        return <Users className="h-5 w-5 text-purple-600" />;
      case 'regulatory':
        return <Globe className="h-5 w-5 text-orange-600" />;
      default:
        return <Calendar className="h-5 w-5 text-gray-600" />;
    }
  };
  
  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <h1 className="text-3xl font-bold mb-6 text-right">מקורות מידע וניטור שוק</h1>
      
      <div className="flex flex-col md:flex-row gap-4 mb-8 justify-end">
        <div className="relative w-full md:w-[300px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <Input
            placeholder="חיפוש..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-10 text-right"
          />
        </div>
      </div>
      
      <Tabs defaultValue="sources" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 md:w-[600px] mx-auto">
          <TabsTrigger value="sources" className="flex items-center gap-2">
            <Newspaper className="h-4 w-4" />
            מקורות מידע
          </TabsTrigger>
          <TabsTrigger value="influencers" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            דמויות מפתח
          </TabsTrigger>
          <TabsTrigger value="events" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            אירועי שוק
          </TabsTrigger>
        </TabsList>
        
        {/* Sources Tab */}
        <TabsContent value="sources">
          <div className="flex justify-end mb-4">
            <Select value={sourceCategory} onValueChange={setSourceCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="כל הקטגוריות" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">כל הקטגוריות</SelectItem>
                <SelectItem value="news">חדשות</SelectItem>
                <SelectItem value="data">מאגרי נתונים</SelectItem>
                <SelectItem value="analysis">ניתוח</SelectItem>
                <SelectItem value="social">רשתות חברתיות</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {sourcesLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : filteredSources && filteredSources.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSources.map(source => (
                <Card key={source.id} className={source.focused ? "border-primary" : ""}>
                  <CardHeader className="flex flex-row items-start justify-between pb-2">
                    <div className="text-right">
                      <CardTitle className="text-xl">{source.name}</CardTitle>
                      <div className="flex gap-2 mt-1">
                        {getCategoryBadge(source.category)}
                        <Badge variant="outline" className={source.accessType === 'free' ? "bg-green-50" : ""}>
                          {source.accessType === 'free' ? 'חינמי' : source.accessType === 'paid' ? 'בתשלום' : 'API'}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className={`h-6 w-6 ${source.focused ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
                    </div>
                  </CardHeader>
                  <CardContent className="text-right">
                    <p className="text-sm text-gray-600 mb-3">{source.description}</p>
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">אמינות:</span>
                        <span className="text-sm font-medium">{source.reliability}/10</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">שפות:</span>
                        <span className="text-sm">{source.languages.join(', ')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">תדירות עדכון:</span>
                        <span className="text-sm">{source.updateFrequency}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between pt-0">
                    <Button variant="outline" size="sm" onClick={() => window.open(source.url, '_blank')}>
                      בקר באתר
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </Button>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{source.focused ? "במעקב" : "הוסף למעקב"}</span>
                      <Switch 
                        checked={source.focused} 
                        onCheckedChange={(checked) => handleToggleSource(source.id, checked)}
                      />
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Newspaper className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium mb-1">לא נמצאו מקורות מידע</p>
                <p className="text-muted-foreground">נסה לשנות את החיפוש או הפילטר שלך</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        {/* Influencers Tab */}
        <TabsContent value="influencers">
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
          
          {influencersLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : filteredInfluencers && filteredInfluencers.length > 0 ? (
            <div className="space-y-6">
              {filteredInfluencers.map(influencer => {
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
        </TabsContent>
        
        {/* Events Tab */}
        <TabsContent value="events">
          <div className="flex justify-end mb-4">
            <Select value={eventFilter} onValueChange={setEventFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="כל האירועים" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">כל האירועים</SelectItem>
                <SelectItem value="reminder">עם תזכורות בלבד</SelectItem>
                <SelectItem value="critical">קריטיים בלבד</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {eventsLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : filteredEvents && filteredEvents.length > 0 ? (
            <div className="space-y-4">
              {filteredEvents.map(event => (
                <Card key={event.id} className={event.reminder ? "border-primary" : ""}>
                  <CardHeader className="flex flex-row items-start justify-between pb-2">
                    <div className="text-right">
                      <div className="flex gap-2 mb-1 items-center justify-end">
                        {getImportanceBadge(event.importance)}
                        <Badge variant="outline">
                          {event.category === 'economic' ? 'כלכלי' : 
                           event.category === 'earnings' ? 'דוחות כספיים' :
                           event.category === 'political' ? 'פוליטי' :
                           event.category === 'regulatory' ? 'רגולציה' : 'אחר'}
                        </Badge>
                      </div>
                      <CardTitle className="text-xl flex items-center gap-2 justify-end">
                        {event.title}
                        {getEventCategoryIcon(event.category)}
                      </CardTitle>
                      <CardDescription className="mt-1 text-right">
                        {formatDate(event.date)}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      {event.reminder && <Bell className="h-5 w-5 text-primary" />}
                    </div>
                  </CardHeader>
                  <CardContent className="text-right">
                    <p className="text-sm text-gray-600 mb-3">{event.description}</p>
                    
                    {event.relatedAssets && event.relatedAssets.length > 0 && (
                      <div className="mb-3">
                        <p className="text-sm font-medium mb-1">נכסים קשורים:</p>
                        <div className="flex flex-wrap gap-2">
                          {event.relatedAssets.map((asset, idx) => (
                            <Badge key={idx} variant="secondary">{asset}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {event.expectedImpact && (
                      <div className="mb-3">
                        <p className="text-sm font-medium mb-1">השפעה צפויה:</p>
                        <Badge className={
                          event.expectedImpact === 'positive' ? "bg-green-100 text-green-800" :
                          event.expectedImpact === 'negative' ? "bg-red-100 text-red-800" :
                          event.expectedImpact === 'variable' ? "bg-purple-100 text-purple-800" : "bg-gray-100 text-gray-800"
                        }>
                          {event.expectedImpact === 'positive' ? 'חיובית' :
                           event.expectedImpact === 'negative' ? 'שלילית' :
                           event.expectedImpact === 'variable' ? 'משתנה' : 'ניטרלית'}
                        </Badge>
                      </div>
                    )}
                    
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">מקור:</span>
                      <span className="text-sm">{event.source}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end pt-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{event.reminder ? "תזכורת פעילה" : "הוסף תזכורת"}</span>
                      <Switch 
                        checked={event.reminder} 
                        onCheckedChange={(checked) => handleToggleEventReminder(event.id, checked)}
                      />
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium mb-1">לא נמצאו אירועי שוק</p>
                <p className="text-muted-foreground">נסה לשנות את החיפוש או הפילטר שלך</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InformationSources;
