import { 
    Dialog, 
    DialogClose, 
    DialogContent, 
    DialogFooter, 
    DialogHeader, 
    DialogTitle 
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import API from "@/lib/api";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import {
  DropdownMenuItem,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu"
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function SendMessageButton({students}:{students:string[]}){
    const [open,setOpen] = useState(false);
    const {user} = useUser();
    const [message,setMessage] = useState("");
    function handleOpen(e:any){
        e.preventDefault();
        setOpen(true);
    }

    async function handleSubmit(){
        try {
            const promises = students.map((student)=>{
                return new Promise(async(resolve,reject)=>{
                    try {
                        const {data} = await API.get(`/chats/member/${student}`);
                        const chat = data.data.find((c:any)=>!c.gorup);
                        const {data:messageSent} = await API.post("/messages/create",{ 
                            chat:chat._id, 
                            sender:user?.id, 
                            content:message, 
                            profile:user?.imageUrl,
                            firstname:user?.firstName 
                        });
                        resolve(messageSent);
                    } catch (error) {
                        reject(error);
                    }
                })
            })
        } catch (error) {
            console.log(error);
            toast("There was an error sending message");
        }
    }
    return(
        <>
        <DropdownMenuItem onClick={(e)=>handleOpen(e)}>
            <DropdownMenuLabel>Send Message</DropdownMenuLabel>
        </DropdownMenuItem>
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Send message</DialogTitle>
                </DialogHeader>
                <Textarea value={message} onChange={(e)=>setMessage(e.target.value)}/>
                <DialogFooter>
					<DialogClose asChild>
						<Button variant="outline">Cancel</Button>
					</DialogClose>
						<Button type="submit" onClick={handleSubmit}>Send</Button>
				</DialogFooter>
            </DialogContent>
        </Dialog>
        </>
    )
}