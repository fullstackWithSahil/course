import Image from "next/image";
import hero from "@/assets/headerImage.png";

export default function Hero() {
  return (
    <section className="w-full relative mt-1 aspect-video text-white">
      <Image
        src={hero}
        alt="heroImage"
        className="z-0 absolute inset-0 aspect-video object-cover w-full"
      />
      <div className="w-full h-full z-10 absolute inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center">
        <div className="md:-translate-y-[200px]">
          <h1 className="text-2xl md:text-5xl text-center font-bold">Focus on Your Course, We Handle the Tech!</h1>
          <p className="text-center text-sm md:text-xl">Launch Your Course Website With Ease. Get Started Now!</p>
        </div>
      </div>
    </section>
  );
}
