
import React from 'react';
import { Container } from '@/components/ui/container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import RequireAuth from '@/components/auth/RequireAuth';

const TradingDashboard: React.FC = () => {
  return (
    <RequireAuth>
      <Container className="py-8">
        <h1 className="text-3xl font-bold mb-6 text-right">לוח בקרת מסחר</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-right">סקירת שוק</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-right">תצוגת סקירת שוק תהיה זמינה כאן בקרוב.</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-right">מצב חשבון</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-right">מידע על מצב החשבון יופיע כאן.</p>
            </CardContent>
          </Card>
        </div>
        
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-right">פעולות מסחר אחרונות</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-right">היסטוריית פעולות המסחר תוצג כאן.</p>
          </CardContent>
        </Card>
      </Container>
    </RequireAuth>
  );
};

export default TradingDashboard;
