"use client";

import sendDiscordMessage from "@/lib/discord";
import { useState } from "react";
import { toast } from "sonner";

export default function Form() {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		subject: "",
		message: "",
	});
	const [submitted, setSubmitted] = useState(false);

	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>
	) => {
		const { name, value } = e.target;
		setFormData((prevState) => ({
			...prevState,
			[name]: value,
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
        try {
            
            e.preventDefault();
            const message = `
            someone has filled a contact us form:
            Name: ${formData.name}
            Email: ${formData.email}
            Subject: ${formData.subject}
            Message: ${formData.message}
            -----------------------------`;
            await sendDiscordMessage(message);
            setSubmitted(true);
        } catch (error) {
            toast("Something went wrong, please try again later")            
        }
	};
    
	return (
		<div>
			<h2 className="text-xl font-semibold text-gray-800 mb-4">
				Send us a message
			</h2>

			{submitted ? (
				<div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
					<p className="font-medium">Thank you for your message!</p>
					<p>We'll get back to you as soon as possible.</p>
				</div>
			) : (
				<form onSubmit={handleSubmit}>
					<div className="mb-4">
						<label
							htmlFor="name"
							className="block text-gray-700 font-medium mb-2"
						>
							Name
						</label>
						<input
							type="text"
							id="name"
							name="name"
							value={formData.name}
							onChange={handleChange}
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							required
						/>
					</div>

					<div className="mb-4">
						<label
							htmlFor="email"
							className="block text-gray-700 font-medium mb-2"
						>
							Email
						</label>
						<input
							type="email"
							id="email"
							name="email"
							value={formData.email}
							onChange={handleChange}
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							required
						/>
					</div>

					<div className="mb-4">
						<label
							htmlFor="subject"
							className="block text-gray-700 font-medium mb-2"
						>
							Subject
						</label>
						<select
							id="subject"
							name="subject"
							value={formData.subject}
							onChange={handleChange}
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							required
						>
							<option value="">Select a subject</option>
							<option value="general">General Inquiry</option>
							<option value="support">Technical Support</option>
							<option value="billing">Billing Question</option>
							<option value="feedback">Feedback</option>
						</select>
					</div>

					<div className="mb-4">
						<label
							htmlFor="message"
							className="block text-gray-700 font-medium mb-2"
						>
							Message
						</label>
						<textarea
							id="message"
							name="message"
							value={formData.message}
							onChange={handleChange}
							rows={5}
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							required
						></textarea>
					</div>

					<button
						type="submit"
						className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition duration-300 font-medium"
					>
						Send Message
					</button>
				</form>
			)}
		</div>
	);
}
