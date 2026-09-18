import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  radius: number;
  baseAlpha: number;
  alpha: number;
  alphaSpeed: number;
  vx: number;
  vy: number;
  oscillationSpeed: number;
  oscillationDistance: number;
  angle: number;
}

export const DustParticles: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Create 45 ambient floating dust motes
    const particleCount = 45;
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      const radius = Math.random() * 1.8 + 0.8; // 0.8px to 2.6px
      const baseAlpha = Math.random() * 0.45 + 0.2; // 0.2 to 0.65
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius,
        baseAlpha,
        alpha: baseAlpha,
        alphaSpeed: Math.random() * 0.015 + 0.005,
        vx: (Math.random() - 0.5) * 0.25, // gentle horizontal drift
        vy: -(Math.random() * 0.35 + 0.12), // slow upward float
        oscillationSpeed: Math.random() * 0.02 + 0.01,
        oscillationDistance: Math.random() * 1.5 + 0.5,
        angle: Math.random() * Math.PI * 2,
      });
    }

    let isVisible = true;
    const handleVisibilityChange = () => {
      isVisible = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const render = () => {
      if (isVisible) {
        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];

          // Gentle sine-wave drifting & upward float
          p.angle += p.oscillationSpeed;
          p.x += p.vx + Math.sin(p.angle) * 0.2;
          p.y += p.vy;

          // Breathing glow / twinkling effect
          p.alpha += p.alphaSpeed;
          if (p.alpha > p.baseAlpha + 0.25 || p.alpha < p.baseAlpha - 0.15) {
            p.alphaSpeed = -p.alphaSpeed;
          }

          // Wrap around edges smoothly
          if (p.y < -15) {
            p.y = height + 10;
            p.x = Math.random() * width;
          }
          if (p.x < -15) p.x = width + 10;
          if (p.x > width + 15) p.x = -10;

          // Render soft glowing golden dust mote
          const currentAlpha = Math.max(0.05, Math.min(0.85, p.alpha));
          const glowRadius = p.radius * 2.8;

          const gradient = ctx.createRadialGradient(
            p.x,
            p.y,
            0,
            p.x,
            p.y,
            glowRadius
          );

          // Warm candle/sunlight golden hues
          gradient.addColorStop(0, `rgba(254, 240, 138, ${currentAlpha})`); // Warm golden highlight
          gradient.addColorStop(0.35, `rgba(245, 158, 11, ${currentAlpha * 0.75})`); // Amber glow
          gradient.addColorStop(0.7, `rgba(217, 119, 6, ${currentAlpha * 0.3})`); // Soft orange aura
          gradient.addColorStop(1, 'rgba(180, 83, 9, 0)'); // Fade to transparent

          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(p.x, p.y, glowRadius, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-[4] select-none"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};
