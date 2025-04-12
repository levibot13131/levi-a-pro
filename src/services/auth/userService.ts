
import { User, UserRole, Permission, DefaultPermissions, adminUser } from '@/types/user';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

// Store keys
const USERS_KEY = 'trading_system_users';
const CURRENT_USER_KEY = 'trading_system_current_user';

// Get users from localStorage
export const getUsers = (): User[] => {
  try {
    const storedUsers = localStorage.getItem(USERS_KEY);
    if (!storedUsers) {
      // Initialize with admin user
      const initialUsers = [adminUser];
      localStorage.setItem(USERS_KEY, JSON.stringify(initialUsers));
      return initialUsers;
    }
    return JSON.parse(storedUsers);
  } catch (error) {
    console.error('Failed to get users:', error);
    return [adminUser];
  }
};

// Save users to localStorage
export const saveUsers = (users: User[]): void => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

// Get current user
export const getCurrentUser = (): User | null => {
  try {
    const storedUser = localStorage.getItem(CURRENT_USER_KEY);
    return storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    console.error('Failed to get current user:', error);
    return null;
  }
};

// Save current user
export const saveCurrentUser = (user: User | null): void => {
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
};

// Login user
export const loginUser = (email: string, password: string): User | null => {
  // In a real application, you would validate the password here
  // This is just a mock implementation for demonstration
  const users = getUsers();
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  
  if (user && user.isActive) {
    // Update last login
    user.lastLogin = Date.now();
    
    // Save updated user list and current user
    saveUsers(users);
    saveCurrentUser(user);
    
    toast.success(`ברוך הבא, ${user.username}!`);
    return user;
  }
  
  toast.error('התחברות נכשלה', {
    description: 'שם משתמש או סיסמה שגויים'
  });
  return null;
};

// Logout user
export const logoutUser = (): void => {
  saveCurrentUser(null);
  toast.info('התנתקת מהמערכת');
};

// Add new user
export const addUser = (
  email: string,
  username: string,
  role: UserRole,
  password: string
): User | null => {
  try {
    const users = getUsers();
    
    // Check if user already exists
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      toast.error('המשתמש כבר קיים', {
        description: 'כתובת דוא"ל זו כבר רשומה במערכת'
      });
      return null;
    }
    
    // Create new user
    const newUser: User = {
      id: uuidv4(),
      email,
      username,
      role,
      createdAt: Date.now(),
      isActive: true,
      permissions: [...DefaultPermissions]
    };
    
    // Add user
    users.push(newUser);
    saveUsers(users);
    
    toast.success('המשתמש נוצר בהצלחה');
    return newUser;
  } catch (error) {
    console.error('Failed to add user:', error);
    toast.error('שגיאה ביצירת משתמש חדש');
    return null;
  }
};

// Update user
export const updateUser = (updatedUser: User): boolean => {
  try {
    const users = getUsers();
    const index = users.findIndex(u => u.id === updatedUser.id);
    
    if (index === -1) {
      toast.error('משתמש לא נמצא');
      return false;
    }
    
    // Update user
    users[index] = updatedUser;
    saveUsers(users);
    
    // If this is the current user, update the current user too
    const currentUser = getCurrentUser();
    if (currentUser && currentUser.id === updatedUser.id) {
      saveCurrentUser(updatedUser);
    }
    
    toast.success('המשתמש עודכן בהצלחה');
    return true;
  } catch (error) {
    console.error('Failed to update user:', error);
    toast.error('שגיאה בעדכון המשתמש');
    return false;
  }
};

// Delete user
export const deleteUser = (userId: string): boolean => {
  try {
    // Cannot delete admin user
    if (userId === adminUser.id) {
      toast.error('לא ניתן למחוק את משתמש המנהל');
      return false;
    }
    
    const users = getUsers();
    const updatedUsers = users.filter(u => u.id !== userId);
    
    if (updatedUsers.length === users.length) {
      toast.error('משתמש לא נמצא');
      return false;
    }
    
    saveUsers(updatedUsers);
    
    // If this is the current user, log them out
    const currentUser = getCurrentUser();
    if (currentUser && currentUser.id === userId) {
      logoutUser();
    }
    
    toast.success('המשתמש נמחק בהצלחה');
    return true;
  } catch (error) {
    console.error('Failed to delete user:', error);
    toast.error('שגיאה במחיקת המשתמש');
    return false;
  }
};

// Update user permissions
export const updateUserPermissions = (userId: string, permissions: Permission[]): boolean => {
  try {
    const users = getUsers();
    const user = users.find(u => u.id === userId);
    
    if (!user) {
      toast.error('משתמש לא נמצא');
      return false;
    }
    
    // Update permissions
    user.permissions = permissions;
    saveUsers(users);
    
    // If this is the current user, update the current user too
    const currentUser = getCurrentUser();
    if (currentUser && currentUser.id === userId) {
      currentUser.permissions = permissions;
      saveCurrentUser(currentUser);
    }
    
    toast.success('הרשאות המשתמש עודכנו בהצלחה');
    return true;
  } catch (error) {
    console.error('Failed to update user permissions:', error);
    toast.error('שגיאה בעדכון הרשאות המשתמש');
    return false;
  }
};

// Initialize users
export const initializeUsers = (): void => {
  const users = getUsers();
  
  // If no users exist, add admin user
  if (users.length === 0) {
    saveUsers([adminUser]);
  }
};

// Check user permission for a resource
export const hasPermission = (
  user: User | null,
  resource: string,
  permission: 'view' | 'edit' | 'delete'
): boolean => {
  if (!user) return false;
  
  // Admin has all permissions
  if (user.role === 'admin') return true;
  
  // Check specific permission
  const resourcePermission = user.permissions.find(p => p.resource === resource);
  if (!resourcePermission) return false;
  
  switch (permission) {
    case 'view': return resourcePermission.canView;
    case 'edit': return resourcePermission.canEdit;
    case 'delete': return resourcePermission.canDelete;
    default: return false;
  }
};
