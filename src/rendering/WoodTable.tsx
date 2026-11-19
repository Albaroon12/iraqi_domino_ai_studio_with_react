import React, { useEffect, useRef } from 'react';
import { TableSkin, walnutTableSkin } from './tableSkin';

/** Simple deterministic PRNG seeded identically on every paint. */
function createSeededRandom(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (Math.imul(1664525, state) + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function paintWoodTable(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  skin: TableSkin
) {
  const rnd = createSeededRandom(skin.grainSeed);
  const planks = 4;

  // Base vertical gradient
  const baseGrad = ctx.createLinearGradient(0, 0, 0, height);
  baseGrad.addColorStop(0, skin.woodLight);
  baseGrad.addColorStop(1, skin.woodDark);
  ctx.fillStyle = baseGrad;
  ctx.fillRect(0, 0, width, height);

  // Vertical planks & seams
  const plankWidth = width / planks;
  for (let i = 0; i < planks; i++) {
    const shadeAlpha = rnd() * 0.12;
    ctx.fillStyle = `rgba(0, 0, 0, ${shadeAlpha})`;
    ctx.fillRect(i * plankWidth, 0, plankWidth, height);

    if (i === 0) continue;
    const x = i * plankWidth;

    ctx.save();
    ctx.globalAlpha = 0.9;
    ctx.strokeStyle = skin.grainDark;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();

    ctx.globalAlpha = 1;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.13)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x + 2, 0);
    ctx.lineTo(x + 2, height);
    ctx.stroke();
    ctx.restore();
  }

  // Wavy wood grain lines
  const lineCount = Math.round(width / 3);
  for (let i = 0; i < lineCount; i++) {
    const x0 = rnd() * width;
    const thickness = 0.6 + rnd() * 1.8;
    const amplitude = 1.5 + rnd() * 7;
    const frequency = 0.004 + rnd() * 0.01;
    const phase = rnd() * 2 * Math.PI;
    const alpha = 0.05 + rnd() * 0.16;
    const isDark = rnd() >= 0.5;

    ctx.save();
    ctx.strokeStyle = isDark ? skin.grainDark : skin.grainLight;
    ctx.globalAlpha = alpha;
    ctx.lineWidth = thickness;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x0, 0);
    for (let y = 14; y <= height + 14; y += 14) {
      ctx.lineTo(x0 + Math.sin(y * frequency + phase) * amplitude, y);
    }
    ctx.stroke();
    ctx.restore();
  }

  // Warm overhead radial spotlight
  const cx = width / 2;
  const cy = height * (0.5 - 0.35 * 0.5);
  const spotR = Math.max(width, height) * 0.7;
  const lightGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, spotR);
  lightGrad.addColorStop(0, 'rgba(255, 226, 176, 0.16)');
  lightGrad.addColorStop(1, 'rgba(255, 226, 176, 0)');
  ctx.fillStyle = lightGrad;
  ctx.fillRect(0, 0, width, height);

  // Dark vignette around edges
  const vigR = Math.hypot(width / 2, height / 2) * 1.05;
  const vigGrad = ctx.createRadialGradient(
    width / 2,
    height / 2,
    vigR * 0.55,
    width / 2,
    height / 2,
    vigR
  );
  vigGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
  vigGrad.addColorStop(1, skin.vignette);
  ctx.fillStyle = vigGrad;
  ctx.fillRect(0, 0, width, height);

  // Outer rim and inner highlight
  ctx.strokeStyle = skin.rim;
  ctx.lineWidth = 18;
  ctx.strokeRect(9, 9, Math.max(0, width - 18), Math.max(0, height - 18));

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(18.5, 18.5, Math.max(0, width - 37), Math.max(0, height - 37));
}

export interface WoodTableProps {
  skin?: TableSkin;
  className?: string;
  children?: React.ReactNode;
}

/** Wooden table backdrop matching WoodTablePainter. */
export const WoodTable: React.FC<WoodTableProps> = ({
  skin = walnutTableSkin,
  className = '',
  children,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const draw = () => {
      const rect = container.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      paintWoodTable(ctx, rect.width, rect.height, skin);
    };

    draw();
    const observer = new ResizeObserver(draw);
    observer.observe(container);
    return () => observer.disconnect();
  }, [skin]);

  return (
    <div ref={containerRef} className={`relative w-full h-full overflow-hidden ${className}`}>
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 w-full h-full"
        aria-hidden="true"
      />
      <div className="relative z-10 w-full h-full flex flex-col">{children}</div>
    </div>
  );
};
