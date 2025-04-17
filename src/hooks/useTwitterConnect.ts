
import { useState } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';
import { getTwitterCredentials } from '@/services/twitter/twitterService';

// Form schema for Twitter API credentials
const twitterFormSchema = z.object({
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

export type TwitterFormData = z.infer<typeof twitterFormSchema>;

export const useTwitterConnect = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const savedCredentials = getTwitterCredentials();

  const defaultValues: TwitterFormData = {
    apiKey: savedCredentials?.apiKey || '',
    apiSecret: savedCredentials?.apiSecret || '',
    bearerToken: savedCredentials?.bearerToken || '',
  };

  return {
    isSubmitting,
    setIsSubmitting,
    defaultValues,
    twitterFormSchema,
  };
};
