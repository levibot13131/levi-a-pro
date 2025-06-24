
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, UserPlus, Settings, Activity, Trash2 } from 'lucide-react';
import { useUserManagement } from '@/hooks/useUserManagement';
import { toast } from 'sonner';

export const UserManagementPanel: React.FC = () => {
  const { users, loading, addUser, updateUser, deleteUser } = useUserManagement();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUser, setNewUser] = useState({
    telegram_id: '',
    telegram_username: '',
    access_level: 'filtered' as const,
    allowed_assets: [] as string[]
  });

  const handleAddUser = async () => {
    if (!newUser.telegram_id || !newUser.telegram_username) {
      toast.error('Telegram ID ו-Username הם שדות חובה');
      return;
    }

    try {
      await addUser(newUser);
      setNewUser({
        telegram_id: '',
        telegram_username: '',
        access_level: 'filtered',
        allowed_assets: []
      });
      setShowAddForm(false);
    } catch (error) {
      // Error already handled in hook
    }
  };

  const handleUpdateAccess = async (userId: string, field: string, value: any) => {
    try {
      await updateUser(userId, { [field]: value });
    } catch (error) {
      // Error already handled in hook
    }
  };

  const handleDeleteUser = async (userId: string, username: string) => {
    if (window.confirm(`האם אתה בטוח שברצונך למחוק את המשתמש ${username}?`)) {
      try {
        await deleteUser(userId);
      } catch (error) {
        // Error already handled in hook
      }
    }
  };

  const getAccessLevelColor = (level: string) => {
    switch (level) {
      case 'all': return 'bg-green-100 text-green-800';
      case 'elite': return 'bg-purple-100 text-purple-800';
      case 'filtered': return 'bg-blue-100 text-blue-800';
      case 'specific': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAccessLevelText = (level: string) => {
    switch (level) {
      case 'all': return 'כל האיתותים';
      case 'elite': return 'רק איתותים עליונים';
      case 'filtered': return 'איתותים מסוננים';
      case 'specific': return 'נכסים ספציפיים';
      default: return level;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>טוען נתוני משתמשים...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              ניהול משתמשים וגישה
            </span>
            <Button onClick={() => setShowAddForm(!showAddForm)}>
              <UserPlus className="h-4 w-4 mr-2" />
              הוסף משתמש
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded">
              <div className="text-2xl font-bold text-blue-600">{users.length}</div>
              <div className="text-sm text-muted-foreground">סה"כ משתמשים</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded">
              <div className="text-2xl font-bold text-green-600">
                {users.filter(u => u.is_active).length}
              </div>
              <div className="text-sm text-muted-foreground">משתמשים פעילים</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded">
              <div className="text-2xl font-bold text-purple-600">
                {users.filter(u => u.access_level === 'elite').length}
              </div>
              <div className="text-sm text-muted-foreground">משתמשי עלית</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded">
              <div className="text-2xl font-bold text-orange-600">
                {users.reduce((sum, u) => sum + u.signals_received, 0)}
              </div>
              <div className="text-sm text-muted-foreground">איתותים נשלחו</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add User Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>הוסף משתמש חדש</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="telegram_id">Telegram ID</Label>
                <Input
                  id="telegram_id"
                  value={newUser.telegram_id}
                  onChange={(e) => setNewUser(prev => ({ ...prev, telegram_id: e.target.value }))}
                  placeholder="123456789"
                />
              </div>
              <div>
                <Label htmlFor="telegram_username">Telegram Username</Label>
                <Input
                  id="telegram_username"
                  value={newUser.telegram_username}
                  onChange={(e) => setNewUser(prev => ({ ...prev, telegram_username: e.target.value }))}
                  placeholder="@username"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="access_level">רמת גישה</Label>
              <Select value={newUser.access_level} onValueChange={(value: any) => setNewUser(prev => ({ ...prev, access_level: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">כל האיתותים</SelectItem>
                  <SelectItem value="elite">רק איתותים עליונים (90%+)</SelectItem>
                  <SelectItem value="filtered">איתותים מסוננים (70%+)</SelectItem>
                  <SelectItem value="specific">נכסים ספציפיים</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddUser}>הוסף משתמש</Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>ביטול</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle>רשימת משתמשים</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.map((user) => (
              <div key={user.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div>
                      <h4 className="font-semibold">{user.telegram_username}</h4>
                      <p className="text-sm text-muted-foreground">
                        ID: {user.telegram_id} | איתותים: {user.signals_received}
                      </p>
                    </div>
                    <Badge className={getAccessLevelColor(user.access_level)}>
                      {getAccessLevelText(user.access_level)}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={user.is_active}
                      onCheckedChange={(checked) => handleUpdateAccess(user.id, 'is_active', checked)}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteUser(user.id, user.telegram_username || 'Unknown')}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                  <div>
                    <span className="text-muted-foreground">רמת גישה:</span>
                    <div>{getAccessLevelText(user.access_level)}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">איתותים:</span>
                    <div className="font-semibold">{user.signals_received}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">איתות אחרון:</span>
                    <div>{user.last_signal_at ? new Date(user.last_signal_at).toLocaleDateString('he-IL') : 'אף פעם'}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">סטטוס:</span>
                    <div>
                      <Badge variant={user.is_active ? "default" : "secondary"}>
                        {user.is_active ? 'פעיל' : 'לא פעיל'}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Select 
                    value={user.access_level} 
                    onValueChange={(value: any) => handleUpdateAccess(user.id, 'access_level', value)}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">כל האיתותים</SelectItem>
                      <SelectItem value="elite">רק איתותים עליונים</SelectItem>
                      <SelectItem value="filtered">איתותים מסוננים</SelectItem>
                      <SelectItem value="specific">נכסים ספציפיים</SelectItem>
                    </SelectContent>
                  </Select>

                  {user.access_level === 'specific' && (
                    <Input
                      placeholder="BTC,ETH,SOL (מופרד בפסיקים)"
                      className="flex-1"
                      defaultValue={user.allowed_assets.join(',')}
                      onBlur={(e) => {
                        const assets = e.target.value.split(',').map(s => s.trim()).filter(s => s);
                        handleUpdateAccess(user.id, 'allowed_assets', assets);
                      }}
                    />
                  )}
                </div>
              </div>
            ))}

            {users.length === 0 && (
              <div className="text-center py-8">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground">אין משתמשים במערכת</p>
                <p className="text-sm text-muted-foreground">הוסף משתמש ראשון כדי להתחיל</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
