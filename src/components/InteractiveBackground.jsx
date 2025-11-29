import { useEffect, useRef } from 'react';

export default function InteractiveBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    let animationFrameId;
    let particles = [];

    const resize = () => {
      const parent = canvas.parentElement;
      canvas.width = window.innerWidth;
      canvas.height = Math.max(window.innerHeight, parent?.scrollHeight || 0);
    };

    resize();
    window.addEventListener('resize', resize);

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 2 + 1;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }

      draw() {
        const isDark = document.documentElement.classList.contains('dark');
        ctx.fillStyle = isDark ? 'rgba(96, 165, 250, 0.5)' : 'rgba(59, 130, 246, 0.4)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    for (let i = 0; i < 50; i++) {
      particles.push(new Particle());
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle, i) => {
        particle.update();
        particle.draw();

        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[j].x - particle.x;
          const dy = particles[j].y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            const isDark = document.documentElement.classList.contains('dark');
            ctx.strokeStyle = isDark 
              ? `rgba(96, 165, 250, ${0.2 * (1 - distance / 150)})`
              : `rgba(59, 130, 246, ${0.15 * (1 - distance / 150)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // Observer para redimensionar quando o conteúdo mudar
    const resizeObserver = new ResizeObserver(() => {
      resize();
    });
    
    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0"
      style={{ opacity: 0.6 }}
    />
  );
}
