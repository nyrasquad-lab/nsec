'use client';

import { motion } from 'framer-motion';
import {
  Landmark,
  HeartPulse,
  Building,
  GraduationCap,
  Radio,
  Zap,
  Factory,
  Store,
  ArrowUpRight,
} from 'lucide-react';
import SectionHeading from '../section-heading';
import Reveal from '../reveal';

const INDUSTRIES = [
  { icon: Landmark, title: 'Financial', desc: 'Banking, fintech & insurance — fraud, ransomware and regulatory resilience.' },
  { icon: HeartPulse, title: 'Healthcare', desc: 'HIPAA-aligned protection for patient data, medical devices and EHR systems.' },
  { icon: Building, title: 'Government', desc: 'Sovereign-grade defense for agencies, critical infrastructure and public services.' },
  { icon: GraduationCap, title: 'Education', desc: 'Safeguarding student records, research IP and distributed campus networks.' },
  { icon: Radio, title: 'Telecommunications', desc: 'Network core, 5G and subscriber data protection at carrier scale.' },
  { icon: Zap, title: 'Energy', desc: 'OT/ICS security for grids, pipelines and renewable infrastructure.' },
  { icon: Factory, title: 'Manufacturing', desc: 'Securing smart factories, supply chains and industrial control systems.' },
  { icon: Store, title: 'Small Business', desc: 'Right-sized protection that brings enterprise defense to growing teams.' },
];

export default function Industries() {
  return (
    <section id="industries" className="section-padding relative">
      <div className="container-wide relative">
        <SectionHeading
          eyebrow="Industries"
          title={
            <>
              Trusted across <span className="text-gradient">critical sectors</span>
            </>
          }
          subtitle="We tailor security programs to the threat landscape and compliance demands of each industry we serve."
        />

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {INDUSTRIES.map((ind, i) => (
            <Reveal key={ind.title} delay={i * 0.05}>
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                className="group relative h-full overflow-hidden rounded-2xl border border-white/10 bg-cyber-surface/40 p-6 backdrop-blur-xl transition-colors hover:border-cyber-primary/40"
              >
                <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-cyber-primary/10 blur-2xl opacity-0 transition-opacity group-hover:opacity-100" />
                <span className="grid h-11 w-11 place-items-center rounded-xl border border-cyber-primary/30 bg-cyber-primary/10 text-cyber-primary transition-colors group-hover:text-cyber-accent group-hover:border-cyber-accent/40">
                  <ind.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-display text-base font-semibold text-white">
                  {ind.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-cyber-muted">
                  {ind.desc}
                </p>
                <ArrowUpRight className="absolute right-5 top-5 h-4 w-4 text-cyber-muted/40 transition-all group-hover:text-cyber-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
