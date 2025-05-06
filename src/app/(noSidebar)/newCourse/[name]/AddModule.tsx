"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCourseContext } from "./Context";
import { useState } from "react";

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

	return (
		<div className="m-3 grid grid-cols-3 gap-2">
			<Input
				className="col-span-2"
				value={module}
				onChange={(e) => setModule(e.target.value)}
				onKeyDown={(e) => {
					if (e.key == "Enter") {
						addModule();
					}
				}}
			/>
			<Button onClick={addModule}>Add Module</Button>
		</div>
	);
}
