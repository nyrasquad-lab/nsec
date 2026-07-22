'use client';

import { useEffect, useState } from 'react';
import { Globe, Shield, Activity, AlertTriangle, Lock, Zap, TrendingUp, Server } from 'lucide-react';

const stats = [
  { icon: Shield, label: 'Threats Blocked', value: 8472913, format: 'M', color: 'text-cyan-400' },
  { icon: AlertTriangle, label: 'Active Incidents', value: 3, format: 'int', color: 'text-orange-400' },
  { icon: Lock, label: 'Protected Assets', value: 1284, format: 'int', color: 'text-cyan-400' },
  { icon: Activity, label: 'Uptime SLA', value: 99.99, format: 'pct', color: 'text-green-400' },
  { icon: Server, label: 'Nodes Monitored', value: 482, format: 'int', color: 'text-cyan-400' },
  { icon: Zap, label: 'Mean Response', value: 4.2, format: 'min', color: 'text-white' },
];

export default function GlobalPostureSection() {
  const [chartData, setChartData] = useState<number[]>(Array.from({ length: 24 }, () => 40 + Math.random() * 50));
  const [threatScore, setThreatScore] = useState(72);

  useEffect(() => {
    const t = setInterval(() => {
      setChartData((prev) => [...prev.slice(1), 40 + Math.random() * 50]);
      setThreatScore(65 + Math.floor(Math.random() * 20));
    }, 2000);
    return () => clearInterval(t);
  }, []);

  const maxVal = Math.max(...chartData);
  const circumference = 2 * Math.PI * 52;
  const dashOffset = circumference - (threatScore / 100) * circumference;

  function formatValue(val: number, format: string) {
    if (format === 'M') return `${(val / 1000000).toFixed(2)}M`;
    if (format === 'pct') return `${val.toFixed(2)}%`;
    if (format === 'min') return `${val}min`;
    return val.toLocaleString();
  }

  return (
    <section className="relative overflow-hidden bg-[#060d1a] py-24">
      <div className="pointer-events-none absolute right-0 top-1/2 h-[500px] w-[500px] translate-x-1/3 -translate-y-1/2 rounded-full bg-cyan-500/5 blur-3xl" />
      <div className="container relative z-10">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <div className="mb-4 inline-flex items-center gap-2">
            <span className="font-mono text-xs text-cyan-500/60">[</span>
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
            </span>
            <span className="text-sm font-medium text-white/80">SOC Live · Global Posture</span>
            <span className="font-mono text-xs text-cyan-500/60">]</span>
          </div>
          <h2 className="text-3xl font-bold text-white md:text-4xl">NSEC SOC Global Posture</h2>
          <p className="mt-4 text-base text-white/40">Real-time visibility across all monitored environments worldwide</p>
        </div>

        <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl" style={{ background: 'linear-gradient(145deg, #0d1f35 0%, #0a1628 100%)', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 24px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,212,255,0.06)' }}>
          <div className="flex items-center justify-between border-b border-white/5 px-4 py-3">
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-full bg-[#ff5f57]" />
              <div className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
              <div className="h-3 w-3 rounded-full bg-[#28c840]" />
            </div>
            <div className="flex items-center gap-1.5">
              <Globe className="h-3.5 w-3.5 text-cyan-400/70" />
              <span className="font-mono text-xs text-white/50">nsec-soc-global</span>
              <span className="font-mono text-xs text-white/30">·</span>
              <span className="font-mono text-xs text-cyan-400">live</span>
              <span className="relative ml-1 flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-cyan-400" />
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-px bg-white/5 sm:grid-cols-3 lg:grid-cols-6">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-[#0a1628] p-4">
                <stat.icon className={`mb-3 h-5 w-5 ${stat.color}`} />
                <div className={`font-mono text-xl font-bold ${stat.color}`}>{formatValue(stat.value, stat.format)}</div>
                <div className="mt-1 font-mono text-[9px] uppercase tracking-widest text-white/30">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-px bg-white/5 lg:grid-cols-3">
            <div className="bg-[#0a1628] p-5 lg:col-span-2">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-cyan-400" />
                  <span className="font-mono text-xs uppercase tracking-widest text-white/30">Threat Activity · 24h</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-cyan-400" /><span className="font-mono text-[10px] text-white/40">blocked</span></div>
                  <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-orange-400" /><span className="font-mono text-[10px] text-white/40">flagged</span></div>
                </div>
              </div>
              <svg viewBox="0 0 500 160" className="w-full" preserveAspectRatio="none" style={{ height: 160 }}>
                <defs><linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="rgba(0,212,255,0.3)" /><stop offset="100%" stopColor="rgba(0,212,255,0)" /></linearGradient></defs>
                {[0, 40, 80, 120].map((y) => (<line key={y} x1="0" y1={y} x2="500" y2={y} stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />))}
                <path d={`M 0 ${160 - (chartData[0] / maxVal) * 130} ${chartData.map((v, i) => `L ${(i / (chartData.length - 1)) * 500} ${160 - (v / maxVal) * 130}`).join(' ')} L 500 160 L 0 160 Z`} fill="url(#areaGrad)" />
                <path d={`M 0 ${160 - (chartData[0] / maxVal) * 130} ${chartData.map((v, i) => `L ${(i / (chartData.length - 1)) * 500} ${160 - (v / maxVal) * 130}`).join(' ')}`} fill="none" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 4px rgba(0,212,255,0.4))' }} />
                {chartData.map((v, i) => (<circle key={i} cx={(i / (chartData.length - 1)) * 500} cy={160 - (v / maxVal) * 130} r={i === chartData.length - 1 ? 3 : 1.5} fill={i === chartData.length - 1 ? '#22d3ee' : 'rgba(0,212,255,0.4)'} />))}
              </svg>
              <div className="mt-2 flex justify-between font-mono text-[10px] text-white/20"><span>24h ago</span><span>12h ago</span><span>now</span></div>
            </div>

            <div className="bg-[#0a1628] p-5">
              <div className="mb-3 flex items-center justify-between">
                <span className="font-mono text-xs uppercase tracking-widest text-white/30">Risk Score</span>
                <span className="font-mono text-[10px] text-green-400">Low</span>
              </div>
              <div className="relative flex flex-col items-center justify-center py-2">
                <svg className="h-32 w-32" viewBox="0 0 128 128">
                  <circle cx="64" cy="64" r="52" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
                  <circle cx="64" cy="64" r="52" fill="none" stroke="url(#riskGrad)" strokeWidth="10" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={dashOffset} transform="rotate(-90 64 64)" style={{ transition: 'stroke-dashoffset 1s ease' }} />
                  <defs><linearGradient id="riskGrad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#06b6d4" /><stop offset="100%" stopColor="#22d3ee" /></linearGradient></defs>
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="font-mono text-3xl font-bold text-white">{threatScore}</span>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-white/30">score</span>
                </div>
              </div>
              <div className="mt-3 space-y-1.5">
                {[['Critical', '1', 'text-red-400'], ['High', '2', 'text-orange-400'], ['Medium', '4', 'text-yellow-400'], ['Low', '12', 'text-cyan-400']].map(([label, val, color]) => (
                  <div key={label} className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-white/30">{label}</span>
                    <span className={`font-mono text-[10px] ${color}`}>{val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-white/5 px-5 py-3">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5"><Lock className="h-3 w-3 text-green-400" /><span className="font-mono text-[10px] text-green-400">Encrypted</span></div>
              <div className="flex items-center gap-1.5"><Server className="h-3 w-3 text-cyan-400" /><span className="font-mono text-[10px] text-cyan-400">24/7 SOC</span></div>
              <div className="flex items-center gap-1.5"><Activity className="h-3 w-3 text-green-400" /><span className="font-mono text-[10px] text-green-400">All systems operational</span></div>
            </div>
            <span className="font-mono text-[10px] text-white/20">Updated {new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
