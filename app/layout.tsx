import './globals.css';
import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://nsecintelligence.com'),
  title: {
    default: 'NSEC Intelligence Group — Protecting Organizations Against Modern Cyber Threats',
    template: '%s | NSEC Intelligence Group',
  },
  description:
    'NSEC Intelligence Group delivers elite cybersecurity services — penetration testing, red & blue teams, threat intelligence, digital forensics, cloud security, incident response and compliance for enterprise organizations.',
  keywords: [
    'cybersecurity',
    'penetration testing',
    'red team',
    'blue team',
    'threat intelligence',
    'digital forensics',
    'cloud security',
    'incident response',
    'compliance',
    'NSEC Intelligence Group',
  ],
  authors: [{ name: 'NSEC Intelligence Group' }],
  openGraph: {
    title: 'NSEC Intelligence Group',
    description:
      'Protecting Organizations Against Modern Cyber Threats. Elite, enterprise-grade cybersecurity services.',
    type: 'website',
    locale: 'en_US',
    siteName: 'NSEC Intelligence Group',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NSEC Intelligence Group',
    description:
      'Protecting Organizations Against Modern Cyber Threats. Elite, enterprise-grade cybersecurity services.',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body>{children}</body>
    </html>
  );
}
