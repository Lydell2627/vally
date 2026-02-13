
import React from 'react';
import { motion } from 'framer-motion';

const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      // Offset for sticky headers if needed, but smooth scroll is key
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="relative bg-brand-dark text-white pt-20 md:pt-32 pb-12 overflow-hidden border-t border-white/10 z-20">

      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-brand-red/5 rounded-full blur-[120px]" />
        <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] bg-brand-red/5 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="flex flex-col md:flex-row justify-between gap-12 md:gap-8 mb-20 md:mb-32">

          {/* Left: Branding & CTA */}
          <div className="md:w-1/2">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="font-display text-5xl md:text-7xl uppercase leading-[0.9] mb-6 md:mb-8"
            >
              This could be<br />
              <span className="text-brand-red">The Start.</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="font-serif text-lg md:text-2xl text-white/60 max-w-md italic"
            >
              All great stories start with a single "Yes". Or at least a "Maybe".
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              onClick={scrollToTop}
              className="inline-flex items-center gap-4 mt-8 md:mt-12 group cursor-pointer"
            >
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-brand-red group-hover:border-brand-red transition-all duration-500">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover:-rotate-90 transition-transform duration-500">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
              <span className="font-display uppercase tracking-widest text-xs md:text-sm group-hover:translate-x-2 transition-transform duration-300">Back to Top</span>
            </motion.div>
          </div>

          {/* Right: Info Grid */}
          <div className="md:w-1/3 grid grid-cols-2 gap-8">
            <div>
              <h3 className="font-display text-sm uppercase tracking-widest text-brand-red mb-6">Navigation</h3>
              <ul className="space-y-4 font-serif text-base md:text-lg text-white/60">
                <li className="hover:text-white transition-colors cursor-pointer" onClick={() => scrollToSection('home')}>Home</li>
                <li className="hover:text-white transition-colors cursor-pointer" onClick={() => scrollToSection('memories')}>Memories</li>
                <li className="hover:text-white transition-colors cursor-pointer" onClick={() => scrollToSection('future')}>Future</li>
                <li className="hover:text-white transition-colors cursor-pointer" onClick={() => scrollToSection('proposal')}>Proposal</li>
              </ul>
            </div>

            <div>
              <h3 className="font-display text-sm uppercase tracking-widest text-brand-red mb-6">Connect</h3>
              <ul className="space-y-4 font-serif text-base md:text-lg text-white/60">
                <li><a href="https://www.instagram.com/lydellldsouzaa?igsh=MTVtbDczNXNlcXlrdQ%3D%3D&utm_source=qr" className="hover:text-white transition-colors">Instagram</a></li>
                <li><a href="https://open.spotify.com/playlist/26h7oEW0MzhjzyKrz6Hqv5?si=c18aa3b8bb34456c" className="hover:text-white transition-colors">Spotify</a></li>
                <li><a href="https://wa.me/918970689128" className="hover:text-white transition-colors">Message Me</a></li>
              </ul>
              <div className="mt-8 p-4 bg-white/5 rounded-lg border border-white/10 hidden md:block">
                <p className="text-xs uppercase tracking-widest text-white/40 mb-1">Status</p>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="font-display text-sm">Waiting for you</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom / Big Text */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between relative overflow-hidden">
          <p className="font-display text-xs md:text-sm tracking-widest text-white/30 z-10 relative text-center md:text-left">
            EST. {new Date().getFullYear()} © JUST A CHANCE
          </p>

          <p className="font-serif italic text-white/40 z-10 relative mt-4 md:mt-0 text-center md:text-right">
            Designed with hope.
          </p>

          {/* Massive Watermark */}
          <motion.div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center pointer-events-none opacity-5 whitespace-nowrap"
          >
            <h1 className="font-display text-[20vw] md:text-[15vw] leading-none uppercase">
              Vally
            </h1>
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
