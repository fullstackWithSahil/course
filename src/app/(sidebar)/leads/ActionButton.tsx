"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import supabaseClient from "@/lib/supabase";
import { useSession } from "@clerk/nextjs";
import { useState } from "react";
import { toast } from "sonner";
import SendEmailButton from "@/components/SendEmailButton";

export default function ActionButton({ table }: { table: any }) {
    const {session} = useSession();
    const [open, setOpen] = useState(false);
    const selectedEmails = table.getSelectedRowModel().rows.map((obj:any)=>obj.original.email);
	async function deleteAction() {
		table.getSelectedRowModel().rows.map(async(row: any) => {
			const rowToDelete = row.original.id;
            const supabase = supabaseClient(session);
            const { error } = await supabase
                .from("leads")
                .delete()
                .eq("id", rowToDelete);
            if (error) {
                console.error("Error deleting row:", error);
            }
		});
        toast.success("Selected rows deleted successfully");
        setOpen(false);
	}
	return (
		<DropdownMenu onOpenChange={setOpen} open={open}>
			<DropdownMenuTrigger>
                <Button>Actions</Button>
            </DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuLabel onClick={deleteAction}>
                    Delete
                </DropdownMenuLabel>
				<DropdownMenuSeparator />
                <SendEmailButton emails={selectedEmails}/>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
