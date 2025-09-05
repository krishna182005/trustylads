import React, { useState, useRef, useEffect } from 'react';
import { X, ZoomIn, ZoomOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getSafeImageUrl } from '../utils/helpers';

interface ProductImageZoomProps {
  imageUrl: string;
  alt: string;
  isOpen: boolean;
  onClose: () => void;
}

const ProductImageZoom: React.FC<ProductImageZoomProps> = ({
  imageUrl,
  alt,
  isOpen,
  onClose
}) => {
  const [scale, setScale] = useState(1);
  const [lastTouchDistance, setLastTouchDistance] = useState(0);
  const [lastTapTime, setLastTapTime] = useState(0);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.5, 3));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.5, 0.5));
  };

  const handleReset = () => setScale(1);

  const handleWheel = (e: WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      handleZoomIn();
    } else {
      handleZoomOut();
    }
  };

  // Touch gesture handling for mobile zoom
  const getTouchDistance = (touches: TouchList) => {
    if (touches.length < 2) return 0;
    const touch1 = touches[0];
    const touch2 = touches[1];
    return Math.sqrt(
      Math.pow(touch2.clientX - touch1.clientX, 2) +
      Math.pow(touch2.clientY - touch1.clientY, 2)
    );
  };

  const handleTouchStart = (e: TouchEvent) => {
    if (e.touches.length === 2) {
      setLastTouchDistance(getTouchDistance(e.touches));
    } else if (e.touches.length === 1) {
      // Single touch - check for double tap
      const currentTime = Date.now();
      if (currentTime - lastTapTime < 300) {
        // Double tap detected
        if (scale === 1) {
          setScale(2);
        } else {
          setScale(1);
        }
      }
      setLastTapTime(currentTime);
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      const currentDistance = getTouchDistance(e.touches);
      if (lastTouchDistance > 0) {
        const scaleChange = currentDistance / lastTouchDistance;
        setScale(prev => {
          const newScale = prev * scaleChange;
          return Math.max(0.5, Math.min(3, newScale));
        });
      }
      setLastTouchDistance(currentDistance);
    }
  };

  const handleTouchEnd = () => {
    setLastTouchDistance(0);
  };

  useEffect(() => {
    const container = imageContainerRef.current;
    if (container && isOpen) {
      // Desktop wheel zoom
      container.addEventListener('wheel', handleWheel, { passive: false });
      
      // Mobile touch zoom
      container.addEventListener('touchstart', handleTouchStart, { passive: false });
      container.addEventListener('touchmove', handleTouchMove, { passive: false });
      container.addEventListener('touchend', handleTouchEnd, { passive: false });
      
      return () => {
        container.removeEventListener('wheel', handleWheel);
        container.removeEventListener('touchstart', handleTouchStart);
        container.removeEventListener('touchmove', handleTouchMove);
        container.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isOpen, lastTouchDistance]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-2 sm:p-4"
        onClick={onClose}
      >
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 text-white hover:text-yellow-400 transition-colors"
          >
            <X className="h-6 w-6 sm:h-8 sm:w-8" />
          </button>

          {/* Zoom Controls */}
          <div className="absolute top-2 left-2 sm:top-4 sm:left-4 z-10 flex space-x-1 sm:space-x-2">
            <button
              onClick={handleZoomIn}
              className="bg-black bg-opacity-50 text-white p-1.5 sm:p-2 rounded-lg hover:bg-opacity-75 transition-all"
              title="Zoom In"
            >
              <ZoomIn className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
            <button
              onClick={handleZoomOut}
              className="bg-black bg-opacity-50 text-white p-1.5 sm:p-2 rounded-lg hover:bg-opacity-75 transition-all"
              title="Zoom Out"
            >
              <ZoomOut className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
            <button
              onClick={handleReset}
              className="bg-black bg-opacity-50 text-white p-1.5 sm:p-2 rounded-lg hover:bg-opacity-75 transition-all"
              title="Reset"
            >
              R
            </button>
          </div>

          {/* Image Container */}
          <div
            ref={imageContainerRef}
            className="relative overflow-hidden cursor-move w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
            style={{ 
              touchAction: 'none',
              WebkitUserSelect: 'none',
              userSelect: 'none',
              WebkitTouchCallout: 'none'
            }}
          >
            <motion.div
              className="w-full h-full"
              style={{ transform: `scale(${scale})`, transformOrigin: 'center' }}
              drag
              dragConstraints={{
                left: -100,
                right: 100,
                top: -100,
                bottom: 100
              }}
              dragElastic={0.1}
            >
              <img
                src={getSafeImageUrl(imageUrl)}
                alt={alt}
                className="w-full h-full object-contain select-none"
                draggable={false}
              />
            </motion.div>
          </div>

          {/* Zoom Level Indicator */}
          <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 bg-black bg-opacity-50 text-white px-2 py-1 sm:px-3 sm:py-2 rounded-lg">
            <span className="text-xs sm:text-sm">
              {Math.round(scale * 100)}%
            </span>
          </div>

          {/* Desktop Instructions */}
          <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 bg-black bg-opacity-50 text-white px-2 py-1 sm:px-3 sm:py-2 rounded-lg hidden sm:block">
            <span className="text-xs sm:text-sm">
              Pinch to zoom • Double tap to toggle
            </span>
          </div>

          {/* Mobile Instructions */}
          <div className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-black bg-opacity-50 text-white px-2 py-1 sm:px-3 sm:py-2 rounded-lg sm:hidden">
            <span className="text-xs">
              Pinch to zoom • Double tap to toggle
            </span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProductImageZoom;
