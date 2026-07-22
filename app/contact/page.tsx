import ContactForm from '@/components/contact-form';

export default function ContactPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#080f1d]">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/5 blur-3xl" />
      <div className="container relative z-10 py-20">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <div className="mb-4 inline-flex items-center gap-2">
            <span className="font-mono text-xs text-cyan-500/60">[</span>
            <span className="h-2 w-2 rounded-full bg-green-400 shadow-[0_0_6px_rgba(74,222,128,0.8)]" />
            <span className="text-sm font-medium text-white/80">Contact NSEC Intelligence</span>
            <span className="font-mono text-xs text-cyan-500/60">]</span>
          </div>
          <h1 className="text-4xl font-bold text-white md:text-5xl">Get In Touch</h1>
          <p className="mt-4 text-lg text-white/40">
            Reach out to our security team — we&apos;ll respond within 2 hours during business days.
          </p>
        </div>
        <ContactForm />
      </div>
    </div>
  );
}
