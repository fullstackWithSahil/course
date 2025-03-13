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
      <div className="w-full h-full bg-black z-10 absolute inset-0 bg-opacity-50 flex items-center justify-center">
        <div className="-translate-y-[200px]">
          <h1 className="text-5xl text-center font-bold">Focus on Your Course, We Handle the Tech!</h1>
          <p className="text-center text-xl">Launch Your Course Website With Ease. Get Started Now!</p>
        </div>
      </div>
    </section>
  );
}
