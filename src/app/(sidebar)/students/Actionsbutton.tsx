"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState } from "react";
import SendEmailButton from "@/components/SendEmailButton";
import SendMessageButton from "./SendMessageButton";

export default function ActionButton({ table }: { table: any }) {
    const [open, setOpen] = useState(false);
    const selectedEmails = table.getSelectedRowModel().rows.map((obj:any)=>obj.original.email);
    const selectedUsers = table.getSelectedRowModel().rows.map((obj:any)=>obj.original.student);

	return (
		<DropdownMenu onOpenChange={setOpen} open={open}>
			<DropdownMenuTrigger>
                <Button className="ml-5">Actions</Button>
            </DropdownMenuTrigger>
			<DropdownMenuContent>
                <SendEmailButton emails={selectedEmails}/>
				<DropdownMenuSeparator />
                <SendMessageButton students={selectedUsers}/>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
