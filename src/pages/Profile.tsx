
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';

const Profile = () => {
  const { user } = useAuth();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">פרופיל משתמש</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader className="text-center">
              <Avatar className="h-24 w-24 mx-auto">
                <AvatarImage src={user?.photoURL || ''} />
                <AvatarFallback className="text-xl">
                  {user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <CardTitle className="mt-4">{user?.displayName || 'משתמש'}</CardTitle>
              <CardDescription>{user?.email}</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="flex flex-col space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">סטטוס חשבון:</span>
                  <span className="font-medium">פעיל</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">תאריך הצטרפות:</span>
                  <span className="font-medium">01/01/2023</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">סוג חשבון:</span>
                  <span className="font-medium">סטנדרטי</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-2">
          <Tabs defaultValue="personal">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="personal">פרטים אישיים</TabsTrigger>
              <TabsTrigger value="preferences">העדפות</TabsTrigger>
              <TabsTrigger value="api">הגדרות API</TabsTrigger>
            </TabsList>
            
            <TabsContent value="personal" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>פרטים אישיים</CardTitle>
                  <CardDescription>צפייה ועריכת פרטי המשתמש שלך</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium">שם מלא</h3>
                      <p className="text-muted-foreground">{user?.displayName || 'לא הוגדר'}</p>
                    </div>
                    <Separator />
                    <div>
                      <h3 className="text-lg font-medium">כתובת אימייל</h3>
                      <p className="text-muted-foreground">{user?.email || 'לא הוגדר'}</p>
                    </div>
                    <Separator />
                    <div>
                      <h3 className="text-lg font-medium">טלפון</h3>
                      <p className="text-muted-foreground">לא הוגדר</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="preferences" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>העדפות מערכת</CardTitle>
                  <CardDescription>התאם את ההגדרות שלך במערכת</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">העדפות המערכת מאפשרות לך להתאים את חווית המשתמש לצרכים שלך.</p>
                  <p className="mt-4">לא הוגדרו העדפות מותאמות אישית עדיין.</p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="api" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>הגדרות API</CardTitle>
                  <CardDescription>נהל את מפתחות ה-API שלך</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">אין מפתחות API פעילים כרגע.</p>
                  <p className="mt-4">מפתחות API משמשים לחיבור לשירותים חיצוניים כמו Binance, TradingView ועוד.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Profile;
