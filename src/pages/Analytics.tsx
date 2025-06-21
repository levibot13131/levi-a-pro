
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PerformanceDashboard } from '@/components/analytics/PerformanceDashboard';
import { ReportGenerator } from '@/components/analytics/ReportGenerator';
import { UserAccessControl } from '@/components/admin/UserAccessControl';
import { AuditLogs } from '@/components/admin/AuditLogs';
import { BarChart3, FileText, Users, History } from 'lucide-react';

const Analytics = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">LeviPro Analytics & Management</h1>
        <p className="text-muted-foreground">
          Comprehensive performance tracking, reporting, and user management system
        </p>
      </div>

      <Tabs defaultValue="performance" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Reports
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            User Access
          </TabsTrigger>
          <TabsTrigger value="audit" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            Audit Logs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-6">
          <PerformanceDashboard />
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <ReportGenerator />
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <UserAccessControl />
        </TabsContent>

        <TabsContent value="audit" className="space-y-6">
          <AuditLogs />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;
