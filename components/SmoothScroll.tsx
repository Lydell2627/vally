"use client";

import React, { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface SmoothScrollProps {
  children: React.ReactNode;
}

const SmoothScroll: React.FC<SmoothScrollProps> = ({ children }) => {
  useEffect(() => {
    // Register GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // Premium Heavy Scroll Configuration
    const lenis = new Lenis({
      duration: 1.5, // 1.5s duration creates the "heavy" momentum feel
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential ease-out
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.9, // Slightly < 1 makes the user work a bit more, feeling substantial
      touchMultiplier: 2.0, // Ensures mobile stays responsive
      infinite: false,
    });

    // --- GSAP Sync Integration ---
    lenis.on('scroll', ScrollTrigger.update);
    
    // Use GSAP's ticker to drive Lenis. 
    // This ensures animations and scroll are calculated in the same frame.
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    
    // Disable GSAP's internal smoothing since Lenis is handling the physics
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(lenis.raf);
    };
  }, []);

  return <>{children}</>;
};

export default SmoothScroll;
