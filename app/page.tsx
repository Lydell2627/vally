
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

// Helper to normalize images from Sanity or String URL
const resolveImage = (image: any, width = 1920) => {
  if (!image) return '';
  if (typeof image === 'string') return image;
  try {
    return (urlFor(image) as any).width(width).quality(100).auto('format').url();
  } catch (e) {
    return '';
  }
};

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [cmsData, setCmsData] = useState<any>(null);
  const [audioConfig, setAudioConfig] = useState<any>(undefined);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const query = `{
          "hero": *[_type == "hero"][0],
          "narrative": *[_type == "narrative"][0].texts,
          "milestones": *[_type == "milestone"] | order(order asc, year asc),
          "whyILikeYou": *[_type == "reason"] | order(order asc),
          "futureMemories": *[_type == "futureMemory"] | order(order asc),
          "futureGallery": *[_type == "futureGallery"] | order(order asc),
          "places": *[_type == "place"] | order(order asc),
          "terms": *[_type == "term"] | order(order asc),
          "audioTracks": *[_type == "audioTrack"],
          "metrics": *[_type == "metrics"][0] { reactionImages, reactionSounds }
        }`;

        const data = await client.fetch(query);

        if (data) {
          // Process audio tracks — just background & reel
          const config: any = {};
          console.log("🎵 Raw Sanity audioTracks:", JSON.stringify(data.audioTracks, null, 2));
          data.audioTracks?.forEach((track: any) => {
            console.log("🎵 Processing track:", track.title, "| role:", track.role, "| file:", JSON.stringify(track.file), "| url:", track.url);
            const url = track.file ? fileUrlFor(track.file) : track.url;
            console.log("🎵 Resolved URL:", url);
            if (url && track.role) {
              if (track.role === 'background') {
                config.backgroundUrl = url;
                if (track.volume != null) config.backgroundVolume = track.volume;
              } else if (track.role === 'reel') {
                config.reelUrl = url;
                if (track.volume != null) config.reelVolume = track.volume;
              }
            }
          });
          console.log("🎵 Final audioConfig:", JSON.stringify(config));
          if (Object.keys(config).length > 0) setAudioConfig(config);

          const processed = {
            hero: data.hero ? {
              top: data.hero.top || data.hero.title,
              bottom: data.hero.bottom,
              subtitle: data.hero.subtitle,
            } : null,
            narrative: data.narrative,
            milestones: data.milestones?.map((m: any) => ({
              ...m,
              image: resolveImage(m.image),
              backgroundImage: resolveImage(m.backgroundImage),
              images: m.images?.map((img: any) => resolveImage(img)) || [],
            })),
            whyILikeYou: data.whyILikeYou?.map((r: any) => ({
              ...r,
              description: r.text || r.description,
            })),
            futureMemories: data.futureMemories?.map((fm: any) => ({ ...fm, image: resolveImage(fm.image) })),
            futureGallery: data.futureGallery?.map((fg: any) => ({
              ...fg,
              image: resolveImage(fg.image),
              images: fg.images?.map((img: any) => resolveImage(img)) || [],
            })),
            places: data.places?.map((p: any) => ({ ...p, image: resolveImage(p.image, 3840) })),
            terms: data.terms?.map((t: any) => ({
              ...t,
              content: t.content || t.description,
            })),
            metrics: {
              reactionImages: data.metrics?.reactionImages?.map((img: any) => resolveImage(img)) || [],
              reactionSounds: data.metrics?.reactionSounds?.map((snd: any) => snd.asset ? fileUrlFor(snd.asset) : '') || [],
            }
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
    <AudioProvider audioConfig={audioConfig}>
      <main className="w-full bg-brand-light text-brand-dark min-h-screen selection:bg-brand-red selection:text-white">

        <AnimatePresence>
          {loading && <Preloader onComplete={() => setLoading(false)} />}
        </AnimatePresence>

        {!loading && (
          <>
            <AudioPlayer />
            <AmbientBackground />

            <div id="home" className="fixed inset-0 z-0 w-full h-full">
              <Hero content={cmsData?.hero} />
            </div>

            <div className="relative z-10 flex flex-col mt-[100vh]">
              {/* Removed overflow-hidden to allow sticky positioning in Milestones */}
              <div className="animate-gradient-subtle rounded-t-[3rem] shadow-[0_-25px_50px_-12px_rgba(0,0,0,0.3)] pt-24 md:pt-32 pb-0 bg-brand-light">

                <Narrative content={cmsData?.narrative} />

                <div className="py-24 border-t border-brand-dark/5">
                  <Marquee text="THE STORY SO FAR" className="text-brand-red" />
                </div>

                <div id="memories">
                  <Milestones content={cmsData?.milestones} />
                </div>

                <WhyILikeYou content={cmsData?.whyILikeYou} />

                {/* Dark Sections Group */}
                <div className="bg-brand-dark text-white relative z-20">
                  <div id="future">
                    <FutureMemories content={cmsData?.futureMemories} gallery={cmsData?.futureGallery} />
                  </div>

                  <Places content={cmsData?.places} />

                  <TermsAndConditions content={cmsData?.terms} />
                </div>

                <Proposal reactions={cmsData?.metrics} />
              </div>

              <Footer />
            </div>
          </>
        )}
      </main>
    </AudioProvider>
  );
}

