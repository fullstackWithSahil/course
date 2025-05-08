import { buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { supabaseClient } from "@/lib/server/supabase";
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";

export default async function MobileSidebar() {
	const user = await currentUser();
	if (!user) {
		return <div>You are not logged in</div>;
	}
	const supabase = supabaseClient();
	const { data: courses } = await supabase
		.from("courses")
		.select("*")
		.order("created_at", { ascending: false })
		.eq("teacher", user.id);
		
	return (
		<Sheet>
			<SheetTrigger>
				<h1 className="sm:hidden mt-4 text-lg font-medium">Chats</h1>
			</SheetTrigger>
			<SheetContent>
				{courses?.map((course) => (
					<Link
						href={`/chats/${course.id}`}
						key={course.id}
						className={buttonVariants() + " w-3/4"}
					>
						{course.name}
					</Link>
				))}
			</SheetContent>
		</Sheet>
	);
}
