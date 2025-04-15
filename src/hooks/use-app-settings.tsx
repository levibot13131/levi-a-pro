
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'sonner';

// האירוע המותאם אישית לשינוי מצב דמו
export const DEMO_MODE_CHANGE_EVENT = 'demo-mode-change';

export const useAppSettings = create()(
  persist(
    (set, get) => ({
      demoMode: true,
      darkMode: true,
      language: 'he',
      autoRefresh: true,
      refreshInterval: 60000,
      
      toggleDemoMode: () => {
        set((state) => {
          const newDemoMode = !state.demoMode;
          
          // השמעת אירוע שינוי מצב דמו
          const event = new CustomEvent(DEMO_MODE_CHANGE_EVENT, {
            detail: {
              demoMode: newDemoMode
            }
          });
          window.dispatchEvent(event);
          
          // הצגת הודעת טוסט על השינוי
          if (newDemoMode) {
            toast.info('עברת למצב דמו', {
              description: 'כל הנתונים הם לצורכי הדגמה בלבד'
            });
          } else {
            toast.warning('עברת למצב אמיתי', {
              description: 'המערכת תשתמש בנתונים אמיתיים מהחיבורים שהגדרת'
            });
          }
          
          console.log(`App mode changed to ${newDemoMode ? 'DEMO' : 'REAL'} mode`);
          
          return {
            demoMode: newDemoMode
          };
        });
      },
      
      toggleDarkMode: () => set((state) => ({
        darkMode: !state.darkMode
      })),
      
      setLanguage: (language) => set({
        language
      }),
      
      toggleAutoRefresh: () => set((state) => ({
        autoRefresh: !state.autoRefresh
      })),
      
      setRefreshInterval: (refreshInterval) => set({
        refreshInterval
      })
    }),
    {
      name: 'app-settings'
    }
  )
);

// Hook להאזנה לשינויים במצב דמו
export const useDemoModeListener = (callback) => {
  React.useEffect(() => {
    const handleDemoModeChange = (event) => {
      callback(event.detail.demoMode);
    };
    
    // הוספת האזנה לאירוע
    window.addEventListener(DEMO_MODE_CHANGE_EVENT, handleDemoModeChange);
    
    // ניקוי האזנה בעת פירוק הקומפוננטה
    return () => {
      window.removeEventListener(DEMO_MODE_CHANGE_EVENT, handleDemoModeChange);
    };
  }, [callback]);
  
  // החזרת הערך הנוכחי של מצב דמו
  return useAppSettings((state) => state.demoMode);
};

// בנוסף, נייצא גם גישה ישירה למצב הדמו
export const isDemoMode = () => useAppSettings.getState().demoMode;
