'use client';

import { motion } from 'framer-motion';
import {
  Bug,
  Swords,
  Shield,
  Radar,
  Fingerprint,
  Cloud,
  Zap,
  ClipboardCheck,
  GraduationCap,
  ArrowRight,
} from 'lucide-react';
import SectionHeading from '../section-heading';
import Reveal from '../reveal';

const SERVICES = [
  {
    icon: Bug,
    title: 'Penetration Testing',
    desc: 'Simulated real-world attacks across applications, networks and people to expose exploitable weaknesses before adversaries do.',
  },
  {
    icon: Swords,
    title: 'Red Team',
    desc: 'Goal-driven adversarial emulation testing your detection and response against full-spectrum, multi-stage attacks.',
  },
  {
    icon: Shield,
    title: 'Blue Team',
    desc: 'Defensive operations, threat hunting and detection engineering that harden your environment and shorten response time.',
  },
  {
    icon: Radar,
    title: 'Threat Intelligence',
    desc: 'Actionable intelligence on emerging adversaries, TTPs and vulnerabilities, mapped to your specific attack surface.',
  },
  {
    icon: Fingerprint,
    title: 'Digital Forensics',
    desc: 'Rapid forensic investigation of breaches: evidence preservation, root-cause analysis and chain-of-custody reporting.',
  },
  {
    icon: Cloud,
    title: 'Cloud Security',
    desc: 'Architecture review and continuous posture management across AWS, Azure and GCP, from IAM to workload runtime.',
  },
  {
    icon: Zap,
    title: 'Incident Response',
    desc: '24/7 response retainer: containment, eradication and recovery with forensic-grade documentation, on demand.',
  },
  {
    icon: ClipboardCheck,
    title: 'Compliance',
    desc: 'Mapping and gap analysis for SOC 2, ISO 27001, HIPAA, PCI-DSS and NIST, with evidence ready for audit.',
  },
  {
    icon: GraduationCap,
    title: 'Security Awareness Training',
    desc: 'Phishing simulations and role-based training that turns your workforce into a measurable layer of defense.',
  },
];

export default function ServicesSection() {
  return (
    <section id="services" className="section-padding relative">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-20" />
      <div className="container-wide relative">
        <SectionHeading
          eyebrow="Capabilities"
          title={
            <>
              Full-spectrum <span className="text-gradient">security services</span>
            </>
          }
          subtitle="From offensive validation to continuous defense and compliance. A single partner for your entire security program."
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.06}>
              <motion.div
                whileHover={{ y: -8 }}
                transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                className="group relative h-full overflow-hidden rounded-2xl border border-white/10 bg-cyber-surface/40 p-6 backdrop-blur-xl transition-colors hover:border-cyber-primary/40"
              >
                {/* hover glow */}
                <div className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-hover:glow-primary" />

                <div className="relative flex items-start justify-between">
                  <motion.span
                    whileHover={{ rotate: 8, scale: 1.08 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    className="grid h-12 w-12 place-items-center rounded-xl border border-cyber-primary/30 bg-cyber-primary/10 text-cyber-primary transition-colors group-hover:border-cyber-accent/40 group-hover:text-cyber-accent"
                  >
                    <s.icon className="h-6 w-6" />
                  </motion.span>
                  <ArrowRight className="h-5 w-5 text-cyber-muted/40 transition-all group-hover:translate-x-1 group-hover:text-cyber-accent" />
                </div>

                <h3 className="relative mt-5 font-display text-lg font-semibold text-white">
                  {s.title}
                </h3>
                <p className="relative mt-2.5 text-sm leading-relaxed text-cyber-muted">
                  {s.desc}
                </p>

                <span className="relative mt-5 block h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                <span className="relative mt-3 inline-block text-xs font-medium uppercase tracking-wider text-cyber-primary/70 transition-colors group-hover:text-cyber-accent">
                  Learn more
                </span>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
