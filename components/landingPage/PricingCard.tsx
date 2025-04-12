import { Check } from "lucide-react"; 
import React from "react";

// Define type for the PricingCard props
interface PricingCardProps {
  title: string;
  price: string;
  features: string[];
  highlighted?: boolean;
  onGetStarted: () => void;
}

const PricingCard: React.FC<PricingCardProps> = ({
    title,
	price,
	features,
	highlighted = false,
	onGetStarted,
}) => (
    <div
    className={`p-8 rounded-xl shadow-lg transition-transform transform hover:scale-105 ${
        highlighted
        ? "bg-blue-600 text-white ring-4 ring-blue-200"
        : "bg-white"
    }`}
	>
		{/* Card Title and Price */}
		<h3 className="text-2xl font-bold mb-2">{title}</h3>
		<p className="text-4xl font-extrabold mb-6">
			{price}
			<span className="text-lg font-normal">/month</span>
		</p>

		{/* Features List */}
		<ul className="space-y-4 mb-8">
			{features.map((feature, index) => (
                <li key={index} className="flex items-center gap-3">
					<Check
						size={24}
						className={
                            highlighted ? "text-white" : "text-green-500"
						}
                        />
					<span className="text-lg">{feature}</span>
				</li>
			))}
		</ul>

		{/* Action Button */}
		<button
			onClick={onGetStarted}
			className={`w-full py-3 rounded-lg font-semibold text-lg transition ${
                highlighted
                ? "bg-white text-blue-600 hover:bg-gray-100"
                : "bg-blue-600 text-white hover:bg-blue-700"
			}`}
            >
			Get Started
		</button>
	</div>
);

export default PricingCard;