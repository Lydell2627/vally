
import React, { useRef } from 'react';
import { NARRATIVE } from '../constants';
import { motion, useScroll, useTransform } from 'framer-motion';

interface NarrativeProps {
  content?: string[];
}

const Narrative: React.FC<NarrativeProps> = ({ content }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const narrativeText = content || NARRATIVE;

  return (
    <section ref={containerRef} className="bg-brand-light pb-24 px-6 md:px-12 flex flex-col items-center">
      <div className="max-w-4xl w-full relative">
        <div className="h-20 border-l border-brand-red mb-12 mx-auto w-0"></div>
        {narrativeText.map((text, i) => {
          // Staggered parallax effect for text
          // eslint-disable-next-line react-hooks/rules-of-hooks
          const y = useTransform(scrollYProgress, [0, 1], [0, (i + 1) * -50]);
          // eslint-disable-next-line react-hooks/rules-of-hooks
          const opacity = useTransform(scrollYProgress, [0, 0.2 + (i * 0.1), 0.5 + (i * 0.1)], [0, 1, 1]);

          return (
            <motion.div 
              key={i} 
              style={{ y, opacity }}
              className="mb-24 last:mb-0 flex flex-col items-center text-center group"
            >
              <p className="font-display text-3xl md:text-7xl uppercase leading-none tracking-tight text-brand-dark transition-colors duration-500 group-hover:text-brand-red">
                {text}
              </p>
            </motion.div>
          );
        })}

        {/* Cute Doodle Animation */}
        <motion.div 
            className="flex justify-center my-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
        >
            <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-brand-red">
                <motion.path 
                    d="M50 85C50 85 15 55 15 30C15 15 25 5 40 5C50 5 50 15 50 15C50 15 50 5 60 5C75 5 85 15 85 30C85 55 50 85 50 85Z" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 1 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                />
                <motion.path
                    d="M30 25C30 25 32 20 38 22"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 1 }}
                    transition={{ delay: 1, duration: 0.5 }}
                />
                 <motion.path
                    d="M65 22C65 22 72 20 72 25"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 1 }}
                    transition={{ delay: 1.2, duration: 0.5 }}
                />
            </svg>
        </motion.div>

        <div className="h-20 border-l border-brand-red mt-12 mx-auto w-0"></div>
      </div>
    </section>
  );
};

export default Narrative;
