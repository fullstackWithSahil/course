"use client";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import faqImage from '@/assets/FAQ.png';


export default function Faq() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  return (
    <section className="py-20 bg-white md:grid md:grid-cols-3">
      <Image src={faqImage} alt="Faq"/>
      <div className="max-w-3xl mx-auto px-4 col-span-2">
        <h2 className="text-3xl font-bold text-center mb-16">
          Got Questions? We&apos;ve Got Answers
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <FaqItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              isActive={activeFaq === index}
              onClick={() => setActiveFaq(activeFaq === index ? null : index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

const FaqItem = ({
  question,
  answer,
  isActive,
  onClick,
}: {
  question: string;
  answer: string;
  isActive: boolean;
  onClick: () => void;
}) => (
  <div className="border rounded-lg overflow-hidden md:w-[700px]">
    <button
      className="w-full text-left p-4 font-semibold flex justify-between items-center hover:bg-gray-50 transition"
      onClick={onClick}
    >
      {question}
      <ChevronDown
        className={`transform transition-transform ${
          isActive ? "rotate-180" : ""
        }`}
      />
    </button>
    {isActive && (
      <div className="p-4 border-t bg-gray-50">
        <p className="text-gray-600">{answer}</p>
      </div>
    )}
  </div>
);

const faqs = [
  {
    question: "How do I get started?",
    answer:
      "Sign up for a free trial, choose your domain name, and start building your course using our intuitive drag-and-drop builder. No credit card required.",
  },
  {
    question: "What payment methods do you support?",
    answer:
      "We support major credit cards, PayPal, and various local payment methods through Stripe integration.",
  },
  {
    question: "Is my content secure?",
    answer:
      "Yes, we use enterprise-grade encryption and secure video streaming to protect your content from unauthorized access.",
  },
  {
    question: "Can I migrate from another platform?",
    answer:
      "Yes, we offer migration assistance to help you transfer your courses and student data from other platforms.",
  },
  {
    question: "What's included in the free plan?",
    answer:
      "The free plan includes 1 course, 5GB storage, basic analytics, and email support to help you get started.",
  },
];
