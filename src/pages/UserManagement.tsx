
import React from 'react';
import { UserManagement as UserManagementComponent } from '@/components/admin/UserManagement';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const UserManagement = () => {
  const { isAdmin } = useAuth();

  // Redirect non-admin users away from this page
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">ניהול משתמשים</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>ניהול משתמשים ואבטחת המערכת</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            באזור זה תוכל לנהל את המשתמשים במערכת, להקצות הרשאות, ולעקוב אחר פעילות משתמשים.
          </p>
          <p className="mb-4">
            רק למנהלי מערכת יש גישה לדף זה והרשאות לניהול המשתמשים.
          </p>
        </CardContent>
      </Card>
      
      <UserManagementComponent />
    </div>
  );
};

export default UserManagement;
