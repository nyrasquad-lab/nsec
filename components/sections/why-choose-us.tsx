'use client';

import { motion } from 'framer-motion';
import {
  BadgeCheck,
  Timer,
  Eye,
  Building2,
  BrainCircuit,
  ShieldAlert,
} from 'lucide-react';
import SectionHeading from '../section-heading';
import Reveal from '../reveal';
import CountUp from '../count-up';

const FEATURES = [
  {
    icon: BadgeCheck,
    title: 'Certified Experts',
    desc: 'OSCP, CISSP, CEH and GIAC-certified operators with real-world offensive and defensive experience.',
  },
  {
    icon: Timer,
    title: 'Rapid Response',
    desc: 'Average 15-minute engagement-to-action time for active incidents across global time zones.',
  },
  {
    icon: Eye,
    title: '24/7 Monitoring',
    desc: 'Continuous SOC coverage with behavioral analytics watching your perimeter, cloud and endpoints.',
  },
  {
    icon: Building2,
    title: 'Enterprise Security',
    desc: 'Programs scaled for complex estates: multi-cloud, hybrid and thousands of connected assets.',
  },
  {
    icon: BrainCircuit,
    title: 'Threat Intelligence',
    desc: 'AI-augmented intelligence pipeline that prioritizes the threats most relevant to your sector.',
  },
  {
    icon: ShieldAlert,
    title: 'Risk Management',
    desc: 'Quantified risk scoring and remediation roadmaps that translate security into boardroom language.',
  },
];

const STATS = [
  { end: 1500, suffix: '+', label: 'Engagements delivered' },
  { end: 99.99, decimals: 2, suffix: '%', label: 'SOC uptime' },
  { end: 15, suffix: ' min', label: 'Avg. response time' },
  { end: 24, suffix: '/7', label: 'Monitoring coverage' },
];

export default function WhyChooseUs() {
  return (
    <section id="about" className="section-padding relative overflow-hidden">
      <div className="pointer-events-none absolute -left-40 top-1/3 h-80 w-80 rounded-full bg-cyber-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-80 w-80 rounded-full bg-cyber-accent/10 blur-3xl" />

      <div className="container-wide relative">
        <SectionHeading
          eyebrow="Why NSEC"
          title={
            <>
              Built on expertise, <span className="text-gradient">proven in the field</span>
            </>
          }
          subtitle="Organizations choose NSEC Intelligence Group for the depth of our operators and the speed of our response."
        />

        {/* stats */}
        <div className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08}>
              <div className="rounded-2xl border border-white/10 bg-cyber-surface/40 p-6 text-center backdrop-blur-xl">
                <p className="font-display text-3xl font-bold text-white sm:text-4xl">
                  <CountUp
                    end={s.end}
                    decimals={s.decimals ?? 0}
                    suffix={s.suffix}
                  />
                </p>
                <p className="mt-2 text-xs uppercase tracking-wider text-cyber-muted">
                  {s.label}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* feature cards */}
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.06}>
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                className="group relative h-full rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-xl transition-colors hover:border-cyber-accent/30"
              >
                <div className="flex items-center gap-4">
                  <motion.span
                    whileHover={{ rotate: -8 }}
                    className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-cyber-accent/30 bg-cyber-accent/10 text-cyber-accent"
                  >
                    <f.icon className="h-5 w-5" />
                  </motion.span>
                  <h3 className="font-display text-lg font-semibold text-white">
                    {f.title}
                  </h3>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-cyber-muted">
                  {f.desc}
                </p>
                <span className="pointer-events-none absolute inset-x-6 bottom-0 h-px bg-gradient-to-r from-transparent via-cyber-accent/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
