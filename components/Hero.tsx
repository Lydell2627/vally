
import React, { useRef, useEffect } from 'react';
import { HERO_TEXT, AUDIO_TRACKS } from '../constants';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import FloatingHearts from './FloatingHearts';
import { useAudio } from './AudioProvider';
import gsap from 'gsap';

interface HeroProps {
  content?: {
    top: string;
    bottom: string;
    subtitle: string;
  };
}

const Hero: React.FC<HeroProps> = ({ content }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Refs for GSAP
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const introRef = useRef<HTMLDivElement>(null);
  const leftTagRef = useRef<HTMLDivElement>(null);
  const rightTagRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const sparklesRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  
  const textData = content || HERO_TEXT;
  
  // Audio Trigger
  const { setTrack } = useAudio();
  const isInView = useInView(containerRef, { amount: 0.5 });
  
  useEffect(() => {
    if (isInView) {
        setTrack(AUDIO_TRACKS.HERO);
    }
  }, [isInView, setTrack]);

  // Parallax Effects
  const yText = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  // GSAP Entrance Animation
  useEffect(() => {
    const ctx = gsap.context(() => {
        // Initial States
        gsap.set(wordRefs.current, { 
            yPercent: 120,    // Move down by 100% of height
            autoAlpha: 0,     // Opacity 0 + Visibility hidden
            scale: 0.8,       // Start slightly smaller
            filter: 'blur(20px)',
            rotationX: 90,    // 3D Rotation
            transformOrigin: "50% 100%",
            transformStyle: "preserve-3d"
        });
        
        gsap.set([leftTagRef.current, rightTagRef.current], { autoAlpha: 0, y: -20 });
        gsap.set(introRef.current, { autoAlpha: 0, y: 20, filter: 'blur(5px)' });
        gsap.set(scrollRef.current, { autoAlpha: 0, y: 10 });
        
        const sparkles = sparklesRef.current?.children;
        if (sparkles) {
            gsap.set(sparkles, { scale: 0, autoAlpha: 0 });
        }

        const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

        tl
        .to([leftTagRef.current, rightTagRef.current], {
            autoAlpha: 1,
            y: 0,
            duration: 1.2,
            stagger: 0.1
        }, 0.2)
        .to(introRef.current, {
            autoAlpha: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 1.2
        }, 0.4)
        // ONE BY ONE Word Animation (Cinematic Reveal)
        .to(wordRefs.current, {
            yPercent: 0,
            autoAlpha: 1,
            scale: 1,
            filter: 'blur(0px)',
            rotationX: 0,
            duration: 2,
            stagger: 0.15, // Delay between JUST -> ONE -> CHANCE
            ease: "expo.out" // Premium, smooth landing
        }, 0.6)
        .to(sparkles || [], {
            scale: 1,
            autoAlpha: 1,
            duration: 1,
            stagger: 0.1,
            ease: "back.out(2)" 
        }, 1.4)
        .to(scrollRef.current, {
            autoAlpha: 1,
            y: 0,
            duration: 1
        }, 2.0);

    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Split top words for animation
  const topWords = textData.top.split(' '); // ["JUST", "ONE"]

  return (
    <section 
      ref={containerRef} 
      className="relative h-[100dvh] w-full bg-brand-red flex flex-col items-center justify-center overflow-hidden text-white perspective-1000"
    >
      {/* Corner Texts */}
      <div 
        ref={leftTagRef}
        className="absolute top-8 left-6 md:top-14 md:left-14 font-serif italic text-xl md:text-2xl z-30"
      >
        Hey,<br />listen.
      </div>
      
      <div 
        ref={rightTagRef}
        className="absolute top-8 right-6 md:top-14 md:right-14 font-display text-lg md:text-xl z-30 tracking-widest uppercase"
      >
        {textData.subtitle}
      </div>

      {/* Main Content */}
      <div className="relative z-40 flex flex-col items-center justify-center w-full px-4 text-center">
        
        <motion.div 
          ref={introRef}
          className="relative mb-8 md:mb-12"
          style={{ y: yText, opacity }}
        >
            <h3 className="font-serif italic text-2xl md:text-4xl tracking-wide leading-relaxed drop-shadow-sm max-w-[90%] mx-auto">
              I know you're hesitant.<br/>But hear me out.
            </h3>
        </motion.div>

        <motion.div
          className="relative flex flex-col items-center tracking-[0.02em]"
          style={{ y: yText, opacity }}
        >
            {/* TOP LINE (Split into words) */}
            <div className="flex gap-[0.25em] z-20 relative">
                {topWords.map((word, i) => (
                    <span 
                        key={i}
                        ref={el => { wordRefs.current[i] = el; }}
                        className="font-display text-[15vw] md:text-[12vw] uppercase text-white cursor-default select-none text-glow whitespace-nowrap inline-block leading-[0.8]"
                    >
                        {word}
                    </span>
                ))}
            </div>

            {/* BOTTOM LINE (The "Chance" word) */}
            <div className="relative z-10 -mt-[0.12em] md:-mt-[0.15em]">
                <span 
                    ref={el => { wordRefs.current[topWords.length] = el; }}
                    className="font-display text-[15vw] md:text-[12vw] uppercase stroke-text cursor-default select-none whitespace-nowrap inline-block tracking-[0.1em] leading-[0.8]"
                >
                    {textData.bottom}
                </span>
                
                {/* Sparkles Container */}
                <div ref={sparklesRef} className="absolute inset-0 pointer-events-none z-20">
                    <Star className="absolute -top-10 -left-10 w-12 h-12 md:w-20 md:h-20 text-white opacity-90" />
                    <Star className="absolute top-1/2 -right-12 w-10 h-10 md:w-16 md:h-16 text-white opacity-80" />
                    <Star className="absolute -bottom-10 left-1/4 w-6 h-6 md:w-12 md:h-12 text-white opacity-70" />
                </div>
            </div>
        </motion.div>
      </div>

      {/* Hearts Container */}
      <FloatingHearts className="z-10 opacity-60" />

      {/* Scroll Indicator */}
      <div 
        ref={scrollRef}
        className="absolute bottom-12 md:bottom-16 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-3"
      >
        <span className="font-display text-xs md:text-sm uppercase tracking-[0.3em] opacity-80">Begin</span>
        <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white w-6 h-6 md:w-8 md:h-8">
            <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
            </svg>
        </motion.div>
      </div>
    </section>
  );
};

// Enhanced Star Component
const Star = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={`${className} drop-shadow-md`}>
        <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
    </svg>
);

export default Hero;
