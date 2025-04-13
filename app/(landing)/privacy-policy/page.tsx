import React from 'react';

interface PrivacyPolicyProps {
  effectiveDate?: string;
  contactEmail?: string;
}

const Page: React.FC<PrivacyPolicyProps> = ({
  effectiveDate = "April 15, 2025",
  contactEmail = "fullstackwithsahil@gmail.com"
}) => {
  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8">
      <div className="bg-gray-50 rounded-lg shadow-md p-6 md:p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6 pb-4 border-b-2 border-gray-200">
          Privacy Policy
        </h1>
        
        <div className="text-center italic text-gray-600 mb-8">
          <strong>Effective Date:</strong> {effectiveDate}
        </div>
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-blue-600 mb-3 pb-2 border-b border-gray-200">
            1. Introduction
          </h2>
          <p className="text-gray-700 mb-3">
            Welcome to businesstools. We respect your privacy and are committed to protecting it through this Privacy Policy. This policy explains how we collect, use, and protect your personal information when you use our services.
          </p>
          <p className="text-gray-700">
            By using our platform, you agree to the terms of this Privacy Policy.
          </p>
        </div>
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-blue-600 mb-3 pb-2 border-b border-gray-200">
            2. Information We Collect
          </h2>
          <p className="text-gray-700 mb-3">
            We collect the following types of information:
          </p>
          <p className="text-gray-700 mb-3">
            <strong>(a) Personal Information:</strong> When you create an account, process payments, or contact us, we may collect your name, email, phone number, and payment details.
          </p>
          <p className="text-gray-700 mb-3">
            <strong>(b) Technical Information:</strong> We collect IP addresses for rate limiting and security purposes. Additionally, cookies and similar tracking technologies are used for analytics and website functionality.
          </p>
          <p className="text-gray-700">
            <strong>(c) User-Generated Content:</strong> Any content uploaded by users remains the property of the user. However, users are responsible for ensuring their content complies with all applicable laws. The user will be responsible for all the legal implications of their content.
          </p>
        </div>
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-blue-600 mb-3 pb-2 border-b border-gray-200">
            3. How We Use Your Information
          </h2>
          <p className="text-gray-700 mb-3">
            We use your information to:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Provide and maintain our services.</li>
            <li>Authenticate users (via Stripe).</li>
            <li>Process payments (via Stripe and Razorpay).</li>
            <li>Send emails, notifications, and updates (via Resend).</li>
            <li>Improve security through rate limiting based on IP addresses.</li>
            <li>Analyze user behavior using cookies to enhance user experience.</li>
            <li>Communicate updates via email.</li>
          </ul>
        </div>
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-blue-600 mb-3 pb-2 border-b border-gray-200">
            4. Data Sharing and Third-Party Services
          </h2>
          <p className="text-gray-700 mb-3">
            We do not sell or rent your data. However, we may share data with:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li><strong>Stripe & Razorpay</strong> (for payment processing).</li>
            <li><strong>Stripe</strong> (for authentication).</li>
            <li><strong>Resend</strong> (for email communication).</li>
            <li><strong>Analytics providers</strong> (using cookies for usage tracking).</li>
            <li><strong>Hosting services</strong> (Vercel for frontend, Hetzner for VPS backend).</li>
          </ul>
          <p className="text-gray-700 mt-3">
            These third-party services have their own privacy policies, and we encourage you to review them.
          </p>
        </div>
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-blue-600 mb-3 pb-2 border-b border-gray-200">
            5. Cookies and Tracking
          </h2>
          <p className="text-gray-700">
            We use cookies for analytics and improving user experience. You can manage or disable cookies through your browser settings.
          </p>
        </div>
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-blue-600 mb-3 pb-2 border-b border-gray-200">
            6. Data Security
          </h2>
          <p className="text-gray-700">
            We implement industry-standard security measures to protect your data, including encryption, access controls, and monitoring. However, no method of transmission over the internet is completely secure.
          </p>
        </div>
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-blue-600 mb-3 pb-2 border-b border-gray-200">
            7. User Rights
          </h2>
          <p className="text-gray-700 mb-3">
            Depending on your jurisdiction, you may have rights regarding your personal data, such as:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Accessing, updating, or deleting your information.</li>
            <li>Opting out of certain data processing activities.</li>
            <li>Withdrawing consent where applicable.</li>
          </ul>
          <p className="text-gray-700 mt-3">
            To exercise these rights, contact us at {contactEmail}.
          </p>
        </div>
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-blue-600 mb-3 pb-2 border-b border-gray-200">
            8. Content Ownership and Responsibility
          </h2>
          <p className="text-gray-700">
            Users retain full ownership of their uploaded content. Users are solely responsible for ensuring their content complies with all applicable laws and regulations.
          </p>
        </div>
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-blue-600 mb-3 pb-2 border-b border-gray-200">
            9. Data Retention
          </h2>
          <p className="text-gray-700">
            We retain personal data as long as necessary to provide our services. If you delete your account, we will remove your data unless required for legal or operational reasons.
          </p>
        </div>
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-blue-600 mb-3 pb-2 border-b border-gray-200">
            10. Updates to This Policy
          </h2>
          <p className="text-gray-700">
            We may update this Privacy Policy from time to time. Users will be notified via email of significant changes.
          </p>
        </div>
        
        <div className="mt-8 bg-blue-50 p-4 rounded-md">
          <h2 className="text-xl font-semibold text-blue-600 mb-3 pb-2 border-b border-gray-200">
            11. Contact Information
          </h2>
          <p className="text-gray-700">
            If you have any questions about this Privacy Policy, please contact us at {contactEmail}.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page;