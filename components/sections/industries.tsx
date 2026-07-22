import { Building2, Heart, CreditCard, Factory, Globe, ShoppingCart } from 'lucide-react';

const industries = [
  { icon: Building2, title: 'Financial Services', desc: 'Regulatory compliance, fraud detection, and data protection for banks and investment firms.' },
  { icon: Heart, title: 'Healthcare', desc: 'HIPAA-compliant security for patient data, medical devices, and clinical networks.' },
  { icon: CreditCard, title: 'FinTech', desc: 'Payment security, PCI DSS compliance, and anti-fraud for modern financial platforms.' },
  { icon: Factory, title: 'Manufacturing', desc: 'OT/ICS security, industrial IoT protection, and supply chain risk management.' },
  { icon: Globe, title: 'Government', desc: 'FedRAMP-aligned security for federal, state, and local government agencies.' },
  { icon: ShoppingCart, title: 'E-Commerce', desc: 'Customer data protection, PCI DSS, and DDoS mitigation for online retail.' },
];

export default function IndustriesSection() {
  return (
    <section id="industries" className="bg-[#060d1a] py-24">
      <div className="container">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <p className="mb-3 font-mono text-xs uppercase tracking-widest text-cyan-500/60">Who We Protect</p>
          <h2 className="text-3xl font-bold text-white md:text-4xl">Industries We Serve</h2>
          <p className="mt-4 text-base text-white/40">
            Deep domain expertise across critical sectors
          </p>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {industries.map((ind) => (
            <div key={ind.title} className="rounded-xl border border-white/5 bg-white/[0.03] p-6 transition-all hover:border-cyan-500/20">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg border border-cyan-500/20 bg-cyan-500/10">
                <ind.icon className="h-5 w-5 text-cyan-400" />
              </div>
              <h3 className="mb-2 font-semibold text-white">{ind.title}</h3>
              <p className="text-sm leading-relaxed text-white/40">{ind.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
