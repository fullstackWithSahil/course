import Form from './Form';

interface ContactFormProps {
  companyName?: string;
  companyEmail?: string;
  companyPhone?: string;
  companyAddress?: string;
}

export default function Page({
  companyName = "Business Tools Online",
  companyEmail = "fullstackwithsahil@gmail.com",
  companyPhone = "+91 9867624595",
  companyAddress = "123 Business Avenue, Suite 101, San Francisco, CA 94107"
}:ContactFormProps){
  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8">
      <div className="bg-gray-50 rounded-lg shadow-md overflow-hidden">
        <div className="bg-blue-600 p-6 text-white">
          <h1 className="text-3xl font-bold text-center">Contact Us</h1>
          <p className="text-center mt-2 text-blue-100">We'd love to hear from you</p>
        </div>

        <div className="p-6 md:p-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Form */}
            <Form/>
            
            {/* Contact Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Contact Information</h2>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="mb-6">
                  <h3 className="font-medium text-gray-900">Company</h3>
                  <p className="text-gray-700">{companyName}</p>
                </div>
                
                <div className="mb-6">
                  <h3 className="font-medium text-gray-900">Email</h3>
                  <a href={`mailto:${companyEmail}`} className="text-blue-600 hover:underline">
                    {companyEmail}
                  </a>
                </div>
                
                <div className="mb-6">
                  <h3 className="font-medium text-gray-900">Phone</h3>
                  <a href={`tel:${companyPhone}`} className="text-blue-600 hover:underline">
                    {companyPhone}
                  </a>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900">Address</h3>
                  <p className="text-gray-700">{companyAddress}</p>
                </div>
              </div>
              
              <div className="mt-6 bg-blue-50 p-4 rounded-md">
                <h3 className="font-medium text-gray-800 mb-2">Business Hours</h3>
                <ul className="text-gray-700">
                  <li className="mb-1">Monday - Friday: 9:00 AM - 6:00 PM</li>
                  <li>Saturday - Sunday: Closed</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};