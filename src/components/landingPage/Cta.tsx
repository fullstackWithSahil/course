export default function Cta() {
  return (
    <section className="py-20 bg-blue-600 text-white">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-6">
          Ready to Build and Sell Your Course?
        </h2>
        <p className="text-xl mb-8">
          Sign up today and start your free trial – no credit card required!
        </p>
        <div className="flex justify-center gap-4">
          <button className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg hover:bg-gray-100">
            Start for Free
          </button>
          <button className="border border-white px-8 py-4 rounded-lg text-lg hover:bg-blue-700">
            Explore Features
          </button>
        </div>
      </div>
    </section>
  );
}
