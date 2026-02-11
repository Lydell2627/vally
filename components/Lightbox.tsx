import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { Milestone } from '../constants';

interface LightboxProps {
  selectedIndex: number | null;
  milestones: Milestone[];
  onClose: () => void;
  onChange: (index: number) => void;
}

const Lightbox: React.FC<LightboxProps> = ({ selectedIndex, milestones, onClose, onChange }) => {
  const isOpen = selectedIndex !== null;
  const currentMilestone = selectedIndex !== null ? milestones[selectedIndex] : null;

  // Gallery State (for multiple images per milestone)
  const [galleryIndex, setGalleryIndex] = useState(0);

  // Build full image list for current milestone
  const allImages = currentMilestone
    ? [currentMilestone.image, ...(currentMilestone.images || [])].filter(Boolean)
    : [];
  const currentImage = allImages[galleryIndex] || currentMilestone?.image || '';
  const hasGallery = allImages.length > 1;

  // Zoom State
  const [scale, setScale] = useState(1);
  const pinchRef = useRef<{ dist: number; startScale: number } | null>(null);
  const lastTapRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Reset zoom and gallery index when changing slides
  useEffect(() => {
    setScale(1);
    setGalleryIndex(0);
  }, [selectedIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex]);

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedIndex === null) return;
    const newIndex = (selectedIndex - 1 + milestones.length) % milestones.length;
    onChange(newIndex);
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedIndex === null) return;
    const newIndex = (selectedIndex + 1) % milestones.length;
    onChange(newIndex);
  };

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const SWIPE_THRESHOLD = 50;
    if (info.offset.x > SWIPE_THRESHOLD) {
      handlePrev();
    } else if (info.offset.x < -SWIPE_THRESHOLD) {
      handleNext();
    }
  };

  // --- Zoom Logic ---

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      pinchRef.current = { dist, startScale: scale };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && pinchRef.current) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const ratio = dist / pinchRef.current.dist;
      // Limit zoom between 1x and 4x
      const newScale = Math.min(Math.max(1, pinchRef.current.startScale * ratio), 4);
      setScale(newScale);
    }
  };

  const handleTouchEnd = () => {
    pinchRef.current = null;
    if (scale < 1.1) setScale(1); // Snap back if barely zoomed
  };

  const handleDoubleTap = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;
    if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
      if (scale > 1.2) {
        setScale(1);
      } else {
        setScale(2.5);
      }
    } else {
      lastTapRef.current = now;
    }
  };

  const isZoomed = scale > 1.1;

  return (
    <AnimatePresence>
      {isOpen && currentMilestone && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-dark/95 backdrop-blur-md p-4 md:p-10 group"
          onClick={onClose}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 z-50 text-white/50 hover:text-white transition-colors"
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          {/* Navigation Buttons (Desktop) */}
          <button
            onClick={handlePrev}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-50 text-white hover:text-brand-red transition-all p-4 hidden md:block opacity-0 group-hover:opacity-100 transform -translate-x-4 group-hover:translate-x-0 duration-500 ease-out"
            aria-label="Previous image"
          >
            <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>

          <button
            onClick={handleNext}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-50 text-white hover:text-brand-red transition-all p-4 hidden md:block opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 duration-500 ease-out"
            aria-label="Next image"
          >
            <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>

          {/* Content Container */}
          <div
            className="relative w-full h-full flex flex-col md:flex-row items-center justify-center max-w-7xl mx-auto pt-12 pb-24 md:py-0"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 
                Swipe/Drag Container 
                - Handles Swipe Navigation when NOT zoomed.
            */}
            <motion.div
              key={currentMilestone.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="relative w-full flex-1 md:h-[80vh] flex items-center justify-center min-h-0"
              drag={isZoomed ? false : "x"}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.7}
              onDragEnd={handleDragEnd}
              ref={containerRef}
            >
              {/* 
                  Zoom/Pan Container 
                  - Handles Pinch Zoom & Pan when zoomed.
              */}
              <motion.div
                className={`w-full h-full flex items-center justify-center ${isZoomed ? 'cursor-grab active:cursor-grabbing' : 'cursor-zoom-in'}`}
                animate={{ scale: scale }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                drag={isZoomed}
                dragConstraints={containerRef}
                dragElastic={0.2}
                onClick={handleDoubleTap}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                style={{ touchAction: 'none' }}
              >
                <img
                  src={currentImage}
                  alt={currentMilestone.title}
                  draggable={false}
                  className="max-w-full max-h-full object-contain shadow-2xl rounded-sm select-none"
                />
              </motion.div>
            </motion.div>

            {/* Gallery Thumbnails (if multiple images) */}
            {hasGallery && (
              <div className="flex items-center justify-center gap-2 mt-4">
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={(e) => { e.stopPropagation(); setGalleryIndex(i); }}
                    className={`w-12 h-12 md:w-16 md:h-16 rounded-sm overflow-hidden border-2 transition-all ${i === galleryIndex ? 'border-brand-red scale-110' : 'border-white/20 opacity-50 hover:opacity-80'
                      }`}
                  >
                    <img src={img} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            <motion.div
              key={`text-${currentMilestone.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="w-full text-center md:text-left md:absolute md:bottom-0 md:left-0 pointer-events-none mt-6 md:mt-0 z-20"
            >
              <div className="flex flex-col md:flex-row items-center md:items-end justify-center md:justify-between gap-2 md:gap-8 px-4">
                <div className="text-center md:text-left">
                  <span className="block font-serif italic text-brand-red text-lg md:text-xl mb-1">{currentMilestone.year} — {currentMilestone.category}</span>
                  <h2 className="font-display text-3xl md:text-6xl text-white uppercase tracking-tight leading-none">{currentMilestone.title}</h2>
                  <p className="font-sans text-white/80 text-sm md:text-base mt-2 max-w-md mx-auto md:mx-0 line-clamp-3 md:line-clamp-none">
                    {currentMilestone.description}
                  </p>
                </div>
                <div className="hidden md:block text-white/40 font-display text-xl tracking-widest">
                  {selectedIndex !== null ? (selectedIndex + 1).toString().padStart(2, '0') : '00'} / {milestones.length.toString().padStart(2, '0')}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Mobile Swipe Hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 md:hidden text-white/30 text-xs uppercase tracking-widest pointer-events-none whitespace-nowrap"
          >
            Swipe to navigate • Double tap to zoom
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Lightbox;