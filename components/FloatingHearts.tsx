
import React, { useEffect, useRef } from 'react';

const FloatingHearts: React.FC<{ className?: string }> = ({ className = "" }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = canvas.offsetWidth;
    let height = canvas.height = canvas.offsetHeight;

    const hearts: Heart[] = [];
    const heartCount = 75; // Increased count
    const mouse = { x: -9999, y: -9999 };
    
    class Heart {
      x: number;
      y: number;
      size: number;
      baseSize: number;
      depth: number;
      speedY: number;
      speedX: number;
      wobble: number;
      wobbleSpeed: number;
      wobbleAmplitude: number;
      opacity: number;
      color: string;
      pulseOffset: number;
      pulseSpeed: number;
      
      constructor(initialY?: number) {
        this.x = 0;
        this.y = 0;
        this.size = 0;
        this.baseSize = 0;
        this.depth = 0;
        this.speedY = 0;
        this.speedX = 0;
        this.wobble = 0;
        this.wobbleSpeed = 0;
        this.wobbleAmplitude = 0;
        this.opacity = 0;
        this.color = '';
        this.pulseOffset = 0;
        this.pulseSpeed = 0;
        
        this.reset(initialY);
      }

      reset(initialY?: number) {
        this.depth = Math.random(); 

        this.x = Math.random() * width;
        this.y = initialY ?? (height + Math.random() * 50);
        
        this.baseSize = 5 + (this.depth * 25); 
        this.size = this.baseSize;
        
        this.speedY = -1 * (0.5 + this.depth * 2.0 + Math.random() * 0.5);
        this.speedX = 0;
        
        this.wobble = Math.random() * Math.PI * 2;
        this.wobbleSpeed = Math.random() * 0.01 + 0.005;
        this.wobbleAmplitude = Math.random() * 1.5 + 0.5;
        
        // Opacity: Increased minimum opacity for better visibility
        this.opacity = 0.5 + this.depth * 0.5; 
        
        // Color: White to Pale Pink to ensure visibility on Red
        const hue = 350 + Math.random() * 20; // Red/Pink range
        const saturation = 100;
        const lightness = 90 + Math.random() * 10; // Very light (90-100%)
        this.color = `hsla(${hue}, ${saturation}%, ${lightness}%, ${this.opacity})`;
        
        this.pulseOffset = Math.random() * Math.PI * 2;
        this.pulseSpeed = 0.02 + Math.random() * 0.03;
      }

      draw() {
        if (!ctx) return;
        ctx.save();
        ctx.translate(this.x, this.y);
        
        const rotation = Math.sin(this.wobble) * 0.2; 
        ctx.rotate(rotation);
        
        const currentScale = 1 + Math.sin(this.pulseOffset) * 0.08; 
        ctx.scale(currentScale, currentScale);
        
        ctx.fillStyle = this.color;
        
        ctx.beginPath();
        const s = this.size;
        
        const topY = -s * 0.4;
        const bottomY = s * 0.5;
        const xOffset = s * 0.6;
        const controlY1 = -s * 1.0;
        const controlY2 = s * 0.2;
        
        ctx.moveTo(0, topY);
        
        // Right Curve
        ctx.bezierCurveTo(
            xOffset, controlY1, 
            xOffset * 1.5, controlY2, 
            0, bottomY
        );
        
        // Left Curve
        ctx.bezierCurveTo(
            -xOffset * 1.5, controlY2, 
            -xOffset, controlY1, 
            0, topY
        );
        
        ctx.fill();
        ctx.restore();
      }

      update() {
        this.y += this.speedY;
        this.x += Math.sin(this.wobble) * this.wobbleAmplitude + this.speedX;
        this.wobble += this.wobbleSpeed;
        this.pulseOffset += this.pulseSpeed;

        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const interactionRadius = 200;

        if (dist < interactionRadius) {
           const force = (interactionRadius - dist) / interactionRadius;
           const angle = Math.atan2(dy, dx);
           this.speedX -= Math.cos(angle) * force * 0.8;
           this.y += Math.sin(angle) * force * 1.6; 
        } else {
           this.speedX *= 0.95; 
        }

        if (this.y < -100) {
            this.reset(height + 50);
            this.x = Math.random() * width;
        }
        
        if (this.x > width + 50) this.x = -50;
        if (this.x < -50) this.x = width + 50;
      }
    }

    for (let i = 0; i < heartCount; i++) {
        hearts.push(new Heart(Math.random() * height));
    }

    const animate = () => {
        ctx.clearRect(0, 0, width, height);
        hearts.forEach(h => {
            h.update();
            h.draw();
        });
        requestAnimationFrame(animate);
    };

    const animId = requestAnimationFrame(animate);

    const handleResize = () => {
        if (!canvas) return;
        width = canvas.width = canvas.offsetWidth;
        height = canvas.height = canvas.offsetHeight;
    };

    const handleMouseMove = (e: MouseEvent | TouchEvent) => {
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        let clientX, clientY;
        
        if ('touches' in e) {
           clientX = e.touches[0].clientX;
           clientY = e.touches[0].clientY;
        } else {
           clientX = (e as MouseEvent).clientX;
           clientY = (e as MouseEvent).clientY;
        }

        mouse.x = clientX - rect.left;
        mouse.y = clientY - rect.top;
    };
    
    const handleMouseLeave = () => {
        mouse.x = -9999;
        mouse.y = -9999;
    }

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleMouseMove, { passive: true });
    window.addEventListener('touchend', handleMouseLeave);
    window.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
        cancelAnimationFrame(animId);
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('touchmove', handleMouseMove);
        window.removeEventListener('touchend', handleMouseLeave);
        window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className={`absolute inset-0 w-full h-full pointer-events-none ${className}`} />;
}

export default FloatingHearts;
