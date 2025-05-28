type DataType =
	| {
			course: number | null;
			created_at: string;
			description: string | null;
			id: number;
			lesson: number | null;
			module: string | null;
			teacher: string | null;
			thumbnail: string | null;
			title: string | null;
			url: string | null;
	  }[]
	| null;

export type VideoType = {
	id: string;
	title: string;
	description: string;
	url: string;
	thumbnail: string;
	createdAt: string;
};

type Module = {
	id: string;
	name: string;
	videos: VideoType[];
};

export function formatting(data: DataType) {
	const blocks: Module[] = data
		? data.reduce((acc: Module[], item) => {
				const blockId = item.module ?? "unknown";
				let block = acc.find((mod) => mod.id === blockId);

				if (!block) {
					block = {
						id: blockId,
						name: blockId, // Assuming block name is the same as block id
						videos: [],
					};
					acc.push(block);
				}

				const video: VideoType = {
					id: item.id.toString(),
					title: item.title ?? "Untitled",
					description: item.description ?? "",
					url: item.url ?? "",
					thumbnail: item.thumbnail ?? "",
					createdAt: item.created_at,
				};

				block.videos.push(video);
				return acc;
		  }, [])
		: [];
    return blocks;
}
