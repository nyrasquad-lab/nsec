import Link from 'next/link';
import { ArrowRight, ShieldCheck, Server, Cloud, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-grid">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
      <div className="container relative py-20 md:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-card px-4 py-1.5 text-sm font-medium shadow-sm">
            <ShieldCheck className="h-4 w-4 text-primary" />
            Trusted IT Solutions Provider
          </div>
          <h1 className="text-balance text-4xl font-bold tracking-tight md:text-6xl">
            Your Trusted Partner for{' '}
            <span className="text-primary">IT Infrastructure</span> & Support
          </h1>
          <p className="mt-6 text-balance text-lg text-muted-foreground md:text-xl">
            We deliver enterprise-grade IT services, cloud solutions, and cybersecurity
            to keep your business running smoothly 24/7.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/assessment">
              <Button size="lg" className="group">
                Get Free Assessment
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/support">
              <Button variant="outline" size="lg">Submit a Ticket</Button>
            </Link>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { icon: Server, title: '24/7 Monitoring', desc: 'Round-the-clock infrastructure monitoring' },
            { icon: Cloud, title: 'Cloud Solutions', desc: 'Seamless cloud migration & management' },
            { icon: Lock, title: 'Cybersecurity', desc: 'Enterprise-grade security solutions' },
          ].map((item) => (
            <div
              key={item.title}
              className="flex items-start gap-3 rounded-lg border bg-card p-4 shadow-sm"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <item.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
