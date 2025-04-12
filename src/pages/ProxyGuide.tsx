
import React from 'react';
import { Container } from '@/components/ui/container';
import ProxyConfigGuide from '@/components/guides/proxy/ProxyConfigGuide';

const ProxyGuide = () => {
  return (
    <Container className="py-8">
      <h1 className="text-3xl font-bold mb-6 text-right">הגדרת שרת פרוקסי</h1>
      <ProxyConfigGuide />
    </Container>
  );
};

export default ProxyGuide;
