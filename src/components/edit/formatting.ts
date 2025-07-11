type Video = {
  id: string;
  title: string;
  description: string;
  url:string;
  thumbnail:string;
  lesson: number;
  existing:boolean;
};

type Module = {
  id: string;
  name: string;
  videos: Video[];
};

type DataType = {
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
}[] | null

export default function formatter(data:DataType) {
    //formatting the videos
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

                const video: Video = {
                    id: item.id.toString(),
                    title: item.title ?? "Untitled",
                    description: item.description ?? "",
                    url: item.url ?? "",
                    thumbnail: item.thumbnail ?? "",
                    lesson:item.lesson??0,
                    existing:true,
                };

                block.videos.push(video);
                return acc;
          }, [])
        : [];
    return blocks;
}
