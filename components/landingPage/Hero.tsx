import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="bg-gradient-to-b from-white to-blue-50 py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div>
            <h1 className="text-5xl font-extrabold text-gray-800 mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
                Create and Sell Your Courses
              </span>
              <br />
              with Ease
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              Custom domains, beautiful landing pages, and secure video streaming – all tailored for your success.
            </p>
            <div className="flex gap-4">
              <button className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg hover:bg-blue-700 transition flex items-center gap-2">
                Get Started Free <ArrowRight size={20} />
              </button>
              <button className="border border-gray-300 px-8 py-4 rounded-lg text-lg hover:bg-gray-100 transition">
                Watch Demo
              </button>
            </div>
          </div>

          {/* Image/Visual Content */}
          <div className="relative">
            <div className="bg-white p-6 rounded-xl shadow-xl">
              <img
                src="/path/to/your-image.jpg"
                alt="Preview of the platform"
                className="rounded-lg object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
