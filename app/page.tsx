import Hero from '@/components/sections/hero';
import ServicesSection from '@/components/sections/services';
import IndustriesSection from '@/components/sections/industries';
import AboutSection from '@/components/sections/about';
import ContactSection from '@/components/sections/contact';

export default function HomePage() {
  return (
    <>
      <Hero />
      <ServicesSection />
      <IndustriesSection />
      <AboutSection />
      <ContactSection />
    </>
  );
}
