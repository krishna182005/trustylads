import React from 'react';
import TrustBadges from '../components/TrustBadges';

const BadgesDemo: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">TrustBadges Component Demo</h1>
          <p className="text-gray-600">Default rendering</p>
        </div>
        <TrustBadges />

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Tight footer variant</h2>
          <p className="text-gray-600">Using className to add spacing</p>
        </div>
        <TrustBadges className="mt-6" />

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Checkout-wide variant</h2>
          <p className="text-gray-600">Full-width container</p>
        </div>
        <div className="w-full">
          <TrustBadges />
        </div>
      </div>
    </div>
  );
};

export default BadgesDemo;


