'use client';

import { motion } from 'framer-motion';
import {
  ShieldCheck,
  Activity,
  Lock,
  Globe,
  Cpu,
  AlertTriangle,
  Radar,
} from 'lucide-react';

/**
 * Animated futuristic security dashboard illustration for the hero right side.
 * Pure CSS/SVG + Framer Motion — no external assets.
 */
export default function HeroDashboard() {
  const bars = [38, 62, 48, 80, 55, 72, 44, 90, 60, 75, 52, 68];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-full"
    >
      {/* glow */}
      <div className="absolute -inset-6 rounded-3xl bg-cyber-primary/10 blur-3xl" />
      <div className="absolute -inset-2 rounded-3xl bg-gradient-to-br from-cyber-primary/20 via-transparent to-cyber-accent/20 blur-2xl" />

      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-cyber-surface/70 backdrop-blur-2xl">
        {/* top bar */}
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-3.5">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-red-400/80" />
            <span className="h-3 w-3 rounded-full bg-amber-400/80" />
            <span className="h-3 w-3 rounded-full bg-emerald-400/80" />
          </div>
          <div className="flex items-center gap-2 text-xs text-cyber-muted">
            <span className="grid h-5 w-5 place-items-center rounded bg-cyber-primary/15">
              <Radar className="h-3 w-3 text-cyber-primary" />
            </span>
            nsec-soc · live
          </div>
        </div>

        {/* scan line */}
        <div className="pointer-events-none absolute inset-x-0 top-16 z-10 h-px bg-gradient-to-r from-transparent via-cyber-accent to-transparent animate-scan" />

        <div className="grid grid-cols-3 gap-3 p-4">
          {/* security score ring */}
          <div className="col-span-1 flex flex-col items-center justify-center rounded-xl border border-white/10 bg-white/[0.02] p-4">
            <div className="relative grid h-20 w-20 place-items-center">
              <svg viewBox="0 0 100 100" className="h-20 w-20 -rotate-90">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth="8"
                />
                <motion.circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="#00FFD5"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={264}
                  initial={{ strokeDashoffset: 264 }}
                  animate={{ strokeDashoffset: 264 - 264 * 0.94 }}
                  transition={{ duration: 1.8, delay: 0.8, ease: 'easeOut' }}
                  style={{ filter: 'drop-shadow(0 0 6px rgba(0,255,213,0.6))' }}
                />
              </svg>
              <span className="absolute font-display text-lg font-bold text-white">
                94
              </span>
            </div>
            <span className="mt-2 text-[10px] uppercase tracking-wider text-cyber-muted">
              Security Score
            </span>
          </div>

          {/* threat level */}
          <div className="col-span-2 rounded-xl border border-white/10 bg-white/[0.02] p-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-wider text-cyber-muted">
                Threat Level
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-400/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Low
              </span>
            </div>
            <div className="mt-3 flex items-end gap-1.5">
              {bars.map((h, i) => (
                <motion.span
                  key={i}
                  className="w-full rounded-sm bg-gradient-to-t from-cyber-secondary/60 to-cyber-primary"
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ duration: 0.6, delay: 0.6 + i * 0.05 }}
                />
              ))}
            </div>
            <div className="mt-2 flex justify-between text-[9px] text-cyber-muted">
              <span>00:00</span>
              <span>now</span>
            </div>
          </div>

          {/* metric tiles */}
          <MetricTile
            icon={<Lock className="h-4 w-4" />}
            label="Protected Assets"
            value="1,284"
            tone="primary"
          />
          <MetricTile
            icon={<AlertTriangle className="h-4 w-4" />}
            label="Detected Threats"
            value="7"
            tone="accent"
          />
          <MetricTile
            icon={<Activity className="h-4 w-4" />}
            label="Incident Status"
            value="Stable"
            tone="emerald"
          />

          {/* activity feed */}
          <div className="col-span-3 rounded-xl border border-white/10 bg-white/[0.02] p-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-wider text-cyber-muted">
                Live Activity
              </span>
              <Globe className="h-3.5 w-3.5 text-cyber-muted" />
            </div>
            <div className="mt-3 space-y-2">
              {[
                { t: 'Blocked anomalous login', c: 'text-cyber-primary', icon: ShieldCheck },
                { t: 'Patch deployed · cluster-b', c: 'text-cyber-accent', icon: Cpu },
                { t: 'Isolated endpoint dev-019', c: 'text-amber-300', icon: AlertTriangle },
              ].map((row, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 1 + i * 0.25 }}
                  className="flex items-center gap-2.5 text-xs"
                >
                  <row.icon className={`h-3.5 w-3.5 ${row.c}`} />
                  <span className="text-cyber-muted">{row.t}</span>
                  <span className="ml-auto text-[9px] text-cyber-muted/60">
                    {i + 1}m ago
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* floating mini chips */}
      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -left-6 top-24 hidden rounded-xl border border-white/10 bg-cyber-surface/80 px-3 py-2 backdrop-blur-xl sm:block"
      >
        <div className="flex items-center gap-2 text-xs">
          <ShieldCheck className="h-4 w-4 text-cyber-accent" />
          <span className="text-white">Zero breaches</span>
        </div>
      </motion.div>
      <motion.div
        animate={{ y: [0, 12, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute -right-4 bottom-28 hidden rounded-xl border border-white/10 bg-cyber-surface/80 px-3 py-2 backdrop-blur-xl sm:block"
      >
        <div className="flex items-center gap-2 text-xs">
          <Activity className="h-4 w-4 text-cyber-primary" />
          <span className="text-white">99.99% uptime</span>
        </div>
      </motion.div>
    </motion.div>
  );
}

function MetricTile({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tone: 'primary' | 'accent' | 'emerald';
}) {
  const toneMap = {
    primary: 'text-cyber-primary bg-cyber-primary/10',
    accent: 'text-cyber-accent bg-cyber-accent/10',
    emerald: 'text-emerald-300 bg-emerald-400/10',
  } as const;
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
      <span className={`grid h-7 w-7 place-items-center rounded-lg ${toneMap[tone]}`}>
        {icon}
      </span>
      <p className="mt-2.5 font-display text-lg font-bold text-white">{value}</p>
      <p className="text-[10px] uppercase tracking-wider text-cyber-muted">{label}</p>
    </div>
  );
}
