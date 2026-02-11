
import React, { useRef, useState, useEffect } from 'react';
import { MILESTONES, AUDIO_TRACKS, Milestone } from '../constants';
import { motion, useScroll, useTransform, MotionValue, useInView } from 'framer-motion';
import Lightbox from './Lightbox';
import { useAudio } from './AudioProvider';

// --- Reusable Depth Layer Components ---

interface LayerProps {
  children: React.ReactNode;
  className?: string;
  depth?: number; // 0 = base, 1 = fore (fast), -1 = back (slow)
  scrollYProgress: MotionValue<number>;
}

const ParallaxLayer: React.FC<LayerProps> = ({ children, className = "", depth = 0, scrollYProgress }) => {
  // Parallax Logic:
  // We map the scroll progress (0 to 1) to a Y translation.
  // Positive depth (Fore) moves UP faster (creating "closer" feel).
  // Negative depth (Back) moves DOWN/slower (creating "distance" feel).

  const yRange = depth * 100; // Adjust intensity
  const y = useTransform(scrollYProgress, [0, 1], [0, -yRange]);
  const scale = depth < 0 ? useTransform(scrollYProgress, [0, 1], [1, 1.1]) : 1;

  return (
    <motion.div style={{ y, scale }} className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}>
      {children}
    </motion.div>
  );
};

// --- Milestone Card Component ---

interface MilestoneCardProps {
  milestone: Milestone;
  index: number;
  onClick: () => void;
  total: number;
}

const MilestoneCard: React.FC<MilestoneCardProps> = ({ milestone, index, onClick, total }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Unique layout configuration based on index to mimic "Groups"
  // If we have dynamic content, we cycle through these 3 layouts
  const layoutType = index % 3;

  // Dynamic Grayscale Logic: 100% B&W at edges, Color in middle
  // [Start, FadeIn point, FadeOut point, End]
  const imageFilter = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], ["grayscale(100%)", "grayscale(0%)", "grayscale(0%)", "grayscale(100%)"]);

  return (
    <div
      ref={containerRef}
      className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-center bg-brand-light border-b border-brand-dark/5 will-change-transform"
      style={{ zIndex: index + 1 }} // Stacking order
    >
      {/* 
         --- GROUP TYPE 1: The "Back" Layer Image (First Memory) --- 
         Image sits in background, Text floats on top.
      */}
      {layoutType === 0 && (
        <>
          <ParallaxLayer scrollYProgress={scrollYProgress} depth={-2} className="z-0">
            <div className="w-full h-full flex items-center justify-center opacity-10 md:opacity-25">
              <img src={milestone.backgroundImage || milestone.image} alt="Background" className="w-[120%] h-[120%] object-cover grayscale" />
            </div>
          </ParallaxLayer>

          <div className="relative z-10 container mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-start md:justify-center h-full pt-20 pb-24 md:py-0 gap-6 md:gap-20">
            <motion.div
              className="w-full md:w-1/2 cursor-pointer group order-2 md:order-1"
              onClick={onClick}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="relative overflow-hidden rounded-sm shadow-2xl rotate-2 group-hover:rotate-0 transition-transform duration-500 w-full h-[50vh] md:h-auto md:max-h-[80vh] flex-shrink-0 md:flex-shrink">
                <div className="absolute inset-0 bg-brand-red/10 group-hover:bg-transparent transition-colors z-10 pointer-events-none" />
                <motion.img style={{ filter: imageFilter }} src={milestone.image} alt={milestone.title} className="w-full h-full object-cover" />
              </div>
            </motion.div>

            <motion.div
              className="w-full md:w-1/2 text-center md:text-left order-1 md:order-2"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="font-serif italic text-2xl md:text-3xl text-brand-red mb-2 block">({milestone.year})</span>
              <h2 className="font-display text-5xl md:text-8xl text-brand-dark uppercase leading-[0.9] mb-4 md:mb-6">
                {milestone.title}
              </h2>
              <p className="font-sans text-base md:text-lg text-gray-700 leading-relaxed max-w-md mx-auto md:mx-0">
                {milestone.description}
              </p>
            </motion.div>
          </div>
        </>
      )}

      {/* 
         --- GROUP TYPE 2: The "Fore" Layer (Second Memory) --- 
         Image floats "closer" (Fore), Text is Base.
      */}
      {layoutType === 1 && (
        <div className="relative w-full h-full bg-[#f0f0f0]">
          {/* Abstract shape in Back layer */}
          <ParallaxLayer scrollYProgress={scrollYProgress} depth={-0.5} className="z-0">
            <div className="absolute right-0 top-1/4 w-[50vw] h-[50vw] bg-white rounded-full blur-[100px] opacity-60" />
          </ParallaxLayer>

          <div className="relative z-10 h-full flex flex-col md:flex-row items-center justify-start md:justify-between px-6 md:px-24 pt-24 pb-24 md:py-0 gap-8 md:gap-0">
            <div className="flex-shrink-0 text-center md:text-right md:pr-20 flex flex-col justify-center order-2 md:order-1 w-full z-20 bg-brand-light/80 md:bg-transparent backdrop-blur-sm md:backdrop-blur-none p-4 md:p-0 rounded-xl md:rounded-none">
              <span className="font-serif italic text-2xl text-brand-red mb-2 block">{milestone.category}</span>
              <h2 className="font-display text-4xl md:text-8xl text-brand-dark uppercase leading-[0.9] mb-4 md:mb-6">{milestone.title}</h2>
              <p className="font-sans text-base md:text-lg text-gray-600 leading-relaxed max-w-md ml-auto mr-auto md:mr-0">
                {milestone.description}
              </p>
            </div>

            {/* Foreground Image - Moves faster upward */}
            <div className="flex-1 w-full relative perspective-1000 order-1 md:order-2 min-h-0">
              <ParallaxLayer scrollYProgress={scrollYProgress} depth={1.5} className="z-20 pointer-events-auto">
                <div onClick={onClick} className="w-full h-full shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] cursor-zoom-in group overflow-hidden border-4 border-white">
                  <motion.img
                    style={{ filter: imageFilter }}
                    src={milestone.image}
                    alt={milestone.title}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                </div>
              </ParallaxLayer>
            </div>
          </div>
        </div>
      )}

      {/* 
         --- GROUP TYPE 3: The "Deep" Layer (Last Memory) --- 
         Full screen immersive background.
      */}
      {layoutType === 2 && (
        <div className="relative w-full h-full bg-brand-dark text-white">
          {/* Deep Background Image */}
          <ParallaxLayer scrollYProgress={scrollYProgress} depth={-1} className="z-0">
            <motion.img style={{ filter: imageFilter }} src={milestone.backgroundImage || milestone.image} alt={milestone.title} className="w-full h-full object-cover opacity-60 md:opacity-40" />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/50 to-transparent" />
          </ParallaxLayer>

          <div className="relative z-10 h-full flex flex-col items-center justify-end md:justify-center pb-20 md:pb-0 px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              <span className="font-serif italic text-2xl md:text-3xl text-brand-red mb-4 block">({milestone.year})</span>
              <h2 className="font-display text-5xl md:text-[10rem] uppercase leading-[0.85] mb-6 md:mb-8 mix-blend-overlay">
                {milestone.category}
              </h2>
              <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 md:p-12 max-w-2xl mx-auto rounded-sm hover:bg-white/10 transition-colors cursor-pointer" onClick={onClick}>
                <h3 className="font-display text-2xl md:text-5xl uppercase mb-3 md:mb-4">{milestone.title}</h3>
                <p className="font-sans text-base md:text-lg text-gray-300 leading-relaxed">
                  {milestone.description}
                </p>
                <div className="mt-4 md:mt-6 text-xs uppercase tracking-widest text-brand-red">Tap to view memory</div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
};

interface MilestonesProps {
  content?: Milestone[];
}

const Milestones: React.FC<MilestonesProps> = ({ content }) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const containerRef = useRef(null);
  const { setTrack } = useAudio();
  const isInView = useInView(containerRef, { amount: 0.1 });

  const milestonesData = content || MILESTONES;

  useEffect(() => {
    if (isInView) setTrack(AUDIO_TRACKS.MILESTONES);
  }, [isInView, setTrack]);

  return (
    <section id="memories" ref={containerRef} className="relative w-full bg-brand-light">
      <div className="relative flex flex-col w-full">
        {milestonesData.map((milestone, index) => (
          <MilestoneCard
            key={milestone.id || index}
            milestone={milestone}
            index={index}
            total={milestonesData.length}
            onClick={() => setSelectedIndex(index)}
          />
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
