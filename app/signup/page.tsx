'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, ShieldCheck, Lock, Mail, User } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) router.replace('/admin');
    })();
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else if (data.session) {
      router.replace('/admin');
    } else {
      router.replace('/login?signedup=1');
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#080f1d] px-4">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/5 blur-3xl" />

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-cyan-500/40 bg-cyan-500/10">
              <svg className="h-5 w-5 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L3 7v6c0 5 4 9.4 9 10.9 5-1.5 9-5.9 9-10.9V7L12 2z" /></svg>
            </div>
            <span className="text-lg font-bold"><span className="text-white">NSEC </span><span className="text-white/60 font-normal">Intelligence</span></span>
          </Link>
        </div>

        <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-8 backdrop-blur-sm">
          <div className="mb-6 flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-cyan-400" />
            <h1 className="text-xl font-bold text-white">Create Admin Account</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/70">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" className="flex h-10 w-full rounded-md border border-white/10 bg-white/5 pl-10 pr-3 py-2 text-sm text-white placeholder:text-white/20 focus:border-cyan-500/40 focus:outline-none focus:ring-2 focus:ring-cyan-500/20" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/70">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@nsecintelligence.com" className="flex h-10 w-full rounded-md border border-white/10 bg-white/5 pl-10 pr-3 py-2 text-sm text-white placeholder:text-white/20 focus:border-cyan-500/40 focus:outline-none focus:ring-2 focus:ring-cyan-500/20" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/70">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min 6 characters" className="flex h-10 w-full rounded-md border border-white/10 bg-white/5 pl-10 pr-3 py-2 text-sm text-white placeholder:text-white/20 focus:border-cyan-500/40 focus:outline-none focus:ring-2 focus:ring-cyan-500/20" />
              </div>
            </div>

            {error && <p className="text-sm text-red-400">{error}</p>}

            <button type="submit" disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-lg bg-cyan-500 px-6 py-3 text-sm font-semibold text-[#080f1d] transition-all hover:bg-cyan-400 disabled:opacity-50">
              {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Creating account...</> : 'Sign Up'}
            </button>
          </form>

          <div className="mt-6 border-t border-white/5 pt-4 text-center">
            <p className="text-sm text-white/40">
              Already have an account?{' '}
              <Link href="/login" className="font-medium text-cyan-400 hover:text-cyan-300">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
