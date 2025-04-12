
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger
} from '@/components/ui/dialog';
import { PlusCircle, Pencil, Trash2, Shield } from 'lucide-react';
import { User } from '@/types/user';
import { getUsers, deleteUser } from '@/services/auth/userService';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import UserForm from './UserForm';
import UserPermissionsForm from './UserPermissionsForm';
import { formatDate } from '@/utils/formatUtils';

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [isPermissionDialogOpen, setIsPermissionDialogOpen] = useState(false);
  const { user: currentUser, refreshUser } = useAuth();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    const loadedUsers = getUsers();
    setUsers(loadedUsers);
  };

  const handleAddUser = () => {
    setSelectedUser(null);
    setIsUserDialogOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsUserDialogOpen(true);
  };

  const handleEditPermissions = (user: User) => {
    setSelectedUser(user);
    setIsPermissionDialogOpen(true);
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק משתמש זה?')) {
      const success = deleteUser(userId);
      if (success) {
        loadUsers();
        refreshUser(); // Refresh current user in case they deleted themselves
      }
    }
  };

  const handleUserFormClose = () => {
    setIsUserDialogOpen(false);
    loadUsers();
  };

  const handlePermissionsFormClose = () => {
    setIsPermissionDialogOpen(false);
    loadUsers();
    refreshUser(); // Refresh current user in case their permissions changed
  };

  // Check if current user is admin
  if (currentUser?.role !== 'admin') {
    return (
      <Card>
        <CardHeader>
          <CardTitle>ניהול משתמשים</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Shield className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">גישה מוגבלת</h3>
            <p className="text-muted-foreground max-w-md">
              רק מנהלי מערכת יכולים לצפות בעמוד זה ולנהל משתמשים.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>ניהול משתמשים</CardTitle>
        <Button onClick={handleAddUser} className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" />
          משתמש חדש
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">שם משתמש</TableHead>
              <TableHead className="text-right">אימייל</TableHead>
              <TableHead className="text-right">תפקיד</TableHead>
              <TableHead className="text-right">נוצר בתאריך</TableHead>
              <TableHead className="text-right">התחברות אחרונה</TableHead>
              <TableHead className="text-right">סטטוס</TableHead>
              <TableHead className="text-right">פעולות</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map(user => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {user.role === 'admin' ? 'מנהל מערכת' :
                   user.role === 'analyst' ? 'אנליסט' :
                   user.role === 'trader' ? 'סוחר' : 'צופה'}
                </TableCell>
                <TableCell>{formatDate(user.createdAt)}</TableCell>
                <TableCell>{user.lastLogin ? formatDate(user.lastLogin) : 'לא התחבר'}</TableCell>
                <TableCell>
                  {user.isActive ? 
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      פעיל
                    </span> : 
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      לא פעיל
                    </span>
                  }
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleEditUser(user)}
                      className="h-8 w-8 p-0"
                    >
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">ערוך</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleEditPermissions(user)}
                      className="h-8 w-8 p-0"
                    >
                      <Shield className="h-4 w-4" />
                      <span className="sr-only">הרשאות</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleDeleteUser(user.id)}
                      className="h-8 w-8 p-0"
                      disabled={user.id === currentUser?.id}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">מחק</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {users.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  לא נמצאו משתמשים
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>

      {/* User add/edit dialog */}
      <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-right">
              {selectedUser ? 'עריכת משתמש' : 'הוספת משתמש חדש'}
            </DialogTitle>
            <DialogDescription className="text-right">
              {selectedUser 
                ? 'ערוך את פרטי המשתמש הקיים' 
                : 'מלא את הפרטים ליצירת משתמש חדש במערכת'}
            </DialogDescription>
          </DialogHeader>
          <UserForm 
            user={selectedUser} 
            onClose={handleUserFormClose} 
          />
        </DialogContent>
      </Dialog>

      {/* Permissions dialog */}
      <Dialog open={isPermissionDialogOpen} onOpenChange={setIsPermissionDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-right">
              ניהול הרשאות משתמש
            </DialogTitle>
            <DialogDescription className="text-right">
              {selectedUser && `הגדר הרשאות עבור ${selectedUser.username}`}
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <UserPermissionsForm 
              user={selectedUser} 
              onClose={handlePermissionsFormClose} 
            />
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default UserManagement;
