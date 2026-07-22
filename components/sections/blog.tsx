'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Clock } from 'lucide-react';
import SectionHeading from '../section-heading';
import Reveal from '../reveal';
import { getSupabase } from '@/lib/supabase-client';

type Post = {
  id: string;
  category: string;
  title: string;
  excerpt: string;
  read_time: string;
  published_at: string;
  image_url: string;
};

const categoryTone: Record<string, string> = {
  'Threat Intelligence': 'border-cyber-primary/40 text-cyber-primary bg-cyber-primary/10',
  'Cloud Security': 'border-cyber-accent/40 text-cyber-accent bg-cyber-accent/10',
  'Red Team': 'border-cyber-secondary/40 text-cyber-secondary bg-cyber-secondary/10',
};

export default function Blog() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data, error } = await getSupabase()
        .from('posts')
        .select('id, category, title, excerpt, read_time, published_at, image_url')
        .order('created_at', { ascending: false })
        .limit(6);

      if (!active) return;
      if (error || !data) {
        setError(true);
      } else {
        setPosts(data as Post[]);
      }
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, []);

  return (
    <section id="resources" className="section-padding relative overflow-hidden">
      <div className="pointer-events-none absolute -right-40 top-10 h-80 w-80 rounded-full bg-cyber-secondary/10 blur-3xl" />

      <div className="container-wide relative">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading
            align="left"
            eyebrow="Resources"
            title={
              <>
                Research & <span className="text-gradient">insights</span>
              </>
            }
            subtitle="Field notes, threat research and defensive guidance from our operators."
          />
          <Reveal>
            <a
              href="#resources"
              className="group inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-medium text-white transition-all hover:border-cyber-primary/40"
            >
              View all
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
          </Reveal>
        </div>

        {loading && (
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-80 animate-pulse rounded-2xl border border-white/10 bg-cyber-surface/30"
              />
            ))}
          </div>
        )}

        {error && !loading && (
          <div className="mt-12 rounded-2xl border border-cyber-error/30 bg-cyber-error/5 p-8 text-center text-sm text-cyber-muted">
            Unable to load insights right now. Please check back shortly.
          </div>
        )}

        {!loading && !error && posts.length === 0 && (
          <div className="mt-12 rounded-2xl border border-white/10 bg-cyber-surface/30 p-8 text-center text-sm text-cyber-muted">
            No articles published yet.
          </div>
        )}

        {!loading && !error && posts.length > 0 && (
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {posts.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.08}>
                <motion.article
                  whileHover={{ y: -8 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-cyber-surface/40 backdrop-blur-xl transition-colors hover:border-cyber-primary/40"
                >
                  <div className="relative h-44 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.image_url}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-cover opacity-70 transition-all duration-700 group-hover:scale-110 group-hover:opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-cyber-surface via-cyber-surface/40 to-transparent" />
                    <span
                      className={`absolute left-4 top-4 rounded-full border px-2.5 py-1 text-[11px] font-semibold backdrop-blur-md ${
                        categoryTone[p.category] ??
                        'border-white/20 text-white bg-white/10'
                      }`}
                    >
                      {p.category}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-center gap-3 text-xs text-cyber-muted">
                      <span>{p.published_at}</span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {p.read_time}
                      </span>
                    </div>
                    <h3 className="mt-3 font-display text-lg font-semibold leading-snug text-white transition-colors group-hover:text-cyber-accent">
                      {p.title}
                    </h3>
                    <p className="mt-2.5 flex-1 text-sm leading-relaxed text-cyber-muted">
                      {p.excerpt}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-cyber-primary transition-colors group-hover:text-cyber-accent">
                      Read article
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </motion.article>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
