"use client";

import type React from "react";
import type { FormData } from "../Onboardingform";
import whatsapp from "@/assets/whatsappicon.svg";
import discord from "@/assets/discord.svg";
import gmail from "@/assets/gmail.svg"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import supabaseClient from "@/lib/supabase";
import { useSession, useUser } from "@clerk/nextjs";
import Image from "next/image";

interface NotificationStepProps {
	formData: FormData;
	updateFormData: (data: Partial<FormData>) => void;
	nextStep: () => void;
	prevStep: () => void;
}

export default function NotificationStep({
	formData,
	updateFormData,
	nextStep,
	prevStep,
}: NotificationStepProps) {
	const { session } = useSession();
	const { user } = useUser();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const supabase = supabaseClient(session);
		const { error } = await supabase
			.from("teachers")
			.update({ ...formData, logo: "" })
			.eq("teacher", user?.id || "");
		if (error) {
			console.log(error);
			toast(
				"There was an error adding your data. Please try again later..."
			);
		}
		nextStep();
	};

	const notificationOptions = [
		{ id: "email", label: "Email" ,icon:gmail},
		{ id: "whatsapp", label: "WhatsApp", icon:whatsapp },
		{ id: "discord", label: "Discord", icon:discord },
	];

	return (
		<form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
			<div className="space-y-1 sm:space-y-2">
				<h2 className="text-xl sm:text-2xl font-bold">
					Notification Preferences
				</h2>
				<p className="text-sm text-gray-500">
					How would you like to receive important notifications?
				</p>
			</div>

			<div className="space-y-3 sm:space-y-4">
				<div className="space-y-1 sm:space-y-2">
					<Label>Preferred Notification Method</Label>
					<div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
						{notificationOptions.map((option) => (
							<Button
								key={option.id}
								type="button"
								variant={
									formData.notificationMethod === option.id
										? "default"
										: "outline"
								}
								onClick={() =>
									updateFormData({
										notificationMethod: option.id,
									})
								}
								className="h-12 sm:h-16"
							>
								<Image src={option.icon} height={30} width={30} alt="whatsapp"/>{option.label}
							</Button>
						))}
					</div>
				</div>

				{formData.notificationMethod && (
					<div className="space-y-1 sm:space-y-2">
						<Label htmlFor="notificationContact">
							{formData.notificationMethod === "email"
								? "Email Address"
								: formData.notificationMethod === "whatsapp"
								? "WhatsApp Number"
								: "Discord Username"}
						</Label>
						<Input
							id="notificationContact"
							value={formData.notificationContact}
							onChange={(e) =>
								updateFormData({
									notificationContact: e.target.value,
								})
							}
							placeholder={
								formData.notificationMethod === "email"
									? "john@example.com"
									: formData.notificationMethod === "whatsapp"
									? "+1 (555) 123-4567"
									: "username#1234"
							}
							required
						/>
					</div>
				)}
			</div>

			<div className="flex gap-2 sm:gap-3 pt-2 sm:pt-4">
				<Button
					type="button"
					variant="outline"
					onClick={prevStep}
					className="flex-1"
				>
					Back
				</Button>
				<Button type="submit" className="flex-1">
					Continue
				</Button>
			</div>
		</form>
	);
}