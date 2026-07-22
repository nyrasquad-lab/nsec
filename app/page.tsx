import Hero from '@/components/sections/hero';
import ServicesSection from '@/components/sections/services';
import WhyChooseUs from '@/components/sections/why-choose-us';
import ProcessSection from '@/components/sections/process';
import ContactSection from '@/components/sections/contact';

export default function HomePage() {
  return (
    <>
      <Hero />
      <ServicesSection />
      <WhyChooseUs />
      <ProcessSection />
      <ContactSection />
    </>
  );
}
