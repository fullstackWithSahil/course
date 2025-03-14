"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"
import { ImageIcon, Send } from "lucide-react";
import { useState } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import supabaseClient from "@/lib/supabase";
import { useParams } from "next/navigation";

export default function NewMessages() {
    const params = useParams();
    const id = Number(params.id);
    
    const {user} = useUser()
    const {userId,getToken} = useAuth();
    const [newMessage, setNewMessage] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0])
        }
    }

    const handleSendMessage = async() => {
        if (newMessage.trim() || selectedFile) {
            const newMsg = {
                message: newMessage,
                to: params.to?params.to as string:userId,
                firstname: user?.firstName || '',
                reactions: { heart: 0, thumbsUp: 0, thumbsDown: 0, smile: 0 },
                profile:user?.imageUrl as string,
                sender:userId||'',
                course:id
            }
            // if (selectedFile) {
            //     newMsg.image = URL.createObjectURL(selectedFile)
            // }
    
            // Get token and initialize Supabase client
            const token = await getToken({ template: "supabase" });
            if (!token) throw new Error("Failed to retrieve token");
            const supabase = supabaseClient(token);
            
            await supabase.from("messages").insert({
                ...newMsg,
                reactions: newMsg.reactions,
            });
            
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
