
import React from 'react';
import { motion } from 'framer-motion';
import { useAudio } from './AudioProvider';

const AudioPlayer: React.FC = () => {
  const { isPlaying, togglePlay, currentTrack } = useAudio();

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex items-center gap-4 mix-blend-difference text-white">
      
      <div className="hidden md:flex flex-col items-end mr-2">
         <motion.span 
           key={currentTrack.title}
           initial={{ opacity: 0, y: 5 }}
           animate={{ opacity: 0.8, y: 0 }}
           className="font-display text-xs uppercase tracking-widest text-right"
         >
            {isPlaying ? "Now Playing" : "Paused"}
         </motion.span>
         <motion.span 
            key={currentTrack.vibe}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            className="font-serif italic text-xs text-right whitespace-nowrap"
         >
            {currentTrack.title} — {currentTrack.vibe}
         </motion.span>
      </div>

      <button 
        onClick={togglePlay}
        className="relative group w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors"
      >
        {isPlaying ? (
           // Visualizer Animation
           <div className="flex items-end gap-[2px] h-4">
              <motion.div animate={{ height: [4, 12, 4] }} transition={{ repeat: Infinity, duration: 0.5 }} className="w-[2px] bg-white" />
              <motion.div animate={{ height: [8, 16, 6] }} transition={{ repeat: Infinity, duration: 0.4 }} className="w-[2px] bg-white" />
              <motion.div animate={{ height: [4, 10, 4] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-[2px] bg-white" />
              <motion.div animate={{ height: [6, 14, 6] }} transition={{ repeat: Infinity, duration: 0.3 }} className="w-[2px] bg-white" />
           </div>
        ) : (
           <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
           </svg>
        )}
        
        {/* Pulse effect when paused to encourage click */}
        {!isPlaying && (
            <span className="absolute inset-0 rounded-full border border-white/40 animate-ping opacity-20" />
        )}
      </button>
    </div>
  );
};

export default AudioPlayer;
