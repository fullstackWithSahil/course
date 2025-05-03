"use client";
import PricingCard from "./PricingCard";

export default function Pricing(){

  return (
    <section id="pricing" className="py-20 bg-blue-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-16">
          Choose the Plan That&apos;s Right for You
        </h2>
        
        {/* Pricing Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <PricingCard
            title="Basic"
            price="$50"
            features={[
              "1 course",
              "100 students",
              "50 Emails per day",
              "Basic analytics",
              "Custom domain",
            ]}
          />
          <PricingCard
            title="Premium"
            price="$100"
            features={[
              "5 courses",
              "100 students per course",
              "50000 Emails per month",
              "Advanced analytics",
              "Priority support",
              "Custom domain",
            ]}
            highlighted={true}
          />
          <PricingCard
            title="Pro"
            price="Contact Us"
            features={[
              "Unlimited courses",
              "Unlimited students",
              "Unlimited emails",
              "Full analytics suite",
              "24/7 support",
              "Multiple domains",
              "and more..."
            ]}
          />
        </div>
      </div>
    </section>
  );
}