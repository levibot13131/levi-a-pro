
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

const Settings = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">הגדרות</h1>
      
      <Tabs defaultValue="account" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="account">חשבון</TabsTrigger>
          <TabsTrigger value="notifications">התראות</TabsTrigger>
          <TabsTrigger value="appearance">מראה</TabsTrigger>
        </TabsList>
        
        <TabsContent value="account" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>פרטי חשבון</CardTitle>
              <CardDescription>עדכון פרטי החשבון שלך</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">שם מלא</Label>
                <Input id="name" placeholder="השם המלא שלך" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">אימייל</Label>
                <Input id="email" placeholder="your@email.com" type="email" dir="ltr" />
              </div>
              <Separator className="my-4" />
              <div className="space-y-2">
                <Label htmlFor="current-password">סיסמה נוכחית</Label>
                <Input id="current-password" type="password" dir="ltr" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">סיסמה חדשה</Label>
                <Input id="new-password" type="password" dir="ltr" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">אימות סיסמה חדשה</Label>
                <Input id="confirm-password" type="password" dir="ltr" />
              </div>
              <div className="pt-4">
                <Button>שמור שינויים</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>הגדרות התראות</CardTitle>
              <CardDescription>הגדר כיצד תקבל התראות מהמערכת</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">התראות במערכת</Label>
                  <p className="text-sm text-muted-foreground">
                    קבל התראות באפליקציה בזמן אמת
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">התראות אימייל</Label>
                  <p className="text-sm text-muted-foreground">
                    קבל התראות לכתובת האימייל שלך
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">התראות טלגרם</Label>
                  <p className="text-sm text-muted-foreground">
                    קבל התראות לערוץ הטלגרם שלך
                  </p>
                </div>
                <Switch />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">התראות WhatsApp</Label>
                  <p className="text-sm text-muted-foreground">
                    קבל התראות לטלפון שלך
                  </p>
                </div>
                <Switch />
              </div>
              <div className="pt-4">
                <Button>שמור הגדרות</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="appearance" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>מראה</CardTitle>
              <CardDescription>התאם את מראה האפליקציה</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Label className="text-base">ערכת נושא</Label>
                <div className="grid grid-cols-3 gap-4">
                  <Button variant="outline" className="justify-start">בהיר</Button>
                  <Button variant="outline" className="justify-start">כהה</Button>
                  <Button variant="outline" className="justify-start">מערכת</Button>
                </div>
              </div>
              <Separator />
              <div className="space-y-4">
                <Label className="text-base">שפה</Label>
                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" className="justify-start">עברית</Button>
                  <Button variant="outline" className="justify-start">English</Button>
                </div>
              </div>
              <div className="pt-4">
                <Button>שמור העדפות</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
