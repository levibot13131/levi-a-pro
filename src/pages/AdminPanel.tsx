
import React, { useState } from 'react';
import { Container } from '@/components/ui/container';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { 
  Users, 
  Settings, 
  Database, 
  CreditCard, 
  Lock, 
  Activity, 
  Link, 
  BarChart2,
  AlertTriangle,
  Sliders
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

interface AdminModuleProps {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
  navigate: NavigateFunction;
}

const AdminModule: React.FC<AdminModuleProps> = ({ title, description, icon: Icon, path, navigate }) => {
  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate(path)}>
      <CardHeader className="p-4 text-right">
        <CardTitle className="text-xl flex items-center justify-end">
          <span>{title}</span>
          <Icon className="mr-2 h-5 w-5 text-primary" />
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4 text-right">
        <p className="text-muted-foreground">{description}</p>
        <Button variant="link" className="p-0 h-auto mt-2">גישה לממשק &larr;</Button>
      </CardContent>
    </Card>
  );
};

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState<string>('system');
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  const modules = [
    {
      id: 'users',
      title: 'ניהול משתמשים',
      description: 'יצירה, עריכה וניהול משתמשים במערכת',
      icon: Users,
      path: '/admin/users'
    },
    {
      id: 'settings',
      title: 'הגדרות מערכת',
      description: 'הגדרת הגדרות כלליות, תצורה וזמני תגובה',
      icon: Settings,
      path: '/admin/settings'
    },
    {
      id: 'advanced',
      title: 'הגדרות מתקדמות',
      description: 'הגדרות מתקדמות, חיבורי API ופרוקסי',
      icon: Sliders,
      path: '/admin/advanced-settings'
    },
    {
      id: 'data',
      title: 'ניהול נתונים',
      description: 'גישה לבסיס הנתונים, גיבויים ומחיקות',
      icon: Database,
      path: '/admin/data-management'
    },
    {
      id: 'billing',
      title: 'חיוב ותשלומים',
      description: 'ניהול חיובים, תוכניות מחירים והיסטוריית תשלומים',
      icon: CreditCard,
      path: '/admin/billing'
    },
    {
      id: 'security',
      title: 'אבטחה והרשאות',
      description: 'הגדרת הרשאות, אימות דו-שלבי וניהול גישה',
      icon: Lock,
      path: '/admin/security'
    },
    {
      id: 'logs',
      title: 'לוגים וניטור',
      description: 'צפייה בלוגים, ניטור מערכת והתראות',
      icon: Activity,
      path: '/admin/logs'
    },
    {
      id: 'api',
      title: 'חיבורי API',
      description: 'ניהול חיבורים לשירותים חיצוניים ומפתחות API',
      icon: Link,
      path: '/admin/api-connections'
    },
    {
      id: 'proxy',
      title: 'הגדרות פרוקסי',
      description: 'הגדרת פרוקסי לחיבור לשירותים חיצוניים',
      icon: Link,
      path: '/proxy-settings'
    },
    {
      id: 'analytics',
      title: 'אנליטיקות',
      description: 'נתוני שימוש, סטטיסטיקות ומדדי ביצוע',
      icon: BarChart2,
      path: '/admin/analytics'
    },
    {
      id: 'alerts',
      title: 'התראות',
      description: 'הגדרת התראות מערכת וניהול הודעות',
      icon: AlertTriangle,
      path: '/admin/alerts'
    }
  ];

  if (!isAdmin) {
    return (
      <Container className="py-8">
        <Card>
          <CardContent className="py-12 text-center">
            <AlertTriangle className="mx-auto h-12 w-12 text-amber-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2">אין לך הרשאה</h2>
            <p className="text-muted-foreground mb-4">אינך מורשה לגשת ללוח הניהול. דרושות הרשאות מנהל.</p>
            <Button onClick={() => navigate('/')} variant="outline">חזרה לדף הבית</Button>
          </CardContent>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="py-6">
      <div className="flex justify-between items-center mb-6">
        <Button onClick={() => navigate('/admin/api-connections')} variant="outline">
          <Link className="mr-2 h-4 w-4" />
          נהל חיבורי API
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">לוח ניהול מערכת</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="system">מערכת</TabsTrigger>
          <TabsTrigger value="users">משתמשים</TabsTrigger>
          <TabsTrigger value="data">נתונים</TabsTrigger>
        </TabsList>

        <TabsContent value="system" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules
              .filter(m => ['settings', 'security', 'logs', 'api', 'alerts', 'advanced', 'proxy'].includes(m.id))
              .map((module) => (
                <AdminModule
                  key={module.id}
                  title={module.title}
                  description={module.description}
                  icon={module.icon}
                  path={module.path}
                  navigate={navigate}
                />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="users" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules
              .filter(m => ['users', 'billing'].includes(m.id))
              .map((module) => (
                <AdminModule
                  key={module.id}
                  title={module.title}
                  description={module.description}
                  icon={module.icon}
                  path={module.path}
                  navigate={navigate}
                />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="data" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules
              .filter(m => ['data', 'analytics'].includes(m.id))
              .map((module) => (
                <AdminModule
                  key={module.id}
                  title={module.title}
                  description={module.description}
                  icon={module.icon}
                  path={module.path}
                  navigate={navigate}
                />
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </Container>
  );
};

export default AdminPanel;
