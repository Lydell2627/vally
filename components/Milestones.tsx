
import React, { useRef, useState, useEffect, useMemo } from 'react';
import { MILESTONES, Milestone } from '../constants';
import { motion, useScroll, useTransform, MotionValue, useInView } from 'framer-motion';
import Lightbox from './Lightbox';

// --- Detect mobile once (SSR-safe) ---
const useIsMobile = () => {
  return useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 768;
  }, []);
};

// --- Parallax Layer (Desktop only) ---

interface LayerProps {
  children: React.ReactNode;
  className?: string;
  depth?: number;
  scrollYProgress: MotionValue<number>;
}

const ParallaxLayer: React.FC<LayerProps> = ({ children, className = "", depth = 0, scrollYProgress }) => {
  const isMobile = useIsMobile();

  // Mobile: no transforms, just a static wrapper
  const effectiveDepth = isMobile ? 0 : depth;
  const yRange = effectiveDepth * 100;
  const y = useTransform(scrollYProgress, [0, 1], [0, -yRange]);
  const scale = effectiveDepth < 0 ? useTransform(scrollYProgress, [0, 1], [1, 1.1]) : 1;

  // On mobile, skip motion.div entirely for zero overhead
  if (isMobile) {
    return (
      <div className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}>
        {children}
      </div>
    );
  }

  return (
    <motion.div style={{ y, scale }} className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}>
      {children}
    </motion.div>
  );
};

// --- Milestone Card ---

interface MilestoneCardProps {
  milestone: Milestone;
  index: number;
  onClick: () => void;
  total: number;
}

const MilestoneCard: React.FC<MilestoneCardProps> = ({ milestone, index, onClick, total }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const layoutType = index % 3;

  // Grayscale effect — lightweight CSS filter, runs on both mobile & desktop
  const imageFilter = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    ["grayscale(100%)", "grayscale(0%)", "grayscale(0%)", "grayscale(100%)"]
  );

  // On mobile, skip the grayscale effect too for max performance
  const mobileFilter = undefined;
  const activeFilter = isMobile ? mobileFilter : imageFilter;

  return (
    <div
      ref={containerRef}
      // MOBILE: relative positioning, natural flow, 100dvh for address bar
      // DESKTOP: sticky stacking with fixed h-screen
      className="h-[100dvh] md:sticky md:top-0 md:h-screen w-full overflow-hidden flex flex-col justify-center bg-brand-light border-b border-brand-dark/5"
      style={{ zIndex: index + 1, touchAction: 'pan-y' }}
    >
      {/* === LAYOUT 1: Background Image + Foreground Content === */}
      {layoutType === 0 && (
        <>
          {/* Background (desktop: parallax, mobile: static) */}
          <ParallaxLayer scrollYProgress={scrollYProgress} depth={-2} className="z-0">
            <div className="w-full h-full flex items-center justify-center opacity-10 md:opacity-25">
              <img src={milestone.backgroundImage || milestone.image} alt="" className="w-[120%] h-[120%] object-cover grayscale" />
            </div>
          </ParallaxLayer>

          <div className="relative z-10 container mx-auto px-5 md:px-12 flex flex-col md:flex-row items-center justify-center h-full py-8 md:py-0 gap-5 md:gap-20">
            {/* Image */}
            <motion.div
              className="w-full md:w-1/2 cursor-pointer group order-1 md:order-1"
              onClick={onClick}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="relative overflow-hidden rounded-sm shadow-2xl md:rotate-2 md:group-hover:rotate-0 transition-transform duration-500 w-full h-[45vh] md:h-auto md:max-h-[80vh]">
                <div className="absolute inset-0 bg-brand-red/10 group-hover:bg-transparent transition-colors z-10 pointer-events-none" />
                <motion.img style={{ filter: activeFilter }} src={milestone.image} alt={milestone.title} className="w-full h-full object-cover" />
              </div>
            </motion.div>

            {/* Text */}
            <motion.div
              className="w-full md:w-1/2 text-center md:text-left order-2 md:order-2"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <span className="font-serif italic text-xl md:text-3xl text-brand-red mb-1 block">({milestone.year})</span>
              <h2 className="font-display text-4xl md:text-8xl text-brand-dark uppercase leading-[0.9] mb-3 md:mb-6">
                {milestone.title}
              </h2>
              <p className="font-sans text-sm md:text-lg text-gray-700 leading-relaxed max-w-md mx-auto md:mx-0">
                {milestone.description}
              </p>
            </motion.div>
          </div>
        </>
      )}

      {/* === LAYOUT 2: Image + Text Side by Side === */}
      {layoutType === 1 && (
        <div className="relative w-full h-full bg-[#f0f0f0]">
          {/* Background (desktop only) */}
          {milestone.backgroundImage && (
            <ParallaxLayer scrollYProgress={scrollYProgress} depth={-0.5} className="z-0 hidden md:block">
              <motion.img style={{ filter: activeFilter }} src={milestone.backgroundImage} alt="" className="w-full h-full object-cover opacity-20 blur-sm" />
            </ParallaxLayer>
          )}
          {!milestone.backgroundImage && (
            <ParallaxLayer scrollYProgress={scrollYProgress} depth={-0.5} className="z-0 hidden md:block">
              <div className="absolute right-0 top-1/4 w-[50vw] h-[50vw] bg-white rounded-full blur-[100px] opacity-60" />
            </ParallaxLayer>
          )}

          <div className="relative z-10 h-full flex flex-col md:flex-row items-center justify-center px-5 md:px-24 py-8 md:py-0 gap-5 md:gap-12">
            {/* Text */}
            <div className="md:w-1/2 text-center md:text-right flex flex-col justify-center order-2 md:order-1 w-full z-20">
              <span className="font-serif italic text-xl md:text-2xl text-brand-red mb-1 block">{milestone.category}</span>
              <h2 className="font-display text-4xl md:text-8xl text-brand-dark uppercase leading-[0.9] mb-3 md:mb-6">{milestone.title}</h2>
              <p className="font-sans text-sm md:text-lg text-gray-600 leading-relaxed max-w-md ml-auto mr-auto md:mr-0">
                {milestone.description}
              </p>
            </div>

            {/* Image */}
            <div
              className="w-full md:w-1/2 h-[45vh] md:h-[80vh] relative order-1 md:order-2 cursor-pointer group overflow-hidden shadow-2xl border-4 border-white"
              onClick={onClick}
            >
              <motion.img
                style={{ filter: activeFilter }}
                src={milestone.image}
                alt={milestone.title}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              />
            </div>
          </div>
        </div>
      )}

      {/* === LAYOUT 3: Split — Full portrait photo + text === */}
      {layoutType === 2 && (
        <div className="relative w-full h-full bg-brand-dark text-white flex flex-col md:flex-row">
          {/* Photo side — full height, no crop */}
          <div className="relative w-full md:w-1/2 h-[60%] md:h-full order-1 md:order-2 cursor-pointer group flex items-center justify-center p-4 md:p-8" onClick={onClick}>
            {/* Blurred fill behind portrait photo */}
            <img
              src={milestone.backgroundImage || milestone.image}
              alt=""
              className="absolute inset-0 w-full h-full object-cover blur-2xl scale-110 opacity-40"
            />
            {/* Framed portrait photo */}
            <div className="relative z-10 w-full h-full border-4 md:border-[6px] border-white/80 shadow-2xl overflow-hidden">
              <img
                src={milestone.image}
                alt={milestone.title}
                className="w-full h-full object-cover"
              />
            </div>
            {/* Mobile: bottom gradient for text readability */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-brand-dark to-transparent md:hidden z-20" />
          </div>

          {/* Text side */}
          <div className="relative w-full md:w-1/2 h-[40%] md:h-full flex flex-col justify-end md:justify-center px-6 md:px-16 pb-6 md:pb-0 order-2 md:order-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-lg"
            >
              <span className="font-serif italic text-xl md:text-3xl text-brand-red mb-2 block">({milestone.year})</span>
              <h2 className="font-display text-4xl md:text-8xl uppercase leading-[0.85] mb-4 md:mb-6">
                {milestone.category}
              </h2>
              <h3 className="font-display text-2xl md:text-4xl uppercase mb-2 md:mb-4 text-white/90">{milestone.title}</h3>
              <p className="font-sans text-base md:text-lg text-gray-400 leading-relaxed mb-4 md:mb-8">
                {milestone.description}
              </p>
              <div className="text-sm uppercase tracking-widest text-brand-red cursor-pointer hover:text-white transition-colors" onClick={onClick}>
                Tap to view memory →
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Main Milestones Section ---

interface MilestonesProps {
  content?: Milestone[];
}

const Milestones: React.FC<MilestonesProps> = ({ content }) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { amount: 0.1 });

  const milestonesData = content || MILESTONES;



  return (
    <section id="memories" ref={containerRef} className="relative w-full bg-brand-light">
      <div className="relative flex flex-col w-full">
        {milestonesData.map((milestone, index) => (
          // MOBILE: no snap classes, clean flow
          // DESKTOP: snap-start for premium magnetic feel
          <div key={milestone.id || index} className="relative md:snap-start md:snap-always">
            <MilestoneCard
              milestone={milestone}
              index={index}
              total={milestonesData.length}
              onClick={() => setSelectedIndex(index)}
            />
          </div>
        ))}
      </div>

      <Lightbox
        selectedIndex={selectedIndex}
        milestones={milestonesData}
        onClose={() => setSelectedIndex(null)}
        onChange={(index) => setSelectedIndex(index)}
      />
    </section>
  );
};

export default Milestones;
