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
	{ value: "leads:read", label: "Read leads", icon: Users },
	{ value: "leads:write", label: "Add/Update leads", icon: Users },
	{ value: "leads:delete", label: "Delete leads", icon: Users },
];
