
import React from 'react';
import { Container } from '@/components/ui/container';
import RequireAuth from '@/components/auth/RequireAuth';

const Assets = () => {
  return (
    <RequireAuth>
      <Container className="py-6">
        <h1 className="text-3xl font-bold tracking-tight mb-4">נכסים</h1>
        <p className="text-muted-foreground">רשימת הנכסים שלך והסטטוס העדכני שלהם</p>
      </Container>
    </RequireAuth>
  );
};

export default Assets;
