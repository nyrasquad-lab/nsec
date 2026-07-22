import ContactForm from '@/components/contact-form';

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
        <ContactForm />
      </div>
    </section>
  );
}
