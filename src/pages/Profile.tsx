
import React from 'react';
import { Container } from '@/components/ui/container';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const Profile = () => {
  const { user } = useAuth();
  const [name, setName] = React.useState(user?.displayName || '');
  const [email, setEmail] = React.useState(user?.email || '');
  
  const handleSave = () => {
    toast.success('פרטי הפרופיל נשמרו בהצלחה');
  };
  
  const handleProxyUrl = () => {
    // Set the proxy URL from the ngrok URL you provided
    const proxyConfig = {
      baseUrl: 'https://6813-46-116-195-122.ngrok-free.app',
      isEnabled: true
    };
    
    // Store in local storage for persistence
    localStorage.setItem('levi_bot_proxy_url', JSON.stringify(proxyConfig));
    toast.success('כתובת הפרוקסי נשמרה בהצלחה');
    
    // Trigger an event to notify other components
    window.dispatchEvent(new CustomEvent('proxy-config-changed', {
      detail: proxyConfig
    }));
  };
  
  return (
    <Container className="py-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">פרופיל אישי</h1>
        <Button onClick={handleProxyUrl} variant="outline">
          הגדר פרוקסי אוטומטית
        </Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-[1fr_250px]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-right">פרטי משתמש</CardTitle>
              <CardDescription className="text-right">
                עדכן את הפרטים האישיים שלך
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-right block">שם מלא</label>
                <Input 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="text-right"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-right block">אימייל</label>
                <Input 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  className="text-right"
                />
              </div>
              
              <Button onClick={handleSave} className="w-full">שמור שינויים</Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-right">פרטי הגדרה</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">עברית</span>
                <span className="font-medium">שפת ממשק:</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-sm">אסיה/ירושלים (GMT+3)</span>
                <span className="font-medium">אזור זמן:</span>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center">
                <Avatar className="w-24 h-24 mb-4">
                  <AvatarImage src={user?.photoURL || ''} />
                  <AvatarFallback className="text-xl">
                    {name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-medium">{name || 'משתמש'}</h3>
                <p className="text-muted-foreground">{email || 'אימייל לא מוגדר'}</p>
                
                <div className="w-full mt-6">
                  <Button variant="outline" className="w-full">
                    שנה תמונת פרופיל
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Container>
  );
};

export default Profile;
