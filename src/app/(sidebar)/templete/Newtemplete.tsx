"use client";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import supabaseClient from "@/lib/supabase";
import { useSession } from "@clerk/nextjs";
import { PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
  

export default function Newtemplete() {
    const [name, setName] = useState("");
    const {session} = useSession();
    const router = useRouter();
	async function handleClick(){
		if (!session?.user.id) {
			toast.error("User session not found.");
			return;
		}
		try {
			const supabase = supabaseClient(session);
			const { data, error } = await supabase
				.from('templetes')
				.insert({ 
					name, 
					teacher: session.user.id,
					body: "",
					variables: [],
				})
				.select();
			if (error) {
				throw error;
			}
			toast.success("Template created successfully!");
			router.push(`/templates/${data[0].id}`);
		} catch (error) {
			console.error("Error creating template:", error);
			toast.error("Failed to create template. Please try again.");
		}
	}

	return (
		<div>
			<h1 className="text-4xl text-center font-bold">
				Create a new Templete
			</h1>
			<Dialog>
				<DialogTrigger asChild>
					<div className="h-24 cursor-pointer w-4/5 border-2 rounded-lg flex items-center justify-center mx-[auto]">
						<PlusCircle />
					</div>
				</DialogTrigger>
				<DialogContent className="sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle>Create a new Templete</DialogTitle>
					</DialogHeader>
					<div>
						<form>
							<Label htmlFor="name">Templete Name</Label>
							<Input
								id="name"
                                className="my-3"
								value={name}
								onChange={(e) => setName(e.target.value)}
							/>
						</form>
					</div>
					<DialogFooter>
						<Button type="submit" onClick={handleClick}>
							Create
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
