"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"
import { ImageIcon, Send } from "lucide-react";
import { useState } from "react";
import { useChats } from "./ChatContext";
import { useUser } from "@clerk/nextjs";

export default function NewMessages() {
    const {user} = useUser()
    const {dispatch} = useChats();
    const [newMessage, setNewMessage] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0])
        }
    }
    const handleSendMessage = () => {
        if (newMessage.trim() || selectedFile) {
            const newMsg = {
                id: Date.now().toString(),
                user: 'You',
                content: newMessage,
                timestamp: new Date(),
                reactions: { heart: 0, thumbsUp: 0, thumbsDown: 0, smile: 0 },
                profile:user?.imageUrl as string
            }
            // if (selectedFile) {
            //     newMsg.image = URL.createObjectURL(selectedFile)
            // }
            dispatch({type:"add_message", payload: {...newMsg,id:Number(Date.now())}})
            setNewMessage('')
            setSelectedFile(null)
        }
    }
    return (
        <div className="flex w-full space-x-2">
        <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-grow"
        />
        <input
            type="file"
            id="file-upload"
            className="hidden"
            onChange={handleFileChange}
            accept="image/*"
        />
        <Button variant="outline" size="icon" asChild>
            <label htmlFor="file-upload" className="cursor-pointer">
            <ImageIcon className="h-4 w-4" />
            </label>
        </Button>
        <Button onClick={handleSendMessage}>
            <Send className="h-4 w-4 mr-2" /> Send
        </Button>
        </div>
    );
}
