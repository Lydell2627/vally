
import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { Howl } from 'howler';
import { AUDIO_TRACKS } from '../constants';

interface Track {
  id: string;
  url: string;
  title: string;
  vibe: string;
}

interface AudioContextType {
  isPlaying: boolean;
  togglePlay: () => void;
  setTrack: (trackOrId: Track | string) => void;
  playSfx: (url: string, volume?: number) => void;
  currentTrack: Track;
}

const AudioContext = createContext<AudioContextType | null>(null);

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};

export const AudioProvider: React.FC<{ children: React.ReactNode, initialTracks?: any }> = ({ children, initialTracks }) => {
  const tracks = initialTracks || AUDIO_TRACKS;

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<Track>(tracks.HERO);

  // Howl cache — one Howl instance per URL, reused on repeat visits
  const howlCache = useRef<Map<string, Howl>>(new Map());
  const activeHowlRef = useRef<Howl | null>(null);
  const isPlayingRef = useRef(false); // Sync ref so callbacks always see latest

  // Keep ref in sync
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  // Get or create a cached Howl for a URL
  const getHowl = useCallback((url: string): Howl => {
    if (howlCache.current.has(url)) {
      return howlCache.current.get(url)!;
    }
    const howl = new Howl({
      src: [url],
      html5: true,     // Stream instead of download — faster start, lower memory
      loop: true,
      volume: 0,
      preload: true,
    });
    howlCache.current.set(url, howl);
    return howl;
  }, []);

  // Initialize the first track on mount
  useEffect(() => {
    if (tracks.HERO?.url) {
      const howl = getHowl(tracks.HERO.url);
      activeHowlRef.current = howl;
    }

    // Cleanup all Howls on unmount
    return () => {
      howlCache.current.forEach(howl => {
        howl.stop();
        howl.unload();
      });
      howlCache.current.clear();
    };
  }, [tracks.HERO?.url, getHowl]);

  // Auto-start music on first user interaction (browser requires a gesture)
  useEffect(() => {
    const startOnInteraction = () => {
      const howl = activeHowlRef.current;
      if (howl && !isPlayingRef.current) {
        howl.volume(0);
        howl.play();
        howl.fade(0, 1, 2500);
        setIsPlaying(true);
      }
      document.removeEventListener('touchstart', startOnInteraction);
      document.removeEventListener('click', startOnInteraction);
    };

    document.addEventListener('touchstart', startOnInteraction, { once: true });
    document.addEventListener('click', startOnInteraction, { once: true });

    return () => {
      document.removeEventListener('touchstart', startOnInteraction);
      document.removeEventListener('click', startOnInteraction);
    };
  }, []);

  const setTrack = useCallback((trackOrId: Track | string) => {
    // Resolve track
    let newTrack: Track;
    if (typeof trackOrId === 'string') {
      const trackKey = Object.keys(tracks).find(k => tracks[k].id === trackOrId);
      newTrack = trackKey ? tracks[trackKey] : (trackOrId as any);
    } else {
      newTrack = trackOrId;
    }

    if (!newTrack || !newTrack.url || newTrack.id === currentTrack.id) return;

    setCurrentTrack(newTrack);

    const newHowl = getHowl(newTrack.url);
    const oldHowl = activeHowlRef.current;

    if (!isPlayingRef.current) {
      // Not playing yet — just set the active reference
      activeHowlRef.current = newHowl;
      return;
    }

    // === DJ CROSSFADE ===
    // Fade in the new track
    newHowl.volume(0);
    newHowl.play();
    newHowl.fade(0, 1, 2000);

    // Fade out the old track
    if (oldHowl && oldHowl !== newHowl) {
      oldHowl.fade(oldHowl.volume(), 0, 2000);
      // Stop the old howl after fade completes to free resources
      setTimeout(() => {
        oldHowl.stop();
      }, 2100);
    }

    activeHowlRef.current = newHowl;
  }, [tracks, currentTrack.id, getHowl]);

  const togglePlay = useCallback(() => {
    const howl = activeHowlRef.current;
    if (!howl) return;

    if (isPlayingRef.current) {
      howl.fade(howl.volume(), 0, 1000);
      setTimeout(() => howl.pause(), 1100);
      setIsPlaying(false);
    } else {
      howl.play();
      howl.fade(0, 1, 1000);
      setIsPlaying(true);
    }
  }, []);

  // Play a one-shot sound effect
  const playSfx = useCallback((url: string, volume: number = 0.4) => {
    const sfx = new Howl({
      src: [url],
      html5: true,
      volume: volume,
      loop: false,
    });
    sfx.play();
    // Auto-cleanup after playback
    sfx.on('end', () => sfx.unload());
  }, []);

  return (
    <AudioContext.Provider value={{ isPlaying, togglePlay, setTrack, playSfx, currentTrack }}>
      {children}
    </AudioContext.Provider>
  );
};
