
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const AdminPanel = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">פאנל ניהול</h1>
      <p className="text-muted-foreground mb-6">ניהול משתמשים, הגדרות מערכת ונתונים</p>
      
      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="users">ניהול משתמשים</TabsTrigger>
          <TabsTrigger value="system">הגדרות מערכת</TabsTrigger>
          <TabsTrigger value="logs">לוגים ומעקב</TabsTrigger>
        </TabsList>
        
        <TabsContent value="users" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>ניהול משתמשים</CardTitle>
              <CardDescription>צפייה, עריכה וניהול משתמשי המערכת</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">ניהול המשתמשים יהיה זמין בקרוב.</p>
              <p className="mt-4">במסך זה תוכל לראות את כל המשתמשים הרשומים במערכת, לערוך את ההרשאות שלהם ולנהל את חשבונותיהם.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="system" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>הגדרות מערכת</CardTitle>
              <CardDescription>קביעת הגדרות כלליות למערכת</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">הגדרות המערכת יהיו זמינות בקרוב.</p>
              <p className="mt-4">במסך זה תוכל לשנות הגדרות מערכת כלליות, לקבוע מדיניות סיסמאות, ולנהל את האבטחה והגיבויים.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="logs" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>לוגים ומעקב</CardTitle>
              <CardDescription>מעקב אחר אירועי מערכת ופעילות משתמשים</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">לוגים ומעקב יהיו זמינים בקרוב.</p>
              <p className="mt-4">במסך זה תוכל לצפות בלוגים של המערכת, לעקוב אחר פעילות משתמשים ולזהות בעיות אבטחה.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPanel;
