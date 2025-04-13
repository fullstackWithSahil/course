import React from 'react';

interface TermsOfServiceProps {
  contactEmail?: string;
  jurisdiction?: string;
}

export default function Page({
  contactEmail = "fullstackwithsahil@gmail.com",
  jurisdiction = "[Your Jurisdiction]"
}:TermsOfServiceProps){
  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8">
      <div className="bg-gray-50 rounded-lg shadow-md p-6 md:p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6 pb-4 border-b-2 border-gray-200">
          Terms of Service
        </h1>
        
        <div className="text-center italic text-gray-600 mb-8">
          <strong>Effective Date:</strong> 11/04/2025
        </div>
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-blue-600 mb-3 pb-2 border-b border-gray-200">
            1. Introduction
          </h2>
          <p className="text-gray-700">
            Welcome to buisnesstoolsonline.com ("Company," "we," "our," "us"). These Terms of Service ("Terms") govern your use of our website and services. By accessing or using our platform, you agree to comply with these Terms. If you do not agree, you must not use our services.
          </p>
        </div>
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-blue-600 mb-3 pb-2 border-b border-gray-200">
            2. Eligibility
          </h2>
          <p className="text-gray-700">
            You must be at least 18 years old to use our services. By using our platform, you represent that you have the legal capacity to enter into this agreement.
          </p>
        </div>
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-blue-600 mb-3 pb-2 border-b border-gray-200">
            3. User Accounts
          </h2>
          <p className="text-gray-700 mb-2">
            (a) You may need to create an account to access certain features.
          </p>
          <p className="text-gray-700 mb-2">
            (b) You are responsible for maintaining the security of your account.
          </p>
          <p className="text-gray-700">
            (c) We reserve the right to suspend or terminate accounts that violate these Terms.
          </p>
        </div>
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-blue-600 mb-3 pb-2 border-b border-gray-200">
            4. Payments and Refunds
          </h2>
          <p className="text-gray-700 mb-2">
            (a) Payments are processed through <strong>Stripe and Razorpay</strong>.
          </p>
          <p className="text-gray-700 mb-2">
            (b) Subscription fees, billing cycles, and refund policies are outlined on our pricing page.
          </p>
          <p className="text-gray-700">
            (c) We reserve the right to modify pricing at any time with prior notice.
          </p>
        </div>
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-blue-600 mb-3 pb-2 border-b border-gray-200">
            5. Content Ownership and Responsibility
          </h2>
          <p className="text-gray-700 mb-2">
            (a) Users retain ownership of any content they upload.
          </p>
          <p className="text-gray-700 mb-2">
            (b) Users are solely responsible for ensuring their content complies with applicable laws and regulations.
          </p>
          <p className="text-gray-700 mb-2">
            (c) We do not monitor, review, or endorse user-generated content.
          </p>
          <p className="text-gray-700">
            (d) We reserve the right to remove content that violates these Terms.
          </p>
        </div>
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-blue-600 mb-3 pb-2 border-b border-gray-200">
            6. Acceptable Use
          </h2>
          <p className="text-gray-700 mb-2">Users must not:</p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Use our services for illegal, fraudulent, or harmful activities.</li>
            <li>Attempt to hack, disrupt, or interfere with our platform.</li>
            <li>Upload content that infringes on intellectual property rights or violates laws.</li>
            <li>Misuse our payment systems or authentication services.</li>
          </ul>
        </div>
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-blue-600 mb-3 pb-2 border-b border-gray-200">
            7. Limitation of Liability
          </h2>
          <p className="text-gray-700 mb-2">
            (a) We provide our services "as is" without warranties of any kind.
          </p>
          <p className="text-gray-700 mb-2">
            (b) We are not liable for any losses, damages, or disruptions caused by your use of our services.
          </p>
          <p className="text-gray-700">
            (c) Users assume full responsibility for their content and its legal implications.
          </p>
        </div>
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-blue-600 mb-3 pb-2 border-b border-gray-200">
            8. Suspension and Termination
          </h2>
          <p className="text-gray-700 mb-2">
            (a) We may suspend or terminate your access to our services if you violate these Terms.
          </p>
          <p className="text-gray-700">
            (b) Users may request account deletion by contacting us at {contactEmail}.
          </p>
        </div>
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-blue-600 mb-3 pb-2 border-b border-gray-200">
            9. Governing Law and Dispute Resolution
          </h2>
          <p className="text-gray-700 mb-2">
            (a) These Terms are governed by the laws of {jurisdiction}.
          </p>
          <p className="text-gray-700">
            (b) Disputes will be resolved through arbitration or legal proceedings in {jurisdiction}.
          </p>
        </div>
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-blue-600 mb-3 pb-2 border-b border-gray-200">
            10. Updates to These Terms
          </h2>
          <p className="text-gray-700">
            We may update these Terms periodically. Users will be notified of significant changes via email.
          </p>
        </div>
        
        <div className="mt-8 bg-blue-50 p-4 rounded-md">
          <h2 className="text-xl font-semibold text-blue-600 mb-3 pb-2 border-b border-gray-200">
            11. Contact Information
          </h2>
          <p className="text-gray-700">
            For questions about these Terms, contact us at {contactEmail}.
          </p>
        </div>
      </div>
    </div>
  );
};