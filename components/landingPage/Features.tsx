import React from "react";
import {
  Globe,
  Video,
  CreditCard,
  BarChart3,
  Users,
} from "lucide-react";

export default function Features() {
  return (
    <section id="features" className="py-20 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Heading */}
        <h2 className="text-4xl font-extrabold text-gray-800 text-center mb-16">
          Everything You Need to Launch and Sell Your Course
        </h2>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Globe size={24} />}
            title="Custom Domains"
            description="Get your own branded domain for a professional look."
          />
          <FeatureCard
            icon={<Video size={24} />}
            title="Secure Video Streaming"
            description="Host and stream your content with enterprise-grade security."
          />
          <FeatureCard
            icon={<CreditCard size={24} />}
            title="Payment Integration"
            description="Accept payments globally with multiple gateways."
          />
          <FeatureCard
            icon={<BarChart3 size={24} />}
            title="Detailed Analytics"
            description="Track performance and student engagement."
          />
          <FeatureCard
            icon={<Users size={24} />}
            title="Student Management"
            description="Manage enrollments and student progress easily."
          />
        </div>
      </div>
    </section>
  );
}

// Feature Card Component
const FeatureCard = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => (
  <div className="p-6 bg-white rounded-xl border border-gray-200 hover:shadow-xl hover:border-blue-300 transition-all">
    <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);
