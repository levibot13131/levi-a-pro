
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Plus, Trash2, Save } from 'lucide-react';
import { 
  getAlertDestinations, 
  addAlertDestination, 
  updateAlertDestination, 
  removeAlertDestination, 
  toggleAlertDestination 
} from '@/services/tradingView/alerts/destinations';
import { toast } from 'sonner';
import { AlertDestination } from '@/services/tradingView/alerts/types';

const AlertDestinationsManager: React.FC = () => {
  const [destinations, setDestinations] = useState<AlertDestination[]>([]);
  const [newDestName, setNewDestName] = useState('');
  const [newDestUrl, setNewDestUrl] = useState('');
  
  // טעינת יעדים קיימים
  useEffect(() => {
    const loadDestinations = () => {
      const currentDestinations = getAlertDestinations();
      setDestinations(currentDestinations);
    };
    
    loadDestinations();
    
    // רענון כל 5 שניות למקרה שיש שינויים מרכיבים אחרים
    const interval = setInterval(loadDestinations, 5000);
    return () => clearInterval(interval);
  }, []);
  
  // הוספת יעד חדש
  const handleAddDestination = () => {
    if (!newDestName.trim() || !newDestUrl.trim()) {
      toast.error('שדות חובה', {
        description: 'אנא הזן שם ו-URL ליעד ההתראות'
      });
      return;
    }
    
    try {
      // בדיקה בסיסית של תקינות ה-URL
      new URL(newDestUrl);
      
      addAlertDestination({
        name: newDestName,
        type: 'webhook' as const,
        endpoint: newDestUrl,
        active: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      // איפוס השדות
      setNewDestName('');
      setNewDestUrl('');
      
      // רענון הרשימה
      setDestinations(getAlertDestinations());
    } catch (error) {
      toast.error('URL לא תקין', {
        description: 'אנא הזן כתובת URL תקינה'
      });
    }
  };
  
  // הסרת יעד
  const handleRemoveDestination = (id: string) => {
    removeAlertDestination(id);
    setDestinations(getAlertDestinations());
  };
  
  // הפעלה/כיבוי של יעד
  const handleToggleDestination = (id: string, active: boolean) => {
    toggleAlertDestination(id, active);
    setDestinations(getAlertDestinations());
  };
  
  // עדכון יעד קיים
  const handleUpdateDestination = (id: string, updates: Partial<AlertDestination>) => {
    updateAlertDestination(id, updates);
    setDestinations(getAlertDestinations());
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-right">יעדי התראות</CardTitle>
        <CardDescription className="text-right">
          הגדר לאן יישלחו ההתראות כאשר המערכת מזהה איתותי מסחר
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* רשימת יעדים קיימים */}
        {destinations.length > 0 ? (
          <div className="space-y-4 mb-6">
            {destinations.map(dest => (
              <div key={dest.id} className="flex flex-col space-y-2 p-3 border rounded-md">
                <div className="flex justify-between items-center">
                  <Switch 
                    checked={dest.active}
                    onCheckedChange={(checked) => handleToggleDestination(dest.id, checked)}
                  />
                  <div className="font-medium">{dest.name}</div>
                </div>
                
                <Input 
                  value={dest.endpoint}
                  onChange={(e) => handleUpdateDestination(dest.id, { endpoint: e.target.value })}
                  className="text-left dir-ltr text-xs"
                />
                
                <div className="flex justify-between items-center">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemoveDestination(dest.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" /> הסר
                  </Button>
                  
                  <div className="text-xs text-muted-foreground">
                    {dest.active ? 'פעיל' : 'לא פעיל'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 mb-6">
            <p className="text-muted-foreground">לא הוגדרו יעדים להתראות</p>
          </div>
        )}
        
        {/* טופס הוספת יעד חדש */}
        <div className="space-y-4 border-t pt-4">
          <h3 className="text-sm font-medium text-right">הוסף יעד חדש</h3>
          
          <div className="grid gap-2">
            <Label htmlFor="destName" className="text-right">שם היעד</Label>
            <Input
              id="destName"
              value={newDestName}
              onChange={(e) => setNewDestName(e.target.value)}
              placeholder="למשל: Webhook שלי"
              className="text-right"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="destUrl" className="text-right">כתובת Webhook</Label>
            <Input
              id="destUrl"
              value={newDestUrl}
              onChange={(e) => setNewDestUrl(e.target.value)}
              placeholder="https://your-webhook-url.com"
              className="text-left dir-ltr"
            />
          </div>
          
          <Button 
            onClick={handleAddDestination}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" /> הוסף יעד
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AlertDestinationsManager;
