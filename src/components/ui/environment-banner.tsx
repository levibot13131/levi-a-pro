
import React, { useState, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';

export function EnvironmentBanner() {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Check if running in Lovable preview/production environment
    const isProduction = window.location.hostname.includes('lovable.app');
    setIsVisible(isProduction);
  }, []);
  
  if (!isVisible) return null;
  
  return (
    <div className="bg-amber-500 text-white px-4 py-2 text-center">
      <div className="flex items-center justify-center gap-2">
        <AlertTriangle className="h-5 w-5" />
        <p>
          הערה: המערכת פועלת כעת במצב הדגמה עם נתונים מדומים לצורכי תצוגה בלבד. 
          חיבורים לשירותים חיצוניים (Binance, Telegram) אינם זמינים בסביבת Preview.
        </p>
      </div>
    </div>
  );
}
