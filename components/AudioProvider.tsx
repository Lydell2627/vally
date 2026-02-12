
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
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
  // Use CMS tracks if provided, otherwise fallback to constants
  const tracks = initialTracks || AUDIO_TRACKS;

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<Track>(tracks.HERO);

  const audioA = useRef<HTMLAudioElement | null>(null);
  const audioB = useRef<HTMLAudioElement | null>(null);
  const activeAudio = useRef<'A' | 'B'>('A');

  useEffect(() => {
    // Initialize audio elements on mount to avoid SSR issues
    audioA.current = new Audio();
    audioB.current = new Audio();

    audioA.current.loop = true;
    audioB.current.loop = true;
    audioA.current.volume = 0;
    audioB.current.volume = 0;

    // Set initial source
    audioA.current.src = tracks.HERO.url;

    return () => {
      audioA.current?.pause();
      audioB.current?.pause();
    };
  }, [tracks.HERO.url]);

  // Auto-start music on first user interaction (browser requires a gesture)
  useEffect(() => {
    const startOnInteraction = () => {
      const a = audioA.current;
      if (a && !isPlaying) {
        a.volume = 0;
        a.play().then(() => {
          setIsPlaying(true);
          fade(a, 1, 2500);
        }).catch(() => { });
      }
      // Remove listeners after first trigger
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

  const fade = (audio: HTMLAudioElement, targetVolume: number, duration: number) => {
    const step = 0.05;
    const intervalTime = 50;
    const steps = duration / intervalTime;
    const volStep = (targetVolume - audio.volume) / steps;

    const interval = setInterval(() => {
      if (!audio) {
        clearInterval(interval);
        return;
      }

      let newVol = audio.volume + volStep;
      if (volStep > 0 && newVol >= targetVolume) newVol = targetVolume;
      if (volStep < 0 && newVol <= targetVolume) newVol = targetVolume;

      audio.volume = Math.max(0, Math.min(1, newVol));

      if (newVol === targetVolume) {
        clearInterval(interval);
        if (targetVolume === 0) audio.pause();
      }
    }, intervalTime);
    return interval;
  };

  const setTrack = (trackOrId: Track | string) => {
    // Resolve track if ID was passed (useful for CMS dynamic lookups)
    let newTrack: Track;
    if (typeof trackOrId === 'string') {
      // Look for a key in our tracks object that matches the ID
      const trackKey = Object.keys(tracks).find(k => tracks[k].id === trackOrId);
      newTrack = trackKey ? tracks[trackKey] : (trackOrId as any); // fallback to ID as object if not found
    } else {
      newTrack = trackOrId;
    }

    if (!newTrack || !newTrack.url || newTrack.id === currentTrack.id) return;

    setCurrentTrack(newTrack);

    const a = audioA.current;
    const b = audioB.current;
    if (!a || !b) return;

    if (!isPlaying) {
      const targetAudio = activeAudio.current === 'A' ? a : b;
      targetAudio.src = newTrack.url;
      return;
    }

    // Crossfade Logic
    const fadeOutAudio = activeAudio.current === 'A' ? a : b;
    const fadeInAudio = activeAudio.current === 'A' ? b : a;

    fadeInAudio.src = newTrack.url;
    fadeInAudio.volume = 0;
    fadeInAudio.play().catch(e => console.warn("Audio play blocked", e));

    fade(fadeInAudio, 1, 2500);
    fade(fadeOutAudio, 0, 2500);

    activeAudio.current = activeAudio.current === 'A' ? 'B' : 'A';
  };

  const togglePlay = () => {
    const currentAudio = activeAudio.current === 'A' ? audioA.current : audioB.current;
    if (!currentAudio) return;

    if (isPlaying) {
      fade(currentAudio, 0, 1000);
      setIsPlaying(false);
    } else {
      currentAudio.play().catch(e => console.log("Interaction required"));
      fade(currentAudio, 1, 1000);
      setIsPlaying(true);
    }
  };

  // Play a one-shot sound effect
  const playSfx = (url: string, volume: number = 0.4) => {
    const sfx = new Audio(url);
    sfx.volume = volume;
    sfx.play().catch(() => {
      // SFX might be blocked if no interaction yet, ignore
    });
  };

  return (
    <AudioContext.Provider value={{ isPlaying, togglePlay, setTrack, playSfx, currentTrack }}>
      {children}
    </AudioContext.Provider>
  );
};
