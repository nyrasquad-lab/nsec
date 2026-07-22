import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'

const inter = Inter({ subsets: ['latin'], display: 'swap' })

export const metadata: Metadata = {
  title: 'IT Support Hub — Reliable Tech Help',
  description: 'Submit and track IT support tickets. Fast, reliable troubleshooting for hardware, software, network, and account issues.',
  keywords: ['IT support', 'help desk', 'troubleshooting', 'ticket system', 'tech support'],
  openGraph: {
    title: 'IT Support Hub',
    description: 'Submit and track IT support tickets.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
