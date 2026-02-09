
import React, { useRef, useEffect, useState } from 'react';
import { FUTURE_MEMORIES, AUDIO_TRACKS } from '../constants';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { useAudio } from './AudioProvider';

interface FutureMemoriesProps {
  content?: any[];
}

const FutureMemories: React.FC<FutureMemoriesProps> = ({ content }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { setTrack, togglePlay, isPlaying: isGlobalPlaying } = useAudio();

  // Experience State
  const [mode, setMode] = useState<'IDLE' | 'PLAYING'>('IDLE');
  const [currentIndex, setCurrentIndex] = useState(0);
  const wasPlayingRef = useRef(false);

  const memoriesData = content || FUTURE_MEMORIES;

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
    if (mode === 'PLAYING') {
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

  return (
    <section ref={containerRef} className="bg-brand-dark text-white py-24 md:py-40 px-6 overflow-hidden relative min-h-screen">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_rgba(206,18,21,0.05),_transparent_70%)] pointer-events-none" />

      {/* 
        ========================================
        IDLE VIEW (Grid) 
        ========================================
      */}
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 md:mb-24 text-center md:text-left flex flex-col md:flex-row justify-between items-end"
        >
          <div>
            <div className="flex flex-col md:flex-row items-end gap-6 mb-6">
              <h2 className="font-display text-6xl md:text-9xl uppercase leading-[0.8]">
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
          <motion.button
            onClick={startExperience}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-8 md:mt-0 group relative overflow-hidden rounded-full px-8 py-6 bg-brand-red text-white shadow-[0_0_40px_-10px_rgba(206,18,21,0.6)]"
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
        </motion.div>

        {/* The Grid (Visible when IDLE) */}
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
      </div>

      {/* 
        ========================================
        IMMERSIVE CINEMATIC MODE 
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
                  {/* 
                                AWARD-WINNING TRANSITION ARCHITECTURE:
                                1. Wrapper: Handles the "Reveal" (Scale Down + De-blur)
                                2. Inner: Handles the "Live Movement" (Slow Pan/Scale Up)
                            */}
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
                      ease: [0.19, 1, 0.22, 1] // "Expo Out" feel - very premium snap
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
                        src={memoriesData[currentIndex].image || `https://picsum.photos/seed/${currentIndex + 55}/1920/1080`}
                        className="w-full h-full object-cover opacity-80"
                        alt={memoriesData[currentIndex].title}
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
                      {memoriesData[currentIndex].title}
                    </h2>
                    <p className="font-serif italic text-lg md:text-3xl text-white/90 max-w-3xl mx-auto drop-shadow-lg leading-relaxed">
                      {memoriesData[currentIndex].description}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Progress Bar (Film Grain style) */}
              <div className="absolute bottom-0 left-0 w-full h-1 bg-white/10">
                <motion.div
                  className="h-full bg-brand-red box-shadow-[0_0_20px_rgba(206,18,21,0.8)]"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 25, ease: "linear" }} // Approx song length visual
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default FutureMemories;
