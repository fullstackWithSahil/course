import Hero from '@/components/landingPage/Hero';
import Features from '@/components/landingPage/Features';
import Benifits from '@/components/landingPage/Benifits';
import Pricing from '@/components/landingPage/Pricing';
import Faq from '@/components/landingPage/Faq';
import Testmonials from '@/components/landingPage/Testmonials';
import Cta from '@/components/landingPage/Cta';


const Website = () => {
  return (
    <main>
      <Hero/>
      <section className="bg-primary text-white p-8">
        <h1 className="text-4xl md:text-5xl text-center my-8">
          Focus on Your Course, We Handle the Tech!
        </h1>
        <div className="flex flex-col md:flex-row items-center justify-center md:justify-around mx-4 md:mx-20 gap-10">
          <div className="text-center md:text-left">
            <h2 className="text-2xl md:text-3xl">Simplified Course Creation</h2>
            <p className="text-base md:text-lg">
              Build your dream course website without the technical hassle. We&apos;ve got you covered with a user-friendly platform that streamlines the entire process.
            </p>
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-2xl md:text-3xl">Focus on Your Content</h2>
            <p className="text-base md:text-lg">
              Leave the technical details to us. We design, host, and manage your course website, so you can concentrate on creating amazing content.
            </p>
          </div>
        </div>
      </section>
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