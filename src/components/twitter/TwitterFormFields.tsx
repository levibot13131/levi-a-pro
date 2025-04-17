
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { TwitterFormData } from '@/hooks/useTwitterConnect';

interface TwitterFormFieldsProps {
  form: UseFormReturn<TwitterFormData>;
}

const TwitterFormFields: React.FC<TwitterFormFieldsProps> = ({ form }) => {
  return (
    <>
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
    </>
  );
};

export default TwitterFormFields;
