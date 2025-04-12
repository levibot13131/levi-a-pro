import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Send, BellRing, Globe, Trash2 } from 'lucide-react';
import {
  getAlertDestinations,
  addAlertDestination,
  updateAlertDestination,
  deleteAlertDestination
} from '@/services/tradingView/tradingViewAlertService';
import { AlertDestination } from '@/services/tradingView/alerts/types';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { v4 as uuidv4 } from 'uuid';

const AlertDestinationsManager = () => {
  const [destinations, setDestinations] = useState<AlertDestination[]>(getAlertDestinations);
  const [newEndpoint, setNewEndpoint] = useState('');
  const [newName, setNewName] = useState('');
  
  const handleAddWebhook = () => {
    if (!newEndpoint || !newName) {
      toast.error('יש למלא את כל השדות');
      return;
    }
    
    if (!newEndpoint.startsWith('http')) {
      toast.error('כתובת לא חוקית, יש להתחיל עם http:// או https://');
      return;
    }
    
    try {
      const destination = addAlertDestination({
        id: uuidv4(),
        name: newName,
        type: 'webhook',
        endpoint: newEndpoint,
        active: true,
        headers: { 'Content-Type': 'application/json' },
        config: { method: 'POST', format: 'json' }
      });
      
      setDestinations(getAlertDestinations());
      setNewEndpoint('');
      setNewName('');
      
      toast.success('נוסף Webhook חדש');
    } catch (error) {
      toast.error('שגיאה בהוספת Webhook');
    }
  };
  
  const handleToggleStatus = (id: string, newStatus: boolean) => {
    try {
      updateAlertDestination(id, { active: newStatus });
      setDestinations(getAlertDestinations());
      
      toast.success(
        newStatus ? 'היעד הופעל בהצלחה' : 'היעד הושבת בהצלחה'
      );
    } catch (error) {
      toast.error('שגיאה בעדכון יעד');
    }
  };
  
  const handleDeleteDestination = (id: string) => {
    try {
      deleteAlertDestination(id);
      setDestinations(getAlertDestinations());
      
      toast.success('היעד נמחק בהצלחה');
    } catch (error) {
      toast.error('שגיאה במחיקת יעד');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-right">הגדרת יעדים להתראות</CardTitle>
        <CardDescription className="text-right">
          הגדר לאן יישלחו ההתראות כאשר מתקבל איתות
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid gap-4">
            {destinations.map((destination) => (
              <div 
                key={destination.id} 
                className="flex items-center justify-between p-3 border rounded-md"
              >
                <div className="flex space-x-2 rtl:space-x-reverse">
                  <Switch 
                    checked={destination.active}
                    onCheckedChange={(checked) => handleToggleStatus(destination.id, checked)}
                  />
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleDeleteDestination(destination.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
                
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <div className="text-right">
                    <p className="text-sm font-medium">{destination.name}</p>
                    <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                      {destination.endpoint || `${destination.type} integration`}
                    </p>
                  </div>
                  
                  <Badge 
                    variant={destination.active ? "default" : "outline"}
                    className="ml-2"
                  >
                    {destination.type === 'webhook' ? (
                      <Globe className="h-3 w-3 mr-1" />
                    ) : destination.type === 'telegram' ? (
                      <Send className="h-3 w-3 mr-1" />
                    ) : (
                      <BellRing className="h-3 w-3 mr-1" />
                    )}
                    {destination.type}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
          
          <div className="pt-4">
            <h3 className="text-sm font-medium mb-2 text-right">הוסף Webhook חדש</h3>
            <div className="grid gap-3">
              <div>
                <Label htmlFor="destination-name" className="text-right block mb-1">שם</Label>
                <Input 
                  id="destination-name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="שם תיאורי"
                  className="text-right"
                />
              </div>
              <div>
                <Label htmlFor="webhook-url" className="text-right block mb-1">כתובת Webhook</Label>
                <Input 
                  id="webhook-url"
                  value={newEndpoint}
                  onChange={(e) => setNewEndpoint(e.target.value)}
                  placeholder="https://example.com/webhook"
                  className="text-right"
                />
              </div>
              <Button onClick={handleAddWebhook}>הוסף Webhook</Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AlertDestinationsManager;
