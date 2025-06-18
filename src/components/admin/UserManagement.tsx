
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { Users, Shield, UserPlus, Mail } from 'lucide-react';
import { toast } from 'sonner';

const UserManagement = () => {
  const { user, isAdmin } = useAuth();
  const [users] = useState([
    {
      id: '1',
      email: 'almogahronov1997@gmail.com',
      displayName: 'Almog Ahronov',
      role: 'admin',
      isActive: true,
      lastLogin: new Date(),
    },
    {
      id: '2',
      email: 'avraham.oron@gmail.com',
      displayName: 'Avraham Oron',
      role: 'user',
      isActive: true,
      lastLogin: new Date(),
    }
  ]);

  if (!isAdmin) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">אין הרשאה</h3>
          <p className="text-muted-foreground">רק מנהלים יכולים לגשת לניהול משתמשים</p>
        </CardContent>
      </Card>
    );
  }

  const handlePromoteUser = (userId: string) => {
    toast.success('משתמש הועלה למנהל');
  };

  const handleDeactivateUser = (userId: string) => {
    toast.success('משתמש הושבת');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-right">
            <Users className="h-5 w-5" />
            ניהול משתמשים
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.map((userItem) => (
              <div key={userItem.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <Button variant="outline" size="sm" onClick={() => handlePromoteUser(userItem.id)}>
                    <Shield className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDeactivateUser(userItem.id)}>
                    השבת
                  </Button>
                </div>
                
                <div className="text-right">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={userItem.role === 'admin' ? 'default' : 'secondary'}>
                      {userItem.role === 'admin' ? 'מנהל' : 'משתמש'}
                    </Badge>
                    <h4 className="font-medium">{userItem.displayName}</h4>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Mail className="h-3 w-3" />
                    {userItem.email}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    כניסה אחרונה: {userItem.lastLogin.toLocaleDateString('he-IL')}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t">
            <Button className="w-full">
              <UserPlus className="h-4 w-4 mr-2" />
              הוסף משתמש חדש
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-right">הגדרות אבטחה</CardTitle>
        </CardHeader>
        <CardContent className="text-right">
          <div className="space-y-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-800">הרשאה מוגבלת</h4>
              <p className="text-sm text-green-600">
                רק המשתמשים המורשים יכולים לגשת למערכת
              </p>
            </div>
            
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-800">הרשאות מנהל</h4>
              <p className="text-sm text-blue-600">
                {user?.email} - גישה מלאה למערכת
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;
