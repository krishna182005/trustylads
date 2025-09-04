import { useEffect } from 'react';

// interface PerformanceMetrics {
//   fcp?: number;
//   lcp?: number;
//   fid?: number;
//   cls?: number;
//   ttfb?: number;
// }

export const usePerformance = () => {
  useEffect(() => {
    // Only run in production
    if (import.meta.env.DEV) return;

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'paint') {
          if (entry.name === 'first-contentful-paint') {
            console.log('FCP:', entry.startTime);
          }
        }
        
        if (entry.entryType === 'largest-contentful-paint') {
          console.log('LCP:', entry.startTime);
        }
        
        if (entry.entryType === 'layout-shift') {
          console.log('CLS:', (entry as any).value);
        }
      }
    });

    try {
      observer.observe({ entryTypes: ['paint', 'largest-contentful-paint', 'layout-shift'] });
    } catch (e) {
      // Fallback for browsers that don't support all entry types
      observer.observe({ entryTypes: ['paint'] });
    }

    return () => observer.disconnect();
  }, []);
};

export const measurePerformance = (name: string, fn: () => void) => {
  const start = performance.now();
  fn();
  const end = performance.now();
  console.log(`${name} took ${end - start} milliseconds`);
};

export const preloadCriticalResources = () => {
  // Preload critical images
  const criticalImages = [
    '/logo.svg',
    // Add other critical images here
  ];

  criticalImages.forEach(src => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
  });

  // System fonts are already available, no preloading needed
};
