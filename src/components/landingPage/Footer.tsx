import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-4 grid-cols-1 gap-8">
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Policies</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/contact-us"
                  className="hover:text-white focus:text-white focus:outline-none"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className="hover:text-white focus:text-white focus:outline-none"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/toc"
                  className="hover:text-white focus:text-white focus:outline-none"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/refund-policy"
                  className="hover:text-white focus:text-white focus:outline-none"
                >
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Product</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#features"
                  className="hover:text-white focus:text-white focus:outline-none"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#pricing"
                  className="hover:text-white focus:text-white focus:outline-none"
                >
                  Pricing
                </a>
              </li>
              <li>
                <a
                  href="#resources"
                  className="hover:text-white focus:text-white focus:outline-none"
                >
                  Resources
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="hover:text-white focus:text-white focus:outline-none"
                >
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-white focus:text-white focus:outline-none"
                >
                  Documentation
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-white focus:text-white focus:outline-none"
                >
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Stay Updated</h4>
            <div className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-gray-800 px-4 py-2 rounded-l-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-600"
                aria-label="Enter your email for updates"
              />
              <button className="bg-blue-600 px-4 py-2 rounded-r-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600">
                Subscribe
              </button>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-12 pt-8 text-sm text-center">
          © 2024 EduStream. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
