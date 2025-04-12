
import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { validateBinanceCredentials } from '@/services/binance/binanceService';
import { Lock, Key } from 'lucide-react';

const formSchema = z.object({
  apiKey: z.string().min(5, { message: 'API Key חייב להיות באורך של לפחות 5 תווים' }),
  apiSecret: z.string().min(5, { message: 'API Secret חייב להיות באורך של לפחות 5 תווים' }),
});

interface BinanceConnectFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConnectSuccess: () => void;
}

const BinanceConnectForm: React.FC<BinanceConnectFormProps> = ({
  isOpen,
  onOpenChange,
  onConnectSuccess,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      apiKey: '',
      apiSecret: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const isValid = await validateBinanceCredentials(values.apiKey, values.apiSecret);
      
      if (isValid) {
        onConnectSuccess();
        onOpenChange(false);
        form.reset();
      } else {
        form.setError('apiKey', { 
          type: 'manual', 
          message: 'API Keys לא תקינים. אנא בדוק את המפתחות ונסה שוב.' 
        });
      }
    } catch (error) {
      console.error('Error validating Binance credentials:', error);
      form.setError('apiKey', { 
        type: 'manual', 
        message: 'אירעה שגיאה בעת אימות המפתחות. אנא נסה שוב.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-right">התחברות ל-Binance</DialogTitle>
          <DialogDescription className="text-right">
            הזן את מפתחות ה-API שלך מחשבון ה-Binance שלך
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="apiKey"
              render={({ field }) => (
                <FormItem dir="rtl">
                  <FormLabel>API Key</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Key className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="הזן את ה-API Key שלך מ-Binance"
                        className="pr-10"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="apiSecret"
              render={({ field }) => (
                <FormItem dir="rtl">
                  <FormLabel>API Secret</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="password"
                        placeholder="הזן את ה-API Secret שלך מ-Binance"
                        className="pr-10"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="pt-4 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                ביטול
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'מתחבר...' : 'התחבר'}
              </Button>
            </div>
          </form>
        </Form>
        <div className="mt-4 text-sm text-muted-foreground text-right">
          <p>
            לבטיחות מירבית, אנו ממליצים ליצור API keys חדשים עם הרשאות קריאה בלבד.
          </p>
          <p className="mt-2">
            המפתחות נשמרים מקומית במכשיר שלך ולא נשלחים לשרת.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BinanceConnectForm;
