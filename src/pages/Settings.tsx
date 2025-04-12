
import React from 'react';
import { Container } from '@/components/ui/container';
import RequireAuth from '@/components/auth/RequireAuth';

const Settings = () => {
  return (
    <RequireAuth>
      <Container className="py-6">
        <h1 className="text-3xl font-bold tracking-tight mb-4">הגדרות</h1>
        <p className="text-muted-foreground">הגדרות המערכת והחשבון שלך</p>
      </Container>
    </RequireAuth>
  );
};

export default Settings;
