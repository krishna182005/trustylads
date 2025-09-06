/**
 * Image Optimization Utilities
 * Provides responsive image loading and optimization helpers
 */

export interface ImageOptimizationOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'avif' | 'jpeg' | 'png';
  lazy?: boolean;
}

/**
 * Generate optimized image URL with responsive parameters
 */
export const getOptimizedImageUrl = (
  originalUrl: string,
  options: ImageOptimizationOptions = {}
): string => {
  if (!originalUrl) return '';
  
  const {
    width,
    height
    // quality = 80,
    // format = 'webp',
    // lazy = true
  } = options;

  // Handle different image sources
  if (originalUrl.includes('pexels.com')) {
    // Pexels optimization
    const baseUrl = originalUrl.split('?')[0];
    const params = new URLSearchParams();
    if (width) params.set('w', width.toString());
    if (height) params.set('h', height.toString());
    params.set('auto', 'compress');
    params.set('cs', 'tinysrgb');
    params.set('dpr', '2');
    return `${baseUrl}?${params.toString()}`;
  }
  
  if (originalUrl.includes('pixabay.com')) {
    // Pixabay optimization - use smaller sizes
    if (width && width <= 640) {
      return originalUrl.replace('_1280', '_640');
    }
    return originalUrl;
  }
  
  if (originalUrl.includes('ui-avatars.com')) {
    // UI Avatars optimization
    const url = new URL(originalUrl);
    if (width) url.searchParams.set('size', `${width}x${height || width}`);
    return url.toString();
  }
  
  // For local images, return as-is
  return originalUrl;
};

/**
 * Generate responsive image srcset
 */
export const generateSrcSet = (
  baseUrl: string,
  sizes: number[] = [320, 640, 768, 1024, 1280, 1920]
): string => {
  return sizes
    .map(size => {
      const optimizedUrl = getOptimizedImageUrl(baseUrl, { width: size });
      return `${optimizedUrl} ${size}w`;
    })
    .join(', ');
};

/**
 * Get appropriate image size based on container
 */
export const getImageSize = (containerWidth: number): number => {
  // Return 2x the container width for retina displays
  return Math.min(containerWidth * 2, 1920);
};

/**
 * Check if image should be lazy loaded
 */
export const shouldLazyLoad = (index: number, threshold: number = 3): boolean => {
  return index >= threshold;
};

/**
 * Generate placeholder for images
 */
export const generatePlaceholder = (width: number, height: number): string => {
  return `data:image/svg+xml;base64,${btoa(`
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f3f4f6"/>
      <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#9ca3af" font-family="Inter, sans-serif" font-size="14">Loading...</text>
    </svg>
  `)}`;
};

/**
 * Preload critical images
 */
export const preloadImage = (url: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = url;
  });
};

/**
 * Batch preload images
 */
export const preloadImages = async (urls: string[]): Promise<void> => {
  const promises = urls.map(url => preloadImage(url));
  await Promise.allSettled(promises);
};
