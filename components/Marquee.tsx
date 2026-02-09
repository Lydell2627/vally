import React from 'react';

interface MarqueeProps {
  text: string;
  className?: string;
  reverse?: boolean;
}

const Marquee: React.FC<MarqueeProps> = ({ text, className = "", reverse = false }) => {
  return (
    <div className={`relative flex overflow-hidden whitespace-nowrap py-6 ${className}`}>
      {/* First copy */}
      <div 
        className={`flex min-w-full shrink-0 items-center justify-around gap-8 animate-marquee ${reverse ? 'flex-row-reverse' : ''}`} 
        style={{ 
          animationDirection: reverse ? 'reverse' : 'normal' 
        }}
      >
        {[...Array(6)].map((_, i) => (
          <span key={i} className="text-6xl md:text-9xl font-display uppercase tracking-tighter opacity-90 px-8">
            {text} —
          </span>
        ))}
      </div>
      
      {/* Second copy for seamless loop */}
      <div 
        className={`flex min-w-full shrink-0 items-center justify-around gap-8 animate-marquee ${reverse ? 'flex-row-reverse' : ''}`} 
        style={{ 
          animationDirection: reverse ? 'reverse' : 'normal' 
        }}
      >
        {[...Array(6)].map((_, i) => (
          <span key={i + 6} className="text-6xl md:text-9xl font-display uppercase tracking-tighter opacity-90 px-8">
            {text} —
          </span>
        ))}
      </div>
    </div>
  );
};

export default Marquee;