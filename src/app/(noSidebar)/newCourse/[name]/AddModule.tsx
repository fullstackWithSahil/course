"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCourseContext } from "./Context";
import { useState } from "react";
import { toast } from "sonner";

export default function AddModule() {
	const [module, setModule] = useState("");
	const { dispatch, state } = useCourseContext();

	function addModule() {
		dispatch({
			type: "ADD_MODULE",
			payload: { id: String(state.length), name: module },
		});
		setModule("");
	}

	async function uplodeCourse(){
		try {
			console.log(state);
		} catch (error) {
			toast.error("there was an error uploding the course")
		}
	}

	return (
		<div className="m-3 grid grid-cols-3 gap-2">
			<Input
				className="col-span-2 mx-4"
				value={module}
				onChange={(e) => setModule(e.target.value)}
				onKeyDown={(e) => {
					if (e.key == "Enter") {
						addModule();
					}
				}}
			/>
			<Button onClick={addModule} className="mx-4">Add Module</Button>
			<Button onClick={uplodeCourse} className="col-span-3 mx-4">
				Uplode course
			</Button>
		</div>
	);
}
