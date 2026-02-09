
import React from 'react';
import { motion } from 'framer-motion';

interface SectionTransitionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  dark?: boolean; // If true, adjusts text smoothing for dark backgrounds
}

const SectionTransition: React.FC<SectionTransitionProps> = ({ 
  children, 
  className = "", 
  delay = 0,
  dark = false
}) => {
  return (
    <motion.div
      initial={{ 
        opacity: 0, 
        y: 60, // Start slightly lower
        filter: "blur(12px)" // Strong blur for the "mist" effect
      }}
      whileInView={{ 
        opacity: 1, 
        y: 0, 
        filter: "blur(0px)" 
      }}
      viewport={{ 
        once: true, // Only animate once
        margin: "-10% 0px -10% 0px" // Trigger when element is 10% into the viewport
      }}
      transition={{ 
        duration: 1.2, 
        ease: [0.19, 1, 0.22, 1], // Custom Expo ease for a very premium, slow-snap feel
        delay: delay
      }}
      className={`relative ${className}`}
      style={{
        willChange: "opacity, transform, filter" // Optimization
      }}
    >
      {children}
    </motion.div>
  );
};

export default SectionTransition;
