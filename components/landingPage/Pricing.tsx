"use client";
import PricingCard from "./PricingCard";

// Define types for the subscription plans
type PlanType = "Basic" | "Premium" | "Pro";

export default function Pricing(){
  // Subscription links from Razorpay dashboard
  const subscriptionLinks: Record<PlanType, string> = {
    Basic: "https://rzp.io/rzp/5vmfOueL", // Replace with your actual links
    Premium: "https://rzp.io/rzp/KiLqmFz",
    Pro: "https://rzp.io/l/your-pro-plan-link" // Or "contact" if you want to redirect to contact page
  };

  // Handle redirect to Razorpay subscription link
  const handleSubscription = (plan: PlanType): void => {
    // For Pro plan, you might want to redirect to a contact form instead
    if (plan === "Pro" && subscriptionLinks[plan] === "contact") {
      window.location.href = "/contact"; // Replace with your contact page URL
    } else {
      window.location.href = subscriptionLinks[plan];
    }
  };

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
            onGetStarted={() => handleSubscription("Basic")}
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
            onGetStarted={() => handleSubscription("Premium")}
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
            onGetStarted={() => handleSubscription("Pro")}
          />
        </div>
      </div>
    </section>
  );
}