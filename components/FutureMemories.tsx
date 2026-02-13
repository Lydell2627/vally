
import React, { useRef, useEffect, useState } from 'react';
import { FUTURE_MEMORIES, AUDIO_TRACKS } from '../constants';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { useAudio } from './AudioProvider';

interface FutureMemoriesProps {
  content?: any[];
  gallery?: any[];
}

const FutureMemories: React.FC<FutureMemoriesProps> = ({ content, gallery }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { setTrack, togglePlay, isPlaying: isGlobalPlaying } = useAudio();

  // Experience State
  const [mode, setMode] = useState<'IDLE' | 'PLAYING'>('IDLE');
  const [currentIndex, setCurrentIndex] = useState(0);
  const wasPlayingRef = useRef(false);

  // Gallery Lightbox State
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [photoIndex, setPhotoIndex] = useState(0);

  const memoriesData = content || FUTURE_MEMORIES;
  const galleryData = gallery || [];

  // Trigger audio when section comes into view
  const isInView = useInView(containerRef, { amount: 0.3 });
  useEffect(() => {
    if (isInView && mode === 'IDLE') setTrack(AUDIO_TRACKS.FUTURE);
  }, [isInView, setTrack, mode]);

  // Handle Entrance (Pause global, start reel)
  const startExperience = () => {
    wasPlayingRef.current = isGlobalPlaying;
    if (isGlobalPlaying) {
      togglePlay(); // Pause global ambient
    }
    setMode('PLAYING');
    setCurrentIndex(0);
  };

  // Handle Exit (Resume global if it was playing before)
  const endExperience = () => {
    setMode('IDLE');
    if (wasPlayingRef.current && !isGlobalPlaying) {
      togglePlay();
    }
  };

  // Slide Logic (Timed slideshow, no local audio)
  useEffect(() => {
    if (mode === 'PLAYING' && memoriesData.length > 0) {
      const SLIDE_DURATION = 4000; // 4 seconds per slide
      const TOTAL_REEL_TIME = memoriesData.length * SLIDE_DURATION;

      // Auto-end reel after all slides have shown
      const endTimer = setTimeout(endExperience, TOTAL_REEL_TIME);

      const interval = setInterval(() => {
        setCurrentIndex(prev => {
          if (prev === memoriesData.length - 1) return prev;
          return prev + 1;
        });
      }, SLIDE_DURATION);

      return () => {
        clearTimeout(endTimer);
        clearInterval(interval);
      };
    }
  }, [mode, memoriesData]);

  // Safe access to current memory
  const currentMemory = memoriesData[currentIndex] || { title: '', description: '', image: '' };

  // Build all images for current lightbox entry
  const currentGalleryEntry = lightboxIndex !== null ? galleryData[lightboxIndex] : null;
  const allPhotos = currentGalleryEntry
    ? [currentGalleryEntry.image, ...(currentGalleryEntry.images || [])].filter(Boolean)
    : [];
  const hasMultiplePhotos = allPhotos.length > 1;

  // Lightbox navigation
  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setPhotoIndex(0);
  };
  const closeLightbox = () => {
    setLightboxIndex(null);
    setPhotoIndex(0);
  };

  // Photo navigation (within same entry)
  const prevPhoto = () => {
    if (hasMultiplePhotos) {
      setPhotoIndex((prev) => (prev - 1 + allPhotos.length) % allPhotos.length);
    }
  };
  const nextPhoto = () => {
    if (hasMultiplePhotos) {
      setPhotoIndex((prev) => (prev + 1) % allPhotos.length);
    }
  };

  // Entry navigation (between gallery entries)
  const prevEntry = () => {
    if (lightboxIndex !== null && lightboxIndex > 0) {
      setLightboxIndex(lightboxIndex - 1);
      setPhotoIndex(0);
    }
  };
  const nextEntry = () => {
    if (lightboxIndex !== null && lightboxIndex < galleryData.length - 1) {
      setLightboxIndex(lightboxIndex + 1);
      setPhotoIndex(0);
    }
  };

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (lightboxIndex === null) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') {
        if (hasMultiplePhotos) prevPhoto();
        else prevEntry();
      }
      if (e.key === 'ArrowRight') {
        if (hasMultiplePhotos) nextPhoto();
        else nextEntry();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [lightboxIndex, photoIndex, galleryData.length, hasMultiplePhotos, allPhotos.length]);

  return (
    <section id="future" ref={containerRef} className="bg-brand-dark text-white py-24 md:py-40 px-6 overflow-hidden relative min-h-screen">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_rgba(206,18,21,0.05),_transparent_70%)] pointer-events-none" />

      {/* 
        ========================================
        REEL SECTION (Existing behavior)
        ========================================
      */}
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 md:mb-24 text-left flex flex-col md:flex-row justify-between items-start md:items-end"
        >
          <div>
            <div className="flex flex-col md:flex-row items-start md:items-end gap-6 mb-6">
              <h2 className="font-display text-5xl md:text-9xl uppercase leading-[0.85] md:leading-[0.8]">
                Future<br />
                <span className="text-brand-red outline-text">Memories</span>
              </h2>
            </div>
            <p className="font-serif italic text-2xl md:text-3xl text-gray-400 max-w-2xl leading-relaxed">
              We haven't taken these photos yet. <br />
              <span className="text-white/80">But I can already see them clearly.</span>
            </p>
          </div>

          {/* Play Button Trigger */}
          {memoriesData.length > 0 && (
            <motion.button
              onClick={startExperience}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-12 md:mt-0 self-end md:self-auto group relative overflow-hidden rounded-full px-8 py-6 bg-brand-red text-white shadow-[0_0_40px_-10px_rgba(206,18,21,0.6)]"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
              <div className="relative flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white text-brand-red flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <div className="text-left">
                  <span className="block font-display text-lg uppercase tracking-wider leading-none">Play Reel</span>
                  <span className="block font-serif italic text-xs opacity-80">Turn sound on</span>
                </div>
              </div>
            </motion.button>
          )}
        </motion.div>

        {/* The Reel Grid (Visible when IDLE) */}
        {memoriesData.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
            {memoriesData.map((item, i) => (
              <motion.div
                key={item.id || i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.15, duration: 1, ease: [0.22, 1, 0.36, 1] }}
                className="group relative flex flex-col opacity-60 hover:opacity-100 transition-opacity"
              >
                <div className="aspect-[3/4] relative bg-[#0a0a0a] border border-white/10 overflow-hidden">
                  {item.image ? (
                    <img src={item.image} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" alt={item.title} />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white/20">
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="mb-4">
                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                        <circle cx="12" cy="13" r="4" />
                      </svg>
                      <span className="font-display text-sm tracking-widest opacity-50">Pending Exposure</span>
                    </div>
                  )}
                </div>
                <h3 className="font-display text-2xl uppercase mt-6 text-white/40 group-hover:text-white transition-colors">{item.title}</h3>
              </motion.div>
            ))}
          </div>
        )}

        {/* 
          ========================================
          GALLERY SECTION — Cover Image + Lightbox
          ========================================
        */}
        {galleryData.length > 0 && (
          <div className="mt-32 md:mt-48">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12 md:mb-16"
            >
              <h3 className="font-display text-3xl md:text-6xl uppercase leading-[0.85] mb-4">
                The <span className="text-brand-red">Gallery</span>
              </h3>
              <p className="font-serif italic text-lg md:text-2xl text-gray-400">
                {galleryData.length} photos waiting to be taken.
              </p>
            </motion.div>

            {/* Cover Image — click to open gallery */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="relative cursor-pointer group max-w-4xl mx-auto"
              onClick={() => openLightbox(0)}
            >
              <div className="relative overflow-hidden rounded-sm border border-white/10 group-hover:border-white/30 transition-all duration-500">
                {/* Main cover photo */}
                <img
                  src={galleryData[0].image}
                  alt={galleryData[0].title}
                  className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent flex flex-col items-center justify-end pb-8 md:pb-12">
                  {/* Photo count badge */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex -space-x-2">
                      {galleryData.slice(0, 4).map((item, i) => (
                        <div
                          key={i}
                          className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-black overflow-hidden"
                        >
                          <img src={item.image} alt="" className="w-full h-full object-cover" />
                        </div>
                      ))}
                      {galleryData.length > 4 && (
                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-black bg-brand-red flex items-center justify-center">
                          <span className="font-display text-[10px] text-white">+{galleryData.length - 4}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <span className="font-display text-lg md:text-2xl uppercase tracking-widest text-white drop-shadow-lg">
                    View Gallery
                  </span>
                  <span className="font-serif italic text-sm text-white/60 mt-1">
                    {galleryData.length} photos
                  </span>
                </div>

                {/* Subtle shimmer on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
              </div>
            </motion.div>
          </div>
        )}
      </div>

      {/* 
        ========================================
        IMMERSIVE CINEMATIC MODE (Reel Player)
        ========================================
      */}
      <AnimatePresence>
        {mode === 'PLAYING' && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 1.5, ease: "easeInOut" } }}
            className="fixed inset-0 z-[100] bg-black flex items-center justify-center overflow-hidden"
          >
            {/* Close Button */}
            <button
              onClick={endExperience}
              className="absolute top-6 right-6 z-50 text-white/50 hover:text-white mix-blend-difference hover:scale-110 transition-transform p-4"
            >
              <span className="font-display text-lg uppercase tracking-widest">Exit Reel</span>
            </button>

            {/* Animated Image Container */}
            <div className="relative w-full h-full">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  className="absolute inset-0 w-full h-full overflow-hidden"
                >
                  <motion.div
                    className="w-full h-full"
                    initial={{ scale: 1.4, filter: "blur(20px)", opacity: 0 }}
                    animate={{
                      scale: 1,
                      filter: "blur(0px)",
                      opacity: 1
                    }}
                    exit={{
                      opacity: 0,
                      scale: 1.1,
                      filter: "blur(10px)",
                      transition: { duration: 1.2, ease: "easeInOut" }
                    }}
                    transition={{
                      duration: 1.8,
                      ease: [0.19, 1, 0.22, 1]
                    }}
                  >
                    <motion.div
                      className="w-full h-full"
                      animate={{
                        scale: [1, 1.15],
                        x: ["0%", "-3%"]
                      }}
                      transition={{
                        duration: 10,
                        ease: "linear",
                        repeat: 0
                      }}
                    >
                      {/* Overlay Gradient for Text Readability */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 z-10" />

                      <img
                        src={currentMemory.image || `https://picsum.photos/seed/${currentIndex + 55}/1920/1080`}
                        className="w-full h-full object-cover opacity-80"
                        alt={currentMemory.title || 'Future Memory'}
                      />
                    </motion.div>
                  </motion.div>
                </motion.div>
              </AnimatePresence>

              {/* Text Overlay */}
              <div className="absolute bottom-16 md:bottom-24 left-0 w-full text-center z-20 px-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentIndex}
                    initial={{ y: 40, opacity: 0, filter: "blur(10px)" }}
                    animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                    exit={{ y: -20, opacity: 0, filter: "blur(5px)" }}
                    transition={{ duration: 1.2, delay: 0.3, ease: [0.19, 1, 0.22, 1] }}
                  >
                    <h2 className="font-display text-4xl md:text-8xl text-white uppercase mb-4 drop-shadow-2xl tracking-tight">
                      {currentMemory.title}
                    </h2>
                    <p className="font-serif italic text-lg md:text-3xl text-white/90 max-w-3xl mx-auto drop-shadow-lg leading-relaxed">
                      {currentMemory.description}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Progress Bar */}
              <div className="absolute bottom-0 left-0 w-full h-1 bg-white/10">
                <motion.div
                  className="h-full bg-brand-red box-shadow-[0_0_20px_rgba(206,18,21,0.8)]"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: memoriesData.length * 4, ease: "linear" }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 
        ========================================
        GALLERY LIGHTBOX (Milestones-style)
        ========================================
      */}
      <AnimatePresence>
        {lightboxIndex !== null && galleryData[lightboxIndex] && (
          <motion.div
            key="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-dark/95 backdrop-blur-md group/lightbox"
            onClick={closeLightbox}
          >
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 md:top-6 md:right-6 z-50 text-white/50 hover:text-white transition-colors"
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>

            {/* Main Content Area */}
            <div
              className="relative w-full h-full flex flex-col items-center justify-center px-4 md:px-16 pt-14 pb-28 md:pb-20"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Photo Navigation Arrows (cycle within gallery entry) */}
              {hasMultiplePhotos && (
                <>
                  <button
                    onClick={(e) => { e.stopPropagation(); prevPhoto(); }}
                    className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 z-50 text-white/70 hover:text-white transition-all p-2 md:p-4 opacity-0 group-hover/lightbox:opacity-100 md:transform md:-translate-x-4 md:group-hover/lightbox:translate-x-0 duration-300"
                    aria-label="Previous photo"
                  >
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                  </button>

                  <button
                    onClick={(e) => { e.stopPropagation(); nextPhoto(); }}
                    className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 z-50 text-white/70 hover:text-white transition-all p-2 md:p-4 opacity-0 group-hover/lightbox:opacity-100 md:transform md:translate-x-4 md:group-hover/lightbox:translate-x-0 duration-300"
                    aria-label="Next photo"
                  >
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                  </button>
                </>
              )}

              {/* Image Area with Swipe */}
              <motion.div
                key={`${lightboxIndex}-${photoIndex}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="relative w-full flex-1 flex items-center justify-center min-h-0"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.7}
                onDragEnd={(event, info) => {
                  const SWIPE_THRESHOLD = 50;
                  if (info.offset.x > SWIPE_THRESHOLD) {
                    if (hasMultiplePhotos) prevPhoto();
                    else prevEntry();
                  } else if (info.offset.x < -SWIPE_THRESHOLD) {
                    if (hasMultiplePhotos) nextPhoto();
                    else nextEntry();
                  }
                }}
              >
                <img
                  src={allPhotos[photoIndex] || galleryData[lightboxIndex].image}
                  alt={galleryData[lightboxIndex].title}
                  draggable={false}
                  className="max-w-full max-h-full object-contain shadow-2xl rounded-sm select-none"
                />
              </motion.div>

              {/* Photo Dots (within current entry) */}
              {hasMultiplePhotos && (
                <div className="flex items-center gap-2 mt-3">
                  {allPhotos.map((_, i) => (
                    <button
                      key={i}
                      onClick={(e) => { e.stopPropagation(); setPhotoIndex(i); }}
                      className={`rounded-full transition-all ${i === photoIndex
                        ? 'w-3 h-3 bg-brand-red'
                        : 'w-2 h-2 bg-white/30 hover:bg-white/60'
                        }`}
                    />
                  ))}
                </div>
              )}

              {/* Bottom Info */}
              <div className="w-full mt-4 md:mt-6 pointer-events-none">
                <div className="flex flex-col items-center text-center gap-1">
                  <h3 className="font-display text-2xl md:text-5xl text-white uppercase tracking-tight leading-none">
                    {galleryData[lightboxIndex].title}
                  </h3>
                  {galleryData[lightboxIndex].description && (
                    <p className="font-serif italic text-base md:text-lg text-white/60 max-w-xl mt-2">
                      {galleryData[lightboxIndex].description}
                    </p>
                  )}
                </div>
              </div>

              {/* Entry Navigation Bar (navigate between gallery entries) */}
              <div className="absolute bottom-4 md:bottom-6 left-0 right-0 flex items-center justify-center gap-6 z-50 pointer-events-auto">
                <button
                  onClick={(e) => { e.stopPropagation(); prevEntry(); }}
                  className="flex items-center gap-2 text-white/40 hover:text-white transition-colors text-xs uppercase tracking-widest font-sans"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6"></polyline>
                  </svg>
                  <span className="hidden md:inline">Prev</span>
                </button>

                <span className="text-white/30 font-display text-sm tracking-widest">
                  {(lightboxIndex + 1).toString().padStart(2, '0')} / {galleryData.length.toString().padStart(2, '0')}
                </span>

                <button
                  onClick={(e) => { e.stopPropagation(); nextEntry(); }}
                  className="flex items-center gap-2 text-white/40 hover:text-white transition-colors text-xs uppercase tracking-widest font-sans"
                >
                  <span className="hidden md:inline">Next</span>
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
              {hasMultiplePhotos ? 'Swipe for photos' : 'Swipe to browse'}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default FutureMemories;

