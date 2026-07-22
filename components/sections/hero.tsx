'use client';

import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Play, Terminal } from 'lucide-react';
import dynamic from 'next/dynamic';
import TypingText from '../typing-text';
const HeroDashboard = dynamic(() => import('../hero-dashboard'));

export default function Hero() {
  return (
    <section id="home" className="relative min-h-screen">
      {/* content sits on the shared fixed background — no separate bg layer here */}
      <div className="container-wide relative z-10 grid min-h-screen items-center gap-12 px-6 pb-20 pt-24 sm:px-8 lg:grid-cols-2 lg:px-12 lg:pt-20">
        {/* left — text column with cyber effects flowing THROUGH the text */}
        <div className="relative max-w-xl">
          {/* scan beam sweeping down through the entire text column */}
          <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden rounded-xl">
            <div className="scan-beam absolute inset-x-0 h-40 animate-scan-beam" />
          </div>

          {/* badge with HUD corners */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="hud-frame relative inline-flex items-center gap-2 rounded-full border border-cyber-primary/30 bg-cyber-primary/5 px-3 py-1.5 text-xs text-cyber-primary"
          >
            <span className="hud-corner hud-corner-tl animate-corner-pulse" />
            <span className="hud-corner hud-corner-br animate-corner-pulse" style={{ animationDelay: '1.2s' }} />
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyber-accent opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-cyber-accent" />
            </span>
            <span className="text-shimmer font-medium tracking-wide">
              Elite Cybersecurity · Enterprise-Grade
            </span>
          </motion.div>

          {/* company name — typing with RGB glitch split + breathing glow */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="relative mt-6 font-display text-4xl font-bold leading-[1.1] sm:text-5xl lg:text-6xl"
          >
            {/* RGB split layers behind the typed text */}
            <span className="pointer-events-none absolute inset-0 animate-rgb-shift-a">
              <TypingText text="NSEC Intelligence Group" className="glitch-a" />
            </span>
            <span className="pointer-events-none absolute inset-0 animate-rgb-shift-b">
              <TypingText text="NSEC Intelligence Group" className="glitch-b" />
            </span>
            {/* main typed text */}
            <span className="relative inline-block animate-glow-breathe">
              <TypingText text="NSEC Intelligence Group" className="glitch-base" />
            </span>
          </motion.h1>

          {/* tagline — shimmer + scan underline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="relative mt-5 z-20"
          >
            <p className="text-shimmer-inline font-display text-xl font-medium sm:text-2xl">
              Protecting Organizations Against Modern Cyber Threats
            </p>
            <span className="mt-2 block h-px w-full bg-[length:200%_100%] bg-gradient-to-r from-transparent via-cyber-accent to-transparent animate-border-scan" />
          </motion.div>

          {/* description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="relative z-20 mt-5 text-base leading-relaxed text-cyber-muted"
          >
            We combine elite offensive expertise, AI-driven threat intelligence,
            and 24/7 defense operations to safeguard your critical assets
            across cloud, network, and endpoint.
          </motion.p>

          {/* CTAs — glowing scanning border on primary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="relative z-20 mt-9 flex flex-wrap items-center gap-4"
          >
            <a
              href="#contact"
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-lg px-6 py-3.5 text-sm font-semibold text-cyber-bg transition-all hover:glow-primary"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-cyber-primary to-cyber-secondary" />
              <span className="absolute inset-0 bg-[length:200%_100%] bg-gradient-to-r from-transparent via-white/40 to-transparent animate-border-scan" />
              <span className="relative">Request Assessment</span>
              <ArrowRight className="relative h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="#services"
              className="group inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition-all hover:border-cyber-primary/40 hover:bg-white/10"
            >
              <Play className="h-4 w-4 text-cyber-accent" />
              Explore Services
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.75 }}
            className="relative z-20 mt-10 flex items-center gap-6 text-xs text-cyber-muted"
          >
            <span className="inline-flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-cyber-accent" />
              SOC 2 · ISO 27001
            </span>
            <span className="inline-flex items-center gap-2">
              <Terminal className="h-4 w-4 text-cyber-primary" />
              OSCP · CEH · CISSP certified
            </span>
          </motion.div>
        </div>

        {/* right */}
        <div className="relative lg:pl-6">
          <HeroDashboard />
        </div>
      </div>

      {/* scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="pointer-events-none absolute bottom-6 left-1/2 z-10 -translate-x-1/2"
      >
        <div className="flex h-9 w-5 items-start justify-center rounded-full border border-white/20 p-1">
          <motion.span
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.6, repeat: Infinity }}
            className="h-1.5 w-1 rounded-full bg-cyber-accent"
          />
        </div>
      </motion.div>
    </section>
  );
}
