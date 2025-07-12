import Video from "@/components/Videoplayer";

export default function Videoplayer({src}:{src: string}){
    return (
        <div className="w-full">
            <Video src={src} disabled={true}/>
        </div>
    )
}
