'use client';

import { useEffect, useState } from 'react';
import { Activity, Shield, AlertTriangle, Lock, Globe } from 'lucide-react';

const liveEvents = [
  { icon: 'shield', color: 'text-cyan-400', text: 'Blocked anomalous login', time: '1m ago' },
  { icon: 'patch', color: 'text-cyan-400', text: 'Patch deployed · cluster-b', time: '2m ago' },
  { icon: 'warn', color: 'text-yellow-400', text: 'Isolated endpoint dev-019', time: '3m ago' },
];

export default function SocDashboard() {
  const [assets, setAssets] = useState(1284);
  const [threats, setThreats] = useState(7);
  const [uptime] = useState(99.99);
  const [score, setScore] = useState(94);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setAssets((p) => p + Math.floor(Math.random() * 3));
      setThreats(Math.floor(Math.random() * 12) + 3);
      setScore(90 + Math.floor(Math.random() * 8));
      setElapsed((p) => p + 2);
    }, 2000);
    return () => clearInterval(t);
  }, []);

  const mins = Math.floor(elapsed / 60).toString().padStart(2, '0');
  const secs = (elapsed % 60).toString().padStart(2, '0');

  const circumference = 2 * Math.PI * 54;
  const dashOffset = circumference - (score / 100) * circumference;

  return (
    <div className="w-full max-w-[500px] overflow-hidden rounded-2xl" style={{ background: 'linear-gradient(145deg, #0d1f35 0%, #0a1628 100%)', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 24px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,212,255,0.06)' }}>
      <div className="flex items-center justify-between border-b border-white/5 px-4 py-3">
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <div className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
          <div className="h-3 w-3 rounded-full bg-[#28c840]" />
        </div>
        <div className="flex items-center gap-1.5">
          <Globe className="h-3.5 w-3.5 text-cyan-400/70" />
          <span className="font-mono text-xs text-white/50">nsec-soc</span>
          <span className="font-mono text-xs text-white/30">·</span>
          <span className="font-mono text-xs text-cyan-400">live</span>
          <span className="relative ml-1 flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-cyan-400" />
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-px bg-white/5 border-b border-white/5">
        <div className="bg-[#0a1628] p-5">
          <div className="relative flex flex-col items-center justify-center">
            <svg className="h-28 w-28" viewBox="0 0 128 128">
              <circle cx="64" cy="64" r="54" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
              <circle cx="64" cy="64" r="54" fill="none" stroke="url(#cyanGrad)" strokeWidth="10" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={dashOffset} transform="rotate(-90 64 64)" style={{ transition: 'stroke-dashoffset 1s ease' }} />
              <defs><linearGradient id="cyanGrad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#06b6d4" /><stop offset="100%" stopColor="#22d3ee" /></linearGradient></defs>
            </svg>
            <div className="absolute flex flex-col items-center">
              <div className="flex items-center gap-1">
                <Shield className="h-3 w-3 text-cyan-400" />
                <span className="text-[11px] font-medium text-cyan-400">Zero breaches</span>
              </div>
            </div>
          </div>
          <div className="mt-2 text-center"><p className="font-mono text-[10px] uppercase tracking-widest text-white/30">Security Score</p></div>
        </div>

        <div className="bg-[#0a1628] p-5">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-widest text-white/30">Threat Level</span>
            <div className="flex items-center gap-1">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-400" />
              </span>
              <span className="font-mono text-xs font-medium text-green-400">Low</span>
            </div>
          </div>
          <div className="mt-4 flex items-end justify-between">
            <span className="font-mono text-2xl font-light text-white/70">{mins}:{secs}</span>
            <span className="font-mono text-xs text-white/30">now</span>
          </div>
          <div className="mt-4 space-y-1.5">
            {[75, 45, 85].map((w, i) => (
              <div key={i} className="h-1 rounded-full bg-white/5">
                <div className="h-1 rounded-full bg-cyan-500/40" style={{ width: `${w}%`, transition: 'width 1s ease' }} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-px bg-white/5 border-b border-white/5">
        {[
          { icon: Lock, value: assets.toLocaleString(), label: 'Protected Assets', color: 'text-cyan-400' },
          { icon: AlertTriangle, value: threats.toString(), label: 'Detected Threats', color: 'text-cyan-400' },
          { icon: Activity, value: 'Stable', label: 'Incident Status', color: 'text-white' },
        ].map((stat) => (
          <div key={stat.label} className="bg-[#0a1628] p-4">
            <stat.icon className={`h-5 w-5 mb-3 ${stat.color}`} />
            <div className={`font-mono text-xl font-bold ${stat.color}`}>{stat.value}</div>
            <div className="mt-1 font-mono text-[9px] uppercase tracking-widest text-white/30">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="p-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase tracking-widest text-white/30">Live Activity</span>
          <div className="flex items-center gap-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-1">
            <Activity className="h-3 w-3 text-cyan-400" />
            <span className="font-mono text-[10px] text-cyan-400">{uptime}% uptime</span>
          </div>
        </div>
        <div className="space-y-2.5">
          {liveEvents.map((ev, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {ev.icon === 'shield' && <Shield className={`h-3.5 w-3.5 ${ev.color}`} />}
                {ev.icon === 'patch' && (
                  <svg className={`h-3.5 w-3.5 ${ev.color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
                    <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
                  </svg>
                )}
                {ev.icon === 'warn' && (
                  <svg className={`h-3.5 w-3.5 ${ev.color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                  </svg>
                )}
                <span className="text-xs text-white/60">{ev.text}</span>
              </div>
              <span className="font-mono text-[10px] text-white/25">{ev.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
