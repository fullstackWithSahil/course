"use client"
import Sidebar from "./Sidebar";
import AddModule from "./AddModule";
import ContextWrapper from "./Context";
import Editor from "./Editor";
import VideoStorageProvider from "./VideoStorage";

export default function page() {
	return (
		<VideoStorageProvider>
		<ContextWrapper>
			<main className="w-full h-[90vh] flex">
				<Sidebar/>
				<div className="w-3/4 h-[90%]">
					<AddModule/>
					<Editor/>
				</div>
			</main>
		</ContextWrapper>
		</VideoStorageProvider>
	);
}