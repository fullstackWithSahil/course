"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";
import { FC } from "react";
import SendEmailButton from "@/components/SendEmailButton";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type StudentsType = {
	course: string;
	created_at: string;
	email: string | null;
	id: number;
	name: string | null;
	note: string | null;
	student: string | null;
	teacher: string | null;
};

export const columns: ColumnDef<StudentsType>[] = [
	{
		id: "select",
		header: ({ table }) => (
			<Checkbox
				checked={
					table.getIsAllPageRowsSelected() ||
					(table.getIsSomePageRowsSelected() && "indeterminate")
				}
				onCheckedChange={(value) =>
					table.toggleAllPageRowsSelected(!!value)
				}
				aria-label="Select all"
			/>
		),
		cell: ({ row }) => (
			<Checkbox
				checked={row.getIsSelected()}
				onCheckedChange={(value) => row.toggleSelected(!!value)}
				aria-label="Select row"
			/>
		),
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: "course",
		header: "Course",
	},
	{
		accessorKey: "email",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() =>
						column.toggleSorting(column.getIsSorted() === "asc")
					}
				>
					Email
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
	},
	{
		accessorKey: "name",
		header: "Name",
	},
	{
		accessorKey: "created_at",
		header: "Joined at",
	},
	{
		id: "actions",
		accessorKey: "actions",
		header: "Actions",
		cell: ({ row }) => {
			const student = row.original;
			return <CellIteam student={student}/>;
		},
	},
];

function CellIteam({student}:{student:any}) {
	const router = useRouter();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" className="h-8 w-8 p-0">
					<span className="sr-only">Open menu</span>
					<MoreHorizontal className="h-4 w-4" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuLabel>Actions</DropdownMenuLabel>
				<DropdownMenuItem
					onClick={() =>
						navigator.clipboard.writeText(student.email || "")
					}
				>
					Copy email
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<SendEmailButton emails={[student.email]}/>
				<DropdownMenuItem
					onClick={() => {
						router.push(`/chats/${student.student}`);
					}}
				>
					Send email
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
