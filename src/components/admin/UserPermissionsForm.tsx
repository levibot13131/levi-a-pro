
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { User, Permission, AvailableResources } from '@/types/user';
import { updateUserPermissions } from '@/services/auth/userService';

interface UserPermissionsFormProps {
  user: User;
  onClose: () => void;
}

interface ResourceDisplay {
  id: string;
  name: string;
}

const resourceDisplayNames: Record<string, string> = {
  dashboard: 'דשבורד',
  backtesting: 'בדיקות היסטוריות',
  technicalAnalysis: 'ניתוח טכני',
  riskManagement: 'ניהול סיכונים',
  marketData: 'נתוני שוק',
  tradingSignals: 'איתותי מסחר',
  tradingView: 'אינטגרציית TradingView',
  assetTracker: 'מעקב נכסים',
  socialMonitoring: 'ניטור רשתות חברתיות',
  settings: 'הגדרות',
  users: 'ניהול משתמשים',
  systemLogs: 'לוגים מערכתיים'
};

const UserPermissionsForm: React.FC<UserPermissionsFormProps> = ({ user, onClose }) => {
  const [permissions, setPermissions] = useState<Permission[]>([...user.permissions]);
  const [isLoading, setIsLoading] = useState(false);

  const resourcesList: ResourceDisplay[] = AvailableResources.map(resource => ({
    id: resource,
    name: resourceDisplayNames[resource] || resource
  }));

  const getPermissionForResource = (resource: string): Permission => {
    const found = permissions.find(p => p.resource === resource);
    if (found) return found;
    
    return {
      resource,
      canView: false,
      canEdit: false,
      canDelete: false
    };
  };

  const handlePermissionChange = (resource: string, type: 'view' | 'edit' | 'delete', value: boolean) => {
    setPermissions(prev => 
      prev.map(p => 
        p.resource === resource 
          ? { 
              ...p, 
              [type === 'view' ? 'canView' : type === 'edit' ? 'canEdit' : 'canDelete']: value,
              // If a higher permission is granted, grant lower permissions too
              ...(type === 'delete' && value ? { canEdit: true, canView: true } : {}),
              ...(type === 'edit' && value ? { canView: true } : {}),
              // If a lower permission is revoked, revoke higher permissions too
              ...(type === 'view' && !value ? { canEdit: false, canDelete: false } : {}),
              ...(type === 'edit' && !value ? { canDelete: false } : {})
            } 
          : p
      )
    );
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const success = updateUserPermissions(user.id, permissions);
      if (success) {
        onClose();
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <ScrollArea className="h-[300px] rounded-md border p-4">
        <table className="w-full">
          <thead>
            <tr className="text-right">
              <th className="pb-2">משאב</th>
              <th className="pb-2 text-center">צפייה</th>
              <th className="pb-2 text-center">עריכה</th>
              <th className="pb-2 text-center">מחיקה</th>
            </tr>
          </thead>
          <tbody>
            {resourcesList.map(resource => {
              const permission = getPermissionForResource(resource.id);
              return (
                <tr key={resource.id} className="border-t">
                  <td className="py-2 font-medium">{resource.name}</td>
                  <td className="py-2 text-center">
                    <Checkbox 
                      checked={permission.canView} 
                      onCheckedChange={(checked) => 
                        handlePermissionChange(resource.id, 'view', !!checked)
                      }
                      disabled={isLoading || (user.role === 'admin' && resource.id === 'users')}
                    />
                  </td>
                  <td className="py-2 text-center">
                    <Checkbox 
                      checked={permission.canEdit} 
                      onCheckedChange={(checked) => 
                        handlePermissionChange(resource.id, 'edit', !!checked)
                      }
                      disabled={isLoading || !permission.canView || (user.role === 'admin' && resource.id === 'users')}
                    />
                  </td>
                  <td className="py-2 text-center">
                    <Checkbox 
                      checked={permission.canDelete} 
                      onCheckedChange={(checked) => 
                        handlePermissionChange(resource.id, 'delete', !!checked)
                      }
                      disabled={isLoading || !permission.canEdit || (user.role === 'admin' && resource.id === 'users')}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </ScrollArea>

      <div className="flex justify-end gap-2 pt-2">
        <Button 
          variant="outline" 
          onClick={onClose}
          disabled={isLoading}
        >
          ביטול
        </Button>
        <Button 
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? 'שומר הרשאות...' : 'שמור הרשאות'}
        </Button>
      </div>
    </div>
  );
};

export default UserPermissionsForm;
