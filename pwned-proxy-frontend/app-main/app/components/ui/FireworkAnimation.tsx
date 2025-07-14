"use client";
import { useEffect } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

export default function FireworkAnimation() {
  // pastel / lime-y palette
  const colors = [
    "#E8FAD0", // pale lime
    "#D9F99D", // your mid-green
    "#C1D72E", // logo green
    "#B5E48C",
    "#DCFCE7",
    "#F0FDF4",
  ];

  function createFirework(x: number, y: number): Particle[] {
    const particles: Particle[] = [];
    // bigger explosion: 40–60 sparks
    const count = 40 + Math.random() * 20;
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count;
      const speed = 2 + Math.random() * 4;
      particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 80,
        maxLife: 80,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 2 + Math.random() * 4,
      });
    }
    return particles;
  }

  useEffect(() => {
    const canvas = document.getElementById("firework-canvas") as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    let particles: Particle[] = [];

    const launch = () => {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height * 0.4 + canvas.height * 0.3;
      particles.push(...createFirework(x, y));
    };

    // initial volleys
    for (let i = 0; i < 3; i++) setTimeout(launch, i * 300);
    const interval = setInterval(launch, 1000);

    let animId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles = particles.filter((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.05; // lighter gravity
        p.life--;

        const alpha = p.life / p.maxLife;
        ctx.globalAlpha = alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        return p.life > 0;
      });

      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      clearInterval(interval);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      id="firework-canvas"
      className="fixed inset-0 pointer-events-none z-10"
      style={{ background: "transparent" }}
    />
  );
}
