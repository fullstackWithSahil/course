import { supabaseClient } from "@/lib/server/supabase";
import { currentUser } from "@clerk/nextjs/server";
import { DataTable } from "./data-table";
import { columns } from "./columns";

export default async function Page() {
	const supabase = supabaseClient();
	const user = await currentUser();
	if (!user) return;

	let { data, error } = await supabase
		.from("students")
		.select(`*,
			course (
				name
			)
		`)
		.eq("teacher", user.id);

	if (!data || data.length == 0) {
		return (
			<div className="my-5 mx-3 h-3/4 bg-gray-200 border-2 rounded-2xl flex items-center justify-center text-2xl font-bold">
				<h1>There are no students yet</h1>
			</div>
		);
	}

	const formated = data.map((student) => {
		let date = new Date(student.created_at);
		const day = date.getDate().toString().padStart(2, '0');
		const month = (date.getMonth() + 1).toString().padStart(2, '0');
		const year = date.getFullYear();
		const temp = `${day}/${month}/${year}`;
		return {
			id: student.id,
			name: student.name,
			email: student.email,
			student: student.student,
			teacher: student.teacher,
			note: student.note,
			created_at: temp,
			course: student.course?.name || null,
		};
	});

	const courses = data.map((student) => student?.course?.name);
	
	return (
		<div className="w-full py-10 pr-2">
			<DataTable columns={columns as any} data={formated} courses={courses as any}/>
		</div>
	);
}
