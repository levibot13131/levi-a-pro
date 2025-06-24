
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Shield, Users, Activity, TrendingUp, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AccessStats {
  totalUsers: number;
  activeUsers: number;
  eliteUsers: number;
  totalSignalsDelivered: number;
  avgEngagementRate: number;
  topAssets: string[];
}

export const AccessControlManager: React.FC = () => {
  const [stats, setStats] = useState<AccessStats>({
    totalUsers: 0,
    activeUsers: 0,
    eliteUsers: 0,
    totalSignalsDelivered: 0,
    avgEngagementRate: 0,
    topAssets: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAccessStats();
  }, []);

  const loadAccessStats = async () => {
    try {
      const { data: users, error } = await supabase
        .from('user_access_control')
        .select('*');

      if (error) throw error;

      if (users) {
        const totalUsers = users.length;
        const activeUsers = users.filter(u => u.is_active).length;
        const eliteUsers = users.filter(u => u.access_level === 'elite').length;
        const totalSignalsDelivered = users.reduce((sum, u) => sum + u.signals_received, 0);
        
        // Calculate engagement rate (signals received vs expected)
        const avgEngagementRate = activeUsers > 0 ? (totalSignalsDelivered / activeUsers) * 10 : 0;
        
        // Get top assets from specific users
        const topAssets = users
          .filter(u => u.access_level === 'specific' && u.allowed_assets.length > 0)
          .flatMap(u => u.allowed_assets)
          .reduce((acc: { [key: string]: number }, asset) => {
            acc[asset] = (acc[asset] || 0) + 1;
            return acc;
          }, {});

        const sortedAssets = Object.entries(topAssets)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 5)
          .map(([asset]) => asset);

        setStats({
          totalUsers,
          activeUsers,
          eliteUsers,
          totalSignalsDelivered,
          avgEngagementRate: Math.min(avgEngagementRate, 100),
          topAssets: sortedAssets
        });
      }
    } catch (error) {
      console.error('Error loading access stats:', error);
      toast.error('שגיאה בטעינת סטטיסטיקות');
    } finally {
      setLoading(false);
    }
  };

  const testSignalDelivery = async () => {
    try {
      const { data: activeUsers, error } = await supabase
        .from('user_access_control')
        .select('telegram_id, telegram_username, access_level')
        .eq('is_active', true);

      if (error) throw error;

      toast.success(`איתות בדיקה נשלח ל-${activeUsers?.length || 0} משתמשים פעילים`);
      
      // Here you would integrate with your actual Telegram sending logic
      console.log('Test signal would be sent to:', activeUsers);
      
    } catch (error) {
      console.error('Error testing signal delivery:', error);
      toast.error('שגיאה בשליחת איתות בדיקה');
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>טוען נתוני בקרת גישה...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Access Control Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            בקרת גישה ופעילות משתמשים
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded">
              <Users className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <div className="text-2xl font-bold text-blue-600">{stats.totalUsers}</div>
              <div className="text-sm text-muted-foreground">סה"כ משתמשים</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded">
              <Activity className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <div className="text-2xl font-bold text-green-600">{stats.activeUsers}</div>
              <div className="text-sm text-muted-foreground">משתמשים פעילים</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded">
              <TrendingUp className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              <div className="text-2xl font-bold text-purple-600">{stats.eliteUsers}</div>
              <div className="text-sm text-muted-foreground">משתמשי עלית</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded">
              <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-orange-600" />
              <div className="text-2xl font-bold text-orange-600">{stats.totalSignalsDelivered}</div>
              <div className="text-sm text-muted-foreground">איתותים נשלחו</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Engagement Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>מדדי מעורבות</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">שיעור מעורבות כללי</span>
              <span className="text-sm text-muted-foreground">{stats.avgEngagementRate.toFixed(1)}%</span>
            </div>
            <Progress value={stats.avgEngagementRate} className="h-2" />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">משתמשים פעילים</span>
              <span className="text-sm text-muted-foreground">
                {stats.activeUsers}/{stats.totalUsers} ({stats.totalUsers > 0 ? ((stats.activeUsers / stats.totalUsers) * 100).toFixed(1) : 0}%)
              </span>
            </div>
            <Progress value={stats.totalUsers > 0 ? (stats.activeUsers / stats.totalUsers) * 100 : 0} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Access Level Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>התפלגות רמות גישה</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-green-50 rounded">
              <span className="font-medium">כל האיתותים</span>
              <Badge className="bg-green-100 text-green-800">
                {stats.totalUsers > 0 ? Math.round((stats.totalUsers - stats.eliteUsers) / stats.totalUsers * 100) : 0}%
              </Badge>
            </div>
            <div className="flex justify-between items-center p-3 bg-purple-50 rounded">
              <span className="font-medium">משתמשי עלית</span>
              <Badge className="bg-purple-100 text-purple-800">
                {stats.eliteUsers} משתמשים
              </Badge>
            </div>
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
              <span className="font-medium">איתותים מסוננים</span>
              <Badge className="bg-blue-100 text-blue-800">
                רוב המשתמשים
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Assets */}
      {stats.topAssets.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>נכסים פופולריים</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {stats.topAssets.map((asset, index) => (
                <Badge key={asset} variant="outline" className="text-sm">
                  #{index + 1} {asset}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>פעולות מהירות</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button onClick={testSignalDelivery}>
              שלח איתות בדיקה
            </Button>
            <Button variant="outline" onClick={loadAccessStats}>
              רענן נתונים
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
