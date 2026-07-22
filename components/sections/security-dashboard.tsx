'use client';

import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
} from 'recharts';
import { Shield, Activity, Server, AlertTriangle, Bug, CheckCircle2 } from 'lucide-react';
import SectionHeading from '../section-heading';
import Reveal from '../reveal';
import CountUp from '../count-up';

const TREND = [
  { d: 'Mon', threats: 12, blocked: 240 },
  { d: 'Tue', threats: 8, blocked: 310 },
  { d: 'Wed', threats: 15, blocked: 280 },
  { d: 'Thu', threats: 6, blocked: 360 },
  { d: 'Fri', threats: 9, blocked: 420 },
  { d: 'Sat', threats: 4, blocked: 300 },
  { d: 'Sun', threats: 7, blocked: 380 },
];

const METRICS = [
  { icon: Shield, label: 'Security Score', value: 94, suffix: '/100', tone: 'accent' as const },
  { icon: Activity, label: 'Threat Level', value: 18, suffix: '%', tone: 'primary' as const },
  { icon: Server, label: 'Protected Assets', value: 1284, suffix: '', tone: 'primary' as const },
  { icon: AlertTriangle, label: 'Detected Threats', value: 7, suffix: '', tone: 'amber' as const },
  { icon: Bug, label: 'Vulnerabilities', value: 23, suffix: '', tone: 'accent' as const },
  { icon: CheckCircle2, label: 'Incident Status', value: 100, suffix: '% stable', tone: 'emerald' as const },
];

const toneMap = {
  primary: 'text-cyber-primary bg-cyber-primary/10 border-cyber-primary/30',
  accent: 'text-cyber-accent bg-cyber-accent/10 border-cyber-accent/30',
  amber: 'text-amber-300 bg-amber-400/10 border-amber-400/30',
  emerald: 'text-emerald-300 bg-emerald-400/10 border-emerald-400/30',
};

export default function SecurityDashboard() {
  return (
    <section id="research" className="section-padding relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-20" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-[80%] -translate-x-1/2 rounded-full bg-cyber-primary/10 blur-3xl" />

      <div className="container-wide relative">
        <SectionHeading
          eyebrow="Live Posture"
          title={
            <>
              Your security, <span className="text-gradient">in real time</span>
            </>
          }
          subtitle="A unified view of risk, threats and response — the same visibility our SOC delivers to every client."
        />

        <Reveal className="mt-14">
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-cyber-surface/50 backdrop-blur-2xl">
            {/* top bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-6 py-4">
              <div className="flex items-center gap-3">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyber-accent opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-cyber-accent" />
                </span>
                <span className="font-display text-sm font-semibold text-white">
                  NSEC SOC · Global Posture
                </span>
              </div>
              <span className="text-xs text-cyber-muted">Updated continuously</span>
            </div>

            {/* metric grid */}
            <div className="grid gap-px bg-white/5 sm:grid-cols-2 lg:grid-cols-3">
              {METRICS.map((m, i) => (
                <motion.div
                  key={m.label}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.07 }}
                  className="bg-cyber-surface/60 p-6"
                >
                  <div className="flex items-center justify-between">
                    <span className={`grid h-10 w-10 place-items-center rounded-xl border ${toneMap[m.tone]}`}>
                      <m.icon className="h-5 w-5" />
                    </span>
                    <span className="text-[10px] uppercase tracking-wider text-cyber-muted">
                      live
                    </span>
                  </div>
                  <p className="mt-4 font-display text-3xl font-bold text-white">
                    <CountUp end={m.value} suffix={m.suffix} />
                  </p>
                  <p className="mt-1 text-sm text-cyber-muted">{m.label}</p>
                </motion.div>
              ))}
            </div>

            {/* charts */}
            <div className="grid gap-px bg-white/5 lg:grid-cols-3">
              {/* trend area chart */}
              <div className="bg-cyber-surface/60 p-6 lg:col-span-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-sm font-semibold text-white">
                    Threats blocked · 7 days
                  </h3>
                  <span className="inline-flex items-center gap-1.5 text-xs text-cyber-muted">
                    <span className="h-2 w-2 rounded-full bg-cyber-primary" /> blocked
                    <span className="ml-3 h-2 w-2 rounded-full bg-cyber-accent" /> threats
                  </span>
                </div>
                <div className="mt-5 h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={TREND} margin={{ top: 6, right: 6, left: -24, bottom: 0 }}>
                      <defs>
                        <linearGradient id="gBlocked" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#00C8FF" stopOpacity={0.5} />
                          <stop offset="100%" stopColor="#00C8FF" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="gThreats" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#00FFD5" stopOpacity={0.5} />
                          <stop offset="100%" stopColor="#00FFD5" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis
                        dataKey="d"
                        stroke="#64748b"
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        stroke="#64748b"
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip
                        contentStyle={{
                          background: '#0B1120',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: 12,
                          fontSize: 12,
                          color: '#fff',
                        }}
                        labelStyle={{ color: '#94A3B8' }}
                      />
                      <Area
                        type="monotone"
                        dataKey="blocked"
                        stroke="#00C8FF"
                        strokeWidth={2}
                        fill="url(#gBlocked)"
                        animationDuration={1600}
                      />
                      <Area
                        type="monotone"
                        dataKey="threats"
                        stroke="#00FFD5"
                        strokeWidth={2}
                        fill="url(#gThreats)"
                        animationDuration={1800}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* radial threat level */}
              <div className="bg-cyber-surface/60 p-6">
                <h3 className="font-display text-sm font-semibold text-white">
                  Exposure reduction
                </h3>
                <div className="mt-4 h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart
                      innerRadius="70%"
                      outerRadius="100%"
                      data={[{ name: 'reduction', value: 86, fill: '#00FFD5' }]}
                      startAngle={90}
                      endAngle={-270}
                    >
                      <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                      <RadialBar
                        background={{ fill: 'rgba(255,255,255,0.06)' }}
                        dataKey="value"
                        cornerRadius={20}
                        animationDuration={1600}
                      />
                    </RadialBarChart>
                  </ResponsiveContainer>
                </div>
                <div className="-mt-32 text-center">
                  <p className="font-display text-3xl font-bold text-white">
                    <CountUp end={86} suffix="%" />
                  </p>
                  <p className="mt-1 text-xs text-cyber-muted">risk reduced</p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
