"use client";
import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { ChevronDown, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import logo from "@/assets/logo.1141418a.png";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white sticky top-0 z-50 shadow-md">
      <nav className="max-w-7xl mx-auto px-4 py-5 flex justify-between items-center">
        {/* Logo */}
        <Image src={logo} alt="logo" width={50} height={50} />

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          <a href="#features" className="text-gray-700 hover:text-blue-600 transition">
            Features
          </a>
          <a href="#pricing" className="text-gray-700 hover:text-blue-600 transition">
            Pricing
          </a>
          <a href="#testimonials" className="text-gray-700 hover:text-blue-600 transition">
            Testimonials
          </a>
          <a href="#resources" className="text-gray-700 hover:text-blue-600 transition">
            Resources
          </a>
          <SignedOut>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
              <SignInButton />
            </button>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-gray-700 focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-expanded={isMenuOpen}
          aria-label="Toggle navigation menu"
        >
          {isMenuOpen ? <X size={24} /> : <ChevronDown size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t transition-all duration-200">
          <div className="flex flex-col space-y-4 p-4">
            <a href="#features" className="text-gray-700 hover:text-blue-600">
              Features
            </a>
            <a href="#pricing" className="text-gray-700 hover:text-blue-600">
              Pricing
            </a>
            <a href="#testimonials" className="text-gray-700 hover:text-blue-600">
              Testimonials
            </a>
            <a href="#resources" className="text-gray-700 hover:text-blue-600">
              Resources
            </a>
            <SignedOut>
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
                <SignInButton />
              </button>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </div>
      )}
    </header>
  );
}