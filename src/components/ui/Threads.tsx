import { useEffect, useRef } from "react";

interface Thread {
  y: number;
  speed: number;
  amplitude: number;
  phase: number;
  opacity: number;
  width: number;
  color: string;
}

export default function Threads({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const COLORS = [
      "74,222,128",   // green
      "74,222,128",   // green (weighted more)
      "134,239,172",  // light green
      "251,191,36",   // yellow
      "253,224,71",   // light yellow
    ];

    const threads: Thread[] = Array.from({ length: 18 }, () => ({
      y: Math.random() * canvas.height,
      speed: 0.12 + Math.random() * 0.2,
      amplitude: 40 + Math.random() * 120,
      phase: Math.random() * Math.PI * 2,
      opacity: 0.06 + Math.random() * 0.14,
      width: 0.6 + Math.random() * 1.2,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    }));

    let t = 0;
    let animId: number;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      threads.forEach((thread) => {
        ctx.beginPath();
        const startX = 0;
        const startY =
          thread.y + Math.sin(thread.phase + t * thread.speed) * thread.amplitude;
        ctx.moveTo(startX, startY);

        for (let x = 0; x <= canvas.width; x += 4) {
          const y =
            thread.y +
            Math.sin(x * 0.008 + thread.phase + t * thread.speed) *
              thread.amplitude;
          ctx.lineTo(x, y);
        }

        const grad = ctx.createLinearGradient(0, 0, canvas.width, 0);
        grad.addColorStop(0, `rgba(${thread.color},0)`);
        grad.addColorStop(0.2, `rgba(${thread.color},${thread.opacity})`);
        grad.addColorStop(0.8, `rgba(${thread.color},${thread.opacity})`);
        grad.addColorStop(1, `rgba(${thread.color},0)`);

        ctx.strokeStyle = grad;
        ctx.lineWidth = thread.width;
        ctx.stroke();
      });

      t += 0.008;
      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      aria-hidden="true"
    />
  );
}
