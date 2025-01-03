import { Star } from "lucide-react";
import React from "react";

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-20 bg-blue-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Heading */}
        <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-12">
          Hear from Successful Creators
        </h2>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <TestimonialCard
            name="Sarah Johnson"
            role="Digital Marketing Expert"
            content="This platform transformed how I deliver my courses. The features are exactly what I needed."
          />
          <TestimonialCard
            name="Mark Chen"
            role="Programming Instructor"
            content="The video hosting and analytics help me understand my students better. Highly recommended!"
          />
          <TestimonialCard
            name="Emily Rodriguez"
            role="Fitness Coach"
            content="Setting up my course was incredibly easy. I love how professional everything looks."
          />
        </div>
      </div>
    </section>
  );
}

// Testimonial Card Component
const TestimonialCard = ({
  name,
  role,
  content,
}: {
  name: string;
  role: string;
  content: string;
}) => (
  <div className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
    {/* Rating Stars */}
    <div className="flex items-center mb-4">
      {[...Array(5)].map((_, i) => (
        <Star key={i} size={20} fill="currentColor" className="text-yellow-400" />
      ))}
    </div>

    {/* Testimonial Content */}
    <p className="text-gray-600 italic mb-6">"{content}"</p>

    {/* User Info */}
    <div className="border-t pt-4">
      <div className="font-semibold text-gray-800">{name}</div>
      <div className="text-gray-500 text-sm">{role}</div>
    </div>
  </div>
);