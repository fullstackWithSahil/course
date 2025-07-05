"use client";

import AddLesson from "@/components/oldedit/Addlesson";
import { useCourseContext } from "./Context";

export default function Editor() {
	const { state } = useCourseContext();
	console.log(state);
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
						useCourseContext={useCourseContext as any}
						// exisiting={false}
					/>
					{module.videos.map((video)=><AddLesson
						useCourseContext={useCourseContext as any}
						key={video.id}
						moduleLength={module.videos.length}
						modulename={module.name}
						moduleId={module.id}
						video={video}
						update={true}
						// exisiting={video.existing}
					/>)}
				</div>
			))}
		</div>
	);
}