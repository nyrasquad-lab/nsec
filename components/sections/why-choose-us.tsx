import { CheckCircle, Clock, Users, Award } from 'lucide-react';

const features = [
  { icon: CheckCircle, title: '99.9% Uptime Guarantee', desc: 'We ensure your systems are always available when you need them.' },
  { icon: Clock, title: 'Fast Response Times', desc: 'Average response time under 30 minutes for critical issues.' },
  { icon: Users, title: 'Expert Team', desc: 'Certified engineers with decades of combined IT experience.' },
  { icon: Award, title: 'Proven Track Record', desc: 'Trusted by 200+ businesses across various industries.' },
];

export default function WhyChooseUs() {
  return (
    <section id="why-us" className="bg-secondary/50 py-20 md:py-28">
      <div className="container">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Why Choose Us</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            We deliver results that matter to your business
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div key={feature.title} className="rounded-xl border bg-card p-6 text-center shadow-sm">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 font-semibold">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
