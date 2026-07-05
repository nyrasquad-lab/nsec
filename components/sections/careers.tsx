'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Briefcase, Users, Rocket } from 'lucide-react';
import Reveal from '../reveal';

export default function Careers() {
  return (
    <section id="careers" className="section-padding relative overflow-hidden">
      <div className="container-wide relative">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-cyber-surface/80 via-cyber-surface/40 to-cyber-bg/60 p-8 backdrop-blur-2xl sm:p-12">
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-cyber-primary/15 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-cyber-accent/15 blur-3xl" />

            <div className="relative grid items-center gap-8 lg:grid-cols-2">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-cyber-accent/30 bg-cyber-accent/5 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-cyber-accent">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyber-accent" />
                  Careers
                </span>
                <h2 className="mt-5 font-display text-3xl font-bold leading-tight text-white sm:text-4xl">
                  Defend the frontier with{' '}
                  <span className="text-gradient">the best in the field</span>
                </h2>
                <p className="mt-4 max-w-xl text-base leading-relaxed text-cyber-muted">
                  We are always looking for elite operators — red teamers,
                  threat hunters, cloud specialists and detection engineers.
                  Grow your craft on the hardest problems, with a team that
                  values depth over theatre.
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <a
                    href="#contact"
                    className="group inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyber-primary to-cyber-secondary px-6 py-3.5 text-sm font-semibold text-cyber-bg transition-all hover:glow-primary"
                  >
                    View open roles
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </a>
                  <span className="text-xs text-cyber-muted">
                    Remote-first · Global · Equal opportunity
                  </span>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  { icon: Briefcase, stat: '120+', label: 'Operators worldwide' },
                  { icon: Rocket, stat: '40%', label: 'Red team veterans' },
                  { icon: Users, stat: '18', label: 'Nationalities on team' },
                ].map((c, i) => (
                  <motion.div
                    key={c.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 text-center"
                  >
                    <c.icon className="mx-auto h-6 w-6 text-cyber-primary" />
                    <p className="mt-3 font-display text-2xl font-bold text-white">
                      {c.stat}
                    </p>
                    <p className="mt-1 text-xs uppercase tracking-wider text-cyber-muted">
                      {c.label}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
