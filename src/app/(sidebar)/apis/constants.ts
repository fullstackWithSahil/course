import { Mail, Users } from "lucide-react"

export type ApiKey= {
	id: number;
	name: string;
	key: string;
	permissions: string[];
	created_at: string;
	lastUsed: string;
	status: "active" | "inactive";
    teacher: string;
};

export const permissionOptions = [
	{ value: "email:send", label: "Send Emails", icon: Mail },
	{
		value: "email:templates",
		label: "Manage Email Templates",
		icon: Mail,
	},
	{ value: "students:read", label: "Read Students", icon: Users },
	{ value: "students:write", label: "Add/Update Students", icon: Users },
	{ value: "students:delete", label: "Delete Students", icon: Users },
];
