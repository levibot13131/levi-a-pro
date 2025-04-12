
import { AlertDestination, AlertDestinationType } from './types';
import { toast } from 'sonner';

// קבוע לשמירת המזהה ב-localStorage
const LOCAL_STORAGE_KEY = 'tradingview-alert-destinations';

// יעדי הודעות מוגדרים - כאן ניתן להוסיף יעדים נוספים
let alertDestinations: AlertDestination[] = [
  // יעד ברירת מחדל מוגדר מראש לנוחות המשתמש
  {
    id: 'default-destination',
    name: 'Webhook ברירת מחדל',
    type: 'webhook' as AlertDestinationType,
    active: true, // שינינו ל-true כדי שיהיה פעיל כברירת מחדל
    endpoint: 'https://eobyanldxae2fi5.m.pipedream.net',
    headers: {
      'Content-Type': 'application/json'
    }
  }
];

// בדיקה אם יש יעדים שמורים ב-localStorage
const loadSavedDestinations = (): void => {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        alertDestinations = parsed;
        console.log('נטענו יעדים שמורים:', alertDestinations.length);
      }
    }
  } catch (error) {
    console.error('שגיאה בטעינת יעדים שמורים:', error);
  }
};

// שמירת יעדים ל-localStorage
const saveDestinations = (): void => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(alertDestinations));
  } catch (error) {
    console.error('שגיאה בשמירת יעדים:', error);
  }
};

// קבלת רשימת היעדים
export const getAlertDestinations = (): AlertDestination[] => {
  // טעינת יעדים שמורים בפעם הראשונה
  if (alertDestinations.length === 1 && !alertDestinations[0].active) {
    loadSavedDestinations();
  }
  return [...alertDestinations];
};

// הוספת יעד חדש
export const addAlertDestination = (destination: Omit<AlertDestination, 'id'>): AlertDestination => {
  const id = crypto.randomUUID();
  const newDestination: AlertDestination = {
    id,
    ...destination
  };
  
  alertDestinations.push(newDestination);
  saveDestinations();
  
  toast.success('יעד התראות חדש נוסף', {
    description: `היעד ${newDestination.name} נוסף בהצלחה`
  });
  
  return newDestination;
};

// עדכון יעד קיים
export const updateAlertDestination = (id: string, updates: Partial<AlertDestination>): boolean => {
  const index = alertDestinations.findIndex(d => d.id === id);
  if (index === -1) return false;
  
  alertDestinations[index] = { ...alertDestinations[index], ...updates };
  saveDestinations();
  
  toast.success('יעד התראות עודכן', {
    description: `היעד ${alertDestinations[index].name} עודכן בהצלחה`
  });
  
  return true;
};

// הסרת יעד
export const removeAlertDestination = (id: string): boolean => {
  const index = alertDestinations.findIndex(d => d.id === id);
  if (index === -1) return false;
  
  const name = alertDestinations[index].name;
  alertDestinations.splice(index, 1);
  saveDestinations();
  
  toast.info('יעד התראות הוסר', {
    description: `היעד ${name} הוסר בהצלחה`
  });
  
  return true;
};

// הפעלה/כיבוי של יעד
export const toggleAlertDestination = (id: string, active?: boolean): boolean => {
  const index = alertDestinations.findIndex(d => d.id === id);
  if (index === -1) return false;
  
  const newState = active !== undefined ? active : !alertDestinations[index].active;
  alertDestinations[index].active = newState;
  saveDestinations();
  
  toast.success(
    newState ? 'יעד התראות הופעל' : 'יעד התראות הושבת',
    { description: `היעד ${alertDestinations[index].name} ${newState ? 'הופעל' : 'הושבת'} בהצלחה` }
  );
  
  return true;
};

// טעינה ראשונית של יעדים
loadSavedDestinations();
