import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Point {
  id: number;
  x: number;
  y: number;
  symbol: string;
  color: string;
}

const SYMBOLS = ['❤', '✦', '✨', '♥', '⋆'];
const COLORS = ['#ce1215', '#ff4d4d', '#ff9999', '#ffcccc', '#e0e0e0'];

const CursorTrail: React.FC = () => {
  const [points, setPoints] = useState<Point[]>([]);

  useEffect(() => {
    let counter = 0;
    let lastTime = 0;

    const addPoint = (x: number, y: number) => {
      const now = Date.now();
      if (now - lastTime < 30) return; // Throttle
      lastTime = now;

      const newPoint: Point = { 
        id: counter++, 
        x, 
        y,
        symbol: SYMBOLS[counter % SYMBOLS.length],
        color: COLORS[counter % COLORS.length]
      };
      
      setPoints(prev => [...prev.slice(-15), newPoint]);
    };

    const handleMouseMove = (e: MouseEvent) => {
      addPoint(e.clientX, e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
       // Only draw for the first finger to avoid chaos
       if (e.touches.length > 0) {
           addPoint(e.touches[0].clientX, e.touches[0].clientY);
       }
    }

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    
    return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      <AnimatePresence>
        {points.map((point) => (
          <motion.div
            key={point.id}
            initial={{ opacity: 1, scale: 0.5, y: 0, x: 0 }}
            animate={{ opacity: 0, scale: 1.5, y: 20 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute font-serif"
            style={{ 
              left: point.x, 
              top: point.y,
              color: point.color,
              fontSize: '16px',
              transform: 'translate(-50%, -50%)',
              textShadow: '0 0 2px rgba(255,255,255,0.5)'
            }}
          >
            {point.symbol}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default CursorTrail;