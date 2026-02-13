
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAudio } from './AudioProvider';

const AudioPlayer: React.FC = () => {
   const { isPlaying, togglePlay } = useAudio();

   return (
      <motion.button
         onClick={togglePlay}
         initial={{ opacity: 0, y: 10 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ delay: 2, duration: 0.8 }}
         className="fixed bottom-6 right-6 z-[9999] flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 hover:border-white/25 text-white cursor-pointer transition-colors duration-300 group"
         aria-label={isPlaying ? 'Pause music' : 'Play music'}
      >
         {/* Play/Pause icon */}
         <div className="relative w-4 h-4 flex items-center justify-center">
            <AnimatePresence mode="wait">
               {isPlaying ? (
                  <motion.div
                     key="pause"
                     initial={{ scale: 0, opacity: 0 }}
                     animate={{ scale: 1, opacity: 1 }}
                     exit={{ scale: 0, opacity: 0 }}
                     transition={{ duration: 0.15 }}
                     className="flex gap-[3px]"
                  >
                     <div className="w-[3px] h-3 bg-white rounded-[1px]" />
                     <div className="w-[3px] h-3 bg-white rounded-[1px]" />
                  </motion.div>
               ) : (
                  <motion.svg
                     key="play"
                     initial={{ scale: 0, opacity: 0 }}
                     animate={{ scale: 1, opacity: 1 }}
                     exit={{ scale: 0, opacity: 0 }}
                     transition={{ duration: 0.15 }}
                     width="14" height="14" viewBox="0 0 24 24" fill="white"
                  >
                     <path d="M8 5v14l11-7z" />
                  </motion.svg>
               )}
            </AnimatePresence>
         </div>

         {/* Visualizer bars (when playing) */}
         <AnimatePresence>
            {isPlaying && (
               <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 'auto', opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-end gap-[2px] h-3 overflow-hidden"
               >
                  <motion.div animate={{ height: [3, 10, 3] }} transition={{ repeat: Infinity, duration: 0.5 }} className="w-[1.5px] bg-white/60" />
                  <motion.div animate={{ height: [6, 12, 5] }} transition={{ repeat: Infinity, duration: 0.4 }} className="w-[1.5px] bg-white/60" />
                  <motion.div animate={{ height: [3, 8, 3] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-[1.5px] bg-white/60" />
                  <motion.div animate={{ height: [5, 11, 5] }} transition={{ repeat: Infinity, duration: 0.3 }} className="w-[1.5px] bg-white/60" />
               </motion.div>
            )}
         </AnimatePresence>

         {/* Label (desktop only) */}
         <span className="hidden md:block font-display text-[10px] uppercase tracking-widest opacity-60 group-hover:opacity-100 transition-opacity">
            {isPlaying ? 'Playing' : 'Music'}
         </span>
      </motion.button>
   );
};

export default AudioPlayer;
