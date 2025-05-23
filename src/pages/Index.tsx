
import React from 'react';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-12 px-4">
        <div className="flex flex-col items-center justify-center text-center">
          <h1 className="text-4xl font-bold mb-6">ברוכים הבאים למערכת הניתוח והמסחר האוטומטית</h1>
          <p className="text-xl text-muted-foreground mb-8">
            מערכת חכמה לניתוח טכני, ניהול סיכונים ובדיקות היסטוריות
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl">
            <Link to="/backtesting" className="group rounded-lg border p-6 hover:border-primary transition-colors">
              <h3 className="font-semibold text-xl mb-3 group-hover:text-primary">
                בדיקה היסטורית
              </h3>
              <p className="text-muted-foreground">
                בדוק את האסטרטגיה שלך על נתונים היסטוריים
              </p>
            </Link>
            <Link to="/technical-analysis" className="group rounded-lg border p-6 hover:border-primary transition-colors">
              <h3 className="font-semibold text-xl mb-3 group-hover:text-primary">
                ניתוח טכני
              </h3>
              <p className="text-muted-foreground">
                ניתוח מתקדם עם אינדיקטורים וזיהוי תבניות
              </p>
            </Link>
            <Link to="/risk-management" className="group rounded-lg border p-6 hover:border-primary transition-colors">
              <h3 className="font-semibold text-xl mb-3 group-hover:text-primary">
                ניהול סיכונים
              </h3>
              <p className="text-muted-foreground">
                כלים לניהול סיכונים ומעקב אחר ביצועים
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
