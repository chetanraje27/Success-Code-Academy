"use client";

import { useEffect, useState, useRef } from "react";

export default function AnimatedBackground() {
  const [mounted, setMounted] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mousePosition = useRef({ x: -1000, y: -1000 });
  const isMouseMoving = useRef(false);
  const mouseTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setMounted(true);

    const handleMouseMove = (e: MouseEvent) => {
      mousePosition.current = { x: e.clientX, y: e.clientY };
      isMouseMoving.current = true;
      
      if (mouseTimeout.current) clearTimeout(mouseTimeout.current);
      mouseTimeout.current = setTimeout(() => {
        isMouseMoving.current = false;
        mousePosition.current = { x: -1000, y: -1000 };
      }, 2000); // Wait longer before resetting so the user can admire the tension
    };

    const handleMouseLeave = () => {
      mousePosition.current = { x: -1000, y: -1000 };
      isMouseMoving.current = false;
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.body.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.body.removeEventListener("mouseleave", handleMouseLeave);
      if (mouseTimeout.current) clearTimeout(mouseTimeout.current);
    };
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false }); // Optimize for solid background
    if (!ctx) return;

    let animationFrameId: number;

    // Physics Mesh Configuration
    const SPACING = 45;
    let cols = 0;
    let rows = 0;
    
    interface Point {
      baseX: number;
      baseY: number;
      x: number;
      y: number;
      vx: number;
      vy: number;
    }
    
    let points: Point[][] = [];

    const initMesh = () => {
      // Add padding so the grid goes off-screen
      cols = Math.floor(window.innerWidth / SPACING) + 4;
      rows = Math.floor(window.innerHeight / SPACING) + 4;
      
      const offsetX = (window.innerWidth - (cols - 1) * SPACING) / 2;
      const offsetY = (window.innerHeight - (rows - 1) * SPACING) / 2;

      points = [];
      for (let i = 0; i < cols; i++) {
        points[i] = [];
        for (let j = 0; j < rows; j++) {
          const px = offsetX + i * SPACING;
          const py = offsetY + j * SPACING;
          points[i][j] = {
            baseX: px,
            baseY: py,
            x: px,
            y: py,
            vx: 0,
            vy: 0
          };
        }
      }
    };

    const animate = () => {
      // Draw light theme background
      ctx.fillStyle = "#f8fafc"; // Tailwind slate-50
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const mouseX = mousePosition.current.x;
      const mouseY = mousePosition.current.y;
      const maxDist = 120; // Drastically reduced interaction radius
      const time = Date.now() * 0.001;

      // Update Physics
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          let p = points[i][j];

          // 1. Natural ambient breathing wave (Topological flow)
          const waveX = Math.cos(p.baseY * 0.005 + time * 0.5) * 15;
          const waveY = Math.sin(p.baseX * 0.005 + time * 0.5) * 15;
          const targetX = p.baseX + waveX;
          const targetY = p.baseY + waveY;

          // 2. Mouse Interaction (Magnetic Repulsion)
          const dx = mouseX - p.x;
          const dy = mouseY - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDist && dist > 0) {
            const force = (maxDist - dist) / maxDist;
            // Extremely gentle repulsion
            p.vx -= (dx / dist) * force * 0.5;
            p.vy -= (dy / dist) * force * 0.5;
          }

          // 3. Spring physics pulling back to the breathing target
          p.vx += (targetX - p.x) * 0.08;
          p.vy += (targetY - p.y) * 0.08;

          // 4. Friction/Damping
          p.vx *= 0.85;
          p.vy *= 0.85;

          // Apply velocity
          p.x += p.vx;
          p.y += p.vy;
        }
      }

      // Draw Structural Mesh
      // Helper function to draw a line segment with tension-based coloring
      const drawSegment = (p1: Point, p2: Point) => {
        // Calculate tension (how far the points are stretched from their natural distance)
        const currentDist = Math.sqrt((p1.x - p2.x)**2 + (p1.y - p2.y)**2);
        const stretch = Math.abs(currentDist - SPACING);
        
        // Normalize tension (0 to 1)
        const tension = Math.min(stretch / 30, 1);

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);

        // Base color: light architectural slate (203, 213, 225)
        // Tension color: brand medical teal (64, 181, 193)
        const r = Math.round(203 + (64 - 203) * tension);
        const g = Math.round(213 + (181 - 213) * tension);
        const b = Math.round(225 + (193 - 225) * tension);
        const a = 0.3 + tension * 0.7; // Gets more opaque when stressed

        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
        ctx.lineWidth = 1 + tension * 1.5; // Gets thicker when stressed
        ctx.stroke();
      };

      // Draw horizontal lines
      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols - 1; i++) {
          drawSegment(points[i][j], points[i+1][j]);
        }
      }

      // Draw vertical lines
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows - 1; j++) {
          drawSegment(points[i][j], points[i][j+1]);
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initMesh();
    };

    window.addEventListener('resize', resize);
    resize();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [mounted]);

  if (!mounted) return <div className="global-bg-fallback" />;

  return (
    <div className="global-background">
      {/* 60fps Physics Mesh Canvas */}
      <canvas ref={canvasRef} className="network-canvas" />

      <style jsx>{`
        .global-bg-fallback {
          position: fixed;
          inset: 0;
          background: #f8fafc;
          z-index: 0;
        }

        .global-background {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          z-index: 0;
          background: #f8fafc;
          overflow: hidden;
          pointer-events: none;
        }

        .network-canvas {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
        }
      `}</style>
    </div>
  );
}
