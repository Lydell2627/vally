
import React, { useRef, useEffect, useState } from 'react';
import { PLACES, AUDIO_TRACKS } from '../constants';
import { useInView } from 'framer-motion';
import { useAudio } from './AudioProvider';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface PlacesProps {
  content?: any[];
}

// Fallback images if data is missing
const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=1200&auto=format&fit=crop", // Switzerland vibe
  "https://images.unsplash.com/photo-1499002238440-d264edd596ec?q=80&w=1200&auto=format&fit=crop", // Countryside
  "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=1200&auto=format&fit=crop", // Cinque Terre
  "https://images.unsplash.com/photo-1506929562872-bb421503ef21?q=80&w=1200&auto=format&fit=crop", // Beach
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop"  // Ocean
];

const Places: React.FC<PlacesProps> = ({ content }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const placesData = content || PLACES;

  // Audio Trigger (Music only, NO SFX)
  const { setTrack } = useAudio();
  const isInView = useInView(containerRef, { amount: 0.1 });

  useEffect(() => {
    if (isInView) setTrack(AUDIO_TRACKS.PLACES);
  }, [isInView, setTrack]);

  // Dream Spot Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dreamSpot, setDreamSpot] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // --- GSAP SCROLL TRIGGER LOGIC ---
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (!triggerRef.current || !containerRef.current) return;

    // Context for easy cleanup
    let ctx = gsap.context(() => {
      const panels = gsap.utils.toArray(".place-panel");
      const totalPanels = panels.length;

      // Guard: No panels found yet (SSR/hydration)
      if (totalPanels === 0) return;

      // --- 1. Setup Initial State ---
      gsap.set(panels, {
        zIndex: (i: number) => i + 1,
        // First panel visible, others off-screen right
        xPercent: (i: number) => i === 0 ? 0 : 100
      });

      // --- 2. Create Timeline ---
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerRef.current,
          pin: true,
          start: "top top",
          // The scroll length determines the speed. 
          end: () => "+=" + (totalPanels * 100) + "%",
          scrub: 1, // Smooth scrubbing
          anticipatePin: 1,
          invalidateOnRefresh: true
        }
      });

      // --- 3. Animation Loop ---
      panels.forEach((panel: any, i: number) => {
        if (i === 0) return; // Skip first panel (it's the base)

        // Panel Slide In
        tl.to(panel, {
          xPercent: 0,
          ease: "none", // Linear movement tied to scroll
          duration: 1
        });

        // "Award Winning" Inner Animations (Parallax & Reveal)
        const img = panel.querySelector("img");
        const content = panel.querySelector(".place-content-inner");

        if (img) {
          // Image scales down from 1.2 to 1 and slides slightly to create parallax "window" effect
          tl.fromTo(img,
            { scale: 1.3, xPercent: 20 },
            { scale: 1, xPercent: 0, ease: "power2.out", duration: 1 },
            "<" // Start at same time as panel slide
          );
        }

        if (content) {
          // Text fades in and moves up slightly later
          tl.fromTo(content,
            { opacity: 0, x: 50 },
            { opacity: 1, x: 0, ease: "power2.out", duration: 0.5 },
            ">-0.3" // Start towards end of slide
          );
        }
      });

    }, triggerRef);

    return () => ctx.revert();
  }, [placesData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dreamSpot.trim()) return;
    setIsSubmitting(true);
    try {
      await fetch('/api/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'place', data: { suggestion: dreamSpot } })
      });
      setHasSubmitted(true);
      setTimeout(() => {
        setIsModalOpen(false);
        setHasSubmitted(false);
        setDreamSpot("");
      }, 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const getImage = (place: any, index: number) => {
    if (place.image && place.image.trim() !== "") return place.image;
    return FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
  };

  return (
    <div ref={triggerRef} className="relative w-full h-screen bg-brand-dark overflow-hidden">

      {/* Fixed Header */}
      <div className="absolute top-6 left-6 md:top-10 md:left-10 z-[60] pointer-events-none">
        <div className="bg-black/30 backdrop-blur-md border border-white/10 px-6 py-4 rounded-2xl shadow-2xl">
          <h2 className="font-display text-2xl md:text-3xl uppercase tracking-wider leading-none text-white">
            Places I Wanna<br />
            <span className="text-brand-red">Go With You</span>
          </h2>
        </div>
      </div>

      {/* Main Container for GSAP Panels */}
      <div ref={containerRef} className="relative w-full h-full">

        {placesData.map((place, i) => (
          <div
            key={i}
            className="place-panel absolute inset-0 w-full h-full bg-brand-dark overflow-hidden flex flex-col md:flex-row shadow-[-50px_0_50px_-20px_rgba(0,0,0,0.5)]"
          >
            {/* Full Screen Background Image */}
            <div className="absolute inset-0 w-full h-full z-0">
              <img
                src={getImage(place, i)}
                alt={place.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>

            {/* Content Overlay */}
            <div className="relative z-10 w-full h-full flex flex-col justify-end p-8 md:p-20 pointer-events-none">
              <div className="place-content-inner max-w-4xl">
                <div className="overflow-hidden mb-2">
                  <span className="inline-block px-3 py-1 bg-brand-red text-white text-xs font-display uppercase tracking-widest rounded-sm mb-4">
                    Destination 0{i + 1}
                  </span>
                </div>

                <div className="overflow-hidden">
                  <h1 className="font-display text-6xl md:text-[9rem] uppercase text-white leading-[0.85] mb-6 drop-shadow-2xl">
                    {place.name}
                  </h1>
                </div>

                <div className="overflow-hidden">
                  <p className="font-serif text-lg md:text-3xl text-white/90 max-w-2xl drop-shadow-lg leading-relaxed italic border-l-2 border-brand-red pl-6">
                    "{place.subtitle || 'Adventure'}: {place.description}"
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}

      </div>

      {/* Suggestion Button */}
      <button
        onClick={handleOpenModal}
        className="absolute bottom-8 right-8 z-[70] group flex items-center gap-3 px-6 py-3 rounded-full bg-brand-red/90 text-white backdrop-blur-md hover:bg-white hover:text-brand-red transition-all duration-300 shadow-xl"
      >
        <span className="font-display text-sm uppercase tracking-widest">Suggest a Spot</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:translate-x-1 transition-transform">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </button>

      {/* --- MODAL FOR DREAM SPOT --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white text-brand-dark p-8 md:p-12 rounded-sm max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-300">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-brand-dark/30 hover:text-brand-red transition-colors"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
            </button>

            <h3 className="font-display text-4xl uppercase mb-2">Dream Spot?</h3>
            <p className="font-serif text-gray-600 mb-8 italic">Where should we go next?</p>

            {!hasSubmitted ? (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                  type="text"
                  value={dreamSpot}
                  onChange={(e) => setDreamSpot(e.target.value)}
                  placeholder="e.g. Iceland"
                  className="w-full border-b border-brand-dark/20 py-2 font-display text-xl outline-none focus:border-brand-red transition-colors bg-transparent placeholder:text-gray-300"
                  autoFocus
                />
                <button
                  disabled={isSubmitting || !dreamSpot.trim()}
                  className="mt-4 bg-brand-red text-white py-3 font-display uppercase tracking-widest hover:bg-brand-dark transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "Sending..." : "Send Suggestion"}
                </button>
              </form>
            ) : (
              <div className="text-center py-8">
                <p className="font-display text-2xl text-brand-red uppercase">Added to the list.</p>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default Places;
