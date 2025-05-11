"use client";

import { useSession } from "@clerk/nextjs";
import { useMessageActions, useMessages } from "./context";
import Message from "./Message";
import { useContext, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { SocketContext } from "./SocketContext";

export default function Messagebubble() {
    const {id} = useParams();
	const {state} = useMessages();
    const {session} = useSession();
    
    const {addMessage,updateMessage,deleteMessage} = useMessageActions();
	const socket = useContext(SocketContext);
	const scrollContainerRef = useRef<HTMLDivElement>(null);

	useEffect(()=>{
		if(!session) return;
		if(!socket) return;
		socket.on("receiveMessage",(message)=>{
			addMessage({
				...message,
				created_at:"11/22/2023",
			})
		});

		socket.on("receiveEditMessage",(message)=>{
			console.log(message);
			updateMessage(message.id,message);
		});
		
		socket.on("receiveDeleteMessage",(id)=>{
			console.log(id);
			deleteMessage(id);
		});
	},[id]);
    
    useEffect(() => {
		setTimeout(() => {
			const container = scrollContainerRef.current;
			if (container) {
				container.scrollTo({
					top: container.scrollHeight,
					behavior: "smooth",
				});
			}
		}, 100);
	}, [state.length]);

	return (
			<div ref={scrollContainerRef} className="overflow-y-scroll mx-2 h-[75vh]">
				{state.map((message) => (
					<Message
					key={message.id}
					firstname={message.firstname || ""}
					created_at={message.created_at}
					id={message.id}
					isUserMessage={message.sender === session?.user.id}
					profile={message.profile}
					message={message.message || ""}
					/>
				))}
			</div>
	);
}
