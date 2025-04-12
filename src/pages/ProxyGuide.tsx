
import React from 'react';
import ProxyConnectionGuide from '@/components/guides/ProxyConnectionGuide';

const ProxyGuide = () => {
  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <h1 className="text-3xl font-bold mb-6 text-right">מדריך התחברות לשרת פרוקסי</h1>
      
      <div className="grid grid-cols-1 gap-6">
        <ProxyConnectionGuide />
      </div>
    </div>
  );
};

export default ProxyGuide;
