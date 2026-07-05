'use client';

import { useEffect, useRef } from 'react';

/**
 * Interactive cyber-network particle system.
 * Custom canvas implementation for guaranteed 60fps and precise control over
 * parallax layers, mouse attraction, click ripples w/ scatter, pulsing & orbits.
 */
type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseVx: number;
  baseVy: number;
  size: number;
  color: string;
  opacity: number;
  baseOpacity: number;
  layer: 0 | 1 | 2;
  pulsePhase: number;
  pulseSpeed: number;
  orbitCx?: number;
  orbitCy?: number;
  orbitRadius?: number;
  orbitAngle?: number;
  orbitSpeed?: number;
  scatterVx: number;
  scatterVy: number;
};

type Ripple = {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
};

type Props = {
  className?: string;
  density?: number;
  interactive?: boolean;
};

const COLORS = [
  'rgba(0, 200, 255,', // electric blue
  'rgba(0, 255, 213,', // cyan / accent
  'rgba(180, 220, 255,', // soft white
  'rgba(59, 130, 246,', // secondary blue
];

const CONNECT_DISTANCE = 130;
const MOUSE_RADIUS = 170;
const RIPPLE_RADIUS = 220;

export default function ParticleNetwork({
  className,
  density = 1,
  interactive = true,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gradRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    let ripples: Ripple[] = [];
    const mouse = { x: -9999, y: -9999, active: false };
    let raf = 0;
    let last = performance.now();
    let gradPhase = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initParticles();
    };

    const pickSize = (layer: 0 | 1 | 2) => {
      if (layer === 0) return Math.random() * 1.4 + 1;
      if (layer === 1) return Math.random() * 1.6 + 1.4;
      return Math.random() * 2 + 2;
    };

    const makeParticle = (layer: 0 | 1 | 2): Particle => {
      const speed = layer === 0 ? 0.12 : layer === 1 ? 0.22 : 0.34;
      const angle = Math.random() * Math.PI * 2;
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;
      const baseOpacity = 0.4 + Math.random() * 0.4;
      const orbit = Math.random() < 0.18;
      const orbitRadius = orbit ? 30 + Math.random() * 70 : undefined;
      const cx = orbit
        ? Math.random() * width
        : undefined;
      const cy = orbit
        ? Math.random() * height
        : undefined;
      const oAngle = Math.random() * Math.PI * 2;
      const oSpeed = (Math.random() * 0.0008 + 0.0004) * (Math.random() < 0.5 ? 1 : -1);
      return {
        x: orbit && cx !== undefined && orbitRadius !== undefined
          ? cx + Math.cos(oAngle) * orbitRadius
          : Math.random() * width,
        y: orbit && cy !== undefined && orbitRadius !== undefined
          ? cy + Math.sin(oAngle) * orbitRadius
          : Math.random() * height,
        vx,
        vy,
        baseVx: vx,
        baseVy: vy,
        size: pickSize(layer),
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        opacity: baseOpacity,
        baseOpacity,
        layer,
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.01 + Math.random() * 0.02,
        orbitCx: cx,
        orbitCy: cy,
        orbitRadius,
        orbitAngle: oAngle,
        orbitSpeed: oSpeed,
        scatterVx: 0,
        scatterVy: 0,
      };
    };

    const initParticles = () => {
      const area = width * height;
      const base = Math.floor((area / 16000) * density);
      particles = [];
      // background (slow, small) ~ 50%
      for (let i = 0; i < base * 0.5; i++) particles.push(makeParticle(0));
      // mid ~ 35%
      for (let i = 0; i < base * 0.35; i++) particles.push(makeParticle(1));
      // foreground (fast, larger) ~ 15%
      for (let i = 0; i < base * 0.15; i++) particles.push(makeParticle(2));
    };

    const animateGradient = (t: number) => {
      const el = gradRef.current;
      if (!el) return;
      gradPhase = t * 0.00003;
      const a = 0.18 + Math.sin(gradPhase) * 0.06;
      const b = 0.16 + Math.sin(gradPhase + 1.2) * 0.05;
      const c = 0.12 + Math.sin(gradPhase + 2.4) * 0.05;
      const d = 0.07 + Math.sin(gradPhase + 3.6) * 0.03;
      el.style.background = `radial-gradient(120% 120% at 20% 20%, rgba(8,16,40,${a}), transparent 60%), radial-gradient(120% 120% at 80% 30%, rgba(0,120,220,${b}), transparent 55%), radial-gradient(120% 120% at 50% 80%, rgba(0,200,213,${c}), transparent 60%), radial-gradient(120% 120% at 90% 90%, rgba(40,20,80,${d}), transparent 55%)`;
    };

    const step = (now: number) => {
      const dt = Math.min((now - last) / 16.6667, 2);
      last = now;
      ctx.clearRect(0, 0, width, height);

      animateGradient(now);

      // update + draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (p.orbitCx !== undefined && p.orbitCy !== undefined && p.orbitRadius !== undefined && p.orbitAngle !== undefined && p.orbitSpeed !== undefined) {
          p.orbitAngle += p.orbitSpeed * dt * 16;
          p.x = p.orbitCx + Math.cos(p.orbitAngle) * p.orbitRadius;
          p.y = p.orbitCy + Math.sin(p.orbitAngle) * p.orbitRadius;
        } else {
          p.x += (p.vx + p.scatterVx) * dt;
          p.y += (p.vy + p.scatterVy) * dt;

          // gentle drift back to base velocity
          p.scatterVx *= 0.94;
          p.scatterVy *= 0.94;

          // mouse attraction (foreground more responsive)
          if (interactive && mouse.active) {
            const dx = mouse.x - p.x;
            const dy = mouse.y - p.y;
            const dist = Math.hypot(dx, dy);
            if (dist < MOUSE_RADIUS) {
              const force = (1 - dist / MOUSE_RADIUS) * (0.04 + p.layer * 0.03);
              p.vx += (dx / (dist || 1)) * force * dt;
              p.vy += (dy / (dist || 1)) * force * dt;
            }
          }

          // friction to keep speed bounded
          p.vx = p.vx * 0.99 + p.baseVx * 0.01;
          p.vy = p.vy * 0.99 + p.baseVy * 0.01;

          // wrap
          if (p.x < -10) p.x = width + 10;
          if (p.x > width + 10) p.x = -10;
          if (p.y < -10) p.y = height + 10;
          if (p.y > height + 10) p.y = -10;
        }

        // pulse
        p.pulsePhase += p.pulseSpeed * dt;
        const pulse = 0.6 + Math.sin(p.pulsePhase) * 0.4;
        const op = p.baseOpacity * pulse;

        // draw
        const r = p.size;
        ctx.beginPath();
        ctx.fillStyle = `${p.color}${op})`;
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fill();
        // glow for foreground
        if (p.layer === 2) {
          ctx.beginPath();
          ctx.fillStyle = `${p.color}${op * 0.12})`;
          ctx.arc(p.x, p.y, r * 2.4, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // connections
      ctx.lineWidth = 1;
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = dx * dx + dy * dy;
          if (dist < CONNECT_DISTANCE * CONNECT_DISTANCE) {
            const d = Math.sqrt(dist);
            const alpha = (1 - d / CONNECT_DISTANCE) * 0.35;
            ctx.strokeStyle = `rgba(0, 170, 255, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // mouse aura + connections to mouse
      if (interactive && mouse.active) {
        const grd = ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          0,
          mouse.x,
          mouse.y,
          MOUSE_RADIUS
        );
        grd.addColorStop(0, 'rgba(0, 200, 255, 0.12)');
        grd.addColorStop(1, 'rgba(0, 200, 255, 0)');
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, MOUSE_RADIUS, 0, Math.PI * 2);
        ctx.fill();

        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.hypot(dx, dy);
          if (dist < MOUSE_RADIUS) {
            const alpha = (1 - dist / MOUSE_RADIUS) * 0.5;
            ctx.strokeStyle = `rgba(0, 255, 213, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        }
      }

      // ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.radius += 4 * dt;
        r.alpha = Math.max(0, 1 - r.radius / r.maxRadius);
        ctx.beginPath();
        ctx.strokeStyle = `rgba(0, 255, 213, ${r.alpha * 0.6})`;
        ctx.lineWidth = 2;
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.stroke();
        // inner ring
        ctx.beginPath();
        ctx.strokeStyle = `rgba(0, 200, 255, ${r.alpha * 0.4})`;
        ctx.lineWidth = 1;
        ctx.arc(r.x, r.y, r.radius * 0.7, 0, Math.PI * 2);
        ctx.stroke();
        if (r.radius >= r.maxRadius) ripples.splice(i, 1);
      }

      raf = requestAnimationFrame(step);
    };

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    };
    const onLeave = () => {
      mouse.active = false;
      mouse.x = -9999;
      mouse.y = -9999;
    };
    const onDown = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;
      ripples.push({ x: cx, y: cy, radius: 0, maxRadius: RIPPLE_RADIUS, alpha: 1 });
      // scatter nearby particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const dx = p.x - cx;
        const dy = p.y - cy;
        const dist = Math.hypot(dx, dy);
        if (dist < RIPPLE_RADIUS && dist > 0.1) {
          const force = (1 - dist / RIPPLE_RADIUS) * 6;
          p.scatterVx += (dx / dist) * force;
          p.scatterVy += (dy / dist) * force;
        }
      }
    };

    resize();
    window.addEventListener('resize', resize);
    if (interactive) {
      canvas.addEventListener('pointermove', onMove);
      canvas.addEventListener('pointerdown', onDown);
      canvas.addEventListener('pointerleave', onLeave);
    }
    raf = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      if (interactive) {
        canvas.removeEventListener('pointermove', onMove);
        canvas.removeEventListener('pointerdown', onDown);
        canvas.removeEventListener('pointerleave', onLeave);
      }
    };
  }, [density, interactive]);

  return (
    <div
      className={className}
      style={{ overflow: 'hidden', height: '100%', width: '100%' }}
    >
      <div
        ref={gradRef}
        aria-hidden
        style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
      />
      <canvas
        ref={canvasRef}
        aria-hidden
        style={{ width: '100%', height: '100%', display: 'block' }}
      />
    </div>
  );
}
