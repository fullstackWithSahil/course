"use client";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import  { MessageType, useMessageActions } from "./context";
import Inputfield from "./Inputfield";
import Messagebubble from "./Messagebubble";
import axios from "axios";
import { toast } from "sonner";


export default function Page() {
	const { id } = useParams();
	const { addMessage,clearMessages } = useMessageActions();
	useEffect(() => {
		clearMessages();
		axios.get(`http://localhost:8080/api/messages/getMessages?course=${id}`)
			.then(({data})=>{
				data.forEach((message:MessageType) => {
					addMessage(message);
				});
			}).catch((error)=>{
				console.log(error)
				toast.error("Error fetching messages");
			})
	}, [id,addMessage,clearMessages]);

	return (
		<div className="w-full">
			<Messagebubble/>
			<Inputfield/>
		</div>
	);
}