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
import { useState } from "react";
import SendEmailButton from "@/components/SendEmailButton";

export default function ActionButton({ table }: { table: any }) {
    const [open, setOpen] = useState(false);
    const selectedEmails = table.getSelectedRowModel().rows.map((obj:any)=>obj.original.email);

	return (
		<DropdownMenu onOpenChange={setOpen} open={open}>
			<DropdownMenuTrigger>
                <Button className="ml-5">Actions</Button>
            </DropdownMenuTrigger>
			<DropdownMenuContent>
                <SendEmailButton emails={selectedEmails}/>
				<DropdownMenuSeparator />
                <DropdownMenuItem>
                    <DropdownMenuLabel>
                        Send Message
                    </DropdownMenuLabel>
                </DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
