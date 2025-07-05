"use client";
import Structure from "@/components/course/Structure";
import { useCourseContext } from "./context";
import AddModule from "./AddModule";

export default function Main() {
	return (
		<main className="w-full h-[90vh] flex">
			<Structure context={useCourseContext} />
			<div className="w-3/4 h-[90%]">
				<AddModule />
				{/* <Editor /> */}
			</div>
		</main>
	);
}
