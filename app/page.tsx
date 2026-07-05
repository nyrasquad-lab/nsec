'use client';

import dynamic from 'next/dynamic';
import SiteHeader from '@/components/site-header';
import Hero from '@/components/sections/hero';
import ServicesSection from '@/components/sections/services';
import WhyChooseUs from '@/components/sections/why-choose-us';
import SecurityDashboard from '@/components/sections/security-dashboard';
import Industries from '@/components/sections/industries';
import Blog from '@/components/sections/blog';
import Careers from '@/components/sections/careers';
import Contact from '@/components/sections/contact';
import SiteFooter from '@/components/site-footer';

// One continuous animated background covering the entire viewport,
// fixed behind the navbar and all sections so the site feels like one canvas.
const ParticleNetwork = dynamic(() => import('@/components/particle-network'), {
  ssr: false,
});

export default function Home() {
  return (
    <main className="relative min-h-screen">
      {/* continuous fixed background — from the very top, behind the navbar */}
      <ParticleNetwork
        className="fixed inset-0 z-0 h-screen w-screen"
        density={1}
        interactive
      />
      {/* grid overlay aligned to the same fixed background */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-grid opacity-30" />
      <div className="pointer-events-none fixed inset-0 z-0 bg-radial-fade" />

      <div className="relative z-10">
        <SiteHeader />
        <Hero />
        <ServicesSection />
        <WhyChooseUs />
        <SecurityDashboard />
        <Industries />
        <Blog />
        <Careers />
        <Contact />
        <SiteFooter />
      </div>
    </main>
  );
}
