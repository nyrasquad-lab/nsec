'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import SocDashboard from '@/components/soc-dashboard';

const NetworkBackground = dynamic(() => import('@/components/network-background'), { ssr: false });

export default function Hero() {
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const t = setInterval(() => setShowCursor((p) => !p), 530);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-[#080f1d]">
      {/* Network dots background */}
      <NetworkBackground />

      {/* Radial glow top-left */}
      <div className="pointer-events-none absolute left-0 top-0 h-[600px] w-[600px] -translate-x-1/4 -translate-y-1/4 rounded-full bg-cyan-500/5 blur-3xl" />

      {/* Content */}
      <div className="container relative z-10 grid min-h-[calc(100vh-4rem)] grid-cols-1 items-center gap-12 py-16 lg:grid-cols-2 lg:py-0">
        {/* Left */}
        <div>
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2">
            <span className="font-mono text-xs text-cyan-500/60">[</span>
            <span className="h-2 w-2 rounded-full bg-green-400 shadow-[0_0_6px_rgba(74,222,128,0.8)]" />
            <span className="text-sm font-medium text-white/80">Elite Cybersecurity</span>
            <span className="text-white/30">·</span>
            <span className="text-sm font-medium text-white/80">Enterprise-Grade</span>
            <span className="font-mono text-xs text-cyan-500/60">]</span>
          </div>

          {/* Heading */}
          <h1 className="text-5xl font-bold leading-tight tracking-tight text-white md:text-6xl lg:text-7xl">
            NSEC Intelligence
            <br />
            Group
            <span
              className="ml-1 inline-block w-[3px] bg-cyan-400 align-middle"
              style={{
                height: '0.85em',
                opacity: showCursor ? 1 : 0,
                boxShadow: showCursor ? '0 0 8px rgba(0,212,255,0.8)' : 'none',
              }}
            />
          </h1>

          {/* Subheading */}
          <p className="mt-5 text-xl font-medium text-white/60 leading-snug">
            Protecting Organizations Against{' '}
            <span className="text-cyan-400">Modern Cyber</span>
            <br />
            Threats
          </p>

          {/* Body */}
          <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-white/45">
            We combine elite offensive expertise, AI-driven threat intelligence, and 24/7 defense operations to safeguard your critical assets across cloud, network, and endpoint.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link href="/request-assessment">
              <button className="flex items-center gap-2 rounded-lg bg-cyan-500 px-6 py-3 text-sm font-semibold text-[#080f1d] transition-all hover:bg-cyan-400 active:scale-95">
                Request Assessment
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </Link>
            <Link href="/#services">
              <button className="flex items-center gap-2.5 rounded-lg border border-white/15 bg-white/5 px-6 py-3 text-sm font-medium text-white/80 transition-all hover:border-white/30 hover:bg-white/10">
                <svg className="h-3.5 w-3.5 text-cyan-400" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Explore Services
              </button>
            </Link>
          </div>

          {/* Certifications */}
          <div className="mt-8 flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2 text-sm text-white/40">
              <svg className="h-4 w-4 text-cyan-500/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <path d="M12 2L3 7v6c0 5 4 9.4 9 10.9 5-1.5 9-5.9 9-10.9V7L12 2z" />
              </svg>
              SOC 2 · ISO 27001
            </div>
            <div className="flex items-center gap-2 text-sm text-white/40">
              <svg className="h-4 w-4 text-cyan-500/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <polyline points="4 17 10 11 4 5" /><line x1="12" y1="19" x2="20" y2="19" />
              </svg>
              OSCP · CEH · CISSP certified
            </div>
          </div>
        </div>

        {/* Right — SOC Dashboard */}
        <div className="flex justify-center lg:justify-end">
          <SocDashboard />
        </div>
      </div>
    </section>
  );
}
