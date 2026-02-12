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

  // --- Photo Navigation (within same memory) ---
  const handlePrevPhoto = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!hasGallery) return;
    setGalleryIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const handleNextPhoto = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!hasGallery) return;
    setGalleryIndex((prev) => (prev + 1) % allImages.length);
  };

  // --- Memory Navigation (between milestones) ---
  const handlePrevMemory = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedIndex === null) return;
    const newIndex = (selectedIndex - 1 + milestones.length) % milestones.length;
    onChange(newIndex);
  };

  const handleNextMemory = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedIndex === null) return;
    const newIndex = (selectedIndex + 1) % milestones.length;
    onChange(newIndex);
  };

  // Keyboard: arrows = photos, shift+arrows = memories
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') {
        if (hasGallery) handlePrevPhoto();
        else handlePrevMemory();
      }
      if (e.key === 'ArrowRight') {
        if (hasGallery) handleNextPhoto();
        else handleNextMemory();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, galleryIndex, hasGallery, allImages.length]);

  // Swipe: swipe = photos (if gallery), otherwise memories
  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const SWIPE_THRESHOLD = 50;
    if (info.offset.x > SWIPE_THRESHOLD) {
      if (hasGallery) handlePrevPhoto();
      else handlePrevMemory();
    } else if (info.offset.x < -SWIPE_THRESHOLD) {
      if (hasGallery) handleNextPhoto();
      else handleNextMemory();
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
      const newScale = Math.min(Math.max(1, pinchRef.current.startScale * ratio), 4);
      setScale(newScale);
    }
  };

  const handleTouchEnd = () => {
    pinchRef.current = null;
    if (scale < 1.1) setScale(1);
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
          className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-dark/95 backdrop-blur-md group"
          onClick={onClose}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 md:top-6 md:right-6 z-50 text-white/50 hover:text-white transition-colors"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          {/* ===== MAIN CONTENT AREA ===== */}
          <div
            className="relative w-full h-full flex flex-col items-center justify-center px-4 md:px-16 pt-14 pb-28 md:pb-20"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Photo Navigation Arrows (cycle within gallery) */}
            {hasGallery && (
              <>
                <button
                  onClick={handlePrevPhoto}
                  className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 z-50 text-white/70 hover:text-white transition-all p-2 md:p-4 opacity-0 group-hover:opacity-100 md:transform md:-translate-x-4 md:group-hover:translate-x-0 duration-300"
                  aria-label="Previous photo"
                >
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6"></polyline>
                  </svg>
                </button>

                <button
                  onClick={handleNextPhoto}
                  className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 z-50 text-white/70 hover:text-white transition-all p-2 md:p-4 opacity-0 group-hover:opacity-100 md:transform md:translate-x-4 md:group-hover:translate-x-0 duration-300"
                  aria-label="Next photo"
                >
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </button>
              </>
            )}

            {/* Image Area */}
            <motion.div
              key={`${currentMilestone.id}-${galleryIndex}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="relative w-full flex-1 flex items-center justify-center min-h-0"
              drag={isZoomed ? false : "x"}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.7}
              onDragEnd={handleDragEnd}
              ref={containerRef}
            >
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

            {/* Gallery Dots (photo indicators) */}
            {hasGallery && (
              <div className="flex items-center gap-2 mt-3">
                {allImages.map((_, i) => (
                  <button
                    key={i}
                    onClick={(e) => { e.stopPropagation(); setGalleryIndex(i); }}
                    className={`rounded-full transition-all ${i === galleryIndex
                      ? 'w-3 h-3 bg-brand-red'
                      : 'w-2 h-2 bg-white/30 hover:bg-white/60'
                      }`}
                  />
                ))}
              </div>
            )}

            {/* Bottom Info Bar */}
            <div className="w-full mt-4 md:mt-6 pointer-events-none">
              <div className="flex flex-col items-center text-center gap-1">
                <span className="font-serif italic text-brand-red text-base md:text-lg tracking-wide">
                  {currentMilestone.year} — {currentMilestone.category}
                </span>
                <h2 className="font-display text-2xl md:text-5xl text-white uppercase tracking-tight leading-none">
                  {currentMilestone.title}
                </h2>
              </div>
            </div>

            {/* Memory Navigation Bar (separate from photo arrows) */}
            <div className="absolute bottom-4 md:bottom-6 left-0 right-0 flex items-center justify-center gap-6 z-50 pointer-events-auto">
              <button
                onClick={handlePrevMemory}
                className="flex items-center gap-2 text-white/40 hover:text-white transition-colors text-xs uppercase tracking-widest font-sans"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
                <span className="hidden md:inline">Prev Memory</span>
              </button>

              <span className="text-white/30 font-display text-sm tracking-widest">
                {selectedIndex !== null ? (selectedIndex + 1).toString().padStart(2, '0') : '00'} / {milestones.length.toString().padStart(2, '0')}
              </span>

              <button
                onClick={handleNextMemory}
                className="flex items-center gap-2 text-white/40 hover:text-white transition-colors text-xs uppercase tracking-widest font-sans"
              >
                <span className="hidden md:inline">Next Memory</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Swipe Hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="absolute bottom-16 left-1/2 -translate-x-1/2 md:hidden text-white/20 text-[10px] uppercase tracking-widest pointer-events-none whitespace-nowrap"
          >
            {hasGallery ? 'Swipe for photos • Double tap to zoom' : 'Double tap to zoom'}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Lightbox;