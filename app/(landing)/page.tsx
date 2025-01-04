import Hero from '@/components/landingPage/Hero';
import Features from '@/components/landingPage/Features';
import Benifits from '@/components/landingPage/Benifits';
import Pricing from '@/components/landingPage/Pricing';
import Faq from '@/components/landingPage/Faq';
import Testmonials from '@/components/landingPage/Testmonials';
import Cta from '@/components/landingPage/Cta';
import Footer from "@/components/landingPage/Footer";
import Navbar from "@/components/landingPage/Navbar";


const Website = () => {
  return (
    <main>
      <Hero/>
      <Features/>
      <Benifits/>
      <Testmonials/>
      <Pricing/>
      <Faq/>
      <Cta/>
    </main>
  );
};

export default Website;