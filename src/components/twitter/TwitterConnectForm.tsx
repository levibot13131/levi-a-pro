
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import TwitterFormFields from './TwitterFormFields';
import { useTwitterConnect, TwitterFormData } from '@/hooks/useTwitterConnect';

interface TwitterConnectFormProps {
  isConnected?: boolean;
  onDisconnect?: () => void;
  onConnect: (credentials: TwitterFormData) => void;
}

const TwitterConnectForm: React.FC<TwitterConnectFormProps> = ({ 
  isConnected = false, 
  onDisconnect, 
  onConnect 
}) => {
  const { isSubmitting, setIsSubmitting, defaultValues, twitterFormSchema } = useTwitterConnect();
  
  const form = useForm<TwitterFormData>({
    resolver: zodResolver(twitterFormSchema),
    defaultValues,
  });
  
  const handleConnect = async (values: TwitterFormData) => {
    setIsSubmitting(true);
    try {
      await onConnect(values);
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
            <TwitterFormFields form={form} />
            
            <div className="flex justify-end space-x-2">
              {isConnected && onDisconnect && (
                <Button 
                  type="button" 
                  variant="destructive"
                  onClick={onDisconnect}
                >
                  התנתק
                </Button>
              )}
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
