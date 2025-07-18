"use client";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Documentation from "./Documentation";
import Keys from "./Keys";
import Usage from "./Usage";

export default function Page() {
	return (
		<div className="container mx-auto p-6 max-w-6xl">
			<div className="mb-8">
				<h1 className="text-3xl font-bold mb-2">API Key Management</h1>
				<p className="text-muted-foreground">
					Read this
					<a
						className="text-blue-400"
						target="_blank"
						href={
							"https://course-git-main-fullstackwithsahils-projects.vercel.app/"
						}
					>
						{" "}
						page
					</a>{" "}
					for detailed documentation of api keys and how to use them.
					Manage your API keys for email sending and student database
					operations
				</p>
			</div>

			<Tabs defaultValue="keys" className="space-y-6">
				<TabsList className="grid w-full grid-cols-2">
					<TabsTrigger value="keys">API Keys</TabsTrigger>
					<TabsTrigger value="documentation">
						Documentation
					</TabsTrigger>
					{/* <TabsTrigger value="usage">Usage & Limits</TabsTrigger> */}
				</TabsList>
				<Keys />
				<Documentation />
				{/* <Usage /> */}
			</Tabs>
		</div>
	);
}
