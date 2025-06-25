
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
      console.log('Loading users from user_profiles...');
      
      // Load from user_profiles as primary source
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('*');
      
      if (profileError) {
        console.error('Error loading user profiles:', profileError);
        throw profileError;
      }
      
      // Transform user_profiles to match expected structure
      const transformedData: UserAccessControl[] = profileData?.map((profile: any) => ({
        id: profile.id,
        user_id: profile.user_id,
        telegram_id: profile.telegram_chat_id,
        telegram_username: profile.username || 'Unknown',
        access_level: 'filtered' as const,
        allowed_assets: [],
        is_active: true,
        signals_received: profile.signals_received_today || 0,
        last_signal_at: null,
        created_at: profile.created_at,
        updated_at: profile.updated_at || profile.created_at
      })) || [];
      
      setUsers(transformedData);
      console.log('Users loaded successfully:', transformedData.length);
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('שגיאה בטעינת רשימת משתמשים');
      setUsers([]);
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
      console.log('Adding user:', userData);
      
      // Add to user_profiles
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .insert([{
          user_id: `telegram_${userData.telegram_id}`,
          username: userData.telegram_username,
          telegram_chat_id: userData.telegram_id,
          signals_received_today: 0
        }])
        .select()
        .single();

      if (profileError) {
        console.error('Failed to add user to profiles:', profileError);
        throw profileError;
      }

      // Transform for display
      const newUser: UserAccessControl = {
        id: profileData?.id || `temp_${Date.now()}`,
        user_id: `telegram_${userData.telegram_id}`,
        telegram_id: userData.telegram_id,
        telegram_username: userData.telegram_username,
        access_level: userData.access_level,
        allowed_assets: userData.allowed_assets || [],
        is_active: true,
        signals_received: 0,
        last_signal_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      setUsers(prev => [newUser, ...prev]);
      toast.success('משתמש נוסף בהצלחה');
      return newUser;
    } catch (error) {
      console.error('Error adding user:', error);
      toast.error('שגיאה בהוספת משתמש');
      throw error;
    }
  };

  const updateUser = async (userId: string, updates: Partial<UserAccessControl>) => {
    try {
      console.log('Updating user:', userId, updates);
      
      // Update in user_profiles if possible
      const { error: profileError } = await supabase
        .from('user_profiles')
        .update({
          username: updates.telegram_username,
          telegram_chat_id: updates.telegram_id,
          signals_received_today: updates.signals_received
        })
        .eq('id', userId);

      if (profileError) {
        console.log('Profile update failed, updating local state only');
      }
      
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, ...updates, updated_at: new Date().toISOString() } : user
      ));
      
      toast.success('משתמש עודכן בהצלחה');
      return updates;
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('שגיאה בעדכון משתמש');
      throw error;
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      console.log('Deleting user:', userId);
      
      // Delete from user_profiles
      const { error: profileError } = await supabase
        .from('user_profiles')
        .delete()
        .eq('id', userId);

      if (profileError) {
        console.log('Profile delete failed, updating local state only');
      }
      
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
      console.log('Tracking signal delivery for user:', userId);
      
      setUsers(prev => prev.map(user => 
        user.user_id === userId ? { 
          ...user, 
          signals_received: user.signals_received + 1,
          last_signal_at: new Date().toISOString()
        } : user
      ));
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
