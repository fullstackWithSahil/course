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
import { useSession, useUser } from "@clerk/nextjs";
import axios from "axios";
import { toast } from "sonner";
import supabaseClient from "@/lib/supabase";

export default function Messagebutton({
	id,
	senderId,
}: {
	id?: number;
	senderId: string;
}) {
	const { user } = useUser();
	const {session} = useSession();
    const [message, setMessage] = useState("");
	async function handleMessage(){
		try {
			const supabase = supabaseClient(session);
			const { data:comment } =id? await supabase
				.from("comments")
				.select("comment")
				.eq("id", id!)
				.single(): { data: null };

			const content=id?`replying to your comment "${comment?.comment}".\n\n${message}`:message;
			const {data} = await axios.get(`http://localhost:8080/api/chats/member/${senderId}`);
			const chatId = data.data.find((c:any)=>!c.group)._id;
			
			await axios.post("http://localhost:8080/api/messages/create",{ 
				chat: chatId, 
				sender:user?.id || "", 
				content,
				profile: user?.imageUrl || "",
				firstname: user?.firstName || "",
			})
			toast("Message sent successfully!");
			setMessage("");
		} catch (error) {
			console.error("Error sending message:", error);
			toast.error("Failed to send message.");	
		}
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
						Send a message 
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
