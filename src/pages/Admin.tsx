
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Container } from '@/components/ui/container';
import UserManagement from '@/components/admin/UserManagement';
import { Shield, Users, Key, Activity } from 'lucide-react';

const Admin = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('users');

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Only admin can access this page
  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <Container className="py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">פאנל ניהול</h1>
        <p className="text-muted-foreground">ניהול משתמשים, הרשאות ומערכת</p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            משתמשים
          </TabsTrigger>
          <TabsTrigger value="permissions" className="flex items-center gap-2">
            <Key className="h-4 w-4" />
            הרשאות
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            מערכת
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <UserManagement />
        </TabsContent>

        <TabsContent value="permissions">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Shield className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">ניהול הרשאות וגישות</h3>
            <p className="text-muted-foreground max-w-md">
              ניהול הרשאות מתבצע ברמת המשתמש הבודד. אנא עבור למסך ניהול המשתמשים ולחץ על אייקון המגן ליד המשתמש הרצוי.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="system">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Activity className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">ניטור מערכת</h3>
            <p className="text-muted-foreground max-w-md">
              ניטור המערכת יהיה זמין בהמשך. כרגע, אנא בדוק את לוגים של המערכת בקונסול הדפדפן.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </Container>
  );
};

export default Admin;
