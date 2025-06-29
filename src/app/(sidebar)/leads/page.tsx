import { supabaseClient } from "@/lib/server/supabase";
import { currentUser } from "@clerk/nextjs/server";
import { DataTable } from "./data-table";
import { columns } from "./columns";

export default async function Page() {
	const supabase = supabaseClient();
	const user = await currentUser();
	if (!user) return;

	const { data, error } = await supabase
		.from("leads")
		.select(`*`)
		.eq("teacher", user.id);

	const formated = data?.map((lead) => {
		let date = new Date(lead.created_at);
		const day = date.getDate().toString().padStart(2, '0');
		const month = (date.getMonth() + 1).toString().padStart(2, '0');
		const year = date.getFullYear();
		const temp = `${day}/${month}/${year}`;
		return {
			id: lead.id,
			name: lead.name,
			email: lead.email,
			teacher: lead.teacher,
			note: lead.note,
			created_at: temp,
			source: lead.source,
		};
	});
	
	return (
		<div className="w-full py-10 pr-2">
			<DataTable columns={columns as any} data={formated?formated:[]}/>
		</div>
	);
}
