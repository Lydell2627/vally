
import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { Howl } from 'howler';

interface AudioConfig {
  backgroundUrl?: string;
  backgroundVolume?: number;
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

const DEFAULT_BG_VOLUME = 0.3;

export const AudioProvider: React.FC<{ children: React.ReactNode; audioConfig?: AudioConfig }> = ({
  children,
  audioConfig,
}) => {
  const bgUrl = audioConfig?.backgroundUrl;
  const bgVolume = audioConfig?.backgroundVolume ?? DEFAULT_BG_VOLUME;
  const reelUrl = audioConfig?.reelUrl;
  const reelVolume = audioConfig?.reelVolume ?? 0.8;

  const [isPlaying, setIsPlaying] = useState(false);
  const bgHowlRef = useRef<Howl | null>(null);
  const reelHowlRef = useRef<Howl | null>(null);
  const isPlayingRef = useRef(false);
  const userPausedRef = useRef(false);

  // Keep ref in sync
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  // Initialize background Howl — only when we have a valid URL from Sanity
  useEffect(() => {
    if (!bgUrl) {
      console.log("AudioProvider: No background URL provided, skipping init.");
      return;
    }

    console.log("AudioProvider: Initializing bg track:", bgUrl);

    const bgHowl = new Howl({
      src: [bgUrl],
      html5: true,
      loop: true,
      volume: 0,
      preload: true,
      onload: () => {
        console.log("AudioProvider: Background track loaded successfully!");
      },
      onloaderror: (_id, err) => {
        console.error("AudioProvider: Background load error:", err, "URL:", bgUrl);
      },
      onplayerror: (_id, err) => {
        console.error("AudioProvider: Background play error:", err);
        // Retry on unlock (browser autoplay policy)
        bgHowl.once('unlock', () => bgHowl.play());
      },
    });

    // Clean up previous instance
    const oldHowl = bgHowlRef.current;
    if (oldHowl) {
      oldHowl.stop();
      oldHowl.unload();
    }

    bgHowlRef.current = bgHowl;

    // If already playing (e.g. URL changed while music was on), resume
    if (isPlayingRef.current) {
      bgHowl.play();
      bgHowl.fade(0, bgVolume, 1000);
    }

    return () => {
      bgHowl.stop();
      bgHowl.unload();
    };
  }, [bgUrl, bgVolume]);

  // Initialize reel Howl if URL provided
  useEffect(() => {
    if (!reelUrl) return;

    console.log("AudioProvider: Initializing reel track:", reelUrl);

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
    if (!bgUrl) return; // Don't auto-start if no URL

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
  }, [bgVolume, bgUrl]);

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

  // Pause background (for reel)
  const pauseBg = useCallback(() => {
    const bg = bgHowlRef.current;
    if (bg && isPlayingRef.current) {
      bg.fade(bg.volume(), 0, 1000);
      setTimeout(() => bg.pause(), 1100);
      setIsPlaying(false);
    }
  }, []);

  // Resume background after reel
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
