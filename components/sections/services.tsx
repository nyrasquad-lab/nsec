import { Server, Cloud, Lock, Wifi, Database, Headphones } from 'lucide-react';

const services = [
  { icon: Server, title: 'Infrastructure Management', desc: 'Comprehensive server and network infrastructure management with proactive monitoring and maintenance.' },
  { icon: Cloud, title: 'Cloud Solutions', desc: 'Cloud migration, optimization, and management across AWS, Azure, and Google Cloud platforms.' },
  { icon: Lock, title: 'Cybersecurity', desc: 'Advanced threat protection, security audits, compliance management, and incident response.' },
  { icon: Wifi, title: 'Network Services', desc: 'Network design, implementation, monitoring, and optimization for maximum uptime and performance.' },
  { icon: Database, title: 'Data Backup & Recovery', desc: 'Automated backup solutions and disaster recovery planning to protect your critical business data.' },
  { icon: Headphones, title: 'Help Desk Support', desc: '24/7 technical support with fast response times and expert troubleshooting for all your IT needs.' },
];

export default function ServicesSection() {
  return (
    <section id="services" className="py-20 md:py-28">
      <div className="container">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Our Services</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Comprehensive IT solutions tailored to your business needs
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <div
              key={service.title}
              className="group rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/30"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20">
                <service.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">{service.title}</h3>
              <p className="text-muted-foreground">{service.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
