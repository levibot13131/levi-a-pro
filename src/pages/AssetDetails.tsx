
import React from 'react';
import { useParams } from 'react-router-dom';
import { Container } from '@/components/ui/container';
import RequireAuth from '@/components/auth/RequireAuth';

const AssetDetails = () => {
  const { id } = useParams();
  
  return (
    <RequireAuth>
      <Container className="py-6">
        <h1 className="text-3xl font-bold tracking-tight mb-4">פרטי נכס</h1>
        <p className="text-muted-foreground">מזהה נכס: {id}</p>
      </Container>
    </RequireAuth>
  );
};

export default AssetDetails;
