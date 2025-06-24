
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface UserAccessControl {
  id: string;
  user_id: string;
  telegram_id: string | null;
  telegram_username: string | null;
  access_level: 'all' | 'elite' | 'filtered' | 'specific';
  allowed_assets: string[];
  is_active: boolean;
  signals_received: number;
  last_signal_at: string | null;
  created_at: string;
  updated_at: string;
}

export const useUserManagement = () => {
  const [users, setUsers] = useState<UserAccessControl[]>([]);
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('user_access_control')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('שגיאה בטעינת רשימת משתמשים');
    } finally {
      setLoading(false);
    }
  };

  const addUser = async (userData: {
    telegram_id: string;
    telegram_username: string;
    access_level: 'all' | 'elite' | 'filtered' | 'specific';
    allowed_assets?: string[];
  }) => {
    try {
      // First, create or get user in auth.users (for demo purposes, we'll create a placeholder)
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: `${userData.telegram_username}@telegram.user`,
        password: 'temp_password_123',
        user_metadata: {
          telegram_id: userData.telegram_id,
          telegram_username: userData.telegram_username
        }
      });

      if (authError) throw authError;

      const { data, error } = await supabase
        .from('user_access_control')
        .insert([{
          user_id: authData.user.id,
          telegram_id: userData.telegram_id,
          telegram_username: userData.telegram_username,
          access_level: userData.access_level,
          allowed_assets: userData.allowed_assets || [],
          is_active: true
        }])
        .select()
        .single();

      if (error) throw error;

      setUsers(prev => [data, ...prev]);
      toast.success('משתמש נוסף בהצלחה');
      return data;
    } catch (error) {
      console.error('Error adding user:', error);
      toast.error('שגיאה בהוספת משתמש');
      throw error;
    }
  };

  const updateUser = async (userId: string, updates: Partial<UserAccessControl>) => {
    try {
      const { data, error } = await supabase
        .from('user_access_control')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;

      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, ...data } : user
      ));
      toast.success('משתמש עודכן בהצלחה');
      return data;
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('שגיאה בעדכון משתמש');
      throw error;
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('user_access_control')
        .delete()
        .eq('id', userId);

      if (error) throw error;

      setUsers(prev => prev.filter(user => user.id !== userId));
      toast.success('משתמש נמחק בהצלחה');
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('שגיאה במחיקת משתמש');
      throw error;
    }
  };

  const trackSignalDelivery = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('user_access_control')
        .update({
          signals_received: supabase.sql`signals_received + 1`,
          last_signal_at: new Date().toISOString()
        })
        .eq('user_id', userId);

      if (error) throw error;
    } catch (error) {
      console.error('Error tracking signal delivery:', error);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return {
    users,
    loading,
    addUser,
    updateUser,
    deleteUser,
    trackSignalDelivery,
    refreshUsers: loadUsers
  };
};
