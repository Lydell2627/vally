
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import Marquee from './Marquee';
import { useAudio } from './AudioProvider';
import { AUDIO_TRACKS, UI_SFX } from '../constants';

interface Sticker {
  id: number;
  url: string;
  x: number;
  y: number;
  rotation: number;
}

interface ProposalProps {
  reactions?: {
    reactionImages: string[];
    reactionSounds: string[];
  };
}

const Proposal: React.FC<ProposalProps> = ({ reactions }) => {
  const [hasSaidYes, setHasSaidYes] = useState(false);
  const [noCount, setNoCount] = useState(0);
  const [stickers, setStickers] = useState<Sticker[]>([]);

  // Load persisted noCount from server on mount
  useEffect(() => {
    fetch('/api/metrics')
      .then(res => res.json())
      .then(data => {
        if (data.noCount) setNoCount(data.noCount);
        if (data.hasSaidYes) setHasSaidYes(true);
      })
      .catch(() => { });
  }, []);

  // Audio Trigger
  const containerRef = useRef(null);
  const { setTrack, playSfx } = useAudio();
  const isInView = useInView(containerRef, { amount: 0.5 });

  useEffect(() => {
    if (isInView) setTrack(AUDIO_TRACKS.PROPOSAL);
  }, [isInView, setTrack]);

  const handleYes = () => {
    playSfx(UI_SFX.SUCCESS, 0.6); // Louder chime
    setHasSaidYes(true);

    // Track yes-click in metrics (triggers email notification)
    fetch('/api/metrics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'yes-click',
        data: { noCount: noCount }
      })
    }).catch(e => console.error("Failed to save yes-click", e));

    // Also save to submissions for the record
    fetch('/api/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'proposal',
        data: { answer: 'YES', noCount: noCount }
      })
    }).catch(e => console.error("Failed to save proposal response", e));
  };

  const handleNo = () => {
    // Play sound (Random from CMS or default)
    if (reactions?.reactionSounds?.length) {
      const soundUrl = reactions.reactionSounds[Math.floor(Math.random() * reactions.reactionSounds.length)];
      if (soundUrl) {
        const audio = new Audio(soundUrl);
        audio.play().catch(e => console.warn("Audio play failed", e));
      }
    } else {
      playSfx(UI_SFX.CLICK);
    }

    // Add Sticker
    if (reactions?.reactionImages?.length) {
      const stickerUrl = reactions.reactionImages[Math.floor(Math.random() * reactions.reactionImages.length)];
      const newSticker: Sticker = {
        id: Date.now(),
        url: stickerUrl,
        x: Math.random() * 80 + 10, // 10% to 90%
        y: Math.random() * 80 + 10,
        rotation: Math.random() * 40 - 20 // -20 to 20 deg
      };
      setStickers(prev => [...prev, newSticker]);
    }

    setNoCount(prev => prev + 1);

    // Persist the no-click to metrics
    fetch('/api/metrics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'no-click' })
    }).catch(() => { });
  };

  const getNoButtonText = () => {
    const texts = [
      "No",
      "Are you sure?",
      "Look at the T&C again!",
      "Free food though...",
      "I promise to behave",
      "Just one date?",
      "Please?"
    ];
    return texts[Math.min(noCount, texts.length - 1)];
  };

  const getYesButtonSize = () => {
    return Math.min(1 + noCount * 0.2, 3); // Cap scaling at 3x
  };

  return (
    <section id="proposal" ref={containerRef} className="relative min-h-screen bg-brand-red flex flex-col justify-between overflow-hidden py-20">
      <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
        <h1 className="font-display text-[40vw] text-white leading-none">PLEASE</h1>
      </div>

      {/* Stickers Overlay */}
      <div className="absolute inset-0 z-30 pointer-events-none overflow-hidden">
        <AnimatePresence>
          {stickers.map(sticker => (
            <motion.img
              key={sticker.id}
              initial={{ scale: 0, opacity: 0, rotate: 0 }}
              animate={{ scale: 1, opacity: 1, rotate: sticker.rotation }}
              src={sticker.url}
              className="absolute w-32 h-32 md:w-48 md:h-48 object-contain drop-shadow-2xl"
              style={{ left: `${sticker.x}%`, top: `${sticker.y}%` }}
            />
          ))}
        </AnimatePresence>
      </div>

      <div className="z-10 w-full">
        <Marquee text="TAKE A CHANCE ON ME?" className="text-white" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center z-20 px-4 text-center">
        <AnimatePresence mode="wait">
          {!hasSaidYes ? (
            <motion.div
              key="question"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="flex flex-col items-center gap-8 md:gap-12"
            >
              <h2 className="font-serif italic text-2xl md:text-5xl text-white">
                So, what do you say?
              </h2>

              <h1 className="font-display text-5xl md:text-8xl text-white uppercase leading-none">
                Can I take you<br />on a date?
              </h1>

              <div className="flex flex-col md:flex-row items-center gap-6 mt-8 w-full md:w-auto px-6 md:px-0">
                <motion.button
                  onClick={handleYes}
                  onMouseEnter={() => playSfx(UI_SFX.HOVER)}
                  style={{ scale: getYesButtonSize() }}
                  whileHover={{ scale: getYesButtonSize() * 1.1 }}
                  whileTap={{ scale: getYesButtonSize() * 0.95 }}
                  className="bg-white text-brand-red px-12 py-4 font-display text-lg md:text-3xl uppercase tracking-wider hover:bg-brand-gray transition-colors rounded-sm shadow-xl w-full md:w-auto"
                >
                  OKAY, ONE DATE
                </motion.button>

                <motion.button
                  onClick={handleNo}
                  onMouseEnter={() => playSfx(UI_SFX.HOVER)}
                  whileHover={{ x: [0, -10, 10, -10, 10, 0] }}
                  whileTap={{ x: [0, -10, 10, -10, 10, 0] }}
                  className="bg-transparent border-2 border-white text-white px-8 py-4 font-display text-lg md:text-xl uppercase tracking-wider hover:bg-white/10 transition-colors rounded-sm w-full md:w-auto"
                >
                  {getNoButtonText()}
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center gap-6 md:gap-8"
            >
              <h1 className="font-display text-6xl md:text-[10rem] text-white leading-none">
                IT'S A DATE!
              </h1>
              <p className="font-serif italic text-xl md:text-4xl text-white opacity-90 max-w-2xl px-4">
                You won't regret this. <br /> I'll text you the details.
              </p>
              <div className="mt-8">
                <div className="bg-white p-4 rotate-3 shadow-2xl">
                  <p className="font-display text-brand-dark text-lg md:text-xl uppercase">ADMIT ONE: BEST DATE EVER</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="z-10 w-full mt-auto">
        <Marquee text="JUST ONE CHANCE" reverse className="text-white" />
      </div>
    </section>
  );
};

export default Proposal;
