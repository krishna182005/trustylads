import React, { useState, useRef, useEffect } from 'react';
import { X, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [rotation, setRotation] = useState(0);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.5, 3));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.5, 0.5));
  };

  const handleReset = () => {
    setScale(1);
    setRotation(0);
  };

  const handleRotate = () => {
    setRotation(prev => prev + 90);
  };

  const handleWheel = (e: WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      handleZoomIn();
    } else {
      handleZoomOut();
    }
  };

  useEffect(() => {
    const container = imageContainerRef.current;
    if (container && isOpen) {
      container.addEventListener('wheel', handleWheel, { passive: false });
      return () => {
        container.removeEventListener('wheel', handleWheel);
      };
    }
  }, [isOpen]);

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
              onClick={handleRotate}
              className="bg-black bg-opacity-50 text-white p-1.5 sm:p-2 rounded-lg hover:bg-opacity-75 transition-all"
              title="Rotate"
            >
              <RotateCcw className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
            <button
              onClick={handleReset}
              className="bg-black bg-opacity-50 text-white p-1.5 sm:p-2 rounded-lg hover:bg-opacity-75 transition-all"
              title="Reset"
            >
              <RotateCcw className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>

          {/* Image Container */}
          <div
            ref={imageContainerRef}
            className="relative overflow-hidden cursor-move w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
            style={{ touchAction: 'none' }}
          >
            <motion.img
              src={imageUrl}
              alt={alt}
              className="w-full h-full object-contain"
              style={{
                transform: `scale(${scale}) rotate(${rotation}deg)`,
                transformOrigin: 'center'
              }}
              drag
              dragConstraints={{
                left: -100,
                right: 100,
                top: -100,
                bottom: 100
              }}
              dragElastic={0.1}
            />
          </div>

          {/* Zoom Level Indicator */}
          <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 bg-black bg-opacity-50 text-white px-2 py-1 sm:px-3 sm:py-2 rounded-lg">
            <span className="text-xs sm:text-sm">
              {Math.round(scale * 100)}% | {rotation}°
            </span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProductImageZoom;
