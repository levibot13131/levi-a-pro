import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

// Form schema for Twitter API credentials
const formSchema = z.object({
  apiKey: z.string().min(10, {
    message: 'API Key is required and must be valid',
  }),
  apiSecret: z.string().min(10, {
    message: 'API Secret is required and must be valid',
  }),
  bearerToken: z.string().min(10, {
    message: 'Bearer Token is required and must be valid',
  }),
});

// Get Twitter API keys from environment variables or localStorage
const getTwitterCredentials = () => {
  // Check environment variables first
  const envApiKey = import.meta.env.VITE_TWITTER_API_KEY;
  const envApiSecret = import.meta.env.VITE_TWITTER_API_SECRET;
  const envBearerToken = import.meta.env.VITE_TWITTER_BEARER_TOKEN;
  
  // If all environment variables are set, use them
  if (envApiKey && envApiSecret && envBearerToken) {
    console.log('Using Twitter API credentials from environment variables');
    return {
      apiKey: envApiKey,
      apiSecret: envApiSecret,
      bearerToken: envBearerToken,
    };
  }
  
  // Otherwise, try to get from localStorage
  try {
    const stored = localStorage.getItem('twitter_api_keys');
    if (stored) {
      console.log('Using Twitter API credentials from localStorage');
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to parse stored Twitter credentials:', error);
  }
  
  // Return empty values if nothing found
  return {
    apiKey: '',
    apiSecret: '',
    bearerToken: '',
  };
};

interface TwitterConnectFormProps {
  onConnect: (credentials: any) => void;
}

const TwitterConnectForm: React.FC<TwitterConnectFormProps> = ({ onConnect }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const savedCredentials = getTwitterCredentials();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      apiKey: savedCredentials.apiKey || '',
      apiSecret: savedCredentials.apiSecret || '',
      bearerToken: savedCredentials.bearerToken || '',
    },
  });
  
  // Auto-connect if we have environment variables
  useEffect(() => {
    if (savedCredentials.apiKey && savedCredentials.apiSecret && savedCredentials.bearerToken) {
      // If the credentials came from environment variables, connect automatically
      if (import.meta.env.VITE_TWITTER_API_KEY) {
        handleConnect(savedCredentials);
      }
    }
  }, []);
  
  const handleConnect = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      // Store credentials in localStorage
      localStorage.setItem('twitter_api_keys', JSON.stringify(values));
      
      // Call the onConnect callback
      onConnect(values);
      
      toast.success('התחברות לטוויטר הצליחה', {
        description: 'התחברת בהצלחה לחשבון הטוויטר',
      });
    } catch (error) {
      console.error('Failed to connect to Twitter:', error);
      toast.error('התחברות לטוויטר נכשלה', {
        description: 'אנא בדוק את פרטי ההתחברות ונסה שוב',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-right">התחברות לטוויטר</CardTitle>
        <CardDescription className="text-right">
          נדרשים מפתחות API של טוויטר לצורך ניתוח סנטימנט ומעקב אחר מידע
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleConnect)} className="space-y-4">
            <FormField
              control={form.control}
              name="apiKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-right block">API Key</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder="הזן את ה-API Key שלך" 
                      className="text-right dir-rtl"
                    />
                  </FormControl>
                  <FormDescription className="text-right">
                    ניתן להשיג מחשבון המפתחים של טוויטר
                  </FormDescription>
                  <FormMessage className="text-right" />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="apiSecret"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-right block">API Secret</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      type="password" 
                      placeholder="הזן את ה-API Secret שלך" 
                      className="text-right dir-rtl"
                    />
                  </FormControl>
                  <FormMessage className="text-right" />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="bearerToken"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-right block">Bearer Token</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      type="password" 
                      placeholder="הזן את ה-Bearer Token שלך" 
                      className="text-right dir-rtl"
                    />
                  </FormControl>
                  <FormMessage className="text-right" />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end">
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="mt-2"
              >
                {isSubmitting ? 'מתחבר...' : 'התחבר'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="bg-muted/50 flex justify-end">
        <p className="text-sm text-muted-foreground text-right">
          הערה: הנתונים יישמרו באופן מקומי בדפדפן שלך בלבד
        </p>
      </CardFooter>
    </Card>
  );
};

export default TwitterConnectForm;
