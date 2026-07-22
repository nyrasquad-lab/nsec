import { Shield, Eye, Bug, Zap, FileSearch, Network } from 'lucide-react';

const services = [
  { icon: Shield, title: 'SOC Monitoring', desc: '24/7 Security Operations Center with real-time threat detection and automated incident response across your entire environment.' },
  { icon: Eye, title: 'Threat Intelligence', desc: 'AI-driven threat hunting and intelligence gathering to anticipate and neutralize emerging cyber threats before they impact your business.' },
  { icon: Bug, title: 'Penetration Testing', desc: 'Elite offensive security assessments to identify and exploit vulnerabilities before adversaries do — cloud, network, and application.' },
  { icon: Zap, title: 'Incident Response', desc: 'Rapid forensics-led incident response with expert containment, eradication, and recovery to minimize dwell time and business impact.' },
  { icon: FileSearch, title: 'Compliance & Audit', desc: 'SOC 2, ISO 27001, HIPAA, NIST, and GDPR gap assessments, remediation guidance, and audit-ready documentation.' },
  { icon: Network, title: 'Network Security', desc: 'Zero-trust architecture design, firewall management, IDS/IPS, microsegmentation, and continuous network monitoring.' },
];

export default function ServicesSection() {
  return (
    <section id="services" className="bg-[#080f1d] py-24">
      <div className="container">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <p className="mb-3 font-mono text-xs uppercase tracking-widest text-cyan-500/60">What We Do</p>
          <h2 className="text-3xl font-bold text-white md:text-4xl">Comprehensive Security Services</h2>
          <p className="mt-4 text-base text-white/40">Tailored cybersecurity solutions backed by elite expertise and cutting-edge intelligence</p>
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <div key={s.title} className="group rounded-xl border border-white/5 bg-white/[0.03] p-6 backdrop-blur-sm transition-all hover:border-cyan-500/20 hover:bg-white/[0.05]">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg border border-cyan-500/20 bg-cyan-500/10">
                <s.icon className="h-5 w-5 text-cyan-400" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-white">{s.title}</h3>
              <p className="text-sm leading-relaxed text-white/40">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
