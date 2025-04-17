
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import WhatIsProxyTab from './proxy/WhatIsProxyTab';
import WhenUseProxyTab from './proxy/WhenUseProxyTab';
import SetupProxyTab from './proxy/SetupProxyTab';
import TestingProxyTab from './proxy/TestingProxyTab';

const ProxyConnectionGuide = () => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-right text-xl lg:text-2xl">מדריך מפורט להתחברות לשרת פרוקסי</CardTitle>
        <CardDescription className="text-right text-base">
          מדריך מדוייק להתחברות לשרת פרוקסי ללא ידע מקדים
        </CardDescription>
      </CardHeader>
      <CardContent className="text-right">
        <Tabs defaultValue="what-is" className="w-full space-y-5">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="what-is">מה זה פרוקסי?</TabsTrigger>
            <TabsTrigger value="when-use">מתי להשתמש?</TabsTrigger>
            <TabsTrigger value="setup">הגדרה</TabsTrigger>
            <TabsTrigger value="testing">בדיקה</TabsTrigger>
          </TabsList>
          
          <TabsContent value="what-is" className="space-y-4">
            <WhatIsProxyTab />
          </TabsContent>
          
          <TabsContent value="when-use" className="space-y-4">
            <WhenUseProxyTab />
          </TabsContent>
          
          <TabsContent value="setup" className="space-y-4">
            <SetupProxyTab />
          </TabsContent>
          
          <TabsContent value="testing" className="space-y-4">
            <TestingProxyTab />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ProxyConnectionGuide;
