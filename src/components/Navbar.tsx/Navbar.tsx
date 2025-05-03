"use client";
import {
	SignInButton,
	SignUpButton,
	SignedIn,
	SignedOut,
	UserButton,
} from "@clerk/nextjs";
import { ChevronDown, Triangle, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import logo from "@/assets/logo.1141418a.png";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";

export default function Navbar() {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const router = useRouter();
	const links = ["features", "pricing", "testimonials", "resources"];

	return (
		<header className="bg-white sticky top-0 z-50 shadow-md">
			<nav className="max-w-7xl mx-auto px-4 py-5 flex justify-between items-center">
				{/* Logo */}
				<div
					className="flex items-center gap-2"
					onClick={() => router.push("/")}
				>
					<Image src={logo} alt="logo" width={50} height={50} />
					<h1 className="text-3xl font-extrabold">Courses</h1>
				</div>

				{/* Desktop Menu */}
				<div className="hidden md:flex items-center space-x-8">
                    <Badge>Dashboard<Triangle className="rotate-90 fill-white"/></Badge>
					{links.map((link) => (
						<a
							href={`#${link}`}
							className="text-gray-700 hover:text-blue-600 transition capitalize"
						>
							{link}
						</a>
					))}
					<div>
						<SignedOut>
							<span className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
								<SignInButton />
							</span>
							<span className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
								<SignUpButton />
							</span>
						</SignedOut>
					</div>
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
                        <Badge>Dashboard<Triangle className="rotate-90 fill-white"/></Badge>

						{links.map((link) => (
							<a
								key={link}
								href={`#${link}`}
								className="text-gray-700 hover:text-blue-600 capitalize"
								onClick={() => setIsMenuOpen(false)}
							>
								{link}
							</a>
						))}
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
