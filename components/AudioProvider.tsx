
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

  // Initialize background Howl when URL is available
  useEffect(() => {
    if (!bgUrl) return;

    // Clean up any previous instance first
    if (bgHowlRef.current) {
      bgHowlRef.current.stop();
      bgHowlRef.current.unload();
      bgHowlRef.current = null;
    }

    const bgHowl = new Howl({
      src: [bgUrl],
      loop: true,
      volume: bgVolume,
      preload: true,
      onloaderror: (_id, err) => {
        console.error('Audio: bg load error', err);
      },
    });

    bgHowlRef.current = bgHowl;

    // If already playing (URL changed while music was on), resume
    if (isPlayingRef.current && !userPausedRef.current) {
      bgHowl.play();
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
      loop: false,
      volume: reelVolume,
      preload: true,
    });
    reelHowlRef.current = reelHowl;

    return () => {
      reelHowl.stop();
      reelHowl.unload();
    };
  }, [reelUrl, reelVolume]);

  // Toggle play/pause — called by AudioPlayer button (user gesture required)
  const togglePlay = useCallback(() => {
    const bg = bgHowlRef.current;
    if (!bg) return;

    if (isPlayingRef.current) {
      bg.pause();
      setIsPlaying(false);
      userPausedRef.current = true;
    } else {
      bg.volume(bgVolume);
      bg.play();
      setIsPlaying(true);
      userPausedRef.current = false;
    }
  }, [bgVolume]);

  // Pause background (for reel)
  const pauseBg = useCallback(() => {
    const bg = bgHowlRef.current;
    if (bg && isPlayingRef.current) {
      bg.pause();
      setIsPlaying(false);
    }
  }, []);

  // Resume background after reel
  const resumeBg = useCallback(() => {
    const bg = bgHowlRef.current;
    if (bg && !isPlayingRef.current && !userPausedRef.current) {
      bg.volume(bgVolume);
      bg.play();
      setIsPlaying(true);
    }
  }, [bgVolume]);

  // Play reel audio
  const playReel = useCallback(() => {
    const reel = reelHowlRef.current;
    if (reel) {
      reel.stop();
      reel.volume(reelVolume);
      reel.play();
    }
  }, [reelVolume]);

  // Stop reel audio
  const stopReel = useCallback(() => {
    const reel = reelHowlRef.current;
    if (reel) {
      reel.stop();
    }
  }, []);

  // Play a one-shot SFX
  const playSfx = useCallback((url: string, volume: number = 0.4) => {
    const sfx = new Howl({
      src: [url],
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
