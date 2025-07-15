"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { DropdownMenuItem, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import supabaseClient from "@/lib/supabase";
import { useSession } from "@clerk/nextjs";
import { sendTemplateEmails } from "@/actions/sendingEmails";


type TemplateType = {
    body: string;
    created_at: string;
    id: number;
    name: string;
    teacher: string;
    variables: string[];
};

export default function SendEmailButton({emails}:{emails:string[]}) {
	const [open, setOpen] = useState(false);
    const [templates,setTemplates] = useState<TemplateType[]>([]);
    const [selectedTemplates,setSelectedTemplates] = useState("");
    const [subject,setSubject] = useState("");
    const [varValues,setVarValues] = useState({});

    const {session} = useSession();
    async function handleOpen(e:any){
        try {
            e.preventDefault();
            setOpen(true);
            const supabase = supabaseClient(session);
            const { data } = await supabase
                .from("templetes")
                .select("*")
                .eq("teacher",session?.user.id||"");
            if(!data){
                toast("you have not created any templates yet");
                return;
            }
            setTemplates(data);
        } catch (error) {
            console.log("error sending emails", error);
            toast("there was an error sending email");
        }
    }

	async function handleSubmit() {
		try {
            //ensures that all the fiels are filled
            let requiredField = templates.find((t)=>t.name==selectedTemplates)?.variables;
            Object.keys(varValues).forEach((value)=>{
                requiredField=requiredField?.filter(r=>r==value);
            });
            if(requiredField&&requiredField?.length>0){
                toast(`Variable ${requiredField[0]} is required`);
                return;
            }
            //send the email
            const data = await sendTemplateEmails(
                emails,
                session?.user.id||"",
                selectedTemplates,
                subject,
                varValues
            );
            toast(data.message)
            setOpen(false);
		} catch (error) {
			console.log("error sending emails", error);
			toast("there was an error sending email");
		}
	}

	return (
		<>
			<DropdownMenuItem
				onClick={(e) =>handleOpen(e)}
			>
                <DropdownMenuLabel>
				    Send email
                </DropdownMenuLabel>
			</DropdownMenuItem>
			<Dialog open={open} onOpenChange={setOpen}>
				<form>
					<DialogContent className="sm:max-w-[425px]">
						<DialogHeader>
							<DialogTitle>Send email</DialogTitle>
						</DialogHeader>
						<div className="grid gap-4">
                            <div className="grid gap-3">
                                <Label htmlFor="subject">Subject</Label>
                                <Input 
                                    id="subject" name="subject" 
                                    value={subject} onChange={(e)=>setSubject(e.target.value)} 
                                />
                            </div>
							<div className="grid gap-3">
								<Select value={selectedTemplates} onValueChange={setSelectedTemplates}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="select a template" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {templates?.map((template)=><SelectItem
                                            key={template.id} 
                                            value={template?.name||""}
                                        >
                                            {template?.name||""}
                                        </SelectItem>)}
                                    </SelectContent>
                                </Select>
							</div>
							<div>
                                {templates.find((t)=>t.name==selectedTemplates)?.variables.map((v)=>{
                                    return (
                                        <div className="grid grid-cols-3 my-2" key={v}>
                                            <Label>{v}</Label>
                                            <Input className="col-span-2" required onChange={(e)=>{
                                                setVarValues((prev) => ({
                                                    ...prev,
                                                    [v]: e.target.value,
                                                }));
                                            }}/>
                                        </div>
                                    )
                                })}
							</div>
						</div>
						<DialogFooter>
							<DialogClose asChild>
								<Button variant="outline">Cancel</Button>
							</DialogClose>
							<Button type="submit" onClick={handleSubmit}>Send</Button>
						</DialogFooter>
					</DialogContent>
				</form>
			</Dialog>
		</>
	);
}
