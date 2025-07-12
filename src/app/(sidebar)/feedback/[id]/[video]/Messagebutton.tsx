"use client";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";

export default function Messagebutton({
	id,
	name,
	email,
}: {
	id: number;
	name: string;
	email: string;
}) {
    const [message, setMessage] = useState("");
	function handleMessage() {
		throw new Error("Function not implemented.");
	}

	return (
		<AlertDialog>
			<AlertDialogTrigger>
				<div className="flex items-center gap-2">
					<Button variant="outline" size="sm">
						<Mail className="h-4 w-4 mr-2" />
						Message
					</Button>
				</div>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>
						Send a message to {name || "User"}
					</AlertDialogTitle>
					<AlertDialogDescription>
						<Textarea value={message} onChange={(e)=>setMessage(e.target.value)}/>
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction onClick={handleMessage}>Send</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
