import Link from 'next/link';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function ContactSection() {
  return (
    <section id="contact" className="bg-[#060d1a] py-24">
      <div className="container">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <p className="mb-3 font-mono text-xs uppercase tracking-widest text-cyan-500/60">Get In Touch</p>
          <h2 className="text-3xl font-bold text-white md:text-4xl">Ready to Secure Your Organization?</h2>
          <p className="mt-4 text-base text-white/40">
            Our security team is standing by. Let&apos;s talk about your threat landscape.
          </p>
        </div>
        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-5 md:grid-cols-3">
          {[
            { icon: Phone, title: 'Call Us', value: '+1 (555) NSEC-SEC' },
            { icon: Mail, title: 'Email Us', value: 'intel@nsecintelligence.com' },
            { icon: MapPin, title: 'Headquarters', value: 'Cyber Defense Center, VA' },
          ].map((item) => (
            <div key={item.title} className="flex flex-col items-center rounded-xl border border-white/5 bg-white/[0.03] p-6 text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg border border-cyan-500/20 bg-cyan-500/10">
                <item.icon className="h-6 w-6 text-cyan-400" />
              </div>
              <h3 className="font-semibold text-white">{item.title}</h3>
              <p className="mt-1 text-sm text-white/40">{item.value}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link href="/request-assessment">
            <button className="inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-8 py-3 text-sm font-semibold text-[#080f1d] transition-all hover:bg-cyan-400">
              Request a Security Assessment
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
