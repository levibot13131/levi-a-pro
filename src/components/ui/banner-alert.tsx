
import React from 'react';
import { AlertCircle, X } from 'lucide-react';

interface BannerAlertProps {
  onClose?: () => void;
}

const BannerAlert: React.FC<BannerAlertProps> = ({ onClose }) => {
  const isProduction = window.location.hostname.includes('lovable.app');
  
  if (!isProduction) {
    return null;
  }
  
  return (
    <div className="bg-amber-100 dark:bg-amber-900/50 border-amber-200 dark:border-amber-900 border-b px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          <p className="text-amber-700 dark:text-amber-300 text-sm">
            <span className="font-semibold">הודעת מערכת:</span> חיבורים חיצוניים ל-Telegram ו-Binance מוגבלים בסביבת Preview. 
            הנתונים מוצגים בסימולציה. בסביבת Production יש להשתמש בשרתי ביניים (API Proxy).
          </p>
        </div>
        {onClose && (
          <button 
            onClick={onClose}
            className="text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-200"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default BannerAlert;
