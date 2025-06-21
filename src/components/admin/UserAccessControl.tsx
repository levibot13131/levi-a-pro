
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, UserPlus, Shield, Settings, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

interface TelegramUser {
  id: string;
  telegramId: string;
  username: string;
  firstName: string;
  accessLevel: 'all' | 'elite' | 'filtered' | 'specific';
  allowedAssets: string[];
  isActive: boolean;
  joinedAt: Date;
  lastSeen: Date;
  signalsReceived: number;
  interactionRate: number;
}

export const UserAccessControl: React.FC = () => {
  const [users, setUsers] = useState<TelegramUser[]>([
    {
      id: '1',
      telegramId: '809305569',
      username: 'almogahronov',
      firstName: 'Almog',
      accessLevel: 'all',
      allowedAssets: [],
      isActive: true,
      joinedAt: new Date('2024-01-15'),
      lastSeen: new Date(),
      signalsReceived: 127,
      interactionRate: 85.2
    },
    {
      id: '2',
      telegramId: '123456789',
      username: 'trader_vip',
      firstName: 'VIP User',
      accessLevel: 'elite',
      allowedAssets: [],
      isActive: true,
      joinedAt: new Date('2024-03-20'),
      lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000),
      signalsReceived: 45,
      interactionRate: 92.1
    }
  ]);

  const [newUser, setNewUser] = useState({
    telegramId: '',
    username: '',
    firstName: '',
    accessLevel: 'filtered' as const
  });

  const [groupMode, setGroupMode] = useState(false);

  const addUser = () => {
    if (!newUser.telegramId || !newUser.username) {
      toast.error('Telegram ID and username are required');
      return;
    }

    const user: TelegramUser = {
      id: Date.now().toString(),
      telegramId: newUser.telegramId,
      username: newUser.username,
      firstName: newUser.firstName || newUser.username,
      accessLevel: newUser.accessLevel,
      allowedAssets: [],
      isActive: true,
      joinedAt: new Date(),
      lastSeen: new Date(),
      signalsReceived: 0,
      interactionRate: 0
    };

    setUsers([...users, user]);
    setNewUser({
      telegramId: '',
      username: '',
      firstName: '',
      accessLevel: 'filtered'
    });

    toast.success(`User ${user.username} added successfully`);
  };

  const updateUserAccess = (userId: string, field: keyof TelegramUser, value: any) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, [field]: value } : user
    ));
    toast.success('User access updated');
  };

  const removeUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    setUsers(users.filter(u => u.id !== userId));
    toast.success(`User ${user?.username} removed`);
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

  const getAccessLevelDescription = (level: string) => {
    switch (level) {
      case 'all': return 'All signals (no filtering)';
      case 'elite': return 'Only 90%+ confidence signals';
      case 'filtered': return 'Quality filtered signals (70%+)';
      case 'specific': return 'Specific assets only';
      default: return 'Unknown access level';
    }
  };

  return (
    <div className="space-y-6">
      {/* Group Mode Toggle */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Delivery Mode Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold">Group vs Individual Delivery</h4>
              <p className="text-sm text-muted-foreground">
                {groupMode 
                  ? 'Signals are sent to all users in group chat mode' 
                  : 'Signals are sent individually to each user based on their access level'
                }
              </p>
            </div>
            <Switch
              checked={groupMode}
              onCheckedChange={setGroupMode}
            />
          </div>
        </CardContent>
      </Card>

      {/* Add New User */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Add New Telegram User
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="telegramId">Telegram ID</Label>
              <Input
                id="telegramId"
                value={newUser.telegramId}
                onChange={(e) => setNewUser({...newUser, telegramId: e.target.value})}
                placeholder="123456789"
              />
            </div>
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={newUser.username}
                onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                placeholder="@username"
              />
            </div>
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={newUser.firstName}
                onChange={(e) => setNewUser({...newUser, firstName: e.target.value})}
                placeholder="Optional"
              />
            </div>
            <div>
              <Label htmlFor="accessLevel">Access Level</Label>
              <Select value={newUser.accessLevel} onValueChange={(value: any) => setNewUser({...newUser, accessLevel: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Signals</SelectItem>
                  <SelectItem value="elite">Elite Only</SelectItem>
                  <SelectItem value="filtered">Filtered</SelectItem>
                  <SelectItem value="specific">Specific Assets</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={addUser}>
            <UserPlus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </CardContent>
      </Card>

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Telegram Users ({users.length})
            </span>
            <Badge variant="outline">{users.filter(u => u.isActive).length} Active</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.map((user) => (
              <div key={user.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div>
                      <h4 className="font-semibold">{user.firstName}</h4>
                      <p className="text-sm text-muted-foreground">@{user.username} • ID: {user.telegramId}</p>
                    </div>
                    <Badge className={getAccessLevelColor(user.accessLevel)}>
                      {user.accessLevel.toUpperCase()}
                    </Badge>
                    <Switch
                      checked={user.isActive}
                      onCheckedChange={(checked) => updateUserAccess(user.id, 'isActive', checked)}
                    />
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => removeUser(user.id)}
                  >
                    Remove
                  </Button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Access:</span>
                    <div>{getAccessLevelDescription(user.accessLevel)}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Signals:</span>
                    <div className="font-semibold">{user.signalsReceived}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Interaction:</span>
                    <div className="font-semibold">{user.interactionRate}%</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Last Seen:</span>
                    <div>{user.lastSeen.toLocaleTimeString()}</div>
                  </div>
                </div>

                <div className="mt-3 flex gap-2">
                  <Select value={user.accessLevel} onValueChange={(value: any) => updateUserAccess(user.id, 'accessLevel', value)}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Signals</SelectItem>
                      <SelectItem value="elite">Elite Only (90%+)</SelectItem>
                      <SelectItem value="filtered">Filtered (70%+)</SelectItem>
                      <SelectItem value="specific">Specific Assets</SelectItem>
                    </SelectContent>
                  </Select>

                  {user.accessLevel === 'specific' && (
                    <Input
                      placeholder="BTC,ETH,SOL (comma separated)"
                      className="flex-1"
                      onChange={(e) => updateUserAccess(user.id, 'allowedAssets', e.target.value.split(',').map(s => s.trim()))}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* User Activity Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded">
              <div className="text-2xl font-bold text-blue-600">{users.length}</div>
              <div className="text-sm text-muted-foreground">Total Users</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded">
              <div className="text-2xl font-bold text-green-600">{users.filter(u => u.isActive).length}</div>
              <div className="text-sm text-muted-foreground">Active Users</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded">
              <div className="text-2xl font-bold text-purple-600">
                {Math.round(users.reduce((acc, u) => acc + u.interactionRate, 0) / users.length)}%
              </div>
              <div className="text-sm text-muted-foreground">Avg Interaction</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded">
              <div className="text-2xl font-bold text-orange-600">
                {users.reduce((acc, u) => acc + u.signalsReceived, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Total Signals Sent</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
