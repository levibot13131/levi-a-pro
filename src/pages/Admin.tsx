
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Shield, Users, FileText, Settings, BarChart3, Brain } from 'lucide-react';
import { UserAccessControl } from '@/components/admin/UserAccessControl';
import { ReportGenerator } from '@/components/analytics/ReportGenerator';
import TradingJournalDashboard from '@/components/journal/TradingJournalDashboard';
import AIIntelligenceDashboard from '@/components/ai/AIIntelligenceDashboard';

const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState('users');

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Admin Header */}
      <Card className="border-2 border-purple-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Shield className="h-6 w-6 text-purple-500" />
            LeviPro Admin Dashboard
            <Badge variant="outline" className="text-purple-600">
              Full Control Panel
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded">
              <div className="text-2xl font-bold text-blue-600">2</div>
              <div className="text-sm text-muted-foreground">Active Users</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded">
              <div className="text-2xl font-bold text-green-600">127</div>
              <div className="text-sm text-muted-foreground">Signals Sent</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded">
              <div className="text-2xl font-bold text-purple-600">78%</div>
              <div className="text-sm text-muted-foreground">Success Rate</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded">
              <div className="text-2xl font-bold text-orange-600">91%</div>
              <div className="text-sm text-muted-foreground">AI Confidence</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Admin Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full">
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            User Management
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Reports & Analytics
          </TabsTrigger>
          <TabsTrigger value="ai" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            AI Intelligence
          </TabsTrigger>
          <TabsTrigger value="journal" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Trading Journal
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            System Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <UserAccessControl />
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <ReportGenerator />
        </TabsContent>

        <TabsContent value="ai" className="space-y-4">
          <AIIntelligenceDashboard />
        </TabsContent>

        <TabsContent value="journal" className="space-y-4">
          <TradingJournalDashboard />
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded">
                  <h4 className="font-semibold mb-2">Signal Engine Settings</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Min Confidence:</span>
                      <span className="font-semibold ml-2">70%</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Min R/R Ratio:</span>
                      <span className="font-semibold ml-2">1.2</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Analysis Interval:</span>
                      <span className="font-semibold ml-2">30 seconds</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Daily Signal Limit:</span>
                      <span className="font-semibold ml-2">10</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded">
                  <h4 className="font-semibold mb-2">AI Intelligence Status</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Signal Memory AI:</span>
                      <Badge variant="outline" className="text-green-600">Active</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Correlation Engine:</span>
                      <Badge variant="outline" className="text-green-600">Active</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Timeframe Confirmation:</span>
                      <Badge variant="outline" className="text-green-600">Active</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Learning Engine:</span>
                      <Badge variant="outline" className="text-green-600">Active</Badge>
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded">
                  <h4 className="font-semibold mb-2">Integration Status</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Telegram Bot:</span>
                      <Badge variant="outline" className="text-green-600">Connected</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>CoinGecko API:</span>
                      <Badge variant="outline" className="text-green-600">Connected</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Supabase Database:</span>
                      <Badge variant="outline" className="text-green-600">Connected</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>News Feed:</span>
                      <Badge variant="outline" className="text-green-600">Active</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
