"use client";

import { useEffect, useRef } from "react";

export function Auth3DScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let time = 0;

    const updateSize = () => {
      const dpr = window.devicePixelRatio || 1;
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };
    updateSize();
    window.addEventListener("resize", updateSize);

    // Star particle in 3D space
    class Star {
      x: number;
      y: number;
      z: number;
      pz: number;

      constructor() {
        this.x = Math.random() * width - width / 2;
        this.y = Math.random() * height - height / 2;
        this.z = Math.random() * width;
        this.pz = this.z;
      }

      update(speed: number) {
        this.z -= speed;
        if (this.z < 1) {
          this.z = width;
          this.x = Math.random() * width - width / 2;
          this.y = Math.random() * height - height / 2;
          this.pz = this.z;
        }
      }

      draw(ctx: CanvasRenderingContext2D) {
        const sx = (this.x / this.z) * width + width / 2;
        const sy = (this.y / this.z) * height + height / 2;

        const px = (this.x / this.pz) * width + width / 2;
        const py = (this.y / this.pz) * height + height / 2;

        this.pz = this.z;

        const size = (1 - this.z / width) * 3;
        const alpha = 1 - this.z / width;

        // Draw star trail
        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.5})`;
        ctx.lineWidth = size;
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(sx, sy);
        ctx.stroke();

        // Draw star point
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.beginPath();
        ctx.arc(sx, sy, size, 0, Math.PI * 2);
        ctx.fill();
      }
    }


    // Initialize particles
    const stars: Star[] = [];
    for (let i = 0; i < 200; i++) {
      stars.push(new Star());
    }

    let animationFrame: number;

    const animate = () => {
      time++;

      // Clear with dark space background
      ctx.fillStyle = "rgba(13, 17, 23, 0.3)";
      ctx.fillRect(0, 0, width, height);

      // Draw stars
      stars.forEach((star) => {
        star.update(2);
        star.draw(ctx);
      });

      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", updateSize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ mixBlendMode: "normal" }}
    />
  );
}
