"use client";
import ContextWrapper from "./Context";
import Main from "./Main";
import VideoStorageProvider from "./VideoStorage";

export default function page() {
	return (
        <VideoStorageProvider>
            <ContextWrapper>
                <Main/>
            </ContextWrapper>
        </VideoStorageProvider>
	);
}
