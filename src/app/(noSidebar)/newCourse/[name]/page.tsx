"use client"
import AddModule from "./AddModule";
import ContextWrapper, { useCourseContext } from "./Context";
import Editor from "./Editor";
import VideoStorageProvider from "./VideoStorage";
import Structure from "@/components/course/Structure";

export default function page() {
	return (
		<VideoStorageProvider>
		<ContextWrapper>
			<main className="w-full h-[90vh] flex">
				<Structure context={useCourseContext}/>
				<div className="w-3/4 h-[90%]">
					<AddModule/>
					<Editor/>
				</div>
			</main>
		</ContextWrapper>
		</VideoStorageProvider>
	);
}