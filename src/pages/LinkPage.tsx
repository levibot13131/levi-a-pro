
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, LineChart, Bell, Settings, Users, BookOpen, Link as LinkIcon } from 'lucide-react';

const LinkPage = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-8">דף קישורים מרכזי</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <LayoutDashboard className="h-8 w-8 mb-2 text-primary" />
            <CardTitle>דשבורד</CardTitle>
            <CardDescription>צפייה כללית במצב המערכת והנכסים</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link to="/dashboard">עבור לדשבורד</Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <LineChart className="h-8 w-8 mb-2 text-primary" />
            <CardTitle>ניתוח טכני</CardTitle>
            <CardDescription>ניתוח גרפים וזיהוי דפוסי מסחר</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link to="/technical-analysis">עבור לניתוח טכני</Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <Bell className="h-8 w-8 mb-2 text-primary" />
            <CardTitle>איתותי מסחר</CardTitle>
            <CardDescription>צפייה והגדרת התראות מסחר</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link to="/trading-signals">עבור לאיתותי מסחר</Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <BookOpen className="h-8 w-8 mb-2 text-primary" />
            <CardTitle>יומן מסחר</CardTitle>
            <CardDescription>תיעוד ומעקב אחר עסקאות מסחר</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link to="/journal">עבור ליומן מסחר</Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <Settings className="h-8 w-8 mb-2 text-primary" />
            <CardTitle>הגדרות</CardTitle>
            <CardDescription>הגדרות חשבון ומערכת</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link to="/settings">עבור להגדרות</Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <LinkIcon className="h-8 w-8 mb-2 text-primary" />
            <CardTitle>אינטגרציות</CardTitle>
            <CardDescription>חיבור לשירותים חיצוניים</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link to="/tradingview-integration">עבור לאינטגרציות</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-12 text-center">
        <Link to="/" className="text-primary hover:underline">
          חזרה לדף הבית
        </Link>
      </div>
    </div>
  );
};

export default LinkPage;
