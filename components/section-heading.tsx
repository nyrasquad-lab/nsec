'use client';

import { motion } from 'framer-motion';
import Reveal from './reveal';

/**
 * Reusable section heading with eyebrow, title, and subtitle.
 */
export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'center',
}: {
  eyebrow: string;
  title: React.ReactNode;
  subtitle?: string;
  align?: 'center' | 'left';
}) {
  return (
    <Reveal>
      <div
        className={
          align === 'center'
            ? 'mx-auto max-w-2xl text-center'
            : 'max-w-2xl text-left'
        }
      >
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full border border-cyber-primary/30 bg-cyber-primary/5 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-cyber-primary"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-cyber-accent" />
          {eyebrow}
        </motion.span>
        <h2 className="mt-5 font-display text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-[2.7rem]">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-4 text-base leading-relaxed text-cyber-muted">
            {subtitle}
          </p>
        )}
      </div>
    </Reveal>
  );
}
