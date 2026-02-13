
import React, { useRef, useEffect } from 'react';
import { WHY_I_LIKE_YOU } from '../constants';
import { motion, useInView } from 'framer-motion';

const Card: React.FC<{ item: any, index: number }> = ({ item, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, rotate: index % 2 === 0 ? -2 : 2 }}
      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.02, rotate: index % 2 === 0 ? 1 : -1, transition: { duration: 0.3 } }}
      className="p-8 md:p-12 bg-brand-light border border-brand-dark/5 shadow-lg rounded-sm group hover:border-brand-red/20 transition-colors h-full flex flex-col"
    >
      <div className="flex items-start justify-between mb-6">
        <span className="font-display text-4xl text-brand-dark/20 group-hover:text-brand-red/20 transition-colors">0{index + 1}</span>
        <div className="w-2 h-2 rounded-full bg-brand-red opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <h3 className="font-display text-3xl uppercase mb-4 text-brand-dark">{item.title}</h3>
      <p className="font-serif text-lg text-gray-600 leading-relaxed mt-auto">{item.description}</p>
    </motion.div>
  )
}

interface WhyILikeYouProps {
  content?: any[];
}

const WhyILikeYou: React.FC<WhyILikeYouProps> = ({ content }) => {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { amount: 0.3 });

  const reasonsData = content || WHY_I_LIKE_YOU;

  return (
    <section ref={containerRef} className="py-32 px-6 md:px-12 bg-white text-brand-dark overflow-hidden relative">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #000 1px, transparent 0)', backgroundSize: '40px 40px' }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-20 text-center"
        >
          <div className="inline-block mb-4 overflow-hidden">
            <motion.span
              initial={{ y: "100%" }}
              whileInView={{ y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "backOut" }}
              className="block font-serif italic text-brand-red text-2xl md:text-3xl"
            >
              The little things
            </motion.span>
          </div>
          <h2 className="font-display text-5xl md:text-8xl uppercase tracking-tight leading-none">
            Why I Like You
          </h2>
          <div className="w-24 h-1 bg-brand-dark/10 mx-auto mt-6" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
          {reasonsData.map((item, i) => (
            <Card key={item.id || i} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default WhyILikeYou;
