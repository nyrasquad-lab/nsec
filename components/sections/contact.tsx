import Link from 'next/link';
import { ArrowRight, Phone, Mail, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ContactSection() {
  return (
    <section id="contact" className="bg-secondary/50 py-20 md:py-28">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Get In Touch</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Ready to transform your IT infrastructure? Let&apos;s talk.
          </p>
        </div>
        <div className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-3">
          {[
            { icon: Phone, title: 'Call Us', value: '(555) 123-4567' },
            { icon: Mail, title: 'Email Us', value: 'support@itsupporthub.com' },
            { icon: MapPin, title: 'Visit Us', value: '123 Tech Plaza, Suite 400' },
          ].map((item) => (
            <div key={item.title} className="flex flex-col items-center rounded-xl border bg-card p-6 text-center shadow-sm">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <item.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">{item.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{item.value}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link href="/assessment">
            <Button size="lg" className="group">
              Request a Free Assessment
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
