
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  CheckCircle, 
  AlertCircle, 
  FileKey, 
  Bell, 
  Play,
  Copy
} from 'lucide-react';
import { toast } from 'sonner';

interface GuideModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const GuideModal: React.FC<GuideModalProps> = ({ open, onOpenChange }) => {
  const copyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} הועתק ללוח`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-right text-xl">מדריך התחברות מהיר למערכת</DialogTitle>
          <DialogDescription className="text-right">
            כל הפרטים הנדרשים להתחברות ולהפעלת המערכת
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="max-h-[60vh]">
          <div className="space-y-6 p-2">
            {/* התחברות למערכת */}
            <div className="rounded-lg border p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <FileKey className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-medium text-right">התחברות למערכת</h3>
              </div>
              
              <div className="space-y-3 text-right">
                <p className="text-sm text-muted-foreground">פרטי משתמש להתחברות לממשק:</p>
                
                <div className="bg-muted p-3 rounded-md">
                  <div className="flex justify-between items-center">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-7 px-2"
                      onClick={() => copyText("user@example.com", "שם משתמש")}
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                    <div>
                      <p className="text-sm font-medium">משתמש רגיל:</p>
                      <p className="text-xs text-muted-foreground">
                        <span className="font-mono">user@example.com / user123</span>
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-muted p-3 rounded-md">
                  <div className="flex justify-between items-center">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-7 px-2"
                      onClick={() => copyText("admin@example.com", "שם משתמש")}
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                    <div>
                      <p className="text-sm font-medium">מנהל מערכת:</p>
                      <p className="text-xs text-muted-foreground">
                        <span className="font-mono">admin@example.com / admin123</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* בינאנס */}
            <div className="rounded-lg border p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="bg-yellow-500/10 p-2 rounded-full">
                  <AlertCircle className="h-5 w-5 text-yellow-500" />
                </div>
                <h3 className="text-lg font-medium text-right">חיבור לבינאנס</h3>
              </div>
              
              <div className="space-y-3 text-right">
                <p className="text-sm text-muted-foreground">
                  לחץ על "התחבר ל-Binance" והשתמש במפתחות ה-API שלך:
                </p>
                
                <div className="bg-muted p-3 rounded-md">
                  <p className="text-sm font-medium">צעדים להתחברות:</p>
                  <ol className="text-xs space-y-1 mt-1 list-decimal list-inside">
                    <li>לחץ על "התחבר ל-Binance" בעמוד האינטגרציה</li>
                    <li>הזן את מפתח ה-API שלך (API Key)</li>
                    <li>הזן את הסיסמה הסודית (API Secret)</li>
                    <li>לחץ על "התחבר" לאישור</li>
                  </ol>
                </div>
                
                <div className="bg-green-50 p-3 rounded-md">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm">
                      המפתחות יישמרו <strong>מקומית במכשיר שלך בלבד</strong> ולא יישלחו לשום שרת חיצוני.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* הגדרת התראות */}
            <div className="rounded-lg border p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="bg-blue-500/10 p-2 rounded-full">
                  <Bell className="h-5 w-5 text-blue-500" />
                </div>
                <h3 className="text-lg font-medium text-right">הגדרת התראות</h3>
              </div>
              
              <div className="space-y-3 text-right">
                <p className="text-sm text-muted-foreground">
                  יש כבר Webhook ברירת מחדל שהופעל אוטומטית:
                </p>
                
                <div className="bg-muted p-3 rounded-md">
                  <div className="flex justify-between items-center">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-7 px-2"
                      onClick={() => copyText("https://eobyanldxae2fi5.m.pipedream.net", "כתובת Webhook")}
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                    <div>
                      <p className="text-sm font-medium">כתובת Webhook פעילה:</p>
                      <p className="text-xs font-mono text-muted-foreground dir-ltr overflow-auto whitespace-nowrap">
                        https://eobyanldxae2fi5.m.pipedream.net
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-50 p-3 rounded-md">
                  <p className="text-sm font-medium">כיצד לוודא שההתראות פעילות:</p>
                  <ol className="text-xs space-y-1 mt-1 list-decimal list-inside">
                    <li>עבור לעמוד "איתותי מסחר" (Trading Signals)</li>
                    <li>לחץ על "הגדרות התראות" כדי לראות את הגדרות ה-Webhook</li>
                    <li>ודא שהמתג "פעיל" מופעל עבור יעד ברירת המחדל</li>
                  </ol>
                </div>
              </div>
            </div>
            
            {/* הפעלת ניתוח בזמן אמת */}
            <div className="rounded-lg border p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="bg-green-500/10 p-2 rounded-full">
                  <Play className="h-5 w-5 text-green-500" />
                </div>
                <h3 className="text-lg font-medium text-right">הפעלת ניתוח בזמן אמת</h3>
              </div>
              
              <div className="space-y-3 text-right">
                <p className="text-sm text-muted-foreground">
                  לאחר שהפעלת את החיבורים, הנה הצעדים האחרונים:
                </p>
                
                <div className="bg-muted p-3 rounded-md">
                  <p className="text-sm font-medium">הפעלת המערכת:</p>
                  <ol className="text-xs space-y-1 mt-1 list-decimal list-inside">
                    <li>עבור לעמוד "איתותי מסחר" (Trading Signals)</li>
                    <li>לחץ על כפתור "הפעל ניתוח בזמן אמת" בראש העמוד</li>
                    <li>המערכת תתחיל לנטר ולשלוח התראות באופן אוטומטי</li>
                  </ol>
                </div>
                
                <div className="bg-green-50 p-3 rounded-md">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm">
                      לאחר ההפעלה, התראות יישלחו אוטומטית ליעדים המוגדרים בכל פעם שיזוהה איתות מסחר חדש.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
        
        <DialogFooter className="flex-row-reverse justify-start gap-2">
          <Button 
            onClick={() => onOpenChange(false)} 
            variant="default"
          >
            הבנתי, תודה
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GuideModal;
