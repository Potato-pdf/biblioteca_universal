import React, { useRef, useEffect } from 'react';

const SakuraCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const container = canvas.parentElement;
    const ctx = canvas.getContext('2d');
    if (!ctx || !container) return;

    let animationFrameId: number;
    let petals: Petal[] = [];

    const resizeCanvas = () => {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    };

    class Petal {
      x: number;
      y: number;
      size: number;
      speed: number;
      sway: number;
      swaySpeed: number;
      opacity: number;

      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height - canvas!.height;
        this.size = Math.random() * 8 + 4; // Slightly smaller for elegance
        this.speed = Math.random() * 1 + 0.5;
        this.sway = 0;
        this.swaySpeed = Math.random() * 0.02 + 0.005;
        this.opacity = Math.random() * 0.6 + 0.2;
      }

      update() {
        this.y += this.speed;
        this.sway += this.swaySpeed;
        this.x += Math.sin(this.sway) * 0.5;

        if (this.y > canvas!.height) {
          this.y = -20;
          this.x = Math.random() * canvas!.width;
        }
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        // Lighter pink #FEE2E2 (254, 226, 226)
        ctx.fillStyle = `rgba(254, 226, 226, ${this.opacity})`;
        ctx.ellipse(this.x, this.y, this.size, this.size / 2, this.sway, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const init = () => {
      petals = [];
      for (let i = 0; i < 80; i++) {
        petals.push(new Petal());
      }
    };

    const animate = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      petals.forEach((petal) => {
        petal.update();
        petal.draw(ctx);
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    init();
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full pointer-events-none" />;
};

export default SakuraCanvas;