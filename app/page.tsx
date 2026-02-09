
'use client';

import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import Hero from '../components/Hero';
import Narrative from '../components/Narrative';
import Milestones from '../components/Milestones';
import Proposal from '../components/Proposal';
import Marquee from '../components/Marquee';
import FutureMemories from '../components/FutureMemories';
import TermsAndConditions from '../components/TermsAndConditions';
import Places from '../components/Places';
import Preloader from '../components/Preloader';
import AudioPlayer from '../components/AudioPlayer';
import AmbientBackground from '../components/AmbientBackground';
import WhyILikeYou from '../components/WhyILikeYou';
import Footer from '../components/Footer';
import { AudioProvider } from '../components/AudioProvider';
import { client, urlFor, fileUrlFor } from '../lib/sanity';
import { AUDIO_TRACKS } from '../constants';

// Helper to normalize images from Sanity or String URL
const resolveImage = (image: any) => {
  if (!image) return '';
  if (typeof image === 'string') return image;
  try {
    return urlFor(image).url();
  } catch (e) {
    return '';
  }
};

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [cmsData, setCmsData] = useState<any>(null);
  const [customTracks, setCustomTracks] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const query = `{
          "hero": *[_type == "hero"][0],
          "narrative": *[_type == "narrative"][0].texts,
          "milestones": *[_type == "milestone"] | order(order asc, year asc),
          "whyILikeYou": *[_type == "reason"] | order(order asc),
          "futureMemories": *[_type == "futureMemory"] | order(order asc),
          "places": *[_type == "place"] | order(order asc),
          "terms": *[_type == "term"] | order(order asc),
          "audioTracks": *[_type == "audioTrack"]
        }`;

        const data = await client.fetch(query);

        if (data) {
          // Process CMS Audio Tracks
          const trackOverrides: any = {};
          data.audioTracks?.forEach((track: any) => {
            const url = track.file ? fileUrlFor(track.file) : track.url;
            if (url) {
              trackOverrides[track.trackId] = {
                id: track.trackId,
                url: url,
                title: track.title,
                vibe: track.vibe
              };
            }
          });
          setCustomTracks(Object.keys(trackOverrides).length > 0 ? { ...AUDIO_TRACKS, ...trackOverrides } : null);

          const processed = {
            hero: data.hero,
            narrative: data.narrative,
            milestones: data.milestones?.map((m: any) => ({ ...m, image: resolveImage(m.image) })),
            whyILikeYou: data.whyILikeYou,
            futureMemories: data.futureMemories?.map((fm: any) => ({ ...fm, image: resolveImage(fm.image) })),
            places: data.places?.map((p: any) => ({ ...p, image: resolveImage(p.image) })),
            terms: data.terms,
          };
          setCmsData(processed);
        }
      } catch (error) {
        console.warn("Sanity fetch failed, falling back to local constants.", error);
      }
    };

    fetchData();
  }, []);

  return (
    <AudioProvider initialTracks={customTracks}>
      <main className="w-full bg-brand-light text-brand-dark min-h-screen selection:bg-brand-red selection:text-white">

        <AnimatePresence>
          {loading && <Preloader onComplete={() => setLoading(false)} />}
        </AnimatePresence>

        {!loading && (
          <>
            <AudioPlayer />
            <AmbientBackground />

            <div className="fixed inset-0 z-0 w-full h-full">
              <Hero content={cmsData?.hero} />
            </div>

            <div className="relative z-10 flex flex-col mt-[100vh]">
              {/* Removed overflow-hidden to allow sticky positioning in Milestones */}
              <div className="animate-gradient-subtle rounded-t-[3rem] shadow-[0_-25px_50px_-12px_rgba(0,0,0,0.3)] pt-24 md:pt-32 pb-0 bg-brand-light">

                <Narrative content={cmsData?.narrative} />

                <div className="py-24 border-t border-brand-dark/5">
                  <Marquee text="THE STORY SO FAR" className="text-brand-red" />
                </div>

                <Milestones content={cmsData?.milestones} />

                <WhyILikeYou content={cmsData?.whyILikeYou} />

                {/* Dark Sections Group */}
                <div className="bg-brand-dark text-white relative z-20">
                  <FutureMemories content={cmsData?.futureMemories} />

                  <Places content={cmsData?.places} />

                  <TermsAndConditions content={cmsData?.terms} />
                </div>

                <Proposal />
              </div>

              <Footer />
            </div>
          </>
        )}
      </main>
    </AudioProvider>
  );
}
