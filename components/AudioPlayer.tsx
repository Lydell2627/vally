
import React from 'react';
import { motion } from 'framer-motion';
import { useAudio } from './AudioProvider';

const AudioPlayer: React.FC = () => {
   const { isPlaying, currentTrack } = useAudio();

   // No button — just a subtle visualizer when music is playing
   if (!isPlaying) return null;

   return (
      <div className="fixed bottom-6 right-6 z-[9999] flex items-center gap-3 mix-blend-difference text-white pointer-events-none">
         {/* Track info (desktop only) */}
         <div className="hidden md:flex flex-col items-end mr-1">
            <motion.span
               key={currentTrack.title}
               initial={{ opacity: 0, y: 5 }}
               animate={{ opacity: 0.6, y: 0 }}
               className="font-display text-[10px] uppercase tracking-widest text-right"
            >
               Now Playing
            </motion.span>
            <motion.span
               key={currentTrack.vibe}
               initial={{ opacity: 0 }}
               animate={{ opacity: 0.4 }}
               className="font-serif italic text-[10px] text-right whitespace-nowrap"
            >
               {currentTrack.title} — {currentTrack.vibe}
            </motion.span>
         </div>

         {/* Visualizer bars */}
         <div className="flex items-end gap-[2px] h-3">
            <motion.div animate={{ height: [3, 10, 3] }} transition={{ repeat: Infinity, duration: 0.5 }} className="w-[1.5px] bg-white/60" />
            <motion.div animate={{ height: [6, 12, 5] }} transition={{ repeat: Infinity, duration: 0.4 }} className="w-[1.5px] bg-white/60" />
            <motion.div animate={{ height: [3, 8, 3] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-[1.5px] bg-white/60" />
            <motion.div animate={{ height: [5, 11, 5] }} transition={{ repeat: Infinity, duration: 0.3 }} className="w-[1.5px] bg-white/60" />
         </div>
      </div>
   );
};

export default AudioPlayer;
