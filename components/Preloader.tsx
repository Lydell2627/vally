
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LOADING_TEXTS = [
  "Curating memories...",
  "Developing photos...",
  "Finding the right words...",
  "Taking a deep breath...",
  "Just for you."
];

const Preloader: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Text cycling
    const textInterval = setInterval(() => {
      setIndex((prev) => (prev + 1) % LOADING_TEXTS.length);
    }, 800);

    // Progress bar simulation
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          clearInterval(timer);
          clearInterval(textInterval);
          return 100;
        }
        const diff = Math.random() * 10;
        return Math.min(oldProgress + diff, 100);
      });
    }, 200);

    return () => {
      clearInterval(timer);
      clearInterval(textInterval);
    };
  }, []);

  useEffect(() => {
    if (progress === 100) {
      setTimeout(onComplete, 800);
    }
  }, [progress, onComplete]);

  return (
    <motion.div
      initial={{ y: 0 }}
      exit={{ y: "-100%", transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
      className="fixed inset-0 z-[99999] bg-brand-dark flex flex-col items-center justify-between py-10 px-10 text-brand-light"
    >
      {/* Top Details */}
      <div className="w-full flex justify-between items-start font-display tracking-widest uppercase text-sm opacity-50">
        <span>Proposal_V1.0</span>
        <span>{new Date().getFullYear()}</span>
      </div>

      {/* Center Text */}
      <div className="flex flex-col items-center text-center">
        <div className="h-10 overflow-hidden relative">
            <AnimatePresence mode="wait">
                <motion.p
                    key={index}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="font-serif italic text-2xl md:text-3xl"
                >
                    {LOADING_TEXTS[index]}
                </motion.p>
            </AnimatePresence>
        </div>
        <h1 className="font-display text-[12vw] leading-none mt-4 opacity-10 select-none">
            VALLY
        </h1>
      </div>

      {/* Bottom Progress */}
      <div className="w-full flex items-end justify-between font-display text-6xl md:text-9xl">
        <span className="text-brand-red">{Math.round(progress)}%</span>
      </div>
    </motion.div>
  );
};

export default Preloader;
