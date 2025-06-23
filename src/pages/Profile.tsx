
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User, Mail, Calendar, Settings, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import Navbar from '@/components/layout/Navbar';

const Profile: React.FC = () => {
  const { user, signOut, isAdmin } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success('התנתקת בהצלחה');
    } catch (error) {
      toast.error('שגיאה בהתנתקות');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Profile Header */}
        <Card className="border-2 border-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-6 w-6 text-blue-500" />
              פרופיל משתמש
              {isAdmin && (
                <Badge variant="default" className="bg-red-600">
                  מנהל
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-gray-500" />
                  <div>
                    <div className="font-semibold">אימייל</div>
                    <div className="text-muted-foreground">{user?.email || 'לא זמין'}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-gray-500" />
                  <div>
                    <div className="font-semibold">תאריך הצטרפות</div>
                    <div className="text-muted-foreground">
                      {user?.created_at ? new Date(user.created_at).toLocaleDateString('he-IL') : 'לא זמין'}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Settings className="h-5 w-5 text-gray-500" />
                  <div>
                    <div className="font-semibold">סטטוס חשבון</div>
                    <Badge variant="outline" className="text-green-600">
                      פעיל
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold mb-2">גישה למערכת</h4>
                  <div className="space-y-2 text-sm">
                    <div>✅ מנוע מסחר AI</div>
                    <div>✅ איתותים בזמן אמת</div>
                    <div>✅ ניתוח טכני מתקדם</div>
                    <div>✅ יומן מסחר</div>
                    {isAdmin && <div>✅ פאנל ניהול</div>}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <Card>
          <CardHeader>
            <CardTitle>פעולות</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                הגדרות חשבון
              </Button>
              
              <Button 
                variant="destructive" 
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                התנתק
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <Card>
          <CardHeader>
            <CardTitle>סטטיסטיקות</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-green-50 rounded">
                <div className="text-2xl font-bold text-green-600">0</div>
                <div className="text-sm text-muted-foreground">איתותים מוצלחים</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded">
                <div className="text-2xl font-bold text-blue-600">0</div>
                <div className="text-sm text-muted-foreground">ניתוחים</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded">
                <div className="text-2xl font-bold text-purple-600">0%</div>
                <div className="text-sm text-muted-foreground">דיוק</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded">
                <div className="text-2xl font-bold text-orange-600">0</div>
                <div className="text-sm text-muted-foreground">ימי פעילות</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
