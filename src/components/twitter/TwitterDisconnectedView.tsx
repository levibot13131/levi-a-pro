
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import TwitterConnectForm from '@/components/twitter/TwitterConnectForm';

interface TwitterDisconnectedViewProps {
  onConnect: () => void;
}

const TwitterDisconnectedView: React.FC<TwitterDisconnectedViewProps> = ({ onConnect }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-right">התחבר לחשבון ה-Twitter שלך</CardTitle>
        <CardDescription className="text-right">
          חבר את המערכת לחשבון הטוויטר שלך כדי לקבל נתוני סנטימנט בזמן אמת
        </CardDescription>
      </CardHeader>
      <CardContent>
        <TwitterConnectForm 
          isConnected={false}
          onDisconnect={() => {}}
        />
        <div className="mt-4 text-center text-sm text-muted-foreground">
          <p>חיבור לטוויטר מאפשר ניתוח סנטימנט מתקדם וקבלת התראות על שינויים משמעותיים בשוק</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TwitterDisconnectedView;
