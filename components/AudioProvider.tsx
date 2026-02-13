
import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { Howl } from 'howler';

interface AudioConfig {
  backgroundUrl: string;
  backgroundVolume: number;
  reelUrl?: string;
  reelVolume?: number;
}

interface AudioContextType {
  isPlaying: boolean;
  togglePlay: () => void;
  pauseBg: () => void;
  resumeBg: () => void;
  playReel: () => void;
  stopReel: () => void;
  playSfx: (url: string, volume?: number) => void;
}

const AudioContext = createContext<AudioContextType | null>(null);

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};

const DEFAULT_BG_URL = 'https://assets.mixkit.co/music/preview/mixkit-dreaming-big-31.mp3';
const DEFAULT_BG_VOLUME = 0.3;

export const AudioProvider: React.FC<{ children: React.ReactNode; audioConfig?: AudioConfig }> = ({
  children,
  audioConfig,
}) => {
  const bgUrl = audioConfig?.backgroundUrl || DEFAULT_BG_URL;
  const bgVolume = audioConfig?.backgroundVolume ?? DEFAULT_BG_VOLUME;
  const reelUrl = audioConfig?.reelUrl;
  const reelVolume = audioConfig?.reelVolume ?? 0.8;

  const [isPlaying, setIsPlaying] = useState(false);
  const bgHowlRef = useRef<Howl | null>(null);
  const reelHowlRef = useRef<Howl | null>(null);
  const isPlayingRef = useRef(false);
  const userPausedRef = useRef(false); // Track if user explicitly paused

  // Keep ref in sync
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  // Initialize background Howl
  useEffect(() => {
    // Check if we should be playing (global state + user intent)
    const shouldPlay = isPlayingRef.current && !userPausedRef.current;

    // Create new Howl
    const bgHowl = new Howl({
      src: [bgUrl],
      html5: true,
      loop: true,
      volume: 0, // Start silent for fade-in
      preload: true,
    });

    // If we were playing, swap seamlessly
    if (shouldPlay) {
      bgHowl.play();
      bgHowl.fade(0, bgVolume, 1000);
    }

    // Update ref
    const oldHowl = bgHowlRef.current;
    bgHowlRef.current = bgHowl;

    // Cleanup old Howl
    if (oldHowl) {
      oldHowl.fade(oldHowl.volume(), 0, 500);
      setTimeout(() => oldHowl.unload(), 500);
    }

    return () => {
      bgHowl.stop();
      bgHowl.unload();
    };
  }, [bgUrl, bgVolume]);

  // Initialize reel Howl if URL provided
  useEffect(() => {
    if (!reelUrl) return;
    const reelHowl = new Howl({
      src: [reelUrl],
      html5: true,
      loop: false,
      volume: 0,
      preload: true,
    });
    reelHowlRef.current = reelHowl;

    return () => {
      reelHowl.stop();
      reelHowl.unload();
    };
  }, [reelUrl]);

  // Auto-start background on first user interaction
  useEffect(() => {
    const startOnInteraction = () => {
      const bg = bgHowlRef.current;
      if (bg && !isPlayingRef.current) {
        bg.play();
        bg.fade(0, bgVolume, 2500);
        setIsPlaying(true);
        userPausedRef.current = false;
      }
    };

    document.addEventListener('touchstart', startOnInteraction, { once: true });
    document.addEventListener('click', startOnInteraction, { once: true });

    return () => {
      document.removeEventListener('touchstart', startOnInteraction);
      document.removeEventListener('click', startOnInteraction);
    };
  }, [bgVolume]);

  // Toggle play/pause (user-facing button)
  const togglePlay = useCallback(() => {
    const bg = bgHowlRef.current;
    if (!bg) return;

    if (isPlayingRef.current) {
      bg.fade(bg.volume(), 0, 800);
      setTimeout(() => bg.pause(), 900);
      setIsPlaying(false);
      userPausedRef.current = true;
    } else {
      bg.play();
      bg.fade(0, bgVolume, 800);
      setIsPlaying(true);
      userPausedRef.current = false;
    }
  }, [bgVolume]);

  // Pause background (for reel — only if currently playing)
  const pauseBg = useCallback(() => {
    const bg = bgHowlRef.current;
    if (bg && isPlayingRef.current) {
      bg.fade(bg.volume(), 0, 1000);
      setTimeout(() => bg.pause(), 1100);
      setIsPlaying(false);
    }
  }, []);

  // Resume background after reel (only if user hadn't manually paused)
  const resumeBg = useCallback(() => {
    const bg = bgHowlRef.current;
    if (bg && !isPlayingRef.current && !userPausedRef.current) {
      bg.play();
      bg.fade(0, bgVolume, 1000);
      setIsPlaying(true);
    }
  }, [bgVolume]);

  // Play reel audio
  const playReel = useCallback(() => {
    const reel = reelHowlRef.current;
    if (reel) {
      reel.stop();
      reel.volume(0);
      reel.play();
      reel.fade(0, reelVolume, 1000);
    }
  }, [reelVolume]);

  // Stop reel audio
  const stopReel = useCallback(() => {
    const reel = reelHowlRef.current;
    if (reel) {
      reel.fade(reel.volume(), 0, 800);
      setTimeout(() => reel.stop(), 900);
    }
  }, []);

  // Play a one-shot SFX
  const playSfx = useCallback((url: string, volume: number = 0.4) => {
    const sfx = new Howl({
      src: [url],
      html5: true,
      volume,
      loop: false,
    });
    sfx.play();
    sfx.on('end', () => sfx.unload());
  }, []);

  return (
    <AudioContext.Provider value={{ isPlaying, togglePlay, pauseBg, resumeBg, playReel, stopReel, playSfx }}>
      {children}
    </AudioContext.Provider>
  );
};
