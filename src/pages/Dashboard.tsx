
import React from 'react';
import { Container } from '../components/ui/container';
import RealTimeTradingDashboard from '../components/dashboard/RealTimeTradingDashboard';

const Dashboard: React.FC = () => {
  return (
    <Container className="py-6">
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-right mb-2">
            לוח הבקרה הראשי - LeviPro
          </h1>
          <p className="text-muted-foreground text-right">
            מערכת מסחר אוטומטית מתקדמת עם ניתוח בזמן אמת
          </p>
        </div>
        
        <RealTimeTradingDashboard />
      </div>
    </Container>
  );
};

export default Dashboard;
