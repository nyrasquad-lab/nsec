import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';

export default function SiteFooter() {
  return (
    <footer className="border-t bg-card">
      <div className="container py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <ShieldCheck className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold">IT Support Hub</span>
            </Link>
            <p className="mt-3 max-w-sm text-sm text-muted-foreground">
              Enterprise-grade IT services, cloud solutions, and cybersecurity for businesses of all sizes.
            </p>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-semibold">Services</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/#services" className="hover:text-foreground">Infrastructure</Link></li>
              <li><Link href="/#services" className="hover:text-foreground">Cloud Solutions</Link></li>
              <li><Link href="/#services" className="hover:text-foreground">Cybersecurity</Link></li>
              <li><Link href="/#services" className="hover:text-foreground">Help Desk</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-semibold">Company</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/#why-us" className="hover:text-foreground">About Us</Link></li>
              <li><Link href="/blog" className="hover:text-foreground">Blog</Link></li>
              <li><Link href="/support" className="hover:text-foreground">Support</Link></li>
              <li><Link href="/admin/login" className="hover:text-foreground">Admin Portal</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} IT Support Hub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
