import React from "react";

export default function Benefits() {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Heading */}
        <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-12">
          Why Choose Us?
        </h2>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <BenefitCard
            title="Save Time"
            description="Intuitive tools that streamline your workflow."
          />
          <BenefitCard
            title="Boost Sales"
            description="Powerful marketing features to grow your audience."
          />
          <BenefitCard
            title="Secure & Scalable"
            description="Enterprise-grade hosting that grows with you."
          />
          <BenefitCard
            title="Affordable Plans"
            description="Flexible pricing for creators of all sizes."
          />
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <p className="text-lg font-medium text-gray-700">
            Trusted by <span className="text-blue-600 font-bold">10,000+</span>{" "}
            Course Creators Worldwide
          </p>
        </div>
      </div>
    </section>
  );
}

// Benefit Card Component
const BenefitCard = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => (
  <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow text-center">
    <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);
