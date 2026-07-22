import { CheckCircle, Users, Award, ShieldCheck } from 'lucide-react';

const stats = [
  { value: '2.4B+', label: 'Threats Blocked' },
  { value: '500+', label: 'Organizations Protected' },
  { value: '99.99%', label: 'Uptime SLA' },
  { value: '< 5min', label: 'Mean Response Time' },
];

const pillars = [
  { icon: CheckCircle, title: 'SOC 2 Type II Certified', desc: 'Annually audited against the most rigorous security and availability criteria.' },
  { icon: Users, title: 'Elite Operator Team', desc: 'Former intelligence community professionals and certified offensive security experts.' },
  { icon: Award, title: 'Proven at Scale', desc: 'Protecting Fortune 500 companies and critical infrastructure across 40+ countries.' },
  { icon: ShieldCheck, title: 'Zero-Trust Architecture', desc: 'Modern security framework that assumes breach and verifies every access request.' },
];

export default function AboutSection() {
  return (
    <section id="about" className="bg-[#080f1d] py-24">
      <div className="container">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <p className="mb-3 font-mono text-xs uppercase tracking-widest text-cyan-500/60">Why NSEC</p>
          <h2 className="text-3xl font-bold text-white md:text-4xl">Intelligence-First Defense</h2>
          <p className="mt-4 text-base text-white/40">
            We go beyond compliance to deliver adversary-grade protection
          </p>
        </div>

        <div className="mb-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-xl border border-white/5 bg-white/[0.03] p-6 text-center">
              <div className="text-3xl font-bold text-cyan-400">{s.value}</div>
              <div className="mt-1 text-sm text-white/40">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((p) => (
            <div key={p.title} className="rounded-xl border border-white/5 bg-white/[0.03] p-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-cyan-500/20 bg-cyan-500/10">
                <p.icon className="h-6 w-6 text-cyan-400" />
              </div>
              <h3 className="mb-2 font-semibold text-white">{p.title}</h3>
              <p className="text-sm leading-relaxed text-white/40">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
