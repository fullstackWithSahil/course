import { Check } from "lucide-react";
import React from "react";

export default function Pricing() {
  return (
    <section id="pricing" className="py-20 bg-blue-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-16">
          Choose the Plan That's Right for You
        </h2>

        {/* Pricing Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <PricingCard
            title="Free"
            price="$0"
            features={[
              "1 course",
              "5GB storage",
              "Basic analytics",
              "Email support",
            ]}
          />
          <PricingCard
            title="Premium"
            price="$49"
            features={[
              "10 courses",
              "50GB storage",
              "Advanced analytics",
              "Priority support",
              "Custom domain",
            ]}
            highlighted={true}
          />
          <PricingCard
            title="Pro"
            price="$99"
            features={[
              "Unlimited courses",
              "200GB storage",
              "Full analytics suite",
              "24/7 support",
              "Multiple domains",
            ]}
          />
        </div>
      </div>
    </section>
  );
}

const PricingCard = ({
  title,
  price,
  features,
  highlighted = false,
}: {
  title: string;
  price: string;
  features: string[];
  highlighted?: boolean;
}) => (
  <div
    className={`p-8 rounded-xl shadow-lg transition-transform transform hover:scale-105 ${
      highlighted ? "bg-blue-600 text-white ring-4 ring-blue-200" : "bg-white"
    }`}
  >
    {/* Card Title and Price */}
    <h3 className="text-2xl font-bold mb-2">{title}</h3>
    <p className="text-4xl font-extrabold mb-6">
      {price}
      <span className="text-lg font-normal">/month</span>
    </p>

    {/* Features List */}
    <ul className="space-y-4 mb-8">
      {features.map((feature, index) => (
        <li key={index} className="flex items-center gap-3">
          <Check size={24} className="text-green-500" />
          <span className="text-lg">{feature}</span>
        </li>
      ))}
    </ul>

    {/* Action Button */}
    <button
      className={`w-full py-3 rounded-lg font-semibold text-lg transition ${
        highlighted
          ? "bg-white text-blue-600 hover:bg-gray-100"
          : "bg-blue-600 text-white hover:bg-blue-700"
      }`}
    >
      Get Started
    </button>
  </div>
);
