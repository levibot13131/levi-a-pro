
import { toast } from 'sonner';

// Connect to External Data Source
export const connectToExternalDataSource = (sourceId: string): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate successful connection
      toast.success(`התחברות למקור המידע הושלמה בהצלחה`, {
        description: `החיבור ל-${sourceId} פעיל כעת ונתונים יתעדכנו אוטומטית`
      });
      resolve(true);
    }, 1500);
  });
};

// Simulate updating market data
export const refreshMarketData = (): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      toast.success("נתוני השוק התעדכנו בהצלחה", {
        description: "כל האינדיקטורים הפונדמנטליים מעודכנים לרגע זה"
      });
      resolve();
    }, 1000);
  });
};
