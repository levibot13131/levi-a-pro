
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { 
  Users, Settings, BarChart3, MessageSquare, 
  Plus, Trash2, Edit, CheckCircle, XCircle, TrendingUp
} from 'lucide-react';
import { adaptiveEngine } from '@/services/trading/adaptiveEngine';
import { eliteSignalFilter } from '@/services/trading/eliteSignalFilter';

interface TelegramUser {
  chat_id: string;
  username: string;
  type: 'group' | 'private';
  enabled: boolean;
  label: string;
  added_date: string;
}

const AdminDashboard: React.FC = () => {
  const [telegramUsers, setTelegramUsers] = useState<TelegramUser[]>([]);
  const [newUser, setNewUser] = useState({
    chat_id: '',
    username: '',
    type: 'private' as 'group' | 'private',
    label: ''
  });
  const [signalSettings, setSignalSettings] = useState({
    minConfidence: 80,
    minRiskReward: 2.0,
    broadcastMode: 'both' as 'group' | 'private' | 'both',
    previewMode: false
  });
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      // Load Telegram users (in production, this would come from database)
      const mockUsers: TelegramUser[] = [
        {
          chat_id: '809305569',
          username: 'Almog (Private)',
          type: 'private',
          enabled: true,
          label: 'Admin',
          added_date: new Date().toISOString()
        },
        {
          chat_id: '-1001234567890',
          username: 'LeviPro Signals Group',
          type: 'group',
          enabled: true,
          label: 'Main Group',
          added_date: new Date().toISOString()
        }
      ];
      setTelegramUsers(mockUsers);

      // Load adaptive learning stats
      const learningStats = await adaptiveEngine.getAdaptiveLearningStats();
      const filterStats = eliteSignalFilter.getEliteStats();
      
      setStats({
        learning: learningStats,
        filter: filterStats
      });

    } catch (error) {
      console.error('Error loading admin data:', error);
      toast.error('שגיאה בטעינת נתוני המנהל');
    }
  };

  const handleAddUser = () => {
    if (!newUser.chat_id || !newUser.username) {
      toast.error('נא למלא את כל השדות הנדרשים');
      return;
    }

    const user: TelegramUser = {
      ...newUser,
      enabled: true,
      added_date: new Date().toISOString()
    };

    setTelegramUsers([...telegramUsers, user]);
    setNewUser({ chat_id: '', username: '', type: 'private', label: '' });
    toast.success(`משתמש ${user.username} נוסף בהצלחה`);
  };

  const handleRemoveUser = (chatId: string) => {
    setTelegramUsers(telegramUsers.filter(user => user.chat_id !== chatId));
    toast.info('משתמש הוסר בהצלחה');
  };

  const handleToggleUser = (chatId: string) => {
    setTelegramUsers(telegramUsers.map(user => 
      user.chat_id === chatId 
        ? { ...user, enabled: !user.enabled }
        : user
    ));
    toast.success('סטטוס משתמש עודכן');
  };

  const handleUpdateSettings = () => {
    // In production, this would update the signal engine settings
    toast.success('הגדרות איתותים עודכנו בהצלחה');
  };

  return (
    <div className="container mx-auto py-6 px-4 space-y-6">
      <div className="text-right">
        <h1 className="text-3xl font-bold flex items-center justify-end gap-2">
          <Settings className="h-8 w-8" />
          לוח בקרה מנהל
        </h1>
        <p className="text-muted-foreground">
          ניהול משתמשים, הגדרות איתותים וסטטיסטיקות מערכת
        </p>
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="users">ניהול משתמשים</TabsTrigger>
          <TabsTrigger value="signals">הגדרות איתותים</TabsTrigger>
          <TabsTrigger value="stats">סטטיסטיקות</TabsTrigger>
          <TabsTrigger value="performance">ביצועים</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-6">
          {/* Add New User */}
          <Card>
            <CardHeader>
              <CardTitle className="text-right flex items-center gap-2">
                <Plus className="h-5 w-5" />
                הוסף משתמש חדש
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Chat ID</Label>
                  <Input
                    placeholder="809305569"
                    value={newUser.chat_id}
                    onChange={(e) => setNewUser({...newUser, chat_id: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>שם משתמש</Label>
                  <Input
                    placeholder="Almog"
                    value={newUser.username}
                    onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>סוג</Label>
                  <Select
                    value={newUser.type}
                    onValueChange={(value: 'group' | 'private') => 
                      setNewUser({...newUser, type: value})
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="private">פרטי</SelectItem>
                      <SelectItem value="group">קבוצה</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>תווית</Label>
                  <Input
                    placeholder="Admin"
                    value={newUser.label}
                    onChange={(e) => setNewUser({...newUser, label: e.target.value})}
                  />
                </div>
              </div>
              <Button onClick={handleAddUser} className="mt-4 w-full">
                הוסף משתמש
              </Button>
            </CardContent>
          </Card>

          {/* Users List */}
          <Card>
            <CardHeader>
              <CardTitle className="text-right flex items-center gap-2">
                <Users className="h-5 w-5" />
                רשימת משתמשים ({telegramUsers.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {telegramUsers.map((user) => (
                  <div key={user.chat_id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleRemoveUser(user.chat_id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      
                      <Switch
                        checked={user.enabled}
                        onCheckedChange={() => handleToggleUser(user.chat_id)}
                      />
                      
                      {user.enabled ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                    </div>
                    
                    <div className="text-right">
                      <div className="font-medium">{user.username}</div>
                      <div className="text-sm text-muted-foreground">
                        {user.chat_id} • {user.type === 'group' ? 'קבוצה' : 'פרטי'}
                      </div>
                      <div className="flex gap-2 mt-1">
                        <Badge variant="outline">{user.label}</Badge>
                        <Badge variant={user.enabled ? "default" : "secondary"}>
                          {user.enabled ? 'פעיל' : 'לא פעיל'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="signals" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-right">הגדרות איתותים</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>רמת ביטחון מינימלית (%)</Label>
                    <Input
                      type="number"
                      value={signalSettings.minConfidence}
                      onChange={(e) => setSignalSettings({
                        ...signalSettings,
                        minConfidence: parseInt(e.target.value)
                      })}
                      min="50"
                      max="95"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>יחס R/R מינימלי</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={signalSettings.minRiskReward}
                      onChange={(e) => setSignalSettings({
                        ...signalSettings,
                        minRiskReward: parseFloat(e.target.value)
                      })}
                      min="1.5"
                      max="5.0"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>מצב שידור</Label>
                    <Select
                      value={signalSettings.broadcastMode}
                      onValueChange={(value: 'group' | 'private' | 'both') =>
                        setSignalSettings({...signalSettings, broadcastMode: value})
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="both">קבוצות + פרטי</SelectItem>
                        <SelectItem value="group">קבוצות בלבד</SelectItem>
                        <SelectItem value="private">פרטי בלבד</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <Switch
                      checked={signalSettings.previewMode}
                      onCheckedChange={(checked) =>
                        setSignalSettings({...signalSettings, previewMode: checked})
                      }
                    />
                    <Label>מצב תצוגה מקדימה</Label>
                  </div>
                </div>
              </div>

              <Button onClick={handleUpdateSettings} className="w-full">
                עדכן הגדרות
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats" className="space-y-6">
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-4 flex items-center space-x-2">
                  <BarChart3 className="h-8 w-8 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium">איתותים היום</p>
                    <p className="text-2xl font-bold">{stats.filter?.qualitySignalsSent || 0}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 flex items-center space-x-2">
                  <CheckCircle className="h-8 w-8 text-green-500" />
                  <div>
                    <p className="text-sm font-medium">אחוז הצלחה</p>
                    <p className="text-2xl font-bold">{(stats.learning?.overallWinRate * 100 || 0).toFixed(1)}%</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 flex items-center space-x-2">
                  <TrendingUp className="h-8 w-8 text-orange-500" />
                  <div>
                    <p className="text-sm font-medium">R/R ממוצע</p>
                    <p className="text-2xl font-bold">1:{stats.learning?.avgRiskReward?.toFixed(1) || '0.0'}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 flex items-center space-x-2">
                  <Users className="h-8 w-8 text-purple-500" />
                  <div>
                    <p className="text-sm font-medium">משתמשים פעילים</p>
                    <p className="text-2xl font-bold">{telegramUsers.filter(u => u.enabled).length}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-right">איכות איתותים</CardTitle>
            </CardHeader>
            <CardContent>
              {stats?.filter && (
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>{stats.filter.processedSignalsToday}</span>
                    <span>איתותים נותחו היום:</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-600">{stats.filter.qualitySignalsSent}</span>
                    <span>איתותים איכותיים נשלחו:</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-red-600">{stats.filter.rejectedSignalsToday}</span>
                    <span>איתותים נדחו:</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold">{stats.filter.signalSuccessRate}</span>
                    <span>שיעור הצלחת סינון:</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          {stats?.learning && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-right">ביצועי אסטרטגיות</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                      <Badge className="bg-green-100 text-green-800">הטובה ביותר</Badge>
                      <span className="font-medium">{stats.learning.bestStrategy}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-red-50 rounded">
                      <Badge className="bg-red-100 text-red-800">הגרועה ביותר</Badge>
                      <span className="font-medium">{stats.learning.worstStrategy}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-right">מגמת שיפור</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-4xl font-bold mb-2">
                      {stats.learning.improvementTrend === 'improving' ? '📈' : 
                       stats.learning.improvementTrend === 'declining' ? '📉' : '➡️'}
                    </div>
                    <div className="text-lg font-medium">
                      {stats.learning.improvementTrend === 'improving' ? 'משתפר' : 
                       stats.learning.improvementTrend === 'declining' ? 'יורד' : 'יציב'}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
