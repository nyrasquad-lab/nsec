import Link from 'next/link';

export default function SiteFooter() {
  return (
    <footer className="border-t border-white/5 bg-[#060d1a]">
      <div className="container py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-cyan-500/40 bg-cyan-500/10">
                <svg className="h-5 w-5 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L3 7v6c0 5 4 9.4 9 10.9 5-1.5 9-5.9 9-10.9V7L12 2z" />
                </svg>
              </div>
              <span className="text-base font-bold">
                <span className="text-white">NSEC </span>
                <span className="text-white/50 font-normal">Intelligence</span>
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/35">
              Elite cybersecurity intelligence and defense operations protecting organizations against modern threats, 24/7.
            </p>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold text-white/60">Services</h3>
            <ul className="space-y-2 text-sm text-white/35">
              {['SOC Monitoring', 'Threat Intelligence', 'Penetration Testing', 'Incident Response'].map((s) => (
                <li key={s}><Link href="/#services" className="hover:text-white/60 transition-colors">{s}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold text-white/60">Company</h3>
            <ul className="space-y-2 text-sm text-white/35">
              {[['About', '/#about'], ['Industries', '/#industries'], ['Research', '/#research'], ['Contact', '/#contact']].map(([label, href]) => (
                <li key={label}><Link href={href} className="hover:text-white/60 transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-white/5 pt-8 text-center text-sm text-white/20">
          <p>&copy; {new Date().getFullYear()} NSEC Intelligence Group. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
