"use client"
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea';
import supabaseClient from '@/lib/supabase';
import { useSession } from '@clerk/nextjs';
import { Dispatch, SetStateAction, useState } from 'react'
import { toast } from 'sonner';

export default function Editnote({
    id,
    open,
    onOpenChange,
    previosusNote,
}:{
    id:number;
    open:boolean;
    onOpenChange:Dispatch<SetStateAction<boolean>>;
    previosusNote:string;
}) {
    const [value, setValue] = useState(previosusNote);
    const {session} = useSession();
    async function handleClick(){
        try {
            const supabase = supabaseClient(session)
            const {error} = await supabase
                .from("leads")
                .update({note:value})
                .eq("id", id);
            if (error) {
                toast.error("Error updating note")
            }
            setValue("")
            onOpenChange(false)
        } catch (error) {
            console.log(error)
            toast.error("Error updating note")
            onOpenChange(false)
        }
    }
    return (
        <Dialog onOpenChange={onOpenChange} open={open}>
            <DialogContent>
                <DialogTitle>Edit Note</DialogTitle>
                <Textarea value={value} onChange={(e)=>setValue(e.target.value)}/>
                <Button onClick={handleClick}>Save</Button>
            </DialogContent>
        </Dialog>
    )
}
