'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/components/admin/auth-context';
import AdminSidebar from '@/components/admin/sidebar';
import { Loader2 } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { admin, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const isLoginRoute = pathname === '/admin/login';

  useEffect(() => {
    if (!loading && !admin && !isLoginRoute) {
      router.push('/admin/login');
    }
  }, [loading, admin, isLoginRoute, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isLoginRoute) {
    return <div className="min-h-screen">{children}</div>;
  }

  if (!admin) return null;

  return (
    <div className="min-h-screen bg-secondary/30">
      <AdminSidebar />
      <div className="md:ml-64">
        <div className="p-6 md:p-8">{children}</div>
      </div>
    </div>
  );
}
