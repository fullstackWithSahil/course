import React from 'react';

type RefundPolicyProps = {
  effectiveDate?: string;
  contactEmail?: string;
};

export default function Page(){
  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8">
      <div className="bg-gray-50 rounded-lg shadow-md p-6 md:p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6 pb-4 border-b-2 border-gray-200">
          Refund Policy
        </h1>
        
        <div className="text-center italic text-gray-600 mb-8">
          <strong>Effective Date:</strong> {"11/04/2005"}
        </div>
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-blue-600 mb-3 pb-2 border-b border-gray-200">
            1. Subscription Payments
          </h2>
          <p className="text-gray-700">
            Our service operates on a subscription-based model. Users are required to pay in advance 
            for each billing cycle (monthly or as specified in the subscription plan).
          </p>
        </div>
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-blue-600 mb-3 pb-2 border-b border-gray-200">
            2. Cancellation Policy
          </h2>
          <p className="text-gray-700">
            Users may cancel their subscription at any time. Cancellation will take effect at the end 
            of the current billing cycle, and users will continue to have access to the service 
            until the subscription period expires.
          </p>
        </div>
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-blue-600 mb-3 pb-2 border-b border-gray-200">
            3. Refund Policy
          </h2>
          <p className="text-gray-700 mb-3">
            <strong>(a) No Refunds for Partial Use:</strong> Since payments are made in advance, 
            we do not offer refunds or credits for partial use, unused time, or early cancellation.
          </p>
          <p className="text-gray-700 mb-2">
            <strong>(b) Exceptions:</strong> Refunds may be granted in exceptional cases, such as:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Duplicate charges due to a system error.</li>
            <li>Billing errors resulting in overcharges.</li>
            <li>Service downtime due to technical issues caused by us (subject to review).</li>
          </ul>
        </div>
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-blue-600 mb-3 pb-2 border-b border-gray-200">
            4. How to Request a Refund
          </h2>
          <p className="text-gray-700">
            If you believe you are eligible for a refund, please contact our support team at fullstackwithsahil@gmail.com within 
            7 days of the charge. Refund requests must include relevant details, such as transaction ID 
            and reason for the request.
          </p>
        </div>
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-blue-600 mb-3 pb-2 border-b border-gray-200">
            5. Changes to the Refund Policy
          </h2>
          <p className="text-gray-700">
            We reserve the right to modify this Refund Policy at any time. Users will be notified of 
            significant changes via email.
          </p>
        </div>
        
        <div className="mt-8 bg-blue-50 p-4 rounded-md">
          <h2 className="text-xl font-semibold text-blue-600 mb-3 pb-2 border-b border-gray-200">
            6. Contact Information
          </h2>
          <p className="text-gray-700">
            For any questions regarding this Refund Policy, please contact us at fullstackwithsahil@gmail.com.
          </p>
        </div>
      </div>
    </div>
  );
};