"use client";

import AddLesson from "@/components/course/AddLesson";
import { useCourseContext } from "./Context";

export default function Editor() {
	const { state } = useCourseContext();
	return (
        <div className="h-full overflow-y-scroll">
			{state.map((module) => (
                <div key={module.id} className="m-3 p-3 border-2">
					<h1 className="text-2xl text-center font-bold">
						{module.name}
					</h1>
					<AddLesson
						moduleLength={module.videos.length+1} 
						modulename={module.name} 
						moduleId={module.id}
						update={false}
						useCourseContext={useCourseContext}
					/>
					{module.videos.map((video)=><AddLesson
						useCourseContext={useCourseContext}
						key={video.id}
						moduleLength={module.videos.length}
						modulename={module.name}
						moduleId={module.id}
						video={video}
						update={true}
					/>)}
				</div>
			))}
		</div>
	);
}