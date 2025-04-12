
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { User, UserRole } from '@/types/user';
import { addUser, updateUser } from '@/services/auth/userService';

interface UserFormProps {
  user: User | null;
  onClose: () => void;
}

const formSchema = z.object({
  email: z.string().email({ message: 'כתובת אימייל לא תקינה' }),
  username: z.string().min(2, { message: 'שם משתמש חייב להכיל לפחות 2 תווים' }),
  role: z.enum(['admin', 'analyst', 'trader', 'viewer']),
  password: z.string().min(6, { message: 'סיסמה חייבת להכיל לפחות 6 תווים' }).optional(),
  isActive: z.boolean().default(true)
});

type FormValues = z.infer<typeof formSchema>;

const UserForm: React.FC<UserFormProps> = ({ user, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: user?.email || '',
      username: user?.username || '',
      role: user?.role || 'viewer',
      password: '', // Empty when editing
      isActive: user?.isActive ?? true
    }
  });
  
  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    try {
      if (user) {
        // Update existing user
        const updatedUser: User = {
          ...user,
          email: values.email,
          username: values.username,
          role: values.role as UserRole,
          isActive: values.isActive
        };
        
        const success = updateUser(updatedUser);
        if (success) {
          onClose();
        }
      } else {
        // Add new user (password is required for new users)
        if (!values.password) {
          form.setError('password', { 
            type: 'manual', 
            message: 'סיסמה חובה למשתמש חדש' 
          });
          return;
        }
        
        const newUser = addUser(
          values.email,
          values.username,
          values.role as UserRole,
          values.password
        );
        
        if (newUser) {
          onClose();
        }
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem dir="rtl">
              <FormLabel>אימייל</FormLabel>
              <FormControl>
                <Input 
                  placeholder="your@email.com" 
                  {...field} 
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem dir="rtl">
              <FormLabel>שם משתמש</FormLabel>
              <FormControl>
                <Input 
                  placeholder="שם המשתמש" 
                  {...field} 
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem dir="rtl">
              <FormLabel>תפקיד</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
                disabled={isLoading}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="בחר תפקיד" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="admin">מנהל מערכת</SelectItem>
                  <SelectItem value="analyst">אנליסט</SelectItem>
                  <SelectItem value="trader">סוחר</SelectItem>
                  <SelectItem value="viewer">צופה</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem dir="rtl">
              <FormLabel>
                {user ? 'סיסמה (השאר ריק לשמור על הקיים)' : 'סיסמה'}
              </FormLabel>
              <FormControl>
                <Input 
                  type="password" 
                  placeholder="סיסמה" 
                  {...field} 
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem dir="rtl" className="flex flex-row items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <FormLabel>סטטוס משתמש</FormLabel>
                <p className="text-sm text-muted-foreground">
                  האם המשתמש יכול להתחבר למערכת
                </p>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isLoading}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose}
            disabled={isLoading}
          >
            ביטול
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'שומר...' : user ? 'עדכן משתמש' : 'צור משתמש'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default UserForm;
