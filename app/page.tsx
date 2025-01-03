"use client"
import Navbar from '@/components/landingPage/Navbar';
import Hero from '@/components/landingPage/Hero';
import Features from '@/components/landingPage/Features';
import Benifits from '@/components/landingPage/Benifits';
import Footer from '@/components/landingPage/Footer';
import Pricing from '@/components/landingPage/Pricing';
import Faq from '@/components/landingPage/Faq';
import Testmonials from '@/components/landingPage/Testmonials';
import Cta from '@/components/landingPage/Cta';

const Website = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar/>
      <Hero/>
      <Features/>
      <Benifits/>
      <Testmonials/>
      <Pricing/>
      <Faq/>
      <Cta/>
      <Footer/>
    </div>
  );
};

export default Website;