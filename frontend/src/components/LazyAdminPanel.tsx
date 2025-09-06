import React, { Suspense } from 'react';
import LoadingSpinner from './LoadingSpinner';

// Lazy load the AdminPanel component
const AdminPanel = React.lazy(() => import('../pages/AdminPanel'));

const LazyAdminPanel: React.FC = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    }>
      <AdminPanel />
    </Suspense>
  );
};

export default LazyAdminPanel;
