
import React, { useRef, useState, useMemo } from 'react';
import { TERMS_AND_CONDITIONS, UI_SFX } from '../constants';
import { motion, useScroll, useTransform, MotionValue, AnimatePresence } from 'framer-motion';
import { useAudio } from './AudioProvider';

const RaysBackground = () => (
  <div className="absolute top-0 left-0 right-0 mx-auto h-full w-[350px] md:w-[600px] pointer-events-none z-0 overflow-visible">
    <div className="absolute block w-full h-full transform -skew-x-[20deg]">
      <div className="absolute top-0 left-1/2 overflow-visible w-full h-full -translate-x-1/2">
        <svg className="w-[395px] h-[3118px] opacity-60 mix-blend-screen" viewBox="0 0 395 3118">
          <g className="animate-[rays-move_45s_linear_infinite]">
            {/* Primary Red Rays - Made brighter and thicker */}
            <path stroke="#ce1215" d="M 1,0 L 1,51 M 1,175 L 1,199 M 1,237 L 1,252 M 1,298 L 1,325 M 1,382 L 1,406 M 1,507 L 1,530 M 1,607 L 1,655 M 1,770 L 1,776 M 1,869 L 1,920 M 1,1042 L 1,1075 M 1,1278 L 1,1285 M 1,1316 L 1,1360 M 1,1459 L 1,1501 M 1,1606 L 1,1615 M 1,1647 L 1,1657 M 1,1685 L 1,1736 M 1,1889 L 1,1897 M 1,2105 L 1,2120 M 1,2266 L 1,2280 M 1,2420 L 1,2452 M 1,2645 L 1,2659 M 1,2705 L 1,2729 M 1,2940 L 1,2943 M 1,3112 L 1,3118 M 1,3118 L 1,3169 M 1,3293 L 1,3317 M 1,3355 L 1,3370 M 1,3416 L 1,3443 M 1,3500 L 1,3524 M 1,3625 L 1,3648 M 1,3725 L 1,3773 M 1,3888 L 1,3894 M 1,3987 L 1,4038 M 1,4160 L 1,4193 M 1,4396 L 1,4403 L 1,4434 L 1,4478 M 1,4577 L 1,4619 M 1,4724 L 1,4733 M 1,4765 L 1,4775 M 1,4803 L 1,4854 M 1,5007 L 1,5015 M 1,5223 L 1,5238 M 1,5384 L 1,5398 M 1,5538 L 1,5570 M 1,5763 L 1,5777 M 1,5823 L 1,5847 M 1,6058 L 1,6061 M 1,6230 L 1,6236 M 1, 3118 z" style={{ strokeWidth: '3px' }}></path>
            {/* Secondary White Rays */}
            <path stroke="#ffffff" d="M 46,0 L 46,17 M 46,91 L 46,111 M 46,248 L 46,272 M 46,486 L 46,499 M 46,604 L 46,647 M 46,777 L 46,793 M 46,909 L 46,927 M 46,1114 L 46,1132 M 46,1243 L 46,1265 M 46,1306 L 46,1310 M 46,1420 L 46,1429 M 46,1528 L 46,1576 M 46,1750 L 46,1759 M 46,1887 L 46,1912 M 46,2003 L 46,2016 M 46,2132 L 46,2181 M 46,2211 L 46,2246 M 46,2335 L 46,2380 M 46,2464 L 46,2470 M 46,2517 L 46,2557 M 46,2620 L 46,2667 M 46,2833 L 46,2858 M 46,3024 L 46,3071 M 46,3118 L 46,3135 M 46,3209 L 46,3229 M 46,3366 L 46,3390 M 46,3604 L 46,3617 M 46,3722 L 46,3765 M 46,3895 L 46,4027 L 46,4045 M 46,4232 L 46,4250 M 46,4361 L 46,4383 M 46,4424 L 46,4428 M 46,4538 L 46,4547 M 46,4646 L 46,4694 M 46,4868 L 46,4877 M 46,5005 L 46,5030 M 46,5121 L 46,5134 M 46,5250 L 46,5299 M 46,5329 L 46,5364 M 46,5453 L 46,5498 M 46,5582 L 46,5588 M 46,5635 L 46,5675 M 46,5738 L 46,5785 M 46,5951 L 46,5976 M 46,6142 L 46,6189 M 46, 3118 z" style={{ strokeWidth: '1.5px', opacity: 0.6 }}></path>
          </g>
        </svg>
      </div>
    </div>
  </div>
);

const Card: React.FC<{ term: any, index: number, total: number, progress: MotionValue<number> }> = ({ term, index, total, progress }) => {
  const step = 1 / total;
  const start = index * step;
  const end = start + step * 1.5; 
  
  // Stable random values for rotation to prevent jitter during re-renders
  // We use useMemo with an empty dependency array so it's calculated once per component mount
  const randomRotationStart = useMemo(() => (Math.random() - 0.5) * 10, []);
  const randomRotationEnd = useMemo(() => (Math.random() - 0.5) * 60, []);

  // Animate: Up and Out to the right slightly (like tossing a paper)
  const y = useTransform(progress, [start, end], ["-50%", "-300%"]);
  const x = useTransform(progress, [start, end], ["-50%", "100%"]); // Flies right
  
  // Use the stable random values here
  const rotation = useTransform(progress, [start, end], [randomRotationStart, randomRotationEnd]);
  
  const opacity = useTransform(progress, [start + step * 0.5, end], [1, 0]);

  // Paper texture effect overlay
  const paperTexture = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.1'/%3E%3C/svg%3E")`;

  return (
    <motion.div
       style={{ 
         position: 'absolute',
         top: '50%', 
         left: '50%', 
         y, x,
         rotate: rotation,
         opacity,
         zIndex: total - index
       }}
       className="w-[85vw] max-w-[360px] aspect-[4/5] bg-[#fdfaf5] text-brand-dark rounded-lg shadow-2xl origin-bottom"
    >
       {/* Paper Texture Overlay */}
       <div className="absolute inset-0 pointer-events-none opacity-50 rounded-lg" style={{ backgroundImage: paperTexture }}></div>
       
       {/* Card Content */}
       <div className="relative h-full flex flex-col p-8 border border-black/5">
          <div className="w-8 h-8 rounded-full bg-brand-red text-white flex items-center justify-center font-display text-sm mb-6 shadow-sm">
              {index + 1}
          </div>
          
          <h3 className="font-display text-3xl uppercase mb-6 leading-[0.9] text-brand-dark">
             {term.title}
          </h3>
          
          <p className="font-serif text-lg leading-relaxed opacity-80">
             {term.content}
          </p>

          <div className="mt-auto border-t border-brand-dark/10 pt-4 flex justify-between items-center opacity-40">
             <span className="text-xs uppercase tracking-widest font-sans">Initial here:</span>
             <div className="w-12 h-6 border-b border-brand-dark/30"></div>
          </div>
       </div>
    </motion.div>
  )
}

interface TermsProps {
  content?: any[];
}

const TermsAndConditions: React.FC<TermsProps> = ({ content }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [signature, setSignature] = useState("");
  const [isSigned, setIsSigned] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { playSfx } = useAudio();
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const signatureOpacity = useTransform(scrollYProgress, [0.8, 1], [0, 1]);
  const signatureY = useTransform(scrollYProgress, [0.8, 1], [50, 0]);

  const termsData = content || TERMS_AND_CONDITIONS;

  const handleSign = async () => {
    if (!signature.trim()) return;
    setIsSubmitting(true);
    playSfx(UI_SFX.CLICK);
    
    try {
      // Save signature to API
      await fetch('/api/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'signature',
          data: { name: signature }
        })
      });
      setIsSigned(true);
      playSfx(UI_SFX.SIGNATURE);
    } catch (err) {
      console.error("Failed to sign:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section 
      ref={containerRef} 
      className="relative h-[450vh] bg-brand-dark overflow-clip"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col items-center justify-center perspective-1000">
        
        <RaysBackground />

        {/* Header - Fades out earlier to clear the stage */}
        <motion.div 
            style={{ opacity: useTransform(scrollYProgress, [0, 0.15], [1, 0]) }}
            className="absolute top-24 text-center z-10 px-4 pointer-events-none"
        >
             <h2 className="font-display text-5xl md:text-7xl uppercase text-white mb-2 tracking-tight">The Fine Print</h2>
             <div className="w-24 h-1 bg-brand-red mx-auto mb-4" />
             <p className="font-serif italic text-white/60 text-xl">Required Reading.</p>
        </motion.div>

        {/* Stack of Cards */}
        <div className="relative w-full h-full max-w-lg perspective-1000">
           {termsData.map((term, i) => (
             <Card 
                key={i} 
                term={term} 
                index={i} 
                total={termsData.length} 
                progress={scrollYProgress} 
             />
           ))}
        </div>

        {/* Interactive Signature Section - Fades in at end of scroll */}
        <motion.div 
             style={{ 
                 opacity: signatureOpacity,
                 y: signatureY
             }}
             className="absolute bottom-16 md:bottom-24 z-40 w-full flex flex-col items-center px-4"
        >
            <div className="bg-white/5 backdrop-blur-md p-8 md:p-12 rounded-xl border border-white/10 w-full max-w-lg text-center shadow-2xl relative overflow-hidden">
                 <p className="font-serif italic text-white/80 text-xl mb-6">
                    {isSigned ? "Agreement binding forever." : "I hereby accept the terms & conditions stated above."}
                 </p>
                 
                 <div className="relative group max-w-sm mx-auto">
                    <input 
                        type="text" 
                        value={signature}
                        onChange={(e) => setSignature(e.target.value)}
                        placeholder="Sign Name Here"
                        disabled={isSigned || isSubmitting}
                        className={`w-full bg-transparent border-b-2 ${isSigned ? 'border-brand-red/50 text-brand-red' : 'border-white/20 text-brand-red'} text-center font-serif italic text-4xl md:text-5xl outline-none placeholder:text-white/10 py-2 focus:border-brand-red transition-colors z-20 relative`}
                    />
                    {!isSigned && (
                        <div className="absolute bottom-0 left-0 w-full h-px bg-brand-red scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center" />
                    )}
                 </div>

                 <div className="mt-8 h-24 flex items-center justify-center relative">
                    <AnimatePresence mode="wait">
                        {isSigned ? (
                            <motion.div 
                                key="signed"
                                initial={{ scale: 2, opacity: 0, rotate: -10 }}
                                animate={{ scale: 1, opacity: 1, rotate: -12 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                className="border-4 border-brand-red text-brand-red px-8 py-2 inline-block rounded-lg mask-ink backdrop-blur-sm bg-brand-red/10"
                            >
                                <span className="font-display text-4xl uppercase tracking-widest font-bold">ACCEPTED</span>
                                <div className="text-[10px] font-sans uppercase tracking-widest text-center border-t border-brand-red/50 mt-1 pt-1">
                                    {new Date().toLocaleDateString()}
                                </div>
                            </motion.div>
                        ) : signature.length > 2 ? (
                            <motion.button 
                                key="button"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                onClick={handleSign}
                                disabled={isSubmitting}
                                onMouseEnter={() => playSfx(UI_SFX.HOVER)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-brand-red text-white px-8 py-3 rounded-sm font-display text-xl uppercase tracking-wider shadow-[0_0_30px_-5px_rgba(206,18,21,0.5)] hover:bg-white hover:text-brand-red transition-all disabled:opacity-50"
                            >
                                {isSubmitting ? "Signing..." : "Seal the Deal"}
                            </motion.button>
                        ) : (
                            <motion.p 
                                key="waiting"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="text-xs uppercase tracking-widest text-white/20"
                            >
                                Awaiting Signature...
                            </motion.p>
                        )}
                    </AnimatePresence>
                 </div>
            </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TermsAndConditions;
