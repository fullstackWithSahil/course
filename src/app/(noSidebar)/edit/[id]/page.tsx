import VideoStorageProvider from "./VideoStorage";
import Main from "./Main";
import ContextWrapper from "./Context";

export default function Page() {
	return (
		<VideoStorageProvider>
			<ContextWrapper>
				<Main />
			</ContextWrapper>
		</VideoStorageProvider>
	);
}
