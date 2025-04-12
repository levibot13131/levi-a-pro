
import React from 'react';
import { Container } from '@/components/ui/container';

const Portfolio = () => {
  return (
    <Container className="py-6">
      <h1 className="text-3xl font-bold tracking-tight">תיק השקעות</h1>
      <p className="text-muted-foreground">מעקב אחר תיק ההשקעות שלך</p>
      
      <div className="mt-6">
        <p>תוכן עמוד תיק ההשקעות יופיע כאן</p>
      </div>
    </Container>
  );
};

export default Portfolio;
